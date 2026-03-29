<template><div><h1 id="docker简单部署traefik微服务网关" tabindex="-1"><a class="header-anchor" href="#docker简单部署traefik微服务网关"><span>Docker简单部署Traefik微服务网关</span></a></h1>
<h2 id="什么是traefik" tabindex="-1"><a class="header-anchor" href="#什么是traefik"><span>什么是Traefik?</span></a></h2>
<p>Traefik 是一款开源的反向代理与负载均衡工具，它监听后端的变化并自动更新服务配置。Traefik 最大的优点是能够与常见的微服务系统直接整合，可以实现自动化动态配置。目前支持 Docker、Swarm,Marathon、Mesos、Kubernetes、Consul、Etcd、Zookeeper、BoltDB 和 Rest API 等后端模型。</p>
<h2 id="什么是微服务网关" tabindex="-1"><a class="header-anchor" href="#什么是微服务网关"><span>什么是微服务网关?</span></a></h2>
<p>微服务网关是整个微服务API请求的入口，可以实现过滤Api接口。并且可以实现用户的验证登录、解决跨域、日志拦截、权限控制、限流、熔断、负载均衡、黑名单与白名单机制等。</p>
<h2 id="docker部署服务器" tabindex="-1"><a class="header-anchor" href="#docker部署服务器"><span>Docker部署服务器</span></a></h2>
<ol>
<li>Consul (测试的版本为v1.11.4)</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/consul:latest</span>
<span class="line"><span class="token function">docker</span> pull bitnami/consul-exporter:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> consul-server-standalone <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">8300</span>:8300 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">8500</span>:8500 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">8600</span>:8600/udp <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">CONSUL_BIND_INTERFACE</span><span class="token operator">=</span><span class="token string">'eth0'</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">CONSUL_AGENT_MODE</span><span class="token operator">=</span>server <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">CONSUL_ENABLE_UI</span><span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">CONSUL_BOOTSTRAP_EXPECT</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">CONSUL_CLIENT_LAN_ADDRESS</span><span class="token operator">=</span><span class="token number">0.0</span>.0.0 <span class="token punctuation">\</span></span>
<span class="line">    bitnami/consul:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>Traefik (测试的版本为v2.5.6)</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull traefik:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token variable"><span class="token variable">`</span></span>
<span class="line">    <span class="token parameter variable">--name</span> traefik-server <span class="token variable">`</span></span></span>
<span class="line">    <span class="token parameter variable">--link</span> consul-server-standalone <span class="token variable"><span class="token variable">`</span></span>
<span class="line">    --add-host<span class="token operator">=</span>host.docker.internal:host-gateway <span class="token variable">`</span></span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">8080</span>:8080 <span class="token variable"><span class="token variable">`</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">80</span>:80 <span class="token variable">`</span></span></span>
<span class="line">    <span class="token parameter variable">-v</span> /var/run/docker.sock:/var/run/docker.sock `</span>
<span class="line">    traefik:latest <span class="token parameter variable">--api.insecure</span><span class="token operator">=</span>true <span class="token parameter variable">--providers.consul.endpoints</span><span class="token operator">=</span><span class="token string">"consul-server-standalone:8500"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="管理后台" tabindex="-1"><a class="header-anchor" href="#管理后台"><span>管理后台</span></a></h2>
<ul>
<li>Consul: <a href="http://localhost:8500" target="_blank" rel="noopener noreferrer">http://localhost:8500</a></li>
<li>Traefik:<a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080</a></li>
</ul>
<h2 id="加入路由配置" tabindex="-1"><a class="header-anchor" href="#加入路由配置"><span>加入路由配置</span></a></h2>
<p>在这里我使用了Consul作为远程配置中心，配置以KV的方式存储，可登陆consul的管理后台添加配置，Traefik默认是监控配置改变的。</p>
<table>
<thead>
<tr>
<th>键</th>
<th>值</th>
</tr>
</thead>
<tbody>
<tr>
<td>traefik/http/routers/myrouter-1/rule</td>
<td>PathPrefix(`/`)</td>
</tr>
<tr>
<td>traefik/http/routers/myrouter-1/entryPoints/0</td>
<td>http</td>
</tr>
<tr>
<td>traefik/http/routers/myrouter-1/service</td>
<td>myservice-1</td>
</tr>
<tr>
<td>traefik/http/services/myservice-1/loadbalancer/servers/0/url</td>
<td>http://host.docker.internal:8100</td>
</tr>
</tbody>
</table>
<h2 id="简单的go服务示例" tabindex="-1"><a class="header-anchor" href="#简单的go服务示例"><span>简单的Go服务示例</span></a></h2>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"fmt"</span></span>
<span class="line">	<span class="token string">"net/http"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">HelloHandle</span><span class="token punctuation">(</span>w http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> r <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span>  <span class="token punctuation">{</span></span>
<span class="line">	<span class="token boolean">_</span><span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">=</span> fmt<span class="token punctuation">.</span><span class="token function">Fprint</span><span class="token punctuation">(</span>w<span class="token punctuation">,</span> <span class="token string">"hello kitty"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    http<span class="token punctuation">.</span><span class="token function">HandleFunc</span><span class="token punctuation">(</span><span class="token string">"/hello"</span><span class="token punctuation">,</span> HelloHandle<span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">if</span> e <span class="token operator">:=</span> http<span class="token punctuation">.</span><span class="token function">ListenAndServe</span><span class="token punctuation">(</span><span class="token string">":8100"</span><span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">;</span> e<span class="token operator">!=</span> <span class="token boolean">nil</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">panic</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>原始服务器的访问地址是：<a href="http://localhost:8100/hello" target="_blank" rel="noopener noreferrer">http://localhost:8100/hello</a></li>
<li>通过网关访问的地址是：<a href="http://localhost/hello" target="_blank" rel="noopener noreferrer">http://localhost/hello</a></li>
</ul>
<h2 id="注意的点" tabindex="-1"><a class="header-anchor" href="#注意的点"><span>注意的点</span></a></h2>
<ul>
<li>在这里我使用了Consul作为远程配置中心，另外Etcd等也可以。</li>
<li>因为我网关跑在了Docker下，而http服务器跑在了宿主机上，因此需要<code v-pre>--add-host=host.docker.internal:host-gateway</code>以期Traefik能够访问宿主机。</li>
</ul>
</div></template>


