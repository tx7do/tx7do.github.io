# 怎样在Ubuntu下面安装GCC

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
apt search gcc
apt-cache search gcc
aptitude search gcc
```

可以获知，现在（2022.12.16）这个Ubuntu版本可以安装到GCC 10，而默认的版本是GCC 9。

## 擦除掉GCC的替换信息

```shell
sudo update-alternatives --remove-all gcc 
sudo update-alternatives --remove-all g++
```

## 安装GCC

```shell
sudo apt install build-essential
sudo apt install gcc-10 g++-10
```

## 查看本地安装的GCC

```shell
dpkg -l | grep gcc | awk '{print $2}'
```

我本地的版本有：

```
gcc
gcc-10
gcc-10-base:amd64
gcc-8
gcc-8-base:amd64
gcc-9
gcc-9-base:amd64
lib32gcc-s1
libgcc-10-dev:amd64
libgcc-8-dev:amd64
libgcc-9-dev:amd64
libgcc-s1:amd64
```

## 设置版本切换信息

```shell
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-9 10
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 20

sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-9 10
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-10 20
```

## 切换版本

```shell
sudo update-alternatives --config gcc
sudo update-alternatives --config g++
```

将会看到以下信息：

```shell
There are 2 choices for the alternative gcc (providing /usr/bin/gcc).

  Selection    Path             Priority   Status
------------------------------------------------------------
* 0            /usr/bin/gcc-10   20        auto mode
  1            /usr/bin/gcc-10   20        manual mode
  2            /usr/bin/gcc-9    10        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

```shell
There are 2 choices for the alternative g++ (providing /usr/bin/g++).

  Selection    Path             Priority   Status
------------------------------------------------------------
* 0            /usr/bin/g++-10   20        auto mode
  1            /usr/bin/g++-10   20        manual mode
  2            /usr/bin/g++-9    10        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

我选择了GCC 10。

## 查看gcc版本号

```shell
gcc -v
g++ -v
```

```
gcc version 10.3.0 (Ubuntu 10.3.0-1ubuntu1~20.04)
```

## 参考资料

- [GCC Releases](https://gcc.gnu.org/releases.html)
- [Ubuntu下多个gcc版本之间的切换](https://www.cnblogs.com/youpeng/p/10913922.html)
- [How to choose the default gcc and g++ version?](https://askubuntu.com/questions/26498/how-to-choose-the-default-gcc-and-g-version?rq=1)
