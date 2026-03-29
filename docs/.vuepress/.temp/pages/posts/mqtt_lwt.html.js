import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/mqtt_lwt.html.vue"
const data = JSON.parse("{\"path\":\"/posts/mqtt_lwt.html\",\"title\":\"MQTT 协议下的Last Will and Testament（LWT，遗嘱消息）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"MQTT\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/mqtt_lwt.md\",\"excerpt\":\"\\n<p>Last Will and Testament（LWT，遗嘱消息）其作用是当客户端异常断开（如网络中断）时，EMQ X 自动发布一条预设的遗嘱消息，通知系统该用户离线。</p>\\n<p>该消息由MQTT的服务端（Broker）发出。</p>\\n<p>该消息，在客户端正常离线的时候不会被发出，只有客户端非正常断开网络连接的时候才会发出。</p>\\n<p>LWT的Topic设计上，从两个维度设计分别为：</p>\\n<ol>\\n<li>用户维度：<code>user/status/{user_id}</code></li>\\n<li>设备维度：<code>device/status/{device_id}</code></li>\\n</ol>\"}")
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
