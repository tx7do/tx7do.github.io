import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/selenium_stale_element_reference.html.vue"
const data = JSON.parse("{\"path\":\"/posts/selenium_stale_element_reference.html\",\"title\":\"解决Selenium的报错：stale element reference: element is not attached to the page document\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Selenium\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"有问题的代码\",\"slug\":\"有问题的代码\",\"link\":\"#有问题的代码\",\"children\":[]},{\"level\":2,\"title\":\"解决方案\",\"slug\":\"解决方案\",\"link\":\"#解决方案\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/selenium_stale_element_reference.md\",\"excerpt\":\"\\n<p>第一次使用Selenium后，在循环处理时，我遇到了一个莫名其妙的错误，我被卡住了一阵子，故而我留下本文作为备忘录。</p>\\n<div class=\\\"language-text line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"text\\\"><pre><code><span class=\\\"line\\\">stale element reference: element is not attached to the page document</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
