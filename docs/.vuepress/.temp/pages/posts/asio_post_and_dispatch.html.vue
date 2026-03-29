<template><div><h1 id="asio的post和dispatch方法" tabindex="-1"><a class="header-anchor" href="#asio的post和dispatch方法"><span>ASIO的post和dispatch方法</span></a></h1>
<p>关于这两个方法，我去网上找了一大堆资料，都没有讲清楚是怎么一回事。还是读了ASIO的源代码这才理解。</p>
<p>要提到这两个方法，不得不提一下Windows的两个API：<code v-pre>SendMessage</code>和<code v-pre>PostMessage</code>。</p>
<p><code v-pre>io_context::post</code>跟<code v-pre>PostMessage</code>的行为差不多，投递完消息立即返回，Handler的执行跟它没有半毛钱的关系。</p>
<p><code v-pre>io_context::dispatch</code>可以认为是<code v-pre>SendMessage</code>的超集，<code v-pre>SendMessage</code>是阻塞的，必须要在消息处理完成之后才返回，当<code v-pre>io_context::dispatch</code>在<code v-pre>io_context</code>的工作线程中被调用的时候，<code v-pre>io_context::dispatch</code>的行为和<code v-pre>SendMessage</code>是一致的，必须要在Handler调用完成之后才返回。但是，如果不是io_context的工作线程中调用，则执行了<code v-pre>io_context::post</code>一样的行为：将Handler投递到<code v-pre>io_context</code>的事件队列中去。</p>
<p>我下面用伪代码来描述其功能：</p>
<div class="language-c++ line-numbers-mode" data-highlighter="prismjs" data-ext="c++"><pre v-pre><code><span class="line">void post(Handler handler)</span>
<span class="line">{</span>
<span class="line">    _queue.push(handler);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">void dispatch(Handler handler)</span>
<span class="line">{</span>
<span class="line">    if (can_execute())</span>
<span class="line">        handler();</span>
<span class="line">    else</span>
<span class="line">        post(handler);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">void run()</span>
<span class="line">{</span>
<span class="line">    _work_thrd_id = std::this_thread::get_id();</span>
<span class="line">    while (!_queue.empty())</span>
<span class="line">    {</span>
<span class="line">        auto handler = _queue.front();</span>
<span class="line">        _queue.pop();</span>
<span class="line">        handler();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">bool can_execute()</span>
<span class="line">{</span>
<span class="line">    return _work_thrd_id == std::this_thread::get_id();</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


