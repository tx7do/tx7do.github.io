import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/git_submodule.html.vue"
const data = JSON.parse("{\"path\":\"/posts/git_submodule.html\",\"title\":\"git submodule\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Git\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"添加子模块\",\"slug\":\"添加子模块\",\"link\":\"#添加子模块\",\"children\":[]},{\"level\":2,\"title\":\"删除子模块\",\"slug\":\"删除子模块\",\"link\":\"#删除子模块\",\"children\":[]},{\"level\":2,\"title\":\"更新子模块\",\"slug\":\"更新子模块\",\"link\":\"#更新子模块\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/git_submodule.md\",\"excerpt\":\"\\n<h2>添加子模块</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">git</span> submodule <span class=\\\"token function\\\">add</span> <span class=\\\"token operator\\\">&lt;</span>url<span class=\\\"token operator\\\">&gt;</span> <span class=\\\"token operator\\\">&lt;</span>path<span class=\\\"token operator\\\">&gt;</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
