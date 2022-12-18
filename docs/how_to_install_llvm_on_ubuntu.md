# 怎样在Ubuntu下面安装Clang

LLVM项目是一个模块化的、可重用的编译器和工具链集合。尽管它的名字-LLVM与传统虚拟机（low level virtual machine）名字相似。但“LLVM”这个名字本身不是一个缩略词，它就是这个项目的全称。所以，不要再把LLVM叫做low level virtual machine。

LLVM开始于伊利诺斯大学的一个研究项目。目的是提供一个现代的、基于SSA的、能够支持任意静态和动态编译的编程语言的编译策略。此后，LLVM成长为伞项目下的一个子项目。其中许多是被广泛用于各种各样的商业生产和开源代码项目以及学术研究中。LLVM项目源码采用“Apache 2.0许可协议”。

LLVM的子项目：

- **Clang -** 是LLVM架构下的编译器前端，支持编译的高级语言有C/C++/Objective-C等。诞生之初是为了替代GCC。
- **LLD -** 是LLVM架构下的链接器，是GNU链接器LD的直接替代。
- **LLDB -** 是Low Lever Debugger的简称，它是LLVM项目的调试器组件，用于替代GDB。
- **Clangd -** 是LLVM的C++语言服务器，通过 **LSP(Language Server Protocol)** 协议向编辑器提供服务。
- **BOLT -** 是"Binary Optimization and Layout Tool"（二进制优化和布局工具）的缩写，能够在配置文件后重新排列可执行文件，产生比编译器的 LTO 和 PGO 优化所能达到的更快性能。
- **MLIR -** 是LLVM原作者Chris Lattner在Google时候开始做的项目，现在已经合入LLVM仓库。MLIR即Multi-Level Intermediate Representation，多级的中间表示。MLIR目的是做一个通用、可复用的编译器框架，减少构建Domain Specific Compiler的开销。MLIR目前主要用于机器学习领域，但设计上是通用的编译器框架。
- **OpenMP -** 是一个OpenMP的运行时，OpenMP是一种用于共享内存并行系统的多线程程序设计方案，支持的编程语言包括C、C++和Fortran。

- **libc++(libcxx)/libc++abi(libcxxabi) -** 是LLVM提供的标准一致的和高性能的C++标准库实现，对标于GNU的libstdc++，但是clang也可以使用libstdc++。
- **libunwind -** 是HP libunwind项目定义的接口的实现。 它由Apple贡献，是一种使clang ++移植到没有系统展开器的平台的方法。 它旨在作为ABI的一种小型且快速的实施方案，而忽略一些HP中libunwind用得少的某些功能。所谓unwind库主要是用于获取程序的调用栈和异常处理和跳转需要。
- **libclc -** 是LLVM对OpenCL的c语言实现，OpenCL（Open Computing Language，开放计算语言）是一个为异构平台编写程序的框架，类似于CUDA。
- **libfuzzer -** 是一个`in-process`，`coverage-based`，`evolutionary`的模糊测试引擎，是LLVM项目的一部分。它与被测库链接，通过特定的入口点将模糊测试的输入提供给被测函数。在测试过程中不断变异输入，并统计代码覆盖率和崩溃情况。

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

## 添加软件源

```bash
sudo vim /etc/apt/sources.list
```

```bash
Focal (20.04) LTS - Last update : Fri, 16 Dec 2022 21:37:27 UTC / Revision: 20221216052830+e2b9cd796b33
deb http://apt.llvm.org/focal/ llvm-toolchain-focal main
deb-src http://apt.llvm.org/focal/ llvm-toolchain-focal main
# 14
deb http://apt.llvm.org/focal/ llvm-toolchain-focal-14 main
deb-src http://apt.llvm.org/focal/ llvm-toolchain-focal-14 main
# 15
deb http://apt.llvm.org/focal/ llvm-toolchain-focal-15 main
deb-src http://apt.llvm.org/focal/ llvm-toolchain-focal-15 main
```

然后更新apt缓存：

```bash
sudo apt update; sudo apt upgrade
```

## 查找APT软件包

```bash
apt search clang | grep ^clang-[0-9]
apt-cache search clang | grep ^clang-[0-9]
aptitude search clang
```

Ubuntu的官方源支持到最高 Clang 13，默认是Clang 10。

添加了LLVM的软件源之后，可以安装最新的Stable版本（2022年底最新版为15）。

## 安装

官方有教程：<https://apt.llvm.org/>

