import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_inheritance.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_inheritance.html\",\"title\":\"Go 接口与代码复用：替代继承的设计哲学\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、前言\",\"slug\":\"一、前言\",\"link\":\"#一、前言\",\"children\":[]},{\"level\":2,\"title\":\"二、Go 中的 “单一复用”（类似单一继承）\",\"slug\":\"二、go-中的-单一复用-类似单一继承\",\"link\":\"#二、go-中的-单一复用-类似单一继承\",\"children\":[{\"level\":3,\"title\":\"2.1 仅通过接口实现（隐式多态）\",\"slug\":\"_2-1-仅通过接口实现-隐式多态\",\"link\":\"#_2-1-仅通过接口实现-隐式多态\",\"children\":[]},{\"level\":3,\"title\":\"2.2 结构体组合（嵌入）实现代码复用（类似基类继承）\",\"slug\":\"_2-2-结构体组合-嵌入-实现代码复用-类似基类继承\",\"link\":\"#_2-2-结构体组合-嵌入-实现代码复用-类似基类继承\",\"children\":[]}]},{\"level\":2,\"title\":\"三、Go 中的 “多组合”（类似多重继承）\",\"slug\":\"三、go-中的-多组合-类似多重继承\",\"link\":\"#三、go-中的-多组合-类似多重继承\",\"children\":[{\"level\":3,\"title\":\"类比 C++ 伪代码\",\"slug\":\"类比-c-伪代码-2\",\"link\":\"#类比-c-伪代码-2\",\"children\":[]},{\"level\":3,\"title\":\"Go 实现代码（多嵌入结构体）\",\"slug\":\"go-实现代码-多嵌入结构体\",\"link\":\"#go-实现代码-多嵌入结构体\",\"children\":[]}]},{\"level\":2,\"title\":\"四、Go 与 C++ 核心区别总结\",\"slug\":\"四、go-与-c-核心区别总结\",\"link\":\"#四、go-与-c-核心区别总结\",\"children\":[]},{\"level\":2,\"title\":\"五、完整代码仓库\",\"slug\":\"五、完整代码仓库\",\"link\":\"#五、完整代码仓库\",\"children\":[]},{\"level\":2,\"title\":\"六、总结\",\"slug\":\"六、总结\",\"link\":\"#六、总结\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_inheritance.md\",\"excerpt\":\"\\n<h2>一、前言</h2>\\n<p>Go 是 Google 设计的类 C 静态类型语言，兼顾底层性能与开发效率。它并非传统意义上的面向对象（OOP）语言 —— 没有 class 关键字，也不支持传统的 “继承” 语法，但通过 <strong>接口的隐式实现</strong> 和 <strong>结构体组合（嵌入）</strong>，Go 能灵活实现 OOP 的核心特性（多态、代码复用），且设计更简洁、无继承带来的耦合问题。\\n与 C++ 相比，Go 的设计哲学是 “<strong>组合优于继承</strong>”：用接口实现多态，用结构体嵌入实现代码复用，既避免了继承的复杂语法，又解决了多重继承的歧义问题。本文将通过类比 C++ 的接口 / 继承逻辑，详解 Go 如何实现类似效果。</p>\"}")
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
