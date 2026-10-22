---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - CRDT
  - 协同编辑
  - CMS
sticky: 10
---

# GoWind CMS 拆解：在 Go 里给 TipTap 搭一套 Yjs 协同后端

> 本文回答一个问题：**两个人同时编辑同一篇富文本，从浏览器到 Go 服务端再到数据库，中间要处理哪些协议、锁、持久化与竞态？**

[GoWind CMS](https://github.com/tx7do/go-wind-cms) 的帖子/页面编辑页支持多人同编：在线光标、无冲突合并、断线恢复、离线内容回流。后端没有用任何现成的协同 SaaS，而是在 Go 侧搭了一套 Yjs 兼容的 WebSocket 服务（`COLLAB_ADDR`，默认 `:6602`），与 TipTap 的 Collaboration 扩展直连。这个功能的实现从 v1 到 v2.5 演进了三版（编辑锁 → 持久化自愈 → 服务端权威种子化），每一版解决一类问题，踩过的坑都留在了代码注释里——这篇按演进顺序拆。

---

## 一、选型：为什么不自己写 CRDT

协同编辑的核心是 CRDT（无冲突复制数据类型）：每个编辑操作都是可交换、可交换重放的增量，多端乱序应用最终收敛到同一状态。自己实现 CRDT 是数月级的算法工程，GoWind CMS 的选择是站在现成引擎上：

- **客户端**：Yjs（`yjs ^13.6`）+ TipTap `@tiptap/extension-collaboration`——前端生态的事实标准；
- **服务端**：[ygo](https://github.com/reearth/ygo)——reearth 开源的**纯 Go Yjs 兼容 CRDT 引擎**，`go.mod` 引入 `v1.51.11` 并 replace 到自己的 fork（`replace github.com/reearth/ygo => github.com/tx7do/ygo`），集成层需要的小改动走 fork 而不是绕路。

ygo 提供两块能力：`crdt` 包（`Doc` / `Transaction` / `YXmlFragment` / `YXmlText` / `Delta`——Yjs 文档模型的 Go 侧实现）和 `provider/websocket` 包（y-websocket 协议的服务端实现，带 `AuthFunc`、`AllowedOrigins`、`OnLoadDocument`、`CloseRoom` 等钩子）。**协议层零自研**：浏览器与 Go 服务端之间跑的就是原生 y-websocket 二进制帧，前端的 `y-websocket` 客户端不需要任何适配。

这个选型决定了后端要做的全部事情是四件**工程问题**而非算法问题：准入与房间管理（第二节）、并发编辑的感知与提示（第三节）、断线不丢（第四、五节）、生命周期竞态（第六节）。

---

## 二、房间与准入：一个独立端口的协同面

协同 ws 服务以 kratos `transport.Server` 的形态挂在 admin 服务进程内、独立监听 `:6602`——与 REST/gRPC/SSE 面隔离，`COLLAB_ADDR=off` 可整体停用（停用时 ws 面为 nil，但删除内容时的踢房调用仍安全 no-op）。

**房间模型**：房间名取 ws URL 路径末段，格式 `post:{id}:{locale}` / `page:{id}:{locale}`——**按内容 + 语言双维隔离**，同一篇文章的中文稿和英文稿是两个房间，各自独立的 CRDT 状态。

**token 准入**是第一个绕不开的坑：浏览器 WebSocket API 无法携带 `Authorization` 头，token 只能走 query 参数。这与运维平台 Web 终端的解法同源——把准入门槛做成与 SSE 同级（校验 access token 有效性），内容级的细粒度权限交给保存链路兜底（协同编辑的每一次保存仍走 core 的 `Update`，RBAC 在那里生效）：

```go
func (s *Service) authenticate(r *http.Request) bool {
	token := r.URL.Query().Get("token")
	...
	resp, err := s.authClient.ValidateToken(ctx, &authenticationV1.ValidateTokenRequest{
		ClientType:    authenticationV1.ClientType_admin,
		Token:         token,
		TokenCategory: authenticationV1.TokenCategory_ACCESS,
	})
	return resp.GetIsValid()
}
```

**Origin 白名单**（`COLLAB_ALLOWED_ORIGINS`，逗号分隔）挡住跨站 ws 握手——浏览器发起的 ws 会带 Origin 头，这是 ws 场景下比 CSRF token 更直接的防线。

房间生命周期由 ygo 的 `OnLoadDocument` / `OnUnloadDocument` 钩子驱动，服务侧维护 `liveRooms` 表支撑按前缀踢房（`CloseRoomsByPrefix`，第六节的删除联动会用到）。ygo 的一个行为需要知道：**evict 房间前会 flush 待写状态**——这个特性是第六节竞态的另一半。

---

## 三、v1 编辑锁：只感知，不拦截

协同上线的第一版其实不是 CRDT，是一把软锁。动机很朴素：CRDT 接入前，多人同编一篇帖子是"后保存覆盖先保存"，第一版的诉求只是**让编辑者知道有人在编辑**。

实现是 Redis 软锁（`edit_lock_service.go`），两段 Lua 脚本保证原子性：

- **获取/心跳**：本人持锁 → `SET ... EX 120` 续期（获取与心跳是同一个调用）；他人持锁 → 原样返回锁值供前端展示"谁在编辑"；空闲 → 上锁。
- **释放**：仅持锁者本人（比对锁值里的 user_id）可 DEL——防止误删别人的锁。

TTL 120 秒是前端心跳间隔（60 秒）的两倍余量——**进程崩溃后锁自动过期释放，不需要任何看门狗**。锁值是 JSON（`UserID/UserName/AcquiredAt`），key 按 `editlock:{type}:{id}` 隔离。

设计上最值得记录的是这条边界注释：「**只做编辑感知与冲突提示，不做强制写拦截（保存冲突由内容版本化兜底）**」。锁的语义止步于"提示横幅"：他人持锁时你仍可编辑保存，真冲突了由内容版本化的快照链路兜底回溯。**把锁做成强互斥很容易，把锁做成不强制的感知才是设计**——强互斥要求处理锁泄漏、强制接管、死锁恢复一整套问题，而感知锁的失败模式就是"提示消失了"，无害。

---

## 四、v2 持久化与自愈：CRDT 状态的续命存储

CRDT 协同的默认形态是纯内存：房间无人即销毁，服务重启全员状态归零——"重启/全员断线丢最后几秒输入"的窗口对编辑器场景不可接受。v2 加了持久化层，架构受两服务拓扑约束：

```
ygo PersistenceAdapter (admin)
    → gRPC LoadDoc / StoreDocState (5s 超时)
    → core CollabDocStateService
    → ent → collab_doc_states 表 (room 唯一索引 + doc_update bytes)
```

admin 不触库是这个代码库的既定分层，所以持久化走 gRPC 绕道 core。表上的注释值得整段引用，它定义了这张表的准确身份：

> 服务重启后据此恢复协同会话，消除『重启/全员断线丢最后几秒输入』的窗口。**内容事实源仍是 core 内容表，本表只是协同会话的续命存储。**

"续命存储"的定位决定了它的写路径可以激进：ygo 侧已对 update 做防抖合并，`StoreUpdate` 收到的是合并后的**整量状态**，仓储层就是 query-then-upsert 整量替换——不存在增量合并的复杂度。

**客户端全量上报回流**是自愈的另一半，而且是个协议层的暗坑：ygo 服务端**不会主动向客户端索要状态**（没有服务端发起的 SyncStep1），所以"服务端有恢复态、客户端本地有 IndexedDB 离线编辑"时，两边的合并必须由客户端主动上报触发。前端 `TiptapEditor` 的 `sendFullState` 手写了帧头：

```ts
// messageSync(0) + SyncStep2(1) + varuint 长度 + Y.encodeStateAsUpdate(ydoc)
```

能这么干依赖 CRDT 的数学性质：**update 幂等且可交换，重复上传无害**——这也是整条自愈链路敢做成 best-effort 的底气。客户端同步完成后全量上报本地状态，服务端状态被旧内容覆盖的场景也能自愈。

配套还有一个**种子化持久锁**（localStorage 键 `gwc-collab-seeded:{room}`）：服务端已有持久化协同状态后，任何后续客户端（清缓存重开、admin 重发版）不得再用 core 里的旧内容覆盖恢复态。这个锁在 v2.5 服务端权威种子化落地后理论上是冗余的，但注释明说保留作"历史客户端防御"——**新旧版本客户端混跑的过渡期，防御性冗余比干净重要**。

---

## 五、v2.5 服务端权威种子化：HTML→Yjs 的受控转换

v2 解决了"状态不丢"，还剩一个入口问题：**帖子已有内容（core 里存的是 HTML），第一个人进协同房间时，内容怎么进 CRDT 文档？**

v2.5 的答案是服务端权威种子化：ygo 的 `OnLoadDocument` 钩子（每房间仅触发一次）里，若恢复后文档为空，从 core 拉取内容做一次 **HTML → Yjs 文档树的受控转换**。触发条件收敛得很严：仅 `post` 房间（page 是 sections 结构化数据，无单一 HTML 正文，不种子化）、仅当 `XmlFragment("default")` 为空。

转换器分两层（`seed.go` 块级 + `seed_inline.go` 行内），最有价值的部分是它的**分寸感**——支持什么、降级什么都有明确清单：

| 层级 | 支持 | 降级策略 |
|------|------|---------|
| 块级 | p、h1-h6、bulletList/orderedList（含嵌套 listItem）、blockquote、codeBlock（解析 `language-x`）、hr | blockquote 内部块降级为段落；**table 不支持，降级为逐行段落文本**；未知块级标签（div/section）递归子节点 |
| 行内 | strong/b→bold、em/i→italic、u→underline、s/del→strike、code→code、a→link、br→hardBreak、img→image | 相邻同 marks 文本合并为一次 delta；显式空 Attributes 阻断格式继承 |

降级是刻意的：转换器的职责是"把既有内容完整带进房间"，不是"完美重建编辑器 schema"——表格降级成文本段落，用户看到的仍是全部内容，协同保存后再由编辑器重新结构化。**受控转换的对立面是天真转换**（把 HTML 塞给解析器 whatever it produces），后者的输出一旦混进 TipTap 不认识的节点，整个房间的 CRDT 状态都会被污染。

双编辑器分流也在这一层：Markdown 编辑器种子化为 `YText('content')`（yCollab 绑定文本），富文本种子化为 `XmlFragment('default')`（TipTap Collaboration 的字段名）——同一个房间机制，两种文档形态。

**两条铁律**直接引自 `seed.go` 的注释，它们是 ygo 使用中真实撞出来的墙：

```go
// ygo 铁律：Transact 内调用 doc.GetXmlFragment 等读方法会死锁——
// 引用必须在事务外取好
```

```go
// 逐子节点独立事务前向追加：同一事务内 prelim 混合子节点
//（YText 与 YXmlElement 混排）重放会乱序；独立事务天然按序
```

第一条是 API 陷阱（事务重入死锁），第二条是 CRDT 语义细节（prelim 节点在同一事务内的混排顺序问题）——**解决方式是"每个子节点一个独立事务、前向追加"**，用事务次数换确定性，种子化是一次性操作，这个代价完全付得起。这类注释就是"为什么不自己写 CRDT 但仍需要懂 CRDT"的最好注脚。

---

## 六、尾部硬仗：删除内容时的三段竞态

内容被删除时，协同房间必须一并清理，但直接删会撞上三个环节的竞态：**踢房 → ygo flush → 删持久化行**。时序展开：

1. `CloseRoomsByPrefix("post:{id}:")` force 断开所有连接——但 ygo 在 evict 前会 **flush 待写状态**，这次 flush 可能是一次新的 `StoreUpdate`；
2. 若先删了 `collab_doc_states` 行、flush 后写回来——**被删房间的状态"复活"**；
3. 若不删行——孤儿状态永久残留。

实现（`post_service.go`）用"延时窗口 + 两段删除"处理：

```go
CloseRoomsByPrefix("post:{id}:")          // ① force 踢房(触发 flush)
time.Sleep(1500 * time.Millisecond)       // ② 预留 flush worker 窗口
DeleteDocStatesByPrefix(...)               // ③ 立即删一次
time.AfterFunc(3*time.Second, func() {     // ④ 兜底再删一次
	DeleteDocStatesByPrefix(...)
})
```

第二段兜底删防的是"flush 恰好落在第一段删除之后"的窄窗口。两段删除各自幂等，竞态的所有交错结果都收敛到"行被删掉且不再复活"。`sleep 1500ms` 是经验值而非精确推算——注释没有伪装它是精确的，这种"留余量的工程近似"在异步清理场景里比追求精确可靠得多。

---

## 七、前端侧三件：熔断、bundle 缓存与在线感知

**鉴权熔断**（`TiptapEditor.tsx`）：ws 连接的 `close`/`error` 事件里，若**从未同步成功过**（`everSynced == false`）则计数，连续 3 次失败 → `provider.disconnect()` 停用重连；一旦同步成功过则永不熔断。为什么区分"同步过没有"：token 过期/权限被收走时 ws 握手会无限 401 退避循环，重连毫无意义；而网络抖动的重连是真有价值的——**用"是否成功过"区分这两种失败**是 WebSocket 重连策略里少有人写对的判据。

**bundle 缓存**：React 18 的 StrictMode 会在开发期挂载-卸载-重挂载组件，yjs 的 doc/provider/indexeddb 三件套若随组件销毁重建，CRDT 状态会被反复初始化。解法是模块级 `Map<room, bundle>` 缓存，注释写明取舍："bundle 只创建不销毁（随页面生命周期结束），房间数有限内存可控"——**对象图的生命周期跟页面走而不是跟组件走**，是所有"重初始化代价高"的第三方对象在 React 里的通用解法。

**在线感知**：TipTap `CollaborationCaret` 显示协作光标，协作者颜色由 `CURSOR_PALETTE[userId % 8]` 按用户 id 稳定取色（同人恒同色）；编辑页顶栏的头像组监听 yjs awareness 状态渲染在线名单。awarness 通道（临时状态）与文档 update 通道（持久状态）在 yjs 协议里天然分离，光标不需要任何持久化。

**保存链路完全解耦**是收尾的关键约束：协同模式下编辑器的 `value` prop 只作种子（"外部回写会与 ydoc 打架"），显式保存仍收集当前内容走 `PostService.Update`——版本化快照、Webhook 事件、ES/AI 索引双写钩子**一个都不变**。协同编辑是编辑器输入层的技术，不是内容管线的分支；yjs 自带的 undo 与 TipTap 内置 undoRedo 互斥（协同分支显式关闭后者），撤销栈也因此不分裂。

---

## 八、结语

回头看这套东西的形状：CRDT 算法是别人的（ygo/Yjs），协议是标准的（y-websocket），GoWind CMS 真正写的部分全部是**边界上的工程**——准入（query token + Origin）、感知（不拦截的软锁）、持久（续命存储 + 客户端回流 + 种子锁）、入口（受控种子化）、清理（三段竞态）、熔断（按"是否同步过"分流）。这大概就是"在 Go 里给前端生态拼一个实时协同后端"的真实工作量分布：没有一行 CRDT 算法，但每个边界都有一段注释在讲它防住了什么。

如果只带走三句话：

1. **CRDT 永远不要自己写**，但接入它需要的 CRDT 语义知识（prelim 混排、update 幂等）一条都省不掉；
2. **编辑锁做成感知而不是互斥**——冲突兜底交给版本化，锁的失败模式就无害化了；
3. **协同状态与内容事实源分离**——"续命存储"的定位让持久化可以激进简化（整量替换），删除联动只需处理自己的竞态。

仓库（协同编辑在 `backend/app/admin/service/internal/collab` 与 `frontend/admin/src/components/common/Editor`）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
