<template><div><h1 id="flutter切换源" tabindex="-1"><a class="header-anchor" href="#flutter切换源"><span>Flutter切换源</span></a></h1>
<h2 id="国内镜像列表" tabindex="-1"><a class="header-anchor" href="#国内镜像列表"><span>国内镜像列表</span></a></h2>
<table>
<thead>
<tr>
<th>提供商</th>
<th>PUB_HOSTED_URL</th>
<th>FLUTTER_STORAGE_BASE_URL</th>
</tr>
</thead>
<tbody>
<tr>
<td>上海交大</td>
<td>https://mirror.sjtu.edu.cn/dart-pub</td>
<td>https://mirror.sjtu.edu.cn</td>
</tr>
<tr>
<td>清华大学</td>
<td>https://mirrors.tuna.tsinghua.edu.cn/dart-pub</td>
<td>https://mirrors.tuna.tsinghua.edu.cn/flutter</td>
</tr>
<tr>
<td>OpenTUNA</td>
<td>https://opentuna.cn/dart-pub</td>
<td>https://opentuna.cn/flutter</td>
</tr>
<tr>
<td>CNNIC</td>
<td>http://mirrors.cnnic.cn/dart-pub</td>
<td>http://mirrors.cnnic.cn/flutter</td>
</tr>
<tr>
<td>Flutter中国（七牛云）</td>
<td>https://pub.flutter-io.cn</td>
<td>https://storage.flutter-io.cn</td>
</tr>
<tr>
<td>腾讯云</td>
<td>https://mirrors.cloud.tencent.com/dart-pub</td>
<td>https://mirrors.cloud.tencent.com/flutter</td>
</tr>
</tbody>
</table>
<h2 id="flutter-git-url" tabindex="-1"><a class="header-anchor" href="#flutter-git-url"><span>FLUTTER_GIT_URL</span></a></h2>
<ul>
<li><a href="https://github.com/flutter/flutter.git" target="_blank" rel="noopener noreferrer">https://github.com/flutter/flutter.git</a></li>
<li><a href="https://gitee.com/mirrors/Flutter.git" target="_blank" rel="noopener noreferrer">https://gitee.com/mirrors/Flutter.git</a></li>
<li><a href="https://mirrors.tuna.tsinghua.edu.cn/git/flutter-sdk.git" target="_blank" rel="noopener noreferrer">https://mirrors.tuna.tsinghua.edu.cn/git/flutter-sdk.git</a></li>
</ul>
<h2 id="切换源" tabindex="-1"><a class="header-anchor" href="#切换源"><span>切换源</span></a></h2>
<h3 id="linux" tabindex="-1"><a class="header-anchor" href="#linux"><span>Linux</span></a></h3>
<ul>
<li>向Bash的配置文件追加配置</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">cat</span> <span class="token operator">>></span> ~/.bashrc <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">export PUB_HOSTED_URL=https://pub.flutter-io.cn</span>
<span class="line">export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn</span>
<span class="line">export FLUTTER_GIT_URL=https://gitee.com/mirrors/Flutter.git</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使配置生效</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="macos" tabindex="-1"><a class="header-anchor" href="#macos"><span>macOS</span></a></h3>
<ul>
<li>向Zsh的配置文件追加配置</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">cat</span> <span class="token operator">>></span> ~/.zshrc <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">export PUB_HOSTED_URL=https://pub.flutter-io.cn</span>
<span class="line">export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn</span>
<span class="line">export FLUTTER_GIT_URL=https://gitee.com/mirrors/Flutter.git</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使配置生效</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">source</span> ~/.zshrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="windows" tabindex="-1"><a class="header-anchor" href="#windows"><span>Windows</span></a></h3>
<ul>
<li>设置临时的环境变量</li>
</ul>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line"><span class="token function">set</span> PUB_HOSTED_URL https:<span class="token operator">/</span><span class="token operator">/</span>pub<span class="token punctuation">.</span>flutter-io<span class="token punctuation">.</span>cn</span>
<span class="line"><span class="token function">set</span> FLUTTER_STORAGE_BASE_URL https:<span class="token operator">/</span><span class="token operator">/</span>storage<span class="token punctuation">.</span>flutter-io<span class="token punctuation">.</span>cn</span>
<span class="line"><span class="token function">set</span> FLUTTER_GIT_URL https:<span class="token operator">/</span><span class="token operator">/</span>gitee<span class="token punctuation">.</span>com/mirrors/Flutter<span class="token punctuation">.</span>git</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>设置为当前用户的环境变量</li>
</ul>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">setx PUB_HOSTED_URL https:<span class="token operator">/</span><span class="token operator">/</span>pub<span class="token punctuation">.</span>flutter-io<span class="token punctuation">.</span>cn</span>
<span class="line">setx FLUTTER_STORAGE_BASE_URL https:<span class="token operator">/</span><span class="token operator">/</span>storage<span class="token punctuation">.</span>flutter-io<span class="token punctuation">.</span>cn</span>
<span class="line">setx FLUTTER_GIT_URL https:<span class="token operator">/</span><span class="token operator">/</span>gitee<span class="token punctuation">.</span>com/mirrors/Flutter<span class="token punctuation">.</span>git</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>设置为系统环境变量（加<code v-pre>-m</code>参数）</li>
</ul>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">setx <span class="token operator">-</span>m PUB_HOSTED_URL https:<span class="token operator">/</span><span class="token operator">/</span>pub<span class="token punctuation">.</span>flutter-io<span class="token punctuation">.</span>cn</span>
<span class="line">setx <span class="token operator">-</span>m FLUTTER_STORAGE_BASE_URL https:<span class="token operator">/</span><span class="token operator">/</span>storage<span class="token punctuation">.</span>flutter-io<span class="token punctuation">.</span>cn</span>
<span class="line">setx <span class="token operator">-</span>m FLUTTER_GIT_URL https:<span class="token operator">/</span><span class="token operator">/</span>gitee<span class="token punctuation">.</span>com/mirrors/Flutter<span class="token punctuation">.</span>git</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://flutter.cn/community/china" target="_blank" rel="noopener noreferrer">在中国网络环境下使用 Flutter</a></li>
<li><a href="https://www.cnblogs.com/flytree/p/15130786.html" target="_blank" rel="noopener noreferrer">国内开源镜像站点</a></li>
</ul>
</div></template>


