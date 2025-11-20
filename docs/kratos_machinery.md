# Golang微服务框架Kratos应用分布式任务队列Machinery

**任务队列（Task Queue）** 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。

任务队列的输入是称为`任务(Task)`的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。

在Golang语言里面，我们有像[Asynq](https://github.com/hibiken/asynq)和[Machinery](https://github.com/RichardKnop/machinery)这样的类似于`Celery`的分布式任务队列。

## 什么是任务队列

消息队列（Message Queue），一般来说知道的人不少。比如常见的：kafka、Rabbitmq、RocketMQ等。

任务队列（Task Queue），听说过这个概念的人不会太多，清楚它的概念的人怕是更少。

这两个概念是有关系的，他们是怎样的关系呢？任务队列（Task Queue）是消息队列（Message Queue）的超集。任务队列是构建在消息队列之上的。消息队列是任务队列的一部分。

提起**分布式任务队列（Distributed Task Queue）**，就不得不提`Python`的[Celery](https://github.com/celery/celery)。故而，下面我们来看Celery的架构图，以此来讲解。其他的任务队列也并不会与之有太大的差异性，基础的原理是一致的。

![Celery架构图](https://tx7do.github.io/assets/images/task_queue/celery_framework.png)

在 `Celery` 的架构中，由多台 Server 发起`异步任务（Async Task）`，发送任务到 `Broker` 的队列中，其中的 `Celery Beat` 进程可负责发起定时任务。当 `Task` 到达 `Broker` 后，会将其分发给相应的 `Celery Worker` 进行处理。当 `Task` 处理完成后，其结果存储至 `Backend`。

在上述过程中的 `Broker` 和 `Backend`，`Celery` 并没有去实现，而是使用了已有的开源实现，例如 `RabbitMQ` 作为 `Broker` 提供消息队列服务，`Redis` 作为 `Backend` 提供结果存储服务。Celery 就像是抽象了消息队列架构中 `Producer`、`Consumer` 的实现，将消息队列中基本单位`“消息”`抽象成了任务队列中的“任务”，并将异步、定时任务的发起和结果存储等操作进行了封装，让开发者可以忽略 AMQP、RabbitMQ 等实现细节，为开发带来便利。

综上所述，Celery 作为任务队列是基于消息队列的进一步封装，其实现依赖消息队列。

## 任务队列的应用场景

我们现在知道了任务队列是什么，也知道了它的工作原理。但是，我们并不知道它可以用来做什么。下面，我们就来看看，它到底用在什么样的场景下。

1. 分布式任务：可以将任务分发到多个工作者进程或机器上执行，以提高任务处理速度。
2. 定时任务：可以在指定时间执行任务。例如：每天定时备份数据、日志归档、心跳测试、运维巡检。支持 crontab 定时模式
3. 后台任务：可以在后台执行耗时任务，例如图像处理、数据分析等，不影响用户界面的响应。
4. 解耦任务：可以将任务与主程序解耦，以提高代码的可读性和可维护性，解耦应用程序最直接的好处就是可扩展性和并发性能的提高。支持并发执行任务，同时支持自动动态扩展。
5. 实时处理：可以支持实时处理任务，例如即时通讯、消息队列等。

## Machinery是什么？

go machinery是一个基于分布式消息分发的异步任务队列框架，类似python中常用celery框架，主要用于异步任务和定时任务。

### Machinery的特性

* 任务重试机制
* 延迟任务支持
* 任务回调机制
* 任务结果记录
* 支持Workflow模式：Chain，Group，Chord
* 多Brokers支持：Redis, AMQP, AWS SQS……
* 多Backends支持：Redis, Memcache, AMQP, MongoDB……

### 架构

任务队列，简而言之就是一个放大的生产者消费者模型，用户请求会生成任务，任务生产者不断的向队列中插入任务，同时，队列的处理器程序充当消费者不断的消费任务。

* Server ：业务主体，我们可以使用用server暴露的接口方法进行所有任务编排的操作。如果是简单的使用那么了解它就够了。
* Broker ：数据存储层接口，主要功能是将数据放入任务队列和取出，控制任务并发，延迟也在这层。
* Worker：数据处理层结构，主要是操作 `Server`、`Broker`、`Backend` 进行任务的获取，执行，处理执行状态及结果等。
* Task： 数据处理层，这一层包括`Task`、`Signature`、`Group`、`Chain`、`Chord`等结构，主要是处理任务编排的逻辑。
* Backend：数据持久化层接口，主要用于更新获取任务执行结果，状态等。

![machinery_framework](https://raw.githubusercontent.com/pandaychen/pandaychen.github.io/master/blog_img/2022/machinery/machinery3.png)

## Machinery基础工作流程

![machinery-work-flow](https://raw.githubusercontent.com/pandaychen/pandaychen.github.io/master/blog_img/2022/machinery/machinery-work-flow1.png)

Machinery 基本的工作流程如下：

1. 由 Server 生成并发布任务，推送到 Broker 中
2. Worker 通过 Key 向 Broker 订阅任务，当 Key 相同的任务到达时，Worker 消费任务
3. Worker 执行任务
4. Worker 将执行结果（终态：SUCCESS、FAILURE）存储至 Backend 模块

### 任务编排

Machinery一共提供了三种任务编排方式：

* Groups：执行一组异步任务，任务之间互不影响。
* Chord：执行一组同步任务，执行完成后，在调用一个回调函数。
* Chain：执行一组同步任务，任务有次序之分，上个任务的出参可作为下个任务的入参。

## Kratos下如何应用Machinery？

我们将分布式任务队列以`transport.Server`的形式整合进微服务框架`Kratos`。

目前，go里面有两个分布式任务队列可用：

- [Asynq](https://github.com/hibiken/asynq)
- [Machinery](https://github.com/RichardKnop/machinery)

我已经对这两个库进行了支持：

- [kratos-transport/Asynq](https://github.com/tx7do/kratos-transport/tree/main/transport/asynq)
- [kratos-transport/Machinery](https://github.com/tx7do/kratos-transport/tree/main/transport/machinery)

### Docker部署依赖组件

在本文中，我们仅使用Redis来做演示。因此，我们使用Docker的方式安装Redis的服务器：

```bash
docker pull bitnami/redis:latest

docker run -itd \
    --name redis-test \
    -p 6379:6379 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    bitnami/redis:latest
```

### 安装依赖库

我们需要在项目中安装Asynq的依赖库：

```bash
go get -u github.com/tx7do/kratos-transport/transport/machinery
```

### 创建Kratos服务器

首先，我们要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/machinery"
)

// NewMachineryServer create a machinery server.
func NewMachineryServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.TaskService) *machinery.Server {
	ctx := context.Background()

	srv := machinery.NewServer(
        machinery.WithBrokerAddress(cfg.Server.Machinery.Brokers, 0, machinery.BrokerTypeRedis),
		machinery.WithResultBackendAddress(cfg.Server.Machinery.Brokers, 0, machinery.BackendTypeRedis),
	)

	registerMachineryTasks(ctx, srv, svc)

	return srv
}
```

### 注册任务回调

然后，把回调函数注册进服务器：

```go
const (
	testTask1        = "test_task_1"
	testDelayTask    = "test_delay_task"
	testPeriodicTask = "test_periodic_task"

	addTask         = "add"
	multiplyTask    = "multiply"
	sumIntTask      = "sum_ints"
	sumFloatTask    = "sum_floats"
	concatTask      = "concat"
	splitTask       = "split"
	panicTask       = "panic_task"
	longRunningTask = "long_running_task"
)

func registerMachineryTasks(ctx context.Context, srv *machinery.Server, svc *service.TaskService) {
    _ = srv.HandleFunc(testTask1, svc.HandleTask)
    _ = srv.HandleFunc(testDelayTask, svc.HandleDelayTask)
    _ = srv.HandleFunc(testPeriodicTask, svc.HandlePeriodicTask)
    _ = srv.HandleFunc(addTask, svc.HandleAdd)
    _ = srv.HandleFunc(multiplyTask, svc.HandleMultiply)
}
```

### Machinery服务器注册到Kratos

接着，调用`kratos.Server`把Machinery服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *machinery.Server) *kratos.App {
	return kratos.New(
		kratos.ID(Service.GetInstanceId()),
		kratos.Name(Service.Name),
		kratos.Version(Service.Version),
		kratos.Metadata(Service.Metadata),
		kratos.Logger(ll),
		kratos.Server(
			ks,
		),
		kratos.Registrar(rr),
	)
}
```

### 实现任务回调方法

最后，我们就可以在`Service`里愉快的玩耍了：

```go
package service

type TaskService struct {
	log          *log.Helper
}

func NewTaskService(
	logger log.Logger,
) *TaskService {
	l := log.NewHelper(log.With(logger, "module", "task/service/logger-service"))
	return &TaskService{
		log:          l,
		statusRepo:   statusRepo,
		realtimeRepo: realtimeRepo,
	}
}

func (s *TaskService) HandleTask1() error {
	fmt.Println("################ 执行任务Task1 #################")
	return nil
}

func (s *TaskService) HandleDelayTask() error {
	fmt.Println("################ 执行延迟任务DelayTask #################")
	return nil
}

func (s *TaskService) HandlePeriodicTask() error {
	fmt.Println("################ 执行周期任务PeriodicTask #################")
	return nil
}

func (s *TaskService) HandleAdd(args ...int64) (int64, error) {
	sum := int64(0)
	for _, arg := range args {
		sum += arg
	}
	fmt.Printf("sum: %d\n", sum)
	return sum, nil
}

func (s *TaskService) HandleMultiply(args ...int64) (int64, error) {
	sum := int64(1)
	for _, arg := range args {
		sum *= arg
	}
	fmt.Printf("mulptiply: %d\n", sum)
	return sum, nil
}
```

### 创建新任务

现在，我们万事俱备，只欠任务了。

#### 普通任务

```go
err = srv.NewTask(sumTask, machinery.WithArgument("int64", 1))
```

#### 延迟任务

```go
// 延迟5秒执行任务
err = srv.NewTask(testDelayTask, machinery.WithDelayTime(time.Now().UTC().Add(time.Second*5)))
```

#### 周期性任务

需要注意的是，周期性任务的精度只能到分钟级

```go
// 每分钟执行一次
err = srv.NewPeriodicTask("*/1 * * * ?", testPeriodicTask)
```

#### Group(分组任务)工作流

```go
// add(1, 1)
// add(5, 5)
// (1 + 1) = 2
// (5 + 5) = 10

err = srv.NewGroup(
	machinery.WithTask(addTask, machinery.WithArgument("int64", 1), machinery.WithArgument("int64", 1)),
	machinery.WithTask(addTask, machinery.WithArgument("int64", 5), machinery.WithArgument("int64", 5)),
)
```

#### Chord(和弦任务)工作流

```go
// multiply(add(1, 1), add(5, 5))
// (1 + 1) * (5 + 5) = 2 * 10 = 20

err = srv.NewChord(
	machinery.WithTask(addTask, machinery.WithArgument("int64", 1), machinery.WithArgument("int64", 1)),
	machinery.WithTask(addTask, machinery.WithArgument("int64", 5), machinery.WithArgument("int64", 5)),
	machinery.WithTask(multiplyTask),
)
```

#### Chain(链式任务)工作流

```go
// multiply(4, add(5, 5, add(1, 1)))
//   4 * (5 + 5 + (1 + 1))   # task1: add(1, 1)        returns 2
// = 4 * (5 + 5 + 2)         # task2: add(5, 5, 2)     returns 12
// = 4 * (12)                # task3: multiply(4, 12)  returns 48
// = 48

err = srv.NewChain(
	machinery.WithTask(addTask, machinery.WithArgument("int64", 1), machinery.WithArgument("int64", 1)),
	machinery.WithTask(addTask, machinery.WithArgument("int64", 5), machinery.WithArgument("int64", 5)),
	machinery.WithTask(multiplyTask, machinery.WithArgument("int64", 4)),
)
```

## 示例代码

示例代码可以在单元测试代码中找到：<https://github.com/tx7do/kratos-transport/tree/main/transport/machinery/server_test.go>

## 中间件代码

* [kratos-transport Gitee](https://gitee.com/tx7do/kratos-transport)
* [kratos-transport Github](https://github.com/tx7do/kratos-transport)

## 参考资料

* [Machinery - Github](https://github.com/RichardKnop/machinery)
* [Celery - Github](https://github.com/celery/celery)
* [Celery 简介](https://www.celerycn.io/ru-men/celery-jian-jie)
* [分布式任务队列 Celery](https://blog.51cto.com/u_15301988/3080859)
* [分布式任务队列Celery的实践](https://cloud.tencent.com/developer/article/1898147)
* [异步任务处理系统，如何解决业务长耗时、高并发难题？](https://www.51cto.com/article/707654.html)
* [machinery中文文档](https://zhuanlan.zhihu.com/p/270640260)
* [Go 语言分布式任务处理器 Machinery – 架构，源码详解篇](https://marksuper.xyz/2022/04/20/machinery1/)
* [Task orchestration in Go Machinery.](https://medium.com/swlh/task-orchestration-in-go-machinery-66a0ddcda548)
* [go-machinery入门教程（异步任务队列）](https://juejin.cn/post/6889743612267986958)
* [Golang 的分布式任务队列：Machinery （v1）分析（一）](https://pandaychen.github.io/2020/11/03/A-GOLANG-MACHINERY-ANALYSIS/)
