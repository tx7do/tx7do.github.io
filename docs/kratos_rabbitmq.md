# Golang微服务框架Kratos应用RabbitMQ消息队列

消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。

消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。

在本文当中，您将了解到：什么是消息队列？什么是RabbitMQ？怎样在微服务框架Kratos当中应用RabbitMQ进行业务开发。

## 什么是消息队列

消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。

消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。

消息中间件是分布式系统中重要的组件，主要解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性的系统架构。目前使用较多的消息队列有：ActiveMQ、RabbitMQ、ZeroMQ、Kafka、MetaMQ、RabbitMQ、NAQ、NATS、Pulsar等。

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

## 什么是RabbitMQ？

RabbitMQ是一套开源（MPL）的消息队列服务软件，是由 LShift 提供的一个 Advanced Message Queuing Protocol (AMQP) 的开源实现，由以高性能、健壮以及可伸缩性出名的 Erlang 写成。

AMQP ：高级消息队列协议，是应用层协议的一个开放标准，为面向消息的中间件设计。消息中间件主要用于组件之间的解耦，消息的发送者无需知道消息使用者的存在，反之亦然。 AMQP 的主要特征是面向消息、队列、路由（包括点对点和发布 / 订阅）、可靠性、安全。 RabbitMQ 是一个开源的 AMQP 实现，服务器端用 Erlang 语言编写，支持多种客户端，如：Python、Ruby、.NET、Java、JMS、C、PHP、ActionScript、XMPP、STOMP 等，支持 AJAX。用于在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现不俗。

## RabbitMQ的特点

- **可靠性**。支持持久化，传输确认，发布确认等保证了MQ的可靠性。
- **灵活的分发消息策略**。这应该是RabbitMQ的一大特点。在消息进入MQ前由Exchange(交换机)进行路由消息。分发消息策略有：简单模式、工作队列模式、发布订阅模式、路由模式、通配符模式。
- **支持集群**。多台RabbitMQ服务器可以组成一个集群，形成一个逻辑Broker。
- **多种协议**。RabbitMQ支持多种消息队列协议，比如 STOMP、MQTT 等等。
- **支持多种语言客户端**。RabbitMQ几乎支持所有常用编程语言，包括 Java、.NET、Ruby 等等。
- **可视化管理界面**。RabbitMQ提供了一个易用的用户界面，使得用户可以监控和管理消息 Broker。
- **插件机制**。RabbitMQ提供了许多插件，可以通过插件进行扩展，也可以编写自己的插件。

## AMQP基础概念

AMQP是一套公开的消息队列协议，最早在2003年被提出，它旨在从协议层定义消息通信数据的标准格式，为的就是解决MQ市场上协议不统一的问题。RabbitMQ就是遵循AMQP标准协议开发的MQ服务。

- 即Advanced Message Queuing Protocol，一个提供统一消息服务的应用层标准高级消息队列协议,是应用层协议的一个开放标准，为面向消息的中间件设计；
- AMQP 的主要特征是面向消息、队列、路由（包括点对点和发布/订阅）、可靠性、安全。
- RabbitMQ 是一个开源的 AMQP 实现，服务器端用Erlang语言编写，支持多种客户端，如：Python、Ruby、.NET、Java、PHP等。

### Producer（生产者）

消息生产者。

从安全角度考虑，网络是不可靠的，接收消息的应用也有可能在处理消息的时候失败。基于此原因，AMQP模块包含了一个消息确认（message acknowledgements）的概念：当一个消息从队列中投递给消费者后（Consumer），消费者会通知一下消息代理（Broker），这个可以是自动的，也可以由处理消息的应用的开发者执行。当“消息确认”被启用的时候，消息代理不会完全将消息从队列中删除，直到它收到来自消费者的确认回执（acknowledgement）。

### Consumer（消费者）

消息消费者。

### Connection（连接）

一个网络连接，比如TCP/IP套接字连接。Channel是建立在Connection之上的，一个Connection可以建立多个Channel。

### Channel（信道）

