import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/exploring_sealed_classes_in_flutter.html.vue"
const data = JSON.parse("{\"path\":\"/posts/exploring_sealed_classes_in_flutter.html\",\"title\":\"探索 Flutter 中的 Sealed Class\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Flutter编程\"],\"tag\":[\"Flutter\",\"Sealed Class\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"了解密封类\",\"slug\":\"了解密封类\",\"link\":\"#了解密封类\",\"children\":[]},{\"level\":2,\"title\":\"用例\",\"slug\":\"用例\",\"link\":\"#用例\",\"children\":[{\"level\":3,\"title\":\"1. 结果类型\",\"slug\":\"_1-结果类型\",\"link\":\"#_1-结果类型\",\"children\":[]},{\"level\":3,\"title\":\"2. 状态机\",\"slug\":\"_2-状态机\",\"link\":\"#_2-状态机\",\"children\":[]},{\"level\":3,\"title\":\"3. 事件处理\",\"slug\":\"_3-事件处理\",\"link\":\"#_3-事件处理\",\"children\":[]},{\"level\":3,\"title\":\"4. 表达式树\",\"slug\":\"_4-表达式树\",\"link\":\"#_4-表达式树\",\"children\":[]},{\"level\":3,\"title\":\"5. 配置集\",\"slug\":\"_5-配置集\",\"link\":\"#_5-配置集\",\"children\":[]},{\"level\":3,\"title\":\"6. API 响应\",\"slug\":\"_6-api-响应\",\"link\":\"#_6-api-响应\",\"children\":[]}]},{\"level\":2,\"title\":\"实战！\",\"slug\":\"实战\",\"link\":\"#实战\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/exploring_sealed_classes_in_flutter.md\",\"excerpt\":\"\\n<p><code>Dart 3</code> 在 <code>Flutter</code> 中引入了 <code>密封类(Sealed Class)</code>。如果您来自于类似 <code>Kotlin</code> 这样的现代编程语言，您可能已经知道它们有多么强大。如果没有，在本文结束时您将了解到关于密封类的全部内容。</p>\\n<blockquote>\\n<p>密封类(Sealed Class)是一项强大的功能，使开发人员能够创建受限制的类层次结构。与常规类不同，密封类只能在同一文件中扩展，这使得它们成为表示有限相关类集的绝佳选择。</p>\\n</blockquote>\\n<h2>了解密封类</h2>\"}")
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
