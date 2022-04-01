# Windows11 启动 Docker 提示端口被占用 无法启动

今天Windows11升级重启了,我启动RabbitMQ,然后提示端口被占用,而无法启动Docker.
提示信息如下:

```bash
listen tcp 0.0.0.0:1883: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

## 解决办法

* 打开管理员模式 Windows PowerShell，执行下面命令重启 NAT 驱动服务即可

```bash
net stop winnat
net start winnat
```
