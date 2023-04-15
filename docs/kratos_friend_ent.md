# Kratos微服务与它的小伙伴系列 - ORM框架 - Ent

## 什么是ORM？

面向对象编程和关系型数据库，都是目前最流行的技术，但是它们的模型是不一样的。

面向对象编程把所有实体看成对象（object），关系型数据库则是采用实体之间的关系（relation）连接数据。很早就有人提出，关系也可以用对象表达，这样的话，就能使用面向对象编程，来操作关系型数据库。

简单说，ORM 就是通过实例对象的语法，完成关系型数据库的操作的技术，是"对象-关系映射"（Object/Relational Mapping） 的缩写。

ORM 把数据库映射成对象。

- 数据库的表（table） --> 类（class）
- 记录（record，行数据）--> 对象（object）
- 字段（field）--> 对象的属性（attribute）

举例来说，下面是一行 SQL 语句。

```sql
SELECT id, first_name, last_name, phone, birth_date, sex
FROM persons 
WHERE id = 10
```

程序直接运行 SQL，操作数据库的写法如下。

```go
res = db.execSql(sql);
name = res[0]["FIRST_NAME"];
```

改成 ORM 的写法如下。

```go
p = Person.get(10);
name = p.first_name;
```

一比较就可以发现，ORM 使用对象，封装了数据库操作，因此可以不碰 SQL 语言。开发者只使用面向对象编程，与数据对象直接交互，不用关心底层数据库。

ORM 有下面这些优点:

- 数据模型都在一个地方定义，更容易更新和维护，也利于重用代码。
- ORM 有现成的工具，很多功能都可以自动完成，比如数据消毒、预处理、事务等等。
- 它迫使你使用 MVC 架构，ORM 就是天然的 Model，最终使代码更清晰。
- 基于 ORM 的业务代码比较简单，代码量少，语义性好，容易理解。
- 你不必编写性能不佳的 SQL。

ORM 也有很突出的缺点：

- ORM 库不是轻量级工具，需要花很多精力学习和设置。
- 对于复杂的查询，ORM 要么是无法表达，要么是性能不如原生的 SQL。
- ORM 抽象掉了数据库层，开发者无法了解底层的数据库操作，也无法定制一些特殊的 SQL。

## 什么是Ent？

