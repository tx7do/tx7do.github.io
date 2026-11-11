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

# GoWind Admin 拆解：打印模板设计器——从画布到服务端 PDF 的完整打印链路

> 本文回答一个问题：**运营在画布上拖出一个用户工牌模板，到业务列表页勾选 50 行一键出 PDF——中间的模板怎么存、字段怎么绑、预览怎么保真、批量怎么合并、服务端怎么出 PDF？把这套打印功能的每个环节拆开看。**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 的打印模板模块是一条完整的链路：**画布设计模板 → 模板入库 → 列表页按资源匹配 → 内核渲染 HTML → 浏览器打印或服务端 PDF**。三端（react / vue-element / vue-vben）共用同一套设计器内核与同一个行打印定式，后端只存模板、只出一件事（PrintToPDF）。这篇按链路顺序拆，每一段都给真实的数据结构与代码。

---

## 一、链路总览：五个环节，一条数据流

先看整条链路上数据长什么样：

```
画布设计（拖拽元素 + 绑定字段）
    │ getTemplateJson() → 模板 JSON（毫米布局 + 元素清单 + 字段绑定）
    ▼
模板入库（print_templates 表，payload 黑盒透传）
    │ code + resource_key + 纸张冗余列
    ▼
行打印匹配（业务页传 resourceKey + 行数据）
    │ resourceKey 精确相等优先 → 通用模板兜底 → 空态引导
    ▼
内核渲染（数据填入模板 → 两遍渲染：测量→分页→最终 HTML）
    │ 单行 = 单文档；批量 = 份数分页合并单文档
    ▼
输出（同源 iframe 预览/打印  或  POST /admin/v1/print-templates:render-pdf）
```

关键分工只有一条：**版式语义全部在前端内核（分页、毫米布局、字体），后端不解析模板、不重排版式**——后端收到模板 JSON 只透传，收到渲染产物只 PrintToPDF。这条边界决定了后面每一个环节的形态。

---

## 二、模板数据模型：payload 黑盒 + 冗余列

模板表（`print_template.go` ent schema）刻意做薄：

```go
field.String("code").Comment("模板编码，租户内唯一，业务侧按编码取模板"),
field.String("resource_key").Comment("绑定资源标识（对应菜单/资源的 generated service 键…）"),
field.Text("payload").Comment("模板 JSON（…毫米布局 + schemaVersion，服务端不解析只透传）"),
field.Bool("is_built_in").Comment("是否系统内置模板（内置禁删，可复制派生）").Default(false),
field.String("paper_size").Comment("纸张尺寸冗余列（…来自 payload.paperSize，列表页直显免解析 JSON）"),
field.String("orientation").Comment("纸张方向冗余列（portrait/landscape…）"),
// Mixin: AutoIncrementId64 / TimeAt / OperatorID64 / TenantID[int64]{}
// Index: (code, tenant_id) 唯一；resource_key 普通索引（行打印按资源取模板）
```

三个设计决定：

1. **payload 是 TEXT 黑盒**——服务端不解析、不校验内部结构，只透传。版式语义全部属于前端内核，后端版本升级永不牵动存量模板；
2. **但纸张信息冗余成列**——列表页要显示 A4/横向，为此解析每行的 JSON 不值得，写入时顺手抽 `paper_size`/`orientation` 两列，查询路径零 JSON 解析；
3. **两个索引对应两条取模板路径**——`(code, tenant_id)` 唯一支撑「业务按编码取模板」，`resource_key` 索引支撑行打印的按资源匹配（第五节）。

---

## 三、画布与字段绑定：示例数据派生字段面板

设计器画布的元素（文本/图片/表格/条码等）拖到毫米坐标上，元素属性里的字段绑定是整个功能最顺滑的一环——**字段面板不是手填的，是从示例数据派生的**（`fieldsFromSample`）：

```ts
// constants.ts —— 由示例数据对象派生设计器字段面板
// M2 接『列表行打印』时同一函数吃真实行数据，模板字段与数据天然对齐。
```