信道是多路复用连接中的一条独立的双向数据流通道，为会话提供物理传输介质。Channel是在connection内部建立的逻辑连接，如果应用程序支持多线程，通常每个thread创建单独的channel进行通讯，AMQP method包含了channel id帮助客户端和message broker识别channel，所以channel之间是完全隔离的。Channel作为轻量级的Connection极大减少了操作系统建立TCP connection的开销。在客户端的每个连接里，可建立多个Channel，每个Channel代表一个会话任务。

### Broker（消息代理）

其实Broker就是接收和分发消息的应用，也就是说RabbitMQ Server就是Message Broker。

### Vhost（虚拟主机）

虚拟主机，，一批交换器（Exchange），消息队列（Queue）和相关对象。虚拟主机是共享相同身份认证和加密环境的独立服务器域。同时一个Broker里可以开设多个vhost，用作不同用户的权限分离。

### Exchange（交换机）

在RabbitMQ中，生产者将消息发送到Exchange，而不是队列（Queue）之中。消息是由Exchange路由到一个或多个队列之中，如果路由不到，或返回给生产者、或直接丢弃。

#### 交换机的类型

Exchange有4种类型对应4种不同的路由策略:

##### 1. Fanout（扇型交换机）

针对队列的广播，它会忽略BindingKey，将所有发送到该Exchange的消息路由到所有与该Exchange绑定的队列中。

##### 2. Direct（直连交换机）

它会将消息路由到那些RoutingKey和BindingKey完全一样的队列中。

##### 3. Topic（主题交换机）

与direct类似，只不过不要求RoutingKey和BindingKey完全一致，可以模糊匹配。

##### 4. Headers（头交换机）

根据消息内容中的headers属性进行匹配，很少用。

#### 交换机的状态

交换机可以有两个状态：

- 持久（durable）
- 暂存（transient）

#### 交换机的属性

- Name
- Durability （消息代理重启后，交换机是否还存在）
- Auto-delete （当所有与之绑定的消息队列都完成了对此交换机的使用后，删掉它）
- Arguments（依赖代理本身）

### Queue（消息队列）

是 RabbitMQ 的内部对象，用于存储消息。每个消息都会被投入到一个或多个队列。且多个消费者可以订阅同一个 Queue（这时 Queue 中的消息会被平均分摊给多个消费者进行处理，而不是每个消费者都收到所有的消息并处理）。

#### 属性

- Name
- Durable（消息代理重启后，队列依旧存在）
- Exclusive（只被一个连接（connection）使用，而且当连接关闭后队列即被删除）
- Auto-delete（当最后一个消费者退订后即被删除）
- Arguments（一些消息代理用他来完成类似与TTL的某些额外功能）

### Binding（绑定）

它的作用就是把Exchange（Exchange）和队列（Queue）关联起来，在绑定的时候一般会指定一个BindingKey。

### Routing Key（路由键）

生产者将消息发送给Exchange时，一般会指定一个RoutingKey，Exchange会根据这个值选择一些路由规则。

### Binding Key（绑定键）

指定当前 Exchange（交换机）下，什么样的 Routing Key（路由键）会被下派到当前绑定的 Queue 中。

## Docker部署开发环境

```shell
docker pull bitnami/rabbitmq:latest

docker run -itd \
    --hostname localhost \
    --name rabbitmq-test \
    -p 15672:15672 \
    -p 5672:5672 \
    -p 1883:1883 \
    -p 15675:15675 \
    -e RABBITMQ_PLUGINS=rabbitmq_top,rabbitmq_mqtt,rabbitmq_web_mqtt,rabbitmq_prometheus,rabbitmq_stomp,rabbitmq_auth_backend_http \
    bitnami/rabbitmq:latest

# 查看插件列表
rabbitmq-plugins list
# rabbitmq_peer_discovery_consul 
rabbitmq-plugins --offline enable rabbitmq_peer_discovery_consul
# rabbitmq_mqtt 提供与后端服务交互使用，端口1883
rabbitmq-plugins enable rabbitmq_mqtt
# rabbitmq_web_mqtt 提供与前端交互使用，端口15675
rabbitmq-plugins enable rabbitmq_web_mqtt
# 
rabbitmq-plugins enable rabbitmq_auth_backend_http
```

