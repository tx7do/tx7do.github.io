# golang微服务框架Kratos实现消息队列

## 什么是消息队列

MQ就是消息队列，是Message Queue的缩写。消息队列是一种通信方式。消息的本质就是一种数据结构。因为MQ把项目中的消息集中式的处理和存储，所以MQ主要有解耦，并发，和削峰的功能。

## 为什么要使用消息队列

### 1. 异步

通常的微服务实现里面，都是通过RPC进行微服务之间的相互调用，这是同步的。如果消息队列的话，可以实现异步的调用。至于异步有啥好处呢，主要是为了削峰。

### 2. 削峰

同步的调用会带来一个问题：瞬时流量。客户的调用同步接口节奏，你是无法把控的，流量将会是忽高忽低的，猛的来一波，搞不好系统就崩了溃了。

如果消息队列的话，可以实现异步的调用，并且可以实现削峰，请求进来，我先放到消息队列里面去，慢慢消化掉，不至于猛的来一下，把系统击垮。

### 3. 解耦

通常的微服务实现里面，都是通过RPC进行微服务之间的相互调用，那么意味着，你要做到一件事情，你必须要知道做事情的对方是谁。在微服务的世界里面，如果设计得不好，那就是一团糟的相互调用网络，看得你晕晕的，运维会疯，后面接手的开发人员也得疯。

应用了消息队列，你就只需要跟消息队列这个代理打交道，单线联系，关系简单。我们只需要生产消息，消费消息，至于是谁消费的，谁生产的，完全不用去管它。架构上，就会清爽多了。所以，要对服务进行解耦，消息队列是一个很好的选择。

## Kratos与消息队列