设计模板时喂一份示例行数据（比如一个用户对象），画布的字段面板自动列出 `username` / `realname` / `deptName` 可选；模板元素里写 `{username}` 这样的 `{field}` 占位，渲染时内核按点路径从行数据取值填充。**同一个派生函数在运行期吃真实行数据**——设计期看到的字段列表和运行期实际可绑定的字段永远一致，不会出现「模板绑了字段、数据里没有」的断档。数组也能绑，路径语法支持 `items[].sku` 这种循环展开（明细表格场景）。

画布产出的模板 JSON 经 `getTemplateJson()` 交给宿主落库。这里有一个内核接缝坑值得所有「同一内核、多框架宿主」的项目引以为戒——**同一个 API，两个通道返回类型不一致**（crud-guide 的 Gotcha 原文）：

> the print kernel's canvas API differs by host — `getTemplateJson()` returns an **object** on the Vue canvas but a **string** on the react custom element. Normalize before putting it into the `payload` string column, or protojson rejects the create/update with `invalid value for string field payload`.

Vue 端画布走组件通道返回对象（单页是裸 TemplateData，多页是 `{version,pages}`），react 端走 Custom Element（Shadow DOM）通道返回字符串。宿主侧的修法是在统一入口归一化（`designer-dialog.vue`）：

```ts
// Vue 画布的 getTemplateJson() 返回对象（单页裸 TemplateData，多页 {version,pages}），
// 与 react CE（字符串）不同——统一归一化成字符串再进 payload
return typeof raw === "string" ? raw : JSON.stringify(raw);
```

内核没有问题，问题是宿主各自假设对方的通道与自己一致——归一化放在宿主统一入口，坑封死在一处。

---

## 四、内置模板与复制派生

系统自带三个种子模板（`backend/pkg/constants/default_data.go`），启动期「缺一补一」播种（repo 注释原话「管理员自建行不应阻断内置模板补种」）：

```go
// DefaultPrintTemplates：
//   builtin.generic.a4 / builtin.generic.a5  —— elements:[] 空版式基线
//   demo.user.badge                          —— 用户工牌演示模板
//     ResourceKey: "system/user"
//     元素 options.formatter 内 {username}/{realname} 等 {field} 绑定行字段
```

内置模板的语义由 `is_built_in` 钉死：**禁删、可复制派生**。租户想要自己的工牌模板，走管理页的「复制内置派生」：copy 模式下 code 清空让租户自编、payload 注入被复制模板的完整版式，复制出来的行是普通模板，随便改。种子只负责「开箱即用 + 演示字段绑定怎么写」，个性化全走派生——内置行永远干净。

---

## 五、行打印定式：三行代码接入任意列表页

行打印解决的问题是：**任意列表页怎么用最低成本获得打印能力？**答案是三端同构的一个定式（react 版签名）：

```ts
/**
 * 行打印定式：任意列表行接入打印能力的统一入口。
 * 用法：页面里 `const { node, print } = usePrintTemplateDialog();`，
 * JSX 放 `{node}`，行动作里 `print('system/user', record)`。
 * 模板匹配：优先取 resourceKey 精确相等且启用的模板；没有则回退"通用模板"
 * （resourceKey 为空的行）；仍无则显示空态引导到打印模板页。
 */
export function usePrintTemplateDialog() { ... }
```

接入成本被压到三行：一个 hook、一个 JSX 占位、一个动作调用。设计决策全部做进了组件，业务页没有决策空间：

**数据契约：整个行对象即打印数据。**不设中间 DTO——模板字段用点路径直接绑行数据（`{customer.name}`、数组路径 `items[].sku`），第三节说的 `fieldsFromSample` 保证模板字段与行结构对齐。

**匹配语义三段式**（组件内实现）：

```ts
// loadTemplates: 精确匹配优先，通用模板兜底
const exact = enabled.filter(i => i.resourceKey === resourceKey);
const generic = enabled.filter(i => !i.resourceKey);
return [...exact, ...generic];
```

