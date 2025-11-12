# 开箱即用的GO后台管理系统 Kratos Admin - 支持ClickHouse

ClickHouse 是一款由俄罗斯搜索引擎公司 **Yandex** 开发的开源列式存储数据库，专为**海量数据实时分析**设计。它以**极致的查询性能**和**高吞吐写入能力**著称，尤其擅长处理PB 级别的结构化数据，并能在毫秒到秒级内完成复杂的聚合分析（如多维度统计、漏斗计算、用户行为分析等），是大数据分析、数据仓库、实时报表等场景的核心工具。

## ClickHouse 的核心概念

| 概念	               | 说明                                                                                                                                                       |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| 表（Table）	         | 类似关系型数据库的表，存储结构化数据，但底层按列存储。                                                                                                                              |
| 引擎（Engine）	       | 决定表的存储方式、查询特性和分布式行为，是 ClickHouse 的核心设计。例如：<br/>- `MergeTree` 系列：最常用，支持索引、分区、副本，适合海量数据存储；<br/>- `Log` 系列：轻量无索引，适合临时小表；<br/>- `Distributed`：分布式表，用于管理集群分片。 |
| 分区（Partition）	    | 按规则（如时间、地区）将表数据拆分，查询时可快速过滤分区，减少扫描范围（如按 “日期” 分区，查询 “2023 年 10 月数据” 仅需扫描对应分区）。                                                                             |
| 主键（Primary Key）	  | 用于排序和快速查找，不同于关系型数据库的唯一约束，ClickHouse 主键允许重复，主要作用是优化查询性能。                                                                                                  |
| 跳数索引（Skip Index）	 | 辅助索引，用于快速判断某一范围内是否存在符合条件的数据（如 “数值是否在 100-200 之间”），进一步减少扫描量。                                                                                              |
| 分片（Shard）	        | 集群中数据的物理拆分单位，每个分片存储表的一部分数据，分布在不同节点，实现并行处理。                                                                                                               |
| 副本（Replica）	      | 同一分片的冗余备份，用于故障恢复和负载均衡（查询可分散到不同副本），保证数据不丢失。                                                                                                               |

## ClickHouse 与其他数据库的差异

| 维度	   | ClickHouse                | 传统关系型数据库（如 MySQL）	  | Hadoop 生态（如 Hive）               |
|-------|---------------------------|---------------------|---------------------------------|
| 核心场景	 | 实时海量数据分析（PB 级，毫秒 / 秒级响应）	 | 事务性业务（增删改查，强一致性）	   | 离线批处理分析（TB/PB 级，分钟 / 小时级）       |
| 存储方式	 | 列式存储，高压缩	                 | 行式存储，压缩率低	          | 列式存储（ORC/Parquet），压缩率高          |
| 写入特性	 | 高吞吐，近实时，不支持事务	            | 支持事务，写入性能适中	        | 批处理写入，延迟高                       |
| 查询性能	 | 极致的聚合查询速度	                | 适合单行 / 小批量查询，复杂分析慢	 | 支持复杂分析，但速度慢（依赖 MapReduce/Spark） |
| 灵活性	  | 不支持行级更新 / 删除，事务弱	         | 支持行级增删改查，事务强	       | 不支持实时更新，灵活性低                    |

## Docker部署

```bash
docker pull bitnami/clickhouse:latest

docker run -itd \
    --name clickhouse-server \
    --network=app-tier \
    -p 8123:8123 \
    -p 9000:9000 \
    -p 9004:9004 \
    -e ALLOW_EMPTY_PASSWORD=no \
    -e CLICKHOUSE_ADMIN_USER=default \
    -e CLICKHOUSE_ADMIN_PASSWORD=123456 \
    bitnami/clickhouse:latest
```

## 在 Kratos Admin 中使用 ClickHouse

我把ClickHouse的SDK封装了起来，并且提供了配置文件的支持，使用起来非常简单。

ClickHouse支持go的sql标准库更新查询，但是，会有一些限制，比如不支持事务等。所以，想要完整的功能，还是需要使用ClickHouse的官方SDK。因此，我们仅提供了原生的ClickHouse SDK 封装。

首先，我们需要安装库：

```bash
go get github.com/tx7do/kratos-bootstrap/database/clickhouse
```

接着在数据库的配置文件`data.yaml`中添加ClickHouse的配置：

```yaml
data:
  clickhouse:
    addresses:
      - "localhost:9000"
    username: "default"
    password: "123456"
    database: "finances"
```

添加好了配置之后，我们就可以在`data`包里面创建Clickhouse的客户端了：

```go
package data

import (
	"github.com/tx7do/kratos-bootstrap/database/clickhouse"
)

func NewClickHouseClient(logger log.Logger, cfg *conf.Bootstrap) *clickhouse.Client {
	cli, err := clickhouse.NewClient(logger, cfg)
	if err != nil {
		return nil
	}
	return cli
}
```

在`data/init.go`注入到wire：

```go
//go:build wireinject
// +build wireinject

package data

import "github.com/google/wire"

var ProviderSet = wire.NewSet(
	NewClickHouseClient,
)
```

在这里，我们以股票的K线（蜡烛图）为实例，来讲解如何使用ClickHouse。

首先，定义模型：

```go
package data

import "time"

type Candle struct {
	Timestamp *time.Time `json:"timestamp" ch:"timestamp"`
	Symbol    *string    `json:"symbol" ch:"symbol"`
	Open      *float64   `json:"open" ch:"open"`
	High      *float64   `json:"high" ch:"high"`
	Low       *float64   `json:"low" ch:"low"`
	Close     *float64   `json:"close" ch:"close"`
	Volume    *float64   `json:"volume" ch:"volume"`
}

```

最后，实现`CancleRepo`：

```go
package data

import (
	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/kratos-bootstrap/database/clickhouse"
)

const candleTableName = "candles"

type CandleRepo struct {
	client *clickhouse.Client
	log    *log.Helper
}

func NewCandleRepo(logger log.Logger, client *clickhouse.Client) *CandleRepo {
	repo := &CandleRepo{
		log:    log.NewHelper(log.With(logger, "module", "candle/ck/repo")),
		client: client,
	}

	return repo
}

func (r *CandleRepo) Create(ctx context.Context, req *Candle) error {
	if req == nil {
		return candleV1.ErrorBadRequest("request data is required")
	}

	err := r.client.Insert(ctx, candleTableName, "", req)
	if err != nil {
		r.log.Errorf("create candle failed: %s", err.Error())
		return candleV1.ErrorInternalServerError("create candle failed")
	}
	return nil
}

```

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)
