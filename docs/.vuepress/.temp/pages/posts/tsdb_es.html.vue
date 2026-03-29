<template><div><h1 id="时序数据库应用-elasticsearch" tabindex="-1"><a class="header-anchor" href="#时序数据库应用-elasticsearch"><span>时序数据库应用 - ElasticSearch</span></a></h1>
<h2 id="数据库简介" tabindex="-1"><a class="header-anchor" href="#数据库简介"><span>数据库简介</span></a></h2>
<h2 id="搭建本地docker数据库" tabindex="-1"><a class="header-anchor" href="#搭建本地docker数据库"><span>搭建本地Docker数据库</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/elasticsearch:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--name</span> elasticsearch-test <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-p</span> <span class="token number">9200</span>:9200 <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-p</span> <span class="token number">9300</span>:9300 <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">ELASTICSEARCH_USERNAME</span><span class="token operator">=</span>elastic <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">ELASTICSEARCH_PASSWORD</span><span class="token operator">=</span>elastic <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">xpack.security.enabled</span><span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">discovery.type</span><span class="token operator">=</span>single-node <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">http.cors.enabled</span><span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> http.cors.allow-origin<span class="token operator">=</span>http://localhost:13580,http://127.0.0.1:13580 <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> http.cors.allow-headers<span class="token operator">=</span>X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-e</span> http.cors.allow-credentials<span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line">bitnami/elasticsearch:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> pull appbaseio/dejavu:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">--name</span> dejavu-test <span class="token punctuation">\</span></span>
<span class="line"><span class="token parameter variable">-p</span> <span class="token number">13580</span>:1358 <span class="token punctuation">\</span></span>
<span class="line">appbaseio/dejavu:latest</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">http://localhost:13580/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.tizi365.com/archives/850.html" target="_blank" rel="noopener noreferrer">golang elasticsearch入门教程</a></li>
</ul>
</div></template>


