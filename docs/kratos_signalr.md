# Golang微服务框架kratos实现SignalR服务

基于 SignalR 可以实现客户端和服务器之间进行即时通信。

适合 SignalR 的应用场景：

需要从服务器进行高频率更新的应用。 示例包括游戏、社交网络、投票、拍卖、地图和 GPS 应用。
仪表板和监视应用。
协作应用。 协作应用的示例包括白板应用和团队会议软件。
需要通知的应用。 社交网络、电子邮件、聊天、游戏、旅行警报和很多其他应用都需使用通知。

SignalR 自动选择服务器和客户端能力范围内的最佳传输方法，如WebSockets、Server-Sent Events、长轮询。Hub 是一种高级管道，允许客户端和服务器相互调用方法。 SignalR 自动处理跨计算机边界的调度，并允许客户端调用服务器上的方法，反之亦然。SignalR 提供两个内置协议：基于 JSON 的文本协议和基于 MessagePack 的二进制协议。

## 什么是 SignalR？

ASP.NET SignalR 是一个面向 ASP.NET 开发人员的库，可简化向应用程序添加实时 Web 功能的过程。 实时 Web 功能是让服务器代码在可用时立即将内容推送到连接的客户端，而不是让服务器等待客户端请求新数据。

SignalR 可用于向 ASP.NET 应用程序添加任何类型的“实时”Web 功能。 虽然聊天通常用作示例，但你可以执行更多操作。 每当用户刷新网页以查看新数据，或页面实现 长时间轮询 以检索新数据时，它都是使用 SignalR 的候选项。 示例包括仪表板和监视应用程序、协作应用程序 (，例如同时编辑文档) 、作业进度更新和实时表单。

SignalR 还支持需要服务器进行高频率更新的全新 Web 应用程序类型，例如实时游戏。

SignalR 提供了一个简单的 API，用于创建服务器到客户端远程过程调用， (RPC) 调用客户端浏览器 (和其他客户端平台中的 JavaScript 函数，) 从服务器端 .NET 代码。 SignalR 还包括用于连接管理的 API (例如，连接和断开连接事件) ，以及分组连接。

## SignalR 和 WebSocket

SignalR 在可用的情况下使用新的 WebSocket 传输，并在必要时回退到旧传输。 虽然当然可以直接使用 WebSocket 编写应用，但使用 SignalR 意味着需要实现的许多额外功能已经为你完成。 最重要的是，这意味着你可以编写应用代码以利用 WebSocket，而无需担心为旧客户端创建单独的代码路径。 SignalR 还可以避免担心 WebSocket 的更新，因为 SignalR 已更新以支持基础传输中的更改，从而为应用程序提供跨 WebSocket 版本的一致接口。

## Kratos服务端

首先安装库：

```bash
go get -u github.com/tx7do/kratos-transport/transport/signalr
```

然后实现一个简单的服务端：

