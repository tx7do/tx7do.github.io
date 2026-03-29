import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_wind_admin_user_table_evolution.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_wind_admin_user_table_evolution.html\",\"title\":\"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用户表从简单到租户的演进\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"GoWind风行\"],\"tag\":[\"Golang\",\"Go-Kratos\",\"GoWind\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"极简User\",\"slug\":\"极简user\",\"link\":\"#极简user\",\"children\":[]},{\"level\":2,\"title\":\"分离出UserCredential表\",\"slug\":\"分离出usercredential表\",\"link\":\"#分离出usercredential表\",\"children\":[]},{\"level\":2,\"title\":\"增加Role表\",\"slug\":\"增加role表\",\"link\":\"#增加role表\",\"children\":[]},{\"level\":2,\"title\":\"增加Organization、Department表\",\"slug\":\"增加organization、department表\",\"link\":\"#增加organization、department表\",\"children\":[]},{\"level\":2,\"title\":\"增加Tenant表\",\"slug\":\"增加tenant表\",\"link\":\"#增加tenant表\",\"children\":[]},{\"level\":2,\"title\":\"分离Membership、OrgUnit表\",\"slug\":\"分离membership、orgunit表\",\"link\":\"#分离membership、orgunit表\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_wind_admin_user_table_evolution.md\",\"excerpt\":\"\\n<p>先解决有没有，再解决好不好</p>\\n<h2>极简User</h2>\\n<div class=\\\"language-sql line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sql\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token keyword\\\">CREATE</span> <span class=\\\"token keyword\\\">TABLE</span> users <span class=\\\"token punctuation\\\">(</span></span>\\n<span class=\\\"line\\\">    id <span class=\\\"token keyword\\\">BIGINT</span> <span class=\\\"token keyword\\\">PRIMARY</span> <span class=\\\"token keyword\\\">KEY</span><span class=\\\"token punctuation\\\">,</span></span>\\n<span class=\\\"line\\\">    authority <span class=\\\"token keyword\\\">VARCHAR</span><span class=\\\"token punctuation\\\">(</span><span class=\\\"token number\\\">50</span><span class=\\\"token punctuation\\\">)</span><span class=\\\"token punctuation\\\">,</span></span>\\n<span class=\\\"line\\\">    password <span class=\\\"token keyword\\\">VARCHAR</span><span class=\\\"token punctuation\\\">(</span><span class=\\\"token number\\\">255</span><span class=\\\"token punctuation\\\">)</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token punctuation\\\">)</span><span class=\\\"token punctuation\\\">;</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
