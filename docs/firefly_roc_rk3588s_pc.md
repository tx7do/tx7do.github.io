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

## GNOME

```bash
sudo apt install ubuntu-gnome-desktop
```

安装的时候选择显示管理器，选择`gdm3`。

查看配置文件`/etc/pam.d/gdm-password`：

如果以下配置是注释的，那么桌面系统是禁止使用root账号登录的，如果希望能够使用root账号登录，则请取消注释：

```ini
#auth   required        pam_succeed_if.so user != root quiet_success
```

现在就可以启用Wayland了：

1. **注销当前用户**（回到登录界面）
2. 在登录界面，点击用户名旁边的 齿轮图标（设置按钮）或者屏幕右上角的一个圆形图标按钮。
3. 在弹出的菜单中选择 **"Ubuntu on Wayland"** 选项
4. 输入密码登录，系统会以 Wayland 模式启动

如果无法正常启动Wayland，使用下面的命令恢复到xfce：

```bash
sudo dpkg-reconfigure lightdm
```

## Docker

如果需要进入容器：

```bash
docker exec -it <容器名或ID> sh
```

检查容器是否有网络相关的限制

```bash
docker inspect -f '{{.HostConfig.CapAdd}} {{.HostConfig.NetworkMode}}' <容器名或ID>
```

若是网络不通，有可能是网关缺失，

手动添加临时路由：（需替换为宿主机网关，通常是172.17.0.1）

```bash
docker exec -it <容器名或ID> sh

ip route add default via 172.17.0.1 dev eth0
```

永久性添加路由：

```bash
docker exec -it <容器名或ID> sh

# 编写路由配置脚本
cat > /system/etc/init/route-config.rc << 'EOF'
# 等待 Android 系统完全启动（sys.boot_completed=1 表示启动完成）
on property:sys.boot_completed=1
  # 切换到 root 用户执行命令（确保权限）
  exec - root root -- /system/bin/sh -c "
    # 检查默认路由是否已存在，不存在则添加
    if ! ip route show | grep -q 'default via 172.17.0.1 dev eth0'; then
      ip route add default via 172.17.0.1 dev eth0
    fi

    # （可选）添加其他自定义路由
    # if ! ip route show | grep -q '192.168.1.0/24 via 172.17.0.1 dev eth0'; then
    #   ip route add 192.168.1.0/24 via 172.17.0.1 dev eth0
    # fi
  "
EOF


# 赋予执行权限
chmod +x /etc/profile.d/auto-route.sh
```

## 参考资料

- [ROC-RK3588S-PC 使用USB线缆升级固件](https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/upgrade_firmware.html#shao-xie-gu-jian)
- [ROC-RK3588S-PC 产品规格](https://www.t-firefly.com/product/industry/rocrk3588spc#spec)
- [ROC-RK3588S-PC SDK工具等下载](https://www.t-firefly.com/doc/download/164.html)
