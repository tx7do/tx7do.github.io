# Docker清理磁盘空间

在日常运维当中，Docker会产生一些运行时的临时文件，我们需要定时的清理掉他们，不然将会对磁盘造成极大的压力。

## 探查命令

查看整个Docker系统的磁盘占用情况：

```shell
docker system df
```

查看每一个Docker容器和镜像的磁盘占用情况：

```shell
docker system df -v
```

查看系统整体的磁盘占用情况:

```shell
df -h
```

查看当前文件夹下所有子文件夹的磁盘占用情况：

```shell
du -ah --max-depth=1

# 按照文件大小从大到小排序
du -ah --max-depth=1 .|sort -hr
```

查看当前文件夹以及所有子文件夹的磁盘占用汇总：

```shell
du -sh *

# 按照文件大小从大到小排序
du -sh *|sort -nr
```

## Docker命令常规清除

清除掉Docker的：停止的容器、无用镜像、缓存、挂载数据 **（这条命令需要谨慎，因为暂时停止的容器也会被干掉）**：

```shell
sudo docker system prune -a
```

清除掉无用的镜像：

```shell
sudo docker image prune -f
```

清除掉无用的容器：

```shell
docker container prune - f
```

清除掉无用的数据卷：

```shell
docker volume prune - f
```

清除掉无用的网络：

```shell
docker network prune - f
```

清除掉Build的缓存：

```shell
sudo docker builder prune -f
```

## 清除掉`/var/lib/docker/containers`下的日志文件

占据磁盘空间的主要是以下文件：

```bash
/var/lib/docker/containers/<container id>/<container id>-json.log
```

这个应该是容器的日志（非容器内部运行日志）。可以使用以下脚本进行清除：

```bash
#!/bin/bash
echo "======== start clean docker containers logs ========"
logs=$(find /var/lib/docker/containers/ -name *-json.log)
for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done
echo "======== end clean docker containers logs ========"
```

## 清除掉`/var/lib/docker/overlay2/`下的日志文件

```bash
#!/bin/bash
echo "======== start clean docker overlays logs ========"
logs=$(find /var/lib/docker/overlay2/ -name *.log)
for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done
echo "======== end clean docker overlays logs ========"
```

这个文件夹下面的文件是容器实质内容物的存放地。所以，这下面的增量文件也应该是容器内程序的运行时日志等。

## 集大成者清理脚本

```bash
#!/bin/bash

echo "======== start clean docker ========"
sudo docker image prune -f
sudo docker builder prune -f
echo "======== end clean docker ========"

echo "======== start clean docker containers logs ========"
logs=$(find /var/lib/docker/containers/ -name *-json.log)
for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done
echo "======== end clean docker containers logs ========"

echo "======== start clean docker overlays logs ========"
logs=$(find /var/lib/docker/overlay2/ -name *.log)
for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done
echo "======== end clean docker overlays logs ========"

# restart all docker containers.
echo "======== start restart all docker containers ========"
sudo docker restart $(docker ps -a -q)
echo "======== end restart all docker containers ========"

# restart all not-docker services.
echo "======== start restart all not-docker services ========"
sudo supervisorctl restart all
echo "======== end restart all not-docker services ========"
```

## 参考资料

- [清理Docker垃圾](https://www.cnblogs.com/lvzhenjiang/p/15145393.html)
- [快速清理Docker垃圾文件，释放硬盘空间](https://cloud.tencent.com/developer/article/1834792)
- [Docker容器占用磁盘内存过大的问题排查](https://hhbbz.github.io/2018/03/28/Docker%E5%AE%B9%E5%99%A8%E5%8D%A0%E7%94%A8%E7%A3%81%E7%9B%98%E5%86%85%E5%AD%98%E8%BF%87%E5%A4%A7%E7%9A%84%E9%97%AE%E9%A2%98%E6%8E%92%E6%9F%A5/)
- [Docker 容器磁盘占用100%(/var/lib/docker/overlay2空间占用很大)](https://blog.csdn.net/weixin_41945228/article/details/104331479)
- [docker 清理 overlay2](https://juejin.cn/s/docker%20%E6%B8%85%E7%90%86%20overlay2)
- [docker中 启动所有的容器命令](https://blog.51cto.com/zxx287856774/1665264)
