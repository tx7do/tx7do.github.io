import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/golang_with_bazel.html.vue"
const data = JSON.parse("{\"path\":\"/posts/golang_with_bazel.html\",\"title\":\"使用Bazel构建Golang程序\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Bazel\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"从头开始一个 Golang 项目\",\"slug\":\"从头开始一个-golang-项目\",\"link\":\"#从头开始一个-golang-项目\",\"children\":[]},{\"level\":2,\"title\":\"将现有项目转换为 Bazel 构建\",\"slug\":\"将现有项目转换为-bazel-构建\",\"link\":\"#将现有项目转换为-bazel-构建\",\"children\":[]},{\"level\":2,\"title\":\"密封测试（Hermetic tests）\",\"slug\":\"密封测试-hermetic-tests\",\"link\":\"#密封测试-hermetic-tests\",\"children\":[]},{\"level\":2,\"title\":\"感谢您阅读\",\"slug\":\"感谢您阅读\",\"link\":\"#感谢您阅读\",\"children\":[]},{\"level\":2,\"title\":\"原文\",\"slug\":\"原文\",\"link\":\"#原文\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/golang_with_bazel.md\",\"excerpt\":\"\\n<p>在这篇简短的文章中，我们将介绍如何将 Golang 与 Bazel 构建系统结合使用。</p>\\n<p>具体来说，我们将讨论三个场景：</p>\\n<ol>\\n<li>从头开始一个 Golang 项目；</li>\\n<li>将一个现有的 Golang 项目转换为 Bazel 构建；</li>\\n<li>以及将一个第三方 Golang 项目引入到您的 Bazel 构建系统。</li>\\n</ol>\\n<h2>从头开始一个 Golang 项目</h2>\\n<p>让我们从将 Go 与 Bazel 结合使用的基础知识开始。</p>\\n<p>为此，我们需要从 <a href=\\\"https://github.com/bazelbuild/rules_go\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://github.com/bazelbuild/rules_go</a> 获取 Go 语言的官方构建规则。</p>\"}")
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
