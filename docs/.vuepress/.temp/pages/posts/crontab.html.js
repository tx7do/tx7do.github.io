import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/crontab.html.vue"
const data = JSON.parse("{\"path\":\"/posts/crontab.html\",\"title\":\"crontab\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"crontab\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是cron表达式？\",\"slug\":\"什么是cron表达式\",\"link\":\"#什么是cron表达式\",\"children\":[]},{\"level\":2,\"title\":\"cron表达式的格式\",\"slug\":\"cron表达式的格式\",\"link\":\"#cron表达式的格式\",\"children\":[]},{\"level\":2,\"title\":\"crontab表达式的格式\",\"slug\":\"crontab表达式的格式\",\"link\":\"#crontab表达式的格式\",\"children\":[]},{\"level\":2,\"title\":\"cron表达式每个字段的允许值\",\"slug\":\"cron表达式每个字段的允许值\",\"link\":\"#cron表达式每个字段的允许值\",\"children\":[]},{\"level\":2,\"title\":\"cron表达式的案列\",\"slug\":\"cron表达式的案列\",\"link\":\"#cron表达式的案列\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/crontab.md\",\"excerpt\":\"\\n<h2>什么是cron表达式？</h2>\\n<p>cron表达式是一个具有时间含义的字符串，一般用于定义定时任务的执行时间。</p>\\n<h2>cron表达式的格式</h2>\\n<p>cron使用6-7位制的格式：</p>\\n<div class=\\\"language-text line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"text\\\"><pre><code><span class=\\\"line\\\">{秒数} {分钟} {小时} {日期} {月份} {星期} {年份（可为空）}</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
