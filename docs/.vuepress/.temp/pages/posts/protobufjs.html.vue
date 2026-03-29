<template><div><h1 id="protobufjs" tabindex="-1"><a class="header-anchor" href="#protobufjs"><span>Protobufjs</span></a></h1>
<h2 id="_7-x-x和6-x-x差异" tabindex="-1"><a class="header-anchor" href="#_7-x-x和6-x-x差异"><span>7.x.x和6.x.x差异</span></a></h2>
<p>6是运行时和CLI都在一起，7则拆分开来了。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">pnpm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> protobufjs</span>
<span class="line"><span class="token function">pnpm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> protobufjs-cli</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生成代码" tabindex="-1"><a class="header-anchor" href="#生成代码"><span>生成代码</span></a></h2>
<h3 id="生成json-适用于light库" tabindex="-1"><a class="header-anchor" href="#生成json-适用于light库"><span>生成JSON，适用于light库</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pbjs <span class="token parameter variable">-t</span> json <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/include/protocol/*.proto <span class="token operator">></span> src/api/proto.json</span>
<span class="line">pbjs <span class="token parameter variable">-t</span> json-module <span class="token parameter variable">-w</span> commonjs <span class="token parameter variable">-p</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/include/protocol/ <span class="token parameter variable">-o</span> src/api/proto.js <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/include/protocol/*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生成javascript代码-适用于minimal库" tabindex="-1"><a class="header-anchor" href="#生成javascript代码-适用于minimal库"><span>生成JavaScript代码，适用于minimal库</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pbjs <span class="token parameter variable">-t</span> static-module <span class="token parameter variable">-w</span> commonjs <span class="token parameter variable">-p</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/include/protocol/ <span class="token parameter variable">-o</span> src/api/proto.js <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/include/protocol/*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="用于直接从proto转换为typescript" tabindex="-1"><a class="header-anchor" href="#用于直接从proto转换为typescript"><span>用于直接从proto转换为typescript</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pbts convert <span class="token parameter variable">-o</span> src/api/proto.ts <span class="token parameter variable">-i</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/include/protocol/net_core.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


