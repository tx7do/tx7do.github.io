import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/lockstep_and_state_sync.html.vue"
const data = JSON.parse("{\"path\":\"/posts/lockstep_and_state_sync.html\",\"title\":\"帧同步和状态同步\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"游戏开发\"],\"tag\":[\"状态同步\",\"帧同步\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"帧同步/锁步同步 (Lockstep Synchronization)\",\"slug\":\"帧同步-锁步同步-lockstep-synchronization\",\"link\":\"#帧同步-锁步同步-lockstep-synchronization\",\"children\":[]},{\"level\":2,\"title\":\"状态同步 (State Synchronization)\",\"slug\":\"状态同步-state-synchronization\",\"link\":\"#状态同步-state-synchronization\",\"children\":[]},{\"level\":2,\"title\":\"乐观帧锁定 (Bucket Synchronization)\",\"slug\":\"乐观帧锁定-bucket-synchronization\",\"link\":\"#乐观帧锁定-bucket-synchronization\",\"children\":[]},{\"level\":2,\"title\":\"状态同步和帧同步的比较\",\"slug\":\"状态同步和帧同步的比较\",\"link\":\"#状态同步和帧同步的比较\",\"children\":[]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/lockstep_and_state_sync.md\",\"excerpt\":\"\\n<h2>帧同步/锁步同步 (Lockstep Synchronization)</h2>\\n<p>什么是帧同步：帧同步常被RTS(即时战略)游戏常采用。在游戏中同步的是玩家的操作指令，操作指令包含当前的帧索引。一般的流程是客户端上传操作到服务器，\\n服务器收到后并不计算游戏行为， 而是转发到所有客户端。这里最重要的概念就是 相同的输入 + 相同的时机 = 相同的输出。</p>\\n<p>实现帧同步的流程一般是：</p>\\n<ol>\\n<li>同步随机数种子。(一般游戏中都设计随机数的使用， 通过同步随机数种子，可以保持随机数一致性)</li>\\n<li>客户端上传操作指令。(指令包括游戏操作和当前帧索引)</li>\\n<li>服务器广播所有客户端的操作。(如果没有操作， 也要广播空指令来驱动游戏帧前进)。</li>\\n</ol>\"}")
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
