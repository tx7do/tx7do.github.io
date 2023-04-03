# Prometheus的四大指标类型

Prometheus有4大指标类型（Metrics Type），分别是：

1. Counter（计数器）
2. Gauge（仪表盘）
3. Histogram（直方图）
4. Summary（摘要）

<font color=red>四个指标类型，实际上就是客户端采集数据的四个维度，采集这四个维度的指标数据，但是最终汇总到服务端那里，则是对这四个维度无感的，只是简单的作为时间序列存储起来。</font>

## 1. Counter（计数器）

计数器表示一种单调递增的指标，除非发生重置的情况下下只增不减，其样本值应该是不断增大的。

例如，可以使用Counter类型的指标来表示服务的请求数、已完成的任务数、错误发生的次数等。

## 2. Gauge（仪表盘）

仪表盘类型代表一种<font color=red>样本数据可以任意变化的指标，即可增可减</font>。它可以理解为状态的快照，Gauge通常用于表示温度或者内存使用率这种指标数据，也可以表示能随时增加或减少的“总数”，例如当前并发请求的数量node_memory_MemFree（主机当前空闲的内容大小）、node_memory_MemAvailable（可用内存大小）等。在使用Gauge时，用户往往希望使用它们<font color=red>求和、取平均值、最小值、最大值</font>等。

## 3. Histogram（直方图）

直方图是一个对数据分布情况的图形表示，由一系列高度不等的长条图（bar）或线段表示，用于展示单个测度得知的分布。

## 4. Summary（摘要）

与Histogram类型类似，摘要用于表示一段时间内的数据采样的结果（通常是请求持续时间或响应大小等），但它直接存储了分位数（通过客户端计算，然后展示出来），而非通过区间来计算（Histogram的分位数需要通过histogram_quantile（φfloat，b instant-vector）函数计算得到）。因此，对于分位数的计算，Summary在通过PromQL进行查询时有更好的性能表现，而Histogram则会消耗更多的资源。反之，对于客户端而言，Histogram消耗的资源更少。在选择这两种方式时，用户应该根据自己的实际场景选择。

Histogram是在服务端计算的，Summary是在客户端计算的。
