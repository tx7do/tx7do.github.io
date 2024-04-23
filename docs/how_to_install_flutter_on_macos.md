# 如何在MacOS下安装Flutter开发环境

通过Google推出的Flutter framework，我们可以更为方便的开发跨平台APP，开发出来的APP能够在iOS、Android、Web、macOS、Windows和Linux上都可以执行。

在开发 Flutter App 之前，我们必须要先准备好开发环境，下面我将介绍如何在Mac环境下从零开始Flutter App的开发环境。

- 安装Xcode；
- 安装Android Studio；
- 安装VS Code；
- 安装CocoaPods；

## 安装Xcode

Xcode的安装比较简单，在`Apple Store`当中搜索`Xcode`即可。

第一次执行Xcode需要进行一些配置，我们可以在命令行当中输入如下几条命令：

```bash
sudo sh -c 'xcode-select -s /Applications/Xcode.app/Contents/Developer && xcodebuild -runFirstLaunch'
sudo xcodebuild -license
```

## 安装Android Studio

安装有以下几种途径可以安装：

1. 官网下载: <https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio>;
2. 通过`Jetbrains`的`Jetbrains Toolbox`来进行安装。
3. `brew install --cask android-studio`

## 安装VS Code

1. `brew install --cask visual-studio-code`
2. 官网下载：<https://code.visualstudio.com/download>

## 安装Flutter SDK

```bash
brew install --cask flutter
```

它的路径在：

```bash
/opt/homebrew/Caskroom/flutter/{版本号}/flutter
```

安装好之后，需要执行一次flutter：

```bash
flutter
```

它会自动初始化下载安装Dart SDK和一些构建工具等，这些文件都在Flutter SDK下的`bin/cache`路径下。

现在，我们查看Flutter的版本号：

```bash
flutter --version
```

它将会输出大概下面这样的信息：

```bash
Flutter 3.19.6 • channel stable • https://github.com/flutter/flutter.git
Framework • revision 54e66469a9 (6 days ago) • 2024-04-17 13:08:03 -0700
Engine • revision c4cd48e186
Tools • Dart 3.3.4 • DevTools 2.31.1
```

这就代表着Flutter SDK安装成功了。

我使用的主力IDE是Android Studio，当Flutter SDK安装好之后，我们需要在：

> Android Studio -> Preference -> Languages & Frameworks -> Flutter

填入Flutter SDK安装的路径即可初始化Flutter的IDE环境。

## 安装CocoaPods

```bash
brew install cocoapods
```

## 测试开发环境

Flutter的CLI提供了一个参数用于测试开发环境的完整度：

```bash
flutter docker
```

### 出现Xcode installation is incomplete错误

执行以下两条命令既可以解决问题：

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

### A network error occurred

国内需要`$HOME/.bash_profile`或者`$HOME/.zshrc`里面添加：

```bash
export PUB_HOSTED_URL=https://pub.flutter-io.cn # 国内用户需要设置
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn # 国内用户需要设置
```

## 参考资料

- [Start building Flutter iOS apps on macOS](https://docs.flutter.dev/get-started/install/macos/mobile-ios)
- [在 Mac 上準備 Flutter App 的開發環境](https://medium.com/%E5%BD%BC%E5%BE%97%E6%BD%98%E7%9A%84-flutter-app-%E9%96%8B%E7%99%BC%E5%95%8F%E9%A1%8C%E8%A7%A3%E7%AD%94%E9%9B%86/%E5%9C%A8-mac-%E4%B8%8A%E6%BA%96%E5%82%99-flutter-app-%E7%9A%84%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%83-3ccebbd3a0bd)
