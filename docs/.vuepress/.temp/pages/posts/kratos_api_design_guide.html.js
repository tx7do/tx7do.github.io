import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_api_design_guide.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_api_design_guide.html\",\"title\":\"Kratos微服务框架API工程化指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"工具安装\",\"slug\":\"工具安装\",\"link\":\"#工具安装\",\"children\":[{\"level\":3,\"title\":\"安装 protoc\",\"slug\":\"安装-protoc\",\"link\":\"#安装-protoc\",\"children\":[]},{\"level\":3,\"title\":\"后端工具\",\"slug\":\"后端工具\",\"link\":\"#后端工具\",\"children\":[]},{\"level\":3,\"title\":\"前端工具\",\"slug\":\"前端工具\",\"link\":\"#前端工具\",\"children\":[]}]},{\"level\":2,\"title\":\"设计API\",\"slug\":\"设计api\",\"link\":\"#设计api\",\"children\":[{\"level\":3,\"title\":\"CURD\",\"slug\":\"curd\",\"link\":\"#curd\",\"children\":[]},{\"level\":3,\"title\":\"Kratos Errors\",\"slug\":\"kratos-errors\",\"link\":\"#kratos-errors\",\"children\":[]},{\"level\":3,\"title\":\"Message Validator\",\"slug\":\"message-validator\",\"link\":\"#message-validator\",\"children\":[]},{\"level\":3,\"title\":\"OpenAPI\",\"slug\":\"openapi\",\"link\":\"#openapi\",\"children\":[]}]},{\"level\":2,\"title\":\"代码生成\",\"slug\":\"代码生成\",\"link\":\"#代码生成\",\"children\":[{\"level\":3,\"title\":\"插件生成文件一览表\",\"slug\":\"插件生成文件一览表\",\"link\":\"#插件生成文件一览表\",\"children\":[]},{\"level\":3,\"title\":\"生成代码的命令\",\"slug\":\"生成代码的命令\",\"link\":\"#生成代码的命令\",\"children\":[]}]},{\"level\":2,\"title\":\"实施工程化\",\"slug\":\"实施工程化\",\"link\":\"#实施工程化\",\"children\":[{\"level\":3,\"title\":\"1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）\",\"slug\":\"_1-bat批处理脚本-windows-或者shell脚本-非windows\",\"link\":\"#_1-bat批处理脚本-windows-或者shell脚本-非windows\",\"children\":[]},{\"level\":3,\"title\":\"2. Makefile\",\"slug\":\"_2-makefile\",\"link\":\"#_2-makefile\",\"children\":[]},{\"level\":3,\"title\":\"3. go:generate注解\",\"slug\":\"_3-go-generate注解\",\"link\":\"#_3-go-generate注解\",\"children\":[]},{\"level\":3,\"title\":\"4. buf.build\",\"slug\":\"_4-buf-build\",\"link\":\"#_4-buf-build\",\"children\":[]},{\"level\":3,\"title\":\"与前端协同\",\"slug\":\"与前端协同\",\"link\":\"#与前端协同\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_api_design_guide.md\",\"excerpt\":\"\\n<p>Kratos的RPC默认使用的是<a href=\\\"https://github.com/grpc/grpc\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">gRPC</a>，与此同时我们还可以通过gRPC的<a href=\\\"https://github.com/grpc-ecosystem/grpc-gateway\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">grpc-gateway</a>功能对RESTfull进行支持。这样，我们就可以同时支持gRPC和REST了。而这一切Kratos都已经封装好，无需知道底层的一切，用就好了。</p>\"}")
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
