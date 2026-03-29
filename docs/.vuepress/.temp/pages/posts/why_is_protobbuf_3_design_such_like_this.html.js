import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/why_is_protobbuf_3_design_such_like_this.html.vue"
const data = JSON.parse("{\"path\":\"/posts/why_is_protobbuf_3_design_such_like_this.html\",\"title\":\"设计思考 - Protocol Buffers 3 为什么这样设计\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Protocol\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"required / optional\",\"slug\":\"required-optional\",\"link\":\"#required-optional\",\"children\":[]},{\"level\":2,\"title\":\"危险的预设值\",\"slug\":\"危险的预设值\",\"link\":\"#危险的预设值\",\"children\":[]},{\"level\":2,\"title\":\"搬运自\",\"slug\":\"搬运自\",\"link\":\"#搬运自\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/why_is_protobbuf_3_design_such_like_this.md\",\"excerpt\":\"\\n<p>简单是一件非常困难的事！而深思熟虑的简单，可以给我们与学习最多的思考</p>\\n<p>Protocol Buffer 的第 3 版删除了一些特性（required, optional...），并且在默认值的设计上，做出了一个看起来很危险的重要决定。乍看之下匪夷所思，网路上也引起多人<a href=\\\"https://github.com/google/protobuf/issues/359\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">讨论</a>。通常这种去掉重要功能的决定，都有非常的理由，尝试理解别人的设计，可以让我们看得更远。现在，就让我们尝试从google的角度，思考一下Protocol Buffer的设计吧！</p>\"}")
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
