# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：基于 Ent 从零实现新服务

本文将指导开发者在 GoWind Admin 企业级前后端一体中后台框架中，从零开始构建一个完整的 gRPC 服务。我们所指的 “服务” 即 gRPC 中的 service，通常包含特定数据集的 CRUD（增删改查）操作，遵循框架规范实现高可维护性与可扩展性。

## 前置准备

在开始前，请确保已完成以下环境准备：

### 开发环境

- Go 1.19+（推荐 1.21+，支持最新语言特性）
- Git（版本控制）
- Protobuf 编译器（`protoc`，用于编译 proto 文件）

### 依赖工具

```bash
# 安装相关的命令行工具
make cli

# 安装依赖的插件
make plugin
```

### 项目结构

克隆 GoWind Admin 项目后，核心目录结构如下（聚焦服务开发相关目录）：

```text
go-wind-admin/
├── backend/
│   ├── api/gen/go/        # proto 编译生成的 Go 代码（自动生成，无需手动修改）
│   ├── api/proto/         # 存放 proto 接口定义文件
│   ├── app/admin/service/ # 业务服务核心实现
│   │   ├── internal/
│   │   │   ├── data/      # 数据访问层（与数据库交互，基于 ent）
│   │   │   │   └── ent/   # ent ORM 自动生成的数据库操作代码
│   │   │   └── service/   # 业务逻辑层（实现 gRPC 接口）
│   │   └── server/        # 服务注册（将服务绑定到 gRPC/HTTP 服务器）
```

## 一、设计数据库表结构

数据库表结构是服务的基础，需根据业务需求设计核心字段。以 “用户表” 为例，需包含：

- 通用字段：ID（主键）、创建时间、更新时间、创建者 ID、更新者 ID（用于审计）
- 业务字段：用户名（唯一）、密码、昵称、邮箱、手机号等
- 关联字段：角色 ID、部门 ID 等（用于关联其他表）
- 状态字段：用户状态（启用 / 禁用）、性别等枚举字段

**设计原则：**

- 核心字段非空（如用户名），非核心字段可空（如地址）
- 频繁查询的字段添加索引（如用户名）
- 敏感字段（如密码）需加密存储

## 二、编写 ent 的 schema

Ent 是 Go 语言的 ORM 库，通过 schema 定义数据库实体。schema 文件位于 `backend/app/admin/service/internal/data/ent/schema` 目录。

步骤说明：

1. 创建 `user.go` 文件，定义 Us`er 结构体及其配置。
2. 通过 `Annotations` 配置表名、字符集等数据库属性。
3. 通过 `Fields` 定义表字段，包括类型、约束（唯一、非空等）、注释。
4. 通过 `Mixin` 复用通用字段（如 ID、时间戳），减少重复代码。
5. 通过 `Indexes` 定义索引，提升查询性能。

### 关键代码解析：

```go
// Annotations 配置表基本信息
func (User) Annotations() []schema.Annotation {
    return []schema.Annotation{
        entsql.Annotation{
            Table:     "sys_users", // 数据库表名
            Charset:   "utf8mb4",   // 字符集
            Collation: "utf8mb4_bin", // 排序规则
        },
        schema.Comment("用户表"), // 表注释
    }
}

// Fields 定义表字段
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.String("username").
            Comment("用户名").
            Unique().       // 唯一索引
            NotEmpty().     // 非空
            Immutable(),    // 创建后不可修改

        field.String("password").
            Comment("登录密码").
            MaxLen(255).    // 最大长度
            Sensitive(),    // 敏感字段（日志中隐藏）

        // 其他字段...
    }
}

// Mixin 复用通用配置
func (User) Mixin() []ent.Mixin {
    return []ent.Mixin{
        mixin.AutoIncrementId{}, // 自增 ID
        mixin.TimeAt{},          // 创建时间、更新时间
        mixin.OperatorID{},      // 创建者、更新者 ID
    }
}
```

### 生成 ent 代码：

编写完 schema 后，执行以下命令生成实体代码：

```bash
cd backend/app/admin/service/
make ent
```

## 三、编写 gRPC 的 proto 文件

Protobuf（proto）用于定义 gRPC 服务接口和数据结构，是服务对外暴露的 “契约”。proto 文件通常位于 `backend/api/proto/user/service/v1` 目录。

### 步骤说明：

1. 定义服务接口（`service UserService`），包含 CRUD 方法（如 `CreateUser`、`ListUser`）。
2. 定义请求 / 响应消息（message），映射数据库字段和业务需求。
3. 定义枚举（enum），如用户状态、性别等固定值类型。

### 关键代码解析：

```protobuf
// backend/api/proto/user/service/v1/user.proto

