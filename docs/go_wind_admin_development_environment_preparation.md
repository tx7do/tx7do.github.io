# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：如何搭建开发环境

开发环境的稳定与规范是高效开发的基础。风行·GoWind Admin 作为前后端一体的企业级中后台框架，需搭建适配的前端、后端开发环境以保障开发流程顺畅。本文将详细拆解前端、后端开发环境的搭建步骤，涵盖工具安装、插件配置、网络代理设置等核心内容，适配 Windows/macOS 主流系统，助力开发者快速完成环境初始化。

## 一、前端开发环境搭建

前端基于 Vue + TypeScript 技术栈，需安装代码管理、开发IDE、运行环境及依赖管理工具，同时配置 Protobuf 相关插件以支持接口定义解析。

### 1. 必备开发工具清单

以下工具为前端开发核心依赖，确保代码拉取、项目编译、依赖管理等流程正常运行：

- **Git**：代码版本控制工具，用于拉取项目源码
- **Visual Studio Code / WebStorm**：前端开发IDE，推荐 WebStorm（对 Vue/TypeScript 支持更友好）
- **Node.js**：前端运行环境，推荐 LTS 稳定版本（16.x+ 或 18.x+）
- **npm/pnpm**：依赖管理工具，pnpm 为项目推荐优先使用（速度更快、占用空间更小）

### 2. 分系统工具安装指南

推荐使用系统专用包管理工具安装，可自动解决依赖关联，简化安装流程。

#### 2.1 Windows 系统（推荐 Scoop）

Scoop 是 Windows 下轻量型命令行包管理工具，支持一键安装多款开发软件：

##### 1. 先安装 Scoop（需以管理员身份运行 PowerShell）：

```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

##### 2. 添加软件仓库并安装所需工具：

```bash
scoop bucket add extras
scoop install git vscode webstorm nodejs pnpm
```

#### 2.2 macOS 系统（推荐 Homebrew）

Homebrew 是 macOS 官方推荐的包管理工具，覆盖大部分开发软件：

##### 1. 先安装 Homebrew（终端执行）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

##### 2. 安装所需工具（开发IDE需通过 `--cask` 参数安装）：

```bash
brew install git node pnpm
brew install --cask visual-studio-code webstorm
```

### 3. 核心插件安装（Protobuf 相关）

项目通过 Protobuf 定义接口规范，需安装对应插件实现 Protobuf 到 TypeScript/Dart 代码的生成：

#### 3.1 Dart 插件（protoc_plugin）

```bash
flutter pub global activate protoc_plugin
```

#### 3.2 TypeScript 插件

```bash
# ts-proto
npm install -g ts-proto

