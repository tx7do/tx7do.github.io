---
date: 2026-10-01
category:
  - Rust编程
tag:
  - Rust
  - RushWind
  - 中后台
  - 开源项目
sticky: 10
---

# RushWind Admin — 用 Rust 写的企业级中后台，开源了

> 中后台大概是世界上被写得最多、也最不被认真对待的软件品类：几乎每家公司都要再写一遍用户、角色、租户、审计，写完还要为它们的安全性、性能与多前端适配反复买单。更麻烦的是，这块代码谁都不敢动——它不产生差异化价值，却出不起事故。**RushWind Admin**（中文名：锐风）把这套底座用 Rust 完整做了一遍：112 个 proto 契约文件、构建期生成 203 条路由、六类审计日志、存储层多租户隔离、TOTP 多因素认证、异步任务队列、SSE 实时推送、脚本级插件系统，外加 React / Vue Element / Vue Vben 三套前端共享同一份生成客户端。本文是它的自我介绍；至于"Go 写业务、Rust 扛平台"的混合架构论证，另有一篇硬核文专门展开。

## 一、它是什么

一句话定位：**以 Protobuf 契约为唯一事实源、用 Rust 实现的企业级中后台平台**。

| 层 | 选型 |
|----|------|
| 后端 | Rust（edition 2021）· RushWind 框架 · axum · tokio |
| 契约链 | Protobuf · protoc + protox 双编译器 · 构建期确定性生成（路由 / 错误表 / 接口 / 挂载） |
| 存储 | SeaORM · PostgreSQL · Redis · S3 / MinIO |
| 认证 | JWT RS256 非对称双钥 · 双 Cookie 刷新轮换 · Redis 会话白名单吊销 |
| 前端 | React 19（Ant Design V6）· Vue 3 Element Plus · Vue 3 Vben（Ant Design Vue），三端共享字节相同的生成客户端 |
| 文档 | 服务内置 OpenAPI，Swagger UI / ReDoc 开箱即用，无需另建文档站 |
| 质量门禁 | fmt / clippy / test / 契约同步四道 CI 门（ubuntu + windows 矩阵）· 依赖审计 · 差分回归台架 |

两个设计立场贯穿整个项目，先摆在前面：

**立场一：API 层是编译产物，不是手写目录。** 路由、错误码、参数绑定、前端客户端，全部从 proto 契约构建期生成。契约变了，产物重算；契约没变，产物字节稳定。手写路由会漂移、文档会腐化，编译产物不会。

**立场二：平台能力做厚，业务侵入为零。** 这里只有"任何系统都需要"的东西——认证、权限、租户、审计、消息、任务、文件。它不规定你的业务怎么写，也不需要你的业务代码参与它的编译；反过来，你的业务系统通过同一份契约消费它，甚至感知不到它是 Rust 写的。

## 二、先看它有什么

| 分组 | 能力清单 |
|------|---------|
| 组织与权限 | 用户 / 角色 / 权限点 / 菜单 / 组织 / 职位 / 租户 / 套餐配额；多租户、多角色、多部门，菜单、按钮、数据行、字段四级权限粒度 |
| 认证与会话 | 用户名 / 邮箱 / 手机号多标识登录；图形验证码、登录失败限流（IP + 用户名双维）、可配置登录策略（CIDR / 时间窗 / 设备）、TOTP 多因素、找回密码、AK/SK 机器凭证 |
| 审计与合规 | 登录 / 操作 / API / 数据访问 / 权限变更 / 策略评估六类审计流，IP 归属地与 trace_id 全程留痕，留存 180 天 + JSONL 归档，按等保 2.0 技术要求对表设计 |
| 系统功能 | 字典、平台参数（多实例缓存广播失效）、任务调度（Postgres 队列 + cron）、文件（S3 / MinIO）、通知渠道、站内信（SSE 实时到达）、脚本系统（Lua / JS 生命周期钩子）、多语言、服务与 Redis 监控 |

表格是索引，下面把几个平时要团队磨几周、这里开箱即有的点说透。

### 认证是一条纵深防御链，不是"验密码、发 token"

看一条登录请求 `POST /admin/v1/login` 背后依次发生的事：

