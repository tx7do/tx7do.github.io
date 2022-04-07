
# Golang设置代理

## 国内常用代理列表

|   提供者  |   地址  |
|-----|-----|
|  官方全球代理   |   https://proxy.golang.com.cn  |
|  七牛云   |   https://goproxy.cn  |
|   阿里云  |   https://mirrors.aliyun.com/goproxy/  |
|   GoCenter  |   https://gocenter.io  |
|   百度  |   https://goproxy.bj.bcebos.com/  |

## 设置代理

**“direct”** 为特殊指示符，用于指示 Go 回源到模块版本的源地址去抓取(比如 GitHub 等)，当值列表中上一个 Go module proxy 返回 404 或 410 错误时，Go 自动尝试列表中的下一个，遇见 **“direct”** 时回源，遇见 EOF 时终止并抛出类似 “invalid version: unknown revision...” 的错误。

### macOS 或 Linux

```bash
# 打开模块支持
export GO111MODULE=on

# 取消代理
export GOPROXY=direct

# 取消校验
export GOSUMDB=off

# 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
export GOPRIVATE=git.mycompany.com,github.com/my/private

# 官方全球代理
export GOPROXY=https://proxy.golang.com.cn,direct
export GOPROXY=https://goproxy.io,direct
export GOSUMDB=gosum.io+ce6e7565+AY5qEHUk/qmHc5btzW45JVoENfazw8LielDsaI+lEbq6
export GOSUMDB=sum.golang.google.cn

# 七牛云
export GOPROXY=https://goproxy.cn,direct
export GOSUMDB=goproxy.cn/sumdb/sum.golang.org

# 阿里云
export GOPROXY=https://mirrors.aliyun.com/goproxy/,direct
# GOSUMDB 不支持

# GoCenter
export GOPROXY=https://gocenter.io,direct
# 不支持 GOSUMDB

# 百度
export GOPROXY=https://goproxy.bj.bcebos.com/,direct
# 不支持 GOSUMDB
```

### Windows

#### CMD

```shell
# 打开模块支持
set GO111MODULE = "on"

# 取消代理
set GOPROXY = "direct"

# 取消校验
set GOSUMDB = "off"

# 官方全球代理
set GOPROXY = "https://proxy.golang.com.cn,direct"
set GOPROXY = "https://goproxy.io,direct"
set GOSUMDB = "gosum.io+ce6e7565+AY5qEHUk/qmHc5btzW45JVoENfazw8LielDsaI+lEbq6"
# 或者
set GOSUMDB = "sum.golang.google.cn"

# 七牛云
set GOPROXY = "https://goproxy.cn,direct"
set GOSUMDB = "https://goproxy.cn/sumdb/sum.golang.org"

#  阿里云
set GOPROXY = "https://mirrors.aliyun.com/goproxy/,direct"
# GOSUMDB 不支持

# GoCenter
set GOPROXY = "https://gocenter.io,direct"
# 不支持 GOSUMDB

# 百度
set GOPROXY = "https://goproxy.bj.bcebos.com/,direct"
# 不支持 GOSUMDB
```

#### PowerShell

```shell
# 打开模块支持
$env:GO111MODULE = "on"

# 取消代理
$env:GOPROXY = "direct"

# 取消校验
$env:GOSUMDB = "off"

# 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
$env:GOPRIVATE = "git.mycompany.com,github.com/my/private"

# 官方全球代理
$env:GOPROXY = "https://proxy.golang.com.cn,direct"
$env:GOPROXY = "https://goproxy.io,direct"
$env:GOSUMDB = "gosum.io+ce6e7565+AY5qEHUk/qmHc5btzW45JVoENfazw8LielDsaI+lEbq6"

# 七牛云
$env:GOPROXY = "https://goproxy.cn,direct"
$env:GOSUMDB = "https://goproxy.cn/sumdb/sum.golang.org"

#  阿里云
$env:GOPROXY = "https://mirrors.aliyun.com/goproxy/,direct"
# GOSUMDB 不支持

# GoCenter
$env:GOPROXY = "https://gocenter.io,direct"
# 不支持 GOSUMDB

# 百度
$env:GOPROXY = "https://goproxy.bj.bcebos.com/,direct"
# 不支持 GOSUMDB
```

## 参考资料

* [goproxy.io文档](https://goproxy.io/zh/docs/)
* [goproxy.io文档](https://goproxy.io/zh/docs/)
* [七牛云文档](https://goproxy.cn/)
* [阿里云文档](https://developer.aliyun.com/mirror/goproxy)
* [开发者头条文档](https://toutiao.io/posts/wj2sn6/preview)
* [百度文档](https://goproxy.bj.bcebos.com/)
* [Go 国内加速：Go 国内加速镜像](https://learnku.com/go/wikis/38122)
