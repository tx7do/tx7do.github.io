# 开箱即用的GO后台管理系统 Kratos Admin - 支持InfluxDB

InfluxDB 是一款专为`时间序列数据`设计的开源分布式数据库，由 InfluxData
公司开发，主要用于存储、查询和分析带有时间戳的数据（如监控指标、传感器数据、日志时间序列等）。它在处理高写入量、高查询性能的时间序列场景中表现突出，是
IoT（物联网）、监控告警、实时分析等领域的常用工具。

## InfluxDB 的核心概念

| **概念**                           | **说明**                                                                                       |
|----------------------------------|----------------------------------------------------------------------------------------------|
| **时间戳（Timestamp）**	              | 每条数据必须包含的字段，记录数据产生的时间（精确到纳秒），是时间序列数据的核心标识。                                                   |
| **测量（Measurement）**	             | 类似关系型数据库的 “表”，是同一类时间序列数据的集合（如 “cpu_usage”“temperature”）。                                     |
| **标签（Tag）**	                     | 用于标识数据的元信息，**字符串类型**，支持索引（可用于分组、过滤）。例如：传感器 ID（`sensor_id="s1001"`）、设备位置（`location="room1"`）。 |
| **字段（Field）**	                   | 存储具体的测量值，**非字符串类型**（如数值、布尔值），默认不索引（因高频写入的数值通常无需全文检索）。例如：温度值（value=25.5）、CPU 使用率（usage=80）。   |
| **保留策略（Retention Policy, RP）**		 | 定义数据的保留时间（如 “保留 30 天”“永久保留”），InfluxDB 会自动删除过期数据，节省存储空间。                                      |
| **系列（Series）**			                | 由 “测量名 + 标签集” 唯一确定的一组数据序列。例如：`cpu_usage,sensor_id=s1001` 就是一个 Series，代表某个传感器的 CPU 使用率时间序列。   |

## InfluxDB的2.x和3.x的区别

InfluxDB 3.x 是 InfluxDB 2.x 的重大升级版本，两者在架构、功能、性能和使用方式上存在显著差异。以下是主要区别的总结：

### 1. 存储引擎：从 Time-Structured Merge Tree (TSM) 到 IOx

#### InfluxDB 2.x

使用 **TSM 引擎**，基于时间分区的 LSM-Tree 结构，适合高频写入和时间范围查询，但对复杂查询（如跨时间聚合、JOIN）的支持有限。

#### InfluxDB 3.x

采用全新的 **IOx 引擎**（InfluxDB IOx），基于 Apache Arrow 内存格式和 Parquet 存储格式：

- **列式存储**：大幅提升聚合查询（如 SUM、AVG）和复杂分析的性能；
- **向量化执行**：并行处理数据块，减少 CPU 分支预测和缓存失效；
- **云原生架构**：支持存算分离，可扩展至 PB 级数据，更适合大规模集群部署。

### 2. 查询语言：从 Flux 回归 SQL

#### InfluxDB 2.x

主推 **Flux 查询语言**，这是一种专为时间序列设计的函数式语言，语法灵活但学习曲线较陡。

#### InfluxDB 3.x

**重新聚焦 SQL**，支持标准 SQL 查询（如 `SELECT * FROM metrics WHERE time > '2023-01-01'`），同时保留对 Flux 的兼容：

- 降低 SQL 用户的学习成本；
- 支持窗口函数（如 `ROW_NUMBER()`）、`JOIN` 等复杂操作；
- 提供更丰富的分析函数（如时间序列插值、异常检测）。

### 3. 架构：从单体到分布式云原生

#### InfluxDB 2.x

单体架构，企业版支持集群，但部署和管理复杂度较高。

#### InfluxDB 3.x

原生分布式架构，采用 **存算分离** 设计：

- **计算节点**：负责查询处理和数据计算；
- **存储节点**：使用对象存储（如 S3）存储数据，支持水平扩展；
- **自动负载均衡**：集群可动态调整资源，应对流量波动。

### 4. 集成与生态：更紧密的云服务整合

#### InfluxDB 2.x

主要依赖自身生态，通过 Telegraf 收集数据，Grafana 可视化。

#### InfluxDB 3.x

深度整合云服务（如 AWS、Azure）：

- **Serverless 模式**：按需付费，无需管理基础设施；
- **与云原生工具集成**：支持 Prometheus、OpenTelemetry 等数据来源；
- **内置机器学习**：提供时间序列预测、异常检测等 AI 功能。

### 5. 性能与扩展性

#### InfluxDB 2.x

单节点写入吞吐量约 10-50 万点 / 秒，适合中小规模场景。

#### InfluxDB 3.x

性能提升 10-100 倍：

- 写入吞吐量可达 **百万点 / 秒**（集群模式）；
- 查询响应速度提升 10-50 倍（尤其复杂分析查询）；
- 支持 **PB 级数据规模**，数据压缩率比 2.x 高 30-50%。

### 6. 版本与许可

#### InfluxDB 2.x

开源版（AGPLv3）+ 企业版（商业许可），功能差异较大（如集群仅企业版支持）。

#### InfluxDB 3.x

采用 **混合许可**：

- **核心功能开源**（Apache 2.0 许可），包括 IOx 引擎、SQL 查询等；
- **高级功能收费**（如云服务、AI 工具、企业级支持）。

## Docker部署

#### 2.x

