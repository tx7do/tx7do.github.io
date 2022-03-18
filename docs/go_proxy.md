
# Golang设置代理

## 国内常用代理列表

```bash
# goproxy
https://proxy.golang.com.cn

# 七牛云
https://goproxy.cn

# 阿里云
https://mirrors.aliyun.com/goproxy
```

## 设置代理

## macOS 或 Linux

```bash
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
```

## Windows

```shell
# CMD
set GO111MODULE = "on"
set GOPROXY = "https://goproxy.cn"

# PowerShell
$env:GO111MODULE = "on"
$env:GOPROXY = "https://goproxy.cn"
```

## 取消代理

``` shell
go env -u GOPROXY
```
