# Golang微服务框架Kratos应用Pulsar消息队列

消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。

消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。

在本文当中，您将了解到：什么是消息队列？什么是Pulsar？怎样在微服务框架Kratos当中应用Pulsar进行业务开发。

## 什么是消息队列

消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。

消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。

消息中间件是分布式系统中重要的组件，主要解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性的系统架构。目前使用较多的消息队列有：ActiveMQ、RabbitMQ、ZeroMQ、Kafka、MetaMQ、Pulsar、NAQ、NATS、Pulsar等。

## 消息队列应用场景

消息中间件在互联网公司使用得越来越多，主要用于在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现不俗。以下介绍消息队列在实际应用中常用的使用场景：异步处理，应用解耦，流量削峰和消息通讯。

### 异步处理

通常的微服务实现的接口，都是通过RPC进行微服务、服务客户端之间的相互调用，这是同步阻塞执行。有一些业务，业务流程比较耗时且可以不需要立即返回结果，还有一些业务可以互不干扰的并行执行，那么我们就可以将之转为异步，并发执行。从而减少同步接口的请求响应时间，从而提高系统的吞吐量。

![下单](https://ucc.alicdn.com/pic/developer-ecology/5c3ce3ea0d654fdabd9ca361663d9432.png)

以下单为例，用户下单后需要实施：生成订单、赠送活动积分、赠送红包、发送下单成功通知等，一系列业务处理。假设三个业务节点每个使用100毫秒钟，不考虑网络等其他开销，则串行方式的时间是400毫秒，并行的时间只需要200毫秒。这样就大大提高了系统的吞吐量。

### 应用解耦

应用解耦，顾名思义就是解除应用系统之间的耦合依赖。通过消息队列，使得每个应用系统不必受其他系统影响，可以更独立自主。

以电商系统为例，用户下单后，订单系统需要通知积分系统。一般的做法是：订单系统直接调用积分系统的接口。这就使得应用系统间的耦合特别紧密。如果积分系统无法访问，则积分处理失败，从而导致订单失败。

![电商系统](https://ucc.alicdn.com/pic/developer-ecology/d49dbbdd14f84eca9f5dab2182b337ad.png)

加入消息队列之后，用户下单后，订单系统完成下单业务后，将消息写入消息队列，返回用户订单下单成功。积分系统通过订阅下单消息的方式获取下单通知消息，从而进行积分操作。实现订单系统与库存系统的应用解耦。如果，在下单时积分系统系统异常，也不影响用户正常下单，因为下单后，订单系统写入消息队列就不再关心其他的后续操作。

### 流量削峰

流量削峰也是消息队列中的常用场景，一般在秒杀或团抢活动中使用广泛。

以秒杀活动为例，一般会因为流量过大，导致流量暴增，应用挂掉。为解决这个问题，一般需要在应用前端加入消息队列，秒杀业务处理系统根据消息队列中的请求信息，再做后续处理。

![秒杀活动](https://ucc.alicdn.com/pic/developer-ecology/050c3590a7b94a7799ad93e84bcb961c.png)

如上图所示，服务器接收到用户的请求后，首先写入消息队列，秒杀业务处理系统根据消息队列中的请求信息，做后续业务处理。假如消息队列长度超过最大数量，则直接抛弃用户请求或跳转到错误页面。

### 消息通讯

消息通讯是指应用间的数据通信。消息队列一般都内置了高效的通信机制，因此也可以用在单纯的消息通讯上。比如：实现点对点消息队列，或者聊天室等点对点通讯。

![两种消息模式](https://ucc.alicdn.com/pic/developer-ecology/f5d71084b1864b3aac4aed13779896e1.png)

以上实际是消息队列的两种消息模式，点对点或发布订阅模式。

## 什么是Pulsar？

Apache Pulsar 是 Apache 软件基金会的顶级项目，是下一代云原生分布式消息流平台，集消息、存储、轻量化函数式计算为一体，采用计算与存储分离架构设计，支持多租户、持久化存储、多机房跨区域数据复制，具有强一致性、高吞吐、低延时及高可扩展性等流数据存储特性。

Pulsar 诞生于 2012 年，最初的目的是为在 Yahoo 内部，整合其他消息系统，构建统一逻辑、支撑大集群和跨区域的消息平台。当时的其他消息系统（包括 Kafka），都不能满足 Yahoo 的需求，比如大集群多租户、稳定可靠的 IO 服务质量、百万级 Topic、跨地域复制等，因此 Pulsar 应运而生。

Pulsar 于 2016 年底开源，现在是 Apache 软件基金会的一个孵化器项目。Pulsar 在 Yahoo 的生产环境运行了三年多，助力 Yahoo 的主要应用，如 Yahoo Mail、Yahoo Finance、Yahoo Sports、Flickr、Gemini 广告平台和 Yahoo 分布式键值存储系统 Sherpa。

## Pulsar 的关键特性

* 是下一代云原生分布式消息流平台。
* Pulsar 的单个实例原生支持多个集群，可跨机房在集群间无缝地完成消息复制。
* 极低地发布延迟和端到端延迟。
* 可无缝扩展到超过一百万个 topic。
* 简单的客户端 API，支持 Java、Go、Python 和 C++。
* 主题的多种订阅模式（独占、共享和故障转移）。
* 通过 Apache BookKeeper 提供的持久化消息存储机制保证消息传递 。
* 由轻量级的 serverless 计算框架 Pulsar Functions 实现流原生的数据处理。
* 基于 Pulsar Functions 的 serverless connector 框架 Pulsar IO 使得数据更易移入、移出 Apache Pulsar。
* 分层式存储可在数据陈旧时，将数据从热存储卸载到冷/长期存储（如S3、GCS）中。

## Pulsar 基本概念

### Producer

消息的源头，也是消息的发布者，负责将消息发送到 topic。

### Consumer

消息的消费者，负责从 topic 订阅并消费消息。

Pulsar具有3个订阅模式，它们可以共存在同一个主题上：

- **独享（exclusive）订阅** —— 同时只能有一个消费者。
- **共享（shared）订阅** —— 可以由多个消费者订阅，每个消费者接收其中的一部分消息。
- **失效备援（failover）订阅** —— 允许多个消费者连接到同一个主题上，但只有一个消费者能够接收消息。只有在当前消费者发生失效时，其他消费者才开始接收消息。

### Topic

消息数据的载体，在 Pulsar 中 Topic 可以指定分为多个 partition，如果不设置默认只有一个 partition。

### Broker

Broker 是一个无状态组件，主要负责接收 Producer 发送过来的消息，并交付给 Consumer。

### BookKeeper

分布式的预写日志系统，为消息系统比 Pulsar 提供存储服务，为多个数据中心提供跨机器复制。

### Bookie

Bookie 是为消息提供持久化的 Apache BookKeeper 的服务端。

### Cluster

Apache Pulsar 实例集群，由一个或多个实例组成。

## Docker部署开发环境

部署单机模式服务：

```shell
docker pull apachepulsar/pulsar:latest

docker run -itd \
    -p 6650:6650 \
    -p 8080:8080 \
    --name pulsar-standalone \
    apachepulsar/pulsar:latest bin/pulsar standalone
```

部署管理Web UI：

```shell
docker pull apachepulsar/pulsar-manager:latest

docker run -itd \
    -p 9527:9527 \
    -p 7750:7750 \
    --name pulsar-manager \
    -e SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties \
    apachepulsar/pulsar-manager:latest
```

设置管理员账号密码：

```shell
CSRF_TOKEN=$(curl http://localhost:7750/pulsar-manager/csrf-token)
curl \
   -H 'X-XSRF-TOKEN: $CSRF_TOKEN' \
   -H 'Cookie: XSRF-TOKEN=$CSRF_TOKEN;' \
   -H "Content-Type: application/json" \
   -X PUT http://localhost:7750/pulsar-manager/users/superuser \
   -d '{"name": "admin", "password": "apachepulsar", "description": "test", 
        "email": "username@test.org"}'
```

管理后台：<http://localhost:9527>  
账号：`admin`  
密码：`apachepulsar`

进入后台之后，在后台创建一个环境。其中，服务地址为pulsar的地址：

* 环境名（Environment Name）： `default`
* 服务地址（Service URL）：<http://host.docker.internal:8080>

## Kratos下如何应用Pulsar？

我对Pulsar做了一个封装，要在Kratos下面使用Pulsar，首先需要在项目中引用我封装的两个库：

第一个库可以视之为Pulsar客户端的一个封装：

```shell
go get -u github.com/tx7do/kratos-transport/broker/pulsar
```

这一个库是讲Pulsar的客户端封装成一个Kratos的`transport.Server`，该库依赖上面的库：

```shell
go get -u github.com/tx7do/kratos-transport/transport/pulsar
```

想要在Kratos里面应用Pulsar，有两条途径可以达成：

1. 在`Data`层引用Pulsar的`Broker`，仅用于发布(Publish)消息之用，换言之，就是只发送不接收的单向通讯；
2. 在`Server`层引用Pulsar的`Server`，可以发布(Publish)消息，也可以订阅(Subscribe)消息，换言之，就是既发送又接收的全双工通讯。

接下来我就详细的讲解应用方法：

### 在`Data`层引用Pulsar的`Broker`

首先创建Pulsar的`Broker`:

```go
import (
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/pulsar"
)

func NewPulsarBroker(cfg *conf.Bootstrap) broker.Broker {
	b := pulsar.NewBroker(
		broker.WithAddress(cfg.Data.Pulsar.Addrs...),
		broker.WithCodec(cfg.Data.Pulsar.Codec),
	)
	if b == nil {
		return nil
	}

	_ = b.Init()

	if err := b.Connect(); err != nil {
		return nil
	}

	return b
}
```

然后，注入到`Wire`的`ProviderSet`：

```go
package data

import "github.com/google/wire"

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    ...
	NewPulsarBroker,
)
```

最后，我们就可以在`Service`里面调用了：

```go
package service

type ReportService struct {
	v1.ReportServiceHTTPServer

	pulsarBroker broker.Broker
	log         *log.Helper
}

func NewReportService(logger log.Logger, pulsarBroker broker.Broker) *ReportService {
	l := log.NewHelper(log.With(logger, "module", "report/service/agent-service"))
	return &ReportService{
		log:         l,
		pulsarBroker: pulsarBroker,
	}
}

func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {
	_ = s.pulsarBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
		EventName:  &req.EventName,
		ReportData: &req.Content,
		CreateTime: util.UnixMilliToStringPtr(trans.Int64(time.Now().UnixMilli())),
	})
	return &v1.PostReportResponse{
		Code: 0,
		Msg:  "success",
	}, nil
}
```

需要注意的是，添加了以上代码之后，需要使用命令生成Wire的胶水代码：

```shell
go run -mod=mod github.com/google/wire/cmd/wire ./cmd/server
```

### 在`Server`层引用Pulsar的`Server`

首先要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/pulsar"
)

// NewPulsarServer create a pulsar server.
func NewPulsarServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.SaverService) *pulsar.Server {
	ctx := context.Background()

	srv := pulsar.NewServer(
		pulsar.WithAddress(cfg.Server.Pulsar.Addrs),
		pulsar.WithGlobalTracerProvider(),
		pulsar.WithGlobalPropagator(),
		pulsar.WithCodec("json"),
	)

	registerPulsarSubscribers(ctx, srv, svc)

	return srv
}

func registerPulsarSubscribers(ctx context.Context, srv *pulsar.Server, svc *service.SaverService) {
	_ = pulsar.RegisterSubscriber(srv, ctx,
		topic.UserReportData,
		svc.SaveUserReport,
	)

	_ = pulsar.RegisterSubscriber(srv, ctx,
		topic.EventReportData,
		svc.SaveEventReport,
	)
}
```

接着，调用`kratos.Server`把Pulsar的服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *pulsar.Server) *kratos.App {
	return kratos.New(
		kratos.ID(Service.GetInstanceId()),
		kratos.Name(Service.Name),
		kratos.Version(Service.Version),
		kratos.Metadata(Service.Metadata),
		kratos.Logger(ll),
		kratos.Server(
			ks,
		),
		kratos.Registrar(rr),
	)
}
```

最后，我们就可以在`Service`里愉快的玩耍了，在这里，我只演示收到Pulsar消息之后立即写入数据库的操作：

```go
package service

type SaverService struct {
	log          *log.Helper
	statusRepo   *data.AcceptStatusRepo
	realtimeRepo *data.RealtimeWarehousingRepo
}

func NewSaverService(
	logger log.Logger,
	statusRepo *data.AcceptStatusRepo,
	realtimeRepo *data.RealtimeWarehousingRepo,
) *SaverService {
	l := log.NewHelper(log.With(logger, "module", "saver/service/logger-service"))
	return &SaverService{
		log:          l,
		statusRepo:   statusRepo,
		realtimeRepo: realtimeRepo,
	}
}

func (s *SaverService) SaveUserReport(_ context.Context, _ string, _ broker.Headers, msg *v1.AcceptStatusReportData) error {
	return s.statusRepo.Create(msg)
}

func (s *SaverService) SaveEventReport(_ context.Context, _ string, _ broker.Headers, msg *v1.RealTimeWarehousingData) error {
	return s.realtimeRepo.Create(msg)
}
```

## 实例代码

以上代码以及接口定义，可以在我的另外一个开源项目里面找到：

- <https://github.com/tx7do/kratos-uba>
- <https://gitee.com/tx7do/kratos-uba>

需要注意的是，这个项目使用的是Kafka，但是差异不大，因为接口是一致的，只是注入的参数有差异罢了。

## 参考资料

- [什么是消息队列？](https://aws.amazon.com/cn/message-queue/)
- [秒懂消息队列MQ，万字总结带你全面了解消息队列MQ](https://developer.aliyun.com/article/953777)
- [什么是消息队列？](https://www.ibm.com/cn-zh/topics/message-queues)
- [聊聊 Pulsar： Pulsar 的核心概念与基础架构](https://segmentfault.com/a/1190000041367545)
- [Apache Pulsar官网](https://pulsar.apache.org/)
- [发布订阅消息系统 Apache Pulsar 简介](https://www.infoq.cn/article/2017/11/apache-pulsar-brief-introduction)
- [一文读懂 Apache Pulsar](https://segmentfault.com/a/1190000041096450)
- [最佳实践｜Apache Pulsar 在拉卡拉的技术实践](https://xie.infoq.cn/article/babca7b9a2930c3c6d2d13126)
