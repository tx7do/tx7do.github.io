---
date: 2026-08-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - Vue
  - Shop
sticky: 10
---

# GoWind Shop 安全设计:JWT 鉴权、Ent 行级隔离、防篡改审计与四个真实漏洞修复

## 为什么写这篇

安全这件事,讲概念的多(纵深防御、最小权限、fail-closed),讲工程落地的少。一篇好的安全文章应该能回答:**这些概念具体落在哪几行代码里、它们怎么串成一条链、出过什么洞、怎么修的。**

这篇文章拆解一个真实仓库 go-wind-shop(GitHub: <https://github.com/tx7do/go-wind-shop>, Gitee: <https://gitee.com/tx7do/go-wind-shop>)的安全实现。它不讲"应该做什么",讲"实际做了什么、实际踩过什么坑、实际怎么修的"。文中会引用四个真实的 git commit,每个都是一个被修的安全洞——从漏洞存在、到发现、到修复代码,完整还原。

涉及的内容:JWT 双租户鉴权的分层校验、Casbin/OPA 授权引擎的运行时装载、Ent privacy 的行级隔离机制、防篡改审计的 hash+签名、BFF 的 fail-closed 反序列化、以及原子防爆破。最后是一份诚实的待加固清单——把"做了什么"和"还差什么"分开列,因为对安全方案最差的评价不是"有漏洞",而是"看不出哪里有漏洞"。

---

## 一、设计哲学:fial-closed 与纵深防御

两条主线贯穿整个安全设计。

**fail-closed(默认拒绝)。** 任何一环失败,默认拒绝,而不是默认放行。鉴权:无 token → 拒;checker 缺失 → 拒;token 无效 → 拒。授权:策略未命中 → 拒。行级隔离:无 viewer 上下文 → 报错,不返回数据。BFF 反序列化:解析失败 → 返回错误,不退化为原始输入。这和 fail-open(默认放行,出错才拒)是相反的取向——fail-open 更"好用",fail-closed 更"好防"。

**纵深防御(多层冗余)。** 同一安全属性由多层共同保证。归属字段:BFF 注入一次,core 再注入一次。token:签名校验 + Redis jti 有效性 + blocklist。越权写 RPC:从 proto 删 + BFF 不实现 + core 状态机白名单。一层被绕过,另一层兜底。

下面分层讲,每层都标注这两条主线在哪里体现。

---

## 二、认证:JWT HS256,双租户分治

### 2.1 两套 authenticator,按客户端类型分治

`app/core/service/configs/authenticator.yaml` 配置了**两套独立的 authenticator**,按 `ClientType`(admin / app)区分:

```yaml
admin:
  method: "HS256"
  key: "some_api_key"
  access_token_expires: 5400s       # 1.5 小时
  refresh_token_expires: 43200s     # 12 小时
app:
  method: "HS256"
  access_token_expires: 900s        # 15 分钟
  refresh_token_expires: 0s         # app 侧 refresh 禁用
```

设计意图:**后台运营 token 寿命长、可刷新;买家侧 token 寿命极短、且不可刷新。**

为什么这么分治?token 泄漏的爆炸半径。后台运营 token 泄漏,1.5 小时内可做大量高危操作,但后台用户数少、设备可控、有审计兜底,泄漏概率低。买家侧 token 泄漏,影响的是普通用户,且买家侧设备杂(手机、公共电脑)、网络不可控,泄漏概率高——所以买家侧 token 寿命压到 15 分钟,且 `refresh_token_expires: 0s` 禁用刷新,逼用户重新登录。高危操作(改密码、改支付)必须重新认证。

这是"按风险等级分层设计"的实例——不同信任域用不同 token 策略,而不是一刀切。

### 2.2 token 校验是分层且 fail-fast 的

`app/core/service/internal/data/authenticator.go` 构造 authenticator 时,配置错误直接 `panic`:

```go
func NewAuthenticator(ctx *bootstrap.Context) (authn.Authenticator, error) {
    cfg := /* 读 authenticator.yaml 对应 ClientType 段 */
    auth, err := authnJwt.NewAuthenticator(
        authnJwt.WithKey(cfg.GetKey()),
        authnJwt.WithSigningMethod(cfg.GetMethod()),
    )
    if err != nil {
        panic(err)   // 启动期 fail-fast
    }
    return auth, nil
}
```

注释明确写了"吞掉 err 会导致后续 nil 指针 panic,打断整条鉴权链"。这是"启动期 fail-fast"——配置错就启动不了,而不是带着半残的 authenticator 上线后运行期崩溃。这比静默降级安全得多。

`Authenticate()` 的校验是分层串行:

```go
func (a *Authenticator) Authenticate(ctx context.Context, token string) (*UserTokenPayload, error) {
    // ① HS256 签名 + claims 解析
    claims, err := a.authenticator.AuthenticateToken(token)
    if err != nil { return nil, ErrInvalidToken }

    // ② 过期检查
    if jwt.IsTokenExpired(claims) { return nil, ErrTokenExpired }

    // ③ claims → UserTokenPayload 映射
    payload, err := jwt.NewUserTokenPayloadWithClaims(claims)
    if err != nil { return nil, ErrInvalidToken }

    // ④ Redis jti/session 有效性(除非 SkipRedis)
    if !a.skipRedis {
        valid, err := a.userTokenCache.IsValidAccessToken(ctx, payload)
        if err != nil || !valid { return nil, ErrTokenRevoked }
    }

    // ⑤ blocklist 检查
    blocked, err := a.userTokenCache.IsBlockedAccessToken(ctx, payload)
    if err != nil || blocked { return nil, ErrTokenBlocked }

    return payload, nil
}
```

五个步骤,任一失败即拒。几个关键点:

**步骤 ③ 的 claims 映射。** JWT 的 custom claims(`uid`/`tid`/`ouid`/`ds`/roles)被映射到 `UserTokenPayload`(`pkg/jwt/user_token_payload.go`)。claim 键名定义为常量(`ClaimFieldUserID="uid"`、`ClaimFieldDataScope="ds"` 等),避免魔术字符串。

**步骤 ④ 的 Redis jti 校验。** 即使 token 签名有效且未过期,Redis 侧也可以撤销它——比如用户登出、改密码后,旧 token 的 jti 被从"有效集合"移除。这让"token 泄漏后即时吊销"成为可能,不必等过期。

**步骤 ⑤ 的 blocklist。** 支持主动拉黑某个 token,用于应急响应——发现某个 token 被滥用,直接拉黑,所有用它发的请求立刻失效。

这三层(签名/过期、Redis jti、blocklist)是纵深防御的体现——任何一层被绕过,另一层兜底。比如签名密钥泄漏了,攻击者伪造的 token 签名能过,但 jti 不在 Redis 有效集合里,步骤 ④ 会拒。

### 2.3 JWT HS256 vs RS256 的取舍

这个仓库用 HS256(对称签名),不是 RS256(非对称)。取舍:

| 维度 | HS256(对称) | RS256(非对称) |
|------|-------------|---------------|
| 密钥分发 | 签发方和校验方共享同一密钥 | 签发方持私钥,校验方持公钥 |
| 校验方能力 | 任何持密钥者都能签发 | 校验方只能验,不能签 |
| 性能 | 快(HMAC) | 慢(RSA 运算) |
| 适用 | 签发方=校验方 | 签发方≠校验方(分布式) |

这个架构里 token 签发和校验**都在 core 服务**(authenticator 在 core),BFF 只是通过 gRPC 调 core 的 `AuthenticationService.ValidateToken` 做校验——BFF 本身不持密钥。所以"签发方=校验方"成立,HS256 是合适的。

如果未来变成"多个独立的服务各自校验 token 而不调 core",那时 RS256 更合适(每个服务持公钥验,私钥只在 core)。当前架构下 HS256 没问题。

---

## 三、鉴权中间件:authn + authz 合一,fail-closed

`pkg/middleware/auth/auth.go` 的 `Server()` 是中央闸门。逻辑极简但每步 fail-closed:

```go
func (op *authnOp) Server() middleware.Middleware {
    return func(handler middleware.Handler) middleware.Handler {
        return func(ctx context.Context, req interface{}) (interface{}, error) {
            // ① 从 Authorization 头取 Bearer token
            token, err := op.authnEngine.AuthFromMD(ctx, op.authnEngine.BearerWord)
            if err != nil {
                return nil, ErrMissingBearerToken          // 没 token → 拒
            }
            // ② checker 必须存在
            if op.accessTokenChecker == nil {
                return nil, ErrAccessTokenCheckerNotConfigured  // checker 缺 → 拒
            }
            // ③ token 校验(调用 core authentication gRPC)
            valid, tokenPayload := op.accessTokenChecker.IsValidAccessToken(ctx, token)
            if !valid {
                return nil, ErrAccessTokenExpired           // 无效 → 拒
            }
            // ④ 注入 viewer 和 operator metadata(只有校验通过才到这)
            ctx = NewContext(ctx, tokenPayload)
            ctx = viewer.WithContext(ctx, /* UserViewer */)
            ctx = metadata.AppendToClientContext(ctx, /* operator headers */)
            return handler(ctx, req)
        }
    }
}
```

三个 reject 分支,一个注入分支。关键点:

**步骤 ② 的 checker nil 检查。** 这是"配置错误时 fail-closed"的实例。如果某个服务忘了配 `WithAccessTokenChecker`,`op.accessTokenChecker` 是 nil,中间件直接拒——而不是放行让请求进 handler。这防止"配错就裸奔"。

**步骤 ③ 的校验委托。** `op.accessTokenChecker` 是 `auth.NewTokenChecker`(在 `internal/data/providers/wire_set.go` 注入),它内部通过 gRPC 调 core 的 `AuthenticationService.ValidateToken`。core 侧执行上一节的五步校验。BFF 不持 JWT 密钥,校验完全委托 core——密钥只在 core 一处。

**步骤 ④ 的 viewer 注入。** 校验通过后,tokenPayload 被注入 ctx,并构造 `UserViewer`(携带 uid/tenantId/orgUnitId/dataScope)挂进 Ent 的 viewer context。这个 viewer 是后面行级隔离的输入。**注意:只有校验通过才注入——无 token 或无效 token 的请求到不了这,自然没有 viewer,后续 core 的 Ent privacy 会因"无 viewer"而 fail-closed。**

**步骤 ④ 的 metadata 注入。** operator 信息通过 gRPC metadata 头传给 core。core 的 `ent.Server()` 中间件(下一节)从 metadata 重建 viewer。这是"viewer 跨服务传递"的机制。

### 3.1 白名单:登录端点豁免

登录、验证码这类端点不能要求先有 token(否则没法登录)。它们通过显式白名单豁免:

```go
// server 装配时
rpc.AddWhiteList(
    adminV1.OperationAuthenticationServiceLogin,
    adminV1.OperationAuthenticationServiceGetCaptcha,
)

// 中间件用 selector + 白名单 matcher
ms = append(ms, selector.Server(
    auth.Server(...),
    authz.Server(authorizer),
).Match(rpc.NewRestWhiteListMatcher()).Build())
```

`selector` 是 kratos 的条件中间件——`Match(whiteListMatcher)` 决定哪些请求过 auth+authz,哪些跳过。白名单用 operation 名(`OperationAuthenticationServiceLogin`)精确匹配,不是路径通配。只有 `AddWhiteList` 显式登记的 operation 跳过鉴权,其余一律必过。

这个设计的踩坑点:**白名单要用 operation 名,不能用 HTTP 路径。** 路径匹配容易被绕过——比如 `/admin/v1/auth/login` 和 `/admin/v1/auth/login/` 和 `/admin/v1/auth/login?x=1` 在路径匹配里是三个字符串,容易漏。operation 名是 kratos 生成的枚举(`OperationAuthenticationServiceLogin`),一个 operation 对应一个,不会因路径变体而漏配。

---

## 四、授权:Casbin/OPA,策略运行时从 DB 装载

### 4.1 引擎可插拔

`pkg/authorizer/authorizer.go` 是引擎工厂,`newEngine()` 按 config 切换:

```go
func newEngine(cfg *config.Authorizer) authzEngine.Engine {
    switch cfg.GetType() {
    case "noop":
        return &noopEngine{}
    case "casbin":
        return newCasbinEngine(cfg)
    case "opa":
        return newOpaEngine(cfg)
    case "zanzibar":
        return nil  // 未实现
    }
    return &noopEngine{}   // 未知类型 → noop(默认拒绝)
}
```

三种引擎:`noop`(全部拒绝,用于测试)、`casbin`(基于 RBAC 策略矩阵)、`opa`(基于 rego 规则)。`zanzibar`(Google 的关系型授权)未实现。**默认 fallback 是 noop——全拒,不是全放**,这是 fail-closed。

### 4.2 策略运行时从 DB 装载

`init()` 调 `ResetPolicies()`:

```go
func (e *engine) ResetPolicies() error {
    // ① 从 DB 拉实时的 {roleCode → [{path, method, domain}]} 映射
    policies, err := e.provider.ProvidePolicies(ctx)
    if err != nil { return err }

    // ② 按引擎类型生成策略规则
    switch e.cfg.GetType() {
    case "casbin":
        rules := e.generateCasbinPolicies(policies)   // 生成 p, roleCode, path, method, domain
        e.enforcer.ClearPolicy()
        e.enforcer.BatchAddPolicies(rules)
    case "opa":
        jsonPolicies := e.generateOpaPolicies(policies)  // 生成 per-role JSON
        e.opa.PutData("rbac_policies", jsonPolicies)
        // 加载 rbac.rego 模型
        model, _ := e.provider.ProvideModels("opa")
        e.opa.PutModule("rbac", model)
    }
    return nil
}
```

Casbin 模式生成的规则:

```go
func (e *engine) generateCasbinPolicies(policies map[string][]Policy) []casbin.PolicyRule {
    var rules []casbin.PolicyRule
    for roleCode, polys := range policies {
        for _, p := range polys {
            rules = append(rules, casbin.PolicyRule{
                PType: "p",
                V0:    roleCode,       // 角色
                V1:    p.Path,         // API 路径模板
                V2:    p.Method,       // HTTP 方法
                V3:    p.Domain,       // 租户域
            })
        }
    }
    return rules
}
```

关键设计:**角色→API 权限映射存在 DB 里,引擎启动时拉取并装载。** 运营在"角色管理"页面改了某角色的 API 权限,`ResetPolicies()` 重新拉取即生效,无需重启服务。这把"权限变更"从"改代码+发版"降到了"改 DB 数据+热重载"。

### 4.3 每请求判定

`pkg/middleware/auth/utils.go` 的 `processAuthz()` 构建 `AuthClaims`:

```go
func processAuthz(ctx context.Context, tokenPayload *UserTokenPayload, tr transport.Transport) (context.Context, error) {
    var path, action string
    if htr, ok := tr.(*http.Transport); ok {
        // HTTP 传输:用匹配到的路由模板和 HTTP 方法
        path   = authzEngine.Resource(htr.PathTemplate())
        action = authzEngine.Action(htr.Request().Method())
    } else {
        // gRPC:动作统一为 ANY
        action = authzEngine.Action("ANY")
        path   = /* 从 gRPC method 提取 */
    }

    authzClaims := authzEngine.AuthClaims{
        Subjects: trans.Ptr(tokenPayload.GetRoles()),   // 来自 token 的角色
        Action:   trans.Ptr(action),
        Resource: trans.Ptr(path),
    }
    ctx = authz.NewContext(ctx, &authzClaims)
    return ctx, nil
}
```

注意 `htr.PathTemplate()`——用的是 kratos 匹配后的**路由模板**,不是原始 URL。比如请求 `/admin/v1/mall/brands/123`,pathTemplate 是 `/admin/v1/mall/brands/{id}`。策略里配的也是模板,不是具体 ID。这避免了"每个资源 ID 配一条策略"的爆炸,也让"路径变体绕过"(`brands/123/`、`brands/123?x=1`)失效——模板都一样。

判定由 `authz.Server(authorizer)`(kratos-authz 中间件)用已加载策略完成。**策略未命中即拒绝,请求到不了 handler。** 与鉴权同样的 fail-closed。

### 4.4 Casbin vs OPA vs 自研 ACL 的取舍

| 维度 | Casbin | OPA | 自研 ACL |
|------|--------|-----|----------|
| 模型 | RBAC/ABAC 预定义模型 | rego 规则语言,任意逻辑 | 手写 |
| 策略存储 | 文件/DB | 文件/data API | DB |
| 性能 | 高(C 级引擎) | 中(解释执行) | 取决于实现 |
| 灵活度 | 中(受模型约束) | 高(rego 图灵完备) | 高 |
| 审计 | 内置 | 内置 | 需自建 |
| 学习曲线 | 中 | 高(rego) | 低 |

这个仓库让引擎可插拔,按场景选:RBAC 场景用 Casbin(性能好、模型成熟);需要复杂策略(如"工作时间内、本部门、且数据敏感级≤3")用 OPA。默认 noop 全拒。这个取舍把"授权引擎"从框架硬编码变成可配置,避免了"换引擎要改代码"。

---

## 五、行级隔离:Ent privacy + Tenant mixin

这是整套安全设计里最核心的一块。它把"防越权"从"业务代码里记得加 WHERE"升级成了"框架级强制"。

### 5.1 UserPrivacy 策略逐行

`pkg/entgo/privacy/user_scope.go` 实现了 `ent.Policy`:

```go
type UserPrivacy struct {
    ColumnName string   // 可参数化的归属列名,默认 "user_id"
}

func (p UserPrivacy) userColumn() string {
    if p.ColumnName != "" {
        return p.ColumnName
    }
    return "user_id"
}

func (p UserPrivacy) EvalQuery(ctx context.Context, query ent.Query) error {
    viewer, ok := viewer.FromContext(ctx)
    if !ok {
        return ErrViewerMissing          // ① 无 viewer → 报错(fail-closed)
    }
    if viewer.IsPlatformContext() || viewer.IsSystemContext() {
        return nil                        // ② 系统/平台上下文 → 放行
    }
    uid := viewer.UserID()
    return injectUserWhere(query, p.userColumn(), uid)  // ③ 注入 WHERE
}

func (p UserPrivacy) EvalMutation(ctx context.Context, m ent.Mutation) error {
    viewer, ok := viewer.FromContext(ctx)
    if !ok {
        return ErrViewerMissing          // 同样 fail-closed
    }
    if viewer.IsPlatformContext() || viewer.IsSystemContext() {
        return nil
    }
    uid := viewer.UserID()
    // Create 时:服务端覆写归属字段,无视客户端传入
    if m.Op() == ent.OpCreate {
        return injectUserWhereMutation(m, p.userColumn(), uid)
    }
    // Update/Delete:注入 WHERE,防止改到别人的行
    return injectUserWhere(m.Query(), p.userColumn(), uid)
}
```

三个分支,逐条说明:

**① 无 viewer → 报错。** 这是 fail-closed 的核心。如果一个查询请求没有 viewer 上下文(说明它没经过鉴权中间件,或鉴权失败),privacy 策略直接报错,不返回任何数据。这保证了"无身份即无数据"——即使 handler 被非法调到,Ent 这层也会拦住。

**② 系统/平台上下文 → 放行。** 审计写入、跨租户管理这类系统操作用 `SystemViewer`,跳过行级过滤。但 `SystemViewer` 只在特定路径(如审计中间件)注入,业务 handler 拿不到。

**③ 注入 WHERE。** `injectUserWhere` 通过反射拿到 Ent 的 query builder,注入 `WHERE <column> = <uid>`。注入用的是 entql 的 `func(s *sql.Selector)` 钩子:

```go
func injectUserWhere(query ent.Query, column string, uid uint32) error {
    whereCond := []func(s *sql.Selector){
        func(s *sql.Selector) {
            s.Where(sql.EQ(s.C(column), uid))   // WHERE column = uid
        },
    }
    // 应用到 query(builder.Modify 是 --feature sql/modifier 提供的)
    return query.Modify(whereCond...)
}
```

**业务代码完全无感**——它写 `r.entClient.Client().Order.Query().All(ctx)`,Ent privacy 自动追加 `WHERE user_id = <viewer.uid>`。漏写 WHERE 不可能,因为不是业务代码写的。

### 5.2 EvalMutation 的 Create 覆写

`EvalMutation` 对 Create 操作有个特殊处理:不注入 WHERE(Create 还没行,没法 WHERE),而是**服务端覆写归属字段**:

```go
if m.Op() == ent.OpCreate {
    // 设置归属字段为当前 viewer 的 uid,无视客户端传入
    m.SetUserID(uid)   // 通过反射调用 Set<ColumnName>
}
```

这防止"客户端伪造 user_id 创建别人的行"。比如买家下单时,客户端传 `user_id: 99999`(别人的 id),privacy 策略在 Create 时强制覆写成当前 viewer 的 uid。客户端传什么都白搭。

### 5.3 可参数化列名:bc9e015 加固的故事

这是第一个真实加固案例(commit `bc9e015`)。

**漏洞背景:** 早期 `UserPrivacy` 硬编码 `s.C("user_id")`,即所有用 `UserPrivacy` 的表,归属列都必须叫 `user_id`。但 `internal_message_recipient` 表(站内消息收件人)的归属列叫 `recipient_user_id`——语义不同(是"收件人"不是"创建者"),列名也不同。因为这个列名不匹配,`internal_message_recipient` 表无法用 `UserPrivacy`,意味着它的查询没有行级隔离——**任何买家都能看到所有买家的站内消息**。

**修复:** commit `bc9e015` 给 `UserPrivacy` 加了可参数化的 `ColumnName` 字段:

```go
type UserPrivacy struct {
    ColumnName string   // 新增,允许指定归属列名
}
```

`internal_message_recipient` 的 Schema 改为:

```go
// backend/app/core/service/internal/data/ent/schema/internal_message_recipient.go
func (InternalMessageRecipient) Policy() ent.Policy {
    return appPrivacy.UserPrivacy{ColumnName: "recipient_user_id"}
}
```

这样 `UserPrivacy` 会用 `recipient_user_id` 列做行级隔离,而不是默认的 `user_id`。已有用 `UserPrivacy{}`(默认 user_id)的 7 张表行为不变。

**这个修复的工程意义:** 它把"行级隔离"从"列名必须叫 user_id"的硬约束,变成了"任意列名可声明"的软约束。之前是"列名不对就没法隔离",之后是"声明一下列名就能隔离"。这降低了行级隔离的接入成本,后续新增的表只要声明 `ColumnName`,不用改框架代码。

### 5.4 租户是另一条隔离轴

viewer 还携带 `tid`(tenant id),配合 `mixin.TenantID[uint32]{}` 给表加 `tenant_id` 列并注入租户谓词。所以一行数据的隔离是 `tenant_id` AND `user_id`——跨租户、跨用户都防。

`DataScope` 枚举(`ALL`/`UNIT_ONLY`/`UNIT_AND_CHILD`/`SELF`)进一步控制组织架构内的可见范围——这是给后台运营的"数据范围"控制(比如某运营只能看本部门的数据),由 `ConvertDataScope()` 从 identity 枚举映射。

### 5.5 Ent privacy vs 业务手写 WHERE vs DB RLS

| 方案 | 漏写风险 | 性能 | 灵活度 | 审计 |
|------|---------|------|--------|------|
| Ent privacy(本方案) | 零(框架强制) | 高(注入到 SQL) | 中(按列隔离) | 易(策略集中) |
| 业务手写 WHERE | 高(漏一处即越权) | 高 | 高 | 难(分散) |
| DB RLS(PostgreSQL) | 零(DB 强制) | 高 | 低(只按 DB 用户) | 难(跨层) |

业务手写 WHERE 的痛点:"漏一处即越权"。几十张表、几百个查询,靠人自觉加 `WHERE user_id = ?` 必然漏。Ent privacy 把这个变成 Schema 上一次声明,之后所有查询框架强制注入——漏写的成本从"运行时越权漏洞"降到"编译期缺一行"。

DB RLS 也能做到框架级强制,但它绑定 DB 用户(每个请求要用不同的 DB 连接身份),对连接池不友好,且跨层(应用层不知道隔离规则)调试难。Ent privacy 在应用层注入,调试时能看到完整 SQL,更透明。

这个仓库选 Ent privacy 的核心理由:**把行级隔离从"人自觉"变成"框架强制",且在应用层可观测。**

---

## 六、BFF fail-closed + 越权写 RPC 裁剪

近期的几个安全 commit 集中处理"预留攻击面"和"BFF 降级"两类问题。这是第二个真实加固案例群。

### 6.1 裁剪买家侧的越权写 RPC(commit 7ac25ff, f82faa0)

**漏洞背景:** 买家(app)侧的 proto 原本暴露了一些它不该直接调用的写 RPC。即使前端没调用这些 RPC,接口暴露着就是攻击面——攻击者可以直接构造 HTTP 请求调这些"前端没调但接口露着"的 RPC,实现越权。

比如 `OrderItemService` 暴露了 `Create`/`BatchCreate`/`Update`/`Delete`,但买家侧的订单项是 core 的 `order_service.Create` 事务内插入的,买家侧根本不需要直接操作订单项。这些暴露的 RPC 就是"预留攻击面"——攻击者可以直接 `POST /app/v1/order-items` 往别人的订单里塞东西。

**修复:** commit `7ac25ff` 和 `f82faa0` 从 app proto 和 BFF 里删了这些 RPC,且**删除前验证了前端 composables 的调用点为 0**:

| 服务 | 买家侧裁剪 | 保留 |
|------|-----------|------|
| `PaymentTransactionService` | 删 `Update`/`Delete` | `List/Count/Get/Create` |
| `OrderService` | 删 `Delete` | `Update`(仅状态机:取消/确认) |
| `OrderItemService` | 删 `Create/BatchCreate/Update/Delete` | 无 |
| `PaymentRefundService` | 删 `Update`/`Delete` | `List/Count/Get/Create`(仅申请退款) |

关键:**admin proto/BFF 保留完整 CRUD**——裁剪是按客户端层级定制的。admin 后台需要全量管理能力,app 买家侧只需要有限的"读 + 申请"能力。

这个裁剪的工程意义:**最小攻击面原则。** 接口面越小,能被攻击的路径越少。暴露"前端没调但接口露着"的 RPC,等于免费给攻击者留后门——即使鉴权配对了,多一个接口就多一个可能被绕过的点。删 RPC 是从 proto 层面消除,不是靠前端不调、不是靠鉴权拦截——后两者都是"运行时防御",删 RPC 是"结构上不存在"。

### 6.2 BFF 反序列化 fail-closed(commit bc9e015 的另一半)

**漏洞背景:** `InternalMessageRecipientService.ListUserInbox`(app BFF)原本有个洞。这个接口接收客户端传入的 `query` JSON,用于分页过滤。原始代码逻辑大致:

```go
// 修复前(伪代码)
queryMap := map[string]any{}
if raw := req.GetQuery(); raw != "" {
    json.Unmarshal([]byte(raw), &queryMap)   // 解析失败,queryMap 是空 map
    // 但如果 raw 本身是合法 JSON,queryMap 就含客户端传的所有 key
}
// 然后 queryMap 被原样塞进 paging request 转发 core
```

问题在两个层面:

1. **JSON 解析失败时静默降级。** 如果 `raw` 不是合法 JSON,`Unmarshal` 返回 error,但代码没检查 error,`queryMap` 是空 map——这还好。但如果 `raw` 是合法 JSON(攻击者构造的),`queryMap` 就含攻击者传的所有 key,包括 `recipientUserId`。攻击者可以传 `{"recipientUserId": 99999}` 读别人的收件箱。
2. **无强制归属。** `recipientUserId` 由客户端传入,BFF 没覆写,core 虽然有 `UserPrivacy` 兜底(5.3 的修复),但 BFF 层不应该信任客户端传的归属字段。

**修复:** commit `bc9e015` 把这两层都补上:

```go
// 修复后(app/app/service/internal/service/internal_message_recipient_service.go)
queryMap := map[string]any{}
if raw := req.GetQuery(); raw != "" {
    if jErr := json.Unmarshal([]byte(raw), &queryMap); jErr != nil {
        return nil, appV1.ErrorInternalServerError("internal error")   // ① fail-closed
    }
}
queryMap["recipientUserId"] = userId                                    // ② 强制注入
newJSON, mErr := json.Marshal(queryMap)
if mErr != nil {
    return nil, appV1.ErrorInternalServerError("internal error")        // ③ fail-closed
}
req.FilteringType = &paginationV1.PagingRequest_Query{Query: string(newJSON)}
```

三个变化:

**① 反序列化失败 fail-closed。** 之前解析失败静默继续,现在返回 500。这防止"攻击者构造畸形 JSON 触发降级,绕过过滤"。

**② 强制注入归属。** BFF 把 `recipientUserId` 覆写成当前用户 id,客户端传什么都白搭。这把"归属"从"客户端传"变成"BFF 强制"。

**③ 序列化也 fail-closed。** 之前 marshal 失败也没处理,现在返回 500。

**core 侧再加一层。** commit message 写"schema Policy 已兜底,此为第二层"。即使 BFF 注入被绕过(比如将来某人不小心删了 ②),core 侧的 `UserPrivacy{ColumnName: "recipient_user_id"}`(5.3 的修复)会从 viewer context 重建 `recipientUserId`,再次注入。这是纵深防御——BFF 注入一层,core 注入一层,两层独立,任一被绕都还有兜底。

### 6.3 fail-closed vs fail-open 的取舍

```go
// fail-open:解析失败就放行原始请求
if jErr := json.Unmarshal(...); jErr != nil {
    // 忽略 error,继续用 raw
}
// fail-closed:解析失败就拒绝
if jErr := json.Unmarshal(...); jErr != nil {
    return nil, ErrInternalServerError
}
```

fail-open 更"好用"(解析失败也不影响请求),但安全性差——攻击者可以构造触发解析失败的输入,绕过后续逻辑。fail-closed 更"好防"(解析失败直接拒),但可能因偶发的解析错误误拒合法请求。

对安全敏感的归属字段,fail-closed 是唯一正确选择。宁可偶发误拒,不可放过越权。这个仓库在所有涉及归属/过滤的 BFF 路径都用 fail-closed。

---

## 七、防篡改审计:SHA-256 + ECDSA 签名

审计不是"记个日志"那么简单——记下来的日志本身可能被改。这套架构给审计日志加了链式完整性。

### 7.1 覆盖面

审计分六类,各自有独立的实体、service、repo:`api`、`login`、`data-access`、`operation`、`permission`、`policy-evaluation`。admin BFF 把它们注册成 HTTP 服务(`RegisterApiAuditLogServiceHTTPServer` 等),供后台审计页面查询。

### 7.2 捕获内容

`pkg/middleware/logging/api_audit_log.go` 是 kratos trailing middleware(在 handler 执行后触发):

```go
func (m *apiAuditLogMiddleware) Handle(ctx context.Context, htr transport.Transport, middleErr error, latencyMs int64) {
    // 从 transport 取请求信息
    auditLog := &auditV1.ApiAuditLog{
        HttpMethod:    htr.Request().Method,
        ApiOperation:  htr.Operation(),           // kratos 匹配的 operation 名
        PathTemplate:  htr.PathTemplate(),
        RequestUri:    htr.Request().RequestURI,
        RequestBody:   /* 请求体 */,
        ClientIp:      /* 真实 IP(穿透代理) */,
        Referer:       htr.Request().Referer(),
        RequestId:     /* X-Request-Id */,
        // 从 token 推导
        UserId:        tokenPayload.UserId,
        TenantId:      tokenPayload.TenantId,
        Username:      tokenPayload.Username,
        // 运行时
        StatusCode:    /* 响应状态码 */,
        Reason:        /* 失败原因 */,
        Success:       middleErr == nil,
        Latency:       latencyMs,
        // 地理/设备
        GeoIp:         /* geo-ip 解析 */,
        DeviceInfo:    /* UA 解析 */,
    }
    // 算 hash + 签名(下一节)
    // 通过 SystemViewer 写入 core audit gRPC
}
```

登录审计(`login_audit_log.go`)额外记 `ActionType`(LOGIN/LOGOUT)、失败原因,并计算**风险评分**:

```go
func computeRiskScore(log *auditV1.LoginAuditLog) (score int, level string, factors []string) {
    // 风险因子:FAILED_LOGIN / UNKNOWN_USER / UNKNOWN_DEVICE / MFA_FAILED /
    //           IP_MISSING / INTERNAL_IP / PASSWORD_FAILURE / HIGH_RISK_SCORE
    // 每个因子加若干分,总分映射到 LOW/MEDIUM/HIGH/CRITICAL
}
```

这个风险评分机制把"异常登录"从"靠人肉看日志发现"变成"自动标记"。比如某账号 1 分钟内 5 次 PASSWORD_FAILURE + UNKNOWN_DEVICE → HIGH,审计页面可按 HIGH 筛查。

### 7.3 防篡改:hash + 签名

落库前,两条完整性字段被算好附上:

```go
func (m *apiAuditLogMiddleware) write(log *auditV1.ApiAuditLog) {
    // ① LogHash = SHA-256(protobuf 确定性序列化,排除 log_hash/signature 自身)
    log.LogHash = hashLog(log)

    // ② Signature = ECDSA 签名(tenant_id + user_id + username + created_at + log_hash)
    log.Signature = signLog(m.ecPrivateKey, log)

    // ③ 用 SystemViewer 写入(绕过行级隔离)
    ctx := appViewer.NewSystemViewerContext(ctx)
    m.apiAuditLogClient.Create(ctx, log)
}
```

**`hashLog` 的确定性序列化。** protobuf 有"确定性序列化"模式,同一消息两次序列化字节一致。`hashLog` 把 audit log 消息(排除 `log_hash`/`signature` 两个字段)确定性序列化,算 SHA-256。任何字段篡改会让 hash 对不上。

**`signLog` 的 ECDSA 签名。** 用配置的 EC 私钥,对 `tenant_id + user_id + username + created_at + log_hash` 拼接签名,DER 编码。这把"身份+时间戳+hash"三者绑定到签名——伪造日志需要 EC 私钥,而私钥不在 DB 里(在配置/KMS 里)。

**链式 custody。** 这构成一个 custody 链:任何字段篡改 → hash 变 → 与签名里的 hash 对不上 → 篡改可见。伪造整条日志需要 EC 私钥。后台审计页面可校验 hash + 签名,标记"被篡改"的记录。

**SystemViewer 写入。** 审计写入用 `SystemViewer` 而非 `UserViewer`,跳过行级隔离——否则审计中间件以"无 viewer"会被 privacy 拒,写不进去。

### 7.4 一个有意的不对称

admin BFF 把审计转发到 core audit gRPC;但 **app BFF 装的是 no-op writer**:

```go
// app/app/service/internal/server/rest_server.go
ms = append(ms, applogging.Server(
    WithWriteApiLogFunc(func(...) error { return nil }),    // no-op
    WithWriteLoginLogFunc(func(...) error { return nil }),  // no-op
))
```

买家侧的审计在 BFF 层被静音。这是设计取舍,不是疏漏——买家侧的高频请求(浏览商品、加购物车)如果全量审计,数据量爆炸,且审计价值低(买家行为主要靠行为分析,不是操作审计)。后台运营的高危操作才需要全量审计。这个不对称是"按风险等级分层审计"的体现。

### 7.5 防篡改审计 vs 普通日志 vs 区块链

| 方案 | 防篡改 | 成本 | 可验证 |
|------|--------|------|--------|
| 普通日志 | 无 | 低 | 无 |
| hash + 签名(本方案) | 单点防篡改(需私钥才能伪造) | 中 | 是(校验 hash+签名) |
| 区块链 | 共识级防篡改 | 极高 | 是 |

普通日志最易被改(改文件/改 DB 行无痕迹)。区块链最防篡改但成本极高(每条审计上链,吞吐量不可承受)。hash+签名是中间路线——单点防篡改(攻击者改 DB 行会让 hash 对不上,但要伪造整条需要 EC 私钥),成本可控,且支持事校验。对"操作审计"这个场景(目的是事后追责,不是实时防篡改),hash+签名是合适的折中。

---

## 八、其他加固项

### 8.1 防爆破:原子 Lua 脚本(commit 662e0b0)

**漏洞背景:** 重置密码时要用重置码验证。原始实现是"先 GET 码、再 INCR 失败次数"两个 Redis 命令:

```go
// 修复前(伪代码)
code := redis.Get("resetcode:123")         // ① 取码
if code != userInput {
    attempts := redis.Incr("attempts:123")  // ② 失败次数+1
    if attempts > MaxAttempts { return ErrTooMany }
}
```

这个两命令模式有个 TOCTOU(Time-of-Check-Time-of-Use)漏洞:**并发请求可以在 ① 和 ② 之间穿过。** 比如攻击者同时发 5 个请求,都在 ① 时看到 `attempts=4`(还没到上限),然后各自 ② 把 attempts 加到 9——但 MaxAttempts 是 5,这 5 个请求都通过了校验。即"并发可绕过 MaxAttempts"。

**修复:** commit `662e0b0` 改成单条 Lua 脚本,原子执行:

```go
// pkg/resetcode/store.go
const verifyScript = `
local code = redis.call('GET', KEYS[1])
if not code then return 'NO_CODE' end
if code ~= ARGV[1] then
    local attempts = redis.call('INCR', KEYS[2])
    redis.call('EXPIRE', KEYS[2], 3600)
    if attempts > tonumber(ARGV[2]) then
        redis.call('DEL', KEYS[1])
        return 'TOO_MANY'
    end
    return '0'   -- 错误码
end
redis.call('DEL', KEYS[1])
return '1'       -- 正确
`
```

Redis 的 Lua 脚本是原子执行——check、compare、INCR、EXPIRE、DEL 全在一个脚本里,中间不会有其他命令插入。返回 `1`(正确)/`0`(错误码错)/`TOO_MANY`(超限)/`NO_CODE`(码已过期)。业务侧 `app/app/service/internal/service/authentication_service.go` 把 `TOO_MANY` 映射成 `ErrorTooManyRequests("too many failed attempts, please request a new code")`。

这个修复的工程意义:**把"check-then-act"的并发漏洞用原子操作消除。** 任何"先读后写"且依赖读结果决定写的逻辑,在并发下都有 TOCTOU 风险,用原子操作(事务/Lua/乐观锁)是正解。

### 8.2 存储型 XSS 净化(commit 2be008a)

**漏洞背景:** 后台站内消息、公告组件用 `v-html` 渲染服务端返回的 HTML。如果消息内容含 `<img onerror=alert(1)>` 或 `<script>`,直接 v-html 会执行,形成存储型 XSS——运营在后台看消息时触发。

**修复:** commit `2be008a` 引入 [`dompurify@^3.4.7`](https://github.com/cure53/DOMPurify) 和 `utils/sanitize.ts`。白名单缩到基础格式标签(`<b>`/`<i>`/`<p>`/`<br>`/`<a>`),strip `iframe`/`video`/`svg`/`math`/`script`,禁 `javascript:` 协议。`NoticeDropdown/index.vue` 和 `internal_message/inbox/index.vue` 的 v-html 前包 `sanitizeHtml`:

```ts
// frontend/admin/src/utils/sanitize.ts
import DOMPurify from 'dompurify'
const ALLOWED_TAGS = ['b','i','p','br','a','ul','ol','li','strong','em']
const ALLOWED_ATTR = ['href']
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR })
}
export function sanitizeToPlainText(dirty: string): string {
  // strip 所有标签,纯文本
}
```

`stripHtml` 函数也从 `innerHTML` 改成 `sanitizeToPlainText`——之前用 `innerHTML` 取 textContent 会被 `<img onerror>` 触发(因为浏览器解析 img 时执行 onerror),改成 DOMPurify 的纯文本输出后,不解析任何标签。

这个修复的意义:**v-html 是 Vue 的已知风险点,任何 v-html 服务端内容都要过净化。** 不能信任服务端返回的 HTML——即使后台录入时过滤了,前端再过一层是纵深防御。

### 8.3 一对一租户锁定(commit 3bb1ce0)

`authentication_service.go` 的 `authorizeAndEnrichUserTokenPayloadUserTenantRelationOneToOne` 在签发 token 前校验用户与租户的一对一关系:

```go
func (s *AuthenticationService) authorizeAndEnrichUserTokenPayloadUserTenantRelationOneToOne(
    ctx context.Context, userId, tenantId uint32,
) error {
    // 校验该 userId 只属于这一个 tenantId
    // 如果用户属于多个租户,拒绝签发 token
}
```

这关闭了"租户混淆越权"——一个用户如果关联多个租户,可能拿到 token 后切换 tenantId 访问其他租户数据。锁定 1:1 后,一个用户只属于一个租户,token 里的 tid 是固定的。

### 8.4 验证码门控

admin `Login` 调 `verifyLoginCaptcha` 再转发 core:

```go
func (s *AuthenticationService) Login(ctx context.Context, req *adminV1.LoginRequest) (*adminV1.LoginReply, error) {
    if err := verifyLoginCaptcha(ctx, req.GetCaptchaId(), req.GetCaptchaValue()); err != nil {
        return nil, adminV1.ErrorBadRequest("captcha failed")
    }
    // 转发 core
}
```

captcha 存 Redis,由 `GenerateCaptcha`/`VerifyCaptcha` 管理。dev 下有 bypass flag,生产关闭。这是登录防爆破的第一道(第二道是 8.1 的 resetcode 原子校验,第三道是登录审计的风险评分)。

---

## 九、诚实的待加固清单

这套安全设计有真功夫,但仓库里的配置默认值是开发友好,不是生产就绪。下面这些必须上线前替换/收紧:

| 项 | 现状(开发默认) | 生产建议 |
|----|----------------|---------|
| JWT 签名密钥 | `authenticator.yaml` 里 `key: "some_api_key"` 占位符 | 从 env/Secret/KMS 注入,定期轮换 |
| EC 签名私钥(审计) | 占位 `aes_key`/EC 私钥 commit 进仓库 | 外部化,严格隔离,专人保管 |
| Redis / Asynq 口令 | `*Abcd123456` 明文 commit | env 注入 + 网络隔离 |
| CORS origin | `origins: ["*"]` | 收敛到白名单域名 |
| Trace 采样 | `sampler: 1.0` + `insecure: true` | 调低采样率,启用 mTLS |
| Swagger | `enable_swagger: true` | 生产关闭 |
| 自动 DDL | `migrate: true` | 关闭,改版本化迁移(atlas/golang-migrate) |
| 数据访问审计触发 | `data_access_audit_log_repo` 仅 CRUD,未见写触发 hook | 需补 Ent 读/写 hook 落敏感数据访问记录 |
| 限流 | kratos 中间件层无 `enable_rate_limit`,仅应用侧防爆破 | 网关层(WAF/限流)兜底 |

两个"知情项"(不是漏洞,是设计现状):

- `UserViewer.HasPermission()`/`ShouldAudit()` 当前是 stub(恒 false)。实际授权由 kratos-authz 引擎决定,审计由 logging 中间件捕获,不依赖这两个方法。若后续要用需补实现。
- `pkg/lua/`(gopher-lua 脚本钩子扩展面)当前未接入审计链路。它是留出的可扩展接口,接入时注意沙箱。

把"做了什么"和"还差什么"分开列,是因为:**对一个安全方案最差的评价不是"有漏洞",而是"看不出哪里有漏洞"。** 把边界讲清楚,选型决策才能建立在准确信息上。

---

## 十、横向对比:这套方案 vs 主流安全方案

| 维度 | 本方案 | 主流 SaaS 方案(Auth0+Authz0) | 自研全栈 |
|------|--------|------------------------------|---------|
| 鉴权 | JWT HS256 + Redis 撤销 + blocklist | OAuth2/OIDC(外部 IdP) | 自研 |
| 授权 | Casbin/OPA,DB 驱动策略 | 策略引擎 SaaS | 自研 ACL |
| 行级隔离 | Ent privacy 框架强制 | DB RLS 或应用层 | 应用层手写 |
| 审计 | hash+签名防篡改 | SaaS 托管审计 | 普通日志 |
| 部署 | 自托管,数据在己 | 数据在 SaaS | 自托管 |
| 可控性 | 高(代码全在) | 低(依赖 SaaS) | 高 |
| 上手成本 | 高(需理解全链) | 低(配置即用) | 高 |

本方案适合"数据不能出己方、需要全链可控、有工程能力维护"的企业级场景。SaaS 方案适合"快速上线、不想维护安全基础设施、数据可托管"的场景。没有银弹——本方案的代价是上手成本高,且要自己承担"配错就裸奔"的风险(所以才需要 fail-closed 和待加固清单)。

---

## 结语

这套安全设计的几个工程取舍值得借鉴:

1. **fail-closed 作为默认。** 鉴权、授权、行级隔离、BFF 反序列化,每条路径的失败都导向拒绝。fail-open 更好用,fail-closed 更好防——安全场景选后者。

2. **行级隔离框架级化。** Ent privacy 把"按用户/租户过滤"从业务自觉变成框架强制。漏写一处 WHERE 就是一个越权漏洞的痛点,被"Schema 上一次声明"根治。`bc9e015` 把列名可参数化,进一步降低接入成本——这个修复不是"加功能",是"消除一个因列名不匹配导致无法隔离的洞"。

3. **纵深防御冗余。** BFF 注入归属 + core 再注入;签名校验 + Redis 撤销 + blocklist;裁剪 RPC + 策略未命中拒绝。一层被绕,另一层兜底。`bc9e015` 的 BFF fail-closed + core UserPrivacy 双层,就是这种冗余的实例。

4. **裁剪而非遮蔽。** 对越权写 RPC 是从 proto 层删除并验证 0 调用,不是靠前端不调、不是靠鉴权拦截。后两者是运行时防御,删 RPC 是结构上不存在——最小攻击面原则。

5. **防篡改审计。** hash+签名让日志具备链式 custody,不是"记了就完"。事校验能发现篡改,事后追责有据。

6. **原子操作消并发漏洞。** resetcode 的 TOCTOU 修复用 Lua 儿子脚本原子化——任何"先读后写"的并发逻辑都该这么处理。

但它同样诚实:**配置默认值是开发态的**,上生产前那张清单必须逐项过。安全不是"上了什么",是"没漏什么"。

仓库地址: GitHub <https://github.com/tx7do/go-wind-shop>, Gitee <https://gitee.com/tx7do/go-wind-shop>。 所有文中配置和代码均可逐行核对。
