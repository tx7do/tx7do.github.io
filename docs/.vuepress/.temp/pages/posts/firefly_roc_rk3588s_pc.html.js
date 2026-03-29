import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/firefly_roc_rk3588s_pc.html.vue"
const data = JSON.parse("{\"path\":\"/posts/firefly_roc_rk3588s_pc.html\",\"title\":\"Firefly ROC-RK3588S-PC\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"物联网开发\"],\"tag\":[\"RK3588S\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"安装工具\",\"slug\":\"安装工具\",\"link\":\"#安装工具\",\"children\":[]},{\"level\":2,\"title\":\"开发板进入到Loader模式\",\"slug\":\"开发板进入到loader模式\",\"link\":\"#开发板进入到loader模式\",\"children\":[]},{\"level\":2,\"title\":\"RKDevTool安装Ubuntu固件\",\"slug\":\"rkdevtool安装ubuntu固件\",\"link\":\"#rkdevtool安装ubuntu固件\",\"children\":[]},{\"level\":2,\"title\":\"Docker\",\"slug\":\"docker\",\"link\":\"#docker\",\"children\":[]},{\"level\":2,\"title\":\"VNC\",\"slug\":\"vnc\",\"link\":\"#vnc\",\"children\":[]},{\"level\":2,\"title\":\"XRDP\",\"slug\":\"xrdp\",\"link\":\"#xrdp\",\"children\":[]},{\"level\":2,\"title\":\"Vino\",\"slug\":\"vino\",\"link\":\"#vino\",\"children\":[]},{\"level\":2,\"title\":\"连接WiFi\",\"slug\":\"连接wifi\",\"link\":\"#连接wifi\",\"children\":[]},{\"level\":2,\"title\":\"GNOME\",\"slug\":\"gnome\",\"link\":\"#gnome\",\"children\":[]},{\"level\":2,\"title\":\"Docker\",\"slug\":\"docker-1\",\"link\":\"#docker-1\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/firefly_roc_rk3588s_pc.md\",\"excerpt\":\"\\n<p>默认安装的是Android系统，我们不需要，我们需要一个Ubuntu Desktop。</p>\\n<h2>安装工具</h2>\\n<ul>\\n<li>安装RK USB驱动 DriverAssistant</li>\\n<li>安装运行 RKDevTool</li>\\n<li>下载固件：Ubuntu、Debian、Buildroot……</li>\\n</ul>\\n<h2>开发板进入到Loader模式</h2>\\n<ol>\\n<li>先断开电源；</li>\\n<li>USB线一端插入到OTG口，另外一端插入到电脑；</li>\\n<li>按住<code>RECOVERY 键</code>（需要注意，为了防止误触，它的按钮被隐藏在侧面，手指头探下，将黑色的按钮往白色的按钮基座抠）；</li>\\n<li>接通电源；</li>\\n<li><code>RECOVERY 键</code>持续摁住大约2秒。</li>\\n</ol>\"}")
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
