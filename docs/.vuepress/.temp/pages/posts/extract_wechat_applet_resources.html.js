import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/extract_wechat_applet_resources.html.vue"
const data = JSON.parse("{\"path\":\"/posts/extract_wechat_applet_resources.html\",\"title\":\"如何获取微信小程序的资源\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"微信小程序\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"小程序所在的位置\",\"slug\":\"小程序所在的位置\",\"link\":\"#小程序所在的位置\",\"children\":[]},{\"level\":2,\"title\":\"解包小程序的程序\",\"slug\":\"解包小程序的程序\",\"link\":\"#解包小程序的程序\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/extract_wechat_applet_resources.md\",\"excerpt\":\"\\n<p>之前，都是找的Andriod的文件，但是，这很麻烦，因为需要Root，不然无法访问。找到文件，拷贝也是一件很麻烦的事情。</p>\\n<p>现在，电脑版的微信也是可以使用小程序的，所以，从电脑上去寻找小程序的资源就变得切实可行。</p>\\n<h2>小程序所在的位置</h2>\\n<p>首先，它有两个路径：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">C:<span class=\\\"token punctuation\\\">\\\\</span>Users<span class=\\\"token punctuation\\\">\\\\</span><span class=\\\"token punctuation\\\">{</span>Windows用户名<span class=\\\"token punctuation\\\">}</span><span class=\\\"token punctuation\\\">\\\\</span>Documents<span class=\\\"token punctuation\\\">\\\\</span>WeChat Files<span class=\\\"token punctuation\\\">\\\\</span>Applet<span class=\\\"token punctuation\\\">\\\\</span><span class=\\\"token punctuation\\\">{</span>小程序ID<span class=\\\"token punctuation\\\">}</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
