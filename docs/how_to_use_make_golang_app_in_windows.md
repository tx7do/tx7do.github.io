# 怎么样在Windows下使用Make编译Golang程序

GNU的Make是一个又古老又强大的构建工具，在我们的开发当中用得普遍。就Makefile的语法而言也不算复杂，没有特别复杂的需求的话，很容易就上手了，维护起来也容易，拿Make来做程序构建是一个好主意。

更复杂一点的项目构建可以选择Google的[Bazel](https://bazel.build/)，但是通常的项目(至少70%-80%的项目)都没有这么复杂的需求。

在Unix、Linux、BSD、macOS等xNix下面使用Make是很方便的，很自然的，因为是出厂自带。

可是，在Windows下面却不是这么一回事儿。Windows毕竟和xNix不是一路人。首先不预装，安装就存在着巨大的阻碍——太费劲了——网上一搜，大部分人都告诉你，你得先装一个MinGW，然后又要搞环境变量，然后才能用。

其次，还存在着兼容性的问题，在其他操作系统可以顺利执行的Makefile，在Windows却跑不了。这体验很糟糕。虽然微软在努力解决不兼容的问题，比如最新的PowerShell，比如提供了Linux的子系统WSL，但是操作系统毕竟还是存在着巨大的差异，要完全解决几乎是不可能完成的任务。所以，在Makefile多少也需要做一些适配。

另外，还需要知道的是，Make要用起来，也不是说，就是一个Make而已，xNix下面有一个很大的软软包做支撑，Make才会那么的好用，grep awk sed touch……这些，在Windows下也都是需要自行去安装的。

## 安装Make

常规的做法，大家都是使用安装MinGW包的方法来安装Make，但是这很繁琐，我并不推荐，我推荐使用[Choco](https://chocolatey.org/)或者[Scoop](https://scoop.sh/)这两个软件包管理器的其中一个来安装管理和Make。

### Choco

PowerShell安装Choco：

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

**管理员权限**启动PowerShell，然后运行以下命令进行安装：

```powershell
choco install make
```

安装其他有用的工具：

```powershell
choco install grep awk sed touch
```

### scoop

安装Scoop：

```shell
irm get.scoop.sh | iex
```

```powershell
scoop install make
```

安装其他有用的工具：

```powershell
scoop install grep gawk sed touch
```

### MinGW

下载安装MinGW：<https://www.mingw-w64.org/downloads/>

下载好之后，解压，把bin文件夹加入到Windows的环境变量里面，使之可以全局运行。

然后，把`mingw32-make.exe`文件改名或者拷贝一个备份为`make.exe`。

此方法比较繁琐，不如使用软件包管理器去直接安装make还方便多了。

另，通过软件包管理也能够安装mingw：

```powershell
choco install mingw
```

或者

```powershell
scoop install mingw
```

## Windows和Linux之间使用Make的区别

在Windows下使用Make和在Linux下面使用Make是有区别的，而这个差异性倒不是来自于Make，而是来自于依赖的命令。

`Bash`里面很多的命令，在古老的`CMD`下都没有，`PowerShell`倒是增加了一些，像：`man`、`ls`、`rm`、`pwd`这些在xNix下常用的命令，有是有了，但是差异还是有，兼容性永远是个大问题，文件系统就是一个巨大的鸿沟。

日常开发中常用的Linux工具，像`grep`、`awk`、`sed`……这些，都可以通过上面踢到的两个软件管理器`choco`、`scoop`安装到。但是，像`uname`这些操作系统严重相关的命令是肯定没有办法的。

关于兼容性，我简单的举一些例子：

1. 文件路径分隔符，Windows是`\`，而Linux是`/`;
2. Windows的根目录是`C:\\`、`D:\\`……，而xNix是`/`；
3. Linux的`mkdir`是有`-p`选项的，而Windows没有。
4. `echo`的行为也跟Linux的不同。

现在PowerShell倒是在提高与Bash的兼容性，可毕竟系统差异性太大，所以兼容性是肯定存在的。

那么，怎么办呢？我们可以在Makefile里面判断操作系统的类型，然后根据操作系统来做差异化处理。

简单的探测系统类型的Makefile：

```makefile
detected_OS :=
ifeq ($(OS),Windows_NT) 
    detected_OS := Windows
else
    detected_OS := $(shell sh -c 'uname 2>/dev/null || echo Unknown')
endif

all:
	@echo $(detected_OS)
```

## 使用Makefile编译Golang程序

下面以一个简单的编译Golang程序的Makefile来讲解如何跨平台使用Makefile进行交叉编译：

```makefile
GOPATH=$(shell go env GOPATH)
GOARCH?=$(shell go env GOARCH)

ifeq ($(OS),Windows_NT)
    IS_WINDOWS := 1
endif

BUILD_CMD = $(if $(IS_WINDOWS), \
	SET CGO_ENABLED=0&SET GOOS=$(1)&SET GOARCH=$(2)&go build -o .\bin\$(1)_$(2)\$(3), \
	CGO_ENABLED=0 GOOS=$(1) GOARCH=$(2) go build -o ./bin/$(1)_$(2)/$(3))

linux:
	$(call BUILD_CMD,linux,$(GOARCH),test)

windows:
	echo $(IS_WINDOWS)
	$(call BUILD_CMD,windows,$(GOARCH),test.exe)

mac:
	$(call BUILD_CMD,darwin,$(GOARCH),test)
```

在上面这段代码里，我们使用`ifeq ($(OS),Windows_NT)`来判断操作系统，得到一个`IS_WINDOWS`的变量。

然后，定义了一个`BUILD_CMD`的函数，它调用了内置的`if`函数，它的语法是：

```makefile
$(if <condition>,<then-part>,<else-part>)
```

第一个分支是走的Windows的编译，第二个分支是走的其他操作系统（xNix）的编译。

需要注意的是：路径分隔符，参数设置前面需要加`SET`，语句之间需要用`&`间隔。

## 参考资料

- [跟我一起写Makefile](https://seisman.github.io/how-to-write-makefile/functions.html#if)
- [Choco](https://chocolatey.org/)
- [Scoop](https://scoop.sh/)
- [mingw](https://www.mingw-w64.org/downloads/)