Kratos现在的版本（[v2.2.1](https://github.com/go-kratos/kratos/releases/tag/v2.2.1)）中，还没有对消息队列的直接支持，但是要运用还是容易的。官方有一个空壳示例代码[BeerShop](https://github.com/go-kratos/beer-shop/blob/main/app/courier/job/internal/data/data.go)，可以看到，在data层，使用Kafka的痕迹。

对于在Kratos微服务框架里面应用消息队列，我认为有两种方式可以实现：

1. 在data层，使用消息队列，但是在这个层，你只能在那生产消息，而不好消费消息。
2. 将消息队列的客户端实现为微服务的一个Server，然后在微服务的Service中消费消息和生产消息。

第一个方式的应用面不广，更多的时候，第二种方式的应用面会更广一些，我选择了第二种方式。但是，Kratos官方并没有支持这一种方式。故而，我只能够自己动手实现了，我从另外一个微服务[Go-Micro](https://github.com/asim/go-micro)里面提取了其Broker的实现，并且将其实现为Kratos框架里面的一个Server。事实证明，这样是可行的，并且很好使。

你可能会问，为什么我不直接使用Go-Micro呢？因为Go-Micro是一个很重的微服务框架，尽管它的功能很丰富，几乎支持了大部分的微服务需求。但是对于一个应用来说，我并不需要使用所有的技术栈、中间件，我只需要部分的技术栈。所以，我宁愿做加法，也不愿意去做减法。对于服务端来说，可控、可用、可维护是最重要的。极简，是一个很好的选择。另外，我还要腹诽一点，我从Go-Micro提取出来的Broker在测试的过程中发现，都有一些瑕疵。

我实现的代码，我放到了github：<https://github.com/tx7do/kratos-transport>。

它所支持的协议和消息队列有：

* Kafka
* RabbitMQ
* NATS
* Redis
* MQTT
* WebSocket

基本上是够用了。

## kratos-transport的应用

它主要分为了3个部分：

### 1. Codec 编解码器

编解码器现在使用的是Kratos的编解码器。

### 2. Broker 消息队列客户端

可以直接拿来使用，我拿Kafka举例：

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kratos/kratos/v2/encoding"
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/broker/kafka"
)

const (
	testBrokers = "localhost:9092"
	testTopic   = "test_topic"
	testGroupId = "a-group"
)

type Hygrothermograph struct {
	Humidity    float64 `json:"humidity"`
	Temperature float64 `json:"temperature"`
}

func registerHygrothermographHandler() broker.Handler {
	return func(ctx context.Context, event broker.Event) error {
		var msg *Hygrothermograph = nil

		switch t := event.Message().Body.(type) {
		case []byte:
			msg = &Hygrothermograph{}
			if err := json.Unmarshal(t, msg); err != nil {
				return err
			}
		case string:
			msg = &Hygrothermograph{}
			if err := json.Unmarshal([]byte(t), msg); err != nil {
				return err
			}
		case *Hygrothermograph:
			msg = t
		default:
			return fmt.Errorf("unsupported type: %T", t)
		}

		if err := handleHygrothermograph(ctx, event.Topic(), event.Message().Headers, msg); err != nil {
			return err
		}

		return nil
	}
}

func handleHygrothermograph(_ context.Context, topic string, headers broker.Headers, msg *Hygrothermograph) error {
	log.Printf("Headers: %+v, Humidity: %.2f Temperature: %.2f\n", headers, msg.Humidity, msg.Temperature)
	return nil
}

func main() {
	ctx := context.Background()

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	b := kafka.NewBroker(
		broker.OptionContext(ctx),
		broker.Addrs(testBrokers),
		broker.Codec(encoding.GetCodec("json")),
	)

	_, err := b.Subscribe(testTopic,
		registerHygrothermographHandler(),
		func() broker.Any {
			return &Hygrothermograph{}
		},
		broker.SubscribeContext(ctx),
		broker.Queue(testGroupId),
	)
	if err != nil {
		fmt.Println(err)
	}

	<-interrupt
}

```

### 3. Server 封装给Kratos的Server实现

还是拿Kafka举例：

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/encoding"
	"github.com/tx7do/kratos-transport/broker"
	"github.com/tx7do/kratos-transport/transport/kafka"
)

const (
	testBrokers = "localhost:9092"
	testTopic   = "test_topic"
	testGroupId = "a-group"
)

type Hygrothermograph struct {
	Humidity    float64 `json:"humidity"`
	Temperature float64 `json:"temperature"`
}

func registerHygrothermographHandler() broker.Handler {
	return func(ctx context.Context, event broker.Event) error {
		var msg *Hygrothermograph = nil

		switch t := event.Message().Body.(type) {
		case []byte:
			msg = &Hygrothermograph{}
			if err := json.Unmarshal(t, msg); err != nil {
				return err
			}
		case string:
			msg = &Hygrothermograph{}
			if err := json.Unmarshal([]byte(t), msg); err != nil {
				return err
			}
		case *Hygrothermograph:
			msg = t
		default:
			return fmt.Errorf("unsupported type: %T", t)
		}

		if err := handleHygrothermograph(ctx, event.Topic(), event.Message().Headers, msg); err != nil {
			return err
		}

		return nil
	}
}

func handleHygrothermograph(_ context.Context, topic string, headers broker.Headers, msg *Hygrothermograph) error {
	log.Printf("Humidity: %.2f Temperature: %.2f\n", msg.Humidity, msg.Temperature)
	return nil
}

func main() {
	ctx := context.Background()

	kafkaSrv := kafka.NewServer(
		kafka.WithAddress([]string{testBrokers}),
		kafka.WithCodec(encoding.GetCodec("json")),
	)

	_ = kafkaSrv.RegisterSubscriber(ctx,
		testTopic, testGroupId, false,
		registerHygrothermographHandler(),
		func() broker.Any {
			return &Hygrothermograph{}
		})

	app := kratos.New(
		kratos.Name("kafka"),
		kratos.Server(
			kafkaSrv,
		),
	)
	if err := app.Run(); err != nil {
		log.Println(err)
	}
}
```

另外再看一个例子，是Websocket的，它的应用其实也是很广的：

```go
package main

import (
	"errors"
	"fmt"
	"log"

	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/encoding"
	"github.com/tx7do/kratos-transport/transport/websocket"
)

var testServer *websocket.Server

const (
	MessageTypeChat = iota + 1
)

type ChatMessage struct {
	Type    int    `json:"type"`
	Message string `json:"message"`
}

func main() {
	wsSrv := websocket.NewServer(
		websocket.WithAddress(":8800"),
		websocket.WithPath("/ws"),
		websocket.WithConnectHandle(handleConnect),
		websocket.WithCodec(encoding.GetCodec("json")),
	)

	testServer = wsSrv

	wsSrv.RegisterMessageHandler(MessageTypeChat,
		func(sessionId websocket.SessionID, payload websocket.MessagePayload) error {
			switch t := payload.(type) {
			case *ChatMessage:
				return handleChatMessage(sessionId, t)
			default:
				return errors.New("invalid payload type")
			}
		},
		func() websocket.Any { return &ChatMessage{} },
	)

	app := kratos.New(
		kratos.Name("websocket"),
		kratos.Server(
			wsSrv,
		),
	)
	if err := app.Run(); err != nil {
		log.Println(err)
	}
}

func handleConnect(sessionId websocket.SessionID, register bool) {
	if register {
		fmt.Printf("%s connected\n", sessionId)
	} else {
		fmt.Printf("%s disconnect\n", sessionId)
	}
}

func handleChatMessage(sessionId websocket.SessionID, message *ChatMessage) error {
	fmt.Printf("[%s] Payload: %v\n", sessionId, message)

	testServer.Broadcast(MessageTypeChat, *message)

	return nil
}
```

## 具体的应用实例

我写了一些实例代码，并且都已经提交到了Kratos的[examples](https://github.com/go-kratos/examples)代码仓库中去了。

### [kratos-cqrs](https://github.com/go-kratos/examples/tree/main/cqrs)

这是一个简单的CQRS的实现，主要就是拿了Kafka来消费来自于传感器的遥感数据，然后把数据存储到数据库中去。

需要注意的是，这个实例并不够完整，我并没有实现MQTT的消费，没有实现前端页面等等。只实现了对Kafka的消费。

### [kratos-realtimemap](https://github.com/go-kratos/examples/tree/main/realtimemap)

这是一个完整的物联网相关的例子，有前端，有后端，可以完整的跑起来看。

通过MQTT接收一个开放的公交遥测数据源，然后通过REST和Websocket向前端发送数据，在地图上展现出来车辆的轨迹、车辆的位置、车辆的速度、开关门状态等等。

### [kratos-chatroom](https://github.com/go-kratos/examples/tree/main/chatroom)

最简单的Websocket聊天室，客户端发送消息，服务端接收之后立即广播给其他客户端。
