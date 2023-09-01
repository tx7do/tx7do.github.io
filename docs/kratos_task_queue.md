# golang微服务框架Kratos实现分布式任务队列

**任务队列（Task Queue）** 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。

任务队列的输入是称为`任务(Task)`的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。

在Golang语言里面，我们有像[Asynq](https://github.com/hibiken/asynq)和[Machinery](https://github.com/RichardKnop/machinery)这样的类似于`Celery`的分布式任务队列。

## 什么是任务队列

消息队列（Message Queue），一般来说知道的人不少。比如常见的：kafka、Rabbitmq、RocketMQ等。

任务队列（Task Queue），听说过这个概念的人不会太多，清楚它的概念的人怕是更少。

这两个概念是有关系的，他们是怎样的关系呢？任务队列（Task Queue）是消息队列（Message Queue）的超集。任务队列是构建在消息队列之上的。消息队列是任务队列的一部分。

提起**分布式任务队列（Distributed Task Queue）**，就不得不提`Python`的[Celery](https://github.com/celery/celery)。故而，下面我们来看Celery的架构图，以此来讲解。其他的任务队列也并不会与之有太大的差异性，基础的原理是一致的。

![Celery架构图](/assets/images/task_queue/celery_framework.png)

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

## Kratos下实现分布式任务队列

我们将分布式任务队列以`transport.Server`的形式整合进微服务框架`Kratos`。

目前，go里面有两个分布式任务队列可用：

- [Asynq](https://github.com/hibiken/asynq)
- [Machinery](https://github.com/RichardKnop/machinery)

我已经对这两个库进行了支持：

- [kratos-transport/Asynq](https://github.com/tx7do/kratos-transport/tree/main/transport/asynq)
- [kratos-transport/Machinery](https://github.com/tx7do/kratos-transport/tree/main/transport/machinery)

### Asynq

Asynq是一个go语言实现的分布式任务队列和异步处理库，基于Redis。类似于Python的Celery。作者Ken Hibino，任职于Google。

#### 特点

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

#### 安装命令行工具

```shell
go install github.com/hibiken/asynq/tools/asynq
```

#### Docker安装Web UI

```shell
docker pull hibiken/asynqmon:latest

docker run -d \
    --name asynq \
    -p 8080:8080 \
    hibiken/asynqmon:latest --redis-addr=host.docker.internal:6379
```

管理后台：<http://localhost:8080>

* 仪表盘

![AsynqMon Dashboard](/assets/images/task_queue/asynq_web_ui_dashboard.png)

* 任务视图

![AsynqMon Task View](/assets/images/task_queue/asynq_web_ui_task_view.png)

* 性能

![AsynqMon Metrics](/assets/images/task_queue/asynq_web_ui_metrics.png)

#### 创建Kratos服务端

首先安装依赖库：

```bash
go get -u github.com/tx7do/kratos-transport/transport/asynq
```

然后引入库，并且创建出来`Server`：

```go
import github.com/tx7do/kratos-transport/transport/asynq

const (
	localRedisAddr = "127.0.0.1:6379"
)

ctx := context.Background()

srv := asynq.NewServer(
    asynq.WithAddress(localRedisAddr),
)

if err := srv.Start(ctx); err != nil {
    panic(err)
}

defer srv.Stop(ctx)
```

#### 注册任务回调

```go
const (
	testTask1        = "test_task_1"
	testDelayTask    = "test_delay_task"
	testPeriodicTask = "test_periodic_task"
)

type DelayTask struct {
	Message string `json:"message"`
}

func DelayTaskBinder() Any { return &DelayTask{} }

func handleTask1(taskType string, taskData *DelayTask) error {
	LogInfof("Task Type: [%s], Payload: [%s]", taskType, taskData.Message)
	return nil
}

func handleDelayTask(taskType string, taskData *DelayTask) error {
	LogInfof("Delay Task Type: [%s], Payload: [%s]", taskType, taskData.Message)
	return nil
}

func handlePeriodicTask(taskType string, taskData *DelayTask) error {
	LogInfof("Periodic Task Type: [%s], Payload: [%s]", taskType, taskData.Message)
	return nil
}

var err error

err = srv.RegisterMessageHandler(testTask1,
    func(taskType string, payload MessagePayload) error {
        switch t := payload.(type) {
        case *DelayTask:
            return handleTask1(taskType, t)
        default:
            LogError("invalid payload struct type:", t)
            return errors.New("invalid payload struct type")
        }
    },
    DelayTaskBinder,
)

err = srv.RegisterMessageHandler(testDelayTask,
    func(taskType string, payload MessagePayload) error {
        switch t := payload.(type) {
        case *DelayTask:
            return handleDelayTask(taskType, t)
        default:
            LogError("invalid payload struct type:", t)
            return errors.New("invalid payload struct type")
        }
    },
    DelayTaskBinder,
)

err = srv.RegisterMessageHandler(testPeriodicTask,
    func(taskType string, payload MessagePayload) error {
        switch t := payload.(type) {
        case *DelayTask:
            return handlePeriodicTask(taskType, t)
        default:
            LogError("invalid payload struct type:", t)
            return errors.New("invalid payload struct type")
        }
    },
    DelayTaskBinder,
)
```

#### 创建新任务

* 普通任务

```go
// 最多重试3次，10秒超时，20秒后过期
err = srv.NewTask(testTask1, 
    &DelayTask{Message: "delay task"},
    asynq.MaxRetry(10),
    asynq.Timeout(10*time.Second),
    asynq.Deadline(time.Now().Add(20*time.Second)),
)
```

* 延迟任务

```go
// 3秒后执行
err = srv.NewTask(testDelayTask,
    &DelayTask{Message: "delay task"},
    asynq.ProcessIn(3*time.Second),
)
```

* 周期性任务

```go
// 每分钟执行一次
_, err = srv.NewPeriodicTask(
    "*/1 * * * ?",
    testPeriodicTask,
    &DelayTask{Message: "periodic task"},
)
```

#### 示例代码

示例代码可以在单元测试代码中找到：<https://github.com/tx7do/kratos-transport/tree/main/transport/asynq/server_test.go>

### Machinery

go machinery框架类似python中常用celery框架，主要用于异步任务和定时任务。

#### 特性

* 任务重试机制
* 延迟任务支持
* 任务回调机制
* 任务结果记录
* 支持Workflow模式：Chain，Group，Chord
* 多Brokers支持：Redis, AMQP, AWS SQS
* 多Backends支持：Redis, Memcache, AMQP, MongoDB

#### 架构

任务队列，简而言之就是一个放大的生产者消费者模型，用户请求会生成任务，任务生产者不断的向队列中插入任务，同时，队列的处理器程序充当消费者不断的消费任务。

* Server ：业务主体，我们可以使用用server暴露的接口方法进行所有任务编排的操作。如果是简单的使用那么了解它就够了。
* Broker ：数据存储层接口，主要功能是将数据放入任务队列和取出，控制任务并发，延迟也在这层。
* Backend：数据存储层接口，主要用于更新获取任务执行结果，状态等。
* Worker：数据处理层结构，主要是操作 Server、Broker、Backend 进行任务的获取，执行，处理执行状态及结果等。
* Task： 数据处理层，这一层包括Task、Signature、Group、Chain、Chord等结构，主要是处理任务编排的逻辑。

#### 任务编排

Machinery一共提供了三种任务编排方式：

* Groups ： 执行一组异步任务，任务之间互不影响。
* Chord：执行一组同步任务，执行完成后，在调用一个回调函数。
* Chain：执行一组同步任务，任务有次序之分，上个任务的出参可作为下个任务的入参。

#### 创建Kratos服务器

首先安装依赖库：

```bash
go get -u github.com/tx7do/kratos-transport/transport/machinery
```

```go
import github.com/tx7do/kratos-transport/transport/machinery

const (
	localRedisAddr = "127.0.0.1:6379"
)

ctx := context.Background()

srv := machinery.NewServer(
    machinery.WithRedisAddress([]string{localRedisAddr}, []string{localRedisAddr}),
)

if err := srv.Start(ctx); err != nil {
    panic(err)
}

defer srv.Stop(ctx)
```

#### 创建新任务

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
```

* 普通任务

```go
err = srv.NewTask(sumTask, WithArgument("int64", 1))
```

* 延迟任务

```go
// 延迟5秒执行任务
err = srv.NewTask(testDelayTask, WithDelayTime(time.Now().UTC().Add(time.Second*5)))
```

* 周期性任务（需要注意的是，延迟任务的精度只能到秒级）

```go
// 每分钟执行一次
err = srv.NewPeriodicTask("*/1 * * * ?", testPeriodicTask)
```

#### 注册任务回调

```go
func handleTask1() error {
	fmt.Println("################ 执行任务Task1 #################")
	return nil
}

func handleDelayTask() error {
	fmt.Println("################ 执行延迟任务DelayTask #################")
	return nil
}

func handlePeriodicTask() error {
	fmt.Println("################ 执行周期任务PeriodicTask #################")
	return nil
}

func handleAdd(args ...int64) (int64, error) {
	sum := int64(0)
	for _, arg := range args {
		sum += arg
	}
	fmt.Printf("sum: %d\n", sum)
	return sum, nil
}

err = srv.HandleFunc(testTask1, handleTask)
err = srv.HandleFunc(testTaskDelay, handleDelayTask)
err = srv.HandleFunc(testPeriodicTask, handlePeriodicTask)
err = srv.HandleFunc(addTask, handleAdd)
```

#### 示例代码

示例代码可以在单元测试代码中找到：<https://github.com/tx7do/kratos-transport/tree/main/transport/machinery/server_test.go>

## 参考资料

* [Celery - Github](https://github.com/celery/celery)
* [Machinery - Github](https://github.com/RichardKnop/machinery)
* [Asynq - Github](https://github.com/hibiken/asynq)
* [Celery 简介](https://www.celerycn.io/ru-men/celery-jian-jie)
* [分布式任务队列Celery的实践](https://cloud.tencent.com/developer/article/1898147)
* [Asynq: Golang distributed task queue library](https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830)
* [异步任务处理系统，如何解决业务长耗时、高并发难题？](https://www.51cto.com/article/707654.html)
* [分布式任务队列 Celery](https://blog.51cto.com/u_15301988/3080859)
* [machinery中文文档](https://zhuanlan.zhihu.com/p/270640260)
* [Go 语言分布式任务处理器 Machinery – 架构，源码详解篇](https://marksuper.xyz/2022/04/20/machinery1/)
* [Task orchestration in Go Machinery.](https://medium.com/swlh/task-orchestration-in-go-machinery-66a0ddcda548)
* [go-machinery入门教程（异步任务队列）](https://juejin.cn/post/6889743612267986958)
* [Asynq: simple, reliable & efficient distributed task queue for your next Go project](https://dev.to/koddr/asynq-simple-reliable-efficient-distributed-task-queue-for-your-next-go-project-4jhg)
* [Asynq: Golang distributed task queue library](https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830)
