import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/spine_downgrading_version.html.vue"
const data = JSON.parse("{\"path\":\"/posts/spine_downgrading_version.html\",\"title\":\"Spine骨骼动画版本降级\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"Spine\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"下载Skeleton Viewer\",\"slug\":\"下载skeleton-viewer\",\"link\":\"#下载skeleton-viewer\",\"children\":[]},{\"level\":2,\"title\":\"打开界面\",\"slug\":\"打开界面\",\"link\":\"#打开界面\",\"children\":[]},{\"level\":2,\"title\":\"降级\",\"slug\":\"降级\",\"link\":\"#降级\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/spine_downgrading_version.md\",\"excerpt\":\"\\n<h2>下载Skeleton Viewer</h2>\\n<p>下载页面：<a href=\\\"https://zh.esotericsoftware.com/spine-skeleton-viewer\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://zh.esotericsoftware.com/spine-skeleton-viewer</a></p>\\n<h2>打开界面</h2>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">java</span> <span class=\\\"token parameter variable\\\">-jar</span> skeletonViewer.jar</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
