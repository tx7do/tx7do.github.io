# 5种服务端缓存设计模式

## Cache Aside Pattern

Cache Aside Pattern是最经典的缓存 + 数据库读写的模式。

1. 读的时候，先读缓存，缓存没有的话，那么就读数据库，然后取出数据后放入缓存，同时返回响应
2. 更新的时候，先更新缓存，然后再更新数据库（缓存和数据库双写）

最大的缺点就是需要应用程序侧来编排读写流程。

### 读取的步骤

1. 先从缓存中读取数据；
2. 如果缓存数据不存在，那么从数据库中读取数据；
3. 写入缓存。

![](/assets/images/pattern/cache-aside-read-1.svg)

### 写入的步骤

1. 先处理缓存；
2. 再操作数据库。

![](/assets/images/pattern/cache-aside-write-1.svg)

### 可能存在的问题

1. 其中一个步骤成功，一个步骤失败。
2. 写操作刚完成，另外一个读操作就进来了。

## Read-Through Pattern

![](/assets/images/pattern/read-through.svg)

读取的责任全部都丢给了缓存提供者，将责任做了一个分离。应用程序只需要和缓存提供者打交道，至于背后如何同数据库交互，完全不需要管。

## Write-Through Pattern

![](/assets/images/pattern/write-through.svg)

写入的的责任全部都丢给了缓存提供者，将责任做了一个分离。应用程序只需要和缓存提供者打交道，至于背后如何同数据库交互，完全不需要管。

## Write-Behind Pattern

![](/assets/images/pattern/write-behind.svg)

它与Write-Through极其相似，唯一差异就是最后一步，它是通过异步方式向数据库写入数据。

## Refresh-Ahead Pattern

![](/assets/images/pattern/refresh-ahead.svg)

简单来说，就是在热点缓存数据即将失效的时候，数据库的数据发生改变的时候，主动刷新缓存中的数据。它能够使得热数据的缓存数据一直保持在缓存，并且都是最新的数据。

它还可以有效的规避惊群效应——试想一下，如果所有数据都是同一时间失效，那么将会对缓存和数据库造成多大的压力。

## 参考资料

- [Cache Aside Pattern(缓存模式)解析](https://www.51cto.com/article/578829.html)
- [Cache Aside Pattern 缓存+数据库读写模式的分析](https://zq99299.github.io/note-book/cache-pdp/036.html#cache-aside-pattern)
- [Cache-Aside pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
- [Cache Aside Pattern简单理解](https://juejin.cn/post/6916429366868049928)
- [Consistency between Cache and Database, Part 1](https://lazypro.medium.com/consistency-between-cache-and-database-part-1-f64f4a76720)
- [Cache-Aside pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
- [A Hitchhiker’s Guide to Caching Patterns](https://hazelcast.com/blog/a-hitchhikers-guide-to-caching-patterns/)
- [Cache-Aside pattern. A how-to guide with .NET 8 and Redis](https://medium.com/@monkey-dev/cache-aside-pattern-a-how-to-guide-with-net-8-and-redis-2aa4f5b84381)
- [Refresh Ahead Caching Pattern](https://www.enjoyalgorithms.com/blog/refresh-ahead-caching-pattern)
- [6 Caching Strategies For System Design Interviews](https://levelup.gitconnected.com/6-caching-strategies-for-system-design-interviews-8cf22193b360)
