# Docker在国内没有代理的解决方案

Docker的国内代理都失效了，不抱怨，只讲如何解决问题。

简单来说，就是把本地的镜像导出来，然后打成压缩包，再拷贝到服务器上去，然后再导入。

## 导出镜像

```bash
docker save bitnami/minio:latest -o minio.tar
```

## 导入镜像

```bash
docker load -i minio.tar
```

## 查看本地镜像

```bash
docker images
```

这时候，就会发现MinIO的镜像已经存在于服务器本地了。这个时候就可以调用`docker run`部署了。
