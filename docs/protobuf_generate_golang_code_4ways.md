# Protobuf生成golang代码的4种方法

要将Protobuf协议生成目标语言的代码，必须要通过生成器[protoc](https://grpc.io/docs/protoc-installation/)来实现，protoc是通过插件机制来实现各种语言的生成功能。

## 插件生成文件一览表

|   插件名  |   生成文件名  |
|-----|-----|
|  [protoc-gen-go](google.golang.org/protobuf/cmd/protoc-gen-go)   |   XXXXX.pb.go  |
|  [protoc-gen-go-grpc](google.golang.org/grpc/cmd/protoc-gen-go-grpc)   |  XXXXXX_grpc.pb.go  |
|   [protoc-gen-go-http](github.com/go-kratos/kratos/cmd/protoc-gen-go-http)  |  XXXXXX_http.pb.go  |
|   [protoc-gen-go-errors](github.com/go-kratos/kratos/cmd/protoc-gen-go-errors)  |  XXXXXX_errors.pb.go   |
|   [protoc-gen-validate](github.com/bufbuild/protoc-gen-validate)  |  XXXXXX.pb.validate.go   |
|   [protoc-gen-openapiv2](github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2)  |   XXXXXX.swagger.json  |
|   [protoc-gen-openapi](github.com/google/gnostic/cmd/protoc-gen-openapi)  |   openapi.yaml  |

## 4种方法

1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）；
2. Makefile；
3. go:generate注解；
4. buf.build。

### 1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）

#### BAT批处理脚本

```shell
:: generate go struct code
protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto
    
:: generate grpc service code
protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto
    
:: generate rest service code
protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto
    
:: generate kratos errors code
protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto
    
:: generate message validator code
protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto
    
:: generate openapi v2 json doc
protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
    
:: generate openapi v3 yaml doc
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto
```

#### Shell脚本

```shell
#!/bin/bash

# generate go struct code
protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto
    
# generate grpc service code
protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto
    
# generate rest service code
protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto
    
# generate kratos errors code
protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto
    
# generate message validator code
protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto
    
# generate openapi v2 json doc
protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
    
# generate openapi v3 yaml doc
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto
```

这个方法除了能用，没有别的好处了。它需要在每一组proto文件的同级目录下都冗余放一对脚本，如果要执行所有的生成脚本，另外还需要写一个脚本来调用生成脚本，维护起来很痛苦。

### 2. Makefile

[Kratos官方layout](https://github.com/go-kratos/kratos-layout)就是使用的Makefile的方法来生成代码的。

它在根目录下的Makefile文件里：

```makefile
.PHONY: api
# generate api proto
api:
	protoc --proto_path=./api \
	       --proto_path=./third_party \
 	       --go_out=paths=source_relative:./api \
 	       --go-http_out=paths=source_relative:./api \
 	       --go-grpc_out=paths=source_relative:./api \
	       --openapi_out=fq_schema_naming=true,default_response=false:. \
	       $(API_PROTO_FILES)

.PHONY: conf
# generate config define code
conf:
	protoc --proto_path=. \
	       --proto_path=../../../third_party \
	       --go_out=paths=source_relative:. \
	       ./internal/conf/*.proto
```

根目录下的Makefile由`app\{服务名}\service\Makefile`引用，调用者在服务目录`app\{服务名}\service\`下调用`make api`执行代码生成。

这个方法很有局限性，掣手掣脚，你只能够依照严格的固定的项目结构来，只要有一些变动就完犊子了。

MonoRepo的项目结构下，因为会有多个Makefile入口，所以没办法一键执行全部的Makefile，必须借助第三方工具，比如Shell脚本。偷懒如我，总觉得很麻烦。

### 3. go:generate注解

go1.4版本之后，可以通过`go generate`命令执行一些`go:generate`注解下的预处理命令，可以拿来生成API代码之用。因为在非Windows系统下，命令如果带通配符，会执行出错，需要加`sh -c`才行，而Windows系统不存在这样的问题，可以直接执行，所以需要使用`go:build`注解来区分操作系统，`go generate`命令会根据操作系统执行相对应的go代码文件。所以，我写了两个go文件：

#### generate_windows.go

```go
//go:build windows

// generate go struct code
//go:generate protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto

// generate grpc service code
//go:generate protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto

// generate rest service code
//go:generate protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto

// generate kratos errors code
//go:generate protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto

// generate message validator code
//go:generate protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto

// generate openapi v2 json doc
//go:generate protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto

// generate openapi v3 yaml doc
//go:generate protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto

package api
```

#### generate_xnix.go

```go
//go:build !windows
// +build !windows

// generate go struct code
//go:generate sh -c "protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto"

// generate grpc service code
//go:generate sh -c "protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto"

// generate rest service code
//go:generate sh -c "protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto"

// generate kratos errors code
//go:generate sh -c "protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto"

// generate message validator code
//go:generate sh -c "protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto"

// generate openapi v2 json doc
//go:generate sh -c "protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto"

// generate openapi v3 yaml doc
//go:generate sh -c "protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto"

package api
```

它可以很好的完成生成代码的任务。主流的IDE（Goland、VSC）都可以很好的支持编辑界面执行注解。

要自动化吧，也能实现，只要在项目根目录执行`go generate ./...`就能够执行整个项目的`go:generate`注解。

但是，有一个很大的问题，它需要在每一组proto文件的同级目录下冗余一套go代码，维护起来就比较糟心了。

### 4. buf.build

[buf.build](https://docs.buf.build/)是专门用于构建protobuf API的工具。

它总共有3组配置文件：`buf.work.yaml`、`buf.gen.yaml`、`buf.yaml`。

另外，还有一个`buf.lock`文件，但是它不需要进行人工配置，它是由`buf mod update`命令所生成。这跟前端的npm、yarn等的lock文件差不多，golang的`go.sum`也差不多。

它的配置文件不多，也不复杂，维护起来非常方便，支持远程proto插件，支持远程第三方proto。对构建系统Bazel支持很好，对CI/CD系统也支持得很好。它还有很多优秀的特性。

buf.build非常棒，用它，很方便。值得使用，值得推荐。

#### buf.work.yaml

它一般放在项目的根目录下面，它代表的是一个工作区，通常一个项目也就一个该配置文件。

该配置文件最重要的就是`directories`配置项，列出了要包含在工作区中的模块的目录。目录路径必须相对于`buf.work.yaml`，像`../external`就是一个无效的配置。

```yml
version: v1

directories:
  - api
  - third_party
```

#### buf.gen.yaml

它一般放在`buf.work.yaml`的同级目录下面，它主要是定义一些protoc生成的规则和插件配置。

```yml
# 配置protoc生成规则
version: v1

managed:
  enabled: false

plugins:
  # generate go struct code
  - name: go
    out: gen/api/go
    opt: paths=source_relative

  # generate grpc service code
  - name: go-grpc
    out: gen/api/go
    opt:
      - paths=source_relative

  # generate rest service code
  - name: go-http
    out: gen/api/go
    opt:
      - paths=source_relative

  # generate kratos errors code
  - name: go-errors
    out: gen/api/go
    opt:
      - paths=source_relative

  # generate message validator code
  - name: validate
    out: gen/api/go
    opt:
      - paths=source_relative
      - lang=go
```

#### buf.yaml

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

breaking:
  use:
    - FILE

lint:
  use:
    - DEFAULT
```

#### buf的IDE插件安装

在IDE里面（VSC和Goland），远程的proto源码库会被拉取到本地的缓存文件夹里面，而这IDE并不知道，故而无法解析到依赖到的proto文件，但是，Buf官方提供了插件，可以帮助IDE读取并解析proto文件，并且自带Lint。

- VSC的Buf插件: <https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf>
- Goland的BUf插件：<https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers>

#### 使用Buf生成代码

我有开源了一个Kratos的CMS项目[kratos-blog](https://github.com/tx7do/go-wind-cms)，它是一个MonoRepo结构的项目，我们以它的项目结构来做讲解。

下面的目录树，是我化简后的目录树。

```bash
.
├── buf.work.yaml
├── buf.gen.yaml
├── buf.yaml
├── buf.lock
├── api
│   ├── admin
│   │   └── service
│   │       └── v1
│   │           └── admin_errors.proto
│   │           └── buf.openapi.gen.yaml
│   │           └── i_user.proto
│   └── buf.yaml
```

大家可以看到，总共所需求的配置文件并不多。

`buf.build`使用`buf generate`命令进行构建，调用该命令必须在`buf.work.yaml`的同级目录下。执行了`buf generate`命令之后，将会在根目录下产生一个`gen/api/go`的文件夹，生成的代码都将被放在了这个目录下。

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

没错，它是为了生成[OpenAPI v3文档](https://openapi.apifox.cn/)。我之前尝试了放在根目录下的`buf.gen.yaml`，但是产生了错误，因为OpenAPI v3文档，它全局只能产生一个`openapi.yaml`文件。所以，没辙，只能单独对待了。

那么，怎么使用这个配置文件呢？还是使用`buf generate`命令，该命令还是需要在项目根目录下执行，但是得带`--template`参数去引入`buf.openapi.gen.yaml`这个配置文件：

```bash
buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml
```

最终，在`./app/admin/service/cmd/server/assets`这个目录下面，将会生成出来一个文件名为`openapi.yaml`的文件。
