# 开箱即用的GO后台管理系统 Kratos Admin - 交互式API文档 Swagger UI

在我们的开发当中，有几个问题会比较麻烦：

1. 调试接口
2. 测试接口
3. 提供接口文档

那么，我们需要用什么方法和工具来实施这些工作内容呢？Swagger，或者说 OpenAPI。

我在使用Python的一个框架[FastAPI][3]的时候，发现它把Swagger UI内嵌了后端服务当中，可以直接访问 <http://127.0.0.1:8000/docs>:

![Fast API Swagger UI](https://fastapi.tiangolo.com/img/index/index-01-swagger-ui-simple.png)

于是，我就把它借鉴了过来。

## 什么是 OpenAPI

OpenAPI 是编写 RESTful API 的全球标准。它是一种规范，使得全球开发人员可以标准化 API 的设计，并在从头开始编写 REST API 时遵守所有安全、版本控制、错误处理和其他最佳实践。不仅仅是从头开始，即使现有的 API 也可以进行微调以符合全球标准。

此外，遵守开发产品的通用标准显然有助于什么。

最初，OpenAPI 被称为 Swagger 规范。Swagger 提出了构建 API 的最佳实践，然后这些最佳实践成为了 OpenAPI规范。

像 SwaggerHub 这样的工具可以帮助开发人员在基于浏览器的编辑器中构建 API，符合标准并完全控制设计过程。

使用 Swagger Inspector 等工具，我们还可以生成自己的 API 规范，并将其传递给组织中的其他团队。

需进一步了解，可查看 [OpenAPI 规范（中文版）][2]。

## 什么是 Swagger

OpenAPI 是一个编写 API 文档的规范，然而如果手动去编写 OpenAPI 规范的文档，是非常麻烦的。而 Swagger 就是一个实现了OpenAPI 规范的工具集。

官网：<https://swagger.io/>

Swagger 包含的工具集：

- **Swagger编辑器**： Swagger Editor允许在浏览器中编辑YAML中的OpenAPI规范并实时预览文档。
- **Swagger UI**： Swagger UI是HTML，Javascript和CSS资产的集合，可以从符合OAS标准的API动态生成漂亮的文档。
- **Swagger Codegen**：允许根据OpenAPI规范自动生成API客户端库（SDK生成），服务器存根和文档。
- **Swagger Parser**：用于解析来自Java的OpenAPI定义的独立库
- **Swagger Core**：与Java相关的库，用于创建，使用和使用OpenAPI定义
- **Swagger Inspector（免费）**： API测试工具，可让您验证您的API并从现有API生成OpenAPI定义
- **SwaggerHub（免费和商业）**： API设计和文档，为使用OpenAPI的团队构建。

## 怎么样集成Swagger到Kratos

首先，我们要了解的是：要在项目中集成Swagger，唯一的办法就是通过Swagger UI来集成。

Swagger UI依赖读取的是OpenAPI的json或者yaml格式的API文档，这个文档不是给人来读取的，而是给Swagger UI。同样，它也不是给人来写的，靠的是生成器来生成的。

因此，下面首先我们需要来了解API是如何生成的，怎样生成的。

### API文档怎么产生呢？

因为Kratos是依托于Protobuf和gRPC来设计API的，所以，我们可以由相关的生成器工具来生成。

Protobuf是一个DSL语言，它需要一个叫做protoc的工具来将API编译转换成目标语言。而它的具体工具是依靠插件来实现的。

目前已有的由Go编写的OpenAPI生成插件有两个：

- OpenAPIv2生成器：[protoc-gen-openapiv2](http://github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2)
- OpenAPIv3生成器：[protoc-gen-openapi](http://github.com/google/gnostic/cmd/protoc-gen-openapi)

我们可以通过以下命令来安装：

```bash
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
```

直接生成的命令倒是简单。

生成 OpenAPI v2 json文档：

```bash
protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
```

生成 OpenAPI v3 yaml文档：

```bash
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto
```

但是，直接使用命令是很不方便的，我们可以使用一个叫做[Buf.Build](https://buf.build/)来进行工程化生成。

安装Buf很简单：

```bash
go install github.com/bufbuild/buf/cmd/buf@latest
```

然后我们需要在项目的根目录下创建`buf.work.yaml`、`buf.yaml`、`buf.gen.yaml`等配置文件。关于这些配置文件如何进行配置，本文将不做详细的讲解，可自行寻找教程学习。本文只着重讲解生成OpenAPI的相关知识。

要生成OpenAPI，我们还需要创建一个配置文件`buf.openapi.gen.yaml`，并且放在proto同级目录下，**在这里我们以后台API做讲解**：

```yml
# 配置protoc生成规则
version: v1
managed:
  enabled: false
plugins:
  # generate openapi v2 json doc
#  - name: openapiv2
#    out: ../docs
#    opt:
#      - json_names_for_fields=true
#      - logtostderr=true

  # generate openapi v3 yaml doc
  - name: openapi
    out: ./app/admin/service/cmd/server/assets
    opt:
      - naming=json
      - depth=2
      - paths=source_relative
```

接着我们就可以在项目根目录下使用下面的命令来生成了：

```bash
buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml
```

最终，在`./app/admin/service/cmd/server/assets`这个目录下面，将会生成出来一个文件名为`openapi.yaml`的文件。

### 怎么将openapi.yaml文件引入到Swagger UI

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

最后，我们就需要来集成Swagger UI进来了。我为此封装了一个项目，要使用它，我们需要：

```bash
go get -u github.com/tx7do/kratos-swagger-ui
```

在创建REST服务器的地方调用程序包里面的方法：

```go
package server

import (
	rest "github.com/go-kratos/kratos/v2/transport/http"
	swaggerUI "github.com/tx7do/kratos-swagger-ui"

    "kratos-cms/app/admin/service/cmd/server/assets"
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

如果API服务的端口是8080，那么我们可以访问链接来访问Swagger UI：

<http://localhost:8080/docs/>

同时，openapi.yaml文件也可以在线访问到：

<http://localhost:8080/docs/openapi.yaml>

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/kratos-admin)

## 参考资料

- [什么是 Swagger](https://apifox.com/apiskills/what-is-swagger/)
- [OpenAPI 规范（中文版）](https://openapi.apifox.cn/)
- [Swagger-UI 介绍及基本使用指南](https://developer.aliyun.com/article/1157293)

[1]: <https://swagger.io/>
[2]: <https://openapi.apifox.cn/>
[3]: <https://fastapi.tiangolo.com/zh/#api>
