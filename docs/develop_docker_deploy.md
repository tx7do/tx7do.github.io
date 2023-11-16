# 本地部署Docker开发环境

***

- Bash的换行符为 <code>\\</code>

- CMD的换行符为 <code>\^</code>

- Powershell的换行符为 <code>\`</code>

参数简析：

- -p 宿主机端口:容器端口

需要设置Host：

```text
# Added by Docker Desktop
192.168.1.6 host.docker.internal
192.168.1.6 gateway.docker.internal
# To allow the same kube context to work on the host and the container:
192.168.1.6 kubernetes.docker.internal
# End of section
```

## 关系型数据库

-----

### MySQL

```bash
docker pull bitnami/mysql:latest

docker run -itd \
    --name mysql-test \
    -p 3306:3306 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e MYSQL_ROOT_PASSWORD=123456 \
    bitnami/mysql:latest
```

### MariaDB

```bash
docker pull bitnami/mariadb:latest

docker run -itd \
    --name mariadb-test \
    -p 3306:3306 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e MARIADB_ROOT_PASSWORD=123456 \
    bitnami/mariadb:latest
```

### PostgreSQL

```bash
docker pull bitnami/postgresql:latest
docker pull bitnami/postgresql-repmgr:latest
docker pull bitnami/pgbouncer:latest
docker pull bitnami/pgpool:latest
docker pull bitnami/postgres-exporter:latest

docker run -itd \
    --name postgres-test \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=123456 \
    bitnami/postgresql:latest

docker exec -it postgres-test "apt update"
```

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

SELECT version();
SELECT postgis_full_version();
```

- 默认账号：postgres  
- 默认密码：123456

### SQLServer

```bash
docker pull mcr.microsoft.com/mssql/server:2019-latest

docker run -itd \
    --name MSSQL_1433 \
    -m 512m \
    -e "ACCEPT_EULA=Y" \
    -e "SA_PASSWORD=Abcd123456789*" \
    -p 1433:1433 \
    mcr.microsoft.com/mssql/server:2019-latest
```

### TiDB

```bash
docker pull pingcap/tidb:latest
docker pull pingcap/tikv:latest
docker pull pingcap/pd:latest

docker run -itd \
    --name tidb-test \
    -v /data/tidb/data:/tmp/tidb \
    --privileged=true \
    -p 4000:4000 \
    -p 10080:10080 \
    pingcap/tidb:latest
```

## 图数据库

-----

### Neo4J

```bash
docker pull bitnami/neo4j:latest

docker run -itd \
    --name neo4j-test \
    -p 7473:7473 \
    -p 7687:7687 \
    -p 7474:7474 \
    -e NEO4J_PASSWORD=bitnami \
    bitnami/neo4j:latest
```

## 时序型数据库

-----

### InfluxDB

```bash
docker pull bitnami/influxdb:latest

docker run -itd \
    --name influxdb-test \
    -p 8083:8083 \
    -p 8086:8086 \
    -e INFLUXDB_HTTP_AUTH_ENABLED=true \
    -e INFLUXDB_ADMIN_USER=admin \
    -e INFLUXDB_ADMIN_USER_PASSWORD=123456789 \
    -e INFLUXDB_ADMIN_USER_TOKEN=admintoken123 \
    -e INFLUXDB_DB=my_database \
    bitnami/influxdb:latest
```

```sql
create user "admin" with password '123456789' with all privileges
```

- 管理后台: <http://localhost:8086/>

### TimescaleDB

```bash
docker pull timescale/timescaledb:latest-pg14
docker pull timescale/timescaledb:latest-pg15
docker pull timescale/timescaledb-postgis:latest-pg13
docker pull timescale/pg_prometheus:latest-pg11

docker run -itd \
    --name timescale-test \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=123456 \
    timescale/timescaledb:latest-pg15
```

- 默认账号：postgres  
- 默认密码：123456

### OpenTSDB

```bash
docker pull petergrace/opentsdb-docker:latest

docker run -itd \
    --name opentsdb-test \
    -p 4242:4242 \
    petergrace/opentsdb-docker:latest
```

- 管理后台 <http://localhost:4242>

