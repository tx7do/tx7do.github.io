# 初学者导引：在 Go-Kratos 中用 go-crud 实现 GORM CRUD 操作

对于刚接触Go微服务开发的初学者来说，直接上手“框架+ORM”的组合常显复杂。而kratos-gorm-example项目已为我们搭建好了Go-Kratos与GORM的基础集成框架，本文将基于该项目，聚焦如何快速接入go-curd工具简化CRUD（增删改查）操作，全程以step-by-step的方式讲解，新手也能轻松跟随实操。

先明确核心工具关系：`kratos-gorm-example`是“基础骨架”（已整合Kratos与GORM），`go-curd`是“效率工具”（封装重复CRUD逻辑），我们的核心目标是“在现有骨架上装工具，让数据操作更简单”。

## 一、核心工具速览：3分钟理清分工

在动手前，先明确三个工具的分工，避免越做越乱：

- **Go-Kratos**微服务框架核心，负责API定义、服务启动、请求分发，kratos-gorm-example已完成其基础配置；
- **GORM**：ORM框架，实现Go结构体与数据库表的映射，kratos-gorm-example已完成数据库连接初始化；
- **go-crud**：GORM的上层封装工具，把重复的CRUD逻辑（如创建、查询、更新、删除）做成现成方法，无需手动编写GORM原生语句。

## 二、环境准备：5分钟搞定前置依赖

先完成基础环境搭建和项目准备，确保后续步骤无报错：

1. **安装基础工具**：要求 Go 1.19+（Kratos 最低支持版本），安装后用`go version`验证；
2. **Git**：用于克隆示例项目；
3. **准备数据库**：用 Postgresql（GORM 最常用的数据库），新建一个数据库（比如叫`example`），不用建表（后续 GORM 会自动建）；
4. **获取kratos-gorm-example项目：**
    - 打开终端，执行以下命令克隆项目并进入目录：`git clone https://github.com/tx7do/kratos-gorm-example.git`
    - `cd kratos-gorm-example`
5. **引入go-curd依赖：** 在项目根目录执行命令，拉取go-curd的GORM适配模块：`go get github.com/tx7do/go-curd/gorm`
6. **确认项目核心目录：** 无需关注所有文件，重点记住3个核心目录（kratos-gorm-example已预设）：
    - `api`：放 API 定义文件（.proto），用来定义 “创建用户”、“查询用户” 等接口；
    - `app/user/service/internal/data/models`：放数据库模型（和 MySQL 表对应）；
    - `app/user/service/internal/data`：放业务逻辑，这里会调用 go-crud 做 CRUD。

## 三、核心步骤1：在kratos-gorm-example中集成go-curd

kratos-gorm-example已完成GORM的初始化配置，我们只需在现有基础上，将go-curd客户端集成进来，让业务层可以调用其简化方法。

### 1.1 修改数据层：集成go-curd客户端

打开`app/user/service/internal/data/user.go`修改代码以集成`go-curd`：

```go
package data

import (
  gormCurd "github.com/tx7do/go-crud/gorm"
)

type UserRepo struct {
	data *Data
	log  *log.Helper

	mapper     *mapper.CopierMapper[userV1.User, models.User]
	repository *gormCurd.Repository[userV1.User, models.User]
}

func NewUserRepo(data *Data, logger log.Logger) *UserRepo {
	l := log.NewHelper(log.With(logger, "module", "user/repo/user-service"))
	repo := &UserRepo{
		data:   data,
		log:    l,
		mapper: mapper.NewCopierMapper[userV1.User, models.User](),
	}

	repo.repository = gormCurd.NewRepository[userV1.User, models.User](
		repo.mapper,
	)

	repo.init()

	return repo
}
```

核心改动说明：新增`repository`字段存储`go-curd`客户端，通过`gormCurd.NewRepository()`初始化，提供方法供业务层调用。

### 1.2 确认数据库配置（无需修改，仅验证）

kratos-gorm-example已在`configs/data.yaml`中配置好数据库连接，打开文件验证：

