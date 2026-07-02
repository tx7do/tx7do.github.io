---
date: 2026-07-02
category:
  - GoWind风行
tag:
  - UBA
  - 大数据分析
  - Golang
  - GoWind
sticky: 10
---

# Go Wind UBA 拆解系列 - OLAP 与 SQL 硬核：25 个分析模型怎么落地

> 本文回答一个问题：**25 个分析模型（漏斗 / 留存 / LTV / 归因 / 路径……）在 ClickHouse 和 Doris 上，到底是用什么 SQL 写出来的？双引擎又是怎么做到"一份业务模型，两份实现"的？**

## 一、为什么是双引擎？

先说结论：GoWind UBA 支持 **ClickHouse 和 Apache Doris 二选一**，部署时按需选其一，运行时通过一个开关切换。这是一个很有意思的工程选择——为什么不让用户自己写 SQL，而要维护两份？

因为 **25 个分析模型 × 2 套方言 = 50 份 SQL**，但其中只有**少量函数**是不同的。平台的赌注是：把"相同的 SQL 骨架"抽出来，只换"少数分歧的函数和驱动 API"，就能让同一套业务逻辑跑在两个引擎上，给用户选择权。

让我们看看这个赌注怎么兑现的。

## 二、双引擎切换：一个编译期常量

切换开关在 `backend/app/core/service/internal/data/data.go`：

```go
// UseClickHouse 是否使用ClickHouse作为数据存储，否则使用Doris。
const UseClickHouse bool = false
```

**注意：这是一个 `const bool`，不是运行期配置。** 想换引擎，改这一行重编译。这是个诚实的取舍——双引擎在运行期动态切换会让代码复杂度爆炸（要同时维护两套连接池、做事务一致性等），而绝大多数生产部署只会选一个引擎。用编译期常量换来的是：另一个引擎的 client 连接都不会建立。

```go
// client/clickhouse_client.go
func NewClickHouseClient(ctx *bootstrap.Context) (*clickhouseCrud.Client, func(), error) {
    if !data.UseClickHouse {
        return nil, func() {}, nil   // 永远不连 ClickHouse
    }
    // ...建立连接
}

// client/doris_client.go
func NewDorisClient(ctx *bootstrap.Context) (*dorisCrud.Client, func(), error) {
    if data.UseClickHouse {
        return nil, func() {}, nil   // 永远不连 Doris
    }
    // ...
}
```

两个 repo 在 Wire 里**都注册**，但只有被选中那个的 client 会真连。Service 层持两个 repo 指针，按常量分支：

```go
func (s *AnalyticsService) repo() interface { /* 24 个分析方法的接口 */ } {
    if data.UseClickHouse {
        return s.ckRepo
    }
    return s.dorisRepo
}
```

这个 `repo()` 返回一个**内联接口**——列出所有 24 个分析方法签名。两套 repo 都实现它，service 层无感。`if data.UseClickHouse` 这个分支模式在 10+ 个 service 文件里重复出现（`behavior_event_service` / `risk_event_service` / `session_service`……）。

## 三、Schema：同一张表，两种 DDL

最基础的事实表是 `events_fact`。在 Go 代码里，它有两份镜像定义：

- `internal/data/doris/schema/events_fact.go` —— 用 `db:` tag
- `internal/data/clickhouse/schema/events_fact.go` —— 用 `ch:` tag

注意作者**故意没有**用"一个 struct + 两套 tag"的统一方案，而是维护两份。原因是两个引擎对字段的语义差异不小（比如 ClickHouse 有 `MATERIALIZED` 物化列、原生 map 类型；Doris 有 `GENERATED ALWAYS` 列、自定义 Map 别名），硬塞一个 struct 反而别扭。

字段大概有 50 个：事件主体（event_id/tenant_id/user_id）、时间（event_time/event_ts/server_time）、行为（event_category/event_name）、客体（object_*）、上下文（session_id/platform/os/channel）、地图列（context/metrics/properties 都是 map）、企业字段（risk_level/trace_id）、点击热力图（click_x/click_y/element_xpath/page_url）、游戏专属（server_id/level）。

### 3.1 ClickHouse DDL（`sql/clickhouse/1_base_tables.sql`）

