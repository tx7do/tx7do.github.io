import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/protobuf_generate_golang_code_4ways.html.vue"
const data = JSON.parse("{\"path\":\"/posts/protobuf_generate_golang_code_4ways.html\",\"title\":\"Protobuf生成golang代码的4种方法\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Protobuf\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"插件生成文件一览表\",\"slug\":\"插件生成文件一览表\",\"link\":\"#插件生成文件一览表\",\"children\":[]},{\"level\":2,\"title\":\"4种方法\",\"slug\":\"_4种方法\",\"link\":\"#_4种方法\",\"children\":[{\"level\":3,\"title\":\"1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）\",\"slug\":\"_1-bat批处理脚本-windows-或者shell脚本-非windows\",\"link\":\"#_1-bat批处理脚本-windows-或者shell脚本-非windows\",\"children\":[]},{\"level\":3,\"title\":\"2. Makefile\",\"slug\":\"_2-makefile\",\"link\":\"#_2-makefile\",\"children\":[]},{\"level\":3,\"title\":\"3. go:generate注解\",\"slug\":\"_3-go-generate注解\",\"link\":\"#_3-go-generate注解\",\"children\":[]},{\"level\":3,\"title\":\"4. buf.build\",\"slug\":\"_4-buf-build\",\"link\":\"#_4-buf-build\",\"children\":[]}]}],\"git\":{},\"filePathRelative\":\"posts/protobuf_generate_golang_code_4ways.md\",\"excerpt\":\"\\n<p>要将Protobuf协议生成目标语言的代码，必须要通过生成器<a href=\\\"https://grpc.io/docs/protoc-installation/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">protoc</a>来实现，protoc是通过插件机制来实现各种语言的生成功能。</p>\\n<h2>插件生成文件一览表</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>插件名</th>\\n<th>生成文件名</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td><a href=\\\"google.golang.org/protobuf/cmd/protoc-gen-go\\\">protoc-gen-go</a></td>\\n<td>XXXXX.pb.go</td>\\n</tr>\\n<tr>\\n<td><a href=\\\"google.golang.org/grpc/cmd/protoc-gen-go-grpc\\\">protoc-gen-go-grpc</a></td>\\n<td>XXXXXX_grpc.pb.go</td>\\n</tr>\\n<tr>\\n<td><a href=\\\"github.com/go-kratos/kratos/cmd/protoc-gen-go-http\\\">protoc-gen-go-http</a></td>\\n<td>XXXXXX_http.pb.go</td>\\n</tr>\\n<tr>\\n<td><a href=\\\"github.com/go-kratos/kratos/cmd/protoc-gen-go-errors\\\">protoc-gen-go-errors</a></td>\\n<td>XXXXXX_errors.pb.go</td>\\n</tr>\\n<tr>\\n<td><a href=\\\"github.com/bufbuild/protoc-gen-validate\\\">protoc-gen-validate</a></td>\\n<td>XXXXXX.pb.validate.go</td>\\n</tr>\\n<tr>\\n<td><a href=\\\"github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2\\\">protoc-gen-openapiv2</a></td>\\n<td>XXXXXX.swagger.json</td>\\n</tr>\\n<tr>\\n<td><a href=\\\"github.com/google/gnostic/cmd/protoc-gen-openapi\\\">protoc-gen-openapi</a></td>\\n<td>openapi.yaml</td>\\n</tr>\\n</tbody>\\n</table>\"}")
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
