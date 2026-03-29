import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/develop_jitsi_meet.html.vue"
const data = JSON.parse("{\"path\":\"/posts/develop_jitsi_meet.html\",\"title\":\"部署Jitsi Meet\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Jitsi Meet\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Jitsi项目组成\",\"slug\":\"jitsi项目组成\",\"link\":\"#jitsi项目组成\",\"children\":[]},{\"level\":2,\"title\":\"部署\",\"slug\":\"部署\",\"link\":\"#部署\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/develop_jitsi_meet.md\",\"excerpt\":\"\\n<h2>Jitsi项目组成</h2>\\n<ul>\\n<li><strong>Jitsi Meet</strong>，与WebRTC兼容的JavaScript应用程序，使用Jitsi Videobridge提供高质量、可扩展的视频会议。基于React和React Native构建</li>\\n<li><strong>Jitsi Videobridge（JVB）</strong> - 与WebRTC兼容的服务器，用于在会议参与者之间路由视频流。</li>\\n<li><strong>Jitsi Conference Focus (jicofo)</strong> - 用于Jitsi会议的服务器端焦点组件，用于管理媒体会话，并充当每个参与者和视频桥之间的负载平衡器。</li>\\n<li><strong>Jitsi Gateway to SIP (jigasi)</strong> - 允许常规SIP客户端加入Jitsi会议的服务器端应用程序</li>\\n<li><strong>Jitsi Broadcasting Infrastructure (jibri)</strong> - 用于录制和/或流式传输Jitsi会议的一组工具，通过启动虚拟帧缓冲区中呈现的Chrome实例，并使用ffmpeg捕获和编码输出来工作</li>\\n</ul>\"}")
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