### QuestDB

```bash
docker pull questdb/questdb:latest

docker run -itd \
    --name questdb-test \
    -p 9000:9000 \
    -p 8812:8812 \
    -p 9009:9009 \
    questdb/questdb:latest
```

### TDengine

```bash
docker pull tdengine/tdengine:latest

docker run -itd \
    --name tdengine-test \
    -p 6030-6041:6030-6041 \
    -p 6030-6041:6030-6041/udp \
    tdengine/tdengine:latest
```

### ElasticSearch

```bash
docker pull bitnami/elasticsearch:latest

docker run -itd \
    --name elasticsearch \
    -p 9200:9200 \
    -p 9300:9300 \
    -e ELASTICSEARCH_USERNAME=elastic \
    -e ELASTICSEARCH_PASSWORD=elastic \
    -e xpack.security.enabled=true \
    -e discovery.type=single-node \
    -e http.cors.enabled=true \
    -e http.cors.allow-origin=http://localhost:13580,http://127.0.0.1:13580 \
    -e http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization \
    -e http.cors.allow-credentials=true \
    bitnami/elasticsearch:latest

docker pull appbaseio/dejavu:latest

docker run -itd \
    --name dejavu-test \
    -p 13580:1358 \
    appbaseio/dejavu:latest

http://localhost:13580/
```

### Clickhouse

```bash
docker pull yandex/clickhouse-server:latest
docker pull clickhouse/clickhouse-server:latest

# 8123为http接口 9000为tcp接口 9004为mysql接口
# 推荐使用DBeaver作为客户端
docker run -itd \
    --name clickhouse-server \
    -p 8123:8123 \
    -p 9000:9000 \
    -p 9004:9004 \
    --network=app-tier \
    --ulimit \
    nofile=262144:262144 \
    clickhouse/clickhouse-server:latest
```

- 默认账号: default  
- 密码：无

### Doris

```bash
docker pull apache/doris:1.2.2-be-x86_64
docker pull apache/doris:1.2.2-fe-x86_64

docker network create --driver bridge --subnet=127.0.0.1/24 doris-network

docker run -itd \
    --name=doris-fe \
    --env FE_SERVERS="fe1:127.0.0.1:9010" \
    --env FE_ID=1 \
    -p 8030:8030 \
    -p 9030:9030 \
    -v /data/fe/doris-meta:/opt/apache-doris/fe/doris-meta \
    -v /data/fe/conf:/opt/apache-doris/fe/conf \
    -v /data/fe/log:/opt/apache-doris/fe/log \
    --network=doris-network \
    --ip=127.0.0.1 \
    apache/doris:1.2.2-fe-x86_64

docker run -itd \
    --name=doris-be \
    --env FE_SERVERS="fe1:127.0.0.1:9010" \
    --env BE_ADDR="127.0.0.1:9050" \
    -p 8040:8040 \
    -v /data/be/storage:/opt/apache-doris/be/storage \
    -v /data/be/conf:/opt/apache-doris/be/conf \
    -v /data/be/log:/opt/apache-doris/be/log \
    --network=doris-network \
    --ip=127.0.0.1 \
    apache/doris:1.2.2-be-x86_64
```

## NoSQL数据库

-----

### MongoDB

下载镜像：

```bash
docker pull bitnami/mongodb:latest
docker pull bitnami/mongodb-exporter:latest
```

带密码安装：

```bash
docker run -itd \
    --name mongodb-test \
    -p 27017:27017 \
    -e MONGODB_ROOT_USER=root \
    -e MONGODB_ROOT_PASSWORD=123456 \
    -e MONGODB_USERNAME=test \
    -e MONGODB_PASSWORD=123456 \
    -e MONGODB_DATABASE=test \
    bitnami/mongodb:latest
```

不带密码安装：

```bash
docker run -itd \
    --name mongodb-test \
    -p 27017:27017 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    bitnami/mongodb:latest
```

有两点需要注意：

