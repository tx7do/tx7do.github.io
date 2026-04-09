---
date: 2026-04-09
category:
  - 运维技术
tag:
  - Docker
  - Superset
sticky: 10
---

# 如何在 Superset Docker 容器中安装 MySQL 驱动

Apache Superset 是一款功能强大的开源数据挖掘与可视化平台，支持多种数据源连接、自定义仪表盘和细粒度权限控制，广泛应用于数据运维与分析场景。由于
Superset 官方 Docker 镜像未默认集成 MySQL 驱动，在实际运维中，需手动安装驱动才能实现与 MySQL 数据库的正常连接。本文将详细介绍两种
Docker 部署方式（Docker run 和 Docker Compose）下，MySQL 驱动的完整安装流程，同时兼顾 Apache Doris
驱动安装（适配多数据源需求），并提供数据库配置方法和常见注意事项。

## 一、前置说明

可能是因为MySQL是使用的GPL协议，所以Superset官方镜像中未包含MySQL驱动，需要手动安装。

## 二、Docker run 方式安装

Docker run 方式步骤清晰，适合快速部署单个 Superset 容器，无需复杂配置，具体操作如下：

### 2.1 拉取并启动 Superset 容器

执行以下命令，拉取官方镜像并启动容器，映射端口、配置时区和安全密钥，确保容器后台稳定运行：

```shell
# 拉取并运行Superset的Docker镜像
docker run -d \
  --name superset \
  --restart always \
  -p 8088:8088 \
  -e TZ=Asia/Shanghai \
  -e SUPERSET_SECRET_KEY=*Abcd123456 \
  --user root \
  apache/superset:latest
```

### 2.2 进入容器并安装依赖与驱动

这一步很关键，因为Superset是运行在 Python 虚拟环境中的，**所以，需要在Python 虚拟环境安装依赖与驱动，否则，驱动的安装将会不成功**。

容器启动后，进入容器内部，替换 apt 源为阿里云镜像（提升下载速度），安装编译依赖，再安装 MySQL 和 Doris 驱动：

```shell
# 进入Superset容器
docker exec -it superset bash

# 替换apt源为阿里云镜像源
sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources
sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources
apt-get update
# 安装编译pydoris和pymysql所需的依赖
apt-get install -y gcc python3-dev default-libmysqlclient-dev pkg-config

# 给官方阉割的虚拟环境 安装 pip
/app/.venv/bin/python -m ensurepip

# 升级 pip
/app/.venv/bin/python -m pip install --upgrade pip -i https://mirrors.aliyun.com/pypi/simple/

# 安装 pymysql 和 pydoris 到 Superset 真正使用的环境里
/app/.venv/bin/python -m pip install pymysql pydoris -i https://mirrors.aliyun.com/pypi/simple/

# 验证安装
/app/.venv/bin/pip list | grep pydoris
```

验证成功后，会显示 `pydoris 1.1.0`（版本可能略有差异，不影响使用），说明驱动已正确安装到 Superset 运行环境中。

### 2.3 初始化 Superset 并重启容器

驱动安装完成后，需执行数据库迁移、创建管理员账户、初始化角色等操作，确保 Superset 正常使用，最后重启容器使配置生效：

```shell
# 将本地数据库迁移到最新版本
docker exec -it superset superset db upgrade

# 设置本地superset系统管理员账户
docker exec -it superset superset fab create-admin \
              --username admin \
              --password admin \
              --firstname Superset \
              --lastname Admin \
              --email admin@superset.com

# 初始化设置角色
docker exec -it superset superset init

# 重启Superset容器
docker restart superset
```

### 2.4 访问验证

容器重启后，通过以下地址访问 Superset 控制台：

访问地址：<http://localhost:8088/login/>

登录账号：`admin`/`admin`（默认管理员账户，生产环境建议及时修改密码）

## 三、Docker Compose 方式安装（适合生产环境部署）

Docker Compose 可实现容器的批量管理和配置持久化，适合生产环境部署，无需手动执行多步命令，一键完成部署和驱动安装，具体配置如下：

