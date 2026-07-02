---
date: 2026-07-02
category:
  - GoWind风行
tag:
  - UBA
  - 大数据分析
  - Golang
  - GoWind
sticky: 10
---

# Go Wind UBA 拆解系列 - 多租户与安全：两套隔离机制的边界

> 本文回答一个问题：**一个 SaaS 级 UBA 平台，怎么保证租户 A 绝对看不到租户 B 的数据？** 答案藏在两层完全不同的机制里——而它们的边界差异，恰恰是最值得讲的部分。

## 一、两套机制，一个真相

先说结论：GoWind UBA 的多租户隔离**不是一套统一机制，而是两套独立的、设计哲学迥异的机制**：

| 数据层 | 隔离机制 | 哲学 |
|--------|---------|------|
| **关系层（PostgreSQL + ent）** | `TenantPrivacy` 行级隐私策略 | **fail-closed**（缺上下文直接拒绝） |
| **OLAP 层（ClickHouse/Doris）** | 手工拼 `tenant_id = ?` 条件 | **opt-in**（请求带 appId 才裁剪） |

这个差异不是 bug，是两种数据访问范式决定的——但它是整个平台安全模型里**最需要被理解、也最容易被忽略**的部分。本文把它讲透。

## 二、关系层：ent + TenantPrivacy，自动行级隔离

所有走 ent ORM 的实体（应用、用户、角色、权限、字典、菜单、事件 Schema、风险规则等配置数据）都享受**自动租户隔离**。机制三件套：mixin 声明字段、privacy 策略注入谓词、viewer context 提供租户身份。

### 2.1 Mixin：声明 tenant_id 字段 + 绑定策略

每个 ent schema 通过 `mixin.TenantID[uint32]{}` 声明租户字段（来自 `github.com/tx7do/go-crud/entgo`）：

```go
// backend/app/core/service/internal/data/ent/schema/uba_application.go
func (Application) Mixin() []ent.Mixin {
    return []ent.Mixin{
        mixin.AutoIncrementId{},
        mixin.TimeAt{},
        mixin.OperatorID{},
        mixin.TenantID[uint32]{},   // ← 这一行干了三件事
    }
}
```

这一个 mixin 干了三件事（库源码 `mixin/tenant_id.go`）：

```go
func (TenantID[IDT]) Fields() []ent.Field {
    return []ent.Field{
        field.Uint32("tenant_id").
            Comment("租户ID").
            Immutable().           // ① 写入后不可跨租户迁移
            Default(0).
            Nillable().Optional(),
    }
}

func (TenantID[IDT]) Policy() ent.Policy {
    return rule.TenantPrivacy[IDT]{}   // ② 绑定隐私策略
}
```

`Immutable()` 是个细节：一行数据的 `tenant_id` 一旦写入就不能改，防止"数据搬家"式的越权。

### 2.2 TenantPrivacy：查询和写入的强制拦截

`rule.TenantPrivacy`（库源码 `rule/tenant.go`）实现了两个钩子。

**查询拦截（`EvalQuery`）——自动注入 tenant_id 谓词：**

```go
func (f TenantPrivacy[T]) EvalQuery(ctx context.Context, query ent.Query) error {
    vc, exist := viewer.FromContext(ctx)
    if !exist {
        return fmt.Errorf("security: missing ViewerContext in context")  // ① fail-closed
    }
    if vc.IsPlatformContext() || vc.IsSystemContext() {
        return nil     // ② 平台/系统上下文看所有租户
    }
    tid := vc.TenantID()
    return f.injectTenantWhere(query, T(tid))   // ③ 注入 WHERE tenant_id = ?
}
```

注入谓词的代码很直接：

```go
fn := func(s *sql.Selector) {
    s.Where(sql.EQ(s.C("tenant_id"), tenantID))
}
```

**两个关键安全属性：**

1. **fail-closed**——`!exist` 时直接 `return error`，**不是跳过**。这意味着如果你忘了往 context 注入 viewer，查询会**直接报错拒绝**，而不是"忘了过滤、返回所有租户数据"。这是默认安全的姿态。
2. **平台/系统上下文豁免**——`IsPlatformContext()`（tid==0）和 `IsSystemContext()` 看所有租户，给 SaaS 运营后台和后台 job 留了口子。

