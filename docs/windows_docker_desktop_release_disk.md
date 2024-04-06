# Windows下释放Docker所占用的WSL磁盘空间

使用下面的命令清理镜像：

```bash
docker system prune
```

在Linux下面可以释放磁盘空间，但是在Windows下却并不能够真正的释放硬盘。

搜寻了一下，发现有一个文件超级大：

```bash
C:\Users\{用户名}\AppData\Local\Docker\wsl\data\ext4.vhdx
```

这是WSL的虚拟机文件。这个文件看起来是只增长，不回收硬盘空间的，所以，需要手动回收硬盘空间。

## 1. 停止wsl2

```bash
wsl --shutdown
```

## 2. 运行diskpart释放空间

```bash
# 代码来自 https://github.com/microsoft/WSL/issues/4699#issuecomment-627133168

diskpart
select vdisk file="C:\Users\<你的用户名>\AppData\Local\Docker\wsl\data\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

## 参考资料

- [WSL2 Docker释放磁盘空间](https://gist.github.com/banyudu/af131c7bb681e8a80b5cbe2047e62d4c)
- [wsl2 下清理 docker 占用空间](https://www.jianshu.com/p/f7cb8d952427)
- [WSL 2 should automatically release disk space back to the host OS](https://github.com/microsoft/WSL/issues/4699#issuecomment-627133168)
