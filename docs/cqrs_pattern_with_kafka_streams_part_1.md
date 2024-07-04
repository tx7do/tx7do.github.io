# Kafka Streams 实现 CQRS 模式 — 第 1 部分

CQRS 代表：**命令查询职责分离(Command Query Responsibility Segregation)**。它提倡分离“命令(Command)”和“查询(Query)”的“职责(Responsibility)”。在本文中，我将尝试回答以下问题：

- 什么是 CQRS？
- 为什么 Kafka Streams 是实现 CQRS 很自然的选择？
- 如何使用 Kafka Streams 实现 CQRS 模式？

## 案例研究：在线订购系统

让我们从一个经典示例开始：零售在线订购系统。它有两个主要用例：

- 用户可以下订单。
- 用户可以实时查看他们订购的商品，并根据价格标签进行分组。我们根据价格将商品分为三类：便宜（低于 5 英镑）、实惠（5 至 50 英镑之间）和昂贵（超过 50 英镑）。

一个高层级设计可能看起来像这样：

![](/assets/images/cqrs/basic_crud_design.png)

这是一个简单的 CRUD 应用程序，它有一个 REST API（后端）和一个单页应用程序（前端）。前端使用 REST API 下订单。然后后端触发一些业务逻辑并将新订单写入数据库。同样，为了获取一组商品，前端会调用一个 API，从而在后端产生一组读取操作。

## 实现 CQRS模式

在 CQRS 术语中，读取和写入操作分别称为**查询**和**命令**。通常，CRUD 系统都可以在逻辑上分为命令和查询两个子系统。

但是，CQRS 最适合应用于以下 CRUD 应用程序：

- (a) 需要使用与读取信息不同的模型来更新信息；
- (b) 读取查询需要耗时；
- (c) 读取次数远高于写入次数。

否则，[复杂性就会随之增加](https://martinfowler.com/bliki/CQRS.html)。

在我们的案例中，我们需要不同的读写模型，并且可预期读取次数比写入次数要多（每次加载页面时都会向后端发送读取请求）。为了本文的目的，让我们应用并受益于 CQRS 模式，并接受它的复杂性。

从本质上讲，CQRS 就是要分离命令和查询操作。为此，我们将后端拆分为两个微服务，即命令和查询，以便可以独立扩展和维护它们。此外，为了支持不同的读写模型并确保松散耦合，我们将数据库分散化，并将每个微服务的持久数据不能够直接访问，仅可通过其 API 进行访问。随着用户数量和数据量的增加，这两个微服务将能够满足不同的存储和架构要求。

![](/assets/images/cqrs/basic_cqrs_design.png)

## 实现 事件溯源

到目前为止，我们已经成功分离了命令和查询操作。然而，这个难题还缺少一个部分，那就是在信息写入只写数据库时​​，我们如何可靠地更新只读数据库。例如，一旦用户下达新订单购买某件商品，除了承担写入职责外，后端还需要同时将该商品标识为：cheap、affordable或expensive，并将其​​存储在只读数据库中。

一种选择是从命令微服务调用 查询API 并同步更新只读数据库。然而，这种解决方案带来了更多耦合，并损害了可靠性。如果查询微服务发生故障，任何传入的数据都将丢失。

一个更好的选择是：应用事件源。

事件源涉及两个步骤：

- （1）将应用程序所做的状态更改建模为一组不可变事件；
- （2）将状态更改建模为对事件的响应。

简言之，事件源将应用程序更改与该更改的记录分离，并使用后者作为可靠数据源。事件源将允许我们异步（可靠地）更新只读数据库以反映只写数据库的更改。

![](/assets/images/cqrs/event_source_cqrs_design.png)

## 使用 Apache Kafka Streams 实现 CQRS

Kafka已经是事件源的最佳选择之一。您可以将事件写入 Kafka（写入模型），再将其读取将其推送到数据库或其他主题（读取模型）。在此过程中，Kafka 将读取模型异步映射到写入模型，从而将两者解耦。因此，Kafka 是实现 CQRS 最自然的选择。

在事件源架构中，事件是头等公民。这与传统架构不同，在传统架构中，数据库是主要数据源。[流 - 表二元性（Stream-Table Duality）](https://towardsdatascience.com/apache-kafka-streams-and-tables-the-stream-table-duality-ee904251a7e)概念，加上 Kafka 的容错和高可用性，使我们能够用事件代替数据库作为主要数据来源。

事件源视图与典型数据库或缓存的区别在于，虽然它可以以任何所需形式表示数据，但其数据直接来自事件日志，并且可以随时重新生成。写入进命令端的 Kafka 并生成事件流。我们可以按照适合我们用例的方式转换流，通常使用 Kafka Streams，然后将其具体化为 [预计算查询 (precomputed query)](https://www.confluent.io/blog/unifying-stream-processing-and-interactive-queries-in-apache-kafka/)。

Kafka 中的物化视图是一个包含某些预定义查询结果的表。每当任何底层表发生变化时，视图都会更新。但与关系数据库中的物化视图不同，底层事件与视图是分离的。

这意味着：

- (a) 它们可以独立扩展；
- (b) 写入过程不必等待视图计算完毕即可返回。

![](/assets/images/cqrs/kafka_cqrs_detail_design.png)

## 实现代码

完整的实现可以在[github](https://github.com/mrwersa/kafka-cqrs-demo)上找到。

下一篇我会详细讲解这个实现过程。

## 翻译自

[CQRS Pattern with Kafka Streams — Part 1](https://mrwersa.medium.com/cqrs-pattern-with-kafka-streams-part-1-112f381e9b98)
