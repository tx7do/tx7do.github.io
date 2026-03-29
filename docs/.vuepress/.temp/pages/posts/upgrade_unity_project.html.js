import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/upgrade_unity_project.html.vue"
const data = JSON.parse("{\"path\":\"/posts/upgrade_unity_project.html\",\"title\":\"升级旧版本的Unity项目\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"Unity\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"UnityEngine.Application' does not contain a definition for bundleIdentifier'\",\"slug\":\"unityengine-application-does-not-contain-a-definition-for-bundleidentifier\",\"link\":\"#unityengine-application-does-not-contain-a-definition-for-bundleidentifier\",\"children\":[]},{\"level\":2,\"title\":\"升级粒子系统\",\"slug\":\"升级粒子系统\",\"link\":\"#升级粒子系统\",\"children\":[]},{\"level\":2,\"title\":\"GUITexture替换为UI.Image遇到的问题\",\"slug\":\"guitexture替换为ui-image遇到的问题\",\"link\":\"#guitexture替换为ui-image遇到的问题\",\"children\":[{\"level\":3,\"title\":\"'Image' does not contain a definition for 'pixelInset'\",\"slug\":\"image-does-not-contain-a-definition-for-pixelinset\",\"link\":\"#image-does-not-contain-a-definition-for-pixelinset\",\"children\":[]}]},{\"level\":2,\"title\":\"不存在.texture\",\"slug\":\"不存在-texture\",\"link\":\"#不存在-texture\",\"children\":[]},{\"level\":2,\"title\":\"找不到Handles.CircleCap\",\"slug\":\"找不到handles-circlecap\",\"link\":\"#找不到handles-circlecap\",\"children\":[]},{\"level\":2,\"title\":\"MovieTexture改为VideoPlayer\",\"slug\":\"movietexture改为videoplayer\",\"link\":\"#movietexture改为videoplayer\",\"children\":[]},{\"level\":2,\"title\":\"Unity 5的GameObject.guiText和GameObject.guiTexture\",\"slug\":\"unity-5的gameobject-guitext和gameobject-guitexture\",\"link\":\"#unity-5的gameobject-guitext和gameobject-guitexture\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/upgrade_unity_project.md\",\"excerpt\":\"\\n<h2>UnityEngine.Application' does not contain a definition for bundleIdentifier'</h2>\\n<p>把 <code>Application.bundleIdentifier</code>修改为<code>Application.identifier</code>。</p>\\n<h2>升级粒子系统</h2>\\n<p>Unity2018.2.x之后，旧版 Particle System 相关API就完全移除掉了，这个升级器是Unity官方发布的，它可以<code>ParticleEmitter</code>, <code>ParticleAnimator</code>, <code>ParticleRenderer</code>等组件转换为<code>ParticleSystem</code> 和 <code>ParticleSystemRenderer</code>组件。</p>\"}")
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
