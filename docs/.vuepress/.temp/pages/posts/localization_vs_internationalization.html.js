import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/localization_vs_internationalization.html.vue"
const data = JSON.parse("{\"path\":\"/posts/localization_vs_internationalization.html\",\"title\":\"游戏的本地化和国际化\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"本地化\",\"国际化\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"国际化 (I18N)\",\"slug\":\"国际化-i18n\",\"link\":\"#国际化-i18n\",\"children\":[]},{\"level\":2,\"title\":\"本地化 (L10N)\",\"slug\":\"本地化-l10n\",\"link\":\"#本地化-l10n\",\"children\":[]},{\"level\":2,\"title\":\"多语言化 (M17N)\",\"slug\":\"多语言化-m17n\",\"link\":\"#多语言化-m17n\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/localization_vs_internationalization.md\",\"excerpt\":\"\\n<p>有3个专有名词：</p>\\n<ul>\\n<li>I18N - 国际化，internationalization，缩写源自于在I和N之间有18个字母。</li>\\n<li>L10N - 本地化，localization，缩写源自于在L和N之间有10个字母。</li>\\n<li>M17N - 多语言化，multilingualization，缩写源自于在M和N之间有17个字母。</li>\\n</ul>\\n<h2>国际化 (I18N)</h2>\\n<p>该术语用于设计、分析和采用支持本地市场甚至全球市场多语言的软件。</p>\\n<p>国际化是指去本地化，移除本地语言写的提示信息，异常信息，区域信息等，采用国际标准或者提取资源。</p>\"}")
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
