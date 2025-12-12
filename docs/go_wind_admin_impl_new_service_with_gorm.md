# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：基于 GORM 从零实现新服务

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
│   │   │   │   └── gorm/   # GORM ORM 相关的代码
│   │   │   │       └── model/ # GORM 数据模型定义（核心）
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

## 二、编写 GORM 数据模型

GORM 是 Go 语言主流的 ORM 库，通过结构体 + 标签定义数据库模型，无需手动编写 SQL 或生成代码。模型文件位于 `backend/app/admin/service/internal/data/gorm/models` 目录。

步骤说明：

1. 创建 `user.go` 文件，定义 `User` 结构体作为核心模型；
2. 通过 GORM 标签配置字段属性（主键、索引、非空、注释、字段类型等）；
3. 实现 TableName 方法指定数据库表名；

### 关键代码解析：

```go
// backend/app/admin/service/internal/data/gorm/models/user.go
package models

import "gorm.io/gorm"

// User 用户信息表
type User struct {
	gorm.Model

	UserName string `gorm:"column:username;comment:'账号名'"`
	NickName string `gorm:"column:nickname;comment:'昵称'"`
	Password string `gorm:"column:password;comment:'登录密码'"`
}

func (u User) TableName() string {
	return "users"
}
```

### 表结构迁移：

GORM 无需手动生成代码，只需在把数据库模型注册进 MigrateModel列表 即可实现自动创建 / 更新表结构（仅新增字段，不会删除已有字段，保证数据安全）：

```go
// backend/app/admin/service/internal/data/gorm/init.go
package gorm

import (
	"go-wind-admin/app/admin/service/internal/data/gorm/models"

	"github.com/tx7do/go-crud/gorm"
)

func init() {
	RegisterMigrates()
}

func RegisterMigrates() {
	gorm.RegisterMigrateModels(
		&models.User{},
	)
}
```

然后我们在`backend/app/admin/service/internal/data/gorm_client.go`里面引用执行`init()`方法即可实现自动创建更新表结构：

