# 如何 Docker 化一个 GO 应用程序

使用 Golang，可以构建小到简单的可执行工具大到完整的 Web 服务器的任何东西。为了交付应用程序，使用 Docker 是首选，它允许我们创建一个包含项目运行所需的一切的自包含环境。值得一提的是，Docker 命令行界面本身也是使用 GO 所开发。

## 为任何 GO 应用程序编写 Docker 镜像

通常，从一个尽可能小且具有所需基本依赖项的基本镜像开始，是一个好主意。alpine 镜像通常是一个可靠的选择，因为它们仅包含操作系统所需的最低限度。

所以，我们可以这样写 `Dockerfile`：

```dockerfile
FROM golang:alpine3.15
```

在这个镜像中，我们可以像在任何其他环境中一样，指定构建应用程序的后续步骤。

```dockerfile
FROM golang:alpine3.15
WORKDIR /path
COPY . .
RUN go mod download
RUN go build -o "app" .
```

然后，我们必须将执行权限也添加到生成的二进制文件中，以便它可以执行：

```bash
RUN chmod +x /path/app
```

但是，使用这样的镜像运行 GO 应用程序存在一个小问题。事实上，在构建和生成二进制文件之后，我们将不再需要在容器中安装 GO 编译环境。它只是一个依赖项，完全可以从镜像中排除掉，以优化镜像大小。这个问题的解决方案是使用 Docker 的多阶段构建。

## 使用多阶段构建

多阶段构建，允许将构建镜像的过程划分为一个单独的部分，并从中收集运行时所需的各种不同文件。有一种常见的模式称为 **构建器模式（builder pattern）**。我们可以在`Dockerfile`的最前面添加构建器阶段。它负责使用其构建时依赖项来组装应用程序，然后我们只需要从中挑选运行时必要的文件。

```dockerfile
FROM golang:alpine3.15 as builder

WORKDIR /path
COPY . .

RUN go mod download
RUN go build -o "app" . 

FROM alpine:3.15.5

WORKDIR /path

RUN apk update \
  && apk -U upgrade \
  && apk add --no-cache ca-certificates bash gcc \
  && update-ca-certificates --fresh \
  && rm -rf /var/cache/apk/*

COPY --from=builder /path/app .

RUN chmod +x /path/app

ENTRYPOINT ["/path/app"]
```

在上面的Dockerfile，我们已经指定了构建器镜像的步骤。它将构建用于运行应用程序的二进制文件。之后，它将被转移到最终镜像。请注意，最终的镜像只是一个普通的 alpine 镜像，并没有包含任何 GO 编译环境，因为应用程序已经构建完了，不需要了。

## 以非root身份运行

为了完成我们的镜像，我们应该以专用用户身份来运行容器。默认情况下，docker 容器内的进程将以 root 身份运行。反之，以非 root 用户身份运行我们的容器，被认为是一种最佳的安全实践。在有人获得对容器的访问权的情况下，如果某个进程突破它，它也获取不到底层操作系统的任何特权权限。

因此，我们可以将以下几行添加到我们的`Dockerfile`:

```dockerfile
RUN addgroup app_user && adduser -S app_user -u 1000 -G app_user
USER app_user
```

## 最终结果

完成所有这些步骤后，我们将得到下面的最终`Dockerfile`：

```dockerfile
FROM golang:alpine3.15 as builder

WORKDIR /path
COPY . .

RUN go mod download
RUN go build -o "app" .

FROM alpine:3.15.5

WORKDIR /path

RUN apk update \
  && apk -U upgrade \
  && apk add --no-cache ca-certificates bash gcc \
  && update-ca-certificates --fresh \
  && rm -rf /var/cache/apk/*

RUN addgroup app_user && adduser -S app_user -u 1000 -G app_user

COPY --chown=app_user:app_user --from=builder /path/app .

RUN chmod +x /path/app

USER app_user

ENTRYPOINT ["/path/app"]
```

因此，这是一个通用镜像，可用于发布用 GO 编写的应用程序。

## 结论

在这篇文章中，我们了解了如何创建 GO 应用程序的容器镜像。

一些与之相关的最佳实践是：

- 使用运行程序所需的最低限度的基本镜像。
- 多阶段构建作为优化镜像大小的一种方式。
- 出于安全原因，以非 root 用户身份运行容器。

谢谢你坚持到最后。我希望这些技巧对你有用！

翻译自：<https://medium.com/@leonardo5621_66451/how-to-dockerize-a-go-application-d196ea292c34>
