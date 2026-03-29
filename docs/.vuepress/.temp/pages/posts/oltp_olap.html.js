import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/oltp_olap.html.vue"
const data = JSON.parse("{\"path\":\"/posts/oltp_olap.html\",\"title\":\"OLTP 和 OLAP\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"OLTP\",\"OLAP\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"OLTP\",\"slug\":\"oltp\",\"link\":\"#oltp\",\"children\":[{\"level\":3,\"title\":\"什么是OLTP？\",\"slug\":\"什么是oltp\",\"link\":\"#什么是oltp\",\"children\":[]},{\"level\":3,\"title\":\"什么是ACID\",\"slug\":\"什么是acid\",\"link\":\"#什么是acid\",\"children\":[]},{\"level\":3,\"title\":\"OLTP 使用的场景\",\"slug\":\"oltp-使用的场景\",\"link\":\"#oltp-使用的场景\",\"children\":[]}]},{\"level\":2,\"title\":\"OLAP\",\"slug\":\"olap\",\"link\":\"#olap\",\"children\":[{\"level\":3,\"title\":\"什么是OLAP？\",\"slug\":\"什么是olap\",\"link\":\"#什么是olap\",\"children\":[]},{\"level\":3,\"title\":\"OLAP 使用场景\",\"slug\":\"olap-使用场景\",\"link\":\"#olap-使用场景\",\"children\":[]}]},{\"level\":2,\"title\":\"什么是 ETL？\",\"slug\":\"什么是-etl\",\"link\":\"#什么是-etl\",\"children\":[]},{\"level\":2,\"title\":\"数据仓库(Data Warehouse)与数据库\",\"slug\":\"数据仓库-data-warehouse-与数据库\",\"link\":\"#数据仓库-data-warehouse-与数据库\",\"children\":[]},{\"level\":2,\"title\":\"数据仓库与数据湖(Data Lake)\",\"slug\":\"数据仓库与数据湖-data-lake\",\"link\":\"#数据仓库与数据湖-data-lake\",\"children\":[]},{\"level\":2,\"title\":\"数据仓库与数据集市(Data Mart)\",\"slug\":\"数据仓库与数据集市-data-mart\",\"link\":\"#数据仓库与数据集市-data-mart\",\"children\":[]},{\"level\":2,\"title\":\"商业智能工具（BI工具）\",\"slug\":\"商业智能工具-bi工具\",\"link\":\"#商业智能工具-bi工具\",\"children\":[]},{\"level\":2,\"title\":\"OLTP 与 OLAP 比较\",\"slug\":\"oltp-与-olap-比较\",\"link\":\"#oltp-与-olap-比较\",\"children\":[]},{\"level\":2,\"title\":\"总结\",\"slug\":\"总结\",\"link\":\"#总结\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/oltp_olap.md\",\"excerpt\":\"\\n<p>OLTP 和 OLAP：这两个术语看起来相似，但指的是不同类型的系统。在线事务处理 (OLTP) 实时捕获、存储和处理来自事务的数据。在线分析处理 (OLAP) 使用复杂的查询来分析来自 OLTP 系统的汇总历史数据。</p>\\n<h2>OLTP</h2>\\n<h3>什么是OLTP？</h3>\\n<p>OLTP 是指Online Transactional Processing 的简称，这个词中 Transactional 是非常重要的，代表的是说他的处理通常包含了读以及写，通常OLTP 是指系统能够处理大量的更新以及新增的查询。所以在传统的OLTP 系统中，数据的正确性以及一致性是首要要达到的目标之一。所以一般的OLTP 中会常常听到ACID (Atomatic, Consistent, Isolated, Durable) 合规。这代表他们遵循着一个事务(Transaction) 完成后才会执行下一笔，确保整个系统的数据一致性。</p>\"}")
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
