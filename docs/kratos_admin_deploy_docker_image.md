# 开箱即用的GO后台管理系统 Kratos Admin - 如何进行Docker部署后端

所有的相关操作命令都封装进Makefile里面。

## 使用docker-compose部署服务

```bash
make docker-compose
```

使用了docker compose安装依赖的三方组件，并且构建安装项目中的服务。实现了一键部署。

## 使用docker run部署服务

```bash
make docker
```

如果在后端项目根目录下执行该命令，将会构建所有服务的镜像。而在每个服务之下的“app/{服务名}/service”下执行，则构建的是当前服务的镜像。

构建出来的服务的镜像，我们可以使用`docker run`命令单个部署：

```bash
docker run -itd --name admin-server --network=app-tier -p 7788:7788 --link postgres --link redis --link consul kratos-admin/admin-service:latest
```

如果微服务的配置里面，中间件的地址写成了`127.0.0.1`或者`localhost`，这时候微服务的容器是访问不了中间件的，需要相应的修改，直接填写该中间件的镜像名，并且在`docker run`的时候使用`--link`参数将该中间件的容器链接起来，就可以访问了。

## 后面增减服务，如何修改Docker配置

一般来说，Dockerfile如无特别的需求，是不需要做任何修改的。Makefile里面的`make docker`命令可以自适应服务的增减。

如果，我们需要使用docker-compose来部署服务，那么，我们增减服务的时候，则需要修改docker-compose.yaml文件。

```yaml
  admin-service:
    image: kratos-admin/admin-service
    restart: always
    networks:
      - app-tier
    ports:
      - "7788:7788"  # 端口映射，将容器的 7788 端口映射到主机的 7788 端口
    depends_on:
      - postgres
      - redis
      - minio
      - consul
      - jaeger
    build:
      context: ./  # 指定 Dockerfile 所在的上下文路径
      args:
        SERVICE_NAME: admin
        APP_VERSION: 1.0.0
```

在这里我们拿后台管理服务来举例，主要就是需要修改服务的名字，映射的端口，别的一般倒没什么。需要注意的是，`SERVICE_NAME`对应的是服务路径`app/{服务名}/service`当中的`{服务名}`。

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)
