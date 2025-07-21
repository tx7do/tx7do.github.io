# Golang微服框架Kratos与它的小伙伴系列 - 分布式事务框架 - DTM

在 GO 语言生态中，**DTM（Distributed Transaction Manager）**
是一个开源的分布式事务管理服务，专门用于解决微服务架构下分布式事务的一致性问题。它以轻量、易用、高性能为特点，支持多种分布式事务模式，是
GO 语言开发者在处理跨服务数据一致性时的常用工具。

## DTM 的核心功能与特点

### 1. 支持多种事务模式

DTM 针对不同业务场景，实现了主流的分布式事务协议，包括：

- **TCC（Try-Confirm-Cancel）**：适用于核心业务场景，通过拆分业务为 “`尝试`”、“`确认`”、“`取消`” 三个阶段，保证最终一致性。
- **SAGA**：适用于长事务场景，将分布式事务拆分为多个本地事务步骤，每个步骤对应一个补偿操作，若某步失败则执行反向补偿。
- **本地消息表（Local Message Table）**：基于消息的异步确认机制，通过本地事务与消息发送的原子性，确保跨服务操作的最终一致。
- **事务消息**：结合消息队列实现，通过 “半消息”、“确认发送”、“消费确认” 等机制，保证消息可靠投递与业务操作的一致性。
- **XA**：基于数据库的 XA 协议（如 MySQL 的 XA 事务），适用于对强一致性要求高且支持 XA 协议的数据库场景。

### 2. 轻量易用

- 作为 GO 语言实现的服务，DTM 部署简单，可独立运行或嵌入应用，对现有系统侵入性低。
- 提供简洁的 API 接口，开发者无需深入理解复杂的分布式事务理论，即可快速集成（例如，通过几行代码即可定义一个 TCC 事务）。

### 3. 高可用性与可靠性

- 支持集群部署，通过分布式锁和数据持久化（如存储到 MySQL、Redis 等）确保事务状态不丢失，即使服务重启也能恢复未完成的事务。
- 内置重试机制和幂等性处理，解决网络抖动、服务临时故障等问题导致的事务不一致。

### 4. 跨语言与跨服务支持

虽然 DTM 本身由 GO 语言开发，但通过 HTTP/GRPC 协议，可与其他语言（如 Java、Python）的微服务交互，支持多语言异构系统的分布式事务管理。

## DTM 的工作原理

DTM 的核心是**事务协调器（Coordinator）**，它负责：

- 记录分布式事务的全局状态（如开始、执行中、完成、失败）。
- 协调参与事务的各个微服务（分支事务），根据事务模式触发相应的操作（如 TCC 的 Confirm/Cancel，SAGA 的补偿步骤）。
- 当某分支事务失败时，根据预设规则执行回滚或重试，确保最终一致性。

例如，在一个 “下单 - 扣库存 - 支付” 的分布式事务中，DTM 会作为协调器，监控三个服务的本地事务执行情况：若支付成功，则确认库存扣减和订单状态；若支付失败，则触发库存回滚和订单取消。

## 在微服务框架Kratos下实现各种事务模式

我们要去学习分布式事务，通常有两个典型的场景，可以用于学习：

- 银行转账
- 电商订单

银行相关的事务实例对于初学者来说，存在一定的理解门槛，相对而言不太友好。

相比之下，电商场景的实例（如订单创建、库存扣减、支付流程等）更适合初学者：

- 业务场景贴近生活，初学者更容易理解，比如下单时需要扣减库存、创建订单记录、处理支付等流程，这些都是人们在日常网购中熟悉的环节。
- 业务逻辑相对清晰，核心事务逻辑（如保证订单、库存、支付数据的一致性）突出，能让初学者更专注于事务模式的实现和原理。

因此，对于初学者来说，从电商实例入手学习事务模式会更轻松高效，等对事务模式有了一定理解后，再去研究银行等复杂领域的实例会更容易上手。

因此，我们将以电商订单场景为例，介绍 DTM 在 Kratos 微服务框架下的应用。

在电商订单场景中，分布式事务的核心目标是保证跨服务操作（如
“下单→扣库存→支付→物流→积分”）的一致性。不同分布式事务模式（二阶段消息、SAGA、TCC、XA、Workflow）的设计理念和特性不同，适用的子场景也存在显著差异。

### 准备工作

在开始之前，请确保已经安装了 DTM 服务，并且 Kratos 框架的环境已经搭建完成。

#### 部署DTM

DTM 服务的核心端口：

| 端口	    | 协议	  | 功能描述                                        |
|--------|------|---------------------------------------------|
| 36789	 | HTTP | DTM 的 HTTP API 服务端口，用于接收 HTTP 协议的事务请求和管理操作。 |
| 36790  | gRPC | DTM 的 gRPC API 服务端口，用于接收 gRPC 协议的事务请求，性能更高。 |

