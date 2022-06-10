# Unix时间戳

***

## 关于Unix时间戳(Unix timestamp)

`时间戳(Timestamp)` 也被称作为 `Unix时间戳(Unix timestamp)`，或称`Unix时间(Unix time)`、`POSIX时间(POSIX time)`，是一种时间表示方式，定义为从`世界协调时间（Coordinated Universal Time，即UTC）`或称 `格林威治时间`的 `1970年01月01日00时00分00秒（00:00:00 GMT）` 起至现在的总秒数。Unix时间戳不仅被使用在Unix系统、类Unix系统中，也在许多其他操作系统中被广泛采用。

## 具体数值实例

```text
2022-03-07 08:49:15

秒: 1646614155
毫秒: 1646614155112
微秒: 1646614155112986
纳秒: 1646614155112986400
```

## Go

```go
// 秒
fmt.Printf("时间戳（秒）：%v;\n", time.Now().Unix())
fmt.Printf("时间戳（纳秒转换为秒）：%v;\n", time.Now().UnixNano()/1e9)

// 毫秒
fmt.Printf("时间戳（毫秒）：%v;\n", time.Now().UnixMilli())
fmt.Printf("时间戳（纳秒转换为毫秒）：%v;\n", time.Now().UnixNano()/1e6)

// 微秒
fmt.Printf("时间戳（微秒）：%v;\n", time.Now().UnixMicro())
fmt.Printf("时间戳（纳秒转换为微秒）：%v;\n", time.Now().UnixNano()/1e3)

// 纳秒
fmt.Printf("时间戳（纳秒）：%v;\n", time.Now().UnixNano())
```

## PostgreSQL

```sql
-- 秒
select (extract(EPOCH FROM CURRENT_TIMESTAMP))::bigint;

-- 毫秒
select (extract(EPOCH FROM CURRENT_TIMESTAMP)*1000)::bigint;

-- 微秒
select (extract(EPOCH FROM CURRENT_TIMESTAMP)*1000*1000)::bigint;

-- 纳秒
select (extract(EPOCH FROM CURRENT_TIMESTAMP)*1000*1000*1000)::bigint;
```

在PostgreSQL里面要实现更新表立即更新update_time/updated_at字段,要比MySQL麻烦一点点,需要自己实现一个函数,并且绑定一个触发器到表上.不像MySQL开箱即用.不过,也算不上特别的麻烦.

```sql
-- 创建测试用的表
CREATE TABLE IF NOT EXISTS test
(
    id          BIGSERIAL NOT NULL,
    title       VARCHAR(255),

    create_time BIGINT    NOT NULL DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::BIGINT,
    update_time BIGINT    NOT NULL DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::BIGINT,

    create_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT test_pkey PRIMARY KEY (id)
);

-- 创建函数
CREATE OR REPLACE FUNCTION upd_timestamp() RETURNS TRIGGER AS
$$
BEGIN
    new.updated_at := CURRENT_TIMESTAMP;
    new.update_time := (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::BIGINT;
    RETURN new;
END;
$$
    LANGUAGE 'plpgsql';

-- 创建触发器
CREATE TRIGGER t_test
    BEFORE UPDATE
    ON test
    FOR EACH ROW
EXECUTE PROCEDURE upd_timestamp();
```

## MySQL

MySQL最高只支持到微秒

```sql
-- 秒
SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP);

-- 毫秒
SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP(3));

-- 微秒
SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP(6));
```

MySQL/MariaDB下面`ON UPDATE UNIX_TIMESTAMP`语法不合法,也跟PostgreSQL一样,需要用触发器的方式达成.

```sql
-- 创建测试用的表
CREATE TABLE IF NOT EXISTS test
(
    id          BIGINT NOT NULL,
    title       VARCHAR(255),

    create_time BIGINT    NOT NULL DEFAULT UNIX_TIMESTAMP(CURRENT_TIMESTAMP(6)),
    update_time BIGINT    NOT NULL DEFAULT UNIX_TIMESTAMP(CURRENT_TIMESTAMP(6)),

    create_at   TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    CONSTRAINT test_pkey PRIMARY KEY (id)
);
```

## C++

```cpp
#include <iostream>
#include <chrono>

using std::chrono::duration_cast;
using std::chrono::milliseconds;
using std::chrono::microseconds;
using std::chrono::seconds;
using std::chrono::system_clock;

std::cout << "秒：" << duration_cast<seconds>(system_clock::now().time_since_epoch()).count() << std::endl;
std::cout << "毫秒：" << duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() << std::endl;
std::cout << "微秒：" << duration_cast<microseconds>(system_clock::now().time_since_epoch()).count() << std::endl;
std::cout << "纳秒：" << system_clock::now().time_since_epoch().count() << std::endl;
```
