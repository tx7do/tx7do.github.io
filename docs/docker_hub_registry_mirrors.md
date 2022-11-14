# Docker Hub 镜像源

| 提供商         | 公共镜像  |私有镜像  |
|--------------|----------|----------|
|[网易云](https://sf.163.com/help/documents/56918246390157312) | http://hub-mirror.c.163.com ||
|[百度云](https://cloud.baidu.com/doc/CCE/s/Yjxppt74z) | https://mirror.baidubce.com ||
|[腾讯云](https://cloud.tencent.com/document/product/1141/50332) | https://ccr.ccs.tencentyun.com ||
|[Docker Proxy](https://dockerproxy.com/docs) | https://dockerproxy.com ||
|[华为云](https://support.huaweicloud.com/topic/85789-1-H) | https://05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com | https://{你的ID}.mirror.swr.myhuaweicloud.com |
|[阿里云](https://cr.console.aliyun.com/) | https://1nj0zren.mirror.aliyuncs.com |http://{你的ID}.mirror.aliyuncs.com|
|[DaoCloud](https://www.daocloud.io/mirror) | ~~http://f1361db2.m.daocloud.io~~ |  |
|[七牛云](https://kirk-enterprise.github.io/hub-docs/#/user-guide/mirror) | ~~https://reg-mirror.qiniu.com~~ ||
|[Azure](https://github.com/Azure/container-service-for-azure-china/blob/master/aks/README.md#22-container-registry-proxy) | ~~https://dockerhub.azk8s.cn~~ ||
|[Docker中国区官方](https://docker-cn.com/registry-mirror) | ~~https://registry.docker-cn.com~~ ||
|[中国科学技术大学](https://mirrors.ustc.edu.cn/help/dockerhub.html)（适用于校园网） | ~~http://docker.mirrors.ustc.edu.cn~~ ||

## 修改配置

修改daemon.json，增加或者修改以下配置：

```json
{
  "registry-mirrors": [
    "https://dockerproxy.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://ccr.ccs.tencentyun.com",
  ]
}
```

Docker从1.3.X之后，与docker registry交互默认使用的是https，然而此处搭建的私有仓库只提供http服务，所以当与私有仓库交互式就会有错误。http服务则需要填写到`insecure-registries`下面。

配置文件所在位置：

- Linux: `/etc/docker/daemon.json`
- Windows: `%USERPROFILE%\.docker\daemon.json` 或者 `%programdata%\Docker\config\daemon.json`
- MacOS: `~/.docker/daemon.json`

如果使用的Docker Desktop，那就更好办了，只需要在配置界面找到`Docker Engine`选项，修改之后然后点击`Apply & Restart`按钮，即可生效。在此修改等同于直接修改daemon.json文件。

## 检查配置是否生效

输入以下命令：

```shell
docker info
```

如果从结果中看到了如下类似的内容，说明配置成功：

```shell
Registry Mirrors:
 https://hub-mirror.c.163.com/
```

## 测试源镜像是否有效

使用`docker pull`命令拉取软件，只要能够正常拉取就是有效的，否则就是无效的。

```shell
docker pull dockerproxy.com/library/nginx:latest
docker pull hub-mirror.c.163.com/library/nginx:latest
docker pull mirror.baidubce.com/library/nginx:latest
docker pull ccr.ccs.tencentyun.com/library/nginx:latest
docker pull 1nj0zren.mirror.aliyuncs.com/library/nginx:latest
docker pull 05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com/library/nginx:latest
```

## 源镜像测速

### Linux

在Linux下面有`time`命令，可以使用该命令对源进行测速：

```bash
time docker pull nginx:latest
```

测速结果大致如下：

```bash
real   1m14.078s
user   0m0.176s
sys    0m0.120s
```

### Windows

在Windows的PowerShell下面可以使用以下命令测速：

```powershell
Measure-Command {docker pull nginx:latest | Out-Default}
```

测速结果大致如下：

```powershell
Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 4
Milliseconds      : 217
Ticks             : 42174202
TotalDays         : 4.88127337962963E-05
TotalHours        : 0.00117150561111111
TotalMinutes      : 0.0702903366666667
TotalSeconds      : 4.2174202
TotalMilliseconds : 4217.4202
```

## 参考资料

- [镜像加速器](https://yeasy.gitbook.io/docker_practice/install/mirror)
- [Docker必备六大国内镜像](https://segmentfault.com/a/1190000023117518)
