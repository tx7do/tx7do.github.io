# 初学者导引：在 Go-Kratos 中用 go-crud 实现 Ent ORM CRUD 操作

对于刚接触 Go 微服务开发的初学者来说，直接上手 “框架 + ORM” 的组合常显复杂。而 `kratos-ent-example` 项目已为我们搭建好了 `Go-Kratos` 与 `Ent` 的基础集成框架，本文将基于该项目，聚焦如何快速接入 `go-curd` 工具简化 CRUD（增删改查）操作，全程以 step-by-step 的方式讲解，新手也能轻松跟随实操。

先明确核心工具关系：`kratos-ent-example`是 “基础骨架”（已整合 Kratos 与 Ent），`go-curd`是 “效率工具”（封装重复 CRUD 逻辑），我们的核心目标是 “在现有骨架上装工具，让数据操作更简单”。

## 一、核心工具速览：3 分钟理清分工

在动手前，先明确三个工具的分工，避免越做越乱：
- **Go-Kratos**：微服务框架核心，负责 API 定义、服务启动、请求分发，kratos-ent-example 已完成其基础配置；
- **Ent**：现代化 ORM 框架，通过代码生成实现类型安全的数据库操作，采用 schema 定义模型，比传统 ORM 更注重类型检查；
- **go-crud**：Ent 的上层封装工具，把重复的 CRUD 逻辑（如创建、查询、更新、删除）做成现成方法，无需手动编写 Ent 原生查询语句。

## 二、环境准备：5 分钟搞定前置依赖

先完成基础环境搭建和项目准备，确保后续步骤无报错：

1. **安装基础工具**：要求 Go 1.24+（项目 go.mod 指定版本），安装后用`go version`验证；
2. **Git**：用于克隆示例项目；
3. **准备数据库**：支持 PostgreSQL/MySQL（Ent 适配多种数据库），新建一个数据库（比如叫`example`），不用建表（后续 Ent 会自动生成）；
4. **获取 kratos-ent-example 项目**：
    - 打开终端，执行以下命令克隆项目并进入目录：`git clone https://github.com/tx7do/kratos-ent-example.git`
    - `cd kratos-ent-example`
5. **引入 go-curd 依赖**：项目已预设 go-curd 的 Ent 适配模块（见 go.mod 中的`github.com/tx7do/go-crud/entgo`），直接拉取依赖即可：`go mod tidy`
6. **确认项目核心目录**：无需关注所有文件，重点记住 3 个核心目录（kratos-ent-example 已预设）：
    - `api`：放 API 定义文件（.proto），用于定义 “创建用户”“查询用户” 等接口；
    - `app/user/service/internal/data/ent/schema`：放 Ent 模型定义（通过 schema 描述数据库表结构）；
    - `app/user/service/internal/data`：放业务逻辑，这里会调用 `go-curd` 操作 Ent 客户端。

## 三、核心步骤 1：在 kratos-ent-example 中集成 go-curd

`kratos-ent-example` 已完成 Ent 的初始化配置（如数据库连接、代码生成），我们只需在现有基础上，将 `go-curd` 的 Ent 客户端集成进来，让业务层可以调用其简化方法。

### 1.1 修改数据层：集成 go-curd 的 Ent 客户端

打开`app/user/service/internal/data/user.go`修改代码以集成`go-curd`的 `Ent` 适配模块：