# protoc-gen-typescript-http
go install github.com/go-kratos/protoc-gen-typescript-http@latest
```

#### 4. 依赖源配置（国内网络必备）

国内网络直接访问 npm 官方源速度较慢，建议切换为国内镜像源，提升依赖安装效率。以下为 npm/pnpm/yarn 三种工具的源配置方法：

##### 4.1 国内常用镜像源列表

| 提供商  | 搜索地址                   | registry地址                                         |
|------|------------------------|----------------------------------------------------|
| 淘宝   | https://npmmirror.com/ | https://registry.npmmirror.com                     |
| 腾讯云  |                        | http://mirrors.cloud.tencent.com/npm/              |
| 华为云  |                        | https://mirrors.huaweicloud.com/repository/npm     |
| 浙江大学 |                        | http://mirrors.zju.edu.cn/npm/                     |
| 南京邮电 |                        | https://mirrors.njupt.edu.cn/nexus/repository/npm/ |

##### 4.2 npm 源配置

```bash
# 查看当前源
npm get registry
# 临时修改（仅当前安装命令生效）
npm --registry https://registry.npmmirror.com install any-touch
# 永久修改（推荐）
npm config set registry https://registry.npmmirror.com
# 还原官方源
npm config set registry https://registry.npmjs.org
```

##### 4.3 pnpm 源配置

```bash
# 查看当前源
pnpm get registry
# 临时修改
pnpm --registry https://registry.npmmirror.com install any-touch
# 永久修改（推荐）
pnpm config set registry https://registry.npmmirror.com
# 还原官方源
pnpm config set registry https://registry.npmjs.org
```

##### 4.4 源管理工具（nrm/yrm，可选）

若需频繁切换源，可安装专用管理工具，简化操作：

###### nrm（适配 npm/yarn）：

```bash
npm install -g nrm
nrm ls  # 列出所有可用源
nrm use taobao  # 切换到淘宝源
nrm test taobao  # 测试源访问速度
```

###### yrm（适配 yarn）：

```bash
npm install -g yrm
yrm ls  # 列出所有可用源
yrm use taobao  # 切换到淘宝源
yrm test taobao  # 测试源访问速度
```

## 二、后端开发环境搭建

后端基于 Golang + Kratos 微服务框架，需安装 Go 环境、容器化工具、Protobuf 编译工具及 IDE 等，同时配置 Go 代理以解决国内网络包拉取问题。

### 1. 必备开发工具清单

- **Git**：代码版本控制工具
- **Visual Studio Code / GoLand**：后端开发IDE，推荐 GoLand（对 Go 语法、微服务框架支持更友好）
- **Docker**：容器化工具，用于运行依赖中间件（postgres、redis 等）
- **Go**：后端开发语言环境，推荐 1.20+ 版本
- **Protobuf 相关工具**：protoc-compiler（Protobuf 编译器）、各类 Go 语言 Protobuf 插件
- **Make/Buf/gawk/grep/sed**：构建工具与文本处理工具，用于项目编译、插件安装

### 2. 分系统工具安装指南

#### 2.1 Windows 系统（推荐 Scoop）

```bash
# 若未安装 Scoop，先执行前文 Windows 系统 Scoop 安装步骤
scoop bucket add extras
scoop install git vscode goland docker go protobuf make buf gawk grep sed
```

#### 2.2 macOS 系统（推荐 Homebrew）

```bash
# 若未安装 Homebrew，先执行前文 macOS 系统 Homebrew 安装步骤
brew install git docker go protobuf make buf gawk grep gnu-sed
brew install --cask visual-studio-code goland
```

说明：macOS 自带的 sed 为 BSD 版本，部分命令不兼容，故安装 gnu-sed（GNU 版本 sed）。

### 3. 核心插件安装（Protobuf 相关）

后端通过 Protobuf 定义接口与数据结构，需安装对应 Go 插件生成 Go 代码、GRPC 服务代码等。提供两种安装方式，按需选择：

#### 3.1 手动安装（精准控制版本）

```bash
# Protobuf 核心插件
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
# GRPC 服务生成插件
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
# Kratos HTTP 服务生成插件
go install github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2@latest
# Kratos 错误码生成插件
go install github.com/go-kratos/kratos/cmd/protoc-gen-go-errors/v2@latest
# OpenAPI 文档生成插件
go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
# 数据校验插件
go install github.com/envoyproxy/protoc-gen-validate@latest
```

#### 3.2 一键安装（项目内置脚本，推荐）

项目根目录提供 `make plugin` 命令，可自动安装前后端所有所需 Protobuf 插件，无需手动逐个执行：

```bash
# 进入项目根目录
cd go-wind-admin
# 一键安装所有插件
make plugin
```

### 4. Golang 网络代理配置（国内网络必备）

Go 模块默认从 GitHub 等境外仓库拉取，国内网络直接访问易失败，需配置代理加速。以下为完整配置步骤：

#### 4.1 基础配置（开启模块支持、关闭校验等）

```bash
# 开启 Go 模块支持（Go 1.11+ 必需）
go env -w GO111MODULE=on
# 取消代理（重置时使用）
go env -w GOPROXY=direct
# 关闭校验（避免因网络问题导致校验失败）
go env -w GOSUMDB=off
# 设置私有仓库不走代理（可选，替换为自己的私有仓库地址）
go env -w GOPRIVATE=git.mycompany.com,github.com/my/private
```

#### 4.2 国内常用代理列表

| 提供者      | 地址                                  |
|----------|-------------------------------------|
| 官方全球代理   | https://proxy.golang.com.cn         |
| 七牛云      | https://goproxy.cn                  |
| 阿里云      | https://mirrors.aliyun.com/goproxy/ |
| GoCenter | https://gocenter.io                 |
| 百度       | https://goproxy.bj.bcebos.com/      |

说明：`direct` 为特殊指示符，代表当代理不可用时直接回源到仓库地址（如 GitHub）拉取，提升可靠性。

#### 4.3 代理配置命令（推荐七牛云）

```bash
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOSUMDB=goproxy.cn/sumdb/sum.golang.org
```

#### 4.4 常见问题解决：代理配置不生效

若执行 `go env -w GOPROXY=...` 后提示 `warning: go env -w GOPROXY=... does not override conflicting OS environment variable`，原因是之前通过系统环境变量设置过 GOPROXY，`-w` 参数无法覆盖系统级环境变量。

解决方案：

- Windows 系统（PowerShell）：`Clear-Variable GOPROXY -Scope Process`
- macOS/Linux 系统（终端）：`unset GOPROXY`

执行后重新执行代理配置命令即可生效。

## 三、IDE 补充插件安装（BUF 插件）

项目使用 Buf 管理 Protobuf 依赖，若 IDE 未安装 Buf 插件，会导致通过 Buf 引用的第三方 Protobuf 文件无法解析，影响开发体验。需安装对应 IDE 的 Buf 插件：

### Visual Studio Code（VSC）：

插件名称：`Buf for Protocol Buffers`，安装地址：<https://marketplace.visualstudio.com/items?itemName=bufbuild>.vscode-buf

### GoLand：

插件名称：`Buf for Protocol Buffers`，安装地址：<https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers>

安装完成后重启 IDE，即可正常解析 Buf 管理的 Protobuf 依赖。

## 四、项目源码获取

环境搭建完成后，拉取 GoWind Admin 项目源码开始开发：

- Gitee（国内访问速度快）：<https://gitee.com/tx7do/go-wind-admin>
- GitHub：<https://github.com/tx7do/go-wind-admin>

```bash
# 拉取源码示例（Gitee）
git clone https://gitee.com/tx7do/go-wind-admin.git
cd go-wind-admin
```
