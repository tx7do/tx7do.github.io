import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_jwt.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_jwt.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：JWT 集成指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、前置准备\",\"slug\":\"一、前置准备\",\"link\":\"#一、前置准备\",\"children\":[]},{\"level\":2,\"title\":\"二、详细集成步骤\",\"slug\":\"二、详细集成步骤\",\"link\":\"#二、详细集成步骤\",\"children\":[{\"level\":3,\"title\":\"步骤 1：创建 JWT 认证器\",\"slug\":\"步骤-1-创建-jwt-认证器\",\"link\":\"#步骤-1-创建-jwt-认证器\",\"children\":[]},{\"level\":3,\"title\":\"步骤 2：依赖注入容器（Wire 注册）\",\"slug\":\"步骤-2-依赖注入容器-wire-注册\",\"link\":\"#步骤-2-依赖注入容器-wire-注册\",\"children\":[]},{\"level\":3,\"title\":\"步骤 3：集成中间件至 REST 服务链路\",\"slug\":\"步骤-3-集成中间件至-rest-服务链路\",\"link\":\"#步骤-3-集成中间件至-rest-服务链路\",\"children\":[]},{\"level\":3,\"title\":\"步骤 4：修改配置文件，启用 JWT 认证\",\"slug\":\"步骤-4-修改配置文件-启用-jwt-认证\",\"link\":\"#步骤-4-修改配置文件-启用-jwt-认证\",\"children\":[]}]},{\"level\":2,\"title\":\"三、集成验证步骤\",\"slug\":\"三、集成验证步骤\",\"link\":\"#三、集成验证步骤\",\"children\":[]},{\"level\":2,\"title\":\"四、常见问题与解决方案\",\"slug\":\"四、常见问题与解决方案\",\"link\":\"#四、常见问题与解决方案\",\"children\":[{\"level\":3,\"title\":\"1. 认证器创建失败（返回 nil）\",\"slug\":\"_1-认证器创建失败-返回-nil\",\"link\":\"#_1-认证器创建失败-返回-nil\",\"children\":[]},{\"level\":3,\"title\":\"2. Token 验证失败（401 错误）\",\"slug\":\"_2-token-验证失败-401-错误\",\"link\":\"#_2-token-验证失败-401-错误\",\"children\":[]},{\"level\":3,\"title\":\"3. 白名单接口仍需认证\",\"slug\":\"_3-白名单接口仍需认证\",\"link\":\"#_3-白名单接口仍需认证\",\"children\":[]}]},{\"level\":2,\"title\":\"五、核心项目仓库\",\"slug\":\"五、核心项目仓库\",\"link\":\"#五、核心项目仓库\",\"children\":[]},{\"level\":2,\"title\":\"六、总结\",\"slug\":\"六、总结\",\"link\":\"#六、总结\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_jwt.md\",\"excerpt\":\"\\n<p>在企业级中后台系统开发中，身份认证与授权是核心安全能力。JWT（JSON Web Token）凭借其无状态、轻量化、跨平台的特性，成为分布式系统中身份校验的优选方案。GoWind Admin 作为企业级前后端一体中后台框架，已将 JWT 核心逻辑封装至 <a href=\\\"https://github.com/tx7do/kratos-authn\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">github.com/tx7do/kratos-authn</a> 组件中，彻底简化了底层引擎初始化、策略加载、签名验证等重复开发工作。开发者只需遵循以下标准化步骤，即可快速完成 JWT 集成，无缝对接框架的 OPA 权限管控体系，构建安全可靠的身份认证链路。</p>\"}")
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
