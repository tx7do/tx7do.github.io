import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_backend_access_control.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_backend_access_control.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：后端权限控制\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Casbin\",\"slug\":\"casbin\",\"link\":\"#casbin\",\"children\":[{\"level\":3,\"title\":\"理解Casbin\",\"slug\":\"理解casbin\",\"link\":\"#理解casbin\",\"children\":[]},{\"level\":3,\"title\":\"配置解析\",\"slug\":\"配置解析\",\"link\":\"#配置解析\",\"children\":[]},{\"level\":3,\"title\":\"在Go Wind Admin中是如何应用Casbin的？\",\"slug\":\"在go-wind-admin中是如何应用casbin的\",\"link\":\"#在go-wind-admin中是如何应用casbin的\",\"children\":[]}]},{\"level\":2,\"title\":\"OPA\",\"slug\":\"opa\",\"link\":\"#opa\",\"children\":[{\"level\":3,\"title\":\"理解OPA\",\"slug\":\"理解opa\",\"link\":\"#理解opa\",\"children\":[]},{\"level\":3,\"title\":\"学习Rego\",\"slug\":\"学习rego\",\"link\":\"#学习rego\",\"children\":[]},{\"level\":3,\"title\":\"在Go Wind Admin中是如何应用OPA的？\",\"slug\":\"在go-wind-admin中是如何应用opa的\",\"link\":\"#在go-wind-admin中是如何应用opa的\",\"children\":[]}]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_backend_access_control.md\",\"excerpt\":\"\\n<p>后端的权限控制主要分为两种：</p>\\n<ul>\\n<li>API权限控制；</li>\\n<li>数据权限控制。</li>\\n</ul>\\n<p>在本文，我们不讨论数据权限的控制，主要讲API的权限控制。</p>\\n<p>在GO的世界里面，我们能够使用到的解决方案有：</p>\\n<ul>\\n<li><a href=\\\"https://casbin.org/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Casbin</a></li>\\n<li><a href=\\\"https://www.openpolicyagent.org/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Open Policy Agent(OPA)</a></li>\\n<li><a href=\\\"https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Zanzibar</a></li>\\n</ul>\"}")
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
