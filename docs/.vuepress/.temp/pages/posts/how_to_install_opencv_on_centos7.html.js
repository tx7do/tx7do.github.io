import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_install_opencv_on_centos7.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_install_opencv_on_centos7.html\",\"title\":\"如何在 CentOS 7 上安装 OpenCV\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"CentOS\",\"OpenCV\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"第 1 步：安装 OpenCV 的依赖项\",\"slug\":\"第-1-步-安装-opencv-的依赖项\",\"link\":\"#第-1-步-安装-opencv-的依赖项\",\"children\":[]},{\"level\":2,\"title\":\"第 2 步：下载 OpenCV x.x.x 代码\",\"slug\":\"第-2-步-下载-opencv-x-x-x-代码\",\"link\":\"#第-2-步-下载-opencv-x-x-x-代码\",\"children\":[]},{\"level\":2,\"title\":\"第三步：编译安装OpenCV x.x.x\",\"slug\":\"第三步-编译安装opencv-x-x-x\",\"link\":\"#第三步-编译安装opencv-x-x-x\",\"children\":[]},{\"level\":2,\"title\":\"第 4 步：配置所需的变量\",\"slug\":\"第-4-步-配置所需的变量\",\"link\":\"#第-4-步-配置所需的变量\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/how_to_install_opencv_on_centos7.md\",\"excerpt\":\"\\n<h2>第 1 步：安装 OpenCV 的依赖项</h2>\\n<p>使用以下命令安装编译 OpenCV 所需的所有依赖项：</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\">yum groupinstall <span class=\\\"token string\\\">\\\"Development Tools\\\"</span> <span class=\\\"token parameter variable\\\">-y</span></span>\\n<span class=\\\"line\\\"></span>\\n<span class=\\\"line\\\">yum <span class=\\\"token function\\\">install</span> cmake3 gcc gtk2-devel numpy pkconfig <span class=\\\"token parameter variable\\\">-y</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