```sql
CREATE TABLE IF NOT EXISTS gw_uba.events_fact
(
    event_id       String,
    tenant_id      UInt32  COMMENT '租户 ID（SaaS 多租户隔离，所有查询必须带此条件）',
    user_id        UInt32,
    ...
    event_time     DateTime64(3),
    event_date     Date MATERIALIZED toDate(event_time),        -- 物化列：分区+TTL 用
    event_ts       Int64 MATERIALIZED toUnixTimestamp64Milli(event_time),
    ...
    event_category LowCardinality(String),                       -- 低基数优化
    event_name     LowCardinality(String),
    ...
    context        Map(String, String),
    metrics        Map(String, Float64),
    properties     Map(String, String),
    -- 跳数索引（data-skipping）
    INDEX idx_object_id      object_id     TYPE bloom_filter(0.01) GRANULARITY 4,
    INDEX idx_context_keys   mapKeys(context) TYPE bloom_filter(0.01) GRANULARITY 2,
    INDEX idx_element_xpath  element_xpath TYPE ngrambf_v1(3, 5, 2, 0) GRANULARITY 4,  -- ngram 分词，子串搜索
    INDEX idx_risk           risk_level    TYPE set(4) GRANULARITY 1,
    ...
) ENGINE = MergeTree
  PARTITION BY toYYYYMM(event_date)                              -- 按月分区
  ORDER BY (tenant_id, event_category, event_date, event_name, event_ts)  -- tenant_id 是首列
  TTL event_date + INTERVAL 180 DAY
  SETTINGS index_granularity = 8192, ttl_only_drop_parts = 1;
```

要点：

- **`tenant_id` 是 ORDER BY 首列**——租户的事件在排序的 part 里物理连续，租户级查询能跳过无关 granule。
- **物化列**：`event_date` 和 `event_ts` 由 `event_time` 推导，写入不重复存储，读取时计算。
- **TTL + `ttl_only_drop_parts`**：过期按"整 part 删除"而非行级，效率高。
- **跳数索引**：bloom_filter（精确等值）、`ngrambf_v1`（XPath 子串搜索，热力图用）、`set`（极低基数）。
- **`LowCardinality(String)`**：对 `event_name` 这类枚举字段用字典编码，省存储加速扫描。

### 3.2 Doris DDL（`sql/doris/1_base_tables.sql`）

```sql
CREATE TABLE IF NOT EXISTS events_fact (
    event_id VARCHAR(128) NOT NULL,
    tenant_id INT NOT NULL,
    event_time DATETIMEV2(3) NOT NULL,
    ...
    event_ts BIGINT GENERATED ALWAYS AS (UNIX_TIMESTAMP(event_time)*1000),  -- 生成列
    ...
    context MAP<STRING,STRING>,
    metrics MAP<STRING,DOUBLE>,
    properties MAP<STRING,STRING>,
    ...
    INDEX idx_event_name (event_name) USING INVERTED,    -- 倒排索引
    INDEX idx_user_id   (user_id)   USING INVERTED,
    ...                                                   -- 12 个倒排索引
)
    UNIQUE KEY(event_id, tenant_id, event_time)            -- 唯一键去重
    PARTITION BY RANGE(event_time) ()                      -- 静态分区为空
    DISTRIBUTED BY HASH(event_id, tenant_id) BUCKETS 16    -- tenant_id 参与 hash，租户数据同桶聚集
    PROPERTIES (
        "dynamic_partition.enable" = "true",               -- 动态分区
        "dynamic_partition.time_unit" = "DAY",
        "dynamic_partition.start" = "-180",                -- 保留 180 天
        "dynamic_partition.end" = "3",                     -- 预创建未来 3 天
        "enable_unique_key_merge_on_write" = "true"        -- MoW 模式，按 event_id 去重
    );
```

要点：

- **UNIQUE KEY + MoW**：Doris 的唯一键模型 + 写时合并，按 `event_id` 去重（ClickHouse 用的是纯 append 的 MergeTree，靠 ReplacingMergeTree 在别处实现 upsert）。
- **动态分区**：`start=-180, end=3`，Doris 自动按天创建/裁剪分区，等价于 ClickHouse 的 TTL，但机制完全不同。
- **倒排索引**：Doris 的二级索引机制，跟 ClickHouse 的 bloom/skip 索引是两套东西。
- **`tenant_id` 参与 hash 分桶**：跟 ClickHouse 把 `tenant_id` 放 ORDER BY 首列是同一个意图——**让租户数据物理聚集**，加速租户级扫描。

