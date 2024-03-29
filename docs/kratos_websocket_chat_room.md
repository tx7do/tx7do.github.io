# golang微服务框架Kratos实现Websocket聊天室

## 什么是WebSocket

WebSocket 协议主要为了解决基于 HTTP/1.x 的 Web 应用无法实现服务端向客户端主动推送的问题, 为了兼容现有的设施, WebSocket 协议使用与 HTTP 协议相同的端口, 并使用 HTTP Upgrade 机制来进行 WebSocket 握手, 当握手完成之后, 通信双方便可以按照 WebSocket 协议的方式进行交互

WebSocket 使用 TCP 作为传输层协议, 与 HTTP 类似, WebSocket 也支持在 TCP 上层引入 TLS 层, 以建立加密数据传输通道, 即 WebSocket over TLS, WebSocket 的 URI 与 HTTP URI 的结构类似, 对于使用 80 端口的 WebSocket over TCP, 其 URI 的一般形式为 `ws://host:port/path/query` 对于使用 443 端口的 WebSocket over TLS, 其 URI 的一般形式为 `wss://host:port/path/query`

在 WebSocket 协议中, 帧 (frame) 是通信双方数据传输的基本单元, 与其它网络协议相同, frame 由 Header 和 Payload 两部分构成, frame 有多种类型, frame 的类型由其头部的 Opcode 字段 (将在下面讨论) 来指示, WebSocket 的 frame 可以分为两类, 一类是用于传输控制信息的 frame (如通知对方关闭 WebSocket 连接), 一类是用于传输应用数据的 frame, 使用 WebSocket 协议通信的双方都需要首先进行握手, 只有当握手成功之后才开始使用 frame 传输数据

## 如何在Kratos下开发Websocket服务器

我基于 <https://github.com/gorilla/websocket> 封装了一个简单的Websocket服务器，可以在Kratos下开发Websocket服务器。具体实现代码在：<https://github.com/tx7do/kratos-transport/tree/main/transport/websocket>

可以基于它开发，也可以fork代码自己根据需要进行修改。

本篇文章相当于是一个echo示例。也就是收发信息。

## 开始写代码

### 定义API

```protobuf
syntax = "proto3";

package chatroom.v1;

option go_package = "api/chatroom/v1;v1";

service ChatRoomService {
}

enum MessageType {
  Chat = 0;
}

message ChatMessage {
  string message = 1;
  string sender = 2;
  string timestamp = 3;
}
```

现在`ChatRoomService`暂时只是用来占位，后续实现代码生成器插件时，或许可以派上用场。

`MessageType`是一个Opcode，用于区分消息类型，它是一个Uint32类型，不可以有重复数值。

`ChatMessage`是网络协议的载体定义，它和`MessageType.Chat`是一对。

### 注册Websocket服务器

```go
func NewWebsocketServer(c *conf.Server, _ log.Logger, svc *service.ChatRoomService) *websocket.Server {
	srv := websocket.NewServer(
		websocket.WithAddress(c.Websocket.Addr),
		websocket.WithPath(c.Websocket.Path),
		websocket.WithConnectHandle(svc.OnWebsocketConnect),
		websocket.WithCodec(encoding.GetCodec("json")),
	)

	svc.SetWebsocketServer(srv)

	srv.RegisterMessageHandler(websocket.MessageType(v1.MessageType_Chat),
		func(sessionId websocket.SessionID, payload websocket.MessagePayload) error {
			switch t := payload.(type) {
			case *v1.ChatMessage:
				return svc.OnChatMessage(sessionId, t)
			default:
				return errors.New("invalid payload type")
			}
		},
		func() websocket.Any { return &v1.ChatMessage{} },
	)

	return srv
}
```

需要注意的是`websocket.WithCodec`是注册编解码器，这里使用的是json编解码器。通常来说，大概也就Json和Protobuf两种编解码器用的会比较多。注册进去之后，底层会自动的将数据编解码。

### 处理消息

```Go
func (s *ChatRoomService) OnChatMessage(sessionId websocket.SessionID, msg *v1.ChatMessage) error {
  s.ws.Broadcast(websocket.MessageType(v1.MessageType_Chat), msg)
  //s.ws.SendMessage(sessionId， websocket.MessageType(v1.MessageType_Chat), msg)
  return nil
}
```

`websocket.SessionID`本质上是一个String类型的UUID，用于标识一个连接。

用于发送消息的方法有两个：`s.ws.SendMessage`和`s.ws.Broadcast`，前者只发送给指定的SessionID，后者发送给所有的SessionID。

这样，服务器就算搭起来了，是不是很简单。

### 实现JavaScript客户端

Js要实现一个websocket客户端是很简单的，只需要短短十数行代码：

```typescript
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```

但是，因为我在Kratos-Transport的Websocket底层实现里面封装了一个简单的应用层协议。故而在实现Websocket的Js客户端的时候，需要实现该应用层协议的编解码。

其实要说起来这个协议的定义，也是很简单的：

> 消息类型（4字节） | 包载体

另外，需要提到一点：如果Websocket协议的实现是按照完整的Websocket的RFC文档定义来实现的话，Websocket协议已经实现了分包、粘包的处理，所以在应用层就不需要考虑这些问题了。不然如果在TCP/UDP开始封装协议的话，或者没有完全实现RFC文档，那就要复杂太多了。

#### 编码

```javascript
function sendMessage(id, payload) {
    const strPayload = JSON.stringify(payload);
    const payloadBuff = new TextEncoder().encode(strPayload);

    let buff = new Uint8Array(4 + payloadBuff.byteLength);
    let dv = new DataView(buff.buffer);
    dv.setInt32(0, id);
    buff.set(payloadBuff, 4);

    console.log(ab2str(buff))

    ws.send(dv.buffer);
}
```

#### 解码

```javascript
ws.onmessage = function (event) {
    const dv = new DataView(event.data);
    const messageType = dv.getInt32(0);
    handleMessage(messageType, event.data.slice(4));
};
```

推荐使用TypeScript，代码看起来更加清爽一些。

如果载体为Json编码，网上有工具可以将Protobuf协议生成TypeScript代码：<https://brandonxiang.github.io/pb-to-typescript/>

转换后的代码是这样的：

```typescript
export enum MessageType {
  Chat = 0,
}

export interface ChatMessage {
  message?: string;
  sender?: string;
  timestamp?: string;
}
```

虽然说JS对类型并没有太多的约束，但是实际上，强规约还是会带来很多的好处的。特别是在多人协作的时候，让每一个人都可以充分的理解协议的意义。

现在我们就可以来发送聊天消息了：

```typescript
function sendChatMessage(message) {
    let packet = {
        message: message,
        sender: "",
        timestamp: "",
    };

    sendMessage(MessageType.Chat, packet);
}
```

但如果使用Protobuf的二进制编码，那需要做的事情相对就比较多一点。我在此就不再赘述。

## 实例代码

* <https://github.com/tx7do/kratos-chatroom>
* <https://github.com/go-kratos/examples/tree/main/chatroom>

## 参考资料

* [RFC 6455 - The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
* [wikipedia - WebSocket](https://en.wikipedia.org/wiki/WebSocket)
* [HTML5 WebSocket](https://www.runoob.com/html/html5-websocket.html)
* [MDN - WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
* [WebSocket 协议解析 [RFC 6455]](https://sunyunqiang.com/blog/websocket_protocol_rfc6455/)
* [WebSocket 教程](https://www.ruanyifeng.com/blog/2017/05/websocket.html)
