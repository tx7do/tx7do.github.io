---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - 实时协作
  - 算法
sticky: 10
---

# GoWind Kanban 拆解：看板拖拽背后——LexoRank、乐观锁与尽力而为广播

> 本文回答一个问题：**把一张卡片从"进行中"拖到"已完成"的第三行，要让所有在线用户的屏幕一致地变化——排序、并发、同步这三件事分别怎么解？**

[GoWind Kanban](https://github.com/tx7do/go-wind-kanban)（风行看板）的实时协作没有用 CRDT、没有用协同算法库，是"服务端权威排序 + 乐观锁 + 尽力而为广播 + 差量兜底"的四层务实组合。这篇拆这四层，外加一条 WebSocket 准入的安全演进线。

---

## 一、排序：LexoRank，字典序字符串的伸缩之道

看板排序的经典难题：卡片插到两行之间时，新卡片的顺序值从哪来。候选方案的缺陷都很出名——浮点序号会在密集插入后精度耗尽；整数序号插入头部要全列改写；链表方案查询排序要遍历。

GoWind Kanban 的答案在 `pkg/lexorank/lexorank.go`（纯算法零依赖，自带测试），包注释直接点名师承："Jira/Asana 同款思路"。**顺序值是一个 base-36（0-9a-z）变长字符串，字典序即显示序**。`Between(low, high)` 在相邻两卡的 rank 之间取一个字典序中点，三种情形：

1. **间隙充足**：直接取中点（`"a"..."z"` 之间给 `"m"`）；
2. **前缀延伸**：低值是高值的前缀（`"ab"` 与 `"abd"` 之间），向下延一位（如 `"abc"`）；
3. **相邻分叉**：两值相邻且等长（`"ab"` 与 `"ac"`），追加中点字符（`"abz"` 一类的分叉延伸）。

键空间耗尽的处理同样有界：`MaxLen = 20`（36^20 的空间远超任何现实列基数），中点计算超过长度即视为耗尽，调用方对整列执行 `Rebalance`——按定长网格均匀重铺全部 rank（36^6 ≈ 21.8 亿码点、相邻码距 ≥3，重铺后单列可容纳 5.4 亿次头部插入才需要再次 Rebalance）。**极端情况的处理是整列重排而非无限延长字符串**，这让算法的最坏成本有界。

工程细节：空字符串 `""` 和全 `'z'` 串分别作上下界哨兵，"插到列头/列尾"就是 `Between("", firstRank)` / `Between(lastRank, "")`，不需要特殊分支。

---

## 二、并发：服务端权威 + 乐观锁

拖拽请求的协议是 `{卡片 id, 目标列, 锚点 before_id|after_id, expected_version}`——**客户端只表达意图，不计算顺序值**。服务端 `Move`（`card_repo.go`）重查目标列全部卡片按 rank 升序、定位锚点的相邻 rank 对、`Between` 算出新 rank。客户端算 rank 的方案（离线乐观）在多人场景下必然产生字典序冲突，服务端权威让排序的唯一真相只有一份。

并发正确性靠乐观锁：

```go
builder.Where(card.VersionEQ(req.GetExpectedVersion()))
...
builder.SetRank(newRank).AddVersion(1)
```

版本不符 → 409 `card version conflict`，客户端据此拉一次差量同步再重放。同一机制在看板的 board/column/card/label 四类实体的 Update/Move 上共六处（项目自己的审计文档称之为"六处 VersionEQ 校验就位"）。

这里体现的取舍与 ERP 篇的 SQL 条件更新同源：**看板拖拽是低频人类操作，乐观冲突的概率极低，为它引入分布式锁或队列不成比例**。而 LexoRank 的真正价值此刻显现——不同位置的并发插入大概率落在不同 rank 上互不冲突，只有"两个人同时插到同一个锚点"这种真冲突才需要 409。**算法在并发层之前就已经消化掉了大部分冲突**。

跨列移动还有一个反规范化细节：卡片行的 `board_id` 是从列冗余来的字段（供看板级查询），Move 时同步改写——冗余列的维护点收敛在唯一的 Move 入口，不会漂移。

---

## 三、同步：尽力而为广播 + 差量兜底

写成功后，变更事件经统一的发布点发出 `BoardChangeEvent`（BOARD/COLUMN/CARD/LABEL 的增删改 + 卡片标签变更），经事件总线推给同看板的在线客户端。事件总线（`pkg/broadcast/broadcast.go`）的设计有三个值得记录的点：

**其一，跨实例的分工**。本地是 `map[boardId]map[chan]` 的订阅分发；多副本场景经 Redis Pub/Sub 单频道 `go-wind:board:events` 中转。admin 服务**只发布不订阅**（它的职责是写路径），app 服务的 WS 层负责订阅并推给浏览器——发布方与推送方按服务职责切分，不在同一个进程里堆两个角色。

**其二，慢消费者的处理是丢最旧**。非阻塞 send 失败（订阅者通道满）时，先弹出通道里最旧的事件、再把新事件补投进去——**实时通道宁可丢历史也不阻塞写路径**。这个激进行为有明确的语义背书（包注释）：

> 可靠性：本通道是尽力而为的实时推送；离线/丢包客户端的最终一致性由快照拉取与后续差量同步保证，不依赖本通道。

**其三，差量兜底协议**（`SyncBoard`）：客户端上报自己已知的 `board_version + column_versions[] + card_versions[]`，服务端按实体版本比对，返回**该客户端缺失的 upsert 集合与已删除的 id 集合**。WS 丢事件（上一段的丢最旧）、断线重连、离线编辑（Flutter 端 Hive 快照 + PendingOps 离线队列）三种场景，全部收敛到同一个差量接口修复。

四层各司其职：**LexoRank 让冲突变少，乐观锁让冲突可检测，广播让在线端近似实时，差量让一切最终一致**——没有一层试图独立解决全部问题。

WS 层还有两个打磨细节：**回声抑制**（事件携带 actorId，操作者自己发起的变更不推回——本地已按响应乐观更新，推回反而引起闪烁）；**心跳**（50 秒 ping / 60 秒 pong 超时，死连接及时清理）。

---

## 四、准入：从 JWT-in-URL 到一次性票据

WebSocket 准入走的是"一次性 ticket"方案，而且这个项目保留了一段完整的威胁模型演进史：浏览器 WebSocket 无法携带 Authorization 头，第一版把 JWT 放在握手 URL 的 query 里——功能正常，但长效凭证落进了代理与访问日志。安全加固提交（`9704894`）把它换成了短寿命一次性票据：

1. 鉴权后调 `CreateWebSocketTicket`：服务端生成随机 ticket，Redis 记 `ticket → userId:boardId`，**TTL 60 秒**；
2. WS 握手带 `?ticket=<t>&board_id=<id>`：服务端 `GETDEL` **原子消费**（防重放，一张票只能用一次），并校验票据绑定的 boardId 与请求的 boardId **一致**（防拿 A 板票据订阅 B 板）；
3. 消费成功才 upgrade。

与 GoWind 系其他项目（运维平台终端、cms 协同编辑）的 ws 准入是同一模式的两次独立落地——**"浏览器 WS 不能带头"这个约束的解法是基础设施级的，值得做成惯例而不是每次重新发明**。差异点也有价值：kanban 的票据绑定了业务对象（boardId），把"已登录"收紧成了"对这个看板有意图"。

---

## 五、结语

这套方案的适用边界值得一说：它是**最后写者赢**的语义——两个人同时拖同一张卡，后提交者 409 后拉差量重放，没有 OT/CRDT 式的操作合并。对看板这个交互密度，这个语义完全够用；交互密度再上一个量级（多人同时编辑同一卡片的内容），才需要走向协同算法。

三条可迁移的经验：

1. **排序键的算法选型在并发之前**——LexoRank 把"不同位置的并发插入"从冲突变成了不相交，比事后加锁便宜得多；
2. **实时通道按"尽力而为"设计，正确性交给差量协议**——丢最旧的广播 + 按版本比对的 SyncBoard，两者必须成对出现；
3. **WS 准入的一次性票据要绑定业务对象**——只校验"登录过"的票据防不住越权订阅。

仓库（排序算法 `backend/pkg/lexorank/`，并发与同步在 `backend/app/core/service/internal/data/card_repo.go` 与 `backend/pkg/broadcast/`）：

- GitHub：[github.com/tx7do/go-wind-kanban](https://github.com/tx7do/go-wind-kanban)
- Gitee：[gitee.com/tx7do/go-wind-kanban](https://gitee.com/tx7do/go-wind-kanban)
