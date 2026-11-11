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

# GoWind CMS 拆解：发布审批的多级化——从一把 in_progress 旗子到全程留痕

> 本文回答一个问题：**一篇文章从「提交审核」到「正式发布」，中间的每一次签字如何推进、如何留痕、如何不被 Update 接口绕过去？**

内容平台的发布审批是最典型的「第一版够用、第二版才对」的功能。[GoWind CMS](https://github.com/tx7do/go-wind-cms) 在 10 月 15 日上了单级审批（提交→通过→发布，一把 `in_progress` 旗子搞定），12 天后（10 月 27 日，`322d472c`）把它升级成多级审批 + 全程留痕：支持 N 级逐级推进、每级可配审批角色、每一次 SUBMIT/APPROVE/REJECT 都落表留痕，并顺手封死了 Update 接口绕过审批的后门。

这篇拆这次升级。它的样本价值在于：**审批流的三个痛点（推进、留痕、防绕过）是三种不同性质的问题，解法分布在状态机、审计表和入口闸门三个位置**——位置放对了，每个解法都很薄。

---

## 一、起点：单级审批的 12 天

10 月 15 日的第一版（`87829314`）骨架极简：

- 文章表上只有一把 `in_progress` 旗子：`false` → 提交时置 `true`（审核中），通过时置 `false` + 状态直置 `PUBLISHED`，驳回时置 `false`（回 DRAFT）；
- `SubmitReview / ApproveReview / RejectReview` 三个 RPC，一次 Approve 直接发布；
- **零留痕**——谁提交的、谁批的、批了什么，事后无从查起。

单级场景下这个设计完全成立：一把旗子三个状态转移，状态机即文档。它的问题在可审计性与可扩展性：审计要留痕才能做，多级要「当前在第几级」才能推进。12 天后的多级化没有推翻这副骨架——`in_progress` 旗子保留、三个 RPC 签名不变，升级全发生在骨架的三个空位上。

---

## 二、留痕先行：sys_review_logs

升级的第一件事不是推进逻辑，是**先把每一次动作记下来**。新表 `sys_review_logs`（ent schema `review_log.go`）：

```go
field.String("entity_type").Comment("实体类型（post/page）").NotEmpty().MaxLen(16),
field.Int64("entity_id").Comment("实体 ID"),
field.Enum("action").Comment("动作").NamedValues(
    "Submit", "SUBMIT", "Approve", "APPROVE", "Reject", "REJECT",
).Default("SUBMIT"),
field.Uint32("level").Comment("审批级别（submit=0；第 N 次 approve=N）"),
field.String("note").Comment("意见（驳回理由/批准备注）").Optional().Nillable().MaxLen(512),
```

五个业务字段之外，Mixin 带上了 `TimeAt + AutoIncrementId64 + TenantID[int64] + OperatorID64`——**操作人（operator）和租户落在 Mixin 里**，`(entity_type, entity_id)` 上建联合索引支撑「查一篇文章的全部审批史」。

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

**配置缺省 = 历史行为零变化。** 级数来自系统参数 `review.post.levels`，读取处钳位 1..8、默认 1：

```go
// Levels 发布审批级数（钳位 1..8；配置缺失/非法回落 1=单级，历史行为）。
n := p.configRepo.GetConfigInt(ctx, "review.post.levels", 1)
if n < 1 { n = 1 }
if n > 8 { n = 8 }
```

默认 1 意味着所有存量租户升级后行为与旧版完全一致（一级批完即发）——多级是 opt-in 的租户级配置，不是全局断代。钳位上限 8 是务实的选择：现实中没人需要九级审批，而无限级数会让「当前级」的语义在 UI 上无法呈现。

末级通过后的发布钩子（ES 重索引、Webhook `published` 事件、站内信通知作者）沿用旧发布链路——**多级只改变「何时算发布」，不改变「发布做什么」**。Page 侧同款语义独立实现（页面无 ES，只派发 Webhook）。

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

留痕和推进都做完了，但有个致命的口子一直开着：**审核中的文章，作者可以直接调 Update 接口把 status 改成 PUBLISHED**——审批流形同虚设。旧版没堵是因为旧版根本没有「审核中」这个需要保护的中间态的强语义。

这次升级把闸门堵在了 Update 链路上（`post_service.go`）：

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

## 六、查询端点、前端与一处诚实交代

留痕查出来了要有出口：`ReviewLogService` 提供 `/admin/v1/review-logs` 查询端点（要求 entity_type + entity_id 必填，按 id 正序返回——即时间正序的审批史）。admin BFF 直透 core。

前端侧，审批动作挂进了内容列表页：post/page 两处操作列有提交/通过/驳回（hooks 层 `useSubmitPostReview` / `useApprovePostReview` / `useRejectPostReview`），进度通过站内信通知作者（中间级每批一次通知当前进度，驳回带理由）。审批操作列所在的帖子列表页与编辑页：

![CMS 帖子列表页（审批操作列所在）](https://tx7do.github.io/assets/images/go_wind_cms/admin_post_list.png)

![CMS 帖子编辑页](https://tx7do.github.io/assets/images/go_wind_cms/admin_post_edit.png)

诚实交代一处：**review-logs 的专用查询 UI 还没建**——端点有了、数据有了，但管理端还没有一个「审批历史」页面。这是典型的「后端先行」留白：先保证留痕不可抵赖（数据在），UI 什么时候补都不影响审计能力。

---

## 七、回归与测试

这次升级的 E2E 覆盖分两层：`test_review_multilevel.py` 10 断言全过——levels=1 回归（默认配置下与旧版行为一致）、两级逐级推进、留痕内容校验、闸门 400、驳回理由落痕、页面同款流程；旧页面审批流 E2E 8/8 回归全过。

「levels=1 回归」这个用例值得单独点名：**默认配置下的旧行为一致性，是这类「可配置增强」功能的生命线**。所有租户里总有大量用着默认值的，升级断言里没有这一条，等于赌所有租户都改了配置。

---

## 八、收尾：留痕是为未来腾挪空间

回头看这次升级的三个解法落点：

| 痛点 | 性质 | 解法落点 |
|------|------|---------|
| 多级如何推进 | 状态机问题 | level 按批次 MAX 推进，配置缺省回归单级 |
| 动作如何留痕 | 审计问题 | sys_review_logs 独立表，批次语义钉死 |
| 审批如何不被绕过 | 入口控制问题 | Update 必经回读处设闸，只拦状态变更 |

三个问题三种性质、三个位置、三套薄实现——没有出现一个「审批引擎」把它们搅在一起。`in_progress` 一把旗子撑起了状态机，日志表撑起了审计，一行闸门条件撑起了入口控制。

留痕这件事还有一层前瞻价值：`sys_review_logs` 的 `(entity, action, level, operator, note)` 结构已经把审批流建模成了**可回放的事件序列**。将来要加代签、转办、SLA 超时提醒、按角色统计审批负载——全部是在这张表和这个序列上做增量，不动状态机。第一版没留痕，第二版第一件事就是补留痕，顺序说明了一切：**审计先行，扩展才有地基**。

仓库（本文所有代码路径均可逐行核对）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