DTM 可以通过 Docker 容器进行部署：

```shell
docker run -itd \
  --name dtm \
  -p 36789:36789 \
  -p 36790:36790 \
  -e MICRO_SERVICE_DRIVER="dtm-driver-kratos" \
  -e MICRO_SERVICE_TARGET="etcd://127.0.0.1:2379/dtmservice" \
  -e MICRO_SERVICE_END_POINT="grpc://127.0.0.1:36790" \
  yedf/dtm:latest
```

如果不想使用 Docker，也可以通过二进制文件安装 DTM。

在MacOS下面可以通过brew安装：

```shell
brew install dtm
```

最简单的安装方式是通过 `go install` 命令：

```shell
go install github.com/dtm-labs/dtm@main
```

安装好之后，我们需要对之进行配置，配置文件 `conf.yml` 如下：

配置为 Etcd 服务发现：

```yaml
MicroService:
  Driver: 'dtm-driver-kratos' # name of the driver to handle register/discover
  Target: 'etcd://127.0.0.1:2379/dtm-service' # register dtm server to this url
  EndPoint: 'grpc://127.0.0.1:36790'
```

配置为 Consul 服务发现：

```yaml
#  dtm: conf.yml
MicroService:
  Driver: 'dtm-driver-kratos' # name of the driver to handle register/discover
  Target: 'consul://127.0.0.1:8500/dtm-service' # register dtm server to this url
  EndPoint: 'grpc://127.0.0.1:36790'
```

增加Redis数据源的配置：

```yaml
#  dtm: conf.yml
Store:
  # Redis
  Driver: 'redis'
  Host: 'localhost' # host1:port1,host2:port2 for cluster connection
  Port: 6379
  User: ''
  Password: '*Abcd123456'
```

最后，我们就可以启动 DTM 的二进制服务了：

```shell
dtm -c ./conf.yml
```

它还提供了一个Web Admin，我们可以通过浏览器访问 `http://localhost:36789` 来查看 DTM 的状态和事务信息。

#### 初始化代码

首先，我们需要安装DTM的Go客户端库：

```shell
go get github.com/dtm-labs/client
go get github.com/dtm-labs/dtmdriver
go get github.com/dtm-labs/dtmdriver-kratos
```

接下来，我们需要初始化DTM的Kratos驱动：

```go
package data

import (
	"github.com/dtm-labs/dtmdriver"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/registry"

	_ "github.com/dtm-labs/dtmdriver-kratos"
	dtmdriverKratos "github.com/dtm-labs/dtmdriver-kratos"
)

// NewData .
func NewData(logger log.Logger, rr registry.Discovery) (*Data, func(), error) {
	// 激活 Kratos DTM Driver
	_ = dtmdriver.Use(dtmdriverKratos.Name)

	return d, func() {
		l.Info("message", "closing the data resources")
	}, nil
}

```

这个驱动主要就是提供了服务发现的功能，使用了 Kratos 的服务发现机制。

最后，我们还需要做一个初始化的工作：

```go
package data

import (
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/registry"
	"github.com/go-kratos/kratos/v2/transport/grpc/resolver/discovery"

	"google.golang.org/grpc/resolver"
)

// NewData .
func NewData(logger log.Logger, rr registry.Discovery) (*Data, func(), error) {
	// 注册Kratos的gRPC解析器的用于动态解析服务地址，用于与Dtm服务通信
	resolver.Register(discovery.NewBuilder(rr, discovery.WithInsecure(true)))

	return d, func() {
		l.Info("message", "closing the data resources")
	}, nil
}
```

做这个工作是为了让 DTM 的 gRPC 客户端能够正确地解析服务地址，使用 Kratos 的服务发现机制。

现在，我们就可以给DTM传入类似这样的地址：`discovery:///dtm-service`，解析器的作用就是将这个地址解析为实际的服务地址。如果没有这个解析器，DTM
就无法正确地连接到服务，这时候，我们就只能够硬代码写死服务地址了。

### 1. 二阶段消息（Two-Phase Message）

二阶段消息（Two-Phase Message）是一种独立于消息队列的分布式事务架构，通过 “Prepare（预准备）→Submit（提交）” 两阶段，结合 DTM
协调器和业务数据库的 barrier 表，实现 “本地事务执行” 与 “跨服务操作触发” 的原子性。其设计不依赖
MQ，目标是替代事务消息和本地消息表，提供更轻量、自动化的一致性方案。

事务消息是“异步消息投递” 模式，而二阶段消息则是“同步消息投递” 模式，二阶段消息的核心在于：

