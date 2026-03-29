import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_use_make_golang_app_in_windows.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_use_make_golang_app_in_windows.html\",\"title\":\"怎么样在Windows下使用Make编译Golang程序\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Make\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"安装Make\",\"slug\":\"安装make\",\"link\":\"#安装make\",\"children\":[{\"level\":3,\"title\":\"Choco\",\"slug\":\"choco\",\"link\":\"#choco\",\"children\":[]},{\"level\":3,\"title\":\"scoop\",\"slug\":\"scoop\",\"link\":\"#scoop\",\"children\":[]},{\"level\":3,\"title\":\"MinGW\",\"slug\":\"mingw\",\"link\":\"#mingw\",\"children\":[]}]},{\"level\":2,\"title\":\"Windows和Linux之间使用Make的区别\",\"slug\":\"windows和linux之间使用make的区别\",\"link\":\"#windows和linux之间使用make的区别\",\"children\":[]},{\"level\":2,\"title\":\"使用Makefile编译Golang程序\",\"slug\":\"使用makefile编译golang程序\",\"link\":\"#使用makefile编译golang程序\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/how_to_use_make_golang_app_in_windows.md\",\"excerpt\":\"\\n<p>GNU的Make是一个又古老又强大的构建工具，在我们的开发当中用得普遍。就Makefile的语法而言也不算复杂，没有特别复杂的需求的话，很容易就上手了，维护起来也容易，拿Make来做程序构建是一个好主意。</p>\\n<p>更复杂一点的项目构建可以选择Google的<a href=\\\"https://bazel.build/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Bazel</a>，但是通常的项目(至少70%-80%的项目)都没有这么复杂的需求。</p>\\n<p>在Unix、Linux、BSD、macOS等xNix下面使用Make是很方便的，很自然的，因为是出厂自带。</p>\"}")
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
