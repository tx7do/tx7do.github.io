# go-kratos-admin 快速上手指南：从环境搭建到启动服务（Windows/macOS/Linux 通用）

go-kratos-admin 作为开箱即用的企业级 Admin 全栈解决方案，支持跨系统快速部署。本文将以通用步骤 + 分系统适配的方式，带你从环境搭建到成功启动前后端服务，全程仅需 10 分钟左右，新手也能轻松上手。

## 一、前置环境准备（所有系统通用）

首先需安装以下基础工具，确保版本满足要求（建议版本≥下方标注）：

|工具		|	最低版本要求	|	作用	|	跨系统安装与验证方法|
|-----|-------|-----|-----|
|Git|2.30.0	|拉取项目代码	|官网下载安装：<https://git-scm.com/><br>验证：终端执行 `git --version`（显示版本即成功）|
|Golang|1.21	|后端编译运行	|官网下载安装：<https://go.dev/dl/><br>验证：`go version`（显示版本即成功）|
|Docker|20.10.0	|运行依赖服务（数据库等）	|官网下载安装：<https://www.docker.com/get-started/> <br> 验证：`docker --version` + `docker compose version`（需启动 Docker 服务）|
|Node.js|18.0.0	|前端环境基础	|官网下载安装：<https://nodejs.org/> <br> 验证：`node -v`（显示版本即成功）|
|pnpm|8.0.0	|前端包管理工具	|安装：`npm install -g pnpm` <br> 验证：`pnpm -v`（显示版本即成功）|

分系统适配说明：

## 二、拉取项目代码

打开终端（Windows 用 PowerShell/CMD，macOS/Linux 用 Terminal），执行以下命令克隆代码到本地：

```bash
# 克隆仓库（建议用 HTTPS，避免 SSH 密钥配置问题）
git clone https://github.com/tx7do/go-kratos-admin.git

# 进入项目根目录
cd go-kratos-admin
```

## 三、后端服务启动（核心步骤）

后端依赖 MySQL、Redis 等服务，项目已通过 Docker Compose 一键配置，无需手动安装这些中间件。

### 步骤 1：进入后端目录

```bash
cd backend
```

### 步骤 2：初始化项目依赖

```bash
make init
```

### 步骤 3：启动 Docker 依赖服务

### 步骤 4：启动后端应用

```bash
# 开发模式启动后端服务
make run
```

## 四、前端服务启动

后端启动后，**新开一个终端**（不要关闭后端终端），回到项目根目录，执行以下步骤：

### 步骤 1：进入前端目录

```bash
cd frontend
```

### 步骤 2：安装前端依赖

```bash
pnpm install
```

### 步骤 3：启动前端开发服务

```bash
pnpm dev
```

## 五、验证服务启动成功

### 1. 访问前端页面

打开浏览器，输入 <http://localhost:8080>（或终端显示的 Local 地址），看到登录页面即成功：

- 默认账号：`admin`
- 默认密码：`admin`

登录后可直接操作租户管理、用户管理等核心功能。

### 2. 验证后端接口

访问 Swagger 文档：<http://localhost:7788/docs>（默认端口 7788），可在线调试接口（如 `GET /admin/v1/users` 查询用户列表）。

## 六、常见问题与解决方案

### 问题 1：Docker 启动失败（如端口占用）

- 检查端口：MySQL 默认用 3306，Redis 默认用 6379，执行 netstat -tulpn | grep 3306（Linux/macOS）或 netstat -ano | findstr "3306"（Windows）查看占用进程，关闭后重启 Docker。
- 权限问题（Linux）：执行 sudo chmod 666 /var/run/docker.sock 解决 Docker 权限不足。

### 问题 2：前端启动后页面空白 / 报错

- 检查后端是否正常启动：确保 <http://localhost:7788/docs/> 可访问。
- 清除缓存：执行 `pnpm clean` 后重新 `pnpm install`。
- 端口冲突：前端默认 `8080` 被占用，可修改 frontend/.env.development 中的 VITE_PORT（如改为 8081）。

### 问题 3：Windows 下 make 命令无法使用

- 方案 1：安装 WSL2（推荐），在 Ubuntu 子系统中操作，与 Linux 完全兼容。
- 方案 2：使用项目提供的替代脚本，后端目录下执行 script/init.bat（初始化）、script/run.bat（启动服务）。

### 问题 4：后端启动提示 “数据库连接失败”

- 检查 Docker 中 MySQL 容器是否启动：docker start go-kratos-admin-mysql（容器名可通过 docker ps -a 查看）。
- 验证数据库配置：后端 configs/config.yaml 中 data_source 是否为 root:123456@tcp(localhost:3306)/admin?charset=utf8mb4&parseTime=True&loc=Local（默认密码 123456）。

## 七、下一步：开发与部署

启动成功后，你可以：

1. 开发自定义功能：后端在 backend/internal/service 中新增业务逻辑，前端在 frontend/src/views 中新增页面；
2. 打包部署：
    - 后端：`make build`（生成二进制文件），`./bin/server` 运行；
    - 前端：`pnpm build`（生成静态文件），部署到 Nginx 或 CDN。

通过以上步骤，你已完成 go-kratos-admin 的本地环境搭建与服务启动。若遇到其他问题，可参考项目 README 或通过官方渠道（微信：`yang_lin_bo`）求助。接下来就可以基于这个框架快速开发企业级 Admin 系统了！