```go
package data

import (
  entCurd "github.com/tx7do/go-crud/entgo"
)

type UserRepo struct {
	data *Data
	log  *log.Helper

	mapper     *mapper.CopierMapper[userV1.User, *ent.User]
	repository *entCurd.Repository[
		ent.UserQuery, ent.UserSelect, ent.UserCreate, ent.UserCreateBulk, ent.UserUpdate, ent.UserUpdateOne, ent.UserDelete,
		predicate.User,
		userV1.User, ent.User,
	]
}

func NewUserRepo(data *Data, logger log.Logger) *UserRepo {
	l := log.NewHelper(log.With(logger, "module", "user/repo/user-service"))
	repo := &UserRepo{
		data:   data,
		log:    l,
		mapper: mapper.NewCopierMapper[userV1.User, *ent.User](),
	}

	// 初始化go-curd的Ent仓库，传入映射器和Ent客户端
	repo.repository = entCurd.NewRepository[
		ent.UserQuery, ent.UserSelect, ent.UserCreate, ent.UserCreateBulk, ent.UserUpdate, ent.UserUpdateOne, ent.UserDelete,
		predicate.User,
		userV1.User, ent.User,
	](repo.mapper)

	return repo
}
```

核心改动说明：新增`repository`字段存储`go-curd`的 `Ent` 客户端，通过`entCurd.NewRepository()`初始化，后续 CRUD 操作均通过该客户端完成。

### 1.2 确认数据库配置（无需修改，仅验证）

`kratos-ent-example` 已在配置文件中预设数据库连接，打开`configs/data.yaml`验证：

```yaml
data:
  database:
    driver: "postgres"  # 支持mysql/postgres/sqlite
    source: "host=localhost port=5432 user=postgres password=your_password dbname=example sslmode=disable"
    migrate: true  # 启动时自动执行数据库迁移
```

注意：将`source`中的用户名、密码改为自己的数据库信息，确保能连接到之前新建的`example`数据库。

## 四、核心步骤 2：用 go-curd 实现 CRUD 业务逻辑

我们将以 “用户模块” 为例，基于项目现有的目录结构，用 `go-curd` 实现用户的增、删、改、查。`kratos-ent-example` 已预设部分基础代码，我们只需补充和修改。

### 2.1 定义用户模型（Ent Schema）

`Ent` 通过 `schema` 定义模型（而非传统结构体），打开`app/user/service/internal/data/ent/schema/user.go`，定义用户模型的 schema：

```go
package schema

import (
	"time"
	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("user_name").
			SchemaType(map[string]string{
				dialect.MySQL:    "varchar(64)", // MySQL特定类型
				dialect.Postgres: "varchar(64)", // PostgreSQL特定类型
			}).
			Unique(), // 用户名唯一
		field.String("nick_name").
			SchemaType(map[string]string{
				dialect.MySQL:    "varchar(64)",
				dialect.Postgres: "varchar(64)",
			}),
		field.String("password").
			SchemaType(map[string]string{
				dialect.MySQL:    "varchar(128)",
				dialect.Postgres: "varchar(128)",
			}),
		field.Time("created_at").
			Default(time.Now).
			SchemaType(map[string]string{
				dialect.MySQL: "datetime",
			}),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now).
			SchemaType(map[string]string{
				dialect.MySQL: "datetime",
			}),
		field.Time("deleted_at").
			Optional().
			Nillable().
			SchemaType(map[string]string{
				dialect.MySQL: "datetime",
			}),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return nil
}

// Indexes of the User.
func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("user_name").Unique(), // 用户名索引（唯一）
	}
}
```

说明：Ent 会根据该 schema 自动生成 Go 代码（实体、查询器等），后续通过生成的代码操作数据库。在`app/user/service`目录下执行以下命令生成 `Ent` 代码：

```bash
make ent
```

生成的代码会放在`app/user/service/internal/data/ent`目录下，包含`User`实体及 CRUD 基础方法。

### 2.2 编写 Data 层：用 go-curd 实现 CRUD

打开`app/user/service/internal/data/user.go`，编写业务逻辑方法。核心优势：用 `go-curd` 的现成方法替代原生 Ent 代码，减少重复工作。

