import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_redact.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_redact.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：数据脱敏和隐私保护\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"快速上手：环境准备与插件安装\",\"slug\":\"快速上手-环境准备与插件安装\",\"link\":\"#快速上手-环境准备与插件安装\",\"children\":[{\"level\":3,\"title\":\"1. 前置环境要求​\",\"slug\":\"_1-前置环境要求​\",\"link\":\"#_1-前置环境要求​\",\"children\":[]},{\"level\":3,\"title\":\"2. 安装插件​\",\"slug\":\"_2-安装插件​\",\"link\":\"#_2-安装插件​\",\"children\":[]}]},{\"level\":2,\"title\":\"核心使用流程：3 步实现 Protobuf 消息脱敏​\",\"slug\":\"核心使用流程-3-步实现-protobuf-消息脱敏​\",\"link\":\"#核心使用流程-3-步实现-protobuf-消息脱敏​\",\"children\":[{\"level\":3,\"title\":\"步骤 1：定义 Protobuf 消息（标注脱敏规则）​\",\"slug\":\"步骤-1-定义-protobuf-消息-标注脱敏规则-​\",\"link\":\"#步骤-1-定义-protobuf-消息-标注脱敏规则-​\",\"children\":[]},{\"level\":3,\"title\":\"步骤 2：生成脱敏代码（protoc 命令）​\",\"slug\":\"步骤-2-生成脱敏代码-protoc-命令-​\",\"link\":\"#步骤-2-生成脱敏代码-protoc-命令-​\",\"children\":[]},{\"level\":3,\"title\":\"步骤 3：调用脱敏方法（业务代码示例）​\",\"slug\":\"步骤-3-调用脱敏方法-业务代码示例-​\",\"link\":\"#步骤-3-调用脱敏方法-业务代码示例-​\",\"children\":[]}]},{\"level\":2,\"title\":\"适用场景与总结\",\"slug\":\"适用场景与总结\",\"link\":\"#适用场景与总结\",\"children\":[{\"level\":3,\"title\":\"1. 核心适用场景​\",\"slug\":\"_1-核心适用场景​\",\"link\":\"#_1-核心适用场景​\",\"children\":[]},{\"level\":3,\"title\":\"2. 工具总结​\",\"slug\":\"_2-工具总结​\",\"link\":\"#_2-工具总结​\",\"children\":[]}]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_redact.md\",\"excerpt\":\"\\n<p>Go Wind Admin 的数据脱敏能力，是基于 Protobuf 生态下的<a href=\\\"https://github.com/arrakis-digital/protoc-gen-redact\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">arrakis-digital/protoc-gen-redact</a>插件实现的 —— 通过在 Protobuf 消息定义中为敏感字段（如手机号、身份证号）添加脱敏注解（如(<code>(redact.custom).string = \\\"r*d@ct*d\\\"</code>)），由插件自动生成适配业务的脱敏方法（如 Go 语言的Redact()方法），无需侵入业务逻辑即可完成敏感数据的遮挡处理，同时保持与 Protobuf 消息结构的强绑定，避免跨层配置不一致问题。配微服务接口、日志打印、数据存储等场景的隐私保护需求。</p>\"}")
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
