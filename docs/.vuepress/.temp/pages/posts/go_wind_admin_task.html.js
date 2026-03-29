import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_task.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_task.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：定时任务\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"Asynq概述\",\"slug\":\"asynq概述\",\"link\":\"#asynq概述\",\"children\":[]},{\"level\":2,\"title\":\"Asynq的特点\",\"slug\":\"asynq的特点\",\"link\":\"#asynq的特点\",\"children\":[]},{\"level\":2,\"title\":\"Asynq任务名的命名规则\",\"slug\":\"asynq任务名的命名规则\",\"link\":\"#asynq任务名的命名规则\",\"children\":[{\"level\":3,\"title\":\"唯一性\",\"slug\":\"唯一性\",\"link\":\"#唯一性\",\"children\":[]},{\"level\":3,\"title\":\"命名风格\",\"slug\":\"命名风格\",\"link\":\"#命名风格\",\"children\":[]},{\"level\":3,\"title\":\"语义明确\",\"slug\":\"语义明确\",\"link\":\"#语义明确\",\"children\":[]},{\"level\":3,\"title\":\"避免特殊字符\",\"slug\":\"避免特殊字符\",\"link\":\"#避免特殊字符\",\"children\":[]},{\"level\":3,\"title\":\"版本管理\",\"slug\":\"版本管理\",\"link\":\"#版本管理\",\"children\":[]}]},{\"level\":2,\"title\":\"Asynq可视化监控\",\"slug\":\"asynq可视化监控\",\"link\":\"#asynq可视化监控\",\"children\":[{\"level\":3,\"title\":\"命令行工具CLI\",\"slug\":\"命令行工具cli\",\"link\":\"#命令行工具cli\",\"children\":[]},{\"level\":3,\"title\":\"Web UI\",\"slug\":\"web-ui\",\"link\":\"#web-ui\",\"children\":[]}]},{\"level\":2,\"title\":\"如何在Go Wind Admin中使用定时任务\",\"slug\":\"如何在go-wind-admin中使用定时任务\",\"link\":\"#如何在go-wind-admin中使用定时任务\",\"children\":[]},{\"level\":2,\"title\":\"项目代码\",\"slug\":\"项目代码\",\"link\":\"#项目代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_task.md\",\"excerpt\":\"\\n<p>在后台管理系统中，定时任务是一个很实用的功能，可以帮助我们自动执行一些周期性的任务，比如定期清理数据、发送邮件提醒等。</p>\\n<p>在go里面，如果想要简单的实现一个周期性任务，我们可以用<a href=\\\"https://github.com/robfig/cron\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">cron</a>或者<a href=\\\"https://github.com/roylee0704/gron\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">gron</a>等仿linux的crontab的库。</p>\"}")
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
