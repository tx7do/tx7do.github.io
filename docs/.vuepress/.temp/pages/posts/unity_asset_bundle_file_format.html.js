import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/unity_asset_bundle_file_format.html.vue"
const data = JSON.parse("{\"path\":\"/posts/unity_asset_bundle_file_format.html\",\"title\":\"Unity AssetBundle文件\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"Unity\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是AssetBundle\",\"slug\":\"什么是assetbundle\",\"link\":\"#什么是assetbundle\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/unity_asset_bundle_file_format.md\",\"excerpt\":\"\\n<h2>什么是AssetBundle</h2>\\n<p>AssetBundle 为资源的集合，可包含贴图(Textures)，材质(Materials)，声音(Audio)，动画资源(Animation Clips &amp; Animator controllers)，文字(Text assets)，甚至场景(Scenes) 等各式资源，允许游戏在运行时向远端服务器(Remote server)，要求载入AssetBundle 并且使用里头的资源。</p>\\n<p>因此可以利用AssetBundle 功能来制作关卡更新资源包，下载新的关卡资源，即是DLC (Downloadable content)。亦可用来更新游戏，例如特殊节庆时，更新游戏贴图材质，让游戏与玩家一同过节。</p>\"}")
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
