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

# GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：SSE 实时推送架构

> 管理系统的"实时"需求比想象中多：站内信到达要立即亮起铃铛、协同操作要互相感知、AI 对话要逐字流式输出。轮询能做但难看，WebSocket 重但得自己管心跳与重连。风行（GoWind Admin）选择了 Server-Sent Events——HTTP 之上的单向服务端推送，并把它做成了**独立网关 + 统一事件通道**的平台基础设施。本文拆解这套推送架构。

## 一、拓扑：推送是一个独立端口

SSE 服务独立监听 `:7789`，与 REST 的 `:7788` 分离：

```
业务 service ──publishNotification──▶ SSE 服务 (:7789 /events)
                                        ├─ HandleAuthorize：逐连接鉴权
                                        ├─ 流注册：streamID = userId
                                        └─ fan-out：同流全部订阅者（多设备/多标签页）
三端 SSEClient（fetch-event-source，自动重连）
        └─ `${SSE_URL}?stream=${自身 userId}`，on('notification', 刷新未读数)
```

独立端口的意义：推送连接是**长连接**，与短请求共用监听会在负载与超时配置上互相牵制；生产部署时 SSE 由独立的 nginx 反代网关承载（关闭 gzip 与全部代理缓冲——SSE 实时性的必要条件），REST 与推送各自扩容互不影响。

## 二、鉴权：streamID 用 userId，就必须校验归属

SSE 连接不走 REST 的认证中间件链，transport 自带逐连接鉴权：

1. **完整令牌校验**：JWT 验签 + 过期 + Redis 缓存吊销核对 + 封禁位——被强制下线的会话，推送连接下次重连即被拒；
2. **流归属强制校验**：URL 里 `?stream=<uid>` 声明的用户 ID 必须与令牌里的 userId 一致，否则 403。

第二条是安全关键：流 ID 用 userId（而非 token 字符串）是为了让同一用户的多设备共享一条流（以 token 为流 ID，多设备互相收不到推送）——但 userId 是可被任意构造的，**没有归属校验，用户 A 订阅 `?stream=<B的id>` 就能收走 B 的全部通知**。这条校验在架构上是强制的、不可移除的。

## 三、投递语义：落库优先，推送是增强

一个容易做错的取舍：消息到达时先落库还是先推送？风行的答案是**落库优先，推送 best-effort**：

- 收件记录先写库，推送是尽力而为的增强——用户离线（流不存在）或缓冲已满，`TryPublish` 立即跳过，不阻塞不重试；
- 离线用户重连后从收件箱接口补取数据，**前端从不假设推送可靠**；
- 这条语义换来的东西：推送链路永远不会拖垮业务写入，也不会因堆积产生内存压力。

**同一用户多设备**是免费获得的：fan-out 把事件投给该流的全部订阅者，生产方只管单次 publish。

## 四、事件契约：序列化格式是协议不是细节

事件 data 的编码固定为 protojson（与 REST 接口同形的驼峰 JSON）。这不是可"顺手换一个"的实现细节——换成标准库 `encoding/json`，键名变蛇形、枚举变数字、时间戳变成结构体对象，三端解析同时静默全断（不报错，只是通知永远不亮）。风行用测试钉死了这个契约。

新增事件类型有注册表约束：后端事件常量 + 三端事件名常量四处一起加，禁止在任何一端写裸字符串——防止单端漂移。

## 五、前端消费：三端同一套封装

三端各自持有同构的 SSE 客户端模块：`fetch-event-source`（原生 `EventSource` 不支持自定义 Header 携带凭证）+ 单例客户端 + 自动重连（5 秒）。订阅生命周期与登录会话绑定：登出即失效，重连被拒。

当前内置事件是 `notification`（站内信到达 → 顶栏铃铛未读数即时刷新），AI 流式对话的 `ai_chat_chunk` 复用同一条通道——**一条推送基础设施，多个业务消费**，这是把它做成平台设施而非站内信专属功能的回报。

## 结语

SSE 的选型哲学是"够用的实时"：单向推送场景下，它比 WebSocket 简单一半；独立网关、流归属校验、best-effort 投递、事件注册表这些工程决策，让"实时"从 demo 特性变成可运维的平台能力。

**项目地址**：<https://github.com/tx7do/go-wind-admin> / <https://gitee.com/tx7do/go-wind-admin>  
**在线演示**：<https://demo.admin.gowind.cloud>（前端）/ <https://api.demo.admin.gowind.cloud/docs/>（后端 Swagger）
