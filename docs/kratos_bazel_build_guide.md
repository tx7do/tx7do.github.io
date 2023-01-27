# Kratos微服务工程Bazel构建指南

Kratos是一个微服务框架，既然是微服务，那么一个工程会存在不少的服务，服务的数量只要一多起来，其构建和自动构建就可能产生巨大的问题。

现在，有越来越多的组织和团队都开始选择使用Monorepo来管理整个工程的代码库。所谓的Monorepo，说白一点，就是把工程下所有的项目都放置在仅有的一个代码库下。

Monorepo的代码库，工程的项目结构清晰，更容易管理。在构建和自动构建上也更好操作。谷歌出了一个构建工具[Bazel](https://bazel.build)，它是非常适合Monorepo的一个构建工具。

## Bazel是什么？

Bazel 是一个类似于 Make 的工具，是 Google 为其内部软件开发的特点量身定制的工具，如今 Google 使用它来构建内部大多数的软件。它的功能有诸多亮点：

**多语言支持**：构建和测试 Java、C++、Android、iOS、Go 和各种其他语言平台。Bazel 可以在 Windows、macOS 和 Linux 上运行。

**高级构建描述语言**：项目是使用一种叫 BUILD 的语言来描述的，它是一种简洁的文本语言，它把一个项目视为一个集合，这个集合由一些互相关联的库、二进制文件和测试用例组成。相反，像 Make 这样的工具，需要去描述每个文件如何调用编译器。

**多平台支持**：同一套工具和相同的 BUILD 文件可以用来为不同的体系结构构建软件，甚至是不同的平台。在 Google，Bazel 被同时用在数据中心系统中的服务器应用和手机端的移动应用上。

**可重复性**：在 BUILD 文件中，每个库、测试用例和二进制文件都需要明确指定它们的依赖关系。当一个源码文件被修改时，Bazel 凭这些依赖来判断哪些部分需要重新构建，以及哪些任务可以并行进行。这意味着所有构建都是增量的，并且相同构建总是产生一样的结果。

**可伸缩性**：Bazel 可以处理大型项目；在 Google，一个服务器软件有十万行代码是很常见的，在什么都不改的前提下重新构建这样一个项目，大概只需要 200 毫秒。

对于为什么要重新发明一个构建工具而不直接使用 Make，Google 认为 Make 控制得太细，最终的结果完全依靠开发人员能正确编写规则。很久以前，Google 使用自动生成的臃肿的 Makefile 来构建他们的软件，速度太慢，结果不可靠，最终影响了研发人员的效率和公司的敏捷性。所以他们做了 Bazel。Bazel 的规则层次更高，比如，对于“Java 测试”、“C++ 二进制文件”，它都有定义好的内建规则，而这些规则都已经被无数的测试证明是正确和稳定的。

由于支持多种语言和快速构建，它非常适合 Monorepo 代码库。

## 什么是Monorepo、Polyrepo？

由于谷歌在 Monorepo 上的实践，Monorepo 受到了越来越多的关注。Monorepo 意味着把所有项目的所有代码统一维护在一个单一的代码版本库中，和多代码库(Polyrepo、Multirepos)方案相比，两者各有优劣，需要根据公司文化和产品特性进行取舍。

### 什么是 单一代码库 (Monorepo) ？

Monorepo 的意思是在版本控制系统的单个代码库里包含了许多项目的代码。这些项目虽然有可能是相关的，但通常在逻辑上是独立的，并由不同的团队维护。

有些公司将所有代码存储在一个代码库中，由所有人共享，因此 Monorepos 可以非常大。例如，理论上谷歌拥有有史以来最大的代码库，每天有成百上千次提交，整个代码库超过 80 TB。其他已知运营大型单一代码库的公司还有微软、Facebook 和 Twitter。

Monorepos 有时被称为单体代码库（monolithic repositories），但不应该与单体架构（monolithic architecture）相混淆，单体架构是一种用于编写自包含应用程序的软件开发实践。这方面的一个例子就是 Ruby on Rails，它可以处理 Web、API 和后端工作。

### 什么是 多代码库 (Polyrepo、Multirepos) ？

与单一代码库相反的是多代码库（multirepos），每个项目都储存在一个完全独立的、版本控制的代码库中。多代码库是很自然的选择——我们大多数人在开始一个新项目时都愿意开一个新的代码库，毕竟，谁都喜欢从 0 开始.

从多代码库到单一代码库的变化就意味着将所有项目移到一个代码库中。

多代码库不是微服务（MicroServices）的同义词，两者之间并没有耦合关系。事实上，我们稍后将讨论将单一代码库和微服务结合起来的例子。只要仔细设置用于部署的 CI/CD 流水线[2]，单一代码库就可以托管任意数量的微服务。

### 单一代码库的好处

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

### 单一代码库的缺陷

随着单一代码库的发展，我们在版本控制工具、构建系统和持续集成流水线方面达到了设计极限。这些问题可能会让一家公司走上多代码库的道路：

**性能差（Bad performance）**：单一代码库难以扩大规模，像 git blame 这样的命令可能会不合理的花费很长时间执行，IDE 也开始变得缓慢，生产力受到影响，对每个提交测试整个 repo 变得不可行。

**破坏主线（Broken main/master）**：主线损坏会影响到在单一代码库中工作的每个人，这既可以被看作是灾难，也可以看作是保证测试既可以保持简洁又可以跟上开发的好机会。

**学习曲线（Learning curve）**：如果代码库包含了许多紧密耦合的项目，那么新成员的学习曲线会更陡峭。

**大量的数据（Large volumes of data）**：单一代码库每天都要处理大量的数据和提交。

**所有权（Ownership）**：维护文件的所有权更有挑战性，因为像 Git 或 Mercurial 这样的系统没有内置的目录权限。

**代码审查（Code reviews）**：通知可能会变得非常嘈杂。例如，GitHub 有有限的通知设置，不适合大量的 pull request 和 code review。

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

## 安装Gazelle

```shell
go install github.com/bazelbuild/bazel-gazelle/cmd/gazelle@latest
```

## Bazel工程文件组成

Bazel有两种工程文件组成：`WORKSPACE` 和 `BUILD.bazel`。

### WORKSPACE

WORKSPACE文件 通常放置于工程的根目录下面，此文件用于将整个文件夹以及以下的所有文件标识为Bazel的工作区。

### BUILD.bazel

它告诉 bazel 如何构建项目的不同部分。每个子项目都有自己的 BUILD.bazel 文件。我们可以使用gazelle工具自动生成BUILD.bazel文件（不包括root BUILD.bazel）。Gazelle 是 Bazel 项目的构建文件生成器。

## Bazel命令

### bazel run

```shell
bazel run //hello-world:hello-world
```

### bazel build

### bazel test

### bazel clean

### bazel query


## 参考资料

- [Bazel - 官方网站](https://bazel.build/install)
- [Bazel - Github](https://github.com/bazelbuild/bazel)
- [编译工具之Bazel vs Make](https://zhuanlan.zhihu.com/p/545697517)
- [5 分钟搞懂 Monorepo](https://xie.infoq.cn/article/4f870ba6a7c8e0fd825295c92)
- [Golang with bazel: Part-1 Setup](https://medium.com/@shubhamagrawal094/golang-with-bazel-part-1-setup-5aca659a8ccb)
- [Golang with Bazel](https://medium.com/@simontoth/golang-with-bazel-2b5310d4ce48)
- [BUILDING A GO PROJECT USING BAZEL](https://www.tweag.io/blog/2021-09-08-rules_go-gazelle/)
- [BUILDING GO APPLICATIONS WITH BAZEL](https://brendanjryan.com/2018/05/12/building-go-applications-with-bazel.html)
- [Bazel 学习笔记 (四) 创建宏与规则](https://zhuanlan.zhihu.com/p/421489117)
- [使用genrule如何从makefile向bazel转变](https://www.yisu.com/zixun/517348.html)
- [Bazel Build: 命令行](https://www.jianshu.com/p/b9ccb8fef4ec)
- [Protobuf and gRPC rules for Bazel](https://rules-proto-grpc.com/en/latest/)
- [Protocol Buffers in Bazel](https://blog.bazel.build/2017/02/27/protocol-buffers.html)
