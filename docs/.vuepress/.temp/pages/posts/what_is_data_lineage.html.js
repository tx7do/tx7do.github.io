import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/what_is_data_lineage.html.vue"
const data = JSON.parse("{\"path\":\"/posts/what_is_data_lineage.html\",\"title\":\"什么是数据血缘\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"数据血缘\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"数据血缘的基本概念\",\"slug\":\"数据血缘的基本概念\",\"link\":\"#数据血缘的基本概念\",\"children\":[]},{\"level\":2,\"title\":\"数据血缘的常见用途\",\"slug\":\"数据血缘的常见用途\",\"link\":\"#数据血缘的常见用途\",\"children\":[{\"level\":3,\"title\":\"1. 提升调度性能\",\"slug\":\"_1-提升调度性能\",\"link\":\"#_1-提升调度性能\",\"children\":[]},{\"level\":3,\"title\":\"2. 数据异常定位\",\"slug\":\"_2-数据异常定位\",\"link\":\"#_2-数据异常定位\",\"children\":[]},{\"level\":3,\"title\":\"3.调度依赖的准确性判断\",\"slug\":\"_3-调度依赖的准确性判断\",\"link\":\"#_3-调度依赖的准确性判断\",\"children\":[]}]},{\"level\":2,\"title\":\"血缘对象分类\",\"slug\":\"血缘对象分类\",\"link\":\"#血缘对象分类\",\"children\":[]},{\"level\":2,\"title\":\"数据血缘关系的4个特征\",\"slug\":\"数据血缘关系的4个特征\",\"link\":\"#数据血缘关系的4个特征\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/what_is_data_lineage.md\",\"excerpt\":\"\\n<p>大数据时代，数据的来源极其广泛，各种类型的数据在快速产生，数据也是爆发性增长。从数据的产生，通过加工融合流转产生新的数据，到最终消亡，数据之间的关联关系可以称之为数据血缘关系。在数据中台的大背景下，数仓的开发者经常需要解决以下问题：</p>\\n<p>面对成百上千张的数据表，不知道该如何关联，也不知道这些表具有什么业务价值</p>\\n<p>执行过长，慢的无法忍受的SQL脚本，却不敢轻易进行整改</p>\\n<p>数据表是否包含机密数据需要被清理，以及这些机密数据是否被转存导致权限放大</p>\\n<p>其实，以上的这些问题都可以统一归类为数据发现问题。大部分企业会针对离线数仓任务进行SQL分析，构建表和字段的血缘关系，数据发现包括但不限于: 数据 表/列的业务分类分级和机密字段识别等。</p>\"}")
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
