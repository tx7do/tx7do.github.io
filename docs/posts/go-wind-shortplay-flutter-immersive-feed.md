---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Flutter
  - GoWind
  - 短视频
  - 移动端
sticky: 10
---

# GoWind ShortPlay 拆解：Flutter 沉浸式 Feed 的播放器工程——生命周期、手势状态机与游客降级

> 本文回答一个问题：**一个"上下滑短视频"App，把抖音的手感做对，Flutter 端到底要处理哪些细节？**

上下滑短视频 App 的代码量错觉很强：看起来就是"一个 PageView + 一个播放器"，但 [GoWind ShortPlay](https://github.com/tx7do/go-wind-shortplay) 的 Flutter 端（BLoC + media_kit，一套代码 iOS/Android/Windows 同源）真正下功夫的全是看不见的地方——**页面切换时播放器状态的精确交接、单击秒响应与双击点赞并存的判定、游客刷得动但互动要登录的静默降级**。这篇拆 Flutter 端三个最值得学的板块：播放器生命周期、手势状态机、401 游客降级。

---

## 一、播放器生命周期：每页一个播放器，靠 PageView 自然回收

结构（`feed_page.dart` + `feed/widgets/video_player_item.dart`）：垂直 `PageView.builder`，每页一个 `_FeedPageItem` 持有自己的 media_kit `Player`。**没有预加载池，也没有"滑远就 dispose"的窗口管理**——内存控制完全交给 PageView 的自然回收（默认只保留相邻页）。

这个"反常识"的选择背后是一个精确的折中。抖音式的三缓冲（上一/当前/下一）能压首帧延迟，但要自管一套页面池的生命周期；ShortPlay 的做法是：

```dart
// 每页 item 挂载即 open,但只有活跃页 play
await _player.open(Media(video.playUrl), play: widget.isActive);
```

**所有页提前 open（首帧数据先行加载），只有活跃页 play（不抢解码资源）**。滑到位时播放器已经 open 完成，起播延迟被摊薄；离开的页立刻 pause + dispose 由 PageView 兜底。MVP 量级下，这个折中的工程复杂度只有三缓冲的零头。

**活跃态的交接**不用 `onPageChanged` 回调，而是父组件 build 时实时计算传给每页：`isActive = index == _pageController.page.round()`，切换逻辑收在 `didUpdateWidget`：

```dart
if (oldWidget.isActive && !widget.isActive) {
  unawaited(_player.pause());
  final progress = _snapshot();           // {watchMs, percent}
  if (progress.percent < 95) {
    widget.onSwipeAway?.call(progress);   // <95% 才算划走(见下文埋点小节)
  }
}
if (!oldWidget.isActive && widget.isActive) {
  unawaited(_player.play());
}
```

不用回调驱动而用 build 时计算，有个实际收益：滚轮/触摸板这类输入源不触发 `onPageChanged`（只有拖拽翻页触发），`page.round()` 的口径对一切输入源一致——上一节的滚轮翻页能正常联动播放器，靠的就是这个。

**心跳的节流**做在播放器组件内：

```dart
_heartbeatTimer = Timer.periodic(const Duration(seconds: 10), (_) {
  if (_player.state.playing) {
    widget.onHeartbeat?.call(_snapshot());   // 暂停不计心跳
  }
});
```

快进/拖动由 `_snapshot()` 取实时位置，服务端拿到的是"每 10 秒一次、只在真看"的干净脉冲。`_snapshot()` 里还处理了一个边界：`_durationMs <= 0`（metadata 未就绪）时先取一次 duration 再算百分比，percent clamp 到 0-100。

这段同时是推荐闭环的数据源（划走/完播/心跳信号的去向与消费逻辑，见推荐闭环专题《不用模型的推荐闭环》）——**播放器组件自己抛信号，宿主决定上报**，职责分离。

其余口径都对齐抖音：单视频 `PlaylistMode.loop` 无限循环；剧集连播传 `loop: false` 播完停末帧由宿主切集；Web 端 `PlayerConfiguration(muted: kIsWeb)` 规避浏览器自动播放策略——media_kit 没有 `setMuted`，用 `setVolume(0/100)` 表达，注释还点名了 Web 端坑：`setVolume` 内部会解除 `<video>` 的 muted 属性，所以音量 100 即恢复声音。活跃页播放时 `WakelockPlus.enable()` 保持屏幕常亮。

---

## 二、手势状态机：单击秒响应与双击点赞并存

短视频手势的难点只有一个：**单击（暂停/播放）要求零延迟，双击（点赞）要求窗口判定，两者天然冲突**。Flutter 原生 `GestureDetector` 的 `onDoubleTap` 会让单击等待双击窗口超时才触发——手感直接报废。

解法是手写 300ms 双击窗口，**单击先执行、双击来了再撤销**：

```dart
if (isDoubleTap) {
  if (_toggledByLastTap) {
    // 撤销第一次单击造成的播放态切换,回到双击前的状态
    unawaited(_player.state.playing ? _player.pause() : _player.play());
  }
  widget.onDoubleTapLike?.call(details.localPosition);
  return;
}
```

时序走一遍：用户单击 → 立刻暂停播放、记下 `_toggledByLastTap = true` → 300ms 内第二次点击到来 → **先把上一次的暂停撤销（恢复播放）** → 触发点赞。单击永远零延迟，双击的用户感知是"暂停闪了一下又恢复"——这正是抖音的手感。

点赞业务（`like_burst.dart` 的 `runDoubleTapLike`）同样对齐抖音口径：`HapticFeedback.lightImpact()` 触觉反馈 → **已赞只播爆心动画不取消**（双击永远只加不减）→ `ensureLogin` 游客引导 → 调接口 + UBA 埋点 → 红心按点击坐标爆开（`LikeBurstLayer`）。

**按住 2 倍速**是另一组状态：`onLongPressStart → setRate(2.0)`（仅播放中生效），松手/取消恢复 1.0，顶部浮"2x 快进中"胶囊。**桌面滚轮**则由页面层用 `GestureBinding.instance.pointerSignalResolver` 抢先截获滚轮事件，180ms 节流一格翻一页——不走平滑滚动，从源头避免触摸板停在两页之间的"半程态"；另有 `_snapToNearestPage()` 兜底（`ScrollEndNotification` 时 200ms 内 animateToPage 吸附）。

---

## 三、状态管理：9 个 BLoC 的克制

全 App 只有 9 个 Bloc/Cubit：`FeedBloc` / `CommentBloc` / `NotifyBloc` 三个业务块 + `AppThemeCubit` / `ConnectivityBloc` + 四个底座通用件（`PageCubit<T>` / `ListApiCubit<T>` / `GetApiCubit<T>` / `TextChangedCubit`）。

`FeedBloc` 的设计值得抄：事件用 **sealed class**（`FeedRefreshed` / `FeedNextPageRequested` / `FeedVideoReplaced`——点赞后原位替换当前视频就靠最后一个事件），私有 `_pageNum` 记页码，**加载失败时 `_pageNum -= 1` 回滚**——重试不会跳页。状态只有 `items/isLoading/hasMore/errorMessage/reachedEnd` 五个字段，Equatable + copyWith（`errorMessage` 特意可空，才能显式清空错误）。

更有意思的是它**没有全局认证 Bloc**：登录态走 `UserAuthCache.loginStateNotifier`（`ValueNotifier<bool>`）+ GetIt，底栏用 `ValueListenableBuilder` 订阅。登录态是个布尔语义的极简状态——上一个全局 Bloc、一套 AuthEvent/AuthState 的仪式感纯属过度设计。"**页面级状态归 BLoC，全局布尔态归 ValueNotifier**"的混合风格，比原教旨主义实用得多。

---

## 四、401 静默降级：游客刷得动，互动要登录

C 端短视频的体验底线是**游客可以先刷起来**。这要求 token 失效的处理绝对不能打扰浏览——ShortPlay 的实现（`authentication_interceptor.dart`）有三层：

**第一层：单飞刷新。** 并发多个请求同时 401 时，只有第一个发起 refresh，其余共享同一个 `_refreshing` Future；`extra['authRetried']` 标记保证每个原始请求只重试一次；`/auth/login`、`/auth/refresh` 自身在 `_noRefreshPaths` 黑名单里防递归。

**第二层：刷新失败回游客态。** `doAuthenticationFailed()` 清 token + 路由回首页——用户退回游客继续刷，**原始 401 依然透传给调用方**（需要精确错误的调用方拿得到）。单飞的结构是经典的 Future 共享：

```dart
// 语义示意:并发 401 共享同一次刷新
_refreshing ??= _doRefresh().whenComplete(() => _refreshing = null);
await _refreshing;
```

`extra['authRetried']` 标记保证每个原始请求只重试一次，`/auth/login`、`/auth/refresh` 在 `_noRefreshPaths` 黑名单里防递归——否则刷新请求自身 401 会再次触发刷新，无限循环。注释里还留着演进史："此前写死 false，401 直接抛给页面"——静默降级是后来才补上的，这类体验决策有版本轨迹很正常。

**第三层：互动时引导。** `ensureLogin(context)`：未登录弹底部抽屉（桌面宽窗 `maxWidth: 560` 收窄居中）→ push 登录页 → 返回后复查 `hasLogin`。Tab 级也有分流：发布 Tab 未登录直接引导，消息 Tab 则放行进页面由页面自身的 requireLogin 态展示引导——**拦截的粒度精确到"哪一步才真正需要身份"**。

配套细节：token 存 SharedPreferences，userId 从 JWT claim 用 `jose` 库 `unverified` 解出（不验签只取声明，校验由服务端做）；登录密码 AES-CBC 传输加密（与后端约定 key=iv 的 16 字节密钥，服务端解密后再 bcrypt）。

还有个值得引用的工程防御：拦截器里有一个懒工厂 `authServiceFactory`，注释披露了它解决的真实事故——transport 初始化早于 repository 注册的顺序依赖，以及某版本拦截器曾被整段注释导致**所有请求裸奔**。懒注入是给"初始化顺序"上保险的经典手法。

---

## 五、错误处理：message 不进 UI，reason 才是契约

`base_service.dart` 的 `handleDioError` 确立了一条完整的错误哲学：

```
DioException
  ├─ 有 Kratos 错误体 {code, reason, message, metadata}
  │    → reason 是机器可读契约,直转本地 Status
  └─ 无错误体(网络层失败)
       → 按 DioExceptionType 合成 reason:
         connectionTimeout/timeout → TIMEOUT
         connectionError          → CONNECTION_ERROR
         badCertificate           → CERTIFICATE_ERROR
         ...
```

两条纪律让这套哲学立得住：**其一，网络层错误也归一成同一套 reason 语义**——UI 层不需要区分"服务端拒绝"和"网断了"两套处理分支；**其二，"message 是开发向英文文本，不进用户可见链路，UI 层按 reason 取本地化文案"**（注释原话）——服务端 message 文案一改，客户端 UI 就跟着变，这在多语言场景是事故源。这与管理后台"错误提示只认 reason 不认 message"的 i18n 点查完全同构：GoWind 生态把"reason 即契约"贯穿了 App、后台、服务端三端。

---

## 六、上传与桌面适配（两笔带过）

**分片上传客户端**（`publish/services/upload_service.dart`）与后端三段式协议对应：`POST /uploads` → `PUT /uploads/{taskId}/chunks/{i}`（octet-stream 原始字节）→ `POST /complete`。同步读文件循环 PUT、顺序上传，独立 Dio 把超时放宽到 10 分钟并复用认证拦截器（注释点名：缺了拦截器发布会 401）。没有断点续传和并发分片——MVP 的上传体验到"有进度、不超时"为止，进取空间留白。

**Windows 桌面适配**做了三件实事：窗口默认 **420x780 手机比例**（竖屏短视频的物理形态）；ScreenUtil 的 `designSize` 在桌面/Web 动态重设为当前视窗，让 `.w/.sp` 恒为 1:1（否则 375 设计稿在 1080p 放大三倍多）；中文渲染走 `chinese_font_library` + Windows 字体族列表。加上前文的滚轮翻页与宽窗 BottomSheet 收窄，"手机 App 跑在桌面上"的违和感基本被抹平。

---

## 七、结语

这篇拆的三块可以各留一句话：

1. **播放器生命周期**：不做三缓冲不是偷懒，是"提前 open、活跃才 play"的折中——工程决策的优劣取决于它替你省掉了什么复杂度；
2. **手势状态机**：单击秒响应与双击判定并存的关键是"先执行、后撤销"（`_toggledByLastTap`）——与其等待，不如行动了再反悔；
3. **401 静默降级**：游客体验的守护者是"单飞刷新 + 失败回游客态 + 精确到动作的登录引导"三层——身份失败不该是一次可感知的事故。

这三块都是"手感"层面的工程——没有架构图上的一席之地，却直接决定用户留没留下来。

仓库（Flutter 端在 `frontend/app`）：

- GitHub：[github.com/tx7do/go-wind-shortplay](https://github.com/tx7do/go-wind-shortplay)
- Gitee：[gitee.com/tx7do/go-wind-shortplay](https://gitee.com/tx7do/go-wind-shortplay)
