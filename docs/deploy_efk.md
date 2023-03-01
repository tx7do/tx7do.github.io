# 部署EFK

- ElasticSearch
- Fluentd
- Kibana

## Docker Run

```bash
docker network create kibana_network --driver bridge
```

### ElasticSearch

```bash
docker pull bitnami/elasticsearch:latest

docker run -itd \
    --name elasticsearch \
    -p 9200:9200 \
    -p 9300:9300 \
    --network kibana_network \
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
docker pull bitnami/fluentd-exporter:latest

docker run -d \
    --name fluentd-node1 \
    --network kibana_network \
    -p 24224:24224 \
    -p 24224:24224/udp \
    -v /data:/opt/bitnami/fluentd/log \
    bitnami/fluentd:latest
```

### Kibana

```bash
docker pull bitnami/kibana:latest

docker run -d \
    --name kibana \
    --network kibana_network \
    -p 5601:5601 \
    -e KIBANA_ELASTICSEARCH_URL=elasticsearch \
    -e KIBANA_ELASTICSEARCH_PORT_NUMBER=9200 \
    bitnami/kibana:latest
```
