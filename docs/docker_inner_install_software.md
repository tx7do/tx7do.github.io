# Docker内部安装软件

```bash
docker exec -it {容器名} "apt update"
docker exec -it {容器名} "apt install {软件名}"
```

- Debian/Ubuntu系用`apt`安装
- Alpine Linux用`apk`安装
- RedHat/Centos系用`yum`安装

## 替换镜像源

### Debian

```bash
sed -i 's/deb.debian.org/mirrors.tencent.com/g' /etc/apt/sources.list.d/debian.sources
sed -i 's/http:/https:/g' /etc/apt/sources.list.d/debian.sources
```

### Ubuntu

```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
```

### Alpine Linux用

```bash
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
```

## Centos

```bash
# 对于 CentOS 7
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
    -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g' \
    -i.bak \
    /etc/yum.repos.d/CentOS-*.repo

# 对于 CentOS 8
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
    -e 's|^#baseurl=http://mirror.centos.org/$contentdir|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g' \
    -i.bak \
    /etc/yum.repos.d/CentOS-*.repo
```
