<template><div><h1 id="golang设置网络代理" tabindex="-1"><a class="header-anchor" href="#golang设置网络代理"><span>Golang设置网络代理</span></a></h1>
<h2 id="打开模块支持" tabindex="-1"><a class="header-anchor" href="#打开模块支持"><span>打开模块支持</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GO111MODULE</span><span class="token operator">=</span>on</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="取消代理" tabindex="-1"><a class="header-anchor" href="#取消代理"><span>取消代理</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>direct</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="取消校验" tabindex="-1"><a class="header-anchor" href="#取消校验"><span>取消校验</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOSUMDB</span><span class="token operator">=</span>off</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="设置不走-proxy-的私有仓库或组-多个用逗号相隔-可选" tabindex="-1"><a class="header-anchor" href="#设置不走-proxy-的私有仓库或组-多个用逗号相隔-可选"><span>设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPRIVATE</span><span class="token operator">=</span>git.mycompany.com,github.com/my/private</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="设置代理" tabindex="-1"><a class="header-anchor" href="#设置代理"><span>设置代理</span></a></h2>
<h3 id="国内常用代理列表" tabindex="-1"><a class="header-anchor" href="#国内常用代理列表"><span>国内常用代理列表</span></a></h3>
<table>
<thead>
<tr>
<th>提供者</th>
<th>地址</th>
</tr>
</thead>
<tbody>
<tr>
<td>官方全球代理</td>
<td>https://proxy.golang.com.cn</td>
</tr>
<tr>
<td>七牛云</td>
<td>https://goproxy.cn</td>
</tr>
<tr>
<td>阿里云</td>
<td>https://mirrors.aliyun.com/goproxy/</td>
</tr>
<tr>
<td>GoCenter</td>
<td>https://gocenter.io</td>
</tr>
<tr>
<td>百度</td>
<td>https://goproxy.bj.bcebos.com/</td>
</tr>
</tbody>
</table>
<p><strong>“direct”</strong> 为特殊指示符，用于指示 Go 回源到模块版本的源地址去抓取(比如 GitHub 等)，当值列表中上一个 Go module proxy 返回 404 或 410 错误时，Go 自动尝试列表中的下一个，遇见 <strong>“direct”</strong> 时回源，遇见 EOF 时终止并抛出类似 “invalid version: unknown revision...” 的错误。</p>
<h3 id="官方全球代理" tabindex="-1"><a class="header-anchor" href="#官方全球代理"><span>官方全球代理</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://proxy.golang.com.cn,direct</span>
<span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOSUMDB</span><span class="token operator">=</span>sum.golang.google.cn</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>或者</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://goproxy.io,direct</span>
<span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOSUMDB</span><span class="token operator">=</span>gosum.io+ce6e7565+AY5qEHUk/qmHc5btzW45JVoENfazw8LielDsaI+lEbq6</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="七牛云" tabindex="-1"><a class="header-anchor" href="#七牛云"><span>七牛云</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://goproxy.cn,direct</span>
<span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOSUMDB</span><span class="token operator">=</span>goproxy.cn/sumdb/sum.golang.org</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="阿里云" tabindex="-1"><a class="header-anchor" href="#阿里云"><span>阿里云</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://mirrors.aliyun.com/goproxy/,direct</span>
<span class="line"><span class="token comment"># GOSUMDB 不支持</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="gocenter" tabindex="-1"><a class="header-anchor" href="#gocenter"><span>GoCenter</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://gocenter.io,direct</span>
<span class="line"><span class="token comment"># 不支持 GOSUMDB</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="百度" tabindex="-1"><a class="header-anchor" href="#百度"><span>百度</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://goproxy.bj.bcebos.com/,direct</span>
<span class="line"><span class="token comment"># 不支持 GOSUMDB</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="warning-go-env-w-goproxy-does-not-override-conflicting-os-environment-variable" tabindex="-1"><a class="header-anchor" href="#warning-go-env-w-goproxy-does-not-override-conflicting-os-environment-variable"><span>warning: go env -w GOPROXY=... does not override conflicting OS environment variable</span></a></h2>
<p><strong>原因：</strong></p>
<p>之前安装go的时候，用环境变量的方式设置过代理地址，go13提供了-w参数来设置GOPROXY变量，但无法覆盖OS级别的环境变量</p>
<p><strong>解决方法：</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">unset</span> GOPROXY</span>
<span class="line"></span>
<span class="line"><span class="token comment"># or </span></span>
<span class="line"></span>
<span class="line">Clear-Variable GOPROXY</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://goproxy.io/zh/docs/" target="_blank" rel="noopener noreferrer">goproxy.io文档</a></li>
<li><a href="https://goproxy.io/zh/docs/" target="_blank" rel="noopener noreferrer">goproxy.io文档</a></li>
<li><a href="https://goproxy.cn/" target="_blank" rel="noopener noreferrer">七牛云文档</a></li>
<li><a href="https://developer.aliyun.com/mirror/goproxy" target="_blank" rel="noopener noreferrer">阿里云文档</a></li>
<li><a href="https://toutiao.io/posts/wj2sn6/preview" target="_blank" rel="noopener noreferrer">开发者头条文档</a></li>
<li><a href="https://goproxy.bj.bcebos.com/" target="_blank" rel="noopener noreferrer">百度文档</a></li>
<li><a href="https://learnku.com/go/wikis/38122" target="_blank" rel="noopener noreferrer">Go 国内加速：Go 国内加速镜像</a></li>
</ul>
</div></template>


