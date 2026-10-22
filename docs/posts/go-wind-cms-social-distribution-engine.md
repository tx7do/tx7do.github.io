---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - 分布式任务
  - CMS
sticky: 10
---

# GoWind CMS 拆解：社交分发引擎——10 平台适配器、状态闸门与自愈定时任务

> 本文回答一个问题：**"把这篇文章一键发到 10 个平台、明早 9 点准时发、失败自动重试、发布后还能回拉互动数据"——这句话拆成工程问题，一共有几层？**

[GoWind CMS](https://github.com/tx7do/go-wind-cms) 的社交分发功能连接 10 个平台（Bluesky / Mastodon / DEV.to / Telegram / WordPress / 微信公众号 / Nostr / 微博 / LinkedIn / 博客园），支持内容一键分发、定时发布、改期重排、失败重试、互动统计回拉，并把这些能力以 MCP 工具的形式暴露给 AI 代理。这篇文章拆它的五层：**平台适配器、凭据生命周期、发布状态机、定时自愈、统计回拉**——每一层都有可以直接迁移的工程决策。

---

## 一、适配器架构：三个方法、一个接口、一种错误哲学

所有平台适配器实现同一个接口（`pkg/social/provider.go`）：

```go
type Provider interface {
	ValidateCredentials(ctx context.Context, creds Credentials) error
	Publish(ctx context.Context, account Account, content Content) (*PublishResult, error)
	FetchStats(ctx context.Context, account Account, externalID string) (*Stats, error)
}
type Credentials map[string]string
```

接口面刻意收窄到三方法，配套一个语义化哨兵错误集合：

```go
var (
	ErrInvalidCredentials  = errors.New(...)
	ErrRateLimited         = errors.New(...)
	ErrContentTooLong      = errors.New(...)
	ErrNotFound            = errors.New(...)
	ErrStatsUnsupported    = errors.New(...)  // 统计回拉链路据此静默跳过而非报错
)
```

`ErrStatsUnsupported` 的注释点明了这套错误哲学：**适配器用类型化错误表达"能力差异"，上层据此分流**——Telegram 没有互动统计 API，回拉 worker 遇到这个哨兵就推进节流时间戳、静默跳过，而不是每周期报一次错。错误即协议。

适配器通过注册表解耦：各平台子包在 `init()` 里 `Register("PLATFORM_BLUESKY", p)` 自注册，core 侧按 proto 枚举名取用——新增平台 = 新增一个子包，主链路零改动。

安全模型有一条清晰的边界（注释原文）：「凭据只在 core service 层解密后以 Credentials 传入，适配器不接触存储；与 pkg/ai 的'密钥运行时注入'同款安全模型」。**适配器是纯函数式的平台客户端，密钥从哪里来、怎么加密，它一概不知。**

---

## 二、MetaWeblog：一个适配器吃掉一类协议

10 个平台不是 10 份等量代码。博客园、Typecho 及一切声明支持 MetaWeblog API 的博客系统共用一个通用 XML-RPC 适配器（`pkg/social/metaweblog`），包头注释就是它的设计宣言：

> 覆盖对象：博客园、Typecho 及一切声明支持 MetaWeblog API 的博客系统——RPC 端点由用户凭据给出，本适配器不绑定具体站点。

整个适配器只用三个 XML-RPC 方法（`blogger.getUsersBlogs`、`metaWeblog.newPost`），`blog_id` 留空时自动调 `getUsersBlogs` 取第一个博客。两个工程细节：

- **ctx 透传缝**：底层 XML-RPC 库不接受 context，`ctxTransport` 自定义 Transport 把调用级 ctx 塞进去——超时与取消不因库的老接口而失效；
- **错误归类**：`classifyXMLError` 按中英文认证关键词（"密码"/"auth"/"403"……）把各家实现不一的 faultString 归类为 `ErrInvalidCredentials`——**把混乱归一在适配器层，上层只认哨兵错误**。

其他平台的对接要点各有味道：Bluesky 用 App Password 现签现用 JWT（不持久化会话，300 rune 长度预检）；Nostr 是"账户即密钥"——NIP-01 私钥直接对 kind=1 事件做 Schnorr 签名广播，任一 relay 接受即成功；微信公众号走草稿箱→freepublish 两段式，`thumb_media_id` 必填、受 IP 白名单约束，未认证号 freepublish 报权限时保留草稿降级。收件箱回拉则是可选能力接口 `InboxFetcher` + `AsInboxFetcher` 类型断言——**能力是可选接口而非全家桶**，未实现的平台周期任务静默跳过。

---

## 三、凭据生命周期：从"保存即验证"到"增量合并不丢密钥"

凭据的安全链路五步，每步都有明确的威胁对位：

1. **保存即验证**：`CreateSocialAccount` 先调 `provider.ValidateCredentials`，通过才加密落库——坏凭据在入口就挡住，不等发布时才炸；
2. **AES-256-GCM 落库**：`enc:` 前缀 + 随机 nonce，密钥由 `ENCRYPTION_KEY` 经 SHA-256 派生（core/admin 双服务同值）。这里有一个真实的修复故事（CHANGELOG 1.1.0 原话）：「AI 模型提供商 API Key 此前明文落库：全局存储加密器（pkg/crypto）**从未初始化**，现已在服务启动接线；未配置时降级明文并告警」——加密代码写了、初始化漏了，是这类安全设施最典型的失效方式，`wiring.go` 里那段 `InitGlobalEncryptor` + 未配置告警就是为它补的；
3. **读取恒空**：List/Get/Create/Update 四个出口统一 `item.Credentials = nil`，只回 `CredentialHint`（如 `"app_password ***xxxx"` 末 4 位脱敏）——管理页永远拿不到密文；
4. **增量合并**：编辑账号时前端动态表单只回传用户填写的键，core 取旧密文解密、`if v != "" { merged[k] = v }` 合并、重新验证加密——**部分更新不会把没填的密钥清掉**；
5. **代改密文**：边角场景——用户只想改 Bluesky 的 handle 不想重输密码，handle 恰好是凭据的一部分（密文里），core 代为解密改写这一键再加密。「凭据密文无法在 BFF 侧改写，必须由 core 完成」——谁持有密钥谁负责密文变换，边界不含糊。

---

## 四、发布是状态机，不是一次 HTTP 调用

"一键发布"的直译是 `provider.Publish(content)`——这个实现把它建成了状态机：`DRAFT → SCHEDULED → PUBLISHING → PUBLISHED / FAILED(可重试)`。两个关键决策：

**状态流转收敛在仓储层**（`social_distribution_repo.go` 结构体注释）：「状态流转由本仓储的专用方法收敛，service/worker 不直接散写 status，避免竞态下状态机被绕过」——通用的 `Update` 根本不开放 status 字段写入，改状态只有走专用方法一条路。

**进入 PUBLISHING 走条件更新抢占**——全文的高光代码：

```go
// TryLockPublishing:n>0 表示抢到发布权;n==0 表示并发点击/重复发布
n, err := r.entClient.Client().SocialDistribution.Update().
	Where(
		socialdistribution.IDEQ(id),
		socialdistribution.StatusIn(DRAFT, SCHEDULED, FAILED),  // 只有这些状态可进发布
	).
	SetStatus(PUBLISHING).
	Save(ctx)
return n > 0, nil
```

用户双击发布按钮、worker 与手动触发并发、MCP 工具与页面同时下发——所有路径都汇到这条条件 UPDATE 上，**恰一方进入 PUBLISHING**。这与运维平台的"PENDING-only 条件回填"是同一种原语的镜像用法：那边防重复终态化，这边防重复起始化。

失败重试的语义也收在仓储：`MarkFailed` 返回累计 `publish_attempts`（原子 +1），worker 据此判定 1+MaxRetry=4 次穷尽才算最终失败——**计数在库不在内存**，跨进程重启依然准确。看板拖拽流转（`MoveStatus`）同样走 `StatusIn(froms...)` 条件更新，拖晚了并发变化返回 false 让前端刷新。

---

## 五、定时发布的两层防线

定时发布用 asynq DELAY 实现：`publish_time` 在未来 → 按时刻入队（`ProcessAt`），为空或已过 → 零延迟立即执行，`MaxRetry(3)`。这一层有三个细节：

- **调度器未注入时返回错误**——与重索引类 best-effort 任务刻意区分（注释："否则 SCHEDULED 记录会被无声搁置"）。同样是入队，**有的任务失败可以静默降级，有的必须硬失败**，判据是"失败是否造成用户可见的承诺落空"；
- **改期自动重新排队 + 旧任务自弃**：改期落库后重新入队新时刻的 DELAY 任务，而旧的已排期任务到点时发现排期已推迟超过 2 分钟窗口（`socialStaleTaskSkipWindow`）则自行丢弃——新旧任务不需要互相互杀，靠数据库里的当前状态裁决；
- **永久性/暂时性失败分叉**：worker 里 `ErrContentTooLong` 这类重试必然还错的返回 `nil`（不烧重试额度），网络类错误返回 `err` 交给 asynq 退避重试。**错误分类决定重试策略**，哨兵错误体系在这里兑现价值。

**第二层防线是兜底扫描**（`pkg/task/publish_sweep.go`）：DELAY 任务在 Redis 数据丢失、服务崩溃窗口内可能静默丢失，两个每分钟一轮的 sweep 任务扫描"已到期但仍是 SCHEDULED"的记录重新入队。这个文件的头注释里藏着一个精彩的踩坑故事，值得整段引用：

> 任务类型命名注意：asynq ServeMux 在精确匹配失败后按【前缀】兜底路由（strings.HasPrefix），类型名不得是其他已注册类型的前缀——曾用名 "post.publish.sweep" 会命中 "post.publish" 的 handler，payload 解码失败被吞。现改为互不为前缀的 "post.scheduled.sweep" / "social.distribution.sweep"。

**"payload 解码失败被吞"**——这个 bug 的恶劣在于三层叠加：前缀路由命中错误的 handler、解码失败、错误被吞。三个独立的小缺陷叠出一个"定时任务偶尔静默不执行"的幽灵故障。sweep 的幂等性也写明了："重复入队无害：worker 会跳过已发布/改期记录"——又回到状态闸门，重试的底气始终是那个条件更新。

通知语义对齐"落库即达"：成功即时站内信通知操作者，失败只在重试穷尽后通知一次——不打扰，但绝不让失败静默。

---

## 六、统计回拉：与平台 API 共处的克制

发布出去只是前半程，互动数据（赞/评/转）要回拉。这条链路的三个常量就是全部的克制哲学：

```go
socialStatsSyncWindow   = 30 天          // 只回拉近 30 天发布的内容
socialStatsSyncThrottle = 2 小时         // 单条记录最小回拉间隔
socialStatsSyncBatchLimit = 50           // 单批上限,防长事务/平台限流
```

候选查询按 `PUBLISHED + external_id 非空 + 30 天内 + (从未回拉 或 节流已过)` 筛选，Limit 50。遇 `ErrStatsUnsupported` 走 `TouchStatsSyncedAt` 仅推进节流时间戳——**用节流替代报错**，不支持统计的平台不会产生周期性告警噪音。回拉成功追加快照到 `social_stats_history`（只增不改的表），批次尾部顺手按 90 天保留裁剪（限批 1000 防长事务）——趋势图的数据积累与容量治理在同一个写路径里完成，不需要独立的清理任务。

---

## 七、MCP 服务器：把分发能力暴露给 AI 代理

分发的第五层出口是 MCP（Model Context Protocol）服务器（`mcp_server.go`，290 行）：基于 `mark3labs/mcp-go` + StreamableHTTP 传输，把 CMS 能力包装成四个工具——`list_recent_posts` / `get_social_summary` / `list_social_distributions` / `publish_distribution`。

鉴权模型有两处讲究：`MCP_TOKEN` 只走环境变量，**缺失时拒绝启动 MCP 服务器**（不存在"无鉴权的降级模式"）；`tools/list` 的元数据（名称与描述）对未鉴权调用方可见，但**每个工具调用必须带 Token**——工具目录是发现协议的一部分，能力执行才是要保护的面。

最有分量的是 `publish_distribution` 这个写工具的实现路径：它内部走 `PublishSocialDistribution` → `TryLockPublishing`——**与页面按钮完全同一条安全路径**。AI 代理触发的发布与人类触发的发布共享状态闸门、重试语义与审计，不存在"AI 专用旁路"。给 AI 开放写能力时，正确的姿势不是为它新写一套，而是确认它只能走到人类已有的那条路上。

---

## 八、结语

拆完五层，这个引擎的架构观可以收敛成三句话：

1. **平台异构性收口在适配器层**——哨兵错误即协议，能力差异（InboxFetcher、ErrStatsUnsupported）用可选接口和类型化错误表达，上层永远只见统一语义；
2. **发布是状态机**——状态流转收敛在仓储、进入 PUBLISHING 走条件更新、重试计数在库不在内存，所有并发问题在状态闸门前终止；
3. **定时承诺用两层防线兑现**——asynq DELAY 管正常路径，每分钟 sweep 管灾难路径，幂等 worker 让重复入队无害；而前缀路由的事故故事提醒我们：任务系统的路由语义要像对待 SQL 注入一样认真读文档。

仓库（分发引擎在 `backend/pkg/social` 与 `backend/app/core/service/internal/service/social_service.go`）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
