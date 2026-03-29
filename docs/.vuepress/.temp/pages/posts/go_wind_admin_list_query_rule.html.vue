<template><div><h1 id="gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-列表查询规则指南" tabindex="-1"><a class="header-anchor" href="#gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-列表查询规则指南"><span>GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：列表查询规则指南</span></a></h1>
<p>在企业级中后台系统中，列表查询是贯穿“数据管理、业务审核、统计分析”的核心高频场景——从用户列表的多条件筛选，到订单数据的时间区间查询，再到报表的排序分页，其易用性与灵活性直接决定研发效率与业务操作体验。风行·GoWind Admin 作为开箱即用的 Go 语言后台管理系统，以“降低开发成本、提升研发效率”为核心设计理念，针对性打造了一套“配置化、高兼容、可扩展”的列表查询规则，让开发者无需关注底层 SQL 实现，仅通过简单配置即可完成复杂查询需求。</p>
<h2 id="一、核心设计理念-声明式语法与-go-生态适配" tabindex="-1"><a class="header-anchor" href="#一、核心设计理念-声明式语法与-go-生态适配"><span>一、核心设计理念：声明式语法与 Go 生态适配</span></a></h2>
<p>GoWind Admin 列表查询规则的设计，深度借鉴了 Python 生态中 Django ORM、SQLAlchemy 等优秀框架的“声明式语法”核心思想——通过贴近自然语言的配置方式屏蔽底层数据访问细节，让开发者聚焦业务逻辑而非 SQL 拼接。但不同于简单照搬，我们基于 Go 语言“强类型、高性能”的特性做了全链路适配，最终实现“简洁直观”与“原生兼容”的平衡：</p>
<ul>
<li><strong>屏蔽底层差异</strong>：统一封装多数据库（MySQL、PostgreSQL、Oracle 等）的查询语法差异，配置式查询规则可跨数据库复用，避免开发者适配不同数据库的重复工作。</li>
<li><strong>强化类型安全</strong>：基于 Go 强类型特性设计查询参数校验机制，避免动态 SQL 拼接带来的类型错误与注入风险。</li>
<li><strong>低心智负担</strong>：采用“字段名+操作符”的简洁配置格式，无需编写繁琐 SQL，新手也能快速上手。</li>
<li><strong>灵活扩展兼容</strong>：支持原生 SQL 扩展、自定义查询函数，既满足开箱即用的简单需求，也能适配复杂业务场景。</li>
</ul>
<p>简言之，GoWind Admin 列表查询规则的核心目标是：让后台列表开发从“重复编码”转变为“配置化组装”，兼顾效率与灵活性。</p>
<h2 id="二、通用列表查询请求-统一参数规范" tabindex="-1"><a class="header-anchor" href="#二、通用列表查询请求-统一参数规范"><span>二、通用列表查询请求：统一参数规范</span></a></h2>
<p>GoWind Admin 定义了标准化的列表查询请求参数，所有列表接口均遵循此规范，确保前后端交互的一致性。参数支持多条件组合过滤、动态排序、分页控制、字段筛选等核心能力，具体说明如下：</p>
<table>
<thead>
<tr>
<th>字段名</th>
<th>类型</th>
<th>格式</th>
<th>字段描述</th>
<th>业务场景示例</th>
<th>核心备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>page</td>
<td><code v-pre>number</code></td>
<td>-</td>
<td>当前页码</td>
<td>查询第 2 页用户数据：<code v-pre>page=2</code></td>
<td>默认值 1，最小值 1，小于 1 时按默认值处理</td>
</tr>
<tr>
<td>pageSize</td>
<td><code v-pre>number</code></td>
<td>-</td>
<td>每页的行数</td>
<td>每页显示 20 条订单数据：<code v-pre>pageSize=20</code></td>
<td>默认值 10，最小值 1，最大值可通过后端配置限制（默认 100）</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>query</td>
<td><code v-pre>string</code></td>
<td>JSON Object 或 JSON Array</td>
<td>AND 逻辑过滤条件（多条件同时满足）</td>
<td>1. <strong>单条件</strong>：查询用户名=“admin”的用户：<code v-pre>query={&quot;userName&quot;:&quot;admin&quot;}</code> <br>2. <strong>多条件</strong>：查询用户名=“admin”且状态=1的用户：<code v-pre>query=[{&quot;userName&quot;:&quot;admin&quot;},{&quot;status&quot;:1}]</code></td>
<td>1. Object 与 Array 均支持，Object 适用于不同字段组合，Array 支持同字段多值匹配；<br>2. 支持“<code v-pre>字段名__操作符</code>”的扩展语法（详见过滤规则）</td>
</tr>
<tr>
<td>or</td>
<td><code v-pre>string</code></td>
<td>JSON Object 或 JSON Array</td>
<td>OR 逻辑过滤条件（多条件满足其一）</td>
<td>查询用户名=“admin”或手机号=“13800138000”的用户：<code v-pre>or=[{&quot;userName&quot;:&quot;admin&quot;},{&quot;phone&quot;:&quot;13800138000&quot;}]</code></td>
<td>语法规则与 query 一致，仅逻辑关系不同（OR vs AND）</td>
</tr>
<tr>
<td>orderBy</td>
<td><code v-pre>string</code></td>
<td>JSON String Array</td>
<td>排序条件</td>
<td>1. <strong>单字段降序</strong>：按创建时间倒序查询：<code v-pre>orderBy=[&quot;-createTime&quot;]</code> <br>2. <strong>多字段排序</strong>：按创建时间降序、用户ID升序：<code v-pre>orderBy=[&quot;-createTime&quot;,&quot;userId&quot;]</code></td>
<td>字段名前加“-”表示降序，不加表示升序；多字段排序按数组顺序优先级递减</td>
</tr>
<tr>
<td>noPaging</td>
<td><code v-pre>boolean</code></td>
<td>-</td>
<td>是否不分页（返回全量数据）</td>
<td>导出全量用户数据：noPaging=true</td>
<td>为 true 时，page、pageSize 参数失效；建议仅在数据量较小时使用（避免性能问题）</td>
</tr>
<tr>
<td>fieldMask</td>
<td><code v-pre>string</code></td>
<td>逗号分隔的字段名列表</td>
<td>字段掩码（仅返回指定字段）</td>
<td>仅查询用户的 ID、用户名、真实姓名：<code v-pre>fieldMask=&quot;id,userName,realName&quot;</code></td>
<td>为空时默认返回全部字段（SELECT *）；指定字段可减少数据传输，提升查询性能</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>参数传递说明</strong>：所有 JSON 格式的参数（query、or、orderBy）需进行 URL 编码后传递，避免特殊字符导致解析失败。例如：<code v-pre>query=%7B%22userName%22%3A%22admin%22%7D</code></p>
</blockquote>
<h2 id="三、排序规则-简洁直观的排序配置" tabindex="-1"><a class="header-anchor" href="#三、排序规则-简洁直观的排序配置"><span>三、排序规则：简洁直观的排序配置</span></a></h2>
<p>排序规则基于 SQL 的 <code v-pre>ORDER BY</code> 语法设计，通过简单的“字段名前缀标识”实现升序/降序控制，支持多字段组合排序，完全适配业务中复杂的排序需求。</p>
<h3 id="_3-1-核心规则" tabindex="-1"><a class="header-anchor" href="#_3-1-核心规则"><span>3.1 核心规则</span></a></h3>
<ul>
<li>升序：直接传入字段名（无前缀），如 &quot;<code v-pre>createTime</code>&quot; 对应 SQL：<code v-pre>ORDER BY createTime ASC</code>。</li>
<li>降序：字段名前加“<code v-pre>-</code>”前缀，如 &quot;<code v-pre>-createTime</code>&quot; 对应 SQL：<code v-pre>ORDER BY createTime DESC</code>。</li>
<li>多字段排序：按数组顺序依次排序（优先级递减），如 <code v-pre>[&quot;-createTime&quot;, &quot;userId&quot;]</code> 对应 SQL：<code v-pre>ORDER BY createTime DESC, userId ASC</code>。</li>
</ul>
<h4 id="_3-2-典型场景示例" tabindex="-1"><a class="header-anchor" href="#_3-2-典型场景示例"><span>3.2 典型场景示例</span></a></h4>
<table>
<thead>
<tr>
<th>业务需求</th>
<th>orderBy 参数值（JSON 字符串）</th>
<th>对应的 SQL 排序片段</th>
</tr>
</thead>
<tbody>
<tr>
<td>按创建时间倒序（最新数据在前）</td>
<td><code v-pre>[&quot;-createTime&quot;]</code></td>
<td><code v-pre>ORDER BY createTime DESC</code></td>
</tr>
<tr>
<td>按订单金额升序（从小到大）</td>
<td><code v-pre>[&quot;amount&quot;]</code></td>
<td><code v-pre>ORDER BY amount ASC</code></td>
</tr>
<tr>
<td>按部门ID升序、同一部门内按入职时间倒序</td>
<td><code v-pre>[&quot;deptId&quot;, &quot;-entryTime&quot;]</code></td>
<td><code v-pre>ORDER BY deptId ASC, entryTime DESC</code></td>
</tr>
</tbody>
</table>
<h2 id="四、过滤规则-灵活强大的条件筛选" tabindex="-1"><a class="header-anchor" href="#四、过滤规则-灵活强大的条件筛选"><span>四、过滤规则：灵活强大的条件筛选</span></a></h2>
<p>过滤规则是列表查询的核心，对应 SQL 中的 <code v-pre>WHERE</code> 条件。GoWind Admin 支持“基础等值筛选”与“高级条件筛选”，高级筛选通过“字段名__操作符”的双下划线分隔语法实现，覆盖模糊搜索、区间查询、正则匹配等全场景需求。</p>
<h3 id="_4-1-基础语法规则" tabindex="-1"><a class="header-anchor" href="#_4-1-基础语法规则"><span>4.1 基础语法规则</span></a></h3>
<ul>
<li><strong>基础等值筛选</strong>：直接使用 <code v-pre>{&quot;字段名&quot;: &quot;值&quot;}</code>，如 <code v-pre>{&quot;status&quot;: 1}</code> 对应 SQL：<code v-pre>WHERE status = 1</code>。</li>
<li><strong>高级条件筛选</strong>：使用 <code v-pre>{&quot;字段名__操作符&quot;: &quot;值&quot;}</code>，如 <code v-pre>{&quot;createTime__gte&quot;: &quot;2024-01-01&quot;}</code> 对应 SQL：<code v-pre>WHERE createTime &gt;= '2024-01-01'</code>。</li>
<li><strong>JSON 字段筛选</strong>：支持嵌套 JSON 字段的筛选，语法为 <code v-pre>{&quot;字段名.嵌套JSON字段名__操作符&quot;: &quot;值&quot;}</code>，如 <code v-pre>{&quot;extInfo.phone__contains&quot;: &quot;138&quot;}</code> 对应 <code v-pre>SQL：WHERE extInfo-&gt;&gt;'$.phone' LIKE '%138%'</code>（PostgreSQL 示例）。</li>
</ul>
<h3 id="_4-2-完整操作符列表-按功能分类" tabindex="-1"><a class="header-anchor" href="#_4-2-完整操作符列表-按功能分类"><span>4.2 完整操作符列表（按功能分类）</span></a></h3>
<h4 id="_4-2-1-基础逻辑与等值操作" tabindex="-1"><a class="header-anchor" href="#_4-2-1-基础逻辑与等值操作"><span>4.2.1 基础逻辑与等值操作</span></a></h4>
<table>
<thead>
<tr>
<th>操作符</th>
<th>功能描述</th>
<th>配置示例</th>
<th>对应 SQL 片段</th>
<th>适用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>（无操作符）</td>
<td>等值匹配</td>
<td><code v-pre>{&quot;userName&quot;: &quot;admin&quot;}</code></td>
<td><code v-pre>WHERE userName = 'admin'</code></td>
<td>精确匹配单个值（如状态、用户名）</td>
</tr>
<tr>
<td>not</td>
<td>非等值匹配</td>
<td><code v-pre>{&quot;userName__not&quot;: &quot;admin&quot;}</code></td>
<td><code v-pre>WHERE userName != 'admin'</code></td>
<td>排除特定值（如排除管理员账号）</td>
</tr>
<tr>
<td>in</td>
<td>多值匹配（满足其一）</td>
<td><code v-pre>{&quot;status__in&quot;: &quot;[1,2]&quot;}</code></td>
<td><code v-pre>WHERE status IN (1,2)</code></td>
<td>匹配多个可选值（如查询状态为“启用”或“审核中”的数据）</td>
</tr>
<tr>
<td>not_in</td>
<td>多值排除（均不满足）</td>
<td><code v-pre>{&quot;status__not_in&quot;: &quot;[0,3]&quot;}</code></td>
<td><code v-pre>WHERE status NOT IN (0,3)</code></td>
<td>排除多个无效值（如排除“禁用”或“已删除”的数据）</td>
</tr>
<tr>
<td>isnull</td>
<td>为空匹配</td>
<td><code v-pre>{&quot;email__isnull&quot;: &quot;True&quot;}</code></td>
<td><code v-pre>WHERE email IS NULL</code></td>
<td>查询未填写某字段的数据（如未绑定邮箱的用户）</td>
</tr>
<tr>
<td>not_isnull</td>
<td>非空匹配</td>
<td><code v-pre>{&quot;email__not_isnull&quot;: &quot;True&quot;}</code></td>
<td><code v-pre>WHERE email IS NOT NULL</code></td>
<td>查询已填写某字段的数据（如已绑定邮箱的用户）</td>
</tr>
</tbody>
</table>
<h4 id="_4-2-2-数值-时间区间操作" tabindex="-1"><a class="header-anchor" href="#_4-2-2-数值-时间区间操作"><span>4.2.2 数值/时间区间操作</span></a></h4>
<table>
<thead>
<tr>
<th>操作符</th>
<th>功能描述</th>
<th>配置示例</th>
<th>对应 SQL 片段</th>
<th>适用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>gte</td>
<td>大于等于</td>
<td><code v-pre>{&quot;age__gte&quot;: &quot;18&quot;}</code></td>
<td><code v-pre>WHERE age &gt;= 18</code></td>
<td>数值下限筛选（如成年用户）、时间起始筛选（如2024年之后的数据）</td>
</tr>
<tr>
<td>gt</td>
<td>大于</td>
<td><code v-pre>{&quot;amount__gt&quot;: &quot;1000&quot;}</code></td>
<td><code v-pre>WHERE amount &gt; 1000</code></td>
<td>数值严格大于筛选（如金额大于1000的订单）</td>
</tr>
<tr>
<td>lte</td>
<td>小于等于</td>
<td><code v-pre>{&quot;age__lte&quot;: &quot;30&quot;}</code></td>
<td><code v-pre>WHERE age &lt;= 30</code></td>
<td>数值上限筛选（如30岁以下用户）、时间截止筛选（如2024年之前的数据）</td>
</tr>
<tr>
<td>lt</td>
<td>小于</td>
<td><code v-pre>{&quot;amount__lt&quot;: &quot;500&quot;}</code></td>
<td><code v-pre>WHERE amount &lt; 500</code></td>
<td>数值严格小于筛选（如小额订单）</td>
</tr>
<tr>
<td>range</td>
<td>区间匹配（包含边界）</td>
<td><code v-pre>{&quot;createTime__range&quot;: &quot;[\&quot;2024-01-01\&quot;,\&quot;2024-06-30\&quot;]&quot;}</code></td>
<td><code v-pre>WHERE createTime BETWEEN '2024-01-01' AND '2024-06-30'</code></td>
<td>时间区间、数值区间筛选（如上半年的订单数据）。<br>需要注意的是: <br>1. 有些数据库的BETWEEN实现的开闭区间可能不一样。<br>2. 日期<code v-pre>2005-01-01</code>会被隐式转换为：<code v-pre>2005-01-01 00:00:00</code>，两个日期一致就会导致查询不到数据。</td>
</tr>
</tbody>
</table>
<h4 id="_4-2-3-字符串模糊匹配操作" tabindex="-1"><a class="header-anchor" href="#_4-2-3-字符串模糊匹配操作"><span>4.2.3 字符串模糊匹配操作</span></a></h4>
<table>
<thead>
<tr>
<th>操作符</th>
<th>功能描述</th>
<th>配置示例</th>
<th>对应 SQL 片段</th>
<th>适用场景</th>
<th>备注</th>
</tr>
</thead>
<tbody>
<tr>
<td>contains</td>
<td>包含匹配（区分大小写）</td>
<td><code v-pre>{&quot;userName__contains&quot;: &quot;Li&quot;}</code></td>
<td><code v-pre>WHERE userName LIKE '%Li%';</code></td>
<td>精准模糊搜索（如区分大小写的用户名搜索）</td>
<td>依赖数据库 LIKE 语法，性能一般，建议结合索引使用</td>
</tr>
<tr>
<td>icontains</td>
<td>包含匹配（不区分大小写）</td>
<td><code v-pre>{&quot;userName__icontains&quot;: &quot;li&quot;}</code></td>
<td><code v-pre>WHERE userName ILIKE '%li%';</code></td>
<td>通用模糊搜索（如用户姓名搜索，不区分大小写）</td>
<td>跨数据库兼容性略差，建议优先使用数据库忽略大小写配置</td>
</tr>
<tr>
<td>startswith</td>
<td>前缀匹配（区分大小写）</td>
<td><code v-pre>{&quot;phone__startswith&quot;: &quot;138&quot;}</code></td>
<td><code v-pre>WHERE phone LIKE '138%';</code></td>
<td>按前缀筛选（如138号段的手机号）</td>
<td>可命中前缀索引，性能优于 contains</td>
</tr>
<tr>
<td>istartswith</td>
<td>前缀匹配（不区分大小写）</td>
<td><code v-pre>{&quot;name__istartswith&quot;: &quot;张&quot;}</code></td>
<td><code v-pre>WHERE name ILIKE '张%';</code></td>
<td>姓名前缀搜索（不区分大小写）</td>
<td>可命中前缀索引，性能优于 contains</td>
</tr>
<tr>
<td>endswith</td>
<td>后缀匹配（区分大小写）</td>
<td><code v-pre>{&quot;email__endswith&quot;: &quot;@qq.com&quot;}</code></td>
<td><code v-pre>WHERE email LIKE '%@qq.com';</code></td>
<td>按后缀筛选（如QQ邮箱用户）</td>
<td>无法命中普通索引，性能较差，数据量大时慎用</td>
</tr>
<tr>
<td>iendswith</td>
<td>后缀匹配（不区分大小写）</td>
<td><code v-pre>{&quot;email__iendswith&quot; : &quot;@QQ.Com&quot;}</code></td>
<td><code v-pre>WHERE name ILIKE '%@QQ.Com';</code></td>
<td></td>
<td></td>
</tr>
<tr>
<td>exact</td>
<td>完全匹配（区分大小写）</td>
<td><code v-pre>{&quot;idCard__exact&quot;: &quot;110101199001011234&quot;}</code></td>
<td><code v-pre>WHERE id_card LIKE '110101199001011234';</code></td>
<td>精确匹配敏感信息（如身份证号）</td>
<td>等同于无操作符的等值匹配，优先级更高</td>
</tr>
<tr>
<td>iexact</td>
<td>完全匹配（不区分大小写）</td>
<td><code v-pre>{&quot;name__iexact&quot; : &quot;a&quot;}</code></td>
<td><code v-pre>WHERE name ILIKE 'a';</code></td>
<td></td>
<td></td>
</tr>
<tr>
<td>search</td>
<td>全文搜索</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<h4 id="_4-2-4-正则匹配操作" tabindex="-1"><a class="header-anchor" href="#_4-2-4-正则匹配操作"><span>4.2.4 正则匹配操作</span></a></h4>
<table>
<thead>
<tr>
<th>操作符</th>
<th>功能描述</th>
<th>配置示例</th>
<th>对应 SQL 片段</th>
<th>适用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>regex</td>
<td>正则匹配（区分大小写）</td>
<td><code v-pre>{&quot;phone__regex&quot;: &quot;^1[3-9]\\d{9}$&quot;}</code></td>
<td>MySQL: <code v-pre>WHERE phone REGEXP BINARY '^1[3-9]\\d{9}$'</code>  <br> Oracle: <code v-pre>WHERE REGEXP_LIKE(title, '^(An?|The) +', 'c');</code>  <br> PostgreSQL: <code v-pre>WHERE phone ~ '^1[3-9]\\d{9}$'</code>  <br> SQLite: <code v-pre>WHERE title REGEXP '^(An?|The) +';</code></td>
<td>复杂格式校验（如手机号、身份证号格式验证）</td>
</tr>
<tr>
<td>iregex</td>
<td>正则匹配（不区分大小写）</td>
<td><code v-pre>{&quot;title__iregex&quot;: &quot;^(通知|公告).*$&quot;}</code></td>
<td>MySQL: <code v-pre>WHERE title REGEXP \'^(通知|公告).\*$'</code>  <br> Oracle: <code v-pre>WHERE REGEXP_LIKE(title, '^(an?|the) +', 'i');</code>  <br> PostgreSQL: <code v-pre>WHERE title ~* '^(通知|公告).*$'</code>  <br> SQLite: <code v-pre>WHERE title REGEXP '(?i)^(an?|the) +';</code></td>
<td>不区分大小写的复杂文本匹配（如标题分类）</td>
</tr>
</tbody>
</table>
<h4 id="_4-2-5-日期时间提取操作" tabindex="-1"><a class="header-anchor" href="#_4-2-5-日期时间提取操作"><span>4.2.5 日期时间提取操作</span></a></h4>
<p>支持从日期时间字段中提取年、月、日、小时等维度进行筛选，适配按时间维度统计的业务场景：</p>
<table>
<thead>
<tr>
<th>操作符</th>
<th>功能描述</th>
<th>配置示例</th>
<th>对应 SQL 片段</th>
<th>适用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>date</td>
<td>提取日期（忽略时间）</td>
<td><code v-pre>{&quot;createTime__date&quot;: &quot;2024-05-20&quot;}</code></td>
<td><code v-pre>WHERE DATE(createTime) = '2024-05-20'</code></td>
<td>查询某一天的数据（如5月20日的订单）</td>
</tr>
<tr>
<td>year</td>
<td>提取年份</td>
<td><code v-pre>{&quot;createTime__year&quot;: &quot;2024&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT(YEAR FROM createTime) = 2024</code></td>
<td>按年份统计（如2024年的所有数据）</td>
</tr>
<tr>
<td>iso_year</td>
<td>ISO 8601 一年中的周数</td>
<td><code v-pre>{&quot;pub_date__iso_year&quot; : &quot;2023&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT('ISOYEAR' FROM pub_date) = '2023'</code></td>
<td></td>
</tr>
<tr>
<td>month</td>
<td>提取月份(1-12)</td>
<td><code v-pre>{&quot;createTime__month&quot;: &quot;5&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT(MONTH FROM createTime) = 5</code></td>
<td>按月份统计（如5月份的订单）</td>
</tr>
<tr>
<td>day</td>
<td>提取日期（当月第几天）</td>
<td><code v-pre>{&quot;createTime__day&quot;: &quot;20&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT(DAY FROM createTime) = 20</code></td>
<td>按每月固定日期筛选（如每月20日的报销单）</td>
</tr>
<tr>
<td>week</td>
<td>ISO 8601 周编号 一年中的周数</td>
<td><code v-pre>{&quot;pub_date__week&quot; : &quot;7&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT('WEEK' FROM pub_date) = '7'</code></td>
<td></td>
</tr>
<tr>
<td>week_day</td>
<td>星期几</td>
<td><code v-pre>{&quot;pub_date__week_day&quot; : &quot;tom&quot;}</code></td>
<td>``</td>
<td></td>
</tr>
<tr>
<td>iso_week_day</td>
<td></td>
<td><code v-pre>{&quot;pub_date__iso_week_day&quot; : &quot;tom&quot;}</code></td>
<td>``</td>
<td></td>
</tr>
<tr>
<td>quarter</td>
<td>提取季度（1-4）</td>
<td><code v-pre>{&quot;createTime__quarter&quot;: &quot;2&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT(QUARTER FROM createTime) = 2</code></td>
<td>按季度统计（如2季度的业绩数据）</td>
</tr>
<tr>
<td>time</td>
<td></td>
<td><code v-pre>{&quot;pub_date__time&quot; : &quot;12:59:59&quot;}</code></td>
<td>``</td>
<td></td>
</tr>
<tr>
<td>hour</td>
<td>提取小时(0-23)</td>
<td><code v-pre>{&quot;createTime__hour&quot;: &quot;18&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT(HOUR FROM createTime) = 18</code></td>
<td>按小时筛选（如傍晚6点的操作记录）</td>
</tr>
<tr>
<td>minute</td>
<td>提取分钟(0-59)</td>
<td><code v-pre>{&quot;pub_date__minute&quot; : &quot;59&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT('MINUTE' FROM pub_date) = '59'</code></td>
<td></td>
</tr>
<tr>
<td>second</td>
<td>提取秒(0-59)</td>
<td><code v-pre>{&quot;pub_date__second&quot; : &quot;59&quot;}</code></td>
<td><code v-pre>WHERE EXTRACT('SECOND' FROM pub_date) = '59'</code></td>
<td></td>
</tr>
</tbody>
</table>
<h3 id="_4-3-过滤规则避坑指南" tabindex="-1"><a class="header-anchor" href="#_4-3-过滤规则避坑指南"><span>4.3 过滤规则避坑指南</span></a></h3>
<ol>
<li>日期区间查询注意事项：日期字符串（如“2024-01-01”）会被隐式转换为“2024-01-01 00:00:00”，若需查询当天全量数据，建议使用 <code v-pre>createTime__range: [&quot;2024-01-01&quot;, &quot;2024-01-01 23:59:59&quot;]</code>，避免遗漏当天后半段数据。</li>
<li>模糊匹配性能优化：<code v-pre>contains</code>、<code v-pre>endswith</code> 等操作无法命中普通索引，数据量大时建议使用全文检索（如 Elasticsearch）替代，或为字段建立专用模糊索引。</li>
<li>跨数据库兼容性：<code v-pre>icontains</code>、<code v-pre>istartswith</code> 等不区分大小写的操作，在 MySQL 中需开启 <code v-pre>lower_case_table_names</code> 配置，否则可能出现大小写区分的情况。</li>
<li>正则匹配慎用：正则匹配（<code v-pre>regex</code>、<code v-pre>iregex</code>）性能较差，且跨数据库语法差异大，非必要不使用；若需使用，建议简化正则表达式。</li>
</ol>
<h2 id="五、典型业务场景实操示例" tabindex="-1"><a class="header-anchor" href="#五、典型业务场景实操示例"><span>五、典型业务场景实操示例</span></a></h2>
<p>结合前文规则，以下是3个高频业务场景的完整查询配置示例，覆盖多条件筛选、排序分页、字段筛选等核心能力，可直接参考落地：</p>
<h3 id="_5-1-场景1-多条件筛选用户列表-分页-排序" tabindex="-1"><a class="header-anchor" href="#_5-1-场景1-多条件筛选用户列表-分页-排序"><span>5.1 场景1：多条件筛选用户列表（分页+排序）</span></a></h3>
<p>业务需求：查询“部门ID=1”且“入职时间在2024年1月1日之后”且“用户名包含‘张’”的用户，按入职时间倒序排序，每页20条，查询第2页，仅返回ID、用户名、入职时间字段。</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token comment">// 请求参数（已URL编码前）</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"page"</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"pageSize"</span><span class="token operator">:</span> <span class="token number">20</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"query"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"deptId"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"entryTime__gte"</span><span class="token operator">:</span> <span class="token string">"2024-01-01"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"userName__icontains"</span><span class="token operator">:</span> <span class="token string">"张"</span><span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"orderBy"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"-entryTime"</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"fieldMask"</span><span class="token operator">:</span> <span class="token string">"id,userName,entryTime"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对应 SQL 核心片段：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">SELECT</span> id<span class="token punctuation">,</span> userName<span class="token punctuation">,</span> entryTime </span>
<span class="line"><span class="token keyword">FROM</span> <span class="token keyword">user</span> </span>
<span class="line"><span class="token keyword">WHERE</span> deptId <span class="token operator">=</span> <span class="token number">1</span> </span>
<span class="line">  <span class="token operator">AND</span> entryTime <span class="token operator">>=</span> <span class="token string">'2024-01-01'</span> </span>
<span class="line">  <span class="token operator">AND</span> userName <span class="token operator">ILIKE</span> <span class="token string">'%张%'</span> </span>
<span class="line"><span class="token keyword">ORDER</span> <span class="token keyword">BY</span> entryTime <span class="token keyword">DESC</span> </span>
<span class="line"><span class="token keyword">LIMIT</span> <span class="token number">20</span> <span class="token keyword">OFFSET</span> <span class="token number">20</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-场景2-订单列表or条件筛选-不分页" tabindex="-1"><a class="header-anchor" href="#_5-2-场景2-订单列表or条件筛选-不分页"><span>5.2 场景2：订单列表OR条件筛选（不分页）</span></a></h3>
<p>业务需求：查询“订单状态=待支付”或“订单金额&gt;10000”的全量订单，按订单金额降序排序。</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token comment">// 请求参数（已URL编码前）</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"noPaging"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"or"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"status"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">// 1=待支付</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"amount__gt"</span><span class="token operator">:</span> <span class="token number">10000</span><span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"orderBy"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"-amount"</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-场景3-按日期维度筛选报表数据" tabindex="-1"><a class="header-anchor" href="#_5-3-场景3-按日期维度筛选报表数据"><span>5.3 场景3：按日期维度筛选报表数据</span></a></h3>
<p>业务需求：查询“2024年2季度”且“每周一创建”的销售报表数据。</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token comment">// 请求参数（已URL编码前）</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"query"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"createTime__year"</span><span class="token operator">:</span> <span class="token string">"2024"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"createTime__quarter"</span><span class="token operator">:</span> <span class="token string">"2"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span><span class="token property">"createTime__week_day"</span><span class="token operator">:</span> <span class="token string">"1"</span><span class="token punctuation">}</span> <span class="token comment">// 1=周一（不同数据库可能有差异，需适配）</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、扩展说明-自定义查询逻辑" tabindex="-1"><a class="header-anchor" href="#六、扩展说明-自定义查询逻辑"><span>六、扩展说明：自定义查询逻辑</span></a></h2>
<p>GoWind Admin 列表查询规则支持自定义扩展，以适配复杂业务场景（如多表关联查询、自定义函数计算等）：</p>
<ul>
<li><strong>原生 SQL 扩展</strong>：通过 <code v-pre>customSql</code> 参数传入自定义 SQL 片段（需后端开启白名单配置），如：<code v-pre>customSql=&quot;AND (userName LIKE '%张%' OR realName LIKE '%张%')</code>&quot;。</li>
<li><strong>自定义查询函数</strong>：后端可注册自定义查询处理器，支持复杂逻辑计算（如按地理位置筛选、按权限数据过滤等），前端通过约定的操作符调用。</li>
<li><strong>多表关联查询</strong>：通过后端配置关联表映射关系，前端可直接按“关联表字段名__操作符”的格式筛选关联数据（如 <code v-pre>{&quot;dept.name__contains&quot;: &quot;技术部&quot;}</code> 查询所属技术部的用户）。</li>
</ul>
<h2 id="七、项目源码与参考资料" tabindex="-1"><a class="header-anchor" href="#七、项目源码与参考资料"><span>七、项目源码与参考资料</span></a></h2>
<h3 id="_7-1-项目源码" tabindex="-1"><a class="header-anchor" href="#_7-1-项目源码"><span>7.1 项目源码</span></a></h3>
<ul>
<li>Gitee（国内访问速度快）：<a href="https://gitee.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">https://gitee.com/tx7do/go-wind-admin</a></li>
<li>GitHub：<a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/go-wind-admin</a></li>
</ul>
<h3 id="_7-2-参考资料" tabindex="-1"><a class="header-anchor" href="#_7-2-参考资料"><span>7.2 参考资料</span></a></h3>
<ul>
<li>Django ORM 过滤规则：<a href="https://docs.djangoproject.com/en/4.2/ref/models/querysets/#field-lookups" target="_blank" rel="noopener noreferrer">https://docs.djangoproject.com/en/4.2/ref/models/querysets/#field-lookups</a></li>
<li>Tortoise ORM 过滤规则：<a href="https://tortoise.github.io/query.html#filtering" target="_blank" rel="noopener noreferrer">https://tortoise.github.io/query.html#filtering</a></li>
<li>GoWind Admin 后端查询扩展文档：<a href="http://localhost:7788/docs/openapi.yaml" target="_blank" rel="noopener noreferrer">http://localhost:7788/docs/openapi.yaml</a>（本地部署后访问）</li>
</ul>
</div></template>


