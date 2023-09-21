# Golang微服务框架Kratos应用MQTT消息队列

消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。

消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。

在本文当中，您将了解到：什么是消息队列？什么是MQTT？怎样在微服务框架Kratos当中应用MQTT进行业务开发。

## 什么是消息队列

消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。

消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。

消息中间件是分布式系统中重要的组件，主要解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性的系统架构。目前使用较多的消息队列有：ActiveMQ、RabbitMQ、ZeroMQ、Kafka、MetaMQ、MQTT、NAQ、NATS、Pulsar等。

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

## 什么是MQTT？

MQTT 协议 是由`IBM`的`Andy Stanford-Clark博士`和`Arcom`（已更名为Eurotech）的`Arlen Nipper博士`于 1999 年发明，用于石油和天然气行业。工程师需要一种协议来实现最小带宽和最小电池损耗，以通过卫星监控石油管道。最初，该协议被称为消息队列遥测传输，得名于首先支持其初始阶段的 IBM 产品 MQ 系列。2010 年，IBM 发布了 MQTT 3.1 作为任何人都可以实施的免费开放协议，然后于 2013 年将其提交给结构化信息标准促进组织 (OASIS) 规范机构进行维护。2019 年，OASIS 发布了升级的 MQTT 版本 5。MQTT最初代表的意思是 **Message Queueing Telemetry Transport（消息队列遥测传输）**，现在 MQTT 不再是首字母缩写词，而是被认为是协议的正式名称。

由于MQTT协议的通讯数据很精简，非常适用于CPU资源及网络带宽有限的物联网设备，再加上已经有许多MQTT程序库被陆续开发出来，用于Arduino控制板（C/C++ ）、JavaScript(Node.js, Espruino控制板), Python……等等，还有开放源代码的MQTT服务器，使得开发物联网（Internet of Things，IoT）、机器对机器（Machine-to-Machine，M2M）的通讯变得非常简单。Facebook Messenger也是使用的MQTT协议。

## 什么是 MQTT over WSS？

MQTT over WebSockets (WSS) 是一种 MQTT 实施，用于将数据直接接收到 Web 浏览器中。MQTT 协议定义了一个 JavaScript 客户端来为浏览器提供 WSS 支持。在这种情况下，该协议照常工作，但它向 MQTT 消息添加了额外标头以支持 WSS 协议。您可以将其视为包装在 WSS 信封中的 MQTT 消息负载。

## MQTT 背后的原理是什么？

MQTT 协议基于发布/订阅模型工作。在传统的网络通信中，客户端和服务器直接相互通信。客户端向服务器请求资源或数据，然后，服务器将处理并发回响应。但是，MQTT 使用发布/订阅模式将消息发送者（发布者）与消息接收者（订阅者）解耦。相反，称为消息代理的第三个组件将处理发布者和订阅者之间的通信。代理的工作是筛选所有来自发布者的传入消息，并将它们正确地分发给订阅者。代理将发布者和订阅者解耦，如下所示：

### 空间解耦

发布者和订阅者不知道彼此的网络位置，也不交换 IP 地址或端口号等信息。

### 时间解耦

发布者和订阅者不会同时运行或具有网络连接。

### 同步解耦

发布者和订阅者都可以发送或接收消息，而不会互相干扰。例如，订阅者不必等待发布者发送消息。

## MQTT 有哪些组成部分？

MQTT 通过如下定义客户端和代理来实施发布/订阅模型。

### MQTT 客户端

MQTT 客户端是从服务器到运行 MQTT 库的微控制器的任何设备。如果客户端正在发送消息，它将充当发布者；如果它正在接收消息，它将充当接收者。基本上，任何通过网络使用 MQTT 进行通信的设备都可以称为 MQTT 客户端设备。

### MQTT 代理

MQTT 代理是协调不同客户端之间消息的后端系统。代理的职责包括接收和筛选消息、识别订阅每条消息的客户端，以及向他们发送消息。它还负责其他任务，例如：

- 授权 MQTT 客户端以及对其进行身份验证
- 将消息传递给其他系统以进行进一步分析
- 处理错过的消息和客户端会话

###  MQTT 连接

客户端和代理开始使用 MQTT 连接进行通信。客户端通过向 MQTT 代理发送 CONNECT 消息来启动连接。代理通过响应 CONNACK 消息来确认已建立连接。MQTT 客户端和代理都需要 TCP/IP 堆栈进行通信。客户端从不相互联系，它们只与代理联系。

