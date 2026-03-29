<template><div><h1 id="kratos-大乱炖-——-整合其他web框架-gin、fasthttp、hertz" tabindex="-1"><a class="header-anchor" href="#kratos-大乱炖-——-整合其他web框架-gin、fasthttp、hertz"><span>Kratos 大乱炖 —— 整合其他Web框架：Gin、FastHttp、Hertz</span></a></h1>
<p>Kratos默认的RPC框架使用的是gRPC，支持REST和protobuf两种通讯协议。其API都是使用protobuf定义的，REST协议是通过<a href="https://github.com/grpc-ecosystem/grpc-gateway" target="_blank" rel="noopener noreferrer">grpc-gateway</a>转译实现的。使用protobuf定义API是具有极大优点的，具有很强的可读性、可维护性，以及工程性。工程再大，人员再多，也不会乱。</p>
<p>一切看起来都是很美好的。那么，问题来了，我们现在使用的是其他的Web框架，迁移就会有成本，有风险，不可能一下子就把历史存在的代码一口气转换过来到Kratos框架。那我可以在Kratos中整合其他的Web框架做过渡吗？答案是：可以的。Kratos是基于的插件化设计，万物皆可插。</p>
<p>我整合了主流的Gin和FastHttp。顺便把字节跳动的Hertz也尝试着整合了一下。整合之后，使用起来毫无违和感。</p>
<h2 id="gin" tabindex="-1"><a class="header-anchor" href="#gin"><span>Gin</span></a></h2>
<p><a href="https://gin-gonic.com/" target="_blank" rel="noopener noreferrer">Gin</a> 是用 Go 编写的一个 Web 应用框架，对比其它主流的同类框架，他有更好的性能和更快的路由。由于其本身只是在官方 net/http 包的基础上做的完善，所以理解和上手很平滑。</p>
<p>封装的代码如下：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> gin</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"crypto/tls"</span></span>
<span class="line">	<span class="token string">"net/http"</span></span>
<span class="line">	<span class="token string">"net/url"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/gin-gonic/gin"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/errors"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/log"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/middleware"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/transport"</span></span>
<span class="line">	kHttp <span class="token string">"github.com/go-kratos/kratos/v2/transport/http"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token boolean">_</span> transport<span class="token punctuation">.</span>Server     <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>Server<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token boolean">_</span> transport<span class="token punctuation">.</span>Endpointer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>Server<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Server <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token operator">*</span>gin<span class="token punctuation">.</span>Engine</span>
<span class="line">	server <span class="token operator">*</span>http<span class="token punctuation">.</span>Server</span>
<span class="line"></span>
<span class="line">	tlsConf  <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config</span>
<span class="line">	endpoint <span class="token operator">*</span>url<span class="token punctuation">.</span>URL</span>
<span class="line">	timeout  time<span class="token punctuation">.</span>Duration</span>
<span class="line">	addr     <span class="token builtin">string</span></span>
<span class="line"></span>
<span class="line">	err <span class="token builtin">error</span></span>
<span class="line"></span>
<span class="line">	filters <span class="token punctuation">[</span><span class="token punctuation">]</span>kHttp<span class="token punctuation">.</span>FilterFunc</span>
<span class="line">	ms      <span class="token punctuation">[</span><span class="token punctuation">]</span>middleware<span class="token punctuation">.</span>Middleware</span>
<span class="line">	dec     kHttp<span class="token punctuation">.</span>DecodeRequestFunc</span>
<span class="line">	enc     kHttp<span class="token punctuation">.</span>EncodeResponseFunc</span>
<span class="line">	ene     kHttp<span class="token punctuation">.</span>EncodeErrorFunc</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewServer</span><span class="token punctuation">(</span>opts <span class="token operator">...</span>ServerOption<span class="token punctuation">)</span> <span class="token operator">*</span>Server <span class="token punctuation">{</span></span>
<span class="line">	srv <span class="token operator">:=</span> <span class="token operator">&amp;</span>Server<span class="token punctuation">{</span></span>
<span class="line">		timeout<span class="token punctuation">:</span> <span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">,</span></span>
<span class="line">		dec<span class="token punctuation">:</span>     kHttp<span class="token punctuation">.</span>DefaultRequestDecoder<span class="token punctuation">,</span></span>
<span class="line">		enc<span class="token punctuation">:</span>     kHttp<span class="token punctuation">.</span>DefaultResponseEncoder<span class="token punctuation">,</span></span>
<span class="line">		ene<span class="token punctuation">:</span>     kHttp<span class="token punctuation">.</span>DefaultErrorEncoder<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	srv<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span>opts<span class="token operator">...</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> srv</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">init</span><span class="token punctuation">(</span>opts <span class="token operator">...</span>ServerOption<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span>Engine <span class="token operator">=</span> gin<span class="token punctuation">.</span><span class="token function">Default</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> o <span class="token operator">:=</span> <span class="token keyword">range</span> opts <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">o</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>server <span class="token operator">=</span> <span class="token operator">&amp;</span>http<span class="token punctuation">.</span>Server<span class="token punctuation">{</span></span>
<span class="line">		Addr<span class="token punctuation">:</span>      s<span class="token punctuation">.</span>addr<span class="token punctuation">,</span></span>
<span class="line">		Handler<span class="token punctuation">:</span>   s<span class="token punctuation">.</span>Engine<span class="token punctuation">,</span></span>
<span class="line">		TLSConfig<span class="token punctuation">:</span> s<span class="token punctuation">.</span>tlsConf<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>endpoint<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Endpoint</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>url<span class="token punctuation">.</span>URL<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>endpoint<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Start</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Infof</span><span class="token punctuation">(</span><span class="token string">"[GIN] server listening on: %s"</span><span class="token punctuation">,</span> s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> err <span class="token builtin">error</span></span>
<span class="line">	<span class="token keyword">if</span> s<span class="token punctuation">.</span>tlsConf <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		err <span class="token operator">=</span> s<span class="token punctuation">.</span>server<span class="token punctuation">.</span><span class="token function">ListenAndServeTLS</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">		err <span class="token operator">=</span> s<span class="token punctuation">.</span>server<span class="token punctuation">.</span><span class="token function">ListenAndServe</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">if</span> <span class="token operator">!</span>errors<span class="token punctuation">.</span><span class="token function">Is</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> http<span class="token punctuation">.</span>ErrServerClosed<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Stop</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"[GIN] server stopping"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>server<span class="token punctuation">.</span><span class="token function">Shutdown</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">ServeHTTP</span><span class="token punctuation">(</span>res http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> req <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span>Engine<span class="token punctuation">.</span><span class="token function">ServeHTTP</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> req<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>应用的代码如下：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> gin</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"context"</span></span>
<span class="line">    <span class="token string">"math/rand"</span></span>
<span class="line">    <span class="token string">"strconv"</span></span>
<span class="line">    </span>
<span class="line">    <span class="token string">"github.com/gin-gonic/gin"</span></span>
<span class="line">    transport <span class="token string">"github.com/tx7do/kratos-transport/gin"</span></span>
<span class="line">    </span>
<span class="line">    api <span class="token string">"github.com/tx7do/kratos-transport/_example/api/protobuf"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv <span class="token operator">:=</span> transport<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">        <span class="token function">WithAddress</span><span class="token punctuation">(</span><span class="token string">":8800"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">Use</span><span class="token punctuation">(</span>gin<span class="token punctuation">.</span><span class="token function">Recovery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">Use</span><span class="token punctuation">(</span>gin<span class="token punctuation">.</span><span class="token function">Logger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">GET</span><span class="token punctuation">(</span><span class="token string">"/login/*param"</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token function">len</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span>Params<span class="token punctuation">.</span><span class="token function">ByName</span><span class="token punctuation">(</span><span class="token string">"param"</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">1</span> <span class="token punctuation">{</span></span>
<span class="line">            c<span class="token punctuation">.</span><span class="token function">AbortWithStatus</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">return</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"Hello World!"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">GET</span><span class="token punctuation">(</span><span class="token string">"/hygrothermograph"</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>c <span class="token operator">*</span>gin<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">var</span> out api<span class="token punctuation">.</span>Hygrothermograph</span>
<span class="line">        out<span class="token punctuation">.</span>Humidity <span class="token operator">=</span> strconv<span class="token punctuation">.</span><span class="token function">FormatInt</span><span class="token punctuation">(</span><span class="token function">int64</span><span class="token punctuation">(</span>rand<span class="token punctuation">.</span><span class="token function">Intn</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span></span>
<span class="line">        out<span class="token punctuation">.</span>Temperature <span class="token operator">=</span> strconv<span class="token punctuation">.</span><span class="token function">FormatInt</span><span class="token punctuation">(</span><span class="token function">int64</span><span class="token punctuation">(</span>rand<span class="token punctuation">.</span><span class="token function">Intn</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span></span>
<span class="line">        c<span class="token punctuation">.</span><span class="token function">JSON</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>out<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Start</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Stop</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">            t<span class="token punctuation">.</span><span class="token function">Errorf</span><span class="token punctuation">(</span><span class="token string">"expected nil got %v"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="fasthttp" tabindex="-1"><a class="header-anchor" href="#fasthttp"><span>FastHttp</span></a></h2>
<p><a href="https://github.com/valyala/fasthttp" target="_blank" rel="noopener noreferrer">FastHTTP</a>是golang下的一个http框架，顾名思义，与原生的http实现相比，它的特点在于快，按照官网的说法，它的客户端和服务端性能比原生有了十倍的提升。</p>
<p>它的高性能主要源自于“复用”，通过服务协程和内存变量的复用，节省了大量资源分配的成本。</p>
<p>封装的代码如下：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> fasthttp</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"crypto/tls"</span></span>
<span class="line">	<span class="token string">"net/http"</span></span>
<span class="line">	<span class="token string">"net/url"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/fasthttp/router"</span></span>
<span class="line">	<span class="token string">"github.com/valyala/fasthttp"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/errors"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/log"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/middleware"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/transport"</span></span>
<span class="line">	kHttp <span class="token string">"github.com/go-kratos/kratos/v2/transport/http"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token boolean">_</span> transport<span class="token punctuation">.</span>Server     <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>Server<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token boolean">_</span> transport<span class="token punctuation">.</span>Endpointer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>Server<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Server <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token operator">*</span>fasthttp<span class="token punctuation">.</span>Server</span>
<span class="line"></span>
<span class="line">	tlsConf  <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config</span>
<span class="line">	endpoint <span class="token operator">*</span>url<span class="token punctuation">.</span>URL</span>
<span class="line">	timeout  time<span class="token punctuation">.</span>Duration</span>
<span class="line">	addr     <span class="token builtin">string</span></span>
<span class="line"></span>
<span class="line">	err <span class="token builtin">error</span></span>
<span class="line"></span>
<span class="line">	filters <span class="token punctuation">[</span><span class="token punctuation">]</span>FilterFunc</span>
<span class="line">	ms      <span class="token punctuation">[</span><span class="token punctuation">]</span>middleware<span class="token punctuation">.</span>Middleware</span>
<span class="line">	dec     kHttp<span class="token punctuation">.</span>DecodeRequestFunc</span>
<span class="line">	enc     kHttp<span class="token punctuation">.</span>EncodeResponseFunc</span>
<span class="line">	ene     kHttp<span class="token punctuation">.</span>EncodeErrorFunc</span>
<span class="line"></span>
<span class="line">	strictSlash <span class="token builtin">bool</span></span>
<span class="line">	router      <span class="token operator">*</span>router<span class="token punctuation">.</span>Router</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewServer</span><span class="token punctuation">(</span>opts <span class="token operator">...</span>ServerOption<span class="token punctuation">)</span> <span class="token operator">*</span>Server <span class="token punctuation">{</span></span>
<span class="line">	srv <span class="token operator">:=</span> <span class="token operator">&amp;</span>Server<span class="token punctuation">{</span></span>
<span class="line">		timeout<span class="token punctuation">:</span>     <span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">,</span></span>
<span class="line">		dec<span class="token punctuation">:</span>         kHttp<span class="token punctuation">.</span>DefaultRequestDecoder<span class="token punctuation">,</span></span>
<span class="line">		enc<span class="token punctuation">:</span>         kHttp<span class="token punctuation">.</span>DefaultResponseEncoder<span class="token punctuation">,</span></span>
<span class="line">		ene<span class="token punctuation">:</span>         kHttp<span class="token punctuation">.</span>DefaultErrorEncoder<span class="token punctuation">,</span></span>
<span class="line">		strictSlash<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">		router<span class="token punctuation">:</span>      router<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	srv<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span>opts<span class="token operator">...</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> srv</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">init</span><span class="token punctuation">(</span>opts <span class="token operator">...</span>ServerOption<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> o <span class="token operator">:=</span> <span class="token keyword">range</span> opts <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">o</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>Server <span class="token operator">=</span> <span class="token operator">&amp;</span>fasthttp<span class="token punctuation">.</span>Server<span class="token punctuation">{</span></span>
<span class="line">		TLSConfig<span class="token punctuation">:</span> s<span class="token punctuation">.</span>tlsConf<span class="token punctuation">,</span></span>
<span class="line">		Handler<span class="token punctuation">:</span>   <span class="token function">FilterChain</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>filters<span class="token operator">...</span><span class="token punctuation">)</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>router<span class="token punctuation">.</span>Handler<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>router<span class="token punctuation">.</span>RedirectTrailingSlash <span class="token operator">=</span> s<span class="token punctuation">.</span>strictSlash</span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>endpoint<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Endpoint</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>url<span class="token punctuation">.</span>URL<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>endpoint<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Start</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Infof</span><span class="token punctuation">(</span><span class="token string">"[fasthttp] server listening on: %s"</span><span class="token punctuation">,</span> s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> err <span class="token builtin">error</span></span>
<span class="line">	<span class="token keyword">if</span> s<span class="token punctuation">.</span>tlsConf <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		err <span class="token operator">=</span> s<span class="token punctuation">.</span>Server<span class="token punctuation">.</span><span class="token function">ListenAndServeTLS</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>addr<span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">		err <span class="token operator">=</span> s<span class="token punctuation">.</span>Server<span class="token punctuation">.</span><span class="token function">ListenAndServe</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">if</span> <span class="token operator">!</span>errors<span class="token punctuation">.</span><span class="token function">Is</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> http<span class="token punctuation">.</span>ErrServerClosed<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Stop</span><span class="token punctuation">(</span><span class="token boolean">_</span> context<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"[fasthttp] server stopping"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>Server<span class="token punctuation">.</span><span class="token function">Shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>method<span class="token punctuation">,</span> path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>method<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">GET</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodGet<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">HEAD</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodHead<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">POST</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodPost<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">PUT</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodPut<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">PATCH</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodPatch<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">DELETE</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodDelete<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">CONNECT</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodConnect<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">OPTIONS</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodOptions<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">TRACE</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">,</span> handler fasthttp<span class="token punctuation">.</span>RequestHandler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>fasthttp<span class="token punctuation">.</span>MethodTrace<span class="token punctuation">,</span> path<span class="token punctuation">,</span> handler<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>应用的代码如下：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> fasthttp</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"context"</span></span>
<span class="line">    <span class="token string">"encoding/json"</span></span>
<span class="line">    <span class="token string">"math/rand"</span></span>
<span class="line">    <span class="token string">"strconv"</span></span>
<span class="line">    </span>
<span class="line">    <span class="token string">"github.com/valyala/fasthttp"</span></span>
<span class="line">    transport <span class="token string">"github.com/tx7do/kratos-transport/fasthttp"</span></span>
<span class="line">    </span>
<span class="line">    api <span class="token string">"github.com/tx7do/kratos-transport/_example/api/protobuf"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv <span class="token operator">:=</span> transport<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">        <span class="token function">WithAddress</span><span class="token punctuation">(</span><span class="token string">":8800"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">GET</span><span class="token punctuation">(</span><span class="token string">"/login/*param"</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>c <span class="token operator">*</span>fasthttp<span class="token punctuation">.</span>RequestCtx<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token boolean">_</span><span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">WriteString</span><span class="token punctuation">(</span><span class="token string">"Hello World!"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">GET</span><span class="token punctuation">(</span><span class="token string">"/hygrothermograph"</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>c <span class="token operator">*</span>fasthttp<span class="token punctuation">.</span>RequestCtx<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">var</span> out api<span class="token punctuation">.</span>Hygrothermograph</span>
<span class="line">        out<span class="token punctuation">.</span>Humidity <span class="token operator">=</span> strconv<span class="token punctuation">.</span><span class="token function">FormatInt</span><span class="token punctuation">(</span><span class="token function">int64</span><span class="token punctuation">(</span>rand<span class="token punctuation">.</span><span class="token function">Intn</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span></span>
<span class="line">        out<span class="token punctuation">.</span>Temperature <span class="token operator">=</span> strconv<span class="token punctuation">.</span><span class="token function">FormatInt</span><span class="token punctuation">(</span><span class="token function">int64</span><span class="token punctuation">(</span>rand<span class="token punctuation">.</span><span class="token function">Intn</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token boolean">_</span> <span class="token operator">=</span> json<span class="token punctuation">.</span><span class="token function">NewEncoder</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span>Response<span class="token punctuation">.</span><span class="token function">BodyWriter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Encode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>out<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Start</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Stop</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">            t<span class="token punctuation">.</span><span class="token function">Errorf</span><span class="token punctuation">(</span><span class="token string">"expected nil got %v"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="hertz" tabindex="-1"><a class="header-anchor" href="#hertz"><span>Hertz</span></a></h2>
<p><a href="https://www.cloudwego.io/zh/docs/hertz/" target="_blank" rel="noopener noreferrer">Hertz[həːts]</a> 是一个 Golang 微服务 HTTP 框架，在设计之初参考了其他开源框架 fasthttp、gin、echo 的优势， 并结合字节跳动内部的需求，使其具有高易用性、高性能、高扩展性等特点，目前在字节跳动内部已广泛使用。 如今越来越多的微服务选择使用 Golang，如果对微服务性能有要求，又希望框架能够充分满足内部的可定制化需求，Hertz 会是一个不错的选择。</p>
<p>封装的代码如下：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> hertz</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"crypto/tls"</span></span>
<span class="line">	<span class="token string">"net/url"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	hertz <span class="token string">"github.com/cloudwego/hertz/pkg/app/server"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/log"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/middleware"</span></span>
<span class="line">	<span class="token string">"github.com/go-kratos/kratos/v2/transport"</span></span>
<span class="line">	kHttp <span class="token string">"github.com/go-kratos/kratos/v2/transport/http"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token boolean">_</span> transport<span class="token punctuation">.</span>Server     <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>Server<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token boolean">_</span> transport<span class="token punctuation">.</span>Endpointer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>Server<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Server <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token operator">*</span>hertz<span class="token punctuation">.</span>Hertz</span>
<span class="line"></span>
<span class="line">	tlsConf  <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config</span>
<span class="line">	endpoint <span class="token operator">*</span>url<span class="token punctuation">.</span>URL</span>
<span class="line">	timeout  time<span class="token punctuation">.</span>Duration</span>
<span class="line">	addr     <span class="token builtin">string</span></span>
<span class="line"></span>
<span class="line">	err <span class="token builtin">error</span></span>
<span class="line"></span>
<span class="line">	filters <span class="token punctuation">[</span><span class="token punctuation">]</span>kHttp<span class="token punctuation">.</span>FilterFunc</span>
<span class="line">	ms      <span class="token punctuation">[</span><span class="token punctuation">]</span>middleware<span class="token punctuation">.</span>Middleware</span>
<span class="line">	dec     kHttp<span class="token punctuation">.</span>DecodeRequestFunc</span>
<span class="line">	enc     kHttp<span class="token punctuation">.</span>EncodeResponseFunc</span>
<span class="line">	ene     kHttp<span class="token punctuation">.</span>EncodeErrorFunc</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewServer</span><span class="token punctuation">(</span>opts <span class="token operator">...</span>ServerOption<span class="token punctuation">)</span> <span class="token operator">*</span>Server <span class="token punctuation">{</span></span>
<span class="line">	srv <span class="token operator">:=</span> <span class="token operator">&amp;</span>Server<span class="token punctuation">{</span></span>
<span class="line">		timeout<span class="token punctuation">:</span> <span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">,</span></span>
<span class="line">		dec<span class="token punctuation">:</span>     kHttp<span class="token punctuation">.</span>DefaultRequestDecoder<span class="token punctuation">,</span></span>
<span class="line">		enc<span class="token punctuation">:</span>     kHttp<span class="token punctuation">.</span>DefaultResponseEncoder<span class="token punctuation">,</span></span>
<span class="line">		ene<span class="token punctuation">:</span>     kHttp<span class="token punctuation">.</span>DefaultErrorEncoder<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	srv<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span>opts<span class="token operator">...</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> srv</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">init</span><span class="token punctuation">(</span>opts <span class="token operator">...</span>ServerOption<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> o <span class="token operator">:=</span> <span class="token keyword">range</span> opts <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">o</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>Hertz <span class="token operator">=</span> hertz<span class="token punctuation">.</span><span class="token function">Default</span><span class="token punctuation">(</span>hertz<span class="token punctuation">.</span><span class="token function">WithHostPorts</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span><span class="token punctuation">,</span> hertz<span class="token punctuation">.</span><span class="token function">WithTLS</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>tlsConf<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	s<span class="token punctuation">.</span>endpoint<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Endpoint</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>url<span class="token punctuation">.</span>URL<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>endpoint<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Start</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Infof</span><span class="token punctuation">(</span><span class="token string">"[hertz] server listening on: %s"</span><span class="token punctuation">,</span> s<span class="token punctuation">.</span>addr<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>Hertz<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>Server<span class="token punctuation">)</span> <span class="token function">Stop</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"[hertz] server stopping"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> s<span class="token punctuation">.</span>Hertz<span class="token punctuation">.</span><span class="token function">Shutdown</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>应用的代码如下：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> hertz</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"context"</span></span>
<span class="line">    <span class="token string">"math/rand"</span></span>
<span class="line">    <span class="token string">"strconv"</span></span>
<span class="line">    </span>
<span class="line">    <span class="token string">"github.com/cloudwego/hertz/pkg/app"</span></span>
<span class="line">    transport <span class="token string">"github.com/tx7do/kratos-transport/hertz"</span></span>
<span class="line">    </span>
<span class="line">    api <span class="token string">"github.com/tx7do/kratos-transport/_example/api/protobuf"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">TestServer</span><span class="token punctuation">(</span>t <span class="token operator">*</span>testing<span class="token punctuation">.</span>T<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv <span class="token operator">:=</span> transport<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">        <span class="token function">WithAddress</span><span class="token punctuation">(</span><span class="token string">"127.0.0.1:8800"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">GET</span><span class="token punctuation">(</span><span class="token string">"/login/*param"</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> c <span class="token operator">*</span>app<span class="token punctuation">.</span>RequestContext<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token function">len</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span>Params<span class="token punctuation">.</span><span class="token function">ByName</span><span class="token punctuation">(</span><span class="token string">"param"</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">1</span> <span class="token punctuation">{</span></span>
<span class="line">            c<span class="token punctuation">.</span><span class="token function">AbortWithStatus</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">return</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        c<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token string">"Hello World!"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    srv<span class="token punctuation">.</span><span class="token function">GET</span><span class="token punctuation">(</span><span class="token string">"/hygrothermograph"</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> c <span class="token operator">*</span>app<span class="token punctuation">.</span>RequestContext<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">var</span> out api<span class="token punctuation">.</span>Hygrothermograph</span>
<span class="line">        out<span class="token punctuation">.</span>Humidity <span class="token operator">=</span> strconv<span class="token punctuation">.</span><span class="token function">FormatInt</span><span class="token punctuation">(</span><span class="token function">int64</span><span class="token punctuation">(</span>rand<span class="token punctuation">.</span><span class="token function">Intn</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span></span>
<span class="line">        out<span class="token punctuation">.</span>Temperature <span class="token operator">=</span> strconv<span class="token punctuation">.</span><span class="token function">FormatInt</span><span class="token punctuation">(</span><span class="token function">int64</span><span class="token punctuation">(</span>rand<span class="token punctuation">.</span><span class="token function">Intn</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span></span>
<span class="line">        c<span class="token punctuation">.</span><span class="token function">JSON</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>out<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Start</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Stop</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">            t<span class="token punctuation">.</span><span class="token function">Errorf</span><span class="token punctuation">(</span><span class="token string">"expected nil got %v"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://github.com/gin-gonic/gin" target="_blank" rel="noopener noreferrer">GIN - Github</a></li>
<li><a href="https://gin-gonic.com/" target="_blank" rel="noopener noreferrer">Gin - Website</a></li>
<li><a href="https://github.com/valyala/fasthttp" target="_blank" rel="noopener noreferrer">FastHTTP Github</a></li>
<li><a href="https://cloud.tencent.com/developer/news/462918" target="_blank" rel="noopener noreferrer">fasthttp：高性能背后的惨痛代价</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/367927669" target="_blank" rel="noopener noreferrer">fasthttp性能真的比标准库http包好很多吗？一文告诉你真相！</a></li>
<li><a href="https://github.com/cloudwego/hertz" target="_blank" rel="noopener noreferrer">Hertz - Github</a></li>
<li><a href="https://www.cloudwego.io/zh/docs/hertz/" target="_blank" rel="noopener noreferrer">Hertz - Docs</a></li>
</ul>
</div></template>


