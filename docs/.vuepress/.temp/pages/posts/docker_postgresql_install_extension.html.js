import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_postgresql_install_extension.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_postgresql_install_extension.html\",\"title\":\"为Docker容器运行的PostgreSQL安装插件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\",\"PostgreSQL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"准备\",\"slug\":\"准备\",\"link\":\"#准备\",\"children\":[]},{\"level\":2,\"title\":\"安装插件\",\"slug\":\"安装插件\",\"link\":\"#安装插件\",\"children\":[{\"level\":3,\"title\":\"安装 Citus 插件\",\"slug\":\"安装-citus-插件\",\"link\":\"#安装-citus-插件\",\"children\":[]},{\"level\":3,\"title\":\"安装 PostGIS 插件\",\"slug\":\"安装-postgis-插件\",\"link\":\"#安装-postgis-插件\",\"children\":[]},{\"level\":3,\"title\":\"安装 pg_cron 插件\",\"slug\":\"安装-pg-cron-插件\",\"link\":\"#安装-pg-cron-插件\",\"children\":[]},{\"level\":3,\"title\":\"安装 PGVector 插件\",\"slug\":\"安装-pgvector-插件\",\"link\":\"#安装-pgvector-插件\",\"children\":[]},{\"level\":3,\"title\":\"安装 TimeScale 插件\",\"slug\":\"安装-timescale-插件\",\"link\":\"#安装-timescale-插件\",\"children\":[]}]},{\"level\":2,\"title\":\"pg_stat_statements\",\"slug\":\"pg-stat-statements\",\"link\":\"#pg-stat-statements\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_postgresql_install_extension.md\",\"excerpt\":\"\\n<h2>准备</h2>\\n<p>查看PostgreSQL的版本号（有些插件带大版本号）：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">SELECT version<span class=\\\"token punctuation\\\">(</span><span class=\\\"token punctuation\\\">)</span><span class=\\\"token punctuation\\\">;</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
