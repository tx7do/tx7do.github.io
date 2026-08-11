---
date: 2026-08-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - Vue
  - Shop
sticky: 10
---

# GoWind Shop 出海实战:多语言商品内容怎么存、怎么录、怎么按 locale 取

## 一个常见误解

很多团队对"国际化"的理解停留在前端字符串翻译——`zh.json`/`en.json` 切换一下 `t('hello')` 就完事。但对电商而言,真正的难点不在 UI 文案,而在**商品内容的多语言化**。

一件商品的中文名、英文名、商品描述、类目路径——这些是入库的业务数据,不是 UI 文案。你不能把它们塞进 `zh.json`,因为:

- 不同语言的商品描述要分别审核、分别上下架。
- 同一件商品的"主数据"(SKU、价格、库存、类目归属)是语言无关的,只有"展示文案"按语言分叉。
- 后台编辑时,运营要在同一界面同时维护所有语言版本,而不是切来切去。
- 店铺前台要能按 URL 里的 locale 一次性取到对应语言版本,而不是取全量再前端过滤。

这篇文章讲一个真实仓库 go-wind-shop(GitHub: <https://github.com/tx7do/go-wind-shop>, Gitee: <https://gitee.com/tx7do/go-wind-shop>)怎么从数据层、proto 契约层、后台录入层、前台路由层四个层面,把"多语言商品内容"做成一等公民。最后讲多币种的诚实边界——为什么这套架构的 schema 支持多币种展示,但运行时却收敛到单一结算币种。

所有代码和配置均可逐行核对。

---

## 一、数据层:base 表 + translation 表的分裂模式

国际化商品内容的核心数据模式是**把语言无关字段和语言相关字段拆成两张表**。这个模式在这个仓库的 5 个目录实体上重复出现:

| 实体 | 语言无关表(主数据) | 语言相关表(翻译) |
|------|------|------|
| Product | `mall_products` | `mall_product_translations` |
| Category | `mall_categories` | `mall_category_translations` |
| Brand | `mall_brands` | `mall_brand_translations` |
| ProductAttribute | `mall_product_attributes` | `mall_product_attribute_translations` |
| ProductAttributeValue | `mall_product_attribute_values` | `..._translations` |

以 Brand 为例。主表 `backend/app/core/service/internal/data/ent/schema/brand.go` 只有 `logo_url` 这一个业务字段——它和语言无关:

```go
func (Brand) Fields() []ent.Field {
    return []ent.Field{
        field.String("logo_url").Optional().Nillable(),
    }
}
```

翻译表 `brand_translation.go` 承载所有语言相关的文案字段:

```go
func (BrandTranslation) Fields() []ent.Field {
    return []ent.Field{
        field.Uint32("brand_id"),      // 外键 → 主表
        field.String("language_code"), // 语言代码(zh-CN / en-US / ...)
        field.String("name").Optional(),
        field.String("slug").Optional(),
        field.String("description").Optional(),
    }
}

func (BrandTranslation) Indexes() []ent.Index {
    return []ent.Index{
        index.Fields("brand_id", "language_code").Unique(),  // 复合唯一索引
    }
}
```

两个设计点:

**1. `(brand_id, language_code)` 复合唯一索引。** 从数据库层面保证了一件品牌在一门语言下至多一条翻译。既防脏数据,也让"按 locale 取"的查询走索引,而不是全表扫描后过滤。

**2. 主表/翻译表彻底分权。** `mall_products` 的 Schema 注释里写明"locale 无关",只存 `status`、`category_id`、`brand_id`、`image_url` 这种与语言无关的运营字段;所有文案在 `mall_product_translations`。Product 的翻译表字段更完整:`name`/`slug`/`short_description`/`long_description`,覆盖商品详情页需要的全部文案。

这个分权不是洁癖,是工程必需。后面会讲为什么不能用 JSONB 列存多语言——那个方案在这些字段上建不了合适的索引。

### 1.1 ProductTranslation 的字段结构

`backend/api/protos/catalog/service/v1/product.proto` 里 `ProductTranslation` 消息:

```proto
message ProductTranslation {
  optional uint32 id = 1;
  optional uint32 product_id = 2;       // 外键
  optional string language_code = 3;    // 语言代码
  optional string name = 4;
  optional string slug = 5;
  optional string short_description = 6;
  optional string long_description = 7;
  // ... 审计字段
}
```

这个消息对应 `mall_product_translations` 表的一行。注意它和主表 `Product` 是分离的消息——proto 层面就分开了,不是同一个 message 里的可选字段。

---

## 二、proto 层:把"多语言"写进契约

数据层的分裂模式在 proto 里有对称表达。每个 base 消息内嵌两个相关字段(`backend/api/protos/catalog/service/v1/product.proto`):

```proto
message Product {
  optional uint32 id = 1;
  // ... 语言无关字段(status, category_id, brand_id, image_url, ...)
  repeated ProductTranslation translations = 20 [...];   // 多语言翻译列表
  repeated string available_languages = 21 [...];        // 该实体已有翻译的语言码集合
}
```

`translations` 是 `repeated ProductTranslation`,即一个商品的所有语言版本打包在一条消息里。`available_languages` 是个便利字段,列出该实体当前实际有哪些语言的翻译——后台列表页用它判断"这个商品还缺哪些语言"。

读取侧,`GetProductRequest` 暴露 `locale` 选择器:

```proto
message GetProductRequest {
  optional uint32 id = 1;
  optional string locale = 10 [json_name = "locale", ...];
  // 注释:语言代码，用于指定返回哪个语言版本的数据
}
```

这个 `locale` 字段决定了两种读取模式:

- **带 locale 的 Get**:只返回该语言的那一条翻译。店铺前台用这个——它只需要当前 locale 的文案。
- **不带 locale 的 List/Get**:返回 `translations` 全量(所有语言)。后台编辑用这个——运营要同时看到所有语言版本。

同一个 proto 服务,用 `locale` 参数区分了两个场景。这比"前台一个接口、后台一个接口"更收敛——数据模型只有一份,接口只有一套,差异只在读取参数。

每个实体还配了一套**翻译 CRUD RPC**:`TranslationExists`/`GetTranslation`/`CreateTranslation`/`UpdateTranslation`/`DeleteTranslation`。这些允许对单条翻译独立操作——比如运营只改了英文版本,可以只 Update 那一条,不用重传整个 `translations` 数组。

### 2.1 店铺前台 proto 的复用

店铺前台的 proto(`backend/api/protos/app/service/v1/i_product.proto`)直接复用 core 的 `ProductService`:

```proto
rpc Get (catalog.service.v1.GetProductRequest) returns (catalog.service.v1.Product) {
  option (google.api.http) = { get: "/app/v1/mall/products/{id}" };
}
```

注意 `GetProductRequest` 是 `catalog.service.v1` 的——app BFF proto 只是给 `/app/v1/mall/products/{id}` 这条路由做了 HTTP 绑定,请求/响应类型完全复用 core 的。所以 `locale` 选择器对前台同样可用:前台取商品时带上 URL 里的 locale,后端就只返回那一种语言的文案。

这是契约驱动的收益之一:**前台/后台共享同一套数据契约,差异只在传输绑定和 locale 参数,不需要为前台单独定义一套"精简版"消息。**

---

## 三、语言字典:哪些语言"存在",是受控的

"支持哪些语言"不是写死在代码里,而是受一张字典表控制。`backend/api/protos/dict/service/v1/language.proto` 定义了 `LanguageService` 与 `Language` 消息:

```proto
message Language {
  optional uint32 id = 1;
  optional string language_code = 2;    // e.g. zh-CN
  optional string language_name = 3;    // 系统名(英文显示名)
  optional string native_name = 4;      // 母语名("中文"/"English")
  optional bool is_default = 5;         // 是否默认语言
  optional bool is_enabled = 6;         // 是否启用
  optional int32 sort_order = 7;        // 掁序
}
```

后台有配套的 CRUD 页面 `frontend/admin/src/pages/app/system/language/index.vue`,运营可以在这里增删语言、开关 `is_enabled`、设置默认语言。这个开关**直接决定后台编辑界面会渲染几个语言 tab**——禁用的语言不会出现在录入界面里。

这个设计的关键价值在第三节讲——把"语言清单"做成受控字典,而不是前端硬编码。

---

## 四、后台录入:TranslationTabs 组件,一处编辑所有语言

这是整个国际化方案里工程量最大、也最值得讲的一块。

一个朴素的实现是:为每个实体、每种语言分别做一个编辑页。这会导致页面爆炸——5 个实体 × 2 种语言 = 10 个页面,而且新增一个语种要再翻一倍。这个仓库没这么做,而是抽象出了一个**可复用的 `TranslationTabs` 组件**。

### 4.1 组件契约:声明式字段配置

`frontend/admin/src/components/Pro/TranslationTabs/types.ts`:

```ts
export interface TranslationFieldConfig {
  prop: string;        // 绑定到 translations[i] 的哪个字段
  label: string;       // 字段标题
  type: "input" | "textarea" | "input-number";  // 渲染哪种表单控件
}
```

父组件(各实体的 drawer)只需声明"我要编辑哪几个翻译字段",其余渲染逻辑交给 `TranslationTabs`。

### 4.2 组件行为:字典驱动 + 每语言一条保证

`frontend/admin/src/components/Pro/TranslationTabs/index.vue` 的核心逻辑:

```ts
onMounted(async () => {
  // 拉取语言字典,只保留 is_enabled 的语种
  const { data } = await fetchListLanguages({ /* paging */ })
  const enabled = (data?.list ?? []).filter(l => l.isEnabled === true)
  // 为每个启用语言确保 translations 数组里有一条记录
  enabled.forEach(lang => getOrCreateEntry(lang.languageCode))
})

function getOrCreateEntry(languageCode: string) {
  // 如果 formData.translations 里没有该 languageCode 的条目,创建一个空条目
  const existing = formData.translations.find(t => t.languageCode === languageCode)
  if (!existing) {
    formData.translations.push({ languageCode, /* 空字段 */ })
  }
}
```

然后模板渲染:

```vue
<el-tabs>
  <el-tab-pane
    v-for="lang in enabledLanguages"
    :key="lang.languageCode"
    :label="lang.nativeName || lang.languageName || lang.languageCode"
  >
    <el-form>
      <el-form-item
        v-for="field in translationFields"
        :label="field.label"
      >
        <component
          :is="resolveComponent(field.type)"
          v-model="getEntry(lang.languageCode)[field.prop]"
        />
      </el-form-item>
    </el-form>
  </el-tab-pane>
</el-tabs>
```

几个关键点逐条说明:

**字典驱动。** 组件挂载时调 `fetchListLanguages`(对应 `dict.LanguageService.List`),拉取语言字典,`filter(l => l.isEnabled === true)` 只保留启用的语种。Tab 的数量和顺序完全由字典决定,组件本身不硬编码任何语言。运营在"语言管理"页面新增一个语种并启用,所有用了 `TranslationTabs` 的实体编辑页**无需重新部署**就会出现新 tab。

**每语言一条保证。** `getOrCreateEntry` + `watchEffect` 确保 `formData.translations` 数组里**永远为每个启用语言保留一条记录**——哪怕运营不填某语言,那条空记录也在。提交时不会丢语言槽位,后端也不会因为缺某语言而把已有翻译覆盖成空。

**v-model 直绑后端载荷。** `formData.translations` 直接绑定到后端 `XxxTranslation[]` 载荷——没有中间映射层,组件渲染的就是后端要存的数据结构。这避免了"前端表单字段和后端 DTO 字段名不一致"的经典 bug。

**字段声明式。** `translationFields` 决定每个 tab 里渲染几个输入框、什么类型。新增一个可翻译字段,只需要在 Schema/proto 加字段、在 drawer 的 `translationFields` 加一行——UI 自动就位,无需写新组件。

### 4.3 各实体怎么用

实体 drawer 声明字段并嵌入组件。`frontend/admin/src/pages/app/mall/product/product-drawer.vue`:

```vue
<TranslationTabs
  v-model="formData.translations"
  :translation-fields="[
    { prop: 'name',             label: t('mall.product.name'),             type: 'input' },
    { prop: 'slug',             label: t('mall.product.slug'),             type: 'input' },
    { prop: 'shortDescription', label: t('mall.product.shortDescription'), type: 'textarea' },
    { prop: 'longDescription',  label: t('mall.product.longDescription'),  type: 'textarea' },
  ]"
/>
```

Brand、Category、ProductAttribute、ProductAttributeValue 的 drawer 同理,各自声明自己的字段集合:

| Drawer | 翻译字段 |
|---|---|
| `product-drawer.vue` | name, slug, shortDescription, longDescription |
| `category-drawer.vue` | name, slug, description, fullPath |
| `brand-drawer.vue` | name, slug, description |
| `product-attribute-drawer.vue` | name |
| `product-attribute-value-drawer.vue` | displayName |

注意 `category-drawer.vue` 里有 `fullPath`——这个字段存的是带 locale 前缀的类目路径,下一节解释为什么。

### 4.4 列表页怎么展示

列表页(`brand/index.vue` 等)展示的是"当前后台 UI 语言"那一条翻译:

```ts
const cellText = (row) => {
  const t = row.translations.find(t => t.languageCode === locale.value)
  return t?.name ?? '-'
}
```

即:表格里看到的是中文(因为运营切到了中文 UI),但点开 drawer 看到的是所有语言 tab。运营切 UI 语言,列表的展示语言也跟着切——因为展示的数据本来就是按语言分库的,切换 locale 只是查不同语言的那一行。

这个设计的巧妙之处:**列表和编辑用同一套 translations 数据,差异只在 locale 参数。列表是"单语言视图"(当前 UI 语言),drawer 是"全语言视图"(所有 tab)。无需为"多语言列表"单独设计数据结构。**

---

## 五、店铺前台:URL locale 作为路由一等公民

前台(Nuxt)用 [`@nuxtjs/i18n`](https://i18n.nuxtjs.org/)。配置在 `frontend/app/nuxt.config.ts`:

```ts
i18n: {
  langDir: '../locales',
  locales: [
    { code: 'zh-CN', iso: 'zh-CN', name: '中文',    file: 'zh-CN/index.ts' },
    { code: 'en-US', iso: 'en-US', name: 'English', file: 'en-US/index.ts' },
  ],
  defaultLocale: 'zh-CN',
  strategy: 'prefix',                  // locale 编码进 URL 路径前缀
  detectBrowserLanguage: false,
}
```

几个关键决策:

**`strategy: 'prefix'`。** locale 编码进 URL 路径,即 `/zh-CN/category/tech`、`/en-US/category/tech`。同一个类目在两种语言下有两个独立 URL。这契合了 `CategoryTranslation.full_path` 字段——它存的就是带 locale 前缀的路径,proto 注释里的示例正是 `/zh-CN/category/tech`。

**`detectBrowserLanguage: false`。** 不根据浏览器 `Accept-Language` 自动重定向。出海场景下,自动跳转常被搜索爬虫和地区合规要求打乱——比如某地区要求默认展示某语言,但浏览器设了另一种,自动跳转会违背合规要求。显式 URL 更可控。

**静态根跳转。** nuxt.config 里有一段 SSG 逻辑把 `/` 重定向到 `/zh-CN/`,保证默认语言也有稳定入口,避免访问根路径时 404。

### 5.1 翻译文案文件结构

`frontend/app/locales/{zh-CN,en-US}/` 下按业务域分文件:

```
frontend/app/locales/
├── zh-CN/
│   ├── addresses.json
│   ├── cart.json
│   ├── checkout.json
│   ├── mall.json          ← 含 currencyCny 等
│   ├── navbar.json
│   ├── orders.json
│   ├── shipment.json
│   ├── ui.json
│   └── ... (20+ 命名空间)
└── en-US/
    └── ... (对称结构)
```

每个文件是一个命名空间,代码里 `t('mall.product.price')` 这种点路径定位到 `mall.json` 里的 `product.price`。命名空间按业务域分,而不是按页面分——这样新增页面时复用已有命名空间,不会产生"每个页面一个翻译文件"的爆炸。

布局组件(`layouts/default.vue`)在 `$i18n.locale` 变化时给整棵组件树 re-key,触发完全重渲染——语言切换是即时的,不需要刷新页面。

### 5.2 前台取商品时的 locale 传递

前台调用商品接口时,`locale` 参数从 URL 路径取。`frontend/app/app/utils/locale.ts`:

```ts
export function getCurrentLocale(): string {
  // 从 nuxt i18n 运行时取当前 locale
  // 默认 zh-CN
}
```

这个值在 API composable 里被塞进请求的 `locale` 字段,后端据此只返回该语言的翻译。整条链路:URL 路径 `/zh-CN/...` → nuxt i18n 解析出 locale → API 请求带 locale → core 只返回该语言翻译 → 前端渲染。locale 从 URL 到 DB 查询,全程显式传递,不靠隐式状态。

### 5.3 一个已知边界

`frontend/app/app/core/preferences/types/layout.ts` 里:

```ts
export type SupportedLanguagesType = "zh-CN" | "en-US"
```

这个类型是硬编码的——即新增一个语种时,除了在语言字典里启用、补 `locales/` 文件,这里也要扩类型。这是个待优化点:理想情况下该类型应该由语言字典动态生成。当前硬编码是工程权衡(类型系统无法直接吃运行时字典),新增语种需要改三处(字典、locale 文件、类型),不算理想但可控。

---

## 六、横向对比:四种多语言内容存储方案

把这套 base/translation 分裂模式和另外三种方案对比。

### 方案 A:JSONB 列存多语言(主流方案之一)

主表加一个 `translations JSONB` 列,存 `{"zh-CN": {"name": "..."}, "en-US": {"name": "..."}}`。

- **优点**:一张表,结构简单,新增语言不动 schema。
- **缺点**:
  - **索引建不起来**:按 locale 取某语言,是 `translations->>'zh-CN'` 这种 JSON 路径访问,PostgreSQL 的表达式索引能建但维护成本高,且优化器常常不走。
  - **字段级约束缺失**:JSONB 内部的 `name` 字段长度、类型、可空性,数据库没法约束,全靠应用层。
  - **事务一致性复杂**:更新某语言的 name 要读出整个 JSON、改一处、写回,并发写冲突靠行锁,粒度粗。
  - **跨语言查询难**:统计"哪些商品缺英文翻译"要展开 JSON,效率差。

这个仓库没选它,核心原因就是索引和字段约束。商品详情页每次访问都要按 locale 取一条翻译,这是高频读,必须走索引。JSONB 的路径访问走不了合适的索引。

### 方案 B:每语言一张表

`brands_zh`、`brands_en` 各一张表,列相同。

- **优点**:每张表物理隔离,查询无 locale 过滤。
- **缺点**:语言数 N → 表数 N,运营新增语言要 DDL 建表;跨语言聚合(如"全量商品列表")要 UNION N 张表;ORM 映射爆炸。

这是最差的方案,几乎没有优点。适合语言数固定且极少(如 2)的小项目,不适合出海场景(语言数会增长)。

### 方案 C(本方案):base + translation 分裂 + 复合唯一索引

主表存语言无关字段,翻译表存 `(entity_id, language_code, 文案字段)`,复合唯一索引 `(entity_id, language_code)`。

- **优点**:
  - **索引可用**:按 locale 取翻译是 `WHERE entity_id = ? AND language_code = ?`,走复合唯一索引,O(log n)。
  - **字段级约束齐全**:每个文案字段都是正常的列,长度、类型、可空性数据库层约束。
  - **事务粒度细**:更新某语言只锁那一行,不影响其他语言。
  - **新增语言不动 schema**:加一种语言只是翻译表多几行,主表和翻译表结构都不变。
- **缺点**:
  - JOIN:取商品+翻译要 JOIN 两张表。但这是 ORM 该处理的,Ent 的关系映射自动 JOIN,业务代码无感。
  - 表数翻倍:每个实体 2 张表。但这是结构清晰的代价,可接受。

这个方案是主流电商(包括 Shopify、Amazon 的早期架构)用的模式。它在索引可用性、字段约束、事务粒度、可扩展性四个维度上都优于 JSONB 和"每语言一表"。

### 方案 D:URL locale 的三种策略对比

`@nuxtjs/i18n` 支持三种 locale 编码策略:`prefix`(`/zh-CN/...`)、`subdomain`(`zh.example.com/...`)、`cookie`(URL 不变,cookie 记 locale)。三者的取舍:

| 策略 | SEO | 缓存 | 合规 | 实现复杂度 |
|------|-----|------|------|-----------|
| prefix | ✅ 每语言独立 URL,可被爬虫索引 | ✅ CDN 可按 URL 缓存 | ✅ 显式,易审计 | 低 |
| subdomain | ✅ 独立域名 | ⚠️ 需泛域名证书 | ⚠️ 部分地区对子域名有特殊监管 | 中(需 DNS/证书) |
| cookie | ❌ 同 URL 不同内容,爬虫困惑 | ❌ CDN 缓存失效 | ❌ 隐式,难审计 | 低 |

这个仓库选 `prefix`,理由是 SEO 和缓存。电商前台的流量很大比例来自搜索引擎,每语言独立 URL 是被索引的前提;CDN 按 URL 缓存也是按 URL 命中,cookie 策略会让 CDN 缓存错乱。subdomain 在 SEO 上也 OK,但需要泛域名证书和 DNS 配置,工程复杂度高。prefix 是 SEO/缓存/复杂度三者最优的折中。

---

## 七、多币种:展示层支持多币种,结算层收敛单一币种

出海电商的币种设计有个矛盾:展示侧希望按用户地区显示当地币种价格(便于心智),但结算侧必须收敛到单一币种(否则对账和财务不可控)。这套架构的设计叫"**多币种展示 + 单一结算币种**"——但实际运行时,展示层也只跑了单一币种。这节讲清楚为什么。

### 7.1 展示层:SKU 多币种价格表的 schema

`backend/api/protos/catalog/service/v1/sku.proto` 定义了 `SkuPrice`:

```proto
message SkuPrice {
  optional uint32 id = 1;
  optional uint32 sku_id = 2 [...];          // 外键 → SKU
  optional string currency = 3 [...];        // 币种(ISO 4217，如 CNY/USD/EUR)
  optional string amount  = 4 [...];         // 该币种下的价格金额
}
```

`amount` 用字符串而非浮点——这是金融场景的基本常识,避免二进制浮点精度丢失(0.1 + 0.2 ≠ 0.3)。Ent 对应表 `mall_sku_prices`,带复合唯一索引:

```go
// backend/app/core/service/internal/data/ent/schema/sku_price.go
func (SkuPrice) Indexes() []ent.Index {
    return []ent.Index{
        index.Fields("sku_id", "currency").Unique(),  // 一个 SKU 在一种币种下只有一条价格
    }
}
```

**Schema 层是支持多币种的**:一个 SKU 可以有多条价格,每条对应一种 currency。

### 7.2 结算层:Currency mixin 默认且当前仅 CNY

但实际能写入的币种受 `backend/pkg/entgo/mixin/currency.go` 约束:

```go
field.String("currency").
    Optional().Nillable().
    Default("CNY").
    Comment("币种（ISO 4217，当前仅支持CNY）"),
```

`Default("CNY")` + 注释"当前仅支持CNY"——schema 预留了多币种字段,但运行时收敛到 CNY。

订单侧的结算币种也是收敛的。`backend/api/protos/order/service/v1/order.proto` 的 `Order`:

```proto
message Order {
  optional string currency = 8 [...];      // 结算币种(ISO 4217)
  optional int64 total_amount = 9 [...];   // 订单总金额(最小货币单位，分)
  // ...
}
message OrderItem {
  optional int64 unit_price = 7 [...];     // 单价(最小货币单位，分)
  optional int64 subtotal = 8 [...];       // 小计(最小货币单位，分)
  optional string sku_snapshot = 9 [...];  // 下单时 SKU 快照(JSON)
}
```

几个关键设计:

- **金额用 int64 存最小货币单位(分)**,不是浮点。这与 `SkuPrice.amount` 的字符串设计目的一致——避免浮点精度问题。
- **`sku_snapshot` 冻结下单时的 SKU 信息**。后续 SKU 改价、改名、改属性,不影响历史订单。这是电商订单系统的标准设计——订单是"那一刻交易的快照",不是"当前商品的引用"。
- **结算币种字段存在,但运行时只填 CNY**。

### 7.3 前台消费:目前实际只取 CNY 那一行

店铺前台读取 `prices[]` 数组时的逻辑(`frontend/app/app/pages/cart.vue`):

```ts
const cny = prices.find(p => p.currency === 'CNY') ?? prices[0]
if (cny?.amount) { skuPricesMap[skuId] = cny.amount }
```

币种符号来自 i18n 文案(`frontend/app/locales/zh-CN/mall.json` 和 `en-US/mall.json` 都定义了):

```json
{ "currencyCny": "￥" }
```

UI 拼接(`cart.vue`):

```ts
`${t('mall.product.currencyCny')}${selectedAmount.value}`
```

下单时,`checkout.vue` 硬编码结算币种:

```ts
// checkout.vue 创建订单
const order = {
  // ...
  currency: 'CNY',
  // ...
}
```

### 7.4 诚实交代当前边界

所以"多币种展示 + 单一结算币种"在这套架构里的实际状态:

- **Schema/契约层**:已为多币种铺好。`SkuPrice` 表支持多币种行,复合唯一索引 `(sku_id, currency)`,字符串金额。
- **结算层**:已收敛到单一币种(CNY)。订单/支付都以 CNY 结算,并冻结 `sku_snapshot`。
- **展示层**:目前前台只取 CNY 行。也就是说,**展示层当前是单币种运行**,尽管 schema 允许多币种。

这不是"没做完",而是有意的安全保守。原因:

**贸然让前台展示非结算币种的价格,会出现"看到的价和实际扣的不一致"。** 比如 SKU 标价 100 USD,但结算用 CNY,实际扣款是按某汇率折算的 CNY 金额。如果展示的 USD 价格和折算后的 CNY 金额不一致(汇率波动、折算规则差异),用户会投诉,财务对账会乱。

要真正启用多币种展示,需要三个前置条件:

1. **接入受控汇率源**:一个可信的、带时间戳的汇率 API,所有展示币种→结算币种的换算都用它。
2. **明确的展示/结算分离提示**:UI 要明确告诉用户"展示价格仅供参考,结算以 CNY 为准"。
3. **扩 Currency mixin 的币种白名单**:当前 `Default("CNY")` + "仅支持CNY"的注释要改成支持多币种,且要明确哪些币种允许展示。

这套架构已经为这条路预留了空间(schema 和 proto 都支持),但运行时守了底线——在没有受控汇率源和合规提示前,不展示非结算币种。这是"宁可功能少,不可数据错"的工程保守。

### 7.5 对比:三种币种策略

| 策略 | 展示 | 结算 | 风险 |
|------|------|------|------|
| 全币种结算 | 多币种 | 多币种 | 对账复杂,汇率风险,合规难 |
| 单币种(无多币种能力) | 单币种 | 单币种 | 无扩展空间,新增币种要改 schema |
| 本方案:多币种展示+单一结算 | schema 支持多币种,运行时单币种 | 单一币种 | 展示/结算一致,有扩展空间 |

本方案的取舍:**schema 留口子,运行守底线**。在没准备好全链路多币种前,不贸然展示。这是金融场景该有的保守——"看到的价必须等于扣的价"是底线,任何展示层多币种都要在保证这条底线的前提下推进。

---

## 结语

多语言商品内容不是 UI 翻译,是数据建模问题。这套架构的核心是三件事:

1. **base/translation 分裂 + 复合唯一索引**,让多语言内容成为一等数据公民。对比 JSONB,它在索引可用性、字段约束、事务粒度上都更优。
2. **可复用的 TranslationTabs 组件 + 语言字典驱动**,让"新增语种/新增可翻译字段"的成本接近配置变更。字典驱动让语言清单受控,声明式字段配置让 UI 随 schema 演进。
3. **URL locale 作为路由一等公民**,前台展示与 SEO 都建立在显式 locale 上。prefix 策略在 SEO、缓存、合规三者间最优。

币种侧,它选择了"展示层为多币种预留、结算层收敛单一币种"的保守路线——schema 留了口子,运行守了底线。这是金融场景该有的工程保守:"看到的价必须等于扣的价"是底线,任何展示层多币种都要在保证这条底线的前提下推进。

这套方案不是万能的——JSONB 在"语言数极少且查询模式简单"时也够用,全币种结算在"有完善汇率对冲和合规团队"时也可行。但对一个面向出海、语言数会增长、需要受控币种的电商脚手架,这套取舍是结构上合理的。

仓库地址: GitHub <https://github.com/tx7do/go-wind-shop>, Gitee <https://gitee.com/tx7do/go-wind-shop>。 所有文中配置和代码均可逐行核对。
