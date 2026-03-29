<template><div><h1 id="docker内部安装软件" tabindex="-1"><a class="header-anchor" href="#docker内部安装软件"><span>Docker内部安装软件</span></a></h1>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token punctuation">{</span>容器名<span class="token punctuation">}</span> <span class="token string">"apt update"</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token punctuation">{</span>容器名<span class="token punctuation">}</span> <span class="token string">"apt install {软件名}"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Debian/Ubuntu系用<code v-pre>apt</code>安装</li>
<li>Alpine Linux用<code v-pre>apk</code>安装</li>
<li>RedHat/Centos系用<code v-pre>yum</code>安装</li>
</ul>
<h2 id="替换镜像源" tabindex="-1"><a class="header-anchor" href="#替换镜像源"><span>替换镜像源</span></a></h2>
<h3 id="debian" tabindex="-1"><a class="header-anchor" href="#debian"><span>Debian</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'s/deb.debian.org/mirrors.tencent.com/g'</span> /etc/apt/sources.list.d/debian.sources</span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'s/http:/https:/g'</span> /etc/apt/sources.list.d/debian.sources</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ubuntu" tabindex="-1"><a class="header-anchor" href="#ubuntu"><span>Ubuntu</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'s/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g'</span> /etc/apt/sources.list</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="alpine-linux用" tabindex="-1"><a class="header-anchor" href="#alpine-linux用"><span>Alpine Linux用</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'s/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g'</span> /etc/apk/repositories</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="centos" tabindex="-1"><a class="header-anchor" href="#centos"><span>Centos</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 对于 CentOS 7</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">'s|^mirrorlist=|#mirrorlist=|g'</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token string">'s|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g'</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\</span></span>
<span class="line">    /etc/yum.repos.d/CentOS-*.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 对于 CentOS 8</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">'s|^mirrorlist=|#mirrorlist=|g'</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token string">'s|^#baseurl=http://mirror.centos.org/$contentdir|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g'</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\</span></span>
<span class="line">    /etc/yum.repos.d/CentOS-*.repo</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