```go
package data

// List 查询用户列表（带分页）
func (r *UserRepo) List(ctx context.Context, req *pagination.PagingRequest) (*userV1.ListUserResponse, error) {
	if req == nil {
		return nil, errors.New("request is nil")
	}

	builder := r.data.db.Client().Debug().User.Query()

	ret, err := r.repository.ListWithPaging(ctx, builder, builder.Clone(), req)
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

// Get 查询单个用户（支持按ID或用户名查询）
func (r *UserRepo) Get(ctx context.Context, req *userV1.GetUserRequest) (*userV1.User, error) {
	if req == nil {
		return nil, errors.New("request is nil")
	}

	var whereCond []func(s *sql.Selector)
	switch req.QueryBy.(type) {
	case *userV1.GetUserRequest_Id:
		whereCond = append(whereCond, user.IDEQ(req.GetId()))
	case *userV1.GetUserRequest_UserName:
		whereCond = append(whereCond, user.UserNameEQ(req.GetUserName()))
	default:
		whereCond = append(whereCond, user.IDEQ(req.GetId()))
	}

	builder := r.data.db.Client().Debug().User.Query()
	dto, err := r.repository.Get(ctx, builder, whereCond, req.GetViewMask())
	if err != nil {
		return nil, err
	}

	return dto, err
}

// Create 创建用户（密码加密存储）
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

	builder := r.data.db.Client().Debug().User.Create()
	result, err := r.repository.Create(ctx, builder, req.Data, nil, func(dto *userV1.User) {
		builder.
			SetNillableUserName(req.Data.UserName).
			SetNillableNickName(req.Data.NickName).
			SetCreatedAt(time.Now())

		if req.Data.Password != nil {
			builder.SetPassword(req.Data.GetPassword())
		}
	})

	return result, err
}

// Update 更新用户信息
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

	builder := r.data.db.Client().Debug().User.UpdateOneID(req.Data.GetId())
	result, err := r.repository.UpdateOne(ctx, builder, req.Data, req.GetUpdateMask(),
		[]predicate.User{
			func(s *sql.Selector) {
				s.Where(sql.EQ(user.FieldID, req.Data.GetId()))
			},
		},
		func(dto *userV1.User) {
			builder.
				SetNillableNickName(req.Data.NickName).
				SetUpdatedAt(time.Now())

			if req.Data.Password != nil {
				builder.SetPassword(req.Data.GetPassword())
			}
		},
	)

	return result, err
}

// Delete 删除用户
func (r *UserRepo) Delete(ctx context.Context, req *userV1.DeleteUserRequest) (bool, error) {
	if req == nil {
		return false, errors.New("request is nil")
	}

	builder := r.data.db.Client().Debug().User.Delete()
	affected, err := r.repository.Delete(ctx, builder, []predicate.User{
		func(s *sql.Selector) {
			s.Where(sql.EQ(user.FieldID, req.GetId()))
		},
	})

	return err == nil && affected > 0, err
}
```

核心简化点：对比原生 `Ent`，`go-curd` 的`ListWithPaging`、`Get`、`Create`等方法封装了查询条件构建、结果映射等重复逻辑，直接传入 DTO（数据传输对象）即可完成操作。

### 2.3 定义 API 接口（Proto）并生成代码

`kratos-ent-example`已在`api/protos/user/service/v1/user.proto`中预设了用户 API 定义（与 GORM 示例类似），我们只需确认内容，然后生成 Go 代码：

```protobuf
syntax = "proto3";

package user.service.v1;

import "google/api/annotations.proto";
import "pagination/v1/pagination.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/field_mask.proto";

// 用户服务
service UserService {
  rpc ListUser (pagination.PagingRequest) returns (ListUserResponse) {
    option (google.api.http) = { get: "/users" };
  }
  rpc GetUser (GetUserRequest) returns (User) {
    option (google.api.http) = { get: "/users/{id}" };
  }
  rpc CreateUser (CreateUserRequest) returns (User) {
    option (google.api.http) = { post: "/users", body: "*" };
  }
  rpc UpdateUser (UpdateUserRequest) returns (User) {
    option (google.api.http) = { put: "/users/{data.id}", body: "*" };
  }
  rpc DeleteUser (DeleteUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = { delete: "/users/{id}" };
  }
}

// 省略消息定义
```

