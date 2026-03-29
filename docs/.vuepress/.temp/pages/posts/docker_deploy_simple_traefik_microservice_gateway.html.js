import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_deploy_simple_traefik_microservice_gateway.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_deploy_simple_traefik_microservice_gateway.html\",\"title\":\"Docker简单部署Traefik微服务网关\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Traefik\",\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是Traefik?\",\"slug\":\"什么是traefik\",\"link\":\"#什么是traefik\",\"children\":[]},{\"level\":2,\"title\":\"什么是微服务网关?\",\"slug\":\"什么是微服务网关\",\"link\":\"#什么是微服务网关\",\"children\":[]},{\"level\":2,\"title\":\"Docker部署服务器\",\"slug\":\"docker部署服务器\",\"link\":\"#docker部署服务器\",\"children\":[]},{\"level\":2,\"title\":\"管理后台\",\"slug\":\"管理后台\",\"link\":\"#管理后台\",\"children\":[]},{\"level\":2,\"title\":\"加入路由配置\",\"slug\":\"加入路由配置\",\"link\":\"#加入路由配置\",\"children\":[]},{\"level\":2,\"title\":\"简单的Go服务示例\",\"slug\":\"简单的go服务示例\",\"link\":\"#简单的go服务示例\",\"children\":[]},{\"level\":2,\"title\":\"注意的点\",\"slug\":\"注意的点\",\"link\":\"#注意的点\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_deploy_simple_traefik_microservice_gateway.md\",\"excerpt\":\"\\n<h2>什么是Traefik?</h2>\\n<p>Traefik 是一款开源的反向代理与负载均衡工具，它监听后端的变化并自动更新服务配置。Traefik 最大的优点是能够与常见的微服务系统直接整合，可以实现自动化动态配置。目前支持 Docker、Swarm,Marathon、Mesos、Kubernetes、Consul、Etcd、Zookeeper、BoltDB 和 Rest API 等后端模型。</p>\\n<h2>什么是微服务网关?</h2>\\n<p>微服务网关是整个微服务API请求的入口，可以实现过滤Api接口。并且可以实现用户的验证登录、解决跨域、日志拦截、权限控制、限流、熔断、负载均衡、黑名单与白名单机制等。</p>\"}")
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
