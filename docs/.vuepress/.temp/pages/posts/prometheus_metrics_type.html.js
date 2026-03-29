import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/prometheus_metrics_type.html.vue"
const data = JSON.parse("{\"path\":\"/posts/prometheus_metrics_type.html\",\"title\":\"Prometheus的四大指标类型\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Prometheus\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"1. Counter（计数器）\",\"slug\":\"_1-counter-计数器\",\"link\":\"#_1-counter-计数器\",\"children\":[]},{\"level\":2,\"title\":\"2. Gauge（仪表盘）\",\"slug\":\"_2-gauge-仪表盘\",\"link\":\"#_2-gauge-仪表盘\",\"children\":[]},{\"level\":2,\"title\":\"3. Histogram（直方图）\",\"slug\":\"_3-histogram-直方图\",\"link\":\"#_3-histogram-直方图\",\"children\":[]},{\"level\":2,\"title\":\"4. Summary（摘要）\",\"slug\":\"_4-summary-摘要\",\"link\":\"#_4-summary-摘要\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/prometheus_metrics_type.md\",\"excerpt\":\"\\n<p>Prometheus有4大指标类型（Metrics Type），分别是：</p>\\n<ol>\\n<li>Counter（计数器）</li>\\n<li>Gauge（仪表盘）</li>\\n<li>Histogram（直方图）</li>\\n<li>Summary（摘要）</li>\\n</ol>\\n<h2>1. Counter（计数器）</h2>\\n<p>计数器表示一种单调递增的指标，除非发生重置的情况下下只增不减，其样本值应该是不断增大的。</p>\\n<p>例如，可以使用Counter类型的指标来表示服务的请求数、已完成的任务数、错误发生的次数等。</p>\\n<h2>2. Gauge（仪表盘）</h2>\\n<p>仪表盘类型代表一种。它可以理解为状态的快照，Gauge通常用于表示温度或者内存使用率这种指标数据，也可以表示能随时增加或减少的“总数”，例如当前并发请求的数量node_memory_MemFree（主机当前空闲的内容大小）、node_memory_MemAvailable（可用内存大小）等。在使用Gauge时，用户往往希望使用它们等。</p>\"}")
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
