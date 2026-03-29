import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/server_benchmark.html.vue"
const data = JSON.parse("{\"path\":\"/posts/server_benchmark.html\",\"title\":\"服务器基准测试\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"基准测试\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"利特尔法则(Little’s law)\",\"slug\":\"利特尔法则-little-s-law\",\"link\":\"#利特尔法则-little-s-law\",\"children\":[]},{\"level\":2,\"title\":\"吞吐率 RPS（Requests Per Second）\",\"slug\":\"吞吐率-rps-requests-per-second\",\"link\":\"#吞吐率-rps-requests-per-second\",\"children\":[{\"level\":3,\"title\":\"计算公式\",\"slug\":\"计算公式\",\"link\":\"#计算公式\",\"children\":[]}]},{\"level\":2,\"title\":\"每秒查询数 QPS（Query Per Second）\",\"slug\":\"每秒查询数-qps-query-per-second\",\"link\":\"#每秒查询数-qps-query-per-second\",\"children\":[{\"level\":3,\"title\":\"计算公式\",\"slug\":\"计算公式-1\",\"link\":\"#计算公式-1\",\"children\":[]}]},{\"level\":2,\"title\":\"每秒事务数 TPS（Transactions Per Second）\",\"slug\":\"每秒事务数-tps-transactions-per-second\",\"link\":\"#每秒事务数-tps-transactions-per-second\",\"children\":[]},{\"level\":2,\"title\":\"响应时间 RT（Response-time）\",\"slug\":\"响应时间-rt-response-time\",\"link\":\"#响应时间-rt-response-time\",\"children\":[]},{\"level\":2,\"title\":\"并发连接数（The number of concurrent connections）\",\"slug\":\"并发连接数-the-number-of-concurrent-connections\",\"link\":\"#并发连接数-the-number-of-concurrent-connections\",\"children\":[]},{\"level\":2,\"title\":\"并发用户数（The number of concurrent users, Concurrency Level）\",\"slug\":\"并发用户数-the-number-of-concurrent-users-concurrency-level\",\"link\":\"#并发用户数-the-number-of-concurrent-users-concurrency-level\",\"children\":[]},{\"level\":2,\"title\":\"用户平均请求等待时间（Time per requests）\",\"slug\":\"用户平均请求等待时间-time-per-requests\",\"link\":\"#用户平均请求等待时间-time-per-requests\",\"children\":[]},{\"level\":2,\"title\":\"服务器平均请求等待时间（Time per requests: across all concurrent requests）\",\"slug\":\"服务器平均请求等待时间-time-per-requests-across-all-concurrent-requests\",\"link\":\"#服务器平均请求等待时间-time-per-requests-across-all-concurrent-requests\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/server_benchmark.md\",\"excerpt\":\"\\n<p>基准测试（benchmark）是针对系统设计的一种压力测试，目标是为了掌握系统的行为。</p>\\n<h2>利特尔法则(Little’s law)</h2>\\n<p>利特尔法则（英语：Little's law），基于等候理论，由约翰·利特尔在1954年提出。利特尔法则可用于一个稳定的、非占先式的系统中。</p>\\n<p>利特尔法则可用来确定在途存货的数量。此法则认为，系统中的平均存货等于存货单位离开系统的比率（亦即平均需求率）与存货单位在系统中平均时间的乘积。</p>\\n<p>利特尔法则的公式描述为：</p>\\n<p><strong>Lead Time(产出时间) = 存货数量 × 生产节拍</strong> 或 <strong>TH(生产效率) = WIP(存货数量) / CT(周期时间)</strong></p>\"}")
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
