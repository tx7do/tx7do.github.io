<template><div><h1 id="docker-容器中安装vim" tabindex="-1"><a class="header-anchor" href="#docker-容器中安装vim"><span>Docker 容器中安装VIM</span></a></h1>
<p>Docker的容器当中一般是没有安装任何编辑器的,vi和vim神马的都没有.如果想要在容器中使用编辑器,需要自己去安装.<br>
但是,在 Docker 中执行：<code v-pre>apt-get update</code>报错:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">E: List directory /var/lib/apt/lists/partial is missing. - Acquire <span class="token punctuation">(</span><span class="token number">13</span>: Permission denied<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这是因为在Docker Desktop中启动命令行时并没有以管理员身份启动,而是以普通用户的身份启动的,权限不足.<br>
要解决这个问题,需要用以下命令启动 :</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-u</span> <span class="token number">0</span> <span class="token parameter variable">-it</span> <span class="token punctuation">{</span>容器id<span class="token punctuation">}</span> /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>其中<code v-pre>-u 0</code>代表是以<code v-pre>root</code>用户启动Docker的命令行,再执行更新命令就可以了.</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">apt-get</span> <span class="token function">install</span> <span class="token function">vim</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这就行了,再到Docker Desktop中启动容器的命令行,这时候已经有vim了.</p>
</div></template>