[ent](https://entgo.io) 是Facebook开源的一个简单但是功能强大的ORM框架，它可以轻松构建和维护具有大型数据模型的应用程序。它基于代码生成，并且可以很容易地进行数据库查询以及图遍历。

它具有以下的特点：

- 简单地使用数据库结构作为图结构。
- 使用Go代码定义结构。
- 基于代码生成的静态类型。
- 容易地进行数据库查询和图遍历。
- 容易地使用Go模板扩展和自定义。
- 多存储驱动程序 - 支持MySQL、PostgreSQL、SQLite 和 Gremlin。

## 如何去学习Ent？

想要上手ent，需要学习和了解三个方面：

1. entc
2. Schema
3. CURD API

Ent因为是基于代码生成的，所以，首当其冲的，自然是要去了解其CLI工具，没有它，如何去生成代码？

其次就是生成代码的模板：Schema。它主要是定义了表结构信息，至关重要的核心信息。生成数据库的结构和操作代码需要它，生成gRPC和GraphQL的接口也还是需要它。没它不行。

最后，就是学习使用一些数据库的基本操作，比如：连接数据库，CURD API。

从此往后，你就能够使用ent愉快的开始工作了。

## CLI工具

使用以下命令安装entc工具：

```bash
go install entgo.io/ent/cmd/ent@latest
```

## Schema

Schema相当于数据库的表。

《道德经》说：
> 道生一，一生二，二生三，三生万物。

Schema，就是一切的起始点。

只有定义了Schema，CLI才能够生成数据库表的结构和操作的相关代码，有了相关代码，才能够操作数据库表的数据。

后面想要生成gRPC和GraphQL的接口定义，也还是需要Schema。

### 创建一个Schema

创建Schema有两个方法可以做到：

#### 使用 `entc init` 创建

```bash
ent init User
```

将会在 `{当前目录}/ent/schema/` 下生成一个`user.go`文件，如果没有文件夹，则会创建一个:

```go
package schema

import "entgo.io/ent"

// User holds the schema definition for the User entity.
type User struct {
    ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
    return nil
}

// Edges of the User.
func (User) Edges() []ent.Edge {
    return nil
}
```

#### SQL转换Schema在线工具

网上有人好心的制作了一个在线工具，可以将SQL转换成schema代码，实际应用中，这是非常方便的！

SQL转Schema工具： <https://printlove.cn/tools/sql2ent>

比如，我们有一个创建表的SQL语句：

```sql
CREATE TABLE `user`  (
`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
`type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;
```

转换之后，生成如下的Schema代码：

```go
package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {

	return []ent.Field{

		field.Int32("id").SchemaType(map[string]string{
			dialect.MySQL: "int(10)UNSIGNED", // Override MySQL.
		}).NonNegative().Unique(),

		field.String("email").SchemaType(map[string]string{
			dialect.MySQL: "varchar(50)", // Override MySQL.
		}),

		field.String("type").SchemaType(map[string]string{
			dialect.MySQL: "varchar(20)", // Override MySQL.
		}),

		field.Time("created_at").SchemaType(map[string]string{
			dialect.MySQL: "timestamp", // Override MySQL.
		}).Optional(),

		field.Time("updated_at").SchemaType(map[string]string{
			dialect.MySQL: "timestamp", // Override MySQL.
		}).Optional(),
	}

}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return nil
}
```

### Mixin复用字段

在实际应用中，我们经常需要会有一些通用的字段，比如：`id`、`created_at`、`updated_at`等等。

那么，我们就一直的复制粘贴？这显然很是不优雅。

entgo能够让我们复用这些字段吗？

答案显然是，没问题。

Mixin，就是办这个事儿的。

好，我们现在需要复用时间相关的字段：`created_at`和`updated_at`，那么我们可以：

```go
package mixin

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
)

type TimeMixin struct {
	mixin.Schema
}

func (TimeMixin) Fields() []ent.Field {
	return []ent.Field{
		field.Time("created_at").
			Immutable().
			Default(time.Now),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
		field.Bool("deleted").Default(false),
	}
}
```

然后，我们就可以在Schema当中应用了，比如`User`，我们为它添加一个`Mixin`方法：

```go
func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.TimeMixin{},
	}
}
```

生成代码再看，就有这3个字段了。

## 生成代码

有了以上的Schema，我们就可以生成代码了。生成代码只能够官方提供的CLI工具`ent`来生成。

而使用CLI有两种途径可以走：直接使用命令行执行命令，还有一种就是利用了go的`go:generate`特性。

### 命令行直接执行命令生成

我们可以命令行进入`ent`文件夹，然后执行以下命令：

```command
ent generate ./schema
```

### 通过 generate.go 生成

直接运行命令看起来是没有问题，但是在我们实际应用当中，直接使用命令行的方式进行代码生成是很不方便的。

为什么呢？`ent`命令是有参数的，而在正常情况下，都是需要携带一些参数的：比如：`--feature sql/modifier`，具体文档在：[特性开关](https://entgo.io/zh/docs/feature-flags)。

这时候，我们必须在某一个地方记录这些命令，而后续会有同事需要接手这个项目呢？他又从何而知？在这个时候就徒增了不少麻烦。

好在go有一个很赞的特性`go:generate`，可以完美的解决这样一个问题。命令可以以代码的形式被记录下来，方便的重复使用。

通常我们都会把ent相关的代码放置在`ent`文件夹下面，因此我们在`ent`文件夹下面创建一个`generate.go`文件：

```go
package ent

//go:generate go run -mod=mod entgo.io/ent/cmd/ent generate --feature privacy --feature sql/modifier --feature entql --feature sql/upsert ./schema
```

接着，我们可以在项目的根目录或者`ent`文件夹下，执行以下命令：

```command
go generate ./...
```

以上的命令会遍历执行当前以及所有子目录下面的`go:generate`。

如果您使用的是Goland或者VSC，则可以在IDE中直接运行`go:generate`命令。

## ent的一些数据库基本操作

因为数据库是复杂的，SQL是复杂的，复杂到能够出好几本书，所以是绝不可能在简单的篇幅里面讲完整，只能够将常用的一些操作（连接数据库、CURD）拿来举例讲讲。

### 连接数据库

#### SQLite3

```go
import (
	_ "github.com/mattn/go-sqlite3"
)

client, err := ent.Open("sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
if err != nil {
	log.Fatalf("failed opening connection to sqlite: %v", err)
}
defer client.Close()
```

#### MySQL/MariaDB

- TiDB 高度兼容MySQL 5.7 协议
- ClickHouse 支持MySQL wire通讯协议

```go
import (
	_ "github.com/go-sql-driver/mysql"
)

client, err := ent.Open("mysql", "<user>:<pass>@tcp(<host>:<port>)/<database>?parseTime=True")
if err != nil {
	log.Fatalf("failed opening connection to mysql: %v", err)
}
defer client.Close()
```

#### PostgreSQL

- CockroachDB 兼容PostgreSQL协议

```go
import (
	_ "github.com/lib/pq"
)

client, err := ent.Open("postgresql", "host=<host> port=<port> user=<user> dbname=<database> password=<pass>")
if err != nil {
	log.Fatalf("failed opening connection to postgres: %v", err)
}
defer client.Close()
```

#### Gremlin

```go
import (
	"<project>/ent"
)

client, err := ent.Open("gremlin", "http://localhost:8182")
if err != nil {
	log.Fatalf("failed opening connection to gremlin: %v", err)
}
defer client.Close()
```

#### 自定义驱动sql.DB

有以下两种途径可以达成：

```go
package main

import (
    "time"

    "<your_project>/ent"
    "entgo.io/ent/dialect/sql"
)

func Open() (*ent.Client, error) {
    drv, err := sql.Open("mysql", "<mysql-dsn>")
    if err != nil {
        return nil, err
    }
    // Get the underlying sql.DB object of the driver.
    db := drv.DB()
    db.SetMaxIdleConns(10)
    db.SetMaxOpenConns(100)
    db.SetConnMaxLifetime(time.Hour)
    return ent.NewClient(ent.Driver(drv)), nil
}
```

第二种是：

```go
package main

import (
    "database/sql"
    "time"

    "<your_project>/ent"
    entsql "entgo.io/ent/dialect/sql"
)

func Open() (*ent.Client, error) {
    db, err := sql.Open("mysql", "<mysql-dsn>")
    if err != nil {
        return nil, err
    }
    db.SetMaxIdleConns(10)
    db.SetMaxOpenConns(100)
    db.SetConnMaxLifetime(time.Hour)
    // Create an ent.Driver from `db`.
    drv := entsql.OpenDB("mysql", db)
    return ent.NewClient(ent.Driver(drv)), nil
}
```

### 自动迁移 Automatic Migration

```go
if err := client.Schema.Create(context.Background(), migrate.WithForeignKeys(false)); err != nil {
	l.Fatalf("failed creating schema resources: %v", err)
}
```

### 增 Create

```go
pedro := client.Pet.
    Create().
    SetName("pedro").
    SaveX(ctx)
```

### 删 Delete

```go
err := client.User.
    DeleteOneID(id).
    Exec(ctx)
```

### 改 Update

```go
pedro, err := client.Pet.
    UpdateOneID(id).
    SetName("pedro").
    SetOwnerID(owner).
    Save(ctx)
```

### 查 Read

```go
names, err := client.Pet.
    Query().
    Select(pet.FieldName).
    Strings(ctx)
```

### 事务 Transaction

事务处理可以用来维护数据库的完整性，保证成批的 SQL 语句要么全部执行，要么全部不执行。

封装一个方法`WithTx`，利用匿名函数来调用被事务管理的Insert、Update、Delete语句：

```go
package data

func WithTx(ctx context.Context, client *ent.Client, fn func(tx *ent.Tx) error) error {
    tx, err := client.Tx(ctx)
    if err != nil {
        return err
    }
    defer func() {
        if v := recover(); v != nil {
            tx.Rollback()
            panic(v)
        }
    }()
    if err := fn(tx); err != nil {
        if rerr := tx.Rollback(); rerr != nil {
            err = fmt.Errorf("%w: rolling back transaction: %v", err, rerr)
        }
        return err
    }
    if err := tx.Commit(); err != nil {
        return fmt.Errorf("committing transaction: %w", err)
    }
    return nil
}
```

使用方法：

```go
func createUser(tx *ent.Tx, u UserData) *ent.UserCreate {
	return tx.User.Create().
		SetName(u.Name).
		SetNillableNickName(u.NickName)
}

func updateUser(tx *ent.Tx, u UserData) *ent.UserUpdate {
    return tx.User.Update().
		Where(
			user.Name(u.Name),
		).
		SetNillableNickName(u.NickName)
}

func deleteUser(tx *ent.Tx, u UserData) *ent.UserDelete {
    return tx.User.Delete().
		Where(
			user.Name(u.Name),
		)
}

func batchCreateUser(ctx context.Context, tx *ent.Tx, users []UserData) error {
	userCreates := make([]*ent.UserCreate, 0)
	for _, u := range users {
		userCreates = append(userCreates, createUser(tx, u))
	}
	if _, err := tx.User.CreateBulk(userCreates...).Save(ctx); err != nil {
		return err
	}
	return nil
}

func DoBatchCreateUser(ctx context.Context, client *ent.Client) {
    if err := WithTx(ctx, client, func(tx *ent.Tx) error {
        return batchCreateUser(ctx, tx, users)
    }); err != nil {
        log.Fatal(err)
    }
}
```

## 创建gRPC接口

如果你已经有了数据库的表结构，当你开始初始化一个项目的时候，你不必写任何一行代码，就完成了从ent的数据库定义，到网络API定义的全流程。接着，你需要做的，也就是微调，然后开始撸业务逻辑代码了。不要太开心！现在不都流行所谓的“低代码”吗？这不就是吗！

安装protoc插件：

```shell
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

go install entgo.io/contrib/entproto/cmd/protoc-gen-entgrpc@latest
```

向项目添加依赖库：

```command
go get -u entgo.io/contrib/entproto
```

向`Schema`添加`entproto.Message()`和`entproto.Service()`方法：

```go
func (User) Annotations() []schema.Annotation {
    return []schema.Annotation{
        entproto.Message(),
        entproto.Service(
			entproto.Methods(entproto.MethodCreate | entproto.MethodGet | entproto.MethodList | entproto.MethodBatchCreate),
		),
    }
}
```

其中，`entproto.Message()`将会导致生成Protobuf的`message`；`entproto.Service()`将会导致生成gRPC的`service`。

使用`entproto.Field()`方法向表字段添加Protobuf的字段索引号：

```go
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.String("name").
            Unique().
            Annotations(
                entproto.Field(2),
            ),
        field.String("email_address").
            Unique().
            Annotations(
                entproto.Field(3),
            ),
    }
}
```

向`generate.go`添加`entgo.io/contrib/entproto/cmd/entproto`命令：

```go
package ent

//go:generate go run -mod=mod entgo.io/ent/cmd/ent generate ./schema
//go:generate go run -mod=mod entgo.io/contrib/entproto/cmd/entproto -path ./schema
```

执行生成命令：

```command
go generate ./...
```

将会生成以下文件：

```bash
ent/proto/entpb
├── entpb.pb.go
├── entpb.proto
├── entpb_grpc.pb.go
├── entpb_user_service.go
└── generate.go
```

生成的`entpb.proto`文件生成的内容可能会是这样的：

```protobuf
// Code generated by entproto. DO NOT EDIT.
syntax = "proto3";

package entpb;

option go_package = "ent-grpc-example/ent/proto/entpb";

message User {
  int32 id = 1;

  string user_name = 2;

  string email_address = 3;
}

service UserService {
  rpc Create ( CreateUserRequest ) returns ( User );

  rpc Get ( GetUserRequest ) returns ( User );

  rpc Update ( UpdateUserRequest ) returns ( User );

  rpc Delete ( DeleteUserRequest ) returns ( google.protobuf.Empty );

  rpc List ( ListUserRequest ) returns ( ListUserResponse );

  rpc BatchCreate ( BatchCreateUsersRequest ) returns ( BatchCreateUsersResponse );
}
```

## 与Kratos携起手来

官方推荐的包结构是这样的：

```bash
|- data  
|- biz  
|- service  
|- server  
```

那么，我们可以把ent放进data文件夹下面去：

```bash
|- data  
|  |- ent  
|- biz  
|- service  
|- server
```

需要说明的是，项目的结构、命名的规范这些并不在本文阐述的范围之内。并非说非要如此，这个可以根据各自的情况来灵活设计。

我使用这样的项目结构和命名规范，仅仅是为了方便讲清楚如何在Kratos中去引用Ent。

### 创建数据库客户端

在`data/data.go`文件中添加创建数据库客户端的代码，并将之注入到`ProviderSet`：

```go
package data

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewEntClient,
    ...
)

// Data .
type Data struct {
    db  *ent.Client
}

// NewEntClient 创建数据库客户端
func NewEntClient(conf *conf.Data, logger log.Logger) *ent.Client {
	l := log.NewHelper(log.With(logger, "module", "ent/data"))

	client, err := ent.Open(
		conf.Database.Driver,
		conf.Database.Source,
	)
	if err != nil {
		l.Fatalf("failed opening connection to db: %v", err)
	}
	// 运行数据库迁移工具
	if true {
		if err := client.Schema.Create(context.Background(), migrate.WithForeignKeys(false)); err != nil {
			l.Fatalf("failed creating schema resources: %v", err)
		}
	}
	return client
}
```

需要说明的是数据库迁移工具，如果数据库中不存在表，迁移工具会创建一个；如果字段存在改变，迁移工具会对字段进行修改。

### 创建UseCase

在biz文件夹下创建`user.go`：

```go
package biz

type UserRepo interface {
	List(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error)
	Get(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error)
	Create(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error)
	Update(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error)
	Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error)
}

type UserUseCase struct {
	repo UserRepo
	log  *log.Helper
}

func NewUserUseCase(repo UserRepo, logger log.Logger) *UserUseCase {
	l := log.NewHelper(log.With(logger, "module", "user/usecase"))
	return &UserUseCase{repo: repo, log: l}
}

func (uc *UserUseCase) List(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error) {
	return uc.repo.ListUser(ctx, req)
}

func (uc *UserUseCase) Get(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error) {
	return uc.repo.GetUser(ctx, req)
}

func (uc *UserUseCase) Create(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error) {
	return uc.repo.CreateUser(ctx, req)
}

func (uc *UserUseCase) Update(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error) {
	return uc.repo.UpdateUser(ctx, req)
}

func (uc *UserUseCase) Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error) {
	return uc.repo.DeleteUser(ctx, req)
}
```

注入到`biz.ProviderSet`

```go
package biz

// ProviderSet is biz providers.
var ProviderSet = wire.NewSet(
    NewUserUseCase,
    ...
)
```

### 创建Repo

在`data`文件夹下创建`user.go`文件，实际操作数据库的操作都在此处。

```go
package data

var _ biz.UserRepo = (*UserRepo)(nil)

type UserRepo struct {
	data *Data
	log  *log.Helper
}

func NewUserRepo(data *Data, logger log.Logger) biz.UserRepo {
	l := log.NewHelper(log.With(logger, "module", "User/repo"))
	return &UserRepo{
		data: data,
		log:  l,
	}
}

func (r *userRepo) Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error) {
	err := r.data.db.User.
		DeleteOneID(req.GetId()).
		Exec(ctx)
	return err != nil, err
}

...
```

注入到`data.ProviderSet`

```go
package data

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewUserRepo,
    ...
)
```

### 在Service中调用

```go
package service

type UserService struct {
	v1.UnimplementedUserServiceServer

	uc  *biz.UserUseCase
	log *log.Helper
}

func NewUserService(logger log.Logger, uc *biz.UserUseCase) *UserService {
	l := log.NewHelper(log.With(logger, "module", "service/user"))
	return &UserService{
		log: l,
		uc:  uc,
	}
}

// ListUser 列表
func (s *UserService) ListUser(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error) {
	return s.uc.List(ctx, req)
}

// GetUser 获取
func (s *UserService) GetUser(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error) {
	return s.uc.Get(ctx, req)
}

// CreateUser 创建
func (s *UserService) CreateUser(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error) {
	return s.uc.Create(ctx, req)
}

// UpdateUser 更新
func (s *UserService) UpdateUser(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error) {
	return s.uc.Update(ctx, req)
}

// DeleteUser 删除
func (s *UserService) DeleteUser(ctx context.Context, req *v1.DeleteUserRequest) (*emptypb.Empty, error) {
	_, err := s.uc.Delete(ctx, req)
	if err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
```

## 结语

Ent是一个优秀的ORM框架。基于模板进行代码生成，相比较利用反射等方式，在性能上的损耗更少。并且，模板的使用使得扩展系统变得简单容易。

它不仅能够很对传统的关系数据库（MySQL、PostgreSQL、SQLite）方便的进行查询，并且可以容易的进行图遍历——常用的譬如像是：菜单树、组织树……这种数据查询。

Ent的工具链完整。对gRPC和GraphQL也支持的极好，也有相应的一系列工具链进行支持。从数据库表可以用工具转换成Ent的Schema，从Schema可以生成gRPC和GraphQL的API的接口。Kratos的RPC就是基于的gRPC，也支持GraphQL，简直就是为Kratos量身定做的。

相比较其他的ORM框架，Ent对工程化的支持是极佳的，这对于开发维护的效率将会有极大的提升，几个项目下来，受益良多。个人而言，我是极力推崇的。

## 参考资料

1. 官方网站： <https://entgo.io/>
2. 官方文档： <https://entgo.io/zh/docs/getting-started/>
3. 代码仓库： <https://github.com/ent/ent>
4. SQL转Schema在线工具： <https://printlove.cn/tools/sql2ent>
5. ORM 实例教程 - 阮一峰： <http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html>