1. **图形验证码**先行校验——服务端渲染 PNG、答案存 Redis、一次性消费。自动化脚本的第一道减速带；
2. **登录失败限流**：IP 与用户名双维度计数（Redis + Lua 原子扣减），连续失败进入冷却窗口，撞库脚本的成本被拉高几个数量级；
3. **登录策略**匹配：目标用户命中的限制策略（IP 段、时间窗、设备）直接拒绝，并留下拒绝原因供审计回溯；
4. **口令解密与校验**：口令在应用层 AES 加密后才进传输层（不是明文过 HTTPS 了事），服务端解密后 bcrypt 比对——且对不存在的用户做**恒时假校验**，让"探测哪些用户名存在"在时间侧信道上变成统计学噪音；
5. **TOTP 多因素**（如已绑定）：签发短时效登录挑战，错误次数超限即锁定；
6. **登录风控评分**：失败次数、未知用户、缺失设备或 IP、内网来源等因素加权评分，LOW / MEDIUM / HIGH 三档随登录审计落库——安全团队有了分档告警的抓手；
7. **签发双令牌**：RS256 非对称签名的 access token 走响应体；refresh token 走 HttpOnly Cookie（Path 锁定到刷新端点），配套一张非 HttpOnly 的过期时间 Cookie 供前端感知会话寿命。`SameSite=Lax`，TLS 环境自动 `Secure`；
8. **会话白名单**：Redis 登记本次会话。**登出即吊销**——旧 token 的下一次请求立刻 401，不存在"等它自然过期"的裸奔窗口。

八步走完，密码学部件各就各位：传输层有 AES、存储层有 bcrypt、签名层有 RS256，谁也不用兼职谁的工作。

### 多租户隔离做在存储层，不靠服务层自觉

多租户系统最怕的不是没有隔离，而是"靠每个开发者记得加租户条件"的隔离。RushWind Admin 把隔离压到存储层：

- **读**：查询自动注入租户过滤，租户视图只见本租户，平台视图全见——写业务查询的人想漏都漏不掉；
- **写**：防伪造租户字段，更新与删除强制携带租户谓词，跨租户的 UPDATE / DELETE 语句在数据库层面就执行不出去；
- **面**：租户请求再按 `(路径模板, 方法)` 查接口表做 fail-closed 校验——**没登记的路由默认拒绝**，而不是默认放行。新加的路由忘了配权限点，生产环境不会替你兜底；
- **商业层**：套餐模块白名单控制租户能用哪些模块，套餐到期自动进入只读态（读放行、写拒绝）；
- **初始化**：新增租户自动建好部门、默认角色与管理员，开箱即用。

### 审计是六类流，不是一张日志表

多数系统的"审计"是一张 operation_log 表。等保 2.0 的口径下这远远不够，RushWind Admin 按数据类型拆了六条流：

**登录**（带风控加权评分分档）、**操作**（资源定位 + 请求快照）、**API**（操作者 / 路径 / 方法 / 结果）、**数据访问**（SQL 词法脱敏 + 自动提取涉及表与数据分类）、**权限变更**（操作者 / 目标 / 原因）、**策略评估**（每次鉴权判定落一行，带评估上下文与 trace_id）。

所有流统一带 IP 归属地与 trace_id；留存与归档策略可调，默认库内 180 天、超期导出 JSONL 归档文件留痕。排障时用 trace_id 把六条流串起来，"谁在什么时候为什么被拒绝"是一行查询的事。

### 平时看不见的底盘

- **任务调度**：Postgres 队列（指数退避、死信标记）+ cron 生产者（分钟对齐、类型去重），管理页可启停、立即执行、查看运行日志——不引入 Redis 队列外的第三种基础设施；
- **SSE 推送**：独立网关端口承载事件流，token 三种方式携带、按用户严格过滤，站内信实时到达、已读状态可查；
- **脚本系统**：Lua / JavaScript 脚本挂在实体生命周期上（before 可否决、after 异步执行），也能做定时任务与 HTTP 出站（域名白名单 fail-closed）；数据库是事实源，管理页改完即时生效，不用发版；
- **参数管理**：平台级键值参数，服务侧经缓存读取，多实例部署下变更经 Redis 发布订阅广播失效——参数改了，所有实例同时知道；
- **文件服务**：S3 / MinIO 五类内容桶 + 签名图片代理，上传自动嗅探 MIME 覆写客户端声明；
- **AK/SK 机器凭证**：租户级 AccessKey / SecretKey，Secret 仅创建时一次性展示，轮换后旧密钥立即失效，机器令牌仅签发租户作用域的访问令牌。

## 三、界面预览：真跑起来的样子

以下截图取自真实运行环境——本仓后端（REST :7788）与 React 版前端，数据是种子库的真实数据，没有为截图专门造数。

**登录**——图形验证码 + 租户编号（留空为平台登录），口令在应用层加密后才进传输层：

![登录——图形验证码与租户编号](/assets/images/rushwind-admin/console-login.png)

**仪表盘**——用户 / 角色 / 今日登录 / 审计条数的实时统计，含登录趋势与占比分布：

![仪表盘——实时统计与趋势图表](/assets/images/rushwind-admin/console-dashboard.png)

