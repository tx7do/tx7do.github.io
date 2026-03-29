<template><div><h1 id="python修改pip的软件源" tabindex="-1"><a class="header-anchor" href="#python修改pip的软件源"><span>Python修改pip的软件源</span></a></h1>
<h2 id="国内常用软件源列表" tabindex="-1"><a class="header-anchor" href="#国内常用软件源列表"><span>国内常用软件源列表</span></a></h2>
<table>
<thead>
<tr>
<th>提供者</th>
<th>地址</th>
</tr>
</thead>
<tbody>
<tr>
<td>豆瓣</td>
<td>https://pypi.doubanio.com/simple/</td>
</tr>
<tr>
<td>腾讯</td>
<td>https://mirrors.cloud.tencent.com/pypi/simple/</td>
</tr>
<tr>
<td>阿里</td>
<td>https://mirrors.aliyun.com/pypi/simple/</td>
</tr>
<tr>
<td>网易</td>
<td>https://mirrors.163.com/pypi/simple/</td>
</tr>
<tr>
<td>清华</td>
<td>https://pypi.tuna.tsinghua.edu.cn/simple/</td>
</tr>
<tr>
<td>中国科学技术大学</td>
<td>https://pypi.mirrors.ustc.edu.cn/simple/</td>
</tr>
<tr>
<td>北京外国语大学</td>
<td>https://mirrors.bfsu.edu.cn/pypi/web/simple/</td>
</tr>
</tbody>
</table>
<h2 id="临时使用" tabindex="-1"><a class="header-anchor" href="#临时使用"><span>临时使用</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip <span class="token function">install</span> markdown <span class="token parameter variable">-i</span> https://pypi.tuna.tsinghua.edu.cn/simple</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="修改源" tabindex="-1"><a class="header-anchor" href="#修改源"><span>修改源</span></a></h2>
<h3 id="清华源" tabindex="-1"><a class="header-anchor" href="#清华源"><span>清华源</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip config <span class="token builtin class-name">set</span> global.index-url https://pypi.tuna.tsinghua.edu.cn/simple</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="阿里源" tabindex="-1"><a class="header-anchor" href="#阿里源"><span>阿里源</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip config <span class="token builtin class-name">set</span> global.index-url https://mirrors.aliyun.com/pypi/simple/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="腾讯源" tabindex="-1"><a class="header-anchor" href="#腾讯源"><span>腾讯源</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip config <span class="token builtin class-name">set</span> global.index-url https://mirrors.cloud.tencent.com/pypi/simple/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="豆瓣源" tabindex="-1"><a class="header-anchor" href="#豆瓣源"><span>豆瓣源</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip config <span class="token builtin class-name">set</span> global.index-url https://pypi.doubanio.com/simple/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