- **Prepare 阶段**：业务服务执行本地事务，并将状态记录到 DTM 的 barrier 表，表示准备就绪。
- **Submit 阶段**：DTM 协调器检查所有参与方的状态，若都准备就绪，则提交事务；若有失败，则回滚。
- **幂等性**：二阶段消息的设计确保每个操作都是幂等的，即多次执行结果相同，避免重复提交导致数据不一致。

在电商场景中，二阶段消息最适合需要跨服务强一致性、希望减少中间件依赖（无
MQ）、需简化幂等与回查逻辑、支持多下游操作的场景，如订单与库存联动、支付后多服务通知、秒杀下单、退款流程等。其核心价值是用更轻量的架构（仅
DTM + 数据库）替代传统事务消息 + MQ 的方案，降低开发与运维成本。

我们这里用订单与库存联动的场景来说明二阶段消息的使用：

```go
package service

import "github.com/dtm-labs/client/dtmgrpc"

func (s *ShopService) TestTP(_ context.Context, req *shopV1.BuyRequest) (*shopV1.BuyResponse, error) {
	var requestId string

	gid := dtmgrpc.MustGenGid(dtmServer)

	requestId = gid // 使用 gid 作为 request_id

	// 创建消息事务
	msg := dtmgrpc.NewMsgGrpc(dtmServer, gid).
		Add(
			shopServer+shopV1.StockService_DeductStock_FullMethodName,
			&shopV1.DeductStockRequest{
				ProductId: req.ProductId,
				Quantity:  req.Quantity,
				RequestId: requestId,
			},
		).
		Add(
			shopServer+shopV1.OrderService_CreateOrder_FullMethodName,
			&shopV1.CreateOrderRequest{
				UserId:    req.UserId,
				ProductId: req.ProductId,
				Quantity:  req.Quantity,
				RequestId: requestId,
			},
		)

	msg.WaitResult = true

	// 提交事务
	if err := msg.Submit(); err != nil {
		s.log.Errorf("提交购买事务失败: %v", err)
		return nil, shopV1.ErrorInternalServerError(err.Error())
	}

	s.log.Infof("购买事务提交成功，GID: %s", gid)

	return &shopV1.BuyResponse{Success: true}, nil
}

```

1. 建全局事务 ID：使用 `dtmgrpc.MustGenGid` 生成全局事务 ID，确保事务的唯一性。
2. 添加分支任务：第一个任务是**扣减库存**，调用 `StockService.DeductStock` 方法；第二个任务是**创建订单**，调用
   `OrderService.CreateOrder` 方法。
3. 设置同步等待结果：通过 `msg.WaitResult = true`，确保事务提交后立即返回结果。
4. 提交事务：调用 `msg.Submit()` 提交二阶段消息事务，确保所有分支任务按预期执行。

这种实现方式能够保证订单创建和库存扣减的强一致性，适用于电商场景中的跨服务操作。

该模式很简单，核心要解决的问题是业务的幂等性。`Order`比较简单，只需要在订单表中记录 `request_id`
即可。`Stock`比较复杂一些，因为它需要保证库存扣减的幂等性，我们使用了`StockDeductionLog`来保证了其幂等性:

```go
package service

func (s *StockService) DeductStock(_ context.Context, req *shopV1.DeductStockRequest) (*shopV1.StockResponse, error) {
	exist, err := s.stockDeductionLogRepo.ExistLogByRequestID(req.GetRequestId())
	if err != nil {
		s.log.Errorf("failed to check stock deduction log existence for request_id: %s, error: %v", req.GetRequestId(), err)
		return nil, shopV1.ErrorInternalServerError("failed to check stock deduction log existence: %v", err)
	}
	if exist {
		s.log.Infof("stock deduction log already exists for request_id: %s", req.GetRequestId())
		return &shopV1.StockResponse{Success: true}, nil
	}

	if err = s.stockRepo.DeductStock(req.GetProductId(), req.GetQuantity()); err != nil {
		s.log.Errorf("failed to deduct stock for product_id: %d, quantity: %d, error: %v", req.GetProductId(), req.GetQuantity(), err)
		return nil, shopV1.ErrorInternalServerError("failed to deduct stock: %v", err)
	}

	if err = s.stockDeductionLogRepo.CreateLog(&shopV1.StockDeductionLog{
		ProductId: req.GetProductId(),
		RequestId: req.GetRequestId(),
		Quantity:  req.GetQuantity(),
	}); err != nil {
		s.log.Errorf("failed to create stock deduction log for request_id: %s, error: %v", req.GetRequestId(), err)
		return nil, shopV1.ErrorInternalServerError("failed to create stock deduction log: %v", err)
	}

	return &shopV1.StockResponse{}, nil
}

```

### 2. TCC 模式（Try-Confirm-Cancel）

