import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_frontend_access_control.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_frontend_access_control.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：前端权限控制\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、页面级权限：管控页面访问边界\",\"slug\":\"一、页面级权限-管控页面访问边界\",\"link\":\"#一、页面级权限-管控页面访问边界\",\"children\":[{\"level\":3,\"title\":\"1.1 后端控制模式（推荐复杂权限场景）\",\"slug\":\"_1-1-后端控制模式-推荐复杂权限场景\",\"link\":\"#_1-1-后端控制模式-推荐复杂权限场景\",\"children\":[]},{\"level\":3,\"title\":\"1.2 前端控制模式（适配简单固定角色场景）\",\"slug\":\"_1-2-前端控制模式-适配简单固定角色场景\",\"link\":\"#_1-2-前端控制模式-适配简单固定角色场景\",\"children\":[]}]},{\"level\":2,\"title\":\"二、按钮级权限：管控操作执行权限\",\"slug\":\"二、按钮级权限-管控操作执行权限\",\"link\":\"#二、按钮级权限-管控操作执行权限\",\"children\":[{\"level\":3,\"title\":\"2.1 权限码控制（推荐：最小粒度权限管控）\",\"slug\":\"_2-1-权限码控制-推荐-最小粒度权限管控\",\"link\":\"#_2-1-权限码控制-推荐-最小粒度权限管控\",\"children\":[]},{\"level\":3,\"title\":\"2.2 角色码控制（适配粗粒度操作管控）\",\"slug\":\"_2-2-角色码控制-适配粗粒度操作管控\",\"link\":\"#_2-2-角色码控制-适配粗粒度操作管控\",\"children\":[]}]},{\"level\":2,\"title\":\"三、权限控制最佳实践\",\"slug\":\"三、权限控制最佳实践\",\"link\":\"#三、权限控制最佳实践\",\"children\":[{\"level\":3,\"title\":\"3.1 控制方式选择建议\",\"slug\":\"_3-1-控制方式选择建议\",\"link\":\"#_3-1-控制方式选择建议\",\"children\":[]},{\"level\":3,\"title\":\"3.2 核心注意事项\",\"slug\":\"_3-2-核心注意事项\",\"link\":\"#_3-2-核心注意事项\",\"children\":[]}]},{\"level\":2,\"title\":\"四、项目源码与参考资料\",\"slug\":\"四、项目源码与参考资料\",\"link\":\"#四、项目源码与参考资料\",\"children\":[{\"level\":3,\"title\":\"4.1 项目源码\",\"slug\":\"_4-1-项目源码\",\"link\":\"#_4-1-项目源码\",\"children\":[]},{\"level\":3,\"title\":\"4.2 参考资料\",\"slug\":\"_4-2-参考资料\",\"link\":\"#_4-2-参考资料\",\"children\":[]}]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_frontend_access_control.md\",\"excerpt\":\"\\n<p>在企业级中后台系统中，前端权限控制是保障数据安全、规范用户操作边界的核心能力。风行·GoWind Admin 前端权限控制核心聚焦于<strong>功能权限管控</strong>，根据控制粒度的不同，分为「页面级权限」和「按钮级权限」两大模块，覆盖从“页面访问”到“操作执行”的全链路权限管控需求。本文将详细拆解两种权限的实现原理、启用方式、核心代码及最佳实践，助力开发者快速落地权限管控方案。</p>\\n<h2>一、页面级权限：管控页面访问边界</h2>\\n<p>页面级权限的核心目标是控制用户能否访问特定页面，主要通过「菜单隐藏」和「路由拦截」两种手段实现——未授权用户既无法在侧边栏看到目标菜单，也无法通过直接输入URL跳过菜单访问页面，进而实现对用户访问“财务报表”“人事管理”等核心页面的精准管控。</p>\"}")
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
