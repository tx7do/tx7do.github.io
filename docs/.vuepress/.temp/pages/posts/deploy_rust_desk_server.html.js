import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/deploy_rust_desk_server.html.vue"
const data = JSON.parse("{\"path\":\"/posts/deploy_rust_desk_server.html\",\"title\":\"部署RustDesk服务器\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"RustDesk\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"pm2 常用命令\",\"slug\":\"pm2-常用命令\",\"link\":\"#pm2-常用命令\",\"children\":[]},{\"level\":2,\"title\":\"CentOS\",\"slug\":\"centos\",\"link\":\"#centos\",\"children\":[]},{\"level\":2,\"title\":\"Ubuntu\",\"slug\":\"ubuntu\",\"link\":\"#ubuntu\",\"children\":[]},{\"level\":2,\"title\":\"MacOS\",\"slug\":\"macos\",\"link\":\"#macos\",\"children\":[]},{\"level\":2,\"title\":\"Windows\",\"slug\":\"windows\",\"link\":\"#windows\",\"children\":[]},{\"level\":2,\"title\":\"Docker\",\"slug\":\"docker\",\"link\":\"#docker\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/deploy_rust_desk_server.md\",\"excerpt\":\"\\n<p>两个可执行程序：</p>\\n<ul>\\n<li><code>hbbs</code> - RustDesk ID注册服务器，是管各个客户端 ID 的，每个客户端都有一个唯一的 ID 。</li>\\n<li><code>hbbr</code> - RustDesk中继服务器，是负责检测、中转各个客户端连接和数据传输。</li>\\n</ul>\\n<p>端口占用情况：</p>\\n<ul>\\n<li>TCP(21115, 21116, 21117, 21118, 21119)</li>\\n<li>UDP(21116)</li>\\n</ul>\\n<p>进程占用端口情况：</p>\\n<ul>\\n<li><code>hbbs</code> - 21115(tcp), 21116(tcp/udp), 21118(tcp)</li>\\n<li><code>hbbr</code> - 21117(tcp), 21119(tcp)</li>\\n</ul>\"}")
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
