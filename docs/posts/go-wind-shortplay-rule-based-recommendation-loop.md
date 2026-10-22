---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - Flutter
  - 推荐系统
sticky: 10
---

# GoWind ShortPlay 拆解：不用模型的推荐闭环——埋点回流、三路召回与已看去重

> 本文回答一个问题：**没有算法团队、没有特征平台、没有模型服务，一个短视频 Feed 的"推荐"要怎么做才不是自欺欺人？**

[GoWind ShortPlay](https://github.com/tx7do/go-wind-shortplay) 的 Feed 有一套完整的推荐链路：Flutter 播放器实时上报观看行为 → core 防刷入库 → 三路召回 + 热度加权排序 → 已看去重 → 召回理由随内容回传。全程一个模型都没有，但**闭环的每一环都是真的**——埋的是真数据、算的是真信号、去重是真去重。

写这篇文章前先立个牌子：它不是 AI 推荐系统。没有用户画像、没有协同过滤、没有 CTR 预估，热门榜对每个登录用户长一个样。这是刻意的，而且我认为在开源 MVP 语境下，这是**唯一诚实的选择**——下面拆完每一环，你会看到"简单"本身是怎么被设计出来的。

---

## 一、先泼冷水：为什么不用模型

在数据没攒够之前上模型，不是先进，是负资产：

- **没有正负样本**。推荐模型的燃料是"曝光-行为"对，开源版上线第一天数据量是零。规则排序零数据可用，模型排序零数据报废。
- **不可解释**。运营问"为什么这个视频在首页"，`view×1 + like×3 + collect×5 + complete×4` 能当场算给他看，模型的 feature importance 不能。
- **不可调试**。规则错了改权重立刻生效；模型错了要查特征、重训、灰度——这些基建本身就是三万人月。
- **闭环比聪明重要**。短视频产品的冷启动阶段，"用户滑走的不再推、完播的被加权"这两条规则贡献的体验提升，远大于一个没有数据喂的模型。

所以 GoWind ShortPlay 的选择是：**先花最小代价把反馈环转起来，把升级路径留在契约里**。全链路长这样：

```
Flutter 播放器                       core 服务
┌──────────────────┐   HTTPS    ┌─────────────────────────┐
│ onPlayStart      │            │ ReportEvents            │
│ onHeartbeat(10s) ├──批量上报──▶│  单批≤100 防刷           │
│ onComplete       │            │  逐条落 sp_uba_events   │
│ onSwipeAway(<95%)│            └───────────┬─────────────┘
└──────────────────┘                        │
                                            ▼
┌──────────────────┐            ┌─────────────────────────┐
│ GetFeed          │◀──gRPC────│ 三路召回：               │
│  上下滑沉浸流     │            │  关注 → 热门 → 最新兜底  │
│  (reason 回传)    │            │  热度分 = SQL 加权排序   │
└──────────────────┘            │  已看去重 = Redis SET    │
                                └─────────────────────────┘
```

四类事件、一张表、一条 SQL、一个 SET。下面逐环拆。

---

## 二、信号从哪来：播放器就是埋点器

推荐系统的第一课是：**信号质量取决于离行为现场有多近**。GoWind ShortPlay 把埋点直接做进了播放器组件——`video_player_item.dart` 封装 media_kit，向上抛四个回调，宿主页面负责上报：

| 信号 | 触发时机 | 语义 |
|------|---------|------|
| `onPlayStart` | 进入当前页开始播放 | 一次真实曝光（进入过播放态，不只是划过卡片） |
| `onHeartbeat` | **10 秒定时器**，仅播放中触发 | 持续观看证明，带当前进度 |
| `onComplete` | 播放器 completed 流触发，percent=100 | 看完了 |
| `onSwipeAway` | **离开当前页且进度 <95%** | 没看完就走了 |

这里最值得抄的是**95% 这条线的互补设计**：

```dart
if (!oldWidget.isActive && widget.isActive) { /* 进入 */ }
if (oldWidget.isActive && !widget.isActive) {
  unawaited(_player.pause());
  final progress = _snapshot();
  if (progress.percent < 95) {
    widget.onSwipeAway?.call(progress);   // 只有"没看完就走"才算划走
  }
}
```

用户在第 96% 处滑走、播放器恰好没来得及触发 completed，这条行为**不算划走**——它接近完播，让位给 `COMPLETE` 事件。两个信号不重叠计费，热门分不会因为"结尾长"的短视频被重复加权。埋点的去重做在客户端定义层，比服务端事后清洗便宜得多。

**心跳的节流**也做在客户端：`Timer.periodic(Duration(seconds: 10))` 且仅在 `_player.state.playing` 时触发——暂停不计心跳，快进/拖动由 `_snapshot()` 取实时位置，服务端拿到的就是干净的"每 10 秒一次、只在真看"的脉冲。

**上报是 fire-and-forget**，这是采集段的第二原则——埋点永远不配阻塞播放：

```dart
void reportAll(List<UbaEvent> events) {
  unawaited(_dio.post('/uba/events', ...).then((_) {},
      onError: (Object e) { debug('uba report failed (ignored): $e'); }));
}
```

`unawaited` + 失败静默。序列化层还处理了一个 protojson 的实际坑：`durationMs` 是 int64，**必须序列化成字符串**（`'durationMs': '$durationMs'`），`watchPercent` 是 uint32 传数字并 clamp 到 0-100——前后端契约的精度细节在客户端就锁死了。

---

## 三、信号去哪了：一张埋点表，两个消费方

服务端接收接口 `POST /app/v1/uba/events` 在**游客白名单里**——游客也能上报，否则冷启动期的行为数据永远归因不到人。配套的 `UbaIdentityInjector` 中间件做了一件精细的事：白名单短路了鉴权，但请求带有效 token 时尽力解析出 uid 写回请求头，解析失败静默放行按游客处理。**身份是尽力而为的增强项，不是上报的前置条件。**

入库三道闸（core 的 `uba_service.go`）：

1. **单批上限 100**（`ubaMaxBatchSize`）——防刷的第一道墙：正常客户端单次上报撑死几条，一次 POST 几千条的必是脚本；
2. **逐条落库、单条失败不中断整批**——`CreateBatch` 是尽力而为语义，脏数据丢弃不影响好数据；
3. 表设计直接为消费方服务：

```go
index.Fields("event_type", "occurred_at").StorageKey("idx_sp_uba_event_type_occurred_at")
index.Fields("video_id", "event_type").StorageKey("idx_sp_uba_video_event")
```

`(video_id, event_type)` 这个复合索引就是给热门聚合用的——后面那条热门 SQL 的 `WHERE event_type='VIDEO_COMPLETE' GROUP BY video_id` 走的就是它。**埋点表的索引是照着查询画出来的**，不是拍脑袋加的。

而这张表最"一鱼两吃"的地方：**观看历史就是埋点数据本身**。`ListWatchHistoryPage` 对该用户的 `VIDEO_PLAY` 事件做 `GROUP BY video_id + MAX(COALESCE(occurred_at, created_at))`，聚合出"最近观看时间"排序——没有独立的 history 表，看过的视频天然按最后观看时间倒序。"行为日志即业务数据"，少一张表就少一条同步链路。

---

## 四、分怎么算：一条 SQL 的推荐排序

Feed 的召回-排序-合并在 `feed_service.go` 的 `GetFeed`，先看全景再拆热度：

```go
recallN := int(pageSize) * 4                 // 超采样 4 倍
// 1. 关注召回：最近关注 100 人的已发布视频，发布时间倒序
authorIDs, _ := s.interRepo.FollowingAuthorIDs(ctx, uid, 100)
followVideos := s.videoRepo.ListPublishedByAuthors(ctx, authorIDs, recallN)
// 2. 热门加权
hotVideos := s.videoRepo.ListHot(ctx, recallN)
// 3. 最新兜底（带 tag 走标签聚合）
latestVideos := s.videoRepo.ListLatest(ctx, recallN)
```

三路各自**超采样 4 倍**（每路都取 4×pageSize 条），合并是一个先到先得的闭包：

```go
add := func(vs []*ent.Video, reason feedV1.FeedReason) {
	for _, v := range vs {
		if _, dup := mergedIDs[v.ID]; dup {
			continue          // 已被更高优先级召回想,跳过
		}
		mergedIDs[v.ID] = struct{}{}
		merged = append(merged, v)
		reasonsOf[v.ID] = reason   // 先到先得:关注 > 热门 > 最新
	}
}
```

合并时用 map 去重、**理由先到先得**（关注 > 热门 > 最新），每条 item 的 `reason` 字段随内容一起下发——前端可以拿它做角标（"你关注的 TA"）、做分路占比的灰度观测。召回理由进契约而不是藏在服务端，这是后面升级路径的地基。

### 热度分公式

`ListHot` 是全项目少数原生 SQL 聚合点，值得整段读：

```go
// UBA 完播聚合（每视频至多一行，不产生行增殖）：完播是内容质量的
// 强信号，计数列（view/like/collect）只反映互动量不反映看完率。
agg := sql.Select("video_id", "COUNT(*) AS complete_cnt").
    From(sql.Table("sp_uba_events")).
    Where(sql.EQ("event_type", "VIDEO_COMPLETE")).
    GroupBy("video_id").
    As("uba_agg")
s.LeftJoin(agg).On(s.C(video.FieldID), "video_id")
s.OrderBy(sql.Desc(
    "view_count * 1 + like_count * 3 + collect_count * 5 + COALESCE(complete_cnt, 0) * 4"),
    sql.Desc(video.FieldPublishedAt),
)
```

权重不是拍脑袋的，每个数字对应一种行为成本：

| 信号 | 权重 | 行为成本 | 说明 |
|------|------|---------|------|
| view_count | ×1 | 零成本 | 详情接口 +1，容忍丢失不走事务——**最廉价的信号只配最低权重** |
| like_count | ×3 | 一次点击 | 主动互动，但要双击/点按钮 |
| collect_count | ×5 | 一次点击 + 未来回报预期 | 收藏是"我还要再看"，**意向最强的轻量信号** |
| complete_cnt | ×4 | 完整时长投入 | 质量信号：互动可以刷，**看完刷不了** |

两个 SQL 细节：

- **子查询聚合 + LEFT JOIN，`GROUP BY video_id` 保证每视频至多一行**，注释专门点名"不产生行增殖"——埋点表是几十万行，JOIN 出来的还是视频行数，排序在视频表规模上完成；
- `COALESCE(complete_cnt, 0)` 兜住没有完播记录的视频，**同分回退 `published_at DESC`**——没人互动的新内容按新鲜度兜底，冷启动视频永远有机会进池。

关于这条 SQL 的量级账也值得算清楚：聚合子查询 `WHERE event_type='VIDEO_COMPLETE' GROUP BY video_id` 走 `(video_id, event_type)` 复合索引，代价与**完播事件总量**线性而非视频总量线性——埋点表涨到百万行时，这个子查询会是热门召回的主要成本。到那一步的正确动作不是给 MySQL 加机器，而是把聚合结果周期物化（视频表加一列 `complete_count` 冗余，或挪进 OLAP）——但 MVP 阶段刻意不做：冗余列的增量维护会把埋点写入从"尽力而为的单条 insert"变成"带计数事务的写"，采集端的失败语义会跟着变。**读时聚合是惰性的正确，物化是规模到了之后的优化**，两者切换点清晰。

这就是"够用的推荐"的形态：**一条索引友好的 SQL，把质量信号（完播）从行为信号（互动）里拆出来加权**。它回答不了"这个人爱看什么"，但能保证"垃圾内容沉底、好内容上浮"——而后者决定了 Feed 的及格线。

---

## 五、怎么不重复：已看集合与诚实的"尽力而为"

沉浸式 Feed 最大的体验底线是**不重复推**。实现是一个 Redis SET（`feed_service.go`）：

```go
const (
    feedSeenKeyPrefix = "gowind-shortplay:feed:seen:"
    feedSeenTTL       = 7 * 24 * time.Hour
    feedSeenCap       = 2000
)
```

- **写**：本页下发即记已看——`SAdd` + `Expire(7 天)` 走 Pipeline，每次下发**滑动续期**：

```go
pipe := s.redis.Pipeline()
pipe.SAdd(ctx, key, members...)
pipe.Expire(ctx, key, feedSeenTTL)   // 每次写入滑动续期 7 天
if _, err := pipe.Exec(ctx); err != nil { return }
if n, err := s.redis.SCard(ctx, key).Result(); err == nil && n > feedSeenCap {
	s.redis.SPopN(ctx, key, n-feedSeenCap)   // 超上限,随机弹出多余成员
}
```

注意语义：已看的定义是"**下发过**"而非"播放过"，Feed 场景下推了没看≈不想看，同样不该再推。
- **读**：`SMembers` 全量拉回内存 set，三路召回各自过一遍 `seenFiltered`。敢全量拉是因为容量有界——上限 2000，约 20KB/用户，微秒级过滤。
- **防膨胀**：`SCard` 超 2000 时 `SPopN(key, n-2000)` **随机弹出**多余成员。注释大方承认是"尽力而为"——不是 LRU，最早看过的和最近看过的有同等概率被弹掉。

为什么不用 ZSet 做真 LRU、不用 bitmap？算一笔账：单用户 2000 个 ID 的 SET 约 20KB，`SMembers` 一次内存过滤微秒级；换成 ZSet 每次写多一次 score 更新，读侧改成 ZRANGEBYSCORE 分页——**复杂度上去了，收益是"第 2001 个之前看过的视频理论上不重复"**，而页码截页的分页方式本来就无法保证严格不重复。这是两个刻意声明的取舍：

1. **随机淘汰**：超容量的老记忆可能被弹掉，换 SET 的简单；
2. **页码截页**（非游标）：往回翻可能因已看过滤出现空页，换实现直接。

代码不装。注释里写的就是 trade-off 本身，等真到商业化量级，替换的是这一层，`GetFeed` 的接口签名不动。

---

## 六、个性化在哪、不在哪：升级路径是设计出来的

把边界画清楚，这一节回答"那它到底个性化了个啥"：

**有的个性化：**
- **关注流**——唯一的"人"维度信号，最近关注 100 人的新作优先（先到先得占住理由位）；
- **已看去重**——千人千面最朴素的形式：你看过的，别人不用管，你自己不再看到。

**没有的个性化：**
- 热门榜全局一份，没有"相似用户也看了"；
- 划走信号**采集了但排序还没消费**——`SWIPE_AWAY` 在 `sp_uba_events` 里躺着，热门分只用了 `COMPLETE`。信号先行入库、消费后行跟进，这是有意的节奏。

**冷启动的真实路径**也值得走一遍：新用户第一屏，关注召回为空（`FollowingAuthorIDs` 返回空集直接短路），热门召回对它是全局榜——**新用户和老用户看到的头部内容一样**，唯一的差异会随关注关系与已看集合慢慢积累；游客（uid=0）更彻底，已看集合整个跳过，刷两页同内容会重复——游客本来就不承载个性化预期。这两个"体验弱点"都是刻意不修的：修复它们的每一项（画像、协同过滤）成本都远超 MVP 阶段的收益，而埋点已经把需要的数据存下来了。

那下一步怎么走？代码里已经留好了三段路径：

1. **消费已有信号**：把 `SWIPE_AWAY` 变成负权重（`- swipe_cnt × k`）、给心跳聚合出"平均观看进度"，都是现表现索引上的 SQL 改动；
2. **加画像维度**：tag 偏好（用户对哪类标签完播率高）可以纯 SQL 聚合出来，插进召回层做一路"兴趣召回"——`GetFeed` 里加一路 `add()`，契约不变；
3. **换真推荐服务**：`ListHot` 的代码注释明示了这条升级路径是预留过的——「替换本召回时接口形态不变（ROADMAP 预留）」。因为 `FeedReason` 枚举进了 proto 契约、召回收敛在 videoRepo 的三个方法里，未来无论后面是向量召回还是模型排序，`GetFeed` 的调用方（Flutter App / BFF）一行不用改。

这就是开篇说的"把升级路径留在契约里"的完整含义：**推荐系统的可替换性不取决于今天用没用模型，取决于召回/排序有没有被隔离在契约边界内**。

---

## 七、快速验证

```bash
# 起服务后（见仓库 README），游客直接刷 Feed
curl 'http://127.0.0.1:7700/app/v1/feed?pageNum=1&pageSize=5'
# 连刷两页：第二页不含第一页的 videoId（游客无已看集合，登录后生效）

# 登录用户登录态刷两页，观察 reason 字段的分路占比
#   FEED_REASON_FOLLOW / FEED_REASON_HOT / FEED_REASON_LATEST

# 手工制造完播信号，看热门分变化
curl -X POST http://127.0.0.1:7700/app/v1/uba/events \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer <token>" \
  -d '{"events":[{"eventType":"EVENT_TYPE_VIDEO_COMPLETE","videoId":1,"durationMs":"60000","watchPercent":100}]}'
```

Flutter 端跑起来更直观：`flutter run --dart-define=API_BASE=http://127.0.0.1:7700`，上下滑几个视频，看管理后台数据看板的趋势变化——那就是你刚喂进去的埋点。

---

## 八、结语

这篇拆的是 GoWind ShortPlay 里最"不像功能"的功能：它没有独立的服务、没有模型、甚至没有一张新表，但它把推荐系统的**骨架**——信号采集、防刷入库、召回排序、去重、理由回传——全部立住了。回头看这个闭环的设计原则，其实就三条：

1. **信号定义做在离行为最近的地方**（播放器回调层，95% 线互补去重）；
2. **埋点永远尽力而为**（fire-and-forget、逐条落库、失败静默——数据管道不能反过来拖垮主业务）；
3. **可解释先行、可替换留门**（SQL 权重当场能算给运营看；`FeedReason` 进契约，未来换推荐服务调用方不动）。

这套"SQL + Redis 够用推荐"的适用边界由几个常量共同划出：热门聚合走 `(video_id, event_type)` 索引、已看集合封顶 2000、单批上报上限 100——每个常量都对应一个明确的量级假设。假设被打破时（埋点表千万行、单用户消费深度远超 2000），先被打破的是聚合查询延迟与去重精度，届时该动的只是消费层：完播聚合周期物化、已看集合换 ZSet 分页淘汰——埋点表结构不用动，采集端一条代码都不用改。

仓库：

- GitHub：[github.com/tx7do/go-wind-shortplay](https://github.com/tx7do/go-wind-shortplay)
- Gitee：[gitee.com/tx7do/go-wind-shortplay](https://gitee.com/tx7do/go-wind-shortplay)
