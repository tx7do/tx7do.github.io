import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/docx_add_pinyin.html.vue"
const data = JSON.parse("{\"path\":\"/posts/docx_add_pinyin.html\",\"title\":\"如何在Word文档中批量添加汉字注音\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Word\",\"VBA\",\"Go\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"调用Office的功能\",\"slug\":\"调用office的功能\",\"link\":\"#调用office的功能\",\"children\":[{\"level\":3,\"title\":\"VBA\",\"slug\":\"vba\",\"link\":\"#vba\",\"children\":[]},{\"level\":3,\"title\":\".net\",\"slug\":\"net\",\"link\":\"#net\",\"children\":[]}]},{\"level\":2,\"title\":\"直接修改docx文档\",\"slug\":\"直接修改docx文档\",\"link\":\"#直接修改docx文档\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/docx_add_pinyin.md\",\"excerpt\":\"\\n<p>所谓的汉字注音，就是给汉字上方加注拼音。</p>\\n<p><img src=\\\"/assets/images/office/pinyin.jpeg\\\" alt=\\\"汉字注音\\\"></p>\\n<p>在Office里面，这个功能叫做 <strong>“拼音指南”（Phonetic Guide）</strong>。</p>\\n<p><img src=\\\"/assets/images/office/pinyinzhinan.jpeg\\\" alt=\\\"拼音指南\\\"></p>\\n<p>拼音指南一次只能够处理最多30个字，一篇文章不可能只有30个字，上百个字是很正常的，人工处理就会很累。所以，需要做到自动化，做到自动化有两种方式可以做到：</p>\"}")
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
