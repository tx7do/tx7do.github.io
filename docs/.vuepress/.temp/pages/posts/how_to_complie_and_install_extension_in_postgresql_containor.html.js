import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_complie_and_install_extension_in_postgresql_containor.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_complie_and_install_extension_in_postgresql_containor.html\",\"title\":\"怎样编译PostgreSQL扩展并安装到容器中去\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"运维技术\"],\"tag\":[\"Docker\",\"PostgreSQL\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/how_to_complie_and_install_extension_in_postgresql_containor.md\",\"excerpt\":\"\\n<p>通常PostgreSQL容器当中会内置一些扩展，一般存放在：<code>/usr/lib/postgresql/{PostgreSQL版本号}/lib</code>，扩展的实体都是<code>.so</code>文件，如果容器当中存在着扩展的so文件，那么就可以顺利的通过SQL语句进行安装，否则，则不能够顺利的安装，这时候，就需要编译扩展并拷贝进容器。</p>\\n<p>https://yum.postgresql.org/repopackages/</p>\\n\"}")
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
