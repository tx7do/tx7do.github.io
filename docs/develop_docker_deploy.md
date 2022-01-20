# 本地部署Docker开发环境

***

## 数据库

-----

### TiDB

```shell
docker pull pingcap/tidb:latest
docker pull pingcap/tikv:latest
docker pull pingcap/pd:latest

docker run -d \
--name tidb-test \
-v /data/tidb/data:/tmp/tidb \
--privileged=true \
-p 4000:4000 \
-p 10080:10080 \
pingcap/tidb:latest
```

### MySQL

```shell
docker pull bitnami/mysql:latest

docker run -d \
--name mysql-test \
-p 3306:3306 \
-e ALLOW_EMPTY_PASSWORD=yes \
-e MYSQL_ROOT_PASSWORD=123456 \
bitnami/mysql:latest
```

### MariaDB

```shell
docker pull bitnami/mariadb:latest

docker run -d \
--name mariadb-test \
-p 3306:3306 \
-e ALLOW_EMPTY_PASSWORD=yes \
-e MARIADB_ROOT_PASSWORD=123456 \
bitnami/mariadb:latest
```

### PostgresSQL

```shell
docker pull bitnami/postgresql:latest
docker pull bitnami/postgresql-repmgr:latest
docker pull bitnami/pgbouncer:latest
docker pull bitnami/pgpool:latest

docker run -d \
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

#### TimescaleDB

```shell
docker pull timescale/timescaledb:latest-pg14
docker pull timescale/timescaledb-postgis:latest-pg13
docker pull timescale/pg_prometheus:latest-pg11
```

### ElasticSearch

```shell
docker pull bitnami/elasticsearch:latest

docker run -d \
--name elasticsearch-test \
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

docker run -d \
--name dejavu-test \
-p 13580:1358 \
appbaseio/dejavu:latest


http://localhost:13580/
```

### MongoDB

```shell
docker pull bitnami/mongodb:latest
docker run -itd \
--name mongodb-test \
-p 27017:27017 \
-e MONGODB_ROOT_PASSWORD=123456 \
-e MONGODB_USERNAME=test \
-e MONGODB_PASSWORD=123456 \
-e MONGODB_DATABASE=test \
bitnami/mongodb:latest
```

创建管理用户:

```sql
# 创建一个名为 admin，密码为 123456 的用户
db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},"readWriteAnyDatabase"]});
# 尝试使用上面创建的用户信息进行连接
db.auth('admin', '123456')
```

### SQLServer

```shell
docker pull mcr.microsoft.com/mssql/server:2019-latest
docker run -d \
--name MSSQL_1433 \
-m 512m \
-e "ACCEPT_EULA=Y" \
-e "SA_PASSWORD=Abcd123456789*" \
-p 1433:1433 \
mcr.microsoft.com/mssql/server:2019-latest
```

### InfluxDB

```shell
docker pull bitnami/influxdb:latest

docker run -d \
--name influxdb-test \
-p 8083:8083 \
-p 8086:8086 \
bitnami/influxdb:latest
```

```sql
create user "admin" with password '123456789' with all privileges
```

管理后台: <http://localhost:8086/>

### Neo4J

```shell
docker pull bitnami/neo4j:latest

docker run -d \
--name neo4j-test \
-p 7473:7473 \
-p 7687:7687 \
-p 7474:7474 \
bitnami/neo4j:latest
```

### CouchDB

```shell
docker pull bitnami/couchdb:latest
```

## 缓存

-----

### Redis

```shell
docker pull bitnami/redis:latest

docker run -itd \
--name redis-test \
-p 6379:6379 \
-e ALLOW_EMPTY_PASSWORD=yes \
bitnami/redis:latest
```

### Memecached

```shell
docker pull bitnami/memecached:latest
```

## 注册中心

-----

### etcd

```shell
docker pull bitnami/etcd:latest
```

### NSQ

```shell
docker pull nsqio/nsq:latest
```

### NATS

```shell
docker pull bitnami/nats:latest

docker run -d \
--name nats-server \
--publish 4222:4222 \
--publish 6222:6222 \
--publish 8222:8222 \
bitnami/nats:latest
```

### Nacos

```shell
docker pull nacos/nacos-server:latest

docker run -d \
--name nacos-standalone \
-e MODE=standalone \
-p 8849:8848 \
nacos/nacos-server:latest
```

管理后台: <http://localhost:8849/nacos/index.html>

### Consul

```shell
docker pull bitnami/consul:latest

docker run -d \
--name=consul-server-standalone \
-p 8500:8500 \
-e CONSUL_BIND_INTERFACE='eth0' \
-e CONSUL_AGENT_MODE=server \
-e CONSUL_ENABLE_UI=true \
-e CONSUL_BOOTSTRAP_EXPECT=1 \
-e CONSUL_CLIENT_LAN_ADDRESS=0.0.0.0 \
bitnami/consul:latest
```

管理后台: <http://localhost:8500>

## 消息队列

-----

### RabbitMQ

```shell
docker pull bitnami/rabbitmq:latest

docker run -d \
--hostname localhost \
--name rabbitmq-test \
-p 15672:15672 \
-p 5672:5672 \
-p 1883:1883 \
-p 15675:15675 \
-e RABBITMQ_PLUGINS= rabbitmq_top \
bitnami/rabbitmq:latest

