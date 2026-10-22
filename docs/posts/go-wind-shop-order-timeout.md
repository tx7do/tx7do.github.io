---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - 电商
  - 订单系统
sticky: 10
---

# GoWind Shop 拆解：订单超时关单——一个事务里的四联动

> 本文回答一个问题：**用户下单后 30 分钟没付款，系统要收回什么、按什么顺序收、怎么防重防并发？"超时关单"这个电商标配功能，值得写 450 行吗？**

[GoWind Shop](https://github.com/tx7do/go-wind-shop) 的未支付订单 30 分钟自动过期（`ExpireOrderByTimeout`，约 150 行核心逻辑），是全仓库把"事务边界设计"体现得最完整的一条链路：**释放库存、状态推进、孤儿支付清理、优惠券返还四件事在一个数据库事务里完成**，外层有延迟任务的投递去重与幂等闸门。拆它之前先看它的对照面——下单事务，因为超时收回的每一样东西，都是下单时锁定的。

---

## 一、对照面：下单事务锁定了什么

`Create` 是一个 ent 事务里的八步（460 余行），与超时相关的有四步：

1. **行锁防超卖**：遍历购物车明细，每张 SKU 卡 `ForUpdate` 行锁 → 校验 `stock_qty >= qty` → 写 OrderItem → **锁内扣库存**。下单减模式（非支付减），超卖防护就是这个行锁加事务回滚；
2. **SKU 快照**：OrderItem 落 `sku_id/quantity/currency/unit_price` 快照 JSON——商品后续改价不影响已下单据；
3. **优惠券事务内核销**（`redeemCouponInTx`）：两张 ForUpdate 行锁（用户持券行 + 券模板行）内完成状态/币种/领取窗口/全局核销上限/**每人限用**（锁内 Count，防"领→用→退→再领"绕限）五重校验，`computeDiscount` 算抵扣，券翻 USED 并回写 `redeemed_order_id`；
4. **金额五件套**：`total_amount`（折后应付，支付与退款取此值）/ `original_amount`（折前审计）/ `discount_amount` / `shipping_fee` / `tax_amount` 全部独立成列——对账的每一分钱都有独立来源。

订单状态被**强制**置 `PENDING_PAYMENT`（忽略客户端传入），提交事务后才投递超时任务——这个顺序保证任务处理时数据必然已提交（与 ERP 篇的 defer LIFO 是同一个道理的另一种写法）。

所以超时关单要收回的清单，就是这四步锁定的资源：**库存占用、USED 状态的券、PENDING_PAYMENT 状态本身，以及一个悬空的支付窗口**。

---

## 二、投递侧：延迟任务的防重与去重

超时任务走 asynq 延迟投递，投递侧有两道防重：

```go
taskId := task.CreateOrderTimeoutTaskID(orderId)   // order_timeout:{orderId}
asynq.TaskID(taskId),        // 同订单重复投递会被 asynq 按 TaskID 去重
asynq.Unique(OrderPendingTTL),                     // TTL 内同 payload 只投一次
```

`TaskID` 是全局幂等键——手动重发、重试、多入口触发同一家订单的超时任务，asynq 按 ID 去重只留一份。`Unique(TTL)` 按 payload 再兜一层。这两道是**投递侧防重**：同一个超时事件不会变成两个任务。但它们防不住"任务执行到一半进程崩溃后重投"——那是**执行侧幂等**的职责，下一节。

一个值得记录的工程决策：为什么用延迟任务而不是定时扫描（扫出所有到期未付订单）？延迟任务的语义是"下单时刻就预约好了关单时刻"，到期即触发、无扫描周期延迟；代价是 Redis 里躺着大量延时任务。GoWind 系两个项目恰好各选了一边（ERP 的发布兜底用的就是每分钟扫描自愈网）——**任务量可控且时刻精确的选延迟任务，任务量大且容忍分钟级延迟的选扫描**，两条路线没有对错，但必须知道自己选的是哪条、失败模式是什么。

---

## 三、执行侧：一个事务里的四联动

`ExpireOrderByTimeout` 的第一步是**幂等闸门**：只处理 `PENDING_PAYMENT` 状态的订单——任务重投、订单已被人工取消、或并发已被推进，都在这道闸门处静默返回。之后的四步在一个 ent 事务内：

1. **释放库存**：`AddStockQty` 回补下单时锁定的量（下单减模式的归还路径）；
2. **状态推进**：批量 Update 带 `status IN (PENDING_PAYMENT)` 前置条件——0 行受影响即并发已被推进，静默跳过（与执行侧幂等闸门呼应，双保险）；
3. **孤儿支付清理**：查该订单的支付流水，把已 SUCCEEDED 的翻 FAILED。这是四步里最反直觉的一步——**支付成功了订单却超时了**（用户付款瞬间网络抖动、回调延迟），这种悬空状态必须主动消除，否则用户"付了钱却看到订单已取消"且永远等不到发货；
4. **优惠券返还**（`restoreCouponInTx`）：按下单时回写的 `redeemed_order_id` 反查券行，翻回 UNUSED、模板 `redeemed_count--`——券的核销与返还是精确的镜像操作。

第三步的合法性有一个专门的状态机口子：支付流水的常规迁移只允许 `PENDING→SUCCEEDED/FAILED`、`SUCCEEDED→REFUNDED`，**`SUCCEEDED→FAILED` 这条"支付成功翻失败"是 SystemViewer 系统上下文专属的特权路径**（运行时判断 viewer 来源），注释明说是孤儿清理专用——**为系统补偿开的口子必须收窄到特定的调用身份**，否则状态机的承诺会被旁路稀释。

退款链路还有一个对称的补偿纪律值得记录：退款成功后的联动（订单翻 REFUNDED、回补库存）若失败，会把退款记录**补偿回滚到 PENDING** 重试——注释坦承这是"有意绕过退款状态机的特权操作"。补偿动作污染状态机是分布式一致性的常见暗坑，这里的处理是承认它、注释它、收窄它。

---

## 四、状态机：expected_status 前置条件的强制化

贯穿下单、支付、关单、发货、退款全链路的并发纪律是：**任何状态变更必须携带 `expected_status` 前置条件**。订单状态机本身很小（PENDING_PAYMENT→PAID/CANCELLED；PAID→FULFILLED/CLOSED；FULFILLED→CLOSED，终态吸收），但所有变更都走"条件更新 + 前置状态校验"：

- 违反迁移表 → 拒绝；
- 前置状态不符（并发已被推进）→ 0 行受影响，调用方按"已被处理"静默跳过。

管理端 BFF 甚至为每个操作补齐了 core 侧期望的前置集合（发货带 `[PAID]`、关闭带 `[PAID, FULFILLED]`）——**BFF 与 core 的状态机衔接靠显式的期望值传递，而不是靠 core 隐式宽容**。这套纪律让"四联动"里的每一步条件更新都有统一的失败语义：0 行 = 时机已过，静默退出。

---

## 五、结语

超时关单的复杂度清单其实很短：**投递去重（TaskID + Unique）、执行幂等（状态闸门 + 前置条件）、四联动同事务（库存/状态/支付/券一起收）、特权口子收窄（SystemViewer）**。四样东西没有一样新鲜，新鲜的是它们被组织成了一个没有缝隙的闭环——每一层都假设上一层会失效，且失效后的行为是定义过的。

三条可迁移的经验：

1. **超时收回的清单 = 下单时锁定的资源清单**——写下单事务时就要回答"这些占用怎么归还"，四联动不是超时功能的实现细节，是下单设计的义务；
2. **延迟任务与定时扫描是两条各有失败模式的路线**——选了延迟任务就要处理"任务丢失"的兜底语义（本项目的答案：TaskID 去重 + 状态闸门让重投无害），选了扫描就要处理扫描周期的精度与重复触发；
3. **补偿性的状态回退要开显式的特权口子**——用调用身份收窄 + 注释声明，别让状态机的常规迁移表默默包含系统专用的边。

仓库（下单与超时在 `backend/app/core/service/internal/service/order_service.go`，任务定义 `backend/pkg/task/order_timeout.go`）：

- GitHub：[github.com/tx7do/go-wind-shop](https://github.com/tx7do/go-wind-shop)
- Gitee：[gitee.com/tx7do/go-wind-shop](https://gitee.com/tx7do/go-wind-shop)
