---
date: 2026-05-25
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
sticky: 10
---

# Go + Vue/React 全站开发实践

在企业中后台开发场景中，长期存在两大痛点：臃肿单体项目难以横向拓展，纯微服务架构对中小型团队过重；同时团队技术栈不统一，Vue、React 技术偏好并存，提升项目统一搭建成本。为解决以上问题，我基于 Go 语言打造双模后端基座，并配套三套差异化前端模板，封装出开箱即用的全栈脚手架 **GoWind Admin（风行）**。

本文从架构设计、技术选型、底层原理、工程化脚本、落地体验等维度，完整分享整套脚手架的全站开发实践。

---

## 一、整体架构设计

### 1.1 设计理念：一套代码，两种部署模式

后端基于 Kratos 微服务规范开发，创新性实现**单体/微服务双模适配**：既支持集群化微服务部署，满足大型业务拓展需求；也可直接编译为独立二进制文件，以单体模式运行。小团队可直接单体部署快速上线，后续业务增长无需重构，即可平滑拆分微服务。

前端采用多包独立开发模式，三套UI方案共享同一套OpenAPI，权限体系、业务逻辑、请求规范完全统一，仅UI层与基础模板存在差异，适配不同技术栈团队。

### 1.2 全栈技术栈

- **后端**：`Golang`、`go-kratos`、`Wire`、`Ent ORM` / `Gorm`、`MySQL`、`Redis`、`Docker`
- **公共基础能力**：`JWT 鉴权`、`Casbin` /`OPA` / `Zanzibar` 权限控制、`SSE 消息推送`、`Swagger 接口文档`
- **Vue Vben 版**：`Vue3` + `TypeScript` + `Vite` + `Ant Design Vue` + `Vben Admin`
- **Vue Element 版**：`Vue3` + `TypeScript` + `Vite` + `Element Plus`（轻量纯净版）
- **React 版**：`React19` + `TypeScript` + `Vite` + `React Router` + `Zustand` + `Ant Design V6` + `@ant-design/pro-components`（**无 UMI 框架**）

---

## 二、后端架构详解

### 2.1 为何选择 Kratos

市面上Go后台脚手架分为两类：原生裸写架构混乱、自研框架学习成本过高。Kratos 作为字节跳动开源微服务框架，具备标准化分层结构，强制遵循 **API层 → Service业务层 → Data数据层** 开发规范，配套统一错误处理、日志追踪、配置管理能力，从根源规避代码腐烂问题。

### 2.2 核心原理：微服务兼容单体部署

原生 Kratos 项目默认多服务拆分部署，我通过四点改造，实现双模无缝切换：

1. **依赖合并**：依托 Wire 一次性注入全部模块依赖，摒弃多服务独立初始化逻辑；
2. **端口复用**：所有内部服务统一挂载至同一 HTTP、GRPC 端口；
3. **配置隔离**：通过环境变量区分运行模式，单体模式禁用服务注册发现，微服务模式开启Consul注册中心；
4. **编译优化**：单体模式直接编译为单二进制文件，无需拆分多个镜像。

### 2.3 ORM 选型：Ent 替代 Gorm

项目舍弃传统 Gorm，主用 Ent ORM。相较于 Gorm，Ent 支持静态类型校验、自动化代码生成、数据表自动迁移，适配复杂数据表关联场景。同时封装通用数据操作基类，内置分页查询、软删除、批量操作、多租户自动过滤等能力，减少重复性CRUD编码。

### 2.4 多租户与权限体系

#### 2.4.1 多租户隔离

内置两种主流隔离方案，可按需自由切换：

- 共享库独立Schema：适配中大型SaaS项目；

- 共享库共享数据表：通过 `tenant_id` 字段隔离数据，轻量化易运维，为项目默认方案。

#### 2.4.2 双层权限管控

基于 Casbin 实现精细化权限管控，覆盖绝大多数企业级场景：

- **按钮/接口权限**：基于角色绑定菜单与API权限，双向拦截前端按钮、后端接口请求；
- **数据权限**：支持部门层级隔离，可配置用户查看全部数据、本级数据、下级数据。

---

## 三、三套前端方案解析

为适配不同团队技术偏好，我封装三套相互独立、零耦合的前端模板，统一全局请求、鉴权、权限指令，后端无需任何适配改造，开发者按需选用即可。

### 3.1 Vue3 + Vben Admin（主推完整版）

基于 Vben Admin 二次封装，保留动态路由、权限菜单、暗黑模式、全局弹窗等成熟能力，剔除冗余无用插件，简化目录结构。适合中大型Vue中后台项目、复杂业务系统开发。

### 3.2 Vue3 + Element Plus（轻量纯净版）

无重型上层框架，仅封装登录鉴权、基础请求、权限指令等核心能力。整体结构简洁、上手门槛极低，适配小型内部管理系统、简易运维后台。

### 3.3 React19 + Ant Design V6（无 UMI）

这也是开发者关注度最高的版本。市面上绝大多数 React 后台项目，依赖 Umi + ProComponents 一体化方案，框架侵入性强、黑盒逻辑多、自定义构建受限。

本项目 React 版本底层采用 **Vite + React19 + Zustand + React Router**，仅单独引入 `@ant-design/pro-components` 高阶组件，手动封装 ProTable、ProForm、ProLayout 等高频组件，完全适配 Ant Design V6 全新API。

#### 方案优缺点

- **优势**：构建逻辑透明、无框架绑定、可自由定制路由与构建配置、打包体积更小、适配全部部署环境；
- **劣势**：需手动封装路由鉴权、表格搜索等通用逻辑，项目初始化成本略高。

