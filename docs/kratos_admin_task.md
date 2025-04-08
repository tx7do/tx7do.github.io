# 开箱即用的GO后台管理系统 Kratos Admin - 定时任务

在后台管理系统中，定时任务是一个很实用的功能，可以帮助我们自动执行一些周期性的任务，比如定期清理数据、发送邮件提醒等。

在go里面，如果想要简单的实现一个周期性任务，我们可以用[cron](https://github.com/robfig/cron)或者[gron](https://github.com/roylee0704/gron)等仿linux的crontab的库。

但是，我们使用的是微服务框架，而且，还要考虑到能否实现分布式执行。那么，我们就需要利用**任务队列（Task Queue）**来实现。

**任务队列（Task Queue）** 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。

任务队列的输入是称为`任务(Task)`的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。

任务队列可以使用于以下的场景：

1. 分布式任务：可以将任务分发到多个工作者进程或机器上执行，以提高任务处理速度。
2. 定时任务：可以在指定时间执行任务。例如：每天定时备份数据、日志归档、心跳测试、运维巡检。支持 crontab 定时模式
3. 后台任务：可以在后台执行耗时任务，例如图像处理、数据分析等，不影响用户界面的响应。
4. 解耦任务：可以将任务与主程序解耦，以提高代码的可读性和可维护性，解耦应用程序最直接的好处就是可扩展性和并发性能的提高。支持并发执行任务，同时支持自动动态扩展。
5. 实时处理：可以支持实时处理任务，例如即时通讯、消息队列等。

在Python世界里面，我们可以使用[Celery](https://github.com/celery/celery)。

在Golang语言里面，我们有像[Asynq](https://github.com/hibiken/asynq)和[Machinery](https://github.com/RichardKnop/machinery)等，类似于`Celery`的分布式任务队列。

在我们Kratos Admin里面，我们将使用Asynq来实现定时任务，Machinery比较重，需要依赖第三方MQ，而Asynq只需要依赖Redis，足够轻量，admin的使用场景下，也足够使用了。

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

## Asynq任务名的命名规则

在 `asynq` 里，任务名（也就是 type name）并没有严格的语法规则，但为了提升代码的可读性、可维护性，便于管理，建议遵循以下准则：

### 唯一性

每个任务类型名在整个应用程序中必须唯一。因为 asynq 依靠任务类型名来区分不同的任务处理逻辑，若有重复，就会在任务调度与处理时产生混乱。例如：

```go
const (
    TaskTypeSendEmail = "email:send"
    TaskTypeProcessOrder = "order:process"
)
```

这里的 `TaskTypeSendEmail` 和 `TaskTypeProcessOrder` 都是独一无二的。

asynq还有一个特性：

我们注册一个任务名：`email:send`，我们创建一个任务名为：`email:send:1`却可以被`email:send`的回调方法所处理。

### 命名风格

- **使用冒号分隔**：一般采用冒号来分隔不同的命名空间或模块，这样能让任务名结构更清晰。例如，`email:send` 表明该任务和邮件发送相关；`order:process` 意味着此任务和订单处理有关。
- **采用小写字母**：任务名通常用小写字母和数字，单词间可用 连字符`-` 或者 下划线`_` 分隔。像 `user:register`、`payment:refund` 这样的命名，简洁且易于理解。

### 语义明确

任务名要准确反映任务的功能或用途，这样开发者在查看代码或者调试时，能迅速了解任务的作用。比如，不要用模糊的名称 `task1`、`job2`，而要用 `image:resize`、`report:generate` 这类明确的名称。

### 避免特殊字符

尽量避免使用特殊字符（除了冒号、连字符和下划线），因为特殊字符可能会在某些场景下引发问题，并且会降低任务名的可读性。

### 版本管理

若任务逻辑有重大变更，可考虑在任务名里添加版本号。例如，`email:send:v2` 表示这是邮件发送任务的第二个版本。

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
    --name asynqmon \
    -p 8080:8080 \
    hibiken/asynqmon:latest \
    --redis-url=redis://:*Abcd123456@host.docker.internal:6379/1
```

安装好Web UI之后，我们就可以打开浏览器访问管理后台了：<http://localhost:8080>

* 仪表盘

![AsynqMon Dashboard](https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_dashboard.png)

* 任务视图

![AsynqMon Task View](https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_task_view.png)

* 性能

![AsynqMon Metrics](https://tx7do.github.io/assets/images/task_queue/asynq_web_ui_metrics.png)

## 如何在Kratos Admin中使用定时任务

在上面提到的Asynq和Machinery，我已经将之以`transport.Server`的形式进行了封装：

- [kratos-transport/Asynq](https://github.com/tx7do/kratos-transport/tree/main/transport/asynq)
- [kratos-transport/Machinery](https://github.com/tx7do/kratos-transport/tree/main/transport/machinery)

我们需要在项目中安装Asynq的依赖库：

```bash
go get -u github.com/tx7do/kratos-transport/transport/asynq
```

接着，在`internal/server`当中创建Asynq的服务器：

```go
package server

import (
    ...
	"github.com/tx7do/kratos-transport/transport/asynq"
)

// NewAsynqServer creates a new asynq server.
func NewAsynqServer(cfg *conf.Bootstrap, _ log.Logger, svc *service.TaskService) *asynq.Server {
	if cfg == nil || cfg.Server == nil || cfg.Server.Asynq == nil {
		return nil
	}

	srv := asynq.NewServer(
		asynq.WithAddress(cfg.Server.Asynq.GetEndpoint()),
		asynq.WithRedisPassword(cfg.Server.Asynq.GetPassword()),
		asynq.WithRedisDatabase(int(cfg.Server.Asynq.GetDb())),
		asynq.WithLocation(cfg.Server.Asynq.GetLocation()),
		asynq.WithEnableKeepAlive(false),
		asynq.WithGracefullyShutdown(true),
		asynq.WithShutdownTimeout(3*time.Second),
	)

	svc.Server = srv

	var err error

	// 注册任务
	if err = asynq.RegisterSubscriber(srv, task.BackupTaskType, svc.AsyncBackup); err != nil {
		log.Error(err)
	}

	// 启动所有的任务
	_, _ = svc.StartAllTask(context.Background())

	return srv
}
```

然后，我们需要在`main.go`里面把`asynq.Server`注册进`kratos.App`：

```go
func newApp(
	...
	as *asynq.Server,
) *kratos.App {
	return bootstrap.NewApp(as, ...)
}
```

现在就可以开始写业务逻辑到`service`里面了：

```go
package service

// AsyncBackup 异步备份
func (s *TaskService) AsyncBackup(taskType string, taskData *task.BackupTaskData) error {
	s.log.Infof("AsyncBackup [%s] [%+v] [%s]", taskType, taskData, taskData.Name)
	return nil
}

// startTask 启动一个任务
func (s *TaskService) startTask(t *systemV1.Task) error {
	if t == nil {
		return errors.New("task is nil")
	}

	if t.GetEnable() == false {
		return errors.New("task is not enable")
	}

	var opts []asynq.Option
	var payload broker.Any
	var err error

	switch t.GetType() {
	case systemV1.TaskType_TaskType_Periodic:
		opts, payload = s.convertTaskOption(t)
		if _, err = s.Server.NewPeriodicTask(t.GetCronSpec(), t.GetTypeName(), payload, opts...); err != nil {
			s.log.Errorf("[%s] 创建定时任务失败[%s]", t.GetTypeName(), err.Error())
			return err
		}

	case systemV1.TaskType_TaskType_Delay:
		opts, payload = s.convertTaskOption(t)
		if err = s.Server.NewTask(t.GetTypeName(), payload, opts...); err != nil {
			s.log.Errorf("[%s] 创建延迟任务失败[%s]", t.GetTypeName(), err.Error())
			return err
		}

	case systemV1.TaskType_TaskType_WaitResult:
		opts, payload = s.convertTaskOption(t)
		if err = s.Server.NewWaitResultTask(t.GetTypeName(), payload, opts...); err != nil {
			s.log.Errorf("[%s] 创建等待结果任务失败[%s]", t.GetTypeName(), err.Error())
			return err
		}
	}

	return nil
}

// StartAllTask 启动所有的任务
func (s *TaskService) StartAllTask(ctx context.Context) (int32, error) {
    // 读取任务列表
	resp, err := s.ListTask(ctx, &pagination.PagingRequest{
		NoPaging: trans.Ptr(true),
		Query:    trans.Ptr(""),
	})
	if err != nil {
		s.log.Errorf("获取任务列表失败[%s]", err.Error())
		return 0, err
	}

	s.log.Infof("开始开启定时任务，总计[%d]个", resp.GetTotal())

	// 重新启动任务
	var count int32
	for _, t := range resp.GetItems() {
		if s.startTask(t) != nil {
			continue
		} else {
			count++
		}
	}

	s.log.Infof("总共成功开启定时任务[%d]个", count)

	return count, nil
}
```

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)

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
