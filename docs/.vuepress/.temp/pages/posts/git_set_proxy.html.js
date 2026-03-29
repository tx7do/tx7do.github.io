import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/git_set_proxy.html.vue"
const data = JSON.parse("{\"path\":\"/posts/git_set_proxy.html\",\"title\":\"Git设置网络代理\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Git\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"设置HTTP代理\",\"slug\":\"设置http代理\",\"link\":\"#设置http代理\",\"children\":[]},{\"level\":2,\"title\":\"设置HTTPS代理\",\"slug\":\"设置https代理\",\"link\":\"#设置https代理\",\"children\":[]},{\"level\":2,\"title\":\"取消HTTP代理\",\"slug\":\"取消http代理\",\"link\":\"#取消http代理\",\"children\":[]},{\"level\":2,\"title\":\"取消HTTPS代理\",\"slug\":\"取消https代理\",\"link\":\"#取消https代理\",\"children\":[]},{\"level\":2,\"title\":\"查看系统配置信息\",\"slug\":\"查看系统配置信息\",\"link\":\"#查看系统配置信息\",\"children\":[]},{\"level\":2,\"title\":\"查看当前用户配置信息\",\"slug\":\"查看当前用户配置信息\",\"link\":\"#查看当前用户配置信息\",\"children\":[]},{\"level\":2,\"title\":\"查看当前仓库配置信息\",\"slug\":\"查看当前仓库配置信息\",\"link\":\"#查看当前仓库配置信息\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/git_set_proxy.md\",\"excerpt\":\"\\n<h2>设置HTTP代理</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">git</span> config <span class=\\\"token parameter variable\\\">--global</span> http.proxy http://127.0.0.1:1080</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
