<template><div><h1 id="如何使用-golang-查询-mongodb" tabindex="-1"><a class="header-anchor" href="#如何使用-golang-查询-mongodb"><span>如何使用 Golang 查询 MongoDB</span></a></h1>
<h2 id="如何使用-golang-连接-mongodb" tabindex="-1"><a class="header-anchor" href="#如何使用-golang-连接-mongodb"><span>如何使用 Golang 连接 MongoDB</span></a></h2>
<p>连接 MongoDB 非常简单，只需连接 MongoDB 生成的 uri。</p>
<p>然后我们可以使用 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Client.Database" target="_blank" rel="noopener noreferrer">client.Database()</a> 函数来确保我们连接到正确的数据库。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// disconnect the mongo client when main is completed</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">Disconnect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以使用<code v-pre>Ping</code>方法来真正确保我们连接到正确的数据库。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">ctx<span class="token punctuation">,</span> cancel <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">err <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">Ping</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> readpref<span class="token punctuation">.</span><span class="token function">Primary</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-golang-向-mongodb-插入文档" tabindex="-1"><a class="header-anchor" href="#使用-golang-向-mongodb-插入文档"><span>使用 Golang 向 MongoDB 插入文档</span></a></h2>
<p>要将文档插入 MongoDB，我们可以使用MongoDB 提供的 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/bson#D" target="_blank" rel="noopener noreferrer">bson.D</a>。但为了使操作更简单、更贴近实际应用，我们将使用<code v-pre>bson</code>注解标注<code v-pre>struct</code>。</p>
<p>我们使用的模型是：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">type</span> Car <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Id    primitive<span class="token punctuation">.</span>ObjectID <span class="token string">`bson:"_id"`</span></span>
<span class="line">	Brand <span class="token builtin">string</span>             <span class="token string">`bson:"brand"`</span></span>
<span class="line">	Model <span class="token builtin">string</span>             <span class="token string">`bson:"model"`</span></span>
<span class="line">	Year  <span class="token builtin">int</span>                <span class="token string">`bson:"year"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们可以简单地使用 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.InsertOne" target="_blank" rel="noopener noreferrer">InsertOne()</a>方法 将文档插入 MongoDB。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/bson/primitive"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Car <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Id        primitive<span class="token punctuation">.</span>ObjectID <span class="token string">`bson:"_id"`</span></span>
<span class="line">    CreatedAt time<span class="token punctuation">.</span>Time          <span class="token string">`bson:"createdAt"`</span></span>
<span class="line">	Brand     <span class="token builtin">string</span>             <span class="token string">`bson:"brand"`</span></span>
<span class="line">	Model     <span class="token builtin">string</span>             <span class="token string">`bson:"model"`</span></span>
<span class="line">	Year      <span class="token builtin">int</span>                <span class="token string">`bson:"year"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	exampleData <span class="token operator">:=</span> Car<span class="token punctuation">{</span></span>
<span class="line">		Id<span class="token punctuation">:</span>    primitive<span class="token punctuation">.</span><span class="token function">NewObjectID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        CreatedAt<span class="token punctuation">:</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">UTC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		Brand<span class="token punctuation">:</span> <span class="token string">"Mercedes"</span><span class="token punctuation">,</span></span>
<span class="line">		Model<span class="token punctuation">:</span> <span class="token string">"G-360"</span><span class="token punctuation">,</span></span>
<span class="line">		Year<span class="token punctuation">:</span>  <span class="token number">2002</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	res<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">InsertOne</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> exampleData<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// inserted id is ObjectID("639b62ae2518fbd9315e405d")</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">"inserted id is %v"</span><span class="token punctuation">,</span> res<span class="token punctuation">.</span>InsertedID<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-golang-向-mongodb-写入多个文档" tabindex="-1"><a class="header-anchor" href="#使用-golang-向-mongodb-写入多个文档"><span>使用 Golang 向 MongoDB 写入多个文档</span></a></h2>
<p>我们可以使用 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection" target="_blank" rel="noopener noreferrer">Collection</a>对象 的 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.InsertMany" target="_blank" rel="noopener noreferrer">InsertMany()</a>方法。但是，<code v-pre>InsertMany()</code>方法需要传入<code v-pre>[]interface{}</code>参数。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/bson/primitive"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Car <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Id        primitive<span class="token punctuation">.</span>ObjectID <span class="token string">`bson:"_id"`</span></span>
<span class="line">    CreatedAt time<span class="token punctuation">.</span>Time          <span class="token string">`bson:"createdAt"`</span></span>
<span class="line">	Brand     <span class="token builtin">string</span>             <span class="token string">`bson:"brand"`</span></span>
<span class="line">	Model     <span class="token builtin">string</span>             <span class="token string">`bson:"model"`</span></span>
<span class="line">	Year      <span class="token builtin">int</span>                <span class="token string">`bson:"year"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> data <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line">	data <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> Car<span class="token punctuation">{</span></span>
<span class="line">		Id<span class="token punctuation">:</span>    primitive<span class="token punctuation">.</span><span class="token function">NewObjectID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        CreatedAt<span class="token punctuation">:</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">UTC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		Brand<span class="token punctuation">:</span> <span class="token string">"Toyota"</span><span class="token punctuation">,</span></span>
<span class="line">		Model<span class="token punctuation">:</span> <span class="token string">"Corolla"</span><span class="token punctuation">,</span></span>
<span class="line">		Year<span class="token punctuation">:</span>  <span class="token number">2008</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">	data <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> Car<span class="token punctuation">{</span></span>
<span class="line">		Id<span class="token punctuation">:</span>    primitive<span class="token punctuation">.</span><span class="token function">NewObjectID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        CreatedAt<span class="token punctuation">:</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">UTC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		Brand<span class="token punctuation">:</span> <span class="token string">"Ford"</span><span class="token punctuation">,</span></span>
<span class="line">		Model<span class="token punctuation">:</span> <span class="token string">"Focus"</span><span class="token punctuation">,</span></span>
<span class="line">		Year<span class="token punctuation">:</span>  <span class="token number">2021</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	res<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">InsertMany</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> data<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// 2 documents inserted</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">"%v documents inserted"</span><span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>res<span class="token punctuation">.</span>InsertedIDs<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-golang-从-mongodb-中查找单个文档" tabindex="-1"><a class="header-anchor" href="#使用-golang-从-mongodb-中查找单个文档"><span>使用 Golang 从 MongoDB 中查找单个文档</span></a></h2>
<p>要查找符合条件的单个文档，我们可以使用<code v-pre>*Collection</code>对象的 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.FindOne" target="_blank" rel="noopener noreferrer">FindOne()</a>方法。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/bson/primitive"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Car <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Id        primitive<span class="token punctuation">.</span>ObjectID <span class="token string">`bson:"_id"`</span></span>
<span class="line">    CreatedAt time<span class="token punctuation">.</span>Time          <span class="token string">`bson:"createdAt"`</span></span>
<span class="line">	Brand     <span class="token builtin">string</span>             <span class="token string">`bson:"brand"`</span></span>
<span class="line">	Model     <span class="token builtin">string</span>             <span class="token string">`bson:"model"`</span></span>
<span class="line">	Year      <span class="token builtin">int</span>                <span class="token string">`bson:"year"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    condition <span class="token operator">:=</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line">    cur<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">FindOne</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> condition<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> data <span class="token punctuation">[</span><span class="token punctuation">]</span>Car</span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">:=</span> cur<span class="token punctuation">.</span><span class="token function">All</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// now we can use the data array, which contains all of the documents</span></span>
<span class="line">	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> car <span class="token operator">:=</span> <span class="token keyword">range</span> data <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">"the brand is %v\n"</span><span class="token punctuation">,</span> car<span class="token punctuation">.</span>Brand<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="获取最后创建的文档" tabindex="-1"><a class="header-anchor" href="#获取最后创建的文档"><span>获取最后创建的文档</span></a></h3>
<p>我们还可以将 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo/options#FindOneOptions" target="_blank" rel="noopener noreferrer">mongo.Options</a> 传递给 <code v-pre>Find()</code>方法。</p>
<p>假设我们想要获取最后插入的文档。</p>
<ul>
<li>我们需要按<code v-pre>createdAt</code>字段排序</li>
<li>它应该是降序的，这就是我们将排序值设为<code v-pre>-1</code>的原因。</li>
</ul>
<h2 id="使用-golang-从-mongodb-中查找所有文档" tabindex="-1"><a class="header-anchor" href="#使用-golang-从-mongodb-中查找所有文档"><span>使用 Golang 从 MongoDB 中查找所有文档</span></a></h2>
<p>要查找集合中的所有文档，我们可以使用<code v-pre>*Collection</code>对象的<a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.Find" target="_blank" rel="noopener noreferrer">Find()</a>方法。</p>
<p>在下面的示例中，我们没有指定任何条件，这意味着返回数据库中的所有文档。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/bson/primitive"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> Car <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Id        primitive<span class="token punctuation">.</span>ObjectID <span class="token string">`bson:"_id"`</span></span>
<span class="line">    CreatedAt time<span class="token punctuation">.</span>Time          <span class="token string">`bson:"createdAt"`</span></span>
<span class="line">	Brand     <span class="token builtin">string</span>             <span class="token string">`bson:"brand"`</span></span>
<span class="line">	Model     <span class="token builtin">string</span>             <span class="token string">`bson:"model"`</span></span>
<span class="line">	Year      <span class="token builtin">int</span>                <span class="token string">`bson:"year"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    condition <span class="token operator">:=</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line">    cur<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Find</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> condition<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> data <span class="token punctuation">[</span><span class="token punctuation">]</span>Car</span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">:=</span> cur<span class="token punctuation">.</span><span class="token function">All</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// now we can use the data array, which contains all of the documents</span></span>
<span class="line">	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> car <span class="token operator">:=</span> <span class="token keyword">range</span> data <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">"the brand is %v\n"</span><span class="token punctuation">,</span> car<span class="token punctuation">.</span>Brand<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查找符合条件的多个文档" tabindex="-1"><a class="header-anchor" href="#查找符合条件的多个文档"><span>查找符合条件的多个文档</span></a></h3>
<p>如果我们想返回<code v-pre>brand</code>为<code v-pre>Toyota</code>，那么我们可以将<code v-pre>condition</code>变量更改为</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">condition <span class="token operator">:=</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">"brand"</span><span class="token punctuation">:</span> <span class="token string">"Toyota"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在查找操作中使用projection" tabindex="-1"><a class="header-anchor" href="#在查找操作中使用projection"><span>在查找操作中使用Projection</span></a></h3>
<p>如果要在<code v-pre>Find()</code>方法中使用<code v-pre>Projection</code>，我们可以使用<code v-pre>mongo.Options</code>参数。</p>
<p>假设我们想返回 2 个字段</p>
<ol>
<li>返回汽车的品牌<code v-pre>brand</code>；</li>
<li>返回一个布尔字段<code v-pre>isNew</code>来检查汽车是否是新的（1. 如果汽车的生产年份是 2022 年，那么它是新的； 2. 否则，它就旧了。）。</li>
</ol>
<p>使用<a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo/options#FindOptions.SetProjection" target="_blank" rel="noopener noreferrer">SetProjection()</a>方法来设置<code v-pre>Projection</code>字段的值：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">var</span> opts <span class="token operator">=</span> options<span class="token punctuation">.</span><span class="token function">Find</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">SetProjection</span><span class="token punctuation">(</span></span>
<span class="line">		bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">			<span class="token string">"brand"</span><span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">			<span class="token string">"isNew"</span><span class="token punctuation">:</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">				<span class="token string">"$cond"</span><span class="token punctuation">:</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">					<span class="token string">"if"</span><span class="token punctuation">:</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span><span class="token string">"$gte"</span><span class="token punctuation">:</span> bson<span class="token punctuation">.</span>A<span class="token punctuation">{</span><span class="token string">"$year"</span><span class="token punctuation">,</span> <span class="token number">2022</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">,</span> </span>
<span class="line">					<span class="token string">"then"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> </span>
<span class="line">					<span class="token string">"else"</span><span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">			<span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">		<span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">cur<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Find</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> opts<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-golang-更新-mongodb-中的单个文档" tabindex="-1"><a class="header-anchor" href="#使用-golang-更新-mongodb-中的单个文档"><span>使用 Golang 更新 MongoDB 中的单个文档</span></a></h2>
<p>要更新单个文档，我们应该使用<code v-pre>FindOneAndUpdate()</code>或<code v-pre>UpdateOne()</code>操作。在本文中，我们将使用<code v-pre>FindOneAndUpdate()</code>方法来进行操作。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/bson"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	filter <span class="token operator">:=</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">		<span class="token string">"brand"</span><span class="token punctuation">:</span> <span class="token string">"Toyota"</span><span class="token punctuation">,</span></span>
<span class="line">		<span class="token string">"model"</span><span class="token punctuation">:</span> <span class="token string">"Corolla"</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	update <span class="token operator">:=</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">		<span class="token string">"year"</span><span class="token punctuation">:</span> <span class="token number">2022</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	res <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">FindOneAndUpdate</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> filter<span class="token punctuation">,</span> update<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> res<span class="token punctuation">.</span><span class="token function">Err</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// operation successful</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="如何在-mongodb-中返回更新的文档" tabindex="-1"><a class="header-anchor" href="#如何在-mongodb-中返回更新的文档"><span>如何在 MongoDB 中返回更新的文档？</span></a></h3>
<p>我们可以使用<code v-pre>mongo.Options</code>包来实现这一点。我们应该将返回文档的选项<code v-pre>SetReturnDocument</code>设置为<code v-pre>after</code>。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">opts <span class="token operator">:=</span> options<span class="token punctuation">.</span><span class="token function">FindOneAndUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">SetReturnDocument</span><span class="token punctuation">(</span>options<span class="token punctuation">.</span>After<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">res <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">FindOneAndUpdate</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> filter<span class="token punctuation">,</span> update<span class="token punctuation">,</span> opts<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// we can use the updated car document</span></span>
<span class="line"><span class="token keyword">var</span> updatedData Car</span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> err <span class="token operator">:=</span> res<span class="token punctuation">.</span><span class="token function">Decode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>updatedData<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-golang-从-mongodb-中删除文档" tabindex="-1"><a class="header-anchor" href="#使用-golang-从-mongodb-中删除文档"><span>使用 Golang 从 MongoDB 中删除文档</span></a></h2>
<p>要删除文档，我们可以使用<code v-pre>*Collection</code>对象的<code v-pre>DeleteOne()</code>方法。</p>
<p>要删除多个文档，我们可以使用<code v-pre>*Collection</code>对象的<code v-pre>DeleteMany()</code>方法。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/bson"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	filter <span class="token operator">:=</span> bson<span class="token punctuation">.</span>M<span class="token punctuation">{</span></span>
<span class="line">		<span class="token string">"brand"</span><span class="token punctuation">:</span> <span class="token string">"Toyota"</span><span class="token punctuation">,</span></span>
<span class="line">		<span class="token string">"model"</span><span class="token punctuation">:</span> <span class="token string">"Corolla"</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// for single document</span></span>
<span class="line">	res<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Collection</span><span class="token punctuation">(</span><span class="token string">"cars"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">DeleteMany</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> filter<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// 1 document is deleted.</span></span>
<span class="line">	log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">"%v document is deleted"</span><span class="token punctuation">,</span> res<span class="token punctuation">.</span>DeletedCount<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="原文地址" tabindex="-1"><a class="header-anchor" href="#原文地址"><span>原文地址</span></a></h2>
<p><a href="https://ocakhasan.github.io/golang-mongodb-query-examples/" target="_blank" rel="noopener noreferrer">MongoDB &amp; Golang Query Examples - Cheat Sheet</a></p>
</div></template>


