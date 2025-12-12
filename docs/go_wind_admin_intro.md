# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：介绍

风行（GoWind Admin）是一款开箱即用的企业级Golang全栈中后台管理框架，品牌slogan：`让中后台开发如风般自由`。

系统后端基于GO微服务框架[go-kratos](https://go-kratos.dev/)，前端基于Vue微服务框架[Vben Admin](https://doc.vben.pro/)，兼顾微服务的扩展性与单体部署的便捷性。

尽管依托微服务框架设计，但系统前后端均支持单体架构模式开发与部署，灵活适配不同团队规模及项目复杂度需求，平衡灵活性与易用性。

产品具备上手简易、功能完备的核心优势，依托风行对企业级场景的深度适配能力，可助力开发者快速落地各类企业级管理系统项目，大幅提升开发效率。

## 演示地址

> 前端地址：<http://124.221.26.30:8080/>
> 
> 后端Swagger地址：<http://124.221.26.30:7788/docs/>
> 
> 默认账号密码: `admin` / `admin`

## 风行·核心技术栈

秉持高效、稳定、可扩展的技术选型理念，系统核心技术栈如下：

- 后端基于 [Golang](https://go.dev/) + [go-kratos](https://go-kratos.dev/) + [wire](https://github.com/google/wire) + [ent](https://entgo.io/docs/getting-started/)
- 前端基于 [Vue](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Ant Design Vue](https://antdv.com/) + [Vben Admin](https://doc.vben.pro/)

## 风行·快速上手指南

### 后端

一键安装`golang`和`docker`等前置依赖：

```bash
# Ubuntu
./backend/script/prepare_ubuntu.sh

# Centos
./backend/script/prepare_centos.sh

# Rocky
./backend/script/prepare_rocky.sh

# Windows
./backend/script/prepare_windows.ps1

# MacOS
./backend/script/prepare_macos.sh
```

一键安装三方组件和`go-wind-admin`服务：

```bash
./backend/script/docker_compose_install.sh
```

### 前端

#### 1. 安装 Node.js（npm 随 Node.js 自带）：

访问Node.js官方下载页：<https://nodejs.org/>，下载对应系统（Windows/macOS/Linux）的LTS稳定版本并安装。

安装完成后，打开终端/命令提示符，输入以下命令验证安装成功：

```bash
node -v  # 输出Node.js版本号即成功
npm -v   # 输出npm版本号即成功
```

#### 2. 安装 pnpm：

```bash
npm install -g pnpm
```

#### 3. 启动前端服务：

进入 frontend 目录，执行以下命令，完成前端依赖安装、编译并启动开发模式：

```bash
pnpm install
pnpm dev
```

### 访问测试

- 前端地址：<http://localhost:5666>， 登录账号：`admin`，密码：`admin`
- 后端文档地址：<http://localhost:7788/docs/openapi.yaml>

## 风行·核心功能列表

| 功能   | 说明                                                                       |
|------|--------------------------------------------------------------------------|
| 用户管理 | 管理和查询用户，支持高级查询和按部门联动用户，用户可禁用/启用、设置/取消主管、重置密码、配置多角色、多部门和上级主管、一键登录指定用户等功能。 |
| 租户管理 | 管理租户，新增租户后自动初始化租户部门、默认角色和管理员。支持配置套餐、禁用/启用、一键登录租户管理员功能。                   |
| 角色管理 | 管理角色和角色分组，支持按角色联动用户，设置菜单和数据权限，批量添加和移除员工。                                 |
| 组织管理 | 管理组织，支持树形列表展示。                                                           |
| 部门管理 | 管理部门，支持树形列表展示。                                                           |
| 权限管理 | 管理权限分组、菜单、权限点，支持树形列表展示。                                                  |
| 接口管理 | 管理接口，支持接口同步功能，主要用于新增权限点时选择接口，支持树形列表展示、操作日志请求参数和响应结果配置。                   |
| 字典管理 | 管理数据字典大类及其小类，支持按字典大类联动字典小类、服务端多列排序、数据导入和导出。                              |
| 任务调度 | 管理和查看任务及其任务运行日志，支持任务新增、修改、删除、启动、暂停、立即执行。                                 |
| 文件管理 | 管理文件上传，支持文件查询、上传到OSS或本地、下载、复制文件地址、删除文件、图片支持查看大图功能。                       |
| 消息分类 | 管理消息分类，支持2级自定义消息分类，用于消息管理消息分类选择。                                         |
| 消息管理 | 管理消息，支持发送指定用户消息，可查看用户是否已读和已读时间。                                          |
| 站内信  | 站内消息管理，支持消息详细查看、删除、标为已读、全部已读功能。                                          |
| 个人中心 | 个人信息展示和修改，查看最后登录信息，密码修改等功能。                                              |
| 缓存管理 | 缓存列表查询，支持根据缓存键清除缓存。                                                      |
| 登录日志 | 登录日志列表查询，记录用户登录成功和失败日志，支持IP归属地记录。                                        |
| 操作日志 | 操作日志列表查询，记录用户操作正常和异常日志，支持IP归属地记录，查看操作日志详情。                               |

## 风行·后台截图展示

- 后台用户登录界面

![后台用户登录界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_login_page.png)

- 后台分析界面

![后台分析界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_dashboard.png)

- 租户管理界面

![租户管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_tenant_list.png)

- 租户创建界面

![租户创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_tenant_create.png)

- 用户管理界面

![用户管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_user_list.png)

- 用户创建界面

![用户创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_user_create.png)

- 组织管理界面

![组织管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_organization_list.png)

- 组织创建界面

![组织创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_organization_create.png)

- 部门管理界面

![部门管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_department_list.png)

- 部门创建界面

![部门创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_department_create.png)

- 职位管理界面

![职位管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_position_list.png)

- 职位创建界面

![职位创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_position_create.png)

- 角色管理界面

![角色管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_role_list.png)

- 角色创建界面

![角色创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_role_create.png)

- 后台目录管理界面

![后台目录管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_menu_list.png)

- 后台目录创建界面

![后台目录创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_menu_create.png)

- 调度任务管理界面

![调度任务管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_task_list.png)

- 调度任务创建界面

![调度任务创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_task_create.png)

- 数据字典管理界面

![数据字典管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_dict_list.png)

- 数据字典条目创建界面

![数据字典条目创建界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_dict_entry_create.png)

- API资源管理界面

![API资源管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_api_resource_list.png)

- 登录限制管理界面

![登录限制管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_login_restriction_list.png)

- 后台登录日志列表界面

![后台登录日志列表界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_login_log_list.png)

- 后台操作日志列表界面

![后台操作日志列表界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_operation_log_list.png)

- 站内信消息管理界面

![站内信消息管理界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_internal_message_list.png)

- 站内信消息发布界面

![站内信消息发布界面](https://tx7do.github.io/assets/images/go_wind_admin/admin_internal_message_publish.png)

- 后端内置Swagger UI界面

![后端内置Swagger UI界面](https://tx7do.github.io/assets/images/go_wind_admin/api_swagger_ui.png)

## 风行(Go Wind Admin)·项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
