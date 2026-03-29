import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/deploy_efk.html.vue"
const data = JSON.parse("{\"path\":\"/posts/deploy_efk.html\",\"title\":\"部署EFK\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"EFK\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Docker Run\",\"slug\":\"docker-run\",\"link\":\"#docker-run\",\"children\":[{\"level\":3,\"title\":\"ElasticSearch\",\"slug\":\"elasticsearch\",\"link\":\"#elasticsearch\",\"children\":[]},{\"level\":3,\"title\":\"Fluentd\",\"slug\":\"fluentd\",\"link\":\"#fluentd\",\"children\":[]},{\"level\":3,\"title\":\"Kibana\",\"slug\":\"kibana\",\"link\":\"#kibana\",\"children\":[]}]},{\"level\":2,\"title\":\"Docker Compose\",\"slug\":\"docker-compose\",\"link\":\"#docker-compose\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/deploy_efk.md\",\"excerpt\":\"\\n<ul>\\n<li>ElasticSearch</li>\\n<li>Fluentd</li>\\n<li>Kibana</li>\\n</ul>\\n<h2>Docker Run</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">docker</span> network create app-tier <span class=\\\"token parameter variable\\\">--driver</span> bridge</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
