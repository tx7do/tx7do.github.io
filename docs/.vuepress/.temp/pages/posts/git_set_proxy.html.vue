<template><div><h1 id="git设置网络代理" tabindex="-1"><a class="header-anchor" href="#git设置网络代理"><span>Git设置网络代理</span></a></h1>
<h2 id="设置http代理" tabindex="-1"><a class="header-anchor" href="#设置http代理"><span>设置HTTP代理</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> http.proxy http://127.0.0.1:1080</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="设置https代理" tabindex="-1"><a class="header-anchor" href="#设置https代理"><span>设置HTTPS代理</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> https.proxy https://127.0.0.1:1080</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="取消http代理" tabindex="-1"><a class="header-anchor" href="#取消http代理"><span>取消HTTP代理</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> http.proxy</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="取消https代理" tabindex="-1"><a class="header-anchor" href="#取消https代理"><span>取消HTTPS代理</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> https.proxy</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="查看系统配置信息" tabindex="-1"><a class="header-anchor" href="#查看系统配置信息"><span>查看系统配置信息</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--system</span> <span class="token parameter variable">--list</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="查看当前用户配置信息" tabindex="-1"><a class="header-anchor" href="#查看当前用户配置信息"><span>查看当前用户配置信息</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span>  <span class="token parameter variable">--list</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="查看当前仓库配置信息" tabindex="-1"><a class="header-anchor" href="#查看当前仓库配置信息"><span>查看当前仓库配置信息</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--local</span>  <span class="token parameter variable">--list</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


