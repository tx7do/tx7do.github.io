import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/create_container_images_with_bazel.html.vue"
const data = JSON.parse("{\"path\":\"/posts/create_container_images_with_bazel.html\",\"title\":\"使用 Bazel 创建Go应用程序的Docker容器镜像\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Bazel\",\"Docker\",\"Go\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"示例项目\",\"slug\":\"示例项目\",\"link\":\"#示例项目\",\"children\":[{\"level\":3,\"title\":\"POST /hash\",\"slug\":\"post-hash\",\"link\":\"#post-hash\",\"children\":[]},{\"level\":3,\"title\":\"POST /compare\",\"slug\":\"post-compare\",\"link\":\"#post-compare\",\"children\":[]}]},{\"level\":2,\"title\":\"新建一个 bazel 项目\",\"slug\":\"新建一个-bazel-项目\",\"link\":\"#新建一个-bazel-项目\",\"children\":[]},{\"level\":2,\"title\":\"添加一个 hello world 示例代码\",\"slug\":\"添加一个-hello-world-示例代码\",\"link\":\"#添加一个-hello-world-示例代码\",\"children\":[]},{\"level\":2,\"title\":\"添加Docker支持\",\"slug\":\"添加docker支持\",\"link\":\"#添加docker支持\",\"children\":[]},{\"level\":2,\"title\":\"构建Docker镜像\",\"slug\":\"构建docker镜像\",\"link\":\"#构建docker镜像\",\"children\":[]},{\"level\":2,\"title\":\"发布镜像到 DockerHub\",\"slug\":\"发布镜像到-dockerhub\",\"link\":\"#发布镜像到-dockerhub\",\"children\":[]},{\"level\":2,\"title\":\"结论\",\"slug\":\"结论\",\"link\":\"#结论\",\"children\":[]},{\"level\":2,\"title\":\"原文\",\"slug\":\"原文\",\"link\":\"#原文\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/create_container_images_with_bazel.md\",\"excerpt\":\"\\n<p>如果你知道<a href=\\\"https://bazel.build/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Bazel</a>，你就会知道它有多棒：它快速可靠。当您在使用多种服务的项目中工作时，甚至可能使用不同的语言，拥有一个快速可靠的构建系统，更重要的是，生成<a href=\\\"https://bazel.build/faq.html#why-would-i-want-to-use-bazel\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">确定性构建</a>是关键。</p>\\n<p>但是，您可能不知道使用它<code>bazel</code>来构建容器镜像是多么容易。您将从使用<code>bazel</code>应用到您的镜像构建过程中获得所有好处。另外，您不必处理丑陋的<code>Dockerfiles</code>。</p>\"}")
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
