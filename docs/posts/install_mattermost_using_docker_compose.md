---
date: 2020-01-01
category:
  - 运维技术
tag:
  - Mattermost
  - Docker
sticky: 10
---

# 使用 Docker Compose 安装 Mattermost

本文适合那些正在寻找使用 Docker Compose 安装 Mattermost 的详细且简单的指南的人。

[Mattermost](https://mattermost.com/)是一种开源、可自托管的在线聊天服务，具有文件共享、搜索和集成功能。它被设计为组织和公司的内部聊天工具，主要将自己定位为 Slack 和 Microsoft Teams 的开源替代品。

💾您可以在[GitHub](https://github.com/heyValdemar/mattermost-traefik-letsencrypt-docker-compose)上找到本指南中使用的存储库。

我们将使用[Traefik](https://traefik.io/traefik/)作为反向代理。它将处理从[Let's Encrypt](https://letsencrypt.org/)为您的域名获取加密证书，并根据这些域将请求路由到相应的服务。

❗ 要获取加密证书，您需要外部 DNS 区域中的 A 类型记录，该记录指向安装 Traefik 的服务器的 IP 地址。如果您最近创建了这些记录，则应等待后再开始安装服务。在 DNS 服务器之间完全复制这些记录可能需要几分钟到 48 小时，在极少数情况下甚至需要更长的时间。

在本指南中，我们将考虑您已经拥有安装了 Ubuntu Server 22.04 LTS 的服务器的情况。

您可以在我的指南“安装 Ubuntu Server 22.04 LTS ”中找到有关[如何安装Ubuntu Server 22.04 LTS](https://www.heyvaldemar.com/install-ubuntu-server-22-04-lts/)的详细信息。

服务器上还必须安装 Docker Engine 和 Docker Compose。

您可以通过阅读[在 Ubuntu Server 上安装 Docker Engine 和 Docker Compose](https://www.heyvaldemar.com/install-docker-engine-and-docker-compose-on-ubuntu-server/)来了解如何在 Ubuntu Server 上安装 Docker Engine 。

另外，服务器上必须安装OpenSSH，并且必须打开22端口，才能使用SSH协议连接到服务器。

要在服务器上安装 OpenSSH，您可以使用以下命令：

```bash
sudo apt install openssh-server
```

如果您计划使用 Windows 操作系统连接到服务器，可以使用[PuTTY](https://www.putty.org/)或[MobaXterm](https://mobaxterm.mobatek.net/)。

本指南介绍如何使用安装在 macOS 操作系统上的终端模拟器[iTerm2](https://iterm2.com/)连接到服务器。

💡 请注意，您需要打开以下 TCP 端口才能访问服务：

- TCP 端口 80 - 通过 Let's Encrypt 认证中心获取免费的加密证书。
- TCP 端口 443 - 用于访问 Mattermost Web 界面。
- UDP 端口 8443 - 用于处理 Mattermost 内的安全语音呼叫。

我们连接到计划安装 Mattermost 的服务器。

现在有必要为您的服务创建网络。

我们使用以下命令为 Traefik 创建一个网络：

```bash
docker network create traefik-network
```

我们使用以下命令为 Mattermost 创建一个网络：

```bash
docker network create mattermost-network
```

接下来，您需要克隆包含配置文件的存储库，其中包括 Mattermost 工作的所有必要条件。

您可以使用以下命令克隆存储库：

```bash
git clone https://github.com/heyValdemar/mattermost-traefik-letsencrypt-docker-compose.git
```

使用以下命令导航到存储库所在的目录：

```bash
cd mattermost-traefik-letsencrypt-docker-compose
```

接下来，您需要根据您的要求更改`.env`文件中的变量。

 💡 请注意，该`.env`文件应与`mattermost-traefik-letsencrypt-docker-compose.yml`在同一级文件夹下。

现在让我们使用以下命令启动 Mattermost：

```bash
docker compose -f mattermost-traefik-letsencrypt-docker-compose.yml -p mattermost up -d
```

要访问 Mattermost 管理面板，请从您的工作站访问 `https://mattermost.heyvaldemar.net`，其中 `mattermost.heyvaldemar.net` 是我的服务的域名。因此，您需要指定指向已安装 Traefik 服务的服务器 IP 地址的域名，这会将请求重定向到 Mattermost。

💡 请注意，您需要指定先前在`.env`文件中定义的服务域名。

接下来，您需要注册才能开始使用 Mattermost 仪表板。

要访问 Traefik 控制面板，请从您的工作站访问 `https://traefik.mattermost.heyvaldemar.net`，其中 `traefik.mattermost.heyvaldemar.net` 是我的服务的域名。因此，您需要指定指向已安装 Traefik 的服务器 IP 地址的域名。

💡 请注意，您需要指定先前在`.env`文件中定义的服务域名。

输入之前在`.env`文件中设置的用户名和密码，然后单击“确定”按钮。

## 原文地址

- [Install Mattermost Using Docker Compose](https://www.heyvaldemar.com/install-mattermost-using-docker-compose/)
