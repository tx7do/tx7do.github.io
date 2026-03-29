import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_prune.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_prune.html\",\"title\":\"Docker修剪未使用对象\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"镜像(Image)修剪\",\"slug\":\"镜像-image-修剪\",\"link\":\"#镜像-image-修剪\",\"children\":[]},{\"level\":2,\"title\":\"容器(Container)修剪\",\"slug\":\"容器-container-修剪\",\"link\":\"#容器-container-修剪\",\"children\":[]},{\"level\":2,\"title\":\"数据卷(volume)修剪\",\"slug\":\"数据卷-volume-修剪\",\"link\":\"#数据卷-volume-修剪\",\"children\":[]},{\"level\":2,\"title\":\"网络(Network)修剪\",\"slug\":\"网络-network-修剪\",\"link\":\"#网络-network-修剪\",\"children\":[]},{\"level\":2,\"title\":\"修剪所有\",\"slug\":\"修剪所有\",\"link\":\"#修剪所有\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_prune.md\",\"excerpt\":\"\\n<p>Docker 采用保守的方法来清理未使用的对象，例如镜像(Image)、容器(Container)、数据卷(volume)和网络(Network)。也就是说，除非您明确告诉 Docker 这样做，否则每个对象都永远不会被删除。结果导致了 Docker 最终使用了大量的磁盘空间。对于每种类型的对象，Docker 都提供了一个 prune（删除）命令。此外，您可以一次清理多个对象类型。本主题介绍如何使用每个命令。</p>\\n<h2>镜像(Image)修剪</h2>\\n<p><code>docker image prune</code>该命令可以清理未使用的镜像。默认情况下，该命令仅删除挂起的镜像。挂起的镜像是没有标签且不被其他容器引用的镜像。要删除挂起的镜像，只需要键入：<code>docker image prune</code></p>\"}")
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
