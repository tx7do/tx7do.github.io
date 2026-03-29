import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/thingsboard_device_credentials.html.vue"
const data = JSON.parse("{\"path\":\"/posts/thingsboard_device_credentials.html\",\"title\":\"ThingsBoard设备登陆认证\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"物联网开发\"],\"tag\":[\"ThingsBoard\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"ThingsBoard设备有关的表\",\"slug\":\"thingsboard设备有关的表\",\"link\":\"#thingsboard设备有关的表\",\"children\":[]},{\"level\":2,\"title\":\"支持的凭证类型\",\"slug\":\"支持的凭证类型\",\"link\":\"#支持的凭证类型\",\"children\":[]},{\"level\":2,\"title\":\"前端定义的相关类\",\"slug\":\"前端定义的相关类\",\"link\":\"#前端定义的相关类\",\"children\":[]},{\"level\":2,\"title\":\"后端定义的相关类\",\"slug\":\"后端定义的相关类\",\"link\":\"#后端定义的相关类\",\"children\":[]},{\"level\":2,\"title\":\"各类型凭证如何存数据\",\"slug\":\"各类型凭证如何存数据\",\"link\":\"#各类型凭证如何存数据\",\"children\":[{\"level\":3,\"title\":\"访问令牌\",\"slug\":\"访问令牌\",\"link\":\"#访问令牌\",\"children\":[]},{\"level\":3,\"title\":\"MQTT验证信息\",\"slug\":\"mqtt验证信息\",\"link\":\"#mqtt验证信息\",\"children\":[]},{\"level\":3,\"title\":\"x509证书\",\"slug\":\"x509证书\",\"link\":\"#x509证书\",\"children\":[]}]},{\"level\":2,\"title\":\"如何登陆认证设备\",\"slug\":\"如何登陆认证设备\",\"link\":\"#如何登陆认证设备\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/thingsboard_device_credentials.md\",\"excerpt\":\"\\n<h2>ThingsBoard设备有关的表</h2>\\n<p><img src=\\\"/assets/images/thingsboard/thingsboard_device_table.png\\\" alt=\\\"thingsboard_device_table\\\"></p>\\n<ul>\\n<li><strong>device_profile</strong> 这个表相当于国内的“产品”的概念</li>\\n<li><strong>ota_package</strong> 这个表是OTA升级包相关的数据</li>\\n<li><strong>device</strong> 这个表是设备的数据</li>\\n<li><strong>device_credentials</strong> 这个表是设备的登陆验证凭证信息</li>\\n</ul>\"}")
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
