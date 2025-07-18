# 云手机

- Waydroid只能单开一个Android实例，所以要批量部署，可能需要部署多个宿主Ubuntu；
- Redroid基于Docker部署，一个宿主可以部署多个。

## 虚拟手机开源方案

- [ReDroid (Remote anDroid)](https://github.com/remote-android/redroid-doc) Docker + AnBox
- [Waydroid](https://waydro.id/) LXC + AnBox
- [Android-x86](https://www.android-x86.org/)
- [BlissOS](https://blissos.org/index.html#download)

## 云真机开源解决方案

- [OpenSTF](https://github.com/DeviceFarmer/stf)
- [ATXServer2](https://github.com/openatx)
- [Sonic](https://sonic-cloud.cn)

## 打开Linux内核的Binder 和 Ashmem

### 为什么需要 Binder 和 Ashmem？

#### 1. Binder（binder_linux）

- Android 系统的进程间通信（IPC）机制，用于应用与系统服务（如 SurfaceFlinger）通信。
- Android容器 通过 Binder 实现 Linux 与 Android 容器的交互。

#### 2. Ashmem（ashmem_linux）

- Android 的共享内存机制，用于高效传输图形数据（如图像、视频）。
- 没有 Ashmem 支持，图形渲染会失败。

### 如何确认内核是否支持？

输入以下命令检查内核配置是否：

```bash
zcat /proc/config.gz | grep -E "CONFIG_ANDROID_BINDER_IPC|CONFIG_ANDROID_BINDERFS|CONFIG_ANDROID_ASHMEM"
```

理想输出应为：

```bash
CONFIG_ANDROID_BINDER_IPC=y      # Binder核心支持
CONFIG_ANDROID_BINDERFS=y        # Binder文件系统支持
CONFIG_ANDROID_ASHMEM=y          # Ashmem支持
```

检查模块是否加载

```bash
lsmod | grep -E "binder|ashmem"
```

检查 Binder 设备节点

```bash
ls -l /dev/binder          # 传统 Binder 设备
ls -l /dev/binderfs        # BinderFS 挂载点（若已挂载）
```

### 若模块未加载，手动加载

```bash
sudo apt install linux-modules-extra-`uname -r`
sudo apt install linux-generic-hwe-20.04
```

```bash
sudo modprobe binder_linux devices="binder,hwbinder,vndbinder"
sudo modprobe ashmem_linux
```

### 持久化加载配置

```bash
sudo tee /etc/modules-load.d/waydroid.conf <<EOF
binder_linux
ashmem_linux
EOF
```

## Waydroid

添加软件源：

```bash
curl https://repo.waydro.id | sudo bash
```

安装Waydroid：

```bash
sudo apt install waydroid -y
```

初始化Waydroid，下载内建GAPPS的镜像。如果不加入`-s GAPPS`参数的话，Waydroid就会下载不含`GMS`服务的vanilla镜像。

```bash
sudo waydroid init -s GAPPS -f
```

启动Waydroid

```bash
sudo systemctl start waydroid-container
```

开机自启动

```bash
sudo systemctl enable waydroid-container
```

创建一个新的Session：

```bash
waydroid session start
```

## ReDroid

### cnflysky/redroid-rk3588

```bash
sudo docker pull cnflysky/redroid-rk3588:lineage-20

sudo docker save cnflysky/redroid-rk3588:lineage-20 -o redroid-rk3588.tar

docker load -i redroid-rk3588.tar

docker run -itd \
    --restart unless-stopped \
    --privileged \
    -p 5000:5555 \
    cnflysky/redroid-rk3588:lineage-20 \
    androidboot.redroid_height=1920 androidboot.redroid_width=1080

### redroid/redroid

docker pull --platform linux/arm64/v8 redroid/redroid:latest

docker save redroid/redroid:latest -o redroid.tar

docker load -i redroid.tar

docker run -itd --rm --privileged \
    -p 5000:5555 \
    redroid/redroid:latest
```

## 参考资料

- [Android云真机原理以及云真机平台搭建实践](https://www.toutiao.com/article/6793282802562368011/)
- [美团点评云真机平台实践](https://tech.meituan.com/2018/07/19/cloud-phone.html)
- [知乎移动端云测试平台实践(一)—— 系统设计](https://zhuanlan.zhihu.com/p/65565514)
- [知乎移动端云测试平台实践：Agent 设计和实现](https://zhuanlan.zhihu.com/p/83373208)
- [云真机- 关于云真机画面传输后，浏览器切换到其他tab，隔一段时间回来后，画面延迟问题](https://blog.csdn.net/qq744746842/article/details/124060853)
- [货拉拉云真机平台的演进与实践](https://juejin.cn/post/7217851001087803453)
- [开源云真机平台-Sonic应用实践](https://juejin.cn/post/7160933386733748231)
- [安卓11平台搭建minitouch环境](https://www.shaohanyun.top/posts/env/minitouch_build/)
- [网易自动化测试解决方案-私有云](https://airtest.doc.io.netease.com/commercial/commercial/)
- [基于ATXServer2搭建移动设备管理平台](https://zhuanlan.zhihu.com/p/342562618)
- [Android手机管理平台搭建：STF和atxserver2](https://blog.51cto.com/u_15441270/4714491)
- [使用Docker运行ws-scrcpy：实现Android web远程桌面](https://www.vipiu.net/archives/2023/01/08/19071.html)
- [ws-scrcpy – 用浏览器远程控制 Android 手机，实现云手机效果](https://www.appinn.com/ws-scrcpy/)
- [WebADB](https://app.webadb.com/)
- [ReDroid教學：用Docker跑Android系統，在x86電腦玩ARM手機遊戲](https://ivonblog.com/posts/redroid-android-docker/#contents:1-redroid%E9%9C%80%E8%A6%81%E7%94%A8%E5%88%B0%E7%9A%84%E8%BB%9F%E9%AB%94)
- [App 自動化測試（三）ReDroid 安裝與基本使用](https://vocus.cc/article/645b3257fd8978000139c12f)
- [基于ReDroid搭建云手机](https://www.jianshu.com/p/a6b5bedcc205)
- [在rock5b上使用redroid](https://blog.seeflower.dev/archives/203/)
- [Portainer环境5分钟部署Redroid云手机](https://zhuanlan.zhihu.com/p/625915945)
- [搭建 ReDroid](https://b.hui.ke/posts/build-redroid/)
- [在甲骨文云ARM机上使用ReDroid搭建云手机](https://www.lol6.xyz/2023/03/14/%E5%9C%A8%E7%94%B2%E9%AA%A8%E6%96%87%E4%BA%91arm%E6%9C%BA%E4%B8%8A%E4%BD%BF%E7%94%A8redroid%E6%90%AD%E5%BB%BA%E4%BA%91%E6%89%8B%E6%9C%BA/)
- [linux上运行android：waydroid终于安装成功并可上网、安装程序](https://zhuanlan.zhihu.com/p/603603346)
- [STF - Github](https://github.com/DeviceFarmer/stf)
- [OpenSTF - Github](https://github.com/openstf)
- [ya-webadb - Github](https://github.com/yume-chan/ya-webadb)
- [ws-scrcpy - Github](https://github.com/NetrisTV/ws-scrcpy)
- [scrcpy - Github](https://github.com/Genymobile/scrcpy)
- [Sonic](https://sonic-cloud.cn/)
- [ATXServer2 - Github](https://github.com/openatx/atxserver2)
- [编译适用于RK3588的Redroid镜像](https://cnflysky.com/tech/%E7%BC%96%E8%AF%91%E9%80%82%E7%94%A8%E4%BA%8ERK3588%E7%9A%84Redroid%E9%95%9C%E5%83%8F.html)
- [Linux跑Android APP，Ubuntu安裝Waydroid教學](https://ivonblog.com/posts/ubuntu-waydroid/)
