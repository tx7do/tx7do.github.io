import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/using_pgbouncer_to_improve_performance_and_reduce_the_load_on_postgresql.html.vue"
const data = JSON.parse("{\"path\":\"/posts/using_pgbouncer_to_improve_performance_and_reduce_the_load_on_postgresql.html\",\"title\":\"使用 PgBouncer 提高性能并减少 PostgreSQL 的负载\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"PgBouncer\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"PostgreSQL 数据库服务器如何工作\",\"slug\":\"postgresql-数据库服务器如何工作\",\"link\":\"#postgresql-数据库服务器如何工作\",\"children\":[]},{\"level\":2,\"title\":\"使用 PgBouncer 池化器提高效率\",\"slug\":\"使用-pgbouncer-池化器提高效率\",\"link\":\"#使用-pgbouncer-池化器提高效率\",\"children\":[]},{\"level\":2,\"title\":\"这种方法的优点\",\"slug\":\"这种方法的优点\",\"link\":\"#这种方法的优点\",\"children\":[]},{\"level\":2,\"title\":\"如何安装和配置 PgBouncer\",\"slug\":\"如何安装和配置-pgbouncer\",\"link\":\"#如何安装和配置-pgbouncer\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/using_pgbouncer_to_improve_performance_and_reduce_the_load_on_postgresql.md\",\"excerpt\":\"\\n<p><img src=\\\"/assets/images/postgresql/pgbouncer.png\\\" alt=\\\"如何改进 PostgreSQL 数据库服务器架构连接管理\\\"></p>\\n<p>这篇博文将会逐步介绍如何使用 PgBouncer 连接池来改进 PostgreSQL 数据库服务器架构连接管理、减少 PostgreSQL 服务器上的负载并提高性能。</p>\\n<p>以下是我们在本文中将要讲解的内容的细分主题：</p>\\n<ul>\\n<li>PostgreSQL 数据库服务器如何工作</li>\\n<li>使用 PgBouncer 池化器提高效率</li>\\n<li>如何安装和配置 PgBouncer</li>\\n</ul>\"}")
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
