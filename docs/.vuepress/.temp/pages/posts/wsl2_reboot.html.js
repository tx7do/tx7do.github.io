import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/wsl2_reboot.html.vue"
const data = JSON.parse("{\"path\":\"/posts/wsl2_reboot.html\",\"title\":\"WSL2重启\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Windows\",\"WSL\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/wsl2_reboot.md\",\"excerpt\":\"\\n<p>列出WSL子系统</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">wslconfig /list</span>\\n<span class=\\\"line\\\">wsl <span class=\\\"token parameter variable\\\">--list</span></span>\\n<span class=\\\"line\\\">wsl <span class=\\\"token parameter variable\\\">-l</span> <span class=\\\"token parameter variable\\\">-v</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
