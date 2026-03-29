import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/reactor.html.vue"
const data = JSON.parse("{\"path\":\"/posts/reactor.html\",\"title\":\"Reactor模式\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Reactor\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/reactor.md\",\"excerpt\":\"\\n<h2>参考资料</h2>\\n<ul>\\n<li><a href=\\\"https://segmentfault.com/a/1190000041306642\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">《Go组件设计与实现》-netpoll的总结</a></li>\\n<li><a href=\\\"https://www.infoq.cn/article/boeavgkiqmvcj8qjnbxk\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Go netpoll I/O 多路复用构建原生网络模型之源码深度解析</a></li>\\n<li><a href=\\\"https://strikefreedom.top/archives/go-netpoll-io-multiplexing-reactor#toc-head-21\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Go netpoller 原生网络模型之源码全面揭秘</a></li>\\n<li><a href=\\\"https://segmentfault.com/a/1190000038994423\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">epoll在Golang中的应用</a></li>\\n<li><a href=\\\"https://colobu.com/2019/02/23/1m-go-tcp-connection/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">百万 Go TCP 连接的思考: epoll方式减少资源占用</a></li>\\n</ul>\"}")
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
