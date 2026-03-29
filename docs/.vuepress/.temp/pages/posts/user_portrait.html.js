import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/user_portrait.html.vue"
const data = JSON.parse("{\"path\":\"/posts/user_portrait.html\",\"title\":\"用户画像\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"用户画像\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"用户画像的3种标签类型\",\"slug\":\"用户画像的3种标签类型\",\"link\":\"#用户画像的3种标签类型\",\"children\":[]},{\"level\":2,\"title\":\"用户画像8大系统模块\",\"slug\":\"用户画像8大系统模块\",\"link\":\"#用户画像8大系统模块\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/user_portrait.md\",\"excerpt\":\"\\n<h2>用户画像的3种标签类型</h2>\\n<p>用户画像建模其实就是对用户“打标签”，从对用户打标签的方式来看，一般分为3种类型：①统计类标签；②规则类标签；③机器学习挖掘类标签。</p>\\n<p>下面我们介绍这3种类型的标签的区别：</p>\\n<ol>\\n<li>\\n<p>统计类标签</p>\\n<p>这类标签是最为基础也最为常见的标签类型，例如，对于某个用户来说，其性别、年龄、城市、星座、近7日活跃时长、近7日活跃天数、近7日活跃次数等字段可以从用户注册数据、用户访问、消费数据中统计得出。该类标签构成了用户画像的基础。</p>\\n</li>\\n<li>\\n<p>规则类标签</p>\\n<p>该类标签基于用户行为及确定的规则产生。例如，对平台上“消费活跃”用户这一口径的定义为“近30天交易次数≥2”。在实际开发画像的过程中，由于运营人员对业务更为熟悉，而数据人员对数据的结构、分布、特征更为熟悉，因此规则类标签的规则由运营人员和数据人员共同协商确定；</p>\\n</li>\\n<li>\\n<p>机器学习挖掘类标签</p>\\n<p>该类标签通过机器学习挖掘产生，用于对用户的某些属性或某些行为进行预测判断。例如，根据一个用户的行为习惯判断该用户是男性还是女性、根据一个用户的消费习惯判断其对某商品的偏好程度。该类标签需要通过算法挖掘产生。</p>\\n</li>\\n</ol>\"}")
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
