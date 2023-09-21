# Golang微服务框架Kratos应用NSQ消息队列

消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。

消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。

在本文当中，您将了解到：什么是消息队列？什么是NSQ？怎样在微服务框架Kratos当中应用NSQ进行业务开发。

## 什么是消息队列

消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。
消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。

消息中间件是分布式系统中重要的组件，主要解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性的系统架构。目前使用较多的消息队列有：ActiveMQ、RabbitMQ、ZeroMQ、Kafka、MetaMQ、NSQ、NAQ、NATS、Pulsar等。

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

## 什么是NSQ？

NSQ是一个基于Go语言的分布式实时消息平台，它基于MIT开源协议发布，由bitly公司开源出来的一款简单易用的消息中间件。

NSQ可用于大规模系统中的实时消息服务，并且每天能够处理数亿级别的消息，其设计目标是为在分布式环境下运行的去中心化服务提供一个强大的基础架构。

NSQ具有分布式、去中心化的拓扑结构，该结构具有无单点故障、故障容错、高可用性以及能够保证消息的可靠传递的特征。NSQ非常容易配置和部署，且具有最大的灵活性，支持众多消息协议。

## NSQ基本概念

### Topic

一个topic就是程序发布消息的一个逻辑键，当程序第一次发布消息时就会创建topic。

### Channel

channel组与消费者相关，是消费者之间的负载均衡，channel在某种意义上来说是一个“队列”。每当一个发布者发送一条消息到一个topic，消息会被复制到所有消费者连接的channel上，消费者通过这个特殊的channel读取消息，实际上，在消费者第一次订阅时就会创建channel。

Channel会将消息进行排列，如果没有消费者读取消息，消息首先会在内存中排队，当量太大时就会被保存到磁盘中。

### Message

消息构成了我们数据流的中坚力量，消费者可以选择结束消息，表明它们正在被正常处理，或者重新将他们排队待到后面再进行处理。每个消息包含传递尝试的次数，当消息传递超过一定的阀值次数时，我们应该放弃这些消息，或者作为额外消息进行处理。

## NSQ基本组件

NSQ的主要组件有三个: nsqlookupd、nsqd、nsqadmin。

### nsqlookupd

nsqlookupd服务器像consul或etcd那样工作，只是它被设计得没有协调和强一致性能力。每个nsqlookupd都作为nsqd节点注册信息的短暂数据存储区。消费者连接这些节点去检测需要从哪个nsqd节点上读取消息。

