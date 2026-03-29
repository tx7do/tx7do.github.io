import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/running_coturn_in_docker_a_step_by_step_guide.html.vue"
const data = JSON.parse("{\"path\":\"/posts/running_coturn_in_docker_a_step_by_step_guide.html\",\"title\":\"使用 Docker 部署 CoTURN 新手指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\",\"CoTURN\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"先决条件\",\"slug\":\"先决条件\",\"link\":\"#先决条件\",\"children\":[]},{\"level\":2,\"title\":\"安装\",\"slug\":\"安装\",\"link\":\"#安装\",\"children\":[{\"level\":3,\"title\":\"步骤 1 拉取 Docker 镜像\",\"slug\":\"步骤-1-拉取-docker-镜像\",\"link\":\"#步骤-1-拉取-docker-镜像\",\"children\":[]},{\"level\":3,\"title\":\"第 2 步：配置 coturn 文件\",\"slug\":\"第-2-步-配置-coturn-文件\",\"link\":\"#第-2-步-配置-coturn-文件\",\"children\":[]},{\"level\":3,\"title\":\"步骤 3：配置 TURN 服务器\",\"slug\":\"步骤-3-配置-turn-服务器\",\"link\":\"#步骤-3-配置-turn-服务器\",\"children\":[]},{\"level\":3,\"title\":\"步骤 4：开启服务器持久性\",\"slug\":\"步骤-4-开启服务器持久性\",\"link\":\"#步骤-4-开启服务器持久性\",\"children\":[]},{\"level\":3,\"title\":\"步骤 5：自动检测外部 IP\",\"slug\":\"步骤-5-自动检测外部-ip\",\"link\":\"#步骤-5-自动检测外部-ip\",\"children\":[]},{\"level\":3,\"title\":\"步骤 6：从 docker 容器获取 Coturn 服务器 URL\",\"slug\":\"步骤-6-从-docker-容器获取-coturn-服务器-url\",\"link\":\"#步骤-6-从-docker-容器获取-coturn-服务器-url\",\"children\":[]},{\"level\":3,\"title\":\"步骤 7：为 docker COTURN 分配公网 IP\",\"slug\":\"步骤-7-为-docker-coturn-分配公网-ip\",\"link\":\"#步骤-7-为-docker-coturn-分配公网-ip\",\"children\":[]},{\"level\":3,\"title\":\"步骤 8：测试 CoTurn 是否正在运行\",\"slug\":\"步骤-8-测试-coturn-是否正在运行\",\"link\":\"#步骤-8-测试-coturn-是否正在运行\",\"children\":[]},{\"level\":3,\"title\":\"步骤 9：设置 turn 服务器的域名（可选）\",\"slug\":\"步骤-9-设置-turn-服务器的域名-可选\",\"link\":\"#步骤-9-设置-turn-服务器的域名-可选\",\"children\":[]},{\"level\":3,\"title\":\"步骤 10：使用 lets encrypt 对 COTURN 服务器进行加密（可选）\",\"slug\":\"步骤-10-使用-lets-encrypt-对-coturn-服务器进行加密-可选\",\"link\":\"#步骤-10-使用-lets-encrypt-对-coturn-服务器进行加密-可选\",\"children\":[]}]},{\"level\":2,\"title\":\"结论\",\"slug\":\"结论\",\"link\":\"#结论\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/running_coturn_in_docker_a_step_by_step_guide.md\",\"excerpt\":\"\\n<p>在本指南中，我们将学习如何在 Docker 容器中运行 CoTURN。COTURN 是一款免费的开源 TURN 服务器，可用于 WebRTC 视频和音频通信以及 VoIP 服务</p>\\n<h2>先决条件</h2>\\n<ul>\\n<li>您应该在系统上安装 docker。了解如何在系统上安装 docker 超出了本文的范围</li>\\n<li>建议但不要求具备一些 docker 基础知识</li>\\n</ul>\\n<h2>安装</h2>\\n<p>Docker 提供了 CoTURN 镜像，可用于在容器中轻松设置 CoTURN 服务器</p>\\n<h3>步骤 1 拉取 Docker 镜像</h3>\\n<p>安装docker coturn。从云存储库Docker Hub中拉取coturn的docker镜像。</p>\"}")
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
