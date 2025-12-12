# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：5 分钟快速启动

go-wind-admin 作为开箱即用的企业级 Admin 全栈解决方案，核心优势之一是通过 `backend/script` 目录的 **自动化脚本** 降低跨系统部署门槛。本文以 “脚本驱动 + 实操验证” 为核心，优化步骤连贯性与细节提示，补充用户高频踩坑点，帮你更顺畅地完成从环境到服务的全流程搭建。

**前置检查清单（启动前必看）**

避免因基础条件缺失导致流程中断，启动前确认以下事项：

1. 操作系统权限：Windows 需 管理员身份 打开 PowerShell；Linux/macOS 需拥有 `sudo` 权限（执行脚本时可能需要）。
2. 网络状态：确保能访问 `GitHub`、`Docker Hub`、`Homebrew`/`Scoop` 源（建议提前配置国内镜像，见各系统备注）。
3. 磁盘空间：预留至少 **10GB** 空间（用于存储 Docker 镜像、依赖包、编译产物）。

## 一、前置认知：`backend/script`核心脚本解析

在开始操作前，先明确脚本分类与作用（避免用错场景），核心脚本清单如下：

|脚本路径		|适用系统	|	核心功能|
|-----|-------|-----|
|`prepare_ubuntu.sh`	|Ubuntu/Debian	|自动更新系统、安装 Git/Golang/Docker/Node.js 等基础依赖，配置环境变量|
|`prepare_centos.sh`	|CentOS/RHEL	|同上，适配 RPM 包管理系统|
|`prepare_rocky.sh`	|Rocky Linux	|同上，针对 Rocky 系统的依赖兼容性优化|
|`prepare_macos.sh`	|MacOS|通过 Homebrew 包管理器安装 Git/make/Golang/Docker，配置 Docker 自启动|
|`prepare_windows.ps1`	|Windows|通过 Scoop 包管理器安装 Git/make/Golang/Docker，配置 Docker 自启动|
|`docker_compose_install.sh`	|全系统（需 Docker）	|一键启动 **中间件（PostgreSQL/Redis/Consul）+ 后端服务** 容器，零手动配置|
|`docker_compose_install_depends.sh`	|全系统	|仅启动中间件容器（适合 “中间件 Docker + 服务本地运行” 的混合部署场景）|
|`build_install.sh`	|全系统（需 Golang）	|编译后端微服务，部署到 `/root/app/go_wind_admin`（Linux/macOS）或对应路径|
|`install_golang.sh`	|Linux/macOS	|单独安装指定版本 Golang（若脚本自动安装的版本不满足需求时用）|

## 二、环境搭建：用脚本一键搞定依赖（分系统操作）

### 2.1 通用前置步骤：拉取项目代码

先克隆代码到本地，确保能访问 `backend/script` 目录：

```bash
# 克隆项目（HTTPS 方式，无需 SSH 密钥）
git clone https://github.com/tx7do/go-wind-admin.git

# 进入项目根目录
cd go-wind-admin
```

### 2.2 Windows 系统：用 PowerShell 脚本自动装依赖

**必须以「管理员身份」打开 PowerShell**（否则脚本无权限修改系统配置），执行以下步骤：

#### 1. 进入 backend 目录，赋予脚本执行权限：

```powershell
# 1. 以管理员身份打开 PowerShell（右键开始菜单 → 选择“Windows PowerShell (管理员)”）
# 2. 进入 backend 目录（注意路径分隔符用 \ 或 /，示例：若项目在 D 盘）
cd D:/go-wind-admin/backend

# 3. 允许执行本地脚本（仅首次执行，后续无需重复）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# 提示“是否执行此操作？”时，输入 Y 并回车
```

#### 2. 运行 Windows 专属准备脚本：

```powershell
# 执行环境准备脚本，自动安装 Scoop/Git/Golang/Docker 等
# 执行脚本（首次运行约 10-15 分钟，取决于网络速度）
.\script\prepare_windows.ps1

# 脚本执行中注意：
# - 若提示“安装 Scoop”，直接按回车（自动下载配置）；
# - 安装 Docker 后会弹出“Docker Desktop 安装向导”，按默认步骤下一步，最后启动 Docker；
# - 脚本结束后，关闭当前 PowerShell，重新以管理员身份打开（确保环境变量生效）
```

