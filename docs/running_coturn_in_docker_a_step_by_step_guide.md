# 使用 Docker 部署 CoTURN 新手指南

在本指南中，我们将学习如何在 Docker 容器中运行 CoTURN。COTURN 是一款免费的开源 TURN 服务器，可用于 WebRTC 视频和音频通信以及 VoIP 服务

## 先决条件

- 您应该在系统上安装 docker。了解如何在系统上安装 docker 超出了本文的范围
- 建议但不要求具备一些 docker 基础知识

## 安装

Docker 提供了 CoTURN 镜像，可用于在容器中轻松设置 CoTURN 服务器

### 步骤 1 拉取 Docker 镜像

安装docker coturn。从云存储库Docker Hub中拉取coturn的docker镜像。

在终端中输入以下命令来拉取 Docker 镜像

```bash
docker pull coturn/coturn
```

### 第 2 步：配置 coturn 文件

获得 Docker 映像后，您可以通过在终端上运行以下命令来启动 Docker 容器

```bash
docker run -d -p 3478:3478 -p 3478:3478/udp -p 5349:5349 -p 5349:5349/udp -p 49152-65535:49152-65535/udp coturn/coturn
```

我们在这里做了什么？

- -d：以分离模式运行 docker 容器。也就是说它将在后台运行
- -p：指定 TURN 服务器将运行的端口，我们使用端口 3478、5349 以及端口范围 49152-65535

如果你的计算机上安装了 Docker 桌面，你也可以在 Docker 桌面中运行它

只需按照步骤 1 所示拉取 docker 镜像，然后在docker中做类似的设置

TURN 服务器需要大量端口来交换媒体，这是 RFC 5766 中指定的

现在我们已经设置了 TURN 服务器。现在让我们在下一步中对其进行配置

### 步骤 3：配置 TURN 服务器

默认情况下，coturn docker 容器使用 CMD Dockerfile 中指定的 coturn 默认配置

如果我们需要编辑默认配置，我们可以在运行 docker 容器时指定 volume 命令来实现

```bash
docker run -d --network=host -v $(pwd)/custom.conf:/etc/coturn/turnserver.conf coturn/coturn
```

此命令将当前目录中的 custom.conf 文件映射到 turn 服务器目录'/etc/coturn/turnserver.conf'

#### 什么是境界？

Realm 是可以访问具有共同所有者的一组地址的密钥。

TURN 服务器有一个默认领域，但数据库中可以有多个“命名领域”

每个领域都有其所有者和用户名/密码组合，用于访问和识别连接到特定领域的用户

### 步骤 4：开启服务器持久性

CoTURN docker 默认将数据保存在'/var/lib/coturn/'目录中

如果我们需要将数据存储在不同的目录中，我们可以通过在 docker run 命令中指定 -mount 选项来实现

将以下代码粘贴到您的终端中以指定其他文件

```bash
docker run -d --network=host --mount type=tmpfs,destination=/var/lib/coturn coturn/coturn
```

此命令将临时文件系统tmfs挂载到 docker 容器中，并指定 coturn 将数据写入临时文件系统，而不是将数据写入 /var/lib/coturn 文件

如果您不想将数据写入磁盘，则可以执行此操作，从而节省磁盘空间，但代价是将数据保留在临时文件系统上

### 步骤 5：自动检测外部 IP

Coturn 有一项名为 detect-external-ip 的功能，可以自动检测外部 IP

您可以在运行 docker run 命令时将“DETECT_EXTERNAL_IP”环境变量设置为“yes”来启用此功能

```bash
docker run -d --network=host -e DETECT_EXTERNAL_IP=yes coturn/coturn
```

默认情况下，它会检测 IPv4，但如果您希望它检测 IPv6，您可以将其设置为使用以下代码进行检测。

```bash
docker run -d --network=host coturn/coturn --external-ip='$(detect-external-ip --ipv6)' --relay-ip='$(detect-external-ip --ipv6)'
```

### 步骤 6：从 docker 容器获取 Coturn 服务器 URL

由于 docker 容器在你的机器内运行。你将使用服务器 URL 来访问 TURN 服务器

首先，你需要知道 Docker 主机的 IP 地址以及映射到 Docker 容器内的 COTURN 服务器的端口

在上面的示例中，我们将 Docker 容器映射到本地计算机的端口 3478，并在 localhost 或 127.0.0.1 上运行 docker 容器

因此 Coturn 的 URL 将是

转：IP地址_Docker_host：3478

那是

转：127.0.0.1:3478

