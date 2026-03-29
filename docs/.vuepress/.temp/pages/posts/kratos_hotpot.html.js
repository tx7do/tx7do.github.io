import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_hotpot.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_hotpot.html\",\"title\":\"Kratos 大乱炖 —— 整合其他Web框架：Gin、FastHttp、Hertz\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Gin\",\"slug\":\"gin\",\"link\":\"#gin\",\"children\":[]},{\"level\":2,\"title\":\"FastHttp\",\"slug\":\"fasthttp\",\"link\":\"#fasthttp\",\"children\":[]},{\"level\":2,\"title\":\"Hertz\",\"slug\":\"hertz\",\"link\":\"#hertz\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_hotpot.md\",\"excerpt\":\"\\n<p>Kratos默认的RPC框架使用的是gRPC，支持REST和protobuf两种通讯协议。其API都是使用protobuf定义的，REST协议是通过<a href=\\\"https://github.com/grpc-ecosystem/grpc-gateway\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">grpc-gateway</a>转译实现的。使用protobuf定义API是具有极大优点的，具有很强的可读性、可维护性，以及工程性。工程再大，人员再多，也不会乱。</p>\\n<p>一切看起来都是很美好的。那么，问题来了，我们现在使用的是其他的Web框架，迁移就会有成本，有风险，不可能一下子就把历史存在的代码一口气转换过来到Kratos框架。那我可以在Kratos中整合其他的Web框架做过渡吗？答案是：可以的。Kratos是基于的插件化设计，万物皆可插。</p>\"}")
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
