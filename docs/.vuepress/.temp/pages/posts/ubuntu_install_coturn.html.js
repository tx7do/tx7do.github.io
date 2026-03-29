import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/ubuntu_install_coturn.html.vue"
const data = JSON.parse("{\"path\":\"/posts/ubuntu_install_coturn.html\",\"title\":\"Ubuntu 安装 CoTURN\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"CoTURN\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"使用apt安装\",\"slug\":\"使用apt安装\",\"link\":\"#使用apt安装\",\"children\":[]},{\"level\":2,\"title\":\"开机启动\",\"slug\":\"开机启动\",\"link\":\"#开机启动\",\"children\":[]},{\"level\":2,\"title\":\"修改配置\",\"slug\":\"修改配置\",\"link\":\"#修改配置\",\"children\":[]},{\"level\":2,\"title\":\"公开的免费STUN服务器\",\"slug\":\"公开的免费stun服务器\",\"link\":\"#公开的免费stun服务器\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/ubuntu_install_coturn.md\",\"excerpt\":\"\\n<h2>使用apt安装</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">sudo</span> <span class=\\\"token function\\\">apt-get</span> <span class=\\\"token parameter variable\\\">-y</span> update</span>\\n<span class=\\\"line\\\"><span class=\\\"token function\\\">sudo</span> <span class=\\\"token function\\\">apt-get</span> <span class=\\\"token parameter variable\\\">-y</span> <span class=\\\"token function\\\">install</span> coturn</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
