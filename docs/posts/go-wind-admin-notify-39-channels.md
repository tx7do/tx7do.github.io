---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - 通知系统
  - 设计模式
sticky: 10
---

# GoWind Admin 拆解：一个 Sender 接口接 39 个通知渠道

> 本文回答一个问题：**通知渠道从"邮件/短信/Webhook"老三样扩到 39 种（钉钉、飞书、Slack、Telegram、Bark、极光、Twilio、PagerDuty……），代码量为什么没有翻 13 倍——配置面是怎么设计的？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 的通知渠道扩展（1.4.0）把接入渠道数从 3 种推到 39 种，但真正值得拆的不是"接了多少平台"，而是这条扩展曲线背后的三个设计决策：**投递能力下沉为独立库**（管"怎么发"）、**schema 驱动的注册表**（新渠道 = 一份声明 + 一份 builder）、**配置存储从多列切到整包 JSON**（39 种渠道共用一个 settings 列）。加上敏感字段的"加密落库 / 回显脱敏 / 留空不修改"三段闭环，这一套组合是可以直接搬走的通知渠道扩展方案。

---

## 一、两层架构：库管"怎么发"，仓库管"配置从哪来"

第一刀切在职责边界上。`go-utils/notify` 是一个独立库（39 个渠道子包：bark/datadog/dingtalk/discord/feishu/gchat/getui/gotify/jpush/line/mailgun/matrix/mattermost/ntfy/opsgenie/pagerduty/postmark/pushbullet/pushdeer/pushover/rocketchat/sendgrid/serverchan/slack/sms/teams/telegram/twilio/vonage/webex/webhook/wechat/wecom/whatsapp/wxpusher/yunpian/zulip……），核心抽象小到一张名片写得下：

```go
type Service interface {
	Name() string
	Send(ctx context.Context, msg *Message) (*Receipt, error)
}

type Message struct {
	Target  string            // 投递目标,按渠道解释:邮箱/手机号/回调 URL
	Title   string            // 邮件为 Subject;短信等无标题渠道忽略
	Content string            // 正文
	Params  map[string]string // 渠道原生参数(短信模板参数、webhook 占位符变量)
}

type Receipt struct {
	ProviderID string // 服务商侧消息 ID(阿里云 RequestId、腾讯云 SerialNo),方便对账
}
```

包注释把边界写成了契约：「这里只管'怎么发'：给定一个已经解析好的渠道配置（构造 Service 时注入）和一条正文就绪的 Message，把消息发出去并拿回执。**渠道配置从哪里来（数据库/环境变量）、失败怎么记账、要不要重试，都不归本包**——那是调用方的编排层。」

这个切割的直接收益是**渠道实现变成纯函数式的平台客户端**：每个渠道子包只依赖自己的 `Config` 结构和一个 http.Client，不 import 数据库、不知道台账存在、不需要 mock 任何存储就能单测。GoWind Admin 仓库这边的适配层（`internal/data/channel/`）负责另一半：`Registry` 按通知域的渠道大类分发到 `email/webhook/sms` 三个老 Sender，或者 39 种扩展渠道的通用 EXT Sender；`Prechecker` 在入队前做配置自检。

---

## 二、两个哨兵错误：失败语义即协议

库的第一个设计含量不在接口，在错误分类。`notify` 包定义了两个哨兵，注释把"为什么"讲得比很多文章都清楚：

```go
// ErrNotConfigured 渠道不可用的哨兵：没配 / 配错 / 停用 / 目标不合法等
// "一次都没联系到对端"的错误都包在它里面。
//
// 为什么要单独一个哨兵：调用方的台账要能区分两种失败——
// "没尝试过投递"（SKIPPED：配置问题，重试也不会变好）与
// "投递被拒"（FAILED：拨过号/递过单，对端说了不）。
// 实现准则：凡是发生在联系对端**之前**的拒绝，一律包 ErrNotConfigured。

// ErrInvalidToken 厂商侧明确判定的收件令牌失效（设备令牌/regId/别名等）。
//
// 与投递失败分开的原因：失效令牌躺在调用方的设备表里只会让后续每次投递
// 都白打一趟——errors.Is 命中它就该删行自清理，重试没有意义。
// 各渠道把自家错误码（APNs 410、FCM 404/410、JPush 1011 等）都归到这里。
```

这两个哨兵把"失败"这个单一概念拆成了三种后果完全不同的形态：

| 失败形态 | 哨兵 | 台账语义 | 重试策略 |
|---------|------|---------|---------|
| 没联系到对端 | `ErrNotConfigured` | **SKIPPED** | 不重试（配置问题重试也不会变好） |
| 联系了被拒 | 普通错误 | **FAILED** | 走退避重试 |
| 令牌被判死 | `ErrInvalidToken` | FAILED | **删设备行自清理**，重试是白打 |

