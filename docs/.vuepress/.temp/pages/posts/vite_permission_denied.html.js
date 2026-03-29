import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/vite_permission_denied.html.vue"
const data = JSON.parse("{\"path\":\"/posts/vite_permission_denied.html\",\"title\":\"Vite permission denied 问题\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Vite\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/vite_permission_denied.md\",\"excerpt\":\"\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"> ERROR  error when starting dev server:                                                                                                                                                                                                                                <span class=\\\"token number\\\">11</span>:51:39  </span>\\n<span class=\\\"line\\\">Error: listen EACCES: permission denied <span class=\\\"token number\\\">0.0</span>.0.0:3100</span>\\n<span class=\\\"line\\\">    at Server.setupListenHandle <span class=\\\"token punctuation\\\">[</span>as _listen2<span class=\\\"token punctuation\\\">]</span> <span class=\\\"token punctuation\\\">(</span>node:net:1723:21<span class=\\\"token punctuation\\\">)</span></span>\\n<span class=\\\"line\\\">    at listenInCluster <span class=\\\"token punctuation\\\">(</span>node:net:1788:12<span class=\\\"token punctuation\\\">)</span></span>\\n<span class=\\\"line\\\">    at Server.listen <span class=\\\"token punctuation\\\">(</span>node:net:1876:7<span class=\\\"token punctuation\\\">)</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