DTM 的 TCC（Try-Confirm-Cancel）模式是一种经典的分布式事务解决方案，适用于对一致性要求较高、业务流程复杂的场景。

它将一个完整的业务操作拆分为“预留资源（Try）→确认执行（Confirm）→取消操作（Cancel）”三个阶段，将分布式事务拆分为业务层的侵入式操作，通过补偿机制确保最终一致性。

TCC 模式由三个操作组成：

| 操作名         | 作用                            | 特点                                      |
|-------------|-------------------------------|-----------------------------------------|
| Try（尝试）     | 预留资源，检查业务条件是否满足，但不执行真正的业务操作。  | 需保证幂等性（多次调用结果相同），且资源预留需支持回滚（如锁定库存但不扣减）。 |
| Confirm（确认） | 执行真正的业务操作，使用 Try 阶段预留的资源完成业务。 | 需保证幂等性，且操作需满足最终成功的特性（若失败需依赖重试）。         |
| Cancel（取消）  | 释放 Try 阶段预留的资源，若业务执行失败则回滚。    | 需保证幂等性，且需完全补偿 Try 阶段的操作。                |

打一个现实的比喻：

- Try：顾客在超市冷冻柜取商品（资源预留）。
- Confirm：收银台结算（正式消费）。
- Cancel：将商品放回货架（释放预留）。

在开始前，我们需要先搞清楚一个DTM的屏障机制：**Barrier**。它将会在**TCC**和**SAGA**模式当中使用到。它核心解决的问题是：*
*分布式事务场景下的“重入”问题**，但更准确地说，它解决的是“分布式事务分支操作的重复执行”问题，包括重入、重试、空补偿、悬挂等多种场景，本质上是对
“操作重入” 的精细化控制。

首先，我们需要定义3个接口：

```protobuf
syntax = "proto3";

// 库存服务
service StockService {
  rpc TryDeductStock(TryDeductStockRequest) returns (StockResponse) {
    option (gnostic.openapi.v3.operation) = {
      summary: "尝试减少商品库存",
      description: "预留商品库存，TCC事务 进入 Try 阶段"
    };
  }

  rpc ConfirmDeductStock(ConfirmDeductStockRequest) returns (StockResponse) {
    option (gnostic.openapi.v3.operation) = {
      summary: "确认减少商品库存",
      description: "确认减少库存，TCC事务 进入 Confirm 阶段"
    };
  }

  rpc CancelDeductStock(CancelDeductStockRequest) returns (StockResponse) {
    option (gnostic.openapi.v3.operation) = {
      summary: "取消减少商品库存",
      description: "释放预留库存，TCC事务 进入 Cancel 阶段"
    };
  }
}
```

实现接口：

```go
package service

func (s *StockService) TryDeductStock(ctx context.Context, req *shopV1.TryDeductStockRequest) (*shopV1.StockResponse, error) {
	s.log.Infof("尝试扣除库存: %+v", req.RequestId)

	return s.stockRepo.TryDeductStock(ctx, req)
}

func (s *StockService) ConfirmDeductStock(ctx context.Context, req *shopV1.ConfirmDeductStockRequest) (*shopV1.StockResponse, error) {
	s.log.Infof("确认扣除库存: %+v", req.RequestId)

	return s.stockRepo.ConfirmDeductStock(ctx, req)
}

func (s *StockService) CancelDeductStock(ctx context.Context, req *shopV1.CancelDeductStockRequest) (*shopV1.StockResponse, error) {
	s.log.Infof("取消扣除库存: %+v", req.RequestId)

	return s.stockRepo.CancelDeductStock(ctx, req)
}
```

实现repo：

