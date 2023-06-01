# Windows下释放Docker所占用的磁盘空间

清理镜像：

```bash
docker system prune
```

使用以上命令清理，并没有释放硬盘。

发现有一个文件超级大：

```bash
C:\Users\{用户名}\AppData\Local\Docker\wsl\data\ext4.vhdx
```

这个文件看起来是只增长，不回收硬盘空间的，所以，需要手动回收硬盘空间。

1. 停止wsl2

```bash
wsl --shutdown
```

2. 运行diskpart释放空间

```bash
# 代码来自 https://github.com/microsoft/WSL/issues/4699#issuecomment-627133168

diskpart
# open window Diskpart
select vdisk file="C:\Users\<你的用户名>\AppData\Local\Docker\wsl\data\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

## 参考资料

- [WSL2 Docker释放磁盘空间](https://gist.github.com/banyudu/af131c7bb681e8a80b5cbe2047e62d4c)
- [wsl2 下清理 docker 占用空间](https://www.jianshu.com/p/f7cb8d952427)
