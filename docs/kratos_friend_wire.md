# Kratos微服务与它的小伙伴系列 - 依赖注入库 - Wire

## 什么是依赖注入？

依赖注入 (Dependency Injection，缩写为 DI)，是一种软件设计模式，也是实现控制反转(Inversion of Control)的其中一种技术。这种模式能让一个物件接收它所依赖的其他物件。“依赖”是指接收方所需的对象。“注入”是指将“依赖”传递给接收方的过程。在“注入”之后，接收方才会调用该“依赖”。此模式确保了任何想要使用给定服务的物件不需要知道如何建立这些服务。取而代之的是，连接收方物件（像是 client）也不知道它存在的外部代码（注入器）提供接收方所需的服务。

依赖注入涉及四个概念：

1. 服务：任何类，提供了有用功能。
2. 客户：使用服务的类。
3. 接口：客户不应该知道服务实现的细节，只需要知道服务的名称和 API。
4. 注入器：Injector，也称 assembler、container、provider 或 factory。负责把服务引入给客户。
依赖注入把对象构建与对象注入分开。因此创建对象的 new 关键字也可消失了。

Golang 的依赖注入框架有两类：

- 通过反射在运行时进行依赖注入，典型代表是 **Uber** 开源的 [dig](https://github.com/uber-go/dig)；
- 通过 `generate` 进行代码生成，典型代表是 **Google** 开源的 [wire](https://github.com/google/wire)。

使用 dig 功能会强大一些，但是缺点就是错误只能在运行时才能发现，这样如果不小心的话可能会导致一些隐藏的 bug 出现。使用 wire 的缺点就是功能限制多一些，但是好处就是编译的时候就可以发现问题，并且生成的代码其实和我们自己手写相关代码差不太多，更符合直觉，心智负担更小，所以更加推荐 wire。

## 什么是Wire？

[wire](https://github.com/google/wire) 是由 google 开源的一个供 Go 语言使用的依赖注入代码生成工具。它能够根据你的代码，生成相应的依赖注入 go 代码。

与其他依赖注入工具不同，比如 Uber 的 Dig 和 Facebook 的 Inject，这 2 个工具都是使用反射实现的依赖注入，而且是运行时注入（runtime dependency injection）。

wire 是编译代码时生成代码的依赖注入，是编译期间注入依赖代码（compile-time dependency injection）。而且代码生成期间，如果依赖注入有问题，生成依赖代码时就会出错，就可以报出问题来，而不必等到代码运行时才暴露出问题。

## Provider 和 Injector

首先，需要理解 wire 的 2 个核心概念：provider 和 injector。

从上面 Java 模拟依赖注入的例子中，可以简化出依赖注入的步骤：

- 第一：需要 New 出一个类实例
- 第二：把这个 New 出来的类实例通过构造函数或者其他方式“注入”到需要使用它的类中
- 第三：在类中使用这个 New 出来的实例

从上面步骤来理解 wire 的 2 个核心概念 provider 和 injector。

- provider 就相当于上面 New 出来的类实例。
- injector 就相当于“注入”动作前，把所需依赖函数进行聚合，根据这个聚合的函数生成依赖关系。

provider：提供一个对象。  
injector：负责根据对象依赖关系，生成新程序。

### Provider

Provider 是一个普通的 Go 函数 ，可以理解为是一个对象的构造函数。为下面生成 Injector 函数提供”构件“。

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

### Injector

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

## 与Kratos携起手来

### Wire命令行工具安装

使用以下命令将Wire的命令行工具安装在全局路径下，用于代码的生成。

```bash
go install github.com/google/wire/cmd/wire@latest
```

### 场景代码

在这里，我们做一个“用户服务”。

根据Kratos的官方推荐Layout，我们将服务分为以下几层：server、service、biz、data。

```go
package server

func NewHTTPServer(c *conf.Server, ac *conf.Auth, logger log.Logger, userSvc *service.UserService) *http.Server {
	var opts = []http.ServerOption{}
	if c.Http.Network != "" {
		opts = append(opts, http.Network(c.Http.Network))
	}
	if c.Http.Addr != "" {
		opts = append(opts, http.Address(c.Http.Addr))
	}
	if c.Http.Timeout != nil {
		opts = append(opts, http.Timeout(c.Http.Timeout.AsDuration()))
	}
	srv := http.NewServer(opts...)

	v1.RegisterUserServiceHTTPServer(srv, userSvc)

	return srv
}
```

```go
package service

type UserService struct {
	v1.UnimplementedUserServiceServer

	uc  *biz.UserUseCase
	log *log.Helper
}

func NewUserService(logger log.Logger, uc *biz.UserUseCase) *UserService {
	l := log.NewHelper(log.With(logger, "module", "service/user"))
	return &UserService{
		log: l,
		uc:  uc,
	}
}
```

```go
package biz

type UserRepo interface {
	Create(ctx context.Context, req *v1.RegisterRequest) (*v1.User, error)
	Update(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error)
	Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error)
}

type UserUseCase struct {
	repo UserRepo
	log  *log.Helper
}

func NewUserUseCase(repo UserRepo, logger log.Logger) *UserUseCase {
	l := log.NewHelper(log.With(logger, "module", "user/usecase"))
	return &UserUseCase{
		repo: repo,
		log:  l,
	}
}
```

```go
package data

var _ biz.UserRepo = (*UserRepo)(nil)

type UserRepo struct {
	data *Data
	log  *log.Helper
}

func NewUserRepo(data *Data, logger log.Logger) biz.UserRepo {
	l := log.NewHelper(log.With(logger, "module", "user/repo"))
	return &UserRepo{
		data: data,
		log:  l,
	}
}
```

### 没有Wire，我们该如何组装代码？

现在，我们需要把上面这几个包组合起来，常规都是这样写的：

```go
package main

func main() {
    userRepo := data.NewUserRepo(dataData, logger)
    userUseCase := biz.NewUserUseCase(userRepo, logger)
    userService := service.NewUserService(logger, userUseCase)
    httpSrv := server.NewHTTPServer(confServer, auth, logger, userService)

	app := kratos.New(
		kratos.Name("http"),
		kratos.Server(
			httpSrv,
		),
	)
	if err := app.Run(); err != nil {
		log.Error(err)
	}
}
```

唔，看起来好像也没有什么啊，我觉着这么写也没啥问题啊。

是的，如果项目的规模很小的时候，这样写也没啥毛病，而且看起来还挺清晰的。

那么，我的项目没有这么简单了，突然爆炸了：

```go
client := data.NewEntClient(confData, logger)
redisClient := data.NewRedisClient(confData, logger)
dataData, cleanup, err := data.NewData(client, redisClient, logger)
if err != nil {
    return nil, nil, err
}
userRepo := data.NewUserRepo(dataData, logger)
userUseCase := biz.NewUserUseCase(userRepo, logger)
userTokenRepo := data.NewUserTokenRepo(dataData, auth, logger)
userTokenUseCase := biz.NewUserAuthUseCase(userTokenRepo)
userService := service.NewUserService(logger, userUseCase, userTokenUseCase)
postRepo := data.NewPostRepo(dataData, logger)
postUseCase := biz.NewPostUseCase(postRepo, logger)
postService := service.NewPostService(logger, postUseCase)
linkRepo := data.NewLinkRepo(dataData, logger)
linkUseCase := biz.NewLinkUseCase(linkRepo, logger)
linkService := service.NewLinkService(logger, linkUseCase)
categoryRepo := data.NewCategoryRepo(dataData, logger)
categoryUseCase := biz.NewCategoryUseCase(categoryRepo, logger)
categoryService := service.NewCategoryService(logger, categoryUseCase)
commentRepo := data.NewCommentRepo(dataData, logger)
commentUseCase := biz.NewCommentUseCase(commentRepo, logger)
commentService := service.NewCommentService(logger, commentUseCase)
tagRepo := data.NewTagRepo(dataData, logger)
tagUseCase := biz.NewTagUseCase(tagRepo, logger)
tagService := service.NewTagService(logger, tagUseCase)
attachmentRepo := data.NewAttachmentRepo(dataData, logger)
attachmentUseCase := biz.NewAttachmentUseCase(attachmentRepo, logger)
attachmentService := service.NewAttachmentService(logger, attachmentUseCase)
httpServer := server.NewHTTPServer(confServer, auth, logger, userService, postService, linkService, categoryService, commentService, tagService, attachmentService)
registrar := server.NewRegistrar(registry)
```

现在，你再来看。我就问你，头大不大？脑壳晕不晕？心情美不美丽？

这是一个圆环套圆环的游戏，你不仅需要手写这么多的代码，而且，还需要管理他们之间的依赖关系，要小心翼翼的别把传入参数搞错、创建的顺序别搞错。

这时候，我要：增加一个方法，减少一个方法；增加一个变量，减少一个变量。都是很奔溃的事情。哪怕你再小心翼翼，也保不齐自己不出错。

### 有了Wire，我们可以如何组装代码？

首先需要在上面4个包下面声明4个`ProviderSet`变量：

```go
package server

import (
	"github.com/google/wire"
)

// ProviderSet is server providers.
var ProviderSet = wire.NewSet(NewHTTPServer)
```

```go
package service

import (
	"github.com/google/wire"
)

// ProviderSet is service providers.
var ProviderSet = wire.NewSet(
	NewUserService,
)
```

```go
package biz

import "github.com/google/wire"

// ProviderSet is biz providers.
var ProviderSet = wire.NewSet(
	NewUserUseCase,
)
```

```go
package data

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
	NewData,

	NewEntClient,
	NewRedisClient,

	NewUserRepo,
)
```

而现在，main包下面，我需要两个go文件：

* main.go

```go
package main

func newApp(logger log.Logger, hs *http.Server, rr registry.Registrar) *kratos.App {
	return kratos.New(
		kratos.ID(Service.GetInstanceId()),
		kratos.Name(Service.Name),
		kratos.Version(Service.Version),
		kratos.Metadata(Service.Metadata),
		kratos.Logger(logger),
		kratos.Server(
			hs,
		),
		kratos.Registrar(rr),
	)
}

func main() {
    app, cleanup, err := initApp(bc.Server, rc, bc.Data, bc.Auth, logger)
	if err != nil {
		panic(err)
	}
	defer cleanup()

	// start and wait for stop signal
	if err := app.Run(); err != nil {
		fmt.Println(err)
		panic(err)
	}
}
```

* wire.go

```go
//go:build wireinject
// +build wireinject

package main

import (
	"/internal/biz"
	"/internal/conf"
	"/internal/data"
	"/internal/server"
	"/internal/service"

	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"

	"github.com/google/wire"
)

// initApp init kratos application.
func initApp(*conf.Server, *conf.Registry, *conf.Data, *conf.Auth, log.Logger) (*kratos.App, func(), error) {
	panic(wire.Build(server.ProviderSet, data.ProviderSet, biz.ProviderSet, service.ProviderSet, newApp))
}
```

然后在`main`包路径下直接运行wire命令:

```bash
$ wire
wire: XXXX: wrote XXXX\wire_gen.go
```

该命令将会在`main`包路径下生成一个`wire_gen.go`文件：

```go
// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package main


// Injectors from wire.go:

// initApp init kratos application.
func initApp(confServer *conf.Server, registry *conf.Registry, confData *conf.Data, auth *conf.Auth, logger log.Logger) (*kratos.App, func(), error) {
	client := data.NewEntClient(confData, logger)
	redisClient := data.NewRedisClient(confData, logger)
	dataData, cleanup, err := data.NewData(client, redisClient, logger)
	if err != nil {
		return nil, nil, err
	}
	userRepo := data.NewUserRepo(dataData, logger)
	userUseCase := biz.NewUserUseCase(userRepo, logger)
	userService := service.NewUserService(logger, userUseCase)
	httpServer := server.NewHTTPServer(confServer, auth, logger, userService)
	registrar := server.NewRegistrar(registry)
	app := newApp(logger, httpServer, registrar)
	return app, func() {
		cleanup()
	}, nil
}
```

明眼人的你一看就明白了：那些初始化依赖的代码全部都在生成的代码当中了。

从此，圆环套圆环，你调用我我调用你，依赖管理的这些脏活累活，你再也不需要接触，再也不需要干了，全部都丢给了Wire。

从此往后，你需要做什么呢？

维护每一个依赖包下面的`ProviderSet`，然后运行wire命令。

比如，我现在需要增加一个GRPC服务器，只需要在`ProviderSet`里边添加`NewGRPCServer`方法：

```go
var ProviderSet = wire.NewSet(NewHTTPServer, NewGRPCServer, NewRegistrar)
```

然后运行wire命令，这时候`wire_gen.go`文件里边就会增加`NewGRPCServer`方法的调用。

再比如，我现在需要在`NewHTTPServer`方法增加一个变量，`ProviderSet`此时倒是不需要动的。但是，必须要执行wire命令，重新生成代码。

## 注意事项

wire 不允许不同的注入对象拥有相同的类型。google 官方认为这种情况，是设计上的缺陷。这种情况下，可以通过类型别名来将对象的类型进行区分。

```go
func NewRegistrar(conf *conf.Registry) registry.Registrar

var ProviderSet = wire.NewSet(NewRegistrar, NewRegistrar)
```

以上的代码是不合法的，会报错`ProviderSet has multiple bindings for ***`。

我们可以用下面的方法规避，但是，不建议这么做：

```go
type RegistrarB registry.Registrar

func NewRegistrarA(conf *conf.Registry) registry.Registrar
func NewRegistrarB(conf *conf.Registry) RegistrarB

var ProviderSet = wire.NewSet(NewRegistrarA, NewRegistrarB)
```

## 结语

Wire 是一个强大的依赖注入工具。项目工程化过程中，Wire 可以很好的帮助我们管理依赖关系，协助我们完成复杂对象的构建组装。与此同时，Wire与 Inject 、Dig 等不同的是，Wire只生成代码，而不是使用反射在运行时注入，因此不需要担心会有性能损耗。

## 参考资料

1. [Wire Github](https://github.com/google/wire)
2. [Dig Github](https://github.com/uber-go/dig)
3. [Go工程化(三) 依赖注入框架 wire](https://lailin.xyz/post/go-training-week4-wire.html)
4. [理解一下依赖注入，以及如何用 wire](https://farer.org/2021/04/21/go-dependency-injection-wire/)
5. [依赖注入 - 维基百科](https://zh.wikipedia.org/wiki/%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)
6. [Dependency Injection Demystified](https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified)
7. [Go Cloud Wire：编译时依赖注入详解](https://learnku.com/docs/go-blog/wire/6494)
8. [golang常用库包：Go依赖注入(DI)工具-wire使用](https://www.cnblogs.com/jiujuan/p/16136633.html)
9. [Golang依赖注入框架wire使用详解](https://zhuanlan.zhihu.com/p/338926709)
