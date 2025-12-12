# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：列表查询规则指南

在企业级中后台系统中，列表查询是贯穿“数据管理、业务审核、统计分析”的核心高频场景——从用户列表的多条件筛选，到订单数据的时间区间查询，再到报表的排序分页，其易用性与灵活性直接决定研发效率与业务操作体验。风行·GoWind Admin 作为开箱即用的 Go 语言后台管理系统，以“降低开发成本、提升研发效率”为核心设计理念，针对性打造了一套“配置化、高兼容、可扩展”的列表查询规则，让开发者无需关注底层 SQL 实现，仅通过简单配置即可完成复杂查询需求。

## 一、核心设计理念：声明式语法与 Go 生态适配

GoWind Admin 列表查询规则的设计，深度借鉴了 Python 生态中 Django ORM、SQLAlchemy 等优秀框架的“声明式语法”核心思想——通过贴近自然语言的配置方式屏蔽底层数据访问细节，让开发者聚焦业务逻辑而非 SQL 拼接。但不同于简单照搬，我们基于 Go 语言“强类型、高性能”的特性做了全链路适配，最终实现“简洁直观”与“原生兼容”的平衡：

- **屏蔽底层差异**：统一封装多数据库（MySQL、PostgreSQL、Oracle 等）的查询语法差异，配置式查询规则可跨数据库复用，避免开发者适配不同数据库的重复工作。
- **强化类型安全**：基于 Go 强类型特性设计查询参数校验机制，避免动态 SQL 拼接带来的类型错误与注入风险。
- **低心智负担**：采用“字段名+操作符”的简洁配置格式，无需编写繁琐 SQL，新手也能快速上手。
- **灵活扩展兼容**：支持原生 SQL 扩展、自定义查询函数，既满足开箱即用的简单需求，也能适配复杂业务场景。

简言之，GoWind Admin 列表查询规则的核心目标是：让后台列表开发从“重复编码”转变为“配置化组装”，兼顾效率与灵活性。

## 二、通用列表查询请求：统一参数规范

GoWind Admin 定义了标准化的列表查询请求参数，所有列表接口均遵循此规范，确保前后端交互的一致性。参数支持多条件组合过滤、动态排序、分页控制、字段筛选等核心能力，具体说明如下：

| 字段名       | 类型        | 格式           | 字段描述    | 业务场景示例               | 核心备注                   |
|-----------|-----------|-------------------------------------|---------|--------------|-------------------|
| page      | `number`  |    -   | 当前页码    |      查询第 2 页用户数据：`page=2`| 默认值 1，最小值 1，小于 1 时按默认值处理|
| pageSize  | `number`  |    -   | 每页的行数   |  每页显示 20 条订单数据：`pageSize=20` | 默认值 10，最小值 1，最大值可通过后端配置限制（默认 100）
|
| query     | `string`  | JSON Object 或 JSON Array | AND 逻辑过滤条件（多条件同时满足） | 1. **单条件**：查询用户名=“admin”的用户：`query={"userName":"admin"}` <br>2. **多条件**：查询用户名=“admin”且状态=1的用户：`query=[{"userName":"admin"},{"status":1}]` | 1. Object 与 Array 均支持，Object 适用于不同字段组合，Array 支持同字段多值匹配；<br>2. 支持“`字段名__操作符`”的扩展语法（详见过滤规则） |
| or        | `string`  | JSON Object 或 JSON Array | OR 逻辑过滤条件（多条件满足其一）  | 查询用户名=“admin”或手机号=“13800138000”的用户：`or=[{"userName":"admin"},{"phone":"13800138000"}]`     |        语法规则与 query 一致，仅逻辑关系不同（OR vs AND）            |
| orderBy   | `string`  | JSON String Array                 | 排序条件    |     1. **单字段降序**：按创建时间倒序查询：`orderBy=["-createTime"]` <br>2. **多字段排序**：按创建时间降序、用户ID升序：`orderBy=["-createTime","userId"]`        |  字段名前加“-”表示降序，不加表示升序；多字段排序按数组顺序优先级递减 |
| noPaging  | `boolean` |     -   | 是否不分页（返回全量数据）   |   导出全量用户数据：noPaging=true             | 为 true 时，page、pageSize 参数失效；建议仅在数据量较小时使用（避免性能问题）         |
| fieldMask | `string`  | 逗号分隔的字段名列表    | 字段掩码（仅返回指定字段）    | 仅查询用户的 ID、用户名、真实姓名：`fieldMask="id,userName,realName"`| 为空时默认返回全部字段（SELECT *）；指定字段可减少数据传输，提升查询性能        |

