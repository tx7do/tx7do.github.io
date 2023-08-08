# 使用 cron 和 RClone 实现自动备份文件

本文将向您展示如何在 Linux 操作系统中使用 RClone 和 cron 来自动进行文件备份。

现在是星期五下午 6 点，我需要将一些工作和学校文件备份到 Google 云端硬盘。是的，我使用 git 进行编码项目，但这种工作最好保存在 Google Drive 中。所以我想知道是否有一种更快、简单、自动化的方法来备份到 Google Drive，有趣的是，我发现了 RClone。

在本文中您将了解到：

- 什么是 RClone
- 什么是 cron
- RClone 和 cron 的基本用法
- 如何每周五下午 6:30 自动备份文件
- Cron日志记录
- 如何卸载 RClone

## RClone是什么？

基本上，RClone 是一个命令行计算机程序，可以管理、传输和同步文件从计算机到云存储，甚至在两个云存储之间。

## Cron 是什么？

Cron 是一个命令行实用软件，主要目的是调度作业。作业基本上是由两部分组成的 cron 命令，第一个是计划表达式，最后一个是要执行的脚本。通常，所有 Linux 操作系统都安装了 cron，如果没有安装：

### CentOS/RHEL 7/8/5

```bash
yum install cronie
```

### Ubuntu

```bash
apt-get install cron
```

使用 cron，您可以安排命令或 shell 脚本在特定时间运行，这就是我们要做的。安排 RClone 命令在每周五下午 6:30 运行。

## 设置 RClone

首先，安装 RClone。

对于Linux、macOS 和 BSD，只需运行：

```bash
curl https://rclone.org/install.sh | sudo bash
```

安装 RClone 后，让我们运行 RClone 配置命令。

```bash
rclone config
```

您将在这里执行以下步骤：

1. 选择 n 作为新遥控器。
2. 输入新 RClone 配置的名称，例如 mygdrive。
3. 输入 15 以使用 Google Drive 作为远程存储。
4. 对于接下来的两个步骤，只需键入 Enter 即可继续。
5. 现在选择 1 以获得完全访问权限。
6. 对于接下来的两个选择，只需输入 Enter 即可继续。
7. 在 RClone 弹出窗口中登录您的 Google 帐户。现在您已准备好出发了。

## 构建 shell 脚本以将文件备份到 Google Drive

我们将构建一个包含 RClone 命令行的 shell 脚本，以将文件夹从我的计算机同步到 Google Drive 存储。

打开你的终端并输入：

```bash
mkdir sh ; cd sh
```

您不需要在 $HOME 目录中创建 sh 文件夹，您可以在其他地方创建甚至不创建，但最好将脚本组织在一个地方。如果您在其他地方创建，只需提醒自己在后续步骤中更改路径即可。

现在如果你想使用 vim 那么：

```bash
vim backup.sh
```

但是，如果您想使用其他文本编辑器，只需`backup.sh`在`$HOME/sh`文件夹或任何其他位置创建一个名为的文件，这`$HOME/sh`将是我在本文中的位置。

文件打开后`backup.sh`，让我们编写一行代码，将文件夹从我的计算机同步到 Google 云端硬盘存储。

```bash
rclone sync -v --create-empty-src-dirs /$HOME/Desktop/Work mygdrive:/Work
```

现在让我们深入了解该命令的解释。

```bash
rclone sync
```

同步将从源复制文件并将其发送到目标，但不会修改源，仅修改目标。

```bash
--create-empty-src-dirs
```

默认情况下，源中的空文件夹不会同步，因此为了解决此问题，此标志会在目标中创建空文件夹。

在命令的最后一部分中，您有两个由空格分隔的路径，第一个是源路径，第二个是目标路径。现在您可能应该注意到第二条路径有一个`mygdrive:`与名称相同的名称`rclone config`。所以基本上我是使用配置将数据从我的计算机同步到 Google Drive `mygdrive`。

您可以拥有多个 RClone 配置，这使您不仅可以从计算机同步或复制文件到云，还可以从一个云同步或复制文件到另一个云。像这样：

```bash
rclone sync -v --create-empty-src-dirs mygdrive:/Work anothergdrive:/Work
```

要查看 backup.sh 文件是否有效，只需运行以下命令并检查目标是否已更改。

```bash
source backup.sh
```

