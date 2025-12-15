# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：集成 Swagger UI 打造交互式 API 文档

在企业级中后台系统开发中，接口调试、测试与文档同步始终是困扰前后端团队的核心痛点：接口变更后文档未及时更新、手动编写文档效率低下、调试工具切换繁琐等问题，严重影响开发协作效率。而 OpenAPI 规范（原 Swagger 规范）及其配套工具 Swagger UI，正是解决这些问题的最优解之一。

笔者在使用 Python 生态的 FastAPI 框架时，发现其内置的 Swagger UI 体验极佳——开发者可直接通过 <http://127.0.0.1:8000/docs> 访问交互式 API 文档，实现接口可视化调试与测试，无需额外部署工具。受此启发，我们将这一方案借鉴到 GoWind Admin（基于 Kratos 框架的企业级前后端一体中后台框架）中，实现了 API 文档的自动化生成与嵌入式访问。

![Fast API Swagger UI](/assets/images/swagger/fastapi-swagger-ui-simple.png)

## 一、核心概念：OpenAPI 与 Swagger 的关系

很多开发者会混淆 OpenAPI 和 Swagger，其实二者是「规范」与「实现工具集」的关系，明确这一点是后续集成的基础。

### 1.1 什么是 OpenAPI？—— API 设计的全球标准

OpenAPI 是一套用于设计、描述 RESTful API 的**开放标准**（并非工具），其核心价值在于标准化 API 的设计规范，确保 API 具备良好的可读性、可扩展性与安全性。遵循该标准的 API 可实现：

- 跨团队协作标准化：前后端、测试、运维团队基于同一套规范沟通，减少理解偏差；
- 自动化流程支撑：为后续的文档生成、接口测试、客户端 SDK 生成提供结构化数据基础；
- 兼容性与可维护性：API 版本迭代、跨系统集成时具备统一的约束，降低维护成本。

OpenAPI 最初名为 Swagger 规范，由 Swagger 团队提出，后捐赠给 Linux 基金会并更名为 OpenAPI。如需深入学习规范细节，可参考 [OpenAPI 规范（中文版）][2]。

### 1.2 什么是 Swagger？—— OpenAPI 规范的落地工具集

OpenAPI 仅定义规范，手动编写符合规范的文档（如 JSON/YAML 格式）繁琐且易出错。Swagger 则是一套**实现了 OpenAPI 规范的工具集**，旨在降低 API 开发与管理的门槛。其核心工具包括：

- **Swagger Editor**：浏览器端编辑器，支持实时编写 OpenAPI 规范并预览文档；
- **Swagger UI**：核心工具，可将 OpenAPI 规范（JSON/YAML）动态生成交互式文档，支持在线调试接口；
- **Swagger Codegen**：根据 OpenAPI 规范自动生成多语言客户端 SDK、服务器存根代码；
- **Swagger Inspector**：免费 API 测试工具，支持验证 API 并反向生成 OpenAPI 规范；
- **SwaggerHub**：团队级 API 设计与文档管理平台，支持协作编辑与版本控制。

Swagger 官网：<https://swagger.io/>，其中 Swagger UI 是我们本次集成的核心组件。

## 二、Kratos 集成 Swagger UI 的核心思路

Kratos 框架基于 Protobuf（IDL 语言）和 gRPC 设计 API，因此集成 Swagger UI 的核心逻辑是：

1. 通过工具从 Protobuf 定义生成符合 OpenAPI 规范的 JSON/YAML 文档；
2. 将生成的 OpenAPI 文档嵌入到 Kratos 服务中（避免额外部署文档服务）；
3. 在 Kratos HTTP 服务中集成 Swagger UI，使其加载嵌入式的 OpenAPI 文档，提供交互式访问。

下面我们按步骤拆解具体实现过程。

## 三、第一步：从 Protobuf 生成 OpenAPI 文档

