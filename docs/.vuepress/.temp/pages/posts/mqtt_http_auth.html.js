import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/mqtt_http_auth.html.vue"
const data = JSON.parse("{\"path\":\"/posts/mqtt_http_auth.html\",\"title\":\"MQTT服务器使用HTTP进行用户认证\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"QTT\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Docker部署开发服务器\",\"slug\":\"docker部署开发服务器\",\"link\":\"#docker部署开发服务器\",\"children\":[]},{\"level\":2,\"title\":\"RabbitMQ认证\",\"slug\":\"rabbitmq认证\",\"link\":\"#rabbitmq认证\",\"children\":[{\"level\":3,\"title\":\"需要的插件\",\"slug\":\"需要的插件\",\"link\":\"#需要的插件\",\"children\":[]},{\"level\":3,\"title\":\"配置文件\",\"slug\":\"配置文件\",\"link\":\"#配置文件\",\"children\":[]},{\"level\":3,\"title\":\"HTTP认证服务器实现\",\"slug\":\"http认证服务器实现\",\"link\":\"#http认证服务器实现\",\"children\":[]}]},{\"level\":2,\"title\":\"EMQX认证\",\"slug\":\"emqx认证\",\"link\":\"#emqx认证\",\"children\":[{\"level\":3,\"title\":\"需要的插件\",\"slug\":\"需要的插件-1\",\"link\":\"#需要的插件-1\",\"children\":[]},{\"level\":3,\"title\":\"配置文件\",\"slug\":\"配置文件-1\",\"link\":\"#配置文件-1\",\"children\":[]},{\"level\":3,\"title\":\"HTTP认证服务器实现\",\"slug\":\"http认证服务器实现-1\",\"link\":\"#http认证服务器实现-1\",\"children\":[]}]},{\"level\":2,\"title\":\"示例代码\",\"slug\":\"示例代码\",\"link\":\"#示例代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/mqtt_http_auth.md\",\"excerpt\":\"\\n<p>MQTT开源服务器有不少,我只用了两个Erlang开发的开源服务器:</p>\\n<ul>\\n<li><a href=\\\"https://www.rabbitmq.com/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">RabbitMQ</a></li>\\n<li><a href=\\\"https://www.emqx.io/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">EMQX</a>.</li>\\n</ul>\\n<p>现实中,我们需要提供一个HTTP认证服务器,来认证我们的MQTT客户端.</p>\\n<h2>Docker部署开发服务器</h2>\"}")
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
