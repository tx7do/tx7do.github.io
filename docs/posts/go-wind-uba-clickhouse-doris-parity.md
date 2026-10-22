---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - ClickHouse
  - Doris
  - GoWind
  - OLAP
  - 数据架构
sticky: 10
---

# GoWind UBA 拆解：把 Doris UNIQUE KEY 翻译成 ClickHouse——读数正确性对齐实录

> 本文回答一个问题：**一套围绕 Doris `UNIQUE KEY` 模型建起来的行为分析系统（upsert 去重、随时可查的聚合结果），要支持 ClickHouse 二选一部署，需要翻译的到底是什么——建几张表就够了吗？**

[GoWind UBA](https://github.com/tx7do/go-wind-uba) 的 OLAP 层原本只跑 Doris。为了适配"已有 ClickHouse 集群、不想再养一套 Doris"的部署环境，项目做了第二个引擎实现：`backend/sql/clickhouse/` 的全套 DDL、`internal/data/clickhouse/` 的 13 个同名仓储文件、`uba-ingest ch-etl` 回算工具。CHANGELOG 里那句"ClickHouse 引擎的读数正确性（事件去重 / FINAL 读 / 派生表按天回算）已与 Doris 对齐"，背后是四幕真实的语义翻译——**每一段 DDL 注释都是一次数据丢失模式的防御记录**。

（本文是 OLAP 系列的姊妹篇：Doris 侧的查询写法与模型设计此前已有专文拆解，这篇只讲"第二个引擎如何等价替换"。）

---

## 一、问题设定：UNIQUE KEY 的语义在 ClickHouse 没有对应物

Doris 的 UNIQUE KEY 模型给使用者的承诺是：同一主键的行，后写的覆盖先写的，**查询永远看到最新版本**——写入即生效，读端无感。这是整个 UBA 系统的地基：Kafka 采集是 at-least-once 的（重放/重试必然产生重复事件），事件表靠 UNIQUE KEY(event_id, tenant_id, event_time) 天然去重；派生表（会话事实、用户维度）靠定期 upsert 更新。

ClickHouse 没有这个承诺。它的 MergeTree 家族里最接近的是 **ReplacingMergeTree**——但它的去重发生在**后台合并**时，而合并是异步的、时机不确定的。这意味着翻译工作的真实难度是三层嵌套的：

1. **表引擎怎么选**——ReplacingMergeTree 的版本列、排序键怎么设计（第三幕之前的去重正确性）；
2. **读端怎么办**——合并没发生时查询会看到重复行，读语义要显式补（FINAL）；
3. **派生表怎么办**——Doris 侧用 INSERT INTO SELECT 的聚合刷新，在 CH 侧物化视图的语义下会**算错**（第四幕的核心）。

先看引擎怎么接进来。

---

## 二、引擎路由：编译期常量，而不是接口注入

双引擎的接线方式先交代，因为它本身是个设计决策。数据层有一个编译期常量：

```go
// UseClickHouse 是否使用ClickHouse作为数据存储，否则使用Doris。
const UseClickHouse bool = false
```

消费方式是每个服务内部的私有接口 + 双字段 + 一个选择方法：

```go
// analyticsImpl 按 OLAP 引擎选择返回可用的分群查询实现。
func (s *SegmentService) analyticsImpl() segmentAnalytics {
	if data.UseClickHouse {
		return s.chAnalytics
	}
	return s.analytics
}
```

常见的做法是定义一个 `AnalyticsRepo` 接口在装配期注入实现——这里刻意没用。理由写在架构文档里：`UseClickHouse` 是编译期写死的部署形态常量，**选了 Doris 时整个 ClickHouse 分支（13 个仓储文件、全部 CH 方言 SQL）直接被编译器裁掉**，不参与构建、不占二进制、不可能在运行时被误触。换来的是两点：部署的"二选一"变成了编译标签而非运行时配置（一份错误的环境变量不会让请求打到没有表结构的引擎上）；方言差异（时间函数、去重语义）全部各自封死在自己的仓储文件里，不渗透进服务层。

代价是服务层多了些 if 分支——对一个"部署时二选一、运行时永不切换"的场景，这是便宜的那一侧。

---

## 三、第一幕：去重——ORDER BY 的双重身份

事件事实表的 DDL 是整个翻译的核心，逐段读（注释为原文件所有）：

```sql
) ENGINE = ReplacingMergeTree(updated_at) -- 与 Doris UNIQUE KEY(event_id, tenant_id, event_time) 对齐：Kafka at-least-once 重放的同事件只保留一条；读取端必须配合 FINAL
      PARTITION BY toYYYYMM(event_date) -- 按月分区，平衡管理粒度和查询性能
      ORDER BY (tenant_id, event_category, event_date, event_name, event_ts, event_id) -- 去重键含 event_id（对齐 Doris），前缀保持原查询剪枝能力
      TTL event_date + INTERVAL 180 DAY
      SETTINGS
          ttl_only_drop_parts = 1, -- TTL 只删除完整分区，避免部分删除开销
          optimize_on_insert = 1 -- 入库块先去重再落盘：Kafka 批次整体重放时，物化视图与 FINAL 读都拿不到重复行
```

三处设计都有明确的对位：

**`ReplacingMergeTree(updated_at)` 的版本列**：同一去重键的多行，合并时保留 `updated_at` 最大的——对应 Doris UNIQUE KEY 的"后写覆盖"。版本列选业务时间戳而非插入时间，让乱序到达的旧版本自然落败。

**ORDER BY 的双重身份**。ReplacingMergeTree 的去重键就是 ORDER BY 键，但 ORDER BY 同时是主键索引——这两个角色对键序的要求是冲突的：去重要求 `event_id` 在键内（否则去不掉重），查询剪枝要求高频过滤列在键前缀。解法是把两种要求排成一列：**前缀 `(tenant_id, event_category, event_date, event_name, event_ts)` 服务查询剪枝，`event_id` 垫底保证去重语义**——一段键序，两种职责，注释原话"前缀保持原查询剪枝能力"。

**`optimize_on_insert = 1`**：入库块先去重再落盘。这一条防的是 Kafka 的**批次级重放**——一批重复事件整体重投时，块内去重让"物化视图与 FINAL 读都拿不到重复行"。注意它防不住跨块的重复（那要等后台合并），所以它叫"缓解"而不是"解决"——真正的兜底在读端。

配套的 `ttl_only_drop_parts = 1`（TTL 到期只删完整分区，避免部分删除的开销与合并放大）是个顺手但正确的细节。

---

## 四、第二幕：FINAL 读——为异步合并付的税

ReplacingMergeTree 的去重发生在后台合并，而合并的调度是 ClickHouse 自己的事——**任何时刻查询，都可能看到尚未合并的重复行**。Doris UNIQUE KEY 没有"还没合并"这个状态，CH 有。这就是翻译的第二笔成本：**读端必须显式声明要"去重后的确定结果"**，语法就是表名后跟 FINAL。

`clickhouse/analytics_repo.go` 的手写 SQL 里 FINAL 出现了 45 处，覆盖所有读事实表的查询；JOIN 场景用别名后缀写法（`users_dim u FINAL`）。两条例外规则同样明确：

- **聚合表（物化视图产物）读不加密 FINAL**——MV 的目标表由回算任务整行写入（见下一幕），本身没有重复行问题；
- **crud 分页列表不能带 FINAL**——FINAL 与 LIMIT/OFFSET 组合的执行代价高，分页场景的去重由回算任务的 OPTIMIZE 提前兜底（下一幕第三节）。

这一幕的教训可以概括成一句话：**ReplacingMergeTree 的"去重"是存储层的懒承诺，读语义要靠查询层显式兑现**。翻译 UNIQUE KEY 时漏掉 FINAL，故障形态不是报错，而是**偶发的计数翻倍**——比崩溃难查得多，因为它只在合并滞后的时间窗内出现。

---

## 五、第三幕：物化视图按块聚合是错的——回算取代 MV

派生表（sessions_fact 会话事实、users_dim 用户维度）的刷新是这次翻译里唯一的**推倒重来**。第一版照搬 Doris 侧的 INSERT INTO SELECT 语义，用了 ClickHouse 物化视图——**方向就是错的**，`06_etl.sql` 的头注释把为什么写得很完整：

> 这取代了旧的 mv_sessions_fact / mv_users_dim（按插入块聚合，**跨块拆行/覆盖、累计值只有块内局部真值**）。

MV 的触发单位是**插入块**：每落一个块，MV 对这一块做聚合写入目标表。对"累计指标"（用户总活跃天数、总会话数）这意味着每个块算出的只是**块内局部真值**，多块之间互相覆盖或拆行——Doris 侧同样的 INSERT INTO SELECT 是显式调度、面向全量数据的，语义完全不同。这是把 SQL 从一个引擎搬到另一个引擎时最危险的一类错误：**语法几乎一样，语义单位不同**。

替代方案是放弃 MV、改为**每日回算**（`uba-ingest ch-etl` 执行 `06_etl.sql`），口径三段（注释原文）：

1. **全历史回算而非块内增量**：按 RunDate 当天活跃的会话/用户集合触发，再对该集合在 events_fact 上**无时间限制全量聚合** → "结果与哪天回算无关（幂等，重跑安全）"。回算任务的幂等性不是靠去重保证的，是靠**口径定义**保证的——这一条值得写进任何 ETL 的设计清单；
2. **CH 无 Doris 的部分列更新**：users_dim 整行由回算写入（活跃/付费/会话等可从事件推断的列），register_time、等级、风险等画像列保持默认值，**等 core 服务通过 users_dim_repo 写入**（写入带 updated_at，ReplacingMergeTree 取最新版本整行生效）——Doris 的 UPDATE 指定列语义在 CH 侧翻译成了"两个写入方各写整行、版本列仲裁"，职责边界画在列的来源上；
3. **§3 的 OPTIMIZE FINAL**：回算结束时把 ReplacingMergeTree 的后台合并**提前做完**——上一幕留下的洞（crud 分页不能带 FINAL）由这一步兜住，分页列表读到的也是去重后的确定结果。

工具链配套：`uba-ingest ch-etl --dry-run` 渲染 SQL 预览（占位符 `{{.RunDate}}`），`ch-etl loop` 模式给没有主机 cron 的部署内建每日调度。回算天然可以随便重跑，这个性质让"某天回算失败"从事故降级为"第二天补跑"。

---

## 六、第四幕：排序键修复三连——三种真实的数据丢失模式

对齐过程还抓出三个排序键错误，每一个都对应一种具体的丢数据模式。原文注释比转述有力，直接引用：

```sql
-- risk_events（风险事件表）
ORDER BY (tenant_id, event_date, risk_event_id)
-- risk_event_id 必须在键内，否则同日同级别的同时刻事件会互相去重（丢数据）

-- id_mapping（身份映射表）
ORDER BY (tenant_id, global_user_id, id_type, id_value)
-- 缺 global_user_id 时同一设备关联到两个用户会互相覆盖（丢关联）

-- user_tags（用户标签表）
ORDER BY (tenant_id, user_id, tag_id, expire_date)
-- 历史版本按过期日期共存，随 TTL 自然清理（effective_date 在键内会让每次刷新永久堆积新版本）
```

三条对应三种经典错误：

1. **去重键粒度不够**——`risk_event_id` 不在键内时，ReplacingMergeTree 认为"同租户同日同级别"是同一行，把同一天的多条不同风险事件互相去重了。**去重键必须是业务身份的完整表达**，照抄 Doris UNIQUE KEY 的每一段，一个都不能省；
2. **键选了"设备"维度而非"身份"维度**——一台测试机登过两个账号，键里没有 global_user_id 就会让两个用户的映射互相覆盖。这是"唯一性到底定义在谁身上"的建模问题，引擎翻译逼着你重新回答一遍；
3. **版本共存键选错**——标签表想保留"带过期日期的多版本标签"（TTL 自然清理），键里放 `effective_date`（生效日）意味着每次刷新标签都生成新键值、旧版本永远不被覆盖，**表会无限膨胀**；换成 `expire_date`，同标签的新版本覆盖旧版本，过期版本随 TTL 消亡。一字之差，一个是版本化存储，一个是无限堆积。

这三条的共性：**在 Doris 上它们全都不会发生**（UNIQUE KEY 主键写死了身份），是翻译动作逼出来的二次建模。翻译的价值恰恰在这里——它强制你把"这张表的唯一性到底是什么"重新回答一遍。

---

## 七、结语

四幕收拢成一张语义翻译对照表：

| Doris UNIQUE KEY 语义 | ClickHouse 侧等价物 | 代价 |
|----------------------|--------------------|------|
| 主键 upsert，写入即去重 | `ReplacingMergeTree(版本列)` + ORDER BY 含去重键 + `optimize_on_insert` | 去重键要与查询剪枝前缀共享一段键序 |
| 查询永远见最新版本 | 读端 `FINAL`（45 处手写 SQL） | 合并滞后的时间窗内必须显式声明；分页场景另需 OPTIMIZE 兜底 |
| INSERT INTO SELECT 显式刷新派生表 | 废弃 MV（按块聚合语义错误），改每日全历史回算（幂等口径） | 引入回算工具与调度；派生列的写入方按"谁推断得出谁写"分工 |
| UPDATE 指定列 | 双写入方各写整行，版本列仲裁 | 列的归属要重新划界 |

两条可迁移的方法论：**其一，OLAP 引擎迁移的正确单位是"语义"而不是"表"——先列出旧引擎给使用者的每一层承诺（写入去重、读时可见性、派生刷新），再逐层找新引擎的等价物与代价，语法相似但语义单位不同的地方（MV 按块聚合）必然藏着错**。其二，**读正确性要在部署形态上分层设计**：批量分析可等合并、可带 FINAL；交互式分页不行，需要"OPTIMIZE 提前合并"这类运营手段补位——同一张表在不同读路径下的正确性策略可以是不同的。

仓库（ClickHouse DDL 在 `backend/sql/clickhouse/`，引擎路由在 `backend/app/core/service/internal/data/data.go`，回算工具在 `backend/cmd/uba-ingest`）：

- GitHub：[github.com/tx7do/go-wind-uba](https://github.com/tx7do/go-wind-uba)
- Gitee：[gitee.com/tx7do/go-wind-uba](https://gitee.com/tx7do/go-wind-uba)
