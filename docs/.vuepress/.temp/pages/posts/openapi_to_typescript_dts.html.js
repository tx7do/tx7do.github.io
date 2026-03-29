import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/openapi_to_typescript_dts.html.vue"
const data = JSON.parse("{\"path\":\"/posts/openapi_to_typescript_dts.html\",\"title\":\"从OpenAPI文档生成Typescript的d.ts文件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"OpenAPI\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"dtsgenerator\",\"slug\":\"dtsgenerator\",\"link\":\"#dtsgenerator\",\"children\":[]},{\"level\":2,\"title\":\"openapi-typescript\",\"slug\":\"openapi-typescript\",\"link\":\"#openapi-typescript\",\"children\":[]},{\"level\":2,\"title\":\"Swagger Editor\",\"slug\":\"swagger-editor\",\"link\":\"#swagger-editor\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/openapi_to_typescript_dts.md\",\"excerpt\":\"\\n<p>一开始我走入了误区，应该从Protobuf生成dts，但是，现在来看，通过OpenAPI文档生成dts文件会更好一些。</p>\\n<p>首先，Protobuf对于前端来说，知识面几乎没有交集。你要找出知道Protobuf的前端，这并不是一件很容易的事情。但是，你要问前端OpenAPI，Swagger，他一定能够会告诉你，必须的知道。</p>\\n<p>其次，Protobuf通常都是后端定义，后端使用，要开放VSC的权限给前端，有时候会是一个很艰难的问题。那么，现实是，通常生成的工作都要后端去做——这就给工作中带来了极大的不便。</p>\\n<p>综上，通过Protobuf生成dts其实并不是一个明智之举。</p>\"}")
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
