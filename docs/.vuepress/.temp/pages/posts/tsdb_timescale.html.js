import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/tsdb_timescale.html.vue"
const data = JSON.parse("{\"path\":\"/posts/tsdb_timescale.html\",\"title\":\"时序数据库应用 -TimeScaleDB\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"时序数据库\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"数据库简介\",\"slug\":\"数据库简介\",\"link\":\"#数据库简介\",\"children\":[{\"level\":3,\"title\":\"易于使用\",\"slug\":\"易于使用\",\"link\":\"#易于使用\",\"children\":[]},{\"level\":3,\"title\":\"可扩展\",\"slug\":\"可扩展\",\"link\":\"#可扩展\",\"children\":[]},{\"level\":3,\"title\":\"相关网站\",\"slug\":\"相关网站\",\"link\":\"#相关网站\",\"children\":[]}]},{\"level\":2,\"title\":\"搭建本地Docker数据库\",\"slug\":\"搭建本地docker数据库\",\"link\":\"#搭建本地docker数据库\",\"children\":[{\"level\":3,\"title\":\"拉取镜像\",\"slug\":\"拉取镜像\",\"link\":\"#拉取镜像\",\"children\":[]},{\"level\":3,\"title\":\"运行容器\",\"slug\":\"运行容器\",\"link\":\"#运行容器\",\"children\":[]}]},{\"level\":2,\"title\":\"数据结构定义\",\"slug\":\"数据结构定义\",\"link\":\"#数据结构定义\",\"children\":[]},{\"level\":2,\"title\":\"数据库操作SQL\",\"slug\":\"数据库操作sql\",\"link\":\"#数据库操作sql\",\"children\":[]},{\"level\":2,\"title\":\"golang客户端安装\",\"slug\":\"golang客户端安装\",\"link\":\"#golang客户端安装\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/tsdb_timescale.md\",\"excerpt\":\"\\n<hr>\\n<h2>数据库简介</h2>\\n<img src=\\\"https://www.timescale.com/images/icon.png\\\" width=\\\"120px\\\">\\n<p>TimescaleDB是基于PostgreSQL的时序数据库插件，完全继承了PostgreSQL的功能，TimescaleDB是一个开放源代码的时间序列数据库，针对快速提取和复杂查询进行了优化。它使用“完整的SQL”，并且与传统的关系数据库一样易于使用，但是扩展的方式以前只适用于NoSQL数据库。与这两种方案(关系型和NoSQL)所要求的权衡相比，TimescaleDB为时间序列数据提供了两种方案的最佳选择:</p>\"}")
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
