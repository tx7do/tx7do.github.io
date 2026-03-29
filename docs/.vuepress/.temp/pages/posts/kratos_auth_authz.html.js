import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_auth_authz.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_auth_authz.html\",\"title\":\"Kratos微服务框架下的认证和鉴权\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、认证与鉴权的核心区别​\",\"slug\":\"一、认证与鉴权的核心区别​\",\"link\":\"#一、认证与鉴权的核心区别​\",\"children\":[{\"level\":3,\"title\":\"身份认证（Authentication）​\",\"slug\":\"身份认证-authentication-​\",\"link\":\"#身份认证-authentication-​\",\"children\":[]},{\"level\":3,\"title\":\"授权（Authorization）​\",\"slug\":\"授权-authorization-​\",\"link\":\"#授权-authorization-​\",\"children\":[]}]},{\"level\":2,\"title\":\"二、微服务下的认证与鉴权策略选型​\",\"slug\":\"二、微服务下的认证与鉴权策略选型​\",\"link\":\"#二、微服务下的认证与鉴权策略选型​\",\"children\":[]},{\"level\":2,\"title\":\"三、有状态 vs 无状态身份验证​\",\"slug\":\"三、有状态-vs-无状态身份验证​\",\"link\":\"#三、有状态-vs-无状态身份验证​\",\"children\":[{\"level\":3,\"title\":\"有状态认证（Cookie-Session 模式）​\",\"slug\":\"有状态认证-cookie-session-模式-​\",\"link\":\"#有状态认证-cookie-session-模式-​\",\"children\":[]},{\"level\":3,\"title\":\"无状态认证（Token 模式）​\",\"slug\":\"无状态认证-token-模式-​\",\"link\":\"#无状态认证-token-模式-​\",\"children\":[]}]},{\"level\":2,\"title\":\"四、技术实现方案​\",\"slug\":\"四、技术实现方案​\",\"link\":\"#四、技术实现方案​\",\"children\":[{\"level\":3,\"title\":\"4.1 JWT：无状态认证的核心实现​\",\"slug\":\"_4-1-jwt-无状态认证的核心实现​\",\"link\":\"#_4-1-jwt-无状态认证的核心实现​\",\"children\":[]},{\"level\":3,\"title\":\"4.2 Casbin：通用鉴权框架​\",\"slug\":\"_4-2-casbin-通用鉴权框架​\",\"link\":\"#_4-2-casbin-通用鉴权框架​\",\"children\":[]},{\"level\":3,\"title\":\"4.3 Kratos 框架下的落地实现​\",\"slug\":\"_4-3-kratos-框架下的落地实现​\",\"link\":\"#_4-3-kratos-框架下的落地实现​\",\"children\":[]}]},{\"level\":2,\"title\":\"五、整体流程梳理​\",\"slug\":\"五、整体流程梳理​\",\"link\":\"#五、整体流程梳理​\",\"children\":[{\"level\":3,\"title\":\"1. 登录流程​\",\"slug\":\"_1-登录流程​\",\"link\":\"#_1-登录流程​\",\"children\":[]},{\"level\":3,\"title\":\"2. 正常请求流程​\",\"slug\":\"_2-正常请求流程​\",\"link\":\"#_2-正常请求流程​\",\"children\":[]}]},{\"level\":2,\"title\":\"六、技术栈总结​\",\"slug\":\"六、技术栈总结​\",\"link\":\"#六、技术栈总结​\",\"children\":[]},{\"level\":2,\"title\":\"七、开源示例代码\",\"slug\":\"七、开源示例代码\",\"link\":\"#七、开源示例代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_auth_authz.md\",\"excerpt\":\"\\n<p>从单体应用迁移到微服务架构，虽能收获松耦合、可扩展等诸多优势，但也引入了新的安全挑战。微服务通过开放 API 实现服务间通信，与单体应用相比：​</p>\\n<ul>\\n<li>攻击面显著扩大：每个独立服务都需单独保障安全性，风险点呈指数级增加​</li>\\n<li>通信安全性要求更高：API 调用不仅要验证身份，还需保障传输安全与可用性​</li>\\n</ul>\\n<p>因此，微服务架构需要一套与单体应用截然不同的安全解决方案，核心聚焦于认证（Authentication） 与鉴权（Authorization） 两大核心能力。</p>\\n<h2>一、认证与鉴权的核心区别​</h2>\\n<p><img src=\\\"/assets/images/authn_vs_authz.jpg\\\" alt=\\\"认证和授权的区别\\\"></p>\"}")
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
