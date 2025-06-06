# 开箱即用的GO后台管理系统 Kratos Admin - 代码生成工具集

我们为[go-kratos-admin](https://github.com/tx7do/go-kratos-admin)这个项目打造了一个代码生成工具集。

- cfgexp 用于将服务本地配置导入到远程配置系统，支持：Etd、Consul、Nacos……
- sql2orm 用于把数据库的表结构导入，并且生成为ORM代码，支持：ENT、GORM……
- sql2proto 用于把数据的表结构导入，并且生成gRPC、REST的Protobuf代码。
- sql2kratos 用于把数据的表结构导入，并且生成一整套的Kratos服务代码。

项目代码地址：

- <https://github.com/tx7do/kratos-cli>
- <https://gitee.com/tx7do/kratos-cli>

## cfgexp

该工具将本地配置文件导出到Consul或Etcd等远程配置系统，从而更轻松地管理分布式系统中的配置。

现在已经支持的远程配置系统有：

- Etcd
- Consul
- Nacos

### 如何安装

```bash
go install github.com/tx7do/kratos-cli/config-exporter/cmd/cfgexp@latest
```

### 如何使用

```bash
Config Exporter is a tool to export configuration from remote services like Consul or Etcd to local files.

Usage:
  cfgexp [flags]

Flags:
  -a, --addr string    remote config service address (default "127.0.0.1:8500")
  -e, --env string     environment name, like dev, test, prod, etc. (default "dev")
  -g, --group string   group name, this name is used to key prefix in remote config service (default "DEFAULT_GROUP")
  -h, --help           help for cfgexp
  -n, --ns string      namespace ID, used for Nacos (default "public")
  -p, --proj string    project name, this name is used to key prefix in remote config service
  -r, --root string    project root dir (default "./")
  -t, --type string    remote config service name (consul, etcd, etc.) (default "consul")
```

### 示例

Etcd

```bash
cfgexp \
    -t "etcd" \
    -a "localhost:2379" \
    -p "kratos_admin"
```

consul

```bash
cfgexp \
    -t "consul" \
    -a "localhost:8500" \
    -p "kratos_admin"
```

Nacos

```bash
cfgexp \
    -t "nacos" \
    -a "localhost:8848" \
    -p "kratos_admin" \
    -n "public" \
    -e "dev" \
    -g "DEFAULT_GROUP"
```

## sql2orm

该工具导入 SQL 数据库的表结构，并生成用于 Kratos 微服务的 ORM代码。

支持的ORM：

- ent
- GORM

### 如何安装

```bash
go install github.com/tx7do/kratos-cli/sql-orm/cmd/sql2orm@latest
```

### 如何使用

```bash
sql2orm is a tool to generate ORM code from SQL database schemas.

Usage:
  sql2orm [flags]

Flags:
  -d, --dao-path string          output path for DAO code (for gorm) (default "./daos/")
  -v, --drv string               Database driver name to use (mysql, postgres, sqlite...) (default "mysql")
  -n, --dsn string               Data source name (connection information), for example:
                                 "mysql://user:pass@tcp(localhost:3306)/dbname"
                                 "postgres://user:pass@host:port/dbname"
  -e, --exclude-tables strings   comma-separated list of tables to exclude
  -h, --help                     help for sql2orm
  -o, --orm string               ORM type to use (ent, gorm) (default "ent")
  -s, --schema-path string       output path for schema (default "./ent/schema/")
  -t, --tables strings           comma-separated list of tables to inspect (all if empty)
```

### 示例

Ent

```bash
sql2orm \
  --orm "ent" \
  --dsn "postgres://postgres:pass@localhost:5432/test?sslmode=disable" \
  --schema-path "./ent/schema"
```

GORM

```bash
sql2orm \
  --orm "gorm" \
  --drv "postgres" \
  --dsn "postgres://postgres:pass@localhost:5432/test?sslmode=disable" \
  --schema-path "./daos/models" \
  --dao-path "./daos/"
```

## sql2proto

该工具导入 SQL 数据库的表结构，并生成用于 Kratos 微服务的 Protobuf 代码。

### 如何安装

```bash
go install github.com/tx7do/kratos-cli/sql-proto/cmd/sql2proto@latest
```

### 如何使用

```bash
sql2proto is a tool to import SQL database schema and generate Protobuf code.

Usage:
  sql2proto [flags]

Flags:
  -n, --dsn string          Data source name (connection information), for example:
                            "mysql://user:pass@tcp(localhost:3306)/dbname"
                            "postgres://user:pass@host:port/dbname"
  -e, --excludes strings    comma-separated list of tables to exclude
  -h, --help                help for sql2proto
  -i, --includes strings    comma-separated list of tables to inspect (all if empty)
  -m, --module string       module name for the generated code, e.g., 'admin' (default "admin")
  -o, --output string       output path for protobuf schema files (default "./api/protos/")
  -s, --src-module string   Source module name, for REST service generate, e.g., "admin" (default "user")
  -t, --type string         generate RPC service type, "rest" for REST service, "grpc" for gRPC service (default "grpc")
  -v, --version string      Version of the module, e.g., 'v1' (default "v1")
```

### 示例

生成gRPC服务的Proto：

```bash
sql2proto \
  -n "postgres://postgres:pass@localhost:5432/test?sslmode=disable" \
  -o "./api/protos" \
  -t "grpc" \
  -m "user"
```

生成REST服务的Proto：

```bash
sql2proto \
  -n "mysql://root:pass@localhost:3306/test" \
  -o "./api/protos" \
  -t "rest" \
  -m "admin" \
  -s "user"
```

## sql2kratos

该工具导入 SQL 数据库的表结构，并生成 Kratos 微服务代码。

### 如何安装

```bash
go install github.com/tx7do/kratos-cli/sql-kratos/cmd/sql2kratos@latest
```

### 如何使用

```bash
sql2kratos imports the SQL database schemas and generates Kratos microservice code.

Usage:
  sql2kratos [flags]

Flags:
  -n, --dsn string          Data source name (connection information), for example:
                            "mysql://user:pass@tcp(localhost:3306)/dbname"
                            "postgres://user:pass@host:port/dbname"
  -e, --excludes strings    comma-separated list of tables to exclude
  -l, --gen-data            enable generate data package code (default true)
  -k, --gen-main            enable generate main package code (default true)
  -z, --gen-orm             enable generate ORM code (default true)
  -q, --gen-proto           enable generate protobuf schema files (default true)
  -w, --gen-srv             enable generate server package code (default true)
  -a, --gen-svc             enable generate service package code (default true)
  -h, --help                help for sql2kratos
  -i, --includes strings    comma-separated list of tables to inspect (all if empty)
  -m, --module string       Target module name for the generated code, e.g., 'admin' (default "admin")
  -r, --orm string          ORM type to use (ent, gorm) (default "ent")
  -o, --output string       output path for protobuf schema files (default "./api/protos/")
  -p, --project string      Project name for the generated code, e.g., 'kratos-admin' (default "kratos-admin")
  -x, --repo                use repository pattern (default true)
  -g, --servers strings     comma-separated list of servers to generate, e.g., "grpc,rest" (default [grpc])
  -c, --service string      Service name for the generated code, e.g., 'user' (default "user")
  -s, --src-module string   Source module name, for REST service generate, e.g., "admin" (default "user")
  -v, --version string      Version of the module, e.g., 'v1' (default "v1")
```

### 示例

gRPC服务代码：

```bash
sql2kratos \
  -p "kratos-admin" \
  -n "postgres://postgres:pass@localhost:5432/test?sslmode=disable" \
  -r "ent" \
  -o "." \
  -m "user" \
  -c "user" \
  -g "grpc"
```

REST服务代码：

```bash
sql2kratos \
  -p "kratos-admin" \
  -n "postgres://postgres:pass@localhost:5432/test?sslmode=disable" \
  -r "ent" \
  -o "." \
  -s "user" \
  -m "admin" \
  -c "admin" \
  -g "rest" \
  -x=false \
  -z=false \
  -l=false
```

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)
