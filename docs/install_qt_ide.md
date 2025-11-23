# 安装QT开发环境

Qt（发音同 “cute”）是一套跨平台的 C++ 应用程序开发框架，由挪威公司 Trolltech（后被诺基亚、Digia 收购，现为 The Qt Company）开发，核心目标是让开发者用 “一次编写，到处运行”（Write Once, Run Everywhere）的方式，高效开发出在不同平台上（Windows、Linux、macOS、Android、iOS、嵌入式系统等）具有一致功能和体验的应用程序。

官方下载网址：<http://download.qt.io/>

在线下载器：<https://www.qt.io/download-qt-installer>
离线下载器：<https://www.qt.io/offline-installers>

Qt 主要分为两大版本：

- Open Source（开源版）
- Enterprise（商业企业版）

|  对比维度	 | Open Source（开源版）  |Enterprise（商业企业版）|
|---|---|---|
|授权协议	|基于 GPLv3 / LGPLv3 开源协议（免费）：<br>- GPLv3：基于 Qt 开发的软件需开源（闭源商用违法）；<br>- LGPLv3：仅 Qt 库本身开源，你的应用可闭源，但需动态链接 Qt 库	|商业许可（付费订阅）：<br>- 无开源强制要求，你的应用可闭源商用；<br>- 支持静态链接、自定义修改 Qt 源码|
|核心功能|包含所有基础开发模块：<br>Qt Widgets、Qt Quick、QML、RHI、网络、数据库、多媒体、音视频等（满足 90% 桌面 / 移动开发需求）	|包含开源版全部功能 + 商业专属模块：<br>1. 安全相关：Qt Safe Renderer（车载 / 医疗安全场景）；<br>2. 编译优化：Qt Quick Compiler Premium（QML 预编译加速）；<br>3. 工具链：Qt Design Studio 完整版（UI/UX 设计工具）；<br>4. 嵌入式：Qt for MCUs（微控制器支持）、Qt Automotive Suite（车载套件）|
|技术支持|仅社区支持（Qt 论坛、Stack Overflow、GitHub Issues），无官方技术人员响应	|官方技术支持（SLA 服务等级协议）：<br>- 7x24 小时故障排查；<br>- 定制化解决方案；<br>- 版本升级指导；<br>- 漏洞紧急修复（CVE 响应）|
|价格|完全免费（开源协议授权）	|按订阅收费（企业级：每年数万元 / 套起，根据团队规模、模块多少定价）|
|适用场景|1. 个人开发、开源项目；<br>2. 初创公司 / 小型团队，且应用愿意开源（GPLv3）或动态链接 Qt（LGPLv3）；<br>3. 非商业用途（学习、内部工具）	|1. 企业级商用产品（闭源盈利）；<br>2. 高安全性 / 高可靠性场景（车载、医疗、工业控制）；<br>3. 需要官方技术支持、定制化功能的团队|
|获取方式|1. 开源安装器（官网免费下载）；<br>2. 源码包（如 qt-everywhere-src-6.10.1.zip，可自定义编译）	|1. 商业版安装器（需购买订阅后获取）；<br>2. 专属镜像、定制化源码包（根据企业需求提供）|

## 安装

|  对比维度		 | 在线安装器（qt-online-installer-xxxx-xxx.exe） | 离线安装器（qt-opensource-xxxx-xxx.exe） | 源码包（qt-everywhere-src）  |
|---|---|---|---|
|核心特点|按需下载组件，支持更新	|完整包离线部署，无需网络	|自定义编译，灵活裁剪|
|下载体积|小（安装器几十 MB，组件按需下载）|大（8-15GB，完整包）	|中（3-5GB，仅源码）|
|操作复杂度|极低（一键勾选安装）|低（运行安装器勾选组件）|极高（需配置依赖、编译、排错）|
|占用空间	|小（仅装需要的组件）|大（完整模块，含无用组件）	|灵活（按需编译，可最小化）|
|网络依赖	|必需（下载组件）	|无需（已打包所有组件）	|无需（源码包本地编译）|
|灵活性	|中（仅组件选择，无法定制编译）	|低（组件固定，无法定制）	|极高（可裁剪模块、交叉编译、改源码）|
|适用场景	|普通桌面开发、个人 / 小型团队、有网络	|无网络环境、批量部署、网络不稳定	|嵌入式开发、定制化功能、调试 Qt 源码|
|开源版获取难度	|极易（官网直接下载，可跳过登录）	|易（官网 / 镜像站下载，需登录开源账号）	|易（官网 / 镜像站直接下载）|

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

### 1. 在线安装器（Qt 官方主推，推荐普通用户）

获取方式：

- 官网直接下载：<https://www.qt.io/download-qt-installer-oss>（开源版）、商业版需登录付费账号后获取；
- 无需提前注册，开源版可跳过登录直接安装。

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

如果是专业版，不可以加镜像，会报错：`mirror can only be selected for opensource account`。

现在，在线下载器只默认给Qt6的下载源，如果需要获取到旧版本，还需要选择`自定义`，然后在`显示`下拉框里面选中`Archive`。

### 2. 离线安装器（完整包离线部署，适合无网络环境）

获取方式：

- 官网离线包页面：<https://www.qt.io/offline-installers>（开源版需登录 Qt 账号下载，商业版需付费订阅）；
- 镜像站（推荐，速度快）：清华大学镜像站 <https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/qt/>。

### 3. 源码包（自定义编译，适合特殊需求）

获取方式：

- 官网源码下载：<https://download.qt.io/official_releases/qt/>（开源版）；
- 镜像站：清华大学镜像站 <https://mirrors.tuna.tsinghua.edu.cn/qt/archive/qt/>。

## 参考资料

- [Qt5.15.2安装（详细教程）](https://zhuanlan.zhihu.com/p/697911596)
- [Qt在线安装（使用阿里云源）](https://zhuanlan.zhihu.com/p/597324171)
- [国内开源镜像站地址汇总](https://zhuanlan.zhihu.com/p/618099981)