## MQTT 的工作原理？

下面概述了 MQTT 的工作原理。

1. MQTT 客户端与 MQTT 代理建立连接。
2. 连接后，客户端可以发布消息、订阅特定消息或同时执行这两项操作。
3. MQTT 代理收到一条消息后，会将其转发给对此感兴趣的订阅者。

让我们进行详细的分解，以进一步了解详情。

### MQTT 主题

“主题(Topic)”一词是指 MQTT 代理用于为 MQTT 客户端筛选消息的关键字。主题是分层组织的，类似于文件或文件夹目录。例如，考虑在多层房屋中运行的智能家居系统，每层都有不同的智能设备。在这种情况下，MQTT 代理可以将主题组织为：

> ourhome/groundfloor/livingroom/light  
> ourhome/firstfloor/kitchen/temperature

### MQTT publish

MQTT 客户端以字节格式发布包含主题和数据的消息。客户端确定数据格式，例如文本数据、二进制数据、XML 或 JSON 文件。例如，智能家居系统中的灯可能会针对主题 livingroom/light 发布消息 on。

### MQTT subscribe

MQTT 客户端向 MQTT 代理发送 SUBSCRIBE 消息，以接收有关感兴趣主题的消息。此消息包含唯一标识符和订阅列表。例如，您手机上的智能家居应用程序想要显示您家中有多少灯亮着。它将订阅主题 light 并增加所有 on 消息的计数器。

## MQTT 设计规范

由于物联网的环境是非常特别的，所以MQTT遵循以下设计原则：

1. 精简，不添加可有可无的功能； 
2. 发布/订阅（Pub/Sub）模式，方便消息在传感器之间传递； 
3. 允许用户动态创建主题，零运维成本； 
4. 把传输量降到最低以提高传输效率； 
5. 把低带宽、高延迟、不稳定的网络等因素考虑在内； 
6. 支持连续的会话控制； 
7. 理解客户端计算能力可能很低； 
8. 提供服务质量管理； 
9. 假设数据不可知，不强求传输数据的类型与格式，保持灵活性。

## MQTT 主要特性

MQTT协议工作在低带宽、不可靠的网络的远程传感器和控制设备通讯而设计的协议，它具有以下主要的几项特性：

### （1）使用发布/订阅消息模式，提供一对多的消息发布，解除应用程序耦合。

这一点很类似于XMPP，但是MQTT的信息冗余远小于XMPP，,因为XMPP使用XML格式文本来传递数据。

### （2）对负载内容屏蔽的消息传输。

### （3）使用TCP/IP提供网络连接。

主流的MQTT是基于TCP连接进行数据推送的，但是同样有基于UDP的版本，叫做MQTT-SN。这两种版本由于基于不同的连接方式，优缺点自然也就各有不同了。

### （4）有三种消息发布服务质量：

- "至多一次"，消息发布完全依赖底层TCP/IP网络。会发生消息丢失或重复。这一级别可用于如下情况，环境传感器数据，丢失一次读记录无所谓，因为不久后还会有第二次发送。这一种方式主要普通APP的推送，倘若你的智能设备在消息推送时未联网，推送过去没收到，再次联网也就收不到了。
- "至少一次"，确保消息到达，但消息重复可能会发生。
- "只有一次"，确保消息到达一次。在一些要求比较严格的计费系统中，可以使用此级别。在计费系统中，消息重复或丢失会导致不正确的结果。这种最高质量的消息发布服务还可以用于即时通讯类的APP的推送，确保用户收到且只会收到一次。

### （5）小型传输，开销很小（固定长度的头部是2字节），协议交换最小化，以降低网络流量。

这就是为什么在介绍里说它非常适合"在物联网领域，传感器与服务器的通信，信息的收集"，要知道嵌入式设备的运算能力和带宽都相对薄弱，使用这种协议来传递消息再适合不过了。

### （6）使用Last Will和Testament特性通知有关各方客户端异常中断的机制。

- Last Will：即遗言机制，用于通知同一主题下的其他设备发送遗言的设备已经断开了连接。
- Testament：遗嘱机制，功能类似于Last Will。

## MQTT协议中的方法

MQTT协议中定义了一些方法（也被称为动作），来于表示对确定资源所进行操作。这个资源可以代表预先存在的数据或动态生成数据，这取决于服务器的实现。通常来说，资源指服务器上的文件或输出。主要方法有：

