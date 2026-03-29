import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_publish_android_app_to_google_play.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_publish_android_app_to_google_play.html\",\"title\":\"如何发布Android APP到Google Play\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Android\",\"Google Play\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"生成签名\",\"slug\":\"生成签名\",\"link\":\"#生成签名\",\"children\":[]},{\"level\":2,\"title\":\"创建key.properties\",\"slug\":\"创建key-properties\",\"link\":\"#创建key-properties\",\"children\":[]},{\"level\":2,\"title\":\"修改build.gradle\",\"slug\":\"修改build-gradle\",\"link\":\"#修改build-gradle\",\"children\":[{\"level\":3,\"title\":\"app/build.gradle\",\"slug\":\"app-build-gradle\",\"link\":\"#app-build-gradle\",\"children\":[]},{\"level\":3,\"title\":\"app/build.gradle.kts\",\"slug\":\"app-build-gradle-kts\",\"link\":\"#app-build-gradle-kts\",\"children\":[]}]},{\"level\":2,\"title\":\"提交Google Play\",\"slug\":\"提交google-play\",\"link\":\"#提交google-play\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/how_to_publish_android_app_to_google_play.md\",\"excerpt\":\"\\n<h2>生成签名</h2>\\n<p>在项目的android目录下执行以下命令：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">keytool  <span class=\\\"token parameter variable\\\">-genkey</span> <span class=\\\"token parameter variable\\\">-v</span> <span class=\\\"token parameter variable\\\">-keystore</span> ./app_key.jks <span class=\\\"token parameter variable\\\">-keyalg</span> RSA <span class=\\\"token parameter variable\\\">-keysize</span> <span class=\\\"token number\\\">4096</span> <span class=\\\"token parameter variable\\\">-validity</span> <span class=\\\"token number\\\">10000</span> <span class=\\\"token parameter variable\\\">-alias</span> flutter_key</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