如果只需要 **编译链接调试套装** ，则安装clang（编译器，类似于GCC）、lld（链接器，类似于LD）、lldb（调试器，类似于GDB）：

```bash
# install 15
sudo apt install -y clang-15 lldb-15 lld-15
# install 13
sudo apt install -y clang-13 python3-lldb-13 lldb-13 lld-13
# or install default version 10
sudo apt install clang lldb lld
```

如果，不需要GCC的libstdc++，使用libc++，则需要自行安装：

```bash
sudo apt install libc++-15-dev libc++abi-15-dev
sudo apt install libc++-dev libc++abi-dev
```

另附上LLVM其他软件包的安装方法：

```bash
# LLVM
sudo apt install libllvm-15-ocaml-dev libllvm15 llvm-15 llvm-15-dev llvm-15-doc llvm-15-examples llvm-15-runtime
# Clang and co
sudo apt install clang-15 clang-tools-15 clang-15-doc libclang-common-15-dev libclang-15-dev libclang1-15 clang-format-15 python3-clang-15 clangd-15 clang-tidy-15
# libfuzzer
sudo apt install libfuzzer-15-dev
# lldb
sudo apt install lldb-15
# lld (linker)
sudo apt install lld-15
# libc++
sudo apt install libc++-15-dev libc++abi-15-dev
# OpenMP
sudo apt install libomp-15-dev
# libclc
sudo apt install libclc-15-dev
# libunwind
sudo apt install libunwind-15-dev
# mlir
sudo apt install libmlir-15-dev mlir-15-tools
# bolt
sudo apt install libbolt-15-dev bolt-15
```

另，官方提供了一个Shell脚本的方式进行自动安装，本质还是调用的apt-get：

```bash
sudo bash -c "$(wget -O - https://apt.llvm.org/llvm.sh)"
```

## 查看本地安装的Clang

```bash
dpkg -l | grep clang | awk '{print $2}'
```

我本地的版本有：

```bash
clang-15
clang-format-13
clangd
clangd-10
clangd-13
clangd-15
libclang-10-dev
libclang-6.0-dev
libclang-common-10-dev
libclang-common-13-dev
libclang-common-15-dev
libclang-common-6.0-dev
libclang-cpp10
libclang-cpp12
libclang-cpp13
libclang-cpp15
libclang-dev
libclang1-10
libclang1-15
libclang1-6.0
libclang1-9
```

## 多版本管理

Ubuntu下面有一个系统软链接管理神器：update-alternatives。

如果，我们需要在本地存在多个版本的编译器，那么，可以使用它来进行管理和切换。

### 擦除掉软链接

```bash
sudo update-alternatives --remove-all clang
sudo update-alternatives --remove-all clang++
sudo update-alternatives --remove-all lld
sudo update-alternatives --remove-all lldb
```

### 创建软链接信息

```bash
# clang
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-10 10
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-13 20
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-15 30

# clang++
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-10 10
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-13 20
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-15 30

# lld
sudo update-alternatives --install /usr/bin/lld lld /usr/bin/lld-15 30

# lldb
sudo update-alternatives --install /usr/bin/lldb lldb /usr/bin/lldb-15 30
```

### 切换版本

实际上就是在切换软链接的连接对象：

```bash
sudo update-alternatives --config clang
sudo update-alternatives --config clang++
```

执行以上的命令，将会看到以下信息：

切换clang：

```bash
There are 3 choices for the alternative clang (providing /usr/bin/clang).

  Selection    Path               Priority   Status
------------------------------------------------------------
* 0            /usr/bin/clang-15   30        auto mode
  1            /usr/bin/clang-10   10        manual mode
  2            /usr/bin/clang-13   20        manual mode
  3            /usr/bin/clang-15   30        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

切换clang++：

```bash
There are 3 choices for the alternative clang++ (providing /usr/bin/clang++).

  Selection    Path                 Priority   Status
------------------------------------------------------------
* 0            /usr/bin/clang++-15   30        auto mode
  1            /usr/bin/clang++-10   10        manual mode
  2            /usr/bin/clang++-13   20        manual mode
  3            /usr/bin/clang++-15   30        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
```

我选择了Clang 15。

## 查看clang版本号

```bash
clang --version
clang++ --version
```

查看的结果：

```bash
Ubuntu clang version 15.0.6
Target: x86_64-pc-linux-gnu
Thread model: posix
InstalledDir: /usr/bin
```

## 参考资料

- [LLVM Releases](https://releases.llvm.org/)
- [Install LLVM on Ubuntu 22.04](https://linuxhint.com/install-llvm-ubuntu/)
