---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - 打印
  - 前端组件
  - chromedp
sticky: 10
---

# GoWind Admin 拆解：打印模板设计器——许可证一票否决下的 fork 接管与 M0-M4 分期

> 本文回答一个问题：**给企业中后台补一套「设计器 + 模板 + 行打印 + 服务端 PDF」的打印能力，内核怎么选、前后端怎么分工、许可证风险怎么变成工程决策？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 的打印模板模块在 2026-10-27 到 11-09 之间走完了从选型到 M4 评估的完整周期：fork 一个 MIT 内核、后端建模板域、三端接管理页与行打印、服务端 PDF 补输出链、渲染器下沉通用库、模板对租户开放并挂上配额。全程按 M0-M4 分期推进，每期都有文档回写。这篇拆五个决策点：选型、接缝、分工、开放、安全。

---

## 一、选型：许可证为什么是一票否决项

打印设计器的选型文档（`docs/print_template.md` §2）开宗明义定了一条原则：

> 前提约束：本仓 **MIT**；产品定调「做完善」（深度绑定内核、长期演进）——因此许可证从"风险项"升级为"**一票否决项**"，稳定性优先于省代码。

候选四个，逐一裁决：

| 候选 | 协议 | 结论 |
|------|------|------|
| hiprint（vue-plugin-hiprint） | 内核公认 **LGPL**，npm 包装声明 MIT 属衍生争议区 | ❌ 淘汰。生态最大但许可证脏 |
| **worm-vue3-print** | **MIT**（依赖全 MIT/Apache/ISC 系） | ✅ 基座 |
| openprint | **GPL-3.0** | ❌ 代码零复用，仅采点子 |
| 全自研 | MIT | ❌ 拖拽画布是打磨型工程（吸附/标尺/撤销重做/组合），月级成本 |

这表里最有讨论价值的是对 hiprint 的处理：它生态最大，「npm 包声明 MIT」看起来能擦边——但文档直接点破**内核 LGPL、包装 MIT 属衍生争议区**。对一个要做「完善 + 长期演进」的产品，许可证风险在选型期消灭的成本，远低于上线后被迫重写的成本。

选定 MIT 基座后还有一层风险要拆：**上游 18 stars、单人维护、bus factor = 1，作为 npm 依赖长期挂靠是最大风险源**。解法是 fork 接管 worm-vue3-print（v1.3.11）的 core + canvas + common 三个包，以独立仓维护（npm 包 `@go-wind/print-*`），本仓按**精确版本**依赖自己的 fork——不挂靠上游 npm。「MIT 允许随时 fork，fork 之后该风险即告消除」——这句话值得所有纠结「要不要自己造轮子」的团队读一遍：fork 不是造轮子，是把轮子搬进自己家。

---

## 二、M1 模板域：payload 黑盒 + 冗余列 + 内置种子

后端域模型刻意做薄（`print_template.go` ent schema）：

```go
field.String("code").Comment("模板编码，租户内唯一，业务侧按编码取模板"),
field.String("resource_key").Comment("绑定资源标识（对应菜单/资源的 generated service 键…）"),
field.Text("payload").Comment("模板 JSON（…毫米布局 + schemaVersion，服务端不解析只透传）"),
field.Bool("is_built_in").Comment("是否系统内置模板（内置禁删，可复制派生）").Default(false),
field.String("paper_size").Comment("纸张尺寸冗余列（…来自 payload.paperSize，列表页直显免解析 JSON）"),
field.String("orientation").Comment("纸张方向冗余列（portrait/landscape…）"),
```

三个设计决定：

1. **payload 是 TEXT 黑盒**——服务端不解析、不校验内部结构，只透传。版式语义全部属于前端内核，后端版本升级永不牵动模板数据；
2. **但把 `paper_size`/`orientation` 冗余成列**——列表页要显示纸张信息，为此解析每行的 JSON 不值得，写入时顺手抽两列出来，查询路径零 JSON 解析；
3. `(code, tenant_id)` 唯一 + `resource_key` 普通索引——前者支撑「业务侧按编码取模板」，后者直接服务于行打印的模板匹配（见下节）。

**内置种子**走「缺一补一」：启动期 `SeedDefaults` 播种（repo 注释原话「按编码缺一补一地播种内置打印模板；管理员自建行不应阻断内置模板补种」），种子清单（`backend/pkg/constants/default_data.go`）：

```go
// DefaultPrintTemplates：
//   builtin.generic.a4 / builtin.generic.a5  —— elements:[] 空版式基线
//   demo.user.badge                          —— 用户工牌演示模板
//     ResourceKey: "system/user"
//     元素 options.formatter 内 {username}/{realname} 等 {field} 绑定行字段
```

种子的定位说得诚实——只保「编码/纸张元数据 + 链路可用」，**租户拿到自己能改的模板靠管理页的「复制内置派生」**：copy 模式下 code 清空让租户自编、payload 注入被复制模板，内置行禁删可复制。

配套的 `fieldsFromSample` 是个小而妙的函数：由示例数据对象**派生**设计器字段面板——M1 里吃演示数据，M2 接行打印时「同一函数吃真实行数据，模板字段与数据天然对齐」。一个函数横跨设计期与运行期，字段绑定永远不会对不上。

