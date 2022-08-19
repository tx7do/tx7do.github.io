# Kratos微服务框架下实现GraphQL服务

GraphQL 是一种用于应用编程接口（API）的查询语言和服务器端运行时，它可以使客户端准确地获得所需的数据，没有任何冗余。

GraphQL 由 Facebook 开发，并于 2012 年首次应用于移动应用。GraphQL 规范于 2015 年实现开源。现在，它受 GraphQL 基金会监管。

## GraphQL有什么用？

GraphQL 旨在让 API 变得快速、灵活并且为开发人员提供便利。它甚至可以部署在名为 GraphiQL 的集成开发环境（IDE）中。作为 REST 的替代方案，GraphQL 允许开发人员构建相应的请求，从而通过单个 API 调用从多个数据源中提取数据。

此外，GraphQL 还可让 API 维护人员灵活地添加或弃用字段，而不会影响现有查询。开发人员可以使用自己喜欢的方法来构建 API，并且 GraphQL 规范将确保它们以可预测的方式在客户端发挥作用。

## GraphQL 的优缺点

### GraphQL 的优点

* GraphQL 模式会在 GraphQL 应用中设置单一事实来源。它为企业提供了一种整合其整个 API 的方法。
* 一次往返通讯可以处理多个 GraphQL 调用。客户端可得到自己所请求的内容，不会超量。
* 严格定义的数据类型可减少客户端与服务器之间的通信错误。
* GraphQL 具有自检功能。客户端可以请求一个可用数据类型的列表。这非常适合文档的自动生成。
* GraphQL 允许应用 API 进行更新优化，而无需破坏现有查询。
* 许多开源 GraphQL 扩展可提供 REST API 所不具备的功能。
* GraphQL 不指定特定的应用架构。它能够以现有的 REST API 为基础，并与现有的 API 管理工具配合使用。

### GraphQL 的缺点

* 即便是熟悉 REST API 的开发人员，也需要一定时间才能掌握 GraphQL。
* GraphQL 将数据查询的大部分工作都转移到服务器端，由此增加了服务器开发人员工作的复杂度。
* 根据不同的实施方式，GraphQL 可能需要不同于 REST API 的 API 管理策略，尤其是在考虑速率限制和定价的情况下。
* 缓存机制比 REST 更加复杂。
* API 维护人员还会面临编写可维护 GraphQL 模式的额外任务。

## GraphQL支持的数据类型以及关键字

### 标量类型

* Int：带符号的32位整数，对应 JavaScript 的 Number
* Float：带符号的双精度浮点数，对应 JavaScript 的 Number
* String：UTF-8字符串，对应 JavaScript 的 String
* Boolean：布尔值，对应 JavaScript 的 Boolean
* ID：ID 值，是一个序列化后值唯一的字符串，可以视作对应 ES 2015 新增的 Symbol

### 高级类型

#### 接口类型

```GraphQL
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

#### 联合类型

```GraphQL
union SearchResult = Human | Droid | Starship
```

#### 枚举类型

```GraphQL
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

#### 输入类型

```GraphQL
input CommentInput {
    body: String!
}
```

#### 数组类型和非空类型

使用`[]`来表示**数组**，使用`!`来表示**非空**。`Non-Null`强制类型的值不能为null，并且在请求出错时一定会报错。可以用于必须保证值不能为null的字段

#### 对象类型

```GraphQL
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

## 编译GraphQL文件

在graphql同级目录下创建一个配置文件，命名为：gqlgen.yml

```yaml
schema:
  - "*.graphql"
```

或者是指定导出models项：

```yaml
models:
  Todo:
    model: github.com/Laisky/laisky-blog-graphql.Todo
```

然后在graphql文件同级目录下，使用命令行执行以下命令，即可生成go代码：

```shell
# 直接运行
go run github.com/99designs/gqlgen

# 安装
go get github.com/99designs/gqlgen
go install github.com/99designs/gqlgen
# 然后运行
gqlgen
```

## 开始在Kratos微服务框架下使用GraphQL

我基于gqlgen实现的GraphQL服务封装，它可以在Kratos微服务框架下直接使用：<https://github.com/tx7do/kratos-transport/tree/main/transport/graphql>
。

实例程序的目标是从服务器获取温湿度信息，然后将温湿度信息发送给客户端。示例代码可以在单元测试里面找到。

### 编写GraphQL协议

```graphql
type Hygrothermograph {
    humidity: Float!
    temperature: Float!
}

type Query {
    hygrothermograph: Hygrothermograph!
}
```

### 编写Graphql服务器

首先需要编写解析器，在Kratos里面，可以写成Service。

```go
type resolver struct{}

func (r *resolver) Query() api.QueryResolver {
	return &queryResolver{}
}

type queryResolver struct{}

func (r *queryResolver) Hygrothermograph(ctx context.Context) (*api.Hygrothermograph, error) {
	ret := &api.Hygrothermograph{
		Humidity:    float64(rand.Intn(100)),
		Temperature: float64(rand.Intn(100)),
	}
	fmt.Println("Humidity:", ret.Humidity, "Temperature:", ret.Temperature)
	return ret, nil
}
```

编写服务器

```go
ctx := context.Background()

srv := NewServer(
  WithAddress(":8800"),
)

srv.Handle("/query", api.NewExecutableSchema(api.Config{Resolvers: &resolver{}}))

if err := srv.Start(ctx); err != nil {
  panic(err)
}

defer func() {
  if err := srv.Stop(ctx); err != nil {
    t.Errorf("expected nil got %v", err)
  }
}()
```

服务器本地访问地址为：<http://localhost:8800/query>

如果要测试的话，推荐使用客户端：Altair。

## 客户端工具

* [Altair](https://github.com/altair-graphql/altair)
* [GraphQL Editor](https://github.com/graphql-editor/graphql-editor)
* [GraphQL-Playground](https://github.com/graphql/graphql-playground)
* [GraphiQL](https://github.com/graphql/graphiql)
* [GraphQL Voyager](https://github.com/IvanGoncharov/graphql-voyager)

客户端推荐使用Altair，我用着挺爽的。

## 参考文档

* [GraphQL中文站](https://graphql.cn/)
* [gqlgen官网](https://gqlgen.com/)
* [GraphQL官网](https://graphql.org/)
* [使用 gqlgen 编写 GraphQL 后端](https://blog.laisky.com/p/gqlgen/)
* [GraphQL学习之基础篇](https://juejin.cn/post/6844903854153154568)
* [什么是 GraphQL？核心概念解析](https://www.redhat.com/zh/topics/api/what-is-graphql)