`resourceKey` 精确相等且启用的模板优先；没有则回退空 resourceKey 的通用模板；多匹配出模板切换器带实时预览；一个都没有时空态引导去打印模板页——**不静默失败**。

---

## 六、预览与安全：全站唯一不转义通道的消毒

渲染产物（最终 HTML）在浏览器侧进同源 iframe 预览/打印。这条通道带进来一个独特的攻击面，安全审计时被点名为全站**唯一不转义的渲染通道**：模板 payload 里的 html 类型元素此前不转义直写 iframe——而打印模板的编辑者是低权租户用户，预览 iframe 打开在管理员浏览器里，同源。这条链就是**存储型 XSS**：模板编辑者注入脚本，接管管理员会话。

修复放在三端统一的出口处：

```ts
doc.open();
doc.write(DOMPurify.sanitize(result.html));
doc.close();
```

消毒配置跟着业务保留清单走：DOMPurify 默认配置剥 script 与事件处理器、**保留 style/img**——打印模板的版式全靠内联样式与图片，不能伤；没用 iframe sandbox 兜底，因为 sandbox 会破坏相对路径图片加载。

---

## 七、批量打印：数组进，单文档出

批量打印与单行走**同一个入口**——`print` 的第二个参数传对象是单行、传数组是批量：

```ts
const print = async (resourceKey, rowsOrRow) => {
  // 单行与批量（数组）同入口：内核 renderHtmlPages 原生支持数据数组（份间分页合并单文档）
  const isArray = Array.isArray(rowsOrRow);
  printDataRef.current = isArray ? rowsOrRow : { ...(rowsOrRow) };
  batchCountRef.current = isArray ? rowsOrRow.length : 1;
```

列表页工具栏的「批量打印」按钮把勾选行数组直接传进来：内核 `renderHtmlPages` 对每份数据独立执行「测量→分页」，**份数分页（copy-per-page）在内核完成**，多份合并为一个文档。没有服务端合并这回事——服务端永远只收最终 HTML。调用方不感知单行/批量的差别，分页份数语义（第 N 页属于第几份数据）由内核保证。

---

## 八、服务端 PDF：后端只做一件事

浏览器打印之外，服务端 PDF 走 `POST /admin/v1/print-templates:render-pdf`。分工边界画在「成品 HTML」上：

> 分页/毫米布局/字体全部由前端内核完成（两遍渲染：测量→分页→最终 HTML），后端只做 HTML → PDF（PrintToPDF）……保证「预览即所得」，后端不重排。

浏览器打印和服务端 PDF 用**同一份最终 HTML**——预览看到什么，PDF 就是什么。chromedp 的职责被压到最小：纸张毫米换算英寸（`mm/25.4`）、margin 置 0（页边距已在前端毫米布局里）、HTML 经 JSON 转义后 `document.write` 进 about:blank。

无头浏览器是共享资源，RenderPdf 端点上两道硬护栏 + 一道安全闸（`print_template_service.go`）：

```go
const printRenderMaxHTML = 8 << 20 // 8 MiB
var printRenderSem = make(chan struct{}, 2) // 渲染并发信号量（进程级）

func (s *PrintTemplateService) RenderPdf(ctx, req) {
    // 校验 html 必填 / 纸张毫米必传 / 8MiB 上限
    // P1-11 修复：清洗后再送 Chromium——<iframe src=http://169.254.169.254/> 会渲染进 PDF（可读 SSRF 原语）
    cleanHTML, err := sanitizePrintHTML(req.GetHtml())   // 发现被禁内容直接 400
    select { case printRenderSem <- struct{}{}: defer ... case <-ctx.Done(): ... }
    pdf, err := printrender.RenderPDF(ctx, printrender.Options{ ... })
}
```

