# 如何解压Unity WebGL游戏的UnityWebData1.0资源包

## 什么是 UnityWebData

UnityWebData 文件是在 WebGL 游戏中与 WebAssembly 文件一起加载和使用的文件，主要是组合所有资产(Asset)、资源(Resource)和元数据(Meta)文件的文件。

![UnityWebData](/assets/images/unity/unity_webdata_file_struct_image.png)

## UnityWebData的结构体

本节介绍基于UnityWebData1.0的二进制文件的结构进行介绍。

需要注意：int值必须以Little Endian方式读取。

### 文件头 (File Header)

| 字段名    | 长度（字节）	 | 类型	    | 描述                      |
|--------|---------|--------|-------------------------|
| 文件签名	  | 16      | string | “UnityWebData1.0\0”     |
| 文件体偏移	 | 4       | int    | 整个列出文件的起始位置，与第一个文件的位置相同 |

### 文件信息头 (File Information Header)

该区块紧跟在文件头之后，处于文件体之前。

它是一张文件索引表，记录了文件读取的偏移量，文件名等信息，表项的字段如下：

| 字段名    | 长度（字节）	 | 类型     | 描述       |
|--------|---------|--------|----------|
| 文件偏移量	 | 4       | int    | 文件的起始偏移量 |
| 文件长度	  | 4       | int    | 文件大小     |
| 文件名长度	 | 4       | int    | 文件名长度    |
| 文件名	   | n       | string | 文件名      |

### 文件体 (File Body)

文件索引表后面紧跟着的就是资源文件了。如果要读取某一个文件，可以先读取获取其在标头中的偏移量，然后从该位置读取到标头中记录的文件大小的文件数据。

## 使用工具

经过我的测试，有两个比较好使：

- [UWDTool] - Python开发
- [unityweb] - Golang开发

### [UWDTool]

安装：

```bash
pip install uwdtool
```

解包：

```bash
python UWDTool.py <Control Option> [-i input_path] [-o output_path]
```

### [unityweb]

安装：

```bash
go install github.com/jozsefsallai/unityweb/cmd/unityweb@latest
```

解包：

```bash
unityweb unpack -i ./webdata.data -o ./unpack
```

## 参考资料

- [How to unpack UnityWebData1.0 in Unity WebGL games](https://blog.pasqualefiorillo.it/how-to-unpack-unitywebdata1-0-in-unity-webgl-games/)
- [[心得] unitypack 安裝問題](https://www.ptt.cc/bbs/Python/M.1597922907.A.FEF.html)
- [【笔记】MacOS/Linux下dump unity3d的资源](https://blog.csdn.net/prog_6103/article/details/120518875)
- [UWDTool]
- [unityweb]
- [extract.js](https://gist.github.com/ehwuts/44b06b8a576aff0d290dcf9824342a5c)
- [unpack-unitywebdata1.0.py](https://gist.github.com/siddolo/9009bba4e78679a666fbb10adb92d748)
- [AssetStudio升级：支持到Unity 2022.3](https://zhuanlan.zhihu.com/p/659958667)

[UWDTool]: (https://pypi.org/project/uwdtool/)
[unityweb]: (https://github.com/jozsefsallai/unityweb)