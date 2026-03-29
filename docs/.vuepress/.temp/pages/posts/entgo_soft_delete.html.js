import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/entgo_soft_delete.html.vue"
const data = JSON.parse("{\"path\":\"/posts/entgo_soft_delete.html\",\"title\":\"Entgo 实现 软删除（Soft Delete）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Go\",\"Ent\",\"SQL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是软删除？\",\"slug\":\"什么是软删除\",\"link\":\"#什么是软删除\",\"children\":[]},{\"level\":2,\"title\":\"如何实现软删除？\",\"slug\":\"如何实现软删除\",\"link\":\"#如何实现软删除\",\"children\":[{\"level\":3,\"title\":\"1. 布尔类型字段标识\",\"slug\":\"_1-布尔类型字段标识\",\"link\":\"#_1-布尔类型字段标识\",\"children\":[]},{\"level\":3,\"title\":\"2. 时间戳字段标识\",\"slug\":\"_2-时间戳字段标识\",\"link\":\"#_2-时间戳字段标识\",\"children\":[]},{\"level\":3,\"title\":\"3. 将软删除的数据插入到另一个表中\",\"slug\":\"_3-将软删除的数据插入到另一个表中\",\"link\":\"#_3-将软删除的数据插入到另一个表中\",\"children\":[]},{\"level\":3,\"title\":\"4. 布尔类型字段、时间戳字段混合标识\",\"slug\":\"_4-布尔类型字段、时间戳字段混合标识\",\"link\":\"#_4-布尔类型字段、时间戳字段混合标识\",\"children\":[]}]},{\"level\":2,\"title\":\"软删除使用场景\",\"slug\":\"软删除使用场景\",\"link\":\"#软删除使用场景\",\"children\":[]},{\"level\":2,\"title\":\"Entgo中实现软删除（Soft Deletes）\",\"slug\":\"entgo中实现软删除-soft-deletes\",\"link\":\"#entgo中实现软删除-soft-deletes\",\"children\":[{\"level\":3,\"title\":\"创建创建删除标识字段\",\"slug\":\"创建创建删除标识字段\",\"link\":\"#创建创建删除标识字段\",\"children\":[]},{\"level\":3,\"title\":\"执行查询\",\"slug\":\"执行查询\",\"link\":\"#执行查询\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/entgo_soft_delete.md\",\"excerpt\":\"\\n<p>我们在开发程序的过程中，会遇到一个常见的需求——删除表中的数据。</p>\\n<p>但是有时候，业务需求要求不能永久删除数据库中的数据。比如一些敏感信息，我们需要留着以方便做历史追踪。\\n这个时候，我们便会用到软删除。</p>\\n<p>Entgo本身是不直接支持的，但是，要实现也并不是很难的事情。</p>\\n<h2>什么是软删除？</h2>\\n<p><strong>软删除（Soft Delete）</strong> 是相对于 <strong>硬删除（Hard Delete）</strong> 来说的，它又可以叫做 <strong>逻辑删除</strong> 或者 <strong>标记删除</strong>。</p>\"}")
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
