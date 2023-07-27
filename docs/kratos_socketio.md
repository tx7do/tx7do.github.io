# Golang微服务框架kratos实现Socket.IO服务

Socket.IO 是一个面向实时 web 应用的 实时通讯库。它使得服务器和客户端之间实时双向的通信成为可能。底层使用EngineIO。SocketIO的的客户端使用Engine.IO-Client，服务端使用Engine.IO实现。

Socket.IO 主要使用WebSocket协议。但是如果需要的话，Socket.IO 可以回退到几种其它方法，例如Adobe Flash Sockets，JSONP拉取，或是传统的AJAX拉取，并且在同时提供完全相同的接口。尽管它可以被用作WebSocket的包装库，它还是提供了许多其它功能，比如广播至多个套接字，存储与不同客户有关的数据，和异步IO操作。

## Socket.IO如何工作

### 客户端

EIO Socket 通过一个 XHR (XMLHttpRequest) 握手。前端发送一个 XHR，告诉服务端我要开始 XHR 长轮询了。后端返回的数据里面包括一个 open 标志(数字 0 表示), 以及sid 和 upgrades 字段，ping时间间隔，ping超时时间。

```json
0{
"sid": "8b7ab1ae-fbcf-4d23-8192-3c14a2a90721",
"upgrades": [
"websocket"
],
"pingInterval": 10000,
"pingTimeout": 60000
}
```

sid 是本次 EIO Socket 的会话 ID，因为一次 EIO Socket 包含了多个请求，而后端又会同时连接多个 EIO Socket，sid 的作用就相当于 SESSION ID。
另一个字段 upgrades，正常情况下是 ['websocket']，表示可以把连接方式从长轮询升级到 WebSocket。

前端在发送第一个 XHR 的时候就开始了 XHR 长轮询，这个时候如果有收发数据的需求，是通过长轮询实现的。所谓长轮询，是指前端发送一个 request，服务端会等到有数据需要返回时再 response. 前端收到 response 后马上发送下一次 request。这样就可以实现双向通信。

前端收到握手的 upgrades 后，EIO 会检测浏览器是否支持 WebSocket，如果支持，就会启动一个 WebSocket 连接，然后通过这个 WebSocket 往服务器发一条内容为 probe, 类型为 ping 的数据。如果这时服务器返回了内容为 probe, 类型为 pong 的数据，前端就会把前面建立的 HTTP 长轮询停掉，后面只使用 WebSocket 通道进行收发数据

EIO Socket 生命周期内，会间隔一段时间 ping - pong 一次，用来测试网络是否正常。

这是 WebSocket 帧的结构，绿色是发送，白色是接收。前面的数字是数据包类型，2 是 ping, 3 是 pong, 42是 message

### 服务端

服务端使用 ws 库实现 WebSocket 协议。`http://socket.io` 服务启动时，会先启动一个 ws 服务。`http://socket.io` 会监听 HTTP 服务器的 `upgrade` 和 `request` 事件。当 `upgrade` 事件触发时，说明可能是 WebSocket 握手，先简单校验下，然后把请求交给 ws 服务进行处理，拿到 WebSocket 对象。当 `request` 事件触发时，根据 url 路径判断是不是 `http://socket.io` 的 XHR 请求，拿到 res 和 res 对象。这样就可以正确接收和返回客户端数据了，具体处理过程和前端部分是对应的。

## Socket.IO的限制

与所有技术一样，选择正确的一种意味着明确您对产品未来的期望。与您自己创建Socket链接相比，SocketIO确实使许多事情变得更容易，但是除了上面提到的扩展问题之外，还有局限性和缺点。

首先是初始连接比WebSockets更长。这是因为它首先使用长轮询和XHRPolling建立连接，然后升级到WebSocket（如果可用）。如果您不需要支持较旧的浏览器并且不担心不支持WebSockets的客户端环境，则可能不需要SocketIO的额外开销。您可以通过指定仅与WebSockets连接来最大程度地减少这种影响。这将更改与WebSocket的初始连接，但是会关闭备选方案。

在代码最小化的情况下，客户端仍将需要下载61.2 KB的数据。

对于其他繁重的数据传输（例如，视频流传输），Socket不是好的解决方案。如果要在此级别上支持数据交换，则更好的解决方案是webRTC或流数据传输服务商，Ably是其中之一。

## Kratos服务端

首先安装库：

```bash
go get -u github.com/tx7do/kratos-transport/transport/socketio
```

然后实现一个简单的服务端：

```go
package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kratos/kratos/v2/log"
    transportSocketIO "github.com/tx7do/kratos-transport/transport/socketio"
	socketio "github.com/googollee/go-socket.io"
)

func main() {
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	ctx := context.Background()

	srv := transportSocketIO.NewServer(
		transportSocketIO.WithAddress(":8000"),
		transportSocketIO.WithCodec("json"),
		transportSocketIO.WithPath("/socket.io/"),
	)

	srv.RegisterConnectHandler("/", func(s socketio.Conn) error {
		s.SetContext("")
		log.Info("connected:", s.ID())
		return nil
	})

	srv.RegisterEventHandler("/", "notice", func(s socketio.Conn, msg string) {
		log.Info("notice:", msg)
		s.Emit("reply", "have "+msg)
	})

	srv.RegisterEventHandler("/chat", "msg", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		return "recv " + msg
	})

	srv.RegisterEventHandler("/", "bye", func(s socketio.Conn) string {
		last := s.Context().(string)
		s.Emit("bye", last)
		_ = s.Close()
		return last
	})

	srv.RegisterErrorHandler("/", func(s socketio.Conn, e error) {
		log.Info("meet error:", e)
	})

	srv.RegisterDisconnectHandler("/", func(s socketio.Conn, reason string) {
		log.Info("closed", reason)
	})

	if err := srv.Start(ctx); err != nil {
		panic(err)
	}

	defer func() {
		if err := srv.Stop(ctx); err != nil {
			t.Errorf("expected nil got %v", err)
		}
	}()

	<-interrupt
}
```

## JS客户端

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Socket.IO chat</title>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font: 13px Helvetica, Arial;
        }

        form {
            background: #000;
            padding: 3px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }

        form input {
            border: 0;
            padding: 10px;
            width: 90%;
            margin-right: .5%;
        }

        form button {
            width: 9%;
            background: rgb(130, 224, 255);
            border: none;
            padding: 10px;
        }

        #messages {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }

        #messages li {
            padding: 5px 10px;
        }

        #messages li:nth-child(odd) {
            background: #eee;
        }
    </style>
</head>
<body>
<ul id="messages"></ul>
<form action="">
    <input id="m" autocomplete="off"/>
    <button>Send</button>
</form>
<!--<script src="https://cdn.socket.io/4.6.0/socket.io.min.js" integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+" crossorigin="anonymous"></script>-->
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
<script>
    var socket = io("ws://localhost:8000");
    // var socket2 = io("http://localhost:8000/chat/");

    socket.on('reply', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    $('form').submit(function () {
        // socket2.emit('msg', $('#m').val(), function (data) {
        //     $('#messages').append($('<li>').text('ACK CALLBACK: ' + data));
        // });

        socket.emit('notice', $('#m').val());

        $('#m').val('');
        return false;
    });
</script>
</body>
</html>
```

## 参考资料 (Reference)

- [go-socket.io](https://github.com/googollee/go-socket.io)
- [Socket.IO](https://socket.io/zh-CN/docs/v4/)
- [什么是socketIO？](https://zhuanlan.zhihu.com/p/422664879)
