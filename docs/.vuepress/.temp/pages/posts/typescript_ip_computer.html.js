import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/typescript_ip_computer.html.vue"
const data = JSON.parse("{\"path\":\"/posts/typescript_ip_computer.html\",\"title\":\"TypeScript IP 计算器\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"TypeScript\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"验证IP有效性\",\"slug\":\"验证ip有效性\",\"link\":\"#验证ip有效性\",\"children\":[]},{\"level\":2,\"title\":\"校验子网掩码有效性\",\"slug\":\"校验子网掩码有效性\",\"link\":\"#校验子网掩码有效性\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/typescript_ip_computer.md\",\"excerpt\":\"\\n<h2>验证IP有效性</h2>\\n<div class=\\\"language-typescript line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"ts\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token comment\\\">// 验证IP有效性</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token keyword\\\">function</span> <span class=\\\"token function\\\">isValidIP</span><span class=\\\"token punctuation\\\">(</span>ip<span class=\\\"token operator\\\">:</span> <span class=\\\"token builtin\\\">string</span><span class=\\\"token punctuation\\\">)</span><span class=\\\"token operator\\\">:</span> <span class=\\\"token builtin\\\">boolean</span> <span class=\\\"token punctuation\\\">{</span></span>\\n<span class=\\\"line\\\">  <span class=\\\"token keyword\\\">const</span> reg <span class=\\\"token operator\\\">=</span> <span class=\\\"token regex\\\"><span class=\\\"token regex-delimiter\\\">/</span><span class=\\\"token regex-source language-regex\\\">^(\\\\d{1,2}|1\\\\d\\\\d|2[0-4]\\\\d|25[0-5])\\\\.(\\\\d{1,2}|1\\\\d\\\\d|2[0-4]\\\\d|25[0-5])\\\\.(\\\\d{1,2}|1\\\\d\\\\d|2[0-4]\\\\d|25[0-5])\\\\.(\\\\d{1,2}|1\\\\d\\\\d|2[0-4]\\\\d|25[0-5])$</span><span class=\\\"token regex-delimiter\\\">/</span></span></span>\\n<span class=\\\"line\\\">  <span class=\\\"token keyword\\\">return</span> reg<span class=\\\"token punctuation\\\">.</span><span class=\\\"token function\\\">test</span><span class=\\\"token punctuation\\\">(</span>ip<span class=\\\"token punctuation\\\">)</span><span class=\\\"token punctuation\\\">;</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token punctuation\\\">}</span></span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
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
