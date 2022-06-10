# Redis键空间通知

有需求，Key到期的时候需要一个通知给服务器端用于感知数据的改变。刚好Redis提供了一个Keyspace Notifications功能，可以让服务器端监听某个Key的到期事件。

官方文档说，这个功能是很耗费CPU的，所以，默认是关闭的。需要开启的话，可以使用命令：

```bash
config set notify-keyspace-events KEA
```

如果要监听数据库0的所有key的到期事件，可以使用以下命令：

```bash
psubscribe __keyevent@0__:expired
```

但是上面这个命令并不支持cli使用，必须要在程序中使用。

## 测试

加入测试数据，过期时间20秒

```bash
SETEX coolName 20 value
```

我们使用golang的go-redis来测试监听事件。

```go
ctx := context.Background()
cli := createRedisClient()

// 打开键事件通知
cli.ConfigSet(ctx, "notify-keyspace-events", "AE")

// 订阅事件
sub := cli.PSubscribe(context.Background(), "__keyevent@0__:expired")
defer sub.Close()
for msg := range sub.Channel() {
    // 打印收到的消息
    fmt.Println(msg.Channel)
    fmt.Println(msg.Payload)
}
```

## 参考资料

* [Redis — Getting Notified When a Key is Expired or Changed](https://medium.com/nerd-for-tech/redis-getting-notified-when-a-key-is-expired-or-changed-ca3e1f1c7f0a)
* [Redis keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/)
* [键空间通知（keyspace notification）](http://redisdoc.com/topic/notification.html)
* [Redis Keyspace Notifications(Redis键空间通知)](https://cloud.tencent.com/developer/article/1685673)
* [订阅 Redis 的 key 过期事件实现动态定时任务](https://crazyfzw.github.io/2019/04/09/redis-keyspace-notifications/)
