# Docker修剪未使用对象

Docker 采用保守的方法来清理未使用的对象，例如镜像(Image)、容器(Container)、数据卷(volume)和网络(Network)。也就是说，除非您明确告诉 Docker 这样做，否则每个对象都永远不会被删除。结果导致了 Docker 最终使用了大量的磁盘空间。对于每种类型的对象，Docker 都提供了一个 prune（删除）命令。此外，您可以一次清理多个对象类型。本主题介绍如何使用每个命令。

## 镜像(Image)修剪

`docker image prune`该命令可以清理未使用的镜像。默认情况下，该命令仅删除挂起的镜像。挂起的镜像是没有标签且不被其他容器引用的镜像。要删除挂起的镜像，只需要键入：`docker image prune`

```shell
$ docker image prune

WARNING! This will remove all dangling images.
Are you sure you want to continue? [y/N] y
```

加`--a`参数，可以删除掉所有未使用的镜像。

```shell
$ docker image prune -a

WARNING! This will remove all images without at least one container associated to them.
Are you sure you want to continue? [y/N] y
```

默认情况下，它会询问您是否要继续。要跳过此检查，请使用`-f`或`--force`参数。

您可以使用带有`--filter`参数的过滤表达式来选择性删除不需要的镜像。

```shell
$ docker image prune -a --filter "until=24h"
```

还可以使用其他过滤表达式。相关的更多示例，请参阅 [docker image prune 参考](https://docs.docker.jp/engine/reference/commandline/image_prune.html)。

## 容器(Container)修剪

当您停止容器时，它不会自动删除，除非您使用`--rm`参数来启动它。所以，当您使用`docker ps -a`命令查看 Docker 主机上的所有容器（包括已停止的容器），您会对容器的数量感到惊讶。尤其是在开发系统上！停止的容器中的Overlay将会继续消耗磁盘空间。这时候，请使用`docker container prune`命令来清理它们。

```shell
$ docker container prune

WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
```

## 数据卷(volume)修剪

数据卷由一个或多个容器使用，并占用 Docker 主机上的磁盘空间。删除卷会使得数据破坏，所以它并不会自动删除。

```shell
$ docker volume prune

WARNING! This will remove all volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
```

默认情况下，它会显示确认提示。如果您不想使用此提示，请使用`-f`或`--force`标志。

默认情况下，所有未使用的卷都会被删除。

`--filter`参数可以用来限制删除的范围。例如，以下命令中的`keep`意味着将仅删除未标记的卷。

```shell
$ docker volume prune --filter "label!=keep"
```

还可以使用其他过滤表达式。相关的更多示例，请参阅[docker volume prune 参考]()。

## 网络(Network)修剪

Docker 网络不消耗磁盘空间，但它会创建iptables防火墙规则、桥接网络设备和路由表条目。要清理它们，请使用`docker network prune`命令从容器中清理未使用的网络。

```shell
$ docker network prune

WARNING! This will remove all networks not used by at least one container.
Are you sure you want to continue? [y/N] y
```

默认情况下，它会显示确认提示。如果您不想使用此提示，请使用`-f`或`--force`参数。

默认情况下，所有未使用的网络都会被删除。

`--filter`参数可以用来限制删除的范围。例如，以下命令将仅删除超过 24 小时的网络。

```shell
$ docker network prune --filter "until=24h"
```

您还可以使用其他过滤表达式。相关的更多示例，请参阅[docker network prune 参考](https://docs.docker.jp/engine/reference/commandline/network_prune.html)。

## 修剪所有

`docker system prune`命令是修剪镜像、容器和网络的快捷方式。默认情况下不会删除卷，因此您必须在`docker system prune`命令当中使用`--volumes`来删除它们。

```shell
$ docker system prune

WARNING! This will remove:
        - all stopped containers
        - all networks not used by at least one container
        - all dangling images
        - all build cache
Are you sure you want to continue? [y/N] y
```

如果您还想删除该卷，请使用`--volumes`参数。

```shell
$ docker system prune --volumes

WARNING! This will remove:
        - all stopped containers
        - all networks not used by at least one container
        - all volumes not used by at least one container
        - all dangling images
        - all build cache
Are you sure you want to continue? [y/N] y
```

默认情况下，它会显示确认提示。如果您不想使用此提示，请使用`-f`或`--force`参数。

## 原文地址

[使用していない Docker オブジェクトの削除（prune）](https://docs.docker.jp/config/pruning.html)
