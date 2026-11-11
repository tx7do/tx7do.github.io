---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - AI Agent
  - pgvector
  - RAG
sticky: 10
---

# GoWind Admin 拆解：AI 能力层——工具循环、pgvector 知识库与机器凭证

> 本文回答一个问题：**Agent 编排引擎之下、大模型之上，还横着一批「看不见的能力件」——工具怎么循环调用、知识怎么被检索、token 怎么被计量、Agent 怎么安全地对外开放？这层基础设施的工程决策长什么样？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 的 AI Agent 模块，画布和引擎已经拆过两篇了。但引擎只是「编排」——真正让 Agent 能干活的，是引擎下面这一层：**工具调用循环**（function calling 多轮协议）、**知识库 RAG**（pgvector 向量检索）、**用量计量与配额**（AI_TOKENS 五个闸口）、**AK/SK 机器凭证**（对外开放的鉴权面）。这篇把这几块基础设施一次拆完。

---

## 一、工具调用循环：四轮封顶的 function calling

Agent 能「自己动手」的核心是 function calling 多轮循环。`aiToolLoop.run`（`ai_tools.go`）的核心结构有一个反直觉的设计——**最后一轮不带 tools**：

```go
for round := 0; round < r.maxRounds; round++ {
    lastRound := round == r.maxRounds-1
    req := openai.ChatCompletionRequest{ ... }
    // 最后一轮不带 tools：强制模型给文本答案，不允许无限工具循环。
    if !lastRound { req.Tools = r.tools }
    stream, err := r.client.CreateChatCompletionStream(ctx, req)
```

`aiToolMaxRounds = 4`，而第四轮的请求里没有工具定义——模型此刻想调工具都没得调，**必须收束成文本答案**。这比「检测到循环就报错」优雅得多：用户永远拿到一个回答，只是这个回答可能带着「工具额度用尽」的暗示。循环总数封顶同时兜住了 prompt 注入导致的工具滥用（「请连续调用 100 次搜索」这种指令在第四轮自然失效）。

循环体里还有一个容易忽略的细节——**工具执行错误回传给模型自纠**：

```go
result, execErr := r.exec(ctx, tc.Function.Name, tc.Function.Arguments)
if execErr != nil {
    result = fmt.Sprintf("tool error: %v", execErr)  // 错误回传模型自纠
}
messages = append(messages, openai.ChatCompletionMessage{
    Role: openai.ChatMessageRoleTool, Content: result, ToolCallID: tc.ID})
```

工具报错不中断对话，而是作为 tool 结果喂回模型——下一轮模型会换参数重试或换工具。**错误是模型的输入，不是用户的输出**。

与流式 SSE 的共存靠**帧分流**：内容增量走 `AIChatChunk` 帧，工具调用走独立的 `AIChatTool` 事件帧（工具名/参数/结果可视化）。只有最终答案轮的文本推给前端，工具轮的中间文本不推——用户看到的是「正在调用工具 xxx」的进度，而不是模型内部的碎碎念。用量跨轮累加，四轮合计落一条流水。

---

## 二、工具市场：脚本自注册的 Registry

工具从哪来？两条路：

**内置工具**——目前只有一个 `get_current_time`，注释毫不遮掩：「协议层最小闭环，后续可挂知识库检索/问数等」。内置工具走 `execAiTool` 的 switch 分支。

**脚本工具（工具市场）**——Lua/JS 脚本经 `tool.register` 自注册进全局 Registry（`backend/pkg/scripting/api/tool.go`），声明参数的 required/optional 与 `timeout_secs ≤ 300`，运行时经脚本引擎按引擎锁执行。**用脚本系统当工具市场**是个聪明的复用：注册、沙箱、审计、超时这些能力脚本系统全都有了，工具层只是把脚本暴露成 function calling 的 schema。

Agent 的 llm 节点运行时全量装配工具集（`ai_agent_service.go`）：

```go
// 工具清单 = 内置 + 脚本工具（工具市场：脚本经 tool.register 注册的 LLM 工具）；
// exec 按工具名路由：脚本工具走脚本引擎（hasScriptTool 优先），内置走 execAiTool。
tools := aiBuiltinToolDefs()
tools = append(tools, aiScriptToolDefs(s.scriptRuntime)...)
```

