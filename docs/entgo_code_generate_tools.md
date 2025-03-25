# Ent代码生成工具链

Ent是Facebook开源的一个GO语言的ORM框架。它提供了一系列的工具，可以做到：

1. SQL生成schema；
2. schema生成protobuf的message；
3. schema生成gPRC的service。

## 创建go项目

```bash
go mod init entimport-example
```

初始化ent的文件夹

```bash
mkdir ./ent/schema
```

## SQL生成schema

```text
Usage of entimport:

  -dsn string
        data source name (connection information), for example:
        "mysql://user:pass@tcp(localhost:3306)/dbname"
        "postgres://user:pass@host:port/dbname"
  -exclude-tables value
        comma-separated list of tables to exclude
  -schema-path string
        output path for ent schema (default "./ent/schema")
  -tables value
        comma-separated list of tables to inspect (all if empty)
```

### MySQL

```sql
CREATE TABLE users
(
    id        bigint auto_increment PRIMARY KEY,
    age       bigint       NOT NULL,
    name      varchar(255) NOT NULL,
    last_name varchar(255) NULL comment 'surname'
);

CREATE TABLE cars
(
    id          bigint auto_increment PRIMARY KEY,
    model       varchar(255) NOT NULL,
    color       varchar(255) NOT NULL,
    engine_size mediumint    NOT NULL,
    user_id     bigint       NULL,
    CONSTRAINT cars_owners FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);
```

导出表结构：

```bash
go run -mod=mod ariga.io/entimport/cmd/entimport \
                -dsn "mysql://root:pass@tcp(localhost:3306)/entimport"
```

### Postgresql

```sql
CREATE TABLE users (
    id bigserial PRIMARY KEY,
    age bigint NOT NULL,
    name varchar(255) NOT NULL,
    last_name varchar(255) NULL
);

CREATE TABLE cars (
    id bigserial PRIMARY KEY,
    model varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    engine_size int NOT NULL,
    user_id bigint NULL,
    CONSTRAINT cars_owners FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

导出表结构：

```bash
go run -mod=mod ariga.io/entimport/cmd/entimport \
                -dsn "postgres://postgres:123456@localhost:5432/entimport?sslmode=disable"
```

## schema生成proto

我们首先需要修改生成出来的Schema，修改`ent/schema/user.go`的`Annotations`方法：

```go
func (User) Annotations() []schema.Annotation {
    return []schema.Annotation{
        entproto.Message(),
        entproto.Service(
            entproto.Methods(
                entproto.MethodCreate | entproto.MethodGet | entproto.MethodList | entproto.MethodBatchCreate
                ),
        ),
    }
}
```

其中，`entproto.Message()`标识着将为该表生成proto的`message`，`entproto.Service`标志着为该表生成gRPC的`service`，而`entproto.Methods`则可以控制生成的`service`中的方法。


然后，还需要给每一个字段添加`entproto.Field`：

```go
// Fields of the User.
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

修改完代码，需要先生成ent代码：

```bash
go run -mod=mod entgo.io/ent/cmd/ent generate ./schema
```

现在就可以生成proto文件了：

```bash
go run -mod=mod entgo.io/contrib/entproto/cmd/entproto -path ./schema
```

我们可以把这两个命令写入到`ent/generate.go`:

```go
package ent

//go:generate go run -mod=mod entgo.io/ent/cmd/ent generate ./schema
//go:generate go run -mod=mod entgo.io/contrib/entproto/cmd/entproto -path ./schema
```

这时候就可以执行下面的命令来执行生成：

```go
go generate ./...
```

生成的代码为：

```
ent/proto
└── entpb
    ├── entpb.proto
    └── generate.go
```

需要注意的是`ent/proto/entpb/generate.go`中的生成命令需要做一定的修改：

```go
package entpb

//go:generate protoc --go_out=.. --go-grpc_out=.. --go_opt=paths=source_relative --go-grpc_opt=paths=source_relative --entgrpc_out=.. --entgrpc_opt=paths=source_relative,schema_path=..\..\schema entpb.proto
```

利用`ent/proto/entpb/generate.go`，我们可以从proto生成go的代码。

在生成之前，我们还需要安装protoc的3个插件：

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install entgo.io/contrib/entproto/cmd/protoc-gen-entgrpc@master
```

当我们再次执行`go generate ./...`之后，从后到前的代码就全部生成完了。

# 参考资料

- [Generating Protobufs with entproto](https://entgo.io/docs/grpc-generating-proto/)
- [Generating a gRPC Service](https://entgo.io/docs/grpc-generating-a-service/)
- [Generating Ent Schemas from Existing SQL Databases](https://entgo.io/blog/2021/10/11/generating-ent-schemas-from-existing-sql-databases/)
