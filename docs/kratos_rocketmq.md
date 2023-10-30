# Golang微服务框架Kratos应用RocketMQ消息队列

消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。

消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。

在本文当中，您将了解到：什么是消息队列？什么是RocketMQ？怎样在微服务框架Kratos当中应用RocketMQ进行业务开发。

## 什么是消息队列

消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。

消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。

消息中间件是分布式系统中重要的组件，主要解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性的系统架构。目前使用较多的消息队列有：ActiveMQ、RabbitMQ、ZeroMQ、RocketMQ、MetaMQ、RocketMQ、NAQ、NATS、Pulsar等。

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

## 什么是RocketMQ？

RocketMQ是由阿里捐赠给Apache的一款低延迟、高并发、高可用、高可靠的分布式消息中间件。经历了淘宝双十一的洗礼。RocketMQ既可为分布式应用系统提供异步解耦和削峰填谷的能力，同时也具备互联网应用所需的海量消息堆积、高吞吐、可靠重试等特性。

## RocketMQ 特点

- RocketMQ 是一个队列模型的消息中间件，具有高性能、高可靠、高实时、分布式等特点
- Producer、Consumer、队列都可以分布式
- Producer 向一些队列轮流发送消息，队列集合称为 Topic，Consumer 如果做广播消费，则一个 Consumer 实例消费这个 Topic 对应的所有队列，如果做集群消费，则多个 Consumer 实例平均消费这个 Topic 对应的队列集合
- 能够保证严格的消息顺序
- 支持拉（pull）和推（push）两种消息模式
- 高效的订阅者水平扩展能力
- 实时的消息订阅机制
- 亿级消息堆积能力
- 支持多种消息协议，如 JMS、OpenMessaging 等
- 较少的依赖

## RocketMQ 核心概念

- **Topic**：消息主题，一级消息类型，生产者向其发送消息。
- **Message**：生产者向Topic发送并最终传送给消费者的数据消息的载体。
- **消息属性**：生产者可以为消息定义的属性，包含Message Key和Tag。
- **Message Key**：消息的业务标识，由消息生产者（Producer）设置，唯一标识某个业务逻辑。
- **Message ID**：消息的全局唯一标识，由消息队列RocketMQ系统自动生成，唯一标识某条消息。
- **Tag**：消息标签，二级消息类型，用来进一步区分某个Topic下的消息分类
- **Producer**：也称为消息发布者，负责生产并发送消息至Topic。
- **Consumer**：也称为消息订阅者，负责从Topic接收并消费消息。
- **分区**：即Topic Partition，物理上的概念。每个Topic包含一个或多个分区。
- **消费位点**：每个Topic会有多个分区，每个分区会统计当前消息的总条数，这个称为最大位点MaxOffset；分区的起始位置对应的位置叫做起始位点MinOffset。
- **Group**：一类生产者或消费者，这类生产者或消费者通常生产或消费同一类消息，且消息发布或订阅的逻辑一致。
- **Group ID**：Group的标识。
- **队列**：个Topic下会由一到多个队列来存储消息。
- **Exactly-Once投递语义**：Exactly-Once投递语义是指发送到消息系统的消息只能被Consumer处理且仅处理一次，即使Producer重试消息发送导致某消息重复投递，该消息在Consumer也只被消费一次。
- **集群消费**：一个Group ID所标识的所有Consumer平均分摊消费消息。例如某个Topic有9条消息，一个Group ID有3个Consumer实例，那么在集群消费模式下每个实例平均分摊，只消费其中的3条消息。
- **广播消费**：一个Group ID所标识的所有Consumer都会各自消费某条消息一次。例如某个Topic有9条消息，一个Group ID有3个Consumer实例，那么在广播消费模式下每个实例都会各自消费9条消息。
- **定时消息**：Producer将消息发送到消息队列RocketMQ服务端，但并不期望这条消息立马投递，而是推迟到在当前时间点之后的某一个时间投递到Consumer进行消费，该消息即定时消息。
- **延时消息**：Producer将消息发送到消息队列RocketMQ服务端，但并不期望这条消息立马投递，而是延迟一定时间后才投递到Consumer进行消费，该消息即延时消息。
- **事务消息**：RocketMQ提供类似X/Open XA的分布事务功能，通过消息队列RocketMQ的事务消息能达到分布式事务的最终一致。
- **顺序消息**：RocketMQ提供的一种按照顺序进行发布和消费的消息类型，分为全局顺序消息和分区顺序消息。
- **全局顺序消息**：对于指定的一个Topic，所有消息按照严格的先入先出（FIFO）的顺序进行发布和消费。
- **分区顺序消息**：对于指定的一个Topic，所有消息根据Sharding Key进行区块分区。同一个分区内的消息按照严格的FIFO顺序进行发布和消费。Sharding Key是顺序消息中用来区分不同分区的关键字段，和普通消息的Message Key是完全不同的概念。
- **消息堆积**：Producer已经将消息发送到消息队列RocketMQ的服务端，但由于Consumer消费能力有限，未能在短时间内将所有消息正确消费掉，此时在消息队列RocketMQ的服务端保存着未被消费的消息，该状态即消息堆积。
- **消息过滤**：Consumer可以根据消息标签（Tag）对消息进行过滤，确保Consumer最终只接收被过滤后的消息类型。消息过滤在消息队列RocketMQ的服务端完成。
- **消息轨迹**：在一条消息从Producer发出到Consumer消费处理过程中，由各个相关节点的时间、地点等数据汇聚而成的完整链路信息。通过消息轨迹，您能清晰定位消息从Producer发出，经由消息队列RocketMQ服务端，投递给Consumer的完整链路，方便定位排查问题。
- **重置消费位点**：以时间轴为坐标，在消息持久化存储的时间范围内（默认3天），重新设置Consumer对已订阅的Topic的消费进度，设置完成后Consumer将接收设定时间点之后由Producer发送到消息队列RocketMQ服务端的消息。
- **死信队列**：死信队列用于处理无法被正常消费的消息。当一条消息初次消费失败，消息队列RocketMQ会自动进行消息重试；达到最大重试次数后，若消费依然失败，则表明Consumer在正常情况下无法正确地消费该消息。此时，消息队列RocketMQ不会立刻将消息丢弃，而是将这条消息发送到该Consumer对应的特殊队列中。

