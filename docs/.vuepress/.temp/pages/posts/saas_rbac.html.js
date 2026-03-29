import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/saas_rbac.html.vue"
const data = JSON.parse("{\"path\":\"/posts/saas_rbac.html\",\"title\":\"SaaS系统RBAC后台权限管理\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"RBAC\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"RBAC 简介\",\"slug\":\"rbac-简介\",\"link\":\"#rbac-简介\",\"children\":[]},{\"level\":2,\"title\":\"RBAC 支持的安全原则\",\"slug\":\"rbac-支持的安全原则\",\"link\":\"#rbac-支持的安全原则\",\"children\":[]},{\"level\":2,\"title\":\"RBAC0、RBAC1、RBAC2、RBAC3\",\"slug\":\"rbac0、rbac1、rbac2、rbac3\",\"link\":\"#rbac0、rbac1、rbac2、rbac3\",\"children\":[{\"level\":3,\"title\":\"RBAC0\",\"slug\":\"rbac0\",\"link\":\"#rbac0\",\"children\":[]},{\"level\":3,\"title\":\"RBAC1\",\"slug\":\"rbac1\",\"link\":\"#rbac1\",\"children\":[]},{\"level\":3,\"title\":\"RBAC2\",\"slug\":\"rbac2\",\"link\":\"#rbac2\",\"children\":[]},{\"level\":3,\"title\":\"RBAC3\",\"slug\":\"rbac3\",\"link\":\"#rbac3\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/saas_rbac.md\",\"excerpt\":\"\\n<p>RBAC 是基于角色的访问控制（Role-Based Access Control ）在 RBAC 中，权限与角色相关联，用户通过成为适当角色的成员而得到这些角色的权限。这就极大地简化了权限的管理。这样管理都是层级相互依赖的，权限赋予给角色，而把角色又赋予用户，这样的权限设计很清楚，管理起来很方便。</p>\\n<h2>RBAC 简介</h2>\\n<p>RBAC 认为授权实际上是 <code>Who</code> 、<code>What</code> 、<code>How</code> 三元组之间的关系，也就是 Who 对 What 进行 How 的操作，也就是“主体”对“客体”的操作。</p>\"}")
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
