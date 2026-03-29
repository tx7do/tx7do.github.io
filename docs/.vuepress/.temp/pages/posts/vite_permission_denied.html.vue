<template><div><h1 id="vite-permission-denied-问题" tabindex="-1"><a class="header-anchor" href="#vite-permission-denied-问题"><span>Vite permission denied 问题</span></a></h1>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"> ERROR  error when starting dev server:                                                                                                                                                                                                                                <span class="token number">11</span>:51:39  </span>
<span class="line">Error: listen EACCES: permission denied <span class="token number">0.0</span>.0.0:3100</span>
<span class="line">    at Server.setupListenHandle <span class="token punctuation">[</span>as _listen2<span class="token punctuation">]</span> <span class="token punctuation">(</span>node:net:1723:21<span class="token punctuation">)</span></span>
<span class="line">    at listenInCluster <span class="token punctuation">(</span>node:net:1788:12<span class="token punctuation">)</span></span>
<span class="line">    at Server.listen <span class="token punctuation">(</span>node:net:1876:7<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有时候，使用<code v-pre>pnpm run dev</code>启动服务的时候，会报上面的错误，网上查了一下，说把<code v-pre>node_modules</code>删掉了就可以了，文章在这里：<a href="https://stackoverflow.com/questions/75322932/sh-1-vite-permission-denied" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/75322932/sh-1-vite-permission-denied</a>，但是事实上，这个方法并没有用。</p>
<p>后来，我想可能是低位端口号的缘故，可是，Linux下面的话都是1024以下Root无权限，我这个是Windows11，也不该有这个问题吧，抱着试一试的心态，我就改成了改为高位的端口号：<code v-pre>31000</code>，没想到居然没问题了。</p>
</div></template>


