# 在 Postgres Docker 容器中安装扩展

最近，我想使用 Fluent 迁移器来为我的 postgres 数据库做种，该数据库作为 Docker 容器运行。我基本上有一个表 User，它有一个需要自动生成的 UUID 类型的主键。

我的迁移代码如下所示。

```csharp
Create.Table(User.TABLE_NAME)
    .WithColumn("id").AsGuid().NotNullable().WithDefaultValue(SystemMethods.NewGuid).PrimaryKey()
    .WithColumn("username").AsString().NotNullable()
    .WithColumn("password").AsString().NotNullable();
```

上面的代码基本上会变成下面的 postgres sql:

```sql
CREATE TABLE "public"."users"
(
    "id"       uuid NOT NULL DEFAULT uuid_generate_v4(),
    "username" text NOT NULL,
    "password" text NOT NULL,
    CONSTRAINT "PK_users" PRIMARY KEY ("id")
);
```

请注意查询中使用的默认函数`uuid_generate_v4()`。如果您使用默认的 Postgres docker 映像来构建容器，这将生成以下错误信息:

```text
The error was 42883: function uuid_generate_v4() does not exist
```

这是因为`uuid_generate_v4()`这个函数是在`uuid-ossp`扩展中定义的，在执行创建扩展的SQL命令之前必须先将其安装在容器中。由于我们用于 docker compose 处理容器，因此我们将使用它来安装扩展。

我们将定义所需的脚本来在单独的文件中安装扩展，并将其包含在我们的 docker compose 中。

```yml
\c ntuserauth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

在上面的代码中，我们使用了 `ntuserauth` 数据库（这是我们需要安装扩展的数据库），然后指示安装扩展（ uuid-ossp 如果它尚不存在）。我们将脚本放在`install-extensions.sql`这个文件中，并将其放置在我们的脚本目录中。

然后，我们将使用上面定义的脚本复制到 `docker-entrypoint-initdb.d`下，并用于初始化数据库。

> 如果您想在从此镜像派生的镜像中进行其他初始化，请在 `/docker-entrypoint-initdb.d` 下添加一个或多个 `*.sql`、`*.sql.gz` 或 `*.sh` 脚本（如有必要，请创建该目录）。在入口点调用 `initdb` 创建默认的 postgres 用户和数据库后，它将运行任何 `*.sql` 文件，运行任何可执行的 `*.sh` 脚本，并获取在该目录中找到的任何不可执行的 `*.sh` 脚本，以在之前进行进一步的初始化启动服务。

让我们继续修改 `docker compose`配置 以包含脚本:

```yml
nt.authservice.db:
  image: postgres:14.1-alpine
  container_name: nt.authservice.db
  hostname: "nt.authservice.db"
  restart: always
  environment:
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=mypassword
    - POSTGRES_DB=ntuserauth
  ports:
    - '5432:5432'
  volumes:
    - nt.authservice.db.volume:/var/lib/postgresql/data
    - ./services/db/scripts:/docker-entrypoint-initdb.d
```

您可以通过对容器中的数据库运行`\dx`命令来验证是否已正确安装扩展。

```text
                            List of installed extensions
   Name    | Version |   Schema   |                   Description
-----------+---------+------------+-------------------------------------------------
 plpgsql   | 1.0     | pg_catalog | PL/pgSQL procedural language
 uuid-ossp | 1.1     | public     | generate universally unique identifiers (UUIDs)
(2 rows)
```

这就确保了我们需要所需的`uuid-ossp`扩展已经安装在`postgres`容器中，并且使我们能够用Fluent的迁移功能来初始化数据库。

## 原文地址

- [Install Extensions in Postgres Docker container](https://bytelanguage.com/2023/02/19/install-extensions-in-postgres-docker-container/)
