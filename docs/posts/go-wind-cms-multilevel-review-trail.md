---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - GoWind
  - CMS
  - 审批流
  - 内容治理
  - Golang
sticky: 10
---

# GoWind CMS 拆解：发布审批——多级推进、逐级角色与全程留痕

> 本文回答一个问题：**一篇文章从「提交审核」到「正式发布」，审批流怎么推进（第几级了）、谁有权批（每级什么角色）、每一次动作如何留痕（谁在何时批了什么）、以及怎么保证不被 Update 接口绕过去？**

[GoWind CMS](https://github.com/tx7do/go-wind-cms) 的发布审批是内容域的最后一道闸：文章提交后进入审核中，审批人逐级推进（级数与每级角色都是租户可配的），末级通过才置 PUBLISHED；每一次 SUBMIT/APPROVE/REJECT 都落 `sys_review_logs` 表留痕，审核中的内容被 Update 接口封死了直改状态的后门。页面（page）走同款语义。这篇按审批流的四个组成部分拆：**状态机、推进、授权、留痕与闸门**。

---

## 一、状态机：一把 in_progress 旗子 + 三个 RPC

审批流的骨架极简。文章表上只有一把 `in_progress` 旗子，加上 status 枚举，构成全部状态空间：

```
DRAFT(in_progress=false)
   │ SubmitReview（置 in_progress=true，开新批次）
   ▼
审核中(in_progress=true)
   │ ApproveReview × N-1（中间级：保持审核中，通知进度）
   │ ApproveReview 第 N 级（末级：置 PUBLISHED + in_progress=false）
   ▼
PUBLISHED

审核中 ── RejectReview（带理由，in_progress=false）──► DRAFT
```

三个 RPC 对应三个动作：`SubmitReview`（校验：非 DRAFT 400、已在审 400——重复提交直接拒绝）、`ApproveReview`（推进或发布）、`RejectReview`（驳回回 DRAFT，理由必填进留痕）。`in_progress` 这把旗子的职责被刻意收窄：它只表达「有一场未完结的审批在进行」，**不是**发布状态——发布与否由 status 说话，两者正交。这个收窄直接决定了后面闸门的判定条件（第六节）。

---

## 二、留痕先行：sys_review_logs

每一次审批动作都落独立表（ent schema `review_log.go`）：

```go
field.String("entity_type").Comment("实体类型（post/page）").NotEmpty().MaxLen(16),
field.Int64("entity_id").Comment("实体 ID"),
field.Enum("action").Comment("动作").NamedValues(
    "Submit", "SUBMIT", "Approve", "APPROVE", "Reject", "REJECT",
).Default("SUBMIT"),
field.Uint32("level").Comment("审批级别（submit=0；第 N 次 approve=N）"),
field.String("note").Comment("意见（驳回理由/批准备注）").Optional().Nillable().MaxLen(512),
```

五个业务字段之外，Mixin 带上了 `TimeAt + AutoIncrementId64 + TenantID[int64] + OperatorID64`——**操作人和租户落在 Mixin 里**，`(entity_type, entity_id)` 上建联合索引支撑「查一篇文章的全部审批史」。

这张表有个不显眼但重要的语义约定：**批次由 `in_progress` 的翻转定义**。schema 注释原文：「in_progress false→true 即开新批次」——`level` 的语义是「本批次内的第几级」，而不是「这篇文章历史上第几次 approve」。驳回后重新提交会开新批次，level 从头计。没有这个约定，「当前在第几级」就无法从日志推导。

写入侧有个小而正的设计：仓储层不自己从 context 里取操作人，而是要求调用方显式传入（repo 注释原话「operatorID/tenantID 由调用方显式传入——写入方在服务层从 viewer 取」）。服务层的 Submit 处：

```go
// 审批留痕：开启新批次（level=0）
if s.reviewLogRepo != nil {
    if operatorID, tenantID, ok := operatorTenantUserID(ctx); ok {
        _ = s.reviewLogRepo.Create(ctx, "post", req.GetPostId(), "SUBMIT", 0, "", operatorID, tenantID)
    }
}
```

`operatorTenantUserID` 是从 `viewer.FromContext(ctx)` 显式取值的 helper。留痕失败只吞掉不阻断主流程——审批是主业务，日志是旁路，旁路不能把主路堵死。

---

## 三、多级推进：按「本批次最大 APPROVE level」计数

核心推进逻辑在 `ApproveReview`（`post_service.go`）：

```go
// ===== 多级审批推进：当前级别 +1；达到配置级数才置 PUBLISHED =====
totalLevels := s.reviewPolicy.Levels(ctx, tenantID)
currentLevel, err := s.reviewLogRepo.CurrentLevel(ctx, "post", req.GetPostId())
// ……
nextLevel := currentLevel + 1
if err = s.reviewPolicy.CheckApprover(ctx, tenantID, operatorID, int(nextLevel)); err != nil {
    return nil, err
}

finalApproval := int(nextLevel) >= totalLevels
if !finalApproval {
    // 中间级：保持审核中，落留痕并通知作者当前进度
    // ……只更新 in_progress=true，落 APPROVE 留痕，通知进度
    return updated, nil
}
// 末级：置 PUBLISHED + in_progress=false + publish_time 补缺
// ……落 APPROVE 留痕 + ES 重索引 / Webhook published 发布钩子 + 通知作者
```

两个实现细节值得展开：

**「当前级别」为什么用 MAX 而不用 COUNT？** `CurrentLevel` 的实现（`review_log_repo.go`）是按 `entity_type + entity_id + action=APPROVE` 查全部留痕行取 `level` 最大值，无记录返回 0。因为 level 是「本批次第 N 级」，COUNT 在重复审批（同一级批了两次，比如撤销重来）时会虚高，MAX 则天然幂等——**进度是「到达过的最高处」，不是「签过的总次数」**。这个语义同时决定了重试安全：ApproveReview 重放时推进结果不变。

**配置缺省 = 单级。** 级数来自系统参数 `review.post.levels`，读取处钳位 1..8、默认 1：

```go
// Levels 发布审批级数（钳位 1..8；配置缺失/非法回落 1=单级）。
n := p.configRepo.GetConfigInt(ctx, "review.post.levels", 1)
if n < 1 { n = 1 }
if n > 8 { n = 8 }
```

一级批完即发；多级是租户按需配置的能力。钳位上限 8 是务实的选择：现实中没人需要九级审批，而无限级数会让「当前级」的语义在 UI 上无法呈现。

末级通过后的发布钩子（ES 重索引、Webhook `published` 事件、站内信通知作者）是标准的发布链路——**多级只改变「何时算发布」，不改变「发布做什么」**。Page 侧同款语义独立实现（页面无 ES，只派发 Webhook）。

---

## 四、角色闸门：levelRoles 的逗号与竖线

级数解决了「走到第几步」，每步谁来批由另一个系统参数管：`review.post.levelRoles`。它的编码格式在注释里写得直白——**逗号分隔按级对应，竖线分隔同级多角色**：

```
editor,chief_editor|publisher,admin
  → 第 1 级：editor
  → 第 2 级：chief_editor 或 publisher（同级多角色）
  → 第 3 级：admin
```

解析实现（`review_policy.go`）里藏着一个体贴的规则：

```go
parts := strings.Split(raw, ",")
// 逗号列表按级对应：超出配置长度的级别沿用最后一级的角色
idx := level - 1
if idx < 0 { idx = 0 }
if idx >= len(parts) { idx = len(parts) - 1 }
```

配置了三级角色却把 levels 调到五级时，第 4、5 级沿用最后配置段——**参数之间允许不严格对齐，系统取最近似语义**，而不是报错或放行所有人。校验时大小写不敏感（`EqualFold`），未命中返回 403（`ErrorForbidden("insufficient review role for this level")`），并带 Warn 日志把 have/want 都打出来。

角色码的解析器（查用户角色列表）由 wiring 注入而非 review 包自己 import 身份域——注释明说是为了避免循环依赖。一个小依赖倒置，换来 review 包对身份域零耦合。

---

## 五、封绕过口：审批闸门

推进和授权都做完了，还有个致命的口子要堵：**审核中的文章，作者可以直接调 Update 接口把 status 改成 PUBLISHED**——审批流形同虚设。闸门堵在 Update 链路上（`post_service.go`）：

```go
// 审批闸门：审核中的文章不允许经 Update 直改状态（绕过审批的口子）。
// 改状态须先驳回（回 DRAFT）或走审批通过；in_progress 之外的纯编辑不受限。
if existing.GetInProgress() && req.Data.GetStatus() != prevStatus {
    return nil, contentV1.ErrorBadRequest(
        "post is under review: status changes must go through the review flow (approve/reject)")
}
```

三个细节：

**闸门设在 Update 的回读处。** Update 本来就要回读旧状态（记录 `prevStatus` 供 Webhook 判定是否为「发布」转移）——闸门条件 `in_progress && status 变了` 顺手就设在了这个已有回读之后，没有为校验增加额外的查询。**好闸门长在必经之路上，不新开收费站**。

**只拦状态变更，不拦编辑。** `in_progress` 期间作者依然可以改标题改正文（纯编辑不受限）——审核看的本来就是内容，编辑内容不该锁死；要拦的只有「跳过审批自己把状态改成已发布」这一种越权。闸门的粒度越细，正常用户的感知越少。

**改状态的合法路径只有两条**：驳回（回 DRAFT 重新编辑）或逐级批到末级（自动发布）。错误信息把这两条路都写明了——拦下来之后告诉用户怎么办，比拦下来就完事重要。

---

## 六、查询端点与前端

留痕查出来了要有出口：`ReviewLogService` 提供 `/admin/v1/review-logs` 查询端点（要求 entity_type + entity_id 必填，按 id 正序返回——即时间正序的审批史）。admin BFF 直透 core。

前端侧，审批动作挂进了内容列表页：post/page 两处操作列有提交/通过/驳回（hooks 层 `useSubmitPostReview` / `useApprovePostReview` / `useRejectPostReview`），进度通过站内信通知作者（中间级每批一次通知当前进度，驳回带理由）。审批操作列所在的帖子列表页与编辑页：

![CMS 帖子列表页（审批操作列所在）](https://tx7do.github.io/assets/images/go_wind_cms/admin_post_list.png)

![CMS 帖子编辑页](https://tx7do.github.io/assets/images/go_wind_cms/admin_post_edit.png)

诚实交代一处：**review-logs 的专用查询 UI 还没建**——端点有了、数据有了，但管理端还没有一个「审批历史」页面。这是典型的「后端先行」留白：先保证留痕不可抵赖（数据在），UI 什么时候补都不影响审计能力。

回归覆盖分两层：多级审批 E2E 10 断言（单级回归、两级逐级推进、留痕内容校验、闸门 400、驳回理由落痕、页面同款流程）+ 旧审批流 E2E 8/8 回归。其中「单级回归」这个用例值得单独点名：**默认配置下的旧行为一致性，是这类「可配置增强」功能的生命线**。

---

## 七、收尾

审批流的四个组成部分，各自的解法落点：

| 组成部分 | 性质 | 解法落点 |
|----------|------|---------|
| 推进（走到第几级） | 状态机问题 | level 按批次 MAX 幂等推进，配置缺省单级 |
| 授权（谁批哪一级） | 参数编码问题 | levelRoles 逗号按级、竖线同级，越界沿用最后段 |
| 留痕（谁批了什么） | 审计问题 | sys_review_logs 独立表，批次语义钉死，operator 显式取 |
| 防绕过（不被 Update 穿透） | 入口控制问题 | Update 必经回读处设闸，只拦状态变更 |

四个问题四种性质、四个位置、四套薄实现——没有出现一个「审批引擎」把它们搅在一起。`in_progress` 一把旗子撑起了状态机，日志表撑起了审计，一行闸门条件撑起了入口控制。

留痕这件事还有一层前瞻价值：`sys_review_logs` 的 `(entity, action, level, operator, note)` 结构已经把审批流建模成了**可回放的事件序列**。将来要加代签、转办、SLA 超时提醒、按角色统计审批负载——全部是在这张表和这个序列上做增量，不动状态机。**审计先行，扩展才有地基**。

仓库（本文所有代码路径均可逐行核对）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
