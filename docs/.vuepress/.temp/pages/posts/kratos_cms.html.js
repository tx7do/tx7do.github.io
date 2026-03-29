import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_cms.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_cms.html\",\"title\":\"跟我一起用Golang微服务框架实现一个CMS系统\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是 CMS？\",\"slug\":\"什么是-cms\",\"link\":\"#什么是-cms\",\"children\":[]},{\"level\":2,\"title\":\"CMS/WCM 解决方案的主要功能\",\"slug\":\"cms-wcm-解决方案的主要功能\",\"link\":\"#cms-wcm-解决方案的主要功能\",\"children\":[]},{\"level\":2,\"title\":\"项目结构\",\"slug\":\"项目结构\",\"link\":\"#项目结构\",\"children\":[]},{\"level\":2,\"title\":\"后端架构\",\"slug\":\"后端架构\",\"link\":\"#后端架构\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_cms.md\",\"excerpt\":\"\\n<p>微服务，是一种分布式软件架构。采用了分而治之的方法去解决复杂的应用问题。我们可以把复杂的系统拆解成不同的服务，并使之可以方便的进行横向扩容，提升整个系统的负载。</p>\\n<p>任何一个系统，它都需要一个管理系统，即便是使用微服务的架构也是需要的。在本文里，我们将使用<a href=\\\"https://www.bilibili.com/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">B站</a>开源的<a href=\\\"https://go.dev/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Golang</a>语言微服务框架<a href=\\\"https://go-kratos.dev/en/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Kratos</a>去实现一个最简单的CMS：博客系统。</p>\"}")
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
