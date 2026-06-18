---
date: 2026-06-18
category:
  - Go编程
tag:
  - Golang
  - 架构
sticky: 10
---

# 技术复盘：基于 go-wind-cms 的官网+商城双业务渐进拆分实战

## 一、项目原始架构与初期设计取舍

### 1.1 初始架构：go-wind-cms 原生三层设计

项目初期，我们直接引入 [go-wind-cms](https://github.com/tx7do/go-wind-cms) 作为技术底座。其原生的目录结构完美契合了我们定下的**硬性分层规范**：

```bash
backend/app/
├── admin/service/   # Admin-BFF：管理后台聚合层
├── app/service/     # App-BFF：前台应用聚合层
└── core/service/    # Core大包：核心业务服务
```

**初期架构特点：**

- **Core 核心服务**：大包聚合设计，同时承载两大板块能力
  - **通用底层中台能力**：基于 `pkg/` 目录的 Casbin RBAC 权限、JWT 认证、OSS 文件存储、短信通知、支付网关、数据字典、全局工具类
  - **业务代码**：官网全部 CMS 内容业务逻辑（页面管理、新闻、导航、留言等），使用 Ent ORM 进行数据库操作

- **Admin-BFF 后台聚合层**：基于 Kratos 框架，**无业务逻辑、无数据库操作、无事务处理**，仅负责：
  - 管理后台请求路由分发
  - 多服务数据聚合
  - 前端接口字段裁剪
  - 统一网关鉴权

- **App-BFF C端聚合层**：**纯接入适配层，零业务代码**，面向官网前台、小程序、H5：
  - 请求转发
  - 接口缓存
  - 流量限流
  - 统一异常封装

**技术栈优势：**
- **API 契约优先**：利用 `buf.build` 和 Protobuf 定义接口，BFF 和 Core 之间通过严格的 `.proto` 文件解耦
- **依赖注入**：使用 Google Wire 进行依赖管理，代码结构清晰
- **ORM 高效**：Ent ORM 提供类型安全的数据库操作

**初期设计初衷**：用 Core 大包换开发效率，BFF 保持极致纯净。单业务场景下，这套架构足够轻便、开发调试简单，完全满足官网业务需求。

### 1.2 业务扩张引发架构质变

后期业务新增线上商城模块，包含商品管理、购物车、订单、库存、支付售后等完整交易链路。为了快速上线、不改动现有分层规范，团队直接将**全部商城交易业务代码写入 `core/service`**：

```bash
backend/app/core/service/
├── internal/
│   ├── biz/
│   │   ├── cms/        # CMS 业务逻辑
│   │   └── shop/       # 商城业务逻辑（新增）
│   ├── data/
│   │   ├── ent/
│   │   │   ├── schema/
│   │   │   │   ├── post.go      # CMS 文章
│   │   │   │   └── order.go     # 商城订单（新增）
│   │   │   └── client.go
│   │   └── service/
│   │       ├── cms_service.go
│   │       └── shop_service.go  # 新增
│   └── server/
│       └── grpc.go
└── cmd/
    └── server/
        └── wire.go              # 依赖注入配置（越来越复杂）
```

**最终架构现状**：公共中台能力 + 官网 CMS 内容业务 + 商城 Shop 交易业务，三类代码全部耦合在同一个 Core 服务中。

随着双业务并行迭代，Core 大包架构的技术债务彻底暴露。

---

## 二、Core大包耦合架构核心痛点复盘

### 2.1 Proto 契约与代码泥球

`core/service` 下的 `internal/service` 和 `internal/biz` 目录变得极其臃肿：

```protobuf
// api/core/v1/core.proto 文件越来越大
message Post {
  int64 id = 1;
  string title = 2;
  // ... CMS 字段
}

message Order {
  int64 id = 1;
  string order_no = 2;
  // ... 商城字段（新增）
}

service CoreService {
  rpc CreatePost(CreatePostRequest) returns (CreatePostReply);
  rpc CreateOrder(CreateOrderRequest) returns (CreateOrderReply); // 新增
}
```

- CMS 的内容服务和 Shop 的交易服务混在一起
- 每次修改商城订单逻辑，都要重新生成庞大的 Proto 代码
- 甚至引发 CMS 接口的意外冲突

### 2.2 发布耦合：任何小变更都要全量发布 Core

官网内容迭代、商城交易迭代、底层公共组件代码优化，全部业务代码耦合在 Core 内部：

- 官网内容发布，会短暂影响商城下单、支付、库存核心链路
- 商城订单逻辑迭代，发布风险会波及全量官网访问流量
- **业务无发布隔离能力**，非核心内容变更也要承担交易系统线上故障风险

### 2.3 Ent ORM 的"混库"灾难

`go-wind-cms` 默认使用 Ent 管理数据库。当 CMS 的 `Post`（文章）表和 Shop 的 `Order`（订单）表在同一个 Ent Client 下时：

```go
// core/service/internal/data/ent/client.go
client, err := ent.Open("mysql", dsn)
// 所有表都在同一个 client 下
// Post 表（CMS）
// Order 表（商城）
// User 表（公共）
```

**问题表现：**
1. **业务 SQL 互相影响**：商城大促时的复杂库存扣减事务，会长时间占用数据库连接池，导致 CMS 前台的文章列表查询超时
2. **资金数据无隔离**：订单、支付流水等敏感交易数据与公开资讯数据同库，无法独立审计、独立备份、独立权限隔离
3. **无法差异化优化**：CMS 几乎不需要数据库事务，商城下单、扣库存强依赖本地事务一致性。两类业务耦合后，事务参数、锁策略只能统一配置

### 2.4 Wire 依赖注入地狱

在 `core/service` 的 `wire_gen.go` 中，CMS 的依赖和 Shop 的依赖全部交织在一起：

```go
// core/service/cmd/server/wire_gen.go
func NewApp(*conf.Bootstrap, *log.Logger, *ent.Client, 
             *redis.Client,        // CMS 重度依赖
             *elasticsearch.Client, // CMS 全文检索
             *kafka.Producer,       // 商城消息队列
             *sync.RWMutex,         // 商城分布式锁
             // ... 几十个依赖
            ) (*App, func(), error) {
    // 启动一个服务需要初始化几十个 Provider
    // 本地调试启动极慢（30s+）
}
```

### 2.5 流量模型不匹配，无法独立弹性扩缩容

- **官网 CMS**：流量平稳、读多写少、无事务、无瞬时峰值，资源消耗极低
- **商城交易**：大促洪峰、库存锁竞争、高频事务写入、数据库压力极大

Kratos 服务作为一个整体部署，无法做到"CMS 节点保持 2 个，Shop 节点在大促时扩容到 20 个"。只能按照商城峰值配置机器，官网长期闲置浪费服务器资源。

---

## 三、目标演进架构：五层轻中台无侵入拆分方案

### 3.1 最终架构全貌

基于 `go-wind-cms` 的目录结构演进为：

```bash
backend/app/
├── admin/service/       # Admin-BFF (纯聚合)
├── app/service/         # App-BFF (纯聚合)
├── system/service/      # Core 中台 (用户/权限/租户/字典/OSS)
├── cms/service/         # Cms 业务 (内容/分类/站点/SEO)
└── shop/service/        # Shop 业务 (商品/订单/库存/支付)
```

**核心设计思想**：
- 业务代码全部迁出 Core，还原中台底座本职
- 业务域彻底拆分隔离
- BFF 保持原有纯净设计，不新增任何业务逻辑
- 全程不改动原有 BFF 分层理念，尊重初期架构规范

### 3.2 分层职责边界（严格对齐原有架构规范）

#### 🔹 system/service 公共中台（彻底去业务化）

**定位**：纯底层通用原子能力，彻底剥离所有业务代码

**能力范围**：
- 用户鉴权（JWT + Casbin）
- 权限体系（RBAC）
- 文件存储（OSS/S3）
- 消息推送（短信/邮件）
- 支付通道（微信/支付宝）
- 数据字典
- 缓存（Redis）
- 通用工具

**强制约束**：
- 禁止任何业务代码侵入
- 接口永久向前兼容
- 底层变更灰度发布

**独立存储**：`system_db`，仅存放公共基础数据

#### 🔹 cms/service 内容业务服务

**定位**：承接全部官网内容业务，与交易业务完全解耦

**技术栈特点**：
- 重度依赖 Redis 缓存（文章列表、详情页）
- 集成 OpenSearch/Elasticsearch 全文检索
- 集成 CDN 加速静态资源

**依赖规则**：仅依赖 system 中台，和 shop 服务无任何互相调用

**独立存储**：`cms_db`

#### 🔹 shop/service 交易业务服务

**定位**：承接全部电商交易业务，独立闭环处理下单、库存、订单全流程

**技术栈特点**：
- 引入分布式锁（Redis RedLock）
- 集成消息队列（Kafka/RabbitMQ）处理异步订单
- 使用本地数据库事务保证订单一致性

**关键设计**：服务内部使用本地数据库事务，规避过早引入分布式事务带来的复杂度

**依赖规则**：仅依赖 system 中台，和 cms 服务零耦合

**独立存储**：`shop_db`，交易数据物理隔离，满足资金安全审计

#### 🔹 app/service（保持原有设计不变）

依旧是纯 C 端接入层，**零业务代码、零 DB 操作**：

```go
// app/service/internal/service/app_service.go
type AppService struct {
    // 只持有 gRPC Client，不持有 Ent Client
    cmsClient  pb.CMSClient   // 调用 cms/service
    shopClient pb.ShopClient  // 调用 shop/service
    sysClient  pb.SysClient   // 调用 system/service
}

func (s *AppService) GetPostList(ctx context.Context, req *pb.ListRequest) (*pb.ListReply, error) {
    // 仅做请求转发和字段裁剪
    return s.cmsClient.GetPostList(ctx, req)
}

func (s *AppService) CreateOrder(ctx context.Context, req *pb.CreateOrderRequest) (*pb.CreateOrderReply, error) {
    // 仅做请求转发
    return s.shopClient.CreateOrder(ctx, req)
}
```

#### 🔹 admin/service（保持原有设计不变）

依旧是纯后台接入层，**无业务逻辑、无事务处理**：

```go
// admin/service/internal/service/admin_service.go
type AdminService struct {
    cmsClient  pb.CMSClient
    shopClient pb.ShopClient
    sysClient  pb.SysClient
}

// 多服务数据聚合示例
func (s *AdminService) GetDashboard(ctx context.Context, req *pb.DashboardRequest) (*pb.DashboardReply, error) {
    // 并行调用多个服务
    var (
        postStats  *pb.PostStatsReply
        orderStats *pb.OrderStatsReply
        userStats  *pb.UserStatsReply
    )
    
    eg, ctx := errgroup.WithContext(ctx)
    eg.Go(func() error {
        postStats, _ = s.cmsClient.GetPostStats(ctx, &pb.Empty{})
        return nil
    })
    eg.Go(func() error {
        orderStats, _ = s.shopClient.GetOrderStats(ctx, &pb.Empty{})
        return nil
    })
    eg.Go(func() error {
        userStats, _ = s.sysClient.GetUserStats(ctx, &pb.Empty{})
        return nil
    })
    
    _ = eg.Wait()
    
    // 聚合数据返回
    return &pb.DashboardReply{
        Posts:  postStats,
        Orders: orderStats,
        Users:  userStats,
    }, nil
}
```

### 3.3 全链路请求流程图

```mermaid
flowchart LR
    %% 客户端 (体育场形状)
    A([🌐 官网前端])
    C([📱 商城小程序/H5])
    D([💻 运营管理后台])

    %% BFF 层 (六边形)
    B{{app/service\nC端聚合层}}
    E{{admin/service\n后台聚合层}}

    %% 业务服务层 (矩形)
    F[cms/service\n内容业务域]
    G[shop/service\n交易业务域]

    %% 中台底座 (矩形)
    H[system/service\n公共中台底座]

    %% 数据库 (圆柱体)
    I[(cms_db)]
    J[(shop_db)]
    K[(system_db)]

    %% 连线
    A --> B
    C --> B
    D --> E

    B --> F
    B --> G
    B --> H

    E --> F
    E --> G
    E --> H

    F --> H
    G --> H
    
    F --> I
    G --> J
    H --> K

    %% 样式定义 (GitHub 风格色彩，完美适配亮/暗模式)
    classDef client fill:#6e7781,stroke:#57606a,color:#ffffff,stroke-width:2px;
    classDef bff fill:#1f6feb,stroke:#1158c7,color:#ffffff,stroke-width:2px;
    classDef biz fill:#238636,stroke:#196c2e,color:#ffffff,stroke-width:2px;
    classDef core fill:#8957e5,stroke:#6e40c9,color:#ffffff,stroke-width:2px;
    classDef db fill:#21262d,stroke:#8b949e,color:#f0f6fc,stroke-width:2px;

    class A,C,D client;
    class B,E bff;
    class F,G biz;
    class H core;
    class I,J,K db;
```

### 3.4 Proto 契约模块化设计

利用 `buf.build` 的模块化能力，将原本集中在 `core` 下的 `.proto` 文件进行物理拆分：

```bash
api/
├── system/
│   └── v1/
│       ├── auth.proto      # 认证接口
│       ├── user.proto      # 用户管理
│       ├── role.proto      # 角色权限
│       └── oss.proto       # 文件存储
├── cms/
│   └── v1/
│       ├── post.proto      # 文章管理
│       ├── category.proto  # 分类管理
│       └── site.proto      # 站点配置
└── shop/
    └── v1/
        ├── product.proto   # 商品管理
        ├── order.proto     # 订单管理
        ├── cart.proto      # 购物车
        └── payment.proto   # 支付
```

**buf.yaml 配置：**

```yaml
version: v1
name: buf.build/your-org/go-wind-cms
deps:
  - buf.build/googleapis/googleapis
breaking:
  use:
    - FILE
lint:
  use:
    - DEFAULT
```

### 3.5 三库物理隔离方案

1. **system_db**：公共用户、权限、文件、支付渠道配置
2. **cms_db**：官网新闻、页面、导航、留言等全部内容数据
3. **shop_db**：商品、订单、库存、支付、售后全部交易数据

**Ent Schema 分离：**

```bash
# system/service
internal/data/ent/schema/
├── user.go
├── role.go
└── permission.go

# cms/service
internal/data/ent/schema/
├── post.go
├── category.go
└── tag.go

# shop/service
internal/data/ent/schema/
├── product.go
├── order.go
├── order_item.go
└── inventory.go
```

三库完全独立，禁止跨库联表查询，从存储层面彻底斩断业务耦合。

---

## 四、四阶段平滑渐进拆分方案（无停机、无大规模重构）

> **拆分核心原则**：增量拆分、存量兼容、不推翻原有代码、不改动 BFF 分层、全程灰度上线

### 阶段一：提纯 Core 底座，剥离全部业务代码

**目标**：将 `core/service` 重命名为 `system/service`，彻底删除 CMS 和 Shop 的业务代码

**步骤：**

1. **梳理 Core 内所有业务代码**
   ```bash
   # 查找所有 CMS 相关代码
   grep -r "Post\|Category\|Tag" backend/app/core/service/
   
   # 查找所有 Shop 相关代码
   grep -r "Order\|Product\|Inventory" backend/app/core/service/
   ```

2. **拆分 Proto 文件**
   ```bash
   # 将 api/core/v1/core.proto 拆分
   mv api/core/v1/post.proto api/cms/v1/
   mv api/core/v1/order.proto api/shop/v1/
   mv api/core/v1/auth.proto api/system/v1/
   ```

3. **拆分 Ent Schema**
   ```bash
   # 创建独立的 Ent 项目
   cd backend/app/system/service
   go run entgo.io/ent/cmd/ent new User
   go run entgo.io/ent/cmd/ent new Role
   
   cd backend/app/cms/service
   go run entgo.io/ent/cmd/ent new Post
   go run entgo.io/ent/cmd/ent new Category
   
   cd backend/app/shop/service
   go run entgo.io/ent/cmd/ent new Order
   go run entgo.io/ent/cmd/ent new Product
   ```

4. **拆分数据库**
   ```sql
   -- 创建独立数据库
   CREATE DATABASE system_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE cms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE shop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- 迁移数据
   -- system_db: sys_user, sys_role, sys_permission
   -- cms_db: cms_post, cms_category, cms_tag
   -- shop_db: shop_order, shop_product, shop_inventory
   ```

5. **重构 Wire 依赖注入**
   ```go
   // system/service/cmd/server/wire.go
   //go:build wireinject
   // +build wireinject
   
   func NewApp(*conf.Bootstrap, *log.Logger) (*App, func(), error) {
       panic(wire.Build(
           providerSet,
           // 只包含 system 相关依赖
           data.NewEntClient,
           redis.NewClient,
           casbin.NewEnforcer,
       ))
   }
   ```

**阶段目标**：`system/service` 彻底稳定，后续只做底层能力迭代，不再跟随业务需求频繁发版。

### 阶段二：抽离 Cms 独立服务，迁移官网全量业务

**步骤：**

1. **新建独立 Cms 服务**
   ```bash
   # 基于 go-wind-cms 模板创建新服务
   kratos new cms/service
   
   # 复制业务代码
   cp -r backend/app/core/service/internal/biz/cms/* backend/app/cms/service/internal/biz/
   cp -r backend/app/core/service/internal/data/cms/* backend/app/cms/service/internal/data/
   ```

2. **独立搭建 cms_db**
   ```bash
   # 生成 Ent 客户端
   cd backend/app/cms/service
   go generate ./...
   
   # 执行数据库迁移
   ent migrate --url "mysql://root:password@tcp(localhost:3306)/cms_db"
   ```

3. **修改双 BFF 调用链路**
   ```go
   // app/service/internal/conf/conf.proto
   message Bootstrap {
       Server server = 1;
       Data data = 2;
       // 新增服务发现配置
       Registry registry = 3;
   }
   
   message Registry {
       string consul = 1;  // 或 etcd/nacos
   }
   ```
   
   ```go
   // app/service/internal/service/app_service.go
   type AppService struct {
       pb.UnimplementedAppServer
       
       // 从本地调用改为 gRPC 远程调用
       cmsClient  pb.CMSClient
       shopClient pb.ShopClient
       sysClient  pb.SysClient
   }
   
   func NewAppService(cmsClient pb.CMSClient, shopClient pb.ShopClient, sysClient pb.SysClient) *AppService {
       return &AppService{
           cmsClient:  cmsClient,
           shopClient: shopClient,
           sysClient:  sysClient,
       }
   }
   ```

4. **配置服务发现与负载均衡**
   ```go
   // app/service/cmd/server/main.go
   import (
       "github.com/go-kratos/kratos/v2/registry"
       "github.com/go-kratos/kratos/contrib/registry/consul/v2"
       consulAPI "github.com/hashicorp/consul/api"
   )
   
   func main() {
       // 初始化 Consul 注册中心
       consulClient, _ := consulAPI.NewClient(consulAPI.DefaultConfig())
       reg := consul.NewRegistry(consulClient)
       
       // 创建 gRPC Client
       conn, err := grpc.DialInsecure(
           context.Background(),
           grpc.WithEndpoint("discovery:///cms.service"),
           grpc.WithDiscovery(reg),
           grpc.WithMiddleware(
               retry.Middleware(),
               circuitbreaker.Middleware(),
           ),
       )
       cmsClient := pb.NewCMSClient(conn)
   }
   ```

5. **灰度发布验证**
   - 部署 `cms/service` 到测试环境
   - 修改 BFF 配置，将 10% 流量切到新服务
   - 监控错误率、延迟指标
   - 逐步增加流量至 100%
   - 清理 `system/service` 内残留内容代码

### 阶段三：新建 Shop 独立服务，迁移商城交易业务

**步骤：**

1. **新建独立 Shop 服务**
   ```bash
   kratos new shop/service
   
   # 复制商城业务代码
   cp -r backend/app/core/service/internal/biz/shop/* backend/app/shop/service/internal/biz/
   ```

2. **搭建独立 shop_db**
   ```go
   // shop/service/internal/data/ent/schema/order.go
   // 标准化设计订单状态机
   type Order struct {
       ent.Schema
   }
   
   func (Order) Fields() []ent.Field {
       return []ent.Field{
           field.Int64("id"),
           field.String("order_no").Unique(),
           field.Enum("status").Values(
               "PENDING",
               "PAID",
               "SHIPPED",
               "COMPLETED",
               "CANCELLED",
           ),
           field.Decimal("amount", 10, 2),
           field.Time("created_at").Default(time.Now),
       }
   }
   ```

3. **实现本地事务处理**
   ```go
   // shop/service/internal/biz/order.go
   type OrderRepo interface {
       ent.Tx
       CreateOrder(ctx context.Context, order *ent.Order) (*ent.Order, error)
       DecrInventory(ctx context.Context, productID int64, quantity int) error
   }
   
   type OrderUsecase struct {
       repo OrderRepo
   }
   
   func (uc *OrderUsecase) CreateOrder(ctx context.Context, req *pb.CreateOrderRequest) (*ent.Order, error) {
       // 使用本地事务
       tx, err := uc.repo.Tx(ctx)
       if err != nil {
           return nil, err
       }
       
       // 确保事务回滚
       defer func() {
           if v := recover(); v != nil {
               tx.Rollback()
               panic(v)
           }
       }()
       
       // 创建订单
       order, err := tx.CreateOrder(ctx, &ent.Order{
           OrderNo: generateOrderNo(),
           Amount:  req.Amount,
           Status:  "PENDING",
       })
       if err != nil {
           tx.Rollback()
           return nil, err
       }
       
       // 扣减库存
       for _, item := range req.Items {
           err = tx.DecrInventory(ctx, item.ProductID, item.Quantity)
           if err != nil {
               tx.Rollback()
               return nil, err
           }
       }
       
       // 提交事务
       if err := tx.Commit(); err != nil {
           return nil, err
       }
       
       return order, nil
   }
   ```

4. **双 BFF 新增商城路由与聚合模块**
   ```go
   // app/service/internal/server/grpc.go
   func NewGRPCServer(c *conf.Server, shopClient pb.ShopClient, cmsClient pb.CMSClient) *grpc.Server {
       srv := grpc.NewServer(
           grpc.Address(c.Addr),
           grpc.Timeout(10*time.Second),
       )
       
       pb.RegisterAppServer(srv, NewAppService(cmsClient, shopClient, sysClient))
       return srv
   }
   ```

5. **所有交易事务、库存扣减、订单流转逻辑全部留在 Shop 内部**
   - 复用本地事务，避免分布式事务复杂度
   - 引入消息队列处理异步任务（发货通知、库存预警）

### 阶段四：链路治理与 CI/CD 流水线拆分

**步骤：**

1. **双 BFF 内部按业务域分包**
   ```bash
   app/service/internal/service/
   ├── cms_service.go      # CMS 相关接口聚合
   ├── shop_service.go     # 商城相关接口聚合
   └── system_service.go   # 系统相关接口聚合
   ```

2. **BFF 统一增加超时控制、熔断、降级、重试**
   ```go
   // app/service/internal/middleware/middleware.go
   func SetupMiddleware() []grpc.ServerOption {
       return []grpc.ServerOption{
           grpc.Middleware(
               recovery.Recovery(),
               validate.Validator(),
               logging.Server(logger),
               metrics.Server(),
               tracing.Server(),
               // 超时控制
               timeout.Server(5*time.Second),
               // 熔断降级
               circuitbreaker.Server(),
               // 限流
               ratelimit.Server(),
           ),
       }
   }
   ```
   
   ```go
   // BFF 调用下游服务时的客户端配置
   conn, err := grpc.DialInsecure(
       context.Background(),
       grpc.WithEndpoint("discovery:///shop.service"),
       grpc.WithDiscovery(reg),
       grpc.WithMiddleware(
           retry.Middleware(
               retry.WithAttempts(3),
               retry.WithTimeout(3*time.Second),
           ),
           circuitbreaker.Middleware(),
       ),
   )
   ```

3. **C 端高频页面查询在 BFF 增加 Redis 二级缓存**
   ```go
   // app/service/internal/service/cms_service.go
   type CMSService struct {
       cache *redis.Client
       client pb.CMSClient
   }
   
   func (s *CMSService) GetPostList(ctx context.Context, req *pb.ListRequest) (*pb.ListReply, error) {
       // 缓存 Key
       cacheKey := fmt.Sprintf("cms:post:list:%d:%d", req.Page, req.PageSize)
       
       // 尝试从缓存获取
       cached, err := s.cache.Get(ctx, cacheKey).Bytes()
       if err == nil {
           reply := &pb.ListReply{}
           proto.Unmarshal(cached, reply)
           return reply, nil
       }
       
       // 缓存未命中，调用下游服务
       reply, err := s.client.GetPostList(ctx, req)
       if err != nil {
           return nil, err
       }
       
       // 写入缓存（5分钟过期）
       data, _ := proto.Marshal(reply)
       s.cache.Set(ctx, cacheKey, data, 5*time.Minute)
       
       return reply, nil
   }
   ```

4. **拆分流水线：Core、Cms、Shop、双 BFF 支持独立打包、独立发布、独立扩缩容**
   ```yaml
   # .github/workflows/build.yml
   name: Build and Deploy
   
   on:
     push:
       branches: [main]
       paths:
         - 'backend/app/cms/service/**'
         - 'backend/app/shop/service/**'
         - 'backend/app/system/service/**'
         - 'backend/app/admin/service/**'
         - 'backend/app/app/service/**'
   
   jobs:
     build-cms:
       if: contains(github.event.head_commit.message, 'cms')
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Build CMS Service
           run: |
             cd backend/app/cms/service
             kratos build
         - name: Deploy to K8s
           run: |
             kubectl apply -f k8s/cms/
   
     build-shop:
       if: contains(github.event.head_commit.message, 'shop')
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Build Shop Service
           run: |
             cd backend/app/shop/service
             kratos build
         - name: Deploy to K8s
           run: |
             kubectl apply -f k8s/shop/
   ```

---

## 五、架构拆分前后收益对照

| 维度 | 拆分前（Core 大包） | 拆分后（五层架构） | 收益 |
|------|------------------|------------------|------|
| **发布频率** | 每周 1-2 次全量发布 | 各服务独立发布，每天多次 | 发布风险降低 80% |
| **发布影响范围** | 全业务受影响 | 仅影响单一服务 | 故障爆炸半径收敛 |
| **启动时间** | 30s+ | 5-10s/服务 | 本地开发效率提升 3 倍 |
| **资源利用率** | 按商城峰值配置，CMS 闲置 | CMS 2 节点常驻，商城弹性扩容 | 服务器成本降低 40% |
| **数据库性能** | CMS 慢查询阻塞商城事务 | 三库物理隔离 | 核心交易稳定性提升 |
| **数据合规** | 交易数据与公开数据混库 | shop_db 独立审计备份 | 满足资金安全要求 |
| **代码维护** | 代码冲突频繁 | 业务域物理隔离 | 开发效率提升 50% |
| **技术栈灵活性** | 统一技术栈 | CMS 可用 ES/CDN，Shop 可用 MQ/锁 | 架构适配业务 |

---

## 六、拆分后新增分布式问题与落地解决方案

### 问题 1：调用链路变长，级联故障风险提升

**问题描述**：
请求链路：前端 → BFF → 业务服务 → system 服务，多层网络调用，下游超时会影响上游响应。

**解决方案**：

1. **BFF 层统一做容错治理**
   ```go
   // 配置接口超时、熔断降级
   grpc.WithTimeout(3 * time.Second)
   grpc.WithMiddleware(circuitbreaker.Middleware())
   ```

2. **C 端高频页面查询在 BFF 增加 Redis 二级缓存**
   - 减少远程调用次数
   - 缓存命中率可达 80%+

3. **全链路超时控制**
   ```go
   // 总超时 = BFF 超时 < CMS/Shop 超时 < system 超时
   // BFF: 5s
   // CMS/Shop: 3s
   // system: 2s
   ```

4. **降级策略**
   ```go
   // 当 CMS 服务不可用时，返回缓存数据或空列表
   func (s *CMSService) GetPostList(ctx context.Context, req *pb.ListRequest) (*pb.ListReply, error) {
       reply, err := s.client.GetPostList(ctx, req)
       if err != nil {
           // 降级：返回缓存数据
           return s.getCachedPostList(ctx, req)
       }
       return reply, nil
   }
   ```

### 问题 2：system 作为底层公共依赖，变更影响全业务

**问题描述**：
system 接口一旦变更，会同时影响 cms 和 shop 两大业务服务。

**解决方案**：

1. **严格执行接口兼容原则**
   - **只增字段、不改逻辑、不删参数**
   - 使用 Protobuf 的 `reserved` 关键字保留已删除字段编号
   ```protobuf
   message User {
       reserved 3;  // 已删除字段编号
       reserved "old_field";
       
       string name = 1;
       string email = 2;
       string phone = 4;  // 新增字段
   }
   ```

2. **版本化 API**
   ```bash
   api/system/
   ├── v1/  # 当前版本
   └── v2/  # 新版本（兼容旧版）
   ```

3. **底层所有变更必须覆盖官网、商城双场景回归**
   ```yaml
   # CI/CD 中的回归测试
   test:
     stages:
       - unit_test
       - integration_test
       - e2e_test  # 包含 CMS + Shop 全场景
   ```

4. **灰度分批发布**
   - 先发布到 10% 节点
   - 监控错误率、延迟
   - 逐步扩大至 100%

### 问题 3：分库之后无法联表，后台复杂报表开发变复杂

**问题描述**：
混库时期可直接联表查询用户 + 订单数据，分库后跨业务无法 SQL 联表。

**解决方案**：

1. **所有多源数据聚合逻辑统一收敛到 Admin-BFF**
   ```go
   // admin/service/internal/service/report_service.go
   func (s *ReportService) GetUserOrderReport(ctx context.Context, req *pb.ReportRequest) (*pb.ReportReply, error) {
       // 并行调用多个服务
       eg, ctx := errgroup.WithContext(ctx)
       
       var users []*ent.User
       var orders []*ent.Order
       
       eg.Go(func() error {
           users, _ = s.sysClient.ListUsers(ctx, &pb.ListRequest{})
           return nil
       })
       
       eg.Go(func() error {
           orders, _ = s.shopClient.ListOrders(ctx, &pb.ListRequest{})
           return nil
       })
       
       _ = eg.Wait()
       
       // 在内存中聚合
       report := s.aggregateInMemory(users, orders)
       return report, nil
   }
   ```

2. **后台低频复杂报表，通过定时任务预聚合写入缓存**
   ```go
   // 定时任务：每天凌晨 2 点生成报表
   func (s *ReportService) DailyReportJob(ctx context.Context) {
       // 1. 从各服务拉取数据
       users := s.sysClient.GetAllUsers(ctx)
       orders := s.shopClient.GetAllOrders(ctx)
       posts := s.cmsClient.GetAllPosts(ctx)
       
       // 2. 聚合计算
       report := s.CalculateReport(users, orders, posts)
       
       // 3. 写入缓存或报表数据库
       s.cache.Set(ctx, "daily:report", report, 24*time.Hour)
   }
   ```

3. **引入 OLAP 数据库（可选）**
   - 对于超复杂报表，可将数据同步到 ClickHouse/Doris
   - 通过 CDC（Change Data Capture）实时同步

### 问题 4：本地开发需要启动多服务，调试成本上升

**问题描述**：
本地调试需要同时启动 5 个服务，启动耗时增加。

**解决方案**：

1. **提供一键启停本地脚本**
   ```bash
   # scripts/dev.sh
   #!/bin/bash
   
   # 启动所有服务
   start_all() {
       cd backend/app/system/service && kratos run &
       cd backend/app/cms/service && kratos run &
       cd backend/app/shop/service && kratos run &
       cd backend/app/admin/service && kratos run &
       cd backend/app/app/service && kratos run &
   }
   
   # 按需启动
   start_service() {
       local service=$1
       cd backend/app/$service/service && kratos run
   }
   
   case "$1" in
       all) start_all ;;
       cms) start_service cms ;;
       shop) start_service shop ;;
       *) echo "Usage: $0 {all|cms|shop|admin|app|system}" ;;
   esac
   ```

2. **开发环境内置 system Mock 能力**
   ```go
   // 开发环境使用 Mock 替代真实 system 服务
   // +build dev
   
   type MockSysClient struct {
       pb.SysClient
   }
   
   func (m *MockSysClient) GetUserInfo(ctx context.Context, req *pb.GetUserInfoRequest) (*pb.GetUserInfoReply, error) {
       // 返回 Mock 数据
       return &pb.GetUserInfoReply{
           Id:    1,
           Name:  "Mock User",
           Email: "mock@example.com",
       }, nil
   }
   ```

3. **Docker Compose 一键启动依赖服务**
   ```yaml
   # docker-compose.dev.yml
   version: '3'
   services:
     mysql:
       image: mysql:8.0
       environment:
         MYSQL_ROOT_PASSWORD: root
       ports:
         - "3306:3306"
     
     redis:
       image: redis:alpine
       ports:
         - "6379:6379"
     
     consul:
       image: consul:latest
       ports:
         - "8500:8500"
   ```

4. **IDE 配置多服务同时调试**
   - VS Code 使用 `launch.json` 配置多进程调试
   - Goland 使用 Compound Run Configuration

---

## 七、架构选型权衡：拒绝两个极端

### 7.1 为什么不继续保留 Core 大包架构？

初期大包架构只是**阶段性折中方案**，业务单一可以够用，但双业务并行后：

- **发布风险**：任何小变更都要全量发布，故障影响面大
- **数据库干扰**：CMS 慢查询阻塞商城事务
- **代码耦合**：业务代码混在一起，维护困难
- **底座不稳定**：Core 被迫高频变更，丧失中台稳定性

后期重构成本远高于前期渐进拆分成本。

### 7.2 为什么不一步到位做重型微服务拆分？

业界常见做法是把商城拆分为商品、订单、库存、支付独立微服务，本次架构刻意规避：

1. **过早细粒度拆分，必须引入分布式事务框架**
   - Seata、Saga 等框架开发与线上排障成本指数上升
   - 团队技术储备不足，容易踩坑

2. **服务数量爆炸**
   - 从 5 个服务变成 10+ 个服务
   - 运维监控、日志、流水线复杂度大幅提高
   - 需要引入 Service Mesh、API Gateway 等重型组件

3. **中小业务体量无高并发诉求**
   - 日活 < 10 万，QPS < 1000
   - 过度拆分属于典型过度设计
   - 单机性能足够支撑业务

**最终选型结论**：

按业务域粗粒度拆分服务（CMS、Shop、System），业务服务内部保留本地事务，用最低的分布式代价，换取业务完全隔离，是中小团队最优解。

---

## 八、后续长期演进路线

### 8.1 中长期稳定期（1-2 年）

**维持当前五层架构，无需改动**

- CMS 服务：2-4 节点常驻
- Shop 服务：4-8 节点（根据流量弹性伸缩）
- System 服务：2 节点常驻
- BFF 服务：2-4 节点

**收益**：兼顾开发效率、运维成本与业务隔离能力

### 8.2 商城高并发爆发期（日活 > 50 万）

**仅垂直拆分 Shop 交易服务**

```bash
backend/app/shop/
├── product/service   # 商品服务
├── order/service     # 订单服务
├── inventory/service # 库存服务
└── payment/service   # 支付服务
```

**拆分策略**：
- 引入分布式事务（Seata/TCC）
- 拆分数据库：product_db、order_db、inventory_db、payment_db
- **Core、Cms、双 BFF 全部不动**，架构无缝平滑升级

### 8.3 超大规模期（日活 > 200 万）

**引入 Service Mesh**
- Istio/Linkerd 管理服务间通信
- 统一流量治理、可观测性

**引入 API Gateway**
- Kong/Apache APISIX
- 统一鉴权、限流、路由

**引入事件驱动架构**
- Kafka/Pulsar 事件总线
- CQRS + Event Sourcing

---

## 九、总结

### 9.1 架构演进核心思想

本次架构演进，并非修复初期架构设计错误，而是**阶段性架构适配升级**：

1. **项目初期**：为了快速落地，选择 Core 大包聚合换取开发效率
2. **业务扩张**：通过渐进式拆分，归还 Core 中台底座本职，拆分两大异构业务域
3. **全程坚守**：BFF 永远只做接入聚合，不触碰任何业务逻辑

### 9.2 go-wind-cms 的核心价值

基于 `go-wind-cms` 的架构演进，展现了优秀脚手架的核心价值：

1. **完美的起步架构**
   - 初期的 `Admin-App-Core` 三层设计，强制团队养成良好习惯
   - 避免了初期代码乱写

2. **预留了微服务演进的后门**
   - 基于 Kratos 和 Protobuf 的设计，BFF 和 Core 之间天然存在清晰的 API 契约
   - 拆分时只需把 Proto 文件挪位置，把实现代码迁移即可

3. **基础设施开箱即用**
   - 拆分后立刻享受 Kratos 带来的服务发现、链路追踪、gRPC 通信等微服务红利
   - 无需重复造轮子

### 9.3 技术栈选型总结

| 组件 | 选型 | 理由 |
|------|------|------|
| 框架 | Kratos | Bilibili 开源，Go 微服务最佳实践 |
| ORM | Ent | Facebook 开源，类型安全，代码生成 |
| API 契约 | Protobuf + buf | 强类型，版本管理，跨语言 |
| 依赖注入 | Wire | Google 开源，编译时注入，性能优 |
| 服务发现 | Consul/Etcd | 成熟稳定，生态完善 |
| 缓存 | Redis | 高性能，数据结构丰富 |
| 消息队列 | Kafka | 高吞吐，适合订单异步处理 |
| 链路追踪 | Jaeger + OpenTelemetry | CNCF 标准，生态完善 |

### 9.4 最终结论

这套演进方案，完美适配**内容 + 交易双业务并存**的后端系统：

✅ **避开了单体大包的耦合痛点**
- 发布隔离
- 数据隔离
- 资源隔离

✅ **规避了重型微服务的运维复杂度**
- 服务数量可控（5 个）
- 无需分布式事务
- 运维成本适中

✅ **保留了未来扩展的灵活性**
- 可按需垂直拆分
- 架构平滑升级
- 技术债可控

**这是 Go 语言后端轻中台架构最务实的演进方案。**

---

## 附录：关键代码示例

### A.1 Proto 文件示例

```protobuf
// api/shop/v1/order.proto
syntax = "proto3";

package shop.v1;

import "google/api/annotations.proto";

option go_package = "shop/api/v1;v1";

service OrderService {
  rpc CreateOrder(CreateOrderRequest) returns (CreateOrderReply) {
    option (google.api.http) = {
      post: "/api/v1/orders"
      body: "*"
    };
  }
  
  rpc GetOrder(GetOrderRequest) returns (GetOrderReply) {
    option (google.api.http) = {
      get: "/api/v1/orders/{id}"
    };
  }
}

message CreateOrderRequest {
  repeated OrderItem items = 1;
  string address = 2;
  string phone = 3;
}

message OrderItem {
  int64 product_id = 1;
  int32 quantity = 2;
}

message CreateOrderReply {
  string order_no = 1;
  string status = 2;
}

message GetOrderRequest {
  int64 id = 1;
}

message GetOrderReply {
  Order order = 1;
}

message Order {
  int64 id = 1;
  string order_no = 2;
  string status = 3;
  repeated OrderItem items = 4;
  string address = 5;
  decimal amount = 6;
  string created_at = 7;
}
```

### A.2 Ent Schema 示例

```go
// shop/service/internal/data/ent/schema/order.go
package schema

import (
    "time"
    "entgo.io/ent"
    "entgo.io/ent/schema/field"
    "entgo.io/ent/schema/index"
)

type Order struct {
    ent.Schema
}

func (Order) Fields() []ent.Field {
    return []ent.Field{
        field.Int64("id").Positive(),
        field.String("order_no").Unique(),
        field.Enum("status").
            Values("PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED").
            Default("PENDING"),
        field.Decimal("amount", 10, 2).Positive(),
        field.String("address"),
        field.String("phone"),
        field.Time("created_at").Default(time.Now),
        field.Time("paid_at").Optional(),
    }
}

func (Order) Indexes() []ent.Index {
    return []ent.Index{
        index.Fields("order_no").Unique(),
        index.Fields("status"),
        index.Fields("created_at"),
    }
}

func (Order) Edges() []ent.Edge {
    return []ent.Edge{
        edge.From("items", OrderItem.Type).Ref("order"),
    }
}
```

### A.3 Wire 依赖注入示例

```go
// shop/service/cmd/server/wire.go
//go:build wireinject
// +build wireinject

package main

import (
    "github.com/google/wire"
    "shop/service/internal/biz"
    "shop/service/internal/conf"
    "shop/service/internal/data"
    "shop/service/internal/server"
    "shop/service/internal/service"
)

func NewApp(*conf.Bootstrap, *log.Logger) (*App, func(), error) {
    panic(wire.Build(
        // 第三方依赖
        wire.Bind(new(biz.OrderRepo), new(*data.OrderRepo)),
        wire.Bind(new(biz.OrderUsecase), new(*biz.OrderUsecase)),
        
        // 数据层
        data.ProviderSet,
        
        // 业务层
        biz.ProviderSet,
        
        // 服务层
        service.ProviderSet,
        
        // 服务器层
        server.ProviderSet,
        
        // 应用
        NewApp,
    ))
}
```

### A.4 Docker Compose 示例

```yaml
# docker-compose.yml
version: '3.8'

services:
  system-service:
    build:
      context: .
      dockerfile: backend/app/system/service/Dockerfile
    ports:
      - "8001:8000"
    environment:
      - DB_DSN=mysql://root:root@tcp(mysql:3306)/system_db
      - REDIS_ADDR=redis:6379
    depends_on:
      - mysql
      - redis
      - consul

  cms-service:
    build:
      context: .
      dockerfile: backend/app/cms/service/Dockerfile
    ports:
      - "8002:8000"
    environment:
      - DB_DSN=mysql://root:root@tcp(mysql:3306)/cms_db
      - REDIS_ADDR=redis:6379
      - ELASTICSEARCH_URL=elasticsearch:9200
    depends_on:
      - mysql
      - redis
      - elasticsearch
      - consul

  shop-service:
    build:
      context: .
      dockerfile: backend/app/shop/service/Dockerfile
    ports:
      - "8003:8000"
    environment:
      - DB_DSN=mysql://root:root@tcp(mysql:3306)/shop_db
      - REDIS_ADDR=redis:6379
      - KAFKA_BROKERS=kafka:9092
    depends_on:
      - mysql
      - redis
      - kafka
      - consul

  app-bff:
    build:
      context: .
      dockerfile: backend/app/app/service/Dockerfile
    ports:
      - "8004:8000"
    depends_on:
      - consul

  admin-bff:
    build:
      context: .
      dockerfile: backend/app/admin/service/Dockerfile
    ports:
      - "8005:8000"
    depends_on:
      - consul

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  elasticsearch:
    image: elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  consul:
    image: consul:latest
    command: agent -server -ui -bootstrap-expect=1 -client=0.0.0.0
    ports:
      - "8500:8500"
      - "8600:8600/udp"

volumes:
  mysql_data:
```

---

**技术栈**：Go 1.21+ | Kratos v2 | Ent ORM | Protobuf | Wire | Redis | MySQL

**适用场景**：企业官网 + 电商商城双业务系统 | 内容管理平台 | 多租户 SaaS 平台

- **Github 开源仓库**：[https://github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- **Gitee 开源仓库**：[https://gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
- **在线演示地址**：[https://cms.gowind.cloud](https://cms.gowind.cloud)