#### 3. 验证关键工具是否安装成功

```powershell
git --version  # 预期：git version 2.30.0+
go version     # 预期：go version go1.21+ windows/amd64
docker --version  # 预期：Docker version 20.10.0+
pnpm --version    # 预期：pnpm 8.0.0+
```

### 2.3 Linux 系统：按发行版选对应脚本

**Linux 脚本执行说明：**

- 脚本会自动输入 `y` 确认安装（无需手动干预），过程中可能需要输入 sudo 密码（输入时无显式回显，输完按回车即可）；
- 安装 Docker 后会自动将当前用户加入 docker 组，脚本结束后需重新登录终端（确保 Docker 权限生效）。

#### 通用前置：赋予脚本执行权限（仅需一次）

```bash
# 进入 backend 目录
cd go-wind-admin/backend

# 给所有脚本添加执行权限（避免“Permission denied”）
chmod +x ./script/*.sh
```

#### 场景 1：Ubuntu/Debian 系列

```bash
# 执行准备脚本（中途需输入 sudo 密码，输入时无显式回显，输完回车即可）
./script/prepare_ubuntu.sh

# 脚本结束后重新登录终端（或执行以下命令加载环境变量）
source /etc/profile

# 验证环境（同 Windows 验证命令，确保工具版本达标）
git --version && go version && docker --version
```

#### 场景 2：CentOS 系列

```bash
cd backend
chmod +x ./script/*.sh
./script/prepare_centos.sh

# 重新加载环境变量 + 验证
source /etc/profile && go version && docker --version
```

#### 场景 3：Rocky Linux

```bash
cd backend
chmod +x ./script/*.sh
./script/prepare_rocky.sh

# 重新加载环境变量 + 验证
source /etc/profile && go version && docker --version
```

### **Linux 避坑提示**：若执行 `docker ps` 提示 `“Cannot connect to the Docker daemon`”，执行以下命令修复：

```bash
sudo systemctl start docker  # 启动 Docker 服务
sudo systemctl enable docker # 设置开机自启
sudo usermod -aG docker $USER # 将当前用户加入 docker 组（避免每次用 sudo）
# 执行后重新登录终端，再试 docker ps
```

### 2.4 macOS 系统

```bash
cd backend
chmod +x ./script/*.sh
./script/prepare_macos.sh
```

### 验证环境

```bash
# 验证工具
git --version && go version && docker --version
# 验证 Docker 服务（确保能正常拉取镜像）
docker pull hello-world && docker run hello-world  # 预期输出“Hello from Docker!”
```

## 三、后端服务启动：两种部署模式（脚本一键切换）

后端服务支持「全 Docker 部署」（新手推荐）和「混合部署」（适合开发调试），均通过脚本简化操作。

### 3.1 模式 1：全 Docker 部署（零本地依赖，推荐新手）

所有组件（中间件 + 后端服务）都运行在 Docker 容器中，无需本地编译，执行一个脚本即可：

```bash
# 确保在 backend 目录下
cd go-wind-admin/backend

# 一键启动所有服务（首次运行需拉取镜像，耐心等待 3-5 分钟）
./script/docker_compose_install.sh
```

**验证启动结果：**

- 执行 `docker ps`，若看到 `go-wind-admin-backend`、`postgres`、`redis`、`consul` 等容器状态为 `Up`，则部署成功；
- 后端服务默认端口：7788（API 服务）、7789（SSE 服务）。

### 3.2 模式 2：混合部署（中间件 Docker + 服务本地运行）

适合需要修改后端代码的场景（本地运行服务便于调试），步骤如下：

#### 1. 仅启动中间件容器（用专用脚本）：

```bash
cd go-wind-admin/backend
./script/docker_compose_install_depends.sh
```

#### 2. 编译并部署本地服务（用 `build_install.sh` 脚本）：

```bash
# 编译后端代码并部署到默认路径（Linux/macOS 为 /root/app/go_wind_admin）
./script/build_install.sh
```

#### 3. 配置 hosts 文件（关键！让本地服务能访问 Docker 中间件）：

