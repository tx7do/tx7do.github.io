---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - BI
  - 大屏
  - 数据可视化
sticky: 10
---

# GoWind Admin 拆解：BI 大屏设计器——schema 即 JSON、resolver 注入与三张快照表的口径谱系

> 本文回答一个问题：**给中后台接一套「可视化设计器 + 仪表盘/大屏渲染」，内核与宿主的边界画在哪、真实取数怎么设计、以及落地第一周会踩哪些坑？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 的 BI 仪表盘模块在 2026-10-29 一天全栈落地（`ada77bc5`）：`bi_dashboards` 表 + 三端管理页 + 设计器产物入库，随后一周内补齐版本历史、主题跟随、抽屉设计器交互。设计器与渲染内核来自作者的另一个独立仓 go-wind-ui（npm 包 `@go-wind/bi-core` / `bi-vue` / `bi-react`），admin 是它的**宿主**——持久化、权限、菜单、多租户都在这一层。

这篇拆三层：库与宿主的边界、数据链路的设计、以及落地一周内的踩坑实录——后者对任何准备接入第三方画布内核的项目都是前车之鉴。

---

## 一、库与宿主：图型在库，存取在宿主

模块文档（`docs/bi_dashboard.md`）开头就把边界写死：

> 库与宿主：**图型/布局/主题/联动/下钻/撤销栈全在 `@go-wind/bi-*`；本仓只管存取与展示。**

这个边界落在数据模型上，就是那条贯穿 GoWind 系设计器的铁律——**schema 即 JSON，服务端不解析只透传**（`bi_dashboard.go` ent schema）：

```go
field.String("payload").
    Comment("仪表盘 JSON（设计器 schema：数据集 + 图表布局 + 主题；服务端不解析只透传）").
    SchemaType(map[string]string{
        dialect.MySQL:    "json",
        dialect.Postgres: "jsonb",
    }),
```

和打印模板的 TEXT 黑盒同一口径，但 BI 用了 jsonb——版式语义仍然全部属于前端内核，后端升版本永不牵动存量仪表盘。同款思路也用在冗余列上：`chart_count`/`theme_key` 写入时顺手抽出成列，**列表页直显免解析 JSON**——与打印侧的 `paper_size`/`orientation` 冗余异曲同工。

`kind` 字段有个值得注意的三值枚举：`DASHBOARD / SCREEN / TEMPLATE`——同一套设计器内核与存储模型，同时承载**仪表盘**（中后台页内嵌）与**大屏**（投屏场景）两种产物形态，外加模板复用。分叉的是产物语义，不分叉的是内核。

---

## 二、数据链路：schema 不认识 HTTP，resolver 是宿主的插座

BI 设计器最容易被做歪的地方是数据链路——很多大屏产品把「取数」焊死在图表组件里，于是换数据源要改内核。go-wind-ui 的设计反其道而行（文档原话）：

> 数据集两类：`static`（内嵌行，设计期录入）与 `api`（运行时走 resolvers 回调取数）。**resolvers 是宿主注入的取数函数表（键 = dataset.id），schema 与渲染器不认识任何 HTTP 客户端**；本仓当前三端只消费 static 演示数据，接真实业务时在宿主层注入 resolver。

这个设计的分量在最后半句：渲染器连 HTTP 客户端都没有，取数是宿主通过 `provideBiEnv({...})` 注入的函数表——图表只声明「我要 dataset-x」，数据从哪来（REST/gRPC/静态/另一个服务）完全是宿主的事。admin 目前的接线诚实反映了阶段状态：

```ts
// env 注入：api 型数据集 resolver（演示接 IoT 设备列表）
// api 数据集 resolver 待接后端 CRUD 后注入
provideBiEnv({});
```

传的是空表——三端全部消费 static 内嵌行（演示 schema 里 `"type": "static"` + rows）。**插座装好了、电器还没插**，这个半成品状态被文档明说，而不是假装已接通。等后端数据集 CRUD 就绪，宿主注入 resolver 即可点亮 api 型数据集——内核零改动。

页面的取数优先级也值得一提（`loadSchema()`）：URL `?id=` 指定的后端行 > localStorage 草稿（`bi:schema:*`）> 内置 DEMO_SCHEMA。**草稿优先于内置示例，后端行优先于草稿**——设计器未保存的工作不丢，是这类编辑器体验的底线。

