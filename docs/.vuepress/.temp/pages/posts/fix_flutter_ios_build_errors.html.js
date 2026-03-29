import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/fix_flutter_ios_build_errors.html.vue"
const data = JSON.parse("{\"path\":\"/posts/fix_flutter_ios_build_errors.html\",\"title\":\"修复Flutter一些iOS编译错误\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Flutter编程\"],\"tag\":[\"Flutter\",\"iOS\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Сocoapods trunk URL couldn’t be downloaded\",\"slug\":\"сocoapods-trunk-url-couldn-t-be-downloaded\",\"link\":\"#сocoapods-trunk-url-couldn-t-be-downloaded\",\"children\":[]},{\"level\":2,\"title\":\"CocoaPods did not set the base configuration\",\"slug\":\"cocoapods-did-not-set-the-base-configuration\",\"link\":\"#cocoapods-did-not-set-the-base-configuration\",\"children\":[]},{\"level\":2,\"title\":\"Framework 'Pods_Runner' not found\",\"slug\":\"framework-pods-runner-not-found\",\"link\":\"#framework-pods-runner-not-found\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/fix_flutter_ios_build_errors.md\",\"excerpt\":\"\\n<h2>Сocoapods trunk URL couldn’t be downloaded</h2>\\n<p>逐行运行此命令</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">gem uninstall cocoapods </span>\\n<span class=\\\"line\\\">arch <span class=\\\"token parameter variable\\\">-x86_64</span> brew <span class=\\\"token function\\\">install</span> cocoapods </span>\\n<span class=\\\"line\\\">arch <span class=\\\"token parameter variable\\\">-x86_64</span> brew reinstall cocoapods </span>\\n<span class=\\\"line\\\"><span class=\\\"token builtin class-name\\\">cd</span> ios </span>\\n<span class=\\\"line\\\">pod cache clean <span class=\\\"token parameter variable\\\">--all</span> </span>\\n<span class=\\\"line\\\">pod <span class=\\\"token function\\\">install</span> （如果m1 macOS 运行这个“arch <span class=\\\"token parameter variable\\\">-x86_64</span> pod install”）</span>\\n<span class=\\\"line\\\">pod update</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