如果您的主机地址是其他私有 IP 地址（如 192.1688.1.22 或其他地址），则您可以使用上述公式轻松地映射它。

如果你想知道你的本地 IP 是什么，在你的 Linux 或 Mac 终端中输入：

```bash
ip addr show
```

但这里有一个问题。为了能够在本地计算机之外使用 Turn 服务器，我们需要将其映射到公共 IP 地址

### 步骤 7：为 docker COTURN 分配公网 IP

要使用 TURN 服务器，我们需要能够通过互联网访问它。为此，我们需要一个可以分配给 TURN 服务器的公共 IP 地址

以下是涉及的步骤

1. 获取公共 IP 地址：如果你在 AWS、Google Cloud 或其他云提供商实例中运行 Docker 容器，它们会为你提供该实例的公共 IP 地址

    如果你在本地机器上运行 docker 容器，那么你需要从 ISP 互联网服务提供商处获取一个 IP 地址

    您可以访问 IPMango 等网站来查找您的公共 IP 地址

2. 在路由器上配置端口转发：如果你的本地计算机位于路由器后面，则需要配置路由器，以便将所有流量转发到本地计算机

    在路由器中指定本地IP地址和端口号通常为3478。

    如果你在 AWS 实例上运行 Docker 容器，那么这不是问题

3. 更新防火墙规则：确保允许 coturn 服务器正在运行的端口号上的入站和出站流量。如果您在云中运行 coturn，则需要在云服务器中提供规则

4. 最后一步：配置 Coturn 服务器：您需要配置 coturn 服务器以使用公共 IP。打开 coturn 配置文件并将  “`external-ip`”参数更新为您机器的外部 IP

### 步骤 8：测试 CoTurn 是否正在运行

您可以通过三种方式测试docker coturn服务器是否正在运行

滴流冰
ICE 测试

#### 滴流冰

访问网站：https：//www.metered.ca/turn-server-testing

添加配置并点击添加服务器按钮来添加你的 TURN 服务器并进行测试

ICE 测试 turn 服务器

#### 冰上测试

前往 ICE 测试网站：https://icetest.info 并输入您的 turn 服务器凭据来测试 TURN 服务器

### 步骤 9：设置 turn 服务器的域名（可选）

您也可以为你的 turn 服务器设置域名

为此，您需要更新您的 DNS 记录

去 godaddy 或 namecheap 等域名注册商购买域名

添加 DNS 记录并等待他们找到您的服务

### 步骤 10：使用 COTURN 服务器使用 lets encrypt 进行加密（可选）

我们可以使用 lets encrypt 的 certbot 轻松生成 TLS 证书

在 TURN 服务器终端中输入以下命令

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

然后您可以运行 certbot 命令来生成证书。将 <turn.example.com> 替换为您的 TURN 服务器的域名

```bash
sudo certbot certonly --standalone --preferred-challenges http \
    -d <turn.example.com>
```

请注意，要实现此目的，需要打开 TCP 端口 80

目前 cretbot 默认自动续订

为了确保证书可被 coturn 读取，进而运行服务 turn server，让我们在 let's encrypt 中添加一个可更新的钩子

让我们首先创建一个目录

```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
```

接下来创建文件

```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
```

内容如下。替换 TURN 服务器的主机名

```bash
#!/bin/bash -e
for certfile in fullchain.pem privkey.pem ; do
	cp -L /etc/letsencrypt/live/<turn.example.com>/"${certfile}" /etc/turnserver/"${certfile}".new
	chown turnserver:turnserver /etc/turnserver/"${certfile}".new
	mv /etc/turnserver/"${certfile}".new /etc/turnserver/"${certfile}"
done
systemctl kill -sUSR2 coturn.service
```

使此文件可执行

```bash
sudo chmod 0755 /etc/letsencrypt/renewal-hooks/deploy/coturn
```

就这样，我们为 TURN 服务器添加了加密

以下是您可能感兴趣的其他一些文章

- [Jitsi TURN STUN 服务器设置](https://www.metered.ca/blog/jitsi-turn-server/)
- [为 Mattermost Calls 提供免费的 TURN 服务器](https://www.metered.ca/blog/turn-server-for-mattermost-calls/)

## 结论

这就是如何在 docker 容器中配置 turn 服务器。希望这篇文章对你有帮助

感谢您的阅读

## 原文地址

[CoTURN in Docker: A Step-by-Step Guide](https://www.metered.ca/blog/running-coturn-in-docker-a-step-by-step-guide/)