### 3.3 双引擎对比一览

| 维度 | ClickHouse | Doris |
|------|-----------|-------|
| 引擎模型 | `MergeTree`（append-only） | UNIQUE KEY + merge-on-write（去重） |
| 分区 | `toYYYYMM(event_date)` 按月 | 动态 RANGE 按 DAY，`start=-180` |
| 保留期 | `TTL + 180 DAY`，整 part 删 | `dynamic_partition.start = -180` 自动裁剪 |
| 排序/分桶键 | `ORDER BY (tenant_id, ...)` | `DISTRIBUTED BY HASH(event_id, tenant_id)` |
| 二级索引 | 8 个跳数索引（bloom/ngram/set） | 12 个倒排索引 |
| 派生时间列 | `MATERIALIZED toDate(event_time)` | `GENERATED ALWAYS AS (UNIX_TIMESTAMP(event_time)*1000)` |
| 低基数优化 | `LowCardinality(String)` | 无（纯 VARCHAR） |

**同一个业务意图（租户聚集 + 时间分区 + 二级索引 + 派生列），两个引擎用完全不同的机制实现。** 这就是"双引擎"的代价——也是它的价值：用户可以根据自己的运维栈选熟悉的引擎。

## 四、方言映射：分歧到底有多大？

跑过 25 个模型后，我总结出 ClickHouse 和 Doris 的分歧**集中在 6~7 个函数**上。SQL 骨架完全一样，换这些函数就行：

| 用途 | Doris | ClickHouse |
|------|-------|-----------|
| 计数 | `COUNT(*)` | `count()` |
| 去重计数 | `COUNT(DISTINCT user_id)` | `count(DISTINCT user_id)` |
| ms 时间戳 → 日期 | `FROM_UNIXTIME(event_ts/1000, '%Y-%m-%d')` | `toDate(event_ts / 1000)` |
| 路径拼接 | `GROUP_CONCAT(event_name SEPARATOR ' → ')` | `arrayStringConcat(groupArray(event_name), ' → ')` |
| 条件计数 | `SUM(CASE WHEN ... )` | `countIf(...)` |
| Map 字段访问 | 列名直接取 | `context['stars']`、`metrics['score']` |
| 金额转换 | `CAST(amount AS DOUBLE)`、`ROUND(SUM(...),2)` | `toFloat64OrZero(toString(amount))` |

驱动 API 也不同（这是更麻烦的部分）：

```go
// Doris（sqlx 风格）
r.db.GetContext(ctx, &cnt, q+" LIMIT 1", args...)      // 标量
r.db.SelectContext(ctx, &rows, q, args...)             // 切片

// ClickHouse（clickhouse-go 风格）
r.db.QueryRow(ctx, &cnt, q, args...)                   // 标量
r.db.Select(ctx, &rows, q, args...)                    // 切片
```

struct tag 也得双份：Doris 用 `db:"..."`，ClickHouse 用 `ch:"..."`（部分字段 `ch:"-"` 排除物化列）。

**结论：维护成本是可控的。** 一旦你接受了"两份 repo 文件"，每个新模型的增量工作就是：写一份 Doris SQL → 改 6~7 个函数和驱动调用 → 得到 ClickHouse 版本。骨架可复用，分歧点局部化。

## 五、四个有技术含量的模型

下面挑四个最能体现"SQL 巧思"的模型，把真实 SQL 贴出来。

### 5.1 归因分析（Attribution）：CTE + 窗口函数的教科书

归因要解决："用户最终转化了，但中间是哪个渠道/来源把他带来的？" 经典的 first-touch / last-touch 模型。

这个实现用了**两个 CTE + ROW_NUMBER 窗口函数**，干净到可以写进教材（`doris/analytics_repo.go`）：

