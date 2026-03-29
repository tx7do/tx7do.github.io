import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/ohlc.html.vue"
const data = JSON.parse("{\"path\":\"/posts/ohlc.html\",\"title\":\"OHLC\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"量化开发\"],\"tag\":[\"OHLC\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"OHLC\",\"slug\":\"ohlc-1\",\"link\":\"#ohlc-1\",\"children\":[]},{\"level\":2,\"title\":\"OHLCV\",\"slug\":\"ohlcv\",\"link\":\"#ohlcv\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/ohlc.md\",\"excerpt\":\"\\n<h2>OHLC</h2>\\n<ul>\\n<li>开盘价（Open）：这被视为特定时间段或时间范围开始时资产或加密代币的开盘价。</li>\\n<li>最高价（High）：这是给定时间范围内资产交易的最高价格</li>\\n<li>最低价（Low）：这是指定时间段内资产的最低交易价格。</li>\\n<li>收盘价（Close）：这是指定时间结束时资产的最后交易价格。</li>\\n</ul>\\n<h2>OHLCV</h2>\\n<ul>\\n<li>Open: opening price</li>\\n<li>High: highest price</li>\\n<li>Low: lowest price</li>\\n<li>Close: closing price</li>\\n<li>Volume: volume of transactions</li>\\n</ul>\"}")
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
