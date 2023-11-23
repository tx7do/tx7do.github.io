# Kratos 微服务轻松对接 CFG 日志系统

- [ClickHouse](https://clickhouse.com/)
- [Fluent Bit](https://fluentbit.io/)
- [Grafana](https://grafana.com/)

## 部署 CFG

我们使用 Docker 来部署 EFK，首先，让我们先编写一个 Docker-Compose 的配置文件：

```yml
version: "3"

networks:
  app-tier:
    driver: bridge

services:
  clickhouse:
    image: docker.io/bitnami/clickhouse:latest
    networks:
      - app-tier
    ports:
      - "8123:8123" # HTTP port
      - "9000:9000" # TCP port
      - "9004:9004" # MySQL port
      - "9005:9005" # PostgreSQL port
    expose:
      - 9009 # Inter-server HTTP port
    volumes:
      - /root/app/clickhouse:/bitnami/clickhouse
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
#      - CLICKHOUSE_ADMIN_PASSWORD=password123

  fluentbit:
    image: docker.io/bitnami/fluent-bit:latest
    networks:
      - app-tier
    volumes:
      - /root/app/fluentbit/fluent-bit.conf:/fluent-bit/etc/fluent-bit.conf
    ports:
      - "24224:24224"
      - "24224:24224/udp"

  grafana:
    image: docker.io/bitnami/grafana:latest
    networks:
      - app-tier
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=pass
```

## ClickHouse配置

为了准备日志，我们需要在 ClickHouse 中创建表。

如果还没有创建数据库，那么需要先创建数据库：

```sql
CREATE DATABASE fluentbit
```

创建数据库后，我们需要通过实验标志启用 JSON 对象类型`allow_experimental_object_type`，或者使用SQL打开：

```sql
SET allow_experimental_object_type = 1
```

设置完成后，我们可以使用上面的数据库来创建表。

```sql
CREATE TABLE fluentbit.kratos
(
    timestamp DateTime,
    log JSON
)
Engine = MergeTree ORDER BY tuple()
```

创建后，我们可以部署 Fluent Bit 来发送微服务的应用日志。

## Fluent Bit配置

```ini
[INPUT]
    name tail
    path /var/log/access.log
    read_from_head true
    parser nginx_access

[FILTER]
    Name nest
    Match *
    Operation nest
    Wildcard *
    Nest_under log 

# 采集业务服务日志到 clickhouse
[OUTPUT]
    name http
    tls on
    match *
    host 
    port 8123
    URI /?query=INSERT+INTO+fluentbit.kratos+FORMAT+JSONEachRow
    format json_stream
    json_date_key timestamp
    json_date_format epoch
    http_user default
    http_passwd 

# 采集业务服务日志到 kafka
[OUTPUT]
    Name kafka
    Match *
    Brokers localhost:9092
    Topics fluent-logs
    Timestamp_Key _time_
```

## 参考资料

- [Sending Nginx logs to ClickHouse with Fluent Bit](https://clickhouse.com/blog/nginx-logs-to-clickhouse-fluent-bit)
- [Sending Kubernetes logs To ClickHouse with Fluent Bit](https://clickhouse.com/blog/kubernetes-logs-to-clickhouse-fluent-bit)
- [使用fluent-bit采集服务日志](https://juejin.cn/post/7278984693008564284)
