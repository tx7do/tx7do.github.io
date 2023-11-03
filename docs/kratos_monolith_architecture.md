# Golang微服务框架居然可以开发单体应用？—— Kratos单体架构实践

我向身边的人推广微服务架构，但是经常会得到否定的态度，譬如：

1. 我没有那么多在线人数，那么大的项目规模，我不需要微服务；
2. 我用GIN就可以一把撸出来了，用什么微服务框架？
3. 微服务框架太复杂了，学不来。  
……

总结下来，无非就是：

1. 微服务知识面太广，上手太难，学习曲线太陡峭。
2. 中小型项目，用不到微服务框架。

的确，微服务所需要的知识是挺多的：服务治理（服务注册和发现）、负载均衡、服务熔断、服务降级、服务限流、服务容错、服务网关、分布式配置、链路追踪、服务性能监控、RPC服务调用……

这么多知识点，上手的确是不容易，对于很多中小型企业来说，他们的项目规模小，大多的项目都是CURD项目，这种项目，开发者只需要知道怎么写HTTP路由，怎么写ORM，就行了，就可以上手做事情了。甚至于大部分代码都可以通过代码生成器来生成。要找到会这么多的人才，一个人员难以招聘，一个公司的资本也有限，需要控制成本，请不起。

那么，现在的情况看起来就很明显了：中小型企业，中小型项目，看起来确实是不需要微服务。

但，微服务框架也是用不到，不需要吗？

答案是否定的。

在实际的项目开发中，我有使用微服务框架Kratos开发过好几个单体架构的应用，并且上线运营。在最小的一个项目里面，我也就是用到了：REST服务，ORM访问数据库。涉及的知识点并不多，因此开发起来，也并没有复杂到哪里去。

那么，有人肯定会问我：那你用微服务框架的意义在哪里？

我的考量如下：

