# Kratos微服务与它的小伙伴系列 - ORM框架 - Ent

## 什么是ORM

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

## 什么是Ent

ent  是Facebook开源的一个ORM框架，其结合Facebook的业务风格而诞生，比较新颖地使用节点和线条构建出数据流图来表示数据库中字段、表、之间的关系，现在已经被Facebook用在了生产环境(虽然GitHub上说该项目是experimental的),概括来说具有以下特色：

- 图就是代码 - 将任何数据库表建模为Go对象。
- 轻松地遍历任何图形 - 可以轻松地运行查询、聚合和遍历任何图形结构。
- 静态类型和显式API - 使用代码生成静态类型和显式API，查询数据更加便捷。
- 多存储驱动程序 - 支持MySQL、PostgreSQL、SQLite 和 Gremlin。
- 可扩展 - 简单地扩展和使用Go模板自定义。

## 安装脚手架工具entc

```bash
go install entgo.io/ent/cmd/ent@latest
```

## 创建实体 Schema

schema相当于数据库的表，有两种方法可以实现：

## 使用 `entc init` 生成

```bash
ent init User
```

将会在 `{当前目录}/ent/schema/` 下生成一个`user.go`文件:

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

## sql转换工具

网上有人好心的制作了一个工具，可以将SQL转换成schema代码，非常方便！

SQL转Schema工具： <https://printlove.cn/tools/sql2ent>

比如我们有一个创建表的SQL

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

转换之后，生成如下代码：

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

## 生成代码

有了以上的Schema，我们就可以生成代码了。

我们命令行进入ent的上一层文件夹，然后执行以下命令：

```bash
entc generate ./ent/schema
```

但是用命令行的方式其实是很不方便的，主要是有时候需要带一些特殊的参数，比如：`--feature sql/modifier`，这就很麻烦了。但好在go有一个很赞的特性`go:generate`，我们可以在ent文件夹下面创建一个`generate.go`文件：

```go
package ent

//go:generate go run -mod=mod entgo.io/ent/cmd/ent generate --feature privacy --feature sql/modifier --feature entql --feature sql/upsert ./schema
```

接着我们可以在项目的根目录下运行命令执行整个项目的`go:generate`：

```bash
go generate ./...
```

或者指定执行这一个`generate.go`文件：

```bash
go generate ./ent
```

自此所有的预备工作就做好了。

## ent的一些数据库基本操作

### 增

```go
pedro := client.Pet.    // PetClient.
    Create().           // Pet create builder.
    SetName("pedro").   // Set field value.
    SetOwner(a8m).      // Set owner (unique edge).
    SaveX(ctx)          // Create and return.
```

### 删

```go
err := client.User.
    DeleteOneID(id).
    Exec(ctx)
```

### 改

```go
pedro, err := client.Pet.   // PetClient.
    UpdateOneID(id).        // Pet update builder.
    SetName("pedro").       // Set field name.
    SetOwnerID(owner).      // Set unique edge, using id.
    Save(ctx)               // Save and return.
```

### 查

```go
names, err := client.Pet.
    Query().
    Select(pet.FieldName).
    Strings(ctx)
```

## 整合进Kratos

官方推荐的包结构是这样的：

|- data  
|- biz  
|- service  
|- server  

那么，我们可以把ent放进data文件夹下面去：

|- data  
|  |- ent  
|- biz  
|- service  
|- server

### 创建数据库客户端

接着在data.go文件中添加创建数据库客户端的代码，并将之注入到`ProviderSet`：

```go
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
// ProviderSet is biz providers.
var ProviderSet = wire.NewSet(
    NewUserUseCase,
    ...
)
```

### 创建Repo

在data文件夹下创建`user.go`文件，实际操作数据库客户端的操作都在此做。

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
```

注入到`data.ProviderSet`

```go
// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewUserRepo,
    ...
)
```

## 参考资料

- ORM 实例教程 - 阮一峰： <http://www.ruanyifeng.com/blog/2019/02/orm-tutorial.html>
- 官方文档： <https://entgo.io>
- 代码仓库： <https://github.com/ent/ent>
- SQL转Schema工具： <https://printlove.cn/tools/sql2ent>
