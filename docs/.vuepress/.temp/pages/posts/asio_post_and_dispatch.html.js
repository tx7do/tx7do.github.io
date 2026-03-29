import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/asio_post_and_dispatch.html.vue"
const data = JSON.parse("{\"path\":\"/posts/asio_post_and_dispatch.html\",\"title\":\"ASIO的post和dispatch方法\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"C++编程\"],\"tag\":[\"ASIO\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/asio_post_and_dispatch.md\",\"excerpt\":\"\\n<p>关于这两个方法，我去网上找了一大堆资料，都没有讲清楚是怎么一回事。还是读了ASIO的源代码这才理解。</p>\\n<p>要提到这两个方法，不得不提一下Windows的两个API：<code>SendMessage</code>和<code>PostMessage</code>。</p>\\n<p><code>io_context::post</code>跟<code>PostMessage</code>的行为差不多，投递完消息立即返回，Handler的执行跟它没有半毛钱的关系。</p>\\n<p><code>io_context::dispatch</code>可以认为是<code>SendMessage</code>的超集，<code>SendMessage</code>是阻塞的，必须要在消息处理完成之后才返回，当<code>io_context::dispatch</code>在<code>io_context</code>的工作线程中被调用的时候，<code>io_context::dispatch</code>的行为和<code>SendMessage</code>是一致的，必须要在Handler调用完成之后才返回。但是，如果不是io_context的工作线程中调用，则执行了<code>io_context::post</code>一样的行为：将Handler投递到<code>io_context</code>的事件队列中去。</p>\"}")
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
