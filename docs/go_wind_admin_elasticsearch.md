# Go Wind Admin（风行）：开箱即用的 GO 全栈后台管理系统 - 支持ElasticSearch

ElasticSearch（简称 ES）是一款开源的`分布式全文搜索引擎`，同时也是一个基于 Lucene 的实时分布式存储、搜索和分析引擎。它由Elastic 公司开发，主要用于解决海量数据的实时检索、分析和存储问题，具有高性能、高可用、易扩展等特点，广泛应用于日志分析、全文检索、业务监控等场景。

## ElasticSearch 的核心概念

| 概念            | 说明                                                             |
|---------------|----------------------------------------------------------------|
| 索引（Index）     | 类似关系型数据库的 “表”，是具有相似结构的文档集合（如 “商品索引”“用户日志索引”）。每个索引有唯一名称，用于操作数据。 |
| 文档（Document）	 | 索引中的一条数据，以 JSON 格式存储，类似关系型数据库的 “行”。每个文档有唯一 ID（可自定义或自动生成）。      |
| 字段（Field）	    | 文档中的键值对，类似 JSON 的 “键”，对应数据的具体属性（如 “商品名称”“价格”）。                 |
| 分片（Shard）	    | 索引的最小存储单位，一个索引可分为多个分片（默认 5 个主分片），分布式存储在不同节点，实现并行处理。            |
| 副本（Replica）	  | 分片的备份，用于提高查询性能和容错性（默认 1 个副本）。主分片故障时，副本可升级为主分片。                 |
| 节点（Node）	     | 运行 ES 服务的单个服务器，多个节点组成集群。节点分为主节点（管理集群）、数据节点（存储数据）等角色。           |
| 集群（Cluster）	  | 由多个节点组成的集合，共同管理索引数据，对外提供统一的服务入口。                               |

## ElasticSearch 与关系型数据库的差异

| ElasticSearch | 关系型数据库    |
|---------------|-----------|
| Index         | 表（Table）  |
| Document      | 行（Row）    |
| Field         | 列（Column） |
| Mapping       | 表结构定义     |

```bash
docker pull bitnami/elasticsearch:latest

docker run -itd \
    --name elasticsearch \
    -p 9200:9200 \
    -p 9300:9300 \
    -e ELASTICSEARCH_USERNAME=elastic \
    -e ELASTICSEARCH_PASSWORD=elastic \
    -e ELASTICSEARCH_NODE_NAME=elasticsearch-node-1 \
    -e ELASTICSEARCH_CLUSTER_NAME=elasticsearch-cluster \
    bitnami/elasticsearch:latest
```

## 在 Go Wind Admin 中使用 ElasticSearch

我把ElasticSearch的SDK封装了起来，并且提供了配置文件的支持，使用起来非常简单。

首先，我们需要安装库：

```bash
go get github.com/tx7do/kratos-bootstrap/database/elasticsearch
```

接着在数据库的配置文件`data.yaml`中添加ElasticSearch的配置：

```yaml
data:
  elastic_search:
    addresses:
      - "http://localhost:9200"
    username: "elastic"
    password: "elastic"
```

现在，我们开始创建客户端：

```go
package data

import (
	"github.com/tx7do/kratos-bootstrap/database/elasticsearch"
)

func NewElasticSearchClient(logger log.Logger, cfg *conf.Bootstrap) *elasticsearch.Client {
	cli, err := elasticsearch.NewClient(logger, cfg)
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
	NewElasticSearchClient,
)

```

在这里，我们以股票的K线（蜡烛图）为实例，来讲解如何使用ElasticSearch。

首先，定义模型：

```go
package data

import "time"

type Candle struct {
	Timestamp *time.Time `json:"timestamp"`
	Symbol    *string    `json:"symbol"`
	Open      *float64   `json:"open"`
	High      *float64   `json:"high"`
	Low       *float64   `json:"low"`
	Close     *float64   `json:"close" `
	Volume    *float64   `json:"volume"`
}

const CandleMapping = `
{
  "mappings": {
    "properties": {
      "timestamp": {"type": "date"},
      "symbol": {"type": "keyword"},
      "open": {"type": "double"},
      "high": {"type": "double"},
      "low": {"type": "double"},
      "close": {"type": "double"},
      "volume": {"type": "double"}
    }
  }
}`

```

最后，实现`CancleRepo`：

```go
package data

import (
	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/kratos-bootstrap/database/elasticsearch"
)

const candleIndex = "candles"

type CandleRepo struct {
	client *elasticsearch.Client
	log    *log.Helper
}

func NewCandleRepo(logger log.Logger, client *elasticsearch.Client) *CandleRepo {
	repo := &CandleRepo{
		log:    log.NewHelper(log.With(logger, "module", "candle/elasticsearch/repo")),
		client: client,
	}

	ctx := context.Background()

	if exists, _ := repo.client.IndexExists(ctx, candleIndex); !exists {
		_ = repo.client.CreateIndex(ctx, candleIndex, CandleMapping, "")
	}

	return repo
}

func (r *CandleRepo) Create(ctx context.Context, req *Candle) error {
	if req == nil {
		return candleV1.ErrorBadRequest("request data is required")
	}

	err := r.client.InsertDocument(ctx, candleIndex, "", req)
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
