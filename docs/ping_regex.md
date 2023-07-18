# Ping结果正则表达式解析

## Windows

### ping结果示例

中文：

```bash
ping www.baidu.com -n 3

正在 Ping www.a.shifen.com [120.232.145.185] 具有 32 字节的数据:
来自 120.232.145.185 的回复: 字节=32 时间=45ms TTL=49
来自 120.232.145.185 的回复: 字节=32 时间=627ms TTL=49
来自 120.232.145.185 的回复: 字节=32 时间=49ms TTL=49

120.232.145.185 的 Ping 统计信息:
    数据包: 已发送 = 3，已接收 = 3，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 45ms，最长 = 627ms，平均 = 240ms
```

英文：

```bash
ping www.paessler.com -n 4

Pinging paessler.com [104.16.182.252] with 32 bytes of data:
Reply from 104.16.182.252: bytes=32 time=4ms TTL=57
Reply from 104.16.182.252: bytes=32 time=4ms TTL=57
Reply from 104.16.182.252: bytes=32 time=4ms TTL=57
Reply from 104.16.182.252: bytes=32 time=4ms TTL=57

Ping statistics for 104.16.182.252:
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
Minimum = 4ms, Maximum = 4ms, Average = 4ms
```

### 获取TTL

所有TTL:

```text
最短 = (\d+)ms.*最长 = (\d+)ms.*平均 = (\d+)ms|Minimum = (\d+)ms.*Maximum = (\d+)ms.*Average = (\d+)ms
```

最短TTL：

```text
最短 = (\d+)ms|Minimum = (\d+)ms
```

最长TTL：

```text
最长 = (\d+)ms|Maximum = (\d+)ms
```

平均TTL：

```text
平均 = (\d+)ms|Average = (\d+)ms
```

## Linux

```bash
ping www.baidu.com -c 3

PING www.a.shifen.com (120.232.145.185) 56(84) bytes of data.
64 bytes from 120.232.145.185 (120.232.145.185): icmp_seq=1 ttl=48 time=41.0 ms
64 bytes from 120.232.145.185 (120.232.145.185): icmp_seq=2 ttl=48 time=40.4 ms
64 bytes from 120.232.145.185 (120.232.145.185): icmp_seq=3 ttl=48 time=129 ms

--- www.a.shifen.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2156ms
rtt min/avg/max/mdev = 40.443/70.028/128.681/41.474 ms
```

获取TTL：

```text
rtt\s+min\/avg\/max\/mdev\s+=\s+([0-9]+\.[0-9]+)\/([0-9]+\.[0-9]+)\/([0-9]+\.[0-9]+)\/([0-9]+\.[0-9]+)\s+ms
```