**用户管理**——组织树联动 + 高级查询，多角色、多部门、主管与状态配置：

![用户管理——组织树与高级查询](/assets/images/rushwind-admin/console-users.png)

**菜单管理**——目录 / 菜单 / 按钮三类节点，权限标识与路由、组件路径一一对应：

![菜单管理——三类节点与权限标识](/assets/images/rushwind-admin/console-menus.png)

**操作审计日志**——操作类型、资源定位与请求 ID 全程留痕，成功失败均可追溯：

![操作审计——全程留痕可追溯](/assets/images/rushwind-admin/console-op-audit.png)

**在线用户**——会话与设备视图，支持强制下线：

![在线用户——会话与设备视图](/assets/images/rushwind-admin/console-online.png)

管理端之外，后端自带 API 文档服务（`server.yaml` 的 `enable_swagger` / `enable_redoc` 开关，原始规格见 `/q/openapi.yaml`）——**Swagger UI** 全量接口按服务分组、可直接在线调试；**ReDoc** 三栏式阅读视图，参数说明与请求 / 响应示例并列。这两份文档不是另行维护的文档站，就是前面说的契约生成物本身。

![Swagger UI——全量接口按服务分组](/assets/images/rushwind-admin/swagger-ui.png)

![ReDoc——三栏式接口文档](/assets/images/rushwind-admin/redoc.png)

## 四、为什么中后台值得用 Rust

很多团队对 Rust 的想象停留在"系统编程语言"，离业务很远。但中后台恰好有一块非常 Rust 的内核——**平台层**：

1. **鉴权门在每条路由上**。203 条路由条条要过"验签 → 接口表 fail-closed → 租户状态与套餐检查 → 动态 RBAC"四阶段，这是纯 CPU 的热路径，不产生业务价值，却对每个请求计税。Rust 把这笔税压到最低——QPS 越高，省得越多。
2. **尾延迟可预算**。没有 GC，就没有停顿窗口与标记辅助；P99 不取决于"这一批请求里谁分配得多"。对一个每请求都要做权限判定的服务，可预测性本身就是特性。
3. **内存安全直接缩小漏洞面**。审计日志、口令哈希、密钥管理这类模块，一个内存错误的代价是数据泄露。Rust 在编译期把整类问题挡掉，安全审计的检查清单跟着变短。
4. **部署密度**。平台服务往往被每个业务系统部署一份，内存驻留的差距乘以副本数，就是实打实的账单。

