# 使用 PgBouncer 提高性能并减少 PostgreSQL 的负载

![如何改进 PostgreSQL 数据库服务器架构连接管理](/assets/images/postgresql/pgbouncer.png)

这篇博文将会逐步介绍如何使用 PgBouncer 连接池来改进 PostgreSQL 数据库服务器架构连接管理、减少 PostgreSQL 服务器上的负载并提高性能。

以下是我们在本文中将要讲解的内容的细分主题：

- PostgreSQL 数据库服务器如何工作
- 使用 PgBouncer 池化器提高效率
- 如何安装和配置 PgBouncer

首先，让我们从一些基本概念开始。

## PostgreSQL 数据库服务器如何工作

PostgreSQL数据库服务器 接受和处理请求，并返回结果。这些请求是从客户端应用程序接收的。应用程序代码与数据库进行交互。数据库进行搜索、保存、操作数据操作，并响应客户端。

PostgreSQL为每个提供服务的客户端连接创建一个单独的进程。例如：

如果有 10 个客户端连接，PostgreSQL 将创建 10 个进程，并为每个连接分配内存。

如果有一百个客户端连接，则有一百个 PostgreSQL Server 进程为这一百个客户端连接提供服务。

这种类型的架构被称之为：客户端-服务器模型。它速度慢、效率低且无法伸缩扩展。由于 CPU 和内存资源的限制，数据库服务器能够服务到的客户端连接数量受到了限制。

## 使用 PgBouncer 池化器提高效率

为了改进上述架构，并减少每个请求所产生的数据库连接开销，我们可以使用一种称之为：**数据库连接池** 的特殊实用程序。对于 PostgreSQL 数据库服务器，常用的连接池之一是：PgBouncer。

![使用 PgBouncer 提高性能并减少 PostgreSQL 的负载](/assets/images/postgresql/improving_efficiency_with_pgbouncer_poolers.png)

PgBouncer是一个中间件，用于管理数据库的连接池。客户端连接到 PgBouncer 的方式与连接到数据库服务器的方式相同。数据库服务器接受来自 PgBouncer 的连接，就像它们是常规客户端一样。

通过有效管理连接池，PgBouncer 可以处理大量传入的客户端连接，并使用池将它们重定向到数量少得多的实际连接。当客户端应用程序向数据库发送数百个请求时，PgBouncer 充当了一个中介，它将请求分发到数据库服务器的几十个连接中，并在必要时设置`listen_backlog`和`query_wait_timeout`等参数来创建队列。

这种方法使数据库连接的管理更加高效，确保所有连接请求都能够得到有效处理。

## 这种方法的优点

首先，即使请求数量急剧增加，应用程序仍能继续工作。这是因为每个请求不会为数据库创建单独的进程。相反，请求会发送给 PgBouncer，PgBouncer 通过管理连接池将请求转换为少量的数据库连接。其次，应用程序运行速度更快，因为无需在数据库中为每个请求创建单独的专用进程，从而节省了时间。

## 如何安装和配置 PgBouncer

如果 PostgresSQL 已经安装：

```bash
dmi@dmi-VirtualBox:~$ psql -h 127.0.0.1 -p 5432 -U postgres -d postgres
Password for user postgres:
psql (15.1 (Ubuntu 15.1-1.pgdg22.04+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
Type "help" for help.

postgres=# select version();
version
-----------------------------------------------------------------------------------------------------------------------------------
PostgreSQL 15.1 (Ubuntu 15.1-1.pgdg22.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0, 64-bit
(1 row)
```

安装PgBouncer：

```bash
sudo apt-get install pgbouncer
```

配置PgBouncer：

```bash
sudo vi /etc/pgbouncer/pgbouncer.ini
```

在 `[databases]` 块中，添加以下条目：

```ini
* = host=localhost port=5432
```

在`“Pooler personality questions”`部分中定义 `pool_mode=transaction`。

```ini
...
;;;
;;; Pooler personality questions
;;;

;; When server connection is released back to pool:
;;   session      - after client disconnects (default)
;;   transaction  - after transaction finishes
;;   statement    - after statement finishes
pool_mode = transaction
...
```

在`“Connection limits”`部分中，将可以连接的客户端总数设置为某个较高值：`max_client_conn=5000`。

