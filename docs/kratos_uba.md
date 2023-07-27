# 跟我一起用Golang微服务框架Kratos实现一个用户行为分析系统（UBA）

本文将带你了解什么是 **BI（商业智能）** 和 **UBA（用户行为分析）**，并且使用go语言和微服务框架kratos去实现一个UBA系统。

这个系统简单的描述就是：前端通过埋点SDK上报前端采集到的埋点数据，后端的代理服务（Agent Service）接收到了埋点数据之后，将数据入列到Kafka当中，然后我们消费Kafka当中的消息，入库到ClickHouse当中，分析服务对入库的埋点数据进行分析并且生成报表，最后在前端页面进行展示。

## 什么是BI？

BI，即商业智能，指利用大数据分析、现代数据仓库等技术收集企业最新数据、形成BI报表并及时为企业员工提供BI数据分析报告，实现对业务数据的深入挖掘以获取更多商业价值。大多数企业每天都会收集海量业务数据，这些数据来自其 ERP 软件、电商平台、供应链以及许多其他内部和外部数据源。要想充分利用这些数据，制定由数据驱动的决策，现代商业智能 (BI) 系统必不可少。

商业智能是一套流程和工具，BI系统是商业智能策略与技术的结合，用于分析业务数据，将数据转化为可行的洞察，再通过BI报表等形式直观地展现给企业员工，帮助企业中的每个人制定更明智的决策。因此，BI分析系统也被称作决策支持系统 (DSS)。BI系统的数据来源可以是当前数据也可是历史数据，BI系统的分析结果可以BI报表、仪表盘、图形、图表和分布图等形式呈现，这些内容既易于理解，又能在整个企业内共享。

商业智能（BI）有时被称作“描述性分析”，因其描述了企业的当前情况和历史情况。商业智能可通过BI分析技术以BI报表的形式向用户回答“发生了什么？”“需要作出哪些改变？”等问题，但不会反映事情发生的原因或未来可能发生的事情。

在1996年，加特纳（Gartner）集团一锤定音，正式将商业智能定义为：商业智能描述了一系列的概念和方法，通过应用基于事实的支持系统来辅助商业决策的制定。

但是，我们无法为BI给出准确的定义，主要有两个方面的原因：

- 一方面，随着信息技术的发展，20多年来商业智能的内容也发生了一些变化，但是商业智能的定义仍然停留在上个世纪；
- 另一方面，与欧美发达国家相比，我国的信息化水平较为落后，除去互联网和各行业龙头企业，国内真正兴起BI热潮也是在近几年。

## 什么是UBA？

**UBA** 是 **User Behavior Analysis** 的缩写，即：**用户行为分析**，是一种数据分析技术，用于收集、分析和报告用户在网站上的行为。它可以帮助公司了解用户的偏好、习惯和行为，从而更好地满足他们的需求并提高用户体验。UBA通常使用跟踪代码和分析工具来收集和分析数据，并以图表、报告和洞察性见解的形式呈现给市场营销人员和产品经理。

用户行为分析（UBA），最开始是用于电商领域，做搜索推荐和精准营销。通过分析用户的点击、收藏、购买等行为，实现用户标签画像，预测用户的消费习惯，推送用户感兴趣的商品，达到精准营销的目的。

很快，用户行为分析（UBA）被应用到信息安全领域。一般传统的安全技术都是通过检测引擎依赖于已知的规则进行检测，这种方式的误报率高，准确率低，且无法发现新的未知威胁行为。而用户行为分析是从另外一个角度去发现问题，从多维度、长周期去做分析，关联分析、行为建模、异常分析来发现更多更准确的安全威胁。

2014年，Gartner发布了用户行为分析(UBA)市场界定，用户行为分析(UBA)技术目标市场聚焦在安全（窃取数据）和诈骗（利用窃取来的信息）上，帮助企业检测内部威胁、有针对性的金融诈骗。

## 什么是UEBA？

前身是 **UBA（用户行为分析）**， 即**User Behavior Analysis**， 用于购物网站上， 通过收集用户搜索的关键字，实现用户标签画像，并预测用户购买习惯，推送用户感兴趣的商品。