消息队列RocketMQ将这种正常情况下无法被消费的消息称为死信消息（Dead-Letter Message），将存储死信消息的特殊队列称为死信队列（Dead-Letter Queue）。

## RocketMQ 架构

RocketMQ 架构共有四个集群：NameServer 集群、Broker 集群、Producer 集群、Consumer 集群

### NameServer 集群

提供轻量级的服务发现及路由，每个 NameServer 记录完整的路由信息，提供相应的读写服务，支持快速存储扩展。有些其它开源中间件使用 ZooKeeper 实现服务发现及路由功能，如 Apache RocketMQ。

NameServer是一个功能齐全的服务器，主要包含两个功能：

1) Broker 管理，接收来自 Broker 集群的注册请求，提供心跳机制检测 Broker 是否存活
2) 路由管理，每个 NameServer 持有全部有关 Broker 集群和客户端请求队列的路由信息

### Broker 集群

通过提供轻量级的 Topic 和Queue 机制处理消息存储。同时支持推（Push）和拉（Pull）两种模型，包含容错机制。提供强大的峰值填充和以原始时间顺序累积数千亿条消息的能力。此外还提供灾难恢复，丰富的指标统计数据和警报机制，这些都是传统的消息系统缺乏的。

Broker 有几个重要的子模块：

1) 远程处理模块，Broker 入口，处理来自客户端的请求
2) 客户端管理，管理客户端（包括消息生产者和消费者），维护消费者的主题订阅
3) 存储服务，提供在物理硬盘上存储和查询消息的简单 API
4) HA 服务，提供主从 Broker 间数据同步
5) 索引服务，通过指定键为消息建立索引并提供快速消息查询

### Producer 集群

消息生产者支持分布式部署，分布式生产者通过多种负载均衡模式向 Broker 集群发送消息。

### Consumer 集群

消息消费者也支持 Push 和 Pull 模型的分布式部署，还支持集群消费和消息广播。提供了实时的消息订阅机制，可以满足大多数消费者的需求。

## RocketMQ 消息收发模型

消息队列RocketMQ支持发布和订阅模型，消息生产者应用创建Topic并将消息发送到Topic。消费者应用创建对Topic的订阅以便从其接收消息。通信可以是一对多（扇出）、多对一（扇入）和多对多。具体通信如下图所示。