> **参数传递说明**：所有 JSON 格式的参数（query、or、orderBy）需进行 URL 编码后传递，避免特殊字符导致解析失败。例如：`query=%7B%22userName%22%3A%22admin%22%7D`

## 三、排序规则：简洁直观的排序配置

排序规则基于 SQL 的 `ORDER BY` 语法设计，通过简单的“字段名前缀标识”实现升序/降序控制，支持多字段组合排序，完全适配业务中复杂的排序需求。

### 3.1 核心规则

- 升序：直接传入字段名（无前缀），如 "`createTime`" 对应 SQL：`ORDER BY createTime ASC`。
- 降序：字段名前加“`-`”前缀，如 "`-createTime`" 对应 SQL：`ORDER BY createTime DESC`。
- 多字段排序：按数组顺序依次排序（优先级递减），如 `["-createTime", "userId"]` 对应 SQL：`ORDER BY createTime DESC, userId ASC`。

#### 3.2 典型场景示例

| 业务需求 | orderBy 参数值（JSON 字符串）                 | 对应的 SQL 排序片段           |
|----|--------------------|--------------|
| 按创建时间倒序（最新数据在前） | `["-createTime"]`         |      `ORDER BY createTime DESC`        |
| 按订单金额升序（从小到大） | `["amount"]` | `ORDER BY amount ASC` |
| 按部门ID升序、同一部门内按入职时间倒序 | `["deptId", "-entryTime"]` | `ORDER BY deptId ASC, entryTime DESC` |

## 四、过滤规则：灵活强大的条件筛选

过滤规则是列表查询的核心，对应 SQL 中的 `WHERE` 条件。GoWind Admin 支持“基础等值筛选”与“高级条件筛选”，高级筛选通过“字段名__操作符”的双下划线分隔语法实现，覆盖模糊搜索、区间查询、正则匹配等全场景需求。

### 4.1 基础语法规则

- **基础等值筛选**：直接使用 `{"字段名": "值"}`，如 `{"status": 1}` 对应 SQL：`WHERE status = 1`。
- **高级条件筛选**：使用 `{"字段名__操作符": "值"}`，如 `{"createTime__gte": "2024-01-01"}` 对应 SQL：`WHERE createTime >= '2024-01-01'`。
- **JSON 字段筛选**：支持嵌套 JSON 字段的筛选，语法为 `{"字段名.嵌套JSON字段名__操作符": "值"}`，如 `{"extInfo.phone__contains": "138"}` 对应 `SQL：WHERE extInfo->>'$.phone' LIKE '%138%'`（PostgreSQL 示例）。

### 4.2 完整操作符列表（按功能分类）

#### 4.2.1 基础逻辑与等值操作

| 操作符  | 功能描述 | 配置示例             | 对应 SQL 片段    | 适用场景                             |
|--------|----------|---------------------|-----------------|--------------------------------------|
| （无操作符）       |等值匹配  | `{"userName": "admin"}`       | `WHERE userName = 'admin'`                  |精确匹配单个值（如状态、用户名）|
| not        |非等值匹配 | `{"userName__not": "admin"}`             | `WHERE userName != 'admin'`                 |   排除特定值（如排除管理员账号）        |
| in        |  多值匹配（满足其一）| `{"status__in": "[1,2]"}`       | `WHERE status IN (1,2)`              |                 匹配多个可选值（如查询状态为“启用”或“审核中”的数据）      |
| not_in     |多值排除（均不满足） | `{"status__not_in": "[0,3]"}`                   | `WHERE status NOT IN (0,3)`           |       排除多个无效值（如排除“禁用”或“已删除”的数据）        |
| isnull      | 为空匹配|`{"email__isnull": "True"}`              | `WHERE email IS NULL`               |查询未填写某字段的数据（如未绑定邮箱的用户）|
| not_isnull  | 非空匹配 | `{"email__not_isnull": "True"}`     | `WHERE email IS NOT NULL`               |查询已填写某字段的数据（如已绑定邮箱的用户）|

