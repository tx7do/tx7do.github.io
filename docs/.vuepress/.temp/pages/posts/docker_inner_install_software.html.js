import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_inner_install_software.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_inner_install_software.html\",\"title\":\"Docker内部安装软件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"替换镜像源\",\"slug\":\"替换镜像源\",\"link\":\"#替换镜像源\",\"children\":[{\"level\":3,\"title\":\"Debian\",\"slug\":\"debian\",\"link\":\"#debian\",\"children\":[]},{\"level\":3,\"title\":\"Ubuntu\",\"slug\":\"ubuntu\",\"link\":\"#ubuntu\",\"children\":[]},{\"level\":3,\"title\":\"Alpine Linux用\",\"slug\":\"alpine-linux用\",\"link\":\"#alpine-linux用\",\"children\":[]}]},{\"level\":2,\"title\":\"Centos\",\"slug\":\"centos\",\"link\":\"#centos\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_inner_install_software.md\",\"excerpt\":\"\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">docker</span> <span class=\\\"token builtin class-name\\\">exec</span> <span class=\\\"token parameter variable\\\">-it</span> <span class=\\\"token punctuation\\\">{</span>容器名<span class=\\\"token punctuation\\\">}</span> <span class=\\\"token string\\\">\\\"apt update\\\"</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token function\\\">docker</span> <span class=\\\"token builtin class-name\\\">exec</span> <span class=\\\"token parameter variable\\\">-it</span> <span class=\\\"token punctuation\\\">{</span>容器名<span class=\\\"token punctuation\\\">}</span> <span class=\\\"token string\\\">\\\"apt install {软件名}\\\"</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
