import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_clickhouse.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_clickhouse.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：ClickHouse集成指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"ClickHouse 的核心概念\",\"slug\":\"clickhouse-的核心概念\",\"link\":\"#clickhouse-的核心概念\",\"children\":[]},{\"level\":2,\"title\":\"ClickHouse 与其他数据库的差异\",\"slug\":\"clickhouse-与其他数据库的差异\",\"link\":\"#clickhouse-与其他数据库的差异\",\"children\":[]},{\"level\":2,\"title\":\"Docker部署\",\"slug\":\"docker部署\",\"link\":\"#docker部署\",\"children\":[]},{\"level\":2,\"title\":\"在 Go Wind Admin 中使用 ClickHouse\",\"slug\":\"在-go-wind-admin-中使用-clickhouse\",\"link\":\"#在-go-wind-admin-中使用-clickhouse\",\"children\":[]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_clickhouse.md\",\"excerpt\":\"\\n<p>ClickHouse 是一款由俄罗斯搜索引擎公司 <strong>Yandex</strong> 开发的开源列式存储数据库，专为<strong>海量数据实时分析</strong>设计。它以<strong>极致的查询性能</strong>和<strong>高吞吐写入能力</strong>著称，尤其擅长处理PB 级别的结构化数据，并能在毫秒到秒级内完成复杂的聚合分析（如多维度统计、漏斗计算、用户行为分析等），是大数据分析、数据仓库、实时报表等场景的核心工具。</p>\\n<h2>ClickHouse 的核心概念</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>概念</th>\\n<th>说明</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>表（Table）</td>\\n<td>类似关系型数据库的表，存储结构化数据，但底层按列存储。</td>\\n</tr>\\n<tr>\\n<td>引擎（Engine）</td>\\n<td>决定表的存储方式、查询特性和分布式行为，是 ClickHouse 的核心设计。例如：<br>- <code>MergeTree</code> 系列：最常用，支持索引、分区、副本，适合海量数据存储；<br>- <code>Log</code> 系列：轻量无索引，适合临时小表；<br>- <code>Distributed</code>：分布式表，用于管理集群分片。</td>\\n</tr>\\n<tr>\\n<td>分区（Partition）</td>\\n<td>按规则（如时间、地区）将表数据拆分，查询时可快速过滤分区，减少扫描范围（如按 “日期” 分区，查询 “2023 年 10 月数据” 仅需扫描对应分区）。</td>\\n</tr>\\n<tr>\\n<td>主键（Primary Key）</td>\\n<td>用于排序和快速查找，不同于关系型数据库的唯一约束，ClickHouse 主键允许重复，主要作用是优化查询性能。</td>\\n</tr>\\n<tr>\\n<td>跳数索引（Skip Index）</td>\\n<td>辅助索引，用于快速判断某一范围内是否存在符合条件的数据（如 “数值是否在 100-200 之间”），进一步减少扫描量。</td>\\n</tr>\\n<tr>\\n<td>分片（Shard）</td>\\n<td>集群中数据的物理拆分单位，每个分片存储表的一部分数据，分布在不同节点，实现并行处理。</td>\\n</tr>\\n<tr>\\n<td>副本（Replica）</td>\\n<td>同一分片的冗余备份，用于故障恢复和负载均衡（查询可分散到不同副本），保证数据不丢失。</td>\\n</tr>\\n</tbody>\\n</table>\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
