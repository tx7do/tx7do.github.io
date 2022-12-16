# 怎样在Ubuntu下面安装LLVM

## 获取系统版本信息

```shell
lsb_release -a
```

```
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.5 LTS
Release:        20.04
Codename:       focal
```

## 查找APT软件包

```shell
apt search clang
apt-cache search clang
aptitude search clang
```

可以获知，现在（2022.12.16）这个Ubuntu版本可以安装到Clang 13，而默认的版本是Clang 10。

## 擦除掉Clang的替换信息

```shell
sudo update-alternatives --remove-all clang
```

## 安装LLVM

```shell
sudo apt install clang-13 llvm-13 clang llvm lldb lld
```

其中，clang是LLVM的前端，lldb是调试器，lld是链接器。

## 查看本地安装的Clang

```shell
dpkg -l | grep clang | awk '{print $2}'
```

我本地的版本有：

```
clang
clang-10
clang-13
clangd
clangd-10
libclang-10-dev
libclang-6.0-dev
libclang-common-10-dev
libclang-common-13-dev
libclang-common-6.0-dev
libclang-cpp10
libclang-cpp13
libclang-dev
libclang1-10
libclang1-13
libclang1-6.0
libclang1-9
```

## 设置版本切换信息

```shell
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-10 10
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-13 20

sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-10 10
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-13 20
```

## 切换版本

```shell
sudo update-alternatives --config clang
sudo update-alternatives --config clang++
```

将会看到以下信息：

```shell
There are 2 choices for the alternative clang (providing /usr/bin/clang).

  Selection    Path               Priority   Status
------------------------------------------------------------
* 0            /usr/bin/clang-13   20        auto mode
  1            /usr/bin/clang-10   10        manual mode
  2            /usr/bin/clang-13   20        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

```shell
There are 2 choices for the alternative clang++ (providing /usr/bin/clang++).

  Selection    Path                 Priority   Status
------------------------------------------------------------
* 0            /usr/bin/clang++-13   20        auto mode
  1            /usr/bin/clang++-10   10        manual mode
  2            /usr/bin/clang++-13   20        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

我选择了Clang 13。

## 查看clang版本号

```shell
clang --version
clang++ --version
```

```
Ubuntu clang version 13.0.1-2ubuntu2~20.04.1
Target: x86_64-pc-linux-gnu
Thread model: posix
InstalledDir: /usr/bin
```

## 参考资料

- [LLVM Releases](https://releases.llvm.org/)
- [Install LLVM on Ubuntu 22.04](https://linuxhint.com/install-llvm-ubuntu/)
