import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/vue_low_version_problem.html.vue"
const data = JSON.parse("{\"path\":\"/posts/vue_low_version_problem.html\",\"title\":\"Vue低版本引起的问题\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Vue\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Sass在v4.3.0版本之前使用node-sass需要原生编译libsass导致的问题\",\"slug\":\"sass在v4-3-0版本之前使用node-sass需要原生编译libsass导致的问题\",\"link\":\"#sass在v4-3-0版本之前使用node-sass需要原生编译libsass导致的问题\",\"children\":[{\"level\":3,\"title\":\"1. 卸载 node-sass\",\"slug\":\"_1-卸载-node-sass\",\"link\":\"#_1-卸载-node-sass\",\"children\":[]},{\"level\":3,\"title\":\"2. 安装 dart-sass\",\"slug\":\"_2-安装-dart-sass\",\"link\":\"#_2-安装-dart-sass\",\"children\":[]},{\"level\":3,\"title\":\"3. 修改css\",\"slug\":\"_3-修改css\",\"link\":\"#_3-修改css\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/vue_low_version_problem.md\",\"excerpt\":\"\\n<h2>Sass在v4.3.0版本之前使用node-sass需要原生编译libsass导致的问题</h2>\\n<p><code>Sass</code>在<code>v4.3.0</code>版本之前都是使用的<code>node-sass</code>，而<code>node-sass</code>的底层依赖 <code>libsass</code>，<code>libsass</code>是一个原生库，因此，在Windows下面需要强制用户必须安装<code>python2</code>和<code>Visual Studio</code>才能编译成功。这并不是一件很友好的事情，而且经常导致编译不成功。</p>\"}")
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
