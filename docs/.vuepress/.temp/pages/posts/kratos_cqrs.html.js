import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_cqrs.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_cqrs.html\",\"title\":\"Kratos微服务框架下实现CQRS架构模式\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是 CQRS\",\"slug\":\"什么是-cqrs\",\"link\":\"#什么是-cqrs\",\"children\":[]},{\"level\":2,\"title\":\"读写分离解决了什么？\",\"slug\":\"读写分离解决了什么\",\"link\":\"#读写分离解决了什么\",\"children\":[]},{\"level\":2,\"title\":\"使用 CQRS 有什么好处？\",\"slug\":\"使用-cqrs-有什么好处\",\"link\":\"#使用-cqrs-有什么好处\",\"children\":[]},{\"level\":2,\"title\":\"使用 CQRS 的缺点是什么？\",\"slug\":\"使用-cqrs-的缺点是什么\",\"link\":\"#使用-cqrs-的缺点是什么\",\"children\":[]},{\"level\":2,\"title\":\"实现CQRS\",\"slug\":\"实现cqrs\",\"link\":\"#实现cqrs\",\"children\":[{\"level\":3,\"title\":\"日志查询服务(kratos.logger.service)\",\"slug\":\"日志查询服务-kratos-logger-service\",\"link\":\"#日志查询服务-kratos-logger-service\",\"children\":[]},{\"level\":3,\"title\":\"日志写入服务(kratos.logger.job)\",\"slug\":\"日志写入服务-kratos-logger-job\",\"link\":\"#日志写入服务-kratos-logger-job\",\"children\":[]},{\"level\":3,\"title\":\"Docker部署开发服务器\",\"slug\":\"docker部署开发服务器\",\"link\":\"#docker部署开发服务器\",\"children\":[]}]},{\"level\":2,\"title\":\"测试\",\"slug\":\"测试\",\"link\":\"#测试\",\"children\":[{\"level\":3,\"title\":\"下载工具\",\"slug\":\"下载工具\",\"link\":\"#下载工具\",\"children\":[]}]},{\"level\":2,\"title\":\"进行测试\",\"slug\":\"进行测试\",\"link\":\"#进行测试\",\"children\":[{\"level\":3,\"title\":\"测试写\",\"slug\":\"测试写\",\"link\":\"#测试写\",\"children\":[]},{\"level\":3,\"title\":\"测试读\",\"slug\":\"测试读\",\"link\":\"#测试读\",\"children\":[]}]},{\"level\":2,\"title\":\"技术栈\",\"slug\":\"技术栈\",\"link\":\"#技术栈\",\"children\":[]},{\"level\":2,\"title\":\"实例代码\",\"slug\":\"实例代码\",\"link\":\"#实例代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_cqrs.md\",\"excerpt\":\"\\n<p><strong>命令查询的责任分离Command Query Responsibility Segregation</strong> 通常被简化为 <strong>命令查询分离</strong>，即读写分离。</p>\\n<p>在特定的场景下，它可以提供更好的性能。但是，在强一致性方面，它并不能够保证。而且，还会带来认知负担。所以，实际运用上，需要谨慎。</p>\\n<h2>什么是 CQRS</h2>\\n<p>这个概念出自于 <strong>命令与查询分离（CQS, Command Query Separation）</strong>，出自于1987 年 Bertrand Meyer 的 </p>\"}")
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