2014年，为了解决传统规则检测违规的，误报太多，无法识别之前未知的威胁模式的问题，提出了UBA，UBA最初的提出，是为了应对日益增长的内部（人员）威胁。但是，更多的IT资产和设备，即实体（Entity）的概念被渐渐引入。通过UEBA，异常行为分析不仅可以发现内部失陷主机，还能对外部网络攻击以及渗透成功后的内部横向移动有更强的洞察力

UBA的技术目标聚焦在安全(窃取数据)和诈骗(利用窃取来的信息)上，帮助组织检测内部威胁，有针对性的攻击，和诈骗.UBA关注的是人而不是物，通过机器学习来发现高级威胁，实现了自动化的建模，相比于传统的安全管理，UBA在发现用户异常行为(合法用户做不合法的事)，异常用户(特权账号盗用)等方面有较高的命中率

UBA定义为:基于机器学习的行为分析，异常检测，UBA分析用户的活动，并为之确立基线，从而评估某个用户的正常行为和异常行为，一旦用户偏离已知正常状态，就会产生警报

UBA的显著特点是除使用检测可能是威胁的异常用户行为的规则外，还利用机器学习和统计模型。机器学习能够让企业识别之前未知的模式，减少静态规则因无法适应每个用户或变化行为所触发的误报，并且基本上不需要为每个潜在的违规行为定义规则。

2015年，UBA演化为**UEBA**， **User and Entity Behavior Analytics**， 即：**用户和实体行为分析**， 除了分析用户外，还可以分析其他实体，比如设备、应用程序和端点设备。

## 分析模型

UBA常用的分析模型有以下这些：

- 事件分析 - 最近几个月来，哪个渠道的用户注册量最高？变化趋势如何？
- 漏斗分析 - 从浏览产品，到点击支付的转化与流失情况如何？
- 留存分析 - 分析整体用户留存现状。
- 归因分析 - 是哪些运营位吸引了用户，让他们购买了这个产品？
- 分布分析 - 揭示单个用户对产品的依赖程度，复购率如何？
- 用户路径分析 - 用户如何浏览你的产品？理想路径是什么？
- 用户分群 - 过去几十天购买产品的用户都有谁？并制定定向推送优惠券的营销。
- 点击分析 - 用户都点击了哪个界面元素？哪个界面元素被高频点击？
- 用户属性分析 - 不同时间的注册用户数的变化趋势如何？用户按省份分布情况如何？
- 用户行为序列 - 用户未支付即流失。查看用户的历史行为记录，快速验证流失的原因。

## 系统组成

### 前端埋点SDK

现在支持：

- H5
- Cocos Creator
- Unity

### 后端服务组成

1. Admin Service，这是一个BFF服务，对管理前端提供REST服务；
2. Agent Service，这也是一个BFF服务，对接埋点SDK，提供REST服务；
3. Core Service，主要处理一些基本信息，比如应用信息，用户信息等。为了简化系统，就权且都放在这里了，后面可以根据需求进行拆分；
4. Logger Service，主要是消费Kafka消息，然后入库ClickHouse，这个可有可无，如果采用其他方式消费Kafka消息的话，就可以不开启；
5. Report Service，对入库的埋点数据进行分析并且生成报表。

## 技术栈

### 后端技术栈

