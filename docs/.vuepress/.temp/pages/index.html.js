import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"喵个咪的技术与生活\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"title\":\"喵个咪的技术与生活\",\"heroImage\":\"/logo.png\",\"actions\":[{\"text\":\"快速开始\",\"link\":\"/get-started.html\",\"type\":\"primary\"},{\"text\":\"文章列表\",\"link\":\"/article/\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"技术分享\",\"details\":\"深入浅出，涵盖后端、云原生、DevOps、AI、前端等多领域内容。\"},{\"title\":\"实用教程\",\"details\":\"以实战为导向，助你高效解决开发与运维难题。\"},{\"title\":\"持续更新\",\"details\":\"持续记录成长与思考，分享最新技术与生活感悟。\"},{\"title\":\"开源精神\",\"details\":\"推崇开源，乐于分享，欢迎交流与合作。\"}],\"footer\":\"MIT Licensed | Copyright © 2020-2026 TX7DO\"},\"headers\":[],\"git\":{},\"filePathRelative\":\"README.md\"}")
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
