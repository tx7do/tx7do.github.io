# 时序数据库应用 - ElasticSearch

## 数据库简介

## 搭建本地Docker数据库

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

## 参考资料  

- [golang elasticsearch入门教程](https://www.tizi365.com/archives/850.html)  
