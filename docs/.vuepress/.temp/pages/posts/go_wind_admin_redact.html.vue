<template><div><h1 id="gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-数据脱敏和隐私保护" tabindex="-1"><a class="header-anchor" href="#gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-数据脱敏和隐私保护"><span>GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：数据脱敏和隐私保护</span></a></h1>
<p>Go Wind Admin 的数据脱敏能力，是基于 Protobuf 生态下的<a href="https://github.com/arrakis-digital/protoc-gen-redact" target="_blank" rel="noopener noreferrer">arrakis-digital/protoc-gen-redact</a>插件实现的 —— 通过在 Protobuf 消息定义中为敏感字段（如手机号、身份证号）添加脱敏注解（如(<code v-pre>(redact.custom).string = &quot;r*d@ct*d&quot;</code>)），由插件自动生成适配业务的脱敏方法（如 Go 语言的Redact()方法），无需侵入业务逻辑即可完成敏感数据的遮挡处理，同时保持与 Protobuf 消息结构的强绑定，避免跨层配置不一致问题。配微服务接口、日志打印、数据存储等场景的隐私保护需求。</p>
<p>与其他脱敏工具相比，其核心优势在于：​</p>
<ul>
<li>原生集成 Protobuf：脱敏规则与消息结构强绑定，避免跨层配置不一致；​</li>
<li>多语言支持：目前主打 Go 语言，后续扩展支持 Java、Python 等 Protobuf 主流语言；​</li>
<li>灵活规则体系：支持内置脱敏类型、自定义正则、自定义函数，覆盖绝大多数业务场景；​</li>
<li>低侵入性：生成的脱敏代码与业务代码分离，不影响原有 Protobuf 消息的序列化 / 反序列化逻辑。</li>
</ul>
<h2 id="快速上手-环境准备与插件安装" tabindex="-1"><a class="header-anchor" href="#快速上手-环境准备与插件安装"><span>快速上手：环境准备与插件安装</span></a></h2>
<h3 id="_1-前置环境要求​" tabindex="-1"><a class="header-anchor" href="#_1-前置环境要求​"><span>1. 前置环境要求​</span></a></h3>
<ul>
<li><strong>Go 环境</strong>：1.18+（插件基于 Go 开发，需匹配支持的版本）；​</li>
<li><strong>Protobuf 编译器（<code v-pre>protoc</code>）</strong>：3.19+（确保支持自定义选项与插件扩展）；​</li>
<li><strong>Protobuf Go 插件</strong>：<code v-pre>protoc-gen-go</code>（用于生成基础 Go 代码，需提前安装）。</li>
</ul>
<h3 id="_2-安装插件​" tabindex="-1"><a class="header-anchor" href="#_2-安装插件​"><span>2. 安装插件​</span></a></h3>
<p>通过 <code v-pre>go install</code> 直接从 GitHub 拉取最新版本：​</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安装 protoc-gen-redact 插件​</span></span>
<span class="line">go <span class="token function">install</span> github.com/menta2k/protoc-gen-redact/v3@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>同时确保 <code v-pre>protoc-gen-go</code> 已安装（生成 Protobuf 基础 Go 代码必需）：​</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> google.golang.org/protobuf/cmd/protoc-gen-go@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>以上命令，我都已经写入了项目根目录下的<code v-pre>Makefile</code>，只需要调用<code v-pre>make</code>方法即可：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">make</span> plugin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="核心使用流程-3-步实现-protobuf-消息脱敏​" tabindex="-1"><a class="header-anchor" href="#核心使用流程-3-步实现-protobuf-消息脱敏​"><span>核心使用流程：3 步实现 Protobuf 消息脱敏​</span></a></h2>
<p>以「用户信息（User）」消息为例，完整演示从规则定义到脱敏调用的全流程。​</p>
<h3 id="步骤-1-定义-protobuf-消息-标注脱敏规则-​" tabindex="-1"><a class="header-anchor" href="#步骤-1-定义-protobuf-消息-标注脱敏规则-​"><span>步骤 1：定义 Protobuf 消息（标注脱敏规则）​</span></a></h3>
<p>首先创建 Protobuf 文件（如 <code v-pre>api/user/v1/user.proto</code>），通过 <code v-pre>redact</code> 自定义注解为敏感字段配置脱敏规则。​</p>
<p>关键说明：​</p>
<ul>
<li>需导入插件提供的自定义选项文件 <code v-pre>redact/redact.proto</code>（定义脱敏规则的语法）；​</li>
</ul>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> user<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"redact/redact.proto"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/protobuf/empty.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">option</span> go_package <span class="token operator">=</span> <span class="token string">"github.com/arrakis-digital/protoc-gen-redact/v3/examples/user/pb;user"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">User</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// User credentials</span></span>
<span class="line">    <span class="token builtin">string</span> username <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">string</span> password <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>redact<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">string</span> <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// default redaction</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// User information</span></span>
<span class="line">    <span class="token builtin">string</span> email <span class="token operator">=</span> <span class="token number">3</span> <span class="token punctuation">[</span><span class="token punctuation">(</span>redact<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">string</span> <span class="token operator">=</span> <span class="token string">"r*d@ct*d"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">string</span> name <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">service</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">rpc</span> <span class="token function">GetUser</span><span class="token punctuation">(</span><span class="token class-name">GetUserRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">rpc</span> <span class="token function">AddUser</span><span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">option</span> <span class="token punctuation">(</span>redact<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>internal_method<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">rpc</span> <span class="token function">ListUsers</span> <span class="token punctuation">(</span><span class="token class-name">google.protobuf.Empty</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">ListUsersResponse</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">option</span> <span class="token punctuation">(</span>redact<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>internal_method<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">option</span> <span class="token punctuation">(</span>redact<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>internal_method_code<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">14</span><span class="token punctuation">;</span> <span class="token comment">// codes.Unavailable</span></span>
<span class="line">        <span class="token keyword">option</span> <span class="token punctuation">(</span>redact<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>internal_method_err_message<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token string">"%service%.%method% unavailable"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">GetUserRequest</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin">string</span> username <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">ListUsersResponse</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">repeated</span> <span class="token positional-class-name class-name">User</span> users <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="步骤-2-生成脱敏代码-protoc-命令-​" tabindex="-1"><a class="header-anchor" href="#步骤-2-生成脱敏代码-protoc-命令-​"><span>步骤 2：生成脱敏代码（protoc 命令）​</span></a></h3>
<p>通过 <code v-pre>protoc</code> 命令调用 <code v-pre>protoc-gen-redact</code> 插件，同时生成 基础Go代码 和 脱敏代码。​</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">protoc <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--plugin</span><span class="token operator">=</span>protoc-gen-redact<span class="token operator">=</span>/path/to/protoc-gen-redact <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--redact_out</span><span class="token operator">=</span>. <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--redact_opt</span><span class="token operator">=</span>template_file<span class="token operator">=</span>/path/to/your/template.tmpl <span class="token punctuation">\</span></span>
<span class="line">  your_proto_file.proto</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生成文件说明：​</p>
<p>执行后会生成 2 个文件（以 Go 为例）：​</p>
<ul>
<li><code v-pre>user.pb.go</code>：Protobuf 基础代码（消息结构体、序列化 / 反序列化方法）；​</li>
<li><code v-pre>user.redact.pb.go</code>：脱敏代码（核心是 <code v-pre>User.Redact()</code>、<code v-pre>GetUserRequest.Redact()</code> 和 <code v-pre>ListUsersResponse.Redact()</code> 方法）。​</li>
</ul>
<p>Go Wind Admin使用的是Buf来构建Protobuf代码，所以，protoc命令在实际开发中我们是接触不到的。</p>
<p>redact在buf中的配置主要有两处：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token comment"># api/buf.yaml</span></span>
<span class="line"><span class="token key atrule">deps</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token string">'buf.build/menta2k-org/redact'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token comment"># api/buf.gen.yaml</span></span>
<span class="line"><span class="token key atrule">managed</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">disable</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">'buf.build/menta2k-org/redact'</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">plugins</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># generate redact code</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>redact</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> paths=source_relative <span class="token comment"># use relative paths</span></span>
<span class="line">      <span class="token punctuation">-</span> lang=go</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>平时我们只需要在api下调用<code v-pre>buf generate</code>，或者直接在项目根目录下调用<code v-pre>make api</code>即可。</p>
<h3 id="步骤-3-调用脱敏方法-业务代码示例-​" tabindex="-1"><a class="header-anchor" href="#步骤-3-调用脱敏方法-业务代码示例-​"><span>步骤 3：调用脱敏方法（业务代码示例）​</span></a></h3>
<p>在 Go 业务代码中，创建原始 <code v-pre>User</code> 消息后，直接调用自动生成的 <code v-pre>Redact()</code>方法即可完成脱敏，无需手动编写逻辑。​</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"fmt"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"github.com/menta2k/protoc-gen-redact/v3/examples/user/pb"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token comment">// 1. 构造原始用户信息（含完整敏感数据）</span></span>
<span class="line">	rawUser <span class="token operator">:=</span> <span class="token operator">&amp;</span>pb<span class="token punctuation">.</span>User<span class="token punctuation">{</span></span>
<span class="line">		Name<span class="token punctuation">:</span>     <span class="token string">"张三丰"</span><span class="token punctuation">,</span></span>
<span class="line">		Password<span class="token punctuation">:</span> <span class="token string">"password"</span><span class="token punctuation">,</span></span>
<span class="line">		Email<span class="token punctuation">:</span>    <span class="token string">"testuser@example.com"</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// 2. 调用自动生成的 Redact() 方法脱敏</span></span>
<span class="line">	redactedUser <span class="token operator">:=</span> rawUser<span class="token punctuation">.</span><span class="token function">Redact</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// 3. 打印脱敏结果</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"姓名："</span><span class="token punctuation">,</span> rawUser<span class="token punctuation">.</span>Name<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"邮箱："</span><span class="token punctuation">,</span> rawUser<span class="token punctuation">.</span>Email<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"密码："</span><span class="token punctuation">,</span> rawUser<span class="token punctuation">.</span>Password<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"脱敏数据："</span><span class="token punctuation">,</span> redactedUser<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="适用场景与总结" tabindex="-1"><a class="header-anchor" href="#适用场景与总结"><span>适用场景与总结</span></a></h2>
<h3 id="_1-核心适用场景​" tabindex="-1"><a class="header-anchor" href="#_1-核心适用场景​"><span>1. 核心适用场景​</span></a></h3>
<ul>
<li><strong>微服务接口脱敏</strong>：网关 / 服务间调用时，自动脱敏响应中的敏感字段（如用户中心返回手机号、身份证）；​</li>
<li><strong>日志脱敏</strong>：打印 Protobuf 消息日志前，避免敏感数据泄露；​</li>
<li><strong>前端展示脱敏</strong>：后端返回数据前脱敏，前端无需处理隐私数据逻辑；​</li>
<li><strong>第三方数据传输</strong>：向合作伙伴传输数据时，按规则脱敏敏感字段，符合合规要求（如 GDPR、《个人信息保护法》）。</li>
</ul>
<h3 id="_2-工具总结​" tabindex="-1"><a class="header-anchor" href="#_2-工具总结​"><span>2. 工具总结​</span></a></h3>
<p><code v-pre>protoc-gen-redact</code> 以 “Protobuf 原生集成” 为核心优势，通过 “注解定义规则 + 代码生成” 的模式，大幅降低了数据脱敏的开发成本。其灵活的规则体系（内置类型 + 自定义逻辑）和低侵入性，使其成为微服务架构下隐私保护的优选工具。建议在项目初期就将脱敏规则与 Protobuf 消息绑定，避免后期大量业务代码改造。</p>
<h2 id="项目代码" tabindex="-1"><a class="header-anchor" href="#项目代码"><span>项目代码</span></a></h2>
<ul>
<li><a href="https://gitee.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Gitee</a></li>
<li><a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Github</a></li>
</ul>
</div></template>


