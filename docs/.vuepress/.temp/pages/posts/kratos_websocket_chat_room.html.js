import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_websocket_chat_room.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_websocket_chat_room.html\",\"title\":\"golang微服务框架Kratos实现Websocket聊天室\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是WebSocket\",\"slug\":\"什么是websocket\",\"link\":\"#什么是websocket\",\"children\":[]},{\"level\":2,\"title\":\"如何在Kratos下开发Websocket服务器\",\"slug\":\"如何在kratos下开发websocket服务器\",\"link\":\"#如何在kratos下开发websocket服务器\",\"children\":[]},{\"level\":2,\"title\":\"开始写代码\",\"slug\":\"开始写代码\",\"link\":\"#开始写代码\",\"children\":[{\"level\":3,\"title\":\"定义API\",\"slug\":\"定义api\",\"link\":\"#定义api\",\"children\":[]},{\"level\":3,\"title\":\"注册Websocket服务器\",\"slug\":\"注册websocket服务器\",\"link\":\"#注册websocket服务器\",\"children\":[]},{\"level\":3,\"title\":\"处理消息\",\"slug\":\"处理消息\",\"link\":\"#处理消息\",\"children\":[]},{\"level\":3,\"title\":\"实现JavaScript客户端\",\"slug\":\"实现javascript客户端\",\"link\":\"#实现javascript客户端\",\"children\":[]}]},{\"level\":2,\"title\":\"实例代码\",\"slug\":\"实例代码\",\"link\":\"#实例代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_websocket_chat_room.md\",\"excerpt\":\"\\n<h2>什么是WebSocket</h2>\\n<p>WebSocket 协议主要为了解决基于 HTTP/1.x 的 Web 应用无法实现服务端向客户端主动推送的问题, 为了兼容现有的设施, WebSocket 协议使用与 HTTP 协议相同的端口, 并使用 HTTP Upgrade 机制来进行 WebSocket 握手, 当握手完成之后, 通信双方便可以按照 WebSocket 协议的方式进行交互</p>\\n<p>WebSocket 使用 TCP 作为传输层协议, 与 HTTP 类似, WebSocket 也支持在 TCP 上层引入 TLS 层, 以建立加密数据传输通道, 即 WebSocket over TLS, WebSocket 的 URI 与 HTTP URI 的结构类似, 对于使用 80 端口的 WebSocket over TCP, 其 URI 的一般形式为 <code>ws://host:port/path/query</code> 对于使用 443 端口的 WebSocket over TLS, 其 URI 的一般形式为 <code>wss://host:port/path/query</code></p>\"}")
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
