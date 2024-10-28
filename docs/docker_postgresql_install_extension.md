# 为Docker容器运行的PostgreSQL安装插件

## 准备

查看PostgreSQL的版本号（有些插件带大版本号）：

```bash
SELECT version();
```

进入Docker容器：

```bash
docker exec -it {IMAGE_ID} /bin/bash
```

更新软件包列表

```bash
apt update
```

安装好之后，SQL查看可用插件列表：

```sql
SELECT * FROM pg_available_extensions;
```

## 安装插件

官方自带了一个合集：

```bash
apt install -y postgresql-contrib
```

### 安装 Citus 插件

```bash
apt install -y postgresql-{version}-citus-12.1.5

sudo pg_conftool {version} main set shared_preload_libraries citus
```

启用插件：

```sql
CREATE EXTENSION citus;
```

### 安装 PostGIS 插件

`PostGIS` 是一个流行的 PostgreSQL 扩展，为 PostgreSQL 添加了地理信息系统 (GIS) 的支持。它允许存储、查询和分析地理和空间数据，对于地理信息系统应用程序非常重要。
CREATE EXTENSION postgis;

```bash
apt install -y postgis
apt install -y postgresql-{version}-postgis-3-scripts
```

启用插件：

```sql
CREATE EXTENSION postgis;

SELECT postgis_full_version();
```

### 安装 pg_cron 插件

`pg_cron` 是一个用于在 PostgreSQL 中调度定时任务的扩展。它允许在数据库中创建和管理定期运行的任务，从而执行诸如数据清理、报告生成和维护操作等任务。
CREATE EXTENSION pg_cron;

```bash
apt install -y postgresql-{version}-pgcron
```

启用插件：

```sql
CREATE EXTENSION pg_cron;
```

### 安装 PGVector 插件

```bash
apt install -y postgresql-{version}-pgvector
```

启用插件：

```sql
CREATE EXTENSION vector;
```

### 安装 TimeScale 插件

```bash
apt install -y gnupg postgresql-common apt-transport-https lsb-release wget

/usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -c -s) main" | tee /etc/apt/sources.list.d/timescaledb.list

wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg

apt update

apt install timescaledb-2-postgresql-{version} postgresql-client-{version}
```

启用插件：

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```

## pg_stat_statements

`pg_stat_statements` 是一个用于监控 SQL 查询性能的扩展。它可以跟踪和记录执行的 SQL 查询，包括查询的执行计划、运行时间和计数等信息。这对于性能分析和查询优化非常有用。

```sql
CREATE EXTENSION pg_stat_statements;
```

## 参考资料

- [docker容器运行的postgreSQL安装postgis插件](https://woodwhales.cn/2024/08/25/101/)
