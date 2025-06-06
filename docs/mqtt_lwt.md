# MQTT 协议下的Last Will and Testament（LWT，遗嘱消息）

Last Will and Testament（LWT，遗嘱消息）其作用是当客户端异常断开（如网络中断）时，EMQ X 自动发布一条预设的遗嘱消息，通知系统该用户离线。

该消息由MQTT的服务端（Broker）发出。

该消息，在客户端正常离线的时候不会被发出，只有客户端非正常断开网络连接的时候才会发出。

LWT的协议设计上，从两个维度设计分别为：

1. 用户维度：`user/status/{user_id}`
2. 设备维度：`device/status/{device_id}`

我们以go语言代码为示例：

```go
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/eclipse/paho.mqtt.golang"
)

// 消息接收回调函数
var messageHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("收到消息: 主题=%s, 内容=%s\n", msg.Topic(), string(msg.Payload()))
}

func main() {
	// 解析命令行参数
	server := flag.String("server", "mqtt://127.0.0.1:1883", "MQTT服务器地址")
	clientID := flag.String("id", "go-mqtt-client-"+time.Now().Format("150405"), "客户端ID")
	topic := flag.String("topic", "test/topic", "订阅主题")
	message := flag.String("msg", "Hello MQTT from Go!", "发布的消息内容")
	username := flag.String("u", "user", "用户名")
	password := flag.String("p", "user", "密码")
	flag.Parse()

	// 配置客户端选项
	opts := mqtt.NewClientOptions().
		AddBroker(*server).
		SetClientID(*clientID).
		SetUsername(*username).
		SetPassword(*password).
		SetDefaultPublishHandler(messageHandler). // 设置默认消息处理器
		SetAutoReconnect(true).                   // 启用自动重连
		SetMaxReconnectInterval(10 * time.Second) // 最大重连间隔

	// 连接前回调（可选，如设置遗嘱消息）
	opts.SetWill(fmt.Sprintf("user/status/%s", *username), "offline", 1, true)

	// 创建客户端
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatalf("连接失败: %v", token.Error())
	}
	defer func() {
		client.Publish(fmt.Sprintf("user/status/%s", *clientID), 1, true, "offline").Wait()
		client.Disconnect(250) // 程序退出时断开连接
	}()

	log.Printf("已连接到 MQTT 服务器: %s\n", *server)
	log.Printf("客户端ID: %s\n", *clientID)

	// 启动订阅（非阻塞方式）
	go func() {
		if token := client.Subscribe(*topic, 1, nil); token.Wait() && token.Error() != nil {
			log.Fatalf("订阅失败: %v", token.Error())
			return
		}
		log.Printf("已订阅主题: %s (QoS=1)\n", *topic)
	}()

	// 启动消息发布定时器（每秒发布一次消息）
	ticker := time.NewTicker(5 * time.Second)
	go func() {
		for range ticker.C {
			payload := fmt.Sprintf("%s - %s", *message, time.Now().Format("2006-01-02 15:04:05"))
			token := client.Publish(*topic, 1, false, payload)
			token.Wait() // 等待发布完成（可选，根据 QoS 需求）
			if token.Error() != nil {
				log.Printf("发布失败: %v", token.Error())
			} else {
				log.Printf("已发布消息: %s\n", payload)
			}
		}
	}()

	// 等待中断信号（Ctrl+C）
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	log.Println("接收到中断信号，正在退出...")
	ticker.Stop()
}
```

在连接创建的时候，我们调用'SetWill'方法：`opts.SetWill(fmt.Sprintf("user/status/%s", *username), "offline", 1, true)`，设置LWT消息。

我们在断开连接之前调用`Publish`方法，这样就可以在正常端口的时候也可以让服务端感知到客户端的断开：

```go
	defer func() {
		client.Publish(fmt.Sprintf("user/status/%s", *clientID), 1, true, "offline").Wait()
		client.Disconnect(250) // 程序退出时断开连接
	}()
```
