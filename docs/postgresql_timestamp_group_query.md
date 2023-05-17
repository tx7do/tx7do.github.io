# Postgresql按时间分组统计查询（年月日周时分秒）

```sql
create table public."user" (
  id integer primary key not null, -- id
  create_time bigint, -- 创建时间
  update_time bigint, -- 更新时间
  delete_time bigint, -- 删除时间

  created_at TIMESTAMP, -- 创建时间
  updated_at TIMESTAMP, -- 更新时间
  deleted_at TIMESTAMP  -- 删除时间
);
```

## 年

```sql
select to_char(to_timestamp(create_time / 1000), 'YYYY') as year, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by year
order by year;

select date_part('year', to_timestamp(create_time / 1000)) as year, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by year
order by year;
```

```sql
select to_char(created_at::DATE, 'YYYY') as year, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by year
order by year;
```

## 月

```sql
select to_char(to_timestamp(create_time / 1000), 'YYYY-MM') as month, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by month
order by month;
```

```sql
select to_char(created_at::DATE, 'YYYY-MM') as month, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by month
order by month;
```

## 周

```sql
select to_char(to_timestamp(1683742216358 / 1000) - (extract(dow from to_timestamp(1683742216358 / 1000))-1 || 'day')::interval, 'YYYY-mm-dd') as week, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'yyyy-mm-dd') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'yyyy-mm-dd') <= '2024-01-01'
group by week
order by week;
```

```sql
select to_char(created_at::DATE - (extract(dow from created_at::TIMESTAMP)-1 || 'day')::interval, 'YYYY-mm-dd') week, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by week
order by week;
```

## 日

```sql
select to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') as day, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by day
order by day;
```

```sql
select to_char(created_at::DATE, 'YYYY-MM-DD') as day, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by day
order by day;
```

## 小时

```sql
select to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD HH24') as hour, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by hour
order by hour;
```

```sql
select to_char(created_at::DATE, 'YYYY-MM-DD HH24') as hour, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by hour
order by hour;
```

## 分钟

```sql
select to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD HH24:MI') as minute, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by minute
order by minute;
```

```sql
select to_char(created_at::DATE, 'YYYY-MM-DD HH24:MI') as minute, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by minute
order by minute;
```

## 秒

```sql
select to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD HH24:MI:SS') as second, COUNT(*) as num
from "user"
where to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') >= '2023-01-01'
  and to_char(to_timestamp(create_time / 1000), 'YYYY-MM-DD') <= '2024-01-01'
group by second
order by second;
```

```sql
select to_char(created_at::DATE, 'YYYY-MM-DD HH24:MI:SS') as second, COUNT(*) as num
from "user"
where created_at >= '2023-01-01'
  and created_at <= '2024-01-01'
group by second
order by second;
```

## 参考资料

- [PostgreSQL 实现按年、月、日、周、时、分、秒分组统计](https://www.cnblogs.com/chenyablog/p/12482855.html)
