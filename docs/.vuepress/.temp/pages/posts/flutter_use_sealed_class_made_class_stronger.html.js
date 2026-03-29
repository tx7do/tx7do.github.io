import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/flutter_use_sealed_class_made_class_stronger.html.vue"
const data = JSON.parse("{\"path\":\"/posts/flutter_use_sealed_class_made_class_stronger.html\",\"title\":\"Flutter使用Sealed Class让状态类更强大\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Flutter编程\"],\"tag\":[\"Flutter\",\"Sealed Class\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"enum\",\"slug\":\"enum\",\"link\":\"#enum\",\"children\":[]},{\"level\":2,\"title\":\"Sealed class\",\"slug\":\"sealed-class\",\"link\":\"#sealed-class\",\"children\":[]},{\"level\":2,\"title\":\"如此一来，我们就可以将函数变得更加的精简\",\"slug\":\"如此一来-我们就可以将函数变得更加的精简\",\"link\":\"#如此一来-我们就可以将函数变得更加的精简\",\"children\":[]},{\"level\":2,\"title\":\"Sealed class + BLoC\",\"slug\":\"sealed-class-bloc\",\"link\":\"#sealed-class-bloc\",\"children\":[]},{\"level\":2,\"title\":\"结论\",\"slug\":\"结论\",\"link\":\"#结论\",\"children\":[]},{\"level\":2,\"title\":\"翻译自\",\"slug\":\"翻译自\",\"link\":\"#翻译自\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/flutter_use_sealed_class_made_class_stronger.md\",\"excerpt\":\"\\n<p>记得之前在写Kotlin的时候，对于Kotlin所提供的<code>Sealed Class</code>的功能感到惊喜，我还给Sealed Class封上了enum 2.0的称号，它拥有Class的特性，可以将状态封装起来，使用<code>when</code>语法的时候，还可以详尽列出所有的子项，而在Flutter当中，其实也有<code>sealed class</code>可以用，在Dart 3.0中，也已经将sealed class加入到了Dart的武器库。</p>\\n<h2>enum</h2>\\n<p>假如，我们现在要实现一个 收音机 功能，我们可以使用enum声明其状态，代码如下：</p>\"}")
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
