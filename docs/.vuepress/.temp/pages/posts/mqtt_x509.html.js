import comp from "C:/Users/yangl/Desktop/tx7do.github.io/docs/.vuepress/.temp/pages/posts/mqtt_x509.html.vue"
const data = JSON.parse("{\"path\":\"/posts/mqtt_x509.html\",\"title\":\"MQTT用X509进行认证\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2020-01-01T00:00:00.000Z\",\"category\":[\"编程技术\"],\"tag\":[\"MQTT\"],\"sticky\":10},\"headers\":[{\"level\":2,\"title\":\"什么是SSL\",\"slug\":\"什么是ssl\",\"link\":\"#什么是ssl\",\"children\":[]},{\"level\":2,\"title\":\"什么是SSL证书？\",\"slug\":\"什么是ssl证书\",\"link\":\"#什么是ssl证书\",\"children\":[]},{\"level\":2,\"title\":\"什么是TLS\",\"slug\":\"什么是tls\",\"link\":\"#什么是tls\",\"children\":[]},{\"level\":2,\"title\":\"什么是mTLS\",\"slug\":\"什么是mtls\",\"link\":\"#什么是mtls\",\"children\":[]},{\"level\":2,\"title\":\"什么是X509\",\"slug\":\"什么是x509\",\"link\":\"#什么是x509\",\"children\":[]},{\"level\":2,\"title\":\"证书格式类型\",\"slug\":\"证书格式类型\",\"link\":\"#证书格式类型\",\"children\":[{\"level\":3,\"title\":\"DER\",\"slug\":\"der\",\"link\":\"#der\",\"children\":[]},{\"level\":3,\"title\":\"PEM\",\"slug\":\"pem\",\"link\":\"#pem\",\"children\":[]},{\"level\":3,\"title\":\"CRT\",\"slug\":\"crt\",\"link\":\"#crt\",\"children\":[]},{\"level\":3,\"title\":\"PFX\",\"slug\":\"pfx\",\"link\":\"#pfx\",\"children\":[]},{\"level\":3,\"title\":\"JKS\",\"slug\":\"jks\",\"link\":\"#jks\",\"children\":[]}]},{\"level\":2,\"title\":\"golang实例代码\",\"slug\":\"golang实例代码\",\"link\":\"#golang实例代码\",\"children\":[{\"level\":3,\"title\":\"TLS证书单向认证\",\"slug\":\"tls证书单向认证\",\"link\":\"#tls证书单向认证\",\"children\":[]},{\"level\":3,\"title\":\"mTLS证书双向认证\",\"slug\":\"mtls证书双向认证\",\"link\":\"#mtls证书双向认证\",\"children\":[]},{\"level\":3,\"title\":\"完整代码\",\"slug\":\"完整代码\",\"link\":\"#完整代码\",\"children\":[]}]},{\"level\":2,\"title\":\"参考资料\",\"slug\":\"参考资料\",\"link\":\"#参考资料\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/mqtt_x509.md\",\"excerpt\":\"\\n<h2>什么是SSL</h2>\\n<p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS（传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 <a href=\\\"https://tools.ietf.org/html/rfc8446\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">RFC 8446</a> （八月2018）。</p>\"}")
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
