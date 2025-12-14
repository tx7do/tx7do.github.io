# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：极速搭建微服务应用

在企业级中后台系统开发中，开发者常常面临两大痛点：一是微服务架构搭建繁琐，从项目初始化到多服务协同需要大量手动配置；二是前后端协同成本高，接口定义、数据模型同步往往耗时费力。而 **GoWind Admin**（简称「风行」）的出现，正是为了解决这些问题 —— 它基于 `gow` CLI 工具，提供了一套开箱即用的企业级前后端一体中后台框架，让开发者能以极低成本快速搭建微服务体系。

## 什么是 GoWind Admin？

GoWind Admin 是一套聚焦企业级中后台场景的微服务开发框架，基于 Go 语言生态（依托 [go-kratos](https://go-kratos.dev/) 微服务框架）打造，整合了前后端开发所需的核心工具链。其核心优势在于「**一键生成**」与「**高度可配置**」：通过 `gow` 命令行工具，开发者可以快速初始化项目、创建微服务、生成接口与数据层代码，无需从零搭建架构，极大缩短开发周期。

## 核心特性：为什么选择 GoWind Admin？

### 1. 开箱即用，零配置启动

GoWind Admin 提供了完整的项目脚手架，包含预设的目录结构、配置文件、依赖管理等。通过 gow 工具，一行命令即可生成可运行的项目骨架，省去繁琐的初始化工作：

```shell
# 安装 CLI 工具
go install github.com/tx7do/kratos-cli/gowind/cmd/gow@latest

# 初始化项目（支持自定义模块名）
gow new myproject -m github.com/yourusername/myproject
cd myproject
go mod tidy  # 自动处理依赖
```

生成的项目包含默认配置（数据库、日志、服务端口等），开发者可直接基于此开发，无需关注底层架构细节。

### 2. 多服务类型支持，适配复杂业务场景

企业级应用往往需要多种服务类型协同（如 API 服务、RPC 服务、消息队列服务等）。GoWind Admin 支持通过命令行快速创建不同类型的微服务，并自动生成对应代码：

- **多协议支持**：可创建 gRPC、REST 服务，或同时集成两种协议（如 `gow add service admin -s rest -s grpc`）；
- **多数据层适配**：支持 gorm、ent、redis 等主流 ORM / 数据客户端，生成对应的数据访问层代码（如 `gow add service payment -d gorm -d redis`）；
- **服务注册与发现**：内置微服务协同所需的配置，支持服务间调用的标准化处理。

### 3. 自动化代码生成，减少重复劳动

GoWind Admin 的核心能力之一是「代码生成」，通过 `gow` 工具可自动生成项目各层代码，覆盖从接口定义到数据访问的全流程：

- **服务层代码**：生成 gRPC/REST 服务的路由、控制器代码；
- **数据层代码**：根据选择的 ORM 类型（如 gorm）生成数据库连接、模型定义代码；
- **配置文件**：自动生成 server.yaml、data.yaml 等配置模板，包含数据库、日志、客户端等默认配置；
- **构建脚本**：生成 Makefile，支持一键编译、运行、部署。

例如，添加一个支持 gRPC 和 gorm 的「订单服务」：

```shell
gow add service order -s grpc -d gorm
go mod tidy  # 自动更新依赖
```

命令执行后，框架会在 `app/order/service` 目录下生成完整的服务代码，包括 gRPC 接口定义、数据访问层、配置文件等，开发者可直接编写业务逻辑。

### 4. 无缝集成 kratos 生态，企业级能力内置

GoWind Admin 基于 kratos 生态构建，天然继承其企业级特性：

- **可观测性**：内置日志、监控、追踪能力，支持与 Prometheus、Grafana 等工具集成；
- **高可用**：支持服务熔断、限流、重试等容错机制；
- **扩展性**：可结合 kratos-cli 其他工具（如 `cfgexp` 配置导出、`sql2orm` 数据库模型生成），形成完整开发闭环。

## 快速上手：3 步搭建一个微服务应用

### 步骤 1：安装 CLI 工具

```shell
go install github.com/tx7do/kratos-cli/gowind/cmd/gow@latest
```

### 步骤 2：创建项目并添加服务

```shell
# 创建项目
gow new wind-demo -m github.com/your-org/wind-demo
cd wind-demo

# 添加用户服务（支持 REST 协议和 gorm 数据库）
gow add service user -s rest -d gorm
go mod tidy

cd app/user/service
# 生成wire代码
make wire
```

### 步骤 3：运行服务

```shell
# 进入用户服务目录运行
cd app/user/service
gow run

# 或直接指定服务名运行
gow run user
```

服务启动后，即可通过默认端口（如 REST 服务默认 8080）访问接口，框架已自动处理好路由、配置加载等工作。

## 适用场景

GoWind Admin 尤其适合以下场景：

- 企业级中后台系统开发（如 ERP、CRM、数据平台）；
- 微服务架构的快速落地（需多服务协同、多协议支持）；
- 前后端分离项目（自动生成接口文档，降低协同成本）；
- 追求开发效率的团队（减少架构搭建时间，聚焦业务逻辑）。

## 总结

GoWind Admin 以「**简化微服务开发流程**」为核心，通过 `gow` CLI 工具将项目初始化、服务创建、代码生成等流程自动化，让开发者无需重复搭建架构，开箱即可专注业务逻辑。无论是小型团队快速验证需求，还是大型企业构建复杂中后台系统，GoWind Admin 都能显著降低开发成本，加速项目落地。

立即尝试 `gow` 工具，体验「风行」般的开发效率吧！

## 项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