- [Golang](https://go.dev/)
- [Kratos](https://go-kratos.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [ClickHouse](https://clickhouse.com/)
- [Kafka](https://kafka.apache.org/)
- [Consul](https://www.consul.io/)
- [Jaeger](https://www.jaegertracing.io/)
- [Entgo](https://entgo.io/)

### 前端技术栈

- [Vue 3.0](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://cn.vitejs.dev/guide/)
- [Ant Design Vue](https://antdv.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vben Admin](https://doc.vvbin.cn/)

## Docker部署依赖系统

依赖的系统有：

1. PostgreSQL
2. ClickHouse
3. Consul
4. ZooKeeper
5. Kafka
6. Redis
7. MinIO
8. Jaeger

### docker run

```bash
docker network create app-tier --driver bridge

docker run -itd \
    --name postgres \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=123456 \
    --network=app-tier \
    bitnami/postgresql:latest

docker run -itd \
    --name clickhouse-server \
    -p 8123:8123 \
    -p 9000:9000 \
    -p 9004:9004 \
    --network=app-tier \
    --ulimit \
    nofile=262144:262144 \
    clickhouse/clickhouse-server:latest

docker run -itd \
    --name consul-server-standalone \
    -p 8300:8300 \
    -p 8500:8500 \
    -p 8600:8600/udp \
    --network=app-tier \
    -e CONSUL_BIND_INTERFACE='eth0' \
    -e CONSUL_AGENT_MODE=server \
    -e CONSUL_ENABLE_UI=true \
    -e CONSUL_BOOTSTRAP_EXPECT=1 \
    -e CONSUL_CLIENT_LAN_ADDRESS=0.0.0.0 \
    bitnami/consul:latest

docker run -itd \
    --name zookeeper-server \
    --network app-tier \
    -p 2181:2181 \
    -e ALLOW_ANONYMOUS_LOGIN=yes \
    bitnami/zookeeper:latest

docker run -itd \
    --name kafka-standalone \
    --link zookeeper-server \
    --network app-tier \
    -p 9092:9092 \
    -v /home/data/kafka:/bitnami/kafka \
    -e KAFKA_ENABLE_KRAFT=no \
    -e KAFKA_BROKER_ID=1 \
    -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://host.docker.internal:9092 \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper-server:2181 \
    -e ALLOW_PLAINTEXT_LISTENER=yes \
    --user root \
    bitnami/kafka:latest

docker run -itd \
    --name redis-server \
    -p 6379:6379 \
    -e ALLOW_EMPTY_PASSWORD=yes \
    bitnami/redis:latest

docker run -itd \
    --name minio-server \
    -p 9000:9000 \
    -p 9001:9001 \
    --env MINIO_ROOT_USER="root" \
    --env MINIO_ROOT_PASSWORD="123456789" \
    --env MINIO_DEFAULT_BUCKETS='images,videos' \
    --env MINIO_FORCE_NEW_KEYS="yes" \
    --env BITNAMI_DEBUG=true \
    --volume /usr/local/minio/data:/data \
    --network app-tier \
    bitnami/minio:latest

docker run -itd \
    --name jaeger \
    -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
    -e COLLECTOR_OTLP_ENABLED=true \
    -p 6831:6831/udp \
    -p 6832:6832/udp \
    -p 5778:5778 \
    -p 16686:16686 \
    -p 4317:4317 \
    -p 4318:4318 \
    -p 14250:14250 \
    -p 14268:14268 \
    -p 14269:14269 \
    -p 9411:9411 \
    jaegertracing/all-in-one:latest
```

### docker-compose

配置文件在`backend/script`下面，只需要在路径下执行命令：

```bash
docker-compose up -d
```

既可以安装好依赖的服务。

## 初始化数据库

PostgreSQL不需要管，只需要创建一个`restroom`数据库即可，我们使用到了ORM库Ent，它会自动创建表。

ClickHouse的数据库操作都是自己手工撸的，就只有自己执行sql语句去创建表了，相关的SQL文件在`backend/sql`：

```sql
CREATE OR REPLACE TABLE acceptance_status
(
    data_name      String,
    report_type    String,
    report_data    String,
    status         Int32,
    error_reason   String,
    error_handling String,
    part_event     String,
    part_date      DateTime DEFAULT now()
)
    ENGINE = MergeTree()
    PARTITION BY (toYYYYMMDD(part_date))
        ORDER BY (toYYYYMMDD(part_date), data_name, error_reason, error_handling, report_type, status)
        TTL part_date + toIntervalMonth(3)
        SETTINGS index_granularity = 8192, timezone = 'Asia/Shanghai';
;

CREATE OR REPLACE TABLE realtime_warehousing
(
    eventName  String,
    reportData String,
    createTime DateTime DEFAULT now()
)
    ENGINE = MergeTree()
    PARTITION BY (toYYYYMMDD(createTime))
        ORDER BY (toYYYYMMDD(createTime), eventName)
        TTL createTime + toIntervalMonth(3)
        SETTINGS index_granularity = 8192, timezone = 'Asia/Shanghai';
```

推荐使用的数据库工具是JetBrains家的DataGrip，好用的很。

## 实现埋点代理服务

其接口定义如下：

```protobuf

// 上报数据服务
service ReportService {
  // 提交事件
  rpc PostReport (PostReportRequest) returns (PostReportResponse) {
    option (google.api.http) = {
      post: "/agent/v1/report"
      body: "*"
    };
  }
}

message PostReportRequest {
  string reportType = 1; // 类型
  string appId = 2;// 应用ID
  string appKey = 3;// 应用Key
  string eventName = 4;// 事件名
  int32 debug = 5;// 调试
  string content = 6;// 事件内容
}

message PostReportResponse {
  int32 code = 1;
  string msg = 2;
}
```

接着我们在`data`包下面创建Kafka的Broker：

```go
func NewKafkaBroker(cfg *conf.Bootstrap) broker.Broker {
	b := kafka.NewBroker(
		broker.WithAddress(cfg.Data.Kafka.Addrs...),
		broker.WithCodec(cfg.Data.Kafka.Codec),
	)
	if b == nil {
		return nil
	}

	_ = b.Init()

	if err := b.Connect(); err != nil {
		return nil
	}

	return b
}
```

在Service下我们就可以调用Broker去发布消息给Kafka了：

```go
func (s *ReportService) PostReport(_ context.Context, req *v1.PostReportRequest) (*v1.PostReportResponse, error) {

	_ = s.kafkaBroker.Publish(topic.EventReportData, reportV1.RealTimeWarehousingData{
		EventName:  &req.EventName,
		ReportData: &req.Content,
		CreateTime: util.UnixMilliToStringPtr(trans.Int64(time.Now().UnixMilli())),
	})
	return &v1.PostReportResponse{
		Code: 0,
		Msg:  "success",
	}, nil
}
```

这样埋点数据就流入了我们的系统了，接下来的事情就是系统内部事务了。

## 消费Kafka中的埋点数据消息

其实，消息队列并不需局限于Kafka，使用其他的MQ也是没问题的，实现起来也并不复杂，比如ClickHouse另外支持的RabbitMQ、NATS等。

但是，本文仅仅使用Kafka来实现。

在本文，我们要介绍到的Kafka消息的消费方式有两种，实际上，入库还有很多方法可以办到，但是，本文只介绍以下这两种：

1. ClickHouse内置Kafka Engine（推荐使用）；
2. 自己实现一个服务（在这里是Logger Service）；

这两种方式可以只取一种，也可以两种一起并行，推荐只取其中一种。

### 1. ClickHouse内置Kafka Engine

使用ClickHouse内置的Kafka引擎来实现消费Kafka队列消息还是很容易的，只需要两步就可以了。

我们拿`realtime_warehousing`库消费Kafka中的`logger.report.event`主题为例来讲解：

首先创建一个Kafka引擎，本质上就是跟Kafka进行绑定。

```sql
-- realtime_warehousing kafka表
CREATE OR REPLACE TABLE realtime_warehousing_kafka
(
    createTime DateTime('Asia/Shanghai'),
    eventName  String,
    reportData String
)
    ENGINE = Kafka
    SETTINGS kafka_broker_list = 'host.docker.internal:9092',
            kafka_topic_list = 'logger.report.event',
            kafka_group_name = 'ck-saver',
            kafka_format = 'JSONEachRow',
            kafka_skip_broken_messages = 1;
```

我们监听`host.docker.internal:9092`这个Broker，使用`ck-saver`消费组来消费`logger.report.event`消息。消息的格式是`JSONEachRow`，也就是每一行的数据都是JSON。`kafka_skip_broken_messages`表示的是如果遇到了损坏的消息，需要跳过的条数。

然后，就是创建一个物化视图，物化视图的作用是把Kafka表和目标表`realtime_warehousing`进行绑定，并将Kafka表里面的消息入库。

```sql
-- realtime_warehousing kafka表 物化视图
CREATE MATERIALIZED VIEW realtime_warehousing_mv TO realtime_warehousing AS
SELECT createTime as create_time,
       eventName as event_name,
       reportData as report_data
FROM realtime_warehousing_kafka;
```

执行了以上两条SQL语句之后，ClickHouse就可以消费Kafka的消息，并且入库了。

### 2. 自己实现一个Kratos服务

在这里，我们实现的服务叫做Logger Service，当然，叫什么都无所谓的。可以叫Sinker、Saver等都可以。

我对Kafka进行了一个封装，我们需要对库进行安装：

```bash
go get -u github.com/tx7do/kratos-transport/transport/kafka
```

使用这个库，我们可以将Kafka的Broker注册成为一个Server去进行消费消息。

```go
srv := kafka.NewServer(
    kafka.WithAddress(cfg.Server.Kafka.Addrs),
    kafka.WithGlobalTracerProvider(),
    kafka.WithGlobalPropagator(),
    kafka.WithCodec("json"),
)
```

然后，我们就可以订阅主题：

```go
func EventReportCreator() broker.Any { return &v1.RealTimeWarehousingData{} }

type EventReportHandler func(_ context.Context, topic string, headers broker.Headers, msg *v1.RealTimeWarehousingData) error

_ = srv.RegisterSubscriber(ctx,
    topic.EventReportData, topic.LoggerSaverQueue, false,
    RegisterEventReportHandler(svc.SaveEventReport),
    EventReportCreator,
)
```

最后，实现订阅处理器：

```go
func (s *SaverService) SaveEventReport(_ context.Context, _ string, _ broker.Headers, msg *v1.RealTimeWarehousingData) error {
	return s.realtimeRepo.Create(msg)
}
```

在处理器里面，我们调用Repo执行入库操作。

到这里，Kafka入口处理就完成了，接着，我们就就可以去实现ClickHouse的数据库相关操作了。

首先安装ClickHouse的驱动：

```bash
go get -u github.com/ClickHouse/clickhouse-go/v2
```

创建ClickHouse客户端：

```go
import (
	"database/sql"

	_ "github.com/ClickHouse/clickhouse-go/v2"
)

// NewClickHouseClient 创建数据库客户端
func NewClickHouseClient(cfg *conf.Bootstrap, logger log.Logger) *sql.DB {
	l := log.NewHelper(log.With(logger, "module", "ent/data/logger-service"))

	conn, err := sql.Open(cfg.Data.Database.Driver, cfg.Data.Database.Source)
	if err != nil {
		l.Errorf("create clickhouse connection failed: %s", err.Error())
		return nil
	}

	if err := conn.Ping(); err != nil {
		l.Errorf("ping clickhouse failed: %s", err.Error())
		return nil
	}

	return conn
}
```

在这里我们使用`database/sql`来实现ClickHouse的客户端，这样，我们就可以使用DSN字符串来连接ClickHouse了。

最后，就是实现Repo了，我们只需要实现`Insert`的操作：

```go
type RealtimeWarehousingRepo struct {
	data *Data
	log  *log.Helper
}

func NewRealtimeWarehousingRepo(data *Data, logger log.Logger) *RealtimeWarehousingRepo {
	l := log.NewHelper(log.With(logger, "module", "realtime-warehousing/repo/logger-service"))
	return &RealtimeWarehousingRepo{
		data: data,
		log:  l,
	}
}

func (r *RealtimeWarehousingRepo) Create(req *v1.RealTimeWarehousingData) error {
	query := "INSERT INTO realtime_warehousing (event_name, report_data) VALUES (?, ?)"
	_, err := r.data.db.ExecContext(context.Background(), query, req.GetEventName(), req.GetReportData())
	if err != nil {
		r.log.Error(err)
		return err
	}
	return nil
}
```

到这里，这个服务就大功告成了，使用`kratos run`启动服务，即可实现Kafka消息的消费以及入库了。

## 数据的展示

数据的分析展示也是有很多方法的，比如用开源的BI软件连接ClickHouse：Superset、Tableau等。还有就是自己写微服务去分析数据。

### Superset

我们使用Docker的方式安装Superset。需要注意的是，不同的版本，可能界面会有些微的不同。

```bash
# 拉取镜像
docker pull apache/superset:latest

# 创建容器
docker run -itd \
    -p 8088:8088 \
    --name superset \
    --network=app-tier \
    -e "SUPERSET_SECRET_KEY=your_secret_key_here" \
    apache/superset

# 创建账户
docker exec -it superset superset fab create-admin \
    --username admin \
    --firstname Superset \
    --lastname Admin \
    --email admin@superset.com \
    --password admin

# 升级数据库
docker exec -it superset superset db upgrade

# 加载示例
docker exec -it superset superset load_examples

# 初始化
docker exec -it superset superset init

# 安装ClickHouse驱动
docker exec -it superset pip install clickhouse-connect
```

安装完ClickHouse驱动之后，重启Superset。

现在，Superset就算安装好了，我们可以通过链接：<http://localhost:8088/login/> 访问Superset，账户名和密码都是admin。

下面添加ClickHouse到Superset：

点击`+ DATABASE`按钮

![Superset_+DataBase_Button.png](/assets/images/bi/Superset_+DataBase_Button.png)

选中`ClickHouse Connect`

![Superset_connect_a_database.png](/assets/images/bi/Superset_connect_a_database.png)

填写ClickHouse的连接信息

![Superset_fill_clickhouse_info.png](/assets/images/bi/Superset_fill_clickhouse_info.png)

添加ClickHouse中的`realtime_warehousing`表到DataSet：

![Superset_add_dataset.png](/assets/images/bi/Superset_add_dataset.png)

添加一个图表

![Superset_create_a_new_chart.png](/assets/images/bi/Superset_create_a_new_chart.png)

简单的根据需要添加了纬度和统计方式就会得到下面的图表：

![Superset_pie_chart.png](/assets/images/bi/Superset_pie_chart.png)

### 自己实现微服务

## SDK使用

### 初始化

初始化方法内部已处理为单例

```html

<script type="text/javascript" src="report_sdk.js"></script>
<script type="text/javascript">

    const params = {"appid": "********", "appkey": "********"}
    //第一个参数为 上报服务的启动地址
    //第二个参数为 appid   由BI后台创建应用后生成
    //第三个参数为 appkey  由BI后台创建应用后生成
    //第四个参数为 客户端debug类型 
    // 0 为正常入kafka 
    // 1 为测试模式（数据入库）
    // 2 为测试模式（数据不入库）
    //当debug为 1 or 2 并且该distinctid在BI系统的Debug模式功能中添加了,就可触发测试模式
    let eventReport = new EventReport("http://127.0.0.1:9800", params["appid"], params["appkey"], 0)

</script>
```

### 手动设置用户的distinctid

```js
eventReport.identify("23232")
```

### 注销当前用户

```js
eventReport.logout()
```

### 获取当前用户的distinctid

```js
eventReport.getDistinctId()
```

### 登录

由于distinctid为本地离线UUID,如想接入自己业务服务器用户id用此方法

```js
eventReport.login()
```

### 获取设备注册时间戳

```js
eventReport.getRegTime()
```

### 设置全局属性

例如用户名，年龄这些属性需要设置在每个事件中，就可以调用此方法

```js
eventReport.setSuperProperties({name: "张三", age: 18})
```

### 删除全局属性值

```js
// 删除name属性
eventReport.unsetSuperProperties("name")
```

### 清空全局属性

```js
eventReport.clearSuperProperties()
```

### 上报用户属性

```js
// 链式调用
eventReport.userSetOnce({"address": "井湾子街道"}) //如果您要上传的用户属性只要设置一次，则可以调用 userSetOnce 来进行设置，当该属性之前已经有值的时候，将会忽略这条信息
    .userSet({name_tset: "张三", age: 18})//对于一般的用户属性，您可以调用 userSet 来进行设置，如果之前存在该用户属性将会覆盖原有的属性值，如果之前不存在该用户属性，则会新建该用户属性。
    .userUnset("name_tset")//当您要清空用户的某个用户属性值时，您可以调用 userUnset 来对指定属性进行清空操作
    .userAdd({age: 1})//当您要上传数值型的属性时，您可以调用 userAdd 来对该属性进行累加操作，如果该属性还未被设置，则会赋值 0 后再进行计算。如果传入负值，等同于减法操作
    .trackUserData()//最终上报
```

### 事件上报

```js
//进行事件上报 
//第一个参数为 事件名
//第二个参数为 事件附加属性 类型为对象
eventReport.track("访问网站", {feeling: "Hello World!"})
```

### 完整示例

```html

<script type="text/javascript" src="report_sdk.js"></script>
<script type="text/javascript">
    const params = {"appid": "********", "appkey": "********"}
    const eventReport = new EventReport("http://127.0.0.1:9800", params["appid"], params["appkey"], 0)
    eventReport.track("访问网站", {feeling: "Hello World!"})
</script>
```

## BI后台使用说明

## 实现代码

- [Kratos UBA - github](https://github.com/tx7do/kratos-uba)
- [Kratos UBA - gitee](https://gitee.com/tx7do/kratos-uba)

## 参考资料

- [铸龙-BI（用户事件分析平台）](https://www.yuque.com/jianghurenchenggolang/oehqme/hen7qy#JFdyf)
- [做产品经理，你必须要掌握的AARRR模型！](https://www.woshipm.com/operate/5460612.html)
- [用户行为分析与BI的区别？请拿好这份指南！](https://www.niutoushe.com/54408)
- [掌握这几个重点，轻松搞定用户行为分析思路！](https://www.fanruan.com/bw/zwoz)
- [BI到底是什么？来看看不同人员的认知](https://www.woshipm.com/it/4139825.html)
- [什么是商业智能 (BI)？](https://www.sap.cn/products/technology-platform/cloud-analytics/what-is-business-intelligence-bi.html)
- [Business Intelligence in Microservices: Improving Performance](https://dzone.com/articles/business-intelligence-in-microservices-improving-p)
- [基于 ClickHouse 高性能引擎集群构建数据湖](https://toutiao.io/posts/pklw5vz/preview)
- [ClickHouse整合Kafka](https://learn-bigdata.incubator.edurt.io/docs/ClickHouse/Action/engine-kafka/)
- [Apply CDC from MySQL to ClickHouse](https://medium.com/@hoptical/apply-cdc-from-mysql-to-clickhouse-d660873311c7)
- [ClickHouse 在实时场景的应用和优化](https://mp.weixin.qq.com/s/hqUCFSr8cu3x3u8HCA6WYg)
- [ClickHouse基础&实践&调优全视角解析](https://xie.infoq.cn/article/37886f3baca09057580bdd5aa)
- [从维护几百张表到只需维护一张表，一个UEI模型就够了](https://zhuanlan.zhihu.com/p/623182999)
- [BI花5天完成的分析，UBA只需30秒](https://zhuanlan.zhihu.com/p/629574865)
- [Connect Superset to ClickHouse](https://clickhouse.com/docs/en/integrations/superset)
- [UBA需要知道的几个埋点小技巧](https://www.modb.pro/db/629250)
- [ClickHouse 在 UBA 系统中的字典编码优化实践](https://xie.infoq.cn/article/f4b5764abd36e22590575793e)
- [数据基建：埋点体系从认知到解决方案搭建](https://xie.infoq.cn/article/e53548f8f282dc9e8d72022ad)
- [用户行为分析模型实践（一）—— 路径分析模型](https://xie.infoq.cn/article/c16402dd3e87aa4967121969a)
- [用户数据分析详解](https://zhuanlan.zhihu.com/p/117519541)
- [user behavior analytics (UBA) definition](https://www.techtarget.com/searchsecurity/definition/user-behavior-analytics-UBA)
- [What Is User Behavior Analytics (UBA)/User Entity Behavior Analytics (UEBA)?](https://www.splunk.com/en_us/data-insider/user-behavior-analytics-ueba.html)
- [B站基于ClickHouse的海量用户行为分析应用实践](http://blog.itpub.net/70024420/viewspace-2931902/)
