---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - OpenSearch
  - 搜索
  - CMS
sticky: 10
---

# GoWind CMS 拆解：搜索三板斧——高亮、联想、同义词

> 本文回答一个问题：**接了 OpenSearch 之后，「能搜到」与「搜得好」之间还差哪三步——以及为什么同义词偏偏放查询侧而不是索引侧？**

[GoWind CMS](https://github.com/tx7do/go-wind-cms) 的搜索底座早就有了：帖子标题/摘要/正文建 OpenSearch 索引，租户隔离过滤，smartcn 中文分词。但「有搜索引擎」和「搜索体验」之间隔着三件事——用户看不见命中原因（没有高亮）、输一半就要自己猜完整词（没有联想）、换个说法就搜不到（没有同义词）。10 月底的 `42a73c29` 一次把三件补齐，这篇逐件拆，重点讲第四节的选型：同义词为什么放查询侧。

---

## 一、底座回顾：一张为过滤而设计的索引

先看索引模板（`backend/app/core/service/internal/data/search_repo.go`），后面三件事都长在它上面：

```go
properties := map[string]any{
    "tenant_id": map[string]any{"type": "keyword"},
    "post_id":   map[string]any{"type": "keyword"},
    "language":  map[string]any{"type": "keyword"},
    "status":    map[string]any{"type": "keyword"},
    "title":     map[string]any{"type": "text", "analyzer": "smartcn"},
    "summary":   map[string]any{"type": "text", "analyzer": "smartcn"},
    "content":   map[string]any{"type": "text", "analyzer": "smartcn"},
}
```

字段只有七个，界限清晰：四个 keyword 做精确过滤（租户、语言、状态、主键），三个 text 做 smartcn 中文分词的全文检索。每一次查询的 DSL 都是同一个骨架——`bool.filter` 里三连 term 精确过滤钉死租户/语言/状态，检索条件进 `must` 或 `should`。**租户隔离靠 filter 不靠应用层**，这条纪律贯穿所有查询形态。

---

## 二、高亮：三段形态与受控渲染

高亮的 DSL 一步到位（`search_repo.go`）：

```go
"highlight": map[string]any{
    // 标记用 <mark>（前端受控渲染，不做富 HTML 注入）
    "pre_tags":  []string{"<mark>"},
    "post_tags": []string{"</mark>"},
    "fields": map[string]any{
        "title":   map[string]any{"number_of_fragments": 0},
        "summary": map[string]any{"number_of_fragments": 1},
        "content": map[string]any{"number_of_fragments": 2, "fragment_size": 160},
    },
}
```

三种字段三种形态：**title 整字段**（`number_of_fragments: 0` 表示不切片段，返回完整标题方便列表展示）、**summary 单片段**、**content 两片段各 160 字符**。`_source` 同时放开 summary，让命中列表在不依赖高亮时也有摘要可显示。

Go 侧收集片段时有个 SDK 类型坑值得一提：OpenSearch 的 v4 SDK 里 `Highlight` 的类型是 `map[string][]string`——字段名到片段数组的映射，不是单个字符串。包装函数按 title→summary→content 顺序摊平成 `[]string`，塞进 `SearchPostHit.HighlightFragments` 一路带到前端：

```go
// search_repo.go —— 命中片段按 title→summary→content 顺序摊平
func collectHighlightFragments(highlight map[string][]string) []string
```

**前端是这篇最想强调的部分：高亮文本绝不能 `innerHTML` 进去。** 片段虽然来自我们自己的 ES 高亮标签，但正文本身是用户内容——`<mark>` 之间的原文是用户写的，直接拼 HTML 就是把用户内容当 HTML 执行。react 端的做法是把字符串按标记拆成交替的文本/高亮 React 节点（`search/page.tsx`）：

```tsx
/**
 * 受控高亮渲染：把含 <mark>…</mark> 的片段拆成文本/高亮交替的 React 节点。
 * 不走 innerHTML——片段内容来自我们自己的 ES 高亮标签，但正文本身是用户内容，
 * 按标记拆分渲染可避免任何注入面。
 */
function HighlightedText({fragments, fallback}: {fragments?: string[]; fallback: string}) {
    const text = fragments?.[0] ?? fallback;
    if (!text) return null;
    const parts = text.split(/(<mark>.*?<\/mark>)/g).filter(Boolean);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
                    return (
                        <mark key={i} className="rounded-sm bg-primary/15 px-0.5 text-primary">
                            {part.slice(6, -7)}
                        </mark>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
```

正则 `split` 带捕获组，拆出来的是纯文本和完整标记交替的数组；`<mark>` 元素只包一层样式，标记内部的内容作为 React 子节点渲染——**注入面为零**。vue 端同款 `splitHighlight` 函数。

---

## 三、建议词：一条免鉴权链路的完整防御

搜索框输两个字就该出联想——`match_phrase_prefix` 对标题做前缀匹配，Go 侧 DSL 极简：

```go
"must": []any{
    map[string]any{
        "match_phrase_prefix": map[string]any{
            "title": map[string]any{"query": prefix},
        },
    },
},
```

骨架不变：keyword filter 三件套照旧（且状态钉死 `POST_STATUS_PUBLISHED`——草稿不该被联想出来），`_source` 只要 title，`size` 取 limit×2 留去重余量。

真正的设计含量在**这条链路是免鉴权的**（`/app/v1/posts/search/suggest`，与公开搜索同款待遇）。免鉴权端点的租户上下文从哪来？链路上有两道防线：

1. **BFF 侧按 Host 解析租户**，注入 `x-md-global-tenant-id` metadata 传给 core——注释写明这个 header 在内网不可伪造，是内部信任边界；
2. **core 侧 viewer 取不到时回退读同一 metadata**，两者皆无返回空——匿名请求不报错、不越租户。

免鉴权 ≠ 免租户隔离，联想词和搜索结果一样按租户与语言过滤。

前端侧则是输入框防抖的教科书实现（`SearchBar.tsx`）——300ms debounce 之外还有一个更少人写的细节，**请求序号防乱序**：

```tsx
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const seqRef = useRef(0);

useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const q = searchQuery.trim();
    if (q.length < 2) { /* …清空建议… */ }
    timerRef.current = setTimeout(async () => {
        const seq = ++seqRef.current;
        try {
            const resp = await apiClient.postService.SearchPostsSuggest({query: q, language: '', pageSize: 8});
            if (seq !== seqRef.current) return;  // 过期回包，丢弃
            const titles = resp.titles ?? [];
            setSuggestions(titles);
        } catch (error) {
            if (seq === seqRef.current) { /* … */ }
        }
    }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
}, [searchQuery]);
```

debounce 挡的是「每个按键一次请求」，序号挡的是「先发后至」：快速输入时两个请求的回包顺序不确定，慢的那个后到会把新结果覆盖成旧词的联想。`seq !== seqRef.current` 一行判断，把这类竞态钉死。搜索页本身还有一层 `cancelled` 标志同款防护——**凡是带输入框的异步列表，乱序防护都是必选项**。

---

## 四、同义词：为什么放查询侧，而不是索引侧

三件里选型含量最高的这件。同义词在搜索领域有两种经典放法：

**索引侧**（synonym filter / synonym token filter）：建索引时把同义词烧进倒排索引，检索词也会按词表展开。好处是检索时零开销；代价是——**改词表必须重建索引（或做复杂的 reindex）、生效滞后、词表基本不可运营**。

**查询侧**：词库存数据库，检索时把查询串展开，原生索引不动。

CMS 选了查询侧，词表就是一张普通的租户级表（`sys_search_synonyms`）：

```go
field.String("term").
    Comment("触发词（搜索词命中即扩展）").
    NotEmpty().
    MaxLen(64),
field.String("synonyms").
    Comment("扩展词 JSON 字符串数组（与触发词一起以 OR 参与检索）").
    NotEmpty().
    Default("[]"),
```

`term → []synonyms` 的简单结构 + `enabled` 开关 + 租户内唯一索引。管理端 `/admin/v1/search-synonyms` 标准 CRUD + 管理页 `/system/search-synonym`——**运营同学加一条同义词，保存即生效，不碰索引**。这就是选查询侧的全部理由：免重建索引、保存即时生效、词库可以当正常业务数据运营。

展开逻辑在 `SearchSynonymRepo.ExpandQuery`，有两个容易写错的细节：

```go
termMap := r.EnabledTermMap(ctx, tenantID)
// 平台级（tenant 0）词库全局生效，与租户词库合并——匿名搜索链路的租户
// 由 Host 解析，平台管理员维护的词库应对所有租户站点可用。
for term, syns := range r.EnabledTermMap(ctx, 0) {
    if _, dup := termMap[term]; !dup {
        termMap[term] = syns
    }
}
// ……
// 触发词可能是多字词：先整串匹配，再按空白拆词逐个匹配
candidates := []string{q}
candidates = append(candidates, strings.Fields(q)...)
```

一是**词库合并**：平台词库（tenant 0）与租户词库合并，租户条目优先不覆盖——平台运营配通用词，租户配自己的专业词；二是**匹配粒度**：先整串命中再按空白拆词命中，「手机 卡」能命中触发词「手机」。

展开结果回到检索 DSL 时，形态是把「原始查询 + 各扩展词」平铺进 `bool.should`，`minimum_should_match: 1`：

```go
fields := []string{"title", "summary", "content"}
should := make([]any, 0, len(expanded)+1)
should = append(should, map[string]any{
    "multi_match": map[string]any{"query": query, "fields": fields},  // 原始查询永远在首位
})
for _, term := range expanded {
    should = append(should, map[string]any{
        "multi_match": map[string]any{"query": term, "fields": fields},
    })
}
// bool: { filter: [租户/语言/状态], should, minimum_should_match: 1 }
```

命中任一即召回，评分仍按相关性排序——原始查询的得分权重自然靠前（词项匹配更精确）。

**最后一个边界设计决定了这功能敢不敢上生产：扩展是纯增益。** 调用入口处（`search_service.go`）：

```go
if expanded := s.synonymRepo.ExpandQuery(ctx, tenantID, query); len(expanded) > 0 {
    return s.searchRepo.SearchPostsExpanded(...)
}
```

词库加载失败、无命中、触发词为空——任何一种情况都走原查询路径。同义词层挂了，搜索功能不会跟着挂。查询侧方案的这个特性（可降级）反过来又巩固了选型：索引侧 filter 挂了是索引问题，查询侧词库挂了只是「扩展没了」。

---

## 五、真实环境教的三件事

功能落地过程被真实环境纠了三次偏，都有普遍意义：

**1. SDK 类型别猜。** 想当然以为 `Highlight` 是 `map[string]string`，实际是 `map[string][]string`——ES 的高亮本来就按字段返回片段数组。生成代码读一遍比写适配代码快。

**2. 中文分词器决定测试数据。** E2E 一开始用随机长串做触发词，结果 smartcn 的二元语法（把中文按两字切分）对随机长串几乎全部命中——词都「撞上了」，断言全乱。修正：E2E 触发词必须用真实中文词。**给分词器写测试，测试数据得像真人输入。**

**3. 重建索引要趁手。** 索引 mapping 变更（或演示数据注入后）需要全量重建——`cmd/reindex` CLI 这次首战实战（遍历全部帖子逐条重建、非 PUBLISHED 顺手清理 ES 残留）。同一天这个 CLI 还被接成了周期任务：每日 04:44 低峰跑 `ReindexAll`，兜住增量双写崩溃窗口的漂移。**查询侧同义词之所以敢「免重建」，正因为重建这件事本身有趁手的工具。**

---

## 六、收尾

三件事拆完，回头看出镜最多的模式是「骨架不变，局部增强」：高亮是 DSL 里加一段 + 前端渲染方式升级；联想是同一个 filter 骨架换 must 条件 + 一条免鉴权路由；同义词是一次查询前的预处理，主查询 DSL 只是把 must 换成 should 组。底座（smartcn 索引 + keyword 过滤 + 租户 filter）从头到尾没动过。

这大概就是「先修底座，再谈体验」的回报——三件增强每一件都是局部的，风险边界都画在了一层（前端渲染层 / 路由层 / 查询预处理层），互不纠缠。至于同义词选型，一句话总结：**索引侧同义词是搜索引擎的功能，查询侧同义词是业务系统的功能**——要运营的词库，选后者。

仓库（本文所有代码路径均可逐行核对）：

- GitHub：[github.com/tx7do/go-wind-cms](https://github.com/tx7do/go-wind-cms)
- Gitee：[gitee.com/tx7do/go-wind-cms](https://gitee.com/tx7do/go-wind-cms)