1. 小项目不是我们的全部，我们也有中大型的项目，公司能够统一用一套技术栈，总是要好过于用多个技术栈。
2. Kratos工程化做得比较好，比较好规范公司的开发。
3. Kratos基于Protobuf定义协议，gRPC进行服务间通讯，在公司的强异构开发场景下，具有很强的实用价值。
4. Kratos基于插件机制开发，极其容易对其进行扩展（看我的[kratos-transport](https://github.com/tx7do/kratos-transport)，我甚至插入了Gin、FastHttp、Hertz等Web框架）。

综上，是我的理由。在做技术选型的时候，我是横向对比了市面上几乎所有的框架，最终选择了Kratos。

还有一点就是，微服务的开发过程，并不是一步到位的——微服务的开发是渐进的，正所谓：一生二，二生三，三生万物——从单体应用开始逐步的拆分服务也并不是一件很稀奇的事情。

对于那些想学习使用微服务框架的同学，一个微服务框架开发的单体项目，它本质上是一个最小化的项目，故而，它也是极为适合拿来学习之用的项目。

## Demo代码仓库

代码在前，适合那些不喜欢看啰嗦的同学。

- <https://github.com/tx7do/kratos-monolithic-demo>
- <https://gitee.com/tx7do/kratos-monolithic-demo>

## 项目结构

本项目包含了前端和后端的代码，前端是一个Vue3+TypeScript的Admin。但，前端不是本文的着重点，本文着重讲解后端。

前端项目在`frontend`文件夹中，后端项目在`backend`文件夹中，

后端项目结构：

```text
├─api  # proto协议存放的路径
│  ├─admin # Admin服务，定义了REST的接口。
│  │  └─service
│  │      └─v1
│  ├─file # 文件服务，定义了文件上下传等。
│  │  └─service
│  │      └─v1
│  ├─system # 系统服务，定义了比如目录、路由等。。。
│  │  └─service
│  │      └─v1
│  └─user # 用户服务，定义了用户、组织架构、职位等。
│      └─service
│          └─v1
├─app # 应用程序所在的路径
│  └─admin
│      └─service
│          ├─cmd
│          │  └─server # 应用程序的入口
│          │      └─assets
│          ├─configs # 应用的配置文件
│          └─internal
│              ├─data # 应用的数据层，数据库操作的逻辑代码
│              │  └─ent # 使用的Facebook的ORM，entgo。
│              │      └─schema # 数据库表结构定义
│              ├─server # 应用的传输层，应用提供的输入输出点（创建REST、gRPC、Kafka等……）
│              └─service # 应用的服务层，REST、gRPC等的处理器代码。
├─gen # proto协议生成的go代码存放路径
│  └─api
│      └─go
│          ├─admin
│          │  └─service
│          │      └─v1
│          ├─file
│          │  └─service
│          │      └─v1
│          ├─system
│          │  └─service
│          │      └─v1
│          └─user
│              └─service
│                  └─v1
├─pkg # 公共代码存放路径
│  ├─errors
│  │  └─auth
│  ├─middleware
│  │  └─auth
│  ├─service
│  └─task
└─sql # 一些SQL查询的存放路径
```

## 前置知识

- [Wire](https://github.com/google/wire)
- [Protocol Buffers](https://protobuf.dev/)
- [gRPC](https://grpc.io/)
- [gRPC-Gateway](https://grpc-ecosystem.github.io/grpc-gateway/)
- [Entgo](https://entgo.io/)
- [Buf](https://buf.build/)
- [MakeFile](https://makefiletutorial.com/)
- [OpenAPI](https://swagger.io/specification/)

## 安装环境

### 安装Make

Linux、Mac下面基本上都是预装，就算不是预装，要安装也很简单，不再赘述。主要是Windows下面比较麻烦，我有一篇文章说这个：[怎么样在Windows下使用Make编译Golang程序](https://juejin.cn/post/7167688433333174302)。

### protoc安装

#### macOS安装

```bash
brew install protobuf
```

#### Ubuntu安装

```bash
sudo apt update; sudo apt upgrade
sudo apt install libprotobuf-dev protobuf-compiler
```

#### Windows安装

在Windows下可以使用包管理器[Choco](https://chocolatey.org/)和[Scoop](https://scoop.sh/)来安装。

##### Choco

```bash
choco install protoc
```

##### Scoop

```bash
scoop bucket add extras
scoop install protobuf
```

### golang install安装的工具

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2@latest
go install github.com/go-kratos/kratos/cmd/protoc-gen-go-errors/v2@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
go install github.com/envoyproxy/protoc-gen-validate@latest
go install github.com/bufbuild/buf/cmd/buf@latest
go install github.com/go-kratos/kratos/cmd/kratos/v2@latest
```

或者在后端项目根目录`backend`下执行：

```bash
make init
```

### 安装IDE插件

在IDE里面（VSC和Goland），远程的proto源码库会被拉取到本地的缓存文件夹里面，而这IDE并不知道，故而无法解析到依赖到的proto文件，但是，Buf官方提供了插件，可以帮助IDE读取并解析proto文件，并且自带Lint。

- VSC的Buf插件: <https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf>
- Goland的Buf插件：<https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers>

## Wire的使用

Wire是谷歌开源的一个依赖注入的框架。

依赖注入的作用是：

- 创建对象
- 知道哪些类需要那些对象
- 并提供所有这些对象

首先从注入源看起，在`server`、`service`、`data`这几个包下面都存在一个：

```go
var ProviderSet = wire.NewSet(...)
```

`NewSet`方法里面都是对象的创建方法。

wire的代码文件有两个：`wire.go`和`wire_gen.go`，存放在main.go同级文件夹下。

### wire.go

```go
//go:build wireinject
// +build wireinject

// The build tag makes sure the stub is not built in the final build.

package main

import (
	"github.com/google/wire"

	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/registry"

	conf "github.com/tx7do/kratos-bootstrap/gen/api/go/conf/v1"

	"kratos-monolithic-demo/app/admin/service/internal/data"
	"kratos-monolithic-demo/app/admin/service/internal/server"
	"kratos-monolithic-demo/app/admin/service/internal/service"
)

// initApp init kratos application.
func initApp(log.Logger, registry.Registrar, *conf.Bootstrap) (*kratos.App, func(), error) {
	panic(wire.Build(server.ProviderSet, service.ProviderSet, data.ProviderSet, newApp))
}
```

这个文件不参与编译，是提供给代码生成器用的模板，它把`ProviderSet`中的依赖项引入进来，由代码生成器进行组装。

### wire_gen.go

```go
// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package main

import (
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/registry"
	"github.com/tx7do/kratos-bootstrap/gen/api/go/conf/v1"
	"kratos-monolithic-demo/app/admin/service/internal/data"
	"kratos-monolithic-demo/app/admin/service/internal/server"
	"kratos-monolithic-demo/app/admin/service/internal/service"
)

// Injectors from wire.go:

// initApp init kratos application.
func initApp(logger log.Logger, registrar registry.Registrar, bootstrap *v1.Bootstrap) (*kratos.App, func(), error) {
	authenticator := data.NewAuthenticator(bootstrap)
	engine := data.NewAuthorizer()
	entClient := data.NewEntClient(bootstrap, logger)
	client := data.NewRedisClient(bootstrap, logger)
	dataData, cleanup, err := data.NewData(entClient, client, authenticator, engine, logger)
	if err != nil {
		return nil, nil, err
	}
	userRepo := data.NewUserRepo(dataData, logger)
	userTokenRepo := data.NewUserTokenRepo(dataData, authenticator, logger)
	authenticationService := service.NewAuthenticationService(logger, userRepo, userTokenRepo)
	userService := service.NewUserService(logger, userRepo)
	dictRepo := data.NewDictRepo(dataData, logger)
	dictService := service.NewDictService(logger, dictRepo)
	dictDetailRepo := data.NewDictDetailRepo(dataData, logger)
	dictDetailService := service.NewDictDetailService(logger, dictDetailRepo)
	menuRepo := data.NewMenuRepo(dataData, logger)
	menuService := service.NewMenuService(menuRepo, logger)
	routerService := service.NewRouterService(logger, menuRepo)
	organizationRepo := data.NewOrganizationRepo(dataData, logger)
	organizationService := service.NewOrganizationService(organizationRepo, logger)
	roleRepo := data.NewRoleRepo(dataData, logger)
	roleService := service.NewRoleService(roleRepo, logger)
	positionRepo := data.NewPositionRepo(dataData, logger)
	positionService := service.NewPositionService(positionRepo, logger)
	httpServer := server.NewRESTServer(bootstrap, logger, authenticator, engine, authenticationService, userService, dictService, dictDetailService, menuService, routerService, organizationService, roleService, positionService)
	app := newApp(logger, registrar, httpServer)
	return app, func() {
		cleanup()
	}, nil
}
```

这个文件是由Wire的代码生成器生成而成。从代码可见，复杂的依赖调用关系被Wire轻松的理顺了。

### 代码生成

wire的代码生成有两种途径，一个是安装wire可执行程序，一个是使用`go run`动态编译执行。推荐动态编译执行，为什么呢？这样可以保证代码生成器的版本和项目中wire的版本是一致的，如果版本不一致，可能会带来一些问题。

```bash
go run -mod=mod github.com/google/wire/cmd/wire ./cmd/server
```

我已经把这条命令写入了`app.mk`，可以在`app/admin/service`路径下执行：

```bash
make wire
```

## Buf的使用

[buf.build](https://docs.buf.build/)是专门用于构建protobuf API的工具。

Buf本质上是一个调用protoc的工具，它可以把调用protoc的各种参数配置化，并且支持远程proto，远程插件。所以，Buf能够把proto的编译工程化。

它总共有3组配置文件：`buf.work.yaml`、`buf.gen.yaml`、`buf.yaml`。

另外，还有一个`buf.lock`文件，但是它不需要进行人工配置，它是由`buf mod update`命令所生成。这跟前端的npm、yarn等的lock文件差不多，golang的`go.sum`也差不多。

它的配置文件不多，也不复杂，维护起来非常方便，支持远程proto插件，支持远程第三方proto。对构建系统Bazel支持很好，对CI/CD系统也支持得很好。它还有很多优秀的特性。

### buf.work.yaml

它一般放在项目的根目录下面，它代表的是一个工作区，通常一个项目也就一个该配置文件。

该配置文件最重要的就是`directories`配置项，列出了要包含在工作区中的模块的目录。目录路径必须相对于`buf.work.yaml`，像`../external`就是一个无效的配置。

```yml
version: v1

directories:
  - api
```

### buf.gen.yaml

它一般放在`buf.work.yaml`的同级目录下面，它主要是定义一些protoc生成的规则和插件配置。

```yml
# 配置protoc生成规则
version: v1

managed:
  enabled: true
  optimize_for: SPEED

  go_package_prefix:
    default: kratos-monolithic-demo/gen/api/go
    except:
      - 'buf.build/googleapis/googleapis'
      - 'buf.build/envoyproxy/protoc-gen-validate'
      - 'buf.build/kratos/apis'
      - 'buf.build/gnostic/gnostic'
      - 'buf.build/gogo/protobuf'
      - 'buf.build/tx7do/pagination'

plugins:
  # 使用go插件生成go代码
  #- plugin: buf.build/protocolbuffers/go
  - name: go
    out: gen/api/go
    opt: paths=source_relative # 使用相对路径

  # 使用go-grpc插件生成gRPC服务代码
  #- plugin: buf.build/grpc/go
  - name: go-grpc
    out: gen/api/go
    opt:
      - paths=source_relative # 使用相对路径

  # generate rest service code
  - name: go-http
    out: gen/api/go
    opt:
      - paths=source_relative # 使用相对路径

  # generate kratos errors code
  - name: go-errors
    out: gen/api/go
    opt:
      - paths=source_relative # 使用相对路径

  # generate message validator code
  #- plugin: buf.build/bufbuild/validate-go
  - name: validate
    out: gen/api/go
    opt:
      - paths=source_relative # 使用相对路径
      - lang=go
```

### buf.yaml

它放置的路径，你可以视之为`protoc`的`--proto-path`参数指向的路径，也就是proto文件里面`import`的相对路径。

需要注意的是，`buf.work.yaml`的同级目录必须要放一个该配置文件。

该配置文件的内容通常来说都是下面这个配置，不需要做任何修改，需要修改的情况不多。

```yml
version: v1

deps:
  - 'buf.build/googleapis/googleapis'
  - 'buf.build/envoyproxy/protoc-gen-validate'
  - 'buf.build/kratos/apis'
  - 'buf.build/gnostic/gnostic'
  - 'buf.build/gogo/protobuf'
  - 'buf.build/tx7do/pagination'

breaking:
  use:
    - FILE

lint:
  use:
    - DEFAULT
```

### buf.openapi.gen.yaml

细心的你肯定早就发现了在`api/admin/service/v1`下面有一个`buf.openapi.gen.yaml`的配置文件，这是什么配置文件呢？我现在把该配置文件放出来：

```yml
# 配置protoc生成规则
version: v1

managed:
  enabled: true
  optimize_for: SPEED

  go_package_prefix:
    default: kratos-monolithic-demo/gen/api/go
    except:
      - 'buf.build/googleapis/googleapis'
      - 'buf.build/envoyproxy/protoc-gen-validate'
      - 'buf.build/kratos/apis'
      - 'buf.build/gnostic/gnostic'
      - 'buf.build/gogo/protobuf'
      - 'buf.build/tx7do/pagination'

plugins:
  # generate openapi v2 json doc
#  - name: openapiv2
#    out: ./app/admin/service/cmd/server/assets
#    opt:
#      - json_names_for_fields=true
#      - logtostderr=true

  # generate openapi v3 yaml doc
  - name: openapi
    out: ./app/admin/service/cmd/server/assets
    opt:
      - naming=json # 命名约定。使用"proto"则直接从proto文件传递名称。默认为：json
      - depth=2 # 循环消息的递归深度，默认为：2
      - default_response=false # 添加默认响应消息。如果为“true”，则自动为使用google.rpc.Status消息的操作添加默认响应。如果您使用envoy或grpc-gateway进行转码，则非常有用，因为它们使用此类型作为默认错误响应。默认为：true。
      - enum_type=string # 枚举类型的序列化的类型。使用"string"则进行基于字符串的序列化。默认为：integer。
      - output_mode=merged # 输出文件生成模式。默认情况下，只有一个openapi.yaml文件会生成在输出文件夹。使用“source_relative”则会为每一个'[inputfile].proto'文件单独生成一个“[inputfile].openapi.yaml”文件。默认为：merged。
      - fq_schema_naming=false # Schema的命名是否加上包名，为true，则会加上包名，例如：system.service.v1.ListDictDetailResponse，否则为：ListDictDetailResponse。默认为：false。
```

它是为了生成[OpenAPI v3文档](https://openapi.apifox.cn/)。我之前尝试了放在根目录下的`buf.gen.yaml`，但是产生了一个问题，因为我可能一个项目里面有多个BFF服务程序，我不可能一股脑全部输出到一个openapi.yaml里面。虽然，它也可以每一个proto各自生成一个`[inputfile].openapi.yaml`，但是，这样显得太乱了，而且，我没有办法用。所以，没辙，只能单独对待了——每个BFF服务独立生成一个文档。

那么，怎么使用这个配置文件呢？还是使用`buf generate`命令，该命令还是需要在项目根目录下执行，但是得带`--template`参数去引入`buf.openapi.gen.yaml`这个配置文件：

```bash
buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml
```

也可以在`backend`根目录下使用Make命令：

```bash
make openapi
```

最终，在`./app/admin/service/cmd/server/assets`这个目录下面，将会生成出来一个文件名为`openapi.yaml`的文件。

### 协议代码生成

我们可以使用以下命令来进行代码生成：

```bash
buf generate
```

或者

```bash
make api
```

## Ent的使用

Ent是一个优秀的ORM框架。基于模板进行代码生成，相比较利用反射等方式，在性能上的损耗更少。并且，模板的使用使得扩展系统变得简单容易。

它不仅能够很对传统的关系数据库（MySQL、PostgreSQL、SQLite）方便的进行查询，并且可以容易的进行图遍历——常用的譬如像是：菜单树、组织树……这种数据查询。

### Schema

Schema相当于数据库的表。

《道德经》说：
> 道生一，一生二，二生三，三生万物。

Schema，就是一切的起始点。

只有定义了Schema，CLI才能够生成数据库表的结构和操作的相关代码，有了相关代码，才能够操作数据库表的数据。

后面想要生成gRPC和GraphQL的接口定义，也还是需要Schema。

#### 创建一个Schema

创建Schema有两个方法可以做到：

##### 使用 `entc init` 创建

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

##### SQL转换Schema在线工具

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

### 生成Ent代码

在`internal/data/ent`目录下执行：

```bash
go run -mod=mod entgo.io/ent/cmd/ent generate \
        --feature privacy \
        --feature sql/modifier \
        --feature entql \
        --feature sql/upsert \
        ./internal/data/ent/schema
```

或者：

```bash
ent generate \
        --feature privacy \
        --feature sql/modifier \
        --feature entql \
        --feature sql/upsert \
        ./internal/data/ent/schema
```

或者直接在`app/admin/service`路径下用Make命令：

```bash
make ent
```

## OpenAPI的使用

Kratos官方本来是有一个[swagger-api](https://github.com/go-kratos/swagger-api)的项目的（现在已经被归档了），集成的是OpenAPI v2的Swagger UI。这个项目呢，不好使，我在应用中，经常会读不出来OpenAPI的文档。还有就是OpenAPI v2不如v3功能强大。

因为没有支持，而我又需要跟前端进行沟通，所以我只好生成出OpenAPI文档之后，自行导入到ApiFox里面去使用，ApiFox呢，挺好的，支持文件和在线两种方式导入，文档管理，接口测试的功能也都很强大。但是总是要去费神导出文档，这很让人抗拒——在开发的初期，接口变动是很高频的行为——难道就不能够全自动吗？程序只要一发布，接口就自动的跟随程序一起发布出去了。

对，说的就是集成Swagger UI。

为了做到这件事，我需要做这么几件事情：

1. 把Buf生成OpenAPI文档，编译运行程序写进MakeFile里面；
2. 利用golang的`Embedding Files`特性，把`openapi.yaml`嵌入到服务程序里面；
3. 集成Swagger UI到项目，并且读取内嵌的`openapi.yaml`文档。

那么，我们首先开始编写Makefile：

```makefile
# generate protobuf api go code
api:
	buf generate

# generate OpenAPI v3 docs.
openapi:
	buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml
	buf generate --path api/front/service/v1 --template api/front/service/v1/buf.openapi.gen.yaml

# run application
run: api openapi
	@go run ./cmd/server -conf ./configs
```

这样我们只需要运行`make openapi`就执行OpenAPI的生成了，调试运行的时候，输入`make run`命令就可以生成OpenAPI并运行程序。

Makefile写好了，现在我们来到`./app/admin/service/cmd/server/assets`这个目录下面，我们在这个目录下面创建一个名为`assets.go`的代码文件：

```go
package assets

import _ "embed"

//go:embed openapi.yaml
var OpenApiData []byte
```

就这样，我们就把openapi.yaml内嵌进程序了。

最后，我们就需要来集成Swagger UI进来了。我为此封装了一个项目，要使用它，我们需要安装依赖库：

```bash
go get -u github.com/tx7do/kratos-swagger-ui
```

在创建REST服务器的地方调用程序包里面的方法：

```go
package server

import (
	rest "github.com/go-kratos/kratos/v2/transport/http"
	swaggerUI "github.com/tx7do/kratos-swagger-ui"

    "kratos-monolithic-demo/app/admin/service/cmd/server/assets"
)

func NewRESTServer() *rest.Server {
	srv := CreateRestServer()

    swaggerUI.RegisterSwaggerUIServerWithOption(
        srv,
        swaggerUI.WithTitle("Admin Service"),
        swaggerUI.WithMemoryData(assets.OpenApiData, "yaml"),
    )
}
```

自此我们就大功告成了！

假如API服务的端口是8080，那么我们可以访问链接来访问Swagger UI：

<http://localhost:8080/docs/>

同时，openapi.yaml文件也可以在线访问到：

<http://localhost:8080/docs/openapi.yaml>

## 参考资料

- [Microservices vs. monolithic architecture](https://www.atlassian.com/microservices/microservices-architecture/microservices-vs-monolith)
- [巨石应用如何进行微服务改造？](https://cloud.tencent.com/developer/news/284750)
- [OpenAPI 打通前後端任督二脈](https://editor.leonh.space/2022/openapi/)
- [什么是 Swagger](https://apifox.com/apiskills/what-is-swagger/)
- [OpenAPI 规范（中文版）](https://openapi.apifox.cn/)
- [Swagger-UI 介绍及基本使用指南](https://developer.aliyun.com/article/1157293)
- [用 Google 團隊推出的 Wire 工具解決 Dependency Injection](https://blog.wu-boy.com/2022/09/dependency-injection-in-go/)
- [Golang 上的依賴注入框架 google/wire](https://bingdoal.github.io/backend/2022/05/golang-dependency-injection-google-wire/)
- [依赖注入是什么？如何使用它？](https://www.freecodecamp.org/chinese/news/a-quick-intro-to-dependency-injection-what-it-is-and-when-to-use-it/)
