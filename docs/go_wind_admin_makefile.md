# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：Makefile 在后端开发中的应用与 Windows 环境配置

在企业级中后台框架的开发过程中，高效的工程化管理是提升团队协作效率、保障开发流程规范的核心。GoWind Admin（风行）作为一款基于 Go 微服务框架 go-kratos 和 Vue 前端框架 Vben Admin 的全栈解决方案，其后端工程化体系中，Makefile 扮演了至关重要的角色 —— 它通过统一的命令集简化了复杂的构建流程，实现了环境初始化、依赖管理、代码生成、服务部署等操作的自动化，让开发者能够聚焦业务逻辑而非繁琐的工具链配置。本文将系统介绍 Windows 环境下 make 工具的安装方法、Makefile 的分层设计逻辑，以及核心命令的实战应用。

## 一、Makefile 在 GoWind Admin 后端开发中的核心价值

GoWind Admin 后端采用模块化微服务设计，涉及 protobuf 代码生成、依赖管理、服务构建、容器化部署等多个环节。手动执行这些操作不仅繁琐，还容易因环境差异导致错误。Makefile 通过定义标准化命令封装流程，核心价值体现在：

1. **跨平台一致性**：无论开发者使用 Windows、macOS 还是 Linux，通过相同的 `make` 命令即可完成环境初始化、代码生成等操作，消除系统差异带来的流程割裂。
2. **工具链整合**：将 go-kratos、ent、wire、buf 等工具的调用逻辑封装，无需记忆复杂参数（如 `buf generate --template buf.admin.openapi.gen.yaml`），通过 `make openapi` 即可一键执行。
3. **流程自动化串联**：例如 `make all` 可依次完成代码生成、依赖安装、服务构建全流程，避免手动分步操作的遗漏。
4. **低门槛协作**：新开发者通过 `make help` 即可查看所有命令及说明，无需深入理解工具细节即可快速上手。
5. **分层管理灵活性**：根目录 Makefile 负责全局流程（如批量构建所有服务），服务目录 Makefile 聚焦单服务操作（如单独调试 admin 服务），兼顾全局统一与局部灵活。

## 二、Windows 环境下 make 工具的安装与配置

与 Linux/macOS 不同，Windows 系统默认不预装 make 工具，GoWind Admin 提供两种安装方式，可根据需求选择：

### 方式一：通过 scoop 包管理器手动安装（推荐）

#### 1. 安装 scoop（Windows 包管理器）

打开 PowerShell（管理员模式），执行以下命令开启脚本执行权限并安装 scoop：

```powershell
# 允许本地脚本执行
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# 安装scoop
irm get.scoop.sh | iex
```

#### 2. 安装 make 及依赖工具

scoop 安装完成后，通过以下命令安装 make：

```shell
# 添加包含 make 的 extras 仓库
scoop bucket add extras
# 安装 make 及开发必需工具（git、go、protobuf 等）
scoop install make git go protobuf buf gawk grep sed jq
```

#### 3. 验证安装

在 PowerShell 中执行`make --version`，若输出类似以下内容，说明安装成功：