```go
package data

func (r *StockRepo) TryDeductStock(ctx context.Context, req *shopV1.TryDeductStockRequest) (*shopV1.StockResponse, error) {
	var err error

	err = dtmgorm.BarrierGorm(ctx, r.data.db, func(tx *gorm.DB) error {
		// 查询当前库存记录
		var stock models.Stock
		if err = tx.Model(&models.Stock{}).
			Where("product_id = ?", req.GetProductId()).
			First(&stock).Error; err != nil {
			return err
		}

		// 检查库存是否足够
		if stock.Quantity-stock.Locked < req.GetQuantity() {
			return gorm.ErrRecordNotFound
		}

		// 锁定库存
		result := tx.Model(&models.Stock{}).
			Where("product_id = ? AND quantity - locked >= ?", req.GetProductId(), req.GetQuantity()).
			UpdateColumn("locked", gorm.Expr("locked + ?", req.GetQuantity()))
		if result.Error != nil {
			return result.Error
		}

		// 检查是否更新成功
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})
	if err != nil {
		return &shopV1.StockResponse{Success: false, Message: err.Error()}, nil
	}

	r.log.Infof("Attempting to deduct stock for product_id: %d, quantity: %d", req.GetProductId(), req.GetQuantity())

	return &shopV1.StockResponse{
		Success: true,
		Message: "Stock deduction initiated successfully",
	}, nil
}

func (r *StockRepo) ConfirmDeductStock(ctx context.Context, req *shopV1.ConfirmDeductStockRequest) (*shopV1.StockResponse, error) {
	var err error

	err = dtmgorm.BarrierGorm(ctx, r.data.db, func(tx *gorm.DB) error {
		// 查询当前库存记录
		var stock models.Stock
		if err = tx.Model(&models.Stock{}).
			Where("product_id = ?", req.GetProductId()).
			First(&stock).Error; err != nil {
			return err
		}

		// 确认扣减库存，将锁定的库存正式扣减
		result := tx.Model(&models.Stock{}).
			Where("product_id = ? AND locked >= ?", req.GetProductId(), req.GetQuantity()).
			Updates(map[string]interface{}{
				"locked":   gorm.Expr("locked - ?", req.GetQuantity()),
				"quantity": gorm.Expr("quantity - ?", req.GetQuantity()),
			})
		if result.Error != nil {
			return result.Error
		}

		// 检查是否更新成功
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})
	if err != nil {
		return &shopV1.StockResponse{Success: false, Message: err.Error()}, nil
	}

	r.log.Infof("Confirming stock deduction for product_id: %d, quantity: %d", req.GetProductId(), req.GetQuantity())

	return &shopV1.StockResponse{
		Success: true,
		Message: "Stock deduction confirmed successfully",
	}, nil
}

func (r *StockRepo) CancelDeductStock(ctx context.Context, req *shopV1.CancelDeductStockRequest) (*shopV1.StockResponse, error) {
	var err error

	err = dtmgorm.BarrierGorm(ctx, r.data.db, func(tx *gorm.DB) error {
		// 查询当前库存记录
		var stock models.Stock
		if err = tx.Model(&models.Stock{}).
			Where("product_id = ?", req.GetProductId()).
			First(&stock).Error; err != nil {
			return err
		}

		// 恢复库存
		result := tx.Model(&models.Stock{}).
			Where("product_id = ?", req.GetProductId()).
			UpdateColumn("quantity", gorm.Expr("quantity + ?", req.GetQuantity()))
		if result.Error != nil {
			return result.Error
		}

		// 检查是否更新成功
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})
	if err != nil {
		return &shopV1.StockResponse{Success: false, Message: err.Error()}, nil
	}

	r.log.Infof("Cancelling stock deduction for product_id: %d, quantity: %d", req.GetProductId(), req.GetQuantity())

	return &shopV1.StockResponse{
		Success: true,
		Message: "Stock deduction canceled successfully",
	}, nil
}
```

最后，我们可以在商店服务里面调用：

```go
package service

import (
	"github.com/dtm-labs/client/dtmgrpc"

	"kratos-dtm-examples/pkg/service"
)

func (s *ShopService) TestTCC(ctx context.Context, req *shopV1.BuyRequest) (*shopV1.BuyResponse, error) {
	var requestId string

	// 生成全局唯一事务 ID (GID)
	gid := dtmgrpc.MustGenGid(service.DtmServerAddress)

	requestId = gid // 使用 gid 作为 request_id

	s.log.Infof("开始 TCC 事务，GID: %s", gid)

	var err error

	err = dtmgrpc.TccGlobalTransaction(service.DtmServerAddress, gid, func(tcc *dtmgrpc.TccGrpc) error {
		// Try 阶段：扣减库存
		err = tcc.CallBranch(
			&shopV1.TryDeductStockRequest{
				ProductId: req.ProductId,
				Quantity:  req.Quantity,
				RequestId: requestId,
			},
			service.ShopServerAddress+shopV1.StockService_TryDeductStock_FullMethodName,
			service.ShopServerAddress+shopV1.StockService_ConfirmDeductStock_FullMethodName,
			service.ShopServerAddress+shopV1.StockService_CancelDeductStock_FullMethodName,
			&shopV1.StockResponse{},
		)
		if err != nil {
			s.log.Errorf("扣减库存失败: %v", err)
			return shopV1.ErrorInternalServerError("扣减库存失败")
		}

		// Try 阶段：创建订单
		err = tcc.CallBranch(
			&shopV1.TryCreateOrderRequest{
				UserId:    req.UserId,
				ProductId: req.ProductId,
				Quantity:  req.Quantity,
				RequestId: requestId,
				OrderNo:   requestId, // 简化使用 requestId 作为订单号
			},
			service.ShopServerAddress+shopV1.OrderService_TryCreateOrder_FullMethodName,
			service.ShopServerAddress+shopV1.OrderService_ConfirmCreateOrder_FullMethodName,
			service.ShopServerAddress+shopV1.OrderService_CancelCreateOrder_FullMethodName,
			&shopV1.OrderResponse{},
		)
		if err != nil {
			s.log.Errorf("TCC创建订单失败: %v", err)
			return shopV1.ErrorInternalServerError("创建订单失败")
		}

		return nil
	})
	if err != nil {
		s.log.Errorf("TCC 事务提交失败: %v", err)
		return nil, shopV1.ErrorInternalServerError(err.Error())
	}

	s.log.Infof("TCC 事务提交成功，GID: %s", gid)

	return &shopV1.BuyResponse{Success: true}, nil
}

```

