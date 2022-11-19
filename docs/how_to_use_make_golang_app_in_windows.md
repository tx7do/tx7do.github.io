# 怎么样在Windows下使用Make编译Golang程序

GNU的Make是一个又古老又强大的构建工具，就Makefile的语法而言也不算复杂，没有特别复杂的需求的话，拿来做程序构建是一个好主意。更复杂一点的构建就可以选择Google的Bazel，但是通常的工程都没有这么复杂的需求。

在Unix、Linux、BSD、macOS使用Make是很方便的，很自然的。可是，在Windows下面却存在着兼容性的问题，在其他操作系统可以顺利执行的Makefile，在Windows却跑不了。这体验很糟糕。虽然微软在努力解决不兼容的问题，比如最新的PowerShell，但是操作系统毕竟还是存在着巨大的差异，要完全解决几乎是不可能完成的任务。所以，在Makefile多少是需要做一些适配。

## 安装Make

常规的做法，大家都是使用安装MinGW包的方法来安装Make，但是这很繁琐，我并不推荐，我推荐使用[Choco](https://chocolatey.org/)和[Scoop](https://scoop.sh/)来安装管理Make。

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

然后，还需要把`mingw32-make.exe`文件改名成`make.exe`。

此方法比较繁琐，不如使用软件包管理器去直接安装make还方便多了。

另，通过软件包管理也能够安装mingw：

```powershell
choco install mingw
scoop install mingw
```

## Windows和Linux之间使用Make的区别

在Windows下使用Make和在Linux下面使用Make是有区别的，而这个差异性倒不是来自于Make，而是来自于依赖的命令。

Bash里面很多的命令，在CMD下都没有，PowerShell倒是增加了一些，像：`man`、`ls`、`rm`、`pwd`这些常用的倒是都已经有了，但是差异还是有，兼容性永远是个大问题。

常用的Linux工具倒是有，像`grep`、`awk`、`sed`……都可以通过上面的软件管理器choco、scoop安装到。但是，像`uname`这些平台严重相关的命令是肯定没有办法的。

简单举一些例子：

1. 文件路径分隔符，Windows是`\`，而Linux是`/`;
2. Linux的`mkdir`是有`-p`选项的，而Windows没有。
3. `echo`的行为也跟Linux的不同。

现在PowerShell倒是在提高与Bash的兼容性，但是毕竟系统差异性太大，兼容性是肯定存在的，那么，怎么办呢？我们可以在Makefile里面判断操作系统的版本，来做差异化处理。

简单的探测系统版本：

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

上面这段代码里面使用`ifeq ($(OS),Windows_NT)`来判断操作系统，得到一个`IS_WINDOWS`的变量。

然后，定义了一个`BUILD_CMD`的函数，它调用了内置的`if`函数，它的语法是：

```makefile
$(if <condition>,<then-part>,<else-part>)
```

第一个分支是走的Windows的编译，第二个分支是走的其他操作系统的编译。

需要注意的是：路径分隔符，参数设置前面需要加`SET`，语句之间需要用`&`间隔。

## 参考资料

- [跟我一起写Makefile](https://seisman.github.io/how-to-write-makefile/functions.html#if)
- [Choco](https://chocolatey.org/)
- [Scoop](https://scoop.sh/)
- [mingw](https://www.mingw-w64.org/downloads/)