```go
// backend/app/admin/service/internal/data/gorm_client.go
package data

import (
    	_ "go-wind-admin/app/admin/service/internal/data/gorm"
)
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

import (
	"context"
	"errors"

	"go-wind-admin/api/gen/go/user/service/v1"
	"go-wind-admin/app/admin/service/internal/data/gorm/models"

	"gorm.io/gorm"
)

// UserRepo 用户数据访问仓库
type UserRepo struct {
	db  *gorm.DB          // GORM数据库连接
	log  *log.Helper      // 日志工具
}

// NewUserRepo 创建UserRepo实例
func NewUserRepo(logger log.Logger, db *gorm.DB) *UserRepo {
	repo := &UserRepo{
		log:                log.NewHelper(log.With(logger, "module", "user/repo/admin-service")),
		db:               db,
	}

	return repo
}

// CreateUser 创建用户
func (r *UserRepo) CreateUser(ctx context.Context, req *userV1.CreateUserRequest) error {
    // 参数校验
	if req == nil || req.Data == nil {
		return nil, userV1.ErrorBadRequest("invalid parameter")
	}

    // 密码加密（敏感字段处理）
	if req.Data.Password != nil && req.Data.GetPassword() != "" {
		cryptoPassword, err := crypto.HashPassword(req.Data.GetPassword())
		if err != nil {
			return nil, err
		}
		req.Data.Password = &cryptoPassword
	}

    userModel := &models.User{
		Username:  *req.Data.Username,
		Password:  password,
		Nickname:  req.Data.GetNickname(),
	}

	// 执行GORM创建操作
	if err := r.db.WithContext(ctx).Create(userModel).Error; err != nil {
		r.log.Error("create user failed: %v", err)
		// 处理唯一键冲突（用户名重复）
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return userV1.ErrorAlreadyExists("username already exists")
		}
		return errors.New("failed to create user")
	}

	return nil
}

// ListUser 分页查询用户列表
func (r *UserRepo) ListUser(ctx context.Context, req *userV1.PagingRequest) (*userV1.ListUserResponse, error) {
	var (
		userModels []*model.User
		total      int64
		resp       = &userV1.ListUserResponse{}
	)

	// 分页参数处理
	page := req.GetPage()
	pageSize := req.GetPageSize()
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize

	// 1. 查询总数（忽略软删除）
	if err := r.db.WithContext(ctx).Model(&model.User{}).Count(&total).Error; err != nil {
		r.log.Error("count user total failed: %v", err)
		return nil, errors.New("failed to count users")
	}
	resp.Total = total

	// 2. 分页查询列表
	if err := r.db.WithContext(ctx).Offset(int(offset)).Limit(int(pageSize)).Find(&userModels).Error; err != nil {
		r.log.Error("list users failed: %v", err)
		return nil, errors.New("failed to list users")
	}

	// 3. GORM模型转换为Proto消息
	resp.Items = make([]*userV1.User, 0, len(userModels))
	for _, u := range userModels {
		resp.Items = append(resp.Items, &userV1.User{
			Id:       uint32(u.ID),
			Username: &u.Username,
			Nickname: &u.Nickname,
		})
	}

	return resp, nil
}

// GetUser 查询单个用户（支持ID/用户名）
func (r *UserRepo) GetUser(ctx context.Context, req *userV1.GetUserRequest) (*userV1.User, error) {
	var userModel model.User

	// 根据条件查询（ID或用户名）
	switch {
	case req.Id != nil:
		if err := r.db.WithContext(ctx).First(&userModel, req.GetId()).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, userV1.ErrorNotFound("user not found by id")
			}
			r.log.Error("get user by id failed: %v", err)
			return nil, errors.New("failed to get user")
		}
	case req.Username != nil:
		if err := r.db.WithContext(ctx).Where("username = ?", req.GetUsername()).First(&userModel).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, userV1.ErrorNotFound("user not found by username")
			}
			r.log.Error("get user by username failed: %v", err)
			return nil, errors.New("failed to get user")
		}
	default:
		return nil, userV1.ErrorBadRequest("id or username is required")
	}

	// 转换为Proto消息
	return &userV1.User{
		Id:       uint32(userModel.ID),
		Username: &userModel.Username,
		Nickname: &userModel.Nickname,
		Email:    &userModel.Email,
		Phone:    &userModel.Phone,
		Status:   userV1.UserStatus(userModel.Status),
		RoleId:   uint32(userModel.RoleID),
		DeptId:   uint32(userModel.DeptID),
	}, nil
}

// UpdateUser 更新用户
func (r *UserRepo) UpdateUser(ctx context.Context, req *userV1.UpdateUserRequest) error {
	// 参数校验
	if req.Id == 0 || req.Data == nil {
		return userV1.ErrorBadRequest("id and data are required")
	}

    	// 密码更新（可选）
	if req.Data.Password != nil && req.Data.GetPassword() != "" {
		cryptoPassword, err := crypto.HashPassword(req.Data.GetPassword())
		if err != nil {
			r.log.Error("hash password failed: %v", err)
			return errors.New("failed to hash password")
		}
		req.Data.Password = &cryptoPassword
	}

	// 构造更新数据
    updateData := &models.User{
		Username:  *req.Data.Username,
		Password:  password,
		Nickname:  req.Data.GetNickname(),
	}

	// 执行更新（仅更新非空字段）
	if err := r.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", req.Id).Updates(updateData).Error; err != nil {
		r.log.Error("update user failed: %v", err)
		return errors.New("failed to update user")
	}

	return nil
}

// DeleteUser 删除用户（软删除）
func (r *UserRepo) DeleteUser(ctx context.Context, req *userV1.DeleteUserRequest) error {
	if req.Id == 0 {
		return userV1.ErrorBadRequest("id is required")
	}

	// GORM Delete方法默认软删除（更新DeletedAt字段）
	if err := r.db.WithContext(ctx).Delete(&model.User{}, req.Id).Error; err != nil {
		r.log.Error("delete user failed: %v", err)
		return errors.New("failed to delete user")
	}

	return nil
}
```

## 六、编写 service 包（业务逻辑层）

`service` 包实现核心业务逻辑，调用 `data` 包进行数据操作，并处理权限校验、参数校验等业务规则。代码位于 `backend/app/admin/service/internal/service` 目录。

### 核心职责：

- 校验请求参数合法性（如非空检查）。
- 实现业务规则（如 “禁止删除超级管理员”）。
- 调用 `data` 包完成数据操作，并返回结果。

### 关键代码解析：

