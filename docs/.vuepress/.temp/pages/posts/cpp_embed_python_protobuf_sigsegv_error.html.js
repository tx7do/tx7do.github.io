import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/cpp_embed_python_protobuf_sigsegv_error.html.vue"
const data = JSON.parse("{\"path\":\"/posts/cpp_embed_python_protobuf_sigsegv_error.html\",\"title\":\"关于C++嵌入Python引用protobuf引起的一个SIGSEGV错误的解决过程\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"C++编程\"],\"tag\":[\"C++\",\"Python\"],\"sticky\":10},\"headers\":[],\"git\":{},\"filePathRelative\":\"posts/cpp_embed_python_protobuf_sigsegv_error.md\",\"excerpt\":\"\\n<p>首先，我的应用场景是这样的，我是一个C++为宿主的程序，内嵌了Python，我C++里边有引用C++版的protobuf动态链接库。Python里边也有用到Python版的Protobuf。两者都用了同一版本的protobuf: 3.13.0。</p>\\n<p>因为我是插件式的系统，我单独测试Python脚本系统插件的时候，一切都是完美的。然后，我将插件集成到主程序里边去，就完犊子了。只要我在Python中import到protobuf的协议，主程序就会以SIGSEGV信号崩掉。</p>\\n<p>最终堆栈挂在了<code>_message.cpython-35m-x86_64-linux-gnu.so</code>的<code>google::protobuf::DescriptorPool::FindFileByName()</code>这里：</p>\"}")
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
