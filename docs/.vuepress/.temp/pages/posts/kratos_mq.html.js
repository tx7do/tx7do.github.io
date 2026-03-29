import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_mq.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_mq.html\",\"title\":\"golang微服务框架Kratos实现消息队列\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是消息队列\",\"slug\":\"什么是消息队列\",\"link\":\"#什么是消息队列\",\"children\":[]},{\"level\":2,\"title\":\"为什么要使用消息队列\",\"slug\":\"为什么要使用消息队列\",\"link\":\"#为什么要使用消息队列\",\"children\":[{\"level\":3,\"title\":\"1. 异步\",\"slug\":\"_1-异步\",\"link\":\"#_1-异步\",\"children\":[]},{\"level\":3,\"title\":\"2. 削峰\",\"slug\":\"_2-削峰\",\"link\":\"#_2-削峰\",\"children\":[]},{\"level\":3,\"title\":\"3. 解耦\",\"slug\":\"_3-解耦\",\"link\":\"#_3-解耦\",\"children\":[]}]},{\"level\":2,\"title\":\"Kratos与消息队列\",\"slug\":\"kratos与消息队列\",\"link\":\"#kratos与消息队列\",\"children\":[]},{\"level\":2,\"title\":\"kratos-transport的应用\",\"slug\":\"kratos-transport的应用\",\"link\":\"#kratos-transport的应用\",\"children\":[{\"level\":3,\"title\":\"1. Codec 编解码器\",\"slug\":\"_1-codec-编解码器\",\"link\":\"#_1-codec-编解码器\",\"children\":[]},{\"level\":3,\"title\":\"2. Broker 消息队列客户端\",\"slug\":\"_2-broker-消息队列客户端\",\"link\":\"#_2-broker-消息队列客户端\",\"children\":[]},{\"level\":3,\"title\":\"3. Server 封装给Kratos的Server实现\",\"slug\":\"_3-server-封装给kratos的server实现\",\"link\":\"#_3-server-封装给kratos的server实现\",\"children\":[]}]},{\"level\":2,\"title\":\"具体的应用实例\",\"slug\":\"具体的应用实例\",\"link\":\"#具体的应用实例\",\"children\":[{\"level\":3,\"title\":\"kratos-cqrs\",\"slug\":\"kratos-cqrs\",\"link\":\"#kratos-cqrs\",\"children\":[]},{\"level\":3,\"title\":\"kratos-realtimemap\",\"slug\":\"kratos-realtimemap\",\"link\":\"#kratos-realtimemap\",\"children\":[]},{\"level\":3,\"title\":\"kratos-chatroom\",\"slug\":\"kratos-chatroom\",\"link\":\"#kratos-chatroom\",\"children\":[]}]},{\"level\":2,\"title\":\"中间件代码\",\"slug\":\"中间件代码\",\"link\":\"#中间件代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_mq.md\",\"excerpt\":\"\\n<h2>什么是消息队列</h2>\\n<p>MQ就是消息队列，是Message Queue的缩写。消息队列是一种通信方式。消息的本质就是一种数据结构。因为MQ把项目中的消息集中式的处理和存储，所以MQ主要有解耦，并发，和削峰的功能。</p>\\n<h2>为什么要使用消息队列</h2>\\n<h3>1. 异步</h3>\\n<p>通常的微服务实现里面，都是通过RPC进行微服务之间的相互调用，这是同步的。如果消息队列的话，可以实现异步的调用。至于异步有啥好处呢，主要是为了削峰。</p>\\n<h3>2. 削峰</h3>\\n<p>同步的调用会带来一个问题：瞬时流量。客户的调用同步接口节奏，你是无法把控的，流量将会是忽高忽低的，猛的来一波，搞不好系统就崩了溃了。</p>\"}")
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
