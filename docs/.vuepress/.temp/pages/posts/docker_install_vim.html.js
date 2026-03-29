import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_install_vim.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_install_vim.html\",\"title\":\"Docker 容器中安装VIM\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\",\"VIM\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/docker_install_vim.md\",\"excerpt\":\"\\n<p>Docker的容器当中一般是没有安装任何编辑器的,vi和vim神马的都没有.如果想要在容器中使用编辑器,需要自己去安装.<br>\\n但是,在 Docker 中执行：<code>apt-get update</code>报错:</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">E: List directory /var/lib/apt/lists/partial is missing. - Acquire <span class=\\\"token punctuation\\\">(</span><span class=\\\"token number\\\">13</span>: Permission denied<span class=\\\"token punctuation\\\">)</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