---

## 三、M2 行打印定式：统一入口与匹配语义

行打印要解决的问题是：**任意列表页怎么用最低成本接入打印？**答案是三端同构的一个定式（react 版签名）：

```ts
/**
 * 行打印定式（docs/print_template.md §5）：任意列表行接入打印能力的统一入口。
 * 用法：页面里 `const { node, print } = usePrintTemplateDialog();`，
 * JSX 放 `{node}`，行动作里 `print('system/user', record)`。
 * 模板匹配：优先取 resourceKey 精确相等且启用的模板；没有则回退"通用模板"
 * （resourceKey 为空的行）；仍无则显示空态引导到打印模板页。
 */
export function usePrintTemplateDialog() { ... }
```

匹配语义三段式，写在数据契约的旁边：

- **数据契约**：整个行对象即打印数据——模板字段用点路径绑定行数据（`{customer.name}`、数组路径 `items[].sku`），没有中间 DTO；
- **匹配规则**：`resourceKey` 精确相等且启用的模板优先；没有则回退空 resourceKey 的通用模板；多匹配出模板切换器带实时预览；
- **空态**：无模板可打时引导去打印模板页，不静默失败。

接入成本被压到三行：一个 hook、一个 JSX 占位、一个动作调用。这就是「定式」的价值——把设计决策（匹配语义、数据契约、空态）做进组件，业务页不再有决策空间。

三端画布接入时还抓到一个内核接缝坑，值得所有「同一内核、多框架宿主」的项目引以为戒——**同一个 API，两个通道返回类型不一致**（crud-guide 的 Gotcha 原文）：

> the print kernel's canvas API differs by host — `getTemplateJson()` returns an **object** on the Vue canvas but a **string** on the react custom element. Normalize before putting it into the `payload` string column, or protojson rejects the create/update with `invalid value for string field payload`.

Vue 端的修复是入口处统一归一化：

```ts
// Vue 画布的 getTemplateJson() 返回对象（单页裸 TemplateData，多页 {version,pages}），
// 与 react CE（字符串）不同——统一归一化成字符串再进 payload
return typeof raw === "string" ? raw : JSON.stringify(raw);
```

react 端画布走 Custom Element（Shadow DOM）通道返回字符串，Vue 端走组件通道返回对象——**内核没有问题，问题是宿主各自假设对方的通道与自己一致**。归一化放在宿主侧统一入口，坑就封死在一处。

---

## 四、M3 输出链：前端管版式，后端只 PrintToPDF

服务端 PDF 是打印模块架构上最漂亮的一刀——**分工边界画在「成品 HTML」上**：

> 分页/毫米布局/字体全部由前端内核完成（两遍渲染：测量→分页→最终 HTML），后端只做 HTML → PDF（PrintToPDF）……保证「预览即所得」，后端不重排。

浏览器打印和服务端 PDF 用**同一份最终 HTML**——预览看到什么，PDF 就是什么。chromedp 的职责被压到最小：`PaperWidthMm/25.4` 换算英寸、margin 置 0（页边距已在前端毫米布局里）、HTML 经 JSON 转义后 `document.write` 进 about:blank。

这个分工的后端代价是**需要一个真浏览器**。Dockerfile 把它做成可选构建层：

```dockerfile
# 打印模块服务端 PDF（可选）：WITH_PRINT_BROWSER=1 时安装 Chromium 与 CJK 字体。
# 体积代价约 +400MB；不加时打印模块管理页可用，render-pdf 端点返回错误（日志提示装浏览器）。
ARG WITH_PRINT_BROWSER=0
RUN if [ "$WITH_PRINT_BROWSER" = "1" ]; then apk --no-cache add chromium font-noto-cjk; fi
```

不加浏览器层的部署里，打印管理页照常可用，render-pdf 端点返回错误并提示——**功能降级是显式的，不是隐形的**。

无头浏览器渲染是共享资源，两个护栏必须上：**并发信号量**（进程级 `make(chan struct{}, 2)`，同时最多两个 Chromium 实例）+ **8 MiB HTML 上限**。还有一个安全修复值得单独记：P1-11——`<iframe src=http://169.254.169.254/>` 这类内容会被 Chromium 渲染进 PDF，构成 **SSRF 原语**（云元数据端点可读）。修复是渲染前 `sanitizePrintHTML` 清洗，发现被禁内容直接 400。

批量打印也顺着这个分工走：**没有服务端合并**——勾选行数组直接喂内核 `renderHtmlPages`，份数分页（copy-per-page）在内核完成，多份数据合并为单文档，服务端只收最终 HTML 一次 POST。单行与批量走同一个入口（参数是对象还是数组），调用方无感。

---

## 五、下沉与开放：通用库的资格与租户的三件套

**printrender 下沉**（11-08）给出了「什么代码配升格为通用库」的判断标准：

> pkg/printrender 整包删除，调用方切换 go-utils/printrender v0.1.1：本包本就零业务耦合（chromedp HTML→PDF + 浏览器探测 + Renderer 接口），原样下沉。

