import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_sse.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_sse.html\",\"title\":\"Golang微服务框架kratos实现SSE服务\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是SSE\",\"slug\":\"什么是sse\",\"link\":\"#什么是sse\",\"children\":[]},{\"level\":2,\"title\":\"协议描述\",\"slug\":\"协议描述\",\"link\":\"#协议描述\",\"children\":[{\"level\":3,\"title\":\"数据格式\",\"slug\":\"数据格式\",\"link\":\"#数据格式\",\"children\":[]},{\"level\":3,\"title\":\"data 字段\",\"slug\":\"data-字段\",\"link\":\"#data-字段\",\"children\":[]},{\"level\":3,\"title\":\"id 字段\",\"slug\":\"id-字段\",\"link\":\"#id-字段\",\"children\":[]},{\"level\":3,\"title\":\"event 字段\",\"slug\":\"event-字段\",\"link\":\"#event-字段\",\"children\":[]},{\"level\":3,\"title\":\"retry 字段\",\"slug\":\"retry-字段\",\"link\":\"#retry-字段\",\"children\":[]}]},{\"level\":2,\"title\":\"Kratos服务端\",\"slug\":\"kratos服务端\",\"link\":\"#kratos服务端\",\"children\":[]},{\"level\":2,\"title\":\"JS客户端\",\"slug\":\"js客户端\",\"link\":\"#js客户端\",\"children\":[]},{\"level\":2,\"title\":\"中间件代码\",\"slug\":\"中间件代码\",\"link\":\"#中间件代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料 (Reference)\",\"slug\":\"参考资料-reference\",\"link\":\"#参考资料-reference\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_sse.md\",\"excerpt\":\"\\n<p>我也是最近才知道SSE的，问了下周围的人，发现知道的人也着实不多的。我是怎么知道SSE的呢？我看了下OpenAI的API，有一个Stream模式，就是使用的SSE实现的。说白了，这就是一个HTTP长连接通过服务端持续发送数据到前端的协议。在网络不稳定的情况下，它比Websocket要更好。</p>\\n<h2>什么是SSE</h2>\\n<p>Server-Sent Events（简称 SSE）</p>\\n<p>严格地说，HTTP 协议无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息（streaming）。</p>\\n<p>也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来。这时，客户端不会关闭连接，会一直等着服务器发过来的新的数据流，视频播放就是这样的例子。本质上，这种通信就是以流信息的方式，完成一次用时很长的下载。</p>\"}")
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
