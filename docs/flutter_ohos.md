# 搭建Flutter的鸿蒙开发环境

## 安装鸿蒙开发环境

首先，需要下载安装两个东西：`DevEco Studio`和`command-line-tools`，在这个[网址](https://developer.huawei.com/consumer/cn/download/)去下载。

`DevEco Studio`是Jetbrains定制的IDE，使用起来和Android Studio也差不太多。

安装好之后，然后通过内置的SDK管理器去下载SDK，进入SDK管理器的路径是：`File -> Settings -> OpenHarony SDK`。找一个合适的版本下载。默认本地安装路径：`C:\Users\{用户名}\AppData\Local\OpenHarmony\Sdk`。

`command-line-tools`是一个压缩包，如何安装请查看[文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/ide-commandline-get)，为了方便管理，我们就直接解压缩到：`C:\Users\{用户名}\AppData\Local\OpenHarmony\command-line-tools`。

## 安装Flutter

### 安装fvm

```bash
scoop install extras/fvm
```

### 下载鸿蒙版Flutter

fvm的Flutter下载在fvm安装目录下面的`versions`目录下`%USERPROFILE%/scoop/persist/fvm/versions`。

在`versions`目录下执行命令：

```bash
git clone -b 3.22.1-ohos-0.1.2 https://gitcode.com/openharmony-sig/flutter_flutter 3.22.1-ohos-0.1.2
```

然后

```bash
fvm use 3.22.1-ohos-0.1.2
```

再执行：

```bash
fvm flutter doctor
```

如果报错：

```text
    ✗ Ohpm is missing, please configure "ohpm" to the environment variable PATH.
    ✗ Hvigorw is missing, please configure "hvigorw" to the environment variable PATH.
```

那是因为没有把`command-line-tools`的路径加入到`Path`环境变量中去，加好即可。

如果报错：

```text
[✗] HarmonyOS toolchain - develop for HarmonyOS devices
    ✗ HarmonyOS Sdk not found;
      please do that, first: download from https://developer.harmonyos.com/cn/develop/deveco-studio#download_cli ;
      second: follow this document: https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/ide-command-line-ohsdkmgr-0000001545647965-V3 to install OpenHarmony sdk with ohsdkmgr;
      If the Ohos SDK has been installed to a custom location, please use
      `flutter config --ohos-sdk` to update to that location.
```

这是因为没有配置SDK的环境变量：`OHOS_SDK_HOME`、`HOS_SDK_HOME`和`HDC_HOME`：

- `OHOS_SDK_HOME` -> `C:\Users\{用户名}\AppData\Local\OpenHarmony\Sdk`
- `HOS_SDK_HOME` -> `C:\Users\{用户名}\AppData\Local\OpenHarmony\Sdk`
- `HDC_HOME` -> `C:\Users\{用户名}\AppData\Local\OpenHarmony\Sdk\15\toolchains` (hdc.exe所在目录)

如果需要全局的使用flutter，那么需要调用命令：`fvm global`。但是不知道为啥，直接用不了，得自己设置环境变量，把路径添加到`Path`：`C:\Users\{用户名}\scoop\apps\fvm\current\default\bin`。

## 参考资料

- [flutter_engine编译后运行./ohos时，报错提示Please set the environment variables for HarmonyOS SDK to "HOS_SDK_HOME" or "OHOS_SDK_HOM](https://developer.huawei.com/consumer/cn/forum/topic/0208152025973938446)
- [已有Flutter项目如何支持鸿蒙系统](https://juejin.cn/post/7405153695539396617)
- [鸿蒙版Flutter官方代码库](https://gitcode.com/openharmony-sig/flutter_flutter)
- [DevEco 创建项目时的错误解决](https://xie.infoq.cn/article/1f64071cc12f7247b8d476032)
