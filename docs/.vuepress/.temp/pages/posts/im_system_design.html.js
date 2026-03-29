import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/im_system_design.html.vue"
const data = JSON.parse("{\"path\":\"/posts/im_system_design.html\",\"title\":\"大群组IM设计\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"架构设计\"],\"tag\":[\"IM\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/im_system_design.md\",\"excerpt\":\"\\n<h2>参考资料</h2>\\n<ul>\\n<li><a href=\\\"https://www.infoq.cn/article/the-road-of-the-growth-weixin-background\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">从无到有：微信后台系统的演进之路</a></li>\\n<li><a href=\\\"https://doc.yunxin.163.com/messaging-enhanced/guide/TY3MzM1ODg?platform=web\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">网易云信 - 超大群概述</a></li>\\n<li><a href=\\\"https://cloud.tencent.com/developer/article/1869748\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">IM技术分享：万人群聊消息投递方案的思考和实践</a></li>\\n<li><a href=\\\"http://www.52im.net/thread-1230-1-1.html\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">现代IM系统中聊天消息的同步和存储方案探讨</a></li>\\n</ul>\"}")
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
