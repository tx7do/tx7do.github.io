# Flutter切换源

## 国内镜像列表

| 提供商   | PUB_HOSTED_URL    | FLUTTER_STORAGE_BASE_URL    |
|-------|-------|-------|
| 上海交大  |  https://mirror.sjtu.edu.cn/dart-pub  |https://mirror.sjtu.edu.cn|
| 清华大学  | https://mirrors.tuna.tsinghua.edu.cn/dart-pub |https://mirrors.tuna.tsinghua.edu.cn/flutter|
| OpenTUNA  |  https://opentuna.cn/dart-pub |https://opentuna.cn/flutter|
| CNNIC  | http://mirrors.cnnic.cn/dart-pub  |http://mirrors.cnnic.cn/flutter|
| Flutter中国（七牛云） | https://pub.flutter-io.cn   |https://storage.flutter-io.cn|
| 腾讯云  | https://mirrors.cloud.tencent.com/dart-pub  |https://mirrors.cloud.tencent.com/flutter|

## FLUTTER_GIT_URL

* <https://github.com/flutter/flutter.git>
* <https://gitee.com/mirrors/Flutter.git>
* <https://mirrors.tuna.tsinghua.edu.cn/git/flutter-sdk.git>

## 切换源

### Linux

* 向Bash的配置文件追加配置

```bash
cat >> ~/.bashrc << EOF
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export FLUTTER_GIT_URL=https://gitee.com/mirrors/Flutter.git
EOF
```

* 使配置生效

```bash
source ~/.bashrc
```

### macOS

* 向Zsh的配置文件追加配置

```bash
cat >> ~/.zshrc << EOF
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export FLUTTER_GIT_URL=https://gitee.com/mirrors/Flutter.git
EOF
```

* 使配置生效

```bash
source ~/.zshrc
```

### Windows

* 设置临时的环境变量

```powershell
set PUB_HOSTED_URL https://pub.flutter-io.cn
set FLUTTER_STORAGE_BASE_URL https://storage.flutter-io.cn
set FLUTTER_GIT_URL https://gitee.com/mirrors/Flutter.git
```

* 设置为当前用户的环境变量

```powershell
setx PUB_HOSTED_URL https://pub.flutter-io.cn
setx FLUTTER_STORAGE_BASE_URL https://storage.flutter-io.cn
setx FLUTTER_GIT_URL https://gitee.com/mirrors/Flutter.git
```

* 设置为系统环境变量（加`-m`参数）

```powershell
setx -m PUB_HOSTED_URL https://pub.flutter-io.cn
setx -m FLUTTER_STORAGE_BASE_URL https://storage.flutter-io.cn
setx -m FLUTTER_GIT_URL https://gitee.com/mirrors/Flutter.git
```

## 参考资料

* [在中国网络环境下使用 Flutter](https://flutter.cn/community/china)
* [国内开源镜像站点](https://www.cnblogs.com/flytree/p/15130786.html)
