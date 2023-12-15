# 怎样在MacOS下安装游戏引擎Godot 4

在本文中，我将向您展示如何在 Mac 上安装Godot 4 游戏引擎。

在MacOS下面有两种安装途径可供使用：

1. Godot官网下载软件包安装；
2. brew安装。

## 1. Godot官网下载软件包安装

### 步骤 1. 安装 .Net SDK（可选）

Godot从4.0版本开始支持C#作为其脚本语言。

如果您希望能够使用 C# 编写和构建 Godot 项目，则需要先安装 .Net SDK。

从微软官方下载页面下载并安装：<https://dotnet.microsoft.com/zh-cn/download>

### 步骤 2. 下载 Godot 4

要下载 Godot 4，请执行以下操作：

- 浏览至：<https://godotengine.org/download/macos/>
- 如果您想使用 **C#**，请选择下载：**Godot Engine - .NET**

在撰写本文时，该版本适用于两种类型的 Mac（Intel 和 Apple Silicon）。所以你不必为此做选择。

### 步骤3. 安装Godot 4

要安装 Godot 4，请执行以下操作：

- 在 **Finder** 中浏览“下载”文件夹，并找到刚刚下载的zip文件；
- 在 **Finder** 中双击文件将其解压缩；
- 从 **Finder的侧边栏** 中将 **.app** 拖至 **Applications** 文件夹中

稍后您可以进入“下载”文件夹并删除 zip 文件进行清理。

### 步骤 4. 配置命令行访问Godot

在此步骤中，我将向您展示如何进行设置，能够让 Godot 可以在 Mac 命令行下运行。

首先，您需要确定从命令行运行 Godot 的正确路径。

如果是非.Net版本，那么它可能是：

```bash
/Applications/Godot.app/
```

或者是.Net版本：

```bash
/Applications/Godot_mono.app/
```

我是安装的.Net版本，所以，下面我也以.Net版本作为讲解。

如果您正在使用zsh作为命令行，那么请在zsh下运行下面的命令，用于将Godot的应用命名出一个叫做`godot`的别名：

```bash
echo 'alias godot="/Applications/Godot_mono.app/Contents/MacOS/Godot"' >> ~/.zprofile
```

再运行以下命令使之生效：

```bash
source ~/.zprofile
```

我们再通过运行以下命令来验证别名是否正常工作：

```bash
which godot
```

没有意外的话，该命令将会返回以下信息：

```bash
godot: aliased to /Applications/Godot_mono.app/Contents/MacOS/Godot
```

现在，您可以尝试以下命令：

```bash
godot --version
```

或者：

```bash
godot --help
```

### 步骤 5. 从命令行启动Godot

假设我们有一个Godot的工程项目`godot-demo`，我们先从命令行进入到该项目的文件夹下：

```bash
cd ~/projects/godot/godot-demo
```

现在，我们要仅进行项目的构建，而不启动编辑器的界面，那么请运行以下命令：

```bash
godot
```

若是要在编辑器中打开项目，则请运行以下命令：

```bash
godot -e
```

## 2. brew安装

### 安装.Net SDK

在brew中有两个.Net的软件包：

- `dotnet` 这个是.Net的运行时
- `dotnet-sdk` 这个是.Net的SDK，我们安装这个就可以了，其实，它本身也包含有运行时。

```bash
brew install dotnet-sdk --cask
```

### 安装Godot

如果要安装非.Net的版本：

```bash
brew install godot --cask
```

如果要安装带.Net的版本：

```bash
brew install godot-mono --cask
```

## 参考资料

- [Download Godot 4 for macOS](https://godotengine.org/download/macos/)
- [How to Install Godot 4 on a Mac](https://scriptable.com/how-to-install-godot-4-on-a-mac/)
- [Godot 引擎官网](https://godotengine.org)
- [Godot 4.0 sets sail: All aboard for new horizons](https://godotengine.org/article/godot-4-0-sets-sail)
- [godot-demo-projects - github](https://github.com/godotengine/godot-demo-projects)
- [Godot Command line tutorial](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html)
- [Your first 2D game](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html)
- [Godot C#/.NET](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html)
- [Godot Scripting languages](https://docs.godotengine.org/en/stable/getting_started/step_by_step/scripting_languages.html)
