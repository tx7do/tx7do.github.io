<template><div><h1 id="部署efk" tabindex="-1"><a class="header-anchor" href="#部署efk"><span>部署EFK</span></a></h1>
<ul>
<li>ElasticSearch</li>
<li>Fluentd</li>
<li>Kibana</li>
</ul>
<h2 id="docker-run" tabindex="-1"><a class="header-anchor" href="#docker-run"><span>Docker Run</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> network create app-tier <span class="token parameter variable">--driver</span> bridge</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="elasticsearch" tabindex="-1"><a class="header-anchor" href="#elasticsearch"><span>ElasticSearch</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/elasticsearch:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> elasticsearch <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">9200</span>:9200 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">9300</span>:9300 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--network</span> app-tier <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">ELASTICSEARCH_USERNAME</span><span class="token operator">=</span>elastic <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">ELASTICSEARCH_PASSWORD</span><span class="token operator">=</span>elastic <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">xpack.security.enabled</span><span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">discovery.type</span><span class="token operator">=</span>single-node <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">http.cors.enabled</span><span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> http.cors.allow-origin<span class="token operator">=</span>http://localhost:13580,http://127.0.0.1:13580 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> http.cors.allow-headers<span class="token operator">=</span>X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> http.cors.allow-credentials<span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line">    bitnami/elasticsearch:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="fluentd" tabindex="-1"><a class="header-anchor" href="#fluentd"><span>Fluentd</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/fluentd:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> fluentd <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--network</span> app-tier <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">24224</span>:24224 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">24224</span>:24224/udp <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-v</span> /data:/opt/bitnami/fluentd/log <span class="token punctuation">\</span></span>
<span class="line">    bitnami/fluentd:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要修改配置文件，配置文件的位置在：<code v-pre>/opt/bitnami/fluentd/conf/fluentd.conf</code></p>
<p>原始的配置文件如下所示，日志写入到本地文件里：</p>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>source</span><span class="token punctuation">></span></span></span>
<span class="line">  @type  forward</span>
<span class="line">  @id    input1</span>
<span class="line">  @label @mainstream</span>
<span class="line">  port  24224</span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>source</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>filter</span> <span class="token attr-name">**</span><span class="token punctuation">></span></span></span>
<span class="line">  @type stdout</span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>filter</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span> <span class="token attr-name">@mainstream</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>match</span> <span class="token attr-name">docker.**</span><span class="token punctuation">></span></span></span>
<span class="line">    @type file</span>
<span class="line">    @id   output_docker1</span>
<span class="line">    path         /opt/bitnami/fluentd/logs/docker.*.log</span>
<span class="line">    symlink_path /opt/bitnami/fluentd/logs/docker.log</span>
<span class="line">    append       true</span>
<span class="line">    time_slice_format %Y%m%d</span>
<span class="line">    time_slice_wait   1m</span>
<span class="line">    time_format       %Y%m%dT%H%M%S%z</span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>match</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>match</span> <span class="token attr-name">**</span><span class="token punctuation">></span></span></span>
<span class="line">    @type file</span>
<span class="line">    @id   output1</span>
<span class="line">    path         /opt/bitnami/fluentd/logs/data.*.log</span>
<span class="line">    symlink_path /opt/bitnami/fluentd/logs/data.log</span>
<span class="line">    append       true</span>
<span class="line">    time_slice_format %Y%m%d</span>
<span class="line">    time_slice_wait   10m</span>
<span class="line">    time_format       %Y%m%dT%H%M%S%z</span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>match</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"># Include config files in the ./config.d directory</span>
<span class="line">@include config.d/*.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们要把日志写入到ElasticSearch，我们需要<code v-pre>fluent-plugin-elasticsearch</code>插件，并且需要在配置里面添加一个<code v-pre>&lt;match&gt;</code>节点：</p>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>match</span> <span class="token attr-name">**</span><span class="token punctuation">></span></span></span>
<span class="line">  @type elasticsearch</span>
<span class="line">  host host.docker.internal</span>
<span class="line">  port 9200</span>
<span class="line">  index_name fluentd</span>
<span class="line">  type_name log</span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>match</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们就启动服务，产生日志，然后就可以从ElasticSearch中查询日志数据：<a href="http://localhost:9200/fluentd/_search" target="_blank" rel="noopener noreferrer">http://localhost:9200/fluentd/_search</a></p>
<p>另外，如果我们要把日志写入到MongoDB，我们可以添加一个<code v-pre>&lt;match&gt;</code>节点：</p>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>match</span> <span class="token attr-name">**</span><span class="token punctuation">></span></span></span>
<span class="line">  @type mongo</span>
<span class="line">  database lodge</span>
<span class="line">  collection fluentd</span>
<span class="line">  capped</span>
<span class="line">  capped_size 100m</span>
<span class="line">  host host.docker.internal</span>
<span class="line">  port 27017</span>
<span class="line">  user <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MONGO_USER</span><span class="token punctuation">></span></span></span>
<span class="line">  password <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MONGO_PASS</span><span class="token punctuation">></span></span></span>
<span class="line">  time_key time</span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>match</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kibana" tabindex="-1"><a class="header-anchor" href="#kibana"><span>Kibana</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/kibana:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> kibana <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--network</span> app-tier <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">5601</span>:5601 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">KIBANA_ELASTICSEARCH_URL</span><span class="token operator">=</span>elasticsearch <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">KIBANA_ELASTICSEARCH_PORT_NUMBER</span><span class="token operator">=</span><span class="token number">9200</span> <span class="token punctuation">\</span></span>
<span class="line">    bitnami/kibana:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose"><span>Docker Compose</span></a></h2>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">'3'</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app-tier</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">elasticsearch</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> docker.io/bitnami/elasticsearch<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"9200:9200"</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"9300:9300"</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ELASTICSEARCH_USERNAME=elastic</span>
<span class="line">      <span class="token punctuation">-</span> ELASTICSEARCH_PASSWORD=elastic</span>
<span class="line">      <span class="token punctuation">-</span> xpack.security.enabled=true</span>
<span class="line">      <span class="token punctuation">-</span> discovery.type=single<span class="token punctuation">-</span>node</span>
<span class="line">      <span class="token punctuation">-</span> http.cors.enabled=true</span>
<span class="line">      <span class="token punctuation">-</span> http.cors.allow<span class="token punctuation">-</span>origin=http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span><span class="token number">13580</span><span class="token punctuation">,</span>http<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span><span class="token number">13580</span></span>
<span class="line">      <span class="token punctuation">-</span> http.cors.allow<span class="token punctuation">-</span>headers=X<span class="token punctuation">-</span>Requested<span class="token punctuation">-</span>With<span class="token punctuation">,</span>X<span class="token punctuation">-</span>Auth<span class="token punctuation">-</span>Token<span class="token punctuation">,</span>Content<span class="token punctuation">-</span>Type<span class="token punctuation">,</span>Content<span class="token punctuation">-</span>Length<span class="token punctuation">,</span>Authorization</span>
<span class="line">      <span class="token punctuation">-</span> http.cors.allow<span class="token punctuation">-</span>credentials=true</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">fluentd</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> docker.io/bitnami/fluentd<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"elasticsearch"</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> /data/fluentd/conf<span class="token punctuation">:</span>/opt/bitnami/fluentd/conf</span>
<span class="line">      <span class="token punctuation">-</span> /data/fluentd/log<span class="token punctuation">:</span>/opt/bitnami/fluentd/log</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"24224:24224"</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"24224:24224/udp"</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">kibana</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> docker.io/bitnami/kibana<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier</span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"elasticsearch"</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"5601:5601"</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> KIBANA_ELASTICSEARCH_URL=elasticsearch</span>
<span class="line">      <span class="token punctuation">-</span> KIBANA_ELASTICSEARCH_PORT_NUMBER=9200</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://blog.csdn.net/weixin_37887248/article/details/82772199" target="_blank" rel="noopener noreferrer">Fluentd 配置</a></li>
<li><a href="https://cloud.tencent.com/developer/article/1644126" target="_blank" rel="noopener noreferrer">在 Kubernetes 上搭建 EFK 日志收集系统</a></li>
<li><a href="https://blog.51cto.com/u_3029920/4885936" target="_blank" rel="noopener noreferrer">EFK（elasticsearch + fluentd + kibana）日志系统</a></li>
<li><a href="https://blog.toright.com/posts/5133/%E7%94%A8-elasticsearch-fluentd-%E6%89%93%E9%80%A0-log-%E7%A5%9E%E5%99%A8%E8%88%87%E6%95%B8%E6%93%9A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.html" target="_blank" rel="noopener noreferrer">用 ElasticSearch + FluentD 打造 Log 神器與數據分析工具</a></li>
<li><a href="https://x-team.com/blog/improve-your-logging-process/" target="_blank" rel="noopener noreferrer">HOW TO IMPROVE YOUR LOGGING PROCESS WITH FLUENTD, ELASTICSEARCH, AND KIBANA (FEK)</a></li>
<li><a href="https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes" target="_blank" rel="noopener noreferrer">How To Set Up an Elasticsearch, Fluentd and Kibana (EFK) Logging Stack on Kubernetes</a></li>
</ul>
</div></template>