画布上不逐节点配工具——节点只配 providerId/model/temperature/prompt，工具集全量注入。这个取舍在工具数量小的现阶段是对的：逐节点配工具的 UI 复杂度，要等工具市场繁荣起来才值得付。

---

## 三、知识库域模型：向量列为什么不在 ent schema 里

知识库三张表：`sys_ai_knowledge_bases`（库）→ `sys_ai_docs`（文档）→ `sys_ai_chunks`(切片）。前两张是普通 ent schema，第三张有个显眼的缺口——**embedding 向量列不在 ent schema 里**：

```go
// AiChunk 知识库切片：embedding 向量列不进 ent schema——ent 对 pgvector 自定义
// 列类型支持受限，该列由启动期手写 SQL 补建（CREATE EXTENSION vector +
// data.EnsureVectorColumnDim 定维补建 vector(1536)），读写走原生 SQL。
```

这是对 ORM 边界的诚实处理：pgvector 的自定义列类型 ent 支持受限，与其绕（JSON 存向量再转——性能不可接受）或硬 hack（自定义 ent 类型——维护成本高），不如**向量读写走原生 SQL、元数据走 ent**，边界画在两种访问模式天然的分界处。

**1536 维是钉死的**：`AiEmbeddingDimensions = 1536`，注释写明与默认 embedding 模型 `text-embedding-3-small` 一致。定维校验的失败策略是 DROP+重建：

> 混维向量会让 `<=>` 比较在查询期整体报错，宁可写入期 fail-fast。

维度不匹配的列直接删了重建——听起来激进，但换 embedding 模型本来就要全量重索引（旧向量对新模型无意义），fail-fast 只是把必然发生的重建提前到了启动期。

---

## 四、HNSW 自动门槛：越万行才建索引

pgvector 的索引策略不是「建了就好」——小表上 HNSW 反而浪费。admin 的方案是**行数门槛自动建**（`ai_vector_migrate.go`）：

```go
// HnswIndexRowThreshold = 10000（注释含实测基线：无过滤 ANN 41.5ms→1.0ms 约 40×）
func EnsureHnswIndexIfLarge(ctx context.Context, db *sql.DB, table string, rowCount int64) (created bool, err error) {
    if rowCount < HnswIndexRowThreshold { return false, nil }
    // pg_indexes 查重，幂等 no-op
    // CREATE INDEX ... USING hnsw (embedding vector_cosine_ops)
}
```

一万行的实测基线（41.5ms → 1.0ms，40 倍）直接写进了常量注释。越线时还 WARN 提示近似召回与写入约 3× 的代价、建议向量负载隔离部署。配套把 `hnsw.iterative_scan = 'relaxed_order'` 设为库级默认。

一个克制的细节：这个迁移**只接 `sys_ai_chunks`**——菜单表的向量列（全局语义搜索用）有界（菜单数量天然有限），不值得接自动门槛。**基础设施的自动化也要看表的性格**，不是所有向量列都要同一套待遇。

---

## 五、入库链路：切片、批量与计量的唯一咽喉

文档入库的完整链路（`ingestDoc`）里有四个数字值得记：

- **切片规格**：500 字符/片、50 重叠——重叠防语义在切片边界被截断；
- **数量上限 4000 片**：注释里有一条惊悚的实测——「10MB 文本曾 2.3 万片、单文档可打出百万级 token」。没有上限，一次手滑上传就是一次配额灾难；
- **embedding 批次 32**：分批调 provider，既不超请求限制又吃满批量价；
- **入库批量 100 行/语句**：`InsertChunks` 单事务分批多行 INSERT（`:vector` cast 占位参数化），任一片失败全批回滚。

**计量走唯一咽喉**：所有 embedding 调用收敛在 `embedTextsForBase`，provider 返回的 token 数与耗时落 `sys_ai_usage_logs`（记量失败不阻断主流程）。embedding 用量与 chat 用量共表，靠 `conversation_id=0` 与 model_name 区分场景。**把计量收在咽喉处，是「用量对得上账」的唯一办法**——散在各调用点，漏一处账就永远对不上。

---

## 六、语义搜索的权限前置：宁可不返回，不泄露

知识库是租户内的，但**租户内的知识还要按菜单权限裁剪**——这是企业搜索和普通 RAG 最大的差异点。实现（`ai_content_service.go`）把权限翻译放在了检索的最前面：

```go
// 链路与 GetNavigation 同源（用户→角色→权限→菜单）；
// 菜单授权绑定存全路径快照：先取路径，再反解回当前菜单 id
paths, err := s.roleRepo.GetRolesPermissionMenuFullPaths(ctx, user.GetRoleIds())
return s.menuRepo.ResolveMenuIDsByFullPaths(ctx, paths)
```

三条纪律：

1. **权限过滤在 embedding 之前**——无可见菜单直接空返回，**省一次向量调用**；权限不通过的内容连「被检索到」的机会都没有，而不是检索出来再过滤；
2. **解析失败 fail-closed**——菜单 ID 解析出错返回错误而不是跳过过滤，注释原话「宁可不返回不泄露」；
3. **过滤在 SQL 内完成**——租户用户的检索走动态 IN 占位参数化 SQL，权限裁剪与向量检索同一条语句，没有「先检索后内存过滤」的泄露窗口。

没有独立的 rerank 重排层（纯距离排序）——当前规模下诚实够用，rerank 是等检索质量真成为瓶颈时再加的东西。

---

## 七、Agent 的 knowledge 节点：RAG 即节点

知识库能力接进 Agent 引擎的方式极简——knowledge 节点的执行只有几行（`ai_agent_engine.go`）：

```go
case "knowledge":
    query, rerr := renderAgentTemplate(agentDataString(node.Data, "query"), vars)
    contextText, hits, kerr := deps.searchKnowledge(ctx, node, query)
    oc.outputs = map[string]string{"context": contextText, "hits": strconv.Itoa(hits)}
```

引擎只依赖注入的 `deps.searchKnowledge`；真实现取画布节点的 `baseId` + `topK`（默认 4），**复用 chat 同一条检索链路**（embed + 余弦检索 + 用量记账），命中片段拼接为 `context` 输出，下游 LLM 节点经 `{{nodeID.context}}` 占位符把它渲染进 prompt。RAG 对图引擎来说只是又一个产出字符串的节点——**检索是节点，生成是节点，编排把两者连起来**，这就是引擎抽象的红利。

---

## 八、AI_TOKENS 配额：一个口径，五个闸口

token 配额的口径出奇地简单：**当月累计 ≥ 套餐上限即拒**。链路是「租户 → 套餐 → Quotas 里找 `QuotaTypeAiTokens`」，未配置不限、平台用户（tenant 0）不限——默认开放，配额是 opt-in 的运营约束。

值得看的是闸口的分布——**五个闸口**，覆盖了所有消耗 token 的入口：

| 闸口 | 位置 |
|------|------|
| chat | 对话入口 |
| Agent Run | 图执行入口 |
| 文档入库 | ingestDoc 配额闸 |
| 智能问数 | NL2SQL 入口 |
| AI 生成打印模板 | print-template generate |

漏一个闸口，那个入口就是免费通道。**配额的完整性 = 闸口清单的完整性**——每加一个消耗 token 的新功能，闸口清单就要加一行，这件事应该进 code review 的 checklist。

---

## 九、AK/SK：机器凭证的完整规格

Agent 对外开放（以及定时任务、服务间调用）的鉴权面是一套完整的机器凭证体系（`access_key_service.go`）：

**凭证规格**：AK = `ak-` + 16 hex，SK = `sk-` + 64 hex（32 字节）——SK 只在创建/轮换的响应里出现一次，**库里只存 SHA-256 摘要**，不存明文也不存可逆加密。

**令牌交换**是整个设计最妙的一点——`IssueToken` 端点注释：

```go
// 免鉴权端点——本身即是认证
```

`/admin/v1/access-keys/token` 不走常规鉴权中间件，因为「用 AK/SK 换令牌」这个动作本身就是认证。这条免鉴权端点的防御也一个不少：按 IP+AK 复用登录限流器、SK 比对用 `subtle.ConstantTimeCompare` 恒时比较（防时序侧信道）、**「AK 不存在」与「SK 错误」返回同一错误**（不帮攻击者枚举有效 AK）。

**机器令牌**：HS256、默认 900 秒、无 refresh token、不进在线会话表、必须进 Redis 缓存（否则 auth 校验器判已吊销）。签出的身份是 `payload{UserId: 0, Username: "ak:"+AK, Roles: ["machine"]}`——与 admin 定时任务桥的机器身份同一形态，**机器身份在全生态是同一个语义**。

**锁定与轮换**：错误 SK 连续 5 次锁 15 分钟（`login_rate_limiter.go`：`loginFailThreshold = 5`、`loginLockoutDuration = 15 * time.Minute`，计数用原子 Lua 脚本，与人类登录限流共用一套限流器）；`ResetSecret` 重写摘要后**旧 SK 的交换被立即阻断**——注释同时诚实地标注了边界：「但此前已签发的机器令牌在过期前仍有效」。要即时吊销已签发令牌，得清 Redis 缓存——这个「半程失效」的边界写进注释，比假装全失效诚实得多。

机器令牌签出后走的就是通用 Bearer 链路：authz 对无角色机器身份放行、casbin 下 fail-closed、租户隔离与 API 表闸门照常生效——**AI 对外开放没有另起炉灶的鉴权体系，是既有权限面之上的一个新身份类型**。

---

## 十、护栏与提供商：诚实的命名与两个坑

**「AI 护栏」的实际内容**（P3 安全加固批次）与想象的不同——它不是内容安全或 prompt 注入防护，而是**超时与规模钳制**，三处都是一两行的硬上限：

```go
// embeddings 调用 2 分钟 deadline（ai_knowledge_service.go）——此前继承请求 ctx，
// Agent/重索引等无 deadline 场景下 provider 挂起会永久占用 goroutine
callCtx, cancel := context.WithTimeout(ctx, 2*time.Minute)

// Agent 画布 5 分钟 deadline（ai_agent_service.go）
context.WithTimeout(ctx, 5*time.Minute)

// 检索 topK 钳制 ≤50（ai_knowledge_repo.go）——pgvector 全表距离排序
// + 大结果集物化的资源面
```

**调用外部 AI 服务的资源护栏，第一优先级是时间与规模的上限，不是语义审查**——这个命名选择本身就在传递优先级。

**提供商管理**的两个坑都有普适性：

1. **API Key 加密落库**（AES-GCM，`enc:` 前缀标识）+ 掩码提示（`sk-***abcd`），更新语义「key 为空 = 不改 key」并从掩码摘除防「显式清空」误写——表单里的掩码字段天然有「提交掩码值覆盖真值」的坑；
2. **流式客户端必须显式注入无超时的 `http.Client`**——上游 SDK 默认 30 秒 Timeout 会把流式长回复腰斩，单轮时长改由调用方 ctx deadline 控制（chat 为 5 分钟）。这是所有流式 LLM 客户端都会撞的坑。

---

## 十一、收尾

把这一层的能力清单横过来看，模式高度一致：

| 能力件 | 核心决策 | 失败模式 |
|--------|---------|---------|
| 工具循环 | 四轮封顶 + 末轮无工具强制收束 | 错误回传模型自纠 |
| 工具市场 | 脚本系统复用为 Registry | 沙箱/审计/超时继承 |
| 向量存储 | 向量走原生 SQL、元数据走 ent | 混维写入期 fail-fast |
| 索引策略 | 万行门槛自动建 HNSW | 幂等 + 代价 WARN |
| 权限 RAG | 权限过滤在 embedding 之前 | 解析失败 fail-closed |
| 配额 | 一条口径五个闸口 | 未配置默认开放 |
| AK/SK | 端点即认证 + 摘要落库 | 恒时比较 + 不区分不存在 |
| 护栏 | 超时与规模钳制 | deadline 兜住 provider 挂起 |

引擎篇讲的是「怎么编排」，这篇讲的是「编排之下怎么站得住」。两层合起来——编排引擎（图）+ 能力层（本文）——才是企业 AI Agent 的完整拼图。

仓库（本文所有代码路径均可逐行核对）：

- GitHub：[github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- Gitee：[gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)
