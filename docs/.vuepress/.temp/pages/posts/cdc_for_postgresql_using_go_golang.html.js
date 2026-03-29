import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cdc_for_postgresql_using_go_golang.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cdc_for_postgresql_using_go_golang.html\",\"title\":\"使用 Go (Golang) 为 postgresql 实施 更改数据捕获 (CDC)\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"go\",\"CDC\",\"PostgreSQL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Change Data Capture介绍\",\"slug\":\"change-data-capture介绍\",\"link\":\"#change-data-capture介绍\",\"children\":[]},{\"level\":2,\"title\":\"PostgreSQL的docker-compose配置\",\"slug\":\"postgresql的docker-compose配置\",\"link\":\"#postgresql的docker-compose配置\",\"children\":[]},{\"level\":2,\"title\":\"简单的go程序用于监听改变\",\"slug\":\"简单的go程序用于监听改变\",\"link\":\"#简单的go程序用于监听改变\",\"children\":[]},{\"level\":2,\"title\":\"翻译源\",\"slug\":\"翻译源\",\"link\":\"#翻译源\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cdc_for_postgresql_using_go_golang.md\",\"excerpt\":\"\\n<h2>Change Data Capture介绍</h2>\\n<p>变更数据捕获 (CDC) 是一种用于跟踪对数据库中的数据所做的更改的技术，使您能够跟踪数据的演变。在 PostgreSQL 中，CDC 是使用逻辑复制（Logical Replication）功能实现的，它可以选择性地复制对特定表或列所做的更改。</p>\\n<p>Golang 是一种编程语言，近年来因其速度和简单性而受到欢迎。它也非常适合处理数据库，因为它内置了对 SQL 数据库的支持以及许多用于处理这些数据库的强大库。</p>\\n<p>在 PostgreSQL 中使用 Golang 和 CDC 是一个强大的组合，因为它允许您轻松地实时捕获和处理对数据库所做的更改。以下是开始在 PostgreSQL 中使用 Golang 和 CDC 需要遵循的基本步骤：</p>\"}")
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
