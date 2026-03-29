import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/linux_show_lib_exported_table.html.vue"
const data = JSON.parse("{\"path\":\"/posts/linux_show_lib_exported_table.html\",\"title\":\"Linux库导出信息查看\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Linux\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/linux_show_lib_exported_table.md\",\"excerpt\":\"\\n<p>nm</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token comment\\\"># 查看静态库或动态库定义了哪些函数</span></span>\\n<span class=\\\"line\\\">nm <span class=\\\"token parameter variable\\\">-n</span> --defined-only xxxx.a</span>\\n<span class=\\\"line\\\">nm <span class=\\\"token parameter variable\\\">-g</span> <span class=\\\"token parameter variable\\\">-C</span> --defined-only xxxx.so</span>\\n<span class=\\\"line\\\">nm <span class=\\\"token parameter variable\\\">-D</span> xxxx.so</span>\\n<span class=\\\"line\\\"></span>\\n<span class=\\\"line\\\"><span class=\\\"token comment\\\"># 显示hello.a 中的未定义符号，需要和其他对象文件进行链接.</span></span>\\n<span class=\\\"line\\\">nm <span class=\\\"token parameter variable\\\">-u</span> hello.o</span>\\n<span class=\\\"line\\\"></span>\\n<span class=\\\"line\\\"><span class=\\\"token comment\\\"># 在 ./ 目录下找出哪个库文件定义了close_socket函数. </span></span>\\n<span class=\\\"line\\\">nm <span class=\\\"token parameter variable\\\">-A</span> ./* <span class=\\\"token operator\\\"><span class=\\\"token file-descriptor important\\\">2</span>&gt;</span>/dev/null <span class=\\\"token operator\\\">|</span> <span class=\\\"token function\\\">grep</span> <span class=\\\"token string\\\">\\\"T close_socket\\\"</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
