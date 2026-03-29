import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/golang_module_manage.html.vue"
const data = JSON.parse("{\"path\":\"/posts/golang_module_manage.html\",\"title\":\"Golang模块版本管理\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"GO模块版本号\",\"slug\":\"go模块版本号\",\"link\":\"#go模块版本号\",\"children\":[{\"level\":3,\"title\":\"开发中（In development）\",\"slug\":\"开发中-in-development\",\"link\":\"#开发中-in-development\",\"children\":[]},{\"level\":3,\"title\":\"预发布版本（Pre-release version）\",\"slug\":\"预发布版本-pre-release-version\",\"link\":\"#预发布版本-pre-release-version\",\"children\":[]},{\"level\":3,\"title\":\"主版本（Major version）\",\"slug\":\"主版本-major-version\",\"link\":\"#主版本-major-version\",\"children\":[]},{\"level\":3,\"title\":\"次版本（Minor version）\",\"slug\":\"次版本-minor-version\",\"link\":\"#次版本-minor-version\",\"children\":[]},{\"level\":3,\"title\":\"补丁版本（Patch version）\",\"slug\":\"补丁版本-patch-version\",\"link\":\"#补丁版本-patch-version\",\"children\":[]}]},{\"level\":2,\"title\":\"Git管理模块版本号\",\"slug\":\"git管理模块版本号\",\"link\":\"#git管理模块版本号\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/golang_module_manage.md\",\"excerpt\":\"\\n<h2>GO模块版本号</h2>\\n<p>模块的开发人员使用模块版本号的每个部分来表示版本的稳定性和向后兼容性。对于每个新版本，模块的发布版本号具体反映了自上一版本以来模块更改的性质。</p>\\n<p>当您开发使用外部模块的代码时，您可以在考虑升级时使用版本号来了解外部模块的稳定性。当您开发自己的模块时，您的版本号将向其他开发人员表明您的模块的稳定性和向后兼容性。</p>\\n<p>发布的模块在语义版本控制模型中使用版本号发布，如下图所示：</p>\\n<p><img src=\\\"/assets/images/golang/version-number.png\\\" alt=\\\"version-number\\\"></p>\"}")
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