1. Connect。等待与服务器建立连接。 
2. Disconnect。等待MQTT客户端完成所做的工作，并与服务器断开TCP/IP会话。 
3. Subscribe。等待完成订阅。
4. UnSubscribe。等待服务器取消客户端的一个或多个topics订阅。
5. Publish。MQTT客户端发送消息请求，发送完成后返回应用程序线程。

## 基本概念

### Message ID

消息的全局唯一标识，由微消息队列MQTT版系统自动生成，唯一标识某条消息。Message ID可用于回溯消息轨迹，排查问题。

### MQTT服务器

MQTT服务器可以称为"消息代理"（Broker），可以是一个应用程序或一台设备。它是位于消息发布者和订阅者之间，它可以：

1. 接受来自客户的网络连接； 
2. 接受客户发布的应用信息； 
3. 处理来自客户端的订阅和退订请求； 
4. 向订阅的客户转发应用程序消息。

### MQTT客户端

一个使用MQTT协议的应用程序或者设备，它总是建立到服务器的网络连接。客户端可以：

1. 发布其他客户端可能会订阅的信息；
2. 订阅其它客户端发布的消息；
3. 退订或删除应用程序的消息；
4. 断开与服务器连接。

### 消息服务质量(QoS)

QoS（Quality of Service）指消息传输的服务质量。分别可在消息发送端和消息消费端设置。

- 发送端的QoS设置：影响发送端发送消息到微消息队列MQTT版的传输质量。
- 消费端的QoS设置：影响微消息队列MQTT版服务端投递消息到消费端的传输质量。

QoS包括以下级别：

- QoS0：代表最多分发一次。
- QoS1：代表至少达到一次。
- QoS2：代表仅分发一次。

### 订阅（Subscription）

订阅包含`主题筛选器（Topic Filter）`和最大`消息服务质量（QoS）`。订阅会与一个`会话（Session）`关联。一个会话可以包含多个订阅。每一个会话中的每个订阅都有一个不同的主题筛选器。

### 会话（Session）

每个客户端与服务器建立连接后就是一个会话，客户端和服务器之间有状态交互。会话存在于一个网络之间，也可能在客户端和服务器之间跨越多个连续的网络连接。

### 主题名（Topic Name）

连接到一个应用程序消息的标签，该标签与服务器的订阅相匹配。服务器会将消息发送给订阅所匹配标签的每个客户端。

### 主题筛选器（Topic Filter）

一个对主题名通配符筛选器，在订阅表达式中使用，表示订阅所匹配到的多个主题。

### 负载（Payload）

消息订阅者所具体接收的内容。

### cleanSession

cleanSession标志是MQTT协议中对一个消费者客户端建立TCP连接后是否关心之前状态的定义，与消息发送端的设置无关。具体语义如下：

- cleanSession=true：消费者客户端再次上线时，将不再关心之前所有的订阅关系以及离线消息。
- cleanSession=false：消费者客户端再次上线时，还需要处理之前的离线消息，而之前的订阅关系也会持续生效。

消费端QoS和cleanSession的不同组合产生的结果如表 1所示。

表 1. QoS和cleanSession的组合关系

| QoS级别	 | cleanSession=true	 | cleanSession=false |
|--------|--------------------|--------------------|
| QoS0   | 无离线消息，在线消息只尝试推一次。  | 无离线消息，在线消息只尝试推一次。  |
| QoS1   | 无离线消息，在线消息保证可达。    | 有离线消息，所有消息保证可达。    |
| QoS2   | 无离线消息，在线消息保证只推一次。  | 暂不支持。              |

## Docker部署开发环境

### RabbitMQ

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

### mosquitto

```shell
docker pull eclipse-mosquitto:latest

# 1883 tcp
# 9001 websockets
docker run -itd \
    --name mosquitto-test \
    -p 1883:1883 \
    -p 9001:9001 \
    eclipse-mosquitto:latest
```

### EMX

```shell
docker pull emqx/emqx:latest

docker run -itd \
    --name emqx-test \
    --add-host=host.docker.internal:host-gateway \
    -p 18083:18083 \
    -p 1883:1883 \
    emqx/emqx:latest
```

管理后台: <http://localhost:18083>  
默认账号: `admin`  
默认密码: `public`

### HiveMQ

