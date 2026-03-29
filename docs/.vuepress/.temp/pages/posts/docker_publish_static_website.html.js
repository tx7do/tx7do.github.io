import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docker_publish_static_website.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docker_publish_static_website.html\",\"title\":\"使用Docker发布静态网站\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"创建Dockerfile\",\"slug\":\"创建dockerfile\",\"link\":\"#创建dockerfile\",\"children\":[]},{\"level\":2,\"title\":\"注册Docker Hub账号\",\"slug\":\"注册docker-hub账号\",\"link\":\"#注册docker-hub账号\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docker_publish_static_website.md\",\"excerpt\":\"\\n<h2>创建Dockerfile</h2>\\n<h2>注册Docker Hub账号</h2>\\n\"}")
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
