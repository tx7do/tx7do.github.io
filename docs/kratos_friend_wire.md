# Kratos微服务与它的小伙伴系列 - 依赖注入库 - Wire

## 什么是依赖注入

依赖注入 (Dependency Injection，缩写为 DI)，是一种软件设计模式，也是实现控制反转(Inversion of Control)的其中一种技术。这种模式能让一个物件接收它所依赖的其他物件。“依赖”是指接收方所需的对象。“注入”是指将“依赖”传递给接收方的过程。在“注入”之后，接收方才会调用该“依赖”。此模式确保了任何想要使用给定服务的物件不需要知道如何建立这些服务。取而代之的是，连接收方物件（像是 client）也不知道它存在的外部代码（注入器）提供接收方所需的服务。

依赖注入涉及四个概念：

1. 服务：任何类，提供了有用功能。
2. 客户：使用服务的类。
3. 接口：客户不应该知道服务实现的细节，只需要知道服务的名称和 API。
4. 注入器：Injector，也称 assembler、container、provider 或 factory。负责把服务引入给客户。
依赖注入把对象构建与对象注入分开。因此创建对象的 new 关键字也可消失了。

Golang 的依赖注入框架有两类：

- 通过反射在运行时进行依赖注入，典型代表是 **Uber** 开源的 [dig](https://github.com/uber-go/dig)；
- 通过 generate 进行代码生成，典型代表是 **Google** 开源的 [wire](https://github.com/google/wire)。

使用 dig 功能会强大一些，但是缺点就是错误只能在运行时才能发现，这样如果不小心的话可能会导致一些隐藏的 bug 出现。使用 wire 的缺点就是功能限制多一些，但是好处就是编译的时候就可以发现问题，并且生成的代码其实和我们自己手写相关代码差不太多，更符合直觉，心智负担更小，所以更加推荐 wire。

## 什么是Wire

[wire](https://github.com/google/wire) 是由 google 开源的一个供 Go 语言使用的依赖注入代码生成工具。它能够根据你的代码，生成相应的依赖注入 go 代码。

与其他依赖注入工具不同，比如 uber 的 dig 和 facebook 的 inject，这 2 个工具都是使用反射实现的依赖注入，而且是运行时注入（runtime dependency injection）。

wire 是编译代码时生成代码的依赖注入，是编译期间注入依赖代码（compile-time dependency injection）。而且代码生成期间，如果依赖注入有问题，生成依赖代码时就会出错，就可以报出问题来，而不必等到代码运行时才暴露出问题。

## provider 和 injector

首先，需要理解 wire 的 2 个核心概念：provider 和 injector。

从上面 java 模拟依赖注入的例子中，可以简化出依赖注入的步骤：

- 第一：需要 New 出一个类实例
- 第二：把这个 New 出来的类实例通过构造函数或者其他方式“注入”到需要使用它的类中
- 第三：在类中使用这个 New 出来的实例

从上面步骤来理解 wire 的 2 个核心概念 provider 和 injector。

- provider 就相当于上面 New 出来的类实例。
- injector 就相当于“注入”动作前，把所需依赖函数进行聚合，根据这个聚合的函数生成依赖关系。

provider：提供一个对象。  
injector：负责根据对象依赖关系，生成新程序。

### provider

provider 是一个普通的 Go 函数 ，可以理解为是一个对象的构造函数。为下面生成 injector 函数提供”构件“。

下面的 NewUserStore() 函数可以看作是一个 provider。这个函数需要传入 `*Config` 和 `*mysql.DB` 2 个参数。

```Go
// NewUserStore 是一个 provider for *UserStore，*UserStore 依赖 *Config，*mysql.DB
func NewUserStore(cfg *Config, db *mysql.DB) (*UserStore, error) {... ...}

// NewDefaultConfig 是一个 provider for *Config，没有任何依赖
func NewDefaultConfig() *Config {...}

// NewDB 是 *mysql.DB 的一个 provider ，依赖于数据库连接信息 *ConnectionInfo
func NewDB(info *ConnectionInfo) (*mysql.DB, error){...}
```

provider 可以组合成一组 provider set。对于经常在一起使用的 providers 来说，这个非常有用。使用 `wire.NewSet` 方法可以把他们组合在一起，

```go
var SuperSet = wire.NewSet(NewUserStore, NewDefaultConfig)
```

你也可以把其他的 provider sets 加入一个 provider set，

```go
import （
    “example.com/some/other/pkg”
）

// ... ...
var MegaSet = wire.NewSet(SuperSet, pkg.OtherSet)
```

> wire.NewSet() 函数：  
> 这个函数可以把相关的 provider 组合在一起然后使用。当然也可以单独使用，如 var Provider = wire.NewSet(NewDB)。  
> 这个 NewSet 函数的返回值也可以作为其他 NewSet 函数的参数使用，比如上面的 SuperSet 作为参数使用。

### injector

我们编写程序把这些 providers 组合起来(比如下面例子 initUserStore() 函数)，wire 里的 wire 命令会按照依赖顺序调用 providers 生成更加完整的函数，这个就是 injector。

首先，编写生成 injector 的签名函数，然后用 wire 命令生成相应的函数。

例子如下：

```go
// +build wireinject

func initUserStore(info *ConnectionInfo) (*UserStore, error) {
    wire.Build(SuperSet, NewDB) // 声明获取 UserStore 需要调用哪些 provider 函数
    return nil, nil
}
```

然后用 wire 命令把上面的 `initUserStore` 函数生成 injector 函数，生成的函数对应文件名 `wire_gen.go`。

> wire 命令:
>
> You can generate the injector by invoking Wire in the package directory。  
> 直接在生成 injector 函数的包下，使用 wire 命令，就可以生成 injector 代码。
>
> wire.Build() 函数：
>
> 它的参数可以是 wire.NewSet() 组织的一个或多个 provider，也可以直接使用 provider。

## wire工具安装

```bash
go install github.com/google/wire/cmd/wire@latest
```

## 参考资料

1. [Wire Github](https://github.com/google/wire)
2. [dig Github](https://github.com/uber-go/dig)
3. [Go工程化(三) 依赖注入框架 wire](https://lailin.xyz/post/go-training-week4-wire.html)
4. [理解一下依赖注入，以及如何用 wire](https://farer.org/2021/04/21/go-dependency-injection-wire/)
5. [依赖注入 - 维基百科](https://zh.wikipedia.org/wiki/%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)
6. [Dependency Injection Demystified](https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified)
7. [Go Cloud Wire：编译时依赖注入详解](https://learnku.com/docs/go-blog/wire/6494)
8. [golang常用库包：Go依赖注入(DI)工具-wire使用](https://www.cnblogs.com/jiujuan/p/16136633.html)
