import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/postgresql_docker_container_change_timezone.html.vue"
const data = JSON.parse("{\"path\":\"/posts/postgresql_docker_container_change_timezone.html\",\"title\":\"PostgreSQL Docker容器修改时区\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"PostgreSQL\",\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"环境变量\",\"slug\":\"环境变量\",\"link\":\"#环境变量\",\"children\":[]},{\"level\":2,\"title\":\"数据映射\",\"slug\":\"数据映射\",\"link\":\"#数据映射\",\"children\":[]},{\"level\":2,\"title\":\"修改容器的时区\",\"slug\":\"修改容器的时区\",\"link\":\"#修改容器的时区\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/postgresql_docker_container_change_timezone.md\",\"excerpt\":\"\\n<p>做了一些配置的修改之后，查询到的数据倒是显示的是+8的时区，可是，执行<code>show timezone;</code>之后，不论怎么样都是显示的是<code>UTC</code>时间。</p>\\n<h2>环境变量</h2>\\n<p>docker-compose的相关配置如下：</p>\\n<div class=\\\"language-yaml line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"yml\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token key atrule\\\">services</span><span class=\\\"token punctuation\\\">:</span></span>\\n<span class=\\\"line\\\">  <span class=\\\"token key atrule\\\">postgres</span><span class=\\\"token punctuation\\\">:</span></span>\\n<span class=\\\"line\\\">    <span class=\\\"token key atrule\\\">environment</span><span class=\\\"token punctuation\\\">:</span></span>\\n<span class=\\\"line\\\">      <span class=\\\"token punctuation\\\">-</span> TZ=Asia/Shanghai</span>\\n<span class=\\\"line\\\">      <span class=\\\"token punctuation\\\">-</span> PGTZ=Asia/Shanghai</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