判断标准就是**零业务耦合**：渲染器不认识「模板」「租户」「配额」，只认识「HTML 进、PDF 出」。下沉之后，仓里留下的是业务壳——RenderPdf 端点、HTML 清洗、并发信号量、种子与配额。**库收下通用部分，宿主留下业务部分，边界即接口（Renderer）**。下游仓（其他打印宿主）可直接复用同一接口，将来换容器化渲染微服务也只是换实现。

**租户开放**（11-09）则演示了把一个平台专属能力开放给租户的完整三件套：

1. **模块枚举**：`Module_PRINT = 12` 登记 + ServiceTag→模块映射补齐（顺带消除既有租户的 403 缺口）；
2. **权限面**：租户管理 API 黑名单删掉 print-templates 行、菜单 Authority 改双码（平台管理员/租户管理员）；
3. **配额**：`QuotaType` 新增 `TEMPLATE_COUNT`，Create 入口查用量比对，超限 403。

配额的失败语义做了**分层**，这个细节见功夫：`GetUsage` 失败（配额服务不可用）→ **fail-open 放行**——配额是运营约束，不该因它的故障挡住核心业务写入；但**计数失败**（查不出租户现有模板数）→ 返回 `MaxInt64` 触发拒绝——**fail-closed**——因为「不知道用了多少」时放行可能击穿配额。同样是「依赖挂了」，两种失败方向相反：数据来源挂了宁可放行，计数器挂了宁可拒绝。**fail-open 与 fail-closed 不是二选一的教条，是按「这个失败会造成什么后果」逐点决策的**。另有 `builtin` 行 tenant_id=0 不计入租户用量——种子不该吃租户的配额。

---

## 六、安全：全站唯一不转义通道的消毒

打印模块带进来一个独特的攻击面，审计时被点名为全站**唯一不转义的渲染通道**：模板 payload 里的 html 类型元素此前不转义直写同源 iframe 预览——而打印模板的编辑者是低权租户用户，预览 iframe 打开在管理员浏览器里，同源。这条链就是**存储型 XSS**：模板编辑者注入脚本，接管管理员会话。

修复放在三端统一的出口处（`131f55db`）：

```ts
doc.open();
doc.write(DOMPurify.sanitize(result.html));
doc.close();
```

消毒配置的选择也有取舍：DOMPurify 默认配置剥 script 与事件处理器、**保留 style/img 布局面**——打印模板的版式全靠内联样式与图片，不能伤；没用 iframe sandbox 兜底，因为 sandbox 会破坏相对路径图片加载。**消毒策略跟着业务保留清单走，不是抄默认**。

---

## 七、M4 裁决：能力清单的「闭环/暂缓 + 成立条件」

M4 不再是分期，是一次评估裁决——文档 §7 把四个候选需求逐项过堂（11-09 回写）：

| 候选 | 裁决 | 理由/条件 |
|------|------|----------|
| AI 一句话生成模板 | ✅ **已闭环**（11-07） | `POST /admin/v1/print-templates:generate`，护栏校验（payload 512KB/元素白名单/深度 8）后返回未入库 |
| 脚本渲染前钩子 | **暂缓** | 「printData（行数据）完全在前端……服务端 RenderPdf 只收成品 HTML——后端脚本钩子够不着数据」；成立条件 = 输出链 v2（行数据上送 + 服务端 bindData） |
| 套餐配额 | 当日兑现 | 记录暂缓并写明前置（PRINT 枚举 + 租户菜单），**同日稍晚即落地** |
| 云打印队列/多门店远程打印 | **暂缓** | 静默打印自研客户端是独立大工程，不启动 |

这份裁决表的范式值得抄：每个暂缓项都写明**成立条件**（脚本钩子的成立条件是输出链 v2 重构），配额项从「暂缓+前置」到「当日兑现」正好演示了裁决→立项→落地的完整闭环。**暂缓不是拒绝，是把「什么时候做」的条件写清楚**——技术的取舍记录到这个粒度，半年后回看才不会变成玄学。

---

## 八、收尾

打印模块两周的落地，五个决策点串成一条线：

- **选型**：许可证一票否决 → fork 接管 MIT 内核 → bus factor 风险清零；
- **接缝**：payload 黑盒透传 + 宿主侧归一化 `getTemplateJson` 的通道差异；
- **分工**：前端内核管版式分页（两遍渲染），后端只 PrintToPDF——预览即所得；
- **开放**：模块枚举 + 权限 + 配额三件套，fail-open/fail-closed 逐点分层；
- **安全**：唯一不转义通道 DOMPurify 消毒，SSRF 原语渲染前清洗。

如果只带走一句话：**能力集成项目的第一决策不是「用什么技术」，而是「许可证与维护者风险能不能接受」**——前者决定了以后改代码，后者决定了以后改不改得动代码。M0-M4 的分期只是把这两个答案展开成两周的施工图。

仓库（宿主与文档均可逐行核对，内核为 npm 包 `@go-wind/print-*`）：

- GitHub：[github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- Gitee：[gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)
