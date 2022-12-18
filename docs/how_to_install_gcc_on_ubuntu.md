# 怎样在Ubuntu下面安装GCC

## 获取系统版本信息

```bash
lsb_release -a
```

得到版本信息`Ubuntu 20.04.5 LTS` 和 `focal`：

```bash
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.5 LTS
Release:        20.04
Codename:       focal
```

## 查找APT软件包

```bash
apt search gcc
apt-cache search gcc
aptitude search gcc
```

可以获知，现在（2022.12.16）这个Ubuntu版本可以安装到GCC 10，而默认的版本是GCC 9。

## 安装GCC

```bash
# 通过软件集安装
sudo apt install build-essential
# 指定版本安装
sudo apt install gcc-10 g++-10
# 调试器
sudo apt install gdb
```

## 查看本地安装的GCC

```bash
dpkg -l | grep gcc | awk '{print $2}'
```

我本地的版本有：

```bash
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

## 多版本管理

Ubuntu下面有一个系统软链接管理神器：update-alternatives。

如果，我们需要在本地存在多个版本的编译器，那么，可以使用它来进行管理和切换。

### 擦除掉软链接

```bash
sudo update-alternatives --remove-all gcc 
sudo update-alternatives --remove-all g++
```

### 创建软链接信息

```bash
# gcc
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-9 10
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 20

# g++
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-9 10
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-10 20
```

### 切换版本

实际上就是在切换软链接的连接对象：

```bash
sudo update-alternatives --config gcc
sudo update-alternatives --config g++
```

执行以上的命令，将会看到以下信息：

切换gcc：

```bash
There are 2 choices for the alternative gcc (providing /usr/bin/gcc).

  Selection    Path             Priority   Status
------------------------------------------------------------
* 0            /usr/bin/gcc-10   20        auto mode
  1            /usr/bin/gcc-10   20        manual mode
  2            /usr/bin/gcc-9    10        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

切换g++：

```bash
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

```bash
gcc -v
g++ -v
```

```bash
gcc version 10.3.0 (Ubuntu 10.3.0-1ubuntu1~20.04)
```

## 参考资料

- [GCC Releases](https://gcc.gnu.org/releases.html)
- [Ubuntu下多个gcc版本之间的切换](https://www.cnblogs.com/youpeng/p/10913922.html)
- [How to choose the default gcc and g++ version?](https://askubuntu.com/questions/26498/how-to-choose-the-default-gcc-and-g-version?rq=1)
