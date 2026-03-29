import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cmake_lib_gtest.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cmake_lib_gtest.html\",\"title\":\"使用CMake编译库，并使用GoogleTest测试库\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"GoogleTest\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"安装依赖\",\"slug\":\"安装依赖\",\"link\":\"#安装依赖\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cmake_lib_gtest.md\",\"excerpt\":\"\\n<h2>安装依赖</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">sudo</span> <span class=\\\"token function\\\">apt-get</span> <span class=\\\"token function\\\">install</span> libgtest-dev</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
