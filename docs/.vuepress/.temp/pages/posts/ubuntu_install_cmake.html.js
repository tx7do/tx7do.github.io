import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/ubuntu_install_cmake.html.vue"
const data = JSON.parse("{\"path\":\"/posts/ubuntu_install_cmake.html\",\"title\":\"Ubuntu安装CMake\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"CMake\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"1. 使用Apt安装\",\"slug\":\"_1-使用apt安装\",\"link\":\"#_1-使用apt安装\",\"children\":[]},{\"level\":2,\"title\":\"2. 源码构建安装\",\"slug\":\"_2-源码构建安装\",\"link\":\"#_2-源码构建安装\",\"children\":[]},{\"level\":2,\"title\":\"3. 二进制安装\",\"slug\":\"_3-二进制安装\",\"link\":\"#_3-二进制安装\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/ubuntu_install_cmake.md\",\"excerpt\":\"\\n<h2>1. 使用Apt安装</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">sudo</span> <span class=\\\"token function\\\">apt</span> update<span class=\\\"token punctuation\\\">;</span> <span class=\\\"token function\\\">sudo</span> <span class=\\\"token function\\\">apt</span> upgrade<span class=\\\"token punctuation\\\">;</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token function\\\">sudo</span> <span class=\\\"token function\\\">apt</span> <span class=\\\"token function\\\">install</span> cmake<span class=\\\"token punctuation\\\">;</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
