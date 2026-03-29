import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/protobufjs.html.vue"
const data = JSON.parse("{\"path\":\"/posts/protobufjs.html\",\"title\":\"Protobufjs\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Protobuf\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"7.x.x和6.x.x差异\",\"slug\":\"_7-x-x和6-x-x差异\",\"link\":\"#_7-x-x和6-x-x差异\",\"children\":[]},{\"level\":2,\"title\":\"生成代码\",\"slug\":\"生成代码\",\"link\":\"#生成代码\",\"children\":[{\"level\":3,\"title\":\"生成JSON，适用于light库\",\"slug\":\"生成json-适用于light库\",\"link\":\"#生成json-适用于light库\",\"children\":[]},{\"level\":3,\"title\":\"生成JavaScript代码，适用于minimal库\",\"slug\":\"生成javascript代码-适用于minimal库\",\"link\":\"#生成javascript代码-适用于minimal库\",\"children\":[]},{\"level\":3,\"title\":\"用于直接从proto转换为typescript\",\"slug\":\"用于直接从proto转换为typescript\",\"link\":\"#用于直接从proto转换为typescript\",\"children\":[]}]}],\"git\":{},\"filePathRelative\":\"posts/protobufjs.md\",\"excerpt\":\"\\n<h2>7.x.x和6.x.x差异</h2>\\n<p>6是运行时和CLI都在一起，7则拆分开来了。</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token function\\\">pnpm</span> <span class=\\\"token function\\\">install</span> <span class=\\\"token parameter variable\\\">-D</span> protobufjs</span>\\n<span class=\\\"line\\\"><span class=\\\"token function\\\">pnpm</span> <span class=\\\"token function\\\">install</span> <span class=\\\"token parameter variable\\\">-D</span> protobufjs-cli</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