Protobuf 是 Kratos 定义 API 的基础，我们需要通过 protoc 插件将 Protobuf 文件转换为 OpenAPI 规范文档。目前主流的 Go 语言插件有两个，分别支持 OpenAPI v2 和 v3 版本（推荐 v3，功能更强大、规范更完善）。

### 3.1 安装 OpenAPI 生成插件

通过 go install 安装两个核心插件：

```bash
# OpenAPI v2 生成器（兼容旧版 Swagger UI）
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

# OpenAPI v3 生成器（推荐，功能更完善）
go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
```

### 3.2 直接通过 protoc 生成文档（基础方式）

安装完成后，可直接通过 protoc 命令生成文档，核心参数说明：

- `--proto_path=.`：指定 Protobuf 文件所在目录；
- `--openapiv2_out/--openapi_out`：指定输出目录与路径规则（如 paths=source_relative 表示按源文件相对路径输出）；
- `--openapiv2_opt/--openapi_opt`：额外配置（如 JSON 字段命名规则、日志输出等）。

生成 OpenAPI v2 JSON 文档：

```bash
protoc --proto_path=. \
    --openapiv2_out=paths=source_relative:../docs \  # 输出到上级 docs 目录
    --openapiv2_opt logtostderr=true \              # 开启日志输出
    --openapiv2_opt json_names_for_fields=true \    # JSON 字段名使用蛇形命名（如 user_name）
    ./*.proto
```

生成 OpenAPI v3 YAML 文档（推荐）：

```bash
protoc --proto_path=. \
    --openapi_out=naming=json,paths=source_relative:../docs \  # 修复原文参数错误，用逗号分隔配置
    ./*.proto
```

### 3.3 工程化生成：使用 Buf 替代原生 protoc

