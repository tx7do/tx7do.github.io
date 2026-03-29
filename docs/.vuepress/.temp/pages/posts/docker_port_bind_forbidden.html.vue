<template><div><h1 id="windows11-启动-docker-提示端口被占用-无法启动" tabindex="-1"><a class="header-anchor" href="#windows11-启动-docker-提示端口被占用-无法启动"><span>Windows11 启动 Docker 提示端口被占用 无法启动</span></a></h1>
<p>今天Windows11升级重启了,我启动RabbitMQ,然后提示端口被占用,而无法启动Docker.
提示信息如下:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">listen tcp <span class="token number">0.0</span>.0.0:1883: bind: An attempt was made to access a socket <span class="token keyword">in</span> a way forbidden by its access permissions.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="解决办法" tabindex="-1"><a class="header-anchor" href="#解决办法"><span>解决办法</span></a></h2>
<ul>
<li>打开管理员模式 Windows PowerShell，执行下面命令重启 NAT 驱动服务即可</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">net stop winnat</span>
<span class="line">net start winnat</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


