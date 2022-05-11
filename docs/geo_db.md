# 地理空间搜索

## Redis

Redis 3.2.0版本开始，提供了`GEO`系列命令，可以用搜索、索引地理位置信息。

### 索引地理位置信息

```bash
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
```

### 获取GeoHash值

```bash
GEOHASH Sicily Palermo Catania
```

在线GeoHash工具：

* <http://geohash.co/>
* <https://www.movable-type.co.uk/scripts/geohash.html>

### 求两点距离

单位默认为：米，也可以在命令最后面跟单位：

* m 米
* km 千米
* mi 英里
* ft 英尺

```bash
GEODIST Sicily Palermo Catania
```

如果不存在两点，则返回nil。

### 返回经纬度坐标点

```bash
GEOPOS Sicily Palermo Catania NonExisting
```

### 区域搜索

```bash
# 圆形范围
GEOSEARCH Sicily FROMLONLAT 15 37 BYRADIUS 200 km ASC
# 矩形范围
GEOSEARCH Sicily FROMLONLAT 15 37 BYBOX 400 400 km ASC WITHCOORD WITHDIST
```

## PostGIS

### 安装PostGIS插件

```sql
-- 安装插件
CREATE extension postgis;

-- 查看插件版本
SELECT postgis_version();
SELECT postgis_full_version();
```

### 创建测试表

创建泛空间类型`geometry`的表，另外还有 Point / MultiPoint / Linestring / MultiLinestring / Polygon / MultiPolygon 等类型可供选择：

```sql
create table testg ( id int, geom geometry) 
distributed by (id);
```

### 插入测试数据

```sql
-- without srid
insert into testg values (1, ST_GeomFromText('point(116 39)'));

-- with srid
insert into test values (1, ST_GeomFromText('point(116 39)', 4326));
```

### 典型空间查询SQL

* 矩形范围查询

```sql
-- without srid
select st_astext(geom) from testg
where ST_Contains(ST_MakeBox2D(ST_Point(116, 39),ST_Point(117, 40)), geom);

-- with srid
select st_astext(geom) from test 
where ST_Contains(ST_SetSRID(ST_MakeBox2D(ST_Point(116, 39),ST_Point(117, 40)), 4326), geom);
```

* 几何缓冲范围查询

```sql
-- without srid
select st_astext(geom) from testg
where ST_DWithin(ST_GeomFromText('POINT(116 39)'), geom, 0.01);

-- with srid
select st_astext(geom) from test 
where ST_DWithin(ST_GeomFromText('POINT(116 39)', 4326), geom, 0.01);
```

* 多边形相交判定（在内部或在边界上）

```sql
-- without srid
select st_astext(geom) from testg
where ST_Intersects(ST_GeomFromText('POLYGON((116 39, 116.1 39, 116.1 39.1, 116 39.1, 116 39))'), geom);

-- with srid
select st_astext(geom) from test 
where ST_Intersects(ST_GeomFromText('POLYGON((116 39, 116.1 39, 116.1 39.1, 116 39.1, 116 39))', 4326), geom);
```

## ClickHouse

## Elasticsearch

## 参考资料

* [使用PostGIS](https://help.aliyun.com/document_detail/127419.html)
* [PostGIS介绍](https://zhuanlan.zhihu.com/p/62034688)
* [ClickHouse GEO](https://clickhouse.com/docs/zh/sql-reference/functions/geo/coordinates)
