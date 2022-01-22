# 时序数据库应用 -TimeScaleDB

***

## 数据库简介  

<img src='https://www.timescale.com/images/icon.png' width='120px'/>

TimescaleDB是基于PostgreSQL的时序数据库插件，完全继承了PostgreSQL的功能，TimescaleDB是一个开放源代码的时间序列数据库，针对快速提取和复杂查询进行了优化。它使用“完整的SQL”，并且与传统的关系数据库一样易于使用，但是扩展的方式以前只适用于NoSQL数据库。与这两种方案(关系型和NoSQL)所要求的权衡相比，TimescaleDB为时间序列数据提供了两种方案的最佳选择:

### 易于使用  

1. PostgreSQL支持所有SQL的完整SQL接口(包括二级索引，基于非时间的聚合，子查询，JOIN，窗口函数)。  
2. 连接到任何使用PostgreSQL的客户端或工具，无需更改。3.面向时间的特性、API函数和优化。4.对数据保留策略的强大支持。  

### 可扩展  

1. 透明的时间/空间分区，可用于扩展(单节点)和扩展(即将推出)。2.高数据写速率(包括批量提交、内存索引、事务支持、数据回填支持)3.在单个节点上设置大小合适的块(二维数据分区)，以确保即使在大数据量的情况下也能快速摄取数据。4.跨块和服务器的并行操作。

### 相关网站  

- 官网地址: <https://www.timescale.com/>  
- 官方文档: <https://docs.timescale.com/latest/introduction>  

## 搭建本地Docker数据库

### 拉取镜像

```shell
docker pull timescale/timescaledb:latest-pg14
docker pull timescale/timescaledb-postgis:latest-pg13
```

### 运行容器

```shell
docker run -d \
--name timescale-test \
-p 5432:5432 \
-e POSTGRES_PASSWORD=123456 \
timescale/timescaledb-postgis:latest-pg13
```

## golang客户端

因为Timescale只是一个PostgreSQL的插件,所以,我们选择一个pg数据库的客户端即可,选择很多.  

1. 直接使用pg客户端  

``` shell
go get github.com/jackc/pgx/v4
```

2. 使用ORM  

  - gorm

    ```shell
    go get -u gorm.io/driver/postgres
    go get -u gorm.io/gorm
    ```

  - entgo

    ```shell
    go get -d entgo.io/ent/cmd/ent
    ```

## 数据结构定义

传感器信息  
表名: sensors  
| Column                     | Type                                    |Modifiers|
| ----------------------- | -------------------------------------- |-----|
id    |  bigint ||
type  | text ||
location | text ||

传感器记录数据  
表名: sensor_data
| Column                     | Type                                    |Modifiers|
| ----------------------- | -------------------------------------- |-----|
time    | timestamp with time zone |not null|
sensor_id  |  bigint ||
temperature | double precision ||
cpu | double precision ||

1. 创建表  

```sql
-- 创建 传感器 表
CREATE TABLE sensors(
  id SERIAL PRIMARY KEY,
  type VARCHAR(50),
  location VARCHAR(50)
);

-- 创建 传感器记录 表
CREATE TABLE sensor_data (
  time TIMESTAMPTZ NOT NULL,
  sensor_id INTEGER,
  temperature DOUBLE PRECISION,
  cpu DOUBLE PRECISION,
  FOREIGN KEY (sensor_id) REFERENCES sensors (id)
);
-- 创建超级表
SELECT create_hypertable('sensor_data', 'time');
```

2. 插入测试数据  

```sql
INSERT INTO sensors (type, location) VALUES
('a','floor'),
('a', 'ceiling'),
('b','floor'),
('b', 'ceiling');

INSERT INTO sensor_data (time, sensor_id, cpu, temperature)
SELECT
  time,
  sensor_id,
  random() AS cpu,
  random()*100 AS temperature
FROM generate_series(now() - interval '24 hour', now(), interval '5 minute') AS g1(time), generate_series(1,4,1) AS g2(sensor_id);
```

3. 查询数据  

```sql
-- 查询所有数据
SELECT * FROM sensor_data ORDER BY time;

-- 30分钟 温度[平均值] CPU使用率[平均值]
SELECT
  time_bucket('30 minutes', time) AS period,
  AVG(temperature) AS avg_temp,
  AVG(cpu) AS avg_cpu
FROM sensor_data
GROUP BY period;

-- 30分钟 温度[平均值][最新] CPU使用率[平均值]
SELECT
  time_bucket('30 minutes', time) AS period,
  AVG(temperature) AS avg_temp,
  last(temperature, time) AS last_temp,
  AVG(cpu) AS avg_cpu
FROM sensor_data
GROUP BY period;

-- 联表查询
SELECT
  sensors.location,
  time_bucket('30 minutes', time) AS period,
  AVG(temperature) AS avg_temp,
  last(temperature, time) AS last_temp,
  AVG(cpu) AS avg_cpu
FROM sensor_data JOIN sensors on sensor_data.sensor_id = sensors.id
GROUP BY period, sensors.location;
```

4. 查看超表下的块  

```sql
-- 
SELECT show_shunks();
SELECT show_chunks('sensor_data');
```

5. 删除超标下的块  

```sql
SELECT drop_chunks('2017-01-01'::TIMESTAMPTZ, 'sensor_data');
```

## 参考资料  

- [TimeScaleDB在气象时序统计中的应用](https://www.modb.pro/db/84942)  
- [TimeScaleDB性能测试](https://imliuda.com/post/437)  
- [TimeScaleDB把大数据量表转换为超表](https://blog.51cto.com/u_15127675/3308795)  
- [代替 TimescaleDB，TDengine 接管数据量日增 40 亿条的光伏日电系统](https://www.cnblogs.com/taosdata/p/13754716.html)  
- [InfluxDB，TimescaleDB和QuestDB三种时序数据库的比较](https://www.sohu.com/a/480398511_185201)  
- [TimescaleDB比拼InfluxDB：如何选择合适的时序数据库？](https://www.modb.pro/db/89563)  
- [PostgreSQLの時系列データ向け拡張「TimescaleDB」を触ってみた](https://qiita.com/anzai323/items/68d29ea47192bd18cb3a)  
