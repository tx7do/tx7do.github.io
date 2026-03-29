import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/htop_desc.html.vue"
const data = JSON.parse("{\"path\":\"/posts/htop_desc.html\",\"title\":\"你一定用过htop，但你有看懂每个选项吗？\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"htop\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"CPU\",\"slug\":\"cpu\",\"link\":\"#cpu\",\"children\":[]},{\"level\":2,\"title\":\"Memory & Swap\",\"slug\":\"memory-swap\",\"link\":\"#memory-swap\",\"children\":[]},{\"level\":2,\"title\":\"Load Average\",\"slug\":\"load-average\",\"link\":\"#load-average\",\"children\":[]},{\"level\":2,\"title\":\"PID/USER\",\"slug\":\"pid-user\",\"link\":\"#pid-user\",\"children\":[]},{\"level\":2,\"title\":\"PRI & NI\",\"slug\":\"pri-ni\",\"link\":\"#pri-ni\",\"children\":[]},{\"level\":2,\"title\":\"VIRT/RES/SHR\",\"slug\":\"virt-res-shr\",\"link\":\"#virt-res-shr\",\"children\":[]},{\"level\":2,\"title\":\"State\",\"slug\":\"state\",\"link\":\"#state\",\"children\":[]},{\"level\":2,\"title\":\"CPU% / MEM%\",\"slug\":\"cpu-mem\",\"link\":\"#cpu-mem\",\"children\":[]},{\"level\":2,\"title\":\"Time+\",\"slug\":\"time\",\"link\":\"#time\",\"children\":[]},{\"level\":2,\"title\":\"总结\",\"slug\":\"总结\",\"link\":\"#总结\",\"children\":[]},{\"level\":2,\"title\":\"延伸阅读\",\"slug\":\"延伸阅读\",\"link\":\"#延伸阅读\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/htop_desc.md\",\"excerpt\":\"\\n<p><img src=\\\"/assets/images/htop/main.webp\\\" alt=\\\"main.webp\\\"></p>\\n<p>身为一个工程师，不管你写的是前端、后端、全端还是什么端，一定多少用过htop，就算真的没用过也会听同事说过。htop 是一个process manager，他可以让你看到执行中的process、系统资源的使用量，也可以让你轻松kill 掉任何一个process，总之，你想得到的功能统统都有～</p>\\n<p>虽然，大家都说htop 很好用，但许多人打开htop 也只看得懂CPU、Mem、PID、Command 这些简单的选项，对于Load average、NI、State、SHR 就没那么熟悉。</p>\"}")
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
