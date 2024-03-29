# Golang设置网络代理

## 打开模块支持

```shell
go env -w GO111MODULE=on
```

## 取消代理

```shell
go env -w GOPROXY=direct
```

## 取消校验

```shell
go env -w GOSUMDB=off
```

## 设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）

```shell
go env -w GOPRIVATE=git.mycompany.com,github.com/my/private
```

## 设置代理

### 国内常用代理列表

|   提供者  |   地址  |
|-----|-----|
|  官方全球代理   |   https://proxy.golang.com.cn  |
|  七牛云   |   https://goproxy.cn  |
|   阿里云  |   https://mirrors.aliyun.com/goproxy/  |
|   GoCenter  |   https://gocenter.io  |
|   百度  |   https://goproxy.bj.bcebos.com/  |

**“direct”** 为特殊指示符，用于指示 Go 回源到模块版本的源地址去抓取(比如 GitHub 等)，当值列表中上一个 Go module proxy 返回 404 或 410 错误时，Go 自动尝试列表中的下一个，遇见 **“direct”** 时回源，遇见 EOF 时终止并抛出类似 “invalid version: unknown revision...” 的错误。

### 官方全球代理

```shell
go env -w GOPROXY=https://proxy.golang.com.cn,direct
go env -w GOSUMDB=sum.golang.google.cn
```

或者

```shell
go env -w GOPROXY=https://goproxy.io,direct
go env -w GOSUMDB=gosum.io+ce6e7565+AY5qEHUk/qmHc5btzW45JVoENfazw8LielDsaI+lEbq6
```

### 七牛云

```shell
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOSUMDB=goproxy.cn/sumdb/sum.golang.org
```

### 阿里云

```shell
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct
# GOSUMDB 不支持
```

### GoCenter

```shell
go env -w GOPROXY=https://gocenter.io,direct
# 不支持 GOSUMDB
```

### 百度

```shell
go env -w GOPROXY=https://goproxy.bj.bcebos.com/,direct
# 不支持 GOSUMDB
```

## warning: go env -w GOPROXY=... does not override conflicting OS environment variable

**原因：**

之前安装go的时候，用环境变量的方式设置过代理地址，go13提供了-w参数来设置GOPROXY变量，但无法覆盖OS级别的环境变量

**解决方法：**

```bash
unset GOPROXY

# or 

Clear-Variable GOPROXY
```

## 参考资料

* [goproxy.io文档](https://goproxy.io/zh/docs/)
* [goproxy.io文档](https://goproxy.io/zh/docs/)
* [七牛云文档](https://goproxy.cn/)
* [阿里云文档](https://developer.aliyun.com/mirror/goproxy)
* [开发者头条文档](https://toutiao.io/posts/wj2sn6/preview)
* [百度文档](https://goproxy.bj.bcebos.com/)
* [Go 国内加速：Go 国内加速镜像](https://learnku.com/go/wikis/38122)
