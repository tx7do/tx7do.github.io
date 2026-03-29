import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_friend_wire.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_friend_wire.html\",\"title\":\"Kratos微服务与它的小伙伴系列 - 依赖注入库 - Wire\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是依赖注入？\",\"slug\":\"什么是依赖注入\",\"link\":\"#什么是依赖注入\",\"children\":[]},{\"level\":2,\"title\":\"什么是Wire？\",\"slug\":\"什么是wire\",\"link\":\"#什么是wire\",\"children\":[]},{\"level\":2,\"title\":\"Provider 和 Injector\",\"slug\":\"provider-和-injector\",\"link\":\"#provider-和-injector\",\"children\":[{\"level\":3,\"title\":\"Provider\",\"slug\":\"provider\",\"link\":\"#provider\",\"children\":[]},{\"level\":3,\"title\":\"Injector\",\"slug\":\"injector\",\"link\":\"#injector\",\"children\":[]}]},{\"level\":2,\"title\":\"与Kratos携起手来\",\"slug\":\"与kratos携起手来\",\"link\":\"#与kratos携起手来\",\"children\":[{\"level\":3,\"title\":\"Wire命令行工具安装\",\"slug\":\"wire命令行工具安装\",\"link\":\"#wire命令行工具安装\",\"children\":[]},{\"level\":3,\"title\":\"场景代码\",\"slug\":\"场景代码\",\"link\":\"#场景代码\",\"children\":[]},{\"level\":3,\"title\":\"没有Wire，我们该如何组装代码？\",\"slug\":\"没有wire-我们该如何组装代码\",\"link\":\"#没有wire-我们该如何组装代码\",\"children\":[]},{\"level\":3,\"title\":\"有了Wire，我们可以如何组装代码？\",\"slug\":\"有了wire-我们可以如何组装代码\",\"link\":\"#有了wire-我们可以如何组装代码\",\"children\":[]}]},{\"level\":2,\"title\":\"注意事项\",\"slug\":\"注意事项\",\"link\":\"#注意事项\",\"children\":[]},{\"level\":2,\"title\":\"结语\",\"slug\":\"结语\",\"link\":\"#结语\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_friend_wire.md\",\"excerpt\":\"\\n<h2>什么是依赖注入？</h2>\\n<p>依赖注入 (Dependency Injection，缩写为 DI)，是一种软件设计模式，也是实现控制反转(Inversion of Control)的其中一种技术。这种模式能让一个物件接收它所依赖的其他物件。“依赖”是指接收方所需的对象。“注入”是指将“依赖”传递给接收方的过程。在“注入”之后，接收方才会调用该“依赖”。此模式确保了任何想要使用给定服务的物件不需要知道如何建立这些服务。取而代之的是，连接收方物件（像是 client）也不知道它存在的外部代码（注入器）提供接收方所需的服务。</p>\\n<p>依赖注入涉及四个概念：</p>\\n<ol>\\n<li>服务：任何类，提供了有用功能。</li>\\n<li>客户：使用服务的类。</li>\\n<li>接口：客户不应该知道服务实现的细节，只需要知道服务的名称和 API。</li>\\n<li>注入器：Injector，也称 assembler、container、provider 或 factory。负责把服务引入给客户。\\n依赖注入把对象构建与对象注入分开。因此创建对象的 new 关键字也可消失了。</li>\\n</ol>\"}")
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
