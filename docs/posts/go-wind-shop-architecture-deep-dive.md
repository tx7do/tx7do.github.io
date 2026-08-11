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

# GoWind Shop 架构剖析:一个 REST 请求穿越三服务 BFF 的七环链路

## 这篇在讲什么

大多数微服务架构的文章停在"我们用了 BFF 模式"这种结论性描述,不讲 BFF 具体怎么装配、一个请求实际穿过了哪些代码、依赖图是怎么织起来的。这篇文章反过来:用一条真实的 `POST /admin/v1/mall/brands` 请求,把它从 HTTP 入站到 Ent 落库的每一个环节用代码钉死,再把支撑这条链路的 Wire 依赖注入和运行时配置逐行拆解。

文中所有代码和配置都来自一个真实仓库 go-wind-shop(GitHub: <https://github.com/tx7do/go-wind-shop>, Gitee: <https://gitee.com/tx7do/go-wind-shop>),标注了文件路径可核对。读完你会清楚三件事:这条链路怎么走、它由哪些配置决定、依赖图怎么从代码生成。

鉴权中间件内部的 token 校验和行级隔离细节,本文只点到为止——那是一整条纵深防御链,值得单独成篇,这里聚焦链路结构和依赖注入本身。

---

## 一、三服务 BFF:职责分层的硬约束

先把全景画清楚。这个仓库的后端是三个 go-kratos 服务,职责严格分层:

```
HTTP/REST                                互联网客户端
   │
   ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│  admin-service (BFF)    │         │  app-service (BFF)      │
│  REST :6600  SSE :6601  │         │  REST :6700             │
│  gRPC : 0.0.0.0:0(关闭) │         │  gRPC : 0.0.0.0:0(关闭) │
│  ❌ 不碰 DB              │         │  ❌ 不碰 DB              │
└───────────┬─────────────┘         └───────────┬─────────────┘
            │ gRPC(经 etcd 服务发现)            │ gRPC
            ▼                                    ▼
        ┌───────────────────────────────────────────┐
        │           core-service (核心实现)          │
        │   gRPC only · ✅ 唯一持有 DB(Ent)          │
        │   ✅ 唯一持有 Redis / Asynq / Authenticator │
        └───────────────────────────────────────────┘
```

这张图的关键约束是表格化的——README 里直接列了:

| 服务 | 角色 | 是否访问 DB |
|------|------|:---:|
| `app/admin/service` | 后台网关 BFF | ❌ |
| `app/app/service` | 前台网关 BFF | ❌ |
| `app/core/service` | 核心业务实现 | ✅ |

"不碰 DB"不是口头约束,是代码层面的硬约束。BFF 服务的 `internal/data/` 目录里没有 Ent client、没有 repo——它的 `wire_set.go` 里只有 Redis、MinIO、etcd discovery、gRPC client 工厂,没有任何 `NewXxxRepo`。而 core 服务的 `internal/data/` 里才有 `NewEntClient` 和全部 repo 工厂。这意味着 BFF 二进制里**编译期就不存在数据访问的依赖**,不是"运行时选择不调"。

这个约束的价值在于:把"数据落点"收敛到一处。后续做行级隔离、审计、脱敏,只需要在 core 一侧落实,BFF 即使被攻破也只是转发层,不直接碰数据。

---

## 二、请求全链路:七环节逐行追踪

下面追踪 `POST /admin/v1/mall/brands` 这条请求。它要穿越七个环节,每个环节我都贴真实代码。

### 环节 1:HTTP 入站与路由分派

请求打到 admin BFF 的 kratos HTTP server,监听 `0.0.0.0:6600`(`app/admin/service/configs/server.yaml`):

```yaml
server:
  rest:
    addr: "0.0.0.0:6600"
    enable_swagger: true
    cors: { origins: ["*"], methods: [...], headers: [...] }
    middleware:
      auth: { method: "HS256", key: "some_api_key" }
  grpc:
    addr: "0.0.0.0:0"     # ← BFF 的 gRPC 端口设为 0,等于关闭
  sse:
    addr: "0.0.0.0:6601"
    path: "/events"
    auto_stream: true
```

注意 `grpc.addr: "0.0.0.0:0"`——BFF 不对外提供 gRPC 服务,端口设 0 等于关闭。这个设计决策的踩坑点后面讲。

kratos 根据 proto 的 `google.api.http` 注解(`get: "/admin/v1/mall/brands"`)把路由分派到生成的 HTTP handler,handler 调用 `service.BrandService.List`(BFF 侧的实现)。这个 handler 是 `protoc-gen-go-http` 从 proto 生成的,不是手写的。

### 环节 2:BFF 中间件链装配

请求进入 handler 前,先穿过中间件链。`app/admin/service/internal/server/rest_server.go` 的 `NewRestMiddleware` 按序装配:

```go
func NewRestMiddleware(ctx *bootstrap.Context) []middleware.Middleware {
    var ms []middleware.Middleware
    ms = append(ms, logging.Server(ctx.GetLogger()))            // ① 结构化请求日志
    ms = append(ms, applogging.Server(                          // ② 防篡改审计
        WithWriteApiLogFunc(...),
        WithWriteLoginLogFunc(...),
    ))
    ms = append(ms, selector.Server(                            // ③ 鉴权 + 授权
        auth.Server(
            auth.WithAccessTokenChecker(accessTokenChecker),
            auth.WithInjectMetadata(true),
            auth.WithInjectEnt(true),
        ),
        authz.Server(authorizer),
    ).Match(rpc.NewRestWhiteListMatcher()).Build())
    return ms
}
```

三个中间件的职责:

**① `logging.Server`**:kratos 内置的结构化请求日志,记录 method/path/status/latency。

**② `applogging.Server`**:防篡改审计中间件(`pkg/middleware/logging/`),trailing 阶段把请求信息(操作者、API、IP、latency、status)算 SHA-256 hash + ECDSA 签名后写入 core 的 audit gRPC 服务。它的内部实现是另一篇的主题,这里只确认它在这一环。

**③ `selector.Server(auth.Server(...), authz.Server(...)).Match(rpc.NewRestWhiteListMatcher())`**:这是关键环。`selector` 是 kratos 的条件中间件——`Match(whiteListMatcher)` 决定哪些请求要过 `auth.Server` + `authz.Server`,哪些跳过。白名单由 `rpc.AddWhiteList(adminV1.OperationAuthenticationServiceLogin, ...)` 显式填充,只有 Login、Captcha 这类端点跳过鉴权。其余所有请求必须穿 auth + authz。

`auth.Server` 的内部逻辑(token 校验、viewer 注入)和 `authz.Server` 的策略判定,涉及完整的鉴权纵深,这里只点明它在链路里的位置。它的 fail-closed 行为和 Casbin/OPA 引擎的具体运作,留给专门的篇幅展开——本篇聚焦链路结构。

### 环节 3:BFF service 转发 gRPC

中间件链通过后,handler 调到 BFF 侧的 `service.BrandService.List`。`app/admin/service/internal/service/brand_service.go`:

```go
type BrandService struct {
    adminV1.BrandServiceHTTPServer            // 生成的 HTTP server 接口(protoc-gen-go-http)
    log                *log.Helper
    brandServiceClient catalogV1.BrandServiceClient   // 生成的 gRPC client(protoc-gen-go-grpc)
}

func (s *BrandService) List(ctx context.Context, req *paginationV1.PagingRequest) (*catalogV1.ListBrandResponse, error) {
    return s.brandServiceClient.List(ctx, req)   // 直接转发 gRPC 到 core
}
```

注意这个 service 做的事有多薄:它实现了 `adminV1.BrandServiceHTTPServer`(HTTP 接口),持有 `catalogV1.BrandServiceClient`(gRPC client),方法体就是一行转发。

这就是"瘦网关"的字面含义——BFF service 不含业务逻辑,只做协议转换(HTTP → gRPC)和必要的上下文注入。

写操作(Create/Update)会多一步:从鉴权上下文取操作者 id,注入请求。看 `Create`:

```go
func (s *BrandService) Create(ctx context.Context, req *catalogV1.CreateBrandRequest) (*emptypb.Empty, error) {
    operator, err := auth.FromContext(ctx)
    if err != nil { return nil, err }
    req.Data.CreatedBy = trans.Ptr(operator.UserId)   // 注入操作者
    return s.brandServiceClient.Create(ctx, req)       // 转发 gRPC
}
```

`auth.FromContext(ctx)` 取的是环节 2 里 `auth.Server` 中间件注入的 `UserTokenPayload`(从 JWT claims 解出来的操作者身份)。BFF 把 `CreatedBy` 塞进请求后转发——这个字段后续会映射到 Ent 的 `created_by` 列(由 `OperatorID` mixin 创建),完成操作者溯源。整条链路端到端,不靠业务代码自觉。

### 环节 4:经 etcd 服务发现连 core

BFF 持有的 `brandServiceClient` 是怎么连上 core 的?看 `app/admin/service/internal/data/data.go` 里的 client 工厂:

```go
func NewBrandServiceClient(ctx *bootstrap.Context, discovery *registry.ServiceRegistry) catalogV1.BrandServiceClient {
    // 用 etcd discovery 发现 core 服务的 gRPC 端点
    // dial 出一个 gRPC client conn
    // 返回 catalogV1.NewBrandServiceClient(conn) —— 生成代码封装
}
```

服务发现的后端在 `app/admin/service/configs/registry.yaml`:

```yaml
registry:
  type: "etcd"
  endpoints: ["localhost:2379"]
```

注意一个设计细节:**配置中心和服务发现用的是不同后端**。`configs/remote.yaml` 指向 Consul 拉业务配置:

```yaml
remote:
  type: "consul"
  key: "go-wind-shop/admin/service"
```

而 `registry.yaml` 指向 etcd 做服务发现。两者职责分离——配置是相对静态的业务参数,服务发现是高频的实例寻址,用不同后端避免单点耦合。

连上 core 的 gRPC client 的中间件配置在 `app/admin/service/configs/client.yaml`:

```yaml
client:
  grpc:
    timeout: 120s
    middleware:
      enable_logging: true
      enable_recovery: true
      enable_tracing: true         # ← 跨服务调用延续 trace context
      enable_circuit_breaker: true # ← 熔断
      enable_validate: true        # ← protoc-gen-validate 校验出站请求
      enable_metadata: true
```

这里有几个值得注意的点:

- `enable_tracing: true` 让 BFF → core 的 gRPC 调用延续 OpenTelemetry 的 trace context,Jaeger 里能看到跨服务调用链。
- `enable_circuit_breaker: true` 启用熔断,core 不可用时 BFF 快速失败而非雪崩。
- `enable_validate: true` 对出站请求也做校验——不只是入站校验,出站同样校验,防止 BFF 构造出非法请求发给 core。
- `timeout: 120s` 这个值偏长,电商场景的多数 RPC 不需要这么久,生产建议按 RPC 分级设超时。

### 环节 5:core gRPC 中间件

请求到达 core 的 gRPC server。core 的 `internal/server/grpc_server.go` 注册了所有领域的 gRPC 服务:

```go
func NewGrpcServer(ctx *bootstrap.Context, middlewares []middleware.Middleware, ...) *kratos.App {
    srv, err := rpc.CreateGrpcServer(ctx, middlewares...)
    catalogV1.RegisterBrandServiceServer(srv, brandService)      // 注册每个领域的 gRPC service
    orderV1.RegisterOrderServiceServer(srv, orderService)
    identityV1.RegisterUserServiceServer(srv, userService)
    // ... 所有领域
    return srv
}
```

core 的 gRPC 中间件链在 `NewGrpcMiddleware`:

```go
func NewGrpcMiddleware(ctx *bootstrap.Context) []middleware.Middleware {
    var ms []middleware.Middleware
    ms = append(ms, logging.Server(ctx.GetLogger()))   // 结构化日志
    ms = append(ms, ent.Server())                       // viewer 重建
    return ms
}
```

`ent.Server()`(`pkg/middleware/ent/`)做一件事:从入站 gRPC 的 metadata 头里,把 BFF 在环节 2/3 注入的 operator 信息还原成 `UserViewer`,挂进 Ent 的 viewer context。这个 viewer 携带 uid/tenantId/orgUnitId/dataScope,后续 Ent 的 privacy 策略会用它注入行级过滤。

如果 metadata 里缺 operator 信息(比如 BFF 没注入),`ent.Server()` 不会创建 viewer,后续 Ent privacy 策略发现无 viewer 会直接 fail-closed 报错——请求拿不到任何数据。这是"无身份即无数据"的链路实现。

### 环节 6:core service → repo

请求分派到 core 侧的 `service.BrandService.List`。`app/core/service/internal/service/brand_service.go`:

```go
type BrandService struct {
    catalogV1.UnimplementedBrandServiceServer     // 生成的 gRPC server 接口
    log  *log.Helper
    repo *data.BrandRepo                          // 持有 repo
}

func (s *BrandService) List(ctx context.Context, req *paginationV1.PagingRequest) (*catalogV1.ListBrandResponse, error) {
    return s.repo.List(ctx, req)   // 委托 repo
}
```

这里要讲一个和 kratos 教科书不一样的设计取舍。

**踩坑叙事:无 biz 层。** kratos 的官方布局教程推荐四层:`server` → `service` → `biz` → `data`。其中 `biz` 是 use-case 层,定义业务逻辑;`service` 只做协议转换;`data` 做 ORM。这个仓库**砍掉了 biz 层**,service 直接调 data 的 repo。

我核对过整个 core 服务,`find -name biz` 没有任何结果。这是有意为之。取舍是:

- **好处**:层数少,样板代码减半。简单 CRUD 领域(如 brand、category)的 service 就一行 `return s.repo.Xxx(ctx, req)`,中间多一层 biz 纯属噪音。
- **代价**:当某个领域的业务逻辑变复杂(如订单的状态机、支付的回调处理),service 会变厚。这时候需要自律地把复杂逻辑抽到 service 内部的私有方法,或拆分成多个 service。

这个取舍适合"业务逻辑较薄、以 CRUD 为主"的脚手架场景。如果你的业务有大量领域规则,可能需要把 biz 层加回来。这是个明确的设计边界,不是疏漏。

### 环节 7:repo 落库(Ent 事务 + 级联)

`app/core/service/internal/data/brand_repo.go` 的 `Create`:

```go
func (r *BrandRepo) Create(ctx context.Context, req *catalogV1.CreateBrandRequest) (*catalogV1.Brand, error) {
    tx, err := r.entClient.Client().Tx(ctx)           // 开事务
    if err != nil { return nil, err }
    defer func() {
        if err != nil { tx.Rollback() } else { tx.Commit() }
    }()
    // 1. 主表写入
    entBrand, err := tx.Brand.Create().
        SetNillableLogoURL(req.Data.GetLogoURL()).
        Save(ctx)
    if err != nil { return nil, err }
    // 2. 级联翻译表写入(多语言,详见专门章节)
    if err := r.brandTranslationRepo.BatchCreate(ctx, tx, entBrand.ID, req.Data.GetTranslations()); err != nil {
        return nil, err
    }
    // 3. DTO 映射(ent entity → proto DTO)
    return r.mapper.Convert(entBrand), nil
}
```

几个细节:

- **显式事务**:`r.entClient.Client().Tx(ctx)` 开事务,defer 里按 err 决定 rollback/commit。主表和级联的翻译表在同一事务里,保证一致性。
- **`SetNillableLogoURL`**:Ent 生成的 builder 方法,`Nillable` 表示该字段可为 null,`Set` 系列方法只设置提供的字段。
- **`mapper.Convert`**:这个 repo 用 `mapper.CopierMapper[catalogV1.Brand, ent.Brand]` 做 ent entity 和 proto DTO 之间的转换。字段对应靠命名约定——proto DTO 的 `created_by` 映射到 ent entity 的 `created_by` 列(由 `OperatorID` mixin 创建)。这个映射器是 `github.com/tx7do/go-crud` 提供的通用工具,基于反射,按字段名匹配。

- **`List` 路径的行级过滤**:List 请求经过 Ent privacy 策略时,如果该表挂了 `UserPrivacy`,Ent 会自动在 SQL 里注入 `WHERE <user_column> = <viewer.uid>`。注入是通过 `--feature entql` 提供的 `func(s *sql.Selector)` 钩子实现的,具体逻辑——这是行级隔离的核心,留给专门篇幅展开。

### 响应回程

DTO 沿原路返回:repo → service → gRPC → BFF service → HTTP handler → 客户端。审计中间件在 trailing 阶段补记响应 status、latency、reason。

整条链路完成。

---

## 三、Wire 依赖注入:从 ProviderSet 到 wire_gen.go

上面这条链路里出现的每个对象——`BrandService`、`BrandRepo`、`EntClient`、`Discovery`、`Authorizer`、`AccessTokenChecker`、HTTP server、gRPC server——都不是手写 new 出来的,是 Wire 在编译期织起来的。这一节逐行拆。

### 3.1 injector 桩

每个服务的 `cmd/server/wire.go`:

```go
//go:build wireinject

package server

import (
    "github.com/google/wire"
    serverProviders "go-wind-shop/app/admin/service/internal/server/providers"
    serviceProviders "go-wind-shop/app/admin/service/internal/service/providers"
    dataProviders "go-wind-shop/app/admin/service/internal/data/providers"
)

func initApp(ctx *bootstrap.Context) (*kratos.App, func(), error) {
    panic(wire.Build(
        serverProviders.ProviderSet,
        serviceProviders.ProviderSet,
        dataProviders.ProviderSet,
        newApp,
    ))
}
```

`//go:build wireinject` 构建标签让这个文件只在 `wire` 工具运行时参与编译,正常构建忽略它。`wire.Build` 列出三个 ProviderSet 和 `newApp`(kratos.App 的组装函数)。

### 3.2 ProviderSet:依赖图的节点

三个 ProviderSet 分层定义依赖。admin BFF 的 `internal/data/providers/wire_set.go`:

```go
var ProviderSet = wire.NewSet(
    data.NewRedisClient,           // Redis 工厂
    data.NewMinIoClient,           // MinIO 工厂
    data.NewDiscovery,             // etcd 服务发现工厂
    data.NewAuthorizer,            // Casbin/OPA 授权引擎工厂
    auth.NewTokenChecker,          // token 校验器(连 core authentication gRPC)
    data.NewBrandServiceClient,    // ↓ 以下全是 core gRPC client 工厂
    data.NewProductServiceClient,
    data.NewOrderServiceClient,
    data.NewCartServiceClient,
    // ... 约 40 个
)
```

注意这个 ProviderSet 里**没有任何 `NewXxxRepo`**——BFF 不碰 DB,所以没有 repo 工厂。这是上文"不碰 DB"约束的代码体现。

对比 core 服务的 `internal/data/providers/wire_set.go`:

```go
var ProviderSet = wire.NewSet(
    data.NewRedisClient,
    data.NewEntClient,            // ← Ent client 工厂(只有 core 有)
    data.NewDiscovery,
    data.NewBrandRepo,            // ↓ 所有 repo 工厂
    data.NewBrandTranslationRepo,
    data.NewProductRepo,
    data.NewProductTranslationRepo,
    // ... 约 50 个 repo
)
```

core 的 ProviderSet 有 `NewEntClient` 和全部 repo,没有 gRPC client(它不调别的服务)。两个 ProviderSet 的差异,就是 BFF/核心 职责分层的代码证据。

### 3.3 wire_gen.go:织好的依赖图

`make wire` 跑完,生成 `wire_gen.go`(`//go:build !wireinject`)。admin BFF 的 `wire_gen.go` 里,每个领域的装配模式都一样:

```go
func initApp(context *bootstrap.Context) (*kratos.App, func(), error) {
    // ... discovery 先建
    discovery := data.NewDiscovery(context)

    // 每个领域:client → service
    brandServiceClient := data.NewBrandServiceClient(context, discovery)
    brandService := service.NewBrandService(context, brandServiceClient)

    productServiceClient := data.NewProductServiceClient(context, discovery)
    productService := service.NewProductService(context, productServiceClient)
    // ... 几十个领域重复

    // server 聚合所有 service
    httpServer, err := server.NewRestServer(context, v, userService, ..., brandService, productService, ...)
    grpcServer, err := server.NewGrpcServer(context, grpcMiddlewares)
    sseServer := server.NewSseServer(context, internalMessageService)

    app := newApp(context, httpServer, grpcServer, sseServer)
    return app, func(){ /* cleanup */ }, nil
}
```

整张依赖图被织成线性的初始化序列。`wire_gen.go` 体积很大(几百行),但它是"可 diff 的依赖快照"——review 它能快速看出谁依赖谁,比如某个 service 依赖了哪个 client,某个 server 聚合了哪些 service。

core 的 `wire_gen.go` 模式对称:`NewEntClient` → 每个 `NewXxxRepo`(注入 entClient)→ 每个 `NewXxxService`(注入 repo)→ `NewGrpcServer`(聚合所有 service)。

### 3.4 副作用导入:etcd discovery 和 tracer

`wire_gen.go` 末尾有两个副作用导入:

```go
import (
    _ "github.com/tx7do/kratos-bootstrap/registry/etcd"   // etcd discovery 注册
    _ "github.com/tx7do/kratos-bootstrap/tracer"           // OTel tracer 注册
)
```

这两个包的 `init()` 把自己注册进 kratos 的 registry/tracer 接口实现表里。etcd discovery 注册后,`data.NewDiscovery` 才能找到 etcd 实例;tracer 注册后,`trace.yaml` 的 OTLP 配置才生效。这是 Go 的"registry 模式"——实现通过 init 自注册,调用方按 config 选型。

### 3.5 Wire vs 运行时 DI 的取舍

这个项目选 Wire(编译期代码生成)而不是 dig/fx(运行时反射),取舍点:

| 维度 | Wire | dig/fx |
|------|------|--------|
| 依赖错误暴露 | 编译期(`wire` 命令报错) | 运行时(启动 panic) |
| 启动开销 | 零(纯构造函数调用) | 反射+图构建 |
| 可读性 | wire_gen.go 显式可 diff | 隐式图,难追踪 |
| 产物体积 | 大(wire_gen.go) | 无额外产物 |

对一个有上百个 provider 的微服务,编译期暴露依赖错误的价值很大——少一个依赖,二进制编不出来,而不是上线后启动失败。代价是 wire_gen.go 体积大,但它是机器生成的,review 时当作"依赖关系快照"看,反而比运行时 DI 的隐式图透明。

这个取舍和选 Ent 的逻辑一致:**用编译期保证换运行时安全。**

---

## 四、运行时配置:server / client / trace 逐行

链路行为由 `configs/*.yaml` 决定。这一节把三个关键配置逐行讲清楚。

### 4.1 server.yaml:BFF 暴露什么

`app/admin/service/configs/server.yaml` 的 server 段(上文环节 1 贴过)决定 BFF 暴露哪些传输。三个传输:rest(6600)、sse(6601)、grpc(0=关闭)。

`rest.middleware.auth` 段:

```yaml
middleware:
  auth:
    method: "HS256"
    key: "some_api_key"
```

这是 JWT 的签名方法和密钥。注意 `key: "some_api_key"` 是开发占位符——**生产必须从 env/Secret 注入真实密钥**。这个密钥如果泄漏,任何人都能伪造 admin token,是整个鉴权链的根。

> ⚠️ 仓库里 `configs/*.yaml` 的所有密钥(key、aes_key、redis password、asynq redis)都是开发占位符,生产前必须外部化。这是"开发友好 ≠ 生产就绪"的典型。

### 4.2 grpc 段的中间件开关

core 的 `server.yaml` 的 grpc 段:

```yaml
server:
  grpc:
    addr: "0.0.0.0:9000"
    middleware:
      enable_logging: true
      enable_recovery: true        # panic 恢复
      enable_tracing: true         # OTel 链路追踪
      enable_validate: true        # protoc-gen-validate 入站校验
      enable_circuit_breaker: true
      enable_metadata: true
```

五个开关,每个对应一个 kratos 中间件。注意 `enable_validate: true`——入站请求会被 protoc-gen-validate 生成的校验代码检查,不通过直接 400,handler 拿不到非法输入。这把"参数校验"从业务代码里抽走,变成框架强制。

### 4.3 trace.yaml:链路追踪

三个服务的 `configs/trace.yaml` 内容一致:

```yaml
trace:
  endpoint: "jaeger:4317"
  exporter: "otlp-grpc"
  sampler: 1.0
  env: "dev"
  insecure: true
  enable_trace_context: true
  enable_baggage: true
```

- `endpoint: "jaeger:4317"`:OTLP gRPC 导出到 Jaeger collector。
- `sampler: 1.0`:100% 采样。开发调试需要全采样,生产建议降到 0.01–0.1,否则存储和性能开销大。
- `insecure: true`:明文 OTLP。生产应启用 mTLS,防止 trace 数据(含敏感的 span 属性)被窃听。
- `enable_trace_context: true`:跨服务调用延续 trace context——这是 BFF → core 的 gRPC 调用能在 Jaeger 里连成一条链的前提。

链路追踪在这套架构里的价值不只是排障。鉴权中间件会把 OTel 的 traceID 挂到 `UserViewer` 上,审计日志因此能关联到调用链——出问题时能在 Jaeger 里把"哪个用户哪次操作在哪跳服务出错"串起来。这是可观测性和安全审计的交叉点。

---

## 五、横向对比:三种架构形态

把这套三服务 BFF 和另外两种形态对比,讲清楚各自适合什么。

### 形态 A:单体(无 BFF,无微服务)

一个进程,一套 DB,所有业务逻辑在一起。

- **优点**:无网络开销,无分布式复杂度,调试简单。
- **缺点**:业务耦合,某个模块的 bug 拖垮全局;无法按模块独立扩缩容;DB 成为单点;数据访问边界靠业务自觉,容易越权。
- **适合**:小团队、早期项目、业务边界模糊时。

这个项目没选它,核心原因是**数据访问边界**。多租户、多用户的行级隔离,在单体里只能靠每个查询手写 `WHERE tenant_id = ? AND user_id = ?`——漏一处就是越权。三服务架构把数据访问收敛到 core,行级隔离只在 core 一处用 Ent privacy 框架强制。这个收益是结构性的。

### 形态 B:纯微服务(无 BFF,每个业务服务直接暴露 HTTP)

order-service、payment-service、product-service 各自直接暴露 REST,前端直连每个服务。

- **优点**:服务自治,技术栈可异构。
- **缺点**:前端要面对 N 个服务的鉴权、聚合、错误处理,逻辑下沉到前端;每个服务各自实现鉴权,容易不一致;接口面分散,难做统一的审计和限流。
- **适合**:前端聚合能力强的团队,或服务间正交性强的场景。

这个项目没选它,核心原因是**鉴权和审计的一致性**。BFF 把鉴权和审计收敛到一处中间件链(环节 2),所有入站请求统一过 fail-closed 的 auth+authz,统一写防篡改审计。如果每个业务服务各自暴露 HTTP,要么每个服务各自实现这套(重复且易不一致),要么前端做聚合(鉴权下沉到前端,更不可控)。

### 形态 C(本方案):三服务 BFF + core

BFF 收敛传输面和鉴权/审计,core 收敛数据和业务逻辑。

- **优点**:数据落点单点(core),鉴权审计单点(BFF 中间件),职责边界清晰;行级隔离框架级强制;新传输协议只需加 BFF,不动 core。
- **代价**:网络跳数多(BFF→core 一跳),latency 增加;部署复杂度上升(三个服务+中间件);开发体验上要在三个服务间跳代码。
- **适合**:需要强隔离、统一鉴权审计、多传输协议的企业级场景;不适合追求最低 latency 或快速原型。

这个取舍是显式的:用一跳网络 latency 和部署复杂度,换数据访问收敛和鉴权审计一致性。对这个项目的目标场景(企业级、多租户、审计合规),这个交换值得。

---

## 六、三个实战踩坑点

### 6.1 BFF 的 gRPC 端口必须关:`0.0.0.0:0` 不是随便写的

`server.yaml` 里 BFF 的 `grpc.addr: "0.0.0.0:0"`。这个 0 不是"让系统随机分配端口",而是 kratos 的约定——设为 0 表示不启动 gRPC server。

为什么必须关?如果 BFF 启动了 gRPC server,等于在 HTTP(6600)之外又开了一条直通 BFF 的 gRPC 通道。这条通道如果没配鉴权(或鉴权配错),就变成"绕过 HTTP 中间件链直达 BFF service"的旁路。环境里任何能连到这个 gRPC 端口的客户端,都能跳过环节 2 的审计和(部分)鉴权逻辑。

把端口设 0 从编译期就消除这个旁路——BFF 二进制根本没 gRPC server,想绕也绕不了。这是"默认关闭不必要的能力"的一个实例。

### 6.2 auto-DDL 的开发爽生产坑

`core/.../configs/data.yaml` 里 `migrate: true`:

```go
// core/.../data/ent_client.go
cli, err := entBootstrap.NewClient(cfg, func(drv *sql.Driver) *ent.Client {
    client := ent.NewClient(ent.Driver(drv), ...)
    if cfg.Data.Database.GetMigrate() {
        client.Schema.Create(ctx.Context(), migrate.WithForeignKeys(true))  // 启动时自动建表
    }
    return client
})
```

开发时很爽——改 Schema 重启就生效。生产坑:

- **无版本化**:自动 DDL 不产生迁移文件,无法回滚,无法审计"什么时候改了什么表"。
- **多实例并发**:core 多副本同时启动时,多个实例并发跑 `Schema.Create` 可能冲突(建索引互相阻塞)。
- **破坏性变更**:删列、改列类型、删表,自动 DDL 会直接执行,可能丢数据。Ent 的 `Schema.Create` 默认不会删列,但某些 schema 变更仍可能导致数据丢失。

**生产必须关 `migrate`,改用版本化迁移工具**(atlas、golang-migrate),迁移文件进 git,通过 CI 流水线 apply。这是"开发默认 ≠ 生产就绪"的典型,踩过的人都懂。

### 6.3 client.yaml 的 120s 超时太长

`app/admin/service/configs/client.yaml` 的 `timeout: 120s`。这个值对大多数 RPC 来说太长——电商场景的列表、详情、创建,通常应该在秒级返回。120s 意味着 core 卡死时,BFF 会挂 2 分钟才超时,期间占用连接池和 goroutine,容易拖垮 BFF。

踩坑点的解法:**按 RPC 分级设超时**。kratos 支持在 client config 里按方法设超时。生产建议把列表/详情类 RPC 设 5–10s,导出/批量类设 30–60s,没有 120s 的默认。这个仓库当前用统一 120s 是开发默认,需要生产前细化。

---

## 结语

一个 REST 请求在这套架构里走了七个环节:HTTP 入站 → BFF 中间件链(日志、审计、鉴权)→ BFF service 转发 gRPC → etcd 服务发现连 core → core gRPC 中间件(viewer 重建)→ core service → repo(Ent 事务落库)。这条链路由 Wire 在编译期织好的依赖图支撑,由 `configs/*.yaml` 决定运行时行为。

这套结构的价值不是"用了 BFF",而是**职责边界的代码级强制**:BFF 编译期不含数据访问依赖,core 编译期不含传输层依赖,数据落点和鉴权审计各自单点收敛。代价是网络跳数和部署复杂度——这是显式的交换,不是免费午餐。

仓库地址: GitHub <https://github.com/tx7do/go-wind-shop>, Gitee <https://gitee.com/tx7do/go-wind-shop>。 所有文中配置和代码均可逐行核对。
