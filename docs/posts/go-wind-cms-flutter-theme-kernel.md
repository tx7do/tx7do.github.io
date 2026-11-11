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

# GoWind CMS 拆解：Flutter 设计系统内核——双态 token、四档断点与自适应壳层

> 本文回答一个问题：**一个内容型 Flutter 应用要让「观感」由内核说了算——色值怎么定、字号怎么钉、断点怎么分、栅格列数怎么算、导航壳怎么保证跨断点不丢状态？把这套设计系统内核的三层结构逐层拆开。**

[GoWind CMS](https://github.com/tx7do/go-wind-cms) 的 Flutter C 端（内容消费 App）有一套完整的设计系统内核：`lib/src/core/themes/` 承载主题（色、形、字、体、壳五件套），`lib/src/core/layout/` 承载响应式结构（四档断点 + 栅格反推 + 自适应壳层）。它的架构是清晰的三层模型——**价值层**（色值唯一事实源）、**语义层**（页面只许取语义 token）、**结构层**（断点管宏观、栅格反推管密度、单壳双态管导航），每层都配了把设计约束钉进 CI 的测试。实机观感先看四屏——首页、探索、详情、我的：

![Flutter C 端首页](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_homepage.png)

![Flutter C 端探索页](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_explore.png)

![Flutter C 端文章详情页（桌面悬浮右栏 + 760 阅读栏）](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_post_detail.png)

![Flutter C 端我的页](https://tx7do.github.io/assets/images/go_wind_cms/flutter_app_profile.png)

---

## 一、价值层：UiPalette 37 字段双态必填

主题内核的第一层是 `palette.dart`——**双态原始色值的唯一事实源**：`UiPalette` 37 个字段，晴风（亮）/ 夜风（暗）各一份完整 const：

```dart
/// 晴风（浅色）
const UiPalette kDayPalette = UiPalette(
  background: Color(0xFFF4F7F9),
  surface: Color(0xFFFFFFFF),
  inkStrong: Color(0xFF0F172A),
  ink: Color(0xFF1E293B),
  border: Color(0xFFE4E9F0),
  primary: Color(0xFF006BE6),
  primaryDeep: Color(0xFF005AC2),
  primarySoft: Color(0xFFE6F1FE),
  onPrimary: Color(0xFFFFFFFF),
  ...
```

**37 个色字段全部必填、双态各一份完整 const**——这是整个内核最重要的纪律。对比常见的「主色 + 自动派生」方案，全量列举的代价是定义时啰嗦，收益是任何一个语义色位（比如 `border`、`primarySoft`）在亮暗两态下都有被人工审过的值，不存在「暗色模式下这个色位用了亮色默认值」的事故面。

37 个字段里最值得单独讲的一个：夜色主题的 `onPrimary`——压在主色上的文字色——不是白色，是深墨。

```dart
primary: Color(0xFF2E96FF),
// 白字压在 #2E96FF 上只有 2.9:1，深墨底字才够 4.5:1
onPrimary: Color(0xFF041426),
```

亮色主题的惯例是「主色底 + 白字」，但夜色主题的主色换成了更亮的 #2E96FF，白字对它的对比度只有 2.9:1——WCAG AA 要求正文 4.5:1。**对比度是无障碍的硬约束，不是审美偏好**；解决方案是反转关系：夜态下主色按钮用深墨底字。这个决定没有协商余地，代码注释把计算过程钉死在那里，防止后人「顺手改回白字」。

排版细节同款待遇：设计稿写的 hero 标题 800 字重，代码里落地 700——注释原文「800 在苹方上会被合成加粗，压到 700」。**设计稿的数字要过字体的实际渲染这一关。**

---

## 二、语义层：页面只许从 token 取值

第二层是 `tokens.dart` + `typography.dart` + `app_theme.dart`。token 的挂载方式是 Flutter 的标准姿势 `ThemeExtension`，但类注释里写明了它的宪法地位：

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

不插值、离散切换（t<0.5 归旧值）——主题切换时不会出现「一半亮色一半暗色的中间态色值」。主题切换动画整个是关闭的，lerp 保留离散语义是防御性的：万一将来开动画，也不会插出脏色。

字号体系由 `AppTypography.build` 构建——**十五个 TextTheme 角色全非空**，正文行高 1.75+、计数用 tabularFigures、CJK 不用斜体：

```dart
static TextTheme build(UiPalette p) {
  ...
  return TextTheme(
    // 首页 hero：30–36 / 700（doc 写的 800 在苹方上会被合成加粗，压到 700）
    displayLarge: ts(size: 30, weight: FontWeight.w700, height: 1.28,
      spacing: -0.3, color: p.inkStrong),
    ...
    // 文章正文 16–17 / 1.8；常规正文 14–15 / 1.7
    bodyLarge: ts(size: 16, weight: FontWeight.w400, height: 1.8),
    bodyMedium: ts(size: 15, weight: FontWeight.w400, height: 1.75),
```

字体按平台取系统优先（`fonts.dart`：macOS 苹方 / Windows 雅黑 / Android 思源），内置 Noto Sans SC 只做兜底。

---

## 三、Flutter 3.47 的两个坑：fontFamily 与 scrollBehavior

这套内核落地时撞上的两个框架级坑，破解过程都写进了注释——这类注释是仓库里最值钱的部分。

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

很多人以为 `ThemeData(fontFamily: ...)` 是全局字族开关，实际上 Flutter 3.47 的 ThemeData 是 factory，内部拿你传的 textTheme 与默认值 merge——你的 TextTheme 十五个角色全非空，merge 结果就是你的 TextTheme 原样，构造器层面的 `fontFamily:` 一个角色都落不到。**解法是把字族 apply 到自己的 TextTheme 上**，并写了个平台断言测试钉住（第九节）。

**坑二：`scrollBehavior` 从 ThemeData 搬到了 MaterialApp。** Flutter 3.47 迁移项，`ThemeData(scrollBehavior: ...)` 不再生效，得在 `MaterialApp` 层传。坑本身不深，深的是它说明**框架级配置的挂载点会漂移，主题工厂的注释必须记录「当时挂在哪、为什么」**。

---

## 四、结构层：四档断点与栅格反推

第三层在 `lib/src/core/layout/`，核心是一个枚举：

```dart
enum WidthClass { compact, medium, expanded, wide }
// compact < 600 / medium < 900 / expanded < 1200 / wide
// 边界值归入更高一档（与 Material 断点口径一致）
```

这是对尺寸方案的立场声明：**宽度区间是离散的布局档位，不是连续的缩放系数**。内容型应用在 600 和 900 宽的设备上需要的不是「放大 1.6 倍的手机版」，而是「medium 档的布局」。三个具体的设计取向支撑这个立场：

1. **阅读行长必须恒定**——正文栏宽 `kArticleLineWidth = 760`（注释：「阅读栏 ≤ 760dp，任何档都不例外」），等比缩放会让大屏正文行长失控；
2. **字号不该跟着设备走**——15dp 的正文在平板上被放大成 20dp 是灾难，用户的阅读字号应当只随用户的设置变；
3. **尺寸要有语义**——`16.w`、`24.w` 这种缩放后缀让人分不清设计意图是「间距」还是「字号」，`space.sm`、`radius.md` 自带语义。

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

## 五、自适应壳层：一个 Scaffold 管两种外壳

导航壳层的核心问题是：窄屏底栏、宽屏顶栏 + 页脚，**分支页面不能因为外壳切换而重建**。解法是 go_router 的 `StatefulShellRoute.indexedStack`：四个分支（首页 / 探索 / 收藏 / 我的）各自持有独立的 Navigator 和 State，壳层只决定外框：

```dart
/// 这里分支由 go_router 的 `StatefulShellRoute.indexedStack` 持有，壳层只决定
/// 外框。Scaffold 的 body 槽自带 GlobalKey，所以跨断点收放 appBar /
/// bottomNavigationBar 不会重挂分支子树。

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

窄屏底栏、宽屏顶栏 + 页脚，但 `navigationShell` 在两个分支里是**同一个实例**——跨断点旋转屏幕，页面状态不丢。切 tab 是真路由跳转（深链、返回键、滚动位置全部正常），收藏页是一等路由可深链。

详情页的高频适配也长在这层：桌面端点赞/收藏是悬浮右栏（`InteractionBar(vertical: true)` 形态），移动端是操作条横排——**横纵两态共用同一份交互态逻辑**，只换布局不换状态。

---

## 六、主题色的立场：唯一行动色

设置页的外观选项只有三个：跟随系统 / 晴风（亮）/ 夜风（暗）。没有主题色选择——这不是功能缺失，是设计立场：

```dart
/// 主题色不再可配——品牌蓝是 docs/design-language.md §1 的铁律，
/// 预设色板会把「唯一行动色」降级成用户口味。
```

按钮、链接、高亮、标签全靠同一个品牌蓝（晴风 #006BE6 / 夜风 #2E96FF）建立视觉一致性；**个性化色板是工具型 App 的惯例，内容品牌需要「唯一行动色」**——把品牌资产交给用户掷骰子，等于放弃视觉一致性。删配置项有时候不是做减法，是把设计话语权收回来。

---

## 七、theme_kernel_test：把设计语言钉进 CI

整个内核最大的一个工程决策：**设计约束写成测试**。`theme_kernel_test.dart` 钉住的不变量清单：

- 双态主色钉死：晴风 `#006BE6` / 夜风 `#2E96FF` / 夜态 onPrimary `#041426`；
- 字族按平台断言：macOS 出 `PingFang SC`、Windows 出 `Microsoft YaHei`、Android 出内置思源——正是第三节那个 fontFamily 坑的回归防线：

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

## 八、收尾

三层结构合起来看：

| 层 | 组成 | 钉住什么 |
|----|------|---------|
| 价值层 | palette 37 字段双态 | 色值唯一事实源，对比度硬约束过审 |
| 语义层 | tokens + typography + ThemeExtension | 页面只许取语义 token，字族坑有测试钉防 |
| 结构层 | WidthClass + AdaptiveGrid/Content + AdaptiveShell | 断点管宏观、栅格反推管密度、单壳双态管导航 |

如果只带走一句：**设计系统的本质不是给页面提供更多选项，而是把选项收窄到只剩对的那些**——37 个必填色位收窄了色值自由度，语义 token 收窄了尺寸自由度，四档断点收窄了布局自由度，唯一行动色收窄了品牌自由度；而 `theme_kernel_test` 保证这些收窄不会被人不小心松开。

仓库（本文所有代码路径均可逐行核对）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