```yaml
networks:
  app-tier:
    driver: bridge

services:
  superset:
    image: apache/superset:latest
    container_name: superset
    hostname: superset
    restart: always
    user: root
    ports:
      - "8088:8088" # 端口映射，宿主机8088端口对应容器8088端口
    networks:
      - app-tier
    environment:
      TZ: Asia/Shanghai # 配置时区为上海，避免时间显示异常
      SUPERSET_SECRET_KEY: "*Abcd123456" # 安全密钥，生产环境建议修改为复杂密钥
      SUPERSET_ENV: production # 生产环境模式
    volumes:
      - ./superset_data:/app/data # 数据持久化，避免容器删除后数据丢失
    command: >
      bash -c "
      apt-get update &&
      apt-get install -y gcc python3-dev default-libmysqlclient-dev pkg-config &&
      /app/.venv/bin/python -m ensurepip &&
      /app/.venv/bin/python -m pip install --upgrade pip -i https://mirrors.aliyun.com/pypi/simple/ &&
      /app/.venv/bin/python -m pip install pymysql pydoris -i https://mirrors.aliyun.com/pypi/simple/ && 
      superset db upgrade &&
      superset fab create-admin
          --username admin
          --password admin
          --firstname Admin
          --lastname Admin
          --email admin@admin.com || true &&
      superset init &&
      /usr/bin/run-server.sh
      "
```

### 3.1 启动与验证

1.  将上述配置保存为 `docker-compose.yml` 文件，放在任意目录下；
2.  进入配置文件所在目录，执行命令 `docker-compose up -d`，启动容器并后台运行；
3.  容器启动后，可通过 `docker logs -f superset` 查看启动日志，确认无报错后，访问 <http://localhost:8088>，使用 `admin`/`admin` 登录即可。

说明：`|| true` 用于避免重复创建管理员账户时报错，确保脚本可重复执行；数据卷 `./superset_data` 用于持久化 Superset 数据，防止容器重启或删除后数据丢失。

## 四、数据库配置（MySQL + Doris）

驱动安装完成并登录 Superset 后，需配置数据库连接，才能实现数据可视化分析。以下分别介绍 MySQL 和 Apache Doris 的配置方法，操作步骤一致，仅连接字符串不同：

### 4.1 配置步骤

1.  登录 Superset 控制台，点击右上角 `Settings` → `Database Connectors`；
2.  点击「添加 Database」，在弹出的「Connect a database」弹窗中，选择对应数据库类型（MySQL 或 Apache Doris）；
3.  在连接信息中填写 SQLAlchemy URI 连接字符串，点击「Test Connection」验证连接无误后，点击「Connect」完成配置。

### 4.2 连接字符串格式

```shell
# 使用Doris驱动（连接Doris数据库，适配内表）
pydoris://root:@host.docker.internal:9030/internal.gw_uba

# 使用MySQL驱动（连接MySQL数据库）
mysql+pymysql://root:@host.docker.internal:9030/gw_uba
```

**参数说明**

1.  `host.docker.internal`：Docker 容器访问宿主机的默认地址，若数据库部署在其他服务器，替换为对应 IP 地址；
2.  `9030`：默认端口（Doris 查询端口、MySQL 端口，若端口已修改，需对应调整）；
3.  `root`：数据库用户名，根据实际数据库配置修改；
4.  `internal`：Doris 的 Catalog 名称，内表使用 internal，查询外表或数据湖时需替换为对应 Catalog 名称；
5.  `gw_uba`：数据库名称，替换为实际需要连接的数据库名。

## 五、注意事项与使用技巧

1.  权限问题：所有操作需以 root 用户执行，否则会出现 apt 安装失败、虚拟环境权限不足等问题；
2.  镜像源问题：若阿里云镜像源无法访问，可替换为其他国内镜像源（如清华源），确保依赖和包能正常下载；
3.  驱动安装验证：若安装后无法识别驱动，可进入容器虚拟环境（`source /app/.venv/bin/activate`），执行 `python -c "import pymysql; print('安装成功')`" 验证驱动是否被正确识别；
4.  生产环境配置：生产环境中，需修改 `SUPERSET_SECRET_KEY` 为复杂密钥，修改管理员默认密码，避免安全风险；同时建议使用 VPC 私有连接，避免公网访问数据库带来的安全隐患；
5.  版本兼容：推荐使用 Apache Superset 3.1 及以上版本、Apache Doris 2.0.4 及以上版本，确保 Doris 连接功能正常；
6.  常见报错：若出现「无法加载数据库驱动程序」报错，需重新安装驱动，确保驱动安装到 Superset 虚拟环境中，而非系统环境。

## 六、参考资料

- [Doris 官方文档](https://doris.apache.org/zh-CN/docs/3.x/ecosystem/bi/apache-superset)：Apache Superset 与 Apache Doris 集成指南；
- [Superset Connecting to Databases](https://superset.apache.org/user-docs/databases/)：Superset 数据库连接官方文档，包含驱动安装通用方法。
