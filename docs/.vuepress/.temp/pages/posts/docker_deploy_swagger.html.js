import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_deploy_swagger.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_deploy_swagger.html\",\"title\":\"用Docker轻松搭建Swagger环境\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Swagger\",\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"概要\",\"slug\":\"概要\",\"link\":\"#概要\",\"children\":[]},{\"level\":2,\"title\":\"成果\",\"slug\":\"成果\",\"link\":\"#成果\",\"children\":[{\"level\":3,\"title\":\"Swagger Editor\",\"slug\":\"swagger-editor\",\"link\":\"#swagger-editor\",\"children\":[]},{\"level\":3,\"title\":\"Swagger UI\",\"slug\":\"swagger-ui\",\"link\":\"#swagger-ui\",\"children\":[]},{\"level\":3,\"title\":\"API\",\"slug\":\"api\",\"link\":\"#api\",\"children\":[]}]},{\"level\":2,\"title\":\"测试环境\",\"slug\":\"测试环境\",\"link\":\"#测试环境\",\"children\":[]},{\"level\":2,\"title\":\"所需文件\",\"slug\":\"所需文件\",\"link\":\"#所需文件\",\"children\":[]},{\"level\":2,\"title\":\"步骤\",\"slug\":\"步骤\",\"link\":\"#步骤\",\"children\":[{\"level\":3,\"title\":\"1.创建docker-compose.yml\",\"slug\":\"_1-创建docker-compose-yml\",\"link\":\"#_1-创建docker-compose-yml\",\"children\":[]},{\"level\":3,\"title\":\"2.创建openapi.yaml\",\"slug\":\"_2-创建openapi-yaml\",\"link\":\"#_2-创建openapi-yaml\",\"children\":[]}]},{\"level\":2,\"title\":\"启动\",\"slug\":\"启动\",\"link\":\"#启动\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]},{\"level\":2,\"title\":\"原文\",\"slug\":\"原文\",\"link\":\"#原文\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_deploy_swagger.md\",\"excerpt\":\"\\n<h2>概要</h2>\\n<p>我将介绍如何构建运行在 Docker 上的 Swagger 环境。</p>\\n<h2>成果</h2>\\n<h3>Swagger Editor</h3>\\n<p>网页的左侧是编辑器，右侧是Swagger UI，可以实时查看notation和查看定义文档。\\n如果将稍后描述的示例复制并粘贴到左侧，结果将显示在右侧，所以请尝试一下。</p>\\n<p><img src=\\\"/assets/images/swagger/swagger_editor.png\\\" alt=\\\"swagger_editor\\\"></p>\\n<h3>Swagger UI</h3>\\n<p><img src=\\\"/assets/images/swagger/swagger_ui.png\\\" alt=\\\"swagger_ui\\\"></p>\"}")
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