---

## 三、版本历史：三张快照表的口径谱系

BI 模块 11-08 补上了版本历史（`1346c8ac`），这让 GoWind 系有了三张「快照表」，正好可以横向对比口径：

| | `sys_bi_dashboard_revisions` | `sys_ai_agent_revisions` | 打印模板 |
|---|---|---|---|
| 快照内容 | dashboard_id + **version** + name + payload(jsonb) + source(SAVE\|RESTORE) | app_id + graph(TEXT) + source(SAVE\|RESTORE) | — 无快照表 |
| 唯一索引 | (dashboard_id, version) | 无（按 created_at 排序） | — |
| 乐观锁 | 主表有 version 列 | 主表无版本号 | — |
| 恢复可逆 | 先 RESTORE 留底再写回 | 同款 | — |

三张表的谱系关系写得明明白白——agent 修订表的注释自证「**镜像 BI 的 revisions 形态**」，但去掉了 version 维度（注释理由：「agent 主表无乐观锁版本号，快照按 created_at 排序即可」）；打印侧目前只有「payload 黑盒透传」同款，**版本化还没做**。

BI 版是三者中最完整的口径：version 列 + `(dashboard_id, version)` 唯一索引 + 乐观锁，三件套互相咬合——version 既是乐观锁凭据又是快照的排序键，不会出现「两个并发保存产生两个分不清先后的快照」。恢复语义三处同款：**先以 RESTORE 来源留底当前版本，再整份写回**（fieldmask 只点 name/payload），恢复操作本身可逆。快照写入失败不阻断保存，Errorf 留痕——审计旁路不堵主路，与 Agent 侧的取舍一致。

这段谱系给「快照/版本化」这个横切能力提供了一个可复用的判型：**有并发写入就上 version+唯一索引，纯单人编辑按时间排即可，但「恢复前留底」永远不能省**。

---

## 四、三端接入：React 容器 + Vue 画布的桥接壳

BI 内核的画布是 Vue 实现（bi-vue），react 端接入于是产生了一个「桥接壳」形态（`bi-designer/index.tsx`）：

```tsx
import "@go-wind/bi-react/style.css";
// React 设计器是「React 容器 + Vue 画布」的桥接壳，画布样式来自 bi-vue
import "@go-wind/bi-vue/style.css";
// ……
<BiDesignerReact
    // key 带数据源：换目标强制重挂载（initialSchema 是挂载快照，不回灌）
    key={`${dashboardId ?? "draft"}`}
    demo={!initialSchema}
    initialSchema={initialSchema}
    onChange={onSchemaChange}
/>
```

两个细节都有故事：

- **两份 style.css 都要引**——react 容器的样式来自 bi-react，画布的网格定位/卡片布局全在 bi-vue 的样式里，缺一份就出事（第五节的 zero height 坑正是这个）；
- **`initialSchema` 是挂载快照、不回灌**——设计器组件不在 schema 变化时重置画布，宿主想切换编辑目标必须换 `key` 强制重挂载。这其实是受控/非受控的折中：画布内部状态（撤销栈、选区）不该被外部 schema 更新打断，代价是切换目标必须整组件重建。

三端管理页按各自范式落地：react 走 antd Table + TanStack Query hooks；vue-element 走自研 ProPage 配置驱动表格；vben 走 `useVbenVxeGrid` + `useVbenDrawer`，抽屉还带了**关闭守卫**（`onBeforeClose` 脏数据 `Modal.confirm`）——设计器里未保存的编排，关抽屉前得问一句。

---

## 五、落地一周的踩坑实录：五个经典事故样本

从全栈落地（10-29）到版本历史补齐（11-08），一周内的修复 commit 是一份高质量的踩坑教材。五个坑按性质分型：

**坑一：样式黑洞——图表 DOM 存在但高度为 0（`d8da4016`）。**

> The library's scoped styles (position:absolute grid, flex column cards, chart canvas dimensions) live in the CSS bundle. Without the style.css import, cards rendered as display:block position:static with 0px height — charts existed in DOM but had no rendering space.