```sql
WITH converters AS (
    -- 先圈出"在时间窗内完成转化事件"的所有用户
    SELECT DISTINCT user_id FROM events_fact
    WHERE tenant_id = ? AND event_name = ? AND event_time >= ? AND event_time < ?
),
touchpoint AS (
    -- 回到这些转化用户的"所有"事件，按时间排序打行号
    SELECT e.user_id, e.channel AS dim_val,
           ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY e.event_time DESC) AS rn
    FROM events_fact e
    JOIN converters c ON c.user_id = e.user_id
    WHERE e.tenant_id = ? AND e.event_time >= ? AND e.event_time < ?
)
-- rn=1 即每个用户"最后一次"（last-touch）或"第一次"（first-touch）触点
SELECT dim_val, COUNT(DISTINCT user_id) AS converter_uv
FROM touchpoint
WHERE rn = 1 AND dim_val IS NOT NULL AND dim_val <> ''
GROUP BY dim_val
ORDER BY converter_uv DESC
LIMIT 20
```

精妙之处：

- **`ORDER BY e.event_time DESC` 还是 `ASC` 决定 last 还是 first touch。** 这一点用 `fmt.Sprintf` 在 Go 层切换，逻辑零改动。
- **`rn = 1` 把每个用户折叠成一个触点**，避免重复计算。
- **全程用 `ROW_NUMBER`，不依赖任何厂商专有函数**——所以 Doris 和 ClickHouse 都能跑。

这是最优雅的一个模型。

### 5.2 LTV：CASE 阶梯分桶 + Go 侧累积

LTV（生命周期价值）要算："某批同期群用户，在第 0/1/3/7/14/30/60/90 天，平均每人累计贡献了多少收入？" 这是一个**单调递增的累积曲线**。

实现分两步（`doris/analytics_repo.go`）：

**第一步：固定观测阶梯**

```go
maxDays := []uint32{0, 1, 3, 7, 14, 30, 60, 90}
```

**第二步：用 CASE WHEN 把付费事件按"距注册天数"分桶**

```sql
SELECT u.register_channel AS label,
  CASE
    WHEN DATEDIFF(e.event_time, u.register_time) <= 0  THEN 0
    WHEN DATEDIFF(e.event_time, u.register_time) <= 1  THEN 1
    WHEN DATEDIFF(e.event_time, u.register_time) <= 3  THEN 3
    WHEN DATEDIFF(e.event_time, u.register_time) <= 7  THEN 7
    WHEN DATEDIFF(e.event_time, u.register_time) <= 14 THEN 14
    WHEN DATEDIFF(e.event_time, u.register_time) <= 30 THEN 30
    WHEN DATEDIFF(e.event_time, u.register_time) <= 60 THEN 60
    ELSE 90
  END AS day_n,
  ROUND(SUM(e.amount), 2) AS total_amount
FROM events_fact e
JOIN users_dim u ON u.tenant_id = e.tenant_id AND u.user_id = e.user_id
WHERE u.tenant_id = ? AND u.register_time >= ? AND u.register_time < ?
  AND e.amount > 0 AND e.user_id > 0
GROUP BY label, day_n
```

**第三步：Go 侧走阶梯累加**

SQL 返回的是每个桶的总额；Go 按天 `0→1→3→...→90` 升序走，累加：`cumulative += bucketSum[label][dayN]`，再 `ltv = cumulative / cohortSize`。最终得到 LTV(0)、LTV(1)、LTV(3)…… 一条单调递增的"累计每获客收入"曲线。

技巧点评：

- **分桶用 `DATEDIFF(event_time, register_time)`（事件时间减注册时间的天数差）+ CASE 阶梯**，而不是用 SQL 窗口函数 SUM OVER——因为分桶点是不规则的 `{0,1,3,7,14,30,60,90}`，CASE 比窗口灵活。
- **累积曲线故意放在 Go 里**，不在 SQL 里做——这样同一个 SQL 结果可以同时算"累计 LTV"和"分桶 LTV"，复用性好。
- **可选维度**：`dimension == "channel"` 时 SELECT 改成 `u.register_channel AS label`，就能看每个渠道的 LTV 曲线。

### 5.3 路径桑基（PathSankey）：三层嵌套 + GROUP_CONCAT

要把"用户在每个会话里的事件序列"聚合成 TOP N 路径，喂给桑基图。实现是三层嵌套（`doris/analytics_repo.go`）：

