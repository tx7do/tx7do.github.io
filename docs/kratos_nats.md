# Golang微服务框架Kratos应用NATS消息队列

消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。

消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。

在本文当中，您将了解到：什么是消息队列？什么是NATS

## 什么是消息队列

消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。

消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。

消息中间件是分布式系统中重要的组件，主要解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性的系统架构。目前使用较多的消息队列有：ActiveMQ、RabbitMQ、ZeroMQ、Kafka、MetaMQ、NATS、NAQ、NATS、Pulsar等。

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

## 什么是NATS？

NATS是由CloudFoundry的架构师Derek开发的一个开源的、轻量级、高性能的，支持发布、订阅机制的分布式消息队列系统。它的核心基于EventMachine开发，代码量不多，可以下载下来慢慢研究。其核心原理就是基于消息发布订阅机制。每个台服务 器上的每个模块会根据自己的消息类别，向MessageBus发布多个消息主题；而同时也向自己需要交互的模块，按照需要的信息内容的消息主题订阅消息。 NATS原来是使用Ruby编写，可以实现每秒150k消息，后来使用Go语言重写，能够达到每秒8-11百万个消息，整个程序很小只有3M Docker image，它不支持持久化消息，如果你离线，你就不能获得消息。

NATS适合云基础设施的消息通信系统、IoT设备消息通信和微服务架构。Apcera团队负责维护NATS服务器（Golang语言开发）和客户端（包括Go、Python、Ruby、Node.js、Elixir、Java、Nginx、C和C#），开源社区也贡献了一些客户端库，包括Rust、PHP、Lua等语言的库。目前已经采用了NATS系统的公司有：爱立信、HTC、百度、西门子、VMware。

## NATS的设计目标

NATS的设计原则是：高性能、可伸缩能力、易于使用，基于这些原则，NATS的设计目标包括：

1. 高性能（fast） 
2. 一直可用（dial tone） 
3. 极度轻量级（small footprint） 
4. 最多交付一次（fire and forget，消息发送后不管） 
5. 支持多种消息通信模型和用例场景（flexible）

## NATS应用场景

NATS理想的使用场景有：

1. 寻址、发现 
2. 命令和控制（控制面板） 
3. 负载均衡 
4. 多路可伸缩能力 
5. 定位透明 
6. 容错

NATS设计哲学认为，高质量的QoS应该在客户端构建，故只建立了请求-应答，不提供：

1. 持久化 
2. 事务处理 
3. 增强的交付模式 
4. 企业级队列

## NATS消息模式

支持3种消息模式：

* Publish/Subscribe
* Request/Reply
* Queueing

### Publish/Subscribe

Publish/Subscribe是一对多的消息模型。Publisher往一个主题上发送消息，任何订阅了此主题的Subscriber都可以接收到该主题的消息。

服务质量指标：

* 至多发一次

NATS系统是一种“发送后不管”的消息通信系统。往某主题上发送时，如果没有subscriber，或者所有subscriber不在线，则该消息不会给处理。如果需要更高的QoS，可以使用NATS Streaming，或者在客户端中增加可靠性。

* 至少发一次(NATS Streaming)

提供更高的的QoS，但是会付出降低吞吐率和增加延迟的代价。

### Request/Reply

publisher往主题中发布一个带预期响应的消息，subscriber执行请求调用，并返回最先的响应。 支持两种请求-响应消息通信模式：

* 点对点：最快、最先的响应。
* 一对多：可以限制Requestor收到的应答数量。

### Queueing

subscriber注册的时候，需指定一个队列名。指定相同队列名的subscriber，形成一个队列组。当主题收到消息后，订阅了此主题的队列组，会自动选择一个成员来接收消息。尽管队列组有多个subscriber，但每条消息只能被组中的一个subscriber接收。

## NATS Protocol

NATS连接协议是一个简单的、基于文本的发布/订阅风格的协议。与传统的二进制消息格式的消息通信系统不同，基于文本的NATS协议，使得客户端实现很简单，可以方便地选择多种编程语言或脚本语言来实现。

### 协议约定

#### 主题

大小写敏感，必须是不能包含空格的非空字符串，可以包含标志分隔符”.”。

#### 通配符

订阅主题中可以使用通配符，但是通配符必须被标识分隔。支持两种通配符：

星号*：匹配任意层级中的任意标记，如A.*.
大于号>：匹配所有当前层级之后的标记，如A.>