#### 4.2.2 数值/时间区间操作

| 操作符  | 功能描述 | 配置示例             | 对应 SQL 片段    | 适用场景                             |
|--------|----------|---------------------|-----------------|--------------------------------------|
| gte        | 大于等于| `{"age__gte": "18"}`                         | `WHERE age >= 18`        |         数值下限筛选（如成年用户）、时间起始筛选（如2024年之后的数据）                              |
| gt         | 大于| `{"amount__gt": "1000"}`                          | `WHERE amount > 1000`       |              数值严格大于筛选（如金额大于1000的订单）                                |
| lte        |小于等于 | `{"age__lte": "30"}`                         | `WHERE age <= 30`            |     数值上限筛选（如30岁以下用户）、时间截止筛选（如2024年之前的数据）                              |
| lt          |小于| `{"amount__lt": "500"}`                          | `WHERE amount < 500`        |                          数值严格小于筛选（如小额订单）           |
| range      | 区间匹配（包含边界）| `{"createTime__range": "[\"2024-01-01\",\"2024-06-30\"]"}` | `WHERE createTime BETWEEN '2024-01-01' AND '2024-06-30'`   | 时间区间、数值区间筛选（如上半年的订单数据）。<br>需要注意的是: <br>1. 有些数据库的BETWEEN实现的开闭区间可能不一样。<br>2. 日期`2005-01-01`会被隐式转换为：`2005-01-01 00:00:00`，两个日期一致就会导致查询不到数据。 |                                                                                                            |


#### 4.2.3 字符串模糊匹配操作

| 操作符  | 功能描述 | 配置示例             | 对应 SQL 片段    | 适用场景                             |备注                             |
|--------|----------|---------------------|-----------------|--------------------------------------|----------------|
| contains    |包含匹配（区分大小写）| `{"userName__contains": "Li"}` | `WHERE userName LIKE '%Li%';` | 精准模糊搜索（如区分大小写的用户名搜索）|依赖数据库 LIKE 语法，性能一般，建议结合索引使用|
| icontains   |包含匹配（不区分大小写）|`{"userName__icontains": "li"}` | `WHERE userName ILIKE '%li%';` |通用模糊搜索（如用户姓名搜索，不区分大小写） |跨数据库兼容性略差，建议优先使用数据库忽略大小写配置|
| startswith  |前缀匹配（区分大小写）| `{"phone__startswith": "138"}` | `WHERE phone LIKE '138%';` |按前缀筛选（如138号段的手机号） |可命中前缀索引，性能优于 contains|
| istartswith |前缀匹配（不区分大小写）| `{"name__istartswith": "张"}` | `WHERE name ILIKE '张%';` |姓名前缀搜索（不区分大小写） |可命中前缀索引，性能优于 contains|
| endswith    |后缀匹配（区分大小写）| `{"email__endswith": "@qq.com"}` | `WHERE email LIKE '%@qq.com';` |按后缀筛选（如QQ邮箱用户） |无法命中普通索引，性能较差，数据量大时慎用|
| iendswith   |后缀匹配（不区分大小写）| `{"email__iendswith" : "@QQ.Com"}` | `WHERE name ILIKE '%@QQ.Com';` | ||
| exact       |完全匹配（区分大小写）| `{"idCard__exact": "110101199001011234"}` | `WHERE id_card LIKE '110101199001011234';` | 精确匹配敏感信息（如身份证号）|等同于无操作符的等值匹配，优先级更高|
| iexact      |完全匹配（不区分大小写）| `{"name__iexact" : "a"}` | `WHERE name ILIKE 'a';` | ||
| search      |全文搜索| |                                 | ||

#### 4.2.4 正则匹配操作

