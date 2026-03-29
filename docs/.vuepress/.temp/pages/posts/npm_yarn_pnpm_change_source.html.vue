<template><div><h1 id="npm-pnpm-yarn切换源" tabindex="-1"><a class="header-anchor" href="#npm-pnpm-yarn切换源"><span>npm/pnpm/yarn切换源</span></a></h1>
<ul>
<li>国内镜像</li>
</ul>
<table>
<thead>
<tr>
<th>提供商</th>
<th>搜索地址</th>
<th>registry地址</th>
</tr>
</thead>
<tbody>
<tr>
<td>淘宝</td>
<td>https://npmmirror.com/</td>
<td>https://registry.npmmirror.com</td>
</tr>
<tr>
<td>腾讯云</td>
<td></td>
<td>http://mirrors.cloud.tencent.com/npm/</td>
</tr>
<tr>
<td>华为云</td>
<td></td>
<td>https://mirrors.huaweicloud.com/repository/npm</td>
</tr>
<tr>
<td>浙江大学</td>
<td></td>
<td>http://mirrors.zju.edu.cn/npm/</td>
</tr>
<tr>
<td>南京邮电</td>
<td></td>
<td>https://mirrors.njupt.edu.cn/nexus/repository/npm/</td>
</tr>
</tbody>
</table>
<h2 id="npm" tabindex="-1"><a class="header-anchor" href="#npm"><span>npm</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 查看源</span></span>
<span class="line"><span class="token function">npm</span> get registry</span>
<span class="line"><span class="token function">npm</span> config get registry</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时修改</span></span>
<span class="line"><span class="token function">npm</span> <span class="token parameter variable">--registry</span> https://registry.npmmirror.com <span class="token function">install</span> any-touch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久修改</span></span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还原</span></span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmjs.org</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nrm" tabindex="-1"><a class="header-anchor" href="#nrm"><span>NRM</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安装 nrm</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> nrm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出当前可用的所有镜像源</span></span>
<span class="line">nrm <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用淘宝镜像源</span></span>
<span class="line">nrm use taobao</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试访问速度</span></span>
<span class="line">nrm <span class="token builtin class-name">test</span> taobao</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="pnpm" tabindex="-1"><a class="header-anchor" href="#pnpm"><span>pnpm</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 查看源</span></span>
<span class="line"><span class="token function">pnpm</span> get registry</span>
<span class="line"><span class="token function">pnpm</span> config get registry</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时修改</span></span>
<span class="line"><span class="token function">pnpm</span> <span class="token parameter variable">--registry</span> https://registry.npmmirror.com <span class="token function">install</span> any-touch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久修改</span></span>
<span class="line"><span class="token function">pnpm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还原</span></span>
<span class="line"><span class="token function">pnpm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmjs.org</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="yarn" tabindex="-1"><a class="header-anchor" href="#yarn"><span>yarn</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 查看源</span></span>
<span class="line"><span class="token function">yarn</span> config get registry</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时修改</span></span>
<span class="line"><span class="token function">yarn</span> <span class="token function">add</span> any-touch@latest <span class="token parameter variable">--registry</span><span class="token operator">=</span>https://registry.npmjs.org/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久修改</span></span>
<span class="line"><span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还原</span></span>
<span class="line"><span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.yarnpkg.com</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="yrm" tabindex="-1"><a class="header-anchor" href="#yrm"><span>YRM</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安装 yrm</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> yrm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出当前可用的所有镜像源</span></span>
<span class="line">yrm <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用淘宝镜像源</span></span>
<span class="line">yrm use taobao</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试访问速度</span></span>
<span class="line">yrm <span class="token builtin class-name">test</span> taobao</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


