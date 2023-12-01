# 如何获取微信小程序的资源

之前，都是找的Andriod的文件，但是，这很麻烦，因为需要Root，不然无法访问。找到文件，拷贝也是一件很麻烦的事情。

现在，电脑版的微信也是可以使用小程序的，所以，从电脑上去寻找小程序的资源就变得切实可行。

## 小程序所在的位置

首先，它有两个路径：

```bash
C:\Users\{Windows用户名}\Documents\WeChat Files\Applet\{小程序ID}
```

和

```bash
C:\Users\{Windows用户名}\Documents\WeChat Files\{微信用户名}\Applet\{小程序ID}
```

上面的那个路径存放的是小程序的程序实体。

下面的那个路径存放的是小程序运行时所产生的文件，比如：用户的Session啊，用户数据啊，网页中的各种资源啊……

## 解包小程序的程序

小程序的程序包就和apk差不多的，也就是把所有的资源包都打成一个或者若干个文件包，它的文件后缀是：wxapkg。看起来可能是这样的：

```text
└─wx***************
    └─nn
       └─ __APP__.wxapkg
       └─ _subpackages_engine_.wxapkg
       └─ _subpackages_framework_.wxapkg
```

如果只是需要拿到小程序的源代码，解开它就可以了。有一个流传很广的工具：[wxappUnpacker](https://github.com/qwerty472123/wxappUnpacker)。但是，现在似乎被和谐了。

电脑上的小程序包是经过了加密处理的，所以，要解开电脑上面的小程序资源包，需要经过两步：

1. 解密资源包；
2. 解开资源包。

第一个步骤有两个工具可供使用：

1. [pc_wxapkg_decrypt](https://github.com/BlackTrace/pc_wxapkg_decrypt)
2. [mp-wxapkg-unpacker](https://github.com/halo951/mp-wxapkg-unpacker)

第二个步骤也有两个工具可供使用：

1. [wxappUnpacker](https://github.com/qwerty472123/wxappUnpacker)
2. [mp-wxapkg-unpacker](https://github.com/halo951/mp-wxapkg-unpacker)

## 参考资料

- [[node.js]PC端微信小程序包解密](https://juejin.cn/post/6888348237242040327)
- [一起来探索下微信小程序包的魔数](https://blog.51cto.com/xuedingmaojun/3183922)
- [微信小程序源码阅读笔记1](https://lrdcq.com/me/read.php/66.htm)
- [微信小程序(小游戏) wxapkg 包 解包工具, 支持 pc 端加密包解包](https://github.com/halo951/mp-wxapkg-unpacker)
- [wxappUnpacker](https://github.com/qwerty472123/wxappUnpacker)