```sql
SELECT event_sequence, COUNT(*) AS support_count,
       COUNT(DISTINCT user_id) AS unique_users, 0 AS conversion_rate
FROM (
  -- 第三层：每个(用户,会话)拼成 "事件A → 事件B → 事件C" 字符串
  SELECT user_id, session_id,
         GROUP_CONCAT(event_name SEPARATOR ' → ') AS event_sequence
  FROM (
    -- 第二层：保证时间顺序
    SELECT user_id, session_id, event_name, event_time
    FROM events_fact
    WHERE tenant_id = ? AND event_time >= ? AND event_time < ?
      AND session_id != '' AND user_id > 0
    ORDER BY user_id, session_id, event_time
  ) ordered
  GROUP BY user_id, session_id
) paths
WHERE event_sequence IS NOT NULL AND event_sequence != ''
GROUP BY event_sequence
ORDER BY support_count DESC
LIMIT 20
```

ClickHouse 版只换一个函数：

```sql
-- Doris:  GROUP_CONCAT(event_name SEPARATOR ' → ')
-- CH:     arrayStringConcat(groupArray(event_name), ' → ')
```

关键赌注：**内层 `ORDER BY` 在聚合时是否被保留？** Doris 在 `GROUP_CONCAT` 里通常保留内层顺序；ClickHouse 的 `groupArray` 也倾向于保留插入顺序（虽然不是契约保证）。这是这个查询能 work 的隐含前提。`topN` 被夹在 `[1, 200]`，默认 20。

> 注：`conversion_rate` 这里硬编码成 `0`——没有 join 目标事件。这是个已知的小局限，源码里也这么写着。

### 5.4 漏斗（Funnel）：诚实的"非严格"实现

漏斗分析要算："从步骤 1 到步骤 N，每一步的转化率是多少？"

这里有个**必须说清楚的取舍**。源码注释明说（`doris/analytics_repo.go:105-106`）：

> 统计口径：每个步骤 = 在时间范围内完成该事件的去重用户数（不做严格顺序穿透，这是 Doris 上的近实时实现；严格漏斗需事件级顺序匹配，留作后续优化）。

也就是说，**它不是真正的"有序漏斗"**。它做的是：每个步骤独立查一次"时间窗内做过该事件的去重用户数"，然后在 Go 里做除法：

```sql
-- 每个步骤发一次（循环 N 次）
SELECT COUNT(DISTINCT user_id) AS cnt FROM events_fact
WHERE event_time >= ? AND event_time < ? AND event_name = ?
[AND tenant_id = ?]
LIMIT 1
```

Go 侧算转化率：

```go
// 步骤 i 的转化率 = 步骤 i 的人数 / 步骤 i-1 的人数
// 步骤 i 的总体转化率 = 步骤 i 的人数 / 步骤 0 的人数
```

**为什么不严格？** 因为严格有序漏斗需要"同一个用户在时间上依次触发 step1→step2→step3"。ClickHouse 有 `windowFunnel()` 函数能干这事，Doris 没有等价物。为了双引擎行为一致，作者选择了**两个引擎都能跑的简化口径**，代价是"漏斗"退化为"各步骤独立去重用户数 + 算术"。

这是一个**用精度换双引擎一致性 + 近实时性能**的典型取舍。源码诚实标注了，这点值得尊敬。如果你需要严格漏斗，要么只用 ClickHouse 走 `windowFunnel`，要么自己加一层。

## 六、维度白名单：防 SQL 注入的正解

分析查询里维度字段（dimension）是用户传的字符串，比如 `"channel"` / `"platform"`。这里有个经典安全问题：**SQL 标识符不能参数化**（`SELECT ? FROM ...` 不行），但又不能直接拼用户输入。怎么破？

项目用了一个两层白名单（`doris/analytics_repo.go:2255-2272`、`clickhouse/analytics_helpers.go:32-48`）：

```go
func allowedDimension(dim string) (string, bool) {
    m := map[string]string{
        "platform":       "platform",
        "channel":        "channel",
        "country":        "country",
        "app_version":    "app_version",
        "event_name":     "event_name",
        "event_category": "event_category",
        "os":             "os",
        "network":        "network",
        "user_level":     "user_level",
        "vip_level":      "vip_level",
    }
    v, ok := m[dim]
    return v, ok
}
```

用法：

