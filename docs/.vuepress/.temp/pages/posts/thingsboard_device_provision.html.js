import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/thingsboard_device_provision.html.vue"
const data = JSON.parse("{\"path\":\"/posts/thingsboard_device_provision.html\",\"title\":\"ThingsBoard设备激活\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"物联网开发\"],\"tag\":[\"ThingsBoard\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/thingsboard_device_provision.md\",\"excerpt\":\"\\n<ul>\\n<li>HTTP POST <code>/provision</code></li>\\n</ul>\\n<p>递交给<code>HttpTransportContext</code></p>\\n<p>传递到了<code>DefaultTransportService::process</code>当中做处理。</p>\\n<div class=\\\"language-java line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"java\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token keyword\\\">public</span> <span class=\\\"token keyword\\\">enum</span> <span class=\\\"token class-name\\\">DeviceProfileProvisionType</span> <span class=\\\"token punctuation\\\">{</span></span>\\n<span class=\\\"line\\\">    <span class=\\\"token constant\\\">DISABLED</span><span class=\\\"token punctuation\\\">,</span></span>\\n<span class=\\\"line\\\">    <span class=\\\"token constant\\\">ALLOW_CREATE_NEW_DEVICES</span><span class=\\\"token punctuation\\\">,</span></span>\\n<span class=\\\"line\\\">    <span class=\\\"token constant\\\">CHECK_PRE_PROVISIONED_DEVICES</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token punctuation\\\">}</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
