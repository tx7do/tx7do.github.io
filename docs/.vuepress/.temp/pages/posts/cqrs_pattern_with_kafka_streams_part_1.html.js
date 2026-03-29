import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cqrs_pattern_with_kafka_streams_part_1.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cqrs_pattern_with_kafka_streams_part_1.html\",\"title\":\"Kafka Streams 实现 CQRS 模式 — 第 1 部分\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"架构设计\"],\"tag\":[\"CQRS\",\"Kafka Streams\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"案例研究：在线订购系统\",\"slug\":\"案例研究-在线订购系统\",\"link\":\"#案例研究-在线订购系统\",\"children\":[]},{\"level\":2,\"title\":\"实现 CQRS模式\",\"slug\":\"实现-cqrs模式\",\"link\":\"#实现-cqrs模式\",\"children\":[]},{\"level\":2,\"title\":\"实现 事件溯源\",\"slug\":\"实现-事件溯源\",\"link\":\"#实现-事件溯源\",\"children\":[]},{\"level\":2,\"title\":\"使用 Apache Kafka Streams 实现 CQRS\",\"slug\":\"使用-apache-kafka-streams-实现-cqrs\",\"link\":\"#使用-apache-kafka-streams-实现-cqrs\",\"children\":[]},{\"level\":2,\"title\":\"实现代码\",\"slug\":\"实现代码\",\"link\":\"#实现代码\",\"children\":[]},{\"level\":2,\"title\":\"翻译自\",\"slug\":\"翻译自\",\"link\":\"#翻译自\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/cqrs_pattern_with_kafka_streams_part_1.md\",\"excerpt\":\"\\n<p>CQRS 代表：<strong>命令查询职责分离(Command Query Responsibility Segregation)</strong>。它提倡分离“命令(Command)”和“查询(Query)”的“职责(Responsibility)”。在本文中，我将尝试回答以下问题：</p>\\n<ul>\\n<li>什么是 CQRS？</li>\\n<li>为什么 Kafka Streams 是实现 CQRS 很自然的选择？</li>\\n<li>如何使用 Kafka Streams 实现 CQRS 模式？</li>\\n</ul>\\n<h2>案例研究：在线订购系统</h2>\\n<p>让我们从一个经典示例开始：零售在线订购系统。它有两个主要用例：</p>\"}")
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
