# Kratos微服务与它的小伙伴系列 - ORM框架 - GORM

## 什么是ORM？

Object-Relationl Mapping， 它的作用是映射数据库和对象之间的关系，方便我们在实现数据库操作的时候不用去写复杂的sql语句，把对数据库的操作上升到对于对象的操作

## 什么是GORM？

gorm是基于Go语言实现的ORM库。

类似于Java生态里Mybatis、Hibernate、SpringData等。

## 特性

* 全功能 ORM
* 关联 (Has One，Has Many，Belongs To，Many To Many，多态，单表继承)
* Create，Save，Update，Delete，Find 中钩子方法
* 支持 Preload、Joins 的预加载
* 事务，嵌套事务，Save Point，Rollback To Saved Point
* Context、预编译模式、DryRun 模式
* 批量插入，FindInBatches，Find/Create with Map，使用 SQL 表达式、Context Valuer 进行 CRUD
* SQL 构建器，Upsert，数据库锁，Optimizer/Index/Comment Hint，命名参数，子查询
* 复合主键，索引，约束
* Auto Migration
* 自定义 Logger
* 灵活的可扩展插件 API：Database Resolver（多数据库，读写分离）、Prometheus…
* 每个特性都经过了测试的重重考验
* 开发者友好

## 安装库

```console
go get -u gorm.io/gorm

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

```go
// MySQL
dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

// PostgreSQL
dsn := "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

// SQLite
db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})

// SQL Server
dsn := "sqlserver://gorm:LoremIpsum86@localhost:9930?database=gorm"
db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})

// Clickhouse
dsn := "tcp://localhost:9000?database=gorm&username=gorm&password=gorm&read_timeout=10&write_timeout=20"
db, err := gorm.Open(clickhouse.Open(dsn), &gorm.Config{})
```

### 自动迁移

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

表名，将会被转换为 **复数形式** 以及 **蛇形命名法（snake_case）**，比如：`User`转换为`users`。

字段名，将被转换为 **蛇形命名法（snake_case）** 字符串，比如：`UserName`被转换为`user_name`。

### 增

```go
db.Create(&User{UserName: "TestUserName", NickName: "TestNickName"})
```

### 删

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

### 改

```go
db.Model(&user).Update("nick_name", "NewNickName")

// Update - 更新多个字段
db.Model(&user).Updates(User{UserName: "NewUserName", NickName: "NewNickName"})
db.Model(&user).Updates(map[string]interface{}{"user_name": "NewUserName", "nick_name": "NewNickName"})
```

### 查

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

在data.go文件中添加创建数据库客户端的代码，并将之注入到`ProviderSet`：

```go
// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewGormClient,
    ...
)

// Data .
type Data struct {
    db  *gorm.Client
}

// NewGormClient 创建数据库客户端
func NewGormClient(conf *conf.Data, logger log.Logger) *ent.Client {
	l := log.NewHelper(log.With(logger, "module", "gorm/data"))

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

## 参考资料

* [GORM官方中文文档](https://gorm.io/zh_CN/docs/index.html)
* [GORM官方代码库](https://github.com/go-gorm/gorm)
* [GORM中文文档 - learnku](https://learnku.com/docs/gorm/v1/index/3781)
* [无恒实验室联合GORM推出安全好用的ORM框架-GEN](https://security.bytedance.com/techs/wuheng-lab-better-orm-gen)
