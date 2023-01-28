# 使用 Bazel 创建Go应用程序的Docker容器镜像

如果你知道[Bazel](https://bazel.build/)，你就会知道它有多棒：它快速可靠。当您在使用多种服务的项目中工作时，甚至可能使用不同的语言，拥有一个快速可靠的构建系统，更重要的是，生成[确定性构建](https://bazel.build/faq.html#why-would-i-want-to-use-bazel)是关键。

但是，您可能不知道使用它`bazel`来构建容器镜像是多么容易。您将从使用`bazel`应用到您的镜像构建过程中获得所有好处。另外，您不必处理丑陋的`Dockerfiles`。

如果您想了解如何实施 `bazel` 来构建您的 `docker` 镜像，请继续阅读。

## 示例项目

> 您可以在 GitHub 中查看最终代码及其所有提交：
>
> <https://github.com/tx7do/bazel-containers-hasher-example>

我们的项目是一个用于密码加密和验证的 API。它将有两个接口：

### POST `/hash`

请求数据Body：

```json
{"plain": "string to hash"}
```

返回数据：

```json
{"hashed": "hashed string"}
```

### POST `/compare`

请求数据Body：

```json
{"hashed": "hashed string", "compare_to": "plaintext string"}
```

返回数据：

- `200 Ok` 如果 `compare_to` 的值等于 `hashed` 的值。
- `406 Not Acceptable` 不成功返回。

## 新建一个 bazel 项目

对于本指南，我们假设您已经安装并配置了[Bazel](https://docs.bazel.build/versions/master/install.html)和[Git](https://help.github.com/en/github/getting-started-with-github/set-up-git)。我们的项目文件将保存在`$GOPATH/src/github.com/{username}/examples-bazel-containers-hasher`（请记住替换`{username}`为您的实际 GitHub 用户名）。让我们从创建项目文件夹并启动 Git 代码库开始：

```bash
mkdir -p $GOPATH/src/github.com/schoren/examples-bazel-containers-hasher

cd $GOPATH/src/github.com/schoren/examples-bazel-containers-hasher

git init .
```

现在，让我们设置 Bazel，以便它可以在 go 中构建一个简单的 Hello World 程序。为此，我们必须在项目根目录中创建一个`WORKSPACE`文件，并加载`rules_go`，包括 `Gazelle`：

```python
## General rules
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

## rules_go
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "142dd33e38b563605f0d20e89d9ef9eda0fc3cb539a14be1bdb1350de2eda659",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.22.2/rules_go-v0.22.2.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.22.2/rules_go-v0.22.2.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains()

## Gazelle
http_archive(
    name = "bazel_gazelle",
    sha256 = "d8c45ee70ec39a57e7a05e5027c32b1576cc7f16d9dd37135b0eddde45cf1b10",
    urls = [
        "https://storage.googleapis.com/bazel-mirror/github.com/bazelbuild/bazel-gazelle/releases/download/v0.20.0/bazel-gazelle-v0.20.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.20.0/bazel-gazelle-v0.20.0.tar.gz",
    ],
)

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

gazelle_dependencies()
```

Gazelle 需要你在项目根目录设置一个`BUILD.bazel`文件来定义`//:gazelle`目标，并设置基础包名称：

```python
load("@bazel_gazelle//:def.bzl", "gazelle")

## This is a gazelle anotation, change the package 
# gazelle:prefix github.com/schoren/example-bazel-containers-hasher
gazelle(name = "gazelle")
```

要拉取所有新添加的Bazel依赖项，只需运行 Gazelle 就可以了：

```bash
bazel run //:gazelle
```

![gazelle_run](/assets/images/bazel/gazelle_run.png)

Bazel 在工作区根目录中生成和管理一些文件夹，这些文件夹不应提交到版本控制中，因此，让我们创建一个`.gitignore`文件，并添加以下内容：

```bash
/bazel-*
```

提交您的更改：

```bash
git add .
git commit -m "Setup Bazel with rules_go and Gazelle"
```

## 添加一个 hello world 示例代码

现在，让我们为我们的程序创建基本的项目结构。由于本文的重点是 docker 部分，因此我们不会过多介绍 go 代码。

我们将使用[Gorilla Mux](https://github.com/gorilla/mux)来进行HTTP路由处理，并使用`net/http`作为HTTP服务器实际所使用的go包。

首先，让我们为这个程序初始化`go mod`，它将处理我们的go依赖项：

```bash
go mod init
```

现在，让我们在`cmd/api`文件夹中创建一个`main`函数：

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"

    "github.com/gorilla/mux"
    "golang.org/x/crypto/bcrypt"
)

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/hash", hashHandler).Methods(http.MethodPost)
    r.HandleFunc("/compare", compareHandler).Methods(http.MethodPost)

    srv := &http.Server{
        Handler:      r,
        Addr:         ":8000",
        WriteTimeout: 1 * time.Second,
        ReadTimeout:  1 * time.Second,
    }

    log.Println("Start serving...")
    log.Fatal(srv.ListenAndServe())
}

type hashRequest struct {
    Plain string `json:"plain"`
}

type hashResponse struct {
    Hashed string `json:"hashed"`
}

func hashHandler(w http.ResponseWriter, r *http.Request) {
    req := hashRequest{}
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        log.Printf("Cannot decode hashRequest: %s", err.Error())
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    hashedBytes, err := bcrypt.GenerateFromPassword([]byte(req.Plain), bcrypt.DefaultCost)
    if err != nil {
        log.Printf("Cannot encrypt password: %s", err.Error())
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    resp, err := json.Marshal(hashResponse{Hashed: string(hashedBytes)})
    if err != nil {
        log.Printf("Cannot marshal response json: %s", err.Error())
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(resp)
}

type compareRequest struct {
    Hashed    string `json:"hashed"`
    CompareTo string `json:"compare_to"`
}

func compareHandler(w http.ResponseWriter, r *http.Request) {
    req := compareRequest{}
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        log.Printf("Cannot decode compareRequest: %s", err.Error())
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    err = bcrypt.CompareHashAndPassword([]byte(req.Hashed), []byte(req.CompareTo))
    // the only error we can have here is if there's not a match
    if err != nil {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    w.WriteHeader(http.StatusOK)
}
```

初始化go mod和构建配置依赖项。这是需要的，这样包就可以使用标准的go工具。然后我们将使用`gazelle`同步 Bazel 依赖项。

```bash
go mod tidy

bazel run //:gazelle -- update-repos -from_file=go.mod
bazel run //:gazelle
```

`go mod tidy`命令更新`go.mod`和`go.sum`依赖文件。

然后，我们使用`gazelle`导入`go.mod`依赖项，并将它们插入到`WORKSPACE`文件中。

最后，我们在`gazelle`没有任何参数的情况下运行，以创建或更新所有必需的`BUILD.bazel`文件。

现在，我们应该是能够使用bazel来执行构建和运行项目：

```bash
bazel build //...
bazel run //cmd/api
```

为了测试一切是否按预期工作，我们可以`curl`在不同的终端中使用：

```bash
$ curl -i localhost:8000/hash -d '{"plain":"text"}'
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 73

{"hashed":"$2a$10$ZqRE.vvvpjHYHvp8HFHO7eGg6RRUS//ctlYPU5sqMYKYzjhAsJIsu"}

$ curl -i localhost:8000/compare -d '{"hashed":"$2a$10$ZqRE.vvvpjHYHvp8HFHO7eGg6RRUS//ctlYPU5sqMYKYzjhAsJIsu","compare_to":"text"}'
HTTP/1.1 200 OK
Content-Length: 0

$ curl -i localhost:8000/compare -d '{"hashed":"$2a$10$ZqRE.vvvpjHYHvp8HFHO7eGg6RRUS//ctlYPU5sqMYKYzjhAsJIsu","compare_to":"invalid"}'
401 Unauthorized
Content-Length: 0
```

好的！我们可以提交我们的代码：

```bash
git add .
git commit -m "Add go api code"
```

现在让我们看看如何为这个应用程序构建一个 docker 容器。

## 添加Docker支持

我们将使用[rules_docker](https://github.com/bazelbuild/rules_docker)创建容器镜像。这个包提供了构建 通用镜像 以及 [特定语言镜像](https://github.com/bazelbuild/rules_docker#language-rules) 的规则。我们可以使用`go_image`方法，但正如文档中所述，它在 Mac 中不起作用，而且我们不想强迫开发人员限制使用任何特定操作系统，因此我们必须使用更通用的[container_image](https://github.com/bazelbuild/rules_docker#container_image-1)方法。

首先，我们必须在我们的`WORKSPACE`文件中加载规则：

```python
## General rules
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

## rules_docker
http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "dc97fccceacd4c6be14e800b2a00693d5e8d07f69ee187babfd04a80a9f8e250",
    strip_prefix = "rules_docker-0.14.1",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.14.1/rules_docker-v0.14.1.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("@io_bazel_rules_docker//container:pull.bzl", "container_pull")

container_pull(
    name = "alpine_linux_amd64",
    registry = "index.docker.io",
    repository = "library/alpine",
    tag = "3.8",
)

## rules_go
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "142dd33e38b563605f0d20e89d9ef9eda0fc3cb539a14be1bdb1350de2eda659",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.22.2/rules_go-v0.22.2.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.22.2/rules_go-v0.22.2.tar.gz",
    ],
)

# ...
```

请注意，bazel 规则加载的顺序并不重要，但我们更愿意将 go 规则留在底部，因为`gazelle`会在文件底部添加`go.mod`依赖项。

## 构建Docker镜像

现在，我们必须声明一个创建 docker 镜像的新构建目标。修改`cmd/api/BUILD.bazel`文件，使其看起来像这样：

```python
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

go_library(
    name = "go_default_library",
    srcs = ["main.go"],
    importpath = "github.com/schoren/example-bazel-containers-hasher/cmd/api",
    visibility = ["//visibility:private"],
    deps = [
        "@com_github_gorilla_mux//:go_default_library",
        "@org_golang_x_crypto//bcrypt:go_default_library",
    ],
)

go_binary(
    name = "api",
    embed = [":go_default_library"],
    visibility = ["//visibility:public"],
)

container_image(
    name = "image",
    base = "@alpine_linux_amd64//image",
    entrypoint = ["/api"],
    files = [":api"],
)
```

现在，测试新的构建目标：

```bash
bazel build //cmd/api:image
```

上面的命令将构建一个可以导入到 docker 里去的 `tar`文件。您可以手动调用`docker load`导入文件，或使用 bazel 来做到这一点：

```bash
bazel run //cmd/api:image
```

现在，如果你运行`docker images`你会看到这个：

```bash
REPOSITORY      TAG    IMAGE ID            CREATED             SIZE
bazel/cmd/api   image  e793d723ef4f        50 years ago        10.8MB
```

现在您可以使用 `docker run`命令来运行镜像：

```bash
docker run --rm -it -p8000:8000 bazel/cmd/api:image
```

您可以再次使用`curl`来测试它是否能够正常工作：

```bash
$ curl -i localhost:8000/hash -d '{"plain":"text"}'
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 73

{"hashed":"$2a$10$ZqRE.vvvpjHYHvp8HFHO7eGg6RRUS//ctlYPU5sqMYKYzjhAsJIsu"}
```

让我们提交更改：

```bash
git add .
git commit -m "Add docker support"
```

> ## Mac 用户注意事项
>
> 默认情况下，bazel 会为其运行的平台编译二进制文件。所以，当你运行这些命令时，你最终会得到一个为 MacOS 编译的二进制文件。此二进制文件与 Linux 不兼容。
>
> 但是，docker 镜像是 Linux，因此该文件不能运行。它会显示这样的错误：
>
> ```bash
> $ docker run --rm -it -p8000 bazel/cmd/api:image
> standard_init_linux.go:211: exec user process caused "exec format error"
> ```
>
> 要解决这个问题，您必须在命令中添加一个`--platform`标志：
>
> ```bash
> $ bazel run --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64 //cmd/api:image
> $ docker run --rm -it -p8000 bazel/cmd/api:image
> 2020/03/21 20:57:17 Start serving...
> ```
>
> 如果您打算把所有的二进制文件都放在 docker 中运行（您应该这样做），您可以使用[.bazelrc](https://docs.bazel.build/versions/master/guide.html#where-are-the-bazelrc-files)配置文件配置自动执行此操作的配置。
>
> ```bash
> build --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64
> run --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64
> ```

## 发布镜像到 DockerHub

您可能注意到您的容器名称是以`bazel/`为前缀的，这不仅丑陋，而且无法推送到镜像库：

```bash
$ docker push bazel/cmd/api
The push refers to repository [docker.io/bazel/cmd/api]
e90f26cebdee: Preparing 
7444ea29e45e: Preparing 
denied: requested access to the resource is denied
```

此外，在我们的例子中，镜像的标签是构建目标的名称（`image`）。这在部署此镜像时也不是很有用。

为了解决第一个问题，我们可以使用`cmd/api/BUILD.bazel`文件中的`container_image`规则的`repository`属性。将`<username>`替换为您的 `DockerHub ID` 或任何存储库ID：

```python
container_image(
    name = "image",
    base = "@alpine_linux_amd64//image",
    entrypoint = ["/api"],
    files = [":api"],
    repository = "<username>"
)
```

现在，当您运行`bazel run //cmd/api:image`时，它会将镜像另存为`<username>/cmd/api:image`。

同样，要推送我们的镜像，我们可以手动调用`docker push <username>/cmd/api`命令，我们也可以使用`docker_push`规则为我们自动执行此操作。将它添加到`cmd/api/BUILD.bazel`：

```python
container_push(
    name = "image-push",
    format = "Docker",
    image = ":image",
    registry = "index.docker.io",
    repository = "<username>/cmd-api",
)
```

> 根据您使用的存储库，它可能支持嵌套存储库（比如：ECR）。在那种情况下，你可以写作`"<username>/cmd/api"`使之看起来更好。

现在 bazel 可以为你推送镜像了：

```bash
$ bazel run //cmd/api:image-push
INFO: Analyzed target //cmd/api:image-push (0 packages loaded, 0 targets configured).
INFO: Found 1 target...
Target //cmd/api:image-push up-to-date:
  bazel-bin/cmd/api/image-push.digest
  bazel-bin/cmd/api/image-push
INFO: Elapsed time: 0.241s, Critical Path: 0.00s
INFO: 0 processes.
INFO: Build completed successfully, 1 total action
INFO: Build completed successfully, 1 total action
2020/03/21 18:43:59 Successfully pushed Docker image to index.docker.io/schoren/examples-bazel-containers-hasher-cmd-api:latest
```

提交：

```bash
git add .
git commit -m "Add push support to bazel"
```

## 结论

您现在可以使用 bazel 来管理您的容器镜像开发生命周期：它可以构建镜像并将其推送到镜像库，并具有 bazel 的所有优势：快速且可重现的构建。

在像这样的小示例中，您可能不会立即看到好处，但在由多个微服务（在容器内运行）组成的更复杂的项目中，这是减少构建和 CI 时间的好方法。

## 原文

翻译自：[Create Container images with Bazel](https://dev.to/schoren/create-container-images-with-bazel-47am)
