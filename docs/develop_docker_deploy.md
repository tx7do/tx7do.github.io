# 本地部署Docker开发环境

***

Bash的换行符为 <code>\\</code>

CMD的换行符为 <code>\^</code>

Powershell的换行符为 <code>\`</code>

## 关系型数据库

-----

### MySQL

```shell
docker pull bitnami/mysql:latest

docker run -itd \
    --name mysql-test \
    -p 3306:3306 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e MYSQL_ROOT_PASSWORD=123456 \
    bitnami/mysql:latest
```

### MariaDB

```shell
docker pull bitnami/mariadb:latest

docker run -itd \
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

默认账号：postgres  
默认密码：123456

### SQLServer

```shell
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

```shell
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

```shell
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

```shell
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

管理后台: <http://localhost:8086/>

### TimescaleDB

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

默认账号：postgres  
默认密码：123456

### OpenTSDB

```shell
docker pull petergrace/opentsdb-docker:latest

docker run -itd \
    --name opentsdb-test \
    -p 4242:4242 \
    petergrace/opentsdb-docker:latest
```

- 管理后台 <http://localhost:4242>

### QuestDB

```shell
docker pull questdb/questdb:latest

docker run -itd \
    --name questdb-test \
    -p 9000:9000 \
    -p 8812:8812 \
    -p 9009:9009 \
    questdb/questdb:latest
```

### TDengine

```shell
docker pull tdengine/tdengine:latest

docker run -itd \
    --name tdengine-test \
    -p 6030-6041:6030-6041 \
    -p 6030-6041:6030-6041/udp \
    tdengine/tdengine:latest
```

### ElasticSearch

```shell
docker pull bitnami/elasticsearch:latest

docker run -itd \
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

docker run -itd \
    --name dejavu-test \
    -p 13580:1358 \
    appbaseio/dejavu:latest

http://localhost:13580/
```

### Clickhouse

```bash
docker pull yandex/clickhouse-server:latest

# 8123为http接口 9000为tcp接口 9004为mysql接口
# 推荐使用DBeaver作为客户端
docker run -itd \
    --name clickhouse-server-test \
    -p 8123:8123 \
    -p 9000:9000 \
    -p 9004:9004 \
    --ulimit \
    nofile=262144:262144 \
    yandex/clickhouse-server:latest
```

默认账号: default  
密码：无

## NoSQL数据库

-----

### MongoDB

```shell
docker pull bitnami/mongodb:latest
docker pull bitnami/mongodb-exporter:latest

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

### Redis

```shell
docker pull bitnami/redis:latest
docker pull bitnami/redis-exporter:latest

docker run -itd \
    --name redis-test \
    -p 6379:6379 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    bitnami/redis:latest
```

### Memcached

```shell
docker pull bitnami/memcached:latest
docker pull bitnami/memcached-exporter:latest

docker run -itd \
    --name memcached-test \
    -p 11211:11211 \
    bitnami/memcached:latest
```

### CouchDB

```shell
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

```shell
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

```shell
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

