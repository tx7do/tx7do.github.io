# Postgres 全文搜索：数据库中的搜索引擎

在我的 SQL 之旅的早期，我认为在数据库中搜索一段文本主要涉及这样的查询：

```sql
SELECT col FROM table WHERE col LIKE '%some_value%';
```

然后，如果我想获得更具体的信息，我会添加一些通配符或正则表达式。

后来，我与一位客户合作，他希望在应用程序中具有搜索功能，因此`LIKE`正则表达式不会削减它。我一直以来所知道的只是 [模式匹配](https://www.postgresql.org/docs/current/functions-matching.html)。它对于某些目的来说工作得非常好，但是当它不仅仅是检查单个文本字段中的简单模式时会发生什么？

例如，如果您想跨多个字段进行搜索该怎么办？即使搜索词碰巧拼写错误，如何返回可能的匹配项？另外，如果您有大量数据需要搜索怎么办？当然，您可以为要查询模式匹配的列创建索引，但这会有限制（例如，B 树索引不适用于 `col LIKE '%substring%'`）。

因此，当我们说 PostgreSQL 是“[自带电池的数据库](https://www.crunchydata.com/blog/postgres-the-batteries-included-database)”时，这只是原因之一。使用 Postgres，您无需立即寻找比您自己的数据库管理系统更远的全文搜索解决方案。如果您还没有尝试过 Postgres 的内置全文搜索，请继续阅读简单的介绍。

## 面向新手的 Postgres 全文搜索基础知识

核心 Postgres 包括以下全文搜索功能。仅举几例：

- 忽略停用词（常见词，例如“the”或“an”）。
- 词干，其中搜索匹配可以基于单词的“根”形式或词干（“run”匹配“runs”和“running”甚至“ran”）。
- 权重和排名搜索匹配（因此可以将最佳匹配排序到结果列表的顶部）。

在进一步讨论之前，让我们先熟悉一下以下概念：

1. `文档(document)`是您要对其进行全文搜索的一组数据。在 Postgres 中，这可以从单个列或多个列的组合，甚至从多个表构建。
2. 文档被解析为标记，这些标记是文档文本中的小片段（例如单词、短语等）。然后，标记被转换为更有意义的文本单元，称为 `词位(lexemes)`。
3. 在 Postgres 中，这种转换是通过 字典完成的 ——有内置的字典，但如果需要的话可以创建自定义字典。这些词典有助于确定应忽略的停用词，以及不同派生的单词是否具有相同的词干。大多数[词典](https://www.postgresql.org/docs/current/textsearch-dictionaries.html)都是针对特定语言（英语、德语等）的，但您也可以有针对特定领域的词典。
4. 文档中的词位排序列表存储在 [tsvector](https://www.postgresql.org/docs/current/datatype-textsearch.html) 数据类型中。

## 示例：搜索风暴事件详细信息

我有一个表，其中包含美国国家气象局收集的风暴事件数据。为了简单起见，我不会在下面的语句中包含所有可能的字段，但 [此存储库](https://github.com/CrunchyData/crunchy-demo-data/tree/master/storm_data?CrunchyAnonId=shuetgezkfmxictkanlixjjgzdchjjyvmgmmaubchwbrcimrbs)中提供了数据的副本和一些进一步的信息。

```sql
CREATE TABLE se_details (
    episode_id int,
    event_id int primary key,
    state text,
    event_type text,
    begin_date_time timestamp,
    episode_narrative text,
    event_narrative text,
    ...
);
```

假设我们要对 `event_narrative`列上的数据进行全文搜索。我们可以在表中添加一个新列来存储预处理的搜索文档（即词位列表）：

```sql
ALTER TABLE se_details ADD COLUMN ts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', event_narrative)) STORED;
```

ts 是一个 [生成列](https://www.postgresql.org/docs/current/ddl-generated-columns.html) （从 Postgres 12 开始新增），它会自动与源数据同步。

然后我们可以在 `ts` 上创建一个 [GIN 索引](https://www.postgresql.org/docs/current/textsearch-indexes.html)：

```sql
CREATE INDEX ts_idx ON se_details USING GIN (ts);
```

然后我们可以像这样查询：

```sql
SELECT state, begin_date_time, event_type, event_narrative
FROM se_details
WHERE ts @@ to_tsquery('english', 'tornado');
```

[tsquery](https://www.postgresql.org/docs/current/datatype-textsearch.html#DATATYPE-TSQUERY) 是 Postgres 中的另一种全文搜索数据类型。它表示也被处理为词位的搜索词，因此我们将输入词传递给`to_tsquery`函数以优化全文搜索的查询。（`@@` 是 [匹配运算符](https://www.postgresql.org/docs/current/functions-textsearch.html)。）

通过此查询，我们得到的是“tornado”位于文本字符串中某处的记录，但除此之外，结果集中还有几条记录，其中也有“tornado”作为词素的匹配项（“tornado-像”和“storm”）：

```text
state           | KENTUCKY
begin_date_time | 2018-04-03 18:08:00
event_type      | Thunderstorm Wind
event_narrative | A 1.5 mile wide swath of winds gusting to around 95 mph created **tornado-like** damage along Kentucky Highway 259 in Edmons
on County. The winds, extending 3/4 of a mile north and south of Bee Spring, destroyed or heavily damaged several small outbuildings, tore
part of the roof off of one home, uprooted and snapped the trunks of numerous trees, and snapped around a dozen power poles. Several othe
r homes sustained roof damage, and wind-driven hail shredded vinyl siding on a number of buildings.
```

和

```text
state           | WISCONSIN
begin_date_time | 2018-08-28 15:30:00
event_type      | Thunderstorm Wind
event_narrative | A swath of widespread tree and crop damage across the southern portion of the county. Sections of trees and crops compl
etely flattened, and some structural damage from fallen trees or due to the strong downburst winds. Various roads closed due to fallen tre
es. Two semi-trucks were overturned on highway 57 in Waldo. The widespread wind damage and tornadoes caused structural damage to many home
s with 70 homes sustaining affected damage, 3 homes with minor damage, 2 homes with major damage, one home destroyed, and 2 businesses wit
h minor damage.
```

## 搜索短语

将短语处理为搜索词的一种方法是将 `&`(`AND`) 或 `<->`(`FOLLOWED BY`) 等布尔运算符与`tsquery`一起协同使用。

例如，如果我们要搜索短语“rain of Fragments”：

```sql
SELECT state, begin_date_time, event_type, event_narrative
FROM se_details
WHERE ts @@ to_tsquery('english', **'rain & of & debris'**);
```

搜索短语被标准化为“rain”和“debri”。只要“rain”和“debri”在文档中都匹配，顺序并不重要，例如以下示例：

>A `debris` flow caused by heavy `rain` on a saturated hillside blocked the Omak River Road one mile south of the intersection with State Route 97.

如果我们执行`to_tsquery('english', 'rain <-> of <-> debris')`，那么tsquery的值为 `is 'rain' <2> 'debri'`，这意味着它只会匹配“rain”后面紧跟“debri”两个位置的位置，例如这里：

>Heavy `rain` caused `debris` flows on the Coal Hollow Fire and Tank Hollow Fire burn scars.

（这实际上是唯一的匹配，因此使用 <-> 运算符有一点限制。）

该 [phraseto_tsquery](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES) 函数还可以解析短语本身，并在词位之间插入`<N>`，其中 N 是从前一个词位开始计数时下一个词位的整数位置。与 to_tsquery 不同，该函数无法识别运算符；例如，我们可以像这样传递整个短语：

```sql
phraseto_tsquery('english', 'rain of debris')
```

`tsquery`的值如上也是`'rain' <2> 'debri'`，所以`phraseto_tsquery` 也考虑了定位。

## 对搜索结果进行加权和排名的函数

分配不同权重和排名的一种非常常见的用例是：搜索文章。例如，您可能希望将文章标题和摘要或内容合并在一起进行搜索，但希望标题上的匹配被认为更相关，从而排名更高。

回到我们的风暴事件示例，我们的数据表`episode_narrative`除了 之外还有一列`event_narrative`。对于风暴数据，一个`event`是一个单独类型的风暴事件（例如洪水(flood)、冰雹(hail)），而`episode`是一个完整的风暴系统，可能包含许多不同类型的`event`。

假设我们希望能够对`event`和`episode narratives`进行全文搜索，但决定`event narrative`应该比`episode narratives`更重要。我们可以这样定义 `ts` 列：

```sql
ALTER TABLE se_details ADD COLUMN ts tsvector
    GENERATED ALWAYS AS
     **(setweight(to_tsvector('english', coalesce(event_narrative, '')), 'A') ||**
     **setweight(to_tsvector('english', coalesce(episode_narrative, '')), 'B'))** STORED;
```

[setweight](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-PARSING-DOCUMENTS) 是一个全文(full-text)函数，为文档的组成部分分配权重。该函数采用字符“A”、“B”、“C”或“D”（按权重从大到小的顺序）。我们在这里还使用了合并，这样连接就不会导致`episode_narrative`或者`event_narrative`包含空值。

[ts_rank](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING) 然后，您可以在子句中使用`ORDER BY`函数来返回从最相关到​​最不相关的结果。

```sql
SELECT …
ORDER BY ts_rank(ts, to_tsquery('english', 'tornado')) DESC;
```

因此，该记录在搜索结果中排名较高：

```text
state             | MISSISSIPPI
begin_date_time   | 2018-04-06 22:18:00
event_type        | Tornado
event_narrative   | This tornado touched down near the Jefferson Davis-Covington County line along Lucas Hollow Road. It continued southeast, crossing the
 county line. Some large limbs and trees were snapped and uprooted at this location. It then crossed Lucas Hollow Road again before crossing Leonard Road.
 A tornado debris signature was indicated on radar in these locations. The tornado uprooted and snapped many trees in this region. It also overturned a sm
all tractor trailer on Oakvale Road and caused some minor shingle damage to a home. After crossing Oakvale Road twice, the tornado lifted before crossing
Highway 35. The maximum winds in this tornado was 105mph and total path length was 2.91 miles. The maximum path width was 440 yards.
episode_narrative | A warm front was stretched across the region on April 6th. As a disturbance rode along this stalled front, it brought copious amounts
of rain to the region thanks to ample moisture in place. As daytime heating occurred, some storms developed which brought severe weather to the region.
```

与此相比，其中有“tornado”的匹配episode_narrative 但没有event_narrative：

```text
state             | NEBRASKA
begin_date_time   | 2018-06-06 18:10:00
event_type        | Hail
event_narrative   | Hail predominately penny size with some quarter size hail mixed in.
episode_narrative | Severe storms developed in the Nebraska Panhandle during the early evening hours of Jun
e 6th. As this activity tracked east, a broken line of strong to severe thunderstorms developed. Hail up to
 the size of ping pong balls, thunderstorm wind gusts to 70 MPH and a brief tornado touchdown were reported
. Heavy rain also fell leading to flash flooding in western Keith county.
```

提示：ts_rank 返回一个浮点值，因此您可以在您的表达式中包含`SELECT`表达式以查看这些匹配的得分。就我而言，密西西比州事件的得分约为 0.890，内布拉斯加州事件的得分约为 0.243。

## 是的，您可以在 Postgres 中保留全文搜索

通过实现[突出显示结果(highlighting results)](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE)或编写您自己的自定义字典或函数等功能，您可以更深入地进行 Postgres 全文搜索，使您的 Postgres 全文搜索更加强大 。您还可以考虑启用扩展，例如 [unaccent](https://www.postgresql.org/docs/current/unaccent.html)（从词素中删除变音符号）或 [pg_trgm](https://www.postgresql.org/docs/current/pgtrgm.html)（用于模糊搜索）。说到扩展，这些只是[Crunchy Bridge](https://www.crunchydata.com/products/crunchy-bridge/)支持的两个扩展。我们构建了托管云 Postgres 服务，以便您可以直接投入并利用所有这些 Postgres 功能。

话虽如此：正如您所看到的，`您不需要非常复杂的设置即可开始`。尝试一下您是否刚刚开始探索全文搜索解决方案，或者甚至只是重新评估是否需要全力以赴寻求专用的全文搜索服务，这是一个好主意，特别是如果您的堆栈中已经有了 Postgres 。

公平地说，Postgres 没有 Elasticsearch 等平台提供的一些搜索功能。但一个主要优点是您不必维护和同步单独的数据存储。如果您不太需要超大规模的搜索，那么通过最小化依赖性可能会给您带来更多好处。另外，您已经了解的 Postgres 查询语法加上一些新函数和运算符，可以让您走得更远。

## 原文地址

- [Postgres Full-Text Search: A Search Engine in a Database](https://www.crunchydata.com/blog/postgres-full-text-search-a-search-engine-in-a-database)
