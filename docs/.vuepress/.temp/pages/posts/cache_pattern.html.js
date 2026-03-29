import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cache_pattern.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cache_pattern.html\",\"title\":\"5种服务端缓存设计模式\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"设计模式\"],\"tag\":[\"设计模式\",\"Cache Aside Pattern\",\"缓存设计模式\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Cache Aside Pattern\",\"slug\":\"cache-aside-pattern\",\"link\":\"#cache-aside-pattern\",\"children\":[{\"level\":3,\"title\":\"读取的步骤\",\"slug\":\"读取的步骤\",\"link\":\"#读取的步骤\",\"children\":[]},{\"level\":3,\"title\":\"写入的步骤\",\"slug\":\"写入的步骤\",\"link\":\"#写入的步骤\",\"children\":[]},{\"level\":3,\"title\":\"可能存在的问题\",\"slug\":\"可能存在的问题\",\"link\":\"#可能存在的问题\",\"children\":[]}]},{\"level\":2,\"title\":\"Read-Through Pattern\",\"slug\":\"read-through-pattern\",\"link\":\"#read-through-pattern\",\"children\":[]},{\"level\":2,\"title\":\"Write-Through Pattern\",\"slug\":\"write-through-pattern\",\"link\":\"#write-through-pattern\",\"children\":[]},{\"level\":2,\"title\":\"Write-Behind Pattern\",\"slug\":\"write-behind-pattern\",\"link\":\"#write-behind-pattern\",\"children\":[]},{\"level\":2,\"title\":\"Refresh-Ahead Pattern\",\"slug\":\"refresh-ahead-pattern\",\"link\":\"#refresh-ahead-pattern\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cache_pattern.md\",\"excerpt\":\"\\n<h2>Cache Aside Pattern</h2>\\n<p>Cache Aside Pattern是最经典的缓存 + 数据库读写的模式。</p>\\n<ol>\\n<li>读的时候，先读缓存，缓存没有的话，那么就读数据库，然后取出数据后放入缓存，同时返回响应</li>\\n<li>更新的时候，先更新缓存，然后再更新数据库（缓存和数据库双写）</li>\\n</ol>\\n<p>最大的缺点就是需要应用程序侧来编排读写流程。</p>\\n<h3>读取的步骤</h3>\\n<ol>\\n<li>先从缓存中读取数据；</li>\\n<li>如果缓存数据不存在，那么从数据库中读取数据；</li>\\n<li>写入缓存。</li>\\n</ol>\"}")
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
