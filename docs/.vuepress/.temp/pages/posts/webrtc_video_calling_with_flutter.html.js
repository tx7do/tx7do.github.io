import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/webrtc_video_calling_with_flutter.html.vue"
const data = JSON.parse("{\"path\":\"/posts/webrtc_video_calling_with_flutter.html\",\"title\":\"使用 Flutter 进行 WebRTC 视频通话\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"WebRTC\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"介绍\",\"slug\":\"介绍\",\"link\":\"#介绍\",\"children\":[]},{\"level\":2,\"title\":\"设置 flutter_webrtc 插件\",\"slug\":\"设置-flutter-webrtc-插件\",\"link\":\"#设置-flutter-webrtc-插件\",\"children\":[]},{\"level\":2,\"title\":\"添加 WebSocket\",\"slug\":\"添加-websocket\",\"link\":\"#添加-websocket\",\"children\":[]},{\"level\":2,\"title\":\"信令服务器\",\"slug\":\"信令服务器\",\"link\":\"#信令服务器\",\"children\":[]},{\"level\":2,\"title\":\"在对等体之间传输数据\",\"slug\":\"在对等体之间传输数据\",\"link\":\"#在对等体之间传输数据\",\"children\":[]},{\"level\":2,\"title\":\"构建视频渲染器\",\"slug\":\"构建视频渲染器\",\"link\":\"#构建视频渲染器\",\"children\":[]},{\"level\":2,\"title\":\"添加控件\",\"slug\":\"添加控件\",\"link\":\"#添加控件\",\"children\":[]},{\"level\":2,\"title\":\"结论\",\"slug\":\"结论\",\"link\":\"#结论\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/webrtc_video_calling_with_flutter.md\",\"excerpt\":\"\\n<h2>介绍</h2>\\n<p>Flutter 上的 WebRTC 通常通过flutter_webrtc 库实现，该库包含 Flutter 支持的所有平台所需的 WebRTC 代码。该插件抽象出了 WebRTC 中几个难以实现的部分，本文构建的应用程序基于插件中给出的示例代码。</p>\\n<p>在本教程中，我们将向 Flutter 应用程序添加基于 WebRTC 的通话解决方案。</p>\\n<h2>设置 flutter_webrtc 插件</h2>\\n<p>必须设置各种组件才能实现完整的视频通话体验。第一个是将基础 WebRTC 插件添加到您的 Flutter 应用。在本课中，我们仅关注 Android 和 iOS，但请注意，可能需要进行额外设置才能在其他平台上设置类似的体验。</p>\"}")
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
