import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/go_event_loop.html.vue"
const data = JSON.parse("{\"path\":\"/posts/go_event_loop.html\",\"title\":\"Go单协程事件调度器：游戏后端的无锁有序与响应时间掌控\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"Go编程\"],\"tag\":[\"Golang\",\"算法\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"一、响应时间控制：单协程调度的生命线\",\"slug\":\"一、响应时间控制-单协程调度的生命线\",\"link\":\"#一、响应时间控制-单协程调度的生命线\",\"children\":[{\"level\":3,\"title\":\"1.1 核心事件耗时指标与影响分级\",\"slug\":\"_1-1-核心事件耗时指标与影响分级\",\"link\":\"#_1-1-核心事件耗时指标与影响分级\",\"children\":[]},{\"level\":3,\"title\":\"1.2 指标背后的逻辑：基于游戏帧的预算计算\",\"slug\":\"_1-2-指标背后的逻辑-基于游戏帧的预算计算\",\"link\":\"#_1-2-指标背后的逻辑-基于游戏帧的预算计算\",\"children\":[]},{\"level\":3,\"title\":\"1.3 超时事件的解决方案：三大核心优化策略\",\"slug\":\"_1-3-超时事件的解决方案-三大核心优化策略\",\"link\":\"#_1-3-超时事件的解决方案-三大核心优化策略\",\"children\":[]}]},{\"level\":2,\"title\":\"二、优先级控制：保障核心体验的调度逻辑\",\"slug\":\"二、优先级控制-保障核心体验的调度逻辑\",\"link\":\"#二、优先级控制-保障核心体验的调度逻辑\",\"children\":[{\"level\":3,\"title\":\"2.1 第一优先级（High）：玩家实时交互指令（WebSocket）\",\"slug\":\"_2-1-第一优先级-high-玩家实时交互指令-websocket\",\"link\":\"#_2-1-第一优先级-high-玩家实时交互指令-websocket\",\"children\":[]}]},{\"level\":2,\"title\":\"三、实践参考：Go单协程事件调度器实现\",\"slug\":\"三、实践参考-go单协程事件调度器实现\",\"link\":\"#三、实践参考-go单协程事件调度器实现\",\"children\":[{\"level\":3,\"title\":\"3.1 核心设计\",\"slug\":\"_3-1-核心设计\",\"link\":\"#_3-1-核心设计\",\"children\":[]},{\"level\":3,\"title\":\"3.2 参考代码\",\"slug\":\"_3-2-参考代码\",\"link\":\"#_3-2-参考代码\",\"children\":[]},{\"level\":3,\"title\":\"3.3 完整实现参考\",\"slug\":\"_3-3-完整实现参考\",\"link\":\"#_3-3-完整实现参考\",\"children\":[]}]},{\"level\":2,\"title\":\"四、总结：单协程调度的核心心法\",\"slug\":\"四、总结-单协程调度的核心心法\",\"link\":\"#四、总结-单协程调度的核心心法\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/go_event_loop.md\",\"excerpt\":\"\\n<p>在游戏后端架构设计中，<strong>单协程（单线程）事件调度器（Event Loop）</strong> 是实现 “<strong>绝对消息顺序</strong>” 与 “<strong>无锁状态管理</strong>” 的核心方案。</p>\\n<p>相较于多线程模型所面临的锁竞争、竞态条件、数据一致性等复杂问题，单协程调度器通过 完全串行化执行 所有核心逻辑，从根本上规避了并发安全风险——这一特性对于对状态准确性要求极高的游戏场景（如玩家血量、金币、技能释放结果、战斗胜负判定）具有决定性意义。</p>\\n<p>然而，串行执行也带来了严苛的约束：<strong>任何一个事件的处理延迟，都会直接放大为全服玩家的体验损耗</strong>。因此，单协程调度器的核心设计目标，是在保证逻辑有序性的前提下，<strong>极致控制响应时间，守住系统稳定性红线</strong>。</p>\"}")
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