- Linux/macOS：`/etc/hosts` 或 `/private/etc/hosts`
- Windows：`C:\Windows\System32\drivers\etc\hosts`

添加以下内容：

```ini
127.0.0.1 postgres
127.0.0.1 redis
127.0.0.1 minio
127.0.0.1 consul
127.0.0.1 jaeger
```

#### 4. 启动本地服务：

```bash
# 进入部署目录（Linux/macOS 示例路径）
cd /root/app/go_wind_admin

# 用 PM2 启动服务（脚本已自动安装 PM2）
pm2 start ./server --name go_wind_admin
```

#### 验证本地服务：

- 执行 `pm2 status`，若 `go_wind_admin` 状态为 `online`，则启动成功；
- 访问 <http://localhost:7788/docs/>，返回 Swagger UI的网页界面 即正常。

## 四、前端服务启动：快速跑通页面（全系统通用）

前端无需脚本，直接用 pnpm 安装依赖并启动，步骤如下：

### 1. 进入前端目录：

```bash
cd go-wind-admin/frontend
```

### 2. 安装前端依赖（若速度慢，可切换镜像）：

```bash
# 切换淘宝镜像（可选，加速依赖下载）
pnpm config set registry https://registry.npmmirror.com

# 安装依赖
pnpm install
```

### 3. 启动开发模式（实时热更新，适合调试）：

```bash
pnpm dev
```

### 验证前端：

- 启动成功后，终端会输出 `Local: http://localhost:5666`；
- 打开浏览器访问该地址，看到登录页面即成功（默认账号：`admin`，密码：`admin`）。

## 五、关键验证：确保前后端打通

- 前端登录：输入 `admin`/`admin` 登录，能看到「租户管理」「用户管理」等菜单，说明前端与后端权限接口连通；
- 后端 API 文档：访问 <http://localhost:7788/docs>，能看到 `Swagger` 文档，且可在线调试接口（如 `GET /admin/v1/users` 查询用户列表）；
- 中间件状态：执行 `docker ps`，确保 `postgres`（数据库）、`redis`（缓存）容器持续运行（无频繁重启）。

## 六、脚本使用常见问题与解决方案

### 问题 1：Linux/macOS 脚本提示 “Permission denied”

- 原因：脚本无执行权限；
- 解决：执行 `chmod +x ./script/*.sh`（在 `backend` 目录下）。

### 问题 2：Windows 脚本提示 “无法加载文件 ... 因为在此系统上禁止运行脚本”

- 原因：`PowerShell` 执行策略限制；
- 解决：以管理员身份打开 `PowerShell`，执行 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`，然后输入 `Y` 确认。

### 问题 3：Docker 容器启动后立即退出（状态为 Exited）

- 原因：中间件端口冲突（如本地已启动 MySQL 占用 5432 端口）；
- 解决：停止本地占用端口的服务，或修改 `backend/docker-compose.yml` 中对应服务的端口映射（如将 `5432:5432` 改为 `5433:5432`）。

### 问题 4：build_install.sh 脚本编译失败（提示 “go: command not found”）

- 原因：Golang 环境变量未生效；
- 解决：Linux/macOS 执行 `source /etc/profile`，Windows 重新打开管理员 PowerShell，再重新执行脚本。

## 七、下一步操作建议

### 1. 基础开发：

- 后端：在 `backend/internal/service` 目录新增业务逻辑（如 “订单管理” 接口）；
- 前端：在 `frontend/src/views` 目录新增页面，对接后端接口（参考现有 “租户管理” 页面结构）。

### 2. 生产部署：

- 后端：用 `./script/build_install.sh` 编译二进制文件，配合 Systemd 配置开机自启；
- 前端：执行 `pnpm build` 生成静态文件，用 Nginx 部署（配置反向代理到后端接口）。

### 3. 寻求支持：

- 官方微信：`yang_lin_bo`（备注 “`go-wind-admin`”）；
- GitHub Issue：<https://github.com/tx7do/go-wind-admin/issues>（提交问题时附日志截图，便于定位）。

## 总结

通过项目自带的脚本，大部分环境配置与部署步骤都能 “一键完成”，避免了手动安装依赖的繁琐与出错风险。若后续需要修改代码或扩展功能，可基于此基础环境，聚焦业务逻辑开发即可。
