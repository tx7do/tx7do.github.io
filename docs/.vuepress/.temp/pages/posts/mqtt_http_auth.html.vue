<template><div><h1 id="mqtt服务器使用http进行用户认证" tabindex="-1"><a class="header-anchor" href="#mqtt服务器使用http进行用户认证"><span>MQTT服务器使用HTTP进行用户认证</span></a></h1>
<p>MQTT开源服务器有不少,我只用了两个Erlang开发的开源服务器:</p>
<ul>
<li><a href="https://www.rabbitmq.com/" target="_blank" rel="noopener noreferrer">RabbitMQ</a></li>
<li><a href="https://www.emqx.io/" target="_blank" rel="noopener noreferrer">EMQX</a>.</li>
</ul>
<p>现实中,我们需要提供一个HTTP认证服务器,来认证我们的MQTT客户端.</p>
<h2 id="docker部署开发服务器" tabindex="-1"><a class="header-anchor" href="#docker部署开发服务器"><span>Docker部署开发服务器</span></a></h2>
<ol>
<li><strong>RabbitMQ</strong></li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/rabbitmq:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--hostname</span> localhost <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> rabbitmq-test <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">15672</span>:15672 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">5672</span>:5672 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">1883</span>:1883 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">15675</span>:15675 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">RABBITMQ_PLUGINS</span><span class="token operator">=</span>rabbitmq_top,rabbitmq_mqtt,rabbitmq_web_mqtt,rabbitmq_auth_backend_http <span class="token punctuation">\</span></span>
<span class="line">    bitnami/rabbitmq:latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看插件列表</span></span>
<span class="line">rabbitmq-plugins list</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>管理后台: <a href="http://localhost:15672" target="_blank" rel="noopener noreferrer">http://localhost:15672</a><br>
默认账号: user<br>
默认密码: bitnami</p>
<ol start="2">
<li><strong>EMQX</strong></li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull emqx/emqx:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> emqx-test <span class="token punctuation">\</span></span>
<span class="line">    --add-host<span class="token operator">=</span>host.docker.internal:host-gateway <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">18083</span>:18083 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">1883</span>:1883 <span class="token punctuation">\</span></span>
<span class="line">    emqx/emqx:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>管理后台: <a href="http://localhost:18083" target="_blank" rel="noopener noreferrer">http://localhost:18083</a><br>
默认账号: admin<br>
默认密码: public</p>
<h2 id="rabbitmq认证" tabindex="-1"><a class="header-anchor" href="#rabbitmq认证"><span>RabbitMQ认证</span></a></h2>
<h3 id="需要的插件" tabindex="-1"><a class="header-anchor" href="#需要的插件"><span>需要的插件</span></a></h3>
<ul>
<li><strong>rabbitmq_mqtt</strong> 提供MQTT协议的支持</li>
<li><strong>rabbitmq_web_mqtt</strong> 提供Web MQTT协议的支持</li>
<li><strong>rabbitmq_auth_backend_http</strong> 提供HTTP认证的支持</li>
</ul>
<h3 id="配置文件" tabindex="-1"><a class="header-anchor" href="#配置文件"><span>配置文件</span></a></h3>
<p>打开Docker的命令行,编辑配置文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vim</span> /opt/bitnami/rabbitmq/etc/rabbitmq/rabbitmq.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>添加如下的配置:</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre v-pre><code><span class="line"><span class="token comment"># 打开内置认证,优先会检查内置账号</span></span>
<span class="line"><span class="token key attr-name">auth_backends.1</span> <span class="token punctuation">=</span> <span class="token value attr-value">internal</span></span>
<span class="line"><span class="token comment"># 第二级认证,使用缓存认证</span></span>
<span class="line"><span class="token key attr-name">auth_backends.2</span> <span class="token punctuation">=</span> <span class="token value attr-value">cache</span></span>
<span class="line"><span class="token comment"># 缓存后端指定为 http</span></span>
<span class="line"><span class="token key attr-name">auth_cache.cached_backend</span> <span class="token punctuation">=</span> <span class="token value attr-value">http</span></span>
<span class="line"><span class="token comment"># 缓存时间，单位毫秒</span></span>
<span class="line"><span class="token key attr-name">auth_cache.cache_ttl</span> <span class="token punctuation">=</span> <span class="token value attr-value">60000</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># HTTP请求方法,使用post</span></span>
<span class="line"><span class="token key attr-name">auth_http.http_method</span>   <span class="token punctuation">=</span> <span class="token value attr-value">post</span></span>
<span class="line"><span class="token comment"># 用户认证</span></span>
<span class="line"><span class="token key attr-name">auth_http.user_path</span>     <span class="token punctuation">=</span> <span class="token value attr-value">http://host.docker.internal:8100/auth/user</span></span>
<span class="line"><span class="token comment"># Vhost权鉴</span></span>
<span class="line"><span class="token key attr-name">auth_http.vhost_path</span>    <span class="token punctuation">=</span> <span class="token value attr-value">http://host.docker.internal:8100/auth/vhost</span></span>
<span class="line"><span class="token comment"># 资源权鉴</span></span>
<span class="line"><span class="token key attr-name">auth_http.resource_path</span> <span class="token punctuation">=</span> <span class="token value attr-value">http://host.docker.internal:8100/auth/resource</span></span>
<span class="line"><span class="token comment"># Topic权鉴</span></span>
<span class="line"><span class="token key attr-name">auth_http.topic_path</span>    <span class="token punctuation">=</span> <span class="token value attr-value">http://host.docker.internal:8100/auth/topic</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="http认证服务器实现" tabindex="-1"><a class="header-anchor" href="#http认证服务器实现"><span>HTTP认证服务器实现</span></a></h3>
<p>认证服务器使用Golang+Gin实现,代码大致如下:</p>
<ul>
<li>注册路由</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">	r<span class="token punctuation">.</span><span class="token function">POST</span><span class="token punctuation">(</span><span class="token string">"/auth/user"</span><span class="token punctuation">,</span> handleRabbitMqUser<span class="token punctuation">)</span></span>
<span class="line">	r<span class="token punctuation">.</span><span class="token function">POST</span><span class="token punctuation">(</span><span class="token string">"/auth/vhost"</span><span class="token punctuation">,</span> handleRabbitMqVhost<span class="token punctuation">)</span></span>
<span class="line">	r<span class="token punctuation">.</span><span class="token function">POST</span><span class="token punctuation">(</span><span class="token string">"/auth/resource"</span><span class="token punctuation">,</span> handleRabbitMqResource<span class="token punctuation">)</span></span>
<span class="line">	r<span class="token punctuation">.</span><span class="token function">POST</span><span class="token punctuation">(</span><span class="token string">"/auth/topic"</span><span class="token punctuation">,</span> handleRabbitMqTopic<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>处理路由</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">handleRabbitMqUser</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> form <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">		Username <span class="token builtin">string</span> <span class="token string">`form:"username"`</span></span>
<span class="line">		Password <span class="token builtin">string</span> <span class="token string">`form:"password"`</span></span>
<span class="line">		ClientId <span class="token builtin">string</span> <span class="token string">`form:"client_id"`</span></span>
<span class="line">		Vhost    <span class="token builtin">string</span> <span class="token string">`form:"vhost"`</span></span>
<span class="line">		Ip       <span class="token builtin">string</span> <span class="token string">`form:"ip"`</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token function">BindAndValid</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token operator">&amp;</span>form<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"handleRabbitMqUser"</span><span class="token punctuation">,</span> form<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> form<span class="token punctuation">.</span>Username <span class="token operator">==</span> <span class="token string">"user"</span> <span class="token operator">&amp;&amp;</span> form<span class="token punctuation">.</span>Password <span class="token operator">==</span> <span class="token string">"bitnami"</span> <span class="token punctuation">{</span></span>
<span class="line">		c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"allow administrator"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> form<span class="token punctuation">.</span>Username <span class="token operator">==</span> <span class="token string">"admin"</span> <span class="token operator">&amp;&amp;</span> form<span class="token punctuation">.</span>Password <span class="token operator">==</span> <span class="token string">"bitnami"</span> <span class="token punctuation">{</span></span>
<span class="line">		c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"allow management"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">		c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"allow"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token comment">// c.String(200, "deny")</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleRabbitMqVhost</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> form <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">		Username <span class="token builtin">string</span> <span class="token string">`form:"username"`</span></span>
<span class="line">		Vhost    <span class="token builtin">string</span> <span class="token string">`form:"vhost"`</span></span>
<span class="line">		Ip       <span class="token builtin">string</span> <span class="token string">`form:"ip"`</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token function">BindAndValid</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token operator">&amp;</span>form<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"handleRabbitMqVhost"</span><span class="token punctuation">,</span> form<span class="token punctuation">)</span></span>
<span class="line">	c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"allow"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleRabbitMqResource</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> form <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">		Username   <span class="token builtin">string</span> <span class="token string">`form:"username"`</span></span>
<span class="line">		Vhost      <span class="token builtin">string</span> <span class="token string">`form:"vhost"`</span></span>
<span class="line">		Resource   <span class="token builtin">string</span> <span class="token string">`form:"resource"`</span></span>
<span class="line">		Name       <span class="token builtin">string</span> <span class="token string">`form:"name"`</span></span>
<span class="line">		Permission <span class="token builtin">string</span> <span class="token string">`form:"permission"`</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token function">BindAndValid</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token operator">&amp;</span>form<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"handleRabbitMqResource"</span><span class="token punctuation">,</span> form<span class="token punctuation">)</span></span>
<span class="line">	c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"allow"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleRabbitMqTopic</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> form <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">		Username   <span class="token builtin">string</span> <span class="token string">`form:"username"`</span></span>
<span class="line">		Vhost      <span class="token builtin">string</span> <span class="token string">`form:"vhost"`</span></span>
<span class="line">		Resource   <span class="token builtin">string</span> <span class="token string">`form:"resource"`</span></span>
<span class="line">		Name       <span class="token builtin">string</span> <span class="token string">`form:"name"`</span></span>
<span class="line">		Permission <span class="token builtin">string</span> <span class="token string">`form:"permission"`</span></span>
<span class="line">		RoutingKey <span class="token builtin">string</span> <span class="token string">`form:"routing_key"`</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token function">BindAndValid</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token operator">&amp;</span>form<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"handleRabbitMqTopic"</span><span class="token punctuation">,</span> form<span class="token punctuation">)</span></span>
<span class="line">	c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"allow"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="emqx认证" tabindex="-1"><a class="header-anchor" href="#emqx认证"><span>EMQX认证</span></a></h2>
<h3 id="需要的插件-1" tabindex="-1"><a class="header-anchor" href="#需要的插件-1"><span>需要的插件</span></a></h3>
<ul>
<li><strong>emqx_auth_http</strong> 插件同时包含 ACL 功能，可通过注释禁用。</li>
</ul>
<h3 id="配置文件-1" tabindex="-1"><a class="header-anchor" href="#配置文件-1"><span>配置文件</span></a></h3>
<p>打开Docker的命令行,编辑配置文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vi</span> etc/plugins/emqx_auth_http.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>添加如下的配置:</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre v-pre><code><span class="line"><span class="token key attr-name">auth.http.auth_req</span> <span class="token punctuation">=</span> <span class="token value attr-value">http://127.0.0.1:8100/mqtt/auth</span></span>
<span class="line"><span class="token key attr-name">auth.http.auth_req_method</span> <span class="token punctuation">=</span> <span class="token value attr-value">POST</span></span>
<span class="line"><span class="token key attr-name">auth.http.auth_req_content_type</span> <span class="token punctuation">=</span> <span class="token value attr-value">application/json</span></span>
<span class="line"><span class="token key attr-name">auth.http.auth_req.params</span> <span class="token punctuation">=</span> <span class="token value attr-value">clientid=%c,username=%u,password=%P,ipaddress=%a</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="http认证服务器实现-1" tabindex="-1"><a class="header-anchor" href="#http认证服务器实现-1"><span>HTTP认证服务器实现</span></a></h3>
<p>认证服务器使用Golang+Gin实现,代码大致如下:</p>
<ul>
<li>注册路由</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">r<span class="token punctuation">.</span><span class="token function">POST</span><span class="token punctuation">(</span><span class="token string">"/mqtt/auth"</span><span class="token punctuation">,</span> handleEmqxMqttAuth<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>处理路由</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">handleEmqxMqttAuth</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> form <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">		Username  <span class="token builtin">string</span> <span class="token string">`form:"username"`</span></span>
<span class="line">		Password  <span class="token builtin">string</span> <span class="token string">`form:"password"`</span></span>
<span class="line">		ClientId  <span class="token builtin">string</span> <span class="token string">`form:"clientid"`</span></span>
<span class="line">		IpAddress <span class="token builtin">string</span> <span class="token string">`form:"ipaddress"`</span></span>
<span class="line">		Protocol  <span class="token builtin">string</span> <span class="token string">`form:"protocol"`</span></span>
<span class="line">		SockPort  <span class="token builtin">string</span> <span class="token string">`form:"sockport"`</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token function">BindAndValid</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token operator">&amp;</span>form<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"handleEmqxMqttAuth"</span><span class="token punctuation">,</span> form<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token function">ResponseJSON</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusOK<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码"><span>示例代码</span></a></h2>
<p>Github代码仓库: <a href="https://github.com/tx7do/mqtt-http-auth-example" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/mqtt-http-auth-example</a></p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.emqx.io/docs/zh/v4.3/advanced/auth-http.html#%E8%AE%A4%E8%AF%81%E8%AF%B7%E6%B1%82" target="_blank" rel="noopener noreferrer">EMQX HTTP 认证</a></li>
<li><a href="https://github.com/rabbitmq/rabbitmq-auth-backend-http/blob/v3.7.x/README.md" target="_blank" rel="noopener noreferrer">rabbitmq_auth_backend_http插件文档</a></li>
<li><a href="https://www.rabbitmq.com/access-control.html#server-mechanism-configuration" target="_blank" rel="noopener noreferrer">RabbitMQ Authentication, Authorisation, Access Control</a></li>
</ul>
</div></template>


