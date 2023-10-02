# 部署RustDesk服务器

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
pm2 start hbbs
pm2 start hbbr
pm2 save
```

## 参考资料

- [自建远程桌面连接服务，RustDesk搭建教程](https://www.mintimate.cn/2023/08/27/guideToHostRustDesk/)
- [RustDesk 說明文件 > 自架伺服器 > 自架伺服器 OSS > 安裝](https://rustdesk.com/docs/zh-tw/self-host/rustdesk-server-oss/install/)
- [WINDOWS & PM2 或者 NSSM](https://rustdesk.com/docs/zh-cn/self-host/rustdesk-server-oss/windows/)
- [centos7 systemd pm2 开机启动](https://zhuanlan.zhihu.com/p/33691734)
- [CentOS7下pm2开机自启动](https://blog.csdn.net/qq_37546835/article/details/91359443)
- [CentOS 7 安装和使用PM2](https://juejin.cn/post/7163906312756658190)
