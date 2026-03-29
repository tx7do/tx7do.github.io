<template><div><h1 id="kratos微服务框架api工程化指南" tabindex="-1"><a class="header-anchor" href="#kratos微服务框架api工程化指南"><span>Kratos微服务框架API工程化指南</span></a></h1>
<p>Kratos的RPC默认使用的是<a href="https://github.com/grpc/grpc" target="_blank" rel="noopener noreferrer">gRPC</a>，与此同时我们还可以通过gRPC的<a href="https://github.com/grpc-ecosystem/grpc-gateway" target="_blank" rel="noopener noreferrer">grpc-gateway</a>功能对RESTfull进行支持。这样，我们就可以同时支持gRPC和REST了。而这一切Kratos都已经封装好，无需知道底层的一切，用就好了。</p>
<p>gRPC是基于<a href="https://github.com/protocolbuffers/protobuf" target="_blank" rel="noopener noreferrer">Protobuf</a>作为接口规范的描述语言（IDL，Interface Description Language）。换句通俗的话来说，gRPC使用Protobuf来设计和管理API。我们只需要编写一套Protobuf文件，就能够支持gRPC协议和RESTfull协议。Protobuf支持很多编程语言，比如：C++、Java、JavaScript、Python、Go、Ruby、Objective-C、C#……这也就意味着，它很适合多语言异构化架构，这样的场景在现实中是很稀松平常的，这使得Protobuf具有很强的实用性。</p>
<p>Protobuf具有序列化后数据量更小、序列化/反序列化速度更快、更简单的特性；而JSON则相反，序列化后数据量较大，序列化和反序列化速度不优的特性，但是前端对JSON是原生支持，对前端极其友好。那么，我们可以在服务之间使用gRPC进行通讯，服务与前端之间可以通过RESTfull进行通讯。</p>
<p>Protobuf和gRPC已经发展了许多年，极其稳定，生态链丰富。它具有强大的工具链可供使用，只要你想得到的，都能够找得到相对应的工具。没有合适的工具也没有关系，它的工具是使用插件方式来实现可扩展性的，因此我们可以容易的开发出自己的工具插件，Kratos就为此开发了自己的一系列的工具插件方便开发使用。</p>
<p>综上，我们可知使用gRPC/protobuf的好处：</p>
<ol>
<li>一套proto，同时支持gRPC协议和RESTfull协议；</li>
<li>支持多编程语言，适合多语言异构化架构；</li>
<li>gRPC协议，数据量小、序列化/反序列化速度更快、更简单，适合服务之间通讯；</li>
<li>RESTfull协议，数据量较大、序列化/反序列化速度较慢、前端原生支持JSON，适合同前端的通讯。</li>
<li>强大的工具链，使用插件的方式实现强大的可扩展性，可方便的扩展。</li>
</ol>
<p>那么，这篇文章将会带来一些什么呢？</p>
<ol>
<li>Protobuf设计API的一丢丢基本知识；</li>
<li>相关工具链的使用方法；</li>
<li>如何实施工程化的方法。</li>
</ol>
<h2 id="工具安装" tabindex="-1"><a class="header-anchor" href="#工具安装"><span>工具安装</span></a></h2>
<p>工欲善其事，必先利其器。</p>
<p>让我们先安装所需要的工具。</p>
<h3 id="安装-protoc" tabindex="-1"><a class="header-anchor" href="#安装-protoc"><span>安装 protoc</span></a></h3>
<p>protoc是一款用C++编写的工具，其可以将proto文件翻译为指定语言的代码。</p>
<p>具体用法可以使用<code v-pre>protoc --help</code>命令查看。</p>
<h4 id="goctl一键安装" tabindex="-1"><a class="header-anchor" href="#goctl一键安装"><span>goctl一键安装</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ goctl <span class="token function">env</span> check <span class="token parameter variable">-i</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">--verbose</span>                                 </span>
<span class="line"><span class="token punctuation">[</span>goctl-env<span class="token punctuation">]</span>: preparing to check <span class="token function">env</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>goctl-env<span class="token punctuation">]</span>: looking up <span class="token string">"protoc"</span></span>
<span class="line"><span class="token punctuation">[</span>goctl-env<span class="token punctuation">]</span>: <span class="token string">"protoc"</span> is not found <span class="token keyword">in</span> <span class="token environment constant">PATH</span></span>
<span class="line"><span class="token punctuation">[</span>goctl-env<span class="token punctuation">]</span>: preparing to <span class="token function">install</span> <span class="token string">"protoc"</span></span>
<span class="line"><span class="token string">"protoc"</span> installed from cache</span>
<span class="line"><span class="token punctuation">[</span>goctl-env<span class="token punctuation">]</span>: <span class="token string">"protoc"</span> is already installed <span class="token keyword">in</span> <span class="token string">"/Users/keson/go/bin/protoc"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="macos安装" tabindex="-1"><a class="header-anchor" href="#macos安装"><span>macOS安装</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">brew <span class="token function">install</span> protobuf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="ubuntu安装" tabindex="-1"><a class="header-anchor" href="#ubuntu安装"><span>Ubuntu安装</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> update<span class="token punctuation">;</span> <span class="token function">sudo</span> <span class="token function">apt</span> upgrade</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libprotobuf-dev protobuf-compiler</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="非windows系统源代码安装" tabindex="-1"><a class="header-anchor" href="#非windows系统源代码安装"><span>非Windows系统源代码安装</span></a></h4>
<ol>
<li>进入 <a href="https://github.com/protocolbuffers/protobuf/releases" target="_blank" rel="noopener noreferrer">protobuf release</a> 下载页面下载；</li>
<li>解压并进入文件夹：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzvf</span> protobuf-cpp-x.x.x.tar.gz</span>
<span class="line"><span class="token builtin class-name">cd</span> protobuf-cpp-x.x.x</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>设置编译目录<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/protobuf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>安装检测<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">make</span> check</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>安装及编译<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>配置环境变量<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vim</span> ~/.bash_profile</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>在文件结尾添加环境变量<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">PROTOBUF</span><span class="token operator">=</span>/usr/local/protobuf</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span><span class="token builtin class-name">:</span><span class="token variable">$PROTOBUF</span>/bin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div>使用source命令，使配置文件生效<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">source</span> ~/.bash_profile</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h4 id="非windows系统源二进制文件安装" tabindex="-1"><a class="header-anchor" href="#非windows系统源二进制文件安装"><span>非Windows系统源二进制文件安装</span></a></h4>
<ol>
<li>进入 <a href="https://github.com/protocolbuffers/protobuf/releases" target="_blank" rel="noopener noreferrer">protobuf release</a> 下载页面，选择适合自己操作系统的压缩包文件下载；</li>
<li>解压文件：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzvf</span> protoc-x.x.x-<span class="token punctuation">{</span>OS<span class="token punctuation">}</span>-x86_64.tar.gz</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>拷贝protoc文件<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">cd</span> protoc-x.x.x-<span class="token punctuation">{</span>OS<span class="token punctuation">}</span>-x86_64/bin</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chmod</span> a+x protoc</span>
<span class="line"><span class="token function">mv</span> protoc /usr/local/bin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>拷贝头文件<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">cd</span> protoc-x.x.x-<span class="token punctuation">{</span>OS<span class="token punctuation">}</span>-x86_64/include</span>
<span class="line"><span class="token function">cp</span> google /usr/local/include</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h4 id="windows安装" tabindex="-1"><a class="header-anchor" href="#windows安装"><span>Windows安装</span></a></h4>
<p>在Windows下可以使用包管理器<a href="https://chocolatey.org/" target="_blank" rel="noopener noreferrer">Choco</a>和<a href="https://scoop.sh/" target="_blank" rel="noopener noreferrer">Scoop</a>来安装。</p>
<ul>
<li>
<p>Choco</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">choco <span class="token function">install</span> protoc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>Scoop</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">scoop bucket <span class="token function">add</span> extras</span>
<span class="line">scoop <span class="token function">install</span> protobuf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="后端工具" tabindex="-1"><a class="header-anchor" href="#后端工具"><span>后端工具</span></a></h3>
<p>后端工具都可以使用<code v-pre>go install</code>进行安装：</p>
<ul>
<li>用于生成struct代码：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> google.golang.org/protobuf/cmd/protoc-gen-go@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>用于生成grpc服务代码：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>用于生成rest服务代码：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>用于生成kratos的错误定义代码：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/go-kratos/kratos/cmd/protoc-gen-go-errors/v2@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>用于生成消息验证器代码：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/envoyproxy/protoc-gen-validate@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>用于生成OpenAPI V2文档：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>用于生成OpenAPI V3文档：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/google/gnostic/cmd/protoc-gen-openapi@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="前端工具" tabindex="-1"><a class="header-anchor" href="#前端工具"><span>前端工具</span></a></h3>
<p>这是protobuf.js提供的一个Protobuf转换为Typescript的工具：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">pnpm</span> i pbts <span class="token parameter variable">-g</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>另，我还找到一个基于pbts开发的在线工具：<a href="https://pb.brandonxiang.top/" target="_blank" rel="noopener noreferrer">https://pb.brandonxiang.top/</a></p>
<h2 id="设计api" tabindex="-1"><a class="header-anchor" href="#设计api"><span>设计API</span></a></h2>
<p>在开始前，首先要说明的是，本文并不是一个Protobuf或者gRPC的教程，这方面，谷歌官方以及其他第三方（gRPC-Gateway）提供的资料已经足够详尽了：</p>
<ul>
<li><a href="https://developers.google.com/protocol-buffers/docs/overview" target="_blank" rel="noopener noreferrer">Protocol Buffers Documentation</a></li>
<li><a href="https://grpc.io/docs/" target="_blank" rel="noopener noreferrer">gRPC Documentation</a></li>
<li><a href="https://grpc-ecosystem.github.io/grpc-gateway/" target="_blank" rel="noopener noreferrer">gRPC-Gateway Documentation</a></li>
</ul>
<h3 id="curd" tabindex="-1"><a class="header-anchor" href="#curd"><span>CURD</span></a></h3>
<p>在现实场景下，业务代码写得最多的恐怕还属CURD（增、删、改、查）了，不说多，80%是肯定有的，可以说，只要搞定了CURD，就搞定了大部分的业务代码的编写。</p>
<p>以下是一个gRPC官方提供的示例，是一个书店的接口，里面包含了基本的Protobuf的语法和用法，以及gRPC服务和REST服务的设计。</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> endpoints<span class="token punctuation">.</span>examples<span class="token punctuation">.</span>bookstore<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">option</span> java_multiple_files <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">option</span> java_outer_classname <span class="token operator">=</span> <span class="token string">"BookstoreProto"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">option</span> java_package <span class="token operator">=</span> <span class="token string">"com.google.endpoints.examples.bookstore"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">option</span> go_package <span class="token operator">=</span> <span class="token string">"endpoints/examples/bookstore;bookstore"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/api/annotations.proto"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/protobuf/empty.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// A simple Bookstore API.</span></span>
<span class="line"><span class="token comment">//</span></span>
<span class="line"><span class="token comment">// The API manages shelves and books resources. Shelves contain books.</span></span>
<span class="line"><span class="token keyword">service</span> <span class="token class-name">Bookstore</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// Returns a list of all shelves in the bookstore.</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">ListShelves</span><span class="token punctuation">(</span><span class="token class-name">google.protobuf.Empty</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">ListShelvesResponse</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Define HTTP mapping.</span></span>
<span class="line">    <span class="token comment">// Client example (Assuming your service is hosted at the given 'DOMAIN_NAME'):</span></span>
<span class="line">    <span class="token comment">//   curl http://DOMAIN_NAME/v1/shelves</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span> get<span class="token punctuation">:</span> <span class="token string">"/v1/shelves"</span> <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token comment">// Creates a new shelf in the bookstore.</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">CreateShelf</span><span class="token punctuation">(</span><span class="token class-name">CreateShelfRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">Shelf</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Client example:</span></span>
<span class="line">    <span class="token comment">//   curl -d '{"theme":"Music"}' http://DOMAIN_NAME/v1/shelves</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      post<span class="token punctuation">:</span> <span class="token string">"/v1/shelves"</span></span>
<span class="line">      body<span class="token punctuation">:</span> <span class="token string">"shelf"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token comment">// Returns a specific bookstore shelf.</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">GetShelf</span><span class="token punctuation">(</span><span class="token class-name">GetShelfRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">Shelf</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Client example - returns the first shelf:</span></span>
<span class="line">    <span class="token comment">//   curl http://DOMAIN_NAME/v1/shelves/1</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span> get<span class="token punctuation">:</span> <span class="token string">"/v1/shelves/{shelf}"</span> <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token comment">// Deletes a shelf, including all books that are stored on the shelf.</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">DeleteShelf</span><span class="token punctuation">(</span><span class="token class-name">DeleteShelfRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">google.protobuf.Empty</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Client example - deletes the second shelf:</span></span>
<span class="line">    <span class="token comment">//   curl -X DELETE http://DOMAIN_NAME/v1/shelves/2</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span> delete<span class="token punctuation">:</span> <span class="token string">"/v1/shelves/{shelf}"</span> <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// A shelf resource.</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">Shelf</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// A unique shelf id.</span></span>
<span class="line">  <span class="token builtin">int64</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token comment">// A theme of the shelf (fiction, poetry, etc).</span></span>
<span class="line">  <span class="token builtin">string</span> theme <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Response to ListShelves call.</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">ListShelvesResponse</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// Shelves in the bookstore.</span></span>
<span class="line">  <span class="token keyword">repeated</span> <span class="token positional-class-name class-name">Shelf</span> shelves <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Request message for CreateShelf method.</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">CreateShelfRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// The shelf resource to create.</span></span>
<span class="line">  <span class="token positional-class-name class-name">Shelf</span> shelf <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Request message for GetShelf method.</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">GetShelfRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// The ID of the shelf resource to retrieve.</span></span>
<span class="line">  <span class="token builtin">int64</span> shelf <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// Request message for DeleteShelf method.</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">DeleteShelfRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// The ID of the shelf to delete.</span></span>
<span class="line">  <span class="token builtin">int64</span> shelf <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要说明的是，REST的接口是由<code v-pre>google.api.http</code>这个<code v-pre>option</code>提供的。上面这一套接口定义，既可以生成gRPC的服务，又可以生成REST的服务，而这是根据protoc调用的插件决定的，这方面内容不是这部分所要阐述的，暂且不表，且看后面部分。</p>
<h3 id="kratos-errors" tabindex="-1"><a class="header-anchor" href="#kratos-errors"><span>Kratos Errors</span></a></h3>
<p>在实际应用当中，存在着一个问题：gRPC状态码 和 REST HTTP状态码 是不一样的。为了解决这个问题，就需要一个映射表，用来互相转换状态码。</p>
<p>以下就是一个映射表的示例：</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 定义包名</span></span>
<span class="line"><span class="token keyword">package</span> api<span class="token punctuation">.</span>kratos<span class="token punctuation">.</span>v1<span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"errors/errors.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 多语言特定包名，用于源代码引用</span></span>
<span class="line"><span class="token keyword">option</span> go_package <span class="token operator">=</span> <span class="token string">"kratos/api/helloworld;helloworld"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">option</span> java_multiple_files <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">option</span> java_package <span class="token operator">=</span> <span class="token string">"api.helloworld"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">enum</span> <span class="token class-name">ErrorReason</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 设置缺省错误码</span></span>
<span class="line">  <span class="token keyword">option</span> <span class="token punctuation">(</span>errors<span class="token punctuation">.</span>default_code<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">500</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 为某个枚举单独设置错误码</span></span>
<span class="line">  USER_NOT_FOUND <span class="token operator">=</span> <span class="token number">0</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>errors<span class="token punctuation">.</span>code<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">404</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  CONTENT_MISSING <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>errors<span class="token punctuation">.</span>code<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">400</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它利用了Protobuf的<code v-pre>enum</code>和<code v-pre>option</code>关键字实现了这样一个状态码的映射。再由protoc插件生成的代码实现映射和互换。</p>
<h3 id="message-validator" tabindex="-1"><a class="header-anchor" href="#message-validator"><span>Message Validator</span></a></h3>
<p>在实际应用当中，需要对接口的参数进行一些校验，比如：用户名的长度只能够大于或者小于某一个长度，身份证、手机号、EMail等特定格式的有效校验。</p>
<p>其实，都不过是一些字符串、数字类型和布尔类型校验的简单规则。如果手写校验代码，都是一些机械无比的重复代码，而且要作修改起来也很痛苦。</p>
<p>那么，有什么办法可以解决这个问题吗？必须有：规则写在Protobuf里面，利用<a href="https://github.com/bufbuild/protoc-gen-validate" target="_blank" rel="noopener noreferrer">proto-gen-validate</a>插件生成代码，使用 <a href="https://github.com/go-kratos/kratos/tree/main/middleware/validate" target="_blank" rel="noopener noreferrer">Kratos Validate 中间件</a> 作支持。</p>
<p>以下是<code v-pre>proto-gen-validate</code>插件的示例接口：</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> examplepb<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"validate/validate.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">uint64</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>validate<span class="token punctuation">.</span>rules<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">uint64</span><span class="token punctuation">.</span>gt <span class="token operator">=</span> <span class="token number">999</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token builtin">string</span> email <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>validate<span class="token punctuation">.</span>rules<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">string</span><span class="token punctuation">.</span>email <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token builtin">string</span> name <span class="token operator">=</span> <span class="token number">3</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>validate<span class="token punctuation">.</span>rules<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">string</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    pattern<span class="token punctuation">:</span>   <span class="token string">"^[^[0-9]A-Za-z]+( [^[0-9]A-Za-z]+)*$"</span><span class="token punctuation">,</span></span>
<span class="line">    max_bytes<span class="token punctuation">:</span> <span class="token number">256</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token positional-class-name class-name">Location</span> home <span class="token operator">=</span> <span class="token number">4</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>validate<span class="token punctuation">.</span>rules<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">message</span><span class="token punctuation">.</span><span class="token keyword">required</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">message</span> <span class="token class-name">Location</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin">double</span> lat <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>validate<span class="token punctuation">.</span>rules<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">double</span> <span class="token operator">=</span> <span class="token punctuation">{</span>gte<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token number">90</span><span class="token punctuation">,</span>  lte<span class="token punctuation">:</span> <span class="token number">90</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">double</span> lng <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>validate<span class="token punctuation">.</span>rules<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">double</span> <span class="token operator">=</span> <span class="token punctuation">{</span>gte<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token number">180</span><span class="token punctuation">,</span> lte<span class="token punctuation">:</span> <span class="token number">180</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只需要利用<code v-pre>validate.rules</code>option就可以定义规则了，简单明了，又方便。</p>
<h3 id="openapi" tabindex="-1"><a class="header-anchor" href="#openapi"><span>OpenAPI</span></a></h3>
<p>OpenAPI是一个用于描述REST API的描述格式，包含端点、参数、输入输出格式、说明、认证等，本质上它是一个JSON或者YAML格式文档，而文件内的Schema则是有OpenAPI所定义的。</p>
<h4 id="openapi-json范例" tabindex="-1"><a class="header-anchor" href="#openapi-json范例"><span>OpenAPI JSON范例</span></a></h4>
<p>以下是一个OpenAPI v3的JSON文件范例：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"openapi"</span><span class="token operator">:</span> <span class="token string">"3.0"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"info"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"OpenAPI Petstore"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"license"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"MIT"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"servers"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://petstore.openapis.org/v1"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Development server"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"paths"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"/pets"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"get"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"summary"</span><span class="token operator">:</span> <span class="token string">"List all pets"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"operationId"</span><span class="token operator">:</span> <span class="token string">"listPets"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"tags"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token string">"pets"</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"parameters"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"limit"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"in"</span><span class="token operator">:</span> <span class="token string">"query"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"How many items to return at one time (max 100)"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"required"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"integer"</span><span class="token punctuation">,</span></span>
<span class="line">              <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"int32"</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"responses"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">"200"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"An paged array of pets"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"headers"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"x-next"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"A link to the next page of responses"</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"content"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"application/json"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token property">"$ref"</span><span class="token operator">:</span> <span class="token string">"#/components/schemas/Pets"</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"unexpected error"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"content"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"application/json"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token property">"$ref"</span><span class="token operator">:</span> <span class="token string">"#/components/schemas/Error"</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"post"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"summary"</span><span class="token operator">:</span> <span class="token string">"Create a pet"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"operationId"</span><span class="token operator">:</span> <span class="token string">"createPets"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"tags"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token string">"pets"</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"responses"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">"201"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Null response"</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"unexpected error"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"content"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"application/json"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token property">"$ref"</span><span class="token operator">:</span> <span class="token string">"#/components/schemas/Error"</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"/pets/{petId}"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"get"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"summary"</span><span class="token operator">:</span> <span class="token string">"Info for a specific pet"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"operationId"</span><span class="token operator">:</span> <span class="token string">"showPetById"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"tags"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token string">"pets"</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"parameters"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"petId"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"in"</span><span class="token operator">:</span> <span class="token string">"path"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"required"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"The id of the pet to retrieve"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"responses"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">"200"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Expected response to a valid request"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"content"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"application/json"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token property">"$ref"</span><span class="token operator">:</span> <span class="token string">"#/components/schemas/Pets"</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"unexpected error"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"content"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token property">"application/json"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token property">"schema"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token property">"$ref"</span><span class="token operator">:</span> <span class="token string">"#/components/schemas/Error"</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"components"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"schemas"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"Pet"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"required"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token string">"id"</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token string">"name"</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">"id"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"integer"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"int64"</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token property">"name"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"Pets"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"array"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"items"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">"$ref"</span><span class="token operator">:</span> <span class="token string">"#/components/schemas/Pet"</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"Error"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"required"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token string">"code"</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token string">"message"</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token property">"code"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"integer"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"int32"</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token property">"message"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="openapi-yaml范例" tabindex="-1"><a class="header-anchor" href="#openapi-yaml范例"><span>OpenAPI YAML范例</span></a></h4>
<p>以及OpenAPI v3 的 YAML文件范例：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">openapi</span><span class="token punctuation">:</span> <span class="token string">"3.0"</span></span>
<span class="line"><span class="token key atrule">info</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">version</span><span class="token punctuation">:</span> 1.0.0</span>
<span class="line">  <span class="token key atrule">title</span><span class="token punctuation">:</span> OpenAPI Petstore</span>
<span class="line">  <span class="token key atrule">license</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> MIT</span>
<span class="line"><span class="token key atrule">servers</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//petstore.openapis.org/v1</span>
<span class="line">  <span class="token key atrule">description</span><span class="token punctuation">:</span> Development server</span>
<span class="line"><span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">/pets</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">get</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">summary</span><span class="token punctuation">:</span> List all pets</span>
<span class="line">      <span class="token key atrule">operationId</span><span class="token punctuation">:</span> listPets</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> pets</span>
<span class="line">      <span class="token key atrule">parameters</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> limit</span>
<span class="line">        <span class="token key atrule">in</span><span class="token punctuation">:</span> query</span>
<span class="line">        <span class="token key atrule">description</span><span class="token punctuation">:</span> How many items to return at one time (max 100)</span>
<span class="line">        <span class="token key atrule">required</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line">        <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> integer</span>
<span class="line">          <span class="token key atrule">format</span><span class="token punctuation">:</span> int32</span>
<span class="line">      <span class="token key atrule">responses</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">"200"</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> An paged array of pets</span>
<span class="line">          <span class="token key atrule">headers</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">x-next</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">type</span><span class="token punctuation">:</span> string</span>
<span class="line">              <span class="token key atrule">description</span><span class="token punctuation">:</span> A link to the next page of responses</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Pets'</span></span>
<span class="line">        <span class="token key atrule">default</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> unexpected error</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Error'</span></span>
<span class="line">    <span class="token key atrule">post</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">summary</span><span class="token punctuation">:</span> Create a pet</span>
<span class="line">      <span class="token key atrule">operationId</span><span class="token punctuation">:</span> createPets</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> pets</span>
<span class="line">      <span class="token key atrule">responses</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">"201"</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> Null response</span>
<span class="line">        <span class="token key atrule">default</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> unexpected error</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Error'</span></span>
<span class="line">  /pets/<span class="token punctuation">{</span>petId<span class="token punctuation">}</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">get</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">summary</span><span class="token punctuation">:</span> Info for a specific pet</span>
<span class="line">      <span class="token key atrule">operationId</span><span class="token punctuation">:</span> showPetById</span>
<span class="line">      <span class="token key atrule">tags</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> pets</span>
<span class="line">      <span class="token key atrule">parameters</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> petId</span>
<span class="line">        <span class="token key atrule">in</span><span class="token punctuation">:</span> path</span>
<span class="line">        <span class="token key atrule">required</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">        <span class="token key atrule">description</span><span class="token punctuation">:</span> The id of the pet to retrieve</span>
<span class="line">        <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> string</span>
<span class="line">      <span class="token key atrule">responses</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">"200"</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> Expected response to a valid request</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Pets'</span></span>
<span class="line">        <span class="token key atrule">default</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> unexpected error</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Error'</span></span>
<span class="line"><span class="token key atrule">components</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">schemas</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">Pet</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">required</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> id</span>
<span class="line">      <span class="token punctuation">-</span> name</span>
<span class="line">      <span class="token key atrule">properties</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">id</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> integer</span>
<span class="line">          <span class="token key atrule">format</span><span class="token punctuation">:</span> int64</span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> string</span>
<span class="line">        <span class="token key atrule">tag</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> string</span>
<span class="line">    <span class="token key atrule">Pets</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">type</span><span class="token punctuation">:</span> array</span>
<span class="line">      <span class="token key atrule">items</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Pet'</span></span>
<span class="line">    <span class="token key atrule">Error</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">required</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> code</span>
<span class="line">      <span class="token punctuation">-</span> message</span>
<span class="line">      <span class="token key atrule">properties</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">code</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> integer</span>
<span class="line">          <span class="token key atrule">format</span><span class="token punctuation">:</span> int32</span>
<span class="line">        <span class="token key atrule">message</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> string</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="openapi工具" tabindex="-1"><a class="header-anchor" href="#openapi工具"><span>OpenAPI工具</span></a></h4>
<p>以上文本当中的Schema，有些可以望文生义，也有一些根本看不出来意义。可是，真要让人去阅读，只会有一个感受：头大。它主要还是给程序读取的，展现在UI之上，才能够真正的应用起来。</p>
<p>现在，市面上有非常非常多的工具可以读取OpenAPI JSON / YAML文档：</p>
<ul>
<li><a href="https://swagger.io/tools/swagger-ui/" target="_blank" rel="noopener noreferrer">Swagger UI</a> / <a href="https://swagger.io/tools/swaggerhub/" target="_blank" rel="noopener noreferrer">SwaggerHub</a> / <a href="https://editor.swagger.io" target="_blank" rel="noopener noreferrer">Swagger Editor</a></li>
<li><a href="https://redoc.ly/redoc" target="_blank" rel="noopener noreferrer">Redoc</a> / <a href="https://redoc.ly/reference-docs" target="_blank" rel="noopener noreferrer">Redocly</a></li>
<li><a href="https://stoplight.io/open-source/elements/" target="_blank" rel="noopener noreferrer">Stoplight Elements</a> / <a href="https://stoplight.io/api-documentation/" target="_blank" rel="noopener noreferrer">Stoplight</a></li>
<li><a href="https://readme.com/documentation" target="_blank" rel="noopener noreferrer">ReadMe Documentation</a></li>
<li><a href="https://www.eolink.com" target="_blank" rel="noopener noreferrer">Eolink</a></li>
<li><a href="https://github.com/YMFE/yapi" target="_blank" rel="noopener noreferrer">YApi</a></li>
<li><a href="https://www.postman.com" target="_blank" rel="noopener noreferrer">Postman</a></li>
<li><a href="https://www.apifox.cn" target="_blank" rel="noopener noreferrer">Apifox</a></li>
</ul>
<p>这些工具当中，最常见的是本家的Swagger UI（OpenAPI在成为开放标准之前是Swagger产品线当中的一部分），它经常被内嵌到Web框架里面。</p>
<h4 id="protobuf生成openapi工具" tabindex="-1"><a class="header-anchor" href="#protobuf生成openapi工具"><span>Protobuf生成OpenAPI工具</span></a></h4>
<p>现在OpenAPI有两个版本：v2和v3。</p>
<p>主流的protoc插件也刚好对应有两个：</p>
<ol>
<li>OpenAPI v2使用grpc-gateway出的<a href="github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2">protoc-gen-openapiv2</a>；</li>
<li>OpenAPI v3使用谷歌出品的gnostic下的<a href="github.com/google/gnostic/cmd/protoc-gen-openapi">protoc-gen-openapi</a>。</li>
</ol>
<p>正常来说，只要是使用了<code v-pre>google.api.http</code>这个<code v-pre>option</code>定义的API，使用这两个插件就能够生成OpenAPI文档。</p>
<p>但是，实际应用中，我们还希望能够提供更多更丰富的一些信息，比如：描述信息、版本号、版权信息、认证信息……显然，光凭着<code v-pre>google.api.http</code>的定义是不够的。这两个插件提供了各自的<code v-pre>option</code>，可以定义这些信息。</p>
<h4 id="protobuf中如何定义openapi-v2注解" tabindex="-1"><a class="header-anchor" href="#protobuf中如何定义openapi-v2注解"><span>Protobuf中如何定义OpenAPI V2注解</span></a></h4>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> grpc<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>examples<span class="token punctuation">.</span>internal<span class="token punctuation">.</span>proto<span class="token punctuation">.</span>examplepb<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"protoc-gen-openapiv2/options/annotations.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">option</span> go_package <span class="token operator">=</span> <span class="token string">"github.com/grpc-ecosystem/grpc-gateway/v2/examples/internal/proto/examplepb"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">option</span> <span class="token punctuation">(</span>grpc<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>protoc_gen_openapiv2<span class="token punctuation">.</span>options<span class="token punctuation">.</span>openapiv2_swagger<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  info<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    title<span class="token punctuation">:</span> <span class="token string">"A Bit of Everything"</span><span class="token punctuation">;</span></span>
<span class="line">    version<span class="token punctuation">:</span> <span class="token string">"1.0"</span><span class="token punctuation">;</span></span>
<span class="line">    contact<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      name<span class="token punctuation">:</span> <span class="token string">"gRPC-Gateway project"</span><span class="token punctuation">;</span></span>
<span class="line">      url<span class="token punctuation">:</span> <span class="token string">"https://github.com/grpc-ecosystem/grpc-gateway"</span><span class="token punctuation">;</span></span>
<span class="line">      email<span class="token punctuation">:</span> <span class="token string">"none@example.com"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    license<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      name<span class="token punctuation">:</span> <span class="token string">"BSD 3-Clause License"</span><span class="token punctuation">;</span></span>
<span class="line">      url<span class="token punctuation">:</span> <span class="token string">"https://github.com/grpc-ecosystem/grpc-gateway/blob/master/LICENSE.txt"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">extensions</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"x-something-something"</span><span class="token punctuation">;</span></span>
<span class="line">      value <span class="token punctuation">{</span></span>
<span class="line">        string_value<span class="token punctuation">:</span> <span class="token string">"yadda"</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token comment">// Overwriting host entry breaks tests, so this is not done here.</span></span>
<span class="line">  external_docs<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    url<span class="token punctuation">:</span> <span class="token string">"https://github.com/grpc-ecosystem/grpc-gateway"</span><span class="token punctuation">;</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"More about gRPC-Gateway"</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  schemes<span class="token punctuation">:</span> HTTP<span class="token punctuation">;</span></span>
<span class="line">  schemes<span class="token punctuation">:</span> HTTPS<span class="token punctuation">;</span></span>
<span class="line">  schemes<span class="token punctuation">:</span> WSS<span class="token punctuation">;</span></span>
<span class="line">  consumes<span class="token punctuation">:</span> <span class="token string">"application/json"</span><span class="token punctuation">;</span></span>
<span class="line">  consumes<span class="token punctuation">:</span> <span class="token string">"application/x-foo-mime"</span><span class="token punctuation">;</span></span>
<span class="line">  produces<span class="token punctuation">:</span> <span class="token string">"application/json"</span><span class="token punctuation">;</span></span>
<span class="line">  produces<span class="token punctuation">:</span> <span class="token string">"application/x-foo-mime"</span><span class="token punctuation">;</span></span>
<span class="line">  security_definitions<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    security<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"BasicAuth"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        type<span class="token punctuation">:</span> TYPE_BASIC<span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    security<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"ApiKeyAuth"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        type<span class="token punctuation">:</span> TYPE_API_KEY<span class="token punctuation">;</span></span>
<span class="line">        in<span class="token punctuation">:</span> IN_HEADER<span class="token punctuation">;</span></span>
<span class="line">        name<span class="token punctuation">:</span> <span class="token string">"X-API-Key"</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">extensions</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          key<span class="token punctuation">:</span> <span class="token string">"x-amazon-apigateway-authtype"</span><span class="token punctuation">;</span></span>
<span class="line">          value <span class="token punctuation">{</span></span>
<span class="line">            string_value<span class="token punctuation">:</span> <span class="token string">"oauth2"</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">extensions</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          key<span class="token punctuation">:</span> <span class="token string">"x-amazon-apigateway-authorizer"</span><span class="token punctuation">;</span></span>
<span class="line">          value <span class="token punctuation">{</span></span>
<span class="line">            struct_value <span class="token punctuation">{</span></span>
<span class="line">              fields <span class="token punctuation">{</span></span>
<span class="line">                key<span class="token punctuation">:</span> <span class="token string">"type"</span><span class="token punctuation">;</span></span>
<span class="line">                value <span class="token punctuation">{</span></span>
<span class="line">                  string_value<span class="token punctuation">:</span> <span class="token string">"token"</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">              fields <span class="token punctuation">{</span></span>
<span class="line">                key<span class="token punctuation">:</span> <span class="token string">"authorizerResultTtlInSeconds"</span><span class="token punctuation">;</span></span>
<span class="line">                value <span class="token punctuation">{</span></span>
<span class="line">                  number_value<span class="token punctuation">:</span> <span class="token number">60</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    security<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"OAuth2"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        type<span class="token punctuation">:</span> TYPE_OAUTH2<span class="token punctuation">;</span></span>
<span class="line">        flow<span class="token punctuation">:</span> FLOW_ACCESS_CODE<span class="token punctuation">;</span></span>
<span class="line">        authorization_url<span class="token punctuation">:</span> <span class="token string">"https://example.com/oauth/authorize"</span><span class="token punctuation">;</span></span>
<span class="line">        token_url<span class="token punctuation">:</span> <span class="token string">"https://example.com/oauth/token"</span><span class="token punctuation">;</span></span>
<span class="line">        scopes<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          scope<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">            key<span class="token punctuation">:</span> <span class="token string">"read"</span><span class="token punctuation">;</span></span>
<span class="line">            value<span class="token punctuation">:</span> <span class="token string">"Grants read access"</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          scope<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">            key<span class="token punctuation">:</span> <span class="token string">"write"</span><span class="token punctuation">;</span></span>
<span class="line">            value<span class="token punctuation">:</span> <span class="token string">"Grants write access"</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          scope<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">            key<span class="token punctuation">:</span> <span class="token string">"admin"</span><span class="token punctuation">;</span></span>
<span class="line">            value<span class="token punctuation">:</span> <span class="token string">"Grants read and write access to administrative information"</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  security<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    security_requirement<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"BasicAuth"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    security_requirement<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"ApiKeyAuth"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  security<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    security_requirement<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"OAuth2"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        scope<span class="token punctuation">:</span> <span class="token string">"read"</span><span class="token punctuation">;</span></span>
<span class="line">        scope<span class="token punctuation">:</span> <span class="token string">"write"</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    security_requirement<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"ApiKeyAuth"</span><span class="token punctuation">;</span></span>
<span class="line">      value<span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  responses<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">"403"</span><span class="token punctuation">;</span></span>
<span class="line">    value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"Returned when the user does not have permission to access the resource."</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  responses<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">"404"</span><span class="token punctuation">;</span></span>
<span class="line">    value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"Returned when the resource does not exist."</span><span class="token punctuation">;</span></span>
<span class="line">      schema<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        json_schema<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          type<span class="token punctuation">:</span> STRING<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  responses<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">"418"</span><span class="token punctuation">;</span></span>
<span class="line">    value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"I'm a teapot."</span><span class="token punctuation">;</span></span>
<span class="line">      schema<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        json_schema<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          ref<span class="token punctuation">:</span> <span class="token string">".grpc.gateway.examples.internal.proto.examplepb.NumericEnum"</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  responses<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">"500"</span><span class="token punctuation">;</span></span>
<span class="line">    value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"Server error"</span><span class="token punctuation">;</span></span>
<span class="line">      headers<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        key<span class="token punctuation">:</span> <span class="token string">"X-Correlation-Id"</span></span>
<span class="line">        value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          description<span class="token punctuation">:</span> <span class="token string">"Unique event identifier for server requests"</span></span>
<span class="line">          type<span class="token punctuation">:</span> <span class="token string">"string"</span></span>
<span class="line">          format<span class="token punctuation">:</span> <span class="token string">"uuid"</span></span>
<span class="line">          default<span class="token punctuation">:</span> <span class="token string">"\"2438ac3c-37eb-4902-adef-ed16b4431030\""</span></span>
<span class="line">          pattern<span class="token punctuation">:</span> <span class="token string">"^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$"</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">      schema<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        json_schema<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          ref<span class="token punctuation">:</span> <span class="token string">".grpc.gateway.examples.internal.proto.examplepb.ErrorResponse"</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  tags<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    name<span class="token punctuation">:</span> <span class="token string">"echo rpc"</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"Echo Rpc description"</span></span>
<span class="line">    <span class="token keyword">extensions</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      key<span class="token punctuation">:</span> <span class="token string">"x-traitTag"</span><span class="token punctuation">;</span></span>
<span class="line">      value <span class="token punctuation">{</span></span>
<span class="line">        bool_value<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">extensions</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">"x-grpc-gateway-foo"</span><span class="token punctuation">;</span></span>
<span class="line">    value <span class="token punctuation">{</span></span>
<span class="line">      string_value<span class="token punctuation">:</span> <span class="token string">"bar"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">extensions</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">"x-grpc-gateway-baz-list"</span><span class="token punctuation">;</span></span>
<span class="line">    value <span class="token punctuation">{</span></span>
<span class="line">      list_value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">        values<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          string_value<span class="token punctuation">:</span> <span class="token string">"one"</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        values<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">          bool_value<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">ErrorResponse</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">string</span> correlationId <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>grpc<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>protoc_gen_openapiv2<span class="token punctuation">.</span>options<span class="token punctuation">.</span>openapiv2_field<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    pattern<span class="token punctuation">:</span> <span class="token string">"^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$"</span><span class="token punctuation">,</span></span>
<span class="line">    title<span class="token punctuation">:</span> <span class="token string">"x-correlation-id"</span><span class="token punctuation">,</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"Unique event identifier for server requests"</span><span class="token punctuation">,</span></span>
<span class="line">    format<span class="token punctuation">:</span> <span class="token string">"uuid"</span><span class="token punctuation">,</span></span>
<span class="line">    example<span class="token punctuation">:</span> <span class="token string">"\"2438ac3c-37eb-4902-adef-ed16b4431030\""</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token positional-class-name class-name">ErrorObject</span> error <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">ErrorObject</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">int32</span> code <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>grpc<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>protoc_gen_openapiv2<span class="token punctuation">.</span>options<span class="token punctuation">.</span>openapiv2_field<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    pattern<span class="token punctuation">:</span> <span class="token string">"^[0-9]$"</span><span class="token punctuation">,</span></span>
<span class="line">    title<span class="token punctuation">:</span> <span class="token string">"code"</span><span class="token punctuation">,</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"Response code"</span><span class="token punctuation">,</span></span>
<span class="line">    format<span class="token punctuation">:</span> <span class="token string">"integer"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> message <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>grpc<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>protoc_gen_openapiv2<span class="token punctuation">.</span>options<span class="token punctuation">.</span>openapiv2_field<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    pattern<span class="token punctuation">:</span> <span class="token string">"^[a-zA-Z0-9]{1, 32}$"</span><span class="token punctuation">,</span></span>
<span class="line">    title<span class="token punctuation">:</span> <span class="token string">"message"</span><span class="token punctuation">,</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"Response message"</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ABitOfEverything service is used to validate that APIs with complicated</span></span>
<span class="line"><span class="token comment">// proto messages and URL templates are still processed correctly.</span></span>
<span class="line"><span class="token keyword">service</span> <span class="token class-name">ABitOfEverythingService</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">option</span> <span class="token punctuation">(</span>grpc<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>protoc_gen_openapiv2<span class="token punctuation">.</span>options<span class="token punctuation">.</span>openapiv2_tag<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"ABitOfEverythingService description -- which should not be used in place of the documentation comment!"</span></span>
<span class="line">    external_docs<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      url<span class="token punctuation">:</span> <span class="token string">"https://github.com/grpc-ecosystem/grpc-gateway"</span><span class="token punctuation">;</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"Find out more about EchoService"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// Create a new ABitOfEverything</span></span>
<span class="line">  <span class="token comment">//</span></span>
<span class="line">  <span class="token comment">// This API creates a new ABitOfEverything</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">Create</span><span class="token punctuation">(</span><span class="token class-name">ABitOfEverything</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">ABitOfEverything</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      post<span class="token punctuation">:</span> <span class="token string">"/v1/example/a_bit_of_everything/{float_value}/{double_value}/{int64_value}/separator/{uint64_value}/{int32_value}/{fixed64_value}/{fixed32_value}/{bool_value}/{string_value=strprefix/*}/{uint32_value}/{sfixed32_value}/{sfixed64_value}/{sint32_value}/{sint64_value}/{nonConventionalNameValue}/{enum_value}/{path_enum_value}/{nested_path_enum_value}/{enum_value_annotation}"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">CreateBody</span><span class="token punctuation">(</span><span class="token class-name">ABitOfEverything</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">ABitOfEverything</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      post<span class="token punctuation">:</span> <span class="token string">"/v1/example/a_bit_of_everything"</span></span>
<span class="line">      body<span class="token punctuation">:</span> <span class="token string">"*"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="protobuf中如何定义openapi-v3注解" tabindex="-1"><a class="header-anchor" href="#protobuf中如何定义openapi-v3注解"><span>Protobuf中如何定义OpenAPI V3注解</span></a></h4>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> tests<span class="token punctuation">.</span>openapiv3annotations<span class="token punctuation">.</span><span class="token keyword">message</span><span class="token punctuation">.</span>v1<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/api/annotations.proto"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"openapiv3/annotations.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">option</span> go_package <span class="token operator">=</span> <span class="token string">"github.com/google/gnostic/apps/protoc-gen-openapi/examples/tests/openapiv3annotations/message/v1;message"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">option</span> <span class="token punctuation">(</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>document<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  info<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    title<span class="token punctuation">:</span> <span class="token string">"Title from annotation"</span><span class="token punctuation">;</span></span>
<span class="line">    version<span class="token punctuation">:</span> <span class="token string">"Version from annotation"</span><span class="token punctuation">;</span></span>
<span class="line">    description<span class="token punctuation">:</span> <span class="token string">"Description from annotation"</span><span class="token punctuation">;</span></span>
<span class="line">    contact<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      name<span class="token punctuation">:</span> <span class="token string">"Contact Name"</span><span class="token punctuation">;</span></span>
<span class="line">      url<span class="token punctuation">:</span> <span class="token string">"https://github.com/google/gnostic"</span><span class="token punctuation">;</span></span>
<span class="line">      email<span class="token punctuation">:</span> <span class="token string">"gnostic@google.com"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    license<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      name<span class="token punctuation">:</span> <span class="token string">"Apache License"</span><span class="token punctuation">;</span></span>
<span class="line">      url<span class="token punctuation">:</span> <span class="token string">"https://github.com/google/gnostic/blob/master/LICENSE"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  components<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">    security_schemes<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">      additional_properties<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">          name<span class="token punctuation">:</span> <span class="token string">"BasicAuth"</span><span class="token punctuation">;</span></span>
<span class="line">          value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">            security_scheme<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">              type<span class="token punctuation">:</span> <span class="token string">"http"</span><span class="token punctuation">;</span></span>
<span class="line">              scheme<span class="token punctuation">:</span> <span class="token string">"basic"</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">service</span> <span class="token class-name">Messaging1</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">UpdateMessage</span><span class="token punctuation">(</span><span class="token class-name">Message</span><span class="token punctuation">)</span> <span class="token keyword">returns</span><span class="token punctuation">(</span><span class="token class-name">Message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span><span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">        patch<span class="token punctuation">:</span> <span class="token string">"/v1/messages/{message_id}"</span></span>
<span class="line">        body<span class="token punctuation">:</span> <span class="token string">"*"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">option</span><span class="token punctuation">(</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>operation<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">        security<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token punctuation">{</span></span>
<span class="line">            additional_properties<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">              <span class="token punctuation">{</span></span>
<span class="line">                name<span class="token punctuation">:</span> <span class="token string">"BasicAuth"</span><span class="token punctuation">;</span></span>
<span class="line">                value<span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">                  value<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">]</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">service</span> <span class="token class-name">Messaging2</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">UpdateMessage</span><span class="token punctuation">(</span><span class="token class-name">Message</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">Message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">Message</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">option</span> <span class="token punctuation">(</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>schema<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    title<span class="token punctuation">:</span> <span class="token string">"This is an overridden message schema title"</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token builtin">int64</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> label <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">(</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      title<span class="token punctuation">:</span> <span class="token string">"this is an overriden field schema title"</span><span class="token punctuation">;</span></span>
<span class="line">      max_length<span class="token punctuation">:</span> <span class="token number">255</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="代码生成" tabindex="-1"><a class="header-anchor" href="#代码生成"><span>代码生成</span></a></h2>
<p>Protobuf生成目标语言的代码使用的工具是protoc，它是基于插件机制开发的，实际生成代码全靠插件。</p>
<h3 id="插件生成文件一览表" tabindex="-1"><a class="header-anchor" href="#插件生成文件一览表"><span>插件生成文件一览表</span></a></h3>
<table>
<thead>
<tr>
<th>插件名</th>
<th>生成文件名</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="google.golang.org/protobuf/cmd/protoc-gen-go">protoc-gen-go</a></td>
<td>XXXXX.pb.go</td>
</tr>
<tr>
<td><a href="google.golang.org/grpc/cmd/protoc-gen-go-grpc">protoc-gen-go-grpc</a></td>
<td>XXXXXX_grpc.pb.go</td>
</tr>
<tr>
<td><a href="github.com/go-kratos/kratos/cmd/protoc-gen-go-http">protoc-gen-go-http</a></td>
<td>XXXXXX_http.pb.go</td>
</tr>
<tr>
<td><a href="github.com/go-kratos/kratos/cmd/protoc-gen-go-errors">protoc-gen-go-errors</a></td>
<td>XXXXXX_errors.pb.go</td>
</tr>
<tr>
<td><a href="github.com/bufbuild/protoc-gen-validate">protoc-gen-validate</a></td>
<td>XXXXXX.pb.validate.go</td>
</tr>
<tr>
<td><a href="github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2">protoc-gen-openapiv2</a></td>
<td>XXXXXX.swagger.json</td>
</tr>
<tr>
<td><a href="github.com/google/gnostic/cmd/protoc-gen-openapi">protoc-gen-openapi</a></td>
<td>openapi.yaml</td>
</tr>
</tbody>
</table>
<p>这里要提醒一下，细心的你一定会发现，生成OpenAPI文档的参数里面各有一个<code v-pre>--openapiv2_opt json_names_for_fields=true</code>和<code v-pre>--openapi_out=naming=json</code>，这两个参数的作用是一样的，那么它们是做什么用的呢？我们先来看下面这个消息定义：</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token comment">// NonStandardMessageWithJSONNames maps odd field names to odd JSON names for maximum confusion.</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">NonStandardMessageWithJSONNames</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// Id represents the message identifier.</span></span>
<span class="line">  <span class="token builtin">string</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"ID"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> Num <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"Num"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> line_num <span class="token operator">=</span> <span class="token number">3</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"LineNum"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> langIdent <span class="token operator">=</span> <span class="token number">4</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"langIdent"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> STATUS <span class="token operator">=</span> <span class="token number">5</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"status"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> en_GB <span class="token operator">=</span> <span class="token number">6</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"En_GB"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> no <span class="token operator">=</span> <span class="token number">7</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"yes"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">message</span> <span class="token class-name">Thing</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">message</span> <span class="token class-name">SubThing</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token builtin">string</span> sub_value <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"sub_Value"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token positional-class-name class-name">SubThing</span> subThing <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"SubThing"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token positional-class-name class-name">Thing</span> thing <span class="token operator">=</span> <span class="token number">8</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"Thingy"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你一定发现了<code v-pre>json_name</code>这个参数，没错，就是为了它，proto那两个参数就是它的开关。如果，字段定义了<code v-pre>json_name</code>参数之后，REST的JSON字段名便会采用<code v-pre>json_name</code>所定义的字段名。这是一个非常有用的特性，因为前后端的命名规则不一致是常态，golang用的是驼峰命名法，而前端用蛇形命名法的是很多，这就可以用上了。</p>
<h3 id="生成代码的命令" tabindex="-1"><a class="header-anchor" href="#生成代码的命令"><span>生成代码的命令</span></a></h3>
<h4 id="生成-基础类型的go代码" tabindex="-1"><a class="header-anchor" href="#生成-基础类型的go代码"><span>生成 基础类型的GO代码</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--go_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>以上命令主要是struct和enum等基础类型</p>
<h4 id="生成-grpc-服务的go代码" tabindex="-1"><a class="header-anchor" href="#生成-grpc-服务的go代码"><span>生成 grpc 服务的GO代码</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-grpc_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="生成-rest-服务的go代码" tabindex="-1"><a class="header-anchor" href="#生成-rest-服务的go代码"><span>生成 rest 服务的GO代码</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-http_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="生成-grpc状态码映射的go代码" tabindex="-1"><a class="header-anchor" href="#生成-grpc状态码映射的go代码"><span>生成 gRPC状态码映射的GO代码</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-errors_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="生成-参数校验的go代码" tabindex="-1"><a class="header-anchor" href="#生成-参数校验的go代码"><span>生成 参数校验的GO代码</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--validate_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative,lang<span class="token operator">=</span>go:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="生成-openapi-v2-json文档" tabindex="-1"><a class="header-anchor" href="#生成-openapi-v2-json文档"><span>生成 OpenAPI v2 json文档</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapiv2_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ <span class="token parameter variable">--openapiv2_opt</span> <span class="token assign-left variable">logtostderr</span><span class="token operator">=</span>true <span class="token parameter variable">--openapiv2_opt</span> <span class="token assign-left variable">json_names_for_fields</span><span class="token operator">=</span>true ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="生成-openapi-v3-yaml文档" tabindex="-1"><a class="header-anchor" href="#生成-openapi-v3-yaml文档"><span>生成 OpenAPI v3 yaml文档</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapi_out</span><span class="token operator">=</span>naming<span class="token operator">=</span>json<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="实施工程化" tabindex="-1"><a class="header-anchor" href="#实施工程化"><span>实施工程化</span></a></h2>
<p>好，我们现在已经知道如何去生成API的代码和文档了。但是，这还远远不够。因为我们不可能每次都去手打命令生成代码，这是不科学，不人道的，不现实的。</p>
<p>我们需要工程化，使之可管理。CI/CD、自动化也能够实现。</p>
<p>首先，我们把可用的方法列举出来，然后再一个个的讲解各个方法：</p>
<ol>
<li>BAT批处理脚本（Windows）或者Shell脚本（非Windows）；</li>
<li>Makefile；</li>
<li>go:generate注解；</li>
<li>buf.build。</li>
</ol>
<p><strong>结论在前：推荐使用<a href="https://buf.build/" target="_blank" rel="noopener noreferrer">buf.build</a></strong></p>
<h3 id="_1-bat批处理脚本-windows-或者shell脚本-非windows" tabindex="-1"><a class="header-anchor" href="#_1-bat批处理脚本-windows-或者shell脚本-非windows"><span>1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）</span></a></h3>
<h4 id="bat批处理脚本" tabindex="-1"><a class="header-anchor" href="#bat批处理脚本"><span>BAT批处理脚本</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">:: generate go struct code</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--go_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line">:: generate grpc <span class="token function">service</span> code</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-grpc_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line">:: generate rest <span class="token function">service</span> code</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-http_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line">:: generate kratos errors code</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-errors_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line">:: generate message validator code</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--validate_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative,lang<span class="token operator">=</span>go:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line">:: generate openapi v2 json doc</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapiv2_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ <span class="token parameter variable">--openapiv2_opt</span> <span class="token assign-left variable">logtostderr</span><span class="token operator">=</span>true <span class="token parameter variable">--openapiv2_opt</span> <span class="token assign-left variable">json_names_for_fields</span><span class="token operator">=</span>true ./*.proto</span>
<span class="line">    </span>
<span class="line">:: generate openapi v3 yaml doc</span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapi_out</span><span class="token operator">=</span>naming<span class="token operator">=</span>json<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="shell脚本" tabindex="-1"><a class="header-anchor" href="#shell脚本"><span>Shell脚本</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate go struct code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--go_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate grpc service code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-grpc_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate rest service code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-http_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate kratos errors code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-errors_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate message validator code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--validate_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative,lang<span class="token operator">=</span>go:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate openapi v2 json doc</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapiv2_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ <span class="token parameter variable">--openapiv2_opt</span> <span class="token assign-left variable">logtostderr</span><span class="token operator">=</span>true <span class="token parameter variable">--openapiv2_opt</span> <span class="token assign-left variable">json_names_for_fields</span><span class="token operator">=</span>true ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate openapi v3 yaml doc</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapi_out</span><span class="token operator">=</span>naming<span class="token operator">=</span>json<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法除了能用，没有别的好处了。它需要在每一组proto文件的同级目录下都冗余放一对脚本，如果要执行所有的生成脚本，另外还需要写一个脚本来调用生成脚本，维护起来很痛苦。</p>
<h3 id="_2-makefile" tabindex="-1"><a class="header-anchor" href="#_2-makefile"><span>2. Makefile</span></a></h3>
<p><a href="https://github.com/go-kratos/kratos-layout" target="_blank" rel="noopener noreferrer">Kratos官方layout</a>就是使用的Makefile的方法来生成代码的。</p>
<p>它在根目录下的Makefile文件里：</p>
<div class="language-makefile line-numbers-mode" data-highlighter="prismjs" data-ext="makefile"><pre v-pre><code><span class="line"><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> api</span>
<span class="line"><span class="token comment"># generate api proto</span></span>
<span class="line"><span class="token target symbol">api</span><span class="token punctuation">:</span></span>
<span class="line">	protoc --proto_path<span class="token operator">=</span>./api \</span>
<span class="line">	       --proto_path<span class="token operator">=</span>./third_party \</span>
<span class="line"> 	       --go_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./api \</span>
<span class="line"> 	       --go-http_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./api \</span>
<span class="line"> 	       --go-grpc_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>./api \</span>
<span class="line">	       --openapi_out<span class="token operator">=</span>fq_schema_naming<span class="token operator">=</span>true,default_response<span class="token operator">=</span>false<span class="token punctuation">:</span>. \</span>
<span class="line">	       <span class="token variable">$</span><span class="token punctuation">(</span>API_PROTO_FILES<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> conf</span>
<span class="line"><span class="token comment"># generate config define code</span></span>
<span class="line"><span class="token target symbol">conf</span><span class="token punctuation">:</span></span>
<span class="line">	protoc --proto_path<span class="token operator">=</span>. \</span>
<span class="line">	       --proto_path<span class="token operator">=</span>../../../third_party \</span>
<span class="line">	       --go_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative<span class="token punctuation">:</span>. \</span>
<span class="line">	       ./internal/conf/*.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根目录下的Makefile由<code v-pre>app\{服务名}\service\Makefile</code>引用，调用者在服务目录<code v-pre>app\{服务名}\service\</code>下调用<code v-pre>make api</code>执行代码生成。</p>
<p>这个方法很有局限性，掣手掣脚，你只能够依照严格的固定的项目结构来，只要有一些变动就完犊子了。</p>
<p>MonoRepo的项目结构下，因为会有多个Makefile入口，所以没办法一键执行全部的Makefile，必须借助第三方工具，比如Shell脚本。偷懒如我，总觉得很麻烦。</p>
<h3 id="_3-go-generate注解" tabindex="-1"><a class="header-anchor" href="#_3-go-generate注解"><span>3. go:generate注解</span></a></h3>
<p>go1.4版本之后，可以通过<code v-pre>go generate</code>命令执行一些<code v-pre>go:generate</code>注解下的预处理命令，可以拿来生成API代码之用。因为在非Windows系统下，命令如果带通配符，会执行出错，需要加<code v-pre>sh -c</code>才行，而Windows系统不存在这样的问题，可以直接执行，所以需要使用<code v-pre>go:build</code>注解来区分操作系统，<code v-pre>go generate</code>命令会根据操作系统执行相对应的go代码文件。所以，我写了两个go文件：</p>
<h4 id="generate-windows-go" tabindex="-1"><a class="header-anchor" href="#generate-windows-go"><span>generate_windows.go</span></a></h4>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">//go:build windows</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate go struct code</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate grpc service code</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate rest service code</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate kratos errors code</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate message validator code</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate openapi v2 json doc</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate openapi v3 yaml doc</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> api</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="generate-xnix-go" tabindex="-1"><a class="header-anchor" href="#generate-xnix-go"><span>generate_xnix.go</span></a></h4>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">//go:build !windows</span></span>
<span class="line"><span class="token comment">// +build !windows</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate go struct code</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate grpc service code</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate rest service code</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate kratos errors code</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate message validator code</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate openapi v2 json doc</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// generate openapi v3 yaml doc</span></span>
<span class="line"><span class="token comment">//go:generate sh -c "protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto"</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> api</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它可以很好的完成生成代码的任务。主流的IDE（Goland、VSC）都可以很好的支持编辑界面执行注解。</p>
<p>要自动化吧，也能实现，只要在项目根目录执行<code v-pre>go generate ./...</code>就能够执行整个项目的<code v-pre>go:generate</code>注解。</p>
<p>但是，有一个很大的问题，它需要在每一组proto文件的同级目录下冗余一套go代码，维护起来就比较糟心了。</p>
<h3 id="_4-buf-build" tabindex="-1"><a class="header-anchor" href="#_4-buf-build"><span>4. buf.build</span></a></h3>
<p><a href="https://docs.buf.build/" target="_blank" rel="noopener noreferrer">buf.build</a>是专门用于构建protobuf API的工具。</p>
<p>它总共有3组配置文件：<code v-pre>buf.work.yaml</code>、<code v-pre>buf.gen.yaml</code>、<code v-pre>buf.yaml</code>。</p>
<p>另外，还有一个<code v-pre>buf.lock</code>文件，但是它不需要进行人工配置，它是由<code v-pre>buf mod update</code>命令所生成。这跟前端的npm、yarn等的lock文件差不多，golang的<code v-pre>go.sum</code>也差不多。</p>
<p>它的配置文件不多，也不复杂，维护起来非常方便，支持远程proto插件，支持远程第三方proto。对构建系统Bazel支持很好，对CI/CD系统也支持得很好。它还有很多优秀的特性。</p>
<p>buf.build非常棒，用它，很方便。值得使用，值得推荐。</p>
<h4 id="buf-work-yaml" tabindex="-1"><a class="header-anchor" href="#buf-work-yaml"><span>buf.work.yaml</span></a></h4>
<p>它一般放在项目的根目录下面，它代表的是一个工作区，通常一个项目也就一个该配置文件。</p>
<p>该配置文件最重要的就是<code v-pre>directories</code>配置项，列出了要包含在工作区中的模块的目录。目录路径必须相对于<code v-pre>buf.work.yaml</code>，像<code v-pre>../external</code>就是一个无效的配置。</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v1</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">directories</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> api</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="buf-gen-yaml" tabindex="-1"><a class="header-anchor" href="#buf-gen-yaml"><span>buf.gen.yaml</span></a></h4>
<p>它一般放在<code v-pre>buf.work.yaml</code>的同级目录下面，它主要是定义一些protoc生成的规则和插件配置。</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token comment"># 配置protoc生成规则</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v1</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">managed</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">plugins</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># generate go struct code</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> go</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/api/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span> paths=source_relative</span>
<span class="line"></span>
<span class="line">  <span class="token comment"># generate grpc service code</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> go<span class="token punctuation">-</span>grpc</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/api/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> paths=source_relative</span>
<span class="line"></span>
<span class="line">  <span class="token comment"># generate rest service code</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> go<span class="token punctuation">-</span>http</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/api/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> paths=source_relative</span>
<span class="line"></span>
<span class="line">  <span class="token comment"># generate kratos errors code</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> go<span class="token punctuation">-</span>errors</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/api/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> paths=source_relative</span>
<span class="line"></span>
<span class="line">  <span class="token comment"># generate message validator code</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> validate</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/api/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> paths=source_relative</span>
<span class="line">      <span class="token punctuation">-</span> lang=go</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="buf-yaml" tabindex="-1"><a class="header-anchor" href="#buf-yaml"><span>buf.yaml</span></a></h4>
<p>它放置的路径，你可以视之为<code v-pre>protoc</code>的<code v-pre>--proto-path</code>参数指向的路径，也就是proto文件里面<code v-pre>import</code>的相对路径。</p>
<p>需要注意的是，<code v-pre>buf.work.yaml</code>的同级目录必须要放一个该配置文件。</p>
<p>该配置文件的内容通常来说都是下面这个配置，不需要做任何修改，需要修改的情况不多。</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v1</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">deps</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">'buf.build/googleapis/googleapis'</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">'buf.build/envoyproxy/protoc-gen-validate'</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">'buf.build/kratos/apis'</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">'buf.build/gnostic/gnostic'</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">'buf.build/gogo/protobuf'</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">breaking</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">use</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> FILE</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">lint</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">use</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> DEFAULT</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="buf的ide插件安装" tabindex="-1"><a class="header-anchor" href="#buf的ide插件安装"><span>buf的IDE插件安装</span></a></h4>
<p>在IDE里面（VSC和Goland），远程的proto源码库会被拉取到本地的缓存文件夹里面，而这IDE并不知道，故而无法解析到依赖到的proto文件，但是，Buf官方提供了插件，可以帮助IDE读取并解析proto文件，并且自带Lint。</p>
<ul>
<li>VSC的Buf插件: <a href="https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf" target="_blank" rel="noopener noreferrer">https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf</a></li>
<li>Goland的Buf插件：<a href="https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers" target="_blank" rel="noopener noreferrer">https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers</a></li>
</ul>
<h4 id="使用buf生成代码" tabindex="-1"><a class="header-anchor" href="#使用buf生成代码"><span>使用Buf生成代码</span></a></h4>
<p>我有开源了一个Kratos的CMS项目<a href="https://github.com/tx7do/go-wind-cms" target="_blank" rel="noopener noreferrer">kratos-blog</a>，它是一个MonoRepo结构的项目，我们以它的项目结构来做讲解。</p>
<p>下面的目录树，是我化简后的目录树。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">.</span></span>
<span class="line">├── buf.work.yaml</span>
<span class="line">├── buf.gen.yaml</span>
<span class="line">├── buf.yaml</span>
<span class="line">├── buf.lock</span>
<span class="line">├── api</span>
<span class="line">│   ├── admin</span>
<span class="line">│   │   └── <span class="token function">service</span></span>
<span class="line">│   │       └── v1</span>
<span class="line">│   │           └── admin_errors.proto</span>
<span class="line">│   │           └── buf.openapi.gen.yaml</span>
<span class="line">│   │           └── i_user.proto</span>
<span class="line">│   └── buf.yaml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大家可以看到，总共所需求的配置文件并不多。</p>
<p><code v-pre>buf.build</code>使用<code v-pre>buf generate</code>命令进行构建，调用该命令必须在<code v-pre>buf.work.yaml</code>的同级目录下。执行了<code v-pre>buf generate</code>命令之后，将会在根目录下产生一个<code v-pre>gen/api/go</code>的文件夹，生成的代码都将被放在了这个目录下。</p>
<p>细心的你肯定早就发现了在<code v-pre>api/admin/service/v1</code>下面有一个<code v-pre>buf.openapi.gen.yaml</code>的配置文件，这是什么配置文件呢？我现在把该配置文件放出来：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token comment"># 配置protoc生成规则</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v1</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">managed</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">  <span class="token key atrule">optimize_for</span><span class="token punctuation">:</span> SPEED</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">go_package_prefix</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">default</span><span class="token punctuation">:</span> kratos<span class="token punctuation">-</span>monolithic<span class="token punctuation">-</span>demo/gen/api/go</span>
<span class="line">    <span class="token key atrule">except</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'buf.build/googleapis/googleapis'</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'buf.build/envoyproxy/protoc-gen-validate'</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'buf.build/kratos/apis'</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'buf.build/gnostic/gnostic'</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'buf.build/gogo/protobuf'</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">'buf.build/tx7do/pagination'</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">plugins</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># generate openapi v2 json doc</span></span>
<span class="line"><span class="token comment">#  - name: openapiv2</span></span>
<span class="line"><span class="token comment">#    out: ./app/admin/service/cmd/server/assets</span></span>
<span class="line"><span class="token comment">#    opt:</span></span>
<span class="line"><span class="token comment">#      - json_names_for_fields=true</span></span>
<span class="line"><span class="token comment">#      - logtostderr=true</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment"># generate openapi v3 yaml doc</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> openapi</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> ./app/admin/service/cmd/server/assets</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> naming=json <span class="token comment"># 命名约定。使用"proto"则直接从proto文件传递名称。默认为：json</span></span>
<span class="line">      <span class="token punctuation">-</span> depth=2 <span class="token comment"># 循环消息的递归深度，默认为：2</span></span>
<span class="line">      <span class="token punctuation">-</span> default_response=false <span class="token comment"># 添加默认响应消息。如果为“true”，则自动为使用google.rpc.Status消息的操作添加默认响应。如果您使用envoy或grpc-gateway进行转码，则非常有用，因为它们使用此类型作为默认错误响应。默认为：true。</span></span>
<span class="line">      <span class="token punctuation">-</span> enum_type=string <span class="token comment"># 枚举类型的序列化的类型。使用"string"则进行基于字符串的序列化。默认为：integer。</span></span>
<span class="line">      <span class="token punctuation">-</span> output_mode=merged <span class="token comment"># 输出文件生成模式。默认情况下，只有一个openapi.yaml文件会生成在输出文件夹。使用“source_relative”则会为每一个'[inputfile].proto'文件单独生成一个“[inputfile].openapi.yaml”文件。默认为：merged。</span></span>
<span class="line">      <span class="token punctuation">-</span> fq_schema_naming=false <span class="token comment"># Schema的命名是否加上包名，为true，则会加上包名，例如：system.service.v1.ListDictDetailResponse，否则为：ListDictDetailResponse。默认为：false。</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它是为了生成<a href="https://openapi.apifox.cn/" target="_blank" rel="noopener noreferrer">OpenAPI v3文档</a>。我之前尝试了放在根目录下的<code v-pre>buf.gen.yaml</code>，但是产生了一个问题，因为我可能一个项目里面有多个BFF服务程序，我不可能一股脑全部输出到一个openapi.yaml里面。虽然，它也可以每一个proto各自生成一个<code v-pre>[inputfile].openapi.yaml</code>，但是，这样显得太乱了，而且，我没有办法用。所以，没辙，只能单独对待了——每个BFF服务独立生成一个文档。</p>
<p>那么，怎么使用这个配置文件呢？还是使用<code v-pre>buf generate</code>命令，该命令还是需要在项目根目录下执行，但是得带<code v-pre>--template</code>参数去引入<code v-pre>buf.openapi.gen.yaml</code>这个配置文件：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">buf generate <span class="token parameter variable">--path</span> api/admin/service/v1 <span class="token parameter variable">--template</span> api/admin/service/v1/buf.openapi.gen.yaml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>最终，在<code v-pre>./app/admin/service/cmd/server/assets</code>这个目录下面，将会生成出来一个文件名为<code v-pre>openapi.yaml</code>的文件。</p>
<h3 id="与前端协同" tabindex="-1"><a class="header-anchor" href="#与前端协同"><span>与前端协同</span></a></h3>
<p>API并不是给后端自己把玩的玩物，还需要提供给前端调用的。</p>
<p>要与前端协同，无非就是为前端提供API文档。有两种途径可以达成这个目标：</p>
<ol>
<li>提供OpenAPI文档；</li>
<li>通过Protobuf生成TypeScript或者Javascript代码。</li>
</ol>
<p>方法2是我一开始使用的方法，我使用了<a href="https://www.npmjs.com/package/pbts?activeTab=readme" target="_blank" rel="noopener noreferrer">pbts</a>，它是<a href="https://github.com/protobufjs/protobuf.js/" target="_blank" rel="noopener noreferrer">ProtoBuf.js</a>提供的一个Protobuf转Typescript的工具。它可以把Schema转换成Typescript代码。在初期，它的确给予了我一定的支撑。但是，它的缺陷很大，很多Protobuf的语法识别不了，很多内容都导出不了，比如：访问路径导出不了、<code v-pre>gnostic/openapi</code>的标签被识别为错误语法。总之，也就是一个聊胜于无的工具。可是，它还是无法成为真正有力的生产力工具。</p>
<p>后来，我仔细的研究了OpenAPI。发现，它保存了最为完整的API信息。而且，OpenAPI文档是前端最为熟悉的API文档。给前端使用的工具也相当之多。</p>
<p>我研究了很多的语言的很多Web框架，发现，大家都会将Swagger UI内嵌到项目里面，提供一个在线的文档。我体验了整个的开发流程之后，认可了这种方式提供OpenAPI文档：</p>
<p>首先，它能够保证提供的文档和在线跑的服务提供的API是一致的。</p>
<p>其次，一切都是全自动的，一切都由框架提供支持，不需要自己为此做任何支持性的工作。比如，生成文档，拷贝文档……</p>
<p>最后，在线的方式的好处是，前后端都可以利用Swagger UI来查看API文档，调试接口。OpenAPI文档，也可以在线拿取到，如果前端不适应、不喜欢用Swagger UI，那么他也可以导入到其他的工具里面去，比如：Apifox、PostMan……</p>
<h4 id="怎样内嵌swagger-ui" tabindex="-1"><a class="header-anchor" href="#怎样内嵌swagger-ui"><span>怎样内嵌Swagger UI</span></a></h4>
<p>Kratos官方本来是有一个<a href="https://github.com/go-kratos/swagger-api" target="_blank" rel="noopener noreferrer">swagger-api</a>的项目的（现在已经被归档了），集成的是OpenAPI v2的Swagger UI。这个项目呢，不好使，我在应用中，经常会读不出来OpenAPI的文档。还有就是OpenAPI v2不如v3功能强大。</p>
<p>因为没有支持，而我又需要跟前端进行沟通，所以我只好生成出OpenAPI文档之后，自行导入到ApiFox里面去使用，ApiFox呢，挺好的，支持文件和在线两种方式导入，文档管理，接口测试的功能也都很强大。但是总是要去费神导出文档，这很让人抗拒——在开发的初期，接口变动是很高频的行为——难道就不能够全自动吗？程序只要一发布，接口就自动的跟随程序一起发布出去了。</p>
<p>对，说的就是集成Swagger UI。</p>
<p>为了做到这件事，我需要做这么几件事情：</p>
<ol>
<li>把Buf生成OpenAPI文档，编译运行程序写进MakeFile里面；</li>
<li>利用golang的<code v-pre>Embedding Files</code>特性，把<code v-pre>openapi.yaml</code>嵌入到服务程序里面；</li>
<li>集成Swagger UI到项目，并且读取内嵌的<code v-pre>openapi.yaml</code>文档。</li>
</ol>
<p>那么，我们首先开始编写Makefile：</p>
<div class="language-makefile line-numbers-mode" data-highlighter="prismjs" data-ext="makefile"><pre v-pre><code><span class="line"><span class="token comment"># generate protobuf api go code</span></span>
<span class="line"><span class="token target symbol">api</span><span class="token punctuation">:</span></span>
<span class="line">	buf generate</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate OpenAPI v3 docs.</span></span>
<span class="line"><span class="token target symbol">openapi</span><span class="token punctuation">:</span></span>
<span class="line">	buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml</span>
<span class="line">	buf generate --path api/front/service/v1 --template api/front/service/v1/buf.openapi.gen.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># run application</span></span>
<span class="line"><span class="token target symbol">run</span><span class="token punctuation">:</span> api openapi</span>
<span class="line">	<span class="token operator">@</span>go run ./cmd/server -conf ./configs</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我们只需要运行<code v-pre>make openapi</code>就执行OpenAPI的生成了，调试运行的时候，输入<code v-pre>make run</code>命令就可以生成OpenAPI并运行程序。</p>
<p>Makefile写好了，现在我们来到<code v-pre>./app/admin/service/cmd/server/assets</code>这个目录下面，我们在这个目录下面创建一个名为<code v-pre>assets.go</code>的代码文件：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> assets</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token boolean">_</span> <span class="token string">"embed"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//go:embed openapi.yaml</span></span>
<span class="line"><span class="token keyword">var</span> OpenApiData <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就这样，我们就把openapi.yaml内嵌进程序了。</p>
<p>最后，我们就需要来集成Swagger UI进来了。我为此封装了一个项目，要使用它，我们需要安装依赖库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go get <span class="token parameter variable">-u</span> github.com/tx7do/kratos-swagger-ui</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>在创建REST服务器的地方调用程序包里面的方法：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> server</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	rest <span class="token string">"github.com/go-kratos/kratos/v2/transport/http"</span></span>
<span class="line">	swaggerUI <span class="token string">"github.com/tx7do/kratos-swagger-ui"</span></span>
<span class="line"></span>
<span class="line">    <span class="token string">"kratos-cms/app/admin/service/cmd/server/assets"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewRESTServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>rest<span class="token punctuation">.</span>Server <span class="token punctuation">{</span></span>
<span class="line">	srv <span class="token operator">:=</span> <span class="token function">CreateRestServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    swaggerUI<span class="token punctuation">.</span><span class="token function">RegisterSwaggerUIServerWithOption</span><span class="token punctuation">(</span></span>
<span class="line">        srv<span class="token punctuation">,</span></span>
<span class="line">        swaggerUI<span class="token punctuation">.</span><span class="token function">WithTitle</span><span class="token punctuation">(</span><span class="token string">"Admin Service"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        swaggerUI<span class="token punctuation">.</span><span class="token function">WithMemoryData</span><span class="token punctuation">(</span>assets<span class="token punctuation">.</span>OpenApiData<span class="token punctuation">,</span> <span class="token string">"yaml"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>自此我们就大功告成了！</p>
<p>假如API服务的端口是8080，那么我们可以访问链接来访问Swagger UI：</p>
<p><a href="http://localhost:8080/docs/" target="_blank" rel="noopener noreferrer">http://localhost:8080/docs/</a></p>
<p>同时，openapi.yaml文件也可以在线访问到：</p>
<p><a href="http://localhost:8080/docs/openapi.yaml" target="_blank" rel="noopener noreferrer">http://localhost:8080/docs/openapi.yaml</a></p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://segmentfault.com/a/1190000039732564" target="_blank" rel="noopener noreferrer">mac安装包安装 protoc</a></li>
<li><a href="https://editor.leonh.space/2022/openapi/" target="_blank" rel="noopener noreferrer">OpenAPI 打通前後端任督二脈</a></li>
<li><a href="https://apifox.com/apiskills/what-is-swagger/" target="_blank" rel="noopener noreferrer">什么是 Swagger</a></li>
<li><a href="https://openapi.apifox.cn/" target="_blank" rel="noopener noreferrer">OpenAPI 规范（中文版）</a></li>
<li><a href="https://developer.aliyun.com/article/1157293" target="_blank" rel="noopener noreferrer">Swagger-UI 介绍及基本使用指南</a></li>
</ul>
</div></template>


