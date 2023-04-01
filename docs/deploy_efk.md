# 部署EFK

- ElasticSearch
- Fluentd
- Kibana

## Docker Run

```bash
docker network create app-tier --driver bridge
```

### ElasticSearch

```bash
docker pull bitnami/elasticsearch:latest

docker run -itd \
    --name elasticsearch \
    -p 9200:9200 \
    -p 9300:9300 \
    --network app-tier \
    -e ELASTICSEARCH_USERNAME=elastic \
    -e ELASTICSEARCH_PASSWORD=elastic \
    -e xpack.security.enabled=true \
    -e discovery.type=single-node \
    -e http.cors.enabled=true \
    -e http.cors.allow-origin=http://localhost:13580,http://127.0.0.1:13580 \
    -e http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization \
    -e http.cors.allow-credentials=true \
    bitnami/elasticsearch:latest
```

### Fluentd

```bash
docker pull bitnami/fluentd:latest

docker run -d \
    --name fluentd \
    --network app-tier \
    -p 24224:24224 \
    -p 24224:24224/udp \
    -v /data:/opt/bitnami/fluentd/log \
    bitnami/fluentd:latest
```

需要修改配置文件，配置文件的位置在：`/opt/bitnami/fluentd/conf/fluentd.conf`

原始的配置文件如下所示，日志写入到本地文件里：

```xml
<source>
  @type  forward
  @id    input1
  @label @mainstream
  port  24224
</source>

<filter **>
  @type stdout
</filter>

<label @mainstream>
  <match docker.**>
    @type file
    @id   output_docker1
    path         /opt/bitnami/fluentd/logs/docker.*.log
    symlink_path /opt/bitnami/fluentd/logs/docker.log
    append       true
    time_slice_format %Y%m%d
    time_slice_wait   1m
    time_format       %Y%m%dT%H%M%S%z
  </match>
  <match **>
    @type file
    @id   output1
    path         /opt/bitnami/fluentd/logs/data.*.log
    symlink_path /opt/bitnami/fluentd/logs/data.log
    append       true
    time_slice_format %Y%m%d
    time_slice_wait   10m
    time_format       %Y%m%dT%H%M%S%z
  </match>
</label>

# Include config files in the ./config.d directory
@include config.d/*.conf
```

如果我们要把日志写入到ElasticSearch，我们需要`fluent-plugin-elasticsearch`插件，并且需要在配置里面添加一个`<match>`节点：

```xml
<match **>
  @type elasticsearch
  host host.docker.internal
  port 9200
  index_name fluentd
  type_name log
</match>
```

然后，我们就启动服务，产生日志，然后就可以从ElasticSearch中查询日志数据：<http://localhost:9200/fluentd/_search>

另外，如果我们要把日志写入到MongoDB，我们可以添加一个`<match>`节点：

```xml
<match **>
  @type mongo
  database lodge
  collection fluentd
  capped
  capped_size 100m
  host host.docker.internal
  port 27017
  user <MONGO_USER>
  password <MONGO_PASS>
  time_key time
</match>
```

### Kibana

```bash
docker pull bitnami/kibana:latest

docker run -d \
    --name kibana \
    --network app-tier \
    -p 5601:5601 \
    -e KIBANA_ELASTICSEARCH_URL=elasticsearch \
    -e KIBANA_ELASTICSEARCH_PORT_NUMBER=9200 \
    bitnami/kibana:latest
```

## Docker Compose

```yml
version: '3'

networks:
  app-tier:
    driver: bridge

services:
  elasticsearch:
    image: docker.io/bitnami/elasticsearch:latest
    networks:
      - app-tier
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=elastic
      - xpack.security.enabled=true
      - discovery.type=single-node
      - http.cors.enabled=true
      - http.cors.allow-origin=http://localhost:13580,http://127.0.0.1:13580
      - http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
      - http.cors.allow-credentials=true

  fluentd:
    image: docker.io/bitnami/fluentd:latest
    networks:
      - app-tier
    depends_on:
      - "elasticsearch"
    volumes:
      - /data/fluentd/conf:/opt/bitnami/fluentd/conf
      - /data/fluentd/log:/opt/bitnami/fluentd/log
    ports:
      - "24224:24224"
      - "24224:24224/udp"

  kibana:
    image: docker.io/bitnami/kibana:latest
    networks:
      - app-tier
    depends_on:
      - "elasticsearch"
    ports:
      - "5601:5601"
    environment:
      - KIBANA_ELASTICSEARCH_URL=elasticsearch
      - KIBANA_ELASTICSEARCH_PORT_NUMBER=9200
```

## 参考资料

- [Fluentd 配置](https://blog.csdn.net/weixin_37887248/article/details/82772199)
- [在 Kubernetes 上搭建 EFK 日志收集系统](https://cloud.tencent.com/developer/article/1644126)
- [EFK（elasticsearch + fluentd + kibana）日志系统](https://blog.51cto.com/u_3029920/4885936)
- [用 ElasticSearch + FluentD 打造 Log 神器與數據分析工具](https://blog.toright.com/posts/5133/%E7%94%A8-elasticsearch-fluentd-%E6%89%93%E9%80%A0-log-%E7%A5%9E%E5%99%A8%E8%88%87%E6%95%B8%E6%93%9A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.html)
- [HOW TO IMPROVE YOUR LOGGING PROCESS WITH FLUENTD, ELASTICSEARCH, AND KIBANA (FEK)](https://x-team.com/blog/improve-your-logging-process/)
- [How To Set Up an Elasticsearch, Fluentd and Kibana (EFK) Logging Stack on Kubernetes](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes)
