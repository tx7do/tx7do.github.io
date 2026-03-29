<template><div><h1 id="golang微服务框架kratos实现sse服务" tabindex="-1"><a class="header-anchor" href="#golang微服务框架kratos实现sse服务"><span>Golang微服务框架kratos实现SSE服务</span></a></h1>
<p>我也是最近才知道SSE的，问了下周围的人，发现知道的人也着实不多的。我是怎么知道SSE的呢？我看了下OpenAI的API，有一个Stream模式，就是使用的SSE实现的。说白了，这就是一个HTTP长连接通过服务端持续发送数据到前端的协议。在网络不稳定的情况下，它比Websocket要更好。</p>
<h2 id="什么是sse" tabindex="-1"><a class="header-anchor" href="#什么是sse"><span>什么是SSE</span></a></h2>
<p>Server-Sent Events（简称 SSE）</p>
<p>严格地说，HTTP 协议无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息（streaming）。</p>
<p>也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来。这时，客户端不会关闭连接，会一直等着服务器发过来的新的数据流，视频播放就是这样的例子。本质上，这种通信就是以流信息的方式，完成一次用时很长的下载。</p>
<p>SSE 与 WebSocket 作用相似，都是建立浏览器与服务器之间的通信渠道，然后服务器向浏览器推送信息。</p>
<p>总体来说，WebSocket 更强大和灵活。因为它是全双工通道，可以双向通信；SSE 是单向通道，只能服务器向浏览器发送，因为流信息本质上就是下载。如果浏览器向服务器发送信息，就变成了另一次 HTTP 请求。</p>
<p>但是，SSE 也有自己的优点：</p>
<ul>
<li>SSE 使用 HTTP 协议，现有的服务器软件都支持。WebSocket 是一个独立协议。</li>
<li>SSE 属于轻量级，使用简单；WebSocket 协议相对复杂。</li>
<li>SSE 默认支持断线重连，WebSocket 需要自己实现。</li>
<li>SSE 一般只用来传送文本，二进制数据需要编码后传送，WebSocket 默认支持传送二进制数据。</li>
<li>SSE 支持自定义发送的消息类型。</li>
</ul>
<p>因此，两者各有特点，适合不同的场合。</p>
<h2 id="协议描述" tabindex="-1"><a class="header-anchor" href="#协议描述"><span>协议描述</span></a></h2>
<h3 id="数据格式" tabindex="-1"><a class="header-anchor" href="#数据格式"><span>数据格式</span></a></h3>
<p>服务器向浏览器发送的 SSE 数据，必须是 UTF-8 编码的文本，具有如下的 HTTP 头信息：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">Content-Type: text/event-stream</span>
<span class="line">Cache-Control: no-cache</span>
<span class="line">Connection: keep-alive</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面三行之中，第一行的<code v-pre>Content-Type</code>必须指定 MIME 类型为<code v-pre>event-steam</code>。</p>
<p>每一次发送的信息，由若干个<code v-pre>message</code>组成，每个<code v-pre>message</code>之间用<code v-pre>\n\n</code>分隔。每个<code v-pre>message</code>内部由若干行组成，每一行都是如下格式：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">[field]: value\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>上面的<code v-pre>field</code>可以取四个值：</p>
<ul>
<li>data</li>
<li>event</li>
<li>id</li>
<li>retry</li>
</ul>
<p>此外，还可以有冒号开头的行，表示注释。通常，服务器每隔一段时间就会向浏览器发送一个注释，保持连接不中断：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">: This is a comment</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>下面是一个例子：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">: this is a test stream\n\n</span>
<span class="line"></span>
<span class="line">data: some text\n\n</span>
<span class="line"></span>
<span class="line">data: another message\n</span>
<span class="line">data: with two lines \n\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="data-字段" tabindex="-1"><a class="header-anchor" href="#data-字段"><span>data 字段</span></a></h3>
<p>数据内容用<code v-pre>data</code>字段表示：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">data:  message\n\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如果数据很长，可以分成多行，最后一行用<code v-pre>\n\n</code>结尾，前面行都用<code v-pre>\n</code>结尾。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">data: begin message\n</span>
<span class="line">data: continue message\n\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是一个发送 JSON 数据的例子：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">data: {\n</span>
<span class="line">data: "foo": "bar",\n</span>
<span class="line">data: "baz", 555\n</span>
<span class="line">data: }\n\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="id-字段" tabindex="-1"><a class="header-anchor" href="#id-字段"><span>id 字段</span></a></h3>
<p>数据标识符用<code v-pre>id</code>字段表示，相当于每一条数据的编号。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">id: msg1\n</span>
<span class="line">data: message\n\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>浏览器用<code v-pre>lastEventId</code>属性读取这个值。一旦连接断线，浏览器会发送一个 HTTP 头，里面包含一个特殊的<code v-pre>Last-Event-ID</code>头信息，将这个值发送回来，用来帮助服务器端重建连接。因此，这个头信息可以被视为一种同步机制。</p>
<h3 id="event-字段" tabindex="-1"><a class="header-anchor" href="#event-字段"><span>event 字段</span></a></h3>
<p><code v-pre>event</code>字段表示自定义的事件类型，默认是<code v-pre>message</code>事件。浏览器可以用<code v-pre>addEventListener()</code>监听该事件。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">event: foo\n</span>
<span class="line">data: a foo event\n\n</span>
<span class="line"></span>
<span class="line">data: an unnamed event\n\n</span>
<span class="line"></span>
<span class="line">event: bar\n</span>
<span class="line">data: a bar event\n\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码创造了三条信息。第一条的名字是<code v-pre>foo</code>，触发浏览器的<code v-pre>foo</code>事件；第二条未取名，表示默认类型，触发浏览器的<code v-pre>message</code>事件；第三条是<code v-pre>bar</code>，触发浏览器的<code v-pre>bar</code>事件。</p>
<p>下面是另一个例子：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">event: userconnect</span>
<span class="line">data: {"username": "bobby", "time": "02:33:48"}</span>
<span class="line"></span>
<span class="line">event: usermessage</span>
<span class="line">data: {"username": "bobby", "time": "02:34:11", "text": "Hi everyone."}</span>
<span class="line"></span>
<span class="line">event: userdisconnect</span>
<span class="line">data: {"username": "bobby", "time": "02:34:23"}</span>
<span class="line"></span>
<span class="line">event: usermessage</span>
<span class="line">data: {"username": "sean", "time": "02:34:36", "text": "Bye, bobby."}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="retry-字段" tabindex="-1"><a class="header-anchor" href="#retry-字段"><span>retry 字段</span></a></h3>
<p>服务器可以用retry字段，指定浏览器重新发起连接的时间间隔。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">retry: 10000\n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>两种情况会导致浏览器重新发起连接：一种是时间间隔到期，二是由于网络错误等原因，导致连接出错。</p>
<h2 id="kratos服务端" tabindex="-1"><a class="header-anchor" href="#kratos服务端"><span>Kratos服务端</span></a></h2>
<p>首先安装库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go get <span class="token parameter variable">-u</span> github.com/tx7do/kratos-transport/transport/sse</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>然后实现一个简单的服务端：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"errors"</span></span>
<span class="line">	<span class="token string">"os"</span></span>
<span class="line">	<span class="token string">"os/signal"</span></span>
<span class="line">	<span class="token string">"syscall"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/tx7do/kratos-transport/transport/sse"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    interrupt <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> os<span class="token punctuation">.</span>Signal<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">    signal<span class="token punctuation">.</span><span class="token function">Notify</span><span class="token punctuation">(</span>interrupt<span class="token punctuation">,</span> syscall<span class="token punctuation">.</span>SIGHUP<span class="token punctuation">,</span> syscall<span class="token punctuation">.</span>SIGINT<span class="token punctuation">,</span> syscall<span class="token punctuation">.</span>SIGTERM<span class="token punctuation">,</span> syscall<span class="token punctuation">.</span>SIGQUIT<span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    s <span class="token operator">:=</span> sse<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">        sse<span class="token punctuation">.</span><span class="token function">WithAddress</span><span class="token punctuation">(</span><span class="token string">":8800"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">defer</span> s<span class="token punctuation">.</span><span class="token function">Stop</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    s<span class="token punctuation">.</span><span class="token function">HandleServeHTTP</span><span class="token punctuation">(</span><span class="token string">"/events"</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    s<span class="token punctuation">.</span><span class="token function">CreateStream</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">go</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        s<span class="token punctuation">.</span><span class="token function">Start</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    s<span class="token punctuation">.</span><span class="token function">Publish</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>Event<span class="token punctuation">{</span>Data<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token operator">&lt;-</span>interrupt</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="js客户端" tabindex="-1"><a class="header-anchor" href="#js客户端"><span>JS客户端</span></a></h2>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code><span class="line"><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>SSE Client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span>utf-8<span class="token punctuation">'</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">http-equiv</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span>X-UA-Compatible<span class="token punctuation">'</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span>IE=edge<span class="token punctuation">'</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span>viewport<span class="token punctuation">'</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span>width=device-width, initial-scale=1<span class="token punctuation">'</span></span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>messages<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>EventSource <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">'The browser does not support Server-Sent Events'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">const</span> eventSource <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventSource</span><span class="token punctuation">(</span><span class="token string">"http://localhost:8800/events?stream=test"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 在事件源连接未能打开时触发。</span></span>
<span class="line">    eventSource<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'connection state: '</span> <span class="token operator">+</span> eventSource<span class="token punctuation">.</span>readyState <span class="token operator">+</span> <span class="token string">', error: '</span> <span class="token operator">+</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 在与事件源的连接打开时触发。</span></span>
<span class="line">    eventSource<span class="token punctuation">.</span><span class="token function-variable function">onopen</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'connection is established'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 在从事件源接收到数据时触发。</span></span>
<span class="line">    eventSource<span class="token punctuation">.</span><span class="token function-variable function">onmessage</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'id: '</span> <span class="token operator">+</span> event<span class="token punctuation">.</span>lastEventId <span class="token operator">+</span> <span class="token string">', data: '</span> <span class="token operator">+</span> event<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//console.log(JSON.parse(event.data))</span></span>
<span class="line">        <span class="token keyword">const</span> ul <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"messages"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">const</span> li <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">"li"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        li<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>event<span class="token punctuation">.</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        li<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">,</span> <span class="token string">"element4"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        ul<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>li<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="中间件代码" tabindex="-1"><a class="header-anchor" href="#中间件代码"><span>中间件代码</span></a></h2>
<ul>
<li><a href="https://gitee.com/tx7do/kratos-transport" target="_blank" rel="noopener noreferrer">kratos-transport Gitee</a></li>
<li><a href="https://github.com/tx7do/kratos-transport" target="_blank" rel="noopener noreferrer">kratos-transport Github</a></li>
</ul>
<h2 id="参考资料-reference" tabindex="-1"><a class="header-anchor" href="#参考资料-reference"><span>参考资料 (Reference)</span></a></h2>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Server-sent_events" target="_blank" rel="noopener noreferrer">Server-sent events - Wikipedia</a></li>
<li><a href="https://medium.com/yemeksepeti-teknoloji/what-is-server-sent-events-sse-and-how-to-implement-it-904938bffd73" target="_blank" rel="noopener noreferrer">What is Server-Sent Events (SSE) and how to implement it?</a></li>
<li><a href="https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html" target="_blank" rel="noopener noreferrer">Server-Sent Events 教程</a></li>
<li><a href="https://dev.to/rafaelgfirmino/golang-and-sse-3l56" target="_blank" rel="noopener noreferrer">Golang and Server-Sent Events (SSE)</a></li>
<li><a href="https://github.com/r3labs/sse" target="_blank" rel="noopener noreferrer">SSE - Server Sent Events Client/Server Library for Go</a></li>
<li><a href="https://qiita.com/taqm/items/e132a1aa55690a22b655" target="_blank" rel="noopener noreferrer">Go言語でServerSentEvents(SSE)</a></li>
<li><a href="https://dev.to/masanori_msl/go-try-server-sent-events-19fh" target="_blank" rel="noopener noreferrer">[Go] Try Server-Sent Events</a></li>
</ul>
</div></template>


