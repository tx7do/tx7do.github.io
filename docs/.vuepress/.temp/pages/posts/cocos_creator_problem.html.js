import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cocos_creator_problem.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cocos_creator_problem.html\",\"title\":\"Cocos Creator问题集\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"Cocos Creator\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"小程序真机无法显示ttf字体\",\"slug\":\"小程序真机无法显示ttf字体\",\"link\":\"#小程序真机无法显示ttf字体\",\"children\":[]},{\"level\":2,\"title\":\"Failed to new Role() under the hood, TypeError: Cannot read property 'ins' of undefined\",\"slug\":\"failed-to-new-role-under-the-hood-typeerror-cannot-read-property-ins-of-undefined\",\"link\":\"#failed-to-new-role-under-the-hood-typeerror-cannot-read-property-ins-of-undefined\",\"children\":[]},{\"level\":2,\"title\":\"Please specifiy a default value for “AnimalItem.ani_park_exp” at its declaration:\",\"slug\":\"please-specifiy-a-default-value-for-animalitem-ani-park-exp-at-its-declaration\",\"link\":\"#please-specifiy-a-default-value-for-animalitem-ani-park-exp-at-its-declaration\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cocos_creator_problem.md\",\"excerpt\":\"\\n<h2>小程序真机无法显示ttf字体</h2>\\n<p>根据论坛里面说的是，主要的原因是因为字体的<code>font-family</code>名字里面带有空格。</p>\\n<p>需要使用字体修改工具<a href=\\\"https://www.high-logic.com/font-editor/fontcreator\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">High-Logic FontCreator</a>来修改<code>font-family</code>名，修改之后，确实生效了。</p>\\n<ol>\\n<li>打开<code>FontCreator</code>，将<code>ttf文件</code>拖到FontCreator打开。</li>\\n<li>菜单项选择：<code>Font</code> -&gt; <code>Properties</code>，打开<code>Font Properties</code>弹窗。</li>\\n<li>在弹窗里面看到有几个子标签页，其中Identification标签页里面的 Font Family即为字体的英文名，自行修改成自己需要的值。</li>\\n<li>在Custom标签页里面，可以看到列表里面的第一列是语言ID，第二列是Name ID，简体中文系统上，找到行 <code>Chinese-People's Republic of China  Font Family</code>，</li>\\n<li>繁体中文或者其他语言的系统下，应该是修改对应的行，没有的也可以Add添加新的行，这个我没有测试，猜测是这样。</li>\\n<li>修改完毕后点击OK保存。</li>\\n<li>菜单项选择：<code>File</code> -&gt; <code>Export Font As...</code> -&gt; <code>Export as Desktop Font(ttf/otf)</code>，弹出<code>Export as Desktop Font(ttf/otf)</code>窗口。</li>\\n<li>在弹出窗口中将Outline Format项，通过下拉选择TrueType，不建议选CFF（测试时这个选项可能Identification标签页里面字体名不生效）。</li>\\n<li>底部三个按钮点击<code>Export</code>即可。最终保存文件窗口自己选择文件格式。</li>\\n</ol>\"}")
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