```go
// backend/app/admin/service/internal/service/user_service.go
package service

import (
	"context"
	"errors"

	"go-wind-admin/api/gen/go/user/service/v1"
	"go-wind-admin/app/admin/service/internal/data"

	"google.golang.org/protobuf/types/known/emptypb"
)

// UserService 实现gRPC/REST服务接口
type UserService struct {
	userV1.UnimplementedUserServiceServer // 兼容gRPC

	userRepo *data.UserRepo
	log      *log.Helper
}

// NewUserService 创建UserService实例
func NewUserService(logger log.Logger, userRepo *data.UserRepo) *UserService {
	return &UserService{
		userRepo: userRepo,
		log:      log.NewHelper(log.With(logger, "module", "user/service/admin-service")),
	}
}

// CreateUser 创建用户（含权限校验）
func (s *UserService) CreateUser(ctx context.Context, req *userV1.CreateUserRequest) (*emptypb.Empty, error) {
	// 基础参数校验
	if req == nil || req.Data == nil {
		return nil, userV1.ErrorBadRequest("invalid request")
	}

	// 调用数据层创建用户
	if err := s.userRepo.CreateUser(ctx, req); err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

// ListUser 分页查询用户列表
func (s *UserService) ListUser(ctx context.Context, req *userV1.PagingRequest) (*userV1.ListUserResponse, error) {
	// 调用数据层查询
	resp, err := s.userRepo.ListUser(ctx, req)
	if err != nil {
		s.log.Error("list user failed: %v", err)
		return nil, err
	}
	return resp, nil
}

// GetUser 查询单个用户
func (s *UserService) GetUser(ctx context.Context, req *userV1.GetUserRequest) (*userV1.User, error) {
	// 调用数据层查询
	user, err := s.userRepo.GetUser(ctx, req)
	if err != nil {
		s.log.Error("get user failed: %v", err)
		return nil, err
	}
	return user, nil
}

// UpdateUser 更新用户
func (s *UserService) UpdateUser(ctx context.Context, req *userV1.UpdateUserRequest) (*emptypb.Empty, error) {
	// 1. 校验超级管理员不可被修改
	if req.Id == 1 { // 假设1是超级管理员ID
		return nil, userV1.ErrorPermissionDenied("cannot update super admin")
	}

	// 2. 调用数据层更新
	if err := s.userRepo.UpdateUser(ctx, req); err != nil {
		s.log.Error("update user failed: %v", err)
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

// DeleteUser 删除用户
func (s *UserService) DeleteUser(ctx context.Context, req *userV1.DeleteUserRequest) (*emptypb.Empty, error) {
	// 1. 校验超级管理员不可被删除
	if req.Id == 1 {
		return nil, userV1.ErrorPermissionDenied("cannot delete super admin")
	}

	// 2. 调用数据层删除
	if err := s.userRepo.DeleteUser(ctx, req); err != nil {
		s.log.Error("delete user failed: %v", err)
		return nil, err
	}

	return &emptypb.Empty{}, nil
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
grpcurl -plaintext localhost:9000 list user.service.v1.UserService

# 调用创建用户接口
grpcurl -plaintext -d '{
  "data": {
    "username": "test_admin",
    "nickname": "测试管理员",
    "password": "12345678"
  },
  "operator_id": 1
}' localhost:9000 user.service.v1.UserService/CreateUser

# 调用列表查询接口
grpcurl -plaintext -d '{"page": 1, "page_size": 10}' localhost:9000 user.service.v1.UserService/ListUser
```

#### HTTP 接口

使用 curl 或 Postman 调用：

```bash
# 创建用户
curl -X POST http://localhost:8080/admin/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "username": "test_admin",
      "nickname": "测试管理员",
      "password": "12345678"
    },
    "operator_id": 1
  }'

# 查询用户列表
curl -X GET "http://localhost:8080/admin/v1/users?page=1&page_size=10"

# 查询单个用户
curl -X GET http://localhost:8080/admin/v1/users/1

# 更新用户
curl -X PUT http://localhost:8080/admin/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "nickname": "更新后的昵称"
    },
    "operator_id": 1
  }'

# 删除用户
curl -X DELETE http://localhost:8080/admin/v1/users/2
```

## 总结

通过以上步骤，我们完成了基于 GORM 的新服务从数据库设计到接口暴露的全流程实现。GoWind Admin 框架的分层架构（Model → Data → Service → Server）确保了代码的低耦合与高可维护性：

- **Model 层**：通过 GORM 结构体定义数据模型，标签化配置表属性，无需手动生成代码；
- **Data 层**：封装 GORM 的 CRUD 操作，隔离业务逻辑与数据库访问，统一错误处理；
- **Service 层**：聚焦业务规则与权限校验，与数据层解耦，便于单元测试；
- **Server 层**：统一注册 gRPC/REST 服务，支持双协议访问，简化部署扩展。

相较于 Ent，GORM 更轻量化、学习成本更低，无需代码生成步骤，适合快速开发；同时 GORM 提供丰富的查询语法、软删除、自动迁移等特性，完全满足企业级中后台系统的需求。遵循此流程，你可快速在 GoWind Admin 中扩展任意新服务，充分利用 GORM 的便捷性提升开发效率。

## 项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
