<template><div><h1 id="vue低版本引起的问题" tabindex="-1"><a class="header-anchor" href="#vue低版本引起的问题"><span>Vue低版本引起的问题</span></a></h1>
<h2 id="sass在v4-3-0版本之前使用node-sass需要原生编译libsass导致的问题" tabindex="-1"><a class="header-anchor" href="#sass在v4-3-0版本之前使用node-sass需要原生编译libsass导致的问题"><span>Sass在v4.3.0版本之前使用node-sass需要原生编译libsass导致的问题</span></a></h2>
<p><code v-pre>Sass</code>在<code v-pre>v4.3.0</code>版本之前都是使用的<code v-pre>node-sass</code>，而<code v-pre>node-sass</code>的底层依赖 <code v-pre>libsass</code>，<code v-pre>libsass</code>是一个原生库，因此，在Windows下面需要强制用户必须安装<code v-pre>python2</code>和<code v-pre>Visual Studio</code>才能编译成功。这并不是一件很友好的事情，而且经常导致编译不成功。</p>
<p><code v-pre>Sass</code>从<code v-pre>v4.3.0</code>版本开始迁移到<code v-pre>dart-sass</code>进行构建，虽然说相比使用原生的<code v-pre>libsass</code>库，<code v-pre>dart-sass</code>是一个js库，在性能会有一定的损失，但是，相比安装<code v-pre>libsass</code>库的不容易，这点性能的损失，还是可以接受的。</p>
<p>解决步骤：</p>
<h3 id="_1-卸载-node-sass" tabindex="-1"><a class="header-anchor" href="#_1-卸载-node-sass"><span>1. 卸载 node-sass</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">npm</span> uninstall node-sass</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_2-安装-dart-sass" tabindex="-1"><a class="header-anchor" href="#_2-安装-dart-sass"><span>2. 安装 dart-sass</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">npm</span> <span class="token function">install</span> sass sass-loader <span class="token parameter variable">-D</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>或者</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">--dev</span> sass</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_3-修改css" tabindex="-1"><a class="header-anchor" href="#_3-修改css"><span>3. 修改css</span></a></h3>
<p>将项目中原有的 <code v-pre>/deep/</code> 替换为 <code v-pre>::v-deep</code>。</p>
<p>如果引用了<code v-pre>element-ui</code>，编译运行的时候会报一些兼容警告：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Deprecation Warning: <span class="token variable">$weight</span><span class="token builtin class-name">:</span> Passing a number without unit % <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> is deprecated.</span>
<span class="line"></span>
<span class="line">To preserve current behavior: <span class="token variable">$weight</span> * <span class="token number">1</span>%</span>
<span class="line"></span>
<span class="line">More info: https://sass-lang.com/d/function-units</span>
<span class="line"></span>
<span class="line">   ╷</span>
<span class="line"><span class="token number">31</span> │       color: mix<span class="token punctuation">(</span>$--tag-info-color, $--color-white, <span class="token variable">$fontColorWeight</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   │              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原因是版本兼容的问题，虽然不影响最终编译，但是还是期望能够消除掉这个警告，修改sass的最低版本可以解决问题：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token property">"sass"</span><span class="token operator">:</span> <span class="token string">"1.55.0"</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token property">"sass-loader"</span><span class="token operator">:</span> <span class="token string">"^10.0.1"</span><span class="token punctuation">,</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后删掉``重新<code v-pre>npm install</code>即可消除掉警告。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://zhuanlan.zhihu.com/p/532597359" target="_blank" rel="noopener noreferrer">node-sass换为dart-sass</a></li>
<li><a href="https://liuhai.work/post/426?cid=51&amp;index=search" target="_blank" rel="noopener noreferrer">使用element-ui控制台报错:--el-tag-background-color: #{mix(</a></li>
</ul>
</div></template>


