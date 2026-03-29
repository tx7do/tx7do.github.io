<template><div><h1 id="golang微服务框架kratos应用分布式计划任务队列asynq" tabindex="-1"><a class="header-anchor" href="#golang微服务框架kratos应用分布式计划任务队列asynq"><span>Golang微服务框架Kratos应用分布式计划任务队列Asynq</span></a></h1>
<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>
<p>任务队列的输入是称为<code v-pre>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>
<p>在Golang语言里面，我们有像<a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq</a>和<a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery</a>这样的类似于<code v-pre>Celery</code>的分布式任务队列。</p>
<h2 id="什么是任务队列" tabindex="-1"><a class="header-anchor" href="#什么是任务队列"><span>什么是任务队列</span></a></h2>
<p>消息队列（Message Queue），一般来说知道的人不少。比如常见的：kafka、Rabbitmq、RocketMQ等。</p>
<p>任务队列（Task Queue），听说过这个概念的人不会太多，清楚它的概念的人怕是更少。</p>
<p>这两个概念是有关系的，他们是怎样的关系呢？任务队列（Task Queue）是消息队列（Message Queue）的超集。任务队列是构建在消息队列之上的。消息队列是任务队列的一部分。</p>
<p>提起<strong>分布式任务队列（Distributed Task Queue）</strong>，就不得不提<code v-pre>Python</code>的<a href="https://github.com/celery/celery" target="_blank" rel="noopener noreferrer">Celery</a>。故而，下面我们来看Celery的架构图，以此来讲解。其他的任务队列也并不会与之有太大的差异性，基础的原理是一致的。</p>
<p><img src="https://tx7do.github.io/assets/images/task_queue/celery_framework.png" alt="Celery架构图"></p>
<p>在 <code v-pre>Celery</code> 的架构中，由多台 Server 发起<code v-pre>异步任务（Async Task）</code>，发送任务到 <code v-pre>Broker</code> 的队列中，其中的 <code v-pre>Celery Beat</code> 进程可负责发起定时任务。当 <code v-pre>Task</code> 到达 <code v-pre>Broker</code> 后，会将其分发给相应的 <code v-pre>Celery Worker</code> 进行处理。当 <code v-pre>Task</code> 处理完成后，其结果存储至 <code v-pre>Backend</code>。</p>
<p>在上述过程中的 <code v-pre>Broker</code> 和 <code v-pre>Backend</code>，<code v-pre>Celery</code> 并没有去实现，而是使用了已有的开源实现，例如 <code v-pre>RabbitMQ</code> 作为 <code v-pre>Broker</code> 提供消息队列服务，<code v-pre>Redis</code> 作为 <code v-pre>Backend</code> 提供结果存储服务。Celery 就像是抽象了消息队列架构中 <code v-pre>Producer</code>、<code v-pre>Consumer</code> 的实现，将消息队列中基本单位<code v-pre>“消息”</code>抽象成了任务队列中的“任务”，并将异步、定时任务的发起和结果存储等操作进行了封装，让开发者可以忽略 AMQP、RabbitMQ 等实现细节，为开发带来便利。</p>
<p>综上所述，Celery 作为任务队列是基于消息队列的进一步封装，其实现依赖消息队列。</p>
<h2 id="任务队列的应用场景" tabindex="-1"><a class="header-anchor" href="#任务队列的应用场景"><span>任务队列的应用场景</span></a></h2>
<p>我们现在知道了任务队列是什么，也知道了它的工作原理。但是，我们并不知道它可以用来做什么。下面，我们就来看看，它到底用在什么样的场景下。</p>
<ol>
<li>分布式任务：可以将任务分发到多个工作者进程或机器上执行，以提高任务处理速度。</li>
<li>定时任务：可以在指定时间执行任务。例如：每天定时备份数据、日志归档、心跳测试、运维巡检。支持 crontab 定时模式</li>
<li>后台任务：可以在后台执行耗时任务，例如图像处理、数据分析等，不影响用户界面的响应。</li>
<li>解耦任务：可以将任务与主程序解耦，以提高代码的可读性和可维护性，解耦应用程序最直接的好处就是可扩展性和并发性能的提高。支持并发执行任务，同时支持自动动态扩展。</li>
<li>实时处理：可以支持实时处理任务，例如即时通讯、消息队列等。</li>
</ol>
<h2 id="asynq概述" tabindex="-1"><a class="header-anchor" href="#asynq概述"><span>Asynq概述</span></a></h2>
<p>Asynq是一个使用Go语言实现的分布式任务队列和异步处理库，它由Redis提供支持，它提供了轻量级的、易于使用的API，并且具有高可扩展性和高可定制化性。其作者Ken Hibino，任职于Google。</p>
<p>Asynq主要由以下几个组件组成：</p>
<ul>
<li>任务(Task)：需要被异步执行的操作；</li>
<li>处理器(Processor)：负责执行任务的工作进程；</li>
<li>队列(Queue)：存放待执行任务的队列；</li>
<li>调度器(Scheduler)：根据规则将任务分配给不同的处理器进行执行。</li>
</ul>
<p><img src="https://tx7do.github.io/assets/images/task_queue/asynq_framework.png" alt="Asynq Framework"></p>
<p>通过使用Asynq，我们可以非常轻松的实现异步任务处理，同时还可以提供高效率、高可扩展性和高自定义性的处理方案。</p>
<h2 id="asynq的特点" tabindex="-1"><a class="header-anchor" href="#asynq的特点"><span>Asynq的特点</span></a></h2>
<ul>
<li>保证至少执行一次任务</li>
<li>任务写入Redis后可以持久化</li>
<li>任务失败之后，会自动重试</li>
<li>worker崩溃自动恢复</li>
<li>可是实现任务的优先级</li>
<li>任务可以进行编排</li>
<li>任务可以设定执行时间或者最长可执行的时间</li>
<li>支持中间件</li>
<li>可以使用 unique-option 来避免任务重复执行，实现唯一性</li>
<li>支持 Redis Cluster 和 Redis Sentinels 以达成高可用性</li>
<li>作者提供了Web UI &amp; CLI Tool让大家查看任务的执行情况</li>
</ul>
<h2 id="asynq可视化监控" tabindex="-1"><a class="header-anchor" href="#asynq可视化监控"><span>Asynq可视化监控</span></a></h2>
<p>Asynq提供了两种监控手段：CLI和Web UI。</p>
<h3 id="命令行工具cli" tabindex="-1"><a class="header-anchor" href="#命令行工具cli"><span>命令行工具CLI</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/hibiken/asynq/tools/asynq@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="web-ui" tabindex="-1"><a class="header-anchor" href="#web-ui"><span>Web UI</span></a></h3>
<p><a href="https://github.com/hibiken/asynqmon" target="_blank" rel="noopener noreferrer">Asynqmon</a>是一个基于Web的工具，用于监视管理Asynq的任务和队列，有关详细的信息可以参阅工具的README。</p>
<p>Web UI我们可以通过Docker的方式来进行安装：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull hibiken/asynqmon:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> asynqmon <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">8080</span>:8080 <span class="token punctuation">\</span></span>
<span class="line">    hibiken/asynqmon:latest <span class="token punctuation">\</span></span>
<span class="line">    --redis-url<span class="token operator">=</span>redis://:*Abcd123456@host.docker.internal:6379/1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装好Web UI之后，我们就可以打开浏览器访问管理后台了：<a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080</a></p>
<ul>
<li>仪表盘</li>
</ul>
<p><img src="https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_dashboard.png" alt="AsynqMon Dashboard"></p>
<ul>
<li>任务视图</li>
</ul>
<p><img src="https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_task_view.png" alt="AsynqMon Task View"></p>
<ul>
<li>性能</li>
</ul>
<p><img src="https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_metrics.png" alt="AsynqMon Metrics"></p>
<h2 id="kratos下如何应用asynq" tabindex="-1"><a class="header-anchor" href="#kratos下如何应用asynq"><span>Kratos下如何应用Asynq？</span></a></h2>
<p>我们将分布式任务队列以<code v-pre>transport.Server</code>的形式整合进微服务框架<code v-pre>Kratos</code>。</p>
<p>目前，go里面有两个分布式任务队列可用：</p>
<ul>
<li><a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq</a></li>
<li><a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery</a></li>
</ul>
<p>我已经对这两个库进行了支持：</p>
<ul>
<li><a href="https://github.com/tx7do/kratos-transport/tree/main/transport/asynq" target="_blank" rel="noopener noreferrer">kratos-transport/Asynq</a></li>
<li><a href="https://github.com/tx7do/kratos-transport/tree/main/transport/machinery" target="_blank" rel="noopener noreferrer">kratos-transport/Machinery</a></li>
</ul>
<h3 id="docker部署依赖组件" tabindex="-1"><a class="header-anchor" href="#docker部署依赖组件"><span>Docker部署依赖组件</span></a></h3>
<p>因为它依赖Redis，因此，我们使用Docker的方式安装Redis的服务器：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/redis:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> redis-test <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">6379</span>:6379 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-e</span> <span class="token assign-left variable">ALLOW_EMPTY_PASSWORD</span><span class="token operator">=</span>yes <span class="token punctuation">\</span></span>
<span class="line">    bitnami/redis:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装依赖库" tabindex="-1"><a class="header-anchor" href="#安装依赖库"><span>安装依赖库</span></a></h3>
<p>我们需要在项目中安装Asynq的依赖库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go get <span class="token parameter variable">-u</span> github.com/tx7do/kratos-transport/transport/asynq</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="创建kratos服务端" tabindex="-1"><a class="header-anchor" href="#创建kratos服务端"><span>创建Kratos服务端</span></a></h3>
<p>我们在代码当中引入库，并且创建出来<code v-pre>Server</code>：</p>
<p>首先，我们要创建<code v-pre>Server</code>：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> server</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token operator">...</span></span>
<span class="line">	<span class="token string">"github.com/tx7do/kratos-transport/transport/asynq"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// NewAsynqServer create a asynq server.</span></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewAsynqServer</span><span class="token punctuation">(</span>cfg <span class="token operator">*</span>conf<span class="token punctuation">.</span>Bootstrap<span class="token punctuation">,</span> <span class="token boolean">_</span> log<span class="token punctuation">.</span>Logger<span class="token punctuation">,</span> svc <span class="token operator">*</span>service<span class="token punctuation">.</span>TaskService<span class="token punctuation">)</span> <span class="token operator">*</span>machinery<span class="token punctuation">.</span>Server <span class="token punctuation">{</span></span>
<span class="line">	ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	srv <span class="token operator">:=</span> asynq<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">        asynq<span class="token punctuation">.</span><span class="token function">WithAddress</span><span class="token punctuation">(</span>cfg<span class="token punctuation">.</span>Server<span class="token punctuation">.</span>Asynq<span class="token punctuation">.</span>Broker<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token function">registerAsynqTasks</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> srv<span class="token punctuation">,</span> svc<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> srv</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="注册任务回调" tabindex="-1"><a class="header-anchor" href="#注册任务回调"><span>注册任务回调</span></a></h3>
<p>然后，把回调函数注册进服务器：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">const</span> <span class="token punctuation">(</span></span>
<span class="line">	testTask1        <span class="token operator">=</span> <span class="token string">"test_task_1"</span></span>
<span class="line">	testDelayTask    <span class="token operator">=</span> <span class="token string">"test_delay_task"</span></span>
<span class="line">	testPeriodicTask <span class="token operator">=</span> <span class="token string">"test_periodic_task"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> TaskPayload <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Message <span class="token builtin">string</span> <span class="token string">`json:"message"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">registerAsynqTasks</span><span class="token punctuation">(</span>ctx context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> srv <span class="token operator">*</span>asynq<span class="token punctuation">.</span>Server<span class="token punctuation">,</span> svc <span class="token operator">*</span>service<span class="token punctuation">.</span>TaskService<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> err <span class="token builtin">error</span></span>
<span class="line">    err <span class="token operator">=</span> asynq<span class="token punctuation">.</span><span class="token function">RegisterSubscriber</span><span class="token punctuation">(</span>srv<span class="token punctuation">,</span> testTask1<span class="token punctuation">,</span> svc<span class="token punctuation">.</span>HandleTask1<span class="token punctuation">)</span></span>
<span class="line">    err <span class="token operator">=</span> asynq<span class="token punctuation">.</span><span class="token function">RegisterSubscriber</span><span class="token punctuation">(</span>srv<span class="token punctuation">,</span> testDelayTask<span class="token punctuation">,</span> svc<span class="token punctuation">.</span>HandleDelayTask<span class="token punctuation">)</span></span>
<span class="line">    err <span class="token operator">=</span> asynq<span class="token punctuation">.</span><span class="token function">RegisterSubscriber</span><span class="token punctuation">(</span>srv<span class="token punctuation">,</span> testPeriodicTask<span class="token punctuation">,</span> svc<span class="token punctuation">.</span>HandlePeriodicTask<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="asynq服务器注册到kratos" tabindex="-1"><a class="header-anchor" href="#asynq服务器注册到kratos"><span>Asynq服务器注册到Kratos</span></a></h3>
<p>接着，调用<code v-pre>kratos.Server</code>把Asynq服务器注册到Kratos里去：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">newApp</span><span class="token punctuation">(</span>ll log<span class="token punctuation">.</span>Logger<span class="token punctuation">,</span> rr registry<span class="token punctuation">.</span>Registrar<span class="token punctuation">,</span> ks <span class="token operator">*</span>asynq<span class="token punctuation">.</span>Server<span class="token punctuation">)</span> <span class="token operator">*</span>kratos<span class="token punctuation">.</span>App <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">return</span> kratos<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">ID</span><span class="token punctuation">(</span>Service<span class="token punctuation">.</span><span class="token function">GetInstanceId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">Name</span><span class="token punctuation">(</span>Service<span class="token punctuation">.</span>Name<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">Version</span><span class="token punctuation">(</span>Service<span class="token punctuation">.</span>Version<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">Metadata</span><span class="token punctuation">(</span>Service<span class="token punctuation">.</span>Metadata<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">Logger</span><span class="token punctuation">(</span>ll<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">Server</span><span class="token punctuation">(</span></span>
<span class="line">			ks<span class="token punctuation">,</span></span>
<span class="line">		<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">		kratos<span class="token punctuation">.</span><span class="token function">Registrar</span><span class="token punctuation">(</span>rr<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现任务回调方法" tabindex="-1"><a class="header-anchor" href="#实现任务回调方法"><span>实现任务回调方法</span></a></h3>
<p>最后，我们就可以在<code v-pre>Service</code>里愉快的玩耍了：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">package</span> service</span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> TaskService <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	log          <span class="token operator">*</span>log<span class="token punctuation">.</span>Helper</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewTaskService</span><span class="token punctuation">(</span></span>
<span class="line">	logger log<span class="token punctuation">.</span>Logger<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span> <span class="token operator">*</span>TaskService <span class="token punctuation">{</span></span>
<span class="line">	l <span class="token operator">:=</span> log<span class="token punctuation">.</span><span class="token function">NewHelper</span><span class="token punctuation">(</span>log<span class="token punctuation">.</span><span class="token function">With</span><span class="token punctuation">(</span>logger<span class="token punctuation">,</span> <span class="token string">"module"</span><span class="token punctuation">,</span> <span class="token string">"task/service/logger-service"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>TaskService<span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">:</span>          l<span class="token punctuation">,</span></span>
<span class="line">		statusRepo<span class="token punctuation">:</span>   statusRepo<span class="token punctuation">,</span></span>
<span class="line">		realtimeRepo<span class="token punctuation">:</span> realtimeRepo<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>TaskService<span class="token punctuation">)</span> <span class="token function">HandleTask1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"################ 执行任务Task1 #################"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>TaskService<span class="token punctuation">)</span> <span class="token function">HandleTask1</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> taskData <span class="token operator">*</span>TaskPayload<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span>log<span class="token punctuation">.</span><span class="token function">Infof</span><span class="token punctuation">(</span><span class="token string">"[%s] Task Type: [%s], Payload: [%s]"</span><span class="token punctuation">,</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Format</span><span class="token punctuation">(</span><span class="token string">"2006-01-02 15:04:05"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> taskType<span class="token punctuation">,</span> taskData<span class="token punctuation">.</span>Message<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>TaskService<span class="token punctuation">)</span> <span class="token function">HandleDelayTask</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> taskData <span class="token operator">*</span>TaskPayload<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span>log<span class="token punctuation">.</span><span class="token function">Infof</span><span class="token punctuation">(</span><span class="token string">"[%s] Delay Task Type: [%s], Payload: [%s]"</span><span class="token punctuation">,</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Format</span><span class="token punctuation">(</span><span class="token string">"2006-01-02 15:04:05"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> taskType<span class="token punctuation">,</span> taskData<span class="token punctuation">.</span>Message<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>TaskService<span class="token punctuation">)</span> <span class="token function">HandlePeriodicTask</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> taskData <span class="token operator">*</span>TaskPayload<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	s<span class="token punctuation">.</span>log<span class="token punctuation">.</span><span class="token function">Infof</span><span class="token punctuation">(</span><span class="token string">"[%s] Periodic Task Type: [%s], Payload: [%s]"</span><span class="token punctuation">,</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Format</span><span class="token punctuation">(</span><span class="token string">"2006-01-02 15:04:05"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> taskType<span class="token punctuation">,</span> taskData<span class="token punctuation">.</span>Message<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建新任务" tabindex="-1"><a class="header-anchor" href="#创建新任务"><span>创建新任务</span></a></h3>
<p>新建任务，有两个方法：<code v-pre>NewTask</code>和<code v-pre>NewPeriodicTask</code>，内部分别对应着<code v-pre>asynq.Client</code>和<code v-pre>asynq.Scheduler</code>。</p>
<p><code v-pre>NewTask</code>是通过<code v-pre>asynq.Client</code>将任务直接入了队列。</p>
<h4 id="普通任务" tabindex="-1"><a class="header-anchor" href="#普通任务"><span>普通任务</span></a></h4>
<p>普通任务通常是入列后立即执行的（如果不需要排队的），下面就是最简单的任务，一个类型(Type)，一个负载数据(Payload)就构成了一个最简单的任务：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testTask1<span class="token punctuation">,</span> </span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"delay task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，你也可以添加一些的参数，比如重试次数、超时时间、过期时间等……</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 最多重试3次，10秒超时，20秒后过期</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testTask1<span class="token punctuation">,</span> </span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"delay task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">MaxRetry</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">Timeout</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">Deadline</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="延迟任务-delay-task" tabindex="-1"><a class="header-anchor" href="#延迟任务-delay-task"><span>延迟任务(Delay Task)</span></a></h4>
<p>延迟任务，顾名思义，也就是推迟到指定时间执行的任务，我们可以有两个参数可以注入：<code v-pre>ProcessAt</code>和<code v-pre>ProcessIn</code>。</p>
<p><code v-pre>ProcessIn</code>指的是从现在开始推迟多少时间执行：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 3秒后执行</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testDelayTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"delay task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">ProcessIn</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>ProcessAt</code>指的是在指定的某一个具体时间执行：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 1小时后的时间点执行</span></span>
<span class="line">oneHourLater <span class="token operator">:=</span> now<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span>Hour<span class="token punctuation">)</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testDelayTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"delay task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">ProcessAt</span><span class="token punctuation">(</span>oneHourLater<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="周期性任务-periodic-task" tabindex="-1"><a class="header-anchor" href="#周期性任务-periodic-task"><span>周期性任务(Periodic Task)</span></a></h4>
<p>周期性任务<code v-pre>asynq.Scheduler</code>内部是通过Crontab来实现定时的，定时器到点之后，就调度任务。它默认使用的是UTC时区。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 每分钟执行一次</span></span>
<span class="line"><span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewPeriodicTask</span><span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"*/1 * * * ?"</span><span class="token punctuation">,</span></span>
<span class="line">    testPeriodicTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"periodic task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，若要保证周期性任务的持续调度执行，<code v-pre>asynq.Scheduler</code>必须要一直运行着，否则调度将不会发生。调度器本身不参与任务的执行，但是没有它的存在，调度将不不复存在，也不会发生。</p>
<h2 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码"><span>示例代码</span></a></h2>
<p>示例代码可以在单元测试代码中找到：<a href="https://github.com/tx7do/kratos-transport/tree/main/transport/asynq/server_test.go" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/kratos-transport/tree/main/transport/asynq/server_test.go</a></p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq - Github</a></li>
<li><a href="https://github.com/celery/celery" target="_blank" rel="noopener noreferrer">Celery - Github</a></li>
<li><a href="https://www.celerycn.io/ru-men/celery-jian-jie" target="_blank" rel="noopener noreferrer">Celery 简介</a></li>
<li><a href="https://cloud.tencent.com/developer/article/1898147" target="_blank" rel="noopener noreferrer">分布式任务队列Celery的实践</a></li>
<li><a href="https://blog.51cto.com/u_15301988/3080859" target="_blank" rel="noopener noreferrer">分布式任务队列 Celery</a></li>
<li><a href="https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830" target="_blank" rel="noopener noreferrer">Asynq: Golang distributed task queue library</a></li>
<li><a href="https://www.51cto.com/article/707654.html" target="_blank" rel="noopener noreferrer">异步任务处理系统，如何解决业务长耗时、高并发难题？</a></li>
<li><a href="https://dev.to/koddr/asynq-simple-reliable-efficient-distributed-task-queue-for-your-next-go-project-4jhg" target="_blank" rel="noopener noreferrer">Asynq: simple, reliable &amp; efficient distributed task queue for your next Go project</a></li>
<li><a href="https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830" target="_blank" rel="noopener noreferrer">Asynq: Golang distributed task queue library</a></li>
</ul>
</div></template>


