import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_signalr.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_signalr.html\",\"title\":\"Golang微服务框架kratos实现SignalR服务\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是 SignalR？\",\"slug\":\"什么是-signalr\",\"link\":\"#什么是-signalr\",\"children\":[]},{\"level\":2,\"title\":\"SignalR 和 WebSocket\",\"slug\":\"signalr-和-websocket\",\"link\":\"#signalr-和-websocket\",\"children\":[]},{\"level\":2,\"title\":\"Kratos服务端\",\"slug\":\"kratos服务端\",\"link\":\"#kratos服务端\",\"children\":[]},{\"level\":2,\"title\":\"JS客户端\",\"slug\":\"js客户端\",\"link\":\"#js客户端\",\"children\":[]},{\"level\":2,\"title\":\"中间件代码\",\"slug\":\"中间件代码\",\"link\":\"#中间件代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料 (Reference)\",\"slug\":\"参考资料-reference\",\"link\":\"#参考资料-reference\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_signalr.md\",\"excerpt\":\"\\n<p>基于 SignalR 可以实现客户端和服务器之间进行即时通信。</p>\\n<p>适合 SignalR 的应用场景：</p>\\n<p>需要从服务器进行高频率更新的应用。 示例包括游戏、社交网络、投票、拍卖、地图和 GPS 应用。\\n仪表板和监视应用。\\n协作应用。 协作应用的示例包括白板应用和团队会议软件。\\n需要通知的应用。 社交网络、电子邮件、聊天、游戏、旅行警报和很多其他应用都需使用通知。</p>\\n<p>SignalR 自动选择服务器和客户端能力范围内的最佳传输方法，如WebSockets、Server-Sent Events、长轮询。Hub 是一种高级管道，允许客户端和服务器相互调用方法。 SignalR 自动处理跨计算机边界的调度，并允许客户端调用服务器上的方法，反之亦然。SignalR 提供两个内置协议：基于 JSON 的文本协议和基于 MessagePack 的二进制协议。</p>\"}")
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