- **并发信号量 2**：进程级同时最多两个 Chromium 实例，多出来的请求排队或让路；
- **8 MiB HTML 上限**：渲染产物不是无限大的；
- **SSRF 清洗**：`<iframe src=http://169.254.169.254/>` 这类内容会被 Chromium 渲染进 PDF，构成云元数据端点可读的 SSRF 原语——渲染前 `sanitizePrintHTML` 清洗，发现被禁内容直接 400。

部署侧，浏览器是可选构建层（`backend/Dockerfile`）：

```dockerfile
# 打印模块服务端 PDF（可选）：WITH_PRINT_BROWSER=1 时安装 Chromium 与 CJK 字体。
# 体积代价约 +400MB；不加时打印模块管理页可用，render-pdf 端点返回错误（日志提示装浏览器）。
ARG WITH_PRINT_BROWSER=0
RUN if [ "$WITH_PRINT_BROWSER" = "1" ]; then apk --no-cache add chromium font-noto-cjk; fi
```

不加浏览器层的部署里，打印管理页照常可用（浏览器打印不受影响），render-pdf 端点返回错误并提示——**功能降级是显式的**。CJK 字体随浏览器层一起装，保证中文模板在容器里不缺字。

渲染器本体（chromedp HTML→PDF + 浏览器探测 + Renderer 接口）已升格为通用库 `go-utils/printrender`，仓里留下的是业务壳——端点、清洗、信号量、种子与配额。**库收通用部分，宿主留业务部分**，下游仓可直接复用同一 Renderer 接口。

---

## 九、多租户与配额：谁能用、能用多少

打印模板对租户开放由三件套支撑：`Module_PRINT` 模块枚举 + ServiceTag 映射（消除既有租户的 403 缺口）+ 租户菜单/黑名单放行。用量约束是配额维度 `TEMPLATE_COUNT`（打印模板数），检查挂在 Create 入口（`print_template_service.go`）：

```go
// GetUsage → quotaLimitFromUsages(usage.GetQuotas(), PlanQuota_TEMPLATE_COUNT)
//   → countTemplatesInTenant 比对 → 超限 403
// 「fail-open：仅租户上下文且配额已配置时生效」「GetUsage 失败 → fail-open 放行」
```

失败语义做了**分层**，这个细节见功夫：`GetUsage` 失败（配额服务不可用）→ **fail-open 放行**——配额是运营约束，不该因它的故障挡住核心业务写入；但**计数失败**（查不出租户现有模板数）→ 返回 `MaxInt64` 触发拒绝——**fail-closed**——「不知道用了多少」时放行可能击穿配额。同样是「依赖挂了」，两种失败方向相反：数据来源挂了宁可放行，计数器挂了宁可拒绝。另有内置模板（tenant_id=0）不计入租户用量——种子不吃租户的配额。

---

## 十、收尾

把整条链路的工程件收拢成一张表：

| 环节 | 关键机制 | 失败模式 |
|------|---------|---------|
| 画布设计 | fieldsFromSample 示例数据派生字段 | 设计期字段 = 运行期字段 |
| 模板入库 | payload 黑盒 + 纸张冗余列 | getTemplateJson 双通道归一化 |
| 行打印匹配 | resourceKey 精确 → 通用兜底 → 空态引导 | 不静默失败 |
| 预览 | 同源 iframe + DOMPurify 消毒 | 唯一不转义通道封死 |
| 批量 | 数组同入口，内核份数分页合并 | 无服务端合并 |
| 服务端 PDF | 信号量 2 / 8MiB / SSRF 清洗 | 降级显式提示装浏览器 |
| 配额 | fail-open / fail-closed 逐点分层 | 内置模板不计用量 |

这套功能的设计哲学一句话可以带走：**「预览即所得」是靠分工换来的**——版式的每一步（测量、分页、字体、页边距）都只发生一次、只在前端内核发生，浏览器打印和服务端 PDF 消费同一份产物，所以预览和输出永远不会不一致。

仓库（本文所有代码路径均可逐行核对，内核为 npm 包 `@go-wind/print-*`）：

- GitHub：[github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- Gitee：[gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)
