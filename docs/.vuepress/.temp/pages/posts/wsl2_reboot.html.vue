<template><div><h1 id="wsl2重启" tabindex="-1"><a class="header-anchor" href="#wsl2重启"><span>WSL2重启</span></a></h1>
<p>列出WSL子系统</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">wslconfig /list</span>
<span class="line">wsl <span class="token parameter variable">--list</span></span>
<span class="line">wsl <span class="token parameter variable">-l</span> <span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关闭Ubuntu子系统</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">wsl <span class="token parameter variable">--terminate</span> Ubuntu</span>
<span class="line">wsl <span class="token parameter variable">-t</span> Ubuntu</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>关闭WSL</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">wsl <span class="token parameter variable">--shutdown</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>启动WSL</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">wsl</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


