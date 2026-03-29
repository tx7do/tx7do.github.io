<template><div><h1 id="centos-安装-golang" tabindex="-1"><a class="header-anchor" href="#centos-安装-golang"><span>Centos 安装 Golang</span></a></h1>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vim</span> install_golang.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>创建以下Shell脚本：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安装Wget用于下载文件</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token function">wget</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置Golang的版本</span></span>
<span class="line"><span class="token assign-left variable">latest_version</span><span class="token operator">=</span><span class="token number">1.20</span>.1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下载Golang二进制程序压缩包</span></span>
<span class="line"><span class="token function">wget</span> https://dl.google.com/go/go<span class="token variable">$latest_version</span>.linux-amd64.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解压文件</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /usr/local/go <span class="token operator">&amp;&amp;</span> <span class="token function">tar</span> <span class="token parameter variable">-C</span> /usr/local <span class="token parameter variable">-xzf</span> go<span class="token variable">$latest_version</span>.linux-amd64.tar.gz</span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-fr</span> go<span class="token variable">$latest_version</span>.linux-amd64.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置环境变量</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span>:/usr/local/go/bin<span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token string">"export PATH=<span class="token environment constant">$PATH</span>:/usr/local/go/bin"</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bash_profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试安装成功与否，查看Golang版本。</span></span>
<span class="line">go version</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


