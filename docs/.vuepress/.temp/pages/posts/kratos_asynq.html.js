import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_asynq.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_asynq.html\",\"title\":\"Golang微服务框架Kratos应用分布式计划任务队列Asynq\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是任务队列\",\"slug\":\"什么是任务队列\",\"link\":\"#什么是任务队列\",\"children\":[]},{\"level\":2,\"title\":\"任务队列的应用场景\",\"slug\":\"任务队列的应用场景\",\"link\":\"#任务队列的应用场景\",\"children\":[]},{\"level\":2,\"title\":\"Asynq概述\",\"slug\":\"asynq概述\",\"link\":\"#asynq概述\",\"children\":[]},{\"level\":2,\"title\":\"Asynq的特点\",\"slug\":\"asynq的特点\",\"link\":\"#asynq的特点\",\"children\":[]},{\"level\":2,\"title\":\"Asynq可视化监控\",\"slug\":\"asynq可视化监控\",\"link\":\"#asynq可视化监控\",\"children\":[{\"level\":3,\"title\":\"命令行工具CLI\",\"slug\":\"命令行工具cli\",\"link\":\"#命令行工具cli\",\"children\":[]},{\"level\":3,\"title\":\"Web UI\",\"slug\":\"web-ui\",\"link\":\"#web-ui\",\"children\":[]}]},{\"level\":2,\"title\":\"Kratos下如何应用Asynq？\",\"slug\":\"kratos下如何应用asynq\",\"link\":\"#kratos下如何应用asynq\",\"children\":[{\"level\":3,\"title\":\"Docker部署依赖组件\",\"slug\":\"docker部署依赖组件\",\"link\":\"#docker部署依赖组件\",\"children\":[]},{\"level\":3,\"title\":\"安装依赖库\",\"slug\":\"安装依赖库\",\"link\":\"#安装依赖库\",\"children\":[]},{\"level\":3,\"title\":\"创建Kratos服务端\",\"slug\":\"创建kratos服务端\",\"link\":\"#创建kratos服务端\",\"children\":[]},{\"level\":3,\"title\":\"注册任务回调\",\"slug\":\"注册任务回调\",\"link\":\"#注册任务回调\",\"children\":[]},{\"level\":3,\"title\":\"Asynq服务器注册到Kratos\",\"slug\":\"asynq服务器注册到kratos\",\"link\":\"#asynq服务器注册到kratos\",\"children\":[]},{\"level\":3,\"title\":\"实现任务回调方法\",\"slug\":\"实现任务回调方法\",\"link\":\"#实现任务回调方法\",\"children\":[]},{\"level\":3,\"title\":\"创建新任务\",\"slug\":\"创建新任务\",\"link\":\"#创建新任务\",\"children\":[]}]},{\"level\":2,\"title\":\"示例代码\",\"slug\":\"示例代码\",\"link\":\"#示例代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_asynq.md\",\"excerpt\":\"\\n<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>\\n<p>任务队列的输入是称为<code>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>\\n<p>在Golang语言里面，我们有像<a href=\\\"https://github.com/hibiken/asynq\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Asynq</a>和<a href=\\\"https://github.com/RichardKnop/machinery\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Machinery</a>这样的类似于<code>Celery</code>的分布式任务队列。</p>\"}")
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