```yaml
data:
  database:
    driver: "postgres"
    source: "host=localhost port=5432 user=postgres password=*Abcd123456 dbname=example sslmode=disable"
    migrate: true
```

注意：将`source`中的`user=postgres password=*Abcd123456`改为自己的PostgreSQL用户名和密码，确保能连接到之前新建的`example`数据库。


## 四、核心步骤2：用go-curd实现CRUD业务逻辑

我们将以“用户模块”为例，基于项目现有的目录结构，用go-curd实现用户的增、删、改、查。kratos-gorm-example已预设部分基础代码，我们只需补充和修改。

### 2.1 定义用户模型（Model）

打开`app/user/service/internal/data/models/user.go`，定义`User`结构体（对应数据库中的的`users表`）：

```go
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

说明：GORM会根据该结构体自动创建数据库表，后续我们会通过go-curd操作该模型。

### 2.2 编写Data层：用go-curd实现CRUD

打开`app/user/service/internal/data/user.go`，编写业务逻辑方法。核心优势：用go-curd的现成方法替代原生GORM代码，减少重复工作。

```go
package data

func (r *UserRepo) List(ctx context.Context, req *pagination.PagingRequest) (*userV1.ListUserResponse, error) {
	if req == nil {
		return nil, errors.New("request is nil")
	}

	ret, err := r.repository.ListWithPaging(ctx, r.data.db, req)
	if err != nil {
		return nil, err
	}
	if ret == nil {
		return &userV1.ListUserResponse{Total: 0, Items: nil}, nil
	}

	return &userV1.ListUserResponse{
		Total: ret.Total,
		Items: ret.Items,
	}, nil
}

func (r *UserRepo) Get(ctx context.Context, req *userV1.GetUserRequest) (*userV1.User, error) {
	if req == nil {
		return nil, errors.New("request is nil")
	}

	var whereCond *gorm.DB
	switch req.QueryBy.(type) {
	case *userV1.GetUserRequest_Id:
		whereCond = r.data.db.Where("id = ?", req.GetId())
	case *userV1.GetUserRequest_UserName:
		whereCond = r.data.db.Where("user_name = ?", req.GetUserName())
	default:
		whereCond = r.data.db.Where("id = ?", req.GetId())
	}

	dto, err := r.repository.Get(ctx, whereCond, req.GetViewMask())
	if err != nil {
		return nil, err
	}

	return dto, err
}

func (r *UserRepo) Create(ctx context.Context, req *userV1.CreateUserRequest) (*userV1.User, error) {
	if req == nil || req.Data == nil {
		return nil, errors.New("request is nil")
	}

	if req.Data.Password != nil && req.Data.GetPassword() != "" {
		cryptoPassword, err := crypto.HashPassword(req.Data.GetPassword())
		if err != nil {
			return nil, err
		}
		req.Data.Password = &cryptoPassword
	}

	result, err := r.repository.Create(ctx, r.data.db, req.Data, nil)

	return result, err
}

func (r *UserRepo) Update(ctx context.Context, req *userV1.UpdateUserRequest) (*userV1.User, error) {
	if req == nil || req.Data == nil {
		return nil, errors.New("request is nil")
	}

	if req.Data.Password != nil && req.Data.GetPassword() != "" {
		cryptoPassword, err := crypto.HashPassword(req.Data.GetPassword())
		if err != nil {
			return nil, err
		}
		req.Data.Password = &cryptoPassword
	}

	result, err := r.repository.Update(ctx, r.data.db, req.Data, req.GetUpdateMask())

	return result, err
}

func (r *UserRepo) Upsert(ctx context.Context, req *userV1.UpdateUserRequest) (*userV1.User, error) {
	if req == nil || req.Data == nil {
		return nil, errors.New("request is nil")
	}

	var err error

	if req.Data.Password != nil && req.Data.GetPassword() != "" {
		cryptoPassword, err := crypto.HashPassword(req.Data.GetPassword())
		if err != nil {
			return nil, err
		}
		req.Data.Password = &cryptoPassword
	}

	result, err := r.repository.Upsert(ctx, r.data.db, req.Data, req.GetUpdateMask())

	return result, err
}

