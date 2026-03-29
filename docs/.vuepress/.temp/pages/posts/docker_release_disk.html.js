import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_release_disk.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_release_disk.html\",\"title\":\"Docker清理磁盘空间\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"探查命令\",\"slug\":\"探查命令\",\"link\":\"#探查命令\",\"children\":[]},{\"level\":2,\"title\":\"Docker命令常规清除\",\"slug\":\"docker命令常规清除\",\"link\":\"#docker命令常规清除\",\"children\":[]},{\"level\":2,\"title\":\"清除掉/var/lib/docker/containers下的日志文件\",\"slug\":\"清除掉-var-lib-docker-containers下的日志文件\",\"link\":\"#清除掉-var-lib-docker-containers下的日志文件\",\"children\":[]},{\"level\":2,\"title\":\"清除掉/var/lib/docker/overlay2/下的日志文件\",\"slug\":\"清除掉-var-lib-docker-overlay2-下的日志文件\",\"link\":\"#清除掉-var-lib-docker-overlay2-下的日志文件\",\"children\":[]},{\"level\":2,\"title\":\"集大成者清理脚本\",\"slug\":\"集大成者清理脚本\",\"link\":\"#集大成者清理脚本\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_release_disk.md\",\"excerpt\":\"\\n<p>在日常运维当中，Docker会产生一些运行时的临时文件，我们需要定时的清理掉他们，不然将会对磁盘造成极大的压力。</p>\\n<h2>探查命令</h2>\\n<p>查看整个Docker系统的磁盘占用情况：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">docker</span> system <span class=\\\"token function\\\">df</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
