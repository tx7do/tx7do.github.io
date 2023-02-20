# 如何在 CentOS 7 上安装 OpenCV

## 第 1 步：安装 OpenCV 的依赖项

使用以下命令安装编译 OpenCV 所需的所有依赖项：

```bash
yum groupinstall "Development Tools" -y

yum install cmake3 gcc gtk2-devel numpy pkconfig -y
```

## 第 2 步：下载 OpenCV x.x.x 代码

下载并解压缩 OpenCV x.x.x 代码压缩文件，如下所示：

```bash
wget https://github.com/opencv/opencv/archive/x.x.x.zip

unzip x.x.x.zip
```

## 第三步：编译安装OpenCV x.x.x

使用以下命令编译安装OpenCV，编译好的OpenCV文件会保存在`/usr/local`目录下。

```bash
cd opencv-x.x.x

mkdir build

cd build

cmake3 -D CMAKE_BUILD_TYPE=DEBUG -D CMAKE_INSTALL_PREFIX=/usr/local ..

make

make install
```

## 第 4 步：配置所需的变量

除了编译和安装文件外，您还需要为 `pkgconfig` 和 OpenCV 指定路径信息：

```bash
export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/usr/local/lib/pkgconfig/

echo '/usr/local/lib/' >> /etc/ld.so.conf.d/opencv.conf

ldconfig
```