func (r *UserRepo) Delete(ctx context.Context, req *userV1.DeleteUserRequest) (bool, error) {
	if req == nil {
		return false, errors.New("request is nil")
	}

	result, err := r.repository.Delete(ctx, r.data.db.Where("id = ?", req.GetId()))

	return result > 0, err
}
```

核心简化点：对比原生GORM，go-curd的`List`、`Get`、`Create`、`Update`、`Upsert`、`Delete`方法无需编写查询条件，直接传入上下文、模型实例和ID即可，代码更简洁。

### 2.3 定义API接口（Proto）并生成代码

`kratos-gorm-example`已在`api/protos/user/service/v1/user.proto`中预设了用户API定义，我们只需确认内容（无需修改），然后生成Go代码：

```protobuf
syntax = "proto3";

package user.service.v1;

import "gnostic/openapi/v3/annotations.proto";

import "google/protobuf/empty.proto";
import "google/protobuf/timestamp.proto";
import "google/protobuf/field_mask.proto";

import "google/api/annotations.proto";

import "pagination/v1/pagination.proto";

// 用户服务
service UserService {
  // 查询用户列表
  rpc ListUser (pagination.PagingRequest) returns (ListUserResponse) {
    option (google.api.http) = {
      get: "/users"
      additional_bindings {
        post: "/users/list"
        body: "*"
      }
    };
  }

  // 查询用户详情
  rpc GetUser (GetUserRequest) returns (User) {
    option (google.api.http) = {
      get: "/users/{id}"
      additional_bindings {
        get: "/users/username/{user_name}"
      }
    };
  }

  // 创建用户
  rpc CreateUser (CreateUserRequest) returns (User) {
    option (google.api.http) = {
      post: "/users"
      body: "*"
    };
  }

  // 更新用户
  rpc UpdateUser (UpdateUserRequest) returns (User) {
    option (google.api.http) = {
      put: "/users/{data.id}"
      body: "*"
    };
  }

  // 删除用户
  rpc DeleteUser (DeleteUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      delete: "/users/{id}"
    };
  }
}

// 用户
message User {
  uint32 id = 1;

  optional string user_name = 2 [json_name = "userName", (gnostic.openapi.v3.property) = {description: "账户名"}];// 账户名
  optional string nick_name = 3 [json_name = "nickName", (gnostic.openapi.v3.property) = {description: "昵称"}];// 昵称
  optional string password = 4 [json_name = "password", (gnostic.openapi.v3.property) = {description: "密码"}];// 密码

  optional google.protobuf.Timestamp created_at = 200 [json_name = "createdAt", (gnostic.openapi.v3.property) = {description: "创建时间"}];// 创建时间
  optional google.protobuf.Timestamp updated_at = 201 [json_name = "updatedAt", (gnostic.openapi.v3.property) = {description: "更新时间"}];// 更新时间
  optional google.protobuf.Timestamp deleted_at = 202 [json_name = "deletedAt", (gnostic.openapi.v3.property) = {description: "删除时间"}];// 删除时间
}

// 获取用户列表 - 答复
message ListUserResponse {
  repeated User items = 1;
  uint64 total = 2;
}

// 获取用户数据 - 请求
message GetUserRequest {
  oneof query_by {
    uint32 id = 1 [
      (gnostic.openapi.v3.property) = {description: "用户ID", read_only: true},
      json_name = "id"
    ]; // 用户ID

    string user_name = 2 [
      (gnostic.openapi.v3.property) = {description: "用户登录名", read_only: true},
      json_name = "userName"
    ]; // 用户登录名
  }

  optional google.protobuf.FieldMask view_mask = 100 [
    json_name = "viewMask",
    (gnostic.openapi.v3.property) = {
      description: "视图字段过滤器，用于控制返回的字段"
    }
  ]; // 视图字段过滤器，用于控制返回的字段
}

