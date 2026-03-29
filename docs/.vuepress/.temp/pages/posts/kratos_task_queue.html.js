import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_task_queue.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_task_queue.html\",\"title\":\"golang微服务框架Kratos实现分布式任务队列\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是任务队列\",\"slug\":\"什么是任务队列\",\"link\":\"#什么是任务队列\",\"children\":[]},{\"level\":2,\"title\":\"任务队列的应用场景\",\"slug\":\"任务队列的应用场景\",\"link\":\"#任务队列的应用场景\",\"children\":[]},{\"level\":2,\"title\":\"Kratos下实现分布式任务队列\",\"slug\":\"kratos下实现分布式任务队列\",\"link\":\"#kratos下实现分布式任务队列\",\"children\":[{\"level\":3,\"title\":\"Asynq\",\"slug\":\"asynq\",\"link\":\"#asynq\",\"children\":[]},{\"level\":3,\"title\":\"Machinery\",\"slug\":\"machinery\",\"link\":\"#machinery\",\"children\":[]}]},{\"level\":2,\"title\":\"中间件代码\",\"slug\":\"中间件代码\",\"link\":\"#中间件代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_task_queue.md\",\"excerpt\":\"\\n<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>\\n<p>任务队列的输入是称为<code>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>\\n<p>在Golang语言里面，我们有像<a href=\\\"https://github.com/hibiken/asynq\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Asynq</a>和<a href=\\\"https://github.com/RichardKnop/machinery\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Machinery</a>这样的类似于<code>Celery</code>的分布式任务队列。</p>\"}")
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