推送渠道的维护者都见过那个经典故障：几百万台卸载了 App 的设备还躺在设备表里，每次群发都对着 APNs 的 410 白跑一趟。`ErrInvalidToken` 的存在就是给"删行自清理"这个动作一个机器可判的触发器。**错误分类的粒度应该由"接收到错误后要做什么"来决定**——这里的三分类就是从台账语义和清理动作反推出来的。

---

## 三、schema 驱动的注册表：新渠道 = 两段各 5~15 行

适配层真正的巧思是注册机制。每接入一个新渠道，只需要一条 `registerSettingsChannel` 调用——它同时喂两张表：

```go
var settingsSchemas []*SettingsSchema                          // 喂前端:配置表单 schema 下发
var settingsBuilders = map[string]func(m settingsMap) notify.Service{}  // 喂发送:配置 → Service 构造

func registerSettingsChannel(schema SettingsSchema, build func(m settingsMap) notify.Service) {
	settingsSchemas = append(settingsSchemas, &schema)
	settingsBuilders[schema.Type] = build
}
```

以企业微信应用消息为例（`settings_channels_im.go`）：

```go
func init() {
	registerSettingsChannel(SettingsSchema{
		Type: "WECOM_APP", Group: "IM", Label: "企业微信应用消息",
		TargetLabel: "成员 UserID（多个用 | 分隔）", NeedsTarget: true,
		Fields: []SettingsField{
			{Name: "corpId", Label: "企业 ID", Type: "text", Required: true},
			{Name: "corpSecret", Label: "应用 Secret", Type: "password", Required: true, Sensitive: true},
			{Name: "agentId", Label: "应用 AgentID", Type: "number", Required: true},
			{Name: "apiBase", Label: "API 地址", Type: "text", Hint: "留空用官方地址"},
		},
	}, func(m settingsMap) notify.Service {
		return wecom.New(settingsHTTPClient, wecom.Config{
			Ref: m.str("ref"), CorpID: m.str("corpId"), CorpSecret: m.str("corpSecret"),
			AgentID: m.int64("agentId"), APIBase: m.str("apiBase"),
		})
	})
}
```

看清楚这份声明干了三件事：`Fields` 是**给前端渲染配置表单的 schema**（类型/必填/是否敏感/提示语）；`Sensitive: true` 是**给存储层的加密标记**（下节）；builder 是**给发送层的构造器**。一处声明，三端（react / vue-element / vue-vben）的配置表单全部由 `ListChannelSchemas` RPC 下发动态渲染——**39 个渠道，前端没有一行逐渠道的表单代码**。

新渠道的接入成本就是这份声明的体量：5~15 行 schema + 5~15 行 builder（复杂渠道多几行参数归一）。`settingsMap` 的取值辅助函数（`str/int/int64/strSlice`）专门消化"配置当不透明 JSON 存"的隐藏成本——JSON 反序列化会把数字统一变 float64、列表字段有逗号串和 JSON 数组两种写法，归一逻辑集中在这层，builder 里永远拿到干净的类型。

---

## 四、配置存储的一次决策反转：从多列到整包 JSON

老三样（email/sms/webhook）的配置走各自的独立列；39 种扩展渠道全部塞进一个 `settings` JSON 列。这个反直觉的存储设计有一段值得引用的决策史——当初只有两种渠道时，设计文档明确记录了**为什么不抄**多态信封方案（Dify 的做法）；渠道数涨到 39 时情境变了，才切过去：

- 每渠道独立列（表单强类型、可索引）在渠道数是 3 时是合理的；到 39 种时意味着 39 组列或 39 张配置表，每接一个渠道要动一次表结构——**配置面的维护成本从 O(内容) 变成了 O(渠道数)**；
- 整包 JSON 列 + schema 声明把成本压回 O(内容)：新增渠道零 DDL，schema 里没有的字段不会被存储接受；
- **新旧分治避免双真相源**：老三样保留独立列（存量数据与既有查询不动），扩展渠道统一走 settings 列——两条存储路径各管各的，没有一处配置有两个家。

台账粒度也配合了这个设计：通知域的 `Channel` 枚举只加了一个 `EXT` 大类，台账记录渠道大类，**具体是 39 种里的哪一种由 channel_id 指向的渠道行回答**——枚举不需要每接一个渠道就改一次 proto。

---

## 五、敏感字段的三段生命周期

配置里大量字段是密钥（corpSecret、Bot Token、API Key），39 渠道共用一套四函数的加密管线（`settings_crypto.go`）：

