# Go Wind Admin（风行）：开箱即用的 GO 全栈后台管理系统 - 支持MongoDB

MongoDB 是一种开源的`文档型数据库`，属于 NoSQL（非关系型数据库）的范畴，由 MongoDB Inc. 开发并维护。它与传统的关系型数据库（如MySQL、PostgreSQL）在数据存储结构、查询方式等方面有显著差异，更适合处理非结构化或半结构化数据，以及需要灵活扩展的场景。

## MongoDB 的核心概念（与关系型数据库对比）

| MongoDB         | 关系型数据库	         | 说明                    |
|-----------------|-----------------|-----------------------|
| 数据库（Database）	  | 数据库（Database）	  | 逻辑上的独立数据集合            |
| 集合（Collection）	 | 表（Table）        | 存储文档的容器，无需预定义结构       |
| 文档（Document）	   | 行（Row）	         | 一条数据记录，以 BSON 格式存储    |
| 字段（Field）	      | 列（Column）	      | 文档中的键值对，类似 JSON 的 “键” |
| 索引（Index）	      | 索引（Index）			    | 用于加速查询，支持单字段、复合、地理等索引 |
| `_id`字段	        | 主键（Primary Key） | 每个文档自动生成的唯一标识，类似主键    |

## Docker部署

下载镜像：

```bash
docker pull bitnami/mongodb:latest
docker pull bitnami/mongodb-exporter:latest
```

带密码安装：

```bash
docker run -itd \
    --name mongodb-server \
    -p 27017:27017 \
    -e MONGODB_ROOT_USER=root \
    -e MONGODB_ROOT_PASSWORD=123456 \
    -e MONGODB_USERNAME=test \
    -e MONGODB_PASSWORD=123456 \
    -e MONGODB_DATABASE=finances \
    bitnami/mongodb:latest
```

不带密码安装：

```bash
docker run -itd \
    --name mongodb-server \
    -p 27017:27017 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    bitnami/mongodb:latest
```

有两点需要注意：

1. 如果需要映射数据卷，需要把本地路径的所有权改到1001：`sudo chown -R 1001:1001 data/db`，否则会报错：
   `‘mkdir: cannot create directory ‘/bitnami/mongodb’: Permission denied’`；
2. 从MongoDB 5.0开始，有些机器运行会报错：`Illegal instruction`，这是因为机器硬件不支持 **AVX 指令集** 的缘故，没办法，MongoDB降级吧。

## 在 Go Wind Admin 中使用 MongoDB

我把MongoDB的SDK封装了起来，并且提供了配置文件的支持，使用起来非常简单。

首先，我们需要安装库：

```bash
go get github.com/tx7do/kratos-bootstrap/database/mongodb
```

接着在数据库的配置文件`data.yaml`中添加MongoDB的配置：

```yaml
data:
  mongodb:
    uri: "mongodb://root:123456@localhost:27017/?compressors=snappy,zlib,zstd"
    database: finances
```

现在，我们开始创建客户端，在`data.go`添加以下代码：

```go
package data

import (
	"github.com/tx7do/kratos-bootstrap/database/mongodb"
)

func NewMongodbClient(logger log.Logger, cfg *conf.Bootstrap) *mongodb.Client {
	cli, err := mongodb.NewClient(logger, cfg)
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
	NewMongodbClient,
)

```

在这里，我们以股票的K线（蜡烛图）为实例，来讲解如何使用MongoDB。

首先，定义模型：

```go
package data

import (
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Candle struct {
	Symbol    *string                `json:"s" bson:"s"`
	Open      *float64               `json:"o" bson:"o"`
	High      *float64               `json:"h" bson:"h"`
	Low       *float64               `json:"l" bson:"l"`
	Close     *float64               `json:"c" bson:"c"`
	Volume    *float64               `json:"v" bson:"v"`
	StartTime *timestamppb.Timestamp `json:"st" bson:"st"`
	EndTime   *timestamppb.Timestamp `json:"et" bson:"et"`
}

```

最后，实现`CancleRepo`：

```go
package data

import (
   "github.com/go-kratos/kratos/v2/log"
   "github.com/tx7do/kratos-bootstrap/database/mongodb"
)

const (
   // CollectionCandle is the name of the candle collection.
   CollectionCandle = "candles"
)

type CandleRepo struct {
   client *mongodb.Client
   log    *log.Helper
}

func NewCandleRepo(logger log.Logger, client *mongodb.Client) *CandleRepo {
   repo := &CandleRepo{
      client: client,
      log:    log.NewHelper(log.With(logger, "module", "candle/mongo/repo")),
   }

   return repo
}

func (r *CandleRepo) Create(ctx context.Context, req *Candle) error {
   if req == nil {
      return candleV1.ErrorBadRequest("request data is required")
   }

   err := r.client.InsertOne(ctx, CollectionCandle, "", req)
   if err != nil {
      r.log.Errorf("create candle failed: %s", err.Error())
      return candleV1.ErrorInternalServerError("create candle failed")
   }
   return nil
}

```

## 项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
