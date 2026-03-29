import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_upload_file.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_upload_file.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何上传文件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"向MinIO预签名URL上传文件\",\"slug\":\"向minio预签名url上传文件\",\"link\":\"#向minio预签名url上传文件\",\"children\":[]},{\"level\":2,\"title\":\"直接向Kratos的服务上传文件\",\"slug\":\"直接向kratos的服务上传文件\",\"link\":\"#直接向kratos的服务上传文件\",\"children\":[]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_upload_file.md\",\"excerpt\":\"\\n<p>在一个CMS和Admin系统里面，文件上传是一个极其重要的功能之一。</p>\\n<p>在Kraots-Admin里面，我们把所有的文件都落地到MinIO。MinIO是一个非常优秀的分布式文件管理系统。</p>\\n<p>通常，后端可用的有两种上传方式：</p>\\n<ol>\\n<li>通过Kratos的服务向MinIO申请预签名URL，然后通过预签名URL向MinIO上传文件。</li>\\n<li>直接向Kratos的服务上传文件，然后，微服务再将文件落地到MinIO。</li>\\n</ol>\\n<p>方式一，这是最优的解决方案，因为文件不会经过微服务，直接上传到MinIO，减轻了微服务的压力。并且，MinIO支持分布式部署，可以很好的扩展。</p>\"}")
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
