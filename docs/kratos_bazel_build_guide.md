# 使用Bazel构建你的Kratos微服务

Kratos是一个微服务框架，既然是微服务，那么一个工程下肯定会存在不少的服务，一个服务就是一个二进制可执行程序，那么我们将会面对一个问题：如何去构建（Build）这些服务程序。这件事情，通常都交由构建系统去做。我们能够选择的构建系统有很多：Make、CMake、Bazel……那么，我们又该如何选择一个构建系统呢？

项目结构简单，服务少，我们完全可以使用Make来进行构建。要学会使用Make，您需要学会使用Makefile来编写构建脚本，如果整个构建只是组织一些简单的编译命令，那还好，学习和使用都会是简单轻松的事情。

但是，理想很丰满，现实很骨感。在实际的工程实践中，一切都会朝着复杂的方向发展。服务的数量肯定不会少，工程的组织结构也肯定不会简单，那么，构建也就会变得相应的复杂起来，需要编写大量的Makefile，Makefile的复杂度也越来越大了。另外还有，构建环境的搭建问题，持续集成的问题，自动构建的问题，构建时间变长的问题……抱歉，面对这样复杂的工程环境，Make难以满足我们的需求。

那么，要解决现实中这些问题，我们就需要一个合适的构建工具。这个工具也就是我们在本文要介绍的：[Bazel](https://bazel.build)。

Bazel是谷歌开发的一个云构建系统，对于谷歌为什么要重新发明一个构建工具而不直接使用 Make，Google 认为 Make 控制得太细，最终结果完全要依靠开发人员能正确编写规则。很久以前，Google 使用自动生成的臃肿的 Makefile 来构建他们的软件，速度太慢，结果也不可靠，最终影响了研发人员的效率和公司的敏捷性。所以他们做了 Bazel。

对于小型的项目，Bazel可能有点过于复杂，学习曲线也相对陡峭。但是，对于微服务这种拥有比较复杂的项目结构，众多服务的项目，就非常合适了，使用它就很值得。

综上，我们可以选择Make和Bazel做我们Kratos微服务项目的构建工具：

- Make，适合规模小，服务少，项目结构固定的工程；
- Bazel，适合规模大，服务多，项目结构也复杂的工程。

通俗来讲就是一个高低配。

## 本文目标

本文将要达成以下目标：

1. 学习使用Bazel构建Golang应用程序；
2. 学习使用Bazel构建Docker镜像；
3. 使用Bazel构建Kratos微服务项目实战。

## 本文示例代码

- [一个Bazel构建Golang应用程序的最简示例](https://github.com/tx7do/bazel-golang-minimal-example)
- [一个Bazel构建Golang应用程序并打包Docker镜像的示例](https://github.com/tx7do/bazel-containers-hasher-example)
- [一个Kratos微服务的CMS实战项目](https://github.com/tx7do/kratos-blog)

> 以上代码在Gitee上也同步有，只需要把`github`修改为`gitee`即可访问。

## 代码库结构

现在，代码库有两种风格：Monorepo和Polyrepo、Multirepos。

Monorepo 意味着把所有项目的所有代码统一维护在一个单一的代码版本库中，和多代码库(Polyrepo、Multirepos)方案相比，两者各有优劣，需要根据公司文化和产品特性进行取舍。

由于谷歌在 Monorepo 上的实践，Monorepo 受到了越来越多的关注。

我们不能说因为有大厂商的背书，就不看具体情况的盲从。合适自己的，才是最好的。

这两种风格，我们都要稍作了解，这样，当我们做选择的时候能够胸有成竹。

本文所推崇的代码库结构为Monorepo，因为微服务的项目经常要去进行服务的拆分和组合，Monorepo就变得比较适合了，并且，本来服务之间就存在密不可分的交际，分到不同的代码库，也并不合适。

### 什么是 单一代码库 (Monorepo) ？

Monorepo 的意思是在版本控制系统的单个代码库里包含了许多项目的代码。这些项目虽然有可能是相关的，但通常在逻辑上是独立的，并由不同的团队维护。

有些公司将所有代码存储在一个代码库中，由所有人共享，因此 Monorepos 可以非常大。例如，理论上谷歌拥有有史以来最大的代码库，每天有成百上千次提交，整个代码库超过 80 TB。其他已知运营大型单一代码库的公司还有微软、Facebook 和 Twitter。

Monorepos 有时被称为单体代码库（monolithic repositories），但不应该与单体架构（monolithic architecture）相混淆，单体架构是一种用于编写自包含应用程序的软件开发实践。这方面的一个例子就是 Ruby on Rails，它可以处理 Web、API 和后端工作。

### 什么是 多代码库 (Polyrepo、Multirepos) ？

与单一代码库相反的是多代码库（multirepos），每个项目都储存在一个完全独立的、版本控制的代码库中。多代码库是很自然的选择——我们大多数人在开始一个新项目时都愿意开一个新的代码库，毕竟，谁都喜欢从 0 开始.

从多代码库到单一代码库的变化就意味着将所有项目移到一个代码库中。

多代码库不是微服务（MicroServices）的同义词，两者之间并没有耦合关系。事实上，我们稍后将讨论将单一代码库和微服务结合起来的例子。只要仔细设置用于部署的 CI/CD 流水线，单一代码库就可以托管任意数量的微服务。

### 单一代码库(Monorepo)的好处

乍一看，单一代码库和多代码库之间的选择似乎不是什么大问题，但这是一个会深刻影响到公司开发流程的决定。至于单一代码库的好处，可以列举如下：

- **可见性（Visibility）**：每个人都可以看到其他人的代码，这样可以带来更好的协作和跨团队贡献——不同团队的开发人员都可以修复代码中的 bug，而你甚至都不知道这个 bug 的存在。

- **更简单的依赖关系管理（Simpler dependency management）**：共享依赖关系很简单，因为所有模块都托管在同一个存储库中，因此都不需要包管理器。

- **唯一依赖源（Single source of truth）**：每个依赖只有一个版本，意味着没有版本冲突，没有依赖地狱。

- **一致性（Consistency）**：当你把所有代码库放在一个地方时，执行代码质量标准和统一的风格会更容易。

- **共享时间线（Shared timeline）**：API 或共享库的变更会立即被暴露出来，迫使不同团队提前沟通合作，每个人都得努力跟上变化。

- **原子提交（Atomic commits）**：原子提交使大规模重构更容易，开发人员可以在一次提交中更新多个包或项目。

- **隐式 CI（Implicit CI）**：因为所有代码已经统一维护在一个地方，因此可以保证持续集成。

- **统一的 CI/CD（Unified CI/CD）**：可以为代码库中的每个项目使用相同的 CI/CD 部署流程。

- **统一的构建流程（Unified build process）**：代码库中的每个应用程序可以共享一致的构建流程。

### 单一代码库(Monorepo)的缺陷

随着单一代码库的发展，我们在版本控制工具、构建系统和持续集成流水线方面达到了设计极限。这些问题可能会让一家公司走上多代码库的道路：

**性能差（Bad performance）**：单一代码库难以扩大规模，像 git blame 这样的命令可能会不合理的花费很长时间执行，IDE 也开始变得缓慢，生产力受到影响，对每个提交测试整个 repo 变得不可行。

**破坏主线（Broken main/master）**：主线损坏会影响到在单一代码库中工作的每个人，这既可以被看作是灾难，也可以看作是保证测试既可以保持简洁又可以跟上开发的好机会。

**学习曲线（Learning curve）**：如果代码库包含了许多紧密耦合的项目，那么新成员的学习曲线会更陡峭。

**大量的数据（Large volumes of data）**：单一代码库每天都要处理大量的数据和提交。

**所有权（Ownership）**：维护文件的所有权更有挑战性，因为像 Git 或 Mercurial 这样的系统没有内置的目录权限。

**代码审查（Code reviews）**：通知可能会变得非常嘈杂。例如，GitHub 有有限的通知设置，不适合大量的 pull request 和 code review。

## Bazel是什么？

Bazel 是一个构建工具，是 Google 为其内部软件开发的特点量身定制的工具，官方对其定位是：

> a fast, scalable, multi-language and extensible build system
>
> 一款速度极快、可伸缩、跨语言并且可扩展的构建系统

以下针对Bazel的四大特性进行分析，以更深入的理解Bazel：

### 快 (Fast)

Bazel 的构建过程很快，它集合了之前构建系统的加速的一些常见做法。包括：

1. **增量编译**。只重新编译必须的部分，即通过依赖分析，只编译修改过的部分及其影响的路径。
2. **并行编译**。将没有依赖的部分进行并行执行，可以通过 `--jobs` 来指定并行流的个数，一般可以是你机器 CPU 的个数。遇到大项目马力全开时，Bazel 能把你机器的 CPU 各个核都吃满。
3. **分布式 / 本地缓存**。Bazel 将构建过程视为**函数式**的，只要输入给定，那么输出就是一定的。而不会随着构建环境的不同而改变（当然这需要做一些限制），这样就可以分布式的缓存 / 复用不同模块，这点对于超大项目的速度提升极为明显。

### 可伸缩 (scalable)

Bazel 号称无论什么量级的项目都可以应对，无论是超大型单体代码库（monorepo）、还是超多库的多代码库（multirepo）。在 Google，一个服务器软件有十万行代码是很常见的，在什么都不改的前提下重新构建这样一个项目，大概只需要 200 毫秒。

Bazel 还可以很方便的集成 CD/CI ，并在云端利用分布式环境进行构建。

Bazel 使用 **沙箱机制** 进行编译，即将所有编译依赖隔绝在一个沙箱中，比如编译 golang 项目时，不会依赖你本机的 `GOPATH`，从而做到同样源码、跨环境编译、输出相同，即构建的确定性。换言之，就是构建所需的构建环境，它也全包了。

### 跨语言 (multi-language)

如果一个项目不同模块使用不同的语言，利用 Bazel 可以使用一致的风格来管理项目外部依赖和内部依赖。典型的项目如 [Ray](https://github.com/ray-project/ray)。该项目使用 C++ 构建 Ray 的核心调度组件、通过 Python/Java 来提供多语言的 API，并将上述所有模块用单个 repo 进行管理。如此组织使其项目整合相当困难，但 Bazel 在此处理的游刃有余，大家可以去该 [repo](https://github.com/ray-project/ray) 一探究竟。

### 可扩展 (extensible)

Bazel 使用的语法是基于 Python 裁剪而成的一门语言：[Starlark](https://github.com/bazelbuild/starlark)。其**表达能力强大**，往小了说，可以使用户自定义一些 rules （类似一般语言中的函数）对构建逻辑进行复用；往大了说，可以支持第三方编写适配新的语言或平台的 rules 集，比如 rules go。 Bazel 并不原生支持构建 golang 工程，但通过引入 rules go ，就能以比较一致的风格来管理 golang 工程。

## 安装 Bazel

如何安装Bazel的文档，官方提供的文档已经足够详细：<https://bazel.build/install>。

### Windows

安装文档：<https://bazel.build/install/windows>

- Scoop

    ```bash
    scoop install bazel
    # include buildifier buildozer unused_deps
    scoop install bazel-buildtools
    scoop install msys2
    ```

- Chocolatey

    ```bash
    choco install bazel
    choco install buildifier
    choco install buildozer
    choco install msys2
    ```

Windows因为不存在bash，会报错。所以需要另外，还需要安装`MSYS2`。
新增一个环境变量`BAZEL_SH`，把变量值设置为`MSYS2`的`usr\bin\bash.exe`。

### Ubuntu

安装文档：<https://bazel.build/install/ubuntu>

先安装软件源和证书，此操作只需要做一次：

```bash
sudo apt install apt-transport-https curl gnupg -y
curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor >bazel-archive-keyring.gpg
sudo mv bazel-archive-keyring.gpg /usr/share/keyrings
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/bazel-archive-keyring.gpg] https://storage.googleapis.com/bazel-apt stable jdk1.8" | sudo tee /etc/apt/sources.list.d/bazel.list
```

接着就可以安装了：

```bash
sudo apt update && sudo apt install bazel
```

### macOS

安装文档：<https://bazel.build/install/os-x>

```bash
brew install bazel
```

## Bazel工程文件组成

使用 Bazel 管理的项目一般包含以下几种 Bazel 相关的文件：`WORKSPACE(.bazel)`、`BUILD(.bazel)`、.bzl 和 `.bazelrc` 等。

`WORKSPACE(.bazel)` 和 `.bazelrc` 必须要放置于项目的根目录下。`BUILD(.bazel)`必须要放在项目的每一个文件夹中去（包括项目根目录）。`.bzl` 文件可以根据用户喜好自由放置，一般可放在项目根目录下的某个专用文件夹（比如 build）中。

其中，`WORKSPACE(.bazel)`和`BUILD(.bazel)`可以加`.bazel`后缀，也可以不加。

### WORKSPACE(.bazel)

WORKSPACE(.bazel)文件 通常放置于工程的根目录下面，此文件用于：

1. 定义项目根目录和项目名。
2. 加载 Bazel 工具和 rule 集。
3. 管理项目外部依赖库。

一个最小化的可用于构建golang语言项目的`WORKSPACE(.bazel)`文件大概是这样的：

```python
# 定义工作环境名称
workspace(name = "com_github_tx7do_bazel_golang_minimal_example")

# 导入http_archive方法
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# 下载rules_go
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "56d8c5a5c91e1af73eca71a6fab2ced959b67c86d12ba37feedb0a2dfea441a6",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
    ],
)

## 下载Gazelle
http_archive(
    name = "bazel_gazelle",
    sha256 = "ecba0f04f96b4960a5b250c8e8eeec42281035970aa8852dda73098274d14a1d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.29.0/bazel-gazelle-v0.29.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.29.0/bazel-gazelle-v0.29.0.tar.gz",
    ],
)

#########################################
## Go语言 规则集 初始化
#########################################

# 导入go_register_toolchains和go_rules_dependencies方法
load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

# 初始化go规则集的依赖项
go_rules_dependencies()

# 注册go 1.19.5版本的工具链，包含下载安装go环境。
go_register_toolchains(version = "1.19.5")

#########################################
## Gazelle 规则集 初始化
#########################################

# 导入gazelle_dependencies和go_repository方法
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies", "go_repository")

# 初始化Gazelle规则集的依赖项
gazelle_dependencies()
```

### BUILD.bazel

该文件主要针对其所在文件夹进行 **依赖解析** 和 **构建目标**定义。拿 go 来说，构建目标可以是 `go_binary`、`go_test`、`go_library` 等。

> Bazel 的之前版本用的文件名是 `BUILD`，但是在一些大小写不区分的系统上，它很容易跟 build 文件混淆，因此后来改为了显式的 `BUILD.bazel`。如果项目中同时存在两者，Bazel 更倾向于使用后者。对于所有的新项目，都推荐使用显式的 `BUILD.bazel`。github 上有一些讨论在[这里](https://github.com/bazelbuild/rules_go/issues/866)。

为了引用一个依赖，Bazel 使用 label 语法对所有的包进行唯一标识，其格式如下：

```python
@workerspace_name//path/of/package:target
```

比如，go 中常用的一个日志库 logrus 的 label 为：

```python
@com_github_sirupsen_logrus//:go_default_library
```

如果是本项目中的包路径，可以将 `//` 之前的 workspace 名字省去：

```python
//:library
```

一个最简单的Go项目的`BUILD.bazel`看起来是这样的：

```python
# 导入go_binary、go_test、go_library方法
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library", "go_test")

# 构建二进制程序
go_binary(
    name = "hello",
    srcs = ["hello.go"],
    deps = [":greeter"],
)

# 构建库
go_library(
    name = "greeter",
    importpath = "github.com/tx7do/bazel-golang-minimal-example/greeter",
    srcs = ["greeter.go"],
)

# 构建单元测试
go_test(
    name = "greeter_test",
    srcs = [ "greeter_test.go" ],
    embed = [ ":greeter" ],
)
```

### 自定义 rule (*.bzl)

如果你的项目有一些复杂构造逻辑、或者一些需要复用的构造逻辑，那么可以将这些逻辑以函数形式保存在 `.bzl` 文件，供 `WORKSPACE` 或者 `BUILD` 文件调用。其语法跟 Python 类似：

```python
def download_package():
    # 下载 Bazel Go语言 规则集
    if not native.existing_rule("io_bazel_rules_go"):
        http_archive(
            name = "io_bazel_rules_go",
            sha256 = "56d8c5a5c91e1af73eca71a6fab2ced959b67c86d12ba37feedb0a2dfea441a6",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
                "https://github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
            ],
        )

    # 下载 Bazel Gazelle 规则集
    if not native.existing_rule("bazel_gazelle"):
        http_archive(
            name = "bazel_gazelle",
            sha256 = "ecba0f04f96b4960a5b250c8e8eeec42281035970aa8852dda73098274d14a1d",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.29.0/bazel-gazelle-v0.29.0.tar.gz",
                "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.29.0/bazel-gazelle-v0.29.0.tar.gz",
            ],
        )
```

### .bazelrc

`.bazelrc` 是一个配置文件，熟悉Linux的同学一看就知道这是使用的`.*rc`的命名规则的配置文件。

因为，Bazel是基于Java开发的，熟悉JVM的同学都知道，JVM配置过之后更香。使用`UseParallelGC`并行收集器，设置JVM的内存等。

因为网络不好，Golang环境设置`GOPROXY`和`GOSUMDB`也是必须的，否则go依赖库的更新下载会让人崩溃死的。

通常来说，我们的线上环境要么是Linux系统，要么是Docker——本质上，它还是Linux——所以，编译目标肯定就是Linux了，我们就需要进行交叉编译的配置，将目标系统配置为`linux_amd64`是必要的。

这些配置，我们都可以写入到`.bazelrc`：

```ini
# 设置JVM
startup --host_jvm_args=-XX:+UseParallelGC --host_jvm_args=-Xmx6g --host_jvm_args=-Xms1g
# 设置CoreDump
startup --unlimit_coredumps

# 设置GOPROXY
test --action_env=GOPROXY=https://goproxy.cn
build --action_env=GOPROXY=https://goproxy.cn
run --action_env=GOPROXY=https://goproxy.cn

# 设置GOSUMDB
test --action_env=GOSUMDB=goproxy.cn/sumdb/sum.golang.org
build --action_env=GOSUMDB=goproxy.cn/sumdb/sum.golang.org
run --action_env=GOSUMDB=goproxy.cn/sumdb/sum.golang.org

# 设置编译目标平台
build --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64
run --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64
```

## 一个最简单的Golang程序构建

最简单的Bazel构建文件只需要两个：`WORKSPACE`和`BUILD.bazel`。

以下是项目的目录树：

```bash
project
├─ BUILD.bazel
├─ WORKSPACE
├─ greeter_test.go
├─ greeter.go
├─ main.go
```

三个go源码如下：

- greeter.go

    ```go
    package greeter
    
    func Greet() string {
    	return "Hello, Dear!"
    }
    ```

- greeter_test.go

    ```go
    package greeter
    
    import (
    	"testing"
    )
    
    func TestGreeter(t *testing.T) {
    	got := Greet()
    	want := "Hello, Dear!"
    	if got != want {
    		t.Errorf(`Greet() = %q, want %q`, got, want)
    	}
    }
    ```

- main.go

    ```go
    package main
    
    import (
    	"fmt"
    
    	"github.com/tx7do/bazel-golang-minimal-example/greeter"
    )
    
    func main() {
    	fmt.Printf(greeter.Greet())
    }
    ```

两个Bazel配置文件如下：

- WORKSPACE

    ```python
    # 定义工作环境名称
    workspace(name = "com_github_tx7do_bazel_golang_minimal_example")
    
    # 导入http_archive方法
    load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
    
    # 下载rules_go
    http_archive(
        name = "io_bazel_rules_go",
        sha256 = "56d8c5a5c91e1af73eca71a6fab2ced959b67c86d12ba37feedb0a2dfea441a6",
        urls = [
            "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
            "https://github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
        ],
    )
    
    # 导入go_register_toolchains和go_rules_dependencies方法
    load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
    
    # 初始化go规则集的依赖项
    go_rules_dependencies()
    
    # 注册go 1.19.5版本的工具链，包含下载安装go环境。
    go_register_toolchains(version = "1.19.5")
    ```

- BUILD.bazel

    ```python
    # 导入go_binary、go_test、go_library方法
    load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library", "go_test")
    
    # 构建二进制程序
    go_binary(
        name = "main",
        srcs = ["main.go"],
        deps = [":greeter"],
    )
    
    # 构建库
    go_library(
        name = "greeter",
        importpath = "github.com/tx7do/bazel-golang-minimal-example/greeter",
        srcs = ["greeter.go"],
    )
    
    # 构建单元测试
    go_test(
        name = "greeter_test",
        srcs = [ "greeter_test.go" ],
        embed = [ ":greeter" ],
    )
    ```

在这个示例里面，我们只使用到了Bazel能够支持go语言的`rules_go`规则集。

在`BUILD.bazel`里面，我们定义了3个构建目标：

- `//:main`

    这是构建主程序二进制可执行程序的构建目标。

- `//:greeter`

    这是构建库文件的构建目标。

- `//:greeter_test`

    这是构建单元测试二进制可执行程序的构建目标。

对于go来说，库的构建目标通常不是我们需要关注的。平时我们只需要关注主程序的构建和单元测试的构建。

只是构建二进制可执行文件，我们只需要使用`bazel build`命令：

```bash
bazel build //:greeter_test
bazel build //:main
```

我们要直接运行程序的话，那么可以使用`bazel run`命令，它将构建出二进制可执行文件，然后执行它：

```bash
bazel run //:greeter_test
bazel run //:main
```

到这里，我们就完成了使用Bazel构建一个最简单golang程序的全过程。

Bazel本身虽然很复杂，但是，上手使用还是很简单的。甚至比Make还要简单。何况Make还有个问题，在Windows下面使用极不友好，很多功能用不了。Bazel则不存在这样的问题，各操作系统都可以无障碍使用。

完整代码请见：<https://github.com/tx7do/bazel-golang-minimal-example>

## 使用Gazelle

有了Bazel的使用基础，`rules_go`的使用基础。我们现在可以学习使用Bazel下的一个神器：[Gazelle](https://github.com/bazelbuild/bazel-gazelle)。

Gazelle 是一个自动生成 Bazel 编译文件的工具，包括给 `WORKSPACE` 添加外部依赖、扫描源文件依赖自动生成`BUILD.bazel`文件等。Gazelle 原生支持Go和 protobuf。

Gazelle 可以使用 bazel 命令结合 [gazelle_rule](https://github.com/bazelbuild/bazel-gazelle) 运行：`bazel run //:gazelle`。也可以下载使用单独的 Gazelle 的命令行工具：`go install github.com/bazelbuild/bazel-gazelle/cmd/gazelle@latest`。

### 自动添加外部依赖

Bazel是无法感知`go.mod`当中的golang依赖项的，但是，Bazel的沙箱是构建了一个全新的构建环境，所以，它必须要感知到`go.mod`当中的golang依赖项，不然Bazel无法进行拉取、管理和编译构建。Gazelle正好提供了相关的功能：

首先是依赖库的导入：

```python
load("@bazel_gazelle//:deps.bzl", "go_repository")

go_repository(
    name = "org_uber_go_zap",
    build_file_proto_mode = "disable",
    importpath = "go.uber.org/zap",
    sum = "h1:FiJd5l1UOLj0wCgbSE0rwwXHzEdAZS6hiiSnxJN/D60=",
    version = "v1.24.0",
)
```

只要添加了以上代码之后，Bazel就能够拉取并构建Uber的`zap`库了。

接着，就是从`go.mod`或者`go.work`中导入依赖项了：

```bash
bazel run //:gazelle update-repos -from_file=go.mod
bazel run //:gazelle update-repos -from_file=go.work
```

或者

```bash
gazelle update-repos -from_file=go.mod
gazelle update-repos -from_file=go.work
```

运行以上的命令之后，gazelle就会把依赖项都导入到`WORKSPACE`。

如果你觉得go的依赖库太多，你不想要把依赖项导入到`WORKSPACE`，那么可以添加参数`-to_macro=repositories.bzl%go_repositories`，这样依赖项都会被导入到`repositories.bzl`文件里面去了，并且生成一个`go_repositories`方法，所有的`go_repository`方法将被置于`go_repositories`方法之下：

```python
load("@bazel_gazelle//:deps.bzl", "go_repository")

def go_dependencies():
    go_repository(
        name = "org_uber_go_zap",
        build_file_proto_mode = "disable",
        importpath = "go.uber.org/zap",
        sum = "h1:FiJd5l1UOLj0wCgbSE0rwwXHzEdAZS6hiiSnxJN/D60=",
        version = "v1.24.0",
    )
```

并且在`WORKSPACE`中添加调用方法：

```python
load("//:repos.bzl", "go_dependencies")

# gazelle:repository_macro repositories.bzl%go_dependencies
go_dependencies()
```

导入和生成代码的命令现在就是：

```bash
bazel run //:gazelle update-repos -from_file=go.mod -to_macro=repositories.bzl%go_repositories
bazel run //:gazelle update-repos -from_file=go.work -to_macro=repositories.bzl%go_repositories
```

或者

```bash
gazelle update-repos -from_file=go.mod -to_macro=repositories.bzl%go_repositories
gazelle update-repos -from_file=go.work -to_macro=repositories.bzl%go_repositories
```

有的人可能会嫌弃写这么多的参数，累。那么，你可以在`BUILD.bazel`里面这样定义：

```python
gazelle(
    name = "gazelle-update-repos",
    args = [
        "-from_file=go.mod",
        "-to_macro=repositories.bzl%go_dependencies",
        "-prune",
        "-build_file_proto_mode=disable",
    ],
    command = "update-repos",
)
```

现在你只需要执行以下命令就可以了：

```bash
bazel run //:gazelle-update-repos
```

### 自动生成构建文件

在上一节里面我们可知，每一个源文件我们都需要通过`go_binary`、`go_test`、`go_library`方法引入到构建文件。

文件少的情况下，勉强还能接受，一个项目成千上万的源文件，这无法接受。还好，gazelle能够帮我们做这脏活累活。

我们只需要两步：

1. 向项目根目录下的`BUILD.bazel`添加以下代码：

    ```python
    load("@bazel_gazelle//:def.bzl", "gazelle")
    
    # gazelle:prefix github.com/tx7do/bazel-containers-hasher-example
    gazelle(name = "gazelle")
    ```

    > 需要注意的是 `#` 后面的内容 `gazelle:XXXX YYYYY` 对于 Bazel 而言是注释，对于 Gazelle 来说却是一种 [注解指令（Directive）](https://github.com/bazelbuild/bazel-gazelle#id14)，会被 Gazelle 运行时所解析使用。

2. 执行命令生成：

    ```bash
    bazel run //:gazelle
    ```

## 如何把Golang程序打包成Docker镜像

要打包Docker镜像，我们只需要[rules_docker](https://github.com/bazelbuild/rules_docker)规则包。

在`WORKSPACE`中获取依赖：

```python
## 下载rules_docker
http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "b1e80761a8a8243d03ebca8845e9cc1ba6c82ce7c5179ce2b295cd36f7e394bf",
    urls = [
        "https://github.com/bazelbuild/rules_docker/releases/download/v0.25.0/rules_docker-v0.25.0.tar.gz",
    ],
)

# 导入container_repositories方法
load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

# 导入container_deps方法
load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

# 导入container_pull方法
load("@io_bazel_rules_docker//container:pull.bzl", "container_pull")

# 拉取Alpine Linux
# 该发行版使用musl libc，并且缺乏一些调试工具。
container_pull(
    name = "alpine_linux_amd64",
    registry = "index.docker.io",
    repository = "library/alpine",
    tag = "latest",
)
```

`rules_docker`规则包提供了两个方法`container_image`和`container_push`：

- `container_image`用于生成Docker镜像

    ```python
    container_image(
        # 镜像名，可用于：编译目标名，镜像标签。
        name = "image",
        base = "@alpine_linux_amd64//image",
    
        # https://docs.docker.com/engine/reference/builder/#entrypoint
        entrypoint = ["./api"],
    
        # 存放files/tars/debs文件的路径
        directory = "/app/cmd",
    
        # https://docs.docker.com/engine/reference/builder/#workdir
        workdir = "/app/cmd",
    
        # 需要打包进镜像去的文件
        files = [
            ":api",
        ],
    
        # 资源库的用户名
        repository = "tx7do",
    )
    ```

- `container_push`用于推送镜像到DockerHub

    ```python
    # 最终产生的镜像，拉取命令为：docker pull tx7do/bazel-hasher:latest
    container_push(
        name = "image-push",
        # 镜像的格式，可选项：Docker、OCI；默认为：Docker。
        format = "Docker",
        # 要被推送的镜像
        image = ":image",
        # 镜像库的注册链接
        registry = "index.docker.io",
        ## 目标镜像库中的镜像名
        repository = "tx7do/bazel-hasher",
        # 镜像标签
        tag = "latest",
    )
    ```

现在，我们使用以下命令用于Docker镜像构建之上：

- `bazel build //cmd/api:image`

    该命令将会生成Docker镜像构成的文件：`[name].tar`、`[name].digest`、`[name]-layer.tar`等。

- `bazel run //cmd/api:image`

    该命令将会生成Docker镜像构成的文件，并且导入到本地Docker里。等同于`docker load`命令。我们可以在本地使用`docker images`命令查看。

- `bazel run //cmd/api:image-push`

    该命令将会生成Docker镜像构成的文件，并且推送到远端的DockerHub里去。等同于`docker push`命令。我们可以在<https://hub.docker.com>查看推送上去的镜像。

到这里，有的同学会问到：Dockerfile在哪里？没错，我们不需要Dockerfile，只需要在Bazel构建文件里面添加这两个方法就搞定了。大大的简化了Docker打包的工作，而且比手打Dockerfile更可靠，不易出错。

完整代码请见：<https://github.com/tx7do/bazel-containers-hasher-example>

## Kratos微服务项目的构建

我开源了一个基于Kratos开发的CMS项目：[Kratos-Blog](https://github.com/tx7do/kratos-blog)。它是一个Monorepo代码库的项目。

我们基于这个项目来讲解Kratos微服务项目的Bazel构建。

虽然，项目变大了。但是，大部分都是基于上面两节来做的。这一节就一些差异性来单独讲解一下。

首先，我把规则包的下载提取到了`DOWNLOAD.bzl`：

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def download_package():
    # 下载 Bazel Go语言 规则集
    if not native.existing_rule("io_bazel_rules_go"):
        http_archive(
            name = "io_bazel_rules_go",
            sha256 = "56d8c5a5c91e1af73eca71a6fab2ced959b67c86d12ba37feedb0a2dfea441a6",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
                "https://github.com/bazelbuild/rules_go/releases/download/v0.37.0/rules_go-v0.37.0.zip",
            ],
        )

    # 下载 Bazel Gazelle 规则集
    if not native.existing_rule("bazel_gazelle"):
        http_archive(
            name = "bazel_gazelle",
            sha256 = "ecba0f04f96b4960a5b250c8e8eeec42281035970aa8852dda73098274d14a1d",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.29.0/bazel-gazelle-v0.29.0.tar.gz",
                "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.29.0/bazel-gazelle-v0.29.0.tar.gz",
            ],
        )

    # 下载 Bazel 工具方法集
    if not native.existing_rule("bazel_skylib"):
        http_archive(
            name = "bazel_skylib",
            sha256 = "74d544d96f4a5bb630d465ca8bbcfe231e3594e5aae57e1edbf17a6eb3ca2506",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.3.0/bazel-skylib-1.3.0.tar.gz",
                "https://github.com/bazelbuild/bazel-skylib/releases/download/1.3.0/bazel-skylib-1.3.0.tar.gz",
            ],
        )

    # 下载 Bazel Docker 规则集
    if not native.existing_rule("io_bazel_rules_docker"):
        http_archive(
            name = "io_bazel_rules_docker",
            sha256 = "b1e80761a8a8243d03ebca8845e9cc1ba6c82ce7c5179ce2b295cd36f7e394bf",
            urls = [
                "https://github.com/bazelbuild/rules_docker/releases/download/v0.25.0/rules_docker-v0.25.0.tar.gz"
            ],
        )

    # 下载 Bazel Kubernetes 规则集
    if not native.existing_rule("io_bazel_rules_k8s"):
        http_archive(
            name = "io_bazel_rules_k8s",
            sha256 = "ce5b9bc0926681e2e7f2147b49096f143e6cbc783e71bc1d4f36ca76b00e6f4a",
            strip_prefix = "rules_k8s-0.7",
            urls = ["https://github.com/bazelbuild/rules_k8s/archive/refs/tags/v0.7.tar.gz"],
        )

    # 下载 Bazel 构建压缩包（tar、zip、deb 和 rpm） 规则集
    if not native.existing_rule("rules_pkg"):
        http_archive(
            name = "rules_pkg",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.8.0/rules_pkg-0.8.0.tar.gz",
                "https://github.com/bazelbuild/rules_pkg/releases/download/0.8.0/rules_pkg-0.8.0.tar.gz",
            ],
            sha256 = "eea0f59c28a9241156a47d7a8e32db9122f3d50b505fae0f33de6ce4d9b61834",
        )

    # 下载 Bazel Buf 规则集
    if not native.existing_rule("rules_buf"):
        http_archive(
            name = "rules_buf",
            sha256 = "523a4e06f0746661e092d083757263a249fedca535bd6dd819a8c50de074731a",
            strip_prefix = "rules_buf-0.1.1",
            urls = [
                "https://github.com/bufbuild/rules_buf/archive/refs/tags/v0.1.1.zip",
            ],
        )

    # 下载 Bazel Protobuf 规则集
    if not native.existing_rule("rules_proto"):
        http_archive(
            name = "rules_proto",
            sha256 = "66bfdf8782796239d3875d37e7de19b1d94301e8972b3cbd2446b332429b4df1",
            strip_prefix = "rules_proto-4.0.0",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
                "https://github.com/bazelbuild/rules_proto/archive/refs/tags/4.0.0.tar.gz",
            ],
        )

    # 下载 Bazel gRPC 规则集
    if not native.existing_rule("rules_proto_grpc"):
        http_archive(
            name = "rules_proto_grpc",
            sha256 = "fb7fc7a3c19a92b2f15ed7c4ffb2983e956625c1436f57a3430b897ba9864059",
            strip_prefix = "rules_proto_grpc-4.3.0",
            urls = [
                "https://github.com/rules-proto-grpc/rules_proto_grpc/archive/4.3.0.tar.gz"
            ],
        )

    # 下载 Bazel Protobuf 规则集
    if not native.existing_rule("build_stack_rules_proto"):
        # Release: v2.0.1
        # TargetCommitish: master
        # Date: 2022-10-20 02:38:27 +0000 UTC
        # URL: https://github.com/stackb/rules_proto/releases/tag/v2.0.1
        # Size: 2071295 (2.1 MB)
        http_archive(
            name = "build_stack_rules_proto",
            sha256 = "ac7e2966a78660e83e1ba84a06db6eda9a7659a841b6a7fd93028cd8757afbfb",
            strip_prefix = "rules_proto-2.0.1",
            urls = [
                "https://github.com/stackb/rules_proto/archive/v2.0.1.tar.gz"
            ],
        )

    # 下载 Bazel protoc工具
    if not native.existing_rule("com_google_protobuf"):
        http_archive(
            name = "com_google_protobuf",
            sha256 = "bc3dbf1f09dba1b2eb3f2f70352ee97b9049066c9040ce0c9b67fb3294e91e4b",
            strip_prefix = "protobuf-3.15.5",
            # latest, as of 2021-03-08
            urls = [
                "https://github.com/protocolbuffers/protobuf/archive/v3.15.5.tar.gz",
                "https://mirror.bazel.build/github.com/protocolbuffers/protobuf/archive/v3.15.5.tar.gz",
            ],
        )
```

然后在`WORKSPACE`当中调用：

```python
load("//:DOWNLOAD.bzl", "download_package")

download_package()
```

关于Docker打包这一块的功能，我提取出来一个方法`publish_service`到`docker.bzl`：

```python
load("@io_bazel_rules_docker//container:container.bzl", "container_image", "container_layer", "container_push")

# 发布服务
def publish_service(service_name, repository_name = "", repository_version = "", publish = False):
    service_new_name = "{}-service".format(service_name)
    image_name = "{}-service-image".format(service_name)
    conf_file_group_name = "{}-service-configs".format(service_name)
    conf_layer_name = "{}-service-configs-layer".format(service_name)

    app_path = "/app/{}/service/bin".format(service_name)
    conf_path = "/app/{}/service/configs".format(service_name)

    if repository_version == "":
        repository_version = "{BUILD_TIMESTAMP}"

    # 为服务的编译目标定义一个别名
    native.alias(
        name = service_new_name,
        actual = "//app/{}/service/cmd/server:server".format(service_name),
        visibility = ["//visibility:private"],
    )

    # 将配置文件打包
    native.filegroup(
        name = conf_file_group_name,
        srcs = native.glob(["app/{}/service/configs/**".format(service_name)]),
        visibility = ["//visibility:public"],
    )

    container_layer(
        name = conf_layer_name,
        directory = "/{}".format(conf_path),
        files = [
            "//:{}".format(conf_file_group_name),
        ],
        mode = "0o755",
        visibility = ["//visibility:public"],
    )

    # 生成Docker镜像
    container_image(
        # 镜像名，可用于：编译目标名，镜像标签。
        name = image_name,

        # OS
        base = "@slim_linux_amd64//image",

        # 容器启动时运行的命令
        # https://docs.docker.com/engine/reference/builder/#entrypoint
        entrypoint = [
            "./server",
            "-conf",
            "../configs",
            "-chost",
            "host.docker.internal:8500",
            "-ctype",
            "consul",
        ],

        # 存放files/tars/debs文件的路径
        directory = app_path,

        # https://docs.docker.com/engine/reference/builder/#workdir
        workdir = app_path,

        # https://docs.docker.com/engine/reference/builder/#user
        # user = "appuser",

        # 需要打包进镜像去的文件
        files = [
            "//:{}".format(service_new_name),
        ],
        layers = ["//:{}".format(conf_layer_name)],

        # 资源库的用户名
        repository = repository_name,
    )

    # 推送到DockerHub
    if publish:
        container_push(
            name = "{}-push".format(image_name),
            # 镜像的格式，可选项：Docker、OCI；默认为：Docker。
            format = "Docker",
            # 要被推送的镜像
            image = "//:{}".format(image_name),
            # 镜像库的注册链接
            registry = "index.docker.io",
            ## 目标镜像库中的镜像名
            repository = "{}/kratoscms-{}-service".format(repository_name, service_name),
            # 镜像标签
            tag = repository_version,
        )
```

此方法在根目录下的`BUILD.bazel`当中调用：

```python
load("//:docker.bzl", "publish_service")

repository_name = "tx7do"

repository_version = "latest"

push_container = False

publish_service("user", repository_name, repository_version, push_container)

publish_service("file", repository_name, repository_version, push_container)

publish_service("content", repository_name, repository_version, push_container)

publish_service("comment", repository_name, repository_version, push_container)

publish_service("admin", repository_name, repository_version, push_container)
```

`publish_service`方法是需要重点讲一下的。

`alias`是为服务的编译目标命名了一个别名，这样的话，之前编译的命令是：`bazel build //app/admin/service/cmd/server:server`，现在就简化成了：`bazel build //:admin-service`。

`filegroup`可以把一些文件打包拷贝，在这里我是为了拷贝配置文件。接着，再把文件组使用`container_layer`打成一个容器层，使用`container_layer`有两个目的：一个是设置权限，一个是设置文件的路径。这一个容器层通过`container_image`方法的`layers`参数传入，打成一整个容器镜像。

最开始的时候，我使用了`Alpine Linux`这个基础容器层，但是发现直接打包无法运行程序，后来改到了`Debian-Slim`就没问题了。拉取Linux镜像的Bazel代码附下：

```python
load("@io_bazel_rules_docker//container:pull.bzl", "container_pull")

# 拉取Alpine Linux
# 该发行版使用musl libc，并且缺乏一些调试工具。
container_pull(
    name = "alpine_linux_amd64",
    registry = "index.docker.io",
    repository = "library/alpine",
    tag = "latest",
)

# 拉取Debian-Slim Linux
container_pull(
    name = "slim_linux_amd64",
    registry = "index.docker.io",
    repository = "library/debian",
    tag = "stable-slim",
)

# 拉取Centos Linux
container_pull(
    name = "centos_linux_amd64",
    registry = "index.docker.io",
    repository = "library/centos",
    tag = "7",
)

# 拉取Ubuntu Linux
container_pull(
    name = "ubuntu_linux_amd64",
    registry = "index.docker.io",
    repository = "library/ubuntu",
    tag = "latest",
)
```

我们现在可以通过以下命令来构建某一个服务：

```bash
bazel build //:admin-service
bazel build //:comment-service
bazel build //:content-service
bazel build //:file-service
bazel build //:user-service
```

运行某一个服务：

```bash
bazel run //:admin-service
bazel run //:comment-service
bazel run //:content-service
bazel run //:file-service
bazel run //:user-service
```

生成服务的Docker镜像文件：

```bash
bazel build //:admin-service-image
bazel build //:comment-service-image
bazel build //:content-service-image
bazel build //:file-service-image
bazel build //:user-service-image
```

推送到DockerHub：

```bash
bazel run //:admin-service-image-push
bazel run //:comment-service-image-push
bazel run //:content-service-image-push
bazel run //:file-service-image-push
bazel run //:user-service-image-push
```

完整代码请见：<https://github.com/tx7do/kratos-blog>

## 关于Protobuf的构建

Bazel原生就支持Protobuf的构建，但是我用起来的时候发现有点麻烦，就暂时没有用了，我直接把生成的代码也一并提交到了代码库去了。

我用了Gazelle的注解关闭掉了Protobuf协议的代码生成功能：

```python
# gazelle:proto disable
# gazelle:exclude api
```

`gazelle:proto`这个注解设置为`disable`关闭掉整个的代码生成。

`gazelle:exclude`这个注解把Protobuf的协议所在文件夹排除构建范围。

还有就是需要在`bazel update-repos`命令里面添加一个参数`-build_file_proto_mode`，将它设置为`disable`。

## 参考资料

1. [Bazel - 官方网站](https://bazel.build/install)
2. [Bazel - Github](https://github.com/bazelbuild/bazel)
3. [编译工具之Bazel vs Make](https://zhuanlan.zhihu.com/p/545697517)
4. [5 分钟搞懂 Monorepo](https://xie.infoq.cn/article/4f870ba6a7c8e0fd825295c92)
5. [Golang with bazel: Part-1 Setup](https://medium.com/@shubhamagrawal094/golang-with-bazel-part-1-setup-5aca659a8ccb)
6. [Golang with Bazel](https://medium.com/@simontoth/golang-with-bazel-2b5310d4ce48)
7. [BUILDING A GO PROJECT USING BAZEL](https://www.tweag.io/blog/2021-09-08-rules_go-gazelle/)
8. [BUILDING GO APPLICATIONS WITH BAZEL](https://brendanjryan.com/2018/05/12/building-go-applications-with-bazel.html)
9. [Bazel 学习笔记 (四) 创建宏与规则](https://zhuanlan.zhihu.com/p/421489117)
10. [使用genrule如何从makefile向bazel转变](https://www.yisu.com/zixun/517348.html)
11. [Bazel Build: 命令行](https://www.jianshu.com/p/b9ccb8fef4ec)
12. [Protobuf and gRPC rules for Bazel](https://rules-proto-grpc.com/en/latest/)
13. [Protocol Buffers in Bazel](https://blog.bazel.build/2017/02/27/protocol-buffers.html)
14. [容器技术原理(一)：从根本上认识容器镜像](https://waynerv.com/posts/container-fundamentals-learn-container-with-oci-spec/)
15. [Bazel 构建 Golang 项目](https://www.qtmuniao.com/2019/12/07/bazel-build-golang/)
