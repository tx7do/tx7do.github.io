# Cache Aside Pattern(缓存模式)

Cache Aside Pattern是最经典的缓存 + 数据库读写的模式。

1. 读的时候，先读缓存，缓存没有的话，那么就读数据库，然后取出数据后放入缓存，同时返回响应
2. 更新的时候，先删除缓存，然后再更新数据库（缓存和数据库双写）

## 读取的步骤

1. 先从缓存中读取数据；
2. 如果缓存数据不存在，那么从数据库中读取数据；
3. 写入缓存。

## 写入的步骤

1. 先处理缓存；
2. 再操作数据库。

## 可能存在的问题

1. 其中一个步骤成功，一个步骤失败。
2. 写操作刚完成，另外一个读操作就进来了。

## 参考资料

* [Cache Aside Pattern(缓存模式)解析](https://www.51cto.com/article/578829.html)
* [Cache Aside Pattern 缓存+数据库读写模式的分析](https://zq99299.github.io/note-book/cache-pdp/036.html#cache-aside-pattern)
* [Cache-Aside pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
* [Cache Aside Pattern简单理解](https://juejin.cn/post/6916429366868049928)
* [Consistency between Cache and Database, Part 1](https://lazypro.medium.com/consistency-between-cache-and-database-part-1-f64f4a76720)
