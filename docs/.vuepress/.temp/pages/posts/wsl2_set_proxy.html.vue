<template><div><h1 id="wsl2设置网络代理" tabindex="-1"><a class="header-anchor" href="#wsl2设置网络代理"><span>WSL2设置网络代理</span></a></h1>
<p>为了生计所迫，有时候不得不需要在WSL2下面使用代理。</p>
<h2 id="获取到宿主的访问ip地址" tabindex="-1"><a class="header-anchor" href="#获取到宿主的访问ip地址"><span>获取到宿主的访问IP地址</span></a></h2>
<p>WSL2要访问宿主的服务，并没有那么容易，并不能简单的通过127.0.0.1来访问，需要获取到宿主的访问IP地址。有两种办法可以访问宿主的IP：</p>
<ol>
<li><code v-pre>cat /etc/resolv.conf</code>命令获取<code v-pre>nameserver</code>；</li>
<li>如果安装了Docker，可以获取<code v-pre>host.docker.internal</code>。</li>
</ol>
<p>推荐使用第一种方法。</p>
<h2 id="配置代理" tabindex="-1"><a class="header-anchor" href="#配置代理"><span>配置代理</span></a></h2>
<p>Ubuntu下面与代理有关的环境变量有：</p>
<ol>
<li><code v-pre>ALL_PROXY</code></li>
<li><code v-pre>HTTP_PROXY</code></li>
<li><code v-pre>HTTPS_PROXY</code></li>
<li><code v-pre>NO_PROXY</code></li>
</ol>
<p>手动配置代理的命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">http_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">https_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">all_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>终端所添加的环境变量是临时的，只适用于当前终端，关闭当前终端或在另一个终端中，添加的环境变量是无效的。</p>
<p>如果是原生的Ubuntu，上面的命令已经可以了，但是由上面可知，这样并不能够访问到宿主的代理，所以，还需要改进，需要编写以下Shell脚本来获取IP地址：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">host_ip</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /etc/resolv.conf <span class="token operator">|</span><span class="token function">grep</span> <span class="token parameter variable">-oP</span> <span class="token string">'(?&lt;=nameserver\ ).*'</span><span class="token variable">)</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>或者</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">host_ip</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /etc/resolv.conf <span class="token operator">|</span><span class="token function">grep</span> <span class="token string">"nameserver"</span> <span class="token operator">|</span><span class="token function">cut</span> <span class="token parameter variable">-f</span> <span class="token number">2</span> <span class="token parameter variable">-d</span> <span class="token string">" "</span><span class="token variable">)</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>组合起来就是这样：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token assign-left variable">host_ip</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /etc/resolv.conf <span class="token operator">|</span><span class="token function">grep</span> <span class="token string">"nameserver"</span> <span class="token operator">|</span><span class="token function">cut</span> <span class="token parameter variable">-f</span> <span class="token number">2</span> <span class="token parameter variable">-d</span> <span class="token string">" "</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">HTTPS_PROXY</span><span class="token operator">=</span><span class="token string">"http://<span class="token variable">$host_ip</span>:7890"</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">HTTP_PROXY</span><span class="token operator">=</span><span class="token string">"http://<span class="token variable">$host_ip</span>:7890"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，如果两个代理的地址都是一样的，那么可以单独的设置<code v-pre>ALL_PROXY</code>，也是一样的效果：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token assign-left variable">host_ip</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /etc/resolv.conf <span class="token operator">|</span><span class="token function">grep</span> <span class="token string">"nameserver"</span> <span class="token operator">|</span><span class="token function">cut</span> <span class="token parameter variable">-f</span> <span class="token number">2</span> <span class="token parameter variable">-d</span> <span class="token string">" "</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">ALL_PROXY</span><span class="token operator">=</span><span class="token string">"http://<span class="token variable">$host_ip</span>:7890"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="编写配置" tabindex="-1"><a class="header-anchor" href="#编写配置"><span>编写配置</span></a></h2>
<p>如果需要一直的生效，就需要把它写入到Shell配置文件里面去。</p>
<h3 id="作用于当前用户" tabindex="-1"><a class="header-anchor" href="#作用于当前用户"><span>作用于当前用户</span></a></h3>
<p>如果只需要添加的环境变量对当前用户有效，可以写入用户主目录下的Shell配置文件里面去。</p>
<ul>
<li>bash配置文件是：<code v-pre>~/.bashrc</code></li>
<li>zsh配置文件是：<code v-pre>~/.zshrc</code></li>
</ul>
<p>以下以bash示例：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vim</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>将下面的两行脚本添加到末尾：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">host_ip</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /etc/resolv.conf <span class="token operator">|</span><span class="token function">grep</span> <span class="token string">"nameserver"</span> <span class="token operator">|</span><span class="token function">cut</span> <span class="token parameter variable">-f</span> <span class="token number">2</span> <span class="token parameter variable">-d</span> <span class="token string">" "</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">ALL_PROXY</span><span class="token operator">=</span><span class="token string">"http://<span class="token variable">$host_ip</span>:7890"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>注销或者重启可以使修改生效，如果要使添加的环境变量马上生效：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="作用于所有用户" tabindex="-1"><a class="header-anchor" href="#作用于所有用户"><span>作用于所有用户</span></a></h3>
<p>要使环境变量对所有用户有效，可以修改<code v-pre>profile</code>文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">vim</span> /etc/profile</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>将下面的两行脚本添加到末尾：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">host_ip</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /etc/resolv.conf <span class="token operator">|</span><span class="token function">grep</span> <span class="token string">"nameserver"</span> <span class="token operator">|</span><span class="token function">cut</span> <span class="token parameter variable">-f</span> <span class="token number">2</span> <span class="token parameter variable">-d</span> <span class="token string">" "</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">ALL_PROXY</span><span class="token operator">=</span><span class="token string">"http://<span class="token variable">$host_ip</span>:7890"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>注销或者重启可以使修改生效，如果要使添加的环境变量马上生效：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">source</span> /etc/profile</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="查看环境变量" tabindex="-1"><a class="header-anchor" href="#查看环境变量"><span>查看环境变量</span></a></h2>
<p>查看环境变量有三个命令</p>
<ol>
<li>
<p><code v-pre>env</code></p>
<p><code v-pre>env</code>命令是environment的缩写，用于列出所有的环境变量</p>
</li>
<li>
<p><code v-pre>export</code></p>
<p>单独使用<code v-pre>export</code>命令也可以像<code v-pre>env</code>列出所有的环境变量，不过<code v-pre>export</code>命令还有其他额外的功能</p>
</li>
<li>
<p><code v-pre>echo $PATH</code></p>
<p><code v-pre>echo $PATH</code>用于列出变量<code v-pre>PATH</code>的值，里面包含了已添加的目录</p>
</li>
</ol>
<p>我们可以用以下命令查看代理的环境变量：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">echo</span> <span class="token variable">$ALL_PROXY</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://zhuanlan.zhihu.com/p/153124468" target="_blank" rel="noopener noreferrer">为 WSL2 一键设置代理</a></li>
<li><a href="https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-windows-networking-apps-from-linux-host-ip" target="_blank" rel="noopener noreferrer">Accessing Windows networking apps from Linux (host IP)</a></li>
<li><a href="https://www.cnblogs.com/lmg-jie/p/9995020.html" target="_blank" rel="noopener noreferrer">Ubuntu设置和查看环境变量</a></li>
<li><a href="https://zhiqiang.org/it/proxy-of-application-in-ubuntu.html" target="_blank" rel="noopener noreferrer">设置 ubuntu 中各种应用的代理</a></li>
<li><a href="https://www.cnblogs.com/wyzersblog/p/13303335.html" target="_blank" rel="noopener noreferrer">Ubuntu 网络代理配置</a></li>
</ul>
</div></template>


