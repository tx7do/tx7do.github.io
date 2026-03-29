import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/entgo_code_generate_tools.html.vue"
const data = JSON.parse("{\"path\":\"/posts/entgo_code_generate_tools.html\",\"title\":\"Ent代码生成工具链\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Go\",\"Ent\",\"SQL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"创建go项目\",\"slug\":\"创建go项目\",\"link\":\"#创建go项目\",\"children\":[]},{\"level\":2,\"title\":\"SQL生成schema\",\"slug\":\"sql生成schema\",\"link\":\"#sql生成schema\",\"children\":[{\"level\":3,\"title\":\"MySQL\",\"slug\":\"mysql\",\"link\":\"#mysql\",\"children\":[]},{\"level\":3,\"title\":\"Postgresql\",\"slug\":\"postgresql\",\"link\":\"#postgresql\",\"children\":[]}]},{\"level\":2,\"title\":\"schema生成proto\",\"slug\":\"schema生成proto\",\"link\":\"#schema生成proto\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/entgo_code_generate_tools.md\",\"excerpt\":\"\\n<p>Ent是Facebook开源的一个GO语言的ORM框架。它提供了一系列的工具，可以做到：</p>\\n<ol>\\n<li>SQL生成schema；</li>\\n<li>schema生成protobuf的message；</li>\\n<li>schema生成gPRC的service。</li>\\n</ol>\\n<h2>创建go项目</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">go mod init entimport-example</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