**写入拦截（`EvalMutation`）——强制覆盖 tenant_id：**

```go
func (f TenantPrivacy[T]) EvalMutation(ctx context.Context, m ent.Mutation) error {
    vc, exist := viewer.FromContext(ctx)
    if !exist {
        return fmt.Errorf("missing ViewerContext in context")  // 同样 fail-closed
    }
    if !m.Op().Is(ent.OpCreate) {
        return nil
    }
    tid := vc.TenantID()
    if vc.IsPlatformContext() {
        // 平台管理员：尊重显式 .SetTenantID(...)
        if _, set := m.Field("tenant_id"); set { return nil }
        return nil
    }
    // 普通用户：强制覆盖，防止越权写到别的租户
    if s, ok := m.(interface{ SetTenantID(T) }); ok {
        s.SetTenantID(T(tid))
        return nil
    }
    // ...reflect 兜底
}
```

**普通用户创建数据时，`tenant_id` 被强制覆盖成自己的**——客户端即便传了 `tenantId=别人的`，也会被无视。这是防越权写入的关键。平台管理员才能显式指定租户（运营后台创建租户数据时需要）。

同一模块还定义了 `OwnerOnlyRule`（只能改自己创建的）、`PermissionRule`（基于 org-unit 数据范围）、`SoftDeleteRule`，都遵循"viewer context gating"模式。

### 2.3 Viewer 从哪来：JWT

`UserViewer` 在 auth 中间件里从 JWT 解析构建（`backend/pkg/middleware/auth/auth.go`）：

```go
if op.injectEnt {
    userViewer := appViewer.NewUserViewer(
        uint64(tokenPayload.GetUserId()),
        uint64(tokenPayload.GetTenantId()),     // 租户身份来自 JWT
        uint64(tokenPayload.GetOrgUnitId()),
        traceID,
        tokenPayload.GetDataScope(),
    )
    ctx = viewer.WithContext(ctx, userViewer)
}
```

viewer（`pkg/entgo/viewer/user_viewer.go`）暴露 `TenantID()` / `IsPlatformContext()` (tid==0) / `IsTenantContext()` (tid>0) / `DataScope()`。还有一个 `SystemViewer`（`IsSystemContext()==true`，tid==0），给后台 job 绕过租户过滤用。

还有第二个等价注入点 `pkg/middleware/ent/ent.go` 的 `ent.Server()`，从 operator-metadata 重建 viewer（给那些走 metadata 而非 auth 中间件的内部调用用），注册在 `grpc_server.go`：

```go
ms = append(ms, ent.Server())
```

**关系层的隔离是"基础设施级"的**——开发者写 `client.User.Query().All(ctx)` 时不用记得加 `WHERE tenant_id`，privacy 策略自动加；忘了注入 viewer 会直接报错而非泄漏。这是 ent + privacy 扩展的威力。

## 三、OLAP 层：手工 SQL，opt-in 裁剪

OLAP repo **完全绕过 ent**，直接用 `go-crud` client 跟引擎对话。租户隔离在这里是**手工的、查询级的**，而且**来源是请求里的 appId，不是 viewer context**。

### 3.1 逐查询拼接

每个分析方法都重复这个模式（`doris/analytics_repo.go`，24 个方法都有）：

```go
if v := req.GetAppId(); v != 0 {
    where = append(where, "tenant_id = ?")
    args = append(args, v)
}
```

或者用字符串模板：

```go
tenantCond := ""
if v := req.GetAppId(); v != 0 {
    tenantCond = "tenant_id = ? AND "
}
```

租户条件**始终用 `?` 绑定参数**（不字符串拼接），这一点是对的。但触发条件是 `if v != 0`——**如果 appId 没传（==0），查询就不带租户条件，跨所有租户扫描**。

### 3.2 ⚠️ 这是诚实的非对称

这是整个平台安全模型里**最需要被理解**的一点。跟关系层对比：

| 维度 | 关系层（ent） | OLAP 层 |
|------|--------------|---------|
| 隔离来源 | viewer context（来自 JWT） | 请求里的 appId |
| 缺失身份时 | **fail-closed（报错拒绝）** | **opt-in（不裁剪，跨租户扫）** |
| 谁负责 | 框架自动（privacy 策略） | 开发者手工（每个查询记得加） |

