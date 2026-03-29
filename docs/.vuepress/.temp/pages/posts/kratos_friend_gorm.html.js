import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/kratos_friend_gorm.html.vue"
const data = JSON.parse("{\"path\":\"/posts/kratos_friend_gorm.html\",\"title\":\"Golang微服框架Kratos与它的小伙伴系列 - ORM框架 - GORM\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"Go-Kratos\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是ORM？\",\"slug\":\"什么是orm\",\"link\":\"#什么是orm\",\"children\":[]},{\"level\":2,\"title\":\"什么是GORM？\",\"slug\":\"什么是gorm\",\"link\":\"#什么是gorm\",\"children\":[]},{\"level\":2,\"title\":\"特性\",\"slug\":\"特性\",\"link\":\"#特性\",\"children\":[]},{\"level\":2,\"title\":\"安装库\",\"slug\":\"安装库\",\"link\":\"#安装库\",\"children\":[]},{\"level\":2,\"title\":\"GORM的一些数据库基本操作\",\"slug\":\"gorm的一些数据库基本操作\",\"link\":\"#gorm的一些数据库基本操作\",\"children\":[{\"level\":3,\"title\":\"连接数据库\",\"slug\":\"连接数据库\",\"link\":\"#连接数据库\",\"children\":[]},{\"level\":3,\"title\":\"自动迁移 Automatic Migration\",\"slug\":\"自动迁移-automatic-migration\",\"link\":\"#自动迁移-automatic-migration\",\"children\":[]},{\"level\":3,\"title\":\"定义模型\",\"slug\":\"定义模型\",\"link\":\"#定义模型\",\"children\":[]},{\"level\":3,\"title\":\"增 Create\",\"slug\":\"增-create\",\"link\":\"#增-create\",\"children\":[]},{\"level\":3,\"title\":\"删 Delete\",\"slug\":\"删-delete\",\"link\":\"#删-delete\",\"children\":[]},{\"level\":3,\"title\":\"改 Update\",\"slug\":\"改-update\",\"link\":\"#改-update\",\"children\":[]},{\"level\":3,\"title\":\"查 Read\",\"slug\":\"查-read\",\"link\":\"#查-read\",\"children\":[]}]},{\"level\":2,\"title\":\"与Kratos携起手来\",\"slug\":\"与kratos携起手来\",\"link\":\"#与kratos携起手来\",\"children\":[{\"level\":3,\"title\":\"创建数据库客户端\",\"slug\":\"创建数据库客户端\",\"link\":\"#创建数据库客户端\",\"children\":[]},{\"level\":3,\"title\":\"创建UseCase\",\"slug\":\"创建usecase\",\"link\":\"#创建usecase\",\"children\":[]},{\"level\":3,\"title\":\"创建Repo\",\"slug\":\"创建repo\",\"link\":\"#创建repo\",\"children\":[]},{\"level\":3,\"title\":\"在Service中调用\",\"slug\":\"在service中调用\",\"link\":\"#在service中调用\",\"children\":[]}]},{\"level\":2,\"title\":\"实例代码\",\"slug\":\"实例代码\",\"link\":\"#实例代码\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/kratos_friend_gorm.md\",\"excerpt\":\"\\n<h2>什么是ORM？</h2>\\n<p>面向对象编程和关系型数据库，都是目前最流行的技术，但是它们的模型是不一样的。</p>\\n<p>面向对象编程把所有实体看成对象（object），关系型数据库则是采用实体之间的关系（relation）连接数据。很早就有人提出，关系也可以用对象表达，这样的话，就能使用面向对象编程，来操作关系型数据库。</p>\\n<p>简单说，ORM 就是通过实例对象的语法，完成关系型数据库的操作的技术，是\\\"对象-关系映射\\\"（Object/Relational Mapping） 的缩写。</p>\\n<p>ORM 把数据库映射成对象。</p>\\n<ul>\\n<li>数据库的表（table） --&gt; 类（class）</li>\\n<li>记录（record，行数据）--&gt; 对象（object）</li>\\n<li>字段（field）--&gt; 对象的属性（attribute）</li>\\n</ul>\"}")
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
