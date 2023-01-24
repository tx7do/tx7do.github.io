# WSL2设置网络代理

为了生计所迫，有时候不得不需要在WSL2下面使用代理。

## 获取到宿主的访问IP地址

WSL2要访问宿主的服务，并没有那么容易，并不能简单的通过127.0.0.1来访问，需要获取到宿主的访问IP地址。有两种办法可以访问宿主的IP：

1. `cat /etc/resolv.conf`命令获取`nameserver`；
2. 如果安装了Docker，可以获取`host.docker.internal`。

推荐使用第一种方法。

## 配置代理

Ubuntu下面与代理有关的环境变量有：

1. `ALL_PROXY`
2. `HTTP_PROXY`
3. `HTTPS_PROXY`
4. `NO_PROXY`

手动配置代理的命令：

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=http://127.0.0.1:7890
```

终端所添加的环境变量是临时的，只适用于当前终端，关闭当前终端或在另一个终端中，添加的环境变量是无效的。

如果是原生的Ubuntu，上面的命令已经可以了，但是由上面可知，这样并不能够访问到宿主的代理，所以，还需要改进，需要编写以下Shell脚本来达成目的：

```bash
#!/bin/bash
hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
export HTTPS_PROXY="http://$hostip:7890"
export HTTP_PROXY="http://$hostip:7890"
export ALL_PROXY="http://$host_ip:7890"
```

## 编写配置

如果需要一直的生效，就需要把它写入到Shell配置文件里面去。

### 作用于当前用户

如果只需要添加的环境变量对当前用户有效，可以写入用户主目录下的Shell配置文件里面去。

bash配置文件是：`~/.bashrc`

zsh配置文件是：`~/.zshrc`

以下以bash示例：

```bash
vim ~/.bashrc
```

将下面的两行脚本添加到末尾：

```bash
hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
export ALL_PROXY="http://$host_ip:7890"
```

注销或者重启可以使修改生效，如果要使添加的环境变量马上生效：

```bash
source ~/.bashrc
```

### 作用于所有用户

要使环境变量对所有用户有效，可以修改`profile`文件

```bash
sudo vim /etc/profile
```

将下面的两行脚本添加到末尾：

```bash
host_ip=$(cat /etc/resolv.conf |grep "nameserver" |cut -f 2 -d " ")
export ALL_PROXY="http://$host_ip:7890"
```

注销或者重启可以使修改生效，如果要使添加的环境变量马上生效：

```bash
source /etc/profile
```

## 查看环境变量

查看环境变量有三个命令

1. `env`

    `env`命令是environment的缩写，用于列出所有的环境变量

2. `export`

    单独使用`export`命令也可以像`env`列出所有的环境变量，不过`export`命令还有其他额外的功能

3. `echo $PATH`

    `echo $PATH`用于列出变量`PATH`的值，里面包含了已添加的目录

我们可以用以下命令查看代理的环境变量：

```bash
echo $ALL_PROXY
```

## 参考资料

- [为 WSL2 一键设置代理](https://zhuanlan.zhihu.com/p/153124468)
- [Accessing Windows networking apps from Linux (host IP)](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-windows-networking-apps-from-linux-host-ip)
- [Ubuntu设置和查看环境变量](https://www.cnblogs.com/lmg-jie/p/9995020.html)
- [设置 ubuntu 中各种应用的代理](https://zhiqiang.org/it/proxy-of-application-in-ubuntu.html)
- [Ubuntu 网络代理配置](https://www.cnblogs.com/wyzersblog/p/13303335.html)