### 3. SAGA模式

SAGA 将分布式事务拆分为一系列**本地事务**，每个本地事务对应一个**补偿事务**（若前序事务失败，通过补偿事务回滚），最终实现
“最终一致性”。

首先，我们需要定义两个接口，一个正向，一个补偿的接口：

```protobuf
syntax = "proto3";

package shop.service.v1;

// 库存服务
service StockService {
  rpc DeductStock(DeductStockRequest) returns (StockResponse) {
    option (gnostic.openapi.v3.operation) = {
      summary: "减少商品库存"
    };
  }

  rpc RefundStock(RefundStockRequest) returns (StockResponse) {
    option (gnostic.openapi.v3.operation) = {
      summary: "退款并恢复商品库存",
      description: "SAGA事务 退款并恢复商品库存"
    };
  }
}
```

实现接口：

```go
package service

func (s *StockService) DeductStock(_ context.Context, req *shopV1.DeductStockRequest) (*shopV1.StockResponse, error) {
	exist, err := s.stockDeductionLogRepo.ExistLogByRequestID(req.GetRequestId())
	if err != nil {
		s.log.Errorf("failed to check stock deduction log existence for request_id: %s, error: %v", req.GetRequestId(), err)
		return nil, shopV1.ErrorInternalServerError("failed to check stock deduction log existence: %v", err)
	}
	if exist {
		s.log.Infof("stock deduction log already exists for request_id: %s", req.GetRequestId())
		return &shopV1.StockResponse{Success: true}, nil
	}

	if err = s.stockRepo.DeductStock(req.GetProductId(), req.GetQuantity()); err != nil {
		s.log.Errorf("failed to deduct stock for product_id: %d, quantity: %d, error: %v", req.GetProductId(), req.GetQuantity(), err)
		return nil, shopV1.ErrorInternalServerError("failed to deduct stock: %v", err)
	}

	if err = s.stockDeductionLogRepo.CreateLog(&shopV1.StockDeductionLog{
		ProductId: req.GetProductId(),
		//UserId:,
		RequestId: req.GetRequestId(),
		Quantity:  req.GetQuantity(),
	}); err != nil {
		s.log.Errorf("failed to create stock deduction log for request_id: %s, error: %v", req.GetRequestId(), err)
		return nil, shopV1.ErrorInternalServerError("failed to create stock deduction log: %v", err)
	}

	return &shopV1.StockResponse{
		Success: true,
		Message: "Stock deducted successfully",
	}, nil
}

func (s *StockService) RefundStock(ctx context.Context, req *shopV1.RefundStockRequest) (*shopV1.StockResponse, error) {
	s.log.Infof("RefundStock called with request: %+v", req)

	return s.stockRepo.RefundStock(ctx, req)
}

```

实现repo：

```go
package data

import (
	"gorm.io/gorm"
	"kratos-dtm-examples/app/shop/service/internal/data/models"
	"kratos-dtm-examples/pkg/dtmgorm"
)

func (r *StockRepo) DeductStock(productID uint32, quantity int32) error {
	return r.DeductStockWithTx(r.data.db, productID, quantity)
}

func (r *StockRepo) DeductStockWithTx(tx *gorm.DB, productID uint32, quantity int32) error {
	// 使用事务来确保数据一致性
	return tx.Transaction(func(tx *gorm.DB) error {
		// 查询当前库存
		var stock models.Stock
		if err := tx.Model(&models.Stock{}).
			Select("quantity", "locked").
			Where("product_id = ?", productID).
			First(&stock).Error; err != nil {
			return err
		}

		// 检查库存是否足够
		if stock.Quantity-stock.Locked < quantity {
			return gorm.ErrRecordNotFound
		}

		// 扣减库存
		result := tx.Model(&models.Stock{}).
			Where("product_id = ? AND quantity >= ?", productID, quantity).
			UpdateColumn("quantity", gorm.Expr("quantity - ?", quantity))

		if result.Error != nil {
			return result.Error
		}

		// 如果没有更新任何记录，说明库存不足
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})
}

func (r *StockRepo) RefundStock(ctx context.Context, req *shopV1.RefundStockRequest) (*shopV1.StockResponse, error) {
	var err error

	err = dtmgorm.BarrierGorm(ctx, r.data.db, func(tx *gorm.DB) error {
		// 查询当前库存记录
		var stock models.Stock
		if err = tx.Model(&models.Stock{}).
			Where("product_id = ?", req.GetProductId()).
			First(&stock).Error; err != nil {
			return err
		}

		// 增加库存
		result := tx.Model(&models.Stock{}).
			Where("product_id = ?", req.GetProductId()).
			UpdateColumn("quantity", gorm.Expr("quantity + ?", req.GetQuantity()))
		if result.Error != nil {
			return result.Error
		}

		// 检查是否更新成功
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})
	if err != nil {
		return &shopV1.StockResponse{Success: false, Message: err.Error()}, nil
	}

	r.log.Infof("Refunding stock for product_id: %d, quantity: %d", req.GetProductId(), req.GetQuantity())

	return &shopV1.StockResponse{
		Success: true,
		Message: "Stock refunded successfully",
	}, nil
}

```