1. 如果需要映射数据卷，需要把本地路径的所有权改到1001：`sudo chown -R 1001:1001 data/db`，否则会报错：`‘mkdir: cannot create directory ‘/bitnami/mongodb’: Permission denied’`；
2. MongoDB 5.0开始有些机器运行会报错：`Illegal instruction`，这是因为机器硬件不支持 **AVX 指令集** 的缘故，没办法，MongoDB降级吧。

### Redis

```bash
docker pull bitnami/redis:latest
docker pull bitnami/redis-exporter:latest

docker run -itd \
    --name redis-server \
    -p 6379:6379 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    bitnami/redis:latest
```

### Memcached

```bash
docker pull bitnami/memcached:latest
docker pull bitnami/memcached-exporter:latest

docker run -itd \
    --name memcached-test \
    -p 11211:11211 \
    bitnami/memcached:latest
```

### CouchDB

```bash
docker pull bitnami/couchdb:latest

docker run -itd \
    --name couchdb-test \
    -p 5984:5984  \
    -p 9100:9100  \
    -e COUCHDB_PORT_NUMBER=5984
    -e COUCHDB_CLUSTER_PORT_NUMBER=9100
    -e COUCHDB_USER=admin
    -e COUCHDB_PASSWORD=couchdb
    bitnami/couchdb:latest
```

### Cassandra

```bash
docker pull bitnami/cassandra:latest
docker pull bitnami/cassandra-exporter:latest

docker run -itd \
    --name cassandra-test \
    -p 7000:7000  \
    -p 9042:9042  \
    -e CASSANDRA_USER=cassandra \
    -e CASSANDRA_PASSWORD=cassandra \
    bitnami/cassandra:latest
```

## 服务发现注册

-----

### etcd

```bash
docker pull bitnami/etcd:latest

docker run -itd \
    --name etcd-standalone \
    -p 2379:2379 \
    -p 2380:2380 \
    -e ETCDCTL_API=3 \
    -e ALLOW_NONE_AUTHENTICATION=yes \
    -e ETCD_ADVERTISE_CLIENT_URLS=http://0.0.0.0:2379 \
    bitnami/etcd:latest
```

