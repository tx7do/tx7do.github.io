---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Flutter
  - GoWind
  - CMS
  - 设计系统
  - 响应式
sticky: 10
---

# GoWind CMS 拆解：Flutter 主题内核重写——37 个 token、四档断点与一次 ScreenUtil 葬礼

> 本文回答一个问题：**当「观感」不再指望每个页面自觉，Flutter 端要把设计系统压进哪几层——主题内核钉住什么，布局内核钉住什么，为什么 ScreenUtil 必须死？**

[GoWind CMS](https://github.com/tx7do/go-wind-cms) 的 Flutter C 端（内容消费 App）在 11 月 4 日做了一次全量 UI 重写（`161d991c`）：主题内核按 design token 重建、响应式从「等比缩放」换成「四档断点 + 栅格反推」、导航骨架换成 `StatefulShellRoute`、`flutter_screenutil` 依赖整体退役。这次重写把「设计语言」从一份 markdown 文档变成了**代码里可测试的约束**，过程中踩的 Flutter 3.47 的两个坑也有完整的破解记录。

---

## 一、为什么重写：旧架构的三种病

重写前的 C 端有三个系统性问题：

1. **尺寸靠 ScreenUtil 等比缩放**（`.w/.h/.sp` 后缀遍布全仓 33 个文件 360+ 处）——它把整个 UI 按 375 宽的设计稿等比映射，平板和横屏上字和卡片跟着手机一起放大，内容型应用的阅读体验崩坏；
2. **观感靠 Material 3 默认值兜底**——组件样式散落在各页面，谁也没法回答「我们的卡片是什么圆角」；
3. **主题色可以配**——设置页挂着八个预设色板，品牌蓝只是「默认值」。

重写的目标是把一份已有的 `design-language.md`（一套「中式克制」的设计规范）从文档变成代码约束。产物是一个主题内核目录 + 一个布局内核目录，加上一场 ScreenUtil 的葬礼。重写后的实机观感——首页、探索、详情、我的四屏：

![Flutter C 端首页（重写后实机截图）](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_homepage.png)

![Flutter C 端探索页](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_explore.png)

![Flutter C 端文章详情页（桌面悬浮右栏 + 760 阅读栏）](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_post_detail.png)

![Flutter C 端我的页](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_profile.png)

---

## 二、主题内核五件套：色、形、字、体、壳

`lib/src/core/themes/` 下的分工一目了然：

| 文件 | 职责 |
|------|------|
| `palette.dart` | 双态原始色值单一事实源：`UiPalette` 37 字段 + 晴风/夜风两组 const |
| `tokens.dart` | Radius/Space/Border/Motion/Shadow 五组 token + `AppThemeExtension` |
| `typography.dart` | 十五角色的 TextTheme 构建 |
| `fonts.dart` | 按平台取系统字体，内置思源退兜底 |
| `app_theme.dart` | 亮暗共用一套组件规则的唯一 ThemeData 工厂 |
| `light_theme.dart` / `dark_theme.dart` | 薄壳：把对应 palette 传给工厂 |

**37 个色字段全部必填、双态各一份完整 const**——这是整个内核最重要的纪律。对比常见的「主色 + 自动派生」方案，全量列举的代价是定义时啰嗦，收益是任何一个语义色位（比如 `border`、`primarySoft`）在亮暗两态下都有被人工审过的值，不存在「暗色模式下这个色位用了亮色默认值」的事故面。

---

## 三、夜风的 onPrimary 为什么是深墨

37 个字段里最值得单独讲的一个：夜色主题的 `onPrimary`——压在主色上的文字色——不是白色，是深墨。

```dart
primary: Color(0xFF2E96FF),
// 白字压在 #2E96FF 上只有 2.9:1，深墨底字才够 4.5:1
onPrimary: Color(0xFF041426),
```

亮色主题的惯例是「主色底 + 白字」，但夜色主题的主色换成了更亮的 #2E96FF，白字对它的对比度只有 2.9:1——WCAG AA 要求正文 4.5:1。**对比度是无障碍的硬约束，不是审美偏好**；解决方案是反转关系：夜态下主色按钮用深墨底字。这个决定没有协商余地，代码注释把计算过程钉死在那里，防止后人「顺手改回白字」。

顺带一个排版细节同款待遇：设计文档写的 hero 标题 800 字重，代码里落地 700——注释原文「800 在苹方上会被合成加粗，压到 700」。**设计稿的数字要过字体的实际渲染这一关。**

---

## 四、AppThemeExtension：页面只许从 token 取值

token 的挂载方式是 Flutter 的标准姿势 `ThemeExtension`，但类注释里写明了它的宪法地位：

```dart
/// 挂在 ThemeData 上的整套设计 token。
///
/// 页面只允许从这里取值，不允许写死色值/圆角/间距——这是把 MD3 观感
/// 拉回中式克制的唯一着力点。
class AppThemeExtension extends ThemeExtension<AppThemeExtension> {
  final UiPalette palette;
  final RadiusTokens radius;
  final SpaceTokens space;
  final BorderTokens border;
  final MotionTokens motion;
  final ShadowTokens shadow;
}
```

取值侧配了一个 `ThemeDataTokens` 扩展，`Theme.of(context).palette / .radius / .space` 直达，带测试上下文兜底。`lerp` 的实现值得一看：

```dart
@override
AppThemeExtension lerp(AppThemeExtension? other, double t) {
  if (other == null) return this;
  if (t < 0.5) return this;
  return other;
}
```

不插值、离散切换（t<0.5 归旧值）——主题切换动画时不会出现「一半亮色一半暗色的中间态色值」。（这次重写把主题切换动画整个关掉了，lerp 保留离散语义是防御性的：万一将来开动画，也不会插出脏色。）

---

## 五、Flutter 3.47 的两个坑：fontFamily 与 scrollBehavior

主题内核落地时撞上的两个框架级坑，破解过程都写进了注释——这类注释是仓库里最值钱的部分。

**坑一：十五角色全非空时，`fontFamily` 参数会被整体丢弃。** `app_theme.dart` 的注释原文：

```dart
// ThemeData 构造里 `defaultTextTheme.merge(textTheme)` 是逐角色替换：
// 自定义 TextTheme 覆盖了全部 15 个角色，故 fontFamily 必须在自己的
// TextTheme 上 apply，只传 ThemeData 的 fontFamily 参数会被整体丢掉。
final textTheme = AppTypography.build(p).apply(
  fontFamily: AppFont.primaryFamily,
  fontFamilyFallback: AppFont.fallback,
);
```

很多人以为 `ThemeData(fontFamily: ...)` 是全局字族开关，实际上 Flutter 3.47 的 ThemeData 是 factory，内部拿你传的 textTheme 与默认值 merge——你的 TextTheme 十五个角色全非空，merge 结果就是你的 TextTheme 原样，构造器层面的 `fontFamily:` 一个角色都落不到。**解法是把字族 apply 到自己的 TextTheme 上**，并写了个平台断言测试钉住（第六节）。

**坑二：`scrollBehavior` 从 ThemeData 搬到了 MaterialApp。** Flutter 3.47 迁移项，`ThemeData(scrollBehavior: ...)` 不再生效，得在 `MaterialApp` 层传。坑本身不深，深的是它说明**框架级配置的挂载点会漂移，主题工厂的注释必须记录「当时挂在哪、为什么」**。

---

## 六、布局内核：四档断点与栅格反推

布局内核只有几个文件，核心是一个枚举：

```dart
enum WidthClass { compact, medium, expanded, wide }
// compact < 600 / medium < 900 / expanded < 1200 / wide
// 边界值归入更高一档（与 Material 断点口径一致）
```

替换掉的是 `flutter_screenutil` 的等比缩放哲学。两者差别一句话说清：**等比缩放把「宽度」当成唯一的自变量，断点系统把「宽度区间」当成离散的布局档位**。内容型应用在 600 和 900 宽的设备上需要的不是「放大 1.6 倍的手机版」，而是「medium 档的布局」。

档位之下最聪明的一个组件是 `AdaptiveGrid`——不写死列数，按最小卡片宽度反推：

```dart
/// 栅格反推：给「最小卡片宽」，算当前可用宽度能放几列。
///
/// 写死 `crossAxisCount: 2` 的问题在于卡片宽度随视口连续变化，而列数
/// 是离散的——必须在真正测量到的宽度上算，否则要么留大片空白要么挤爆。
static int columns({
  required double availableWidth,
  required double minItemWidth,
  double gap = 16,
  int maxColumns = 4,
}) {
  // n 列需要 n*min + (n-1)*gap；解出最大的 n
  final fit = ((availableWidth + gap) / (minItemWidth + gap)).floor();
  return fit.clamp(1, maxColumns);
}
```

输入是设计语义（「卡片最小 300dp」），输出是物理事实（这宽度放得下几列）。断点档位管宏观结构，栅格反推管微观密度——两者配合，任何宽度的屏幕上卡片都不会「挤爆或留白」。

`AdaptiveContent` 管版心：四档各有 `contentMaxWidth`（medium 720 / expanded 1040 / wide 1280）与 gutter，侧栏只在 expanded 起出现——注释里有一句产品判断：「medium 档宁可让卡片多一列」，768 宽的平板竖屏放侧栏，内容区就只剩 500 出头，不如让内容占满。

---

## 七、AdaptiveShell：一个 Scaffold 管两种外壳

重写前导航骨架有三宗罪，注释里全招了：

```dart
/// 旧的实现把移动端 tab 状态放在 `HomeMobileView` 里，
/// `/explore`、`/profile` 在窄屏被改写成 `HomePage(initialRoute: ...)`，
/// 于是「切 tab」不是路由跳转，深链、返回键、滚动位置全都对不上；而宽屏
/// 换窄屏时 `ResponsiveLayout` 直接换掉整棵子树，State 全丢。
```

切 tab 不是路由（深链失效）、路由改写 hack（返回键错乱）、换断点换子树（State 全丢）。重写后的解法是 go_router 的 `StatefulShellRoute.indexedStack`：四个分支（首页 / 探索 / 收藏 / 我的）各自持有独立的 Navigator 和 State，壳层只决定外框：

```dart
return Scaffold(
  appBar: compact ? null : _TopBar(currentPath: ...),
  // 宽屏正文 + 页脚；Scaffold 的 body 槽自带 GlobalKey，加页脚不会重挂分支子树
  body: compact
      ? widget.navigationShell
      : Column(children: [
          Expanded(child: widget.navigationShell),
          const _ShellFooter(),
        ]),
  bottomNavigationBar: showTabBar ? _BottomTabBar(...) : null,
);
```

窄屏底栏、宽屏顶栏 + 页脚，但 `navigationShell` 在两个分支里是**同一个实例**——跨断点旋转屏幕，页面状态不丢。收藏页从「只有服务端导航能进」变成可深链的一等路由，是这套骨架的直接红利。

---

## 八、ScreenUtil 葬礼：367 行 `.w/.h/.sp` 的清零

退役不是删依赖那么简单。`.w/.h/.sp` 扩展在 33 个文件里有 360+ 处调用，全部替换成 token 取值或固定逻辑值；`pubspec.yaml` 里的 `flutter_screenutil: ^5.9.3` 一行删除；`app.dart` 里的 `ScreenUtilInit` 包裹层拆除。葬礼之后全仓 grep `.w\b|.h\b|.sp\b` 只剩 6 行——还全是 `logger.w()` 的警告日志，与 ScreenUtil 无关。

为什么对内容型应用，等比缩放是错的方向？三个理由：

1. **阅读行长必须恒定**——正文栏宽 `kArticleLineWidth = 760`（注释：「阅读栏 ≤ 760dp，任何档都不例外」），等比缩放让大屏正文行长失控；
2. **字号不该跟着设备走**——15dp 的正文在平板上被放大成 20dp 是灾难，用户的阅读字号应当只随用户的设置变；
3. **`.w` 让所有尺寸失去语义**——代码里通篇是 `16.w`、`24.w`，没人知道设计意图是「间距」还是「字号」，design token 化之后 `space.sm`、`radius.md` 自带语义。

连带清理的还有魔法透明度和主题外硬编码色——归零的验收标准写在测试里，见下一节。

---

## 九、theme_kernel_test：把设计语言钉进 CI

重写最大的一个工程决策：**设计约束写成测试**。`theme_kernel_test.dart` 钉住的不变量清单：

- 双态主色钉死：晴风 `#006BE6` / 夜风 `#2E96FF` / 夜态 onPrimary `#041426`；
- 字族按平台断言：macOS 出 `PingFang SC`、Windows 出 `Microsoft YaHei`、Android 出内置思源——正是第五节那个 fontFamily 坑的回归防线：

```dart
test('字族：系统优先，内置思源退到 fallback', () {
  // 3.47 的 ThemeData 不再暴露 fontFamily getter，只能从 textTheme 读实际落地值
  String? bodyFamilyOf(ThemeData t) => t.textTheme.bodyMedium!.fontFamily;
  debugDefaultTargetPlatformOverride = TargetPlatform.macOS;
  expect(bodyFamilyOf(getLightTheme()), 'PingFang SC');
  // ……
});
```

- elevation tint 全关（卡片描边不投影）、`radius.md == 9`、TabBar 用下划线不用药丸、正文行高 ≥1.75、标题字距 ≤0、不斜体。

文件头注明钉的是「中式克制」方向硬指标——**谁把观感改回 MD3 默认，测试直接红**。这份测试让 `design-language.md` 从「文档」变成了「规范」：文档可以说「请」，测试说「必须」。

---

## 十、八预设色板之死

重写还做了一个产品级决定：删掉设置页的八个预设主题色。被删的代码是一座小色板坟场：

```dart
static const List<Color> _presetColors = [
  Color(0xFF006BE6), // 品牌蓝（默认）
  Color(0xFF6750A4), // 紫色
  Color(0xFF006B5E), // 墨绿
  Color(0xFFB7262E), // 中国红
  // ……共八个
];
```

新代码的注释给出了删除的正当性：

```dart
/// 主题色不再可配——品牌蓝是 docs/design-language.md §1 的铁律，
/// 八个预设色板会把「唯一行动色」降级成用户口味。
```

设置页只留三个选项：跟随系统 / 晴风（亮）/ 夜风（暗）。这是一次值得玩味的取舍：**个性化色板是工具型 App 的惯例，但内容品牌需要「唯一行动色」**——按钮、链接、高亮、标签全靠同一个蓝色建立视觉一致性，八个色板等于把品牌资产交给用户掷骰子。删配置项有时候不是做减法，是把设计话语权收回来。

---

## 十一、收尾

这次重写可以压缩成一个三层模型：

- **价值层**（palette 37 字段双态）：色值唯一事实源，对比度硬约束过审；
- **语义层**（tokens + typography + theme extension）：页面只许取语义 token，字族坑有测试钉防；
- **结构层**（WidthClass + AdaptiveGrid/Content + AdaptiveShell）：断点管宏观、栅格反推管密度、单壳双态管导航。

加上两场葬礼——ScreenUtil（等比缩放哲学退役）和八色板（主题可配权退役）——整个 C 端从「每个页面自己长」变成了「内核说了算」。367 行 `.w/.h/.sp` 清零的背后，是一句话的胜利：**设计系统的本质不是给页面提供更多选项，而是把选项收窄到只剩对的那些。**

仓库（本文所有代码路径均可逐行核对）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
