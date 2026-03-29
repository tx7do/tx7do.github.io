import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_field_mask.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_field_mask.html\",\"title\":\"Kratos 下使用 Protobuf FieldMask 完全指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、核心认知：FieldMask 是什么？为什么必要？​\",\"slug\":\"一、核心认知-fieldmask-是什么-为什么必要-​\",\"link\":\"#一、核心认知-fieldmask-是什么-为什么必要-​\",\"children\":[{\"level\":3,\"title\":\"1.1 定义与核心价值​\",\"slug\":\"_1-1-定义与核心价值​\",\"link\":\"#_1-1-定义与核心价值​\",\"children\":[]},{\"level\":3,\"title\":\"1.2 语法规则（必记！避坑关键）​\",\"slug\":\"_1-2-语法规则-必记-避坑关键-​\",\"link\":\"#_1-2-语法规则-必记-避坑关键-​\",\"children\":[]},{\"level\":3,\"title\":\"1.3 微服务场景的量化收益​\",\"slug\":\"_1-3-微服务场景的量化收益​\",\"link\":\"#_1-3-微服务场景的量化收益​\",\"children\":[]}]},{\"level\":2,\"title\":\"二、IDL 设计：规范定义 FieldMask（遵循 AIP-161 标准）​\",\"slug\":\"二、idl-设计-规范定义-fieldmask-遵循-aip-161-标准-​\",\"link\":\"#二、idl-设计-规范定义-fieldmask-遵循-aip-161-标准-​\",\"children\":[{\"level\":3,\"title\":\"2.1 依赖引入​\",\"slug\":\"_2-1-依赖引入​\",\"link\":\"#_2-1-依赖引入​\",\"children\":[]},{\"level\":3,\"title\":\"2.2 规范定义请求字段​\",\"slug\":\"_2-2-规范定义请求字段​\",\"link\":\"#_2-2-规范定义请求字段​\",\"children\":[]},{\"level\":3,\"title\":\"2.4 IDL 设计最佳实践​\",\"slug\":\"_2-4-idl-设计最佳实践​\",\"link\":\"#_2-4-idl-设计最佳实践​\",\"children\":[]}]},{\"level\":2,\"title\":\"三、Kratos 集成落地\",\"slug\":\"三、kratos-集成落地\",\"link\":\"#三、kratos-集成落地\",\"children\":[{\"level\":3,\"title\":\"查询场景：从 SQL 到响应的全链路字段筛选\",\"slug\":\"查询场景-从-sql-到响应的全链路字段筛选\",\"link\":\"#查询场景-从-sql-到响应的全链路字段筛选\",\"children\":[]},{\"level\":3,\"title\":\"更新场景：安全更新 + NULL 字段处理\",\"slug\":\"更新场景-安全更新-null-字段处理\",\"link\":\"#更新场景-安全更新-null-字段处理\",\"children\":[]}]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_field_mask.md\",\"excerpt\":\"\\n<p>当我们使用 gRPC 进行跨服务通讯时，调用方往往只需要响应中的部分字段 —— 冗余字段不仅会增加网络传输成本，更可能触发不必要的下游依赖调用（比如为了返回一个非核心字段，需要额外调用 2 个服务）。​</p>\\n<p>在微服务场景中，这种「无效计算 + 无效传输」的开销会被放大：一次 RPC 级联 3~5 个下游是常态，而响应体中 60% 以上的字段可能都是调用方不需要的。​</p>\\n<p>此时，我们需要一种「字段按需筛选」机制：</p>\\n<ul>\\n<li><code>GraphQL</code> 用「字段选择器」实现​</li>\\n<li><code>JSON:API</code> 用「稀疏字段集」实现​</li>\\n<li>而 gRPC 生态中，<code>Protobuf FieldMask</code> 是标准且高效的解决方案。</li>\\n</ul>\"}")
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