- 管理工具: [etcd-manager](https://www.electronjs.org/apps/etcd-manager)

### Nacos

```bash
docker pull nacos/nacos-server:latest

docker run -itd \
    --name nacos-standalone \
    -e MODE=standalone \
    -p 8849:8848 \
    nacos/nacos-server:latest
```

- 管理后台: <http://localhost:8849/nacos/index.html>

### Consul

```bash
docker pull bitnami/consul:latest
docker pull bitnami/consul-exporter:latest

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

- 管理后台: <http://localhost:8500>

### Apollo

**注意,先要导入SQL数据!**

```bash
docker pull apolloconfig/apollo-portal:latest
docker pull apolloconfig/apollo-configservice:latest
docker pull apolloconfig/apollo-adminservice:latest

# 
 docker run -itd \
    --name apollo-configservice \
    -p 8080:8080 \
    -e SPRING_DATASOURCE_URL="jdbc:mysql://127.0.0.1:3306/ApolloConfigDB?characterEncoding=utf8" \
    -e SPRING_DATASOURCE_USERNAME=root \
    -e SPRING_DATASOURCE_PASSWORD=123456 \
    -v /tmp/logs:/opt/logs \
    apolloconfig/apollo-configservice:latest

docker run -itd \
    --name apollo-adminservice \
    -p 8090:8090 \
    -e SPRING_DATASOURCE_URL="jdbc:mysql://127.0.0.1:3306/ApolloConfigDB?characterEncoding=utf8" \
    -e SPRING_DATASOURCE_USERNAME=root \
    -e SPRING_DATASOURCE_PASSWORD=123456 \
    -v /tmp/logs:/opt/logs \
    apolloconfig/apollo-adminservice:latest

docker run -itd \
    --name apollo-portal \
    -p 8070:8070 \
    -e SPRING_DATASOURCE_URL="jdbc:mysql://127.0.0.1:3306/ApolloPortalDB?characterEncoding=utf8" \
    -e SPRING_DATASOURCE_USERNAME=root \
    -e SPRING_DATASOURCE_PASSWORD=123456 \
    -e APOLLO_PORTAL_ENVS=dev \
    -e DEV_META=http://127.0.0.1:8080 \
    -v /tmp/logs:/opt/logs \
    apolloconfig/apollo-portal:latest
```

- Eureka管理后台: <localhost:8080>

- Apollo管理后台: <localhost:8070>  
  账号密码: apollo / admin

## 消息队列

-----

### RabbitMQ

```bash
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

- 管理后台: <http://localhost:15672>  
- 默认账号: user  
- 默认密码: bitnami

### Kafka

#### With ZooKeeper

```bash
docker pull bitnami/zookeeper:latest
docker pull bitnami/kafka:latest
docker pull bitnami/kafka-exporter:latest

docker run -itd \
    --name zookeeper-server \
    --network app-tier \
    -p 2181:2181 \
    -e ALLOW_ANONYMOUS_LOGIN=yes \
    bitnami/zookeeper:latest

docker run -itd \
    --name kafka-standalone \
    --link zookeeper-server \
    --network app-tier \
    -p 9092:9092 \
    -v /home/data/kafka:/bitnami/kafka \
    -e KAFKA_ENABLE_KRAFT=no \
    -e KAFKA_BROKER_ID=1 \
    -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://host.docker.internal:9092 \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper-server:2181 \
    -e ALLOW_PLAINTEXT_LISTENER=yes \
    --user root \
    bitnami/kafka:latest
```

#### With KRaft

```bash
docker pull bitnami/kafka:latest

docker run -itd \
    --name kafka-standalone \
    --user root \
    -p 9092:9092 \
    -p 9093:9093 \
    -v /home/data/kafka:/bitnami/kafka \
    -e KAFKA_ENABLE_KRAFT=yes \
    -e KAFKA_BROKER_ID=1 \
    -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
    -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
    -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@host.docker.internal:9093 \
    -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
    -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://host.docker.internal:9092 \
    -e ALLOW_PLAINTEXT_LISTENER=yes \
    bitnami/kafka:latest
```

#### 管理工具

- [Offset Explorer](https://www.kafkatool.com/download.html)

### NSQ

```bash
docker pull nsqio/nsq:latest

# nsqlookupd
docker run -d \
    --name nsqlookupd \
    -p 4160:4160 \
    -p 4161:4161 \
    nsqio/nsq:latest \
    /nsqlookupd

# nsqd
docker run -itd \
    --name nsqd \
    -p 4150:4150 \
    -p 4151:4151 \
    --link nsqlookupd \
    nsqio/nsq:latest \
    /nsqd --lookupd-tcp-address=nsqlookupd:4160

#nsqadmin
docker run -itd \
    --name nsqadmin \
    -p 4171:4171 \
    --link nsqlookupd \
    nsqio/nsq:latest \
    /nsqadmin --lookupd-http-address=nsqlookupd:4161
```

- 控制台访问地址： <http://127.0.0.1:4171>
- 直接使用REST API查看节点信息： <http://127.0.0.1:4161/nodes>

### NATS

```bash
docker pull bitnami/nats:latest
docker pull bitnami/nats-exporter:latest

docker run -itd \
    --name nats-server \
    --p 4222:4222 \
    --p 6222:6222 \
    --p 8000:8222 \
    -e NATS_HTTP_PORT_NUMBER=8222 \
    bitnami/nats:latest
```

- 管理后台: <https://127.0.0.1:8000>

### Mosquitto

```bash
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

```bash
docker pull emqx/emqx:latest

docker run -itd \
    --name emqx-test \
    --add-host=host.docker.internal:host-gateway \
    -p 18083:18083 \
    -p 1883:1883 \
    emqx/emqx:latest
```

- 管理后台: <http://localhost:18083>  
- 默认账号: admin  
- 默认密码: public  

### Pulsar

```bash
docker pull apachepulsar/pulsar-manager:latest
docker pull apachepulsar/pulsar:latest

docker run -itd \
    -p 6650:6650 \
    -p 8080:8080 \
    --name pulsar-standalone \
    apachepulsar/pulsar:latest bin/pulsar standalone

docker run -itd \
    -p 9527:9527 \
    -p 7750:7750 \
    -e SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties \
    apachepulsar/pulsar-manager:latest
```

```bash
docker pull apachepulsar/pulsar-standalone:latest

docker run -itd \
    -p 6650:6650 \
    -p 8080:8080 \
    -p 9527:9527 \
    --name pulsar-standalone \
    apachepulsar/pulsar:latest bin/pulsar standalone
```

```bash
docker pull apachepulsar/pulsar-all:latest

```

- 管理后台 <http://localhost:9527>

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

### RocketMQ

#### RocketMQ4.x

至少启动一个NameServer，一个Broker。

```bash
docker pull apache/rocketmq:4.9.2

# NameServer
docker run -d \
    --name rocketmq-namesrv \
    -e "JAVA_OPT_EXT=-server -Xms512M -Xmx512M -Xmn128m" \
    -p 9876:9876 \
    apache/rocketmq:4.9.2 \
    sh mqnamesrv

# Broker
docker run -d \
    --name rocketmq-broker \
    -p 10911:10911 \
    -p 10909:10909 \
    -p 10912:10912 \
    --link rocketmq-namesrv \
    -e "JAVA_OPT_EXT=-server -Xms512M -Xmx512M -Xmn128m" \
    -e "NAMESRV_ADDR=rocketmq-namesrv:9876" \
    apache/rocketmq:4.9.2 \
    sh mqbroker -c /home/rocketmq/rocketmq-4.9.2/conf/broker.conf
```

以及Web控制台：

```bash
docker pull styletang/rocketmq-console-ng:latest

docker run -d \
    --name rocketmq-console \
    -p 9800:8080 \
    --link rocketmq-namesrv \
    -e "JAVA_OPT_EXT=-server -Xms512M -Xmx512M -Xmn128m" \
    -e "JAVA_OPTS=-Xmx256M -Xms256M -Xmn128M -Drocketmq.namesrv.addr=rocketmq-namesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false" \
    -t styletang/rocketmq-console-ng:latest
```

RocketMQ Console 是 rocketmq 的第三方扩展组件，提供图形界面便于管理和监控rocketmq。

- 控制台访问地址： <http://localhost:9800/#/>

**需要注意的是**，NameServer下发的是Docker容器的内网IP地址，从宿主机的外网访问是访问不了的，需要进行配置：

```bash
vi /home/rocketmq/rocketmq-5.1.4/conf/broker.conf
```

添加如下配置，brokerIP1可以是ip也可以是dns，hostname：

```ini
brokerIP1 = host.docker.internal
```

#### RocketMQ5.x

至少启动一个NameServer，一个Broker。

5.x版本下，官方建议使用Local模式部署，即Broker和Proxy同进程部署。

```bash
docker pull apache/rocketmq:5.1.4

# NameServer
docker run -d \
    --name rocketmq-namesrv \
    -e "MAX_HEAP_SIZE=256M" \
    -e "HEAP_NEWSIZE=128M" \
    -p 9876:9876 \
    apache/rocketmq:5.1.4 \
    sh mqnamesrv

# Broker
docker run -d \
    --name rocketmq-broker \
    --link rocketmq-namesrv \
    -p 10911:10911 \
    -p 10909:10909 \
    -p 10912:10912 \
    -p 8080:8080 \
    -p 8081:8081 \
    -e "MAX_HEAP_SIZE=256M" \
    -e "HEAP_NEWSIZE=128M" \
    -e "JAVA_OPTS=-server -Xmx256M -Xms256M -Xmn128M" \
    -e "NAMESRV_ADDR=rocketmq-namesrv:9876" \
    apache/rocketmq:5.1.4 \
    sh mqbroker --enable-proxy autoCreateTopicEnable=true autoCreateSubscriptionGroup=true \
    -c /home/rocketmq/rocketmq-5.1.4/conf/broker.conf
```

以及Web控制台：

```bash
docker run -d \
    --restart=always \
    --name rocketmq-dashboard \
    --link rocketmq-namesrv \
    -e "JAVA_OPTS=-Xmx256M -Xms256M -Xmn128M -Drocketmq.namesrv.addr=rocketmq-namesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false" \
    -p 9800:8080 \
    apacherocketmq/rocketmq-dashboard
```

- 控制台访问地址： <http://localhost:9800/#/>

### ActiveMQ

```bash
docker pull rmohr/activemq:latest

docker run -d \
      --name activemq-test \
      -p 61616:61616 \
      -p 8161:8161 \
      -p 61613:61613 \
      -p 1883:1883 \
      -p 61614:61614 \
      rmohr/activemq:latest
```

| 端口号   | 协议    |
|-------|-------|
| 61616 | JMS   |
| 8161  | UI    |
| 5672  | AMQP  |
| 61613 | STOMP |
| 1883  | MQTT  |
| 61614 | WS    |

- 管理后台：<http://localhost:8161/admin/>
- 默认账号名密码：admin/admin

### Asynq

```bash
docker pull hibiken/asynqmon:latest

docker run -d \
    --name asynq \
    -p 8080:8080 \
    hibiken/asynqmon:latest --redis-addr=host.docker.internal:6379
```

- 管理后台：<http://localhost:8080>

## 微服务运行时

### Dapr

```bash
docker pull daprio/dapr:latest
```

## 链路追踪

### Jaeger

```bash
docker pull jaegertracing/all-in-one:latest

docker run -itd \
    --name jaeger \
    -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
    -e COLLECTOR_OTLP_ENABLED=true \
    -p 6831:6831/udp \
    -p 6832:6832/udp \
    -p 5778:5778 \
    -p 16686:16686 \
    -p 4317:4317 \
    -p 4318:4318 \
    -p 14250:14250 \
    -p 14268:14268 \
    -p 14269:14269 \
    -p 9411:9411 \
    jaegertracing/all-in-one:latest
```

| 端口号	  | 协议	  | 组件	       | 功能                                                          |
|-------|------|-----------|-------------------------------------------------------------|
| 6831  | UDP  | Agent     | Thrift-compact协议，接收`jaeger.thrift`数据（大多数 SDK 使用）            |
| 6832  | UDP  | Agent     | Thrift-binary协议，接收`jaeger.thrift`数据（由 Node.js SDK 使用）       |
| 5775  | UDP  | Agent     | ~~Thrift-compact协议，接收`zipkin.thrift`数据（仅供旧客户端使用）~~**（已弃用）** |
| 5778  | HTTP | Agent     | 服务配置接口（采样等）                                                 |
| 16686 | HTTP | Query     | Jaeger Web UI的服务前端                                          |
| 4317  | HTTP | Collector | 如果启用，通过 gRPC 接收 OpenTelemetry 协议 (OTLP)                     |
| 4318  | HTTP | Collector | 如果启用，通过 HTTP 接收 OpenTelemetry 协议 (OTLP)                     |
| 14268 | HTTP | Collector | 直接接收`jaeger.thrift`客户端                                      |
| 14269 | HTTP | Collector | 提供：健康检查`/`、性能检查`/metrics`                                   |
| 14250 | HTTP | Collector | 接收`model.proto`                                             |
| 9411  | HTTP | Collector | 兼容Zipkin的http端点（可选）                                         |

- API：<http://localhost:14268/api/traces>  
- Zipkin API：<http://localhost:9411/api/v2/spans>
- 后台: <http://localhost:16686>

### Zipkin

```bash
docker pull openzipkin/zipkin:latest

docker run -d \
    --name zipkin \
    -p 9411:9411 \
    openzipkin/zipkin:latest
```

- API：<http://localhost:9411/api/v2/spans>  
- 后台: <http://localhost:9411>

### SkyWalking

```bash
docker pull apache/skywalking-oap-server:latest
docker pull apache/skywalking-ui:latest

# 11800端口用于skywalking将应用的服务监控信息收集端口。
# 12800端口用于skywalking对UI提供查询接口。
docker run -itd \
    --name skywalking-oap-server \
    -e TZ=Asia/Shanghai \
    -p 12800:12800 \
    -p 11800:11800 \
    --link elasticsearch \
    -e SW_STORAGE=elasticsearch \
    -e SW_STORAGE_ES_CLUSTER_NODES=elasticsearch:9200 \
    apache/skywalking-oap-server:latest

docker run -itd \
    --name skywalking-ui \
    -e TZ=Asia/Shanghai \
    -p 8080:8080 \
    --link skywalking-oap-server \
    -e SW_OAP_ADDRESS=skywalking-oap-server:12800 \
    apache/skywalking-ui:latest
```

- 后台: <http://localhost:8080>

### Pinpoint

```bash
docker pull pinpointdocker/pinpoint-agent:latest
```

### Grafana Tempo

```bash
docker pull grafana/tempo:latest
```

## 运维监控

### Kibana

```bash
docker pull bitnami/kibana:latest

docker run -d \
    --name kibana \
    -p 5601:5601 \
    -e KIBANA_ELASTICSEARCH_URL=elasticsearch \
    -e KIBANA_ELASTICSEARCH_PORT_NUMBER=9200 \
    bitnami/kibana:latest
```

### Prometheus

```bash
docker pull bitnami/prometheus:latest
docker pull bitnami/pushgateway:latest

docker run -d \
    --name prometheus-gateway \
    -p 9091:9091 \
    bitnami/pushgateway:latest

docker run -d \
    --name prometheus \
    -p 9090:9090 \
    bitnami/prometheus:latest
```

- Prometheus 后台: <http://localhost:9090>  
- Pushgateway 后台: <http://localhost:9091>

### Grafana

```bash
docker pull bitnami/grafana:latest

docker run -d \
    --name grafana \
    -p 3000:3000 \
    -e GF_SECURITY_ADMIN_PASSWORD=pass \
    bitnami/grafana:latest
```

### Logstash

```bash
docker pull bitnami/logstash:latest
docker pull bitnami/logstash-exporter:latest

docker run -d \
    --name logstash \
    -p 8080:8080 \
    bitnami/logstash:latest
```

### Fluentd

```bash
docker pull bitnami/fluentd:latest

docker run -d \
    --name fluentd \
    -p 24224:24224 \
    -p 24224:24224/udp \
    -v /data:/opt/bitnami/fluentd/log \
    bitnami/fluentd:latest
```

## 流式计算

-----

### Spark

```bash
docker pull bitnami/spark:latest

docker run -itd \
    --name spark-standalone \
    -p 6066:6066 \
    -p 7077:7077 \
    -p 8080:8080 \
    -p 50070:50070 \
    -e SPARK_MODE=master \
    -e SPARK_WORKER_CORES=1 \
    -e SPARK_WORKER_MEMORY=2g \
    bitnami/spark:latest
```

- hdfs的web界面：<http://localhost:50070>  
- Spark界面：<http://localhost:8080>

### Flink

```bash
docker pull flink:latest

docker network create flink-network

docker run -itd \
    --name flink-jobmanager \
    --network flink-network \
    -p 8081:8081 \
    --env FLINK_PROPERTIES="jobmanager.rpc.address: flink-jobmanager" \
    flink:latest jobmanager

docker run -itd \
    --name flink-taskmanager \
    --network flink-network \
    --env FLINK_PROPERTIES="jobmanager.rpc.address: flink-jobmanager" \
    flink:latest taskmanager
```

- 管理后台: <http://localhost:8081>

## 对象存储

-----

### MinIO

```bash
docker pull bitnami/minio:latest

docker network create app-tier --driver bridge

# MINIO_ROOT_USER 最少3个字符
# MINIO_ROOT_PASSWORD 最少8个字符
# 第一次运行的时候,服务会自动关闭,手动再启动就可以正常运行了.
docker run -itd \
    --name minio-server \
    -p 9000:9000 \
    -p 9001:9001 \
    --env MINIO_ROOT_USER="root" \
    --env MINIO_ROOT_PASSWORD="123456789" \
    --env MINIO_DEFAULT_BUCKETS='images,videos' \
    --env MINIO_FORCE_NEW_KEYS="yes" \
    --env BITNAMI_DEBUG=true \
    --volume /usr/local/minio/data:/data \
    --network app-tier \
    bitnami/minio:latest
```

- 管理后台: <http://localhost:9001/login>

```bash
docker pull minio/minio:latest

# MINIO_ROOT_USER 最少3个字符，默认为：minioadmin
# MINIO_ROOT_PASSWORD 最少8个字符，默认为：minioadmin
docker run -itd \
    --name minio-server \
    -p 9000:9000 \
    -p 9001:9001 \
    -e "MINIO_ROOT_USER=root" \
    -e "MINIO_ROOT_PASSWORD=123456789" \
    -v /usr/local/minio/data:/data \
    --network app-tier \
    minio/minio server /data --console-address ':9001'
```

- 管理后台: <http://localhost:9001/login>

## 机器学习

-----

### TensorFlow

```bash
docker pull bitnami/tensorflow-resnet:latest
docker pull bitnami/tensorflow-serving:latest
docker pull bitnami/tensorflow-inception:latest

docker network create app-tier --driver bridge

docker run -d --name tensorflow-serving \
    --volume /tmp/model-data:/bitnami/model-data \
    --network app-tier \
    bitnami/tensorflow-serving:latest

docker run -d --name tensorflow-resnet \
    --volume /tmp/model-data:/bitnami/model-data \
    --network app-tier \
    bitnami/tensorflow-resnet:latest
```

### PyTorch

```bash
docker pull bitnami/pytorch:latest
```

## API网关

-----

### HAProxy

```bash
docker pull bitnami/haproxy:latest
```

### Kong

```bash
docker pull bitnami/kong:latest
```

### Nginx

```bash
docker pull bitnami/nginx:latest
```

### Envoy

```bash
docker pull bitnami/envoy:latest
```

### Caddy

```bash
docker pull caddy:latest
```

### APISIX

```bash
docker pull apache/apisix:latest
docker pull apache/apisix-dashboard:latest

docker run -itd \
   --name apache-apisix \
   -p 9080:9080 \
   -e APISIX_STAND_ALONE=true \
   --link etcd-standalone \
   apache/apisix:latest
```

- 管理后台: <http://127.0.0.1:8080/apisix/dashboard>
- 用户密码：admin/admin

### Tyk

```bash
docker pull tykio/tyk-gateway:latest

docker run -d \
  --name tyk_gateway \
  -p 8080:8080 \
  -e TYK_GW_SECRET=[YOUR-SECRET] \
  -v $(pwd)/tyk.conf:/opt/tyk-gateway/tyk.conf \
  -v $(pwd)/apps:/opt/tyk-gateway/apps \
  tykio/tyk-gateway:latest
```

### Gravitee

```bash
docker pull graviteeio/apim-gateway:latest
docker pull graviteeio/apim-management-ui:latest
docker pull graviteeio/apim-portal-ui:latest

docker run -itd \
    --publish 82:8082 \
    --name gateway \
    --env GRAVITEE_MANAGEMENT_MONGODB_URI=mongodb://username:password@mongohost:27017/dbname \
    --detach \
    graviteeio/apim-gateway:latest

docker run -itd \
    --publish 80:8080 \
    --env MGMT_API_URL=http://localhost:81/management/organizations/DEFAULT/environments/DEFAULT \
    --name management-ui \
    --detach  \
    graviteeio/apim-management-ui:latest

docker run -itd \
    --publish 80:8080 \
    --env PORTAL_API_URL=http://localhost:81/portal/environments/DEFAULT \
    --name portal-ui \
    --detach  \
    graviteeio/apim-portal-ui:latest
```

### Traefik

```bash
docker pull traefik:latest

docker run -itd `
    --name traefik-server `
    -p 8080:8080 `
    -p 80:80 `
    -v /var/run/docker.sock:/var/run/docker.sock `
    --link consul-server-standalone `
    --add-host=host.docker.internal:host-gateway `
    traefik:latest --api.insecure=true --providers.consul.endpoints="consul-server-standalone:8500"
```

- 管理后台:<http://localhost:8080>

## 参考资料

-----

<https://docs.emqx.cn/broker/v4.3/#%E6%B6%88%E6%81%AF%E6%A1%A5%E6%8E%A5>  
<https://github.com/lf-edge/ekuiper/blob/master/README-CN.md>  
<https://db-engines.com/en/ranking/time+series+dbms>  