| 操作符  | 功能描述 | 配置示例             | 对应 SQL 片段    | 适用场景                             |
|--------|----------|---------------------|-----------------|--------------------------------------|
| regex       |正则匹配（区分大小写）| `{"phone__regex": "^1[3-9]\\d{9}$"}`    | MySQL: `WHERE phone REGEXP BINARY '^1[3-9]\\d{9}$'`  <br> Oracle: `WHERE REGEXP_LIKE(title, '^(An?\|The) +', 'c');`  <br> PostgreSQL: `WHERE phone ~ '^1[3-9]\\d{9}$'`  <br> SQLite: `WHERE title REGEXP '^(An?\|The) +';` |           复杂格式校验（如手机号、身份证号格式验证）      |
| iregex      |正则匹配（不区分大小写）|`{"title__iregex": "^(通知\|公告).*$"}`                   | MySQL: `WHERE title REGEXP \'^(通知\|公告).\*$'`  <br> Oracle: `WHERE REGEXP_LIKE(title, '^(an?\|the) +', 'i');`  <br> PostgreSQL: `WHERE title ~* '^(通知\|公告).*$'`  <br> SQLite: `WHERE title REGEXP '(?i)^(an?\|the) +';`   |    不区分大小写的复杂文本匹配（如标题分类）  |

#### 4.2.5 日期时间提取操作

支持从日期时间字段中提取年、月、日、小时等维度进行筛选，适配按时间维度统计的业务场景：

| 操作符  | 功能描述 | 配置示例             | 对应 SQL 片段    | 适用场景                             |
|--------|----------|---------------------|-----------------|--------------------------------------|
| date         |提取日期（忽略时间）| `{"createTime__date": "2024-05-20"}`  | `WHERE DATE(createTime) = '2024-05-20'`             |      查询某一天的数据（如5月20日的订单）   |
| year         |提取年份| `{"createTime__year": "2024"}`        | `WHERE EXTRACT(YEAR FROM createTime) = 2024`    |  按年份统计（如2024年的所有数据） |
| iso_year     |ISO 8601 一年中的周数| `{"pub_date__iso_year" : "2023"}`    | `WHERE EXTRACT('ISOYEAR' FROM pub_date) = '2023'` |       |
| month        |提取月份(1-12)| `{"createTime__month": "5"}`         | `WHERE EXTRACT(MONTH FROM createTime) = 5`     |      按月份统计（如5月份的订单）      |
| day          |提取日期（当月第几天）| `{"createTime__day": "20"}`            | `WHERE EXTRACT(DAY FROM createTime) = 20`        |  按每月固定日期筛选（如每月20日的报销单）         |
| week         |ISO 8601 周编号 一年中的周数| `{"pub_date__week" : "7"}`           | `WHERE EXTRACT('WEEK' FROM pub_date) = '7'`       |  |
| week_day     | 星期几|`{"pub_date__week_day" : "tom"}`     | ``                                                |                   |
| iso_week_day || `{"pub_date__iso_week_day" : "tom"}` | ``                                                |                      |
| quarter      |提取季度（1-4）| `{"createTime__quarter": "2"}`        | `WHERE EXTRACT(QUARTER FROM createTime) = 2`    |    按季度统计（如2季度的业绩数据）           |
| time         || `{"pub_date__time" : "12:59:59"}`    | ``                                                |                      |
| hour         |提取小时(0-23) | `{"createTime__hour": "18"}`          | `WHERE EXTRACT(HOUR FROM createTime) = 18`      |    按小时筛选（如傍晚6点的操作记录）   |
| minute       |提取分钟(0-59)   | `{"pub_date__minute" : "59"}`        | `WHERE EXTRACT('MINUTE' FROM pub_date) = '59'`    |         |
| second       |提取秒(0-59)| `{"pub_date__second" : "59"}`        | `WHERE EXTRACT('SECOND' FROM pub_date) = '59'`    |           |

### 4.3 过滤规则避坑指南

