# Golang微服框架Kratos与它的小伙伴系列 - ORM框架 - GORM

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

## 什么是GORM？

[GORM](https://gorm.io/index.html) 是基于Go语言实现的ORM库，它是Golang目前比较热门的数据库ORM操作库，对开发者也比较友好，使用非常方便简单。

最重要的是，它是一个正经的国产开源库。支持国产！

## 特性

- 全功能 ORM
- 关联 (Has One，Has Many，Belongs To，Many To Many，多态，单表继承)
- Create，Save，Update，Delete，Find 中钩子方法
- 支持 Preload、Joins 的预加载
- 事务，嵌套事务，Save Point，Rollback To Saved Point
- Context、预编译模式、DryRun 模式
- 批量插入，FindInBatches，Find/Create with Map，使用 SQL 表达式、Context Valuer 进行 CRUD
- SQL 构建器，Upsert，数据库锁，Optimizer/Index/Comment Hint，命名参数，子查询
- 复合主键，索引，约束
- Auto Migration
- 自定义 Logger
- 灵活的可扩展插件 API：Database Resolver（多数据库，读写分离）、Prometheus…
- 每个特性都经过了测试的重重考验
- 开发者友好

## 安装库

```bash
go get -u gorm.io/gorm
```

除此以外，还需要安装数据库的驱动：

```bash
# 安装SQLite驱动
go get -u gorm.io/driver/sqlite

# 安装MySQL驱动
go get -u gorm.io/driver/mysql

# 安装PostgreSQL驱动
go get -u gorm.io/driver/postgres

# 安装SQL Server驱动
go get -u gorm.io/driver/sqlserver

# 安装Clickhouse驱动（Clickhouse兼容MySQL的协议，所以直接用MySQL驱动连接也是一样的）
go get -u gorm.io/driver/clickhouse
```

## GORM的一些数据库基本操作

因为数据库是复杂的，SQL是复杂的，复杂到能够出好几本书，所以是绝不可能在简单的篇幅里面讲完整，只能够将常用的一些操作（连接数据库、CURD）拿来举例讲讲。

### 连接数据库

#### MySQL

```go
import (
  "gorm.io/gorm"
  "gorm.io/driver/mysql"
)

dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
```

#### PostgreSQL

```go
import (
  "gorm.io/gorm"
  "gorm.io/driver/postgres"
)

dsn := "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
```

#### SQLite

```go
import (
  "gorm.io/gorm"
  "gorm.io/driver/sqlite"
)

db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
```

#### SQL Server

```go
import (
  "gorm.io/gorm"
  "gorm.io/driver/sqlserver"
)

dsn := "sqlserver://gorm:LoremIpsum86@localhost:9930?database=gorm"
db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
```

#### Clickhouse

```go
import (
  "gorm.io/gorm"
  "gorm.io/driver/clickhouse"
)

dsn := "tcp://localhost:9000?database=gorm&username=gorm&password=gorm&read_timeout=10&write_timeout=20"
db, err := gorm.Open(clickhouse.Open(dsn), &gorm.Config{})
```

### 自动迁移 Automatic Migration

```go
db.AutoMigrate(&User{})
```

自动迁移功能，会创建表、缺失的外键、约束、列和索引。

### 定义模型

```go
type User struct {
  gorm.Model
  UserName string
  NickName string
}
```

`gorm.Model`则是包含了通用的一些字段，比如：id、创建时间、更新时间、删除时间等……

```go
// gorm.Model definition
type Model struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

在默认的情况下：

- 表名，将会被转换为 **复数形式** 以及 **蛇形命名法（snake_case）**，比如：`User`转换为`users`。
- 字段名，将被转换为 **蛇形命名法（snake_case）** 字符串，比如：`UserName`被转换为`user_name`。

当然，你也可以用`column`标明字段名的输出：

```go
type User struct {
  gorm.Model
  UserName string `gorm:"column:username"`
  NickName string `gorm:"column:nickname"`
}
```

定义`TableName()`方法控制表名的输出:

```go
func (u User) TableName() string {
	return "users"
}
```

### 增 Create

```go
db.Create(&User{UserName: "TestUserName", NickName: "TestNickName"})
```

### 删 Delete

```go
// 软删除
// UPDATE users SET deleted_at="2020-03-13 10:23" WHERE id = user.id;
db.Delete(&user, 1)

db.Delete(&user)

// 批量软删除
db.Where("age = ?", 20).Delete(&User{})

// 物理删除
// DELETE FROM users WHERE id=10;
db.Unscoped().Delete(&user)
```

### 改 Update

```go
db.Model(&user).Update("nick_name", "NewNickName")

// Update - 更新多个字段
db.Model(&user).Updates(User{UserName: "NewUserName", NickName: "NewNickName"})
db.Model(&user).Updates(map[string]interface{}{"user_name": "NewUserName", "nick_name": "NewNickName"})
```

### 查 Read

```go
var user User

// 获取第一条记录（主键升序）
// SELECT * FROM users ORDER BY id LIMIT 1;
db.First(&user)

// 根据整型主键查找
// SELECT * FROM users WHERE id = 10;
db.First(&user, 10)
db.First(&user, "10")

// 根据主键获取记录，如果是非整型主键
// SELECT * FROM users WHERE user_name = 'TestUserName';
db.First(&user, "user_name = ?", "TestUserName")

// SELECT * FROM users WHERE id IN (1,2,3);
db.Find(&users, []int{1,2,3})

// 获取一条记录，没有指定排序字段
// SELECT * FROM users LIMIT 1;
db.Take(&user)

// 获取最后一条记录（主键降序）
// SELECT * FROM users ORDER BY id DESC LIMIT 1;
db.Last(&user)
```

## 与Kratos携起手来

官方推荐的包结构是这样的：

|- data  
|- biz  
|- service  
|- server  

那么，我们可以把模型定义做成一个package，放到data文件夹下面去：

|- data  
|  |- modal  
|- biz  
|- service  
|- server

### 创建数据库客户端

在`data/data.go`文件中添加创建Gorm数据库客户端的方法`NewGormClient`：

```go
import (
	"gorm.io/driver/clickhouse"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/driver/sqlserver"

	"gorm.io/gorm"
)

// Data .
type Data struct {
    db  *gorm.Client
}

// NewGormClient 创建数据库客户端
func NewGormClient(cfg *conf.Bootstrap, logger log.Logger) *gorm.DB {
	l := log.NewHelper(log.With(logger, "module", "ent/data/user-service"))

	var driver gorm.Dialector
	switch cfg.Data.Database.Driver {
	default:
		fallthrough
	case "mysql":
		driver = mysql.Open(cfg.Data.Database.Source)
		break
	case "postgres":
		driver = postgres.Open(cfg.Data.Database.Source)
		break
	case "clickhouse":
		driver = clickhouse.Open(cfg.Data.Database.Source)
		break
	case "sqlite":
		driver = sqlite.Open(cfg.Data.Database.Source)
		break
	case "sqlserver":
		driver = sqlserver.Open(cfg.Data.Database.Source)
		break
	}

	client, err := gorm.Open(driver, &gorm.Config{})
	if err != nil {
		l.Fatalf("failed opening connection to db: %v", err)
	}

	// 运行数据库迁移工具
	if cfg.Data.Database.Migrate {
		if err := client.AutoMigrate(
			&models.User{},
		); err != nil {
			l.Fatalf("failed creating schema resources: %v", err)
		}
	}
	return client
}
```

并将之注入到`ProviderSet`

```go
// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewGormClient,
    ...
)
```

需要说明的是数据库迁移工具，如果数据库中不存在表，迁移工具会创建一个；如果字段存在改变，迁移工具会对字段进行修改。

### 创建UseCase

在biz文件夹下创建`user.go`：

```go
package biz

