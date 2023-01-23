# 使用Bazel构建Golang程序

在这篇简短的文章中，我们将介绍如何将 Golang 与 Bazel 构建系统结合使用。

具体来说，我们将讨论三个场景：

1. 从头开始一个 Golang 项目；
2. 将一个现有的 Golang 项目转换为 Bazel 构建；
3. 以及将一个外部 Golang 项目拉入您的 Bazel 构建系统。

## 从头开始一个 Golang 项目

让我们从将 Go 与 Bazel 结合使用的基础知识开始。

为此，我们需要从 <https://github.com/bazelbuild/rules_go> 获取 Go 语言的官方构建规则。

在配置部分，您会发现：我们需要将以下这段 `Starlark` 语言代码，放入名为 `WORKSPACE` 的配置文件里面：

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "8e968b5fcea1d2d64071872b12737bbb5514524ee5f0a4f54f5920266c261acb",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains(version = "1.16.5")
```

让我们逐步了解这段代码所做的事情。

首先，我们使用`load`指令来加载并提取新功能，以在 Bazel 文件当中能够使用该功能。我们调用了两次`load`指令，第一次用于导入下载 HTTP 代码库的能力，第二次则是从刚下载的代码库中加载特定于 Go 的命令。

对于导入本身，我们需要提供一个导入名称。通常的命名方案是：逆反域名，后面跟命名空间和项目名称；并需将`/`和`.`全部都转换为下划线`_`。例如：`github.com/user/project`变成`com_github_user_project`。`io_bazel_rules_go`这个项目由于是Bazel官方项目中的一部分，所以它使用的是`bazel.io`而不是`github.com`。

如果您并不熟悉 Bazel，那么，您需要了解到：实际的构建配置是通过`BUILD`文件完成的。我们可以将 Go 视为任何其他语言，并使用遵循相同结构的规则：`go_binary`、`go_library`和`go_test`。我在我的 Github 上准备了一个最小化的例子：<https://github.com/HappyCerberus/bazel-golang-minimal-example>。您会注意到，我们需要从导入的`io_bazel_rules_go`代码库中加载这些规则，以使其在`BUILD`文件中可用。

## 将现有项目转换为 Bazel 构建

现在我们知道，从头全新开始是很容易。但是，如果您已经有一个 Golang 项目，并且需要将其转换为 使用 Bazel 构建怎么办？为此，我们需要使用 Bazel 官方项目中提供的另一个工具 `Gazelle` ( <https://github.com/bazelbuild/bazel-gazelle> )。

为了演示，我将使用一个第三方项目 ( <https://github.com/aler9/rtsp-simple-server> )，我目前正在为即将到来的系统设计课程修改该项目。

首先，我们需要创建一个`WORKSPACE`文件，并从 `Gazelle` 代码库的设置部分复制粘贴代码。

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "8e968b5fcea1d2d64071872b12737bbb5514524ee5f0a4f54f5920266c261acb",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip",
    ],
)

http_archive(
    name = "bazel_gazelle",
    sha256 = "62ca106be173579c0a167deb23358fdfe71ffa1e4cfdddf5582af26520f1c66f",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

go_rules_dependencies()

go_register_toolchains(version = "1.16.5")

gazelle_dependencies()
```

您会注意到，上述代码也导入了上一节中所提到的规则。

现在，要真正运行 Gazelle，我们需要将以下代码添加到我们的主`BUILD`文件中：

```python
load("@bazel_gazelle//:def.bzl", "gazelle")

# gazelle:prefix github.com/aler9/rtsp-simple-server 
gazelle(name = "gazelle")
```

`gazelle:prefix`注释后面的路径是整个项目所使用的 Go 导入路径。例如，`main.go`中有以下包的导入：

```go
import (
    "os"
    "github.com/aler9/rtsp-simple-server/internal/core"
)
```

至此，我们终于可以真正运行Gazelle，让它`BUILD`为我们的项目生成文件了。

```bash
bazel run //:gazelle
```

之后，我们应该`BUILD`自动生成项目的所有文件：

