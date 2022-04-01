# Docker 容器中安装VIM

Docker的容器当中一般是没有安装任何编辑器的,vi和vim神马的都没有.如果想要在容器中使用编辑器,需要自己去安装.  
但是,在 Docker 中执行：`apt-get update`报错:

```bash
E: List directory /var/lib/apt/lists/partial is missing. - Acquire (13: Permission denied)
```

这是因为在Docker Desktop中启动命令行时并没有以管理员身份启动,而是以普通用户的身份启动的,权限不足.  
要解决这个问题,需要用以下命令启动 :

```bash
docker exec -u 0 -it {容器id} /bin/bash
```

其中`-u 0`代表是以`root`用户启动Docker的命令行,再执行更新命令就可以了.

```bash
apt-get install vim
```

这就行了,再到Docker Desktop中启动容器的命令行,这时候已经有vim了.
