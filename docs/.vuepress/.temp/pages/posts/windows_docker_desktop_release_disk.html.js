import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/windows_docker_desktop_release_disk.html.vue"
const data = JSON.parse("{\"path\":\"/posts/windows_docker_desktop_release_disk.html\",\"title\":\"Windows下释放Docker所占用的WSL磁盘空间\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\",\"WSL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"1. 停止wsl2\",\"slug\":\"_1-停止wsl2\",\"link\":\"#_1-停止wsl2\",\"children\":[]},{\"level\":2,\"title\":\"2. 运行diskpart释放空间\",\"slug\":\"_2-运行diskpart释放空间\",\"link\":\"#_2-运行diskpart释放空间\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/windows_docker_desktop_release_disk.md\",\"excerpt\":\"\\n<p>使用下面的命令清理镜像：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">docker</span> system prune</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
