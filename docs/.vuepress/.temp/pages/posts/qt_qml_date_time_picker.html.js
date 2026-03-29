import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/qt_qml_date_time_picker.html.vue"
const data = JSON.parse("{\"path\":\"/posts/qt_qml_date_time_picker.html\",\"title\":\"Qt6 QML 自定义 DateTimePicker 组件：完整实现与使用指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"C++编程\"],\"tag\":[\"C++\",\"Qt\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、组件核心特性\",\"slug\":\"一、组件核心特性\",\"link\":\"#一、组件核心特性\",\"children\":[]},{\"level\":2,\"title\":\"二、完整实现代码\",\"slug\":\"二、完整实现代码\",\"link\":\"#二、完整实现代码\",\"children\":[]},{\"level\":2,\"title\":\"三、组件使用示例\",\"slug\":\"三、组件使用示例\",\"link\":\"#三、组件使用示例\",\"children\":[]},{\"level\":2,\"title\":\"四、关键属性与信号说明\",\"slug\":\"四、关键属性与信号说明\",\"link\":\"#四、关键属性与信号说明\",\"children\":[]},{\"level\":2,\"title\":\"五、注意事项\",\"slug\":\"五、注意事项\",\"link\":\"#五、注意事项\",\"children\":[]},{\"level\":2,\"title\":\"六、扩展方向\",\"slug\":\"六、扩展方向\",\"link\":\"#六、扩展方向\",\"children\":[]},{\"level\":2,\"title\":\"七、总结\",\"slug\":\"七、总结\",\"link\":\"#七、总结\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/qt_qml_date_time_picker.md\",\"excerpt\":\"\\n<p>在 Qt 开发中，原生的日期时间选择组件往往难以满足个性化的 UI 设计和交互需求（如深色主题、自定义时间范围、键盘导航等）。本文基于 Qt6.10 版本，从零实现一款功能完整、交互友好的 DateTimePicker 组件，支持日期 + 时间联动选择、时间范围限制、键盘 / 鼠标双交互、深色主题适配等特性，可直接集成到 QML 项目中。</p>\\n<h2>一、组件核心特性</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>特性</th>\\n<th>说明</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>深色主题适配</td>\\n<td>内置统一的深色系样式常量，支持快速切换主题</td>\\n</tr>\\n<tr>\\n<td>完整时间维度选择</td>\\n<td>支持年、月、日、时、分、秒全维度选择，日历网格可视化展示</td>\\n</tr>\\n<tr>\\n<td>时间范围限制</td>\\n<td>通过 <code>minDateTime</code>/<code>maxDateTime</code> 限制可选时间范围，禁用超出范围的选项</td>\\n</tr>\\n<tr>\\n<td>双交互模式</td>\\n<td>支持鼠标点击 / 悬停、键盘方向键 / Tab/Enter/Escape 操作</td>\\n</tr>\\n<tr>\\n<td>智能视觉反馈</td>\\n<td>选中状态高亮、禁用状态灰显、悬停效果、焦点区域提示</td>\\n</tr>\\n<tr>\\n<td>快捷操作</td>\\n<td>内置「今天」快捷按钮，一键恢复当前系统时间</td>\\n</tr>\\n<tr>\\n<td>自动月份切换</td>\\n<td>点击非当前月日期时，自动切换到对应月份</td>\\n</tr>\\n</tbody>\\n</table>\"}")
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