`backup.sh`正常工作后，让我们了解如何安排`backup.sh`每天运行。

最终脚本：

```bash
rclone sync -v --create-empty-src-dirs /$HOME/Desktop/Work mygdrive:/Work
rclone sync -v --create-empty-src-dirs /$HOME/Desktop/School mygdrive:/School
```

## 设置 cron 来运行 Shell 文件

要在 cron 中安排任何作业，我们需要编辑 crontab 文件，要编辑此文件，请打开终端并输入：

```bash
crontab -e
```

如果你从未使用过 crontab，那么你必须选择一个默认的文本编辑器，在我的例子中是 vim。

它将使用默认文本编辑器打开 crontab 文件。文件打开后您只能看到注释。

要在 cron 中进行调度，您将需要特定类型的表达式。下面您将看到表达式的结构：

```bash
.---------------- minute (0 - 59)
 |  .------------- hour (0 - 23)
 |  |  .---------- day of month (1 - 31)
 |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
 |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed
 |  |  |  |  |
 *  *  *  *  *  command to be executed
```

示例 — 安排作业 ( my_shell.sh ) 在每周一上午 8:49 运行的表达式为：

```bash
49 8 * * 1 my_shell.sh
```

如果您想在周一至周五上午 11:26 运行作业 (my_shell.sh)，您可以编写：

```bash
26 11 * * 1-5 my_shell.sh
```

更多表达式示例：

```bash
0 * * * *     => Every hour
*/2 * * * *   => Every two minutes
0 9-17 * * *  => At minute 0 past every hour from 9 through 17
```

有关更多示例或测试您的表达式是否会返回与您期望的逻辑相同的逻辑，请访问[crontab](https://crontab.guru/)了解更多信息。

打开 crontab 文件后，键入以下行：

```bash
30 18 * * 5 /$HOME/sh/backup.sh
```

这个命令的作用是，每周五下午 6:30 `backup.sh`都会被调用，它将我的文件备份到 Google Drive。

## 提示 — cron 日志文件在哪里？

默认情况下，cron 日志文件位于：

```bash
/var/log/syslog
```

要查看此文件中的 cron 日志，请运行以下代码：

```bash
grep CRON /var/log/syslog
```

或持续查看文件：

```bash
tail -f /var/log/syslog | grep CRON
```

该命令将返回如下内容：

```bash
Dec 15 07:35:01 rainbowone CRON[242416]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Dec 15 07:45:01 rainbowone CRON[245607]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Dec 15 07:55:01 rainbowone CRON[248793]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Dec 15 08:00:01 rainbowone CRON[249386]: (rainbow) CMD (/$HOME/Desktop/sh/daily.sh)
```

这些消息仅显示 cron 运行了哪个命令，如果您想查看日志，`backup.sh`则需要个性化`backup.sh`创建自己的日志文件，并写入其中的内容。

但假设您想将 cron 消息记录到特定文件中，如果您运气好的话，我将向您展示如何操作。

首先，打开这个文件：

```bash
/etc/rsyslog.d/50-default.conf
```

取消注释以 `#cron.*` 开头的行，然后使用以下命令重新启动`syslog`：

```bash
sudo service rsyslog restart
```

之后您将看到 cron 的日志出现在`/var/log/cron.log`和`/var/log/syslog`。

## 如何卸载RClone？

从Linux操作系统中卸载RClone非常简单，首先，让我们找到rclone配置文件在哪里，要找到该文件，请运行以下命令。

```bash
rclone config file
```

它将列出一个或多个 RClone 配置路径。

```bash
Configuration file is stored at:
/home/$USER/.config/rclone/rclone.conf
```

删除配置文件：

```bash
sudo rm -rf /home/$USER/.config/rclone/rclone.conf
```

最后从系统中删除 RClone：

```bash
sudo rm /usr/bin/rclone
sudo rm /usr/local/share/man/man1/rclone.1
```

此时，您可能可以在 Linux 操作系统中使用 `cron` 和 `RClone` 自动执行文件备份。

## 原文地址

- [Automated Backups with cron and RClone](https://dev.to/itsbetma/automated-backups-with-cron-and-rclone-3do4)

如果您喜欢有关 Git、Linux、生产力技巧、Typescript 和 Python 的内容，请关注原文作者[Marco Antonio Bet](https://dev.to/itsbetma)