```ini
...
;;;
;;; Connection limits
;;;

;; Total number of clients that can connect
max_client_conn = 5000
...
```

在`“Authentication settings”`部分中，设置 `auth_type = md5` 以通过密码对用户进行身份验证。包含数据库登录名和密码的文件位于 `/etc/pgbouncer/userlist.txt`

```ini
...
;;;
;;; Authentication settings
;;;

;; any, trust, plain, md5, cert, hba, pam
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
...
```

在`“Users allowed into database ‘pgbouncer’”`部分中，设置 `admin_users` 参数。这是设置PgBouncer有权在数据库中进行操作的数据库用户。

```ini
...
;;;
;;; Users allowed into database 'pgbouncer'
;;;

;; comma-separated list of users who are allowed to change settings
;admin_users = user2, someadmin, otheradmin
admin_users = my_db_user
...
```

现在让我们使用用户权限打开文件 `/etc/pgbouncer/userlist.txt`。
如果您使用的 PostgreSQL 版本不超过 13（含），则默认的密码加密方法是 `md5`。

将用户名放在双引号中，并将 `md5` 密码哈希值放在一行中：

```bash
"my_db_user" "md5badc318d987f61146c6ad8e15d84a111"
```

如果要验证 md5 密码的哈希值，可以使用以下方法：

```bash
echo "md5"$(echo -n 'YourdbpasswordYourdbusername' | md5sum | awk ' { print $1 } ')
```

之后，让我们重新加载 PgBouncer：

```bash
sudo service pgbouncer restart
```

现在您可以通过使用 PgBouncer 的6432端口（PgBouncer 默认端口）来连接到数据库。

如果您使用的 PostgreSQL 版本是 14 以及以上，则默认的密码加密方法是 `scram-sha-256`。

将用户名放在双引号中，并将 `scram-sha-256` 密码哈希值（在一行中）：

```bash
"my_db_user" "SCRAM-SHA-256$4096:lLN4+i05+kpeffD4s3rRiw==$Oq62iUGamAaF5cpB+agWV4u3xfc5cZCRtvMhmA+Zm3E=:hHkCesEi0p0wLWk1uUEeTtJTYLXHKDLdy2te3VAOe8s="
```

要确定 scram-sha-256 密码哈希值，可以使用以下方法：

```bash
psql -h  -p  -Atq -U postgres -d postgres -c "SELECT concat('\"', usename, '\" \"', passwd, '\"') FROM pg_shadow"
```

要使我们的应用程序在连接到数据库时使用 PgBouncer，唯一需要的更改是替换端口号：使用 6432 而不是 5432。

让我们使用 pgbench 实用程序运行性能测试来比较使用和不使用 PgBouncer 时与连接到 PostgreSQL 的性能差异。

pgbench 是 PostgreSQL 数据库的基准测试工具。它允许模拟在 PostgreSQL 数据库上执行事务的多个客户端的工作负载。pgbench 实用程序用于测量数据库在不同场景下的性能。

我的数据库的最大连接数设置为 100：

```bash
postgres=# show max_connections;
 max_connections
-----------------
 100
(1 row)
```

不使用 PgBouncer 连接到 Postgres 数据库服务器。

此命令将启动 1000 个并发客户端的测试，持续 60 秒，直接连接到 PostgreSQL 数据库。

```bash
dmi@dmi-VirtualBox:~$  pgbench -c 1000 -T 60 my_benchmark_test_db -h 127.0.0.1 -p 5432 -U my_db_user
Password:
pgbench (15.1 (Ubuntu 15.1-1.pgdg22.04+1))
starting vacuum...end.
pgbench: error: connection to server at "127.0.0.1", port 5432 failed: FATAL:  sorry, too many clients already
connection to server at "127.0.0.1", port 5432 failed: FATAL:  sorry, too many clients already
pgbench: error: could not create connection for client 44
```

模拟 1000 个客户端与数据库交互的工作（最多只能连接 100 个客户端）会导致错误。

```bash
FATAL:  sorry, too many clients already
```

使用 PgBouncer 连接到数据库时，一切正常，没有任何问题。

