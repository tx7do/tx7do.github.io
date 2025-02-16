# 开箱即用的GO后台管理系统 Kratos Admin - 如何搭建开发环境

## 如何搭建前端开发环境

### 安装开发工具

需要安装的软件有：

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [pnpm](https://pnpm.io/)

#### Windows

Windows下安装软件的方法有很多种，这里推荐使用软件包管理工具：[scoop](https://scoop.sh/)。

```shell
scoop bucket add extras
scoop install git vscode webstorm nodejs pnpm
```

#### MacOS

MacOS下安装软件的方法有很多种，这里推荐使用软件包管理工具：[Homebrew](https://brew.sh/)。

```shell
brew install git node pnpm
brew install --cask visual-studio-code webstorm
```

### 安装插件

前端需要的插件主要是Protobuf的插件：

- [ts-proto](https://github.com/stephenh/ts-proto)
- [Dart plugin for protobuf compiler](https://pub.dev/packages/protoc_plugin)

安装方法：

#### Dart

```shell
flutter pub global activate protoc_plugin
```

#### TypeScript

```shell
npm install -g ts-proto
```

### npm/pnpm/yarn切换源

* 国内镜像

| 提供商  | 搜索地址                   | registry地址                                         |
|------|------------------------|----------------------------------------------------|
| 淘宝   | https://npmmirror.com/ | https://registry.npmmirror.com                     |
| 腾讯云  |                        | http://mirrors.cloud.tencent.com/npm/              |
| 华为云  |                        | https://mirrors.huaweicloud.com/repository/npm     |
| 浙江大学 |                        | http://mirrors.zju.edu.cn/npm/                     |
| 南京邮电 |                        | https://mirrors.njupt.edu.cn/nexus/repository/npm/ |

#### npm

```shell
# 查看源
npm get registry
npm config get registry

# 临时修改
npm --registry https://registry.npmmirror.com install any-touch

# 永久修改
npm config set registry https://registry.npmmirror.com

# 还原
npm config set registry https://registry.npmjs.org
```

#### nrm

```shell
# 安装 nrm
npm install -g nrm

# 列出当前可用的所有镜像源
nrm ls

# 使用淘宝镜像源
nrm use taobao

# 测试访问速度
nrm test taobao
```

#### pnpm

```shell
# 查看源
pnpm get registry
pnpm config get registry

# 临时修改
pnpm --registry https://registry.npmmirror.com install any-touch

# 永久修改
pnpm config set registry https://registry.npmmirror.com

# 还原
pnpm config set registry https://registry.npmjs.org
```

#### yarn

```shell
# 查看源
yarn config get registry

# 临时修改
yarn add any-touch@latest --registry=https://registry.npmjs.org/

# 永久修改
yarn config set registry https://registry.npmmirror.com/

# 还原
yarn config set registry https://registry.yarnpkg.com
```

#### yrm

```shell
# 安装 yrm
npm install -g yrm

# 列出当前可用的所有镜像源
yrm ls

# 使用淘宝镜像源
yrm use taobao

# 测试访问速度
yrm test taobao
```

## 如何搭建后端开发环境

### 安装开发工具

需要安装的软件有：

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Goland](https://www.jetbrains.com/go/)
- [Docker](https://www.docker.com/)
- [Go](https://go.dev/)
- [protobuf-compiler](https://grpc.io/docs/protoc-installation/)
- [Make](https://www.make.com/en)
- [Buf](https://buf.build/)
- [gawk](https://www.gnu.org/software/gawk/)
- [grep](https://www.gnu.org/software/grep/)
- [sed](https://www.gnu.org/software/sed/)

#### Windows

Windows下安装软件的方法有很多种，这里推荐使用软件包管理工具：[scoop](https://scoop.sh/)。

一键安装所有的开发软件：

```shell
scoop bucket add extras
scoop install git vscode goland docker go protobuf make buf gawk grep sed
```

#### MacOS

MacOS下安装软件的方法有很多种，这里推荐使用软件包管理工具：[Homebrew](https://brew.sh/)。

```shell
brew install git docker go protobuf make buf gawk grep gnu-sed
brew install --cask visual-studio-code goland
```

### 安装插件

后端需要的插件主要是Protobuf的插件：

- [protoc-gen-go](https://google.golang.org/protobuf/cmd/protoc-gen-go)
- [protoc-gen-go-grpc](https://google.golang.org/grpc/cmd/protoc-gen-go-grpc)
- [protoc-gen-go-http](https://github.com/go-kratos/kratos/cmd/protoc-gen-go-http)
- [protoc-gen-go-errors](https://github.com/go-kratos/kratos/cmd/protoc-gen-go-errors)
- [protoc-gen-openapi](https://github.com/google/gnostic/cmd/protoc-gen-openapi)
- [protoc-gen-validate](https://github.com/envoyproxy/protoc-gen-validate)

安装方法：

```shell
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2@latest
go install github.com/go-kratos/kratos/cmd/protoc-gen-go-errors/v2@latest
go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
go install github.com/envoyproxy/protoc-gen-validate@latest
```

或者你可以在项目的根目录下执行make，该命令会把前后端的插件都装好的：

```shell
make plugin
```

### Golang设置网络代理

#### 打开模块支持

```shell
go env -w GO111MODULE=on
```

#### 取消代理

```shell
go env -w GOPROXY=direct
```

#### 取消校验

```shell
go env -w GOSUMDB=off
```

#### 设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）

```shell
go env -w GOPRIVATE=git.mycompany.com,github.com/my/private
```

#### 设置代理

##### 国内常用代理列表

| 提供者      | 地址                                  |
|----------|-------------------------------------|
| 官方全球代理   | https://proxy.golang.com.cn         |
| 七牛云      | https://goproxy.cn                  |
| 阿里云      | https://mirrors.aliyun.com/goproxy/ |
| GoCenter | https://gocenter.io                 |
| 百度       | https://goproxy.bj.bcebos.com/      |

**“direct”** 为特殊指示符，用于指示 Go 回源到模块版本的源地址去抓取(比如 GitHub 等)，当值列表中上一个 Go module proxy 返回
404 或 410 错误时，Go 自动尝试列表中的下一个，遇见 **“direct”** 时回源，遇见 EOF 时终止并抛出类似 “invalid version: unknown
revision...” 的错误。

##### 官方全球代理

```shell
go env -w GOPROXY=https://proxy.golang.com.cn,direct
go env -w GOSUMDB=sum.golang.google.cn
```

或者

```shell
go env -w GOPROXY=https://goproxy.io,direct
go env -w GOSUMDB=gosum.io+ce6e7565+AY5qEHUk/qmHc5btzW45JVoENfazw8LielDsaI+lEbq6
```

##### 七牛云

```shell
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOSUMDB=goproxy.cn/sumdb/sum.golang.org
```

##### 阿里云

```shell
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct
# GOSUMDB 不支持
```

##### GoCenter

```shell
go env -w GOPROXY=https://gocenter.io,direct
# 不支持 GOSUMDB
```

##### 百度

```shell
go env -w GOPROXY=https://goproxy.bj.bcebos.com/,direct
# 不支持 GOSUMDB
```

#### warning: go env -w GOPROXY=... does not override conflicting OS environment variable

**原因：**

之前安装go的时候，用环境变量的方式设置过代理地址，go13提供了-w参数来设置GOPROXY变量，但无法覆盖OS级别的环境变量

**解决方法：**

```bash
unset GOPROXY

# or 

Clear-Variable GOPROXY
```
