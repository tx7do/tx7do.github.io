import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_cfg.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_cfg.html\",\"title\":\"Kratos 微服务轻松对接 CFG 日志系统\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"部署 CFG\",\"slug\":\"部署-cfg\",\"link\":\"#部署-cfg\",\"children\":[]},{\"level\":2,\"title\":\"ClickHouse配置\",\"slug\":\"clickhouse配置\",\"link\":\"#clickhouse配置\",\"children\":[]},{\"level\":2,\"title\":\"Fluent Bit配置\",\"slug\":\"fluent-bit配置\",\"link\":\"#fluent-bit配置\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_cfg.md\",\"excerpt\":\"\\n<ul>\\n<li><a href=\\\"https://clickhouse.com/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">ClickHouse</a></li>\\n<li><a href=\\\"https://fluentbit.io/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Fluent Bit</a></li>\\n<li><a href=\\\"https://grafana.com/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Grafana</a></li>\\n</ul>\"}")
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
