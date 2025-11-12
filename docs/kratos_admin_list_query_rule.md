# 开箱即用的GO后台管理系统 Kratos Admin - 列表查询规则

作为开箱即用的 Go 语言后台管理系统，Kratos Admin 的核心设计理念始终围绕 “降低开发成本、提升研发效率” 展开。而列表查询作为后台系统中最高频的核心场景 —— 从数据筛选、条件组合到排序分页，其易用性与灵活性直接决定了开发者的日常研发体验。

在设计 Kratos Admin 的列表查询规则时，我们深度借鉴了 Python 生态中优秀 ORM（如 Django ORM、SQLAlchemy）的设计思想：它们以 “声明式语法” 简化复杂查询逻辑，用贴近自然语言的配置方式屏蔽底层 SQL 细节，让开发者无需关注数据访问层的实现，仅需聚焦业务本身。这种 “简洁、直观、低心智负担” 的设计哲学，正是我们希望注入 Kratos Admin 的核心特质。

不同于简单照搬，我们结合 Go 语言强类型、高性能的特性做了针对性适配：在保留 Python ORM “配置化查询” 核心优势的基础上，强化了类型安全校验、查询性能优化与 Go 生态的原生兼容性，既避免了重复造轮子的低效开发，又让查询规则完全贴合 Go 开发者的编码习惯。

最终，Kratos Admin 的列表查询规则旨在实现 “开箱即用” 与 “灵活扩展” 的平衡 —— 开发者无需编写繁琐的 SQL 拼接逻辑，仅通过简单配置即可实现多条件筛选、动态排序、分页控制等常见需求，同时支持自定义查询逻辑扩展，让后台列表开发从 “重复编码” 转变为 “配置化组装”，真正提升研发效率与系统可维护性。

## 通用列表查询请求

