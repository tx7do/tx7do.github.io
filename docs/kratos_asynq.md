# Golang微服务框架Kratos应用分布式计划任务队列Asynq

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

## Asynq概述

Asynq是一个使用Go语言实现的分布式任务队列和异步处理库，它由Redis提供支持，它提供了轻量级的、易于使用的API，并且具有高可扩展性和高可定制化性。其作者Ken Hibino，任职于Google。

Asynq主要由以下几个组件组成：

- 任务(Task)：需要被异步执行的操作；
- 处理器(Processor)：负责执行任务的工作进程；
- 队列(Queue)：存放待执行任务的队列；
- 调度器(Scheduler)：根据规则将任务分配给不同的处理器进行执行。

![Asynq Framework](https://tx7do.github.io/assets/images/task_queue/asynq_framework.png)

通过使用Asynq，我们可以非常轻松的实现异步任务处理，同时还可以提供高效率、高可扩展性和高自定义性的处理方案。

## Asynq的特点

* 保证至少执行一次任务
* 任务写入Redis后可以持久化
* 任务失败之后，会自动重试
* worker崩溃自动恢复
* 可是实现任务的优先级
* 任务可以进行编排
* 任务可以设定执行时间或者最长可执行的时间
* 支持中间件
* 可以使用 unique-option 来避免任务重复执行，实现唯一性
* 支持 Redis Cluster 和 Redis Sentinels 以达成高可用性
* 作者提供了Web UI & CLI Tool让大家查看任务的执行情况

## Asynq可视化监控

Asynq提供了两种监控手段：CLI和Web UI。

### 命令行工具CLI

```bash
go install github.com/hibiken/asynq/tools/asynq@latest
```

### Web UI

[Asynqmon](https://github.com/hibiken/asynqmon)是一个基于Web的工具，用于监视管理Asynq的任务和队列，有关详细的信息可以参阅工具的README。

Web UI我们可以通过Docker的方式来进行安装：

```bash
docker pull hibiken/asynqmon:latest

docker run -d \
    --name asynq \
    -p 8080:8080 \
    hibiken/asynqmon:latest --redis-addr=host.docker.internal:6379
```

安装好Web UI之后，我们就可以打开浏览器访问管理后台了：<http://localhost:8080>

* 仪表盘

![AsynqMon Dashboard](https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_dashboard.png)

* 任务视图

![AsynqMon Task View](https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_task_view.png)

* 性能

![AsynqMon Metrics](https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_metrics.png)

## Kratos下如何应用Asynq？

我们将分布式任务队列以`transport.Server`的形式整合进微服务框架`Kratos`。

目前，go里面有两个分布式任务队列可用：

- [Asynq](https://github.com/hibiken/asynq)
- [Machinery](https://github.com/RichardKnop/machinery)

我已经对这两个库进行了支持：

- [kratos-transport/Asynq](https://github.com/tx7do/kratos-transport/tree/main/transport/asynq)
- [kratos-transport/Machinery](https://github.com/tx7do/kratos-transport/tree/main/transport/machinery)

### Docker部署依赖组件

因为它依赖Redis，因此，我们使用Docker的方式安装Redis的服务器：

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
go get -u github.com/tx7do/kratos-transport/transport/asynq
```

### 创建Kratos服务端

我们在代码当中引入库，并且创建出来`Server`：

首先，我们要创建`Server`：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/asynq"
)

// NewAsynqServer create a asynq server.
func NewAsynqServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.TaskService) *machinery.Server {
	ctx := context.Background()

	srv := asynq.NewServer(
        asynq.WithAddress(cfg.Server.Asynq.Broker),
	)

	registerAsynqTasks(ctx, srv, svc)

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
)

type TaskPayload struct {
	Message string `json:"message"`
}

func registerAsynqTasks(ctx context.Context, srv *asynq.Server, svc *service.TaskService) {
    var err error
    err = asynq.RegisterSubscriber(srv, testTask1, svc.HandleTask1)
    err = asynq.RegisterSubscriber(srv, testDelayTask, svc.HandleDelayTask)
    err = asynq.RegisterSubscriber(srv, testPeriodicTask, svc.HandlePeriodicTask)
}
```

### Asynq服务器注册到Kratos

接着，调用`kratos.Server`把Asynq服务器注册到Kratos里去：

```go
func newApp(ll log.Logger, rr registry.Registrar, ks *asynq.Server) *kratos.App {
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

func (s *TaskService) HandleTask1(taskType string, taskData *TaskPayload) error {
	s.log.Infof("[%s] Task Type: [%s], Payload: [%s]", time.Now().Format("2006-01-02 15:04:05"), taskType, taskData.Message)
	return nil
}

func (s *TaskService) HandleDelayTask(taskType string, taskData *TaskPayload) error {
	s.log.Infof("[%s] Delay Task Type: [%s], Payload: [%s]", time.Now().Format("2006-01-02 15:04:05"), taskType, taskData.Message)
	return nil
}

func (s *TaskService) HandlePeriodicTask(taskType string, taskData *TaskPayload) error {
	s.log.Infof("[%s] Periodic Task Type: [%s], Payload: [%s]", time.Now().Format("2006-01-02 15:04:05"), taskType, taskData.Message)
	return nil
}
```

### 创建新任务

新建任务，有两个方法：`NewTask`和`NewPeriodicTask`，内部分别对应着`asynq.Client`和`asynq.Scheduler`。

`NewTask`是通过`asynq.Client`将任务直接入了队列。

#### 普通任务

普通任务通常是入列后立即执行的（如果不需要排队的），下面就是最简单的任务，一个类型(Type)，一个负载数据(Payload)就构成了一个最简单的任务：

```go
err = srv.NewTask(testTask1, 
    &DelayTask{Message: "delay task"},
)
```

当然，你也可以添加一些的参数，比如重试次数、超时时间、过期时间等……

```go
// 最多重试3次，10秒超时，20秒后过期
err = srv.NewTask(testTask1, 
    &DelayTask{Message: "delay task"},
    asynq.MaxRetry(10),
    asynq.Timeout(10*time.Second),
    asynq.Deadline(time.Now().Add(20*time.Second)),
)
```

#### 延迟任务(Delay Task)

延迟任务，顾名思义，也就是推迟到指定时间执行的任务，我们可以有两个参数可以注入：`ProcessAt`和`ProcessIn`。

`ProcessIn`指的是从现在开始推迟多少时间执行：

```go
// 3秒后执行
err = srv.NewTask(testDelayTask,
    &DelayTask{Message: "delay task"},
    asynq.ProcessIn(3*time.Second),
)
```

`ProcessAt`指的是在指定的某一个具体时间执行：

```go
// 1小时后的时间点执行
oneHourLater := now.Add(time.Hour)
err = srv.NewTask(testDelayTask,
    &DelayTask{Message: "delay task"},
    asynq.ProcessAt(oneHourLater),
)
```

#### 周期性任务(Periodic Task)

周期性任务`asynq.Scheduler`内部是通过Crontab来实现定时的，定时器到点之后，就调度任务。它默认使用的是UTC时区。

```go
// 每分钟执行一次
_, err = srv.NewPeriodicTask(
    "*/1 * * * ?",
    testPeriodicTask,
    &DelayTask{Message: "periodic task"},
)
```

需要注意的是，若要保证周期性任务的持续调度执行，`asynq.Scheduler`必须要一直运行着，否则调度将不会发生。调度器本身不参与任务的执行，但是没有它的存在，调度将不不复存在，也不会发生。

## 示例代码

示例代码可以在单元测试代码中找到：<https://github.com/tx7do/kratos-transport/tree/main/transport/asynq/server_test.go>

## 参考资料

* [Asynq - Github](https://github.com/hibiken/asynq)
* [Celery - Github](https://github.com/celery/celery)
* [Celery 简介](https://www.celerycn.io/ru-men/celery-jian-jie)
* [分布式任务队列Celery的实践](https://cloud.tencent.com/developer/article/1898147)
* [分布式任务队列 Celery](https://blog.51cto.com/u_15301988/3080859)
* [Asynq: Golang distributed task queue library](https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830)
* [异步任务处理系统，如何解决业务长耗时、高并发难题？](https://www.51cto.com/article/707654.html)
* [Asynq: simple, reliable & efficient distributed task queue for your next Go project](https://dev.to/koddr/asynq-simple-reliable-efficient-distributed-task-queue-for-your-next-go-project-4jhg)
* [Asynq: Golang distributed task queue library](https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830)