```bash
git status

On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
 BUILD
 WORKSPACE
 bazel-bin
 bazel-out
 bazel-test
 bazel-testlogs
 internal/aac/BUILD.bazel
 internal/conf/BUILD.bazel
 internal/confenv/BUILD.bazel
 internal/confwatcher/BUILD.bazel
 internal/core/BUILD.bazel
 internal/externalcmd/BUILD.bazel
 internal/h264/BUILD.bazel
 internal/hls/BUILD.bazel
 internal/logger/BUILD.bazel
 internal/rlimit/BUILD.bazel
 internal/rtcpsenderset/BUILD.bazel
 internal/rtmp/BUILD.bazel
nothing added to commit but untracked files present (use "git add" to track)
```

但是，如果您尝试使用`bazel build //...`命令构建项目，实际上您会看到许多关于未定义代码库的错误。这是因为我们仍然缺少项目依赖项的定义。然而，Gazelle 连这件事也可以为我们办好（`to_macro`参数是可选的）：

```bash
bazel run //:gazelle -- update-repos -from_file=go.mod -to_macro=deps.bzl%go_dependencies
```

此命令将生成一个文件名为`deps.bzl`的新文件（如果我们在`WORKSPACE`中有使用`repository_macro`指令定义过，那么我们省略该`to_macro`指令），加载该文件，以导入构建项目所需的所有代码库。

```python
load("@bazel_gazelle//:deps.bzl", "go_repository")
def go_dependencies():
    go_repository(
        name = "com_github_alecthomas_template",
        importpath = "github.com/alecthomas/template",
        sum = "h1:JYp7IbQjafoB+tBA3gMyHYHrpOtNuDiK/uB5uXxq5wM=",
        version = "v0.0.0-20190718012654-fb15b899a751",
    )
    go_repository(
        name = "com_github_alecthomas_units",
        importpath = "github.com/alecthomas/units",
        sum = "h1:UQZhZ2O0vMHr2cI+DC1Mbh0TJxzA3RcLoMsFw+aXw7E=",
        version = "v0.0.0-20190924025748-f65c72e2690d",
    )
    go_repository(
        name = "com_github_aler9_gortsplib",
        importpath = "github.com/aler9/gortsplib",
        sum = "h1:Bf0hzdN1jUWsb5Mzezq1pd18EIBeKXxk5clIpHZJ1Lk=",
        version = "v0.0.0-20210724151831-dae5a1f04033",
    )
    go_repository(
...
```

在这个代码库里，我实际上遇到了一个小问题。构建仍然是失败的，因为它导入的`org_golang_x_tools`被错误地推断为依赖项（通过从`deps.bzl`中删除它来修复这个问题）。您可以在我的项目分支：<https://github.com/HappyCerberus/rtsp-simple-server>上看到`rtsp-simple-server`的最终结果。

您可以在后续继续使用 Gazelle 来管理依赖项，这也是您可以将代码库引入基于 Bazel 的项目而无需实际转换它的方法：

```bash
bazel run //:gazelle -- update-repos github.com/some/repo
```

## 密封测试（Hermetic tests）

您可能会遇到的最后一个问题是密封测试。如果您看到测试因访问被拒绝、文件未找到或操作不允许失败而失败，那是因为 Bazel 强制执行密封测试。这意味着每个测试都必须完全独立并且独立于任何其他测试。

对于单元测试，任何文件都需要作为测试的依赖项提供并通过运行文件机制访问（<https://github.com/bazelbuild/rules_go/blob/master/go/tools/bazel/runfiles.go>）。

环境变量中提供了每个测试的临时目录，您将使用`TEST_TMPDIR`而不是传统的`os.TempDir()`函数。

密封集成和系统测试需要从一开始就仔细设计，因此转换现有的此类测试可能很棘手。遗憾的是，我在这里没有放之四海而皆准的建议。

虽然将您的测试转换为密封测试可能很烦人，但这是一项值得的努力，它将为您带来更好的测试可重复性和更低的易碎性。

## 感谢您阅读

感谢您阅读本文。你喜欢吗？

我还在 YouTube 上发布视频：<https://youtube.com/c/simontoth>

如果您想聊天，请在 Twitter `@SimonToth83` 或 LinkedIn <https://linkedin.com/in/simontoth>上联系我。

## 原文

翻译自：[Golang With Bazel](https://medium.com/@simontoth/golang-with-bazel-2b5310d4ce48)
