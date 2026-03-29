import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cloud_phone.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cloud_phone.html\",\"title\":\"云手机\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"架构设计\"],\"tag\":[\"云手机\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"虚拟手机开源方案\",\"slug\":\"虚拟手机开源方案\",\"link\":\"#虚拟手机开源方案\",\"children\":[]},{\"level\":2,\"title\":\"云真机开源解决方案\",\"slug\":\"云真机开源解决方案\",\"link\":\"#云真机开源解决方案\",\"children\":[]},{\"level\":2,\"title\":\"打开Linux内核的Binder 和 Ashmem\",\"slug\":\"打开linux内核的binder-和-ashmem\",\"link\":\"#打开linux内核的binder-和-ashmem\",\"children\":[{\"level\":3,\"title\":\"为什么需要 Binder 和 Ashmem？\",\"slug\":\"为什么需要-binder-和-ashmem\",\"link\":\"#为什么需要-binder-和-ashmem\",\"children\":[]},{\"level\":3,\"title\":\"如何确认内核是否支持？\",\"slug\":\"如何确认内核是否支持\",\"link\":\"#如何确认内核是否支持\",\"children\":[]},{\"level\":3,\"title\":\"若模块未加载，手动加载\",\"slug\":\"若模块未加载-手动加载\",\"link\":\"#若模块未加载-手动加载\",\"children\":[]},{\"level\":3,\"title\":\"持久化加载配置\",\"slug\":\"持久化加载配置\",\"link\":\"#持久化加载配置\",\"children\":[]}]},{\"level\":2,\"title\":\"Waydroid\",\"slug\":\"waydroid\",\"link\":\"#waydroid\",\"children\":[]},{\"level\":2,\"title\":\"ReDroid\",\"slug\":\"redroid\",\"link\":\"#redroid\",\"children\":[{\"level\":3,\"title\":\"cnflysky/redroid-rk3588\",\"slug\":\"cnflysky-redroid-rk3588\",\"link\":\"#cnflysky-redroid-rk3588\",\"children\":[]},{\"level\":3,\"title\":\"redroid/redroid\",\"slug\":\"redroid-redroid\",\"link\":\"#redroid-redroid\",\"children\":[]},{\"level\":3,\"title\":\"shangzebei/rk3588\",\"slug\":\"shangzebei-rk3588\",\"link\":\"#shangzebei-rk3588\",\"children\":[]},{\"level\":3,\"title\":\"dobox:rk3588\",\"slug\":\"dobox-rk3588\",\"link\":\"#dobox-rk3588\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cloud_phone.md\",\"excerpt\":\"\\n<ul>\\n<li>Waydroid只能单开一个Android实例，所以要批量部署，可能需要部署多个宿主Ubuntu；</li>\\n<li>Redroid基于Docker部署，一个宿主可以部署多个。</li>\\n</ul>\\n<h2>虚拟手机开源方案</h2>\\n<ul>\\n<li><a href=\\\"https://github.com/remote-android/redroid-doc\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">ReDroid (Remote anDroid)</a> Docker + AnBox</li>\\n<li><a href=\\\"https://waydro.id/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Waydroid</a> LXC + AnBox</li>\\n<li><a href=\\\"https://www.android-x86.org/\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Android-x86</a></li>\\n<li><a href=\\\"https://blissos.org/index.html#download\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">BlissOS</a></li>\\n</ul>\"}")
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