**OLAP 层是 opt-in 的。** 这不是漏洞（因为对外接口都从 Admin BFF 进，BFF 会从 JWT 拿到 appId 填进请求），但它意味着：

- 如果有人新增一个 OLAP 查询入口，**忘了从 appId 注入 tenant 条件**，这个查询就会跨租户泄漏。
- 跟关系层"忘了注入 viewer 直接报错"的默认安全姿态**不对称**。

`events_fact` 的 DDL 注释也明说这个预期（ClickHouse 版）：

```sql
tenant_id UInt32 COMMENT '租户 ID（SaaS 多租户隔离，所有查询必须带此条件）',
```

"所有查询必须带此条件"——这是**靠约定**，不是靠强制。做 SaaS 二次开发时，这是一个要盯紧的点：**任何新的 OLAP 查询，第一步就是确认 `req.GetAppId()` 被正确解析并拼进 `tenant_id = ?`。**

为什么会这样设计？因为 OLAP 层走原生 SQL，**没有 ent 那样的查询构建器拦截层**，要自动注入谓词得自己造一套 SQL 重写机制，复杂度高。项目选择了"靠开发者自律 + DDL 注释提醒"的轻量方案。这是一个**诚实的工程取舍**——能 work，但不是默认安全。

### 3.3 物理布局补强

即便 OLAP 层的逻辑隔离靠手工，**物理布局**还是把租户聚集做到了极致，让"带 tenant_id 条件的查询"飞快：

- **ClickHouse** `ORDER BY (tenant_id, event_category, event_date, event_name, event_ts)`——`tenant_id` 是首列，租户数据在排序 part 里物理连续，查询能跳过无关 granule。
- **Doris** `DISTRIBUTED BY HASH(event_id, tenant_id) BUCKETS 16`——`tenant_id` 参与 hash，一个租户的数据落在确定的 bucket 子集。
- ClickHouse 的 `id_mapping` 表甚至**直接按租户分区**：`PARTITION BY tenant_id -- 按租户分区，支持多租户隔离`。

所以"逻辑层手工 + 物理层聚集"是配套的——前提是逻辑层**记得**带条件。

## 四、采集层：appId 权威覆盖

除了上面两层，**采集端还有第三道闸**（[第 3 篇](./03-sdk-and-collector.md) 详述）。这是租户安全的第一道、也是最关键的一道：

```go
// backend/app/collector/service/.../report_service.go
// 用应用所属的权威 tenant_id 覆盖每个事件，杜绝客户端伪造跨租户上报。
for _, event := range validEvents {
    event.TenantId = app.TenantID
}
```

`validateEvent` 故意**不校验 tenant_id**，注释解释：它反正会被服务端覆盖，客户端没必要（也无法有效）上报。`appId → tenantId` 的映射在 `AppAuthenticator.Authenticate` 里完成（appId 解析到应用记录 → 返回应用所属租户）。

**三道闸的分工：**

1. **采集端（Collector）**：appId 鉴权 → 权威覆盖 tenantId。防"上报伪造"。
2. **关系层（ent）**：JWT viewer → TenantPrivacy 自动过滤。防"配置数据越权读写"。
3. **OLAP 层（Core）**：appId → 手工拼 `tenant_id = ?`。防"分析数据跨租户查询"。

第 1、2 道是默认安全的；第 3 道靠约定。三者组合，整体安全模型成立。

## 五、鉴权与权限：JWT + Casbin

除了租户隔离，平台还有完整的认证授权体系。

### 5.1 双轨认证

| 场景 | 机制 | 凭证位置 |
|------|------|---------|
| 管理后台登录 | JWT（HS256） | Authorization Header |
| SDK 上报 | appId + appSecret | 请求 body（为了 sendBeacon） |

两套机制服务两类客户端：管理后台是人（用 JWT），SDK 是程序（用应用凭证）。权限粒度也不同——后台到按钮级，SDK 只到"这个应用能不能上报"。

### 5.2 权限引擎：Casbin / OPA

权限走策略引擎（Casbin 或 OPA），分三级：

- **菜单权限**：控制能看到哪些菜单
- **接口权限**：控制能调哪些 API
- **数据权限**：DataScope，控制能看到哪些 org-unit 的数据（`PermissionRule` 实现）