- 生产者集群：用来表示发送消息应用，一个生产者集群下包含多个生产者实例，可以是多台机器，也可以是一台机器的多个进程，或者一个进程的多个生产者对象。

- 消费者集群：用来表示消费消息应用，一个消费者集群下包含多个消费者实例，可以是多台机器，也可以是多个进程，或者是一个进程的多个消费者对象。

一个生产者集群可以发送多个Topic消息。发送分布式事务消息时，如果生产者中途意外宕机，消息队列RocketMQ服务端会主动回调生产者集群的任意一台机器来确认事务状态。

一个消费者集群下的多个消费者以均摊方式消费消息。如果设置的是广播方式，那么这个消费者集群下的每个实例都消费全量数据。

一个消费者集群对应一个Group ID，一个Group ID可以订阅多个Topic，如上图中的Group 2所示。Group和Topic的订阅关系可以通过直接在程序中设置即可。

## Docker部署开发环境

#### RocketMQ4.x

至少启动一个NameServer，一个Broker。

```bash
docker pull apache/rocketmq:4.9.2

# NameServer
docker run -d \
    --name rocketmq-namesrv \
    -e "JAVA_OPT_EXT=-server -Xms512M -Xmx512M -Xmn128m" \
    -p 9876:9876 \
    apache/rocketmq:4.9.2 \
    sh mqnamesrv

# Broker
docker run -d \
    --name rocketmq-broker \
    -p 10911:10911 \
    -p 10909:10909 \
    -p 10912:10912 \
    --link rocketmq-namesrv \
    -e "JAVA_OPT_EXT=-server -Xms512M -Xmx512M -Xmn128m" \
    -e "NAMESRV_ADDR=rocketmq-namesrv:9876" \
    apache/rocketmq:4.9.2 \
    sh mqbroker -c /home/rocketmq/rocketmq-4.9.2/conf/broker.conf
```

以及Web控制台：

```bash
docker pull styletang/rocketmq-console-ng:latest

docker run -d \
    --name rocketmq-console \
    -p 9800:8080 \
    --link rocketmq-namesrv \
    -e "JAVA_OPT_EXT=-server -Xms512M -Xmx512M -Xmn128m" \
    -e "JAVA_OPTS=-Xmx256M -Xms256M -Xmn128M -Drocketmq.namesrv.addr=rocketmq-namesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false" \
    -t styletang/rocketmq-console-ng:latest
```

RocketMQ Console 是 rocketmq 的第三方扩展组件，提供图形界面便于管理和监控rocketmq。

- 控制台访问地址： <http://localhost:9800/#/>

**需要注意的是**，NameServer下发的是Docker容器的内网IP地址，从宿主机的外网访问是访问不了的，需要进行配置：

```bash
vi /home/rocketmq/rocketmq-5.1.4/conf/broker.conf
```

添加如下配置，brokerIP1可以是ip也可以是dns，hostname：

```ini
brokerIP1 = host.docker.internal
```

#### RocketMQ5.x

至少启动一个NameServer，一个Broker。

5.x版本下，官方建议使用Local模式部署，即Broker和Proxy同进程部署。

```bash
docker pull apache/rocketmq:5.1.4

# NameServer
docker run -d \
    --name rocketmq-namesrv \
    -e "MAX_HEAP_SIZE=256M" \
    -e "HEAP_NEWSIZE=128M" \
    -p 9876:9876 \
    apache/rocketmq:5.1.4 \
    sh mqnamesrv

# Broker
docker run -d \
    --name rocketmq-broker \
    --link rocketmq-namesrv \
    -p 10911:10911 \
    -p 10909:10909 \
    -p 10912:10912 \
    -p 8080:8080 \
    -p 8081:8081 \
    -e "MAX_HEAP_SIZE=256M" \
    -e "HEAP_NEWSIZE=128M" \
    -e "JAVA_OPTS=-server -Xmx256M -Xms256M -Xmn128M" \
    -e "NAMESRV_ADDR=rocketmq-namesrv:9876" \
    apache/rocketmq:5.1.4 \
    sh mqbroker --enable-proxy autoCreateTopicEnable=true autoCreateSubscriptionGroup=true \
    -c /home/rocketmq/rocketmq-5.1.4/conf/broker.conf
```

