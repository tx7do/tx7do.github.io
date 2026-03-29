<template><div><h1 id="docker在国内没有代理的解决方案" tabindex="-1"><a class="header-anchor" href="#docker在国内没有代理的解决方案"><span>Docker在国内没有代理的解决方案</span></a></h1>
<p>Docker的国内代理都失效了，不抱怨，只讲如何解决问题。</p>
<p>简单来说，就是把本地的镜像导出来，然后打成压缩包，再拷贝到服务器上去，然后再导入。</p>
<h2 id="导出镜像" tabindex="-1"><a class="header-anchor" href="#导出镜像"><span>导出镜像</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> save bitnami/minio:latest <span class="token parameter variable">-o</span> minio.tar</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="导入镜像" tabindex="-1"><a class="header-anchor" href="#导入镜像"><span>导入镜像</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> load <span class="token parameter variable">-i</span> minio.tar</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="查看本地镜像" tabindex="-1"><a class="header-anchor" href="#查看本地镜像"><span>查看本地镜像</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> images</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这时候，就会发现MinIO的镜像已经存在于服务器本地了。这个时候就可以调用<code v-pre>docker run</code>部署了。</p>
</div></template>