直接使用 `protoc` 命令存在诸多问题：多文件依赖管理复杂、参数重复输入、团队协作规范不统一。推荐使用 [Buf.Build](https://buf.build/) 工具进行工程化管理，它提供了 Protobuf 语法检查、依赖管理、批量生成等功能。

#### 3.3.1 安装 Buf

```bash
go install github.com/bufbuild/buf/cmd/buf@latest
```

#### 3.3.2 配置 Buf 生成规则

Buf 需通过三个核心配置文件管理生成流程（详细配置可参考 [Buf 官方文档](https://buf.build/docs/introduction)），此处重点关注 OpenAPI 生成相关的配置：在 Protobuf 文件同级目录创建 `buf.openapi.gen.yaml`，配置 OpenAPI 生成规则：

```yaml
# buf.openapi.gen.yaml：OpenAPI 生成专属配置
version: v1
managed:
  enabled: false  # 关闭自动管理依赖（根据项目实际需求调整）
plugins:
  # 生成 OpenAPI v3 YAML 文档（后台 API 示例）
  - name: openapi
    out: ./app/admin/service/cmd/server/assets  # 输出到服务 assets 目录（便于后续嵌入）
    opt:
      - naming=json  # 字段名使用 JSON 风格（蛇形命名）
      - depth=2      # 嵌套字段解析深度（避免过度嵌套导致文档冗余）
      - paths=source_relative  # 按源文件相对路径生成文件
```

#### 3.3.3 执行 Buf 生成命令

在项目根目录执行以下命令，即可按配置生成 OpenAPI v3 文档：

```bash
# 生成指定目录的 Protobuf 对应的 OpenAPI 文档
buf generate --path api/admin/service/v1 \
    --template api/admin/service/v1/buf.openapi.gen.yaml
```

生成成功后，会在 `./app/admin/service/cmd/server/assets` 目录下生成 `openapi.yaml` 文件。

## 四、第二步：将 OpenAPI 文档嵌入 Kratos 服务

为了避免单独部署 OpenAPI 文档服务，我们利用 Go 1.16+ 提供的 `//go:embed` 指令，将 `openapi.yaml` 文件嵌入到 Kratos 服务的二进制文件中，实现「文档与服务一体部署」。

### 4.1 编写嵌入代码

在 `./app/admin/service/cmd/server/assets` 目录下创建 `assets.go` 文件：

```go
package assets

import _ "embed"

//go:embed openapi.yaml
// OpenApiData 嵌入的 OpenAPI v3 文档数据（二进制格式）
var OpenApiData []byte
```

通过 `//go:embed openapi.yaml` 指令，Go 编译器会在构建时将 `openapi.yaml` 文件内容写入 `OpenApiData` 变量，后续可直接在代码中读取。

## 五、第三步：集成 Swagger UI 到 Kratos 服务

Kratos 官方曾提供 `swagger-api` 项目，但目前已归档，且仅支持 OpenAPI v2，存在文档读取不稳定等问题。为此，笔者封装了 `kratos-swagger-ui` 库，专门适配 Kratos 框架，支持 OpenAPI v3，且集成简单。

### 5.1 安装集成库

```bash
go get -u github.com/tx7do/kratos-swagger-ui
```

### 5.2 在 Kratos HTTP 服务中注册 Swagger UI

在 Kratos 服务的 HTTP 服务器初始化代码中，调用 `kratos-swagger-ui` 库的注册方法，加载嵌入式的 OpenAPI 文档：

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

### 5.3 自动化构建与运行

为了简化「生成文档 + 启动服务」的流程，我们将相关命令写入 `Makefile`，实现一键执行：

```makefile
# Makefile
.PHONY: api openapi run

# 生成 Protobuf 对应的 Go 代码（gRPC + HTTP 网关）
api:
        buf generate

# 生成所有服务的 OpenAPI v3 文档
openapi:
        # 生成后台服务 API 文档
        buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.opena API 文档（如有）
        buf generate --path api/front/service/v1 --template api/front/service/v1/buf.openapi.gen.yaml

# 一键生成代服务
run: api openapi
        @echo "启动 Admin 服务..."
        @go run ./cmd/server -conf ./configs码、文档并启动pi.gen.yaml
        # 生成前台服务
```

执行以下命令即可完成全流程：

```bash
# 仅生成 OpenAPI 文档
make openapi

# 生成代码、文档并启动服务
make run
```

## 六、验证集成效果

启动 Kratos 服务后，若 HTTP 服务端口为 8080，可通过以下链接访问 Swagger UI：

- Swagger UI 交互式文档：<http://localhost:8080/docs/>
- 原始 OpenAPI 文档：<http://localhost:8080/docs/openapi.yaml>

访问后可看到：

- 所有 Protobuf 定义的 API 接口按模块分类展示；
- 支持在线填写请求参数，点击「Try it out」直接调试接口；
- 自动展示响应示例、状态码说明，无需手动编写文档。

## 七、项目代码与参考资料

### 7.1 完整项目代码

- GoWind Admin（Gitee）：<https://gitee.com/tx7do/go-wind-admin>
- GoWind Admin（GitHub）：<https://github.com/tx7do/go-wind-admin>

### 7.2 扩展参考资料

- Swagger 官方文档：<https://swagger.io/docs/>
- OpenAPI 规范（中文版）：<https://openapi.apifox.cn/>
- Buf 官方文档：<https://buf.build/docs/introduction>
- Kratos 官方文档 - HTTP 服务：<https://go-kratos.dev/docs/transport/http>
- Go 嵌入文件特性：<https://pkg.go.dev/embed>

## 八、总结

通过本文的方案，我们实现了 Kratos 框架与 Swagger UI 的深度集成，核心优势在于：

1. **自动化文档生成**：从 Protobuf 定义一键生成 OpenAPI 文档，避免手动编写与更新；
2. **嵌入式部署**：文档与服务一体部署，无需额外维护文档服务；
3. **交互式调试**：前端开发者可直接通过浏览器调试接口，提升协作效率；
4. **工程化支撑**：基于 Buf 实现规范管理，适配团队协作场景。

该方案已集成到 GoWind Admin 框架中，开箱即用。如果你的 Kratos 项目也需要高效的 API 文档解决方案，可直接参考本文实现，或直接使用 GoWind Admin 框架快速搭建企业级中后台系统。
