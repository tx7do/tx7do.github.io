import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/windows_server_deploy_docker.html.vue"
const data = JSON.parse("{\"path\":\"/posts/windows_server_deploy_docker.html\",\"title\":\"Windows Server 部署 Docker\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Windows\",\"Flutter\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/windows_server_deploy_docker.md\",\"excerpt\":\"\\n<p>Docker Desktop安装不了，只能安装Docker Toolbox。</p>\\n<p>通过国内镜像站下载：</p>\\n<ul>\\n<li>阿里云：<a href=\\\"https://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/</a></li>\\n<li>DaoCloud： <a href=\\\"https://get.daocloud.io/toolbox/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://get.daocloud.io/toolbox/</a></li>\\n</ul>\"}")
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
