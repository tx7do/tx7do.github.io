import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_socketio.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_socketio.html\",\"title\":\"Golang微服务框架kratos实现Socket.IO服务\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Socket.IO如何工作\",\"slug\":\"socket-io如何工作\",\"link\":\"#socket-io如何工作\",\"children\":[{\"level\":3,\"title\":\"客户端\",\"slug\":\"客户端\",\"link\":\"#客户端\",\"children\":[]},{\"level\":3,\"title\":\"服务端\",\"slug\":\"服务端\",\"link\":\"#服务端\",\"children\":[]}]},{\"level\":2,\"title\":\"Socket.IO的限制\",\"slug\":\"socket-io的限制\",\"link\":\"#socket-io的限制\",\"children\":[]},{\"level\":2,\"title\":\"Kratos服务端\",\"slug\":\"kratos服务端\",\"link\":\"#kratos服务端\",\"children\":[]},{\"level\":2,\"title\":\"JS客户端\",\"slug\":\"js客户端\",\"link\":\"#js客户端\",\"children\":[]},{\"level\":2,\"title\":\"中间件代码\",\"slug\":\"中间件代码\",\"link\":\"#中间件代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料 (Reference)\",\"slug\":\"参考资料-reference\",\"link\":\"#参考资料-reference\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_socketio.md\",\"excerpt\":\"\\n<p>Socket.IO 是一个面向实时 web 应用的 实时通讯库。它使得服务器和客户端之间实时双向的通信成为可能。底层使用EngineIO。SocketIO的的客户端使用Engine.IO-Client，服务端使用Engine.IO实现。</p>\\n<p>Socket.IO 主要使用WebSocket协议。但是如果需要的话，Socket.IO 可以回退到几种其它方法，例如Adobe Flash Sockets，JSONP拉取，或是传统的AJAX拉取，并且在同时提供完全相同的接口。尽管它可以被用作WebSocket的包装库，它还是提供了许多其它功能，比如广播至多个套接字，存储与不同客户有关的数据，和异步IO操作。</p>\"}")
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
