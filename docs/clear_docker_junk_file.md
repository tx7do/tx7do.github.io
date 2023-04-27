# 清除Docker产生的垃圾文件

通过命令`df -h`查看磁盘空间占用，发现Docker的overlay对磁盘的占用极高。

通过`docker system prune -a`命令清除掉Docker的无用镜像、缓存、挂载数据，也并没有太多的改善。

通过`du -h --max-depth=1`或者`du -sh *`命令查看大文件的占用情况。

## 参考资料

- [Docker容器占用磁盘内存过大的问题排查](https://hhbbz.github.io/2018/03/28/Docker%E5%AE%B9%E5%99%A8%E5%8D%A0%E7%94%A8%E7%A3%81%E7%9B%98%E5%86%85%E5%AD%98%E8%BF%87%E5%A4%A7%E7%9A%84%E9%97%AE%E9%A2%98%E6%8E%92%E6%9F%A5/)
- [Docker 容器磁盘占用100%(/var/lib/docker/overlay2空间占用很大)](https://blog.csdn.net/weixin_41945228/article/details/104331479)
