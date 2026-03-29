import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_kafka.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_kafka.html\",\"title\":\"Golang微服务框架Kratos应用Kafka消息队列\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是消息队列\",\"slug\":\"什么是消息队列\",\"link\":\"#什么是消息队列\",\"children\":[]},{\"level\":2,\"title\":\"消息队列应用场景\",\"slug\":\"消息队列应用场景\",\"link\":\"#消息队列应用场景\",\"children\":[{\"level\":3,\"title\":\"异步处理\",\"slug\":\"异步处理\",\"link\":\"#异步处理\",\"children\":[]},{\"level\":3,\"title\":\"应用解耦\",\"slug\":\"应用解耦\",\"link\":\"#应用解耦\",\"children\":[]},{\"level\":3,\"title\":\"流量削峰\",\"slug\":\"流量削峰\",\"link\":\"#流量削峰\",\"children\":[]},{\"level\":3,\"title\":\"消息通讯\",\"slug\":\"消息通讯\",\"link\":\"#消息通讯\",\"children\":[]}]},{\"level\":2,\"title\":\"什么是 Apache Kafka？\",\"slug\":\"什么是-apache-kafka\",\"link\":\"#什么是-apache-kafka\",\"children\":[]},{\"level\":2,\"title\":\"Kafka 的工作原理\",\"slug\":\"kafka-的工作原理\",\"link\":\"#kafka-的工作原理\",\"children\":[{\"level\":3,\"title\":\"列队\",\"slug\":\"列队\",\"link\":\"#列队\",\"children\":[]},{\"level\":3,\"title\":\"发布-订阅\",\"slug\":\"发布-订阅\",\"link\":\"#发布-订阅\",\"children\":[]}]},{\"level\":2,\"title\":\"Kafka的基本概念\",\"slug\":\"kafka的基本概念\",\"link\":\"#kafka的基本概念\",\"children\":[]},{\"level\":2,\"title\":\"Docker部署开发环境\",\"slug\":\"docker部署开发环境\",\"link\":\"#docker部署开发环境\",\"children\":[]},{\"level\":2,\"title\":\"管理工具\",\"slug\":\"管理工具\",\"link\":\"#管理工具\",\"children\":[]},{\"level\":2,\"title\":\"Kratos下如何应用Kafka？\",\"slug\":\"kratos下如何应用kafka\",\"link\":\"#kratos下如何应用kafka\",\"children\":[{\"level\":3,\"title\":\"在Data层引用Kafka的Broker\",\"slug\":\"在data层引用kafka的broker\",\"link\":\"#在data层引用kafka的broker\",\"children\":[]},{\"level\":3,\"title\":\"在Server层引用Kafka的Server\",\"slug\":\"在server层引用kafka的server\",\"link\":\"#在server层引用kafka的server\",\"children\":[]}]},{\"level\":2,\"title\":\"实例代码\",\"slug\":\"实例代码\",\"link\":\"#实例代码\",\"children\":[]},{\"level\":2,\"title\":\"中间件代码\",\"slug\":\"中间件代码\",\"link\":\"#中间件代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_kafka.md\",\"excerpt\":\"\\n<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>\\n<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>\\n<p>在本文当中，您将了解到：什么是消息队列？什么是Kafka？怎样在微服务框架Kratos当中应用Kafka进行业务开发。</p>\\n<h2>什么是消息队列</h2>\\n<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>\"}")
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
