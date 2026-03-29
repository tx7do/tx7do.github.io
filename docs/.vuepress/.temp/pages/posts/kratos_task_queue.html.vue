<template><div><h1 id="golang微服务框架kratos实现分布式任务队列" tabindex="-1"><a class="header-anchor" href="#golang微服务框架kratos实现分布式任务队列"><span>golang微服务框架Kratos实现分布式任务队列</span></a></h1>
<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>
<p>任务队列的输入是称为<code v-pre>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>
<p>在Golang语言里面，我们有像<a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq</a>和<a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery</a>这样的类似于<code v-pre>Celery</code>的分布式任务队列。</p>
<h2 id="什么是任务队列" tabindex="-1"><a class="header-anchor" href="#什么是任务队列"><span>什么是任务队列</span></a></h2>
<p>消息队列（Message Queue），一般来说知道的人不少。比如常见的：kafka、Rabbitmq、RocketMQ等。</p>
<p>任务队列（Task Queue），听说过这个概念的人不会太多，清楚它的概念的人怕是更少。</p>
<p>这两个概念是有关系的，他们是怎样的关系呢？任务队列（Task Queue）是消息队列（Message Queue）的超集。任务队列是构建在消息队列之上的。消息队列是任务队列的一部分。</p>
<p>提起<strong>分布式任务队列（Distributed Task Queue）</strong>，就不得不提<code v-pre>Python</code>的<a href="https://github.com/celery/celery" target="_blank" rel="noopener noreferrer">Celery</a>。故而，下面我们来看Celery的架构图，以此来讲解。其他的任务队列也并不会与之有太大的差异性，基础的原理是一致的。</p>
<p><img src="/assets/images/task_queue/celery_framework.png" alt="Celery架构图"></p>
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
<h2 id="kratos下实现分布式任务队列" tabindex="-1"><a class="header-anchor" href="#kratos下实现分布式任务队列"><span>Kratos下实现分布式任务队列</span></a></h2>
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
<h3 id="asynq" tabindex="-1"><a class="header-anchor" href="#asynq"><span>Asynq</span></a></h3>
<p>Asynq是一个go语言实现的分布式任务队列和异步处理库，基于Redis。类似于Python的Celery。作者Ken Hibino，任职于Google。</p>
<h4 id="特点" tabindex="-1"><a class="header-anchor" href="#特点"><span>特点</span></a></h4>
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
<h4 id="安装命令行工具" tabindex="-1"><a class="header-anchor" href="#安装命令行工具"><span>安装命令行工具</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/hibiken/asynq/tools/asynq@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>它能够进行如下的操作：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Command line tool to inspect tasks and queues managed by Asynq</span>
<span class="line"></span>
<span class="line">USAGE</span>
<span class="line">  asynq <span class="token operator">&lt;</span>command<span class="token operator">></span> <span class="token operator">&lt;</span>subcommand<span class="token operator">></span> <span class="token punctuation">[</span>flags<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">COMMANDS</span>
<span class="line">  cron:           Manage <span class="token function">cron</span></span>
<span class="line">  dash:           View dashboard</span>
<span class="line">  group:          Manage <span class="token function">groups</span></span>
<span class="line">  queue:          Manage queues</span>
<span class="line">  server:         Manage servers</span>
<span class="line">  stats:          View current state</span>
<span class="line">  task:           Manage tasks</span>
<span class="line"></span>
<span class="line">FLAGS</span>
<span class="line">  <span class="token parameter variable">--cluster</span>       Connect to redis cluster</span>
<span class="line">  <span class="token parameter variable">--cluster_addrs</span> List of comma-separated redis server addresses</span>
<span class="line">  <span class="token parameter variable">--config</span>        Config <span class="token function">file</span> to <span class="token builtin class-name">set</span> flag defaut values <span class="token punctuation">(</span>default is <span class="token environment constant">$HOME</span>/.asynq.yaml<span class="token punctuation">)</span></span>
<span class="line">  <span class="token parameter variable">--db</span>            Redis database number <span class="token punctuation">(</span>default is <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token parameter variable">--help</span>          Help <span class="token keyword">for</span> asynq</span>
<span class="line">  <span class="token parameter variable">--password</span>      Password to use when connecting to redis server</span>
<span class="line">  <span class="token parameter variable">--tls_server</span>    Server name <span class="token keyword">for</span> TLS validation</span>
<span class="line">  <span class="token parameter variable">--uri</span>           Redis server URI</span>
<span class="line">  <span class="token parameter variable">--version</span>       Version <span class="token keyword">for</span> asynq</span>
<span class="line"></span>
<span class="line">EXAMPLES</span>
<span class="line">  $ asynq stats</span>
<span class="line">  $ asynq queue pause myqueue</span>
<span class="line">  $ asynq task list <span class="token parameter variable">--queue</span><span class="token operator">=</span>myqueue <span class="token parameter variable">--state</span><span class="token operator">=</span>archived</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我平时不怎么用这个命令行工具，毕竟，它还提供了一个Web的工具，更好用。</p>
<h4 id="docker安装web-ui" tabindex="-1"><a class="header-anchor" href="#docker安装web-ui"><span>Docker安装Web UI</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull hibiken/asynqmon:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> asynq <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">8080</span>:8080 <span class="token punctuation">\</span></span>
<span class="line">    hibiken/asynqmon:latest --redis-addr<span class="token operator">=</span>host.docker.internal:6379</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>管理后台：<a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080</a></p>
<ul>
<li>仪表盘</li>
</ul>
<p><img src="/assets/images/task_queue/asynq_web_ui_dashboard.png" alt="AsynqMon Dashboard"></p>
<ul>
<li>任务视图</li>
</ul>
<p><img src="/assets/images/task_queue/asynq_web_ui_task_view.png" alt="AsynqMon Task View"></p>
<ul>
<li>性能</li>
</ul>
<p><img src="/assets/images/task_queue/asynq_web_ui_metrics.png" alt="AsynqMon Metrics"></p>
<h4 id="创建kratos服务端" tabindex="-1"><a class="header-anchor" href="#创建kratos服务端"><span>创建Kratos服务端</span></a></h4>
<p>首先安装依赖库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go get <span class="token parameter variable">-u</span> github.com/tx7do/kratos-transport/transport/asynq</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>然后引入库，并且创建出来<code v-pre>Server</code>：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">import</span> github<span class="token punctuation">.</span>com<span class="token operator">/</span>tx7do<span class="token operator">/</span>kratos<span class="token operator">-</span>transport<span class="token operator">/</span>transport<span class="token operator">/</span>asynq</span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> <span class="token punctuation">(</span></span>
<span class="line">	localRedisAddr <span class="token operator">=</span> <span class="token string">"127.0.0.1:6379"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">srv <span class="token operator">:=</span> asynq<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">WithAddress</span><span class="token punctuation">(</span>localRedisAddr<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Start</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">defer</span> srv<span class="token punctuation">.</span><span class="token function">Stop</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注册任务回调" tabindex="-1"><a class="header-anchor" href="#注册任务回调"><span>注册任务回调</span></a></h4>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">const</span> <span class="token punctuation">(</span></span>
<span class="line">	testTask1        <span class="token operator">=</span> <span class="token string">"test_task_1"</span></span>
<span class="line">	testDelayTask    <span class="token operator">=</span> <span class="token string">"test_delay_task"</span></span>
<span class="line">	testPeriodicTask <span class="token operator">=</span> <span class="token string">"test_periodic_task"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">type</span> DelayTask <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	Message <span class="token builtin">string</span> <span class="token string">`json:"message"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">DelayTaskBinder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> Any <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleTask1</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> taskData <span class="token operator">*</span>DelayTask<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token function">LogInfof</span><span class="token punctuation">(</span><span class="token string">"Task Type: [%s], Payload: [%s]"</span><span class="token punctuation">,</span> taskType<span class="token punctuation">,</span> taskData<span class="token punctuation">.</span>Message<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleDelayTask</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> taskData <span class="token operator">*</span>DelayTask<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token function">LogInfof</span><span class="token punctuation">(</span><span class="token string">"Delay Task Type: [%s], Payload: [%s]"</span><span class="token punctuation">,</span> taskType<span class="token punctuation">,</span> taskData<span class="token punctuation">.</span>Message<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handlePeriodicTask</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> taskData <span class="token operator">*</span>DelayTask<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token function">LogInfof</span><span class="token punctuation">(</span><span class="token string">"Periodic Task Type: [%s], Payload: [%s]"</span><span class="token punctuation">,</span> taskType<span class="token punctuation">,</span> taskData<span class="token punctuation">.</span>Message<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> err <span class="token builtin">error</span></span>
<span class="line"></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">RegisterSubscriber</span><span class="token punctuation">(</span>testTask1<span class="token punctuation">,</span></span>
<span class="line">    <span class="token keyword">func</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> payload MessagePayload<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">switch</span> t <span class="token operator">:=</span> payload<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token keyword">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token operator">*</span>DelayTask<span class="token punctuation">:</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token function">handleTask1</span><span class="token punctuation">(</span>taskType<span class="token punctuation">,</span> t<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">default</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token function">LogError</span><span class="token punctuation">(</span><span class="token string">"invalid payload struct type:"</span><span class="token punctuation">,</span> t<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">return</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"invalid payload struct type"</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    DelayTaskBinder<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">RegisterSubscriber</span><span class="token punctuation">(</span>testDelayTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token keyword">func</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> payload MessagePayload<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">switch</span> t <span class="token operator">:=</span> payload<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token keyword">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token operator">*</span>DelayTask<span class="token punctuation">:</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token function">handleDelayTask</span><span class="token punctuation">(</span>taskType<span class="token punctuation">,</span> t<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">default</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token function">LogError</span><span class="token punctuation">(</span><span class="token string">"invalid payload struct type:"</span><span class="token punctuation">,</span> t<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">return</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"invalid payload struct type"</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    DelayTaskBinder<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">RegisterSubscriber</span><span class="token punctuation">(</span>testPeriodicTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token keyword">func</span><span class="token punctuation">(</span>taskType <span class="token builtin">string</span><span class="token punctuation">,</span> payload MessagePayload<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">switch</span> t <span class="token operator">:=</span> payload<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token keyword">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">case</span> <span class="token operator">*</span>DelayTask<span class="token punctuation">:</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token function">handlePeriodicTask</span><span class="token punctuation">(</span>taskType<span class="token punctuation">,</span> t<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">default</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token function">LogError</span><span class="token punctuation">(</span><span class="token string">"invalid payload struct type:"</span><span class="token punctuation">,</span> t<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">return</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"invalid payload struct type"</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    DelayTaskBinder<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建新任务" tabindex="-1"><a class="header-anchor" href="#创建新任务"><span>创建新任务</span></a></h4>
<ul>
<li>普通任务</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 最多重试3次，10秒超时，20秒后过期</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testTask1<span class="token punctuation">,</span> </span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"delay task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">MaxRetry</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">Timeout</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">Deadline</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>延迟任务</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 3秒后执行</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testDelayTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"delay task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    asynq<span class="token punctuation">.</span><span class="token function">ProcessIn</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>周期性任务</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 每分钟执行一次</span></span>
<span class="line"><span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewPeriodicTask</span><span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"*/1 * * * ?"</span><span class="token punctuation">,</span></span>
<span class="line">    testPeriodicTask<span class="token punctuation">,</span></span>
<span class="line">    <span class="token operator">&amp;</span>DelayTask<span class="token punctuation">{</span>Message<span class="token punctuation">:</span> <span class="token string">"periodic task"</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码"><span>示例代码</span></a></h4>
<p>示例代码可以在单元测试代码中找到：<a href="https://github.com/tx7do/kratos-transport/tree/main/transport/asynq/server_test.go" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/kratos-transport/tree/main/transport/asynq/server_test.go</a></p>
<h3 id="machinery" tabindex="-1"><a class="header-anchor" href="#machinery"><span>Machinery</span></a></h3>
<p>go machinery框架类似python中常用celery框架，主要用于异步任务和定时任务。</p>
<h4 id="特性" tabindex="-1"><a class="header-anchor" href="#特性"><span>特性</span></a></h4>
<ul>
<li>任务重试机制</li>
<li>延迟任务支持</li>
<li>任务回调机制</li>
<li>任务结果记录</li>
<li>支持Workflow模式：Chain，Group，Chord</li>
<li>多Brokers支持：Redis, AMQP, AWS SQS</li>
<li>多Backends支持：Redis, Memcache, AMQP, MongoDB</li>
</ul>
<h4 id="架构" tabindex="-1"><a class="header-anchor" href="#架构"><span>架构</span></a></h4>
<p>任务队列，简而言之就是一个放大的生产者消费者模型，用户请求会生成任务，任务生产者不断的向队列中插入任务，同时，队列的处理器程序充当消费者不断的消费任务。</p>
<ul>
<li>Server ：业务主体，我们可以使用用server暴露的接口方法进行所有任务编排的操作。如果是简单的使用那么了解它就够了。</li>
<li>Broker ：数据存储层接口，主要功能是将数据放入任务队列和取出，控制任务并发，延迟也在这层。</li>
<li>Backend：数据存储层接口，主要用于更新获取任务执行结果，状态等。</li>
<li>Worker：数据处理层结构，主要是操作 Server、Broker、Backend 进行任务的获取，执行，处理执行状态及结果等。</li>
<li>Task： 数据处理层，这一层包括Task、Signature、Group、Chain、Chord等结构，主要是处理任务编排的逻辑。</li>
</ul>
<h4 id="任务编排" tabindex="-1"><a class="header-anchor" href="#任务编排"><span>任务编排</span></a></h4>
<p>Machinery一共提供了三种任务编排方式：</p>
<ul>
<li>Groups ： 执行一组异步任务，任务之间互不影响。</li>
<li>Chord：执行一组同步任务，执行完成后，在调用一个回调函数。</li>
<li>Chain：执行一组同步任务，任务有次序之分，上个任务的出参可作为下个任务的入参。</li>
</ul>
<h4 id="创建kratos服务器" tabindex="-1"><a class="header-anchor" href="#创建kratos服务器"><span>创建Kratos服务器</span></a></h4>
<p>首先安装依赖库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go get <span class="token parameter variable">-u</span> github.com/tx7do/kratos-transport/transport/machinery</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">import</span> github<span class="token punctuation">.</span>com<span class="token operator">/</span>tx7do<span class="token operator">/</span>kratos<span class="token operator">-</span>transport<span class="token operator">/</span>transport<span class="token operator">/</span>machinery</span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> <span class="token punctuation">(</span></span>
<span class="line">	localRedisAddr <span class="token operator">=</span> <span class="token string">"127.0.0.1:6379"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">ctx <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">srv <span class="token operator">:=</span> machinery<span class="token punctuation">.</span><span class="token function">NewServer</span><span class="token punctuation">(</span></span>
<span class="line">    machinery<span class="token punctuation">.</span><span class="token function">WithRedisAddress</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span>localRedisAddr<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span>localRedisAddr<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> err <span class="token operator">:=</span> srv<span class="token punctuation">.</span><span class="token function">Start</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">defer</span> srv<span class="token punctuation">.</span><span class="token function">Stop</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建新任务-1" tabindex="-1"><a class="header-anchor" href="#创建新任务-1"><span>创建新任务</span></a></h4>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">const</span> <span class="token punctuation">(</span></span>
<span class="line">	testTask1        <span class="token operator">=</span> <span class="token string">"test_task_1"</span></span>
<span class="line">	testDelayTask    <span class="token operator">=</span> <span class="token string">"test_delay_task"</span></span>
<span class="line">	testPeriodicTask <span class="token operator">=</span> <span class="token string">"test_periodic_task"</span></span>
<span class="line"></span>
<span class="line">	addTask         <span class="token operator">=</span> <span class="token string">"add"</span></span>
<span class="line">	multiplyTask    <span class="token operator">=</span> <span class="token string">"multiply"</span></span>
<span class="line">	sumIntTask      <span class="token operator">=</span> <span class="token string">"sum_ints"</span></span>
<span class="line">	sumFloatTask    <span class="token operator">=</span> <span class="token string">"sum_floats"</span></span>
<span class="line">	concatTask      <span class="token operator">=</span> <span class="token string">"concat"</span></span>
<span class="line">	splitTask       <span class="token operator">=</span> <span class="token string">"split"</span></span>
<span class="line">	panicTask       <span class="token operator">=</span> <span class="token string">"panic_task"</span></span>
<span class="line">	longRunningTask <span class="token operator">=</span> <span class="token string">"long_running_task"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>普通任务</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>sumTask<span class="token punctuation">,</span> <span class="token function">WithArgument</span><span class="token punctuation">(</span><span class="token string">"int64"</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>延迟任务</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 延迟5秒执行任务</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewTask</span><span class="token punctuation">(</span>testDelayTask<span class="token punctuation">,</span> <span class="token function">WithDelayTime</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">UTC</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span>Second<span class="token operator">*</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>周期性任务（需要注意的是，延迟任务的精度只能到秒级）</li>
</ul>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 每分钟执行一次</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">NewPeriodicTask</span><span class="token punctuation">(</span><span class="token string">"*/1 * * * ?"</span><span class="token punctuation">,</span> testPeriodicTask<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注册任务回调-1" tabindex="-1"><a class="header-anchor" href="#注册任务回调-1"><span>注册任务回调</span></a></h4>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">handleTask1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"################ 执行任务Task1 #################"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleDelayTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"################ 执行延迟任务DelayTask #################"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handlePeriodicTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"################ 执行周期任务PeriodicTask #################"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleAdd</span><span class="token punctuation">(</span>args <span class="token operator">...</span><span class="token builtin">int64</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token builtin">int64</span><span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	sum <span class="token operator">:=</span> <span class="token function">int64</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> arg <span class="token operator">:=</span> <span class="token keyword">range</span> args <span class="token punctuation">{</span></span>
<span class="line">		sum <span class="token operator">+=</span> arg</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">"sum: %d\n"</span><span class="token punctuation">,</span> sum<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> sum<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">HandleFunc</span><span class="token punctuation">(</span>testTask1<span class="token punctuation">,</span> handleTask<span class="token punctuation">)</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">HandleFunc</span><span class="token punctuation">(</span>testTaskDelay<span class="token punctuation">,</span> handleDelayTask<span class="token punctuation">)</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">HandleFunc</span><span class="token punctuation">(</span>testPeriodicTask<span class="token punctuation">,</span> handlePeriodicTask<span class="token punctuation">)</span></span>
<span class="line">err <span class="token operator">=</span> srv<span class="token punctuation">.</span><span class="token function">HandleFunc</span><span class="token punctuation">(</span>addTask<span class="token punctuation">,</span> handleAdd<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="示例代码-1" tabindex="-1"><a class="header-anchor" href="#示例代码-1"><span>示例代码</span></a></h4>
<p>示例代码可以在单元测试代码中找到：<a href="https://github.com/tx7do/kratos-transport/tree/main/transport/machinery/server_test.go" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/kratos-transport/tree/main/transport/machinery/server_test.go</a></p>
<h2 id="中间件代码" tabindex="-1"><a class="header-anchor" href="#中间件代码"><span>中间件代码</span></a></h2>
<ul>
<li><a href="https://gitee.com/tx7do/kratos-transport" target="_blank" rel="noopener noreferrer">kratos-transport Gitee</a></li>
<li><a href="https://github.com/tx7do/kratos-transport" target="_blank" rel="noopener noreferrer">kratos-transport Github</a></li>
</ul>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://github.com/celery/celery" target="_blank" rel="noopener noreferrer">Celery - Github</a></li>
<li><a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery - Github</a></li>
<li><a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq - Github</a></li>
<li><a href="https://www.celerycn.io/ru-men/celery-jian-jie" target="_blank" rel="noopener noreferrer">Celery 简介</a></li>
<li><a href="https://cloud.tencent.com/developer/article/1898147" target="_blank" rel="noopener noreferrer">分布式任务队列Celery的实践</a></li>
<li><a href="https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830" target="_blank" rel="noopener noreferrer">Asynq: Golang distributed task queue library</a></li>
<li><a href="https://www.51cto.com/article/707654.html" target="_blank" rel="noopener noreferrer">异步任务处理系统，如何解决业务长耗时、高并发难题？</a></li>
<li><a href="https://blog.51cto.com/u_15301988/3080859" target="_blank" rel="noopener noreferrer">分布式任务队列 Celery</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/270640260" target="_blank" rel="noopener noreferrer">machinery中文文档</a></li>
<li><a href="https://marksuper.xyz/2022/04/20/machinery1/" target="_blank" rel="noopener noreferrer">Go 语言分布式任务处理器 Machinery – 架构，源码详解篇</a></li>
<li><a href="https://medium.com/swlh/task-orchestration-in-go-machinery-66a0ddcda548" target="_blank" rel="noopener noreferrer">Task orchestration in Go Machinery.</a></li>
<li><a href="https://juejin.cn/post/6889743612267986958" target="_blank" rel="noopener noreferrer">go-machinery入门教程（异步任务队列）</a></li>
<li><a href="https://dev.to/koddr/asynq-simple-reliable-efficient-distributed-task-queue-for-your-next-go-project-4jhg" target="_blank" rel="noopener noreferrer">Asynq: simple, reliable &amp; efficient distributed task queue for your next Go project</a></li>
<li><a href="https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830" target="_blank" rel="noopener noreferrer">Asynq: Golang distributed task queue library</a></li>
</ul>
</div></template>