管理工具: [etcd-manager](https://www.electronjs.org/apps/etcd-manager)

### Nacos

```shell
docker pull nacos/nacos-server:latest

docker run -itd \
    --name nacos-standalone \
    -e MODE=standalone \
    -p 8849:8848 \
    nacos/nacos-server:latest
```

管理后台: <http://localhost:8849/nacos/index.html>

### Consul

```shell
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

管理后台: <http://localhost:8500>

### Apollo

**注意,先要导入SQL数据!**

```shell
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

Eureka管理后台: <localhost:8080>

Apollo管理后台: <localhost:8070>  
账号密码: apollo / admin

## 消息队列

-----

### RabbitMQ

```shell
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

管理后台: <http://localhost:15672>  
默认账号: user  
默认密码: bitnami

### Kafka

```shell
docker pull bitnami/kafka:latest
docker pull bitnami/zookeeper:latest
docker pull bitnami/kafka-exporter:latest

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
```

管理工具: [Offset Explorer](https://www.kafkatool.com/download.html)

### NSQ

```shell
docker pull nsqio/nsq:latest

# nsqlookupd
docker run -d \
    --name lookupd \
    -p 4160:4160 \
    -p 4161:4161 \
    nsqio/nsq:latest \
    /nsqlookupd

# nsqd
docker run -itd \
    --name lookupd \
    -p 4160:4160 \
    -p 4161:4161 \
    nsqio/nsq:latest \
    /nsqd --lookupd-tcp-address=nsqlookupd:4160

#nsqadmin
docker run run -itd \
    --name nsqadmin \
    -p 4171:4171 \
    nsqio/nsq:latest \
    /nsqadmin --lookupd-http-address=nsqlookupd:4161
```

管理后台: <http://127.0.0.1:4171>

### NATS

```shell
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

管理后台: <https://127.0.0.1:8000>

### mosquitto

```shell
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

```shell
docker pull emqx/emqx:latest

docker run -itd \
    --name emqx-test \
    --add-host=host.docker.internal:host-gateway \
    -p 18083:18083 \
    -p 1883:1883 \
    emqx/emqx:latest
```

管理后台: <http://localhost:18083>  
默认账号: admin  
默认密码: public  

### Pulsar

```shell
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

管理后台 <http://localhost:9527>

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

管理后台: <http://localhost:16686>

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

docker run -d \
    --name=prometheus-gateway \
    -p 5051:9091 \
    bitnami/pushgateway

docker run -d \
    --name=prometheus \
    -p 5050:9090 \
    bitnami/prometheus:latest
```

Prometheus后台: <http://localhost:5050>  
Pushgateway后台: <http://localhost:5051>

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
docker pull bitnami/fluentd-exporter:latest

docker run -d \
    -p 24224:24224 \
    -p 24224:24224/udp \
    -v /data:/opt/bitnami/fluentd/log \
    bitnami/fluentd:latest
```

## 流式计算

-----

### Spark

```shell
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

hdfs的web界面：<http://localhost:50070>  
spark界面：<http://localhost:8080>

### Flink

```shell
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

管理后台: <http://localhost:8081>

## 其他

-----

### Minio

```shell
docker pull bitnami/minio:latest
docker pull bitnami/minio-client:latest

docker network create app-tier --driver bridge

# MINIO_ROOT_USER最少3个字符
# MINIO_ROOT_PASSWORD最少8个字符
# 第一次运行的时候,服务会自动关闭,手动再启动就可以正常运行了.
docker run -itd \
    --name minio-server \
    -p 9000:9000 \
    -p 9001:9001 \
    --env MINIO_ROOT_USER="root" \
    --env MINIO_ROOT_PASSWORD="123456789" \
    --env MINIO_DEFAULT_BUCKETS='my-bucket' \
    --env MINIO_FORCE_NEW_KEYS="yes" \
    --env BITNAMI_DEBUG=true \
    --network app-tier \
    bitnami/minio:latest

docker run -itd \
    --name minio-client \
    --env MINIO_SERVER_HOST="minio-server" \
    --env MINIO_SERVER_ACCESS_KEY="root" \
    --env MINIO_SERVER_SECRET_KEY="123456789" \
    --network app-tier \
    bitnami/minio-client:latest
```

管理后台: <http://localhost:9001/login>

## 机器学习

-----

### TensorFlow

```shell
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

```shell
docker pull bitnami/pytorch:latest
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

```shell
docker pull apache/apisix:latest
docker pull apache/apisix-dashboard:latest
```

管理后台: <http://127.0.0.1:8080/apisix/dashboard>

### Tyk

```shell
docker pull tykio/tyk-gateway:latest
```

### Gravitee

```shell
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
    --link consul-server-standalone `
    --add-host=host.docker.internal:host-gateway `
    -p 8080:8080 `
    -p 80:80 `
    -v /var/run/docker.sock:/var/run/docker.sock `
    traefik:latest --api.insecure=true --providers.consul.endpoints="consul-server-standalone:8500"
```

管理后台:<http://localhost:8080>

## 参考资料

-----

<https://docs.emqx.cn/broker/v4.3/#%E6%B6%88%E6%81%AF%E6%A1%A5%E6%8E%A5>  
<https://github.com/lf-edge/ekuiper/blob/master/README-CN.md>  
<https://db-engines.com/en/ranking/time+series+dbms>  