```go
col, ok := allowedDimension(req.GetDimension())
if !ok {
    return nil, ubaV1.ErrorBadRequest(fmt.Sprintf("unsupported dimension: %s", req.GetDimension()))
}
// 返回的 col 来自 map 的 value（服务端控制的字面量），不是用户输入
q := fmt.Sprintf("SELECT %s AS label, %s AS value FROM events_fact %s WHERE ...",
    col, metricExpr, joinClause)
```

机制要点：

1. **白名单 map**：只有这 10 个已知安全的列名能通过；返回值是 **map 的 value（服务端字面量）**，不是原始用户输入。未知维度直接 `400 Bad Request`。
2. **metric 也有白名单**（switch）：`COUNT` / `UNIQUE_USER` / `SUM_AMOUNT`，从不拼接用户文本。
3. **identifier 拼接 + value 绑定**：白名单解析后的列名确实用 `fmt.Sprintf` 拼进 SQL（因为标识符不能参数化），但因为它来自固定 map，值保证安全；用户传入的**数值**一律用 `?` 绑定。
4. **`user_level` / `vip_level` 触发 JOIN**：这两个维度在 `users_dim` 表而不是 `events_fact`，代码会自动构造 `JOIN users_dim u ON ...` 并给列名加 `u.` 前缀。

这是**标准且正确的防注入模式**：标识符用白名单解析后拼接，值用参数绑定。每个分析方法的租户条件 `tenant_id = ?` 也都走绑定，从不字符串拼接。

> 一个小细节：`Attribution` 没走 `allowedDimension`，而是自己写了 `if d == "referer" { dim = "referer" } else { channel }` 的硬编码分支——更简单，但用了不同的 guard 风格。代码里这种"一致性瑕疵"在真实项目里很常见。

## 七、25 个模型的全景

把所有方法列出来感受下规模（都在 `analytics_repo.go`，Doris 版 2293 行，ClickHouse 版镜像）：

**通用行为分析（10）**：EventTrend、Funnel、Retention、GroupBy、ActiveUsers、Attribution、Distribution、BehaviorSequence、Segmentation、Click

**用户深度洞察（9）**：Lifecycle、Churn、Interval、Matrix、Revenue、SessionAnalysis、Anomaly、NewVsOld、PathSankey

**游戏专项（6）**：LevelAnalysis、WhaleTier、LTV、ServerRetention、OnlineStats、Economy

每个都是 `func (r *AnalyticsRepo) Xxx(ctx, req) (resp, error)`，Doris/CH 各一份。最有"算法味"的几个：

- **Anomaly（异常检测）**：事件环比涨跌 + 7 日基线预警，发现埋点丢失/故障。
- **WhaleTier（付费分层）**：把付费用户按金额分大/中/小课长，验证二八定律。
- **Economy（经济系统）**：代币产出/消耗平衡监控，防通胀和刷币。
- **LevelAnalysis（关卡分析）**：通过率/卡关率/满星率，游戏数值平衡。

这些模型的 SQL 风格大同小异：**时间窗 + tenant 条件 + GROUP BY 维度 + 聚合函数**，区别在聚合的具体表达（CASE 分桶 / 窗口函数 / DATEDIFF）。

## 八、小结：双引擎值不值得？

回到开头的赌注。维护两份 OLAP repo、两份 DDL、两套方言映射，**值得吗**？

我的看法是——**对开源项目值得，对单一公司项目未必**：

- **开源项目**：用户运维栈各异，有人吃 Doris（兼容 MySQL 协议、运维熟），有人吃 ClickHouse（极致 scan 性能）。给选择权 = 拓宽用户面。维护成本可控（如前述，分歧只在 6~7 个函数）。
- **单一公司**：除非真有切换引擎的需求，否则选一个深挖更划算。双引擎的代码分支会渗入每个 service（`if data.UseClickHouse`），增加心智负担。

GoWind UBA 选择双引擎，更多是**给社区一个选择**的姿态。而它把双引擎分歧控制得足够局部（repo 层 + 驱动 API + 6~7 个函数），是一个值得学习的工程克制。

---

*本文 SQL 全部出自 [go-wind-uba](https://github.com/tx7do/go-wind-uba) 仓库 `backend/app/core/service/internal/data/{doris,clickhouse}/analytics_repo.go`，DDL 出自 `backend/sql/{doris,clickhouse}/`。*