type UserRepo interface {
	ListUser(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error)
	GetUser(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error)
	CreateUser(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error)
	UpdateUser(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error)
	DeleteUser(ctx context.Context, req *v1.DeleteUserRequest) (bool, error)
}

type UserUseCase struct {
	repo UserRepo
	log  *log.Helper
}

func NewUserUseCase(repo UserRepo, logger log.Logger) *UserUseCase {
	l := log.NewHelper(log.With(logger, "module", "user/usecase"))
	return &UserUseCase{repo: repo, log: l}
}

func (uc *UserUseCase) ListUser(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error) {
	return uc.repo.ListUser(ctx, req)
}

func (uc *UserUseCase) GetUser(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error) {
	return uc.repo.GetUser(ctx, req)
}

func (uc *UserUseCase) CreateUser(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error) {
	return uc.repo.CreateUser(ctx, req)
}

func (uc *UserUseCase) UpdateUser(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error) {
	return uc.repo.UpdateUser(ctx, req)
}

func (uc *UserUseCase) DeleteUser(ctx context.Context, req *v1.DeleteUserRequest) (bool, error) {
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

func (r *UserRepo) convertModelToProto(in *models.User) *v1.User {
	if in == nil {
		return nil
	}
	return &v1.User{
		Id:         uint32(in.ID),
		UserName:   &in.UserName,
		NickName:   &in.NickName,
		Password:   &in.Password,
		CreateTime: util.TimeToTimeString(&in.CreatedAt),
		UpdateTime: util.TimeToTimeString(&in.UpdatedAt),
	}
}

func (r *UserRepo) List(_ context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error) {
	var results []models.User

	result := r.data.db.
		Limit(int(req.GetPageSize())).
		Offset(int(req.GetPageSize() * (req.GetPage() - 1))).
		Find(&results)
	if result.Error != nil {
		return nil, result.Error
	}

	items := make([]*v1.User, 0, len(results))
	for _, res := range results {
		item := r.convertModelToProto(&res)
		items = append(items, item)
	}

	var count int64
	result = r.data.db.Model(&models.User{}).
		Count(&count)
	if result.Error != nil {
		return nil, result.Error
	}

	return &v1.ListUserResponse{
		Total: int32(count),
		Items: items,
	}, nil
}

func (r *UserRepo) Get(_ context.Context, req *v1.GetUserRequest) (*v1.User, error) {
	res := &models.User{}
	r.data.db.First(res, "id = ?", req.GetId())
	return r.convertModelToProto(res), nil
}

func (r *UserRepo) Create(_ context.Context, req *v1.CreateUserRequest) (*v1.User, error) {
	cryptoPassword, err := crypto.HashPassword(req.User.GetPassword())
	if err != nil {
		return nil, err
	}

	res := &models.User{
		UserName: req.User.GetUserName(),
		NickName: req.User.GetNickName(),
		Password: cryptoPassword,
	}

	result := r.data.db.Create(res)
	if result.Error != nil {
		return nil, result.Error
	}

	return r.convertModelToProto(res), err
}

func (r *UserRepo) Update(_ context.Context, req *v1.UpdateUserRequest) (*v1.User, error) {
	var cryptoPassword string
	var err error
	if req.User.Password != nil {
		cryptoPassword, err = crypto.HashPassword(req.User.GetPassword())
		if err != nil {
			return nil, err
		}
	}

	res := &models.User{
		UserName: req.User.GetUserName(),
		NickName: req.User.GetNickName(),
		Password: cryptoPassword,
	}

	result := r.data.db.Model(res).Updates(res)
	if result.Error != nil {
		return nil, result.Error
	}

	return r.convertModelToProto(res), err
}

func (r *UserRepo) Delete(_ context.Context, req *v1.DeleteUserRequest) (bool, error) {
	result := r.data.db.Delete(&models.User{}, req.GetId())
	if result.Error != nil {
		return false, result.Error
	}
	return true, nil
}
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

// ListUser 获取用户列表
func (s *UserService) ListUser(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error) {
	return s.uc.ListUser(ctx, req)
}

// GetUser 获取一个用户
func (s *UserService) GetUser(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error) {
	return s.uc.GetUser(ctx, req)
}

// CreateUser 创建一个用户
func (s *UserService) CreateUser(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error) {
	return s.uc.CreateUser(ctx, req)
}

// UpdateUser 更新一个用户
func (s *UserService) UpdateUser(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error) {
	return s.uc.UpdateUser(ctx, req)
}

// DeleteUser 删除一个用户
func (s *UserService) DeleteUser(ctx context.Context, req *v1.DeleteUserRequest) (*emptypb.Empty, error) {
	_, err := s.uc.DeleteUser(ctx, req)
	if err != nil {
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
```

注入到`service.ProviderSet`

```go
package service

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewUserService,
    ...
)
```

将服务注册到gRPC服务器当中去：

```go
package server

// NewGRPCServer new a gRPC server.
func NewGRPCServer(cfg *conf.Bootstrap, logger log.Logger,
	userSvc *service.UserService,
) *grpc.Server {
	srv := bootstrap.CreateGrpcServer(cfg, logging.Server(logger))

	userV1.RegisterUserServiceServer(srv, userSvc)

	return srv
}
```

这样，我们就有了一个完整的`用户服务`。

## 实例代码

- <https://github.com/tx7do/kratos-gorm-example>
- <https://gitee.com/tx7do/kratos-gorm-example>

## 参考资料

* [GORM官方中文文档](https://gorm.io/zh_CN/docs/index.html)
* [GORM官方代码库](https://github.com/go-gorm/gorm)
* [GORM中文文档 - learnku](https://learnku.com/docs/gorm/v1/index/3781)
* [无恒实验室联合GORM推出安全好用的ORM框架-GEN](https://security.bytedance.com/techs/wuheng-lab-better-orm-gen)
