<template><div><h1 id="服务器基准测试" tabindex="-1"><a class="header-anchor" href="#服务器基准测试"><span>服务器基准测试</span></a></h1>
<p>基准测试（benchmark）是针对系统设计的一种压力测试，目标是为了掌握系统的行为。</p>
<h2 id="利特尔法则-little-s-law" tabindex="-1"><a class="header-anchor" href="#利特尔法则-little-s-law"><span>利特尔法则(Little’s law)</span></a></h2>
<p>利特尔法则（英语：Little's law），基于等候理论，由约翰·利特尔在1954年提出。利特尔法则可用于一个稳定的、非占先式的系统中。</p>
<p>利特尔法则可用来确定在途存货的数量。此法则认为，系统中的平均存货等于存货单位离开系统的比率（亦即平均需求率）与存货单位在系统中平均时间的乘积。</p>
<p>利特尔法则的公式描述为：</p>
<p><strong>Lead Time(产出时间) = 存货数量 × 生产节拍</strong> 或 <strong>TH(生产效率) = WIP(存货数量) / CT(周期时间)</strong></p>
<h2 id="吞吐率-rps-requests-per-second" tabindex="-1"><a class="header-anchor" href="#吞吐率-rps-requests-per-second"><span>吞吐率 RPS（Requests Per Second）</span></a></h2>
<p>吞吐率是服务器并发处理能力的量化描述，单位是reqs/s，指的是某个并发用户数下单位时间内处理的请求数。</p>
<p>某个并发用户数下单位时间内能处理的最大的请求数，称之为 <strong>最大吞吐率</strong>。</p>
<h3 id="计算公式" tabindex="-1"><a class="header-anchor" href="#计算公式"><span>计算公式</span></a></h3>
<blockquote>
<p>吞吐率 = 总请求数 / 处理这些请求的总完成时间<br>
Requests per second = Complete requests / Time taken for tests</p>
</blockquote>
<h2 id="每秒查询数-qps-query-per-second" tabindex="-1"><a class="header-anchor" href="#每秒查询数-qps-query-per-second"><span>每秒查询数 QPS（Query Per Second）</span></a></h2>
<p>QPS（Queries Per Second） 是每秒查询率 ,是一台服务器每秒能够相应的查询次数，是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准, 即每秒的响应请求数，也即是最大吞吐能力。</p>
<p>QPS基本类似于TPS，但是不同的是，对于一个页面的一次访问，形成一个TPS；但一次页面请求，可能产生多次对服务器的请求，服务器对这些请求，就可计入<strong>QPS</strong>之中。</p>
<p>QPS相当于最大吞吐率。</p>
<h3 id="计算公式-1" tabindex="-1"><a class="header-anchor" href="#计算公式-1"><span>计算公式</span></a></h3>
<blockquote>
<p>QPS = 请求查询数 / 秒<br>
QPS = fetchs / per second</p>
<p>QPS = 并发度 / 用户平均等待时间<br>
QPS = 1 / 服务器平均请求处理时间<br>
用户平均等待时间 / 并发度 = 服务器平均请求处理时间</p>
</blockquote>
<h2 id="每秒事务数-tps-transactions-per-second" tabindex="-1"><a class="header-anchor" href="#每秒事务数-tps-transactions-per-second"><span>每秒事务数 TPS（Transactions Per Second）</span></a></h2>
<p>TPS：Transactions Per Second（每秒处理的事务处理数量），即服务器每秒处理的事务数。TPS包括一条消息入和一条消息出，加上一次用户数据库访问。（业务TPS = CAPS × 每个呼叫平均TPS）。</p>
<p>例如，用户每分钟执行6个事务，<strong>TPS为6 / 60s = 0.10 TPS</strong>。同时我们会知道事务的响应时间(或节拍)，以此例，60秒完成6个事务也同时代表每个事务的响应时间或节拍为10秒。</p>
<p>TPS是软件测试结果的测量单位，可基于测试周期内完成的事务数量计算得出。一个事务是指一个客户机向服务器发送请求然后服务器做出反应的过程。客户机在发送请求时开始计时，收到服务器响应后结束计时，以此来计算使用的时间和完成的事务个数。</p>
<p>一般的，评价系统性能均以每秒钟完成的技术交易的数量来衡量。系统整体处理能力取决于处理能力最低模块的TPS值，TPS越高代表系统的性能越好，但同时服务器的压力也更大。</p>
<p>TPS整个过程包含了以下三个步骤：</p>
<ol>
<li>客户机向服务器发送请求</li>
<li>服务器内部处理请求</li>
<li>服务器返回请求结果</li>
</ol>
<p>每秒完成几个以上步骤，就是一个TPS</p>
<h2 id="响应时间-rt-response-time" tabindex="-1"><a class="header-anchor" href="#响应时间-rt-response-time"><span>响应时间 RT（Response-time）</span></a></h2>
<p>响应时间是指系统对请求作出响应的时间。直观上看，这个指标与人对软件性能的主观感受是非常一致的，因为它完整地记录了整个计算机系统处理请求的时间。由于一个系统通常会提供许多功能，而不同功能的处理逻辑也千差万别，因而不同功能的响应时间也不尽相同，甚至同一功能在不同输入数据的情况下响应时间也不相同。所以，在讨论一个系统的响应时间时，人们通常是指该系统所有功能的平均时间或者所有功能的最大响应时间。当然，往往也需要对每个或每组功能讨论其平均响应时间和最大响应时间。</p>
<p>对于单机的没有并发操作的应用系统而言，人们普遍认为响应时间是一个合理且准确的性能指标。需要指出的是，响应时间的绝对值并不能直接反映软件的性能的高低，软件性能的高低实际上取决于用户对该响应时间的接受程度。对于一个游戏软件来说，响应时间小于100毫秒应该是不错的，响应时间在1秒左右可能属于勉强可以接受，如果响应时间达到3秒就完全难以接受了。而对于编译系统来说，完整编译一个较大规模软件的源代码可能需要几十分钟甚至更长时间，但这些响应时间对于用户来说都是可以接受的。</p>
<h2 id="并发连接数-the-number-of-concurrent-connections" tabindex="-1"><a class="header-anchor" href="#并发连接数-the-number-of-concurrent-connections"><span>并发连接数（The number of concurrent connections）</span></a></h2>
<p>并发连接数就是服务器某个时刻所接受的请求数目，也就是某个时刻所接受的会话数目。</p>
<h2 id="并发用户数-the-number-of-concurrent-users-concurrency-level" tabindex="-1"><a class="header-anchor" href="#并发用户数-the-number-of-concurrent-users-concurrency-level"><span>并发用户数（The number of concurrent users, Concurrency Level）</span></a></h2>
<p>并发用户数是指系统可以同时承载的正常使用系统功能的用户的数量。与吞吐量相比，并发用户数是一个更直观但也更笼统的性能指标。实际上，并发用户数是一个非常不准确的指标，因为用户不同的使用模式会导致不同用户在单位时间发出不同数量的请求。一网站系统为例，假设用户只有注册后才能使用，但注册用户并不是每时每刻都在使用该网站，因此具体一个时刻只有部分注册用户同时在线，在线用户就在浏览网站时会花很多时间阅读网站上的信息，因而具体一个时刻只有部分在线用户同时向系统发出请求。这样，对于网站系统我们会有三个关于用户数的统计数字：注册用户数、在线用户数和同时发请求用户数。由于注册用户可能长时间不登陆网站，使用注册用户数作为性能指标会造成很大的误差。而在线用户数和同事发请求用户数都可以作为性能指标。相比而言，以在线用户作为性能指标更直观些，而以同时发请求用户数作为性能指标更准确些。</p>
<h2 id="用户平均请求等待时间-time-per-requests" tabindex="-1"><a class="header-anchor" href="#用户平均请求等待时间-time-per-requests"><span>用户平均请求等待时间（Time per requests）</span></a></h2>
<p>计算公式</p>
<blockquote>
<p>用户平均请求等待时间 = 总时间 / (总请求数 / 并发用户数)<br>
Time per requests = Time taken for tests / (Complete requests / Concurrency Level)</p>
</blockquote>
<h2 id="服务器平均请求等待时间-time-per-requests-across-all-concurrent-requests" tabindex="-1"><a class="header-anchor" href="#服务器平均请求等待时间-time-per-requests-across-all-concurrent-requests"><span>服务器平均请求等待时间（Time per requests: across all concurrent requests）</span></a></h2>
<p>计算公式</p>
<blockquote>
<p>服务器平均等待时间 = 总时间 / 总请求数<br>
Average request latency server = Time taken for tests / Complete requests</p>
</blockquote>
<p>还等于</p>
<blockquote>
<p>用户平均请求等待时间 / 并发用户数<br>
Time per request / Concurrency Level</p>
</blockquote>
<p>同时，它也是吞吐率的倒数。</p>
</div></template>


