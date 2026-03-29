import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/fix_build_bug_android_studio_upgrade_to_ladybug.html.vue"
const data = JSON.parse("{\"path\":\"/posts/fix_build_bug_android_studio_upgrade_to_ladybug.html\",\"title\":\"解决 Flutter 项目更新至 Android Studio Ladybug (2024.2.1) 后出现的问题\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Flutter编程\"],\"tag\":[\"Flutter\",\"Android Studio\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Your project is configured with Android NDK 23.1.7779620\",\"slug\":\"your-project-is-configured-with-android-ndk-23-1-7779620\",\"link\":\"#your-project-is-configured-with-android-ndk-23-1-7779620\",\"children\":[]},{\"level\":2,\"title\":\"Dependency ':flutter_local_notifications' requires core library desugaring to be enabled\",\"slug\":\"dependency-flutter-local-notifications-requires-core-library-desugaring-to-be-enabled\",\"link\":\"#dependency-flutter-local-notifications-requires-core-library-desugaring-to-be-enabled\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/fix_build_bug_android_studio_upgrade_to_ladybug.md\",\"excerpt\":\"\\n<p>升级到Android Studio Ladybug | 2024.2.1后，我在 Flutter 项目中遇到了一些问题。幸运的是，我通过修改一些配置文件找到了一个简单的解决方案。如果您面临类似的挑战，请按照以下步骤让您的项目重回正轨。</p>\\n<p>修改<code>settings.gradle</code>：</p>\\n<div class=\\\"language-gradle line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"gradle\\\"><pre><code><span class=\\\"line\\\">id <span class=\\\"token interpolation-string\\\"><span class=\\\"token string\\\">\\\"com.android.application\\\"</span></span> version <span class=\\\"token interpolation-string\\\"><span class=\\\"token string\\\">\\\"8.3.2\\\"</span></span> <span class=\\\"token keyword\\\">apply</span> <span class=\\\"token boolean\\\">false</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
