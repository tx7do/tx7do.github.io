import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/how_to_use_dexie_with_typescript.html.vue"
const data = JSON.parse("{\"path\":\"/posts/how_to_use_dexie_with_typescript.html\",\"title\":\"使用Dexie操作前端数据库IndexedDB 教程\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"Dexie\",\"IndexedDB\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、为什么选择 IndexedDB？\",\"slug\":\"一、为什么选择-indexeddb\",\"link\":\"#一、为什么选择-indexeddb\",\"children\":[]},{\"level\":2,\"title\":\"二、安装 Dexie\",\"slug\":\"二、安装-dexie\",\"link\":\"#二、安装-dexie\",\"children\":[]},{\"level\":2,\"title\":\"三、核心操作步骤\",\"slug\":\"三、核心操作步骤\",\"link\":\"#三、核心操作步骤\",\"children\":[{\"level\":3,\"title\":\"3.1 创建数据库（Database）\",\"slug\":\"_3-1-创建数据库-database\",\"link\":\"#_3-1-创建数据库-database\",\"children\":[]},{\"level\":3,\"title\":\"3.2 创建表（Table）\",\"slug\":\"_3-2-创建表-table\",\"link\":\"#_3-2-创建表-table\",\"children\":[]},{\"level\":3,\"title\":\"3.3 数据操作：增删改查（CRUD）\",\"slug\":\"_3-3-数据操作-增删改查-crud\",\"link\":\"#_3-3-数据操作-增删改查-crud\",\"children\":[]},{\"level\":3,\"title\":\"3.3.3 删除数据（删）\",\"slug\":\"_3-3-3-删除数据-删\",\"link\":\"#_3-3-3-删除数据-删\",\"children\":[]},{\"level\":3,\"title\":\"3.3.4 查询数据（查）\",\"slug\":\"_3-3-4-查询数据-查\",\"link\":\"#_3-3-4-查询数据-查\",\"children\":[]}]},{\"level\":2,\"title\":\"四、TypeScript 封装优化\",\"slug\":\"四、typescript-封装优化\",\"link\":\"#四、typescript-封装优化\",\"children\":[]},{\"level\":2,\"title\":\"五、查看 IndexedDB 数据\",\"slug\":\"五、查看-indexeddb-数据\",\"link\":\"#五、查看-indexeddb-数据\",\"children\":[]},{\"level\":2,\"title\":\"六、参考资料\",\"slug\":\"六、参考资料\",\"link\":\"#六、参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/how_to_use_dexie_with_typescript.md\",\"excerpt\":\"\\n<p>Dexie.js 是对前端本地数据库 IndexedDB 的 API 进行封装的轻量级库，它简化了 IndexedDB 复杂的原生操作，提供了更简洁、直观的语法，便于开发者快速实现前端本地数据的持久化存储。</p>\\n<h2>一、为什么选择 IndexedDB？</h2>\\n<p>前端常见的本地存储方案（Cookie、LocalStorage、SessionStorage）均存在存储容量限制，无法满足大数据量的存储需求。IndexedDB 作为浏览器原生的本地数据库，具备大容量存储优势，具体对比如下：</p>\\n<ul>\\n<li>Cookie：存储容量不超过 4KB，主要用于存储会话标识等少量信息；</li>\\n<li>LocalStorage：存储容量介于 2.5MB ~ 10MB 之间，仅支持字符串存储；</li>\\n<li>SessionStorage：存储容量与 LocalStorage 相当，但仅在当前会话有效，页面关闭后数据丢失；</li>\\n<li>IndexedDB：存储容量不低于 250MB，支持占用本地磁盘空间的 50%，可存储大量结构化数据，支持事务、索引等数据库核心特性。</li>\\n</ul>\"}")
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