| 字段名       | 类型        | 格式                                  | 字段描述    | 示例                                                                                                       | 备注                                                               |
|-----------|-----------|-------------------------------------|---------|----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| page      | `number`  |                                     | 当前页码    |                                                                                                          | 默认为`1`，最小值为`1`。                                                  |
| pageSize  | `number`  |                                     | 每页的行数   |                                                                                                          | 默认为`10`，最小值为`1`。                                                 |
| query     | `string`  | `json object` 或 `json object array` | AND过滤条件 | json字符串: `{"field1":"val1","field2":"val2"}` 或者`[{"field1":"val1"},{"field1":"val2"},{"field2":"val2"}]` | `map`和`array`都支持，当需要同字段名，不同值的情况下，请使用`array`。具体规则请见：[过滤规则](#过滤规则) |
| or        | `string`  | `json object` 或 `json object array` | OR过滤条件  | 同 AND过滤条件                                                                                                |                                                                  |
| orderBy   | `string`  | `json string array`                 | 排序条件    | json字符串：`["-create_time", "type"]`                                                                       | json的`string array`，字段名前加`-`是为降序，不加为升序。具体规则请见：[排序规则](#排序规则)      |
| noPaging  | `boolean` |                                     | 是否不分页   |                                                                                                          | 此字段为`true`时，`page`、`pageSize`字段的传入将无效用。                          |
| fieldMask | `string`  | 其语法为使用逗号分隔字段名                       | 字段掩码    | 例如：id,realName,userName。                                                                                 | 此字段是`SELECT`条件，为空的时候是为`*`。                                       |

## 排序规则

排序操作本质上是`SQL`里面的`Order By`条件。

| 序列 | 示例                 | 备注           |
|----|--------------------|--------------|
| 升序 | `["type"]`         |              |
| 降序 | `["-create_time"]` | 字段名前加`-`是为降序 |

## 过滤规则

过滤器操作本质上是`SQL`里面的`WHERE`条件。

过滤器的规则，遵循了Python的ORM的规则，比如：

- [Tortoise ORM Filtering](https://tortoise.github.io/query.html#filtering)。
- [Django Field lookups](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#field-lookups)

如果只是普通的查询，只需要传递`字段名`即可，但是如果需要一些特殊的查询，那么就需要加入`操作符`了。

特殊查询的语法规则其实很简单，就是使用双下划线`__`分割字段名和操作符：

```text
{字段名}__{查找类型} : {值}
{字段名}.{JSON字段名}__{查找类型} : {值}
```

| 查找类型        | 示例                                                            | SQL                                                                                                                                                                                                                       | 备注                                                                                                            |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| not         | `{"name__not" : "tom"}`                                       | `WHERE NOT ("name" = "tom")`                                                                                                                                                                                              |                                                                                                               |
| in          | `{"name__in" : "[\"tom\", \"jimmy\"]"}`                       | `WHERE name IN ("tom", "jimmy")`                                                                                                                                                                                          |                                                                                                               |
| not_in      | `{"name__not_in" : "[\"tom\", \"jimmy\"]"}`                   | `WHERE name NOT IN ("tom", "jimmy")`                                                                                                                                                                                      |                                                                                                               |
| gte         | `{"create_time__gte" : "2023-10-25"}`                         | `WHERE "create_time" >= "2023-10-25"`                                                                                                                                                                                     |                                                                                                               |
| gt          | `{"create_time__gt" : "2023-10-25"}`                          | `WHERE "create_time" > "2023-10-25"`                                                                                                                                                                                      |                                                                                                               |
| lte         | `{"create_time__lte" : "2023-10-25"}`                         | `WHERE "create_time" <= "2023-10-25"`                                                                                                                                                                                     |                                                                                                               |
| lt          | `{"create_time__lt" : "2023-10-25"}`                          | `WHERE "create_time" < "2023-10-25"`                                                                                                                                                                                      |                                                                                                               |
| range       | `{"create_time__range" : "[\"2023-10-25\", \"2024-10-25\"]"}` | `WHERE "create_time" BETWEEN "2023-10-25" AND "2024-10-25"` <br>或<br> `WHERE "create_time" >= "2023-10-25" AND "create_time" <= "2024-10-25"`                                                                             | 需要注意的是: <br>1. 有些数据库的BETWEEN实现的开闭区间可能不一样。<br>2. 日期`2005-01-01`会被隐式转换为：`2005-01-01 00:00:00`，两个日期一致就会导致查询不到数据。 |
| isnull      | `{"name__isnull" : "True"}`                                   | `WHERE name IS NULL`                                                                                                                                                                                                      |                                                                                                               |
| not_isnull  | `{"name__not_isnull" : "False"}`                              | `WHERE name IS NOT NULL`                                                                                                                                                                                                  |                                                                                                               |
| contains    | `{"name__contains" : "L"}`                                    | `WHERE name LIKE '%L%';`                                                                                                                                                                                                  |                                                                                                               |
| icontains   | `{"name__icontains" : "L"}`                                   | `WHERE name ILIKE '%L%';`                                                                                                                                                                                                 |                                                                                                               |
| startswith  | `{"name__startswith" : "La"}`                                 | `WHERE name LIKE 'La%';`                                                                                                                                                                                                  |                                                                                                               |
| istartswith | `{"name__istartswith" : "La"}`                                | `WHERE name ILIKE 'La%';`                                                                                                                                                                                                 |                                                                                                               |
| endswith    | `{"name__endswith" : "a"}`                                    | `WHERE name LIKE '%a';`                                                                                                                                                                                                   |                                                                                                               |
| iendswith   | `{"name__iendswith" : "a"}`                                   | `WHERE name ILIKE '%a';`                                                                                                                                                                                                  |                                                                                                               |
| exact       | `{"name__exact" : "a"}`                                       | `WHERE name LIKE 'a';`                                                                                                                                                                                                    |                                                                                                               |
| iexact      | `{"name__iexact" : "a"}`                                      | `WHERE name ILIKE 'a';`                                                                                                                                                                                                   |                                                                                                               |
| regex       | `{"title__regex" : "^(An?\|The) +"}`                          | MySQL: `WHERE title REGEXP BINARY '^(An?\|The) +'`  <br> Oracle: `WHERE REGEXP_LIKE(title, '^(An?\|The) +', 'c');`  <br> PostgreSQL: `WHERE title ~ '^(An?\|The) +';`  <br> SQLite: `WHERE title REGEXP '^(An?\|The) +';` |                                                                                                               |
| iregex      | `{"title__iregex" : "^(an?\|the) +"}`                         | MySQL: `WHERE title REGEXP '^(an?\|the) +'`  <br> Oracle: `WHERE REGEXP_LIKE(title, '^(an?\|the) +', 'i');`  <br> PostgreSQL: `WHERE title ~* '^(an?\|the) +';`  <br> SQLite: `WHERE title REGEXP '(?i)^(an?\|the) +';`   |                                                                                                               |
| search      |                                                               |                                                                                                                                                                                                                           |                                                                                                               |

以及将日期提取出来的查找类型：

| 查找类型         | 示例                                   | SQL                                               | 备注                   |
|--------------|--------------------------------------|---------------------------------------------------|----------------------|
| date         | `{"pub_date__date" : "2023-01-01"}`  | `WHERE DATE(pub_date) = '2023-01-01'`             |                      |
| year         | `{"pub_date__year" : "2023"}`        | `WHERE EXTRACT('YEAR' FROM pub_date) = '2023'`    | 哪一年                  |
| iso_year     | `{"pub_date__iso_year" : "2023"}`    | `WHERE EXTRACT('ISOYEAR' FROM pub_date) = '2023'` | ISO 8601 一年中的周数      |
| month        | `{"pub_date__month" : "12"}`         | `WHERE EXTRACT('MONTH' FROM pub_date) = '12'`     | 月份，1-12              |
| day          | `{"pub_date__day" : "3"}`            | `WHERE EXTRACT('DAY' FROM pub_date) = '3'`        | 该月的某天(1-31)          |
| week         | `{"pub_date__week" : "7"}`           | `WHERE EXTRACT('WEEK' FROM pub_date) = '7'`       | ISO 8601 周编号 一年中的周数 |
| week_day     | `{"pub_date__week_day" : "tom"}`     | ``                                                | 星期几                  |
| iso_week_day | `{"pub_date__iso_week_day" : "tom"}` | ``                                                |                      |
| quarter      | `{"pub_date__quarter" : "1"}`        | `WHERE EXTRACT('QUARTER' FROM pub_date) = '1'`    | 一年中的季度              |
| time         | `{"pub_date__time" : "12:59:59"}`    | ``                                                |                      |
| hour         | `{"pub_date__hour" : "12"}`          | `WHERE EXTRACT('HOUR' FROM pub_date) = '12'`      | 小时(0-23)             |
| minute       | `{"pub_date__minute" : "59"}`        | `WHERE EXTRACT('MINUTE' FROM pub_date) = '59'`    | 分钟 (0-59)            |
| second       | `{"pub_date__second" : "59"}`        | `WHERE EXTRACT('SECOND' FROM pub_date) = '59'`    | 秒 (0-59)             |

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)