// 定义服务接口
service UserService {
  rpc ListUser (pagination.PagingRequest) returns (ListUserResponse); // 列表查询
  rpc GetUser (GetUserRequest) returns (User);                        // 详情查询
  rpc CreateUser (CreateUserRequest) returns (google.protobuf.Empty); // 创建
  rpc UpdateUser (UpdateUserRequest) returns (google.protobuf.Empty); // 更新
  rpc DeleteUser (DeleteUserRequest) returns (google.protobuf.Empty); // 删除
}

// 枚举定义（用户状态）
enum UserStatus {
  OFF = 0; // 禁用
  ON = 1;  // 启用
}

// 数据模型（与数据库表对应）
message User {
  optional uint32 id = 1 [json_name = "id"]; // 用户ID
  optional string username = 2;              // 用户名
  optional UserStatus status = 3;            // 状态
  // 其他字段...
}
```

### 生成 Go 代码：

执行以下命令将 proto 转换为 Go 代码（生成的代码位于 `backend/api/gen/go` 目录）：

```bash
make api
```

## 四、编写 REST 的 proto 文件

Protobuf（proto）用于定义 REST 服务接口和数据结构，是服务对外暴露的 “契约”。proto 文件通常位于 `backend/api/proto/admin/service/v1` 目录。

### 关键代码解析：

```protobuf
// backend/api/proto/admin/service/v1/i_user.proto

import "user/service/v1/user.proto";

// 用户管理服务
service UserService {
  // 获取用户列表
  rpc List (pagination.PagingRequest) returns (user.service.v1.ListUserResponse) {
    option (redact.v3.internal_method) = true;
    option (google.api.http) = {
      get: "/admin/v1/users"
    };
  }

  // 获取用户数据
  rpc Get (user.service.v1.GetUserRequest) returns (user.service.v1.User) {
    option (redact.v3.internal_method) = true;
    option (google.api.http) = {
      get: "/admin/v1/users/{id}"
      additional_bindings {
        get: "/admin/v1/users/username/{user_name}"
      }
    };
  }

  // 创建用户
  rpc Create (user.service.v1.CreateUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      post: "/admin/v1/users"
      body: "*"
    };
  }

  // 更新用户
  rpc Update (user.service.v1.UpdateUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      put: "/admin/v1/users/{id}"
      body: "*"
    };
  }

  // 删除用户
  rpc Delete (user.service.v1.DeleteUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      delete: "/admin/v1/users/{id}"
    };
  }
}

// 枚举定义（用户状态）
enum UserStatus {
  OFF = 0; // 禁用
  ON = 1;  // 启用
}

// 数据模型（与数据库表对应）
message User {
  optional uint32 id = 1 [json_name = "id"]; // 用户ID
  optional string username = 2;              // 用户名
  optional UserStatus status = 3;            // 状态
  // 其他字段...
}
```

### 生成代码：

执行以下命令将 proto 转换为 Go 代码（生成的代码位于 `backend/api/gen/go` 目录）：

```bash
# 生成go代码
make api
```

执行以下命令将 proto 转换为 OpenAPI文档（生成的文档位于`backend/app/admin/service/cmd/server/assets/`目录）：

```bash
# 生成OpenAPI文档
make openapi
```

执行以下命令将 proto 转换为 TypeScript代码（生成的代码位于`frontend/apps/admin/src/generated/api`目录）：

```bash
# 生成TypeScript代码
make ts
```

## 五、编写 data 包（数据访问层）

`data` 包负责与数据库交互，实现 CRUD 操作，是业务逻辑与数据库之间的桥梁。代码位于 `backend/app/admin/service/internal/data` 目录。

### 核心职责：

- 封装 ent 的数据库操作（查询、插入、更新、删除）。
- 实现 ent 实体与 proto 消息的转换（如 `convertEntToProto`）。
- 处理数据访问过程中的错误（如记录日志、返回业务错误）。

### 关键代码解析：

```go
package data

type UserRepo struct {
	data *Data
	log  *log.Helper

	mapper             *mapper.CopierMapper[userV1.User, ent.User]
}

func NewUserRepo(logger log.Logger, data *Data) *UserRepo {
	repo := &UserRepo{
		log:                log.NewHelper(log.With(logger, "module", "user/repo/admin-service")),
		data:               data,
		mapper:             mapper.NewCopierMapper[userV1.User, ent.User](),
	}

	return repo
}

