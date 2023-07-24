# golang微服务框架Kratos实现分布式任务队列

**任务队列（Task Queue）**一般用于线程或计算机之间分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。

提起**分布式任务队列（Distributed Task Queue）**，就不得不提Python的Celery。而Asynq和Machinery就是GO当中类似于Celery的分布式任务队列。

## 什么是任务队列

消息队列（Message Queue），一般来说知道的人不少。比如常见的：kafka、Rabbitmq、RocketMQ等。

任务队列（Task Queue），听说过这个概念的人不会太多，清楚它的概念的人怕是更少。

这两个概念是有关系的，他们是怎样的关系呢？任务队列（Task Queue）是消息队列（Message Queue）的超集。任务队列是构建在消息队列之上的。消息队列是任务队列的一部分。

下面我们来看Celery的架构图，以此来讲解。其他的任务队列也并不会与之有太大的差异性，至少原理是一致的。

![Celery架构图](/assets/images/task_queue/celery_framework.png)

在 Celery 的架构中，由多台 Server 发起异步任务（Async Task），发送任务到 Broker 的队列中，其中的 Celery Beat 进程可负责发起定时任务。当 Task 到达 Broker 后，会将其分发给相应的 Celery Worker 进行处理。当 Task 处理完成后，其结果存储至 Backend。

在上述过程中的 Broker 和 Backend，Celery 没有实现，而是使用了现有开源实现，例如 RabbitMQ 作为 Broker 提供消息队列服务，Redis 作为 Backend 提供结果存储服务。Celery 就像是抽象了消息队列架构中 Producer、Consumer 的实现，将消息队列中基本单位“消息”抽象成了任务队列中的“任务”，并将异步、定时任务的发起和结果存储等操作进行了封装，让开发者可以忽略 AMQP、RabbitMQ 等实现细节，为开发带来便利。

综上所述，Celery 作为任务队列是基于消息队列的进一步封装，其实现依赖消息队列。

## 任务队列的应用场景

* **即时响应需求**：网页的响应时间是用户体验的关键，Amazon 曾指出响应时间每提高 100ms，他们的收入便会增加 1%。对于一些需要长时间执行的任务，大多会采用异步调用的方式来释放用户操作。Celery 的异步调用特性，和前端使用 Ajax 异步加载类似，能够有效缩短响应时间。

* **周期性任务需求（Periodic Task）**：对于心跳测试、日志归档、运维巡检这类指定时间周期执行的任务，可以应用任务队列的定时队列，支持 crontab 定时模式，简单方便。

* **高并发及可扩展性需求**：解耦应用程序最直接的好处就是可扩展性和并发性能的提高。支持并发执行任务，同时支持自动动态扩展。

## Kratos下实现分布式任务队列

我们将分布式任务队列以transport.Server的形式整合进微服务框架Kratos。

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

#### 创建Kratos服务

```go
import github.com/tx7do/kratos-transport/transport/asynq

const (
	localRedisAddr = "127.0.0.1:6379"

	testTask1        = "test_task_1"
	testDelayTask    = "test_task_delay"
	testPeriodicTask = "test_periodic_task"
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

#### 创建新任务

* 普通任务

```go
// 最多重试3次，10秒超时，20秒后过期
err = srv.NewTask(testTask1, []byte("test string"),
    asynq.MaxRetry(10),
    asynq.Timeout(10*time.Second),
    asynq.Deadline(time.Now().Add(20*time.Second)))
```

* 延迟任务

```go
err = srv.NewTask(testDelayTask, []byte("delay task"), asynq.ProcessIn(3*time.Second))
```

* 周期性任务

```go
// 每分钟执行一次
err = srv.NewPeriodicTask("*/1 * * * ?", testPeriodicTask, []byte("periodic task"))
```

#### 注册任务回调

```go
func handleTask(_ context.Context, task *asynq.Task) error {
	log.Infof("Task Type: [%s], Payload: [%s]", task.Type(), string(task.Payload()))
	return nil
}

