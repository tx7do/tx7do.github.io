import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_casbin.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_casbin.html\",\"title\":\"Kratos微服务框架实现权鉴 - Casbin\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"理解Casbin\",\"slug\":\"理解casbin\",\"link\":\"#理解casbin\",\"children\":[]},{\"level\":2,\"title\":\"配置解析\",\"slug\":\"配置解析\",\"link\":\"#配置解析\",\"children\":[{\"level\":3,\"title\":\"模型（Access Control Model）\",\"slug\":\"模型-access-control-model\",\"link\":\"#模型-access-control-model\",\"children\":[]},{\"level\":3,\"title\":\"策略文档 (Policy Document)\",\"slug\":\"策略文档-policy-document\",\"link\":\"#策略文档-policy-document\",\"children\":[]}]},{\"level\":2,\"title\":\"一个最简单的Casbin的Golang程序\",\"slug\":\"一个最简单的casbin的golang程序\",\"link\":\"#一个最简单的casbin的golang程序\",\"children\":[]},{\"level\":2,\"title\":\"将Casbin实施封装\",\"slug\":\"将casbin实施封装\",\"link\":\"#将casbin实施封装\",\"children\":[]},{\"level\":2,\"title\":\"将Casbin整合进Kratos\",\"slug\":\"将casbin整合进kratos\",\"link\":\"#将casbin整合进kratos\",\"children\":[]},{\"level\":2,\"title\":\"相关代码\",\"slug\":\"相关代码\",\"link\":\"#相关代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_casbin.md\",\"excerpt\":\"\\n<p>Casbin（<a href=\\\"https://github.com/casbin/casbin\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://github.com/casbin/casbin</a>）是一套访问控制开源库，致力于帮助复杂系统解决权限管理的难题。同时也是一个国产开源项目。Casbin采用了元模型的设计思想，既支持ACL（访问控制列表），RBAC（基于角色访问控制），ABAC（基于属性访问控制）等经典的访问控制模型，也支持用户按照自身需求灵活定义权限。Casbin已经被Intel、IBM、腾讯云、VMware、RedHat、T-Mobile等公司开源使用，被Cisco、Verizon等公司闭源使用。具体详见Casbin主页（<a href=\\\"https://casbin.org/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://casbin.org/</a>）。</p>\"}")
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
