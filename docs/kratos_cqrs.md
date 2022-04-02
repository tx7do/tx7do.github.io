# Kratos微服务框架下实现CQRS架构模式

**命令查询的责任分离Command Query Responsibility Segregation** 通常被简化为 **命令查询分离**，即读写分离。

在特定的场景下，它可以提供更好的性能。但是，在强一致性方面，它并不能够保证。而且，还会带来认知负担。所以，实际运用上，需要谨慎。

## 什么是 CQRS

这个概念出自于 **命令与查询分离（CQS, Command Query Separation）**，出自于1987 年 Bertrand Meyer 的 <Object-Oriented Software Construction>《面向对象软件构造》一书，其原始概念是我们可以把对象操作分为：命令（Command）和 查询（Query）两种形式。

* 命令（Command）：在执行之后，会改变对象的状态。
* 查询（Query）：仅仅是查看对象的数据，而不会对对象产生改变。

而 **命令查询的责任分离Command Query Responsibility Segregation** (简称CQRS)模式是一种架构体系模式，能够使改变模型的状态的命令和模型状态的查询实现分离。

在单体应用时代，它是读写分离:

![读写分离](/assets/images/rws.png)

而在微服务的时代，就变成了命令查询的责任分离:

![命令查询的责任分离](/assets/images/cqrs.png)

## 读写分离解决了什么？

数据库的读写分离就是：将数据库分为了主从库，一个主库用于写数据，多个从库完成读数据的操作，主从库之间通过某种机制进行数据的同步。

大多数互联网业务，往往读多写少。这时候，数据库的读会首先成为数据库的瓶颈。这时，如果我们希望能够线性的提升数据库的读性能，消除读写锁冲突从而提升数据库的写性能，那么就可以使用读写分离的架构：主从，主主等。

MySQL用的最多的就是主从，主数据库通过BinLog同步到从数据库。这就产生了一个问题，数据不一致问题。如果写数据的压力很大，binlog就会拥塞，从库数据更新不及时，就会读到老旧的脏数据。所以这个方案局限了它的应用范围：只有对一致性要求不高的场景才好使。比如，日志查询，报表等。

## 实现CQRS

在这里讨论是物联网的时序数据的存取场景。

我们分为两个微服务：

### 日志查询服务(kratos.logger.service)

主要是开放了API用于查询数据库，获取日志数据。

### 日志写入服务(kratos.logger.job)

订阅Kafka的日志数据写入Topic，写入到时序数据库中去。

### Docker部署开发服务器

#### TimeScaleDB

```shell
docker pull timescale/timescaledb:latest-pg14
docker pull timescale/timescaledb-postgis:latest-pg13
docker pull timescale/pg_prometheus:latest-pg11

docker run -itd \
    --name timescale-test \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=123456 \
    timescale/timescaledb-postgis:latest-pg13
```

#### Kafka

```shell
docker pull bitnami/kafka:latest
docker pull bitnami/zookeeper:latest
docker pull hlebalbau/kafka-manager:latest

docker run -itd \
    --name zookeeper-test \
    -p 2181:2181 \
    -e ALLOW_ANONYMOUS_LOGIN=yes \
    bitnami/zookeeper:latest

docker run -itd \
    --name kafka-standalone \
    --link zookeeper-test \
    -p 9092:9092 \
    -v /home/data/kafka:/bitnami/kafka \
    -e KAFKA_BROKER_ID=1 \
    -e KAFKA_LISTENERS=PLAINTEXT://:9092 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092 \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper-test:2181 \
    -e ALLOW_PLAINTEXT_LISTENER=yes \
    --user root \
    bitnami/kafka:latest

docker run -itd \
     -p 9000:9000  \
     -e ZK_HOSTS="localhost:2181" \
     hlebalbau/kafka-manager:latest
```

#### Consul

```shell
docker pull bitnami/consul:latest

docker run -itd \
    --name consul-server-standalone \
    -p 8300:8300 \
    -p 8500:8500 \
    -p 8600:8600/udp \
    -e CONSUL_BIND_INTERFACE='eth0' \
    -e CONSUL_AGENT_MODE=server \
    -e CONSUL_ENABLE_UI=true \
    -e CONSUL_BOOTSTRAP_EXPECT=1 \
    -e CONSUL_CLIENT_LAN_ADDRESS=0.0.0.0 \
    bitnami/consul:latest
```

#### Jaeger

```shell
docker pull jaegertracing/all-in-one:latest

docker run -d \
    --name jaeger \
    -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
    -p 5775:5775/udp \
    -p 6831:6831/udp \
    -p 6832:6832/udp \
    -p 5778:5778 \
    -p 16686:16686 \
    -p 14268:14268 \
    -p 14250:14250 \
    -p 9411:9411 \
    jaegertracing/all-in-one:latest
```

## 测试

### 下载工具

* [Postman](https://www.postman.com/downloads/)
* [Offset Explorer](https://www.kafkatool.com/download.html)

## 进行测试

### 测试写

使用Offset Explorer 模拟设备，向 Topic ```logger.sensor.ts``` 发送JSON数据:

```json
[{"ts": 1646409307, "sensor_id": 1, "temperature":30, "cpu":20}]
```

### 测试读

使用Postman向日志服务发起gRPC请求进行查询。

## 技术栈

- [Kratos](https://go-kratos.dev/)
- [TimeScaleDB](https://www.timescale.com/)
- [Kafka](https://kafka.apache.org/)
- [Consul](https://www.consul.io/)
- [Jaeger](https://www.jaegertracing.io/)
- [Entgo](https://entgo.io/)

## 实例代码

* [Kratos Examples](https://github.com/go-kratos/examples/tree/main/cqrs)

## 参考资料

* [淺談 CQRS 的實現方法](https://medium.brobridge.com/%E6%B7%BA%E8%AB%87-cqrs-%E5%AF%A6%E7%8F%BE%E6%96%B9%E6%B3%95-3b4fcb8d5c86)
* [淺談微服務拆分原理](https://medium.brobridge.com/%E6%B7%BA%E8%AB%87%E5%BE%AE%E6%9C%8D%E5%8B%99%E6%8B%86%E5%88%86%E5%8E%9F%E7%90%86-d43fbb33e722)
* [详解 CQRS 架构模式](https://www.infoq.cn/article/wdlpjosudoga34jutys9)