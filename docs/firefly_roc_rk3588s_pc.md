# Firefly ROC-RK3588S-PC

默认安装的是Android系统，我们不需要，我们需要一个Ubuntu Desktop。

## 安装工具

- 安装RK USB驱动 DriverAssistant
- 安装运行 RKDevTool
- 下载固件：Ubuntu、Debian、Buildroot……

## 开发板进入到Loader模式

1. 先断开电源；
2. USB线一端插入到OTG口，另外一端插入到电脑；
3. 按住`RECOVERY 键`（需要注意，为了防止误触，它的按钮被隐藏在侧面，手指头探下，将黑色的按钮往白色的按钮基座抠）；
4. 接通电源；
5. `RECOVERY 键`持续摁住大约2秒。

![OTG口说明](https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_otg_interface.jpg)

![RECOVER按钮说明](https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_recovery_reset.jpg)

## RKDevTool安装Ubuntu固件

如果成功启动了`LOADER模式`，则软件界面最下方会显示：`Found One LOADER Device`或者`发现一个LOADER设备`。

![LOADER模式](https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_firmware_androidtool_zh.png)


固件是一个`img`后缀的文件，比如：`ROC-RK3588S-PC_Ubuntu22.04-Xfce-r31153_v1.4.0g_250114.img`。它是一个`统一固件`，所谓的统一固件，就是由由分区表、bootloader、uboot、kernel、system等所有文件打包合并成的单个文件。

升级Ubuntu固件的步骤如下：

1. 点击切换至 `Upgrade Firmware` / `升级固件` 页。
2. 点击 `Firmware` / `固件` 按钮，打开要升级的固件文件。升级工具会显示详细的固件信息。
3. 点击 `Upgrade` / `升级` 按钮，开始安装Ubuntu固件。

![安装Ubuntu固件](https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_firmware_download_fail.png)

安装完之后，只要连接上网络就可以直接登录操作系统了。它带有WiFi，但是显然无线网络肯定是需要配置的，所以，我们一开始可以用一条网线连接到路由器上。

系统预设了账号名：

- **Ubuntu Desktop 系统**：默认的账号名密码为：`firefly`和`firefly`；
- **Ubuntu Minimal 系统**：：默认的账号名密码为：`root`和`firefly`。

## Docker

安装Docker：

```bash
sudo apt install docker.io
```

设置为开机启动：

```bash
sudo systemctl enable docker
```

## VNC

```bash
# 更新软件源
sudo apt update

# 安装TightVNC服务器
sudo apt install tightvncserver

# 安装Xfce桌面环境（若未安装）
sudo apt install xfce4 xfce4-goodies
```

## XRDP

安装

```bash
sudo apt install xrdp
```

启动服务

```bash
sudo systemctl start xrdp
```

开机自启动

```bash
sudo systemctl enable xrdp
```

## Vino

安装

```bash
sudo apt install vino
```

```bash
gsettings set org.gnome.Vino require-encryption false
```

sudo systemctl enable vino
sudo systemctl start vino

## 连接WiFi

查看WiFi列表

```bash
nmcli device wifi list
```

连接WiFi（必须要管理员权限）

```bash
sudo nmcli device wifi connect "SSID" password "密码"
```

## 参考资料

- [ROC-RK3588S-PC 使用USB线缆升级固件](https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/upgrade_firmware.html#shao-xie-gu-jian)
- [ROC-RK3588S-PC 产品规格](https://www.t-firefly.com/product/industry/rocrk3588spc#spec)
- [ROC-RK3588S-PC SDK工具等下载](https://www.t-firefly.com/doc/download/164.html)
