import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/postgres_full_text_search_a_search_engine_in_a_database.html.vue"
const data = JSON.parse("{\"path\":\"/posts/postgres_full_text_search_a_search_engine_in_a_database.html\",\"title\":\"Postgres 全文搜索：数据库中的搜索引擎\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"全文搜索\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"面向新手的 Postgres 全文搜索基础知识\",\"slug\":\"面向新手的-postgres-全文搜索基础知识\",\"link\":\"#面向新手的-postgres-全文搜索基础知识\",\"children\":[]},{\"level\":2,\"title\":\"示例：搜索风暴事件详细信息\",\"slug\":\"示例-搜索风暴事件详细信息\",\"link\":\"#示例-搜索风暴事件详细信息\",\"children\":[]},{\"level\":2,\"title\":\"搜索短语\",\"slug\":\"搜索短语\",\"link\":\"#搜索短语\",\"children\":[]},{\"level\":2,\"title\":\"对搜索结果进行加权和排名的函数\",\"slug\":\"对搜索结果进行加权和排名的函数\",\"link\":\"#对搜索结果进行加权和排名的函数\",\"children\":[]},{\"level\":2,\"title\":\"是的，您可以在 Postgres 中保留全文搜索\",\"slug\":\"是的-您可以在-postgres-中保留全文搜索\",\"link\":\"#是的-您可以在-postgres-中保留全文搜索\",\"children\":[]},{\"level\":2,\"title\":\"原文地址\",\"slug\":\"原文地址\",\"link\":\"#原文地址\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/postgres_full_text_search_a_search_engine_in_a_database.md\",\"excerpt\":\"\\n<p>在我的 SQL 之旅的早期，我认为在数据库中搜索一段文本主要涉及这样的查询：</p>\\n<div class=\\\"language-sql line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sql\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token keyword\\\">SELECT</span> col <span class=\\\"token keyword\\\">FROM</span> <span class=\\\"token keyword\\\">table</span> <span class=\\\"token keyword\\\">WHERE</span> col <span class=\\\"token operator\\\">LIKE</span> <span class=\\\"token string\\\">'%some_value%'</span><span class=\\\"token punctuation\\\">;</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div></div></div>\"}")
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
