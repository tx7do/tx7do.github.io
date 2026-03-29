import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cpp_type_cast_4.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cpp_type_cast_4.html\",\"title\":\"C++ 类型转换：旧风格与四种新风格详解\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"C++编程\"],\"tag\":[\"C++\",\"类型转换\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、旧风格（C-style）强制转型\",\"slug\":\"一、旧风格-c-style-强制转型\",\"link\":\"#一、旧风格-c-style-强制转型\",\"children\":[]},{\"level\":2,\"title\":\"二、C++ 新风格四种强制转型\",\"slug\":\"二、c-新风格四种强制转型\",\"link\":\"#二、c-新风格四种强制转型\",\"children\":[{\"level\":3,\"title\":\"1. dynamic_cast：安全的向下转型\",\"slug\":\"_1-dynamic-cast-安全的向下转型\",\"link\":\"#_1-dynamic-cast-安全的向下转型\",\"children\":[]},{\"level\":3,\"title\":\"2. static_cast：通用型显式转换\",\"slug\":\"_2-static-cast-通用型显式转换\",\"link\":\"#_2-static-cast-通用型显式转换\",\"children\":[]},{\"level\":3,\"title\":\"3. const_cast：消除常量性专用\",\"slug\":\"_3-const-cast-消除常量性专用\",\"link\":\"#_3-const-cast-消除常量性专用\",\"children\":[]},{\"level\":3,\"title\":\"4. reinterpret_cast：底层比特级转换\",\"slug\":\"_4-reinterpret-cast-底层比特级转换\",\"link\":\"#_4-reinterpret-cast-底层比特级转换\",\"children\":[]}]},{\"level\":2,\"title\":\"三、核心转换对比：明确适用边界\",\"slug\":\"三、核心转换对比-明确适用边界\",\"link\":\"#三、核心转换对比-明确适用边界\",\"children\":[{\"level\":3,\"title\":\"1. dynamic_cast vs static_cast（继承体系转换）\",\"slug\":\"_1-dynamic-cast-vs-static-cast-继承体系转换\",\"link\":\"#_1-dynamic-cast-vs-static-cast-继承体系转换\",\"children\":[]},{\"level\":3,\"title\":\"2. static_cast vs reinterpret_cast（基础类型 / 指针转换）\",\"slug\":\"_2-static-cast-vs-reinterpret-cast-基础类型-指针转换\",\"link\":\"#_2-static-cast-vs-reinterpret-cast-基础类型-指针转换\",\"children\":[]}]},{\"level\":2,\"title\":\"四、总结：转换选择优先级\",\"slug\":\"四、总结-转换选择优先级\",\"link\":\"#四、总结-转换选择优先级\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cpp_type_cast_4.md\",\"excerpt\":\"\\n<p>在 C++ 编程中，类型转换是连接不同数据类型的重要手段。C++ 同时支持兼容 C 语言的旧风格强制转型，以及针对特定场景设计的四种新风格强制转型，后者在可读性、安全性和规范性上更具优势。本文将详细解析各类转换的语法、用途及核心差异。</p>\\n<h2>一、旧风格（C-style）强制转型</h2>\\n<p>C 风格强制转型包含两种语法形式，本质功能完全一致，仅括号位置不同：</p>\\n<ul>\\n<li>格式 1：<code>(T) expression</code>（将表达式转换为 <code>T</code> 类型）</li>\\n<li>格式 2：<code>T(expression)</code>（函数式语法，效果同上）</li>\\n</ul>\"}")
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
