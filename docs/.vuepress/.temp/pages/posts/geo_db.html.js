import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/geo_db.html.vue"
const data = JSON.parse("{\"path\":\"/posts/geo_db.html\",\"title\":\"地理空间搜索\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"物联网开发\"],\"tag\":[\"GEO\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Redis\",\"slug\":\"redis\",\"link\":\"#redis\",\"children\":[{\"level\":3,\"title\":\"索引地理位置信息\",\"slug\":\"索引地理位置信息\",\"link\":\"#索引地理位置信息\",\"children\":[]},{\"level\":3,\"title\":\"获取GeoHash值\",\"slug\":\"获取geohash值\",\"link\":\"#获取geohash值\",\"children\":[]},{\"level\":3,\"title\":\"求两点距离\",\"slug\":\"求两点距离\",\"link\":\"#求两点距离\",\"children\":[]},{\"level\":3,\"title\":\"返回经纬度坐标点\",\"slug\":\"返回经纬度坐标点\",\"link\":\"#返回经纬度坐标点\",\"children\":[]},{\"level\":3,\"title\":\"区域搜索\",\"slug\":\"区域搜索\",\"link\":\"#区域搜索\",\"children\":[]}]},{\"level\":2,\"title\":\"PostGIS\",\"slug\":\"postgis\",\"link\":\"#postgis\",\"children\":[{\"level\":3,\"title\":\"安装PostGIS插件\",\"slug\":\"安装postgis插件\",\"link\":\"#安装postgis插件\",\"children\":[]},{\"level\":3,\"title\":\"创建测试表\",\"slug\":\"创建测试表\",\"link\":\"#创建测试表\",\"children\":[]},{\"level\":3,\"title\":\"插入测试数据\",\"slug\":\"插入测试数据\",\"link\":\"#插入测试数据\",\"children\":[]},{\"level\":3,\"title\":\"典型空间查询SQL\",\"slug\":\"典型空间查询sql\",\"link\":\"#典型空间查询sql\",\"children\":[]}]},{\"level\":2,\"title\":\"ClickHouse\",\"slug\":\"clickhouse\",\"link\":\"#clickhouse\",\"children\":[]},{\"level\":2,\"title\":\"Elasticsearch\",\"slug\":\"elasticsearch\",\"link\":\"#elasticsearch\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/geo_db.md\",\"excerpt\":\"\\n<h2>Redis</h2>\\n<p>Redis 3.2.0版本开始，提供了<code>GEO</code>系列命令，可以用搜索、索引地理位置信息。</p>\\n<h3>索引地理位置信息</h3>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">GEOADD Sicily <span class=\\\"token number\\\">13.361389</span> <span class=\\\"token number\\\">38.115556</span> <span class=\\\"token string\\\">\\\"Palermo\\\"</span> <span class=\\\"token number\\\">15.087269</span> <span class=\\\"token number\\\">37.502669</span> <span class=\\\"token string\\\">\\\"Catania\\\"</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
