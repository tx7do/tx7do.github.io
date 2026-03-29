import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/font_rendering.html.vue"
const data = JSON.parse("{\"path\":\"/posts/font_rendering.html\",\"title\":\"字体渲染\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"字体渲染\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"位图字体(Bitmap Font)\",\"slug\":\"位图字体-bitmap-font\",\"link\":\"#位图字体-bitmap-font\",\"children\":[]},{\"level\":2,\"title\":\"矢量字体 (Vector Font)\",\"slug\":\"矢量字体-vector-font\",\"link\":\"#矢量字体-vector-font\",\"children\":[{\"level\":3,\"title\":\"TTF：TrueType\",\"slug\":\"ttf-truetype\",\"link\":\"#ttf-truetype\",\"children\":[]},{\"level\":3,\"title\":\"EOT ：Embedded Open Type\",\"slug\":\"eot-embedded-open-type\",\"link\":\"#eot-embedded-open-type\",\"children\":[]},{\"level\":3,\"title\":\"OTF：OpenType\",\"slug\":\"otf-opentype\",\"link\":\"#otf-opentype\",\"children\":[]},{\"level\":3,\"title\":\"WOFF：Web Open Font Format\",\"slug\":\"woff-web-open-font-format\",\"link\":\"#woff-web-open-font-format\",\"children\":[]},{\"level\":3,\"title\":\"SVG：Scalable Vector Graphics\",\"slug\":\"svg-scalable-vector-graphics\",\"link\":\"#svg-scalable-vector-graphics\",\"children\":[]},{\"level\":3,\"title\":\"特别的TTC格式字体\",\"slug\":\"特别的ttc格式字体\",\"link\":\"#特别的ttc格式字体\",\"children\":[]}]},{\"level\":2,\"title\":\"SDF Font\",\"slug\":\"sdf-font\",\"link\":\"#sdf-font\",\"children\":[{\"level\":3,\"title\":\"SDF 生成算法\",\"slug\":\"sdf-生成算法\",\"link\":\"#sdf-生成算法\",\"children\":[]}]},{\"level\":2,\"title\":\"MSDF Font\",\"slug\":\"msdf-font\",\"link\":\"#msdf-font\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/font_rendering.md\",\"excerpt\":\"\\n<h2>位图字体(Bitmap Font)</h2>\\n<p>最简单的文本渲染方式是：<code>点阵字体 (Dot-matrix-fonts)</code> 也叫<code>位图字体 (Bitmap-fonts)</code>。</p>\\n<p>位图字体通过将所需的独特字形光栅化为单个纹理（称为 <a href=\\\"https://en.wikipedia.org/wiki/Texture_atlas\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">纹理图集(Texture atlas)</a>），使用的时候再找到对应的字符的 UV，再绘制文本。</p>\\n<p><img src=\\\"/assets/images/font_rendering/bitmap_font_sampling.png\\\" alt=\\\"位图字体(Bitmap Font)\\\"></p>\"}")
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
