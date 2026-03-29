import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_efk.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_efk.html\",\"title\":\"Kratos微服务轻松对接EFK日志系统\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"EFK 分布式日志系统\",\"slug\":\"efk-分布式日志系统\",\"link\":\"#efk-分布式日志系统\",\"children\":[]},{\"level\":2,\"title\":\"部署EFK\",\"slug\":\"部署efk\",\"link\":\"#部署efk\",\"children\":[]},{\"level\":2,\"title\":\"Kratos微服务对接EFK\",\"slug\":\"kratos微服务对接efk\",\"link\":\"#kratos微服务对接efk\",\"children\":[]},{\"level\":2,\"title\":\"Kibana查询日志\",\"slug\":\"kibana查询日志\",\"link\":\"#kibana查询日志\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_efk.md\",\"excerpt\":\"\\n<p>在早期的单体服务时代，如果想要在生产环境中通过日志去定位业务逻辑的Bug或者性能问题，那么我们需要让运维人员逐个远程登入服务器，逐个服务实例去查询日志文件，这样排查问题的效率是相当的低，当线上发生了紧急状况的时候，人都要急死，却又无法有效率的排查出问题所在，更不用说解决问题。</p>\\n<p>而在微服务时代，服务实例部署在不同的物理机上，各个微服务的日志也被分散储存在不同的物理机上。当服务集群足够大，成百上千，甚至上万，此时再使用上述的传统方式查阅日志，那已经是不可完成的任务。因此，我们需要集中化管理分布式系统中的日志，其中有开源的组件如Syslog，用于将所有服务器上的所有服务的日志进行收集、汇总。</p>\"}")
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
