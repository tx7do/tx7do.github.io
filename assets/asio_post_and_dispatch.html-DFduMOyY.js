import{_ as s,c as n,e as a,o as i}from"./app-gW4Mz9Ds.js";const d={};function c(o,e){return i(),n("div",null,[...e[0]||(e[0]=[a(`<h1 id="asio的post和dispatch方法" tabindex="-1"><a class="header-anchor" href="#asio的post和dispatch方法"><span>ASIO的post和dispatch方法</span></a></h1><p>关于这两个方法，我去网上找了一大堆资料，都没有讲清楚是怎么一回事。还是读了ASIO的源代码这才理解。</p><p>要提到这两个方法，不得不提一下Windows的两个API：<code>SendMessage</code>和<code>PostMessage</code>。</p><p><code>io_context::post</code>跟<code>PostMessage</code>的行为差不多，投递完消息立即返回，Handler的执行跟它没有半毛钱的关系。</p><p><code>io_context::dispatch</code>可以认为是<code>SendMessage</code>的超集，<code>SendMessage</code>是阻塞的，必须要在消息处理完成之后才返回，当<code>io_context::dispatch</code>在<code>io_context</code>的工作线程中被调用的时候，<code>io_context::dispatch</code>的行为和<code>SendMessage</code>是一致的，必须要在Handler调用完成之后才返回。但是，如果不是io_context的工作线程中调用，则执行了<code>io_context::post</code>一样的行为：将Handler投递到<code>io_context</code>的事件队列中去。</p><p>我下面用伪代码来描述其功能：</p><div class="language-c++ line-numbers-mode" data-highlighter="prismjs" data-ext="c++"><pre><code><span class="line">void post(Handler handler)</span>
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
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7)])])}const t=s(d,[["render",c]]),p=JSON.parse('{"path":"/posts/asio_post_and_dispatch.html","title":"ASIO的post和dispatch方法","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["C++编程"],"tag":["ASIO"],"sticky":10},"headers":[],"git":{"updatedTime":1774788457000,"contributors":[{"name":"tx7do","username":"tx7do","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/tx7do"},{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"5ea33389b32f6034aec163973631e6723b20981a","time":1655867257000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add post"}]},"filePathRelative":"posts/asio_post_and_dispatch.md","excerpt":"\\n<p>关于这两个方法，我去网上找了一大堆资料，都没有讲清楚是怎么一回事。还是读了ASIO的源代码这才理解。</p>\\n<p>要提到这两个方法，不得不提一下Windows的两个API：<code>SendMessage</code>和<code>PostMessage</code>。</p>\\n<p><code>io_context::post</code>跟<code>PostMessage</code>的行为差不多，投递完消息立即返回，Handler的执行跟它没有半毛钱的关系。</p>\\n<p><code>io_context::dispatch</code>可以认为是<code>SendMessage</code>的超集，<code>SendMessage</code>是阻塞的，必须要在消息处理完成之后才返回，当<code>io_context::dispatch</code>在<code>io_context</code>的工作线程中被调用的时候，<code>io_context::dispatch</code>的行为和<code>SendMessage</code>是一致的，必须要在Handler调用完成之后才返回。但是，如果不是io_context的工作线程中调用，则执行了<code>io_context::post</code>一样的行为：将Handler投递到<code>io_context</code>的事件队列中去。</p>"}');export{t as comp,p as data};
