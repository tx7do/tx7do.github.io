# 安装QT开发环境

Qt（发音同 “cute”）是一套跨平台的 C++ 应用程序开发框架，由挪威公司 Trolltech（后被诺基亚、Digia 收购，现为 The Qt Company）开发，核心目标是让开发者用 “一次编写，到处运行”（Write Once, Run Everywhere）的方式，高效开发出在不同平台上（Windows、Linux、macOS、Android、iOS、嵌入式系统等）具有一致功能和体验的应用程序。

官方下载网址：<http://download.qt.io/>

## 使用国内代理在线安装

下载最新版的在线安装器：

- Windows 64 <https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/online_installers/qt-online-installer-windows-x64-online.exe>
- Windows Arm <https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/online_installers/qt-online-installer-windows-arm64-online.exe>
- MacOS <https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/online_installers/qt-online-installer-mac-x64-online.dmg>
- Linux 64 <https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/online_installers/qt-online-installer-linux-x64-online.run>
- Linux Arm <https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/online_installers/qt-online-installer-linux-arm64-online.run>


使用代理网址启动在线安装器，直接安装速度很感人，我用了整整一晚上……：

```bash
.\qt-online-installer-windows-x64-online.exe --mirror https://mirrors.ustc.edu.cn/qtproject
```

现在已经不可以加镜像用了，会报错：`mirror can only be selected for opensource account`。

现在，在线下载器只默认给Qt6的下载源，如果需要获取到旧版本，还需要选择`自定义`，然后在`显示`下拉框里面选中`Archive`。

可用的国内软件源

|  名称 | 链接  |
|---|---|
| 中国科学技术大学  | https://mirrors.ustc.edu.cn/qtproject  |
|  清华大学 | https://mirrors.tuna.tsinghua.edu.cn/qt/  |
|  ~~北京理工大学~~ | ~~http://mirror.bit.edu.cn/qtproject/~~  |
|  上海交通大学 | https://mirrors.sjtug.sjtu.edu.cn/qt/  |
|  南京大学 | https://mirrors.nju.edu.cn/qt/  |
|  ~~中国互联网络信息中心~~ | ~~https://mirrors.cnnic.cn/qt/~~  |
|  阿里云 | https://mirrors.aliyun.com/qt/  |
|  ~~网易~~ | ~~https://mirrors.163.com/qtproject/~~  |
|  ~~华为云~~ | https://mirrors.huaweicloud.com/qt/  |
|  腾讯云 | https://mirrors.cloud.tencent.com/qt/  |

Qt6.8.0之前，Visual Studio都还最高只支持到vs2019，Qt6.8.0才开始支持vs2022。

## 参考资料

- [Qt5.15.2安装（详细教程）](https://zhuanlan.zhihu.com/p/697911596)
- [Qt在线安装（使用阿里云源）](https://zhuanlan.zhihu.com/p/597324171)
- [国内开源镜像站地址汇总](https://zhuanlan.zhihu.com/p/618099981)