Casbin 的 RBAC with domains 模型天然适配多租户：`(sub, dom, obj, act)` 四元组里的 `dom` 就是租户。这让"同一个角色名在不同租户里有不同权限"成为可能。

### 5.3 Collector 鉴权的加固细节

[第 3 篇](./03-sdk-and-collector.md) 讲过的几个点在这里汇总，它们都属于"安全加固"：

- **Redis 只存 secret 哈希**——脱库不泄密。
- **constant-time 比较**——防时序攻击。
- **负缓存**——防缓存穿透爆破。
- **可用性≠鉴权失败**——网络抖动不误报为密码错。
- **状态检查**——禁用应用拒绝上报。

这些每一项都防一类真实攻击，组合起来才是生产级。

## 六、一个清醒的评估

讲了这么多机制，也要清醒地看到这套安全模型的**真实强度边界**：

**强的地方：**

- 采集端 appId 权威覆盖 + 加固鉴权，堵死了"伪造上报跨租户"。
- 关系层 ent TenantPrivacy fail-closed，配置数据越权几乎不可能（除非忘注入 viewer，那会直接报错）。
- 物理布局（ClickHouse ORDER BY 首列 / Doris hash 分桶）让租户聚集，性能和隔离双优。

**需要警惕的地方：**

- **OLAP 层 opt-in 隔离**——新增 OLAP 查询时必须自觉带 `tenant_id = ?`，否则跨租户泄漏。这是靠约定，不是靠强制。
- **双引擎编译期切换**——意味着生产部署时，选 ClickHouse 还是 Doris 是"一次定死"的，不能热切。
- **Kafka 消费未落地**（[第 1 篇](./01-architecture-overview.md)）——目前上报数据停在 Kafka，Core 的 `BatchCreate` 入库管线没接通。这是功能完整度问题，不是安全问题，但生产化前必须补。

把这些"需要警惕的地方"写出来，不是挑刺，而是**给二次开发者一张地图**——告诉你在哪里要格外小心。一个敢于在文档里写"OLAP 查询所有都必须带 tenant_id 条件"的项目，比一个声称"全自动零信任隔离"的项目，可信度更高。

## 七、系列结语

四篇拆解走到这里，我们把 GoWind UBA 从埋点到看板的全链路过了一遍：

1. [**架构总览**](./01-architecture-overview.md)：三服务职责、契约优先代码生成、SSE 推送。
2. [**OLAP/SQL 硬核**](./02-olap-sql-deep-dive.md)：双引擎、Schema 设计、25 个模型的真实 SQL、防注入。
3. [**SDK/采集层**](./03-sdk-and-collector.md)：批量/重试/sendBeacon/Unity WebGL/采集鉴权。
4. [**多租户/安全**](./04-multi-tenant-security.md)（本文）：两套隔离机制、JWT/Casbin、安全加固。

回头看，这套平台真正值得借鉴的，不是某一个"惊为天人的算法"，而是**一整套在真实工程约束下做出的一致取舍**：

- 双引擎用编译期常量而非运行期配置，换简单度；
- 漏斗用非严格口径换双引擎一致 + 近实时；
- 鉴权放 body 换 sendBeacon 兜底；
- OLAP 隔离 opt-in 换原生 SQL 的灵活；
- Kafka 消费未接通但文档诚实标注。

**每一个取舍都有得有失，且都被诚实地记录在代码注释和文档里。** 这才是工程文章该有的样子——不是"完美无缺、开箱即用"的软文，而是"在这些约束下我们这么选，代价是这些，你可以这么改"的硬核复盘。

如果你正在做数据分析平台、多租户 SaaS、或者 Go 微服务项目，这个仓库值得 clone 下来细读。它不完美，但**它的取舍方式和高代码质量**，是很好的参考样本。

仓库地址：**[github.com/tx7do/go-wind-uba](https://github.com/tx7do/go-wind-uba)**。欢迎 star、issue、PR。

---

*本文涉及的代码与策略出自 [go-wind-uba](https://github.com/tx7do/go-wind-uba)：
`backend/pkg/middleware/auth/`、`backend/pkg/entgo/viewer/`、`backend/app/core/service/internal/data/{doris,clickhouse}/`、`backend/app/collector/service/internal/service/`，以及依赖库 `github.com/tx7do/go-crud/entgo`（TenantPrivacy 实现）。*
