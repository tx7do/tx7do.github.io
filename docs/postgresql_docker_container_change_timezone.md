# PostgreSQL Docker容器修改时区

做了一些配置的修改之后，查询到的数据倒是显示的是+8的时区，可是，执行`show timezone;`之后，不论怎么样都是显示的是`UTC`时间。

## 环境变量

docker-compose的相关配置如下：

```yml
services:
  postgres:
    environment:
      - TZ=Asia/Shanghai
      - PGTZ=Asia/Shanghai
```

这个已经被证明无效。

## 数据映射

docker-compose的相关配置如下：

```yml
services:
  postgres:
    volumes:
      - '/etc/timezone:/etc/timezone:ro'
      - '/etc/localtime:/etc/localtime:ro'
```

增加`'/etc/localtime:/etc/localtime:ro'`已经被证明查询会+8，`'/etc/timezone:/etc/timezone:ro'`则不行，一添加就会报错。

## 修改容器的时区

先进入容器：

```shell
docker exec -t -i postgresql /bin/bash
```

执行命令：

```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
echo 'Asia/Shanghai' > /etc/timezone
```

## 参考资料

- [Docker Postgresql 13 修改时区](https://www.jianshu.com/p/9fe66f7be488)