```bash
docker run -itd \
    --name influxdb2-server \
    -p 8086:8086 \
    -e INFLUXDB_HTTP_AUTH_ENABLED=true \
    -e INFLUXDB_ADMIN_USER=admin \
    -e INFLUXDB_ADMIN_USER_PASSWORD=123456789 \
    -e INFLUXDB_ADMIN_USER_TOKEN=admintoken123 \
    -e INFLUXDB_DB=my_database \
    bitnami/influxdb:2.7.11
```

create admin user sql script:

```sql
create
user "admin" with password '123456789' with all privileges
```

管理后台: <http://localhost:8086/>

#### 3.x

```bash
docker run -itd \
    --name influxdb3-server \
    -p 8181:8181 \
    -e INFLUXDB_NODE_ID=0 \
    -e INFLUXDB_HTTP_PORT_NUMBER=8181 \
    -e INFLUXDB_HTTP_AUTH_ENABLED=true \
    -e INFLUXDB_CREATE_ADMIN_TOKEN=yes \
    -e INFLUXDB_DB=my_database \
    bitnami/influxdb:latest

docker run -itd \
  --name influxdb3-explorer \
  -p 8888:80 \
  -p 8889:8888 \
  quay.io/influxdb/influxdb3-explorer:latest \
  --mode=admin
```

从3.x版本开始，管理后台被分离了出来：InfluxDB Explorer <http://localhost:8888/>

在管理后台的地址里面填写：`http://host.docker.internal:8181`

## 在 Kratos Admin 中使用 InfluxDB

我把InfluxDB的SDK封装了起来，并且提供了配置文件的支持，使用起来非常简单。

需要说明的是，因为3.x版本比2.x版本有了极大的提升，所以，2.x就不再支持，仅对3.x进行了支持。

首先，我们需要安装库：

```bash
go get github.com/tx7do/kratos-bootstrap/database/influxdb
```

接着在数据库的配置文件`data.yaml`中添加InfluxDB的配置：

```yaml
data:
  influxdb:
    host: "http://localhost:8181"
    token: "apiv3_yYde4mJo0BYC7Ipi_00ZEex-A8if4swdqTBXiO-lCUDKhsIavHlRCQfo3p_DzI7S34ADHOC7Qxf600VVgW6LQQ"
    database: "finances"
    organization: "primary"
```

```go
package data

import (
	"github.com/tx7do/kratos-bootstrap/database/influxdb"
)

func NewInfluxdbClient(logger log.Logger, cfg *conf.Bootstrap) *influxdb.Client {
	cli, err := influxdb.NewClient(logger, cfg)
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
	NewInfluxdbClient,
)

```

在这里，我们以股票的K线（蜡烛图）为实例，来讲解如何使用InfluxDB。

首先，定义模型：

```go
package data

import (
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Candle struct {
	Symbol    *string                `json:"s"`
	Open      *float64               `json:"o"`
	High      *float64               `json:"h"`
	Low       *float64               `json:"l"`
	Close     *float64               `json:"c"`
	Volume    *float64               `json:"v"`
	Timestamp *timestamppb.Timestamp `json:"t"`
}

```

最后，实现`CancleRepo`：

```go
package data

import (
	"github.com/InfluxCommunity/influxdb3-go/v2/influxdb3"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/kratos-bootstrap/database/influxdb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

const (
	TableCandle = "candles"

	TagCandleSymbol = "s"

	FieldCandleOpen   = "o"
	FieldCandleHigh   = "h"
	FieldCandleLow    = "l"
	FieldCandleClose  = "c"
	FieldCandleVolume = "v"
)

type CandleRepo struct {
	client *influxdb.Client
	log    *log.Helper
}

func NewCandleRepo(logger log.Logger, client *influxdb.Client) *CandleRepo {
	repo := &CandleRepo{
		client: client,
		log:    log.NewHelper(log.With(logger, "module", "candle/influx/repo")),
	}

	return repo
}

func (r *CandleRepo) ToPoint(data *Candle) *influxdb3.Point {
	p := influxdb3.NewPoint(
		TableCandle,
		nil,
		nil,
		data.Timestamp.AsTime(),
	)

	p.
		SetTag(TagCandleSymbol, data.GetSymbol())

	p.
		SetDoubleField(FieldCandleOpen, data.GetOpen()).
		SetDoubleField(FieldCandleHigh, data.GetHigh()).
		SetDoubleField(FieldCandleLow, data.GetLow()).
		SetDoubleField(FieldCandleClose, data.GetClose()).
		SetDoubleField(FieldCandleVolume, data.GetVolume())

	return p
}

func (r *CandleRepo) ToData(point *influxdb3.Point) *Candle {
	return &Candle{
		Timestamp: timestamppb.New(point.Values.Timestamp),

		Symbol: influxdb.GetPointTag(point, TagCandleSymbol),

		Open:   point.GetDoubleField(FieldCandleOpen),
		High:   point.GetDoubleField(FieldCandleHigh),
		Low:    point.GetDoubleField(FieldCandleLow),
		Close:  point.GetDoubleField(FieldCandleClose),
		Volume: point.GetDoubleField(FieldCandleVolume),
	}
}

func (r *CandleRepo) Create(ctx context.Context, req *Candle) error {
	if req == nil {
		return candleV1.ErrorBadRequest("request data is required")
	}

	return influxdb.Insert(ctx, r.client, req, r)
}

```

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)