最后，我们可以在商店服务里面调用：

```go
package service

import (
   "github.com/dtm-labs/client/dtmgrpc"
   "kratos-dtm-examples/pkg/service"
)

func (s *ShopService) TestSAGA(ctx context.Context, req *shopV1.BuyRequest) (*shopV1.BuyResponse, error) {
   var requestId string

   // 生成全局唯一事务 ID (GID)
   gid := dtmgrpc.MustGenGid(service.DtmServerAddress)

   requestId = gid // 使用 gid 作为 request_id

   s.log.Infof("开始 SAGA 事务，GID: %s", gid)

   saga := dtmgrpc.NewSagaGrpc(service.DtmServerAddress, gid).
           // 扣减库存
           Add(
              service.ShopServerAddress+shopV1.StockService_DeductStock_FullMethodName,
              service.ShopServerAddress+shopV1.StockService_RefundStock_FullMethodName,
              &shopV1.DeductStockRequest{
                 ProductId: req.ProductId,
                 Quantity:  req.Quantity,
                 RequestId: requestId,
              },
           ).
           // 创建订单
           Add(
              service.ShopServerAddress+shopV1.OrderService_CreateOrder_FullMethodName,
              service.ShopServerAddress+shopV1.OrderService_RefundOrder_FullMethodName,
              &shopV1.CreateOrderRequest{
                 UserId:    req.UserId,
                 ProductId: req.ProductId,
                 Quantity:  req.Quantity,
                 RequestId: requestId,
                 OrderNo:   requestId, // 简化使用 requestId 作为订单号
              },
           )

   if err := saga.Submit(); err != nil {
      s.log.Errorf("SAGA 事务提交失败: %v", err)
      return nil, shopV1.ErrorInternalServerError(err.Error())
   }

   s.log.Infof("SAGA 事务提交成功，GID: %s", gid)
   return &shopV1.BuyResponse{Success: true}, nil
}

```

### 4. XA 模式（两阶段提交）

XA 是基于数据库层的分布式事务协议，通过 “`准备阶段（Prepare）`” 和 “`提交阶段（Commit）`” 实现强一致性，要求所有参与方（数据库）支持
XA 协议（如 MySQL、Postgresql）。

### 5. Workflow 模式（工作流事务）

Workflow 模式是DTM首创推出的模式，在这个模式下，可以混合使用`XA`、`SAGA`、`TCC`
，也可以混合使用HTTP、gRPC、本地操作，用户可以对分布式事务里面的绝大部分内容进行定制，具备极大的灵活性。

使用Workflow模式，总共有三个步骤，在这里我们以gRPC为例来进行具体的讲解：

1. 初始化；
2. 注册工作流；
3. 执行工作流。

#### 1. 初始化

```go
package server

import (
	"github.com/dtm-labs/client/workflow"

	"kratos-dtm-examples/app/shop/service/internal/service"
)

// NewGRPCServer new a gRPC server.
func NewGRPCServer(
	cfg *conf.Bootstrap, logger log.Logger,
	stockService *service.StockService,
	orderService *service.OrderService,
	paymentService *service.PaymentService,
) *grpc.Server {
	//...

	// 注册操作需要在业务服务启动之后执行，因为当进程crash，dtm会回调业务服务器，继续未完成的任务
	workflow.InitGrpc(serviceName.DtmServerAddress, serviceName.ShopServerAddress, srv.Server)

	return srv
}

```

之所以需要做这样的一个初始化的工作，那是因为 DTM 的工作流模式需要在业务服务启动后进行注册，以便 DTM 能够正确地回调业务服务，继续未完成的任务。