#### 新行

CR+LF（即\r\n，0X0D0A）作为协议消息的终止。新行还用于标记PUB或MSG协议中消息的实际有效负载的开始。

### 协议操作

操作名是大小写不敏感的。详细的操作，参考[NATS Protocol](http://nats.io/documentation/internals/nats-protocol/)

Client操作之后，Server都会给出相应的信息。

* `+OK`：Server响应正确。
* `-Err`：协议错误，将导致Client断开连接。

## Docker部署开发环境

```shell
docker pull bitnami/nats:latest

docker run -itd \
    --name nats-server \
    --p 4222:4222 \
    --p 6222:6222 \
    --p 8000:8222 \
    -e NATS_HTTP_PORT_NUMBER=8222 \
    bitnami/nats:latest
```

管理后台: <https://127.0.0.1:8000>

## Kratos下如何应用NATS？

我对NATS做了一个封装，要在Kratos下面使用NATS，首先需要在项目中引用我封装的两个库：

第一个库可以视之为NATS客户端的一个封装：

```shell
go get -u github.com/tx7do/kratos-transport/broker/nats
```

这一个库是讲NATS的客户端封装成一个Kratos的`transport.Server`，该库依赖上面的库：

```shell
go get -u github.com/tx7do/kratos-transport/transport/nats
```

想要在Kratos里面应用NATS，有两条途径可以达成：

1. 在`Data`层引用NATS的`Broker`，仅用于发布(Publish)消息之用，换言之，就是只发送不接收的单向通讯；
2. 在`Server`层引用NATS的`Server`，可以发布(Publish)消息，也可以订阅(Subscribe)消息，换言之，就是既发送又接收的全双工通讯。

接下来我就详细的讲解应用方法：

### 在`Data`层引用NATS的`Broker`

首先创建NATS的`Broker`:

```go
import (
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/nats"
)

func NewNATSBroker(cfg *conf.Bootstrap) broker.Broker {
	b := nats.NewBroker(
		broker.WithAddress(cfg.Data.NATS.Addrs...),
		broker.WithCodec(cfg.Data.NATS.Codec),
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
	NewNATSBroker,
)
```

最后，我们就可以在`Service`里面调用了：

```go
package service

type ReportService struct {
	v1.ReportServiceHTTPServer

	natsBroker broker.Broker
	log         *log.Helper
}

func NewReportService(logger log.Logger, natsBroker broker.Broker) *ReportService {
	l := log.NewHelper(log.With(logger, "module", "report/service/agent-service"))
	return &ReportService{
		log:         l,
		natsBroker: natsBroker,
	}
}

func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {
	_ = s.natsBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
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

### 在`Server`层引用NATS的`Server`

首先要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/nats"
)

// NewNATSServer create a nats server.
func NewNATSServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.SaverService) *nats.Server {
	ctx := context.Background()

	srv := nats.NewServer(
		nats.WithAddress(cfg.Server.NATS.Addrs),
		nats.WithGlobalTracerProvider(),
		nats.WithGlobalPropagator(),
		nats.WithCodec("json"),
	)

	registerNATSSubscribers(ctx, srv, svc)

	return srv
}

func registerNATSSubscribers(ctx context.Context, srv *nats.Server, svc *service.SaverService) {
	_ = nats.RegisterSubscriber(srv, 
		topic.UserReportData,
		svc.SaveUserReport,
	)

	_ = nats.RegisterSubscriber(srv, 
		topic.EventReportData,
		svc.SaveEventReport,
	)
}
```

接着，调用`kratos.Server`把NATS的服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *nats.Server) *kratos.App {
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

最后，我们就可以在`Service`里愉快的玩耍了，在这里，我只演示收到NATS消息之后立即写入数据库的操作：

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

- <github.com/tx7do/kratos-uba>
- <gitee.com/tx7do/kratos-uba>

需要注意的是，这个项目使用的是Kafka，但是差异不大，因为接口是一致的，只是注入的参数有差异罢了。

## 参考资料

- [什么是消息队列？](https://aws.amazon.com/cn/message-queue/)
- [秒懂消息队列MQ，万字总结带你全面了解消息队列MQ](https://developer.aliyun.com/article/953777)
- [什么是消息队列？](https://www.ibm.com/cn-zh/topics/message-queues)
- [NATS官网](https://nats.io/)
