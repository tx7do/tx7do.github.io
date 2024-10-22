# docker容器运行的postgreSQL安装插件

## 准备

查看PostgreSQL的版本号

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
select * from pg_available_extensions;
```

## 安装插件

### 安装 Citus 插件

```bash
apt install -y postgresql-{version}-citus-12.1.5

sudo pg_conftool {version} main set shared_preload_libraries citus
```

### 安装 PostGIS 插件

```bash
apt install -y postgis
apt install -y postgresql-{version}-postgis-3-scripts
```

```sql
CREATE EXTENSION postgis;

SELECT postgis_full_version();
```

### 安装 PGCron 插件

```bash
apt install -y postgresql-contrib

apt install -y postgresql-{version}-pgcron
```

### 安装 PGVector 插件

```bash
apt install -y postgresql-{version}-pgvector
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

## 参考资料

- [docker容器运行的postgreSQL安装postgis插件](https://woodwhales.cn/2024/08/25/101/)
