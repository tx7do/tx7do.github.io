import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_opa.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_opa.html\",\"title\":\"Kratos微服务框架实现权鉴 - OPA\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"理解OPA\",\"slug\":\"理解opa\",\"link\":\"#理解opa\",\"children\":[]},{\"level\":2,\"title\":\"学习Rego\",\"slug\":\"学习rego\",\"link\":\"#学习rego\",\"children\":[{\"level\":3,\"title\":\"赋值\",\"slug\":\"赋值\",\"link\":\"#赋值\",\"children\":[]}]},{\"level\":2,\"title\":\"布尔判断\",\"slug\":\"布尔判断\",\"link\":\"#布尔判断\",\"children\":[{\"level\":3,\"title\":\"遍历\",\"slug\":\"遍历\",\"link\":\"#遍历\",\"children\":[]},{\"level\":3,\"title\":\"函数\",\"slug\":\"函数\",\"link\":\"#函数\",\"children\":[]},{\"level\":3,\"title\":\"一个完整的规则\",\"slug\":\"一个完整的规则\",\"link\":\"#一个完整的规则\",\"children\":[]}]},{\"level\":2,\"title\":\"单元测试\",\"slug\":\"单元测试\",\"link\":\"#单元测试\",\"children\":[]},{\"level\":2,\"title\":\"一个最简单的OPA的Golang程序\",\"slug\":\"一个最简单的opa的golang程序\",\"link\":\"#一个最简单的opa的golang程序\",\"children\":[]},{\"level\":2,\"title\":\"将OPA实施封装\",\"slug\":\"将opa实施封装\",\"link\":\"#将opa实施封装\",\"children\":[]},{\"level\":2,\"title\":\"将OPA整合进Kratos\",\"slug\":\"将opa整合进kratos\",\"link\":\"#将opa整合进kratos\",\"children\":[]},{\"level\":2,\"title\":\"相关代码\",\"slug\":\"相关代码\",\"link\":\"#相关代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_opa.md\",\"excerpt\":\"\\n<p><a href=\\\"https://www.openpolicyagent.org/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Open Policy Agent</a>，官方简称OPA，旨在统一不同技术和系统的策略执行。今天，OPA 被科技行业内的巨头们所使用。例如，Netflix 使用 OPA 来控制对其内部 API 资源的访问。Chef 用它来为他们的终端用户产品提供 IAM 功能。此外，许多其他公司，如 Cloudflare、Pinterest 等，都使用 OPA 在他们的平台上执行策略（如 Kubernetes 集群）。</p>\\n<p>OPA 最初是由 Styra 公司在 2016 年创建并开源的项目，目前该公司的主要产品就是提供可视化策略控制及策略执行的可视化 Dashboard 服务的。</p>\"}")
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
