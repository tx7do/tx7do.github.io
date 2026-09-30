---
date: 2026-09-30
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
sticky: 10
---

# GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：脚本系统实战

> "新用户注册后自动发一封欢迎语""租户创建后写一条审计流水""每天凌晨清理一次过期文件"——这些小逻辑每个项目都有，但为它们走一遍「改代码 → 编译 → 发版」的流程，性价比低到令人发指。风行（GoWind Admin）内建了一套脚本级插件系统：用 JavaScript/Lua 写扩展逻辑，在管理页在线编辑、试运行、一键启用，**不发版、不重启、即时生效**。本文讲这套系统的扩展点、安全模型与管理页工作流。

## 一、先对号入座：什么需求该用脚本

风行把"行为扩展"分成三档，脚本系统卡在中间那一档：

| 需求形态 | 用什么 |
|---|---|
| 行为参数不同 | 字典 / 策略表等配置化能力（管理页配置） |
| **逻辑需要"写代码"，但不值得为此发版** | **脚本系统** |
| 深度改流程 / 高频热路径 / UI 扩展 | Fork 主干二开 |

边界同样明确：UI/页面扩展、复杂工作流编排、高 QPS 请求热路径、租户自写脚本（仅平台管理员可管理）**不在**脚本系统的能力范围内——知道边界在哪，比知道能干什么更重要。

## 二、五类扩展点：钩子、任务、事件、出站、试运行

### 1. 实体生命周期钩子（before / after）

平台在实体的写路径上暴露钩子点，命名 `<entity>.before_<op>` / `<entity>.after_<op>`（op = create / update / delete）。已登记实体：`user`、`tenant`、`role`、`internal_message`、`notification_channel`，新增实体登记一行即生效。

两类钩子的语义刻意不同：

- **before 钩子（同步，可否决）**：脚本 `return false` 或 `ctx.stop("命中风控规则")` 直接拒绝业务写入，业务侧收到 400 与否决原因——这是把风控、校验类规则外置到脚本的通道；
- **after 钩子（异步，只读旁路）**：独立 goroutine + 30s 超时 + panic 兜底，失败只记日志不影响业务——欢迎语、审计流水、通知类旁路逻辑的安全落点。

```lua
-- 自注册形态：新用户创建后做点什么（after 钩子）
local hook = require "kratos_hook"

hook.register("user.after_create", "新用户欢迎", function(ctx)
    local id = ctx.get("id")
    -- 只读旁路处理，别指望改写业务结果
    return true
end)
```

```lua
-- execute 形态：before 钩子做风控否决
function execute()
    local ctx = __get_ctx()
    local entity = ctx.get("entity")
    -- 风控判断……不合规时：
    -- ctx.stop("命中风控规则")  -- 业务侧收到 400 与此原因
    return true
end
```

### 2. 定时任务（asynq 任务桥）

脚本内 `task.register_handler(name, description, fn, opts)` 注册处理器（支持参数默认值、必填校验、超时与重试配置），再到「任务管理」页建一条 `script_task` 型周期调度记录（任意合法 cron + 载荷 `{"handler": "...", "params": {...}}`）即可周期执行。执行链由 asynq 任务队列调度，与平台自带的到期扫描、审计归档等系统任务走同一套基础设施。

### 3. 事件订阅与发布

进程内事件总线：`eventbus.subscribe / publish`，跨实例通知走 Redis pub/sub 自动重同步。

### 4. HTTP 出站（Webhook）

脚本可以主动外呼，护栏是全链路 fail-closed 的：

- **域名白名单**（环境变量 `SCRIPT_HTTP_ALLOWED_DOMAINS`，支持 `*.example.com` 通配）——**不设置 = 全部出站拒绝**；
- 环回地址 / 云元数据地址（`169.254.169.254` 等）硬禁；
- 重定向逐跳复检白名单（≤3 跳）、单请求超时上限 30s、请求/响应体各 ≤1MB；
- 脚本不可覆盖 `Host` / `User-Agent` 头。

```lua
-- 例：审批完成后回调企业 IM 机器人
local http = require "kratos_http"
local resp = http.post("https://open.example.com/webhook/xxx",
                       '{"msgtype":"text","text":{"content":"审批通过"}}',
                       "application/json")
if resp.status ~= 200 then log.error("回调失败: " .. tostring(resp.status)) end
```

### 5. AI 模块：脚本里调大模型

脚本内置 `ai` 模块——`ai.chat(content)` 用默认模型对话、`ai.chatWith(providerId, content)` 指定提供商，提供商复用「AI 提供商」管理页的配置，每次调用自动记用量流水。于是"客户投诉自动生成摘要""新用户 AI 欢迎语"这类小场景，十行脚本搞定。

## 三、安全模型：灵活不等于裸奔

| 语言 | 引擎 | 沙箱 | 定位 |
|---|---|---|---|
| Lua（推荐） | gopher-lua | 标准库白名单：base / table / string / math / coroutine；**禁用 os / io / debug** | 默认语言 |
| JavaScript | goja | 无沙箱 | 仅限平台管理员使用 |

再加上三条底线：**所有脚本执行串行化**（单 VM 正确性前提，杜绝并发竞态）；每次执行落 `sys_script_logs`（触发方式 / 版本 / 成败 / 耗时 / 错误）全程可审计；HTTP 出站全链路白名单 fail-closed。灵活性与安全性的平衡点找得很克制。

## 四、管理页工作流：先试跑，再启用

「系统管理 → 脚本管理」，四步闭环：

![](/assets/images/gowind-admin/scripts-list.png)

1. **新建/编辑脚本**：Monaco 编辑器，Lua/JS 高亮，语言一键切换（编辑器直接告诉你"gopher-lua，标准库白名单沙箱，推荐"），挂载钩子点自动补全；可勾选"关键脚本"——执行失败时中断钩子链。

![](/assets/images/gowind-admin/scripts-editor.png)

2. **试运行**：传 JSON 键值当上下文，在**一次性隔离引擎**中执行（不污染常驻引擎的 VM 与注册），返回成功/失败、错误详情与上下文快照——**先试跑再启用是习惯，不是可选项**。

![](/assets/images/gowind-admin/scripts-testrun.png)

3. **启用**：行内开关，即时生效。

4. **执行日志**：每次触发的触发方式（hook / test_run / 任务）/ 版本 / 成败 / 耗时 / 错误详情，支持清理 90 天前日志——线上脚本行为全部可追溯。

![](/assets/images/gowind-admin/scripts-logs.png)

## 五、多实例部署：数据库是事实源

脚本的事实源是数据库 `sys_scripts`（`version` 字段作热更新指纹）：变更后本实例即时重同步，其他实例经 Redis 频道自动收到通知重新加载——**多实例部署下改一处，全部实例热生效**，不需要任何广播脚本或重启编排。

## 结语

脚本系统的价值不在"能跑 Lua/JS"，而在它把扩展的**全生命周期**（编写、试运行、启用、审计、热更新）都收进了平台的安全轨道：沙箱限制文件与系统访问、出站白名单 fail-closed、执行串行化、全程落日志、先试跑再上线。业务的小逻辑不再需要发版，也不该以裸奔的方式实现。

**项目地址**：<https://github.com/tx7do/go-wind-admin> / <https://gitee.com/tx7do/go-wind-admin>  
**在线演示**：<https://demo.admin.gowind.cloud>（前端）/ <https://api.demo.admin.gowind.cloud/docs/>（后端 Swagger）
