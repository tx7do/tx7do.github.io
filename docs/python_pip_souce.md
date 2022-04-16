# Python修改pip的软件源

## 国内常用软件源列表

|   提供者  |   地址  |
|-----|-----|
|  豆瓣   |   https://pypi.doubanio.com/simple/  |
|   腾讯  |   https://mirrors.cloud.tencent.com/pypi/simple/  |
|   阿里  |   https://mirrors.aliyun.com/pypi/simple/  |
|   网易  |   https://mirrors.163.com/pypi/simple/  |
|  清华   |   https://pypi.tuna.tsinghua.edu.cn/simple/  |
|   中国科学技术大学  |   https://pypi.mirrors.ustc.edu.cn/simple/  |
|   北京外国语大学  |   https://mirrors.bfsu.edu.cn/pypi/web/simple/  |

## 临时使用

```shell
pip install markdown -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 修改源

### 清华源

```shell
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### 阿里源

```shell
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

### 腾讯源

```shell
pip config set global.index-url https://mirrors.cloud.tencent.com/pypi/simple/
```

### 豆瓣源

```shell
pip config set global.index-url https://pypi.doubanio.com/simple/
```