// 创建用户 - 请求
message CreateUserRequest {
  User data = 1;

  uint32 operator_id = 2 [json_name = "operatorId", (gnostic.openapi.v3.property) = {description: "操作者用户ID"}];// 操作者用户ID
}

// 更新用户 - 请求
message UpdateUserRequest {
  User data = 1;

  google.protobuf.FieldMask update_mask = 2 [
    json_name = "updateMask",
    (gnostic.openapi.v3.property) = {
      description: "要更新的字段列表",
      example: {yaml : "id,realname,username"}
    }
  ]; // 要更新的字段列表

  optional bool allow_missing = 3 [
    json_name = "allowMissing",
    (gnostic.openapi.v3.property) = {description: "如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。"}
  ]; // 如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。
}

// 删除用户 - 请求
message DeleteUserRequest {
  uint32 id = 1;

  uint32 operator_id = 2 [json_name = "operatorId", (gnostic.openapi.v3.property) = {description: "操作者用户ID"}];// 操作者用户ID
}
```

执行以下命令生成Go代码（项目已预设`make api`命令）：

```bash
make api
```

生成的代码会放在`api/gen/go/user/service/v1`目录下，供`Data层`和`Service层`调用。

### 2.4 Server 层绑定接口与 Service

`kratos-gorm-example` 通过`NewRESTServer`方法完成 `HTTP Server` 的创建，并将 `UserService` 注册到 `Kratos` 的 `HTTP` 服务中，实现 API 接口与 `Service` 层的绑定。核心代码如下（文件路径：`app/user/service/internal/server/rest.go`）：

```go
// NewRESTServer new an HTTP server.
func NewRESTServer(
	cfg *conf.Bootstrap, logger log.Logger,
	userService *service.UserService,
) *http.Server {
	if cfg == nil || cfg.Server == nil || cfg.Server.Rest == nil {
		return nil
	}

	srv := bootstrap.CreateRestServer(cfg, logging.Server(logger))

	userV1.RegisterUserServiceHTTPServer(srv, userService)

	if cfg.GetServer().GetRest().GetEnableSwagger() {
		swaggerUI.RegisterSwaggerUIServerWithOption(
			srv,
			swaggerUI.WithTitle("Kratos GORM Example User Service API"),
			swaggerUI.WithMemoryData(assets.OpenApiData, "yaml"),
		)
	}

	return srv
}
```

代码说明：

1. `bootstrap.CreateRestServer`：基于配置创建 Kratos 的 HTTP Server 实例，包含端口、中间件等基础配置；
2. `userV1.RegisterUserServiceHTTPServer`：将实现了`UserService`接口的`userService`实例注册到 HTTP Server 中，完成 API 接口（如`/users`）与 `Service` 层方法的绑定；
3. Swagger 相关配置：可选开启 Swagger UI，方便调试 API 接口。

此步骤无需手动修改代码（项目已实现），只需验证该文件存在且代码完整即可 —— 启动服务后，Kratos 会自动将 HTTP 请求转发到对应的 Service 层方法。

## 五、核心步骤3：运行项目并测试CRUD接口

所有代码修改完成后，启动项目并测试接口，验证go-curd是否正常工作。

### 3.1 自动创建数据库表（GORM自动迁移）

`kratos-gorm-example`已在`app/user/service/internal/data/gorm_client.go`中实现了GORM自动迁移逻辑，启动项目时会自动根据`User模型`创建`users表`：

```go
// 关键迁移代码（项目已实现）
if err := data.DB().AutoMigrate(
  &model.User{}, // 自动迁移User模型到数据库表
); err != nil {
  log.Error("迁移数据库表失败：", err)
  return err
}
```

### 3.2 启动项目

在项目的服务目录`app/user/service`下执行以下命令启动服务：

```bash
make run
```

看到终端输出下面的文本或类似日志，说明项目启动成功：

```bash
DEBUG msg=config loaded: client.yaml format: yaml
DEBUG msg=config loaded: data.yaml format: yaml
DEBUG msg=config loaded: logger.yaml format: yaml
DEBUG msg=config loaded: server.yaml format: yaml
DEBUG msg=config loaded: tracer.yaml format: yaml
```

### 3.3 测试接口（用curl或Postman）

以下用curl命令测试4个CRUD接口，确保功能正常：

#### 1. 创建用户：

```bash
curl -X 'POST' \
  'http://localhost:7788/users' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "data": {
    "id": 0,
    "userName": "zhangsan",
    "nickName": "张三",
    "password": "123456"
  }
}'
```

成功响应：

```json
{
  "id": 1, //（ID为自动生成的主键）。
  "userName": "zhangsan",
  "nickName": "张三",
  "password": "$2a$10$Jd34ATGgTJ2sV7xvPruMLONArXk9KYQ2O6XDY42UxVO37p5DO8CVu",
  "createdAt": "1970-01-01T00:00:00Z",
  "updatedAt": "1970-01-01T00:00:00Z"
}
```

#### 2. 查询用户（使用上面返回的ID=1）：

```bash
curl -X 'GET' \
  'http://localhost:7788/users/1' \
  -H 'accept: application/json'
