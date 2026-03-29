import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_deploy_docker_image.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_deploy_docker_image.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何进行Docker部署后端\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、部署前提\",\"slug\":\"一、部署前提\",\"link\":\"#一、部署前提\",\"children\":[]},{\"level\":2,\"title\":\"二、核心部署方式\",\"slug\":\"二、核心部署方式\",\"link\":\"#二、核心部署方式\",\"children\":[{\"level\":3,\"title\":\"方式一：使用 docker-compose 一键部署（推荐，全量服务）\",\"slug\":\"方式一-使用-docker-compose-一键部署-推荐-全量服务\",\"link\":\"#方式一-使用-docker-compose-一键部署-推荐-全量服务\",\"children\":[]},{\"level\":3,\"title\":\"方式二：使用 docker run 单独部署（灵活部署，适合调试/增量部署）\",\"slug\":\"方式二-使用-docker-run-单独部署-灵活部署-适合调试-增量部署\",\"link\":\"#方式二-使用-docker-run-单独部署-灵活部署-适合调试-增量部署\",\"children\":[]}]},{\"level\":2,\"title\":\"三、服务增减时的 Docker 配置调整\",\"slug\":\"三、服务增减时的-docker-配置调整\",\"link\":\"#三、服务增减时的-docker-配置调整\",\"children\":[{\"level\":3,\"title\":\"1. 无需修改 Dockerfile 的原因\",\"slug\":\"_1-无需修改-dockerfile-的原因\",\"link\":\"#_1-无需修改-dockerfile-的原因\",\"children\":[]},{\"level\":3,\"title\":\"2. 使用 docker-compose 部署时的配置调整\",\"slug\":\"_2-使用-docker-compose-部署时的配置调整\",\"link\":\"#_2-使用-docker-compose-部署时的配置调整\",\"children\":[]}]},{\"level\":2,\"title\":\"四、常见问题与解决方案\",\"slug\":\"四、常见问题与解决方案\",\"link\":\"#四、常见问题与解决方案\",\"children\":[{\"level\":3,\"title\":\"问题1：执行 make docker-compose 时拉取镜像失败\",\"slug\":\"问题1-执行-make-docker-compose-时拉取镜像失败\",\"link\":\"#问题1-执行-make-docker-compose-时拉取镜像失败\",\"children\":[]},{\"level\":3,\"title\":\"问题2：容器启动后，业务服务无法连接中间件\",\"slug\":\"问题2-容器启动后-业务服务无法连接中间件\",\"link\":\"#问题2-容器启动后-业务服务无法连接中间件\",\"children\":[]},{\"level\":3,\"title\":\"问题3：构建镜像时提示“找不到服务目录”\",\"slug\":\"问题3-构建镜像时提示-找不到服务目录\",\"link\":\"#问题3-构建镜像时提示-找不到服务目录\",\"children\":[]}]},{\"level\":2,\"title\":\"项目源码\",\"slug\":\"项目源码\",\"link\":\"#项目源码\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_deploy_docker_image.md\",\"excerpt\":\"\\n<p>Docker 部署具备环境一致性、可移植性强、部署高效等优势，是企业级应用落地的优选方案。风行·GoWind Admin 后端已将所有Docker部署相关操作封装至 Makefile 中，实现极简部署体验。本文将详细介绍两种核心部署方式、服务增减时的配置调整方法，助力开发者快速完成后端服务的容器化部署。</p>\\n<h2>一、部署前提</h2>\\n<ul>\\n<li>本地环境已安装 Docker（建议版本 20.10+）及 Docker Compose（建议版本 2.10+），可通过 <code>docker -v``、docker compose version</code> 命令验证安装。</li>\\n<li>已获取 GoWind Admin 项目源码，进入后端项目根目录（即 <code>backend</code> 目录），所有部署命令均在此目录执行（特殊说明除外）。</li>\\n<li>确保部署环境网络通畅，可正常拉取 Docker Hub 公共镜像（如 postgres、redis 等依赖组件）。</li>\\n</ul>\"}")
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