```powershell
GNU Make 4.4.1
Built for x86_64-w64-mingw32
Copyright (C) 1988-2023 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

### 方式二：通过一键脚本自动配置（懒人必备）

GoWind Admin 提供 `prepare_windows.ps1` 脚本，可自动完成 scoop、make、Go、Docker 等全套开发环境的安装：

#### 1. 运行脚本在项目根目录打开 PowerShell（管理员模式），执行：

```powershell
./backend/script/prepare_windows.ps1
```

#### 2. 脚本功能说明该脚本会自动完成：

- 安装 scoop 及 make、git 等基础工具
- 配置 Go 环境（设置 GOPATH 并添加到 PATH）
- 安装 Docker Desktop 并尝试配置自动启动
- 安装 Node.js 及 PM2（用于服务进程管理）

#### 3. 后续配置脚本执行完成后，根据提示手动将以下路径添加到系统环境变量（确保工具全局可用）：

- Go 二进制路径：`%USERPROFILE%\go\bin`
- NPM 全局工具路径：`%USERPROFILE%\.npm-global\bin`

## 三、Makefile 分层设计与核心命令详解

GoWind Admin 采用「根目录 Makefile + app.mk + 服务目录 Makefile」的分层设计，既保证全局流程统一，又支持单服务精细化操作。

### 1. 根目录 Makefile（全局工程管理）

位于 `backend/Makefile`，负责跨服务的全局操作，核心命令如下：

|命令		|功能说明	|	适用场景	|
|-----|-------|-----|
|`make init`|初始化开发环境，安装 protoc 插件（如 protoc-gen-go）、cli 工具（如 kratos、buf）|首次拉取项目后执行|
|`make dep`|执行 `go mod download`，拉取所有 Go 模块依赖|依赖更新后同步|
|`make vendor`|生成 `vendor` 目录固化依赖版本|需离线部署或版本锁定时|
|`make gen`|批量生成所有服务的代码（ent 模型、wire 依赖注入、API 代码等）|全量更新代码生成文件|
|`make build`|构建所有微服务的可执行文件（构建前自动生成 API 代码）|打包所有服务部署包|
|`make build_only`|直接构建所有服务（跳过代码生成，适合依赖未变更时）|快速重新构建|
|`make docker`|为所有服务生成 Docker 镜像|容器化部署前执行|
|`make compose-up`|通过 docker-compose 启动所有依赖中间件（MySQL、Redis 等）|本地开发环境初始化|
|`make compose-up-without-service`|仅启动中间件，不启动后端服务|需单独调试服务时|
|`make test`|执行所有单元测试|提交代码前验证功能|
|`make lint`|通过 golangci-lint 检查代码风格与质量|代码提交前规范检查|
|`make help`|查看所有命令及说明|新手快速了解命令功能|

### 2. app.mk 与服务目录 Makefile（单服务操作）

每个服务目录（如 `app/admin/service`）下的 Makefile 仅一行代码：`include ../../../app.mk`，即通过引入根目录的 `app.mk` 实现单服务命令标准化。核心命令如下：

|命令		|功能说明	|	适用场景	|
|-----|-------|-----|
|`make run`|启动当前服务（加载本地配置，适合调试）|开发时实时调试单个服务|
|`make api`|基于当前服务的 protobuf 生成 Go 接口代码|仅更新当前服务 API 定义后|
|`make ent`|生成当前服务的 ent 数据库模型代码|数据库表结构变更后|
|`make wire`|生成当前服务的依赖注入代码|服务内部依赖关系变更后|
|`make openapi`|生成当前服务的 OpenAPI 文档|需更新接口文档时|
|`make ts`|生成当前服务的 TypeScript 调用代码（供前端使用）|前后端接口同步时|
|`make build`|仅构建当前服务的可执行文件|单独部署某个服务时|

### 3. 实战场景示例

#### 场景 1：首次拉取项目，初始化环境并启动服务

```shell
# 进入后端目录
cd backend
# 初始化开发环境（安装工具链、插件）
make init
# 启动依赖中间件（MySQL、Redis等）
make compose-up
# 生成所有代码（API、数据库模型等）
make gen
# 构建所有服务
make build
# 进入admin服务目录，启动调试
cd app/admin/service
make run
```

#### 场景 2：单独修改 admin 服务的 API 定义，更新代码并测试

```shell
# 进入admin服务目录
cd backend/app/admin/service
# 生成当前服务的API代码
make api
# 生成OpenAPI文档
make openapi
# 本地启动服务验证
make run
# 回到根目录，执行单元测试
cd ../../..
make test
```

#### 场景 3：构建所有服务的 Docker 镜像并部署

```shell
cd backend
# 生成最新代码
make gen
# 构建所有服务的Docker镜像
make docker
# 启动所有服务及依赖（容器化部署）
make compose-up
```

## 四、Windows 环境下的注意事项

1. **PowerShell 兼容性**：部分命令（如 `sed`、`grep`）依赖 scoop 安装的 GNU 工具，需确保 PowerShell 中优先调用这些工具（可通过 `Get-Command sed` 验证）。
2. **路径格式**：Windows 下路径使用反斜杠 `\`，但 Makefile 中统一使用正斜杠 `/`（Make 工具会自动转换），避免手动修改路径导致错误。
3. **Go 代理配置**：若依赖拉取缓慢，可通过以下命令设置代理：
    ```powershell
    go env -w GO111MODULE=on
    go env -w GOPROXY=https://goproxy.cn,direct
    ```
4. **Docker 权限**：`make compose-up` 需 Docker 已启动，若提示权限不足，可右键 Docker 图标选择「以管理员身份运行」。

## 五、总结

Makefile 作为 GoWind Admin 后端工程化的核心工具，通过分层设计实现了「全局统一流程」与「单服务灵活操作」的平衡。在 Windows 环境下，无论是通过 scoop 手动安装还是一键脚本自动配置，都能快速搭建 make 工具链，结合预置的命令集，开发者可轻松完成从环境初始化到服务部署的全流程操作。

熟练掌握这些命令，不仅能提升个人开发效率，更能保障团队协作的规范性，让中后台开发真正实现「如风般自由」。


### 项目仓库

- GoWind Admin（Gitee）：<https://gitee.com/tx7do/go-wind-admin>
- GoWind Admin（GitHub）：<https://github.com/tx7do/go-wind-admin>
