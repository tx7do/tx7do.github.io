import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_dockerize_a_go_application.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_dockerize_a_go_application.html\",\"title\":\"如何 Docker 化一个 GO 应用程序\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\",\"Go\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"为任何 GO 应用程序编写 Docker 镜像\",\"slug\":\"为任何-go-应用程序编写-docker-镜像\",\"link\":\"#为任何-go-应用程序编写-docker-镜像\",\"children\":[]},{\"level\":2,\"title\":\"使用多阶段构建\",\"slug\":\"使用多阶段构建\",\"link\":\"#使用多阶段构建\",\"children\":[]},{\"level\":2,\"title\":\"以非root身份运行\",\"slug\":\"以非root身份运行\",\"link\":\"#以非root身份运行\",\"children\":[]},{\"level\":2,\"title\":\"最终结果\",\"slug\":\"最终结果\",\"link\":\"#最终结果\",\"children\":[]},{\"level\":2,\"title\":\"结论\",\"slug\":\"结论\",\"link\":\"#结论\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/how_to_dockerize_a_go_application.md\",\"excerpt\":\"\\n<p>使用 Golang，可以构建小到简单的可执行工具大到完整的 Web 服务器的任何东西。为了交付应用程序，使用 Docker 是首选，它允许我们创建一个包含项目运行所需的一切的自包含环境。值得一提的是，Docker 命令行界面本身也是使用 GO 所开发。</p>\\n<h2>为任何 GO 应用程序编写 Docker 镜像</h2>\\n<p>通常，从一个尽可能小且具有所需基本依赖项的基本镜像开始，是一个好主意。alpine 镜像通常是一个可靠的选择，因为它们仅包含操作系统所需的最低限度。</p>\\n<p>所以，我们可以这样写 <code>Dockerfile</code>：</p>\\n<div class=\\\"language-docker line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"docker\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token instruction\\\"><span class=\\\"token keyword\\\">FROM</span> golang:alpine3.15</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