```bash
docker pull hivemq/hivemq4:latest

docker run -itd \
    --name hivemq-test \
    --ulimit nofile=500000:500000 \
    -p 8080:8080 \
    -p 8000:8000 \
    -p 1883:1883 \
    hivemq/hivemq4:latest
```

## 热门在线公共 MQTT 服务器

| 名称	        | Broker 地址	               | TCP  | TLS         | WebSocket |
|------------|--------------------------|------|-------------|-----------|
| EMQ X	     | broker.emqx.io	          | 1883 | 8883        | 8083,8084 |
| EMQ X（国内）	 | broker-cn.emqx.io	       | 1883 | 8883        | 8083,8084 |
| Eclipse    | mqtt.eclipseprojects.io	 | 1883 | 8883        | 80, 443   |
| Mosquitto  | test.mosquitto.org	      | 1883 | 8883, 8884	 | 80        |
| HiveMQ     | broker.hivemq.com	       | 1883 | N/A	        | 8000      |

## Kratos下如何应用MQTT？

我对MQTT做了一个封装，要在Kratos下面使用MQTT，首先需要在项目中引用我封装的两个库：

第一个库可以视之为MQTT客户端的一个封装：

```shell
go get -u github.com/tx7do/kratos-transport/broker/mqtt
```

这一个库是讲MQTT的客户端封装成一个Kratos的`transport.Server`，该库依赖上面的库：

```shell
go get -u github.com/tx7do/kratos-transport/transport/mqtt
```

想要在Kratos里面应用MQTT，有两条途径可以达成：

1. 在`Data`层引用MQTT的`Broker`，仅用于发布(Publish)消息之用，换言之，就是只发送不接收的单向通讯；
2. 在`Server`层引用MQTT的`Server`，可以发布(Publish)消息，也可以订阅(Subscribe)消息，换言之，就是既发送又接收的全双工通讯。

接下来我就详细的讲解应用方法：

### 在`Data`层引用MQTT的`Broker`

首先创建MQTT的`Broker`:

```go
import (
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/mqtt"
)

func NewMQTTBroker(cfg *conf.Bootstrap) broker.Broker {
	b := mqtt.NewBroker(
		broker.WithAddress(cfg.Data.MQTT.Addrs...),
		broker.WithCodec(cfg.Data.MQTT.Codec),
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
	NewMQTTBroker,
)
```

最后，我们就可以在`Service`里面调用了：

```go
package service

type ReportService struct {
	v1.ReportServiceHTTPServer

	mqttBroker broker.Broker
	log         *log.Helper
}

func NewReportService(logger log.Logger, mqttBroker broker.Broker) *ReportService {
	l := log.NewHelper(log.With(logger, "module", "report/service/agent-service"))
	return &ReportService{
		log:         l,
		mqttBroker: mqttBroker,
	}
}

func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {
	_ = s.mqttBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
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

### 在`Server`层引用MQTT的`Server`

首先要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/mqtt"
)

// NewMQTTServer create a mqtt server.
func NewMQTTServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.SaverService) *mqtt.Server {
	ctx := context.Background()

	srv := mqtt.NewServer(
		mqtt.WithAddress(cfg.Server.MQTT.Addrs),
		mqtt.WithGlobalTracerProvider(),
		mqtt.WithGlobalPropagator(),
		mqtt.WithCodec("json"),
	)

	registerMQTTSubscribers(ctx, srv, svc)

	return srv
}

func registerMQTTSubscribers(ctx context.Context, srv *mqtt.Server, svc *service.SaverService) {
	_ = mqtt.RegisterSubscriber(srv, ctx,
		topic.UserReportData,
		svc.SaveUserReport,
	)

	_ = mqtt.RegisterSubscriber(srv, ctx,
		topic.EventReportData,
		svc.SaveEventReport,
	)
}
```

接着，调用`kratos.Server`把MQTT的服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *mqtt.Server) *kratos.App {
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

最后，我们就可以在`Service`里愉快的玩耍了，在这里，我只演示收到MQTT消息之后立即写入数据库的操作：

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
- [MQTT教學（一）：認識MQTT](https://swf.com.tw/?p=1002)
- [MQTT 入门介绍](https://www.runoob.com/w3cnote/mqtt-intro.html)
- [什么是 MQTT？](https://aws.amazon.com/cn/what-is/mqtt/?nc1=h_ls)
