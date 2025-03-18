# 开箱即用的GO后台管理系统 Kratos Admin - 如何进行Docker部署后端

所有的相关操作都封装进Makefile里面。

## 使用docker-compose安装三方中间件

```bash
make docker-compose
```

## 构建服务的镜像

```bash
make docker
```

如果在后端项目根目录下执行该命令，将会构建所有服务的镜像。而在每个服务之下的“app/{服务名}/service”下执行，则构建的是当前服务的镜像。

## 创建容器

```bash
docker run -itd --name admin-server --network=app-tier -p 7788:7788 --link postgres --link redis --link consul kratos-admin/admin-service:latest
```

服务的默认配置，中间件的地址都写的`127.0.0.1`或者`localhost`，这时候是访问不了中间件的，需要相应的修改。
