import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/automated_backups_with_ cron_and_rclone.html.vue"
const data = JSON.parse("{\"path\":\"/posts/automated_backups_with_%20cron_and_rclone.html\",\"title\":\"使用 cron 和 RClone 实现自动备份文件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"cron\",\"rclone\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"RClone是什么？\",\"slug\":\"rclone是什么\",\"link\":\"#rclone是什么\",\"children\":[]},{\"level\":2,\"title\":\"Cron 是什么？\",\"slug\":\"cron-是什么\",\"link\":\"#cron-是什么\",\"children\":[{\"level\":3,\"title\":\"CentOS/RHEL 7/8/5\",\"slug\":\"centos-rhel-7-8-5\",\"link\":\"#centos-rhel-7-8-5\",\"children\":[]},{\"level\":3,\"title\":\"Ubuntu\",\"slug\":\"ubuntu\",\"link\":\"#ubuntu\",\"children\":[]}]},{\"level\":2,\"title\":\"设置 RClone\",\"slug\":\"设置-rclone\",\"link\":\"#设置-rclone\",\"children\":[]},{\"level\":2,\"title\":\"构建 shell 脚本以将文件备份到 Google Drive\",\"slug\":\"构建-shell-脚本以将文件备份到-google-drive\",\"link\":\"#构建-shell-脚本以将文件备份到-google-drive\",\"children\":[]},{\"level\":2,\"title\":\"设置 cron 来运行 Shell脚本\",\"slug\":\"设置-cron-来运行-shell脚本\",\"link\":\"#设置-cron-来运行-shell脚本\",\"children\":[]},{\"level\":2,\"title\":\"提示 — cron 日志文件在哪里？\",\"slug\":\"提示-—-cron-日志文件在哪里\",\"link\":\"#提示-—-cron-日志文件在哪里\",\"children\":[]},{\"level\":2,\"title\":\"如何卸载RClone？\",\"slug\":\"如何卸载rclone\",\"link\":\"#如何卸载rclone\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/automated_backups_with_ cron_and_rclone.md\",\"excerpt\":\"\\n<p>本文将向您展示如何在 Linux 操作系统中使用 RClone 和 cron 来自动进行文件备份。</p>\\n<p>现在是星期五下午 6 点，我需要将一些工作和学校文件备份到 Google 云端硬盘。是的，我使用 git 进行编码项目，但这种工作最好保存在 Google Drive 中。所以我想知道是否有一种更快、简单、自动化的方法来备份到 Google Drive，有趣的是，我发现了 RClone。</p>\\n<p>在本文中您将了解到：</p>\\n<ul>\\n<li>什么是 RClone？</li>\\n<li>什么是 cron？</li>\\n<li>RClone 和 cron 的基本用法</li>\\n<li>如何在每周五下午 6:30 自动备份文件</li>\\n<li>Cron日志记录</li>\\n<li>如何卸载 RClone</li>\\n</ul>\"}")
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