func handleDelayTask(_ context.Context, task *asynq.Task) error {
	log.Infof("Delay Task Type: [%s], Payload: [%s]", task.Type(), string(task.Payload()))
	return nil
}

func handlePeriodicTask(_ context.Context, task *asynq.Task) error {
	log.Infof("Periodic Task Type: [%s], Payload: [%s]", task.Type(), string(task.Payload()))
	return nil
}

err := srv.HandleFunc(testTask1, handleTask)
err = srv.HandleFunc(testTaskDelay, handleDelayTask)
err = srv.HandleFunc(testPeriodicTask, handlePeriodicTask)
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

#### 创建Kratos服务

```go
import github.com/tx7do/kratos-transport/transport/machinery

const (
	localRedisAddr = "127.0.0.1:6379"

	testTask1        = "test_task_1"
	testDelayTask    = "test_delay_task"
	testPeriodicTask = "test_periodic_task"
	sumTask          = "sum_task"
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

* 普通任务

```go
var args = map[string]interface{}{}
args["int64"] = 1
err = srv.NewTask(sumTask, args)
```

* 延迟任务

```go
// 延迟5秒执行任务
var args = map[string]interface{}{}
err = srv.NewTask(testDelayTask, args, WithDelayTime(time.Now().UTC().Add(time.Second*5)))
```

* 周期性任务（需要注意的是，延迟任务的精度只能到秒级）

```go
var args = map[string]interface{}{}
// 每分钟执行一次
err = srv.NewPeriodicTask("*/1 * * * ?", testPeriodicTask, args)
```

#### 注册任务回调

```go

func handleTask(_ context.Context, task *asynq.Task) error {
	log.Infof("Task Type: [%s], Payload: [%s]", task.Type(), string(task.Payload()))
	return nil
}

func handleDelayTask(_ context.Context, task *asynq.Task) error {
	log.Infof("Task Type: [%s], Payload: [%s]", task.Type(), string(task.Payload()))
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

func handlePeriodicTask() error {
	fmt.Println("################ 执行周期任务PeriodicTask #################")
	return nil
}

err = srv.HandleFunc(testTask1, handleTask)
err = srv.HandleFunc(testTaskDelay, handleDelayTask)
err = srv.HandleFunc(testPeriodicTask, handlePeriodicTask)
err = srv.HandleFunc(sumTask, handleAdd)
```

#### 示例代码

示例代码可以在单元测试代码中找到：<https://github.com/tx7do/kratos-transport/tree/main/transport/machinery/server_test.go>

## 参考资料

* [Celery 简介](https://www.celerycn.io/ru-men/celery-jian-jie)
* [分布式任务队列Celery的实践](https://cloud.tencent.com/developer/article/1898147)
* [Asynq: Golang distributed task queue library](https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830)
* [异步任务处理系统，如何解决业务长耗时、高并发难题？](https://www.51cto.com/article/707654.html)
* [分布式任务队列 Celery](https://blog.51cto.com/u_15301988/3080859)
* [Celery - Github](https://github.com/celery/celery)
* [Machinery - Github](https://github.com/RichardKnop/machinery)
* [Asynq - Github](https://github.com/hibiken/asynq)
* [machinery中文文档](https://zhuanlan.zhihu.com/p/270640260)
* [Go 语言分布式任务处理器 Machinery – 架构，源码详解篇](https://marksuper.xyz/2022/04/20/machinery1/)
* [Task orchestration in Go Machinery.](https://medium.com/swlh/task-orchestration-in-go-machinery-66a0ddcda548)
* [go-machinery入门教程（异步任务队列）](https://juejin.cn/post/6889743612267986958)
* [Asynq: simple, reliable & efficient distributed task queue for your next Go project](https://dev.to/koddr/asynq-simple-reliable-efficient-distributed-task-queue-for-your-next-go-project-4jhg)
* [Asynq: Golang distributed task queue library](https://nickest14.medium.com/asynq-golang-distributed-task-queue-library-75de3424a830)
