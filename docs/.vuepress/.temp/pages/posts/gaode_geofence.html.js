import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/gaode_geofence.html.vue"
const data = JSON.parse("{\"path\":\"/posts/gaode_geofence.html\",\"title\":\"使用高德地图实现地理围栏\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"物联网开发\"],\"tag\":[\"地理围栏\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是地理围栏(Geo-fencing)?\",\"slug\":\"什么是地理围栏-geo-fencing\",\"link\":\"#什么是地理围栏-geo-fencing\",\"children\":[]},{\"level\":2,\"title\":\"地理坐标系\",\"slug\":\"地理坐标系\",\"link\":\"#地理坐标系\",\"children\":[{\"level\":3,\"title\":\"WGS-84 - 世界大地测量系统\",\"slug\":\"wgs-84-世界大地测量系统\",\"link\":\"#wgs-84-世界大地测量系统\",\"children\":[]},{\"level\":3,\"title\":\"GCJ-02 - 国测局坐标\",\"slug\":\"gcj-02-国测局坐标\",\"link\":\"#gcj-02-国测局坐标\",\"children\":[]},{\"level\":3,\"title\":\"BD-09 - 百度坐标系\",\"slug\":\"bd-09-百度坐标系\",\"link\":\"#bd-09-百度坐标系\",\"children\":[]},{\"level\":3,\"title\":\"地理坐标系列表\",\"slug\":\"地理坐标系列表\",\"link\":\"#地理坐标系列表\",\"children\":[]}]},{\"level\":2,\"title\":\"地理围栏 GeoJSON 数据\",\"slug\":\"地理围栏-geojson-数据\",\"link\":\"#地理围栏-geojson-数据\",\"children\":[{\"level\":3,\"title\":\"标准GeoJSON\",\"slug\":\"标准geojson\",\"link\":\"#标准geojson\",\"children\":[]},{\"level\":3,\"title\":\"扩展GeoJSON\",\"slug\":\"扩展geojson\",\"link\":\"#扩展geojson\",\"children\":[]}]},{\"level\":2,\"title\":\"高德地图\",\"slug\":\"高德地图\",\"link\":\"#高德地图\",\"children\":[{\"level\":3,\"title\":\"1. GeoJSON工具类\",\"slug\":\"_1-geojson工具类\",\"link\":\"#_1-geojson工具类\",\"children\":[]},{\"level\":3,\"title\":\"2. 矢量图形类\",\"slug\":\"_2-矢量图形类\",\"link\":\"#_2-矢量图形类\",\"children\":[]},{\"level\":3,\"title\":\"3. 编辑器工具类\",\"slug\":\"_3-编辑器工具类\",\"link\":\"#_3-编辑器工具类\",\"children\":[]},{\"level\":3,\"title\":\"3. 鼠标工具插件\",\"slug\":\"_3-鼠标工具插件\",\"link\":\"#_3-鼠标工具插件\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/gaode_geofence.md\",\"excerpt\":\"\\n<h2>什么是地理围栏(Geo-fencing)?</h2>\\n<p>地理围栏（Geo-fencing）是LBS的一种新应用，就是用一个虚拟的栅栏围出一个虚拟地理边界。当手机进入、离开某个特定地理区域，或在该区域内活动时，手机可以接收自动通知和警告。有了地理围栏技术，位置社交网站就可以帮助用户在进入某一地区时自动登记。</p>\\n<h2>地理坐标系</h2>\\n<p>我们通常用经纬度来表示一个地理位置，但是由于一些原因，我们从不同渠道得到的经纬度信息可能并不是在同一个坐标系下。</p>\\n<ul>\\n<li>高德地图、腾讯地图以及谷歌中国区地图使用的是<strong>GCJ-02</strong>坐标系</li>\\n<li>百度地图使用的是<strong>BD-09</strong>坐标系</li>\\n<li>底层接口(HTML5 Geolocation或ios、安卓API)通过GPS设备获取的坐标使用的是<strong>WGS-84</strong>坐标系</li>\\n</ul>\"}")
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
