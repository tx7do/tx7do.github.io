<template><div><h1 id="postgresql-docker容器修改时区" tabindex="-1"><a class="header-anchor" href="#postgresql-docker容器修改时区"><span>PostgreSQL Docker容器修改时区</span></a></h1>
<p>做了一些配置的修改之后，查询到的数据倒是显示的是+8的时区，可是，执行<code v-pre>show timezone;</code>之后，不论怎么样都是显示的是<code v-pre>UTC</code>时间。</p>
<h2 id="环境变量" tabindex="-1"><a class="header-anchor" href="#环境变量"><span>环境变量</span></a></h2>
<p>docker-compose的相关配置如下：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> TZ=Asia/Shanghai</span>
<span class="line">      <span class="token punctuation">-</span> PGTZ=Asia/Shanghai</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个已经被证明无效。</p>
<h2 id="数据映射" tabindex="-1"><a class="header-anchor" href="#数据映射"><span>数据映射</span></a></h2>
<p>docker-compose的相关配置如下：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'/etc/timezone:/etc/timezone:ro'</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'/etc/localtime:/etc/localtime:ro'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>增加<code v-pre>'/etc/localtime:/etc/localtime:ro'</code>已经被证明查询会+8，<code v-pre>'/etc/timezone:/etc/timezone:ro'</code>则不行，一添加就会报错。</p>
<h2 id="修改容器的时区" tabindex="-1"><a class="header-anchor" href="#修改容器的时区"><span>修改容器的时区</span></a></h2>
<p>先进入容器：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-t</span> <span class="token parameter variable">-i</span> postgresql /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>执行命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">ln</span> <span class="token parameter variable">-sf</span> /usr/share/zoneinfo/Asia/Shanghai /etc/localtime</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'Asia/Shanghai'</span> <span class="token operator">></span> /etc/timezone</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.jianshu.com/p/9fe66f7be488" target="_blank" rel="noopener noreferrer">Docker Postgresql 13 修改时区</a></li>
</ul>
</div></template>


