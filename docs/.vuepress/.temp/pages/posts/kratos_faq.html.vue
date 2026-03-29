<template><div><h1 id="kratos微服务框架常见问题解答" tabindex="-1"><a class="header-anchor" href="#kratos微服务框架常见问题解答"><span>Kratos微服务框架常见问题解答</span></a></h1>
<h2 id="为什么protobuf定义成int64-转成json之后却变成了string类型" tabindex="-1"><a class="header-anchor" href="#为什么protobuf定义成int64-转成json之后却变成了string类型"><span>为什么Protobuf定义成int64，转成json之后却变成了string类型？</span></a></h2>
<p>比如说，定义了一个proto文件</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">message</span> <span class="token class-name">PartyMusicSearchItem</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin">string</span> name <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int32</span>  fileSize <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">string</span> author <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">string</span> musicId <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int32</span> type <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int64</span> createdAt <span class="token operator">=</span> <span class="token number">7</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int64</span> lastTime <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>返回的JSON的数据如下：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"author"</span><span class="token operator">:</span> <span class="token string">"张碧晨"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"createdAt"</span><span class="token operator">:</span> <span class="token string">"1640157765000"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"fileSize"</span><span class="token operator">:</span> <span class="token number">10907</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"lastTime"</span><span class="token operator">:</span> <span class="token string">"1640157765000"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"musicId"</span><span class="token operator">:</span> <span class="token string">"61c2d2459a01c38927334b03"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"年轮"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到proto中定义为int64的字段，返回值都变成了字符串了。</p>
<p>其实，我们查阅一下官方文档的 <a href="https://developers.google.com/protocol-buffers/docs/proto3#json" target="_blank" rel="noopener noreferrer">JSON Mapping</a> ，里面已经明确的做了定义：</p>
<table>
<thead>
<tr>
<th>proto3</th>
<th>JSON</th>
<th>JSON example</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td>int32, fixed32, uint32</td>
<td>number</td>
<td>1, -10, 0</td>
<td>JSON value will be a decimal number. Either numbers or strings are accepted.</td>
</tr>
<tr>
<td>int64, fixed64, uint64</td>
<td>string</td>
<td>&quot;1&quot;, &quot;-10&quot;</td>
<td>JSON value will be a decimal string. Either numbers or strings are accepted.</td>
</tr>
<tr>
<td>float, double</td>
<td>number</td>
<td>1.1, -10.0, 0, &quot;NaN&quot;, &quot;Infinity&quot;</td>
<td>JSON value will be a number or one of the special string values &quot;NaN&quot;, &quot;Infinity&quot;, and &quot;-Infinity&quot;. Either numbers or strings are accepted. Exponent notation is also accepted. -0 is considered equivalent to 0.</td>
</tr>
</tbody>
</table>
<p>究其原因就是因为精度问题</p>
<p><code v-pre>JavaScript</code>的<code v-pre>number</code>类型，都是存储的8字节的<code v-pre>double</code>类型，它的安全取值范围是：<code v-pre>-9007199254740991 ~ 9007199254740991</code>。</p>
<p><code v-pre>golang</code>的<code v-pre>int64</code>取值范围是：<code v-pre>-9223372036854775808 ~ 9223372036854775807</code>，<code v-pre>uint64</code>的取值范围是：<code v-pre>0 ~ 18446744073709551615</code>。</p>
<p>也就是说，<code v-pre>JavaScript</code>的<code v-pre>number</code>类型的取值范围明显小于<code v-pre>golang</code>的<code v-pre>int64</code>的取值范围。那么如果我们在使用中超过了这个范围，就会丢精度，导致返回的数据不正确。</p>
<p>唯一的办法也就只有把number先转换成string，然后解析的时候再转回数字。</p>
<p>这也并不会引起太大的问题，本身number转成JSON后就是字符串，也就是多了一对双引号罢了，并不会带来更多的传输损耗，也并不会带来其他的问题。除了让一些人感到费解罢了。</p>
<h2 id="怎么样在protobuf里面指定json的字段名" tabindex="-1"><a class="header-anchor" href="#怎么样在protobuf里面指定json的字段名"><span>怎么样在Protobuf里面指定JSON的字段名？</span></a></h2>
<p>我有一个proto</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">message</span> <span class="token class-name">PartyMusicSearchItem</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">string</span> name <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int32</span>  fileSize <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> author <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> musicId <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int32</span> type <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> createdAt <span class="token operator">=</span> <span class="token number">7</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> lastTime <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>返回的JSON的数据如下：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"author"</span><span class="token operator">:</span> <span class="token string">"张碧晨"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"createdAt"</span><span class="token operator">:</span> <span class="token string">"1640157765000"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"fileSize"</span><span class="token operator">:</span> <span class="token number">10907</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"lastTime"</span><span class="token operator">:</span> <span class="token string">"1640157765000"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"musicId"</span><span class="token operator">:</span> <span class="token string">"61c2d2459a01c38927334b03"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"年轮"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是我前端的命名规约是蛇形命名法，我希望返回的JSON数据是这样的：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"author"</span><span class="token operator">:</span> <span class="token string">"张碧晨"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token string">"1640157765000"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"file_size"</span><span class="token operator">:</span> <span class="token number">10907</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"last_time"</span><span class="token operator">:</span> <span class="token string">"1640157765000"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"music_id"</span><span class="token operator">:</span> <span class="token string">"61c2d2459a01c38927334b03"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"年轮"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token number">0</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是可以做到的，我们可以使用<code v-pre>JSON_NAME</code>的属性，指定JSON的字段名。</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">message</span> <span class="token class-name">PartyMusicSearchItem</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">string</span> name <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"name"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int32</span>  fileSize <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"file_size"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> author <span class="token operator">=</span> <span class="token number">3</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"author"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">string</span> musicId <span class="token operator">=</span> <span class="token number">4</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"music_id"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int32</span> type <span class="token operator">=</span> <span class="token number">6</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"type"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> createdAt <span class="token operator">=</span> <span class="token number">7</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"created_at"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">int64</span> lastTime <span class="token operator">=</span> <span class="token number">8</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"last_time"</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么它生成的struct是这样的：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">type</span> PartyMusicSearchItem <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	state         protoimpl<span class="token punctuation">.</span>MessageState</span>
<span class="line">	sizeCache     protoimpl<span class="token punctuation">.</span>SizeCache</span>
<span class="line">	unknownFields protoimpl<span class="token punctuation">.</span>UnknownFields</span>
<span class="line"></span>
<span class="line">	Name      <span class="token builtin">string</span> <span class="token string">`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`</span></span>
<span class="line">	FileSize  <span class="token builtin">int32</span>  <span class="token string">`protobuf:"varint,2,opt,name=fileSize,json=file_size,proto3" json:"fileSize,omitempty"`</span></span>
<span class="line">	Author    <span class="token builtin">string</span> <span class="token string">`protobuf:"bytes,3,opt,name=author,proto3" json:"author,omitempty"`</span></span>
<span class="line">	MusicId   <span class="token builtin">string</span> <span class="token string">`protobuf:"bytes,4,opt,name=musicId,json=music_id,proto3" json:"musicId,omitempty"`</span></span>
<span class="line">	Type      <span class="token builtin">int32</span>  <span class="token string">`protobuf:"varint,6,opt,name=type,proto3" json:"type,omitempty"`</span></span>
<span class="line">	CreatedAt <span class="token builtin">int64</span>  <span class="token string">`protobuf:"varint,7,opt,name=createdAt,json=created_at,proto3" json:"createdAt,omitempty"`</span></span>
<span class="line">	LastTime  <span class="token builtin">int64</span>  <span class="token string">`protobuf:"varint,8,opt,name=lastTime,json=last_time,proto3" json:"lastTime,omitempty"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它在官方文档<a href="https://developers.google.com/protocol-buffers/docs/proto3#json" target="_blank" rel="noopener noreferrer">JSON Mapping</a>里面是有说明的：</p>
<table>
<thead>
<tr>
<th>proto3</th>
<th>JSON</th>
<th>JSON example</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td>message</td>
<td>object</td>
<td>{&quot;fooBar&quot;: v, &quot;g&quot;: null, …}</td>
<td>Generates JSON objects. Message field names are mapped to lowerCamelCase and become JSON object keys. If the json_name field option is specified, the specified value will be used as the key instead. Parsers accept both the lowerCamelCase name (or the one specified by the json_name option) and the original proto field name. null is an accepted value for all field types and treated as the default value of the corresponding field type.</td>
</tr>
</tbody>
</table>
<h2 id="如何使用golang代码中编译protobuf文件" tabindex="-1"><a class="header-anchor" href="#如何使用golang代码中编译protobuf文件"><span>如何使用Golang代码中编译Protobuf文件？</span></a></h2>
<p>我们可以使用golang的<code v-pre>go generate</code>命令来编译Protobuf文件，我们可以在proto文件的当前目录下新建一个<code v-pre>generate.go</code>文件：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> api</span>
<span class="line"></span>
<span class="line"><span class="token comment">// 生成 proto grpc</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 生成 proto http</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go_out=paths=source_relative:. --go-http_out=paths=source_relative:. ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 生成 proto errors</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --go_out=paths=source_relative:. --go-errors_out=paths=source_relative:. ./*.proto</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 生成 swagger</span></span>
<span class="line"><span class="token comment">//go:generate protoc --proto_path=. --openapiv2_out . --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>推荐使用Jetbrain的Goland，它可以很方便的在IDE中运行该命令。堪称完美。</p>
<h2 id="providerset-has-multiple-bindings-for-invalid-type" tabindex="-1"><a class="header-anchor" href="#providerset-has-multiple-bindings-for-invalid-type"><span>ProviderSet has multiple bindings for invalid type</span></a></h2>
<h2 id="providerset-has-multiple-bindings-for" tabindex="-1"><a class="header-anchor" href="#providerset-has-multiple-bindings-for"><span>ProviderSet has multiple bindings for ***</span></a></h2>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">NewRegistrar</span><span class="token punctuation">(</span>conf <span class="token operator">*</span>conf<span class="token punctuation">.</span>Registry<span class="token punctuation">)</span> registry<span class="token punctuation">.</span>Registrar <span class="token punctuation">{</span></span>
<span class="line">	c <span class="token operator">:=</span> consulAPI<span class="token punctuation">.</span><span class="token function">DefaultConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	c<span class="token punctuation">.</span>Address <span class="token operator">=</span> conf<span class="token punctuation">.</span>Consul<span class="token punctuation">.</span>Address</span>
<span class="line">	c<span class="token punctuation">.</span>Scheme <span class="token operator">=</span> conf<span class="token punctuation">.</span>Consul<span class="token punctuation">.</span>Scheme</span>
<span class="line">	cli<span class="token punctuation">,</span> err <span class="token operator">:=</span> consulAPI<span class="token punctuation">.</span><span class="token function">NewClient</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	r <span class="token operator">:=</span> consul<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span>cli<span class="token punctuation">,</span> consul<span class="token punctuation">.</span><span class="token function">WithHealthCheck</span><span class="token punctuation">(</span>conf<span class="token punctuation">.</span>Consul<span class="token punctuation">.</span>HealthCheck<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> r</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> ProviderSet <span class="token operator">=</span> wire<span class="token punctuation">.</span><span class="token function">NewSet</span><span class="token punctuation">(</span>NewWebsocketServer<span class="token punctuation">,</span> NewRegistrar<span class="token punctuation">,</span> NewRegistrar<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一个Set里边一个类型只能注入一个，不能够注入多个。上面的代码里面调用了两次<code v-pre>NewRegistrar</code>，也就是说注入了两次<code v-pre>registry.Registrar</code>，这是不合法的，便会报这样的错误。</p>
<h2 id="proto文件引入其他proto文件-goland里边报错-cannot-resolve-import-proto" tabindex="-1"><a class="header-anchor" href="#proto文件引入其他proto文件-goland里边报错-cannot-resolve-import-proto"><span>proto文件引入其他proto文件，Goland里边报错：Cannot resolve import '*.proto'</span></a></h2>
<p>设置-&gt;语言和框架-&gt;Protocol Buffers</p>
<p>里边将proto存放的路径加入到配置里面。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://developers.google.com/protocol-buffers/docs/proto3#json" target="_blank" rel="noopener noreferrer">JSON Mapping</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER" target="_blank" rel="noopener noreferrer">Number.MAX_SAFE_INTEGER</a></li>
</ul>
</div></template>