管理后台: <http://localhost:15672>  
默认账号: `user`  
默认密码: `bitnami`

## Kratos下如何应用RabbitMQ？

我对RabbitMQ做了一个封装，要在Kratos下面使用RabbitMQ，首先需要在项目中引用我封装的两个库：

第一个库可以视之为RabbitMQ客户端的一个封装：

```shell
go get -u github.com/tx7do/kratos-transport/broker/rabbitmq
```

这一个库是讲RabbitMQ的客户端封装成一个Kratos的`transport.Server`，该库依赖上面的库：

```shell
go get -u github.com/tx7do/kratos-transport/transport/rabbitmq
```

想要在Kratos里面应用RabbitMQ，有两条途径可以达成：

1. 在`Data`层引用RabbitMQ的`Broker`，仅用于发布(Publish)消息之用，换言之，就是只发送不接收的单向通讯；
2. 在`Server`层引用RabbitMQ的`Server`，可以发布(Publish)消息，也可以订阅(Subscribe)消息，换言之，就是既发送又接收的全双工通讯。

接下来我就详细的讲解应用方法：

### 在`Data`层引用RabbitMQ的`Broker`

首先创建RabbitMQ的`Broker`:

```go
import (
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/rabbitmq"
)

func NewRabbitMQBroker(cfg *conf.Bootstrap) broker.Broker {
	b := rabbitmq.NewBroker(
		broker.WithAddress(cfg.Data.RabbitMQ.Addrs...),
		broker.WithCodec(cfg.Data.RabbitMQ.Codec),
		rabbitmq.WithExchangeName(cfg.Data.RabbitMQ.Exchange),
		rabbitmq.WithDurableExchange(),
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
	NewRabbitMQBroker,
)
```

最后，我们就可以在`Service`里面调用了：

```go
package service

type ReportService struct {
	v1.ReportServiceHTTPServer

	rabbitmqBroker broker.Broker
	log         *log.Helper
}

func NewReportService(logger log.Logger, rabbitmqBroker broker.Broker) *ReportService {
	l := log.NewHelper(log.With(logger, "module", "report/service/agent-service"))
	return &ReportService{
		log:         l,
		rabbitmqBroker: rabbitmqBroker,
	}
}

func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {
	_ = s.rabbitmqBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
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

### 在`Server`层引用RabbitMQ的`Server`

首先要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/rabbitmq"
)

// NewRabbitMQServer create a rabbitmq server.
func NewRabbitMQServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.SaverService) *rabbitmq.Server {
	ctx := context.Background()

	srv := rabbitmq.NewServer(
		rabbitmq.WithGlobalTracerProvider(),
		rabbitmq.WithGlobalPropagator(),
		rabbitmq.WithCodec("json"),
		rabbitmq.WithAddress(cfg.Server.RabbitMQ.Addrs),
		rabbitmq.WithExchange(cfg.Data.RabbitMQ.Exchange, cfg.Data.RabbitMQ.DurableExchange),
	)

	registerRabbitMQSubscribers(ctx, srv, svc)

	return srv
}

func registerRabbitMQSubscribers(ctx context.Context, srv *rabbitmq.Server, svc *service.SaverService) {
	_ = rabbitmq.RegisterSubscriber(srv, ctx,
		topic.LoggerRouting,
		svc.SaveUserReport,
        topic.LoggerSaverQueue,
        rabbitmq.WithDurableQueue(),
	)

	_ = rabbitmq.RegisterSubscriber(srv, ctx,
		topic.LoggerRouting,
		svc.SaveEventReport,
        topic.LoggerSaverQueue,
        rabbitmq.WithDurableQueue(),
	)
}
```

接着，调用`kratos.Server`把RabbitMQ的服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *rabbitmq.Server) *kratos.App {
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

最后，我们就可以在`Service`里愉快的玩耍了，在这里，我只演示收到RabbitMQ消息之后立即写入数据库的操作：

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
- [RabbitMQ官网](https://www.rabbitmq.com/)
