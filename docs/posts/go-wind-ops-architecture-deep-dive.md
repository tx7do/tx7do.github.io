---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
  - MQTT
  - 运维平台
sticky: 10
---

# GoWind Ops 深度拆解：纯出站 Agent + MQTT 信令，把「管机器、跑项目、发脚本、构建分发」做扎实

> 本文回答一个问题：**当你点下「分发到 20 台机器」，从浏览器到目标机磁盘落定，中间经过了哪些服务、哪些协议、哪些状态机与哪些防呆设计？**

[GoWind Ops](https://github.com/tx7do/go-wind-ops) 是一个多节点运维平台，Go 后端（Kratos 微服务 + Ent + PostgreSQL/Redis/MinIO）+ React 19 管理台。它不做大而全的 K8s 替代品，聚焦四件事：**管机器、跑项目、发脚本、构建分发**，组织权限、审计日志、数据字典作为系统底座内置。

架构上它有两个关键选择：

- **Agent 纯出站接入**——被管机器上只跑一个 agent，只有一条到 EMQX 的 MQTT 出站连接，**没有任何入站端口**。防火墙后面、NAT 里、云安全组只给出站的机器，都能管。
- **大文件不过信令**——所有文件传输走 MinIO 预签名 URL 直传直拉，信令通道里只飞 JSON 指令与回执。31MB 的 agent 二进制自升级、GB 级产物分发，走的都是同一条路。

这两条主线决定了整个系统的形态。下面按链路逐环拆。

---

## 一、全貌：四服务架构

```
React Admin ──REST──▶ admin BFF (:18600) ──gRPC──┐
                                                 ▼
                                              core (:18700 前台 BFF 同构)
                                                 │
                                    ┌────────────┼──────────────┐
                                    ▼            ▼              ▼
                              PostgreSQL     Redis/Asynq     MinIO
                                    │
                              MQTT 控制端 ──── EMQX ◀──出站 MQTT──── agent（每台受管机器）
```

| 服务 | 职责 | 一句话定位 |
|------|------|-----------|
| **core** | 领域资源层 | Ent schema、仓储、全部业务逻辑、MQTT 控制端、Asynq worker。**唯一连库的进程** |
| **admin / front** | BFF 网关 | REST 进、gRPC 出，参数校验后转发 core。**不连库**，改前端需求不动它们 |
| **agent** | 边缘代理 | 纯 MQTT 出站。**无库、无服务发现、无 REST**，跑在每台受管机器上 |

职责单向分层：BFF → core → MQTT → agent，请求永远不逆向。所有指令落台账、所有回执对账，都在 core 收口。

三个 Go 服务的依赖装配是**手写的 wiring.go**，没有 wire/dig——基础层 → data → service → server 严格单向，漏接由编译器报错。这不是复古，而是让每个服务的依赖图打开文件就能一眼看全，配合 `make register ENTITY=xxx` 脚手架做锚点注入，样板成本也压住了。

---

## 二、MQTT 信令体系：整套平台的地基

### 2.1 Topic 命名：常量收口，禁止裸拼

所有主题收敛在 `backend/pkg/topic/mqtt.go`，统一 `ops/` 前缀 + 模板常量 + 工厂函数：

```
ops/agent/{agentId}/auth/{request|response}      准入
ops/agent/{agentId}/heartbeat | /metrics         心跳
ops/agent/{agentId}/command | /command/result    指令与回执
ops/agent/{agentId}/terminal/{sessionId}/{input|output|resize}   终端字节流
ops/agent/{agentId}/file/{request|response|complete}             传输信令
```

仓库 AGENTS.md 明文**禁止裸拼主题字符串**，载荷结构全部收敛在 `backend/pkg/signal/signal.go`（`CommandEnvelope` / `CommandResult` / 各业务 Payload），JSON 编解码 + QoS 1。信令协议想升级，改两个文件就够。

### 2.2 纯出站：为什么没有入站端口

传统运维工具（Ansible 走 SSH、很多平台走 HTTP 回调 agent）都要求**平台能主动连到机器**，这在有防火墙/安全组的环境里意味着要么开洞、要么装跳板。

GoWind Ops 反过来：agent 启动后主动连 EMQX，之后所有指令都从这条连接进来。`backend/app/agent/service/internal/server/mqtt_server.go` 里 agent 以**自身身份**连 broker——`username=agentId`、`password=本机 auth.token`，没有静态共享账密。断线重连后自动重发准入并恢复全部订阅，受管机器断网恢复后**无需人工干预**。

这个选择的代价是平台侧要解决「多副本」与「可靠性」问题，解法就是下面两节。

### 2.3 `$share` 共享订阅做多副本负载均衡——以及一个刻意的例外

core 可以水平扩多副本，但普通通配订阅是**广播语义**：每条心跳每个副本都会收到。解法是 MQTT 5 的共享订阅（`backend/pkg/topic/mqtt.go`）：

```go
const MqttShareGroupCore = "gwo"
func SharedSubscription(group, filter string) string {
    return "$share/" + group + "/" + filter
}
```

core 的准入、心跳、指令回执三条上行全部包上 `$share/gwo/...`，每条消息只投递给组内一个实例，broker 天然做了负载均衡。

但**终端输出流故意不走 `$share`**——这是整个信令设计里最值得玩味的一处。注释写得很直白：「终端流是连接级点对点，多副本组内分流会丢流」。终端输出走 `ops/agent/+/terminal/+/output` 全量广播，每个副本都收，只有**持有对应 gRPC 流的那个副本**按内存路由表消费，其余副本直接丢弃。用一点带宽冗余换流的完整性，取舍清清楚楚。

与 `$share` 配套的还有 ACL 的「剥壳」处理：`mqtt_auth_server.go` 的 `authorizeMqttTopic` 对 `$share/<group>/<filter>` 先剥掉前两层再按真实过滤器判定，否则共享订阅过滤器永远过不了 agent 前缀 ACL——这是接 MQTT ACL 时最容易踩的暗坑。

### 2.4 QoS 1 + request_id：幂等对账的三板斧

QoS 1 只保证「至少一次」，意味着重复投递是常态。GoWind Ops 的做法是把幂等做进业务层，三板斧：

**第一斧：先落台账，再发布。** 下发侧 `agent_service.go` 的 `publish()` 顺序是刚性的：

1. 生成 UUID `requestId` 作为幂等键，组装 `CommandEnvelope`；
2. **先**往 `ops_command_records` 落一条 PENDING 台账；
3. 同步指令注册等待通道；
4. 最后才 `Publish` 到 MQTT。

发布失败**即时定案 FAILED** 并清 waiter——台账里永远不会残留「发了但没记」的指令。

**第二斧：PENDING-only 条件更新。** 回执定案走仓储层的条件更新（`command_record_repo.go`）：

```go
Update().Where(RequestIDEQ(requestID), StatusEQ(StatusPending)).SetStatus(terminal)
```

只有 PENDING 行能被终态化。重复回执、手工注入、超时扫描与真实回执竞态——全部 first-write-wins，`n==0` 静默返回。**这一个条件更新是全系统幂等的基石**：分发记录、脚本批次、备份记录的超时对账全都复用同一模式。

**第三斧：30 秒对账循环。** 常驻扫描把超时 PENDING 定案 FAILED（普通指令 10 分钟、备份 30 分钟），分发与脚本批次条目逐条对账计数，顺带清理 7 天前的节点指标。**迟到的回执不会丢**——同步等待超时后，回执仍由台账/分发对账链路消费。

每条指令的执行结果、退出码、时长、失败原因全部可追溯，这就是 README 说的「指令全程审计」的落地。

信令通道的关键参数一并列表（`agent_service.go` 常量区）：

| 参数 | 值 | 说明 |
|------|-----|------|
| `commandTimeout` | 10 分钟 | 普通指令超时定案 FAILED |
| `backupCommandTimeout` | 30 分钟 | 备份类指令（耗时长，单独阈值） |
| `offlineAfter` | 90 秒 | 3 个心跳周期无心跳判离线 |
| 心跳周期 | 30 秒 | 上报 CPU/内存/磁盘/uptime 快照 |

指令载荷是统一的信封结构（`pkg/signal/signal.go`）：

```json
{
  "requestId": "b3c8e2f0-7d1a-4c3e-9f2a-1b6d5e8a9c01",
  "action": "script_exec",
  "payload": { "script_id": 12, "timeout": 60 }
}
```

`action` 到 handler 的分发在 agent 侧是一张注册表（`RegisterHandler(action, fn)`），插件指令也走同一张表——新增一种指令类型，信封协议不动。

### 2.5 EMQX broker 级认证与 ACL

core 起一个最小 HTTP 服务（:9500），实现 EMQX 5.x 的认证/授权回调：

- `POST /api/v1/mqtt/auth`：`username=core` 时与配置账密做**常时比较**（`subtle.ConstantTimeCompare`，注释明确写了防计时侧信道）；agent 则 `SHA-256(password)` 与 `ops_agent_nodes.token_hash` 比对，首次出现按 TOFU 注册（与信令层准入同表同 token）。
- `POST /api/v1/mqtt/acl`：纯函数判定——core 放行 `ops/` 全部；**agent 只能读写 `ops/agent/{自己}/#`**；其余（含 `$SYS`、跨 agent 主题、空用户）一律 deny。EMQX 侧再配 `NO_MATCH=deny`，默认拒绝。

broker 连接鉴权这一层不依赖任何业务代码在线，就算 core 全挂，agent 也连不进别人的主题。

---

## 三、Agent 准入：TOFU + 机器指纹 + 30s 心跳

- **token 生成**（`agent/service.go`）：首启 `crypto/rand` 读 32 字节 hex 落盘 `auth.token`（0600）。core 只存 SHA-256 哈希。被拒绝后 agent **保留进程但不重新生成 token**——自动重生会污染准入记录。
- **TOFU 注册**：首连注册（Trust On First Use），未认证前**每 5 秒重试、最多 12 次**。注释点破了竞态：「agent 先于 core 连上 broker，首条 auth 请求会被丢弃」——重试不只是等审批，更是等对端就绪。
- **机器指纹**：`machine.MachineID()` 用 go-utils 的 `UnifyMachineID()`（机器 GUID/序列号归一化 32 位 hex），失败回退 hostname。它同时是 agentId 与 MQTT clientID。
- **心跳**：30 秒一次，载荷带 CPU / 内存 / 磁盘 / uptime 快照（gopsutil）。core 侧心跳处理只刷在线状态，指标历史**异步入库**不阻塞心跳链路；90 秒（3 个周期）无心跳即翻转 offline 并触发告警——离线判定用条件更新防翻转竞态。

机器准入后，平台上能看到改名/标签/环境标记（default/dev/staging/prod）、CPU/内存/磁盘趋势图，节点失联、恢复都自动出告警。

---

## 四、Web 终端：从浏览器到 ConPTY 的五层桥

这是全项目工程密度最高的一个功能。完整链路：

```
xterm.js ──WebSocket──▶ admin BFF（一次性票据） ──gRPC bidi──▶ core（路由表） ──MQTT──▶ agent（真 PTY）
```

### 4.1 握手：30 秒一次性票据

浏览器 WebSocket API **无法携带 Authorization 头**，长效 token 放查询参数会落进代理与访问日志。解法是先 `POST /admin/v1/ws/terminal/tickets` 换一张 32 字节随机票据（Redis TTL 30 秒），WS 握手时 `GETDEL` **原子消费**——防重放，一张票只能用一次，且与 agentId 绑定、校验同源。

### 4.2 线路协议与多副本路由

WS 帧协议：**二进制帧 = 终端字节流，文本帧 = 控制事件 JSON**（`OPENED` / `CLOSED` / `RESIZE`）。流式 RPC 不走 kratos unary 中间件链，操作者身份直接塞出站元数据透传 core。

core 侧维护 `terminalRoutes map[agentId/sessionId]chan` 路由表。这里有一个注释在代码里的竞态：**必须先注册路由、再发 terminal_open**——「shell 启动横幅早于 open 回执到达，后注册会把首批输出当无路由丢帧，前端将永远停在『正在连接』」。输出通道满即丢帧（终端回显可容忍背压丢弃），单帧上限 64KB。

### 4.3 agent 侧：真 PTY 与 Windows Ctrl+C 亡命坑

agent 用 go-pty 起**真伪终端**——Windows 是 ConPTY，Unix 是内核 pty。回显、行编辑、Ctrl+C、vim/htop 这类交互式程序全部原生可用。单机 5 会话上限，每分钟 GC 掉 15 分钟无输入的空闲会话（杀进程树）。

`terminal_ctrl_windows.go` 的文件头注释值得单独引用——**ConPTY 的 VT 输入流不会把 0x03 翻译成控制台事件**，想让前端 Ctrl+C 中断 cmd.exe 里的前台进程，必须：

```
FreeConsole → AttachConsole(targetPid) → GenerateConsoleCtrlEvent(0, 0)
```

且有两个实测暗坑：① `SetConsoleCtrlHandler(NULL, TRUE)` 的「忽略 CTRL_C」标志会被 `CreateProcess` **遗传**给子进程，起 cmd 前必须显式清除（否则目标进程对 Ctrl+C 免疫）；② 投递事件会波及 agent 自身，投完要立即把免疫设回来。进程级状态用互斥锁串行化。这类坑不踩过真机根本写不出来。

### 4.4 全量审计与字节级回放

会话的**输入输出双向录制**（不只是输出）：分块带原子自增 Seq、方向、base64 载荷、字节数；800ms 批量刷库，单会话队列满即丢、录制总量 8MB 封顶置 truncated——「录制永远不影响终端」。敏感治理给了三档开关（`TERMINAL_RECORD_ENABLED/INPUT/OUTPUT`，注释直说终端录制含键盘明文可能带密码），默认留存 30 天，每小时批量过期清理。

回放是只读 xterm 按 Seq 顺序重放 OUTPUT 分块，ANSI 转义序列原样重现——**字节级保真**，不是文本快照。

前端还有细节：断线自动重连最多 3 次、1200ms×n 递增退避，连上后用 ANSI 序列把「正在连接」行原位替换成绿色就绪——打磨到像素级。

---

## 五、文件传输：大文件不过信令

### 5.1 预签名直传直拉

拉取一个大文件的完整流程（`file_service.go`）：

1. core 生成对象键 `agent-files/{agentId}/{uuid}{ext}`，签发 **15 分钟预签名 PUT**；
2. `file_pull` 同步指令下发，agent 校验授权目录后 `UploadFileToPresignedURL` 直传 MinIO；
3. 回执带 `{size, sha256}`；
4. core 再签预签名 GET 给浏览器下载。

**文件内容全程不经 MQTT、也不经 core 内存。** 推送方向同理：`PrepareAgentFilePush` 只签发「浏览器直传」的 PUT，浏览器把文件 PUT 进 MinIO 一次；`CompleteAgentFilePush` 校验 objectKey 必须在 `agent-files/` 前缀下（防越权读任意对象）后，`file_push` 指令让 agent 下载落盘。

**批量上传多台机器**时，同一对象被多个 agent 各自 GET——文件只上传一次，省 N-1 倍上传带宽。

### 5.2 流式与对账

`pkg/filetransfer/presigned.go` 全程流式：上传用 `io.TeeReader(f, hasher)` 边传边算 SHA-256，下载用 `io.Copy(io.MultiWriter(f, hasher))` 边落盘边算哈希，摘要随回执返回供前端比对。这里有两个注释级的坑：TeeReader 包装后 http 层探测不到长度会走 chunked 编码，而 **S3 对 PUT 要求 Content-Length（否则 411）**，必须显式 `req.ContentLength`；下载完要 `drainClose` 读完剩余 body 才能复用连接。

安全上有两道：`AGENT_DOWNLOAD_ALLOWED_HOSTS` 出口白名单是所有上传/下载的唯一出口（file_pull 可读白名单内文件，若 URL 可指向内网即成外带通道——这是白名单存在的原因）；agent 写入前 `ensureWritableTarget` 拒符号链接、父目录 `EvalSymlinks` 解析真实落点后**重过授权目录校验**（词法比对不解析链接，所以要二次验证）。

---

## 六、构建分发闭环：一个分布式状态机的完整样本

这是平台最核心的业务链路，也是最精巧的状态机设计。

### 6.1 构建：异步、去重、日志增量 tail

- 源仓库凭据 **AES-256-GCM 加密落库**（`enc:` 前缀判别密文，`DecryptIfNeeded` 向后兼容明文），克隆时解密注入 userinfo。本地盘符路径还有个坑：`D:/...` 直写 URL 会被 git 当成 **scp 语法的 host 名**，要转 `file:///`。
- `TriggerBuild` 先查未终态历史，存在即 409——**并发去重**；构建号原子自增；core 重启时构造函数把遗留 RUNNING/PENDING 定案 FAILED（`FinalizeInterrupted`）。
- 执行四步：`git clone --depth 1 --single-branch`（argv 直传不经 shell）→ 构建命令（默认 600s、上限 3600s，超时杀树）→ 产物 glob 收集（单文件 rename、多文件 zip 打包）→ 入 MinIO `artifacts` 桶 `builds/{buildId}/{buildNo}/{filename}`。
- **构建日志实时 tail**：执行期间 5 秒 ticker 定期刷新落库，前端按 `{offset → delta, newOffset, finished}` 协议增量拉取——不引入任何推送基础设施就做到「准实时看构建输出」，日志 512KB 截断落库。

### 6.2 分发：占位幂等键 + 多副本抢占 + 分批灰度

分发记录表的设计核心是**占位幂等键**：触发时按 `pending:{distId}:{batchNo}:{projectId}` 给**全部目标先建记录**（后批批次号 >1，批次视图完整可见），首批随后领取投递。多副本并发推进批次时，靠条件更新抢占：

```go
Update().Where(IDEQ(recordID), CommandRequestIDEQ(placeholder), StatusEQ(Pending)).
    SetCommandRequestID(requestID)   // 占位键 → 真实 UUID
```

条件更新恰好只有一方 `n>0`——获得投递权，天然防重复下发。

**分批灰度发布**是事件驱动的批次推进：每批 N 台，「回执终态」与「30 秒超时定案」两个事件都会触发 `AdvanceBatches`——有 in-flight 就等下次事件；本批有 FAILED 就把后续批次占位记录全部置 **SKIPPED**（只允许 PENDING+占位前缀的记录被跳过，幂等）；全部成功则重建执行上下文（**重签预签名 URL 防过期**、`{buildNo}` 重算）投下一批。

还有一条用教训换来的注释：失败回执**也要终态化**——曾因只处理 Success 分支导致失败记录永久停留 PENDING。

### 6.3 落盘侧：zip slip 与 Docker 部署

agent 解包 `extractZip` 四重检查：条目名反斜杠归一后 `path.Clean`；`..` 前缀拒；绝对路径拒；**`name[1]==':'` Windows 盘符条目单独拒**——注释点名：「`C:/x` 在非 Windows 平台的 `path.IsAbs` 检不出来」。单文件分发还要过 `filepath.Rel` 判定落点未逃逸项目目录（上游产物键名含 `..\` 时 Join 会折叠逃逸）。

DOCKER 部署类型三步 argv 直连：`docker pull`（10 分钟超时）→ `docker rm -f -v` 同名旧容器（**报错忽略保持幂等**）→ `docker run -d`。镜像 tag 支持 `{buildNo}` 占位符，core 侧替换——同一分发配置永远发布「最新成功构建」，tag 随构建号自动演进。

### 6.4 流水线：三类步骤编排

BUILD / SCRIPT / DISTRIBUTION 三类步骤有序编排，失败即中止、未执行步骤补 **SKIPPED** 标记；每步结果逐步 flush 到运行记录——**前端挂了也能看到已完成步骤**。执行 goroutine 用 detached context 脱离请求生命周期但**保留操作人**（审计归因不丢）。步骤等待是 3 秒轮询 + 分类型超时（构建 70 分钟 / 脚本 12 分钟 / 分发 20 分钟），日志同款 offset 增量协议。

---

## 七、脚本执行：防手滑，不防神仙

- 内容 ≤256KB（更大应走对象存储），经 MQTT 下发，agent 落临时文件按平台 shell 执行（Windows `.cmd` / Unix `.sh` 0700），输出/退出码/时长落台账。
- **危险命令门槛**：12 条灾难性正则（`rm -fr /`、`mkfs`、`dd of=/dev/sd*`、`format C:`、fork 炸弹……），命中未二次确认返回 403，前端按 reason 弹确认后带 `confirm_dangerous` 重发。定位写得很清醒：「**防手滑门槛而非安全边界**，误报的代价只是多一次确认点击」。真正的闸门是可开关的**操作审批**：敏感动作先建审批单（完整载荷落库），审批通过自动重放下发。
- **超时杀树的平台差异**是全项目最重要的工程坑之一：Windows 上 `exec.CommandContext` 超时只杀 cmd.exe 外壳，**孙进程继承输出管道导致管道 EOF 永不到来、调用方卡死**——所以改用 `time.AfterFunc` + `taskkill /F /T /PID`；Unix 用 `FindProcess(pid).Kill()`。另外 `cmd /c` 对引号有自有剥离规则，参数化程序必须走 argv 直传。
- 台账语义也值得记住：台账 SUCCESS/FAILED 只表示「回执是否成功」，**脚本业务成败看回执里的 exit_code**。

---

## 八、监控告警与 Agent 自升级

### 8.1 四类监控、防抖与恢复

统一由 30 秒一轮的 `CronScheduler` 驱动（分钟粒度 cron 命中判定 `schedule.Next(now-1min) <= now`，扫描不跨过也不重复触发点）：

| 类型 | 检测方式 |
|------|---------|
| 项目存活 | `project_status` 同步指令探测（10s 超时） |
| 节点阈值 | **直接读心跳快照**，不额外探测——CPU/内存/磁盘 vs 阈值 |
| 节点失联 | 挂在离线扫描上，90s 无心跳翻转时告警 |
| 进程守护 | `process_list` 指令按包含匹配，目标进程消失即异常 |

通用模式：**连续 N 周期防抖**（`ConsecutiveHits` 计数）、未恢复告警去重、重复告警间隔；条件恢复自动 `ResolveAllByMonitor` 并落 RECOVERY 记录；项目存活监控可开 `AutoRestart` 异常自动下发重启。职责边界也很干净：探测失败（节点离线/超时）**不产生项目告警**——那是节点失联告警的职责。

### 8.2 多渠道通知 + 投递台账

webhook 渠道原生支持**钉钉 / 飞书 / 企业微信**三种报文格式与钉钉 HMAC-SHA256 加签；邮件 465 隐式 TLS / 587 STARTTLS 双模。每一渠道逐条落**投递台账**（`SENT/FAILED` + 错误原因），目标 URL 脱敏存储——**钉钉加签 URL 不落库**（含密钥）。告警到底发出去没有、哪条失败，页面上查得到。

### 8.3 Agent 自升级：升级通道的完整校验链

升级通道即远端代码部署通道，这条链路的安全设计值得整段引用：

1. 浏览器预签名直传新二进制 → core 校验 objectKey 前缀 + **流式实测对象 SHA-256**（`io.Copy(h, obj)` 不落盘）作为期望摘要随指令下发；
2. agent 侧硬门槛：

```go
if p.ExpectedSha256 == "" {
    return nil, fmt.Errorf("upgrade payload missing expected_sha256, refusing unverified binary")
}
```

注释原话：「**不接受任何无校验放行的兼容路径**」。

3. 回执先发（3 秒余量），然后跑接力脚本原参重启。Windows 上「正在运行的 exe 不能覆盖自己」，bat 的解法每行都是干货：

```bat
ping -n 3 127.0.0.1 >nul   &  等当前进程退出
move /y "exe" "exe.old"    &  旧二进制改名腾位
copy /y "new" "exe"        &  新二进制落回原路径
start "" "exe" <原参数>     &  原参数重启
(goto) 2>nul & del "%~f0"  &  bat 自删除技巧
```

新版本确认以**重启后心跳上报的 version** 为准，不信回执自述。这条链路在真机上验证过 31MB 二进制全量升级。

### 8.4 顺手就有的治理件

cron 定时任务用 **CAS 锚点去重**（`Where(LastCronAtEQ(expected)).SetLastCronAt(now)`，多副本恰一方抢到触发权；还有个隐蔽坑：新建任务锚点为 NULL 时 CAS 永远匹配不上，首见先落锚）；配置中心按环境模板渲染 `{{node.*}}/{{project.*}}/{{date}}` 占位符下发并对账终态；云成本模块直连阿里/腾讯/华为/AWS 账单 API（连「阿里 BSS 域名是 `business.aliyuncs.com`，用错域名报 InvalidVersion」这种坑都写在注释里）；项目日志 WebSocket 实时 tail 中间层不做任何转码、前端 UTF-8 严格解码失败回落 **GBK**——Windows 控制台中文输出零乱码。

---

## 九、快速开始

```bash
# 1. 起依赖
cd backend
docker compose -f docker-compose.libs.yaml up -d   # PG/Redis/MinIO/etcd/EMQX/Jaeger

# 2. 起 core 与 agent
go build -o bin/core ./app/core/service/cmd/server  && ./bin/core  -c app/core/service/configs
go build -o bin/agent ./app/agent/service/cmd/server && ./bin/agent -c app/agent/service/configs

# 3. 起管理前端
cd frontend/admin && pnpm install && pnpm dev   # http://localhost:18999
```

agent 首启在工作目录生成 `auth.token` 并自动 TOFU 注册，平台审批通过即上线（受管机器跑项目前需配 `AGENT_ALLOWED_DIRS` 授权目录）。默认账号 `admin / admin`。

---

## 十、结语

GoWind Ops 的技术主张可以浓缩成三句话：

1. **信令可靠大于一切**——QoS 1 之上用 request_id + PENDING-only 条件更新 + 周期对账把「至少一次」补成「恰好一次的语义」；
2. **大文件不过信令**——MQTT 只飞控制面，数据面全部走 MinIO 预签名直传直拉 + SHA-256 对账；
3. **诚实的工程取舍**——终端流宁可广播冗余也不丢流、危险命令门槛自认「防手滑不防神仙」、录制满载宁可丢帧也不拖慢终端。

如果你在研究生产级 MQTT 信令架构、分布式状态机或 Windows 平台工程，仓库本身就是完整的样本（MQTT 多副本协调的并发窗口与修复过程另有一篇专题拆解，不在此重复）。

仓库（MIT，含 ROADMAP 与全部架构决策文档）：

- GitHub：[github.com/tx7do/go-wind-ops](https://github.com/tx7do/go-wind-ops)
- Gitee：[gitee.com/tx7do/go-wind-ops](https://gitee.com/tx7do/go-wind-ops)
