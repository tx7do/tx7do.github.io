# Ubuntu安装CMake

## 1. 使用Apt安装

```bash
sudo apt update; sudo apt upgrade;
sudo apt install cmake;
```

## 2. 源码构建安装

```bash
version=3.28
build=3
## don't modify from here
mkdir ~/temp
cd ~/temp
wget https://cmake.org/files/v$version/cmake-$version.$build.tar.gz
tar -xzvf cmake-$version.$build.tar.gz

cd cmake-$version.$build/
./bootstrap
make -j$(nproc)
sudo make install

sudo ln -fs /usr/local/bin/cmake /usr/bin/cmake

rm -fr ~/temp
```

## 3. 二进制安装

```bash
version=3.28
build=3
## don't modify from here
limit=3.20
result=$(echo "$version >= $limit" | bc -l)
os=$([ "$result" == 1 ] && echo "linux" || echo "Linux")
mkdir ~/temp
cd ~/temp
wget https://cmake.org/files/v$version/cmake-$version.$build-$os-x86_64.sh 
sudo mkdir /opt/cmake
sudo sh cmake-$version.$build-$os-x86_64.sh --prefix=/opt/cmake

sudo ln -fs /opt/cmake/cmake-$version.$build-$os-x86_64/bin/cmake /usr/local/bin/cmake
sudo ln -fs /usr/local/bin/cmake /usr/bin/cmake

rm -fr ~/temp
```

## 参考资料

- [How do I install the latest version of cmake from the command line?](https://askubuntu.com/questions/355565/how-do-i-install-the-latest-version-of-cmake-from-the-command-line)
