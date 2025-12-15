# Kratos微服务框架实现权鉴 - Zanzibar

用户的权限管理对每个项目来说都至关重要。不同的业务场景决定了不同的权限管理需求，不同的技术栈也有不同的解决方案：

1. 如果你在写一个`Ruby On Rails`应用，那你可能会选择[cancan](https://github.com/ryanb/cancan)；
2. 如果你在写一个`Java Spring`应用，那你可能会选择[Spring Security](https://spring.io/projects/spring-security) 或者 [Apache Shiro](https://shiro.apache.org/)；
3. 如果你正在使用`K8S`，那你很可能需要与K8S的[鉴权模块](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/authorization/)打交道。

那如果你面对一个非常复杂的业务，需要实现极为灵活的权限配置，并且同时对接多个服务怎么办呢？谷歌的一致性全球授权系统Zanzibar可以帮到你。

Google Zanzibar是谷歌2016年起上线的一致性全球授权系统。这套系统的主要功能是：

1. 储存来自各个服务的**访问控制列表(Access Control Lists, ACLs)**，也就是所谓的**权限(Permission)**。
2. 根据储存的ACL，进行权限校验。

这套系统上线后对接的Google服务有：Calendar、Cloud、Drive、Maps、Photos、YouTube等重要的服务。

Google并没有对Zanzibar进行开源，只开放了论文。好在基于论文有一些优秀的开源实现，有两个开源实现值得推荐：

1. [Ory/Keto](https://github.com/ory/keto)
2. [Auth0/OpenFGA](https://github.com/openfga/openfga)

## 为什么需要 Google Zanzibar？

在 [Zanzibar 论文](https://research.google/pubs/pub48190/)中，谷歌列出了一些决定他们将从拥有权限服务中受益的原因：

1. 首先，作为一项服务，他们需要将代码重复和版本偏差的量降至最低。
2. 其次，谷歌拥有大量的应用程序和服务，他们经常需要检查一个应用程序在另一个应用程序中的资源之间的权限。例如，当您使用 Gmail 发送电子邮件时，它警告您收件人无法阅读电子邮件中链接的文档，这是有效的，因为 Gmail 正在询问 Zanzibar 关于链接的 Google 文档的权限。
3. 第三，谷歌在权限系统之上构建了通用基础设施，只有当您拥有全局一致的 API 来进行编程时，您才能做到这一点。
4. 最后，也是最重要的：**鉴权很难**。

人们希望任何权鉴的实施都能够符合一些常见的要求。

首先，它应该保证其正确性。有了权限，正确性就很容易定义了。所有授权用户都应该能够与受保护资源进行交互，并且不允许任何未经授权的用户与受保护资源进行交互。起初这似乎很容易，直到您开始考虑互联网应用所必须应对的挑战。诸如：网络延迟、节点故障和时钟同步之类的事情。

其次，如果您打算对所有服务使用同一个权限系统，它应该合理地允许您对应用程序所需的所有不同类型的原语进行建模。在 Google 的案例中，他们至少具有以下权限模型：Docs 中的点对点共享、YouTube 中的公共/私人/非公开视频以及 Cloud IAM 中的 RBAC。Zanzibar 被设计得足够灵活，可以对不同类型的权限进行建模。

通常来说，每一个请求都需要进行鉴权，并且没有收到肯定的权鉴成功消息的时候，必须被解释为拒绝，所以，您需要这个系统既快速又高度可靠。

最后，由于谷歌的运营规模非常大，Zanzibar 还必须能够横向扩展，以应对每秒对数十亿用户和数万亿对象进行数百万次的权鉴操作。

综合起来，这些需求几乎肯定只能通过某种大规模的分布式系统来解决。现在我们已经列出了一些要求，让我们来探索 Zanzibar 的 API 或程序员面临的经验。

## 什么是Google Zanzibar？

从开发人员的角度来看，Zanzibar 就是一个 API 而已，您可以将用户和数据关系托管给它，然后可以通过访问点做出快速、准确地权限决策。例如，当新用户注册时，您告知 Zanzibar。当该用户创建受保护的资源（例如文档、视频或银行帐户）时，您会告知 Zanzibar。当该用户与其他用户共享资源或创建相关资源时，您告知 Zanzibar。最后，在需要回答“X 是否允许 读取/写入/删除/更新 Y？”这个问题时，Zanzibar 已经具备了快速回答该问题所需的所有信息。

Zanzibar 计算权限的方式比较新颖。应用程序开发人员写入服务的关系信息，用于构建用户、其他实体和资源之间关系的 **[有向图](https://en.wikipedia.org/wiki/Directed_graph)**。一旦这个图可用，权限检查就变成了一个 **[图遍历问题](https://authzed.com/blog/check-it-out/)**。我们可以试图通过图表找到从请求的资源和关系（例如所有者、读者等）到用户（通常是发出请求的用户）的路径。

通常，拥有一种关系暗示着同时拥有其他关系。例如，如果允许用户写入一段数据，则几乎（但不总是）意味着他们也可以读取相同的数据。为了减少必须存储的冗余信息量，Zanzibar 提供了一种称为**关系重写(relationship rewrites)**的机制，它描述了一种用于重新解释图当中某些边和关系的方法。重写的另一个例子是：“嵌套文档的文件夹的读者也应被视为文档的读者。” 。以这种方式消除冗余信息的过程，更正式地我们称之为：[归一化](https://en.wikipedia.org/wiki/Database_normalization)。

现在我们已经熟悉了 Zanzibar 的 API，让我们来看看 Zanzibar 是如何实现在大规模应用下实现低延迟的。

## Google Zanzibar 是如何实施的？

因为鉴权服务需要不断被访问，并且处于服务请求的关键路径中，所以它必须要快。对于 Google 的 Zanzibar，对第20次和第99次的网络请求进行权限检查，他们延迟分别为 3 毫秒和 20 毫秒。同时为每秒来自世界各地的 2000 万个权限检查和读取请求提供服务。Zanzibar是如何实现如此低的延迟和高负载的？

是通过运行 Zanzibar 服务的很多、很多的副本来实现高负载的：

> Zanzibar 将此负载分布在全球数十个集群中的 10,000 多台服务器上。每个集群的服务器数量从不到 100 台到超过 1,000 台不等，中位数接近 500 台。集群的大小与其地理区域的负载成比例。
>
> Zanzibar distributes this load across more than 10,000 servers organized in several dozen clusters around the world. The number of servers per cluster ranges from fewer than 100 to more than 1,000, with the median near 500. Clusters are sized in proportion to load in their geographic regions.

全球分布是通过使用谷歌的全球数据库系统[Spanner](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf)办到的。使用 Spanner，写入地球上任何地方的数据都可以立即使用，并且在外部保持一致。虽然它非常适合做权限系统的存储层，但这并不意味着存储在 Spanner 中的数据能够达到 Zanzibar 的延迟要求。F1（谷歌的另一项服务）从 Spanner 感知到的读取延迟中位数为 8.7 毫秒，标准差为 376.4 毫秒。Zanzibar 将经常需要多次往返于数据存储以计算单个权限检查。显然，如果没有一些严格的数据缓存，它不会达到99.9%的延迟只有20毫秒。

Zanzibar 在服务的多个层级都有缓存。第一层缓存是服务级别。当服务收到它最近计算的权限检查请求时，并且结果仍然可以被认为是有效的（意味着计算它的时间不早于通过的 Zookie），可以直接地返回该值。这消除了到数据存储层的所有往返行程。服务级缓存是提高性能的有效方法，但以 Zanzibar 的运营规模来看，它本身并没有多大帮助。如果允许从任何缓存提供任何请求，流经Zanzibar的庞大数据量将导致非常低的命中率或过高的内存需求。

为了提高命中率，Zanzibar 使用一致性哈希将请求（以及由此产生的缓存条目）分发到特定服务器。我们从中获得的第一个好处是缓存的命中率更高。如果我们期望特定类型的请求仅由 Zanzibar 的一小部分副本提供服务，则我们更有可能在缓存中拥有该值。第二个也是更微妙的改进是允许合并重复的请求，并且该值只计算一次并返回给所有调用者。在这种情况下，我们分摊后端数据存储往返于所有去重请求。

Zanzibar 执行的服务器端缓存的最终形式是一种特定于 Google 用例的特殊非规范化。当工程师注意到组（如 Docs、Cloud IAM、产品组所使用的那样）通常是深度嵌套时，他们创建了一个名为 Leopard Indexing System 的服务。Leopard 保持内存中的[传递闭包](https://en.wikipedia.org/wiki/Transitive_closure)作为更高级别组的子组的所有组。默认情况下，Zanzibar 中的嵌套关​​系需要对支持 Spanner 数据库的多个串行请求，因为您需要加载直接子项才能计算它们的子项。通过将所有顶级和中间组的所有子组保存在内存中，Leopard 允许 Zanzibar 将所有嵌套组解析减少到对索引的单个调用。由于 Leopard 将数据存储在内存中，并作为独立于 Zanzibar 的服务运行，因此它使用本文第 2.4.3 节中的 watch API 来不断更新底层组结构数据的变化。

Zanzibar 还使用了一个巧妙的技巧来减少尾部延迟：[请求对冲](https://medium.com/swlh/hedged-requests-tackling-tail-latency-9cea0a05f577)。当 Zanzibar 检测到来自 Spanner 或 Leopard 的响应比平时花费的时间更长时，它会向其他一个或多个服务器发送完全相同数据的另一个请求，这些服务器有望会更快地响应。

## Google Zanzibar的概念与定义

## 基于关系的访问控制 (ReBAC)

Google Zanzibar所使用的授权模型是：**基于关系的访问控制 (ReBAC)**。

[**基于关系的访问控制 (ReBAC)**](https://en.wikipedia.org/wiki/Relationship-based_access_control) 定义了一种授权范例，其中主体访问资源的权限由这些主体与资源之间存在的关系来定义。

通常，ReBAC 中的授权是通过遍历关系的[有向图](https://en.wikipedia.org/wiki/Directed_graph)来执行的。该图的节点和边与[资源描述框架 (RDF)](https://en.wikipedia.org/wiki/Resource_Description_Framework)数据格式中的三元组非常相似。ReBAC 系统允许关系的层次结构，有些系统允许更复杂的定义，包括关系上的代数运算符，例如并集、交集和差集。

ReBAC 随着社交网络 Web 应用程序的兴起而流行起来，用户需要根据他们与数据接收者的关系而不是接收者的角色来控制他们的个人信息。

与基于角色的访问控制 (RBAC)相比，它定义了角色，这些角色携带一组与其相关联的特定特权以及分配给哪些主题，ReBAC（如 ABAC）允许定义更细粒度的权限。例如，如果 ReBAC 系统定义了document类型的资源，它可以允许一个动作editor，如果系统包含关系('alice', 'editor', 'document:budget')，那么主题Alice可以编辑具体资源文件：预算. ReBAC 的缺点是，虽然它允许更细粒度的访问，但这意味着应用程序可能需要执行更多的授权检查。

ReBAC 系统默认是拒绝的，并允许在它们之上构建 RBAC 系统。

**基于关系的访问控制 (ReBAC)** 和 **基于角色的访问控制 (RBAC)** 本质上都是 **基于属性的访问控制 (ABAC)** 的一个子集

### 关系元组(Relation Tuples)

关系元组(Relation Tuples)是Zanzibar的核心概念。

关系元组由：`命名空间(Namespace)`，`对象(Object)`，`关系(Relation)`和`主题(Subject)/用户(User)`组成。

在关系被描述为关系元组，使用[BNF语法](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)描述，其形式如下：

```text
<tuple> ::= <object>'#'<relation>'@'<user>
<object> ::= <namespace>':'<object_id>
<user> ::= <user_id> | <userset>
<userset> ::= <object>'#'<relation>
```

这个定义不是容易理解的——让我们稍微分解一下。

假定，有一个示例元组是`issue:412#reporter@alice`。在此：

- `对象(Object)` 是 `issue:412`。即，问题号 412。
- `关系(Relation)` 是 `"reporter"`。
- `用户(User)` 是 `alice`。

总而言之，这个元组表示 `Alice` 是`第 412 期`的`记者(reporter)`。这个语法有点尴尬的部分是：`user`字段，它也可以是`“userset（用户集）”`。

“userset（用户集）”，它是一组用户，即与某个对象有一定关系的所有用户。

例如，`team:eng#member`将表示属于 eng 团队的所有用户的集合。使用它，可以写出`repo:acme#maintainer@team:eng#member`，即：“eng 团队的所有成员都是 Acme 存储库的维护者”。

请注意，尝试从用户的角度来表达所有内容，这里存在一点差距。无法表示“acme 存储库是问题 412 的父级”。所以 Zanzibar 论文通过将它表示为`issue:412#parent@repo:acme#`来解决这个问题...。

这里的问题是`user`必须是`用户 ID`，或者代表一组用户的东西。但我们的关系纯粹是资源对资源的关系。

老实说，我不知道这是系统设计的缺陷，还是论文的代表性问题，还是别的什么。

### 命名空间(Namepaces)、对象(Object)与主体(Subject)

Zanzibar中的`命名空间(Namespace)`并不是起隔离作用的，就像上面的那个例子，在编写`videos`Namespace时也可以引用`groups`Namespace。这里的命名空间概念更多是用来将数据分为同质的分块（并应用不同的配置），并且在储存层面上也是分离的。所以在多租户的使用场景中，用租户的UUID作为Namespace并不是一个好的选择，而应该使用`tenants`作为Namespace，从而实现：

```text
tenants:tenant-id-1#member@felix
tenants:tenant-id-1#member@john
```

这样的`Relation Tuples`，并且用`tenants:tenant-id-1#member`作为鉴权的`subject_set`。在命名方面，一般建议：**Namespace使用单词的复数形式，而Object和Subject使用UUID。** 将Relation Tuples转换为图有助于更好地理解object与subject之间的关系，考虑[Keto官方文档](https://www.ory.sh/keto/docs/concepts/graph-of-relations)上的以下例子：

```text
// user1 has access on dir1
dir1#access@user1
// Have a look on the subjects concept page if you don't know the empty relation.
dir1#parent@(file1#)
// Everyone with access to dir1 has access to file1. This would probably be defined
// through a subject set rewrite that defines this inherited relation globally.
// In this example, we define this tuple explicitly.
file1#access@(dir1#access)
// Direct access on file2 was granted.
file2#access@user1
// user2 is owner of file2
file2#owner@user2
// Owners of file2 have access to it; possibly defined through subject set rewrites.
file2#access@(file2#owner)
```

将其转换为图可以得到：

![keto-graph-of-relations.png](/assets/images/permissions/keto-graph-of-relations.png )

其中实线代表了直接定义的关系，而虚线代表了由`Subject Set`继承而来的关系。

## Keto

[Ory/Keto](https://www.ory.sh/keto/) 是谷歌Zanzibar的第一个开源实现。Keto用golang实现并兼容Zanzibar的概念，它作为一个单独的服务部署。

相关网站：

- [官方网站](https://www.ory.sh/keto/)
- [代码库](https://github.com/ory/keto-client-go)
- [官方文档](https://www.ory.sh/docs/keto/sdk/go)

API提供了两种调用方式：

- Restful
- Grpc

开放的端口：

- 4466 读取
- 4467 写入

后端存储数据库可以使用：

- PostgreSQL
- MySQL
- CockroachDB
- SQLite（用于开发时，不能用于运行时）

官方并未公布其具体的性能表现，但比起使用Spanner的Zanzibar来说，性能应该是差一些的。

### 安装部署Keto服务

具体的官方安装文档可见：<https://www.ory.sh/docs/keto/install>

#### 最基本配置keto.yml

```yml
version: v0.10.0-alpha.0

log:
  level: debug

namespaces:
  - id: 0
    name: app

serve:
  read:
    host: 0.0.0.0
    port: 4466
  write:
    host: 0.0.0.0
    port: 4467

dsn: memory
```

需要注意的是，新的版本当中，必须要有`namespaces`的定义，不然启动不了。

#### Docker

- 直接`docker run`启动

    ```bash
    docker pull oryd/keto:latest
    
    docker run -itd --name keto-server `
        -p 4466:4466 -p 4467:4467 `
        -v /d/keto.yml:/home/ory/keto.yml `
        oryd/keto:latest serve -c /home/ory/keto.yml
    ```

    需要注意的是，我把宿主的keto.yml直接挂载上去了，不然启动不了。

- docker-compose启动

    ```yml
    version: "3"
    
    services:
      keto:
        image: oryd/keto:v0.10.0-alpha.0
        ports:
          - "4466:4466"
          - "4467:4467"
        command: serve -c /home/ory/keto.yml
        restart: on-failure
        volumes:
          - type: bind
            source: .
            target: /home/ory
    ```

#### Linux

```bash
bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -d -b . keto v0.10.0-alpha.0
./keto help
```

#### macOS

```bash
brew install ory/tap/keto
keto help
```

#### Windows

```powershell
irm get.scoop.sh | iex

scoop bucket add ory https://github.com/ory/scoop.git
scoop install keto

keto help
```

> 我尝试了使用sqlite启动，结果说没有支持：could not create new connection: sqlite3 support was not compiled into the binary stack_trace

#### Kubernetes

```bash
helm repo add ory https://k8s.ory.sh/helm/charts
helm repo update
```

### 安装SDK

- 安装gRPC API

    ```bash
    go get github.com/ory/keto/proto@v0.10.0-alpha.0
    ```

- 安装REST API

    ```bash
    go get github.com/ory/keto-client-go@v0.10.0-alpha.0
    ```

### 将Keto客户端实施封装

```go
package keto

import (
	"context"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"

	"github.com/go-kratos/kratos/v2/log"

	client "github.com/ory/keto-client-go"
	acl "github.com/ory/keto/proto/ory/keto/relation_tuples/v1alpha2"
)

type Client struct {
	checkServiceClient  acl.CheckServiceClient
	readServiceClient   acl.ReadServiceClient
	writeServiceClient  acl.WriteServiceClient
	expandServiceClient acl.ExpandServiceClient

	readClient  *client.APIClient
	writeClient *client.APIClient

	useGRPC bool
}

func NewClient(readUrl, writeUrl string, useGRPC bool) *Client {
	cli := &Client{
		useGRPC: useGRPC,
	}

	if useGRPC {
		cli.createGrpcWriteClient(writeUrl)
		cli.createGrpcReadClient(readUrl)
	} else {
		cli.createRestWriteClient(writeUrl)
		cli.createRestReadClient(readUrl)
	}

	return cli
}

func (c *Client) GetCheck(ctx context.Context, namespace, object, relation, subject string) (bool, error) {
	if c.useGRPC {
		return c.grpcGetCheck(ctx, namespace, object, relation, subject)
	} else {
		return c.restGetCheck(ctx, namespace, object, relation, subject)
	}
}

func (c *Client) CreateRelationTuple(ctx context.Context, namespace, object, relation, subject string) error {
	if c.useGRPC {
		return c.grpcCreateRelationTuple(ctx, namespace, object, relation, subject)
	} else {
		return c.restCreateRelationTuple(ctx, namespace, object, relation, subject)
	}
}

func (c *Client) createGrpcReadClient(uri string) {
	conn, err := grpc.Dial(uri, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic("Encountered error: " + err.Error())
	}

	c.checkServiceClient = acl.NewCheckServiceClient(conn)
	c.readServiceClient = acl.NewReadServiceClient(conn)
	c.expandServiceClient = acl.NewExpandServiceClient(conn)
}

func (c *Client) createGrpcWriteClient(uri string) {
	conn, err := grpc.Dial(uri, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic("Encountered error: " + err.Error())
	}

	c.writeServiceClient = acl.NewWriteServiceClient(conn)
}

func (c *Client) createRestReadClient(uri string) {
	configuration := client.NewConfiguration()
	configuration.Servers = []client.ServerConfiguration{
		{
			URL: uri,
		},
	}
	c.readClient = client.NewAPIClient(configuration)
}

func (c *Client) createRestWriteClient(uri string) {
	configuration := client.NewConfiguration()
	configuration.Servers = []client.ServerConfiguration{
		{
			URL: uri,
		},
	}
	c.writeClient = client.NewAPIClient(configuration)
}

func (c *Client) restCreateRelationTuple(ctx context.Context, namespace, object, relation, subject string) error {
	relationQuery := *client.NewRelationQuery()
	relationQuery.SetNamespace(namespace)
	relationQuery.SetObject(object)
	relationQuery.SetRelation(relation)
	relationQuery.SetSubjectId(subject)
	_, r, err := c.writeClient.WriteApi.CreateRelationTuple(ctx).RelationQuery(relationQuery).Execute()
	if err != nil {
		log.Errorf("restCreateRelationTuple error: [%s][%v]", err.Error(), r)
		return err
	}

	return nil
}

func (c *Client) restGetCheck(ctx context.Context, namespace, object, relation, subject string) (bool, error) {
	check, r, err := c.readClient.ReadApi.GetCheck(ctx).
		Namespace(namespace).
		Object(object).
		Relation(relation).
		SubjectId(subject).
		Execute()
	if err != nil {
		log.Errorf("restGetCheck error: [%s][%v]", err.Error(), r)
		return false, err
	}

	return check.Allowed, nil
}

func (c *Client) grpcCreateRelationTuple(ctx context.Context, namespace, object, relation, subject string) error {
	response, err := c.writeServiceClient.TransactRelationTuples(ctx, &acl.TransactRelationTuplesRequest{
		RelationTupleDeltas: []*acl.RelationTupleDelta{
			{
				Action: acl.RelationTupleDelta_ACTION_INSERT,
				RelationTuple: &acl.RelationTuple{
					Namespace: namespace,
					Object:    object,
					Relation:  relation,
					Subject:   acl.NewSubjectID(subject),
				},
			},
		},
	})
	if err != nil {
		log.Errorf("grpcCreateRelationTuple error: [%s][%v]", err.Error(), response)
	}
	return err
}

func (c *Client) grpcGetCheck(ctx context.Context, namespace, object, relation, subject string) (bool, error) {
	response, err := c.checkServiceClient.Check(ctx, &acl.CheckRequest{
		Tuple: &acl.RelationTuple{
			Namespace: namespace,
			Object:    object,
			Relation:  relation,
			Subject:   acl.NewSubjectID(subject),
		},
	})
	if err != nil {
		// If namespace doesn't exist, we'll catch the Not Round error.
		if status.Code(err) == codes.NotFound {
			return false, nil
		}
		log.Errorf("grpcGetCheck error: [%s][%v]", err.Error(), response)
		return false, err
	}
	return response.Allowed, nil
}
```

### 将Keto整合进Kratos

```go
package middleware

import (
	"context"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/middleware"

	"github.com/tx7do/kratos-authz/engine"
)

const (
	reason string = "FORBIDDEN"
)

var (
	ErrUnauthorized  = errors.Forbidden(reason, "unauthorized access")
	ErrMissingClaims = errors.Forbidden(reason, "missing authz claims")
	ErrInvalidClaims = errors.Forbidden(reason, "invalid authz claims")
)

func Server(authorizer engine.Authorizer, opts ...Option) middleware.Middleware {
	o := &options{}

	for _, opt := range opts {
		opt(o)
	}

	if authorizer == nil {
		return nil
	}

	return func(handler middleware.Handler) middleware.Handler {
		return func(ctx context.Context, req interface{}) (interface{}, error) {
			var (
				allowed bool
				err     error
			)

			claims, ok := engine.AuthClaimsFromContext(ctx)
			if !ok {
				return nil, ErrMissingClaims
			}

			if claims.Subject == nil || claims.Action == nil || claims.Resource == nil {
				return nil, ErrInvalidClaims
			}

			var project engine.Project
			if claims.Project == nil {
				project = ""
			} else {
				project = *claims.Project
			}

			allowed, err = authorizer.IsAuthorized(ctx, *claims.Subject, *claims.Action, *claims.Resource, project)
			if err != nil {
				return nil, err
			}
			if !allowed {
				return nil, ErrUnauthorized
			}

			return handler(ctx, req)
		}
	}
}
```

## OpenFGA

OpenFGA是应用[ReBAC](https://openfga.dev/docs/authorization-and-openfga#what-is-relationship-based-access-control-rebac)概念的[Fine-Grained Authorization](https://openfga.dev/docs/authorization-and-openfga#what-is-fine-grained-authorization-fga)的开源解决方案。它由[Auth0 FGA](https://docs.fga.dev/)团队创建，灵感来自[Zanzibar](https://openfga.dev/docs/authorization-and-openfga#what-is-zanzibar)。它专为大规模的可靠性和低延迟而设计。它提供了一个 HTTP API 和用于编程语言的 SDK，包括[Node.js/JavaScript](https://www.npmjs.com/package/@openfga/sdk)、[GoLang](https://github.com/openfga/go-sdk)、[.NET](https://www.nuget.org/packages/OpenFga.Sdk)和[Python](https://pypi.org/project/openfga-sdk)。未来计划提供更多 SDK 和集成，例如 Rego。

相关网站：

- [官方网站](https://openfga.dev/)
- [代码库](https://github.com/openfga)
- [官方文档](https://openfga.dev/docs/authorization-and-openfga)

API提供了两种调用方式：

- Restful
- Grpc

支持的数据存储引擎：

- PostgreSQL
- MySQL
- CCache（LRU Cache）
- 内存

开放的端口：

- 8080 是GRPC的接口
- 8081 是HTTP的接口
- 3000 提供了playground：<http://localhost:3000/playground>
- 3001 提供了性能探查器

### 安装部署OpenFGA服务

#### Docker

```bash
docker pull openfga/openfga:latest

docker run -itd --name openfga-server `
  -p 8080:8080 `
  -p 8081:8081 `
  -p 3000:3000 `
  openfga/openfga:latest run
```

#### Docker Compose

```bash
curl -LO https://openfga.dev/docker-compose.yaml
docker compose up
```

#### 预编译二进制

进入下载页面下载二进制包：<https://github.com/openfga/openfga/releases/latest>

然后运行命令：

```bash
./openfga run
```

### 安装SDK

```bash
go get -u github.com/openfga/go-sdk
```

### 将OpenFGA客户端实施封装

```go
package openfga

import (
	"context"
	"encoding/json"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/google/uuid"
	openfga "github.com/openfga/go-sdk"
	"github.com/openfga/go-sdk/credentials"
)

type Client struct {
	apiClient *openfga.APIClient
}

func NewClient(scheme, host, storeId, token string) *Client {
	cli := &Client{}

	if cli.createApiClient(scheme, host, storeId, token) != nil {
		return nil
	}

	if cli.ensureStore(context.Background()) != nil {
		return nil
	}

	return cli
}

func (c *Client) ensureStore(ctx context.Context) error {
	stores, err := c.ListStore(context.Background())
	if err != nil {
		return err
	}

	if stores == nil || len(*stores) == 0 {
		_uuid := uuid.New()
		storeName := _uuid.String()
		err = c.CreateStore(ctx, storeName)
		if err != nil {
			return err
		}
	} else {
		c.SetStoreId((*stores)[len(*stores)-1].GetId())
	}
	return nil
}

func (c *Client) createApiClient(scheme, host, storeId, token string) error {
	rawConfig := openfga.Configuration{
		ApiScheme: scheme,  // optional, defaults to "https"
		ApiHost:   host,    // required, define without the scheme (e.g. api.fga.example instead of https://api.fga.example)
		StoreId:   storeId, // not needed when calling `CreateStore` or `ListStores`
	}

	if token != "" {
		rawConfig.Credentials = &credentials.Credentials{
			Method: credentials.CredentialsMethodApiToken,
			Config: &credentials.Config{
				ApiToken: token, // will be passed as the "Authorization: Bearer ${ApiToken}" request header
			},
		}
	}

	configuration, err := openfga.NewConfiguration(rawConfig)
	if err != nil {
		return err
	}

	c.apiClient = openfga.NewAPIClient(configuration)

	return nil
}

func (c *Client) GetCheck(ctx context.Context, object, relation, subject string) (bool, error) {
	body := openfga.CheckRequest{
		TupleKey: &openfga.TupleKey{
			User:     openfga.PtrString(subject),
			Relation: openfga.PtrString(relation),
			Object:   openfga.PtrString(object),
		},
	}
	data, response, err := c.apiClient.OpenFgaApi.Check(ctx).Body(body).Execute()
	if err != nil {
		log.Errorf("GetCheck error: [%s][%v]", err.Error(), response)
		return false, err
	}

	return *data.Allowed, nil
}

func (c *Client) ListStore(ctx context.Context) (*[]openfga.Store, error) {
	stores, response, err := c.apiClient.OpenFgaApi.ListStores(ctx).Execute()
	if err != nil {
		log.Errorf("ListStore error: [%s][%v]", err.Error(), response)
		return nil, err
	}
	//log.Infof("%v", stores.Stores)
	return stores.Stores, nil
}

func (c *Client) GetStore(ctx context.Context) string {
	store, response, err := c.apiClient.OpenFgaApi.GetStore(ctx).Execute()
	if err != nil {
		log.Errorf("GetStore error [%s][%v]", err.Error(), response)
		return ""
	}
	return store.GetId()
}

func (c *Client) CreateStore(ctx context.Context, name string) error {
	store, response, err := c.apiClient.OpenFgaApi.CreateStore(ctx).
		Body(openfga.CreateStoreRequest{
			Name: openfga.PtrString(name),
		}).
		Execute()
	if err != nil {
		log.Errorf("CreateStore error: [%s][%v]", err.Error(), response)
		return err
	}

	c.SetStoreId(store.GetId())

	return nil
}

func (c *Client) DeleteStore() error {
	body := openfga.ApiDeleteStoreRequest{}
	response, err := c.apiClient.OpenFgaApi.DeleteStoreExecute(body)
	if err != nil {
		log.Errorf("DeleteStore error: [%s][%v]", err.Error(), response)
		return err
	}
	return nil
}

func (c *Client) SetStoreId(id string) {
	c.apiClient.SetStoreId(id)
}

func (c *Client) CreateRelationTuple(ctx context.Context, object, relation, subject string) error {
	body := openfga.WriteRequest{
		Writes: &openfga.TupleKeys{
			TupleKeys: []openfga.TupleKey{
				{
					User:     openfga.PtrString(subject),
					Relation: openfga.PtrString(relation),
					Object:   openfga.PtrString(object),
				},
			},
		},
	}
	_, response, err := c.apiClient.OpenFgaApi.Write(ctx).Body(body).Execute()
	if err != nil {
		log.Errorf("CreateRelationTuple error: [%s][%v]", err.Error(), response)
		return err
	}
	return nil
}

func (c *Client) DeleteRelationTuple(ctx context.Context, object, relation, subject string) error {
	body := openfga.WriteRequest{
		Deletes: &openfga.TupleKeys{
			TupleKeys: []openfga.TupleKey{
				{
					User:     openfga.PtrString(subject),
					Relation: openfga.PtrString(relation),
					Object:   openfga.PtrString(object),
				},
			},
		},
	}
	_, response, err := c.apiClient.OpenFgaApi.Write(ctx).Body(body).Execute()
	if err != nil {
		log.Errorf("DeleteRelationTuple error: [%s][%v]", err.Error(), response)
		return err
	}
	return nil
}

func (c *Client) ExpandRelationTuple(ctx context.Context, object, relation string) error {
	body := openfga.ExpandRequest{
		TupleKey: &openfga.TupleKey{
			Relation: openfga.PtrString(relation),
			Object:   openfga.PtrString(object),
		},
	}
	_, response, err := c.apiClient.OpenFgaApi.Expand(ctx).Body(body).Execute()
	if err != nil {
		log.Errorf("ExpandRelationTuple error: [%s][%v]", err.Error(), response)
		return err
	}
	return nil
}

func (c *Client) CreateAuthorizationModel(ctx context.Context, writeAuthorizationModelRequestString string) (string, error) {
	var body openfga.WriteAuthorizationModelRequest
	if err := json.Unmarshal([]byte(writeAuthorizationModelRequestString), &body); err != nil {
		return "", err
	}

	data, response, err := c.apiClient.OpenFgaApi.WriteAuthorizationModel(ctx).Body(body).Execute()
	if err != nil {
		log.Errorf("CreateAuthorizationModel error: [%s][%v]", err.Error(), response)
		return "", err
	}

	return data.GetAuthorizationModelId(), nil
}
```

### 将OpenFGA整合进Kratos

```go
package middleware

import (
	"context"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/middleware"

	"github.com/tx7do/kratos-authz/engine"
)

const (
	reason string = "FORBIDDEN"
)

var (
	ErrUnauthorized  = errors.Forbidden(reason, "unauthorized access")
	ErrMissingClaims = errors.Forbidden(reason, "missing authz claims")
	ErrInvalidClaims = errors.Forbidden(reason, "invalid authz claims")
)

func Server(authorizer engine.Authorizer, opts ...Option) middleware.Middleware {
	o := &options{}

	for _, opt := range opts {
		opt(o)
	}

	if authorizer == nil {
		return nil
	}

	return func(handler middleware.Handler) middleware.Handler {
		return func(ctx context.Context, req interface{}) (interface{}, error) {
			var (
				allowed bool
				err     error
			)

			claims, ok := engine.AuthClaimsFromContext(ctx)
			if !ok {
				return nil, ErrMissingClaims
			}

			if claims.Subject == nil || claims.Action == nil || claims.Resource == nil {
				return nil, ErrInvalidClaims
			}

			var project engine.Project
			if claims.Project == nil {
				project = ""
			} else {
				project = *claims.Project
			}

			allowed, err = authorizer.IsAuthorized(ctx, *claims.Subject, *claims.Action, *claims.Resource, project)
			if err != nil {
				return nil, err
			}
			if !allowed {
				return nil, ErrUnauthorized
			}

			return handler(ctx, req)
		}
	}
}
```

## 相关代码

相关代码已经开源，欢迎拉取参考学习：

- <https://github.com/tx7do/kratos-authz>
- <https://gitee.com/tx7do/kratos-authz>

应用方面的代码，我开源了一个简单的CMS，完整的应用可在当中找到：

- <https://github.com/tx7do/go-wind-cms>
- <https://gitee.com/tx7do/go-wind-cms>

## 参考资料

- [Zanzibar: Google’s Consistent, Global Authorization System](https://research.google/pubs/pub48190/)
- [Spanner: Google's Globally-Distributed Database](https://research.google/pubs/pub39966/)
- [关系的访问控制 (ReBAC)](https://en.wikipedia.org/wiki/Relationship-based_access_control)
- [基于属性的访问控制 (ABAC)](https://en.wikipedia.org/wiki/Attribute-based_access_control)
- [详解微服务中的三种授权模式](https://www.infoq.cn/article/rl6g3buvaal8aiwvugdf)
- [What is Relationship Based Access Control (ReBAC)?](https://www.ubisecure.com/access-management/what-is-relationship-based-access-control-rebac/)
- [Relationship-Based Access Control (ReBAC)](https://www.osohq.com/academy/relationship-based-access-control-rebac)
- [My Reading on Google Zanzibar: Consistent, Global Authorization System](https://pushpalanka.medium.com/my-reading-on-google-zanzibar-consistent-global-authorization-system-f4a12df85cbb)
- [AuthZ: Carta’s highly scalable permissions system](https://medium.com/building-carta/authz-cartas-highly-scalable-permissions-system-782a7f2c840f)
- [Zanzibar-style ACLs with OPA Rego](https://gruchalski.com/posts/2022-05-07-zanzibar-style-acls-with-opa-rego/)
- [Zanzibar: A Global Authorization System - Presented by Auth0](https://zanzibar.academy/)
- [Building Zanzibar from Scratch](https://www.osohq.com/post/zanzibar)
- [What is Zanzibar?](https://authzed.com/blog/what-is-zanzibar/)
- [Building Zanzibar from Scratch](https://www.osohq.com/post/zanzibar)
- [Google Zanzibar In A Nutshell](https://www.permify.co/post/google-zanzibar-in-a-nutshell)
- [The Evolution of Ory Keto: A Global Scale Authorization System](https://www.ory.sh/keto-zanzibar-evolution/)
- [ZANZIBAR与ORY/KETO: 权限管理服务简介](https://chennima.github.io/keto-permission-manager-introduction)
- [OpenFGA : Auth0’s an open-source authorization solution](https://openfga.dev/)
- [Announcing OpenFGA - Auth0’s Open Source Fine Grained Authorization System](https://auth0.com/blog/auth0s-openfga-open-source-fine-grained-authorization-system/)
- [如何使用 Ory Kratos 和 Ory Keto 保护您的烧瓶应用程序](https://devpress.csdn.net/python/62f99ab8c6770329307fef6d.html)