执行以下命令生成 Go 代码（项目已预设`make api`命令）：

```bash
make api
```

生成的代码会放在`api/gen/go/user/service/v1`目录下，供 `Data` 层和 `Service` 层调用。

### 2.4 Server 层绑定接口与 Service

`kratos-ent-example` 通过`NewRESTServer`方法完成 `HTTP Server` 的创建，并将 `UserService` 注册到 `Kratos` 的 `HTTP` 服务中，实现 API 接口与 `Service` 层的绑定。核心代码如下（文件路径：`app/user/service/internal/server/rest.go`）：

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
			swaggerUI.WithTitle("Kratos Ent Example User Service API"),
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

## 五、核心步骤 3：运行项目并测试 CRUD 接口

所有代码修改完成后，启动项目并测试接口，验证 `go-curd` 与 `Ent` 的集成是否正常工作。

### 3.1 自动创建数据库表（Ent 迁移）

`kratos-ent-example` 已在`app/user/service/internal/data/ent_client.go`中实现 Ent 自动迁移逻辑，启动项目时会根据 schema 创建数据库表：

```go
// 关键迁移代码（项目已实现）
if cfg.Data.Database.GetMigrate() {
  if err = client.Schema.Create(context.Background(), migrate.WithForeignKeys(true)); err != nil {
    l.Fatalf("failed creating schema resources: %v", err)
  }
}
```

### 3.2 启动项目

在项目的服务目录`app/user/service`下执行以下命令启动服务：

```bash
make run
```

看到终端输出类似以下日志，说明项目启动成功：

```bash
DEBUG msg=config loaded: data.yaml format: yaml
DEBUG msg=ent: connecting to postgres://postgres:***@localhost:5432/example?sslmode=disable
DEBUG msg=ent: schema migrated successfully
```

### 3.3 测试接口（用 curl 或 Postman）

以下用 curl 命令测试 4 个 CRUD 接口，确保功能正常：

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

1. **Ent 代码生成必须执行**：修改 schema 后必须运行`make ent`生成新代码，否则会报 “未定义字段 / 方法” 错误；
2. **数据库驱动适配**：Ent 对不同数据库的字段类型支持有差异（如时间类型），schema 中需用`SchemaType`指定数据库特定类型；
3. **查询条件构建**：Ent 的查询条件通过函数闭包实现（如`q.Where(ent.User.ID(1))`），与 GORM 的链式调用不同，需注意语法；
4. **go-curd 版本兼容**：项目依赖的`github.com/tx7do/go-crud/entgo`版本需与 Ent 版本（项目中为 v0.14.5）匹配，否则可能出现方法不兼容；
5. **迁移操作谨慎执行**：生产环境中，`migrate.WithForeignKeys(true)`可能导致表结构变更风险，建议先通过`ent migrate plan`预览变更。

## 七、总结

基于 `kratos-ent-example` 项目集成 `go-curd` 的核心逻辑是：**在 Ent 自动生成的代码基础上，通过 go-curd 封装 CRUD 逻辑，减少重复的查询构建和结果映射工作**。相比直接使用 Ent 原生 API，go-curd 让业务代码更简洁，尤其适合快速开发。

如果需要扩展其他模块（如订单、商品），只需复制用户模块的逻辑：定义 Ent schema→生成代码→用 go-curd 实现 CRUD→绑定 API 接口。若遇到问题，可参考项目的官方文档（[go-curd][1]、[kratos-ent-example][3]）获取更多细节。

[1]: (https://github.com/tx7do/go-crud)
[2]: (https://gitee.com/tx7do/go-crud)
[3]: (https://github.com/tx7do/kratos-ent-example)
[4]: (https://gitee.com/tx7do/kratos-ent-example)