```

成功响应：

```json
{
  "id": 1,
  "userName": "zhangsan",
  "nickName": "张三",
  "password": "$2a$10$Jd34ATGgTJ2sV7xvPruMLONArXk9KYQ2O6XDY42UxVO37p5DO8CVu",
  "createdAt": "1970-01-01T00:00:00Z",
  "updatedAt": "1970-01-01T00:00:00Z"
}
```

#### 3. 更新用户：

```bash
curl -X 'PUT' \
  'http://localhost:7788/users/1' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "data": {
    "id": 1,
    "userName": "zhangsan",
    "nickName": "张三三"
  }
}'
```

成功响应：

```json
{
  "id": 1,
  "userName": "zhangsan",
  "nickName": "张三三",
  "password": "$2a$10$Jd34ATGgTJ2sV7xvPruMLONArXk9KYQ2O6XDY42UxVO37p5DO8CVu",
  "createdAt": "1970-01-01T00:00:00Z",
  "updatedAt": "1970-01-01T00:00:00Z"
}
```

#### 4. 删除用户：

```bash
curl -X 'DELETE' \
  'http://localhost:7788/users/1' \
  -H 'accept: */*'
```

成功响应：

```json
{}
```

## 六、新手避坑注意事项

1. **依赖版本兼容**：go-curd仅支持GORM v2版本，kratos-gorm-example已使用GORM v2，无需额外调整；若手动升级依赖，避免安装GORM v1。
2. **数据库配置错误**：务必修改`configs/data.yaml`中的`source`字段，确保MySQL用户名、密码、数据库名正确，否则会出现连接失败错误。

3. **模型字段与Proto类型匹配**：Proto中的`age`是`int32`类型，Model中的`Age`需对应`int32`（而非`int`），否则会出现类型转换错误。

4. **go-curd方法调用规范**：调用`Get`、`Delete`时，第二个参数必须是模型实例的指针（如`&user`），不能直接传结构体。

5. **自动迁移仅用于开发环境**：GORM的`AutoMigrate`仅适合开发阶段快速创建表，生产环境建议使用数据库迁移工具（如`gorm-migrate`）管理表结构。

## 七、总结

基于kratos-gorm-example项目集成go-curd的核心逻辑非常简单：**在现有GORM连接基础上初始化go-curd客户端，然后用其封装的现成方法替代原生GORM CRUD代码**。相比直接编写GORM代码，go-curd帮我们节省了大量重复工作，让业务逻辑更简洁。

如果需要扩展其他模块（如订单、商品），只需复制用户模块的逻辑：定义模型→在Service层用go-curd实现CRUD→绑定API接口即可。若遇到问题，可参考两个项目的官方GitHub文档（[go-curd][1]、[kratos-gorm-example][3]）获取更多细节。

[1]: (https://github.com/tx7do/go-crud)
[2]: (https://gitee.com/tx7do/go-crud)
[3]: (https://github.com/tx7do/kratos-gorm-example)
[4]: (https://gitee.com/tx7do/kratos-gorm-example)