库的布局全靠 scoped CSS（绝对定位网格 + flex 卡片 + 画布尺寸），页面忘了 `import "@go-wind/bi-vue/style.css"`，图表组件照样挂载、照样在 DOM 里、只是没有渲染空间。**症状是「白渲染」而非报错**，所以排查的第一反应往往是图表库版本问题而不是样式缺失。修法一句话：组件库凡是带样式的，`style.css` 必须与组件同生共死——最稳的做法是把它写进接入文档第一行。

**坑二：exclude 的传递依赖连坐——react 白屏（`7f16c784`）。**

vite 配置里 `optimizeDeps.exclude: ['@go-wind/editor-react']`（编辑器产物含 monaco 的 `?worker` 导入，优化器处理不了，必须走源码链路）——但**被 exclude 的包，其传递依赖同样不预构建**，其中两类是裸 CJS：`@tiptap/react` 从 `use-sync-external-store/shim` 具名导入、`lowlight` 深引 `highlight.js/lib/*`，裸进浏览器解析不了具名导出，整个页面白屏。修复是把这两类显式纳入 `include`，让预构建把它们转成 ESM：

```ts
optimizeDeps: {
    // 被 exclude 的子树其传递依赖同样不预构建，其中两类是裸 CJS、浏览器解析不了具名导出
    exclude: ['@go-wind/editor-react'],
    include: ['lowlight', 'highlight.js', 'highlight.js/lib/core',
              'use-sync-external-store/shim', /* … */],
},
```

**exclude 从来不是单包操作，是子树操作**——exclude 一个包，等于替它所有的传递依赖做了同样的决定。这个心智模型没建立之前，这类白屏会以各种变体反复出现。

**坑三：等比缩放的留白——vue-element 视口填充（同 `7f16c784`）。**

`fit=width` 只按宽度等比缩放，宽扁容器（横幅式仪表盘）下方留大片空白。修复是**按容器宽高比反推设计宽度**：

```ts
// designWidth = 内容高 × W/H（内容高复用渲染器 layoutCharts）
designWidth.value = Math.min(3840, Math.max(960, Math.round((contentHeight * width) / height)));
```

960..3840 的钳位防极端值，同时用 `overflow:hidden` 断开「滚动条出现→容器变窄→重算→滚动条消失→变宽→……」的**布局反馈环**。等比缩放类组件的宿主适配，几乎必遇这一环。

**坑四：页面存在、入口不存在。** 同一批修复里发现 `/bi/dashboard` 路由没注册——页面文件写好了、侧栏没有入口。三端接模块时，「路由注册」和「页面实现」是两个独立完成度，走查清单要分开列。

**坑五：主题钉死被当成跟随失效（`3c39eb9e`）。** 设计器语义是「schema 不写 theme.key 即跟随宿主亮暗」，但演示 schema 和内置种子都写死了 `"theme":{"key":"tech-blue"}`——宿主切主题时演示面永远不变，被用户当成「跟随功能坏了」。修复是把演示与内置的 theme.key 全部摘掉：

```diff
- ThemeKey: trans.Ptr("tech-blue"),   // 内置种子
+ // 不钉主题预设：跟随宿主亮暗（大屏需要钉死时在设计器主题下拉里选预设）
```

这个坑的产品教训：**默认值本身就是一种钉死**。要给「跟随」语义留一条真正空着的路径，而不是拿一个具体预设充当默认。

---

## 六、收尾

BI 模块的接入姿势可以压缩成三条边界：

1. **内核边界**：图型/布局/主题/联动/下钻/撤销栈在库，存取/权限/租户在宿主，schema 是两者之间唯一的合同（jsonb 黑盒 + 冗余列）；
2. **数据边界**：渲染器不认识 HTTP，resolver 函数表是宿主的插座——static 先行、api 待接，阶段诚实；
3. **快照边界**：version+唯一索引+乐观锁的最完整口径留在 BI，其余模块按需镜像降配。

而落地一周的五个坑——样式黑洞、exclude 连坐、等比留白、入口遗漏、默认值钉死——恰好覆盖了「接入第三方画布内核」的五类高频事故。**接入前把这份清单过一遍，大概能省一周的返工。**

仓库（宿主与文档均可逐行核对，内核在独立仓 go-wind-ui）：

- GitHub：[github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- Gitee：[gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)
