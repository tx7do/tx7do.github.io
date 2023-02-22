# Centos 安装 Golang

```bash
vim install_golang.sh
```

创建以下Shell脚本：

```shell
# 安装Wget用于下载文件
yum install wget -y

# 设置Golang的版本
latest_version=1.20.1

# 下载Golang二进制程序压缩包
wget https://dl.google.com/go/go$latest_version.linux-amd64.tar.gz

# 解压文件
rm -rf /usr/local/go && tar -C /usr/local -xzf go$latest_version.linux-amd64.tar.gz
rm -fr go$latest_version.linux-amd64.tar.gz

# 设置环境变量
export PATH=$PATH:/usr/local/go/bin; echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
source ~/.bash_profile

# 测试安装成功与否，查看Golang版本。
go version
```