```bash
pgbench -c 1000 -T 60 my_benchmark_test_db -h 127.0.0.1 -p 6432 -U my_db_user
Password:
pgbench (15.1 (Ubuntu 15.1-1.pgdg22.04+1))
starting vacuum...end.
transaction type: 
scaling factor: 50
query mode: simple
number of clients: 1000
number of threads: 1
maximum number of tries: 1
duration: 60 s
number of transactions actually processed: 47370
number of failed transactions: 0 (0.000%)
latency average = 1106.280 ms
initial connection time = 8788.955 ms
tps = 903.930420 (without initial connection time)
dmi@dmi-VirtualBox:~$
```

让我们比较应用程序在不使用 PgBouncer 的情况下，连接到数据库时和使用 PgBouncer 时数据库执行的延迟和每秒事务数 (tps)。

以下测试执行Select操作。

```bash
dmi@dmi-VirtualBox:~$ cat mysql.sql
select 1;
```

原因是当大量事务被阻止等待其他事务时，排除测量更新争用。

pgbench 中的 -C 选项表示对于每一个事务，pgbench 将关闭打开的连接并创建一个新连接。这对于测量连接开销很有用。

应用程序在不使用 PgBouncer 的情况下连接到数据库：

```bash
dmi@dmi-VirtualBox:~$ pgbench -c 20 -t 100 -S my_benchmark_test_db -h 127.0.0.1 -p 5432 -U my_db_user -C -f mysql.sql
Password:
pgbench (15.1 (Ubuntu 15.1-1.pgdg22.04+1))
starting vacuum...end.
transaction type: multiple scripts
scaling factor: 50
query mode: simple
number of clients: 20
number of threads: 1
maximum number of tries: 1
number of transactions per client: 100
number of transactions actually processed: 2000/2000
number of failed transactions: 0 (0.000%)
latency average = 340.479 ms
average connection time = 16.910 ms
tps = 58.740729 (including reconnection times)
SQL script 1: 
 - weight: 1 (targets 50.0% of total)
 - 979 transactions (49.0% of total, tps = 28.753587)
 - number of failed transactions: 0 (0.000%)
 - latency average = 158.504 ms
 - latency stddev = 133.666 ms
SQL script 2: mysql.sql
 - weight: 1 (targets 50.0% of total)
 - 1021 transactions (51.0% of total, tps = 29.987142)
 - number of failed transactions: 0 (0.000%)
 - latency average = 162.888 ms
 - latency stddev = 136.175 ms
```

应用程序通过 PgBouncer 连接数据库：

```bash
dmi@dmi-VirtualBox:~$ pgbench -c 20 -t 100 -S my_benchmark_test_db -h 127.0.0.1 -p 6432 -U my_db_user -C -f mysql.sql
Password:
pgbench (15.1 (Ubuntu 15.1-1.pgdg22.04+1))
starting vacuum...end.
transaction type: multiple scripts
scaling factor: 50
query mode: simple
number of clients: 20
number of threads: 1
maximum number of tries: 1
number of transactions per client: 100
number of transactions actually processed: 2000/2000
number of failed transactions: 0 (0.000%)
latency average = 178.276 ms
average connection time = 8.867 ms
tps = 112.185757 (including reconnection times)
SQL script 1: 
 - weight: 1 (targets 50.0% of total)
 - 1022 transactions (51.1% of total, tps = 57.326922)
 - number of failed transactions: 0 (0.000%)
 - latency average = 85.993 ms
 - latency stddev = 50.377 ms
SQL script 2: mysql.sql
 - weight: 1 (targets 50.0% of total)
 - 978 transactions (48.9% of total, tps = 54.858835)
 - number of failed transactions: 0 (0.000%)
 - latency average = 84.039 ms
 - latency stddev = 51.036 ms
dmi@dmi-VirtualBox:~$
```

当应用程序通过 PgBouncer 连接到数据库时，**平均延迟时间** 和 **每秒事务数 (TPS)** 均有所改善：

```bash
latency average: 340.479 ms -> 178.276 ms --- improvement 
tps: 58 -> 112  --- improvement
```

## 原文地址

- [Using PgBouncer to improve performance and reduce the load on PostgreSQL](https://medium.com/@dmitry.romanoff/using-pgbouncer-to-improve-performance-and-reduce-the-load-on-postgresql-b54b78deb425)