诚实地说另一半：**业务编排层不必 Rust**。组织机构怎么算、报表怎么拼、流程怎么编排——这些天天变的东西，Go / Java / Node 都比 Rust 舒服，硬上 Rust 是让最贵的变更摩擦落在最频繁变更的地方。所以本项目的推荐用法从来不是"全栈 Rust"，而是"平台层 Rust，业务层随意"——两种语言的进程通过同一份 proto 契约互通。具体怎么拆、边界画在哪、四种集成模式的取舍，见 [Go 写业务，Rust 扛底盘：一套可落地的混合架构](https://tx7do.github.io/posts/go_rust_hybrid_architecture.html)。

## 五、架构一瞥

```
                    ┌──────────────────────────────────────┐
                    │        proto 契约（唯一事实源）          │
                    │    112 文件 · 16 模块 · 197 条主绑定     │
                    └──────────────────┬───────────────────┘
                                       │ 构建期确定性生成
             ┌─────────────────────────┼─────────────────────────┐
             ▼                         ▼                         ▼
     203 条路由 + 免鉴权白名单      441 条错误状态映射         198 个服务接口
             │                         │                         │
             └───────────┬─────────────┴─────────────────────────┘
                         ▼
   ┌─────────────────────────────────────────────────────────────┐
   │               admin-api（Rust · axum · tokio）                │
   │    鉴权门（认证 → 租户 → 授权）· 服务实现 · 审计层 · 参数缓存      │
   └───────┬────────────┬───────────────┬───────────────┬────────┘
           ▼            ▼               ▼               ▼
      REST :7788    SSE :7789     任务队列 worker    cron 生产者
           │            │               │
           └─────┬──────┴───────┬───────┘
                 ▼              ▼
            PostgreSQL        Redis
                 ▼
              S3/MinIO

   前端：React / Vue Element / Vue Vben ← 同一份生成客户端，零改动换后端
```

一次启动拉起四个服务面：REST 网关（:7788，203 条路由 + 8 个免鉴权端点）、SSE 推送网关（:7789）、任务队列 worker 与 cron 生产者——共享同一个生命周期，配置驱动装配，信号统一收敛退出。

## 六、契约先行：换后端语言，前端一行不改

Protobuf 是唯一 API 契约。构建期从契约确定性生成四样东西：**203 条路由**（含 additional_bindings）、**441 条错误 reason → HTTP 状态映射**、**198 个服务接口方法**、逐路由的参数绑定计划——后端零手写路由；前端 TypeScript 客户端同样由契约生成，三套前端拿到的客户端**字节相同**。

跨语言最容易翻车的两处序列化语义（64 位整数在 JSON 里的字符串化、proto3 presence 字段未设置时的省略行为），用金样测试钉死；错误信封是统一的四字段 protojson（`code / reason / message / metadata`），前端与任何语言的服务端消费者看到的形状一致。

更进一步：同一份契约在 Go 与 Rust 两个后端栈上各有一套实现，差分台架对全量路由 + HEAD 探针自动 sweep、逐字节比对响应——**契约兼容不是文档承诺，是 CI 里跑的回归**。这条工程线的完整拆解（生成器暗礁、序列化金样、豁免治理）见 [契约驱动：203 条路由零手写的工程化拆解](https://tx7do.github.io/posts/rushwind_admin_contract_driven.html)。

## 七、质量门禁

CI（ubuntu + windows 双平台矩阵）跑四道门：`cargo fmt` / `cargo clippy -D warnings` / `cargo test` / 契约同步校验，外加 `cargo-deny` 依赖审计（许可证与已知漏洞通报）。

再往前一步是差分回归台架：compose 拉起中间件与 Go / Rust 双栈后端，对 203 条路由 + 89 条 HEAD 自动 sweep 逐字节比对，豁免须显式登记——四类豁免各有名目，review 时看得见理由。它专治一类事故：**"我只是升级了个依赖/重构了下生成器，行为怎么就变了"**。

## 八、快速开始

后端以同级克隆布局引用框架仓与工具库仓：

```shell
# Gitee（国内直连）
git clone https://gitee.com/tx7do/rushwind
git clone https://gitee.com/tx7do/rust-utils
git clone https://gitee.com/tx7do/rushwind-admin

# 或 GitHub
git clone https://github.com/tx7do/rushwind
git clone https://github.com/tx7do/rust-utils
git clone https://github.com/tx7do/rushwind-admin

cd rushwind-admin/backend
cargo run -p admin-api   # REST :7788；启动时自动迁移建表、播种演示数据
```

前置要求：Rust stable、protoc、PostgreSQL、Redis（MinIO 可选）。数据库连接等配置位于 `backend/services/admin-api/assets/`，支持环境变量覆盖。仓库内嵌的 JWT 密钥是演示密钥，生产部署务必更换。

React 版前端随仓维护，dev 代理默认指向本仓后端，零配置直连：

```shell
cd rushwind-admin/frontend/admin/react
pnpm install
pnpm dev                 # :5888，代理转发至 REST :7788
```

服务起来后 API 文档开箱即用：`/q/swagger-ui`（全量接口按服务分组、可在线调试）、`/q/redoc`（三栏式文档）、原始规格 `/q/openapi.yaml`。

## 九、在线演示

| 前端版本 | 演示地址 |
|---------|--------|
| Vue3 Vben | <https://vben.admin.gowind.cloud> |
| Vue3 Element Plus | <https://ele.admin.gowind.cloud> |
| React | <https://react.admin.gowind.cloud> |

- 后端 Swagger：<https://api.demo.admin.gowind.cloud/docs/>
- 默认账号密码：`admin` / `Abcd@1234`

## 十、相关链接

- **rushwind-admin** —— 本项目（后端 + React 前端 + 契约与台架）：[Gitee](https://gitee.com/tx7do/rushwind-admin) ｜ [GitHub](https://github.com/tx7do/rushwind-admin)
- **rushwind** —— RushWind 框架 monorepo（http / http-binding / authn / transport / gen-http / bootstrap 等 crate），本项目的底座：[Gitee](https://gitee.com/tx7do/rushwind) ｜ [GitHub](https://github.com/tx7do/rushwind)
- **rust-utils** —— 工具库（查询语法解析等）：[Gitee](https://gitee.com/tx7do/rust-utils) ｜ [GitHub](https://github.com/tx7do/rust-utils)
- [掘金专栏](https://juejin.cn/column/7541283508041826367) —— 系列文章持续更新

系列文章：

- 下一篇：[契约驱动：203 条路由零手写的工程化拆解](https://tx7do.github.io/posts/rushwind_admin_contract_driven.html)
- 硬核向：[Go 写业务，Rust 扛底盘：一套可落地的混合架构](https://tx7do.github.io/posts/go_rust_hybrid_architecture.html)——Go 的 GC 到底交多少税、Rust 的优势边界在哪、四种集成模式怎么选。