// 创建用户
func (r *UserRepo) CreateUser(ctx context.Context, req *userV1.CreateUserRequest) error {
	if req == nil || req.Data == nil {
		return nil, userV1.ErrorBadRequest("invalid parameter")
	}

	if req.Data.Password != nil && req.Data.GetPassword() != "" {
		cryptoPassword, err := crypto.HashPassword(req.Data.GetPassword())
		if err != nil {
			return nil, err
		}
		req.Data.Password = &cryptoPassword
	}

    // 调用 ent 插入数据
    return r.data.db.Client().User.Create().
        SetUsername(req.Data.Username).
        SetPassword(req.Data.GetPassword()).
        // 设置其他字段...
        Exec(ctx)
}
```

## 六、编写 service 包（业务逻辑层）

service 包实现核心业务逻辑，调用 data 包进行数据操作，并处理权限校验、参数校验等业务规则。代码位于 `backend/app/admin/service/internal/service` 目录。

### 核心职责：

- 校验请求参数合法性（如非空检查）。
- 实现业务规则（如 “禁止删除超级管理员”）。
- 调用 data 包完成数据操作，并返回结果。

### 关键代码解析：

```go
// 创建用户（包含权限校验）
func (s *UserService) CreateUser(ctx context.Context, req *userV1.CreateUserRequest) (*emptypb.Empty, error) {
    // 参数校验
    if req.Data == nil || req.Data.Username == nil {
        return nil, errors.New("用户名不能为空")
    }

    // 权限校验：只有管理员能创建用户
    operator, err := s.userRepo.GetUser(ctx, req.OperatorId)
    if err != nil || operator.Authority != userV1.UserAuthority_SYS_ADMIN {
        return nil, errors.New("权限不足")
    }

    // 调用 data 包创建用户
    return &emptypb.Empty{}, s.userRepo.CreateUser(ctx, req)
}
```

## 七、注册服务到 Server

最后需将服务注册到 gRPC 或 REST 服务器，使客户端能访问服务。注册代码位于 `backend/app/admin/service/server` 目录。

### gRPC 服务注册：

```go
import (
	"github.com/go-kratos/kratos/v2/transport/grpc"
)

// 注册 gRPC 服务
func NewGRPCServer(cfg *conf.Bootstrap, userSvc *service.UserService) *grpc.Server {
    srv := grpc.NewServer()

    // 将 UserService 注册到 gRPC 服务器
    userV1.RegisterUserServiceServer(srv, userSvc)

    return srv
}
```

### REST 服务注册：

```go
import (
	"github.com/go-kratos/kratos/v2/transport/http"
)

// 注册 REST 服务
func NewRESTServer(cfg *conf.Bootstrap, userSvc *service.UserService) *http.Server {
	if cfg == nil || cfg.Server == nil || cfg.Server.Rest == nil {
		return nil
	}

	srv := rpc.CreateRestServer(cfg)
   
	// 将 UserService 注册到 REST 服务器
	adminV1.RegisterUserServiceHTTPServer(srv, userSvc)

	return srv
}
```

## 八、测试新服务

服务开发完成后，需验证功能正确性：

### 1. **单元测试：**

测试 data 包和 service 包的核心方法（使用 Go 内置测试框架）：

```go
// backend/app/admin/service/internal/service/user_service_test.go
package service_test

import (
    "context"
    "testing"

    "github.com/stretchr/testify/assert"
    userV1 "go-wind-admin/api/gen/go/admin/service/v1"
    "go-wind-admin/app/admin/service/internal/service"
    "go-wind-admin/mocks"
)

func TestCreateUser(t *testing.T) {
    // 初始化 mock 依赖
    mockUserRepo := mocks.NewUserRepo(t)
    svc := service.NewUserService(mockUserRepo, nil)

    // 测试用例：用户名空
    req := &userV1.CreateUserRequest{Password: "12345678"}
    _, err := svc.CreateUser(context.Background(), req)
    assert.ErrorContains(t, err, "用户名不能为空")

    // 其他测试用例...
}
```

### 2. **接口测试：**

#### gRPC 接口

使用 `grpcurl` 调用：

```bash
# 列出服务接口
grpcurl -plaintext localhost:9000 list admin.service.v1.UserService

# 调用创建用户接口
grpcurl -plaintext -d '{"username":"test","password":"12345678"}' \
  localhost:9000 admin.service.v1.UserService/CreateUser
```

#### HTTP 接口

使用 curl 或 Postman 调用：

```bash
# 创建用户
curl -X POST http://localhost:8080/admin/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"12345678"}'
```

## 总结

通过以上步骤，我们完成了一个新服务从数据库设计到接口暴露的全流程实现。GoWind Admin 框架的分层架构（schema → data → service → server）确保了代码的低耦合与高可维护性：

- **schema 层**：通过 ent 定义数据结构，自动生成数据库操作代码。
- **data 层**：封装数据库交互，隔离业务逻辑与数据访问。
- **service 层**：聚焦业务规则，与数据层解耦。
- **server 层**：统一注册服务，简化部署与扩展。

遵循此流程，开发者可快速在框架中扩展新服务，充分利用框架提供的工具链（ent、Protobuf、gRPC）提升开发效率。

## 项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
