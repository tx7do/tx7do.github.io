import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/clear_docker_junk_file.html.vue"
const data = JSON.parse("{\"path\":\"/posts/clear_docker_junk_file.html\",\"title\":\"清除Docker产生的垃圾文件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/clear_docker_junk_file.md\",\"excerpt\":\"\\n<p>通过命令<code>df -h</code>查看磁盘空间占用，发现Docker的overlay对磁盘的占用极高。</p>\\n<p>通过<code>docker system prune -a</code>命令清除掉Docker的无用镜像、缓存、挂载数据，也并没有太多的改善。</p>\\n<p>通过<code>du -h --max-depth=1</code>或者<code>du -sh *</code>命令查看大文件的占用情况。</p>\\n<h2>参考资料</h2>\\n<ul>\\n<li><a href=\\\"https://hhbbz.github.io/2018/03/28/Docker%E5%AE%B9%E5%99%A8%E5%8D%A0%E7%94%A8%E7%A3%81%E7%9B%98%E5%86%85%E5%AD%98%E8%BF%87%E5%A4%A7%E7%9A%84%E9%97%AE%E9%A2%98%E6%8E%92%E6%9F%A5/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Docker容器占用磁盘内存过大的问题排查</a></li>\\n<li><a href=\\\"https://blog.csdn.net/weixin_41945228/article/details/104331479\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Docker 容器磁盘占用100%(/var/lib/docker/overlay2空间占用很大)</a></li>\\n</ul>\"}")
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
