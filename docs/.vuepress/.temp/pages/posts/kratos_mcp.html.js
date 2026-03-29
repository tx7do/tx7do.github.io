import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_mcp.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_mcp.html\",\"title\":\"基于 Go-Kratos 与 MCP 的推荐服务实战指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"技术基石：Go-Kratos 与 MCP 的协同架构\",\"slug\":\"技术基石-go-kratos-与-mcp-的协同架构\",\"link\":\"#技术基石-go-kratos-与-mcp-的协同架构\",\"children\":[]},{\"level\":2,\"title\":\"MCP 服务设计：基于 Kratos 的模块化调度实现\",\"slug\":\"mcp-服务设计-基于-kratos-的模块化调度实现\",\"link\":\"#mcp-服务设计-基于-kratos-的模块化调度实现\",\"children\":[{\"level\":3,\"title\":\"1. MCP 服务初始化与工具注册\",\"slug\":\"_1-mcp-服务初始化与工具注册\",\"link\":\"#_1-mcp-服务初始化与工具注册\",\"children\":[]},{\"level\":3,\"title\":\"2. 多模块协同流程：MCP 上下文驱动的推荐链路\",\"slug\":\"_2-多模块协同流程-mcp-上下文驱动的推荐链路\",\"link\":\"#_2-多模块协同流程-mcp-上下文驱动的推荐链路\",\"children\":[]}]},{\"level\":2,\"title\":\"服务部署与测试：Kratos 生态工具链的实践\",\"slug\":\"服务部署与测试-kratos-生态工具链的实践\",\"link\":\"#服务部署与测试-kratos-生态工具链的实践\",\"children\":[{\"level\":3,\"title\":\"1. 服务启动\",\"slug\":\"_1-服务启动\",\"link\":\"#_1-服务启动\",\"children\":[]},{\"level\":3,\"title\":\"2. 测试支持\",\"slug\":\"_2-测试支持\",\"link\":\"#_2-测试支持\",\"children\":[]},{\"level\":3,\"title\":\"3. 构建脚本\",\"slug\":\"_3-构建脚本\",\"link\":\"#_3-构建脚本\",\"children\":[]}]},{\"level\":2,\"title\":\"总结：Go-Kratos 与 MCP 协同的价值\",\"slug\":\"总结-go-kratos-与-mcp-协同的价值\",\"link\":\"#总结-go-kratos-与-mcp-协同的价值\",\"children\":[]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_mcp.md\",\"excerpt\":\"\\n<p>在微服务与多模块协同场景下，实现服务间的标准化通信与流程调度是核心挑战。本文聚焦 <code>go-kratos-mcp-demo</code> 项目，讲解如何基于\\n<code>Go-Kratos</code> 框架与 <code>MCP</code>（模块化协同协议）构建可扩展的推荐服务，涵盖服务契约设计（proto）、模块化流程编排、召回/过滤/排序等关键模块的实现与测试，并展示实战部署与可观测性方案。</p>\\n<h2>技术基石：Go-Kratos 与 MCP 的协同架构</h2>\\n<p>项目技术选型围绕 “模块化协同” 核心需求展开，<code>Go-Kratos</code> 与 <code>MCP</code> 构成架构的两大支柱，形成 “框架赋能 + 协议规范” 的协同模式：</p>\"}")
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
