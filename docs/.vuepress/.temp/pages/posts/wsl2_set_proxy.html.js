import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/wsl2_set_proxy.html.vue"
const data = JSON.parse("{\"path\":\"/posts/wsl2_set_proxy.html\",\"title\":\"WSL2设置网络代理\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Windows\",\"WSL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"获取到宿主的访问IP地址\",\"slug\":\"获取到宿主的访问ip地址\",\"link\":\"#获取到宿主的访问ip地址\",\"children\":[]},{\"level\":2,\"title\":\"配置代理\",\"slug\":\"配置代理\",\"link\":\"#配置代理\",\"children\":[]},{\"level\":2,\"title\":\"编写配置\",\"slug\":\"编写配置\",\"link\":\"#编写配置\",\"children\":[{\"level\":3,\"title\":\"作用于当前用户\",\"slug\":\"作用于当前用户\",\"link\":\"#作用于当前用户\",\"children\":[]},{\"level\":3,\"title\":\"作用于所有用户\",\"slug\":\"作用于所有用户\",\"link\":\"#作用于所有用户\",\"children\":[]}]},{\"level\":2,\"title\":\"查看环境变量\",\"slug\":\"查看环境变量\",\"link\":\"#查看环境变量\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/wsl2_set_proxy.md\",\"excerpt\":\"\\n<p>为了生计所迫，有时候不得不需要在WSL2下面使用代理。</p>\\n<h2>获取到宿主的访问IP地址</h2>\\n<p>WSL2要访问宿主的服务，并没有那么容易，并不能简单的通过127.0.0.1来访问，需要获取到宿主的访问IP地址。有两种办法可以访问宿主的IP：</p>\\n<ol>\\n<li><code>cat /etc/resolv.conf</code>命令获取<code>nameserver</code>；</li>\\n<li>如果安装了Docker，可以获取<code>host.docker.internal</code>。</li>\\n</ol>\\n<p>推荐使用第一种方法。</p>\\n<h2>配置代理</h2>\"}")
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