```go
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	signalR "github.com/philippseith/signalr"
    "github.com/tx7do/kratos-transport/transport/signalr"
)

type chat struct {
	signalR.Hub
}

func (c *chat) OnConnected(connectionID string) {
	fmt.Printf("%s connected\n", connectionID)
	c.Groups().AddToGroup("group", connectionID)
}

func (c *chat) OnDisconnected(connectionID string) {
	fmt.Printf("%s disconnected\n", connectionID)
	c.Groups().RemoveFromGroup("group", connectionID)
}

func (c *chat) Broadcast(message string) {
	// Broadcast to all clients
	c.Clients().Group("group").Send("receive", message)
}

func (c *chat) Echo(message string) {
	c.Clients().Caller().Send("receive", message)
}

func (c *chat) Panic() {
	panic("Don't panic!")
}

func (c *chat) RequestAsync(message string) <-chan map[string]string {
	r := make(chan map[string]string)
	go func() {
		defer close(r)
		time.Sleep(4 * time.Second)
		m := make(map[string]string)
		m["ToUpper"] = strings.ToUpper(message)
		m["ToLower"] = strings.ToLower(message)
		m["len"] = fmt.Sprint(len(message))
		r <- m
	}()
	return r
}

func (c *chat) RequestTuple(message string) (string, string, int) {
	return strings.ToUpper(message), strings.ToLower(message), len(message)
}

func (c *chat) DateStream() <-chan string {
	r := make(chan string)
	go func() {
		defer close(r)
		for i := 0; i < 50; i++ {
			r <- fmt.Sprint(time.Now().Clock())
			time.Sleep(time.Second)
		}
	}()
	return r
}

func (c *chat) UploadStream(upload1 <-chan int, factor float64, upload2 <-chan float64) {
	ok1 := true
	ok2 := true
	u1 := 0
	u2 := 0.0
	c.Echo(fmt.Sprintf("f: %v", factor))
	for {
		select {
		case u1, ok1 = <-upload1:
			if ok1 {
				c.Echo(fmt.Sprintf("u1: %v", u1))
			} else if !ok2 {
				c.Echo("Finished")
				return
			}
		case u2, ok2 = <-upload2:
			if ok2 {
				c.Echo(fmt.Sprintf("u2: %v", u2))
			} else if !ok1 {
				c.Echo("Finished")
				return
			}
		}
	}
}

func (c *chat) Abort() {
	fmt.Println("Abort")
	c.Hub.Abort()
}

func main() {
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	ctx := context.Background()

	srv := signalr.NewServer(
		signalr.WithAddress(":8100"),
		signalr.WithCodec("json"),
		signalr.WithHub(&chat{}),
	)

	srv.MapHTTP("/chat")

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
    <title>SignalR Client</title>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>

<body>
<input type="text" id="message"/>
<input type="button" value="Broadcast" id="broadcast"/>
<input type="button" value="Echo" id="echo"/>
<input type="button" value="Panic" id="panic"/>
<input type="button" value="RequestTuple" id="requesttuple"/>
<input type="button" value="RequestAsync" id="requestasync"/>
<input type="button" value="Stream" id="stream"/>
<input type="button" value="Stop Stream" id="stopstream"/>
<input type="button" value="Upstream" id="upstream"/>
<input type="button" value="Stop/Start Client Connection" id="stop"/>
<input type="button" value="Abort Server Connection" id="abort"/>
<ul id="messages">
</ul>

<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.7/signalr.js"></script>

<script>
    let subscription;
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:8100/chat')
        .withAutomaticReconnect()
        .build();

    document.getElementById('broadcast').addEventListener('click', () => {
        let val = document.getElementById('message').value;
        if (val) {
            connection.invoke('broadcast', val);
        }
    });
    document.getElementById('echo').addEventListener('click', () => {
        let val = document.getElementById('message').value;
        if (val) {
            connection.invoke('echo', val);
        }
    });
    document.getElementById('panic').addEventListener('click', () => {
        connection.invoke('panic').catch((err) => {
            let li = document.createElement('li');
            li.innerText = err;
            document.getElementById('messages').appendChild(li);
        });
    });

    document.getElementById('requestasync').addEventListener('click', () => {
        let val = document.getElementById('message').value;
        if (val) {
            connection.invoke('requestasync', val).then(val => {
                let li = document.createElement('li');
                li.innerText = 'received finally ' + JSON.stringify(val);
                document.getElementById('messages').appendChild(li);
            })
        }
    });

    document.getElementById('requesttuple').addEventListener('click', () => {
        let val = document.getElementById('message').value;
        if (val) {
            connection.invoke('requesttuple', val).then(val => {
                let li = document.createElement('li');
                li.innerText = 'received ' + JSON.stringify(val);
                document.getElementById('messages').appendChild(li);
            })
        }
    });
    document.getElementById('stream').addEventListener('click', () => {
        subscription = connection.stream('datestream').subscribe({
            next: (item) => {
                let li = document.createElement('li');
                li.innerText = 'item ' + item;
                document.getElementById('messages').appendChild(li);
            },
            complete: () => {
                let li = document.createElement('li');
                li.innerText = 'complete';
                document.getElementById('messages').appendChild(li);
            }
        })
    });
    document.getElementById('stopstream').addEventListener('click', () => {
        if (subscription) {
            subscription.dispose()
        }
    });
    document.getElementById('upstream').addEventListener('click', () => {
        const subject1 = new signalR.Subject();
        const subject2 = new signalR.Subject();
        connection.send("uploadstream", subject1, 3, subject2);
        let iteration1 = 0;
        const intervalHandle1 = setInterval(() => {
            iteration1++;
            subject1.next(iteration1);
            if (iteration1 === 5) {
                clearInterval(intervalHandle1);
                subject1.complete();
            }
        }, 500);
        let iteration2 = 0;
        const intervalHandle2 = setInterval(() => {
            iteration2++;
            subject2.next(iteration2);
            if (iteration2 === 10) {
                clearInterval(intervalHandle2);
                subject2.complete();
            }
        }, 100);
    });
    document.getElementById('stop').addEventListener('click', () => {
        connection.stop().then(() => {
            connection.start();
        });
    });
    document.getElementById('abort').addEventListener('click', () => {
        connection.send('abort')
    });

    connection.on('receive', message => {
        let li = document.createElement('li');
        li.innerText = 'sent ' + message;
        document.getElementById('messages').appendChild(li);
    });

    connection.onclose(error => {
        console.assert(connection.state === signalR.HubConnectionState.Disconnected);
        console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
    });
    connection.onreconnecting(error => {
        console.assert(connection.state === signalR.HubConnectionState.Reconnecting);
        console.log('Connection lost due to error. Reconnecting.', error);
    });
    connection.onreconnected(connectionId => {
        console.assert(connection.state === signalR.HubConnectionState.Connected);
        console.log('Connection reestablished. Connected with connectionId', connectionId);
    });

    async function start() {
        try {
            await connection.start();
            console.assert(connection.state === signalR.HubConnectionState.Connected);
            console.log('SignalR connection established');
        } catch (err) {
            console.assert(connection.state === signalR.HubConnectionState.Disconnected);
            console.error('SignalR Connection Error: ', err);
            setTimeout(() => this.start(), 5000);
        }
    }

    start();

</script>
</body>

</html>
```

## 参考资料 (Reference)

- [Introduction to SignalR](https://learn.microsoft.com/en-us/aspnet/signalr/overview/getting-started/introduction-to-signalr)
- [go-signalr](https://github.com/philippseith/signalr)
- [SignalR vs. Socket.IO: which one is best for you?](https://ably.com/topic/signalr-vs-socketio)
- [SignalR 从开发到生产部署闭坑指南](https://juejin.cn/post/7021724750942568456)
