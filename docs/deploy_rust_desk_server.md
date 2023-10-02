# 部署RustDesk服务器

两个可执行程序：

- `hbbs` - RustDesk ID注册服务器，是管各个客户端 ID 的，每个客户端都有一个唯一的 ID 。
- `hbbr` - RustDesk中继服务器，是负责检测、中转各个客户端连接和数据传输。

端口占用情况：

- TCP(21115, 21116, 21117, 21118, 21119)
- UDP(21116)

进程占用端口情况：

- `hbbs` - 21115(tcp), 21116(tcp/udp), 21118(tcp)
- `hbbr` - 21117(tcp), 21119(tcp)

端口的作用：

- 21115(`TCP`) - 用作 NAT 类型测试
- 21116(`UDP`) - 用作 ID 注册 与 心跳服务
- 21116(`TCP`) - 用作 TCP打洞 与 连接服务
- 21117(`TCP`) - 用作中继服务
- 21118/21119(`TCP`) - 为了支持网页客户端

如果启动的时候不加`-k _`参数，则不使用`key`也可以连接服务器。

## CentOS

```shell
# 设置时区为东八区的上海
sudo timedatectl set-timezone Asia/Shanghai
date +%Z

# 更新软件库
sudo yum update; sudo yum upgrade
sudo yum install htop wget unzip

# 安装nodejs和npm
sudo yum install node npm -y

node -v
npm -v

# 安装pm2
sudo npm install -g pm2
# 创建pm2开机启动脚本
sudo pm2 startup
# 设置pm2的开机启动
sudo systemctl enable pm2-root

# 查询RustDesk-Server的最新版本
REPO="rustdesk/rustdesk-server"
latest_tag=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
echo "Using rustdesk-server version $latest_tag"

# 使用wget进行下载最新版RustDesk-Server
wget https://github.com/$REPO/releases/download/$latest_tag/rustdesk-server-linux-amd64.zip

# 解压缩RustDesk-Server
unzip rustdesk-server-linux-amd64.zip

# 文件夹改名
mv amd64 RustDesk

# 移除掉压缩文件
rm -f rustdesk-server-linux-amd64.zip

# pm2启动RustDesk-Server服务
cd ~/RustDesk
pm2 start hbbs -- -k _
pm2 start hbbr -- -k _
pm2 save
```

## Ubuntu

## MacOS

## Windows

## Docker

```shell
sudo docker image pull rustdesk/rustdesk-server

sudo docker run --name hbbs -p 21115:21115 -p 21116:21116 -p 21116:21116/udp -p 21118:21118 -v `pwd`:/root -td --net=host rustdesk/rustdesk-server hbbs -r <relay-server-ip[:port]>

sudo docker run --name hbbr -p 21117:21117 -p 21119:21119 -v `pwd`:/root -td --net=host rustdesk/rustdesk-server hbbr
```

## 参考资料

- [自建远程桌面连接服务，RustDesk搭建教程](https://www.mintimate.cn/2023/08/27/guideToHostRustDesk/)
- [RustDesk 說明文件 > 自架伺服器 > 自架伺服器 OSS > 安裝](https://rustdesk.com/docs/zh-tw/self-host/rustdesk-server-oss/install/)
- [WINDOWS & PM2 或者 NSSM](https://rustdesk.com/docs/zh-cn/self-host/rustdesk-server-oss/windows/)
- [centos7 systemd pm2 开机启动](https://zhuanlan.zhihu.com/p/33691734)
- [CentOS7下pm2开机自启动](https://blog.csdn.net/qq_37546835/article/details/91359443)
- [CentOS 7 安装和使用PM2](https://juejin.cn/post/7163906312756658190)
- [只会 Windows 也能轻松搭建远程桌面 RustDesk 自用服务器](https://www.sysadm.cc/index.php/xitongyunwei/1001-only-using-windows-can-easy-to-build-remote-desktop-rustdesk-self-host)
