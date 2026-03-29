import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_proxy.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_proxy.html\",\"title\":\"Golang设置网络代理\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"打开模块支持\",\"slug\":\"打开模块支持\",\"link\":\"#打开模块支持\",\"children\":[]},{\"level\":2,\"title\":\"取消代理\",\"slug\":\"取消代理\",\"link\":\"#取消代理\",\"children\":[]},{\"level\":2,\"title\":\"取消校验\",\"slug\":\"取消校验\",\"link\":\"#取消校验\",\"children\":[]},{\"level\":2,\"title\":\"设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）\",\"slug\":\"设置不走-proxy-的私有仓库或组-多个用逗号相隔-可选\",\"link\":\"#设置不走-proxy-的私有仓库或组-多个用逗号相隔-可选\",\"children\":[]},{\"level\":2,\"title\":\"设置代理\",\"slug\":\"设置代理\",\"link\":\"#设置代理\",\"children\":[{\"level\":3,\"title\":\"国内常用代理列表\",\"slug\":\"国内常用代理列表\",\"link\":\"#国内常用代理列表\",\"children\":[]},{\"level\":3,\"title\":\"官方全球代理\",\"slug\":\"官方全球代理\",\"link\":\"#官方全球代理\",\"children\":[]},{\"level\":3,\"title\":\"七牛云\",\"slug\":\"七牛云\",\"link\":\"#七牛云\",\"children\":[]},{\"level\":3,\"title\":\"阿里云\",\"slug\":\"阿里云\",\"link\":\"#阿里云\",\"children\":[]},{\"level\":3,\"title\":\"GoCenter\",\"slug\":\"gocenter\",\"link\":\"#gocenter\",\"children\":[]},{\"level\":3,\"title\":\"百度\",\"slug\":\"百度\",\"link\":\"#百度\",\"children\":[]}]},{\"level\":2,\"title\":\"warning: go env -w GOPROXY=... does not override conflicting OS environment variable\",\"slug\":\"warning-go-env-w-goproxy-does-not-override-conflicting-os-environment-variable\",\"link\":\"#warning-go-env-w-goproxy-does-not-override-conflicting-os-environment-variable\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_proxy.md\",\"excerpt\":\"\\n<h2>打开模块支持</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">go <span class=\\\"token function\\\">env</span> <span class=\\\"token parameter variable\\\">-w</span> <span class=\\\"token assign-left variable\\\">GO111MODULE</span><span class=\\\"token operator\\\">=</span>on</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
