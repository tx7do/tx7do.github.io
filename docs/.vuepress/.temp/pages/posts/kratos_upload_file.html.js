import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_upload_file.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_upload_file.html\",\"title\":\"GO微服务框架Kratos上传文件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"向MinIO预签名URL上传文件\",\"slug\":\"向minio预签名url上传文件\",\"link\":\"#向minio预签名url上传文件\",\"children\":[]},{\"level\":2,\"title\":\"直接向Kratos的服务上传文件\",\"slug\":\"直接向kratos的服务上传文件\",\"link\":\"#直接向kratos的服务上传文件\",\"children\":[]},{\"level\":2,\"title\":\"实例代码\",\"slug\":\"实例代码\",\"link\":\"#实例代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_upload_file.md\",\"excerpt\":\"\\n<p>首先，我们需要知道：Kratos能够上传文件。</p>\\n<p>其次，我们需要知道：需要一些手工代码来支撑（不能够代码生成一波流）。</p>\\n<p>最后，我们所有的文件都落地到MinIO当中。对于使用过各种上传方案的我而言，MinIO是一个非常完美的文件解决方案。</p>\\n<p>在这里，我们不讨论前端的上传，我们只讨论后端的上传。我另外有一篇偏向于前端的文章，有兴趣的同学可以阅读它：<a href=\\\"https://juejin.cn/post/7153078635551784990\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">JavaScript/TypeScript前端实现文件上传到MinIO</a>。</p>\"}")
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