**① 保存**（`NormalizeSettingsForStore`）：required 校验 → `Sensitive: true` 的字段逐个 `EncryptIfNeeded`（AES-256-GCM）→ 整包 JSON 落库。schema 标记即加密行为，加密策略不散落在任何调用点。

**② 更新**（`MergeSettingsForStore`）——三段闭环里最精细的一段：

```go
for _, f := range schema.Fields {
	incomingValue := strings.TrimSpace(in.str(f.Name))
	switch {
	case f.Sensitive && incomingValue == "":
		// 留空 = 保留已存密文(前端约定"留空不修改")
	...
```

用户编辑渠道时前端回显的是脱敏空值，表单里没重填密钥就提交——如果把"空串"当新值存进去，渠道就静默坏了。合并语义是：**敏感字段新值为空 → 保留旧密文；连旧值都没有 → 删键，让 required 校验在保存时报错**。还有一条兜底注释值得抄：「旧值坏了按缺省处理，新值说了算」——存量密文损坏时更新操作依然可用，不会被历史脏数据卡死。

**③ 发送**（`DecryptSettings`）：仅在发送链路内部把存储态解密成 map，解密后的配置不落任何日志、不进任何 DTO。

**④ 回显**（`SanitizeSettingsForDTO`）：敏感字段值恒替换为空串；存储态 JSON 坏了返回空串而不报错——列表页不因为一行坏数据渲染失败。

四段的生命周期画出来是一条单向流：**明文只在①③短暂存在，②④的出口看到的永远是密文或空**。"留空不修改"这个前端约定和后端合并语义是同一枚硬币的两面——**这类约定必须前后端各写一遍注释，因为它不体现在任何类型签名里**。

---

## 六、用测试钉住清单一致性

39 个声明散布在三个文件（IM 15 个 / 推送与效率类 / 运维告警短信邮件类），靠纪律保证"每个 schema 有 builder"迟早出事。`settings_channel_test.go` 用两个测试把清单变成了编译期之外的第四道闸：

```go
// TestSettingsCatalogConsistency 声明与构造器一一对应：
// 每个 schema 有 builder、每个 builder 有 schema，数量即渠道清单（39）。
```

它断言三件事：schema 与 builder 一一对应、总数恰为 39（渠道清单变更必须显式改测试）、`Sensitive ⇒ Type=password`（标记了加密的字段必须是密码框，防止某个新渠道把 Secret 声明成明文输入）。配套的 `TestBuildAllSettingsChannels` 对 39 个渠道逐个用 dummy 配置构造一次——**构造器这层不用等联调就能回归**。

这套测试的价值在半年后：当第 40 个渠道加进来时，测试会强迫维护者回答"总数为什么变了"——渠道清单是产品事实，它的每次变更应该是有意识的。

---

## 七、动态表单的前端侧：一个 Map 的三重身份

三端前端的渲染逻辑高度一致，以 react 端为例：`useListChannelSchemas`（staleTime 5 分钟）拉全量 schema，`schemaByType` Map 同时承担三个身份——**"是不是扩展渠道"的唯一真理源**（Map 里有就是 EXT 渠道）、类型下拉分组的依据、行内展示名的来源（不逐渠道维护 i18n）。`SettingsFormFields` 组件按 `f.type` 五分支渲染（text/textarea/number/password/select），password 档的 placeholder 统一是"留空保留原值"——和后端的合并语义精确对齐。

降级路径也有交代：schema 拉取失败**不阻塞渠道 CRUD**——EXT 类型下拉会缺项，但已有渠道的查看、编辑（非敏感字段）、启停都照常工作。**配置面的可用性不依赖配置目录服务的可用性**，这个降级方向是对的：目录服务挂了最多接不了新渠道，不该影响存量渠道的运维。

---

## 八、结语

回头看这次扩展的四个可迁移决策：

1. **投递能力做成无状态库**——"怎么发"与"配置从哪来"切干净，渠道实现变成可独立单测的纯客户端；
2. **错误分类由下游动作反推**——SKIPPED/FAILED/删设备行三种后果对应两个哨兵，接口签名不变成语义升级；
3. **schema 声明同时喂表单、加密与构造**——一处声明三处生效，新渠道接入是纯增量操作；
4. **配置存储跟着渠道数量级走**——3 种时多列，39 种时整包 JSON；存储方案没有对错，只有与数量级的匹配。

以及一条纪律性经验：**当清单本身成为系统的一部分（39 个渠道），就该有一个测试把它钉住**——清单的每次变化都应该是显式的、被 review 的。

仓库（适配层在 `backend/app/admin/service/internal/data/channel/`）：

- GitHub：[github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- Gitee：[gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)
