<template><div><h1 id="linux库导出信息查看" tabindex="-1"><a class="header-anchor" href="#linux库导出信息查看"><span>Linux库导出信息查看</span></a></h1>
<p>nm</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 查看静态库或动态库定义了哪些函数</span></span>
<span class="line">nm <span class="token parameter variable">-n</span> --defined-only xxxx.a</span>
<span class="line">nm <span class="token parameter variable">-g</span> <span class="token parameter variable">-C</span> --defined-only xxxx.so</span>
<span class="line">nm <span class="token parameter variable">-D</span> xxxx.so</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示hello.a 中的未定义符号，需要和其他对象文件进行链接.</span></span>
<span class="line">nm <span class="token parameter variable">-u</span> hello.o</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 ./ 目录下找出哪个库文件定义了close_socket函数. </span></span>
<span class="line">nm <span class="token parameter variable">-A</span> ./* <span class="token operator"><span class="token file-descriptor important">2</span>></span>/dev/null <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">"T close_socket"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>objdump</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 查看动态库有哪些符号，包括数据段、导出的函数和引用其他库的函数</span></span>
<span class="line">objdump <span class="token parameter variable">-tT</span> xxx.so</span>
<span class="line">objdump <span class="token parameter variable">-x</span> xxx.a</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看动态库依赖项</span></span>
<span class="line">objdump <span class="token parameter variable">-x</span> xxx.so <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">"NEEDED"</span> </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看动态符号表</span></span>
<span class="line">objdump <span class="token parameter variable">-T</span> xxx.so</span>
<span class="line"><span class="token comment">## 假如想知道 xxx.so 中是否导出了符号 yyy ，那么命令为 objdump -T xxx.so | grep "yyy" 。</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看动态符号表</span></span>
<span class="line">objdump <span class="token parameter variable">-t</span> xxx.so</span>
<span class="line"><span class="token comment">## -T 和 -t 选项在于 -T 只能查看动态符号，如库导出的函数和引用其他库的函数，而 -t 可以查看所有的符号，包括数据段的符号。</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>readelf</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">readelf <span class="token parameter variable">-c</span> xxx.a</span>
<span class="line">readelf <span class="token parameter variable">-A</span> xxx.so </span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>rabin2</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">rabin2 <span class="token parameter variable">-E</span> libgtest.so</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


