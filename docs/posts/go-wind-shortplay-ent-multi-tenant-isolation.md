---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
  - Ent
  - 多租户
sticky: 10
---

# GoWind ShortPlay 拆解：Ent privacy/viewer 多租户隔离——从中间件到 SQL 的零信任链

> 本文回答一个问题：**一条 SQL 都没手写的情况下，租户 A 的用户为什么绝不可能查到租户 B 的视频——连"漏一次"的机会都没有？**

多租户隔离最常见的死法是**应用层 WHERE**：每个仓储方法都记得写 `tenant_id = ?`，直到某天一个新同事写的接口忘了——于是租户 B 拉到了租户 A 的数据，没有任何报错。[GoWind ShortPlay](https://github.com/tx7do/go-wind-shortplay) 不信任任何人的记性：它把隔离下沉到 ORM 层（Ent 的 privacy 机制），**查询根本到不了 SQL 就被拦下补条件或直接拒绝**。全仓 51 张业务表的 schema 里没有一行手写的租户过滤代码，隔离却无处不在。

这条链路涉及四个角色：**身份注入（Kratos 中间件）→ Viewer（信任边界）→ Privacy Policy（求值规则）→ 落库兜底（写路径）**。逐个拆。

---

## 一、全链路：隔离发生在哪一环

```
HTTP 请求
  │
  ▼
Kratos 中间件链 (BFF)
  │  auth.Server: JWT 校验(回调 core) → 组装 OperatorMetadata
  │  ※ 顺序敏感:鉴权必须在 ent.Server 之前
  ▼
ent.Server 中间件 (pkg/middleware/ent)
  │  有 OperatorMetadata → UserViewer(uid, tid, 数据域)
  │  无(游客白名单)      → TenantResolver 按请求 Host 解析租户
  │                         成功 → AnonymousTenantViewer(只读匿名)
  │                         失败 → NoopContext(直接拒绝)
  ▼
viewer.WithContext(ctx) ──▶ service → repo → ent Query/Update
  │
  ▼
Ent runtime privacy 求值
  │  schema mixin.TenantID.Policy() → rule.TenantPrivacy.EvalQuery
  │    viewer 缺失        → Deny(报错,不是跳过)
  │    tid==0(平台/系统)  → 放行全量
  │    否则               → 注入 WHERE tenant_id = :tid
  ▼
SQL 执行(带租户条件)
```

隔离不是一层检查，是**一条链**：每一环只做自己那一截，但任何一环缺位，下一环会 fail-closed。

---

## 二、三种 Viewer：信任边界显式化

Viewer 是整条链的信任锚点（`pkg/entgo/viewer/`），全部实现 go-crud 的 `viewer.Context` 接口——UserID / TenantID / DataScope / `HasPermission()` / `IsSystemContext()` 等：

| Viewer | 语义 | 关键判定 |
|--------|------|---------|
| `UserViewer` | 已认证的租户/平台用户 | uid + tid + 数据域（ALL/UNIT/SELF 三档 DataScope 映射） |
| `AnonymousTenantViewer` | **游客（本仓新增，基座没有）** | tid>0、`UserID()==0`、`HasPermission()==false`、只读 |
| `SystemViewer` | 后台任务/系统上下文 | 全零 ID + `HasPermission()==true` + 平台/系统上下文 |
| `NoopContext` | 解析失败 | 什么都不满足，查询直接被 Deny |

值得展开的是 **`AnonymousTenantViewer` 为什么要存在**。直觉的做法是"游客嘛，给个 SystemViewer 放行算了"——这正是跨租户泄漏的经典入口。代码注释把这个 Viewer 与 SystemViewer 的三个关键差异写得很清楚：

1. **`TenantID()` 返回真实租户值**——查询才能按租户过滤（SystemViewer 全零，租户过滤失效）；
2. **`IsSystemContext()==false`**——TenantPrivacy 不再 bypass，照常按租户收口（堵住 SystemViewer 跨租户可见的洞）；
3. **无写权限**——游客天然只读。

游客不是"没有身份"，而是"**有租户、没用户、没权限**"的三元组——身份模型对了，隔离才对。

三种 Viewer 实现同一个接口（go-crud 的 `viewer.Context`），这个接口本身值得看一眼——它就是"身份"在这个系统里的完整定义：

```
UserID / TenantID / OrgUnitID        我是谁、属于哪个租户与组织
Permissions / Roles / DataScope      我能做什么、数据可见范围(ALL/UNIT/SELF 三档)
HasPermission(code)                  权限码判定
IsPlatformContext / IsTenantContext  平台面还是租户面(tid==0 分界)
IsSystemContext                      是否系统上下文(决定 TenantPrivacy 是否 bypass)
ShouldAudit / TraceID                审计开关与追踪标识
```

任何代码想判断"当前查询以什么身份在跑"，问的都是这一个接口——没有第二套身份表示，也就没有两套需要保持一致的判定逻辑。`UserViewer` 的 DataScope 三档还进一步决定了行级可见范围：`ALL` 看全租户、`UNIT` 看本部门（含子部门）、`SELF` 只看自己——租户隔离与组织内数据权限是同一个 Viewer 上的两档分辨率。

---

## 三、fail-closed：游客租户怎么解析，失败怎么办

游客请求（Feed / 详情 / 搜索这些白名单接口）没有 JWT，租户从哪来？app BFF 注入了一个 `TenantResolver`：按**请求 Host** 反查租户（`ResolveTenantIDByDomain`，经 gRPC 转发 core）——每个租户一个接入域名的经典 SaaS 形态。

关键在解析失败的分支（`pkg/middleware/ent/ent.go`）：

```
Host 为空 / 域名查不到租户 / 解析出 tid==0
    → viewer.NewNoopContext()   ← 直接拒绝
    → 绝不回退 SystemViewer     ← 注释原话:"避免跨租户泄漏"
```

这就是 **fail-closed**：身份解析不出来，宁可拒绝服务，不给默认放行。与之配套的还有两个精细件：

- **解析成功的隔离依然完整**：AnonymousTenantViewer 走的 TenantPrivacy 与登录用户同一条路径，Guest 看到的 Feed 天然只含本租户视频；
- **流式 RPC 单独补位**：SSE 是流式接口，unary 中间件链不覆盖——`InjectViewerForStream(ctx)` 为流单独注入，不留"流式接口无租户"的旁门。

---

## 四、Policy：一处 mixin，51 张表生效

业务表 schema 里找不到任何租户策略代码，因为策略长在 mixin 上（基座 go-crud 的 `TenantID[uint32]`，本仓 51 个 schema 挂载）：

```go
func (TenantID[IDT]) Fields() []ent.Field {
    return []ent.Field{
        field.Uint32("tenant_id").Immutable().Default(0).Nillable().Optional(),
    }
}
func (TenantID[IDT]) Policy() ent.Policy { return rule.TenantPrivacy[IDT]{} }
```

`TenantPrivacy.EvalQuery` 的三分支是整个隔离体系的核心判定：

```go
// 伪代码,语义忠实于原实现
func (p TenantPrivacy[T]) EvalQuery(ctx context.Context, q ent.Query) error {
	vc := viewer.FromContext(ctx)
	if vc == nil {
		return privacy.Deny                    // ① 无 viewer:报错,不是 Skip
	}
	if vc.IsPlatformContext() || vc.IsSystemContext() {
		return nil                             // ② 平台/系统面:跳过,放行全量
	}
	injectTenantWhere(q, vc.TenantID())        // ③ 租户面:注入 WHERE tenant_id = :tid
	return nil
}
```

两个设计决定值得单独说：

**Deny 而非 Skip。** 查询没带 viewer（比如某条代码路径绕过了中间件）时，策略选择报错而不是放行。多数手写多租户方案在"上下文缺失"时的默认行为是放行——那是把最危险的场景当成了最安全的。fail-closed 在这里是最后一道闸。

**反射注入 WHERE。** `injectTenantWhere` 用反射在任意生成的 Query 上构造变参 `Where(...)`，兼容不同实体生成代码的签名差异——**51 张表共用一段策略代码**，新表挂上 mixin 即被隔离，零增量成本。这是"schema 即代码"路线的真正回报：策略跟着 schema 走，而不是跟着仓储代码走。

---

## 五、写路径：比读路径更危险的地方

读路径漏了是越权可见，写路径漏了是**数据污染**——污染会顺着读路径扩散。TenantPrivacy 的 `EvalMutation` 对写有三层处理：

```go
// 伪代码,语义忠实于原实现
// 仅对 OpCreate 生效(Update/Delete 由读路径的租户 WHERE 限定范围,改不到别家行)
if 视图是平台/系统上下文 {
	尊重显式 SetTenantID        // 管理面代客建数据的合法场景
} else {
	强制 SetTenantID(viewer.TenantID())   // 请求体里的 tenant_id 一律覆盖
	// 优先强类型 SetTenantID(T) 接口,兜底反射 SetField,都不可用 → error
}
```

还有一个只有踩过才知道的坑：**系统上下文（tid==0）建业务行怎么办？**举报建单、异步抽帧、种子数据这些都运行在 SystemViewer 下，直接落库会写出 `tenant_id=0` 的行——租户用户永远查不到自己的数据，注释管这叫"**孤儿数据**"。兜底在 `data/business_tenant.go`：业务行写入统一走 `businessTenantID()`，系统上下文缺省归入缺省业务租户（进程内缓存解析 `shortplay` 租户 ID）。**"看得到点不了"这类事故，多数根源就是系统路径写出了租户过滤永远命不中的行。**

---

## 六、中间件顺序即安全语义

`rest_server.go` 里那段注释值得整段抄录，它是这条链上最容易断的一环：

> 鉴权必须在 ent.Server() 之前执行：auth.Server 对非白名单请求注入 OperatorMetadata，随后 ent.Server() 才能据此构建带租户作用域的 UserViewer。**若顺序颠倒，ent.Server() 总以 md==nil 兜底为 SystemViewer，导致租户隔离失效。**

顺序颠倒了不会有任何报错——每个请求照常 200，只是所有人突然都变成了 SystemViewer。这类"配置即安全语义"的约束，唯一的归宿就是写在代码旁边（以及像本文一样再写一遍）。

配套的还有 UBA 上报的 `UbaIdentityInjector`：上报接口在游客白名单内被短路了鉴权，但带有效 token 时尽力解析身份写回请求头——否则观看历史全部归因到 uid=0。**白名单跳过的是鉴权，不是身份**。

---

## 七、系统上下文：何时允许越过隔离

隔离体系必须有合法的越权通道，否则异步任务没法干活。约定很克制：

- **异步任务**（FFmpeg 抽帧、通知投递）显式构造系统上下文：`appViewer.NewSystemViewerContext(ctx)`——越权是**显式声明**的，代码里一眼可见；
- **管理面**（admin BFF / core 内部）不注入 TenantResolver，无操作者时兜底 SystemViewer——**内部管理面跨租户可见是特性**，与 C 端 app BFF 的 fail-closed 形成刻意的对照；
- **收件箱**这类"用户自己的数据"另有 `viewerUserIDFromContext` 强制按调用者过滤——租户隔离保证"别的公司看不到"，行级归属进一步保证"本公司别人也看不到我的收件箱"。两级过滤是两个独立的正交维度，混在一层里做迟早漏一边。

三种上下文、三种默认值，**没有一种默认是"放行所有租户"**——除了被显式声明为管理面的那一个。

---

## 八、方法论：把隔离做成结构，而不是约定

回头看这条链，可以提炼成四条可迁移的原则：

1. **隔离下沉到 ORM 层**——策略长在 schema mixin 上，新表零成本被隔离；应用层 WHERE 靠记性，privacy 靠结构；
2. **每一环 fail-closed**——viewer 缺失 Deny 而非放行、租户解析失败拒绝而非兜底 SystemViewer、写路径 tenant_id 强制覆盖；
3. **游客是身份模型，不是缺失的身份**——有租户、没用户、没权限，三元组各自显式；
4. **显式越权 + 归属标记**——系统上下文要在代码里喊出来（`NewSystemViewerContext`），系统路径写数据要有租户归属兜底，孤儿数据是隔离体系最常见的静默事故。

以及一条工程提醒：**链式安全的每一段依赖都有顺序**，把顺序敏感性写进中间件装配处的注释，比写进 Wiki 有用一百倍——后者没人看，前者就在 bug 旁边。

---

## 九、验证

想亲手验证隔离，两条路：

```bash
# 1. 游客 fail-closed:用未注册域名打游客接口
curl 'http://127.0.0.1:7700/app/v1/feed' -H 'Host: unknown.example.com'
# → 空结果或拒绝;绝不会看到缺省租户以外的数据

# 2. 写路径防越权:登录用户提交携带他人 tenant_id 的创建请求
# → 落库行的 tenant_id 被强制覆盖为 viewer 所属租户(可查库对照)
```

或者直接读代码：策略三分支在基座库的 `rule/tenant.go`，注入链在 `pkg/middleware/ent/ent.go`，游客 Viewer 在 `pkg/entgo/viewer/anonymous_viewer.go`——每个文件的头注释都值得读。

---

## 十、结语

GoWind ShortPlay 的多租户隔离没有一个"开关"或一个"中间件"，而是一条从 HTTP 中间件到 SQL 条件的完整链路：**身份注入 → Viewer 信任边界 → Policy 求值 → 写路径兜底**，四个环节共享同一个哲学——不确定时拒绝，而不是放行。这也是把它从 go-wind-cms 基座继承下来时唯一新增的身份原语是"游客 Viewer"的原因：架构已经闭环，缺的只是把游客当成一种正当身份。

仓库：

- GitHub：[github.com/tx7do/go-wind-shortplay](https://github.com/tx7do/go-wind-shortplay)
- Gitee：[gitee.com/tx7do/go-wind-shortplay](https://gitee.com/tx7do/go-wind-shortplay)