![nsq-lookups](https://bean-li.github.io/assets/LINUX/nsq-lookups.png)

### nsqd

nsqd守护进程是NSQ的核心部分，它是一个单独的监听某个端口进来的消息的二进制程序。每个nsqd节点都独立运行，不共享任何状态。当一个节点启动时，它向一组nsqlookupd节点进行注册操作，并将保存在此节点上的topic和channel进行广播。

客户端可以发布消息到nsqd守护进程上，或者从nsqd守护进程上读取消息。通常，消息发布者会向一个单一的local nsqd发布消息，消费者从连接了的一组nsqd节点的topic上远程读取消息。如果你不关心动态添加节点功能，你可以直接运行standalone模式。

### nsqadmin

一套Web用户界面，可实时查看集群的统计数据和执行相应的管理任务。

## NSQ消息模式

NSQ的消息模式为推的方式，这种模式可以保证消息的及时性，当有消息时可以及时推送出去。但是要根椐客户端的消耗能力和节奏去控制，NSQ是通过更改RDY的值来实现的。当没有消息时为0, 服务端推送消息后，客户端比如调用 `updateRDY()`这个方法改成3, 那么服务端推送时，就会根椐这个值做流控了。

NSQ还支持延时消息的发送，比如订单在30分钟未支付做无效处理等场景，延时使用的是heap包的优级先队列，实现了里面的一些方法。通过判断当前时间和延时时间做对比，然后从延时队列里面弹出消息再发送到channel中，后续流程和普通消息一样，我看网上有 人碰到过说延时消息会有并发问题，最后还用的Redis的ZSET实现的，所以不确定这个延时的靠不靠谱，要求不高地倒是可以试试。

## Docker部署开发环境

使用docker compose部署：

```yaml
version: '3'
services:
  nsqlookupd:
    image: nsqio/nsq
    command: /nsqlookupd
    ports:
      - "4160"
      - "4161"
  nsqd:
    image: nsqio/nsq
    command: /nsqd --lookupd-tcp-address=nsqlookupd:4160
    depends_on:
      - nsqlookupd
    ports:
      - "4150"
      - "4151"
  nsqadmin:
    image: nsqio/nsq
    command: /nsqadmin --lookupd-http-address=nsqlookupd:4161
    depends_on:
      - nsqlookupd  
    ports:
      - "4171"

```

命令行直接部署：

```shell
docker pull nsqio/nsq:latest

# nsqlookupd
docker run -d \
    --name nsqlookupd \
    -p 4160:4160 \
    -p 4161:4161 \
    nsqio/nsq:latest \
    /nsqlookupd

# nsqd
docker run -itd \
    --name nsqd \
    -p 4150:4150 \
    -p 4151:4151 \
    --link nsqlookupd \
    nsqio/nsq:latest \
    /nsqd --lookupd-tcp-address=nsqlookupd:4160 --broadcast-address=host.docker.internal

# nsqadmin
docker run -itd \
    --name nsqadmin \
    -p 4171:4171 \
    --link nsqlookupd \
    nsqio/nsq:latest \
    /nsqadmin --lookupd-http-address=nsqlookupd:4161
```

- Web控制台访问地址： <http://127.0.0.1:4171>
- 直接使用REST API查看节点信息： <http://127.0.0.1:4161/nodes>

## Kratos下如何应用NSQ？

我对NSQ做了一个封装，要在Kratos下面使用NSQ，首先需要在项目中引用我封装的两个库：

第一个库可以视之为NSQ客户端的一个封装：

```shell
go get -u github.com/tx7do/kratos-transport/broker/nsq
```

这一个库是讲NSQ的客户端封装成一个Kratos的`transport.Server`，该库依赖上面的库：

```shell
go get -u github.com/tx7do/kratos-transport/transport/nsq
```

想要在Kratos里面应用NSQ，有两条途径可以达成：

1. 在`Data`层引用NSQ的`Broker`，仅用于发布(Publish)消息之用，换言之，就是只发送不接收的单向通讯；
2. 在`Server`层引用NSQ的`Server`，可以发布(Publish)消息，也可以订阅(Subscribe)消息，换言之，就是既发送又接收的全双工通讯。

接下来我就详细的讲解应用方法：

### 在`Data`层引用NSQ的`Broker`

首先创建NSQ的`Broker`:

```go
import (
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/nsq"
)

func NewNSQBroker(cfg *conf.Bootstrap) broker.Broker {
	b := nsq.NewBroker(
		broker.WithAddress(cfg.Data.NSQ.Addrs...),
		broker.WithCodec(cfg.Data.NSQ.Codec),
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
	NewNSQBroker,
)
```

最后，我们就可以在`Service`里面调用了：

```go
package service

type ReportService struct {
	v1.ReportServiceHTTPServer

	nsqBroker broker.Broker
	log         *log.Helper
}

func NewReportService(logger log.Logger, nsqBroker broker.Broker) *ReportService {
	l := log.NewHelper(log.With(logger, "module", "report/service/agent-service"))
	return &ReportService{
		log:         l,
		nsqBroker: nsqBroker,
	}
}

func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {
	_ = s.nsqBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
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

### 在`Server`层引用NSQ的`Server`

首先要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/nsq"
)

// NewNSQServer create a nsq server.
func NewNSQServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.SaverService) *nsq.Server {
	ctx := context.Background()

	srv := nsq.NewServer(
		nsq.WithAddress(cfg.Server.NSQ.Addrs),
		nsq.WithGlobalTracerProvider(),
		nsq.WithGlobalPropagator(),
		nsq.WithCodec("json"),
	)

	registerNSQSubscribers(ctx, srv, svc)

	return srv
}

func registerNSQSubscribers(ctx context.Context, srv *nsq.Server, svc *service.SaverService) {
	_ = nsq.RegisterSubscriber(srv, 
		topic.UserReportData,
		svc.SaveUserReport,
	)

	_ = nsq.RegisterSubscriber(srv, 
		topic.EventReportData,
		svc.SaveEventReport,
	)
}
```

接着，调用`kratos.Server`把NSQ的服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *nsq.Server) *kratos.App {
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

最后，我们就可以在`Service`里愉快的玩耍了，在这里，我只演示收到NSQ消息之后立即写入数据库的操作：

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
- [分布式实时消息平台NSQ](https://zhuanlan.zhihu.com/p/37081073)
- [NSQ 简介](https://bean-li.github.io/nsq-1/)
- [[DAY25]Golang的實時分佈式消息傳遞平台-NSQ](https://ithelp.ithome.com.tw/articles/10247828)
- [為什麼要使用Nsq](https://www.796t.com/content/1545012186.html)
- [NSQ官网](https://nsq.io/)
