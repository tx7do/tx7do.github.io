import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/postgresql_cross_table_query.html.vue"
const data = JSON.parse("{\"path\":\"/posts/postgresql_cross_table_query.html\",\"title\":\"PostgreSQL查询交叉表\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"PostgreSQL\",\"交叉表\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是交叉表？\",\"slug\":\"什么是交叉表\",\"link\":\"#什么是交叉表\",\"children\":[{\"level\":3,\"title\":\"概念\",\"slug\":\"概念\",\"link\":\"#概念\",\"children\":[]},{\"level\":3,\"title\":\"举例\",\"slug\":\"举例\",\"link\":\"#举例\",\"children\":[]},{\"level\":3,\"title\":\"交叉报表\",\"slug\":\"交叉报表\",\"link\":\"#交叉报表\",\"children\":[]}]},{\"level\":2,\"title\":\"转换查询交叉表\",\"slug\":\"转换查询交叉表\",\"link\":\"#转换查询交叉表\",\"children\":[{\"level\":3,\"title\":\"创建测试表\",\"slug\":\"创建测试表\",\"link\":\"#创建测试表\",\"children\":[]},{\"level\":3,\"title\":\"插入测试数据\",\"slug\":\"插入测试数据\",\"link\":\"#插入测试数据\",\"children\":[]},{\"level\":3,\"title\":\"1. 标准聚合函数查询\",\"slug\":\"_1-标准聚合函数查询\",\"link\":\"#_1-标准聚合函数查询\",\"children\":[]},{\"level\":3,\"title\":\"2. PostgreSQL聚合函数查询\",\"slug\":\"_2-postgresql聚合函数查询\",\"link\":\"#_2-postgresql聚合函数查询\",\"children\":[]},{\"level\":3,\"title\":\"3. crosstab交叉函数查询\",\"slug\":\"_3-crosstab交叉函数查询\",\"link\":\"#_3-crosstab交叉函数查询\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/postgresql_cross_table_query.md\",\"excerpt\":\"\\n<h2>什么是交叉表？</h2>\\n<p><strong>交叉表（Cross Tabulations）</strong> 是一种常用的分类汇总表格。利用交叉表查询数据非常直观明了，被广泛应用。交叉表查询也是数据库的一个特点。</p>\\n<h3>概念</h3>\\n<p>在统计学中，交叉表是矩阵格式的一种表格，显示变量的（多变量）频率分布。交叉表被广泛用于调查研究，商业智能，工程和科学研究。它们提供了两个变量之间的相互关系的基本画面，可以帮助他们发现它们之间的相互作用。卡尔·皮尔逊（Karl Pearson）首先在“关于应变的理论及其关联理论与正常相关性”中使用了交叉表。</p>\\n<p>多元统计学的一个关键问题是找到高维应变表中包含的变量的（直接）依赖结构。如果某些有条件的独立性被揭示，那么甚至可以以更智能的方式来完成数据的存储。为了做到这一点，可以使用信息理论概念，它只能从概率分布中获得信息，这可以通过相对频率从交叉表中容易地表示。</p>\"}")
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
