# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：如何进行Docker部署后端

Docker 部署具备环境一致性、可移植性强、部署高效等优势，是企业级应用落地的优选方案。风行·GoWind Admin 后端已将所有Docker部署相关操作封装至 Makefile 中，实现极简部署体验。本文将详细介绍两种核心部署方式、服务增减时的配置调整方法，助力开发者快速完成后端服务的容器化部署。

## 一、部署前提

- 本地环境已安装 Docker（建议版本 20.10+）及 Docker Compose（建议版本 2.10+），可通过 `docker -v``、docker compose version` 命令验证安装。
- 已获取 GoWind Admin 项目源码，进入后端项目根目录（即 `backend` 目录），所有部署命令均在此目录执行（特殊说明除外）。
- 确保部署环境网络通畅，可正常拉取 Docker Hub 公共镜像（如 postgres、redis 等依赖组件）。

## 二、核心部署方式

### 方式一：使用 docker-compose 一键部署（推荐，全量服务）

该方式通过 `docker-compose` 编排所有依赖组件（postgres、redis、minio、consul 等）和 GoWind Admin 后端服务，实现“一键部署全量服务”，无需手动配置依赖关联，适合生产环境全量部署或开发环境快速搭建。

#### 1. 部署命令

```bash
make docker-compose
```

#### 2. 命令执行逻辑

- 自动解析项目根目录下的 docker-compose.yaml 配置文件，拉取配置中声明的所有依赖组件镜像。
- 基于项目内的 Dockerfile 构建 GoWind Admin 各后端服务镜像（如 admin-service 等）。
- 按依赖顺序启动所有容器（先启动 postgres、redis 等中间件，再启动后端业务服务），并自动配置容器间网络互联。

#### 3. 验证部署

部署完成后，执行以下命令查看容器运行状态：

```bash
docker compose ps
```

若所有容器状态均为 Up，则部署成功。可进一步通过后端 Swagger 文档地址（`http://部署主机IP:7788/docs/`）验证服务可用性。


### 方式二：使用 docker run 单独部署（灵活部署，适合调试/增量部署）

该方式先通过 Makefile 构建服务镜像，再通过`docker run` 命令单独启动单个服务，适合开发调试、增量部署单个服务或自定义部署拓扑的场景。

#### 1. 第一步：构建服务镜像

通过 make docker 命令构建镜像，支持两种构建场景，按需选择：

```bash
# 场景1：在后端项目根目录执行 → 构建所有后端服务的镜像（如 admin-service、gateway-service 等）
make docker

# 场景2：在单个服务目录执行（路径：app/{服务名}/service）→ 仅构建当前服务的镜像
# 示例：仅构建 admin 服务镜像
cd app/admin/service
make docker
```

#### 2. 第二步：单独启动服务容器

使用`docker run` 命令启动构建好的镜像，需指定网络、端口映射、中间件链接等参数。以下是 `admin-service`（核心后台管理服务）的启动示例：

```bash
docker run -itd \
  --name admin-server \          # 容器名称，自定义，便于识别
  --network=app-tier \           # 加入自定义网络（需提前创建，或使用已存在的网络）
  -p 7788:7788 \                 # 端口映射：主机端口:容器端口（容器内默认 7788，可通过配置修改）
  --link postgres:postgres \     # 链接 postgres 容器（格式：--link 中间件容器名:容器别名）
  --link redis:redis \           # 链接 redis 容器
  --link consul:consul \         # 链接 consul 容器
  go-wind-admin/admin-service:latest  # 镜像名称（构建时自动生成的格式）
```

#### 3. 关键注意事项：中间件地址配置

若微服务配置文件中，中间件（postgres、redis 等）的地址填写为 `127.0.0.1` 或`localhost`，启动容器后会出现“无法连接中间件”的问题。原因是容器内的 `localhost` 指向容器自身，而非主机或中间件容器。
解决方案：

- 修改微服务配置文件：将中间件地址改为对应的中间件容器名称（如 postgres、redis）。
- 启动容器时添加 `--link` 参数：将业务服务容器与中间件容器链接，Docker 会自动在业务容器的 hosts 文件中添加中间件容器名的映射，实现直接访问。

## 三、服务增减时的 Docker 配置调整

GoWind Admin 对 Docker 配置做了高度适配，多数情况下无需修改 Dockerfile，仅需根据“是否使用 docker-compose 部署”调整对应配置文件。

### 1. 无需修改 Dockerfile 的原因

项目内置的 Dockerfile 采用通用化设计，通过构建参数（如 `SERVICE_NAME`、`APP_VERSION`）动态适配不同服务，Makefile 中的 `make docker` 命令会自动识别当前服务目录，填充对应的构建参数，因此增减服务时无需修改 Dockerfile。

### 2. 使用 docker-compose 部署时的配置调整

若通过 docker-compose 管理服务，增减服务时需修改项目根目录下的 `docker-compose.yaml` 文件，新增服务时添加对应的服务节点，删除服务时移除对应节点即可。以下是新增/修改服务的配置示例（以 admin-service 为例）：

```yaml
  # 服务节点名称，自定义（建议与服务名一致）
  admin-service:
    image: go-wind-admin/admin-service  # 镜像名称（与 make docker 构建的镜像名一致）
    restart: always  # 容器退出时自动重启，保障服务可用性
    networks:
      - app-tier  # 加入统一网络，与其他服务/中间件互联
    ports:
      - "7788:7788"  # 端口映射：主机端口:容器端口（需确保主机端口未被占用）
    depends_on:  # 依赖的中间件/其他服务，确保启动顺序
      - postgres
      - redis
      - minio
      - consul
      - jaeger
    build:
      context: ./  # 构建上下文路径（项目根目录，Dockerfile 所在位置）
      args:
        SERVICE_NAME: admin  # 关键参数：对应服务路径 app/{SERVICE_NAME}/service 中的 SERVICE_NAME
        APP_VERSION: 1.0.0  # 应用版本，可自定义
```

**配置调整核心要点**

- 服务节点名称：建议与 `SERVICE_NAME` 一致，便于识别和管理。
- ports：确保主机端口未被占用，若需修改主机端口，调整冒号前的数值（如 `7789:7788`表示主机 7789 端口映射容器 7788 端口）。
- depends_on：按实际依赖添加中间件/服务，Docker 会优先启动依赖的容器。
- SERVICE_NAME：必须与服务所在路径 `app/{SERVICE_NAME}/service` 中的 `{SERVICE_NAME}` 完全一致，否则无法正确构建镜像。

## 四、常见问题与解决方案

### 问题1：执行 make docker-compose 时拉取镜像失败

解决方案：检查网络连接，若无法访问 Docker Hub，可配置 Docker 镜像加速器（如阿里云、网易云加速器）；若依赖的私有镜像，需先执行 `docker login` 登录私有镜像仓库。

### 问题2：容器启动后，业务服务无法连接中间件

解决方案：① 检查中间件容器是否正常运行（`docker ps | grep 中间件容器名`）；② 确认业务服务配置中的中间件地址为容器名；③ 确认容器已加入同一网络（`docker network inspect 网络名 查看容器列表`）。

### 问题3：构建镜像时提示“找不到服务目录”

解决方案：检查执行 `make docker` 的目录是否正确（项目根目录或 `app/{服务名}/service` 目录）；确认 `docker-compose.yaml` 中 `SERVICE_NAME` 与服务路径一致。

## 项目源码

获取完整项目源码，查看最新部署文档：

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