rabbitmq-plugins --offline enable rabbitmq_peer_discovery_consul
# rabbitmq_mqtt 提供与后端服务交互使用，端口1883
rabbitmq-plugins enable rabbitmq_mqtt
# rabbitmq_web_mqtt 提供与前端交互使用，端口15675
rabbitmq-plugins enable rabbitmq_web_mqtt
```

管理后台: <http://localhost:15672>
默认账号:user
默认密码:bitnami

### Kafka

```shell
docker pull bitnami/kafka:latest
docker pull bitnami/zookeeper:latest

docker run -d \
--name zookeeper-test \
-p 2181:2181 \
-e ALLOW_ANONYMOUS_LOGIN=yes \
bitnami/zookeeper:latest

docker run -d \
--name kafka-standalone \
--restart always \
--link zookeeper-test \
-p 9092:9092 \
-v /home/data/kafka:/bitnami/kafka \
-e KAFKA_BROKER_ID=1 \
-e KAFKA_LISTENERS=PLAINTEXT://:9092 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
-e ALLOW_PLAINTEXT_LISTENER=yes \
--user root \
bitnami/kafka:latest
```

### mosquitto

```shell
docker pull eclipse-mosquitto:latest

docker run -d \
--name mosquitto-test \
-p 1883:1883 \
-p 9001:9001 \
eclipse-mosquitto:latest
```

### EMX

```shell
docker pull emqx/emqx:latest

docker run -d \
--name emqx-test \
-p 18083:18083 \
-p 1883:1883 \
emqx/emqx:latest
```

### Pulsar

#### Docker安装

```shell
docker pull apachepulsar/pulsar:latest

docker run -itd \
-p 6650:6650 \
-p 8080:8080 \
--name pulsar-standalone \
apachepulsar/pulsar:latest bin/pulsar standalone
```

#### 管理后台安装

```shell
docker pull apachepulsar/pulsar-manager:latest

docker run -itd \
-p 9527:9527 \
-p 7750:7750 \
-e SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties \
apachepulsar/pulsar-manager:latest
```

#### 访问接口

 <pulsar://localhost:6650>  
 <http://localhost:8080>  

#### 管理后台

<http://localhost:9527>

## 运维监控

### Jaeger

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

### Kibana

```shell
docker pull bitnami/kibana:latest

docker run -d \
--name kibana \
-p 5601:5601 \
--name kibana \
-e KIBANA_ELASTICSEARCH_URL=elasticsearch \
-e KIBANA_ELASTICSEARCH_PORT_NUMBER=9200
bitnami/kibana:latest
```

### Prometheus

```shell
docker pull bitnami/prometheus:latest
docker pull bitnami/pushgateway:latest

docker run -d --rm \
--name=prometheus-gateway \
-p 5051:9091 \
bitnami/pushgateway

docker run -d --rm \
--name=prometheus \
-p 5050:9090 \
bitnami/prometheus:latest
```

#### 后台访问

[Prometheus](http://localhost:5050)  
[Prometheus Pushgateway](http://localhost:5051)  

### Grafana

```shell
docker pull bitnami/grafana:latest

docker run -d \
--name grafana \
-p 3000:3000 \
bitnami/grafana:latest
```

### Logstash

```shell
docker pull bitnami/logstash:latest
docker pull bitnami/logstash-exporter:latest

docker run -d \
-p 8080:8080 \
bitnami/logstash:latest
```

### Fluentd

```shell
docker pull bitnami/fluentd:latest

docker run -d \
-p 24224:24224 \
-p 24224:24224/udp \
-v /data:/opt/bitnami/fluentd/log \
bitnami/fluentd:latest
```

## 其他

-----

### Spark

```shell
docker pull bitnami/spark:latest

docker run -it --rm \
--name spark \
-p 4040:4040 \
-p 7077:7077 \
-p 8088:8088 \
-p 8081:8081 \
-p 8080:8080 \
-p 8042:8042 \
-p 8030:8030 \
-p 8031:8031 \
-p 8040:8040 \
-p 9000:9000 \
-p 49707:49707 \
-p 50010:50010 \
-p 50070:50070 \
-p 50075:50075 \
-p 50020:50020 \
-p 50090:50090 \
-e SPARK_MODE=master \
bitnami/spark:latest
```

### Minio

```shell
docker pull bitnami/minio:latest

docker run -d \
--name minio-server \
--env MINIO_ACCESS_KEY="minio-access-key" \
--env MINIO_SECRET_KEY="minio-secret-key" \
bitnami/minio:latest
```

### TensorFlow ResNet

```shell
docker pull bitnami/tensorflow-resnet:latest
```

## API网关

-----

### HAProxy

```shell
docker pull bitnami/haproxy:latest
```

### Kong

```shell
docker pull bitnami/kong:latest
```

### Nginx

```shell
docker pull bitnami/nginx:latest
```

### Envoy

```shell
docker pull bitnami/envoy:latest
```

### APISIX

### Tyk

### Gravitee

## 参考资料

-----

<https://docs.emqx.cn/broker/v4.3/#%E6%B6%88%E6%81%AF%E6%A1%A5%E6%8E%A5>  
<https://github.com/lf-edge/ekuiper/blob/master/README-CN.md>  
<https://db-engines.com/en/ranking/time+series+dbms>  