1. 日期区间查询注意事项：日期字符串（如“2024-01-01”）会被隐式转换为“2024-01-01 00:00:00”，若需查询当天全量数据，建议使用 `createTime__range: ["2024-01-01", "2024-01-01 23:59:59"]`，避免遗漏当天后半段数据。
2. 模糊匹配性能优化：`contains`、`endswith` 等操作无法命中普通索引，数据量大时建议使用全文检索（如 Elasticsearch）替代，或为字段建立专用模糊索引。
3. 跨数据库兼容性：`icontains`、`istartswith` 等不区分大小写的操作，在 MySQL 中需开启 `lower_case_table_names` 配置，否则可能出现大小写区分的情况。
4. 正则匹配慎用：正则匹配（`regex`、`iregex`）性能较差，且跨数据库语法差异大，非必要不使用；若需使用，建议简化正则表达式。

## 五、典型业务场景实操示例

结合前文规则，以下是3个高频业务场景的完整查询配置示例，覆盖多条件筛选、排序分页、字段筛选等核心能力，可直接参考落地：

### 5.1 场景1：多条件筛选用户列表（分页+排序）

业务需求：查询“部门ID=1”且“入职时间在2024年1月1日之后”且“用户名包含‘张’”的用户，按入职时间倒序排序，每页20条，查询第2页，仅返回ID、用户名、入职时间字段。

```json
// 请求参数（已URL编码前）
{
  "page": 2,
  "pageSize": 20,
  "query": [
    {"deptId": 1},
    {"entryTime__gte": "2024-01-01"},
    {"userName__icontains": "张"}
  ],
  "orderBy": ["-entryTime"],
  "fieldMask": "id,userName,entryTime"
}
```

对应 SQL 核心片段：

```sql
SELECT id, userName, entryTime 
FROM user 
WHERE deptId = 1 
  AND entryTime >= '2024-01-01' 
  AND userName ILIKE '%张%' 
ORDER BY entryTime DESC 
LIMIT 20 OFFSET 20;
```

### 5.2 场景2：订单列表OR条件筛选（不分页）

业务需求：查询“订单状态=待支付”或“订单金额>10000”的全量订单，按订单金额降序排序。

```json
// 请求参数（已URL编码前）
{
  "noPaging": true,
  "or": [
    {"status": 1}, // 1=待支付
    {"amount__gt": 10000}
  ],
  "orderBy": ["-amount"]
}
```

### 5.3 场景3：按日期维度筛选报表数据

业务需求：查询“2024年2季度”且“每周一创建”的销售报表数据。

```json
// 请求参数（已URL编码前）
{
  "query": [
    {"createTime__year": "2024"},
    {"createTime__quarter": "2"},
    {"createTime__week_day": "1"} // 1=周一（不同数据库可能有差异，需适配）
  ]
}
```

## 六、扩展说明：自定义查询逻辑

GoWind Admin 列表查询规则支持自定义扩展，以适配复杂业务场景（如多表关联查询、自定义函数计算等）：

- **原生 SQL 扩展**：通过 `customSql` 参数传入自定义 SQL 片段（需后端开启白名单配置），如：`customSql="AND (userName LIKE '%张%' OR realName LIKE '%张%')`"。
- **自定义查询函数**：后端可注册自定义查询处理器，支持复杂逻辑计算（如按地理位置筛选、按权限数据过滤等），前端通过约定的操作符调用。
- **多表关联查询**：通过后端配置关联表映射关系，前端可直接按“关联表字段名__操作符”的格式筛选关联数据（如 `{"dept.name__contains": "技术部"}` 查询所属技术部的用户）。

## 七、项目源码与参考资料

### 7.1 项目源码

- Gitee（国内访问速度快）：<https://gitee.com/tx7do/go-wind-admin>
- GitHub：<https://github.com/tx7do/go-wind-admin>

### 7.2 参考资料

- Django ORM 过滤规则：<https://docs.djangoproject.com/en/4.2/ref/models/querysets/#field-lookups>
- Tortoise ORM 过滤规则：<https://tortoise.github.io/query.html#filtering>
- GoWind Admin 后端查询扩展文档：<http://localhost:7788/docs/openapi.yaml>（本地部署后访问）


[1]:<https://tortoise.github.io/query.html#filtering>
[2]:<https://docs.djangoproject.com/en/4.2/ref/models/querysets/#field-lookups>
[3]:<https://gitee.com/tx7do/go-wind-admin>
[4]:<https://github.com/tx7do/go-wind-admin>