以及Web控制台：

```bash
docker run -d \
    --restart=always \
    --name rocketmq-dashboard \
    --link rocketmq-namesrv \
    -e "JAVA_OPTS=-Xmx256M -Xms256M -Xmn128M -Drocketmq.namesrv.addr=rocketmq-namesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false" \
    -p 9800:8080 \
    apacherocketmq/rocketmq-dashboard
```

- 控制台访问地址： <http://localhost:9800/#/>

## Kratos下如何应用RocketMQ？

我对RocketMQ做了一个封装，要在Kratos下面使用RocketMQ，首先需要在项目中引用我封装的两个库：

第一个库可以视之为RocketMQ客户端的一个封装：

```shell
go get -u github.com/tx7do/kratos-transport/broker/rocketmq
```

这一个库是讲ROcketMQ的客户端封装成一个Kratos的`transport.Server`，该库依赖上面的库：

```shell
go get -u github.com/tx7do/kratos-transport/transport/rocketmq
```

想要在Kratos里面应用RocketMQ，有两条途径可以达成：

1. 在`Data`层引用RocketMQ的`Broker`，仅用于发布(Publish)消息之用，换言之，就是只发送不接收的单向通讯；
2. 在`Server`层引用RocketMQ的`Server`，可以发布(Publish)消息，也可以订阅(Subscribe)消息，换言之，就是既发送又接收的全双工通讯。

接下来我就详细的讲解应用方法：

### 在`Data`层引用RocketMQ的`Broker`

首先创建RocketMQ的`Broker`:

```go
import (
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/rocketmq"
)

func NewRocketMQBroker(cfg *conf.Bootstrap) broker.Broker {
	b := rocketmq.NewBroker(
		broker.WithNameServer(cfg.Data.RocketMQ.Addrs),
		broker.WithCodec(cfg.Data.RocketMQ.Codec),
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
	NewRocketMQBroker,
)
```

最后，我们就可以在`Service`里面调用了：

```go
package service

type ReportService struct {
	v1.ReportServiceHTTPServer

	rocketmqBroker broker.Broker
	log         *log.Helper
}

func NewReportService(logger log.Logger, rocketmqBroker broker.Broker) *ReportService {
	l := log.NewHelper(log.With(logger, "module", "report/service/agent-service"))
	return &ReportService{
		log:         l,
		rocketmqBroker: rocketmqBroker,
	}
}

func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {
	_ = s.rocketmqBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
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

### 在`Server`层引用RocketMQ的`Server`

首先要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/rocketmq"
)

// NewRocketMQServer create a rocketmq server.
func NewRocketMQServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.SaverService) *rocketmq.Server {
	ctx := context.Background()

	srv := rocketmq.NewServer(
		rocketmq.WithNameServer(cfg.Server.RocketMQ.Addrs),
		rocketmq.WithGlobalTracerProvider(),
		rocketmq.WithGlobalPropagator(),
		rocketmq.WithCodec("json"),
	)

	registerRocketMQSubscribers(ctx, srv, svc)

	return srv
}

func registerRocketMQSubscribers(ctx context.Context, srv *rocketmq.Server, svc *service.SaverService) {
	_ = rocketmq.RegisterSubscriber(srv, ctx,
		topic.UserReportData, topic.LoggerSaverQueue, false,
		svc.SaveUserReport,
	)

	_ = rocketmq.RegisterSubscriber(srv, ctx,
		topic.EventReportData, topic.LoggerSaverQueue, false,
		svc.SaveEventReport,
	)
}
```

接着，调用`kratos.Server`把RocketMQ的服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *rocketmq.Server) *kratos.App {
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

最后，我们就可以在`Service`里愉快的玩耍了，在这里，我只演示收到RocketMQ消息之后立即写入数据库的操作：

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
- [什么是消息队列RocketMQ版？](https://help.aliyun.com/document_detail/29532.html?userCode=qtldtin2)
- [RocketMQ 介绍及核心概念](https://www.jianshu.com/p/2ae8e81718d3)
- [RocketMQ 简介](https://segmentfault.com/a/1190000038844218)
- [Apache RocketMQ 官网](https://rocketmq.apache.org/)
