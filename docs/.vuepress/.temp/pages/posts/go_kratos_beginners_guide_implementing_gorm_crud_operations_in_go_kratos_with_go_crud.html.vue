<template><div><h1 id="初学者友好-go-kratos-集成-go-crud-gorm-orm-crud-无需重复编码-轻松上手" tabindex="-1"><a class="header-anchor" href="#初学者友好-go-kratos-集成-go-crud-gorm-orm-crud-无需重复编码-轻松上手"><span>初学者友好：Go-Kratos 集成 go-crud，GORM ORM CRUD 无需重复编码，轻松上手</span></a></h1>
<p>对于刚接触Go微服务开发的初学者来说，直接上手“框架+ORM”的组合常显复杂。而kratos-gorm-example项目已为我们搭建好了Go-Kratos与GORM的基础集成框架，本文将基于该项目，聚焦如何快速接入go-curd工具简化CRUD（增删改查）操作，全程以step-by-step的方式讲解，新手也能轻松跟随实操。</p>
<p>先明确核心工具关系：<code v-pre>kratos-gorm-example</code>是“基础骨架”（已整合Kratos与GORM），<code v-pre>go-curd</code>是“效率工具”（封装重复CRUD逻辑），我们的核心目标是“在现有骨架上装工具，让数据操作更简单”。</p>
<h2 id="一、核心工具速览-3分钟理清分工" tabindex="-1"><a class="header-anchor" href="#一、核心工具速览-3分钟理清分工"><span>一、核心工具速览：3分钟理清分工</span></a></h2>
<p>在动手前，先明确三个工具的分工，避免越做越乱：</p>
<ul>
<li><strong>Go-Kratos</strong>微服务框架核心，负责API定义、服务启动、请求分发，kratos-gorm-example已完成其基础配置；</li>
<li><strong>GORM</strong>：ORM框架，实现Go结构体与数据库表的映射，kratos-gorm-example已完成数据库连接初始化；</li>
<li><strong>go-crud</strong>：GORM的上层封装工具，把重复的CRUD逻辑（如创建、查询、更新、删除）做成现成方法，无需手动编写GORM原生语句。</li>
</ul>
<h2 id="二、环境准备-5分钟搞定前置依赖" tabindex="-1"><a class="header-anchor" href="#二、环境准备-5分钟搞定前置依赖"><span>二、环境准备：5分钟搞定前置依赖</span></a></h2>
<p>先完成基础环境搭建和项目准备，确保后续步骤无报错：</p>
<ol>
<li><strong>安装基础工具</strong>：要求 Go 1.19+（Kratos 最低支持版本），安装后用<code v-pre>go version</code>验证；</li>
<li><strong>Git</strong>：用于克隆示例项目；</li>
<li><strong>准备数据库</strong>：用 Postgresql（GORM 最常用的数据库），新建一个数据库（比如叫<code v-pre>example</code>），不用建表（后续 GORM 会自动建）；</li>
<li><strong>获取kratos-gorm-example项目：</strong>
<ul>
<li>打开终端，执行以下命令克隆项目并进入目录：<code v-pre>git clone https://github.com/tx7do/kratos-gorm-example.git</code></li>
<li><code v-pre>cd kratos-gorm-example</code></li>
</ul>
</li>
<li><strong>引入go-curd依赖：</strong> 在项目根目录执行命令，拉取go-curd的GORM适配模块：<code v-pre>go get github.com/tx7do/go-curd/gorm</code></li>
<li><strong>确认项目核心目录：</strong> 无需关注所有文件，重点记住3个核心目录（kratos-gorm-example已预设）：
<ul>
<li><code v-pre>api</code>：放 API 定义文件（.proto），用来定义 “创建用户”、“查询用户” 等接口；</li>
<li><code v-pre>app/user/service/internal/data/models</code>：放数据库模型（和 MySQL 表对应）；</li>
<li><code v-pre>app/user/service/internal/data</code>：放业务逻辑，这里会调用 go-crud 做 CRUD。</li>
</ul>
</li>
</ol>
<h2 id="三、核心步骤1-在kratos-gorm-example中集成go-curd" tabindex="-1"><a class="header-anchor" href="#三、核心步骤1-在kratos-gorm-example中集成go-curd"><span>三、核心步骤1：在kratos-gorm-example中集成go-curd</span></a></h2>
<p>kratos-gorm-example已完成GORM的初始化配置，我们只需在现有基础上，将go-curd客户端集成进来，让业务层可以调用其简化方法。</p>
<h3 id="_1-1-修改数据层-集成go-curd客户端" tabindex="-1"><a class="header-anchor" href="#_1-1-修改数据层-集成go-curd客户端"><span>1.1 修改数据层：集成go-curd客户端</span></a></h3>
<p>打开<code v-pre>app/user/service/internal/data/user.go</code>修改代码以集成<code v-pre>go-curd</code>：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> data</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">  gormCurd <span class="token string">"github.com/tx7do/go-crud/gorm"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> UserRepo <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	data <span class="token operator">*</span>Data</span>
<span class="line">	log  <span class="token operator">*</span>log<span class="token punctuation">.</span>Helper</span>
<span class="line"></span>
<span class="line">	mapper     <span class="token operator">*</span>mapper<span class="token punctuation">.</span>CopierMapper<span class="token punctuation">[</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> models<span class="token punctuation">.</span>User<span class="token punctuation">]</span></span>
<span class="line">	repository <span class="token operator">*</span>gormCurd<span class="token punctuation">.</span>Repository<span class="token punctuation">[</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> models<span class="token punctuation">.</span>User<span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewUserRepo</span><span class="token punctuation">(</span>data <span class="token operator">*</span>Data<span class="token punctuation">,</span> logger log<span class="token punctuation">.</span>Logger<span class="token punctuation">)</span> <span class="token operator">*</span>UserRepo <span class="token punctuation">{</span></span>
<span class="line">	l <span class="token operator">:=</span> log<span class="token punctuation">.</span><span class="token function">NewHelper</span><span class="token punctuation">(</span>log<span class="token punctuation">.</span><span class="token function">With</span><span class="token punctuation">(</span>logger<span class="token punctuation">,</span> <span class="token string">"module"</span><span class="token punctuation">,</span> <span class="token string">"user/repo/user-service"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	repo <span class="token operator">:=</span> <span class="token operator">&amp;</span>UserRepo<span class="token punctuation">{</span></span>
<span class="line">		data<span class="token punctuation">:</span>   data<span class="token punctuation">,</span></span>
<span class="line">		log<span class="token punctuation">:</span>    l<span class="token punctuation">,</span></span>
<span class="line">		mapper<span class="token punctuation">:</span> mapper<span class="token punctuation">.</span>NewCopierMapper<span class="token punctuation">[</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> models<span class="token punctuation">.</span>User<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	repo<span class="token punctuation">.</span>repository <span class="token operator">=</span> gormCurd<span class="token punctuation">.</span>NewRepository<span class="token punctuation">[</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> models<span class="token punctuation">.</span>User<span class="token punctuation">]</span><span class="token punctuation">(</span></span>
<span class="line">		repo<span class="token punctuation">.</span>mapper<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	repo<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> repo</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>核心改动说明：新增<code v-pre>repository</code>字段存储<code v-pre>go-curd</code>客户端，通过<code v-pre>gormCurd.NewRepository()</code>初始化，提供方法供业务层调用。</p>
<h3 id="_1-2-确认数据库配置-无需修改-仅验证" tabindex="-1"><a class="header-anchor" href="#_1-2-确认数据库配置-无需修改-仅验证"><span>1.2 确认数据库配置（无需修改，仅验证）</span></a></h3>
<p>kratos-gorm-example已在<code v-pre>configs/data.yaml</code>中配置好数据库连接，打开文件验证：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">data</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">database</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> <span class="token string">"postgres"</span></span>
<span class="line">    <span class="token key atrule">source</span><span class="token punctuation">:</span> <span class="token string">"host=localhost port=5432 user=postgres password=*Abcd123456 dbname=example sslmode=disable"</span></span>
<span class="line">    <span class="token key atrule">migrate</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：将<code v-pre>source</code>中的<code v-pre>user=postgres password=*Abcd123456</code>改为自己的PostgreSQL用户名和密码，确保能连接到之前新建的<code v-pre>example</code>数据库。</p>
<h2 id="四、核心步骤2-用go-curd实现crud业务逻辑" tabindex="-1"><a class="header-anchor" href="#四、核心步骤2-用go-curd实现crud业务逻辑"><span>四、核心步骤2：用go-curd实现CRUD业务逻辑</span></a></h2>
<p>我们将以“用户模块”为例，基于项目现有的目录结构，用go-curd实现用户的增、删、改、查。kratos-gorm-example已预设部分基础代码，我们只需补充和修改。</p>
<h3 id="_2-1-定义用户模型-model" tabindex="-1"><a class="header-anchor" href="#_2-1-定义用户模型-model"><span>2.1 定义用户模型（Model）</span></a></h3>
<p>打开<code v-pre>app/user/service/internal/data/models/user.go</code>，定义<code v-pre>User</code>结构体（对应数据库中的的<code v-pre>users表</code>）：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> models</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"gorm.io/gorm"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// User 用户信息表</span></span>
<span class="line"><span class="token keyword">type</span> User <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	gorm<span class="token punctuation">.</span>Model</span>
<span class="line"></span>
<span class="line">	UserName <span class="token builtin">string</span> <span class="token string">`gorm:"column:username;comment:'账号名'"`</span></span>
<span class="line">	NickName <span class="token builtin">string</span> <span class="token string">`gorm:"column:nickname;comment:'昵称'"`</span></span>
<span class="line">	Password <span class="token builtin">string</span> <span class="token string">`gorm:"column:password;comment:'登录密码'"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>u User<span class="token punctuation">)</span> <span class="token function">TableName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token string">"users"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>说明：GORM会根据该结构体自动创建数据库表，后续我们会通过go-curd操作该模型。</p>
<h3 id="_2-2-编写data层-用go-curd实现crud" tabindex="-1"><a class="header-anchor" href="#_2-2-编写data层-用go-curd实现crud"><span>2.2 编写Data层：用go-curd实现CRUD</span></a></h3>
<p>打开<code v-pre>app/user/service/internal/data/user.go</code>，编写业务逻辑方法。核心优势：用go-curd的现成方法替代原生GORM代码，减少重复工作。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> data</span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>UserRepo<span class="token punctuation">)</span> <span class="token function">List</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> req <span class="token operator">*</span>pagination<span class="token punctuation">.</span>PagingRequest<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>userV1<span class="token punctuation">.</span>ListUserResponse<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> req <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"request is nil"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	ret<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">ListWithPaging</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">,</span> req<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">if</span> ret <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token operator">&amp;</span>userV1<span class="token punctuation">.</span>ListUserResponse<span class="token punctuation">{</span>Total<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span> Items<span class="token punctuation">:</span> <span class="token boolean">nil</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>userV1<span class="token punctuation">.</span>ListUserResponse<span class="token punctuation">{</span></span>
<span class="line">		Total<span class="token punctuation">:</span> ret<span class="token punctuation">.</span>Total<span class="token punctuation">,</span></span>
<span class="line">		Items<span class="token punctuation">:</span> ret<span class="token punctuation">.</span>Items<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>UserRepo<span class="token punctuation">)</span> <span class="token function">Get</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> req <span class="token operator">*</span>userV1<span class="token punctuation">.</span>GetUserRequest<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> req <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"request is nil"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> whereCond <span class="token operator">*</span>gorm<span class="token punctuation">.</span>DB</span>
<span class="line">	<span class="token keyword">switch</span> req<span class="token punctuation">.</span>QueryBy<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token keyword">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">case</span> <span class="token operator">*</span>userV1<span class="token punctuation">.</span>GetUserRequest_Id<span class="token punctuation">:</span></span>
<span class="line">		whereCond <span class="token operator">=</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span><span class="token string">"id = ?"</span><span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">case</span> <span class="token operator">*</span>userV1<span class="token punctuation">.</span>GetUserRequest_UserName<span class="token punctuation">:</span></span>
<span class="line">		whereCond <span class="token operator">=</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span><span class="token string">"user_name = ?"</span><span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetUserName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">default</span><span class="token punctuation">:</span></span>
<span class="line">		whereCond <span class="token operator">=</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span><span class="token string">"id = ?"</span><span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	dto<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">Get</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> whereCond<span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetViewMask</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> dto<span class="token punctuation">,</span> err</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>UserRepo<span class="token punctuation">)</span> <span class="token function">Create</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> req <span class="token operator">*</span>userV1<span class="token punctuation">.</span>CreateUserRequest<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> req <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> req<span class="token punctuation">.</span>Data <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"request is nil"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Password <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">&amp;&amp;</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span><span class="token function">GetPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		cryptoPassword<span class="token punctuation">,</span> err <span class="token operator">:=</span> crypto<span class="token punctuation">.</span><span class="token function">HashPassword</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span><span class="token function">GetPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Password <span class="token operator">=</span> <span class="token operator">&amp;</span>cryptoPassword</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	result<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">Create</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">,</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> result<span class="token punctuation">,</span> err</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>UserRepo<span class="token punctuation">)</span> <span class="token function">Update</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> req <span class="token operator">*</span>userV1<span class="token punctuation">.</span>UpdateUserRequest<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> req <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> req<span class="token punctuation">.</span>Data <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"request is nil"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Password <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">&amp;&amp;</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span><span class="token function">GetPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		cryptoPassword<span class="token punctuation">,</span> err <span class="token operator">:=</span> crypto<span class="token punctuation">.</span><span class="token function">HashPassword</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span><span class="token function">GetPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Password <span class="token operator">=</span> <span class="token operator">&amp;</span>cryptoPassword</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	result<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">Update</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">,</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetUpdateMask</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> result<span class="token punctuation">,</span> err</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>UserRepo<span class="token punctuation">)</span> <span class="token function">Upsert</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> req <span class="token operator">*</span>userV1<span class="token punctuation">.</span>UpdateUserRequest<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>userV1<span class="token punctuation">.</span>User<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> req <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> req<span class="token punctuation">.</span>Data <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"request is nil"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> err <span class="token builtin">error</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Password <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">&amp;&amp;</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span><span class="token function">GetPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		cryptoPassword<span class="token punctuation">,</span> err <span class="token operator">:=</span> crypto<span class="token punctuation">.</span><span class="token function">HashPassword</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span><span class="token function">GetPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		req<span class="token punctuation">.</span>Data<span class="token punctuation">.</span>Password <span class="token operator">=</span> <span class="token operator">&amp;</span>cryptoPassword</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	result<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">Upsert</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">,</span> req<span class="token punctuation">.</span>Data<span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetUpdateMask</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> result<span class="token punctuation">,</span> err</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>r <span class="token operator">*</span>UserRepo<span class="token punctuation">)</span> <span class="token function">Delete</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> req <span class="token operator">*</span>userV1<span class="token punctuation">.</span>DeleteUserRequest<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token builtin">bool</span><span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> req <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">,</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"request is nil"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	result<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">Delete</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> r<span class="token punctuation">.</span>data<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">Where</span><span class="token punctuation">(</span><span class="token string">"id = ?"</span><span class="token punctuation">,</span> req<span class="token punctuation">.</span><span class="token function">GetId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> result <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">,</span> err</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>核心简化点：对比原生GORM，go-curd的<code v-pre>List</code>、<code v-pre>Get</code>、<code v-pre>Create</code>、<code v-pre>Update</code>、<code v-pre>Upsert</code>、<code v-pre>Delete</code>方法无需编写查询条件，直接传入上下文、模型实例和ID即可，代码更简洁。</p>
<h3 id="_2-3-定义api接口-proto-并生成代码" tabindex="-1"><a class="header-anchor" href="#_2-3-定义api接口-proto-并生成代码"><span>2.3 定义API接口（Proto）并生成代码</span></a></h3>
<p><code v-pre>kratos-gorm-example</code>已在<code v-pre>api/protos/user/service/v1/user.proto</code>中预设了用户API定义，我们只需确认内容（无需修改），然后生成Go代码：</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre v-pre><code><span class="line"><span class="token keyword">syntax</span> <span class="token operator">=</span> <span class="token string">"proto3"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">package</span> user<span class="token punctuation">.</span><span class="token keyword">service</span><span class="token punctuation">.</span>v1<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"gnostic/openapi/v3/annotations.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/protobuf/empty.proto"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/protobuf/timestamp.proto"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/protobuf/field_mask.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"google/api/annotations.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token string">"pagination/v1/pagination.proto"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 用户服务</span></span>
<span class="line"><span class="token keyword">service</span> <span class="token class-name">UserService</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 查询用户列表</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">ListUser</span> <span class="token punctuation">(</span><span class="token class-name">pagination.PagingRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">ListUserResponse</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      get<span class="token punctuation">:</span> <span class="token string">"/users"</span></span>
<span class="line">      additional_bindings <span class="token punctuation">{</span></span>
<span class="line">        post<span class="token punctuation">:</span> <span class="token string">"/users/list"</span></span>
<span class="line">        body<span class="token punctuation">:</span> <span class="token string">"*"</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 查询用户详情</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">GetUser</span> <span class="token punctuation">(</span><span class="token class-name">GetUserRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      get<span class="token punctuation">:</span> <span class="token string">"/users/{id}"</span></span>
<span class="line">      additional_bindings <span class="token punctuation">{</span></span>
<span class="line">        get<span class="token punctuation">:</span> <span class="token string">"/users/username/{user_name}"</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 创建用户</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">CreateUser</span> <span class="token punctuation">(</span><span class="token class-name">CreateUserRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      post<span class="token punctuation">:</span> <span class="token string">"/users"</span></span>
<span class="line">      body<span class="token punctuation">:</span> <span class="token string">"*"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 更新用户</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">UpdateUser</span> <span class="token punctuation">(</span><span class="token class-name">UpdateUserRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">User</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      put<span class="token punctuation">:</span> <span class="token string">"/users/{data.id}"</span></span>
<span class="line">      body<span class="token punctuation">:</span> <span class="token string">"*"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 删除用户</span></span>
<span class="line">  <span class="token keyword">rpc</span> <span class="token function">DeleteUser</span> <span class="token punctuation">(</span><span class="token class-name">DeleteUserRequest</span><span class="token punctuation">)</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token class-name">google.protobuf.Empty</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">option</span> <span class="token punctuation">(</span>google<span class="token punctuation">.</span>api<span class="token punctuation">.</span>http<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      delete<span class="token punctuation">:</span> <span class="token string">"/users/{id}"</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 用户</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">User</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">uint32</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token builtin">string</span> user_name <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"userName"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"账户名"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 账户名</span></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token builtin">string</span> nick_name <span class="token operator">=</span> <span class="token number">3</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"nickName"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"昵称"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 昵称</span></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token builtin">string</span> password <span class="token operator">=</span> <span class="token number">4</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"password"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"密码"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 密码</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token positional-class-name class-name">google<span class="token punctuation">.</span>protobuf<span class="token punctuation">.</span>Timestamp</span> created_at <span class="token operator">=</span> <span class="token number">200</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"createdAt"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"创建时间"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 创建时间</span></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token positional-class-name class-name">google<span class="token punctuation">.</span>protobuf<span class="token punctuation">.</span>Timestamp</span> updated_at <span class="token operator">=</span> <span class="token number">201</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"updatedAt"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"更新时间"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 更新时间</span></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token positional-class-name class-name">google<span class="token punctuation">.</span>protobuf<span class="token punctuation">.</span>Timestamp</span> deleted_at <span class="token operator">=</span> <span class="token number">202</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"deletedAt"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"删除时间"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 删除时间</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 获取用户列表 - 答复</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">ListUserResponse</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">repeated</span> <span class="token positional-class-name class-name">User</span> items <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token builtin">uint64</span> total <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 获取用户数据 - 请求</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">GetUserRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">oneof</span> query_by <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin">uint32</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"用户ID"</span><span class="token punctuation">,</span> read_only<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      json_name <span class="token operator">=</span> <span class="token string">"id"</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 用户ID</span></span>
<span class="line"></span>
<span class="line">    <span class="token builtin">string</span> user_name <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"用户登录名"</span><span class="token punctuation">,</span> read_only<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      json_name <span class="token operator">=</span> <span class="token string">"userName"</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 用户登录名</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token positional-class-name class-name">google<span class="token punctuation">.</span>protobuf<span class="token punctuation">.</span>FieldMask</span> view_mask <span class="token operator">=</span> <span class="token number">100</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"viewMask"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"视图字段过滤器，用于控制返回的字段"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 视图字段过滤器，用于控制返回的字段</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 创建用户 - 请求</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">CreateUserRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token positional-class-name class-name">User</span> data <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token builtin">uint32</span> operator_id <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"operatorId"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"操作者用户ID"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 操作者用户ID</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 更新用户 - 请求</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">UpdateUserRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token positional-class-name class-name">User</span> data <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token positional-class-name class-name">google<span class="token punctuation">.</span>protobuf<span class="token punctuation">.</span>FieldMask</span> update_mask <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"updateMask"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">      description<span class="token punctuation">:</span> <span class="token string">"要更新的字段列表"</span><span class="token punctuation">,</span></span>
<span class="line">      example<span class="token punctuation">:</span> <span class="token punctuation">{</span>yaml <span class="token punctuation">:</span> <span class="token string">"id,realname,username"</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 要更新的字段列表</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">optional</span> <span class="token builtin">bool</span> allow_missing <span class="token operator">=</span> <span class="token number">3</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"allowMissing"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。"</span><span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 删除用户 - 请求</span></span>
<span class="line"><span class="token keyword">message</span> <span class="token class-name">DeleteUserRequest</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token builtin">uint32</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token builtin">uint32</span> operator_id <span class="token operator">=</span> <span class="token number">2</span> <span class="token punctuation">[</span><span class="token annotation">json_name</span> <span class="token operator">=</span> <span class="token string">"operatorId"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>gnostic<span class="token punctuation">.</span>openapi<span class="token punctuation">.</span>v3<span class="token punctuation">.</span>property<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"操作者用户ID"</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">// 操作者用户ID</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行以下命令生成Go代码（项目已预设<code v-pre>make api</code>命令）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">make</span> api</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>生成的代码会放在<code v-pre>api/gen/go/user/service/v1</code>目录下，供<code v-pre>Data层</code>和<code v-pre>Service层</code>调用。</p>
<h3 id="_2-4-server-层绑定接口与-service" tabindex="-1"><a class="header-anchor" href="#_2-4-server-层绑定接口与-service"><span>2.4 Server 层绑定接口与 Service</span></a></h3>
<p><code v-pre>kratos-gorm-example</code> 通过<code v-pre>NewRESTServer</code>方法完成 <code v-pre>HTTP Server</code> 的创建，并将 <code v-pre>UserService</code> 注册到 <code v-pre>Kratos</code> 的 <code v-pre>HTTP</code> 服务中，实现 API 接口与 <code v-pre>Service</code> 层的绑定。核心代码如下（文件路径：<code v-pre>app/user/service/internal/server/rest.go</code>）：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// NewRESTServer new an HTTP server.</span></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewRESTServer</span><span class="token punctuation">(</span></span>
<span class="line">	cfg <span class="token operator">*</span>conf<span class="token punctuation">.</span>Bootstrap<span class="token punctuation">,</span> logger log<span class="token punctuation">.</span>Logger<span class="token punctuation">,</span></span>
<span class="line">	userService <span class="token operator">*</span>service<span class="token punctuation">.</span>UserService<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span> <span class="token operator">*</span>http<span class="token punctuation">.</span>Server <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> cfg <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> cfg<span class="token punctuation">.</span>Server <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> cfg<span class="token punctuation">.</span>Server<span class="token punctuation">.</span>Rest <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	srv <span class="token operator">:=</span> bootstrap<span class="token punctuation">.</span><span class="token function">CreateRestServer</span><span class="token punctuation">(</span>cfg<span class="token punctuation">,</span> logging<span class="token punctuation">.</span><span class="token function">Server</span><span class="token punctuation">(</span>logger<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	userV1<span class="token punctuation">.</span><span class="token function">RegisterUserServiceHTTPServer</span><span class="token punctuation">(</span>srv<span class="token punctuation">,</span> userService<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> cfg<span class="token punctuation">.</span><span class="token function">GetServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">GetRest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">GetEnableSwagger</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		swaggerUI<span class="token punctuation">.</span><span class="token function">RegisterSwaggerUIServerWithOption</span><span class="token punctuation">(</span></span>
<span class="line">			srv<span class="token punctuation">,</span></span>
<span class="line">			swaggerUI<span class="token punctuation">.</span><span class="token function">WithTitle</span><span class="token punctuation">(</span><span class="token string">"Kratos GORM Example User Service API"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">			swaggerUI<span class="token punctuation">.</span><span class="token function">WithMemoryData</span><span class="token punctuation">(</span>assets<span class="token punctuation">.</span>OpenApiData<span class="token punctuation">,</span> <span class="token string">"yaml"</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> srv</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码说明：</p>
<ol>
<li><code v-pre>bootstrap.CreateRestServer</code>：基于配置创建 Kratos 的 HTTP Server 实例，包含端口、中间件等基础配置；</li>
<li><code v-pre>userV1.RegisterUserServiceHTTPServer</code>：将实现了<code v-pre>UserService</code>接口的<code v-pre>userService</code>实例注册到 HTTP Server 中，完成 API 接口（如<code v-pre>/users</code>）与 <code v-pre>Service</code> 层方法的绑定；</li>
<li>Swagger 相关配置：可选开启 Swagger UI，方便调试 API 接口。</li>
</ol>
<p>此步骤无需手动修改代码（项目已实现），只需验证该文件存在且代码完整即可 —— 启动服务后，Kratos 会自动将 HTTP 请求转发到对应的 Service 层方法。</p>
<h2 id="五、核心步骤3-运行项目并测试crud接口" tabindex="-1"><a class="header-anchor" href="#五、核心步骤3-运行项目并测试crud接口"><span>五、核心步骤3：运行项目并测试CRUD接口</span></a></h2>
<p>所有代码修改完成后，启动项目并测试接口，验证go-curd是否正常工作。</p>
<h3 id="_3-1-自动创建数据库表-gorm自动迁移" tabindex="-1"><a class="header-anchor" href="#_3-1-自动创建数据库表-gorm自动迁移"><span>3.1 自动创建数据库表（GORM自动迁移）</span></a></h3>
<p><code v-pre>kratos-gorm-example</code>已在<code v-pre>app/user/service/internal/data/gorm_client.go</code>中实现了GORM自动迁移逻辑，启动项目时会自动根据<code v-pre>User模型</code>创建<code v-pre>users表</code>：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 关键迁移代码（项目已实现）</span></span>
<span class="line"><span class="token keyword">if</span> err <span class="token operator">:=</span> data<span class="token punctuation">.</span><span class="token function">DB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AutoMigrate</span><span class="token punctuation">(</span></span>
<span class="line">  <span class="token operator">&amp;</span>model<span class="token punctuation">.</span>User<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">// 自动迁移User模型到数据库表</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">  log<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token string">"迁移数据库表失败："</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">  <span class="token keyword">return</span> err</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-启动项目" tabindex="-1"><a class="header-anchor" href="#_3-2-启动项目"><span>3.2 启动项目</span></a></h3>
<p>在项目的服务目录<code v-pre>app/user/service</code>下执行以下命令启动服务：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">make</span> run</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>看到终端输出下面的文本或类似日志，说明项目启动成功：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">DEBUG <span class="token assign-left variable">msg</span><span class="token operator">=</span>config loaded: client.yaml format: yaml</span>
<span class="line">DEBUG <span class="token assign-left variable">msg</span><span class="token operator">=</span>config loaded: data.yaml format: yaml</span>
<span class="line">DEBUG <span class="token assign-left variable">msg</span><span class="token operator">=</span>config loaded: logger.yaml format: yaml</span>
<span class="line">DEBUG <span class="token assign-left variable">msg</span><span class="token operator">=</span>config loaded: server.yaml format: yaml</span>
<span class="line">DEBUG <span class="token assign-left variable">msg</span><span class="token operator">=</span>config loaded: tracer.yaml format: yaml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-测试接口-用curl或postman" tabindex="-1"><a class="header-anchor" href="#_3-3-测试接口-用curl或postman"><span>3.3 测试接口（用curl或Postman）</span></a></h3>
<p>以下用curl命令测试4个CRUD接口，确保功能正常：</p>
<h4 id="_1-创建用户" tabindex="-1"><a class="header-anchor" href="#_1-创建用户"><span>1. 创建用户：</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> <span class="token string">'POST'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token string">'http://localhost:7788/users'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">'accept: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">'Content-Type: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-d</span> <span class="token string">'{</span>
<span class="line">  "data": {</span>
<span class="line">    "id": 0,</span>
<span class="line">    "userName": "zhangsan",</span>
<span class="line">    "nickName": "张三",</span>
<span class="line">    "password": "123456"</span>
<span class="line">  }</span>
<span class="line">}'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>成功响应：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"id"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">//（ID为自动生成的主键）。</span></span>
<span class="line">  <span class="token property">"userName"</span><span class="token operator">:</span> <span class="token string">"zhangsan"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"nickName"</span><span class="token operator">:</span> <span class="token string">"张三"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"password"</span><span class="token operator">:</span> <span class="token string">"$2a$10$Jd34ATGgTJ2sV7xvPruMLONArXk9KYQ2O6XDY42UxVO37p5DO8CVu"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"createdAt"</span><span class="token operator">:</span> <span class="token string">"1970-01-01T00:00:00Z"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"updatedAt"</span><span class="token operator">:</span> <span class="token string">"1970-01-01T00:00:00Z"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-查询用户-使用上面返回的id-1" tabindex="-1"><a class="header-anchor" href="#_2-查询用户-使用上面返回的id-1"><span>2. 查询用户（使用上面返回的ID=1）：</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> <span class="token string">'GET'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token string">'http://localhost:7788/users/1'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">'accept: application/json'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>成功响应：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"id"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"userName"</span><span class="token operator">:</span> <span class="token string">"zhangsan"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"nickName"</span><span class="token operator">:</span> <span class="token string">"张三"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"password"</span><span class="token operator">:</span> <span class="token string">"$2a$10$Jd34ATGgTJ2sV7xvPruMLONArXk9KYQ2O6XDY42UxVO37p5DO8CVu"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"createdAt"</span><span class="token operator">:</span> <span class="token string">"1970-01-01T00:00:00Z"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"updatedAt"</span><span class="token operator">:</span> <span class="token string">"1970-01-01T00:00:00Z"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-更新用户" tabindex="-1"><a class="header-anchor" href="#_3-更新用户"><span>3. 更新用户：</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> <span class="token string">'PUT'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token string">'http://localhost:7788/users/1'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">'accept: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">'Content-Type: application/json'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-d</span> <span class="token string">'{</span>
<span class="line">  "data": {</span>
<span class="line">    "id": 1,</span>
<span class="line">    "userName": "zhangsan",</span>
<span class="line">    "nickName": "张三三"</span>
<span class="line">  }</span>
<span class="line">}'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>成功响应：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"id"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"userName"</span><span class="token operator">:</span> <span class="token string">"zhangsan"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"nickName"</span><span class="token operator">:</span> <span class="token string">"张三三"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"password"</span><span class="token operator">:</span> <span class="token string">"$2a$10$Jd34ATGgTJ2sV7xvPruMLONArXk9KYQ2O6XDY42UxVO37p5DO8CVu"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"createdAt"</span><span class="token operator">:</span> <span class="token string">"1970-01-01T00:00:00Z"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"updatedAt"</span><span class="token operator">:</span> <span class="token string">"1970-01-01T00:00:00Z"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-删除用户" tabindex="-1"><a class="header-anchor" href="#_4-删除用户"><span>4. 删除用户：</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> <span class="token string">'DELETE'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token string">'http://localhost:7788/users/1'</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">'accept: */*'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>成功响应：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="六、新手避坑注意事项" tabindex="-1"><a class="header-anchor" href="#六、新手避坑注意事项"><span>六、新手避坑注意事项</span></a></h2>
<ol>
<li>
<p><strong>依赖版本兼容</strong>：go-curd仅支持GORM v2版本，kratos-gorm-example已使用GORM v2，无需额外调整；若手动升级依赖，避免安装GORM v1。</p>
</li>
<li>
<p><strong>数据库配置错误</strong>：务必修改<code v-pre>configs/data.yaml</code>中的<code v-pre>source</code>字段，确保MySQL用户名、密码、数据库名正确，否则会出现连接失败错误。</p>
</li>
<li>
<p><strong>模型字段与Proto类型匹配</strong>：Proto中的<code v-pre>age</code>是<code v-pre>int32</code>类型，Model中的<code v-pre>Age</code>需对应<code v-pre>int32</code>（而非<code v-pre>int</code>），否则会出现类型转换错误。</p>
</li>
<li>
<p><strong>go-curd方法调用规范</strong>：调用<code v-pre>Get</code>、<code v-pre>Delete</code>时，第二个参数必须是模型实例的指针（如<code v-pre>&amp;user</code>），不能直接传结构体。</p>
</li>
<li>
<p><strong>自动迁移仅用于开发环境</strong>：GORM的<code v-pre>AutoMigrate</code>仅适合开发阶段快速创建表，生产环境建议使用数据库迁移工具（如<code v-pre>gorm-migrate</code>）管理表结构。</p>
</li>
</ol>
<h2 id="七、总结" tabindex="-1"><a class="header-anchor" href="#七、总结"><span>七、总结</span></a></h2>
<p>基于kratos-gorm-example项目集成go-curd的核心逻辑非常简单：<strong>在现有GORM连接基础上初始化go-curd客户端，然后用其封装的现成方法替代原生GORM CRUD代码</strong>。相比直接编写GORM代码，go-curd帮我们节省了大量重复工作，让业务逻辑更简洁。</p>
<p>如果需要扩展其他模块（如订单、商品），只需复制用户模块的逻辑：定义模型→在Service层用go-curd实现CRUD→绑定API接口即可。若遇到问题，可参考两个项目的官方GitHub文档（<a href="(https://github.com/tx7do/go-crud)">go-curd</a>、<a href="(https://github.com/tx7do/kratos-gorm-example)">kratos-gorm-example</a>）获取更多细节。</p>
</div></template>


