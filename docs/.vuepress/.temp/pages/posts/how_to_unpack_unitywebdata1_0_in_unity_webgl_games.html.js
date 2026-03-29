import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_unpack_unitywebdata1_0_in_unity_webgl_games.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_unpack_unitywebdata1_0_in_unity_webgl_games.html\",\"title\":\"如何解压Unity WebGL游戏的UnityWebData1.0资源包\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"Unity WebGL\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是 UnityWebData\",\"slug\":\"什么是-unitywebdata\",\"link\":\"#什么是-unitywebdata\",\"children\":[]},{\"level\":2,\"title\":\"UnityWebData的结构体\",\"slug\":\"unitywebdata的结构体\",\"link\":\"#unitywebdata的结构体\",\"children\":[{\"level\":3,\"title\":\"文件头 (File Header)\",\"slug\":\"文件头-file-header\",\"link\":\"#文件头-file-header\",\"children\":[]},{\"level\":3,\"title\":\"文件信息头 (File Information Header)\",\"slug\":\"文件信息头-file-information-header\",\"link\":\"#文件信息头-file-information-header\",\"children\":[]},{\"level\":3,\"title\":\"文件体 (File Body)\",\"slug\":\"文件体-file-body\",\"link\":\"#文件体-file-body\",\"children\":[]}]},{\"level\":2,\"title\":\"使用工具\",\"slug\":\"使用工具\",\"link\":\"#使用工具\",\"children\":[{\"level\":3,\"title\":\"UWDTool\",\"slug\":\"uwdtool\",\"link\":\"#uwdtool\",\"children\":[]},{\"level\":3,\"title\":\"unityweb\",\"slug\":\"unityweb\",\"link\":\"#unityweb\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/how_to_unpack_unitywebdata1_0_in_unity_webgl_games.md\",\"excerpt\":\"\\n<h2>什么是 UnityWebData</h2>\\n<p>UnityWebData 文件是在 WebGL 游戏中与 WebAssembly 文件一起加载和使用的文件，主要是组合所有资产(Asset)、资源(Resource)和元数据(Meta)文件的文件。</p>\\n<p><img src=\\\"/assets/images/unity/unity_webdata_file_struct_image.png\\\" alt=\\\"UnityWebData\\\"></p>\\n<h2>UnityWebData的结构体</h2>\\n<p>本节介绍基于UnityWebData1.0的二进制文件的结构进行介绍。</p>\\n<p>需要注意：int值必须以Little Endian方式读取。</p>\"}")
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
