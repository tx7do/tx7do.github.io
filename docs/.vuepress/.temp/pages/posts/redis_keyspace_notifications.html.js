import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/redis_keyspace_notifications.html.vue"
const data = JSON.parse("{\"path\":\"/posts/redis_keyspace_notifications.html\",\"title\":\"Redis键空间通知\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Redis\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"测试\",\"slug\":\"测试\",\"link\":\"#测试\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/redis_keyspace_notifications.md\",\"excerpt\":\"\\n<p>有需求，Key到期的时候需要一个通知给服务器端用于感知数据的改变。刚好Redis提供了一个Keyspace Notifications功能，可以让服务器端监听某个Key的到期事件。</p>\\n<p>官方文档说，这个功能是很耗费CPU的，所以，默认是关闭的。需要开启的话，可以使用命令：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">config <span class=\\\"token builtin class-name\\\">set</span> notify-keyspace-events KEA</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