---

## 四、工程化与内置能力

### 4.1 跨平台自动化脚本

为解决多环境依赖安装繁琐、部署复杂的痛点，项目内置全套跨平台自动化脚本，覆盖 Windows、macOS、Linux 三大操作系统，一键完成环境初始化、中间件部署、服务托管，大幅降低上手门槛。脚本统一存放于 `backend/scripts`，分为三大模块：

- **env 环境配置**：一键安装 Go、Docker、Node、PM2、Protobuf 等运行/开发依赖；
- **docker 容器部署**：基于 Docker Compose 拉起 PostgreSQL、Redis、MinIO、Jaeger 等中间件；
- **deploy 服务托管**：依托 PM2 完成项目编译、进程守护、日志管理。

### 4.2 内置企业级通用模块

三套前端版本共享全套开箱即用功能，无需二次开发：用户角色管理、组织/部门/职位管理、SaaS多租户、动态菜单、接口权限、数据字典、定时任务、OSS文件上传、系统日志、站内消息中心等。

---

## 五、项目技术取舍

结合长期全栈开发经验，我在开发过程中定下四项核心原则，也是本项目的核心设计思路：

1. **不重复造轮子**：基于成熟开源框架二次封装，降低维护成本与学习成本；
2. **拒绝框架强绑定**：React 舍弃 UMI、Vue 精简冗余插件，所有组件可剥离、易迁移；
3. **优先适配中小团队**：以单体为主、微服务为辅，双模架构适配90%中小型项目；
4. **统一基础规范**：三套前端统一请求、错误码、鉴权规则，降低团队维护成本。

---

## 六、快速上手体验

### 6.1 环境脚本选型

- Linux / macOS 开发环境：`scripts/env/install_unix_dev.sh`
- Linux / macOS 生产环境：`scripts/env/install_unix_prod.sh`
- Windows 开发环境：`scripts/env/install_windows_dev.ps1`

### 6.2 Docker 两种部署模式

- **full_deploy 完整模式**：同步启动中间件+后端应用，适用于一键演示、生产部署；
- **libs_only 依赖模式（推荐）**：仅启动中间件，应用本地IDE运行调试，适配日常开发。

### 6.3 后端启动命令

#### Linux / macOS

```shell
# 赋予脚本执行权限
chmod +x scripts/**/*.sh

# 开发环境（推荐）
./scripts/env/install_unix_dev.sh
./scripts/docker/libs_only.sh
gow run admin

# 生产环境
./scripts/env/install_unix_prod.sh
./scripts/docker/full_deploy.sh

# PM2 进程托管（生产进阶）
./scripts/deploy/pm2_service.sh
```

#### Windows（PowerShell 管理员）

```powershell
# 放行脚本策略（首次仅需执行一次）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 初始化环境
.\scripts\env\install_windows_dev.ps1

# 本地开发
.\scripts\docker\libs_only.ps1
gow run admin

# 一键完整部署
.\scripts\docker\full_deploy.ps1
```

### 6.4 前端启动说明

前端统一存放于 `frontend/admin` 目录，依赖安装命令统一，启动命令差异化配置：

- React：目录 `frontend/admin/react`，启动命令 `pnpm dev`，本地端口：`7000`
- Vue Element：目录 `frontend/admin/vue-element`，启动命令 `pnpm dev`，本地端口：`3000`
- Vue Vben：目录 `frontend/admin/vue-vben`，启动命令 `pnpm dev:antd`，本地端口：`5666`

```shell
# 安装依赖
pnpm install

# React版本
cd frontend/admin/react
pnpm dev

# Vue3 Element版本
cd frontend/admin/vue-element
pnpm dev

# Vue3 Vben版本
cd frontend/admin/vue-vben
pnpm dev:antd
```

### 6.5 访问地址汇总

- **默认账号密码**：admin / admin

- **后端接口文档**：[https://api.demo.admin.gowind.cloud/docs/](https://api.demo.admin.gowind.cloud/docs/)

- **线上演示地址**：
    - React版（React19+Antd6，无UMI）：[https://react.admin.gowind.cloud](https://react.admin.gowind.cloud)
    - Vue Vben版（Vue3+Vben）：[https://vben.admin.gowind.cloud](https://vben.admin.gowind.cloud)
    - Vue Element轻量版（Vue3+Element Plus）：[https://ele.admin.gowind.cloud](https://ele.admin.gowind.cloud)

### 6.6 最佳实践

- 日常开发优先使用**libs_only** 模式，容器托管中间件、本地运行应用，便于断点调试；

- 生产环境推荐 **full_deploy + PM2** 组合，保障服务常驻、方便运维；

- 通过 `APP_ROOT` 环境变量自定义数据目录，实现多项目环境隔离，防止数据冲突。

---

## 七、写在最后

GoWind Admin 的开发初衷并非打造全能型重型框架，而是解决全栈开发中的高频痛点：用一套双模后端基座，兼容单体与微服务；配套三套前端模板，适配团队不同技术栈，从根源减少重复搭建、冗余配置等无效工作。

全站 Go+Vue/React 的开发模式，兼顾 Go 语言高性能、低资源占用的优势，同时给予开发者自由选择前端技术栈的权利，可直接用于企业中后台、SaaS平台、内部运维系统等各类项目。项目已基于MIT协议完全开源，欢迎Star、使用、提交PR共同完善。

**开源地址**：

- [https://github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- [https://gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)

**在线演示**：

- React版：https://react.admin.gowind.cloud
- Vben版：https://vben.admin.gowind.cloud
- Element版：https://ele.admin.gowind.cloud