#### 2. 注册工作流

工作流，我们以比较简单的SAGA事务为例来进行说明：

```go
package service

const (
	WorkflowShopServiceOrderSAGA  = "test_workflow_shop_order_saga"
	WorkflowShopServiceOrderTCC   = "test_workflow_shop_order_tcc"
	WorkflowShopServiceOrderXA    = "test_workflow_shop_order_xa"
	WorkflowShopServiceOrderMixed = "test_workflow_shop_order_mixed"
)

func (s *ShopService) init() {
	var err error

	// SAGA工作流注册
	err = workflow.Register(WorkflowShopServiceOrderSAGA, func(wf *workflow.Workflow, data []byte) error {

		var codec = encoding.GetCodec("proto")

		var req shopV1.BuyRequest
		if len(data) > 0 {
			if err = codec.Unmarshal(data, &req); err != nil {
				s.log.Errorf("工作流数据反序列化失败: %v", err)
				return shopV1.ErrorInternalServerError("工作流数据反序列化失败")
			}
		}

		// 扣减库存步骤
		wf.NewBranch().OnRollback(func(bb *dtmcli.BranchBarrier) error {
			if _, err = s.stockService.RefundStock(wf.Context, &shopV1.RefundStockRequest{
				ProductId: req.ProductId,
				Quantity:  req.Quantity,
			}); err != nil {
				s.log.Errorf("工作流回滚扣减库存失败: %v", err)
				return shopV1.ErrorInternalServerError("工作流回滚扣减库存失败")
			}

			return nil
		})
		if _, err = s.stockService.DeductStock(wf.Context, &shopV1.DeductStockRequest{
			ProductId: req.ProductId,
			Quantity:  req.Quantity,
			RequestId: wf.Gid,
		}); err != nil {
			s.log.Errorf("工作流扣减库存失败: %v", err)
			return shopV1.ErrorInternalServerError("工作流扣减库存失败")
		}

		// 创建订单步骤
		wf.NewBranch().OnRollback(func(bb *dtmcli.BranchBarrier) error {
			if _, err = s.orderService.RefundOrder(wf.Context, &shopV1.RefundOrderRequest{
				OrderNo: wf.Gid,
			}); err != nil {
				s.log.Errorf("工作流回滚创建订单失败: %v", err)
				return shopV1.ErrorInternalServerError("工作流回滚创建订单失败")
			}
			return nil
		})
		if _, err = s.orderService.CreateOrder(wf.Context, &shopV1.CreateOrderRequest{
			UserId:    req.UserId,
			ProductId: req.ProductId,
			Quantity:  req.Quantity,
			RequestId: wf.Gid,
			OrderNo:   wf.Gid,
		}); err != nil {
			s.log.Errorf("工作流创建订单失败: %v", err)
			return shopV1.ErrorInternalServerError("工作流创建订单失败")
		}

		return nil
	})
	if err != nil {
		s.log.Errorf("工作流[%s] 注册失败: %v", WorkflowShopServiceOrderSAGA, err)
		return
	}
}
```

注册工作流的工作只需要做一次，通常在服务启动时进行。

#### 3. 执行工作流

上面注册工作流的时候，我们使用了一个 `WorkflowShopServiceOrderSAGA` 的工作流名称。现在我们可以使用这个工作流名称来执行工作流了：

```go
package service

import (
	"github.com/dtm-labs/client/dtmgrpc"
	"github.com/dtm-labs/client/workflow"
)

func (s *ShopService) TestWorkFlowSAGA(ctx context.Context, req *shopV1.BuyRequest) (*shopV1.BuyResponse, error) {
	// 生成全局唯一事务 ID (GID)
	gid := dtmgrpc.MustGenGid(service.DtmServerAddress)

	s.log.Infof("开始SAGA工作流事务，GID: %s", gid)

	// 提交工作流
	if err := workflow.Execute(WorkflowShopServiceOrderSAGA, gid, dtmgimp.MustProtoMarshal(req)); err != nil {
		s.log.Errorf("SAGA工作流事务提交失败: %v", err)
		return nil, shopV1.ErrorInternalServerError("SAGA工作流事务提交失败")
	}

	s.log.Infof("SAGA工作流事务提交成功，GID: %s", gid)

	return &shopV1.BuyResponse{Success: true}, nil
}

```

## 实例代码项目

- [kratos-dtm-examples - Github](https://github.com/tx7do/kratos-dtm-examples)
- [kratos-dtm-examples - Gitee](https://gitee.com/tx7do/kratos-dtm-examples)

## 参考资料

- [DTM开源项目文档](https://dtm.pub/)
- [DTM - Github](https://github.com/dtm-labs/dtm)
