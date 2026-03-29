import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_no_proxy_solution.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_no_proxy_solution.html\",\"title\":\"Docker在国内没有代理的解决方案\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"导出镜像\",\"slug\":\"导出镜像\",\"link\":\"#导出镜像\",\"children\":[]},{\"level\":2,\"title\":\"导入镜像\",\"slug\":\"导入镜像\",\"link\":\"#导入镜像\",\"children\":[]},{\"level\":2,\"title\":\"查看本地镜像\",\"slug\":\"查看本地镜像\",\"link\":\"#查看本地镜像\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_no_proxy_solution.md\",\"excerpt\":\"\\n<p>Docker的国内代理都失效了，不抱怨，只讲如何解决问题。</p>\\n<p>简单来说，就是把本地的镜像导出来，然后打成压缩包，再拷贝到服务器上去，然后再导入。</p>\\n<h2>导出镜像</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">docker</span> save bitnami/minio:latest <span class=\\\"token parameter variable\\\">-o</span> minio.tar</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
