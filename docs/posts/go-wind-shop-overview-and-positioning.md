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

# GoWind Shop:一个 proto 文件如何生成后端、前端、文档、校验六路代码

## 为什么再聊"契约驱动"

"契约驱动(contract-driven)"这个词被用滥了。大多数项目里它的实际含义是:后端写完接口,用 Swagger 注解生成一份文档,前端照着文档手写 fetch。文档和实现谁是事实源?没人说得清。接口改了文档没改,文档改了实现没改,前后端各自演进直到某天线上 404。

这篇文章不讲概念,讲一个**可运行的工程闭环**:以 `.proto` 为唯一事实源,一次 `buf generate` 同时产出六路产物——后端 gRPC 桩、后端 HTTP 桩、错误码 helper、请求校验器、PII 脱敏器、OpenAPI 文档,以及给前端的 TypeScript 客户端。文中所有配置和代码都来自一个真实仓库 go-wind-shop(GitHub: <https://github.com/tx7do/go-wind-shop>, Gitee: <https://gitee.com/tx7do/go-wind-shop>),你可以逐行核对。

我会先把这个闭环的每一环用真实配置讲透,再把它和主流的几种方案做横向对比,最后聊几个实际踩过的坑——包括"为什么 OpenAPI 文档必须按 BFF 作用域裁剪,否则等于把核心 gRPC 全量接口暴露给公网"。

---

## 一、闭环全景:一份 proto,六路产出

先看全景。这张图里的每一个箭头,后文都会用真实配置文件落到具体行。

```
                     .proto (按领域分层,唯一事实源)
                     │  接口定义 · 数据模型 · 错误码 · 校验规则 · OpenAPI 元数据
                     │
                     │  buf generate  (backend/api/buf.gen.yaml)
        ┌────────────┼─────────────────────────────────────────────────┐
        ▼            ▼               ▼                  ▼                ▼
   Go gRPC 桩    Go HTTP 桩     错误码 helper      请求校验/脱敏      OpenAPI v3
   (core 用)     (BFF 用)      (protoc-gen-        (validate +         (gnostic,
                                go-errors)          redact)            按 BFF 裁剪)
                                                                           │
                                                                           ▼
                                                                    前端 TS 客户端
                                                                   (protoc-gen-
                                                                   typescript-http)
```

这套机制的核心理念是:**接口、数据、错误码、校验,四者同源同生,任何一方变更都会以编译错误的形式反射到所有消费方。** 没有"文档忘了更新"这回事——因为文档本身是产物,不是源头。

下面逐层拆。

---

## 二、proto 的领域分层:BFF/核心 边界编码进目录

第一个要澄清的事:proto 不是按"admin/app/core"三个服务目录分的,而是**按业务领域**组织,每个领域固定带 `service/v1/` 后缀。仓库 `backend/api/protos/` 下的顶层领域有 16 个:

```
backend/api/protos/
├── admin/service/v1/        ← BFF:后台 HTTP 面 (i_*.proto,带 google.api.http 注解)
├── app/service/v1/          ← BFF:店铺 HTTP 面 (i_*.proto,带 google.api.http 注解)
├── catalog/service/v1/      ← 核心:gRPC(商品/品牌/类目/SKU/属性)
├── order/service/v1/        ← 核心:gRPC(订单/订单项)
├── payment/service/v1/      ← 核心:gRPC(支付交易/退款)
├── identity/service/v1/     ← 核心:gRPC(用户/凭据)
├── permission/service/v1/   ← 核心:gRPC(角色/权限/菜单/接口)
├── authentication/...       ← 核心:gRPC(签发/校验 token)
├── audit/...                ← 核心:gRPC(审计日志)
├── dict/...  cart/...  shipping/...  storage/...  internal_message/...  task/...  address/...
```

关键的区分在 `google.api.http` 注解:**只有 `admin` 和 `app` 两个 BFF 领域的 proto 带这个注解**,其余 14 个核心领域的 proto 是纯 `rpc ... returns (...) {}`,没有任何 HTTP 绑定。

看一个真实的 BFF proto,`backend/api/protos/admin/service/v1/i_brand.proto`:

```proto
rpc List (pagination.PagingRequest) returns (catalog.service.v1.ListBrandResponse) {
  option (google.api.http) = { get: "/admin/v1/mall/brands" };
}
```

注意第二行:`returns (catalog.service.v1.ListBrandResponse)`——**BFF proto 不重新定义数据结构,而是 import 核心领域的 DTO**:

```proto
import "catalog/service/v1/brand.proto";
```

这是一个经过深思的设计:**BFF proto 是"核心 DTO 的 REST 绑定薄壳",不拥有任何数据定义。** 数据模型的唯一事实源在核心领域的 proto 里,BFF 只负责把它绑到一条 HTTP 路由上。这带来一个直接的工程后果:数据模型变更只需要改一处(核心 proto),所有 BFF 的绑定自动跟随。

核心领域的 proto 长什么样?`backend/api/protos/catalog/service/v1/brand.proto` 定义了 `Brand` 消息和 `BrandService`(纯 gRPC,无 HTTP 注解):

```proto
service BrandService {
  rpc List (pagination.PagingRequest) returns (ListBrandResponse) {}
  rpc Get  (GetBrandRequest) returns (Brand) {}
  rpc Create (CreateBrandRequest) returns (Brand) {}
  // ...
}
```

每个核心领域还配两个伴生文件:`*_error.proto`(kratos 错误码定义)和 `*_doc.proto`(OpenAPI 元数据注解)。错误码会在后文讲,它会被 `protoc-gen-go-errors` 编译成 Go 的类型化错误 helper。

这套分层的意义不只是整洁。它把"BFF/核心"的架构边界**编码进了 proto 层**:带 HTTP 注解的只有 admin/app,其余都是 gRPC-only。任何人扫一眼 proto 目录就知道哪些接口暴露给了公网 HTTP,哪些只在内部 gRPC 网络里流动。这是"安全左移"的一种形式——边界在源头就可见。

---

## 三、buf 配置逐行:依赖从哪来,产物往哪去

### 3.1 buf.yaml:依赖清单

`backend/api/buf.yaml`(v2 格式)声明了 proto 依赖的外部包:

```yaml
deps:
  - 'buf.build/googleapis/googleapis'        # google.api.http 注解定义
  - 'buf.build/kratos/apis'                  # kratos 框架的 proto 扩展
  - 'buf.build/gnostic/gnostic'              # OpenAPI v3 注解 (gnostic)
  - 'buf.build/tx7do/pagination'             # 分页 proto (PagingRequest)
  - 'buf.build/go-wind/redact'               # PII 脱敏注解 (protoc-gen-go-redact)
  - 'buf.build/envoyproxy/protoc-gen-validate'  # 字段校验注解 (protoc-gen-validate)
```

每一项对应一个生成器需要的能力:`googleapis` 提供 `google.api.http`(让 BFF proto 能绑 REST 路由);`gnostic` 提供 `gnostic.openapi.v3.property`(让消息字段能带 OpenAPI 元数据);`protoc-gen-validate` 提供 `validate` 字段约束(如 `[(validate.rules).string.min_len = 3]`,生成运行时校验);`go-wind/redact` 提供脱敏注解(标记哪些字段在日志/响应里要打码)。

注意这些依赖**全部是 proto 定义包,不是 Go 库**。buf 在构建时拉取这些 proto 定义用于编译,产物才是 Go 代码。这把"接口契约"和"实现库"彻底解耦——契约是自描述的,不依赖任何运行时反射。

### 3.2 buf.gen.yaml:六个本地插件

这是整个闭环的核心。`backend/api/buf.gen.yaml` 配置了六个**本地 protoc 插件**(不是远程 buf plugin),全部输出到 `gen/go`:

```yaml
plugins:
  - local: protoc-gen-go              # ① Go message 代码(所有领域共享)
    out: gen/go
  - local: protoc-gen-go-grpc         # ② gRPC 服务桩(core 服务实现接口)
    out: gen/go
  - local: protoc-gen-go-http         # ③ kratos HTTP 服务桩(BFF 实现接口)
    out: gen/go
  - local: protoc-gen-go-errors       # ④ kratos 类型化错误码 helper
    out: gen/go
  - local: protoc-gen-validate        #⑤ 运行时请求校验
    out: gen/gen
  - local: protoc-gen-go-redact       # ⑥ PII 脱敏(日志/响应打码)
    out: gen/go
```

逐个说清楚每个插件干什么:

**① protoc-gen-go**:把每个 `message` 编译成 Go struct。这是 protobuf 的基础能力,不赘述。

**② protoc-gen-go-grpc**:为每个 `service` 生成 gRPC server interface 和 client stub。core 服务实现 `catalogV1.BrandServiceServer` 接口;BFF 服务通过 `catalogV1.BrandServiceClient` 调用 core。这就是上一节"BFF 转发 gRPC 到 core"的代码基础——client 桩是生成的,不是手写的。

**③ protoc-gen-go-http**:kratos 特有的插件。它读 `google.api.http` 注解,**为每个带注解的 RPC 生成一个 HTTP handler 桩和 server interface**。这是"BFF proto 绑 REST 路由"的实现机制——BFF service 实现的是 `adminV1.BrandServiceHTTPServer` 接口(注意是 HTTPServer,不是 gRPC server),kratos 的 HTTP transport 根据注解把 `/admin/v1/mall/brands` 这条路由分派到这个接口的实现。同一个业务接口,在 BFF 侧是 HTTP,在 core 侧是 gRPC,两者由同一份 proto 的不同注解决定。

**④ protoc-gen-go-errors**:读 `*_error.proto` 里定义的错误码,生成 Go 的类型化错误 helper。例如 `catalog_error.proto` 定义了 `NotFound` 错误码,生成的代码长这样:

```go
// 生成产物
func ErrorNotFound(format string, a ...any) error {
    return &catalogV1.ErrorNotFound{ /* kratos error with code */ }
}
```

业务代码里 `return nil, catalogV1.ErrorNotFound("brand %d", id)` 返回的是**类型化、带 HTTP 状态码映射**的错误。kratos 框架会把这个错误转成对应 HTTP 状态码(404)和结构化 JSON 响应。这比 `errors.New("not found")` + 手写 `http.Error` 工程化得多——错误码、消息、状态码三者绑定,且与 proto 同源。

**⑤ protoc-gen-validate**:读 `[(validate.rules)...]` 注解,生成运行时校验代码。例如 proto 里写 `string name = 1 [(validate.rules).string.min_len = 1, (validate.rules).string.max_len = 100];`,生成的代码会在请求进入 handler 前校验长度,不通过直接返回 400。这把"参数校验"从业务代码里抽出来,变成声明式。

**⑥ protoc-gen-go-redact**:读 redact 注解,生成字段脱敏逻辑。标记为敏感的字段(如手机号、邮箱),在日志输出或响应序列化时自动打码。这是 PII 合规的基础设施。

### 3.3 managed 块:go_package 的集中管理

`buf.gen.yaml` 还有一个 `managed` 段,为每个 proto 目录集中设置 `go_package`:

```yaml
managed:
  enabled: true
  override:
    - file_option: go_package
      path: catalog/service/v1
      value: go-wind-shop/api/gen/go/catalog/service/v1;catalogpb
    - file_option: go_package
      path: admin/service/v1
      value: go-wind-shop/api/gen/go/admin/service/v1;adminpb
    # ... 每个领域一条
```

这解决了"proto 该 import 什么路径、生成代码该放哪个包"的治理问题。没有这个,每个 `.proto` 都得手写 `option go_package = "..."`,改包名要改几十个文件。集中管理后,包结构是配置驱动的,一次修改全局生效。

最终产物落在 `backend/api/gen/go/<领域>/service/v1/*.pb.go`,覆盖全部 16 个领域。这些产物是 commit 进仓库的(不是运行时生成),便于 review 和 IDE 索引。

---

## 四、OpenAPI 文档的按作用域裁剪:一个容易被忽略的安全细节

这一节讲一个踩坑点,它直接关乎接口安全。

### 4.1 问题:全局 OpenAPI 会泄漏核心接口

OpenAPI 文档默认是全局生成的——把所有 proto 的 HTTP 注解都扫进一份 `openapi.yaml`。如果直接这么做,会遇到一个麻烦:核心领域的 proto 没有 HTTP 注解,所以不会进文档,看起来没问题。

但真正的坑在 BFF 侧。admin BFF 和 app BFF 都各自暴露了一组 HTTP 路由(分别绑 `/admin/v1/...` 和 `/app/v1/...`)。如果把两个 BFF 的路由都扫进**同一份** OpenAPI 文档,会发生什么?

- 文档里同时出现后台管理接口和买家侧接口。
- 这份文档挂载在 Swagger UI 上(`/swagger-ui`)。如果挂载在 admin BFF 上,但文档里含 app BFF 的路由,等于在 admin 的 Swagger 里暴露了买家的接口面;反之亦然。
- 更糟的是,如果将来某个核心领域被人加了 HTTP 注解(哪怕是误加),它会悄无声息地出现在 Swagger 里——而那个接口本该只在内部 gRPC 网络可见。

### 4.2 解法:按 BFF 作用域单独生成

仓库的解法是**为每个 BFF 单独配一个 OpenAPI 生成配置**,只扫该 BFF 的 proto 目录。`backend/api/buf.admin.openapi.gen.yaml`:

```yaml
inputs:
  - directory: protos
    paths:
      - protos/admin/service/v1      # 只扫 admin BFF 的 proto
plugins:
  - local: protoc-gen-openapi         # gnostic 提供的 OpenAPI 生成器
    out: ../app/admin/service/cmd/server/assets
```

关键在 `paths: - protos/admin/service/v1`——**显式限定输入只含 admin BFF 的 proto**。产出的 `openapi.yaml` 因此只包含 `/admin/v1/...` 路由,不会有任何 app BFF 或 core 的接口。

app BFF 有对称的 `buf.app.openapi.gen.yaml`,只扫 `protos/app/service/v1`,输出到 `app/app/service/cmd/server/assets/`。

### 4.3 文档嵌入二进制 + 运行时挂载

生成的 `openapi.yaml` 不是放静态文件目录,而是用 `//go:embed` 嵌进 BFF 二进制。`app/admin/service/cmd/server/assets/assets.go`:

```go
//go:embed openapi.yaml
var openapiYaml []byte
```

运行时,`server.yaml` 里 `enable_swagger: true` 时,kratos 的 swagger-ui 中间件用这份内存数据挂载 `/swagger-ui`:

```go
if cfg.GetServer().GetRest().GetEnableSwagger() {
    swaggerUI.RegisterSwaggerUIServerWithOption(srv,
        swaggerUI.WithMemoryData(assets.OpenApiData, "yaml"), ...)
}
```

这样有几个好处:文档与二进制同版本,不会出现"线上跑的是旧文档";部署不需要额外拷静态文件;生产环境关掉 `enable_swagger` 就彻底下线文档。

**但有个前提条件必须满足**:作用域裁剪配置(4.2)必须先做对。否则嵌入的就是全量文档,Swagger 一开就把不该暴露的接口全抖出来。这个踩坑点的教训是:**OpenAPI 文档的可见范围要作为一个显式的安全边界来管理,不能默认全量。**

### 4.4 前端 TypeScript 客户端:同源产物

还有一组配置 `buf.admin.typescript.gen.yaml` 和 `buf.vue.app.typescript.gen.yaml`,分别给后台 Vue 和店铺 Nuxt 生成 TypeScript HTTP 客户端。前端的 API 调用因此与后端路由同源——proto 改了字段,前端编译期就报错。这不是"文档说有这个字段",而是"类型定义里确实有这个字段",二者由同一份 proto 保证一致。

---

## 五、错误码:从字符串到类型化的工程化

前面提了 `protoc-gen-go-errors`,这里展开讲,因为它体现了契约驱动的一个深层价值:**把"错误"从运行时的字符串,提升为编译期的类型。**

### 5.1 错误码定义在 proto 里

每个领域有 `*_error.proto`,用 kratos 的扩展语法定义错误码。例如 `catalog_error.proto` 定义了 `NotFound`、`BadRequest`、`InternalServerError` 等,每个绑定一个 HTTP 状态码和 gRPC 状态码。这些定义是 proto 的一部分,和消息定义同源。

### 5.2 生成产物:类型化 helper

`protoc-gen-go-errors` 把每个错误码生成一个 Go 类型和一个 helper 函数:

```go
// 生成产物,不要手改
func ErrorNotFound(format string, a ...any) error { ... }
func IsNotFound(err error) bool { ... }
```

业务代码这样用:

```go
brand, err := r.repo.Get(ctx, id)
if err != nil {
    return nil, catalogV1.ErrorNotFound("brand %d", id)  // 类型化错误
}
```

kratos 框架拦截这个返回值,根据错误码映射查表把它转成 HTTP 404 + 结构化 JSON 响应:

```json
{"code": 404, "message": "brand 123 not found", "reason": "NOT_FOUND"}
```

### 5.3 对比:这解决了什么

对比手写接口的常见做法:`errors.New("not found")` + handler 里 `if err != nil { w.WriteHeader(404); w.Write(...) }`。问题在于:

- 错误码、HTTP 状态码、响应格式三者各自手写,容易不一致(比如错误码 404 配了 200 状态码)。
- 前端没法类型化地判断错误种类,只能字符串匹配。
- 错误信息可能直接泄漏内部细节(stack trace、SQL 错误),没有统一的脱敏层。

类型化错误让这三者绑定到 proto 定义里,改错误码要改 proto,所有消费方自动跟随。前端的 TS 客户端也能生成对应的错误类型,做到 `catch (e) { if (e instanceof NotFoundError) ... }`。

---

## 六、Ent:Schema 即代码,以及四个 feature flag 的取舍

proto 解决了"接口契约",数据层的契约由 Ent 解决。Ent 是 entgo.io 的 ORM,核心思想是 **Schema 即代码**——实体、字段、索引、外键、表名都用 Go 代码定义,通过代码生成产出类型安全的查询 API。

### 6.1 Ent 生成命令逐行

`backend/app.mk` 里每个 core 服务执行的 `ent` 目标:

```make
ent:
    @ent generate --feature privacy --feature entql \
        --feature sql/modifier --feature sql/upsert --feature sql/lock \
        ./internal/data/ent/schema
```

四个 feature flag,每个都有具体的工程目的:

**`--feature privacy`**:启用 Ent 的 [privacy 策略](https://entgo.io/docs/privacy/)。这是行级安全的基础——允许在 Schema 上挂 `Policy`,Ent 会在每次查询/变更时自动注入过滤条件。具体怎么用、怎么实现行级隔离,涉及鉴权链,这里先记住它是"框架级强制 WHERE 注入"的开关。

**`--feature entql`**:允许在查询里注入原生 SQL 谓词。privacy 策略注入的 `WHERE` 条件就是通过 entql 的 `func(s *sql.Selector)` 钩子实现的——没有这个 flag,privacy 策略没法改写查询。

**`--feature sql/modifier`**:支持查询修饰器,用于 `builder.Modify(whereCond...)` 这种动态拼装。分页+多条件筛选的列表查询靠它。

**`--feature sql/upsert` 和 `--feature sql/lock`**:upsert 支持高并发下的"存在则更新,不存在则插入"(库存扣减、计数器);`sql/lock` 支持显式行锁(`SELECT ... FOR UPDATE`),订单状态机变更时需要它防止并发改状态。

这五个 flag 不是随便开的,每一个都对应一个真实的业务场景需要。

### 6.2 Schema 即代码:Mixin 统一审计列

看一个真实的 Schema,`backend/app/core/service/internal/data/ent/schema/brand.go`:

```go
func (Brand) Annotations() []schema.Annotation {
    return []schema.Annotation{
        entsql.Annotation{
            Table: "mall_brands", Charset: "utf8mb4", Collation: "utf8mb4_bin",
        },
        schema.Comment("品牌表"),
    }
}

func (Brand) Fields() []ent.Field {
    return []ent.Field{
        field.String("logo_url").Optional().Nillable(),
    }
}

func (Brand) Mixin() []ent.Mixin {
    return []ent.Mixin{
        mixin.AutoIncrementId{},    // 自增主键 id
        mixin.TimeAt{},             // created_at / updated_at / deleted_at
        mixin.OperatorID{},         // created_by / updated_by / deleted_by
        mixin.SortOrder{},          // sort_order
    }
}
```

这里要讲的是 `Mixin`。`Mixin` 是 Ent 的"Schema 片段复用"机制——把一组字段和索引打包,多个 Schema 共享。这个仓库用的 Mixin 来自 `github.com/tx7do/go-crud/entgo/mixin`,四个 Mixin 注入了所有业务表共有的"审计列":

- `AutoIncrementId`:自增 `id` 主键。
- `TimeAt`:`created_at`、`updated_at`、`deleted_at` 三列,自动维护(创建时填 created_at,更新时刷 updated_at,删除时置 deleted_at 实现软删)。
- `OperatorID`:`created_by`、`updated_by`、`deleted_by`,记录每行的操作者 id。
- `SortOrder`:`sort_order`,前端列表排序用。

为什么用 Mixin 而不是每张表手写这些列?这是个值得讲的取舍。

**踩坑叙事**:如果每张表手写这四列,几十张表就是几百行重复代码,而且容易漏写——某张表忘了加 `deleted_at`,软删就失效;某张表忘了加 `created_by`,审计就断链。Mixin 把这些"必须存在但容易漏"的列收敛成一行 `mixin.TimeAt{}`,漏写的成本从"运行时出 bug"降到了"编译期缺一行"。这和契约驱动的理念一致:**把容易出错的人工操作,变成框架强制。**

注意 `created_by` 这列和前面 BFF service 里的这行对应:

```go
req.Data.CreatedBy = trans.Ptr(operator.UserId)
```

BFF 从鉴权上下文取操作者 id,塞进请求的 `CreatedBy` 字段,这个字段映射到 Ent 的 `created_by` 列(由 OperatorID mixin 创建)。整条链路:JWT → 鉴权中间件解析出 operator → BFF 注入请求 → Ent mixin 落库。操作者溯源是端到端、框架强制的,不靠业务代码自觉。

### 6.3 Ent vs GORM vs sqlc:三种数据层方案对比

这是项目选型时绕不开的对比。我把三者的取舍讲清楚。

| 维度 | Ent | GORM | sqlc |
|------|-----|------|------|
| Schema 定义 | Go 代码(Schema 即代码) | struct tag | 手写 SQL + 生成 Go |
| 类型安全 | 编译期(生成代码强类型) | 运行时(interface{}) | 编译期(生成代码强类型) |
| 行级安全(privacy) | 原生支持,框架强制 | 无,靠业务自觉 | 无,靠业务自觉 |
| 索引/外键/表名 | Schema 里声明 | struct tag 声明 | SQL 里声明 |
| 迁移 | `client.Schema.Create()` 自动 DDL | AutoMigrate | 手写迁移 |
| 学习曲线 | 中(需学 Schema/生成流程) | 低(最普及) | 中(需写 SQL) |

对这个项目而言,**Ent 的 `privacy` 是决定性因素**。GORM 和 sqlc 都没有"框架级强制 WHERE 注入"的能力——多租户、多用户的行级隔离如果用 GORM,只能靠每个查询手写 `WHERE tenant_id = ? AND user_id = ?`,漏写一处就是越权漏洞。Ent privacy 把这个变成 Schema 上的一次声明:

```go
func (Order) Policy() ent.Policy {
    return appPrivacy.UserPrivacy{}   // 框架自动注入 WHERE user_id = current_user
}
```

之后所有对 `Order` 表的查询,Ent 都会自动追加 `WHERE user_id = <viewer.uid>`,业务代码完全无感。这个能力 GORM 给不了,这是项目选 Ent 的核心理由。

代价是 Ent 的学习曲线和生成产物的体积。Ent 生成的代码(`ent/` 目录)体积很大,git diff 噪音多,需要团队约定 review 边界。但相比"漏写一处 WHERE 导致越权"的风险,这个代价值得。

---

## 七、Wire:编译期依赖注入的取舍

最后一个代码生成的环节是依赖注入。三个服务都用 [Google Wire](https://github.com/google/wire) 做编译期 DI。

### 7.1 injector 桩与 ProviderSet

每个服务的 `cmd/server/wire.go` 是 injector 桩,带 `//go:build wireinject` 构建标签:

```go
//go:build wireinject

func initApp(*bootstrap.Context) (*kratos.App, func(), error) {
    panic(wire.Build(
        serverProviders.ProviderSet,
        serviceProviders.ProviderSet,
        dataProviders.ProviderSet,
        newApp,
    ))
}
```

`make wire` 跑 `wire ./cmd/server`,Wire 读三个 `ProviderSet`(分别在 `internal/{data,server,service}/providers/wire_set.go`),生成 `wire_gen.go`(`//go:build !wireinject`),把整张依赖图具象化。

一个 `ProviderSet` 长这样(admin BFF 的 data 层):

```go
var ProviderSet = wire.NewSet(
    data.NewRedisClient,
    data.NewMinIoClient,
    data.NewDiscovery,            // etcd 服务发现
    data.NewAuthorizer,           // Casbin/OPA 引擎
    auth.NewTokenChecker,
    data.NewBrandServiceClient,   // core gRPC client 桩(生成代码)
    data.NewProductServiceClient,
    data.NewOrderServiceClient,
    // ... 约 40 个 core gRPC client 工厂
)
```

core 服务的 `ProviderSet` 则装配 `NewEntClient` → 每个 `NewXxxRepo` → 每个 `NewXxxService` → `NewGrpcServer`。

### 7.2 Wire vs 运行时 DI 的对比

| 维度 | Wire(编译期) | dig/fx(运行时) | 手写 main |
|------|-------------|---------------|----------|
| 注入时机 | 编译期代码生成 | 运行时反射 | 手写 |
| 启动开销 | 零 | 反射+图构建 | 零 |
| 依赖错误暴露 | 编译期 | 运行时(启动时 panic) | 运行时 |
| 可读性 | wire_gen.go 可 diff | 隐式,难追踪 | 显式但冗长 |
| 产物体积 | wire_gen.go 很大 | 无额外产物 | 无 |

Wire 的核心优势是**依赖错误在编译期暴露**。如果某个 service 缺少依赖,`wire` 命令直接报错,二进制根本编不出来。dig/fx 要等到启动时才发现。对一个有几百个 provider 的微服务,编译期暴露的价值很大。

代价是 `wire_gen.go` 体积大、可读性差。但它本质是"依赖关系的可 diff 快照"——review 它能快速看出谁依赖谁,反而比运行时 DI 的隐式图更透明。这个项目选 Wire 的理由和选 Ent 类似:**用编译期保证换取运行时安全。**

---

## 八、FieldMask:proto 怎么驱动部分更新

讲一个容易被忽略但很实际的契约驱动细节:部分更新(Partial Update)。

### 8.1 问题:全量更新会覆盖

UPDATE 操作如果做全量更新,会有个经典坑:前端只改了 `name`,但请求体里没传 `logo_url`(因为前端表单没这个字段),后端如果用请求体直接覆盖整行,`logo_url` 就被置空了。

### 8.2 proto 的 FieldMask

proto 的解法是 `google.protobuf.FieldMask`。每个 Update 请求带一个 `update_mask` 字段,列出本次要更新的字段路径:

```proto
message UpdateBrandRequest {
  optional Brand data = 1;
  optional google.protobuf.FieldMask update_mask = 2;
}
```

前端只发变更字段,并在 `update_mask` 里声明哪些字段变了。后端的 repo 根据这个 mask 只更新对应列,其余列不动。

### 8.3 Ent 侧的落地

`core/.../data/brand_repo.go` 的 `Update` 用了 `--feature sql/modifier` 提供的能力,根据 `update_mask` 动态拼装 UPDATE 语句的 SET 子句:

```go
func (r *BrandRepo) Update(ctx context.Context, req *catalogV1.UpdateBrandRequest) (*catalogV1.Brand, error) {
    // update_mask 决定哪些字段进 SET 子句
    // 没在 mask 里的字段不会被覆盖
}
```

这套机制是端到端的:proto 定义 mask → 生成 Go 类型 → 前端 TS 客户端生成对应的 mask API → 后端 Ent 根据_mask 拼装 SQL。没有一个环节需要手写"哪些字段能更新"的逻辑——它由 proto 声明,生成代码落地。

对比手写接口的常见做法:后端手写 `if req.Name != nil { update.SetName(*req.Name) }` 逐字段判断,漏一个就是 bug,多一个就是越权更新。FieldMask 把这个变成声明式,且由 proto 强制两端一致。

---

## 九、横向对比:这套方案 vs 另三种主流路径

把这套"proto-first + Ent + Wire"的方案,和另外三种常见路径做横向对比,讲清楚各自适合什么。

### 路径 A:OpenAPI-first(Swagger 注解驱动)

这是很多 Java/Node 项目的做法:后端用 Swagger 注解标注接口,生成 OpenAPI 文档,前端照文档手写 client。

- **优点**:OpenAPI 是开放标准,工具链丰富。
- **缺点**:文档是"从实现反推"的,注解和实现可能不一致;没有 gRPC 的能力(OpenAPI 只描述 HTTP);前端 client 仍需手写或用通用生成器,类型安全不如 proto。
- **适合**:纯 HTTP 项目,团队对 proto 有抵触。

这个项目没有选它,核心原因是它**不能同时生成 gRPC 和 HTTP**。三服务 BFF 架构里,BFF 暴露 HTTP、core 暴露 gRPC,两者要共享同一套 DTO——只有 proto 能做到"一份定义,两种传输"。OpenAPI-first 只能描述 HTTP,无法覆盖 core 的 gRPC 面。

### 路径 B:手写接口 + 手写文档

最常见的路径。后端用 gin/echo 手写 handler,Swagger 文档手写或用 swag 注解。

- **优点**:上手快,无学习曲线。
- **缺点**:文档和实现漂移是常态;前端没有类型化 client;错误码、校验、脱敏全靠手写,漏一处就是 bug 或漏洞;多传输(gRPC+HTTP)要写两套。
- **适合**:原型期、小项目、技术债可接受的项目。

这个项目面向"企业级出海电商脚手架",要支撑几十个领域、上百个接口、多传输、行级隔离、审计——手写接口的维护成本在这个规模下会失控。

### 路径 C:GraphQL + ORM

前端驱动查询,后端用 GraphQL schema + ORM。

- **优点**:前端灵活,按需取字段;schema 即契约。
- **缺点**:GraphQL 的 N+1 问题、鉴权粒度(每个 resolver 都要鉴权)、缓存复杂度都比 REST 高;ORM 仍需选型,行级隔离仍要自己实现;服务端渲染 SSR 对 GraphQL 不友好。
- **适合**:前端需求多变、BFF 聚合多后端的场景。

这个项目没选它,主要原因是电商场景的查询模式相对固定(商品列表、详情、订单流程),GraphQL 的灵活性收益不大,但它的鉴权复杂度和 N+1 风险在这个场景下是净负担。而且 SEO 对电商前台是刚需,REST + URL locale 比 GraphQL 更利于爬虫索引。

### 路径 D(本方案):proto-first + Ent + Wire

- **优点**:接口/数据/错误码/校验同源;多传输同源;行级隔离框架强制;依赖错误编译期暴露;前端类型化 client 自动生成。
- **缺点**:学习曲线陡(kratos+Ent+Wire+buf);生成产物体积大,diff 噪音多;proto 的表达力有边界(复杂业务逻辑仍要写在 service 里);生态比 Java/Node 小。
- **适合**:愿意投资工程基建、需要多传输、需要强隔离的团队;不适合快速原型或小团队。

没有银弹。这套方案的代价是显式的:学习曲线和生成产物。它的收益也是显式的:契约不漂移、行级隔离框架级强制、多传输同源。对这个项目的目标场景(企业级、多语言、多租户、审计合规),收益大于代价。

---

## 十、三个实战踩坑点

最后讲三个真实的踩坑点,都是这套机制在实际演进中暴露的。

### 10.1 OpenAPI 作用域裁剪:不做等于裸奔

前面 4.2 讲过这个。补充一个实际后果:如果 admin BFF 的 Swagger 里混进了 app BFF 的买家侧接口,运营在后台 Swagger 里就能看到并调通 `/app/v1/...` 的接口——这些接口的鉴权策略和后台不同(买家侧用 app authenticator,token 15 分钟过期),运营拿自己的 admin token 调过去可能直接 401,但也可能某些接口在白名单里(如登录),就变成"后台能直接调买家登录"。作用域裁剪把这种交叉暴露从源头掐了。

教训:**OpenAPI 文档的可见范围,要当成安全边界管理,不能默认全量。**

### 10.2 Ent auto-DDL 的开发爽生产坑

`core/.../configs/data.yaml` 里默认 `migrate: true`,Ent 启动时跑 `client.Schema.Create()` 自动建表建索引。开发时很爽——改 Schema 重启就生效。

但生产环境的坑:自动 DDL 不带版本化,无法回滚;多实例同时启动会并发 DDL 导致冲突;某些破坏性变更(删列、改列类型)自动 DDL 会直接执行,可能丢数据。

这个项目当前 `configs/` 里的 `migrate: true` 是开发默认,**生产必须关掉,改用版本化迁移工具**(如 atlas、golang-migrate)。这是"开发友好 ≠ 生产就绪"的一个典型例子。

### 10.3 gnostic OpenAPI 元数据:不写就没有文档

核心 proto 里能看到这样的注解:

```proto
repeated ProductTranslation translations = 20 [
    (gnostic.openapi.v3.property) = { ... }
];
```

`gnostic.openapi.v3.property` 是 gnostic 提供的 OpenAPI 字段元数据注解(描述、示例、是否只读等)。如果不写,生成的 OpenAPI 文档里这个字段就没有描述——Swagger UI 会显示一个光秃秃的字段名,前端工程师看不懂。

踩坑点:早期 schema 没写这些注解,Swagger 文档对前端几乎不可用,后来补齐。教训:**契约驱动不只是"有文档",文档的质量也要在 proto 里声明式地保证。**

---

## 结语

契约驱动不是一句口号,它是一套从 proto 出发、覆盖接口/数据/错误码/校验/文档/前端 client 的工程闭环。这套闭环的核心价值不是"少写代码",而是**把容易出错的人工协调,变成源头强制**:接口变更反射到所有消费方,行级隔离变成 Schema 声明,依赖错误在编译期暴露。

这套方案有它的代价——学习曲线、生成产物体积、生态规模。在选型时,这些代价要诚实评估。但对一个需要多传输、强隔离、审计合规的企业级场景,这套方案的收益是结构性的:它把"能不能做对"从依赖个人自觉,变成了依赖框架强制。

仓库地址: GitHub <https://github.com/tx7do/go-wind-shop>, Gitee <https://gitee.com/tx7do/go-wind-shop>。 所有文中配置和代码均可逐行核对。
