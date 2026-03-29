<template><div><h1 id="_5种服务端缓存设计模式" tabindex="-1"><a class="header-anchor" href="#_5种服务端缓存设计模式"><span>5种服务端缓存设计模式</span></a></h1>
<h2 id="cache-aside-pattern" tabindex="-1"><a class="header-anchor" href="#cache-aside-pattern"><span>Cache Aside Pattern</span></a></h2>
<p>Cache Aside Pattern是最经典的缓存 + 数据库读写的模式。</p>
<ol>
<li>读的时候，先读缓存，缓存没有的话，那么就读数据库，然后取出数据后放入缓存，同时返回响应</li>
<li>更新的时候，先更新缓存，然后再更新数据库（缓存和数据库双写）</li>
</ol>
<p>最大的缺点就是需要应用程序侧来编排读写流程。</p>
<h3 id="读取的步骤" tabindex="-1"><a class="header-anchor" href="#读取的步骤"><span>读取的步骤</span></a></h3>
<ol>
<li>先从缓存中读取数据；</li>
<li>如果缓存数据不存在，那么从数据库中读取数据；</li>
<li>写入缓存。</li>
</ol>
<p><img src="/assets/images/pattern/cache-aside-read-1.svg" alt=""></p>
<h3 id="写入的步骤" tabindex="-1"><a class="header-anchor" href="#写入的步骤"><span>写入的步骤</span></a></h3>
<ol>
<li>先处理缓存；</li>
<li>再操作数据库。</li>
</ol>
<p><img src="/assets/images/pattern/cache-aside-write-1.svg" alt=""></p>
<h3 id="可能存在的问题" tabindex="-1"><a class="header-anchor" href="#可能存在的问题"><span>可能存在的问题</span></a></h3>
<ol>
<li>其中一个步骤成功，一个步骤失败。</li>
<li>写操作刚完成，另外一个读操作就进来了。</li>
</ol>
<h2 id="read-through-pattern" tabindex="-1"><a class="header-anchor" href="#read-through-pattern"><span>Read-Through Pattern</span></a></h2>
<p><img src="/assets/images/pattern/read-through.svg" alt=""></p>
<p>读取的责任全部都丢给了缓存提供者，将责任做了一个分离。应用程序只需要和缓存提供者打交道，至于背后如何同数据库交互，完全不需要管。</p>
<h2 id="write-through-pattern" tabindex="-1"><a class="header-anchor" href="#write-through-pattern"><span>Write-Through Pattern</span></a></h2>
<p><img src="/assets/images/pattern/write-through.svg" alt=""></p>
<p>写入的的责任全部都丢给了缓存提供者，将责任做了一个分离。应用程序只需要和缓存提供者打交道，至于背后如何同数据库交互，完全不需要管。</p>
<h2 id="write-behind-pattern" tabindex="-1"><a class="header-anchor" href="#write-behind-pattern"><span>Write-Behind Pattern</span></a></h2>
<p><img src="/assets/images/pattern/write-behind.svg" alt=""></p>
<p>它与Write-Through极其相似，唯一差异就是最后一步，它是通过异步方式向数据库写入数据。</p>
<h2 id="refresh-ahead-pattern" tabindex="-1"><a class="header-anchor" href="#refresh-ahead-pattern"><span>Refresh-Ahead Pattern</span></a></h2>
<p><img src="/assets/images/pattern/refresh-ahead.svg" alt=""></p>
<p>简单来说，就是在热点缓存数据即将失效的时候，数据库的数据发生改变的时候，主动刷新缓存中的数据。它能够使得热数据的缓存数据一直保持在缓存，并且都是最新的数据。</p>
<p>它还可以有效的规避惊群效应——试想一下，如果所有数据都是同一时间失效，那么将会对缓存和数据库造成多大的压力。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.51cto.com/article/578829.html" target="_blank" rel="noopener noreferrer">Cache Aside Pattern(缓存模式)解析</a></li>
<li><a href="https://zq99299.github.io/note-book/cache-pdp/036.html#cache-aside-pattern" target="_blank" rel="noopener noreferrer">Cache Aside Pattern 缓存+数据库读写模式的分析</a></li>
<li><a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside" target="_blank" rel="noopener noreferrer">Cache-Aside pattern</a></li>
<li><a href="https://juejin.cn/post/6916429366868049928" target="_blank" rel="noopener noreferrer">Cache Aside Pattern简单理解</a></li>
<li><a href="https://lazypro.medium.com/consistency-between-cache-and-database-part-1-f64f4a76720" target="_blank" rel="noopener noreferrer">Consistency between Cache and Database, Part 1</a></li>
<li><a href="https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside" target="_blank" rel="noopener noreferrer">Cache-Aside pattern</a></li>
<li><a href="https://hazelcast.com/blog/a-hitchhikers-guide-to-caching-patterns/" target="_blank" rel="noopener noreferrer">A Hitchhiker’s Guide to Caching Patterns</a></li>
<li><a href="https://medium.com/@monkey-dev/cache-aside-pattern-a-how-to-guide-with-net-8-and-redis-2aa4f5b84381" target="_blank" rel="noopener noreferrer">Cache-Aside pattern. A how-to guide with .NET 8 and Redis</a></li>
<li><a href="https://www.enjoyalgorithms.com/blog/refresh-ahead-caching-pattern" target="_blank" rel="noopener noreferrer">Refresh Ahead Caching Pattern</a></li>
<li><a href="https://levelup.gitconnected.com/6-caching-strategies-for-system-design-interviews-8cf22193b360" target="_blank" rel="noopener noreferrer">6 Caching Strategies For System Design Interviews</a></li>
</ul>
</div></template>


