# Kratos 大乱炖 —— 整合其他Web框架：Gin、FastHttp、Hertz

Kratos默认的RPC框架使用的是gRPC，支持REST和protobuf两种通讯协议。其API都是使用protobuf定义的，REST协议是通过[grpc-gateway](https://github.com/grpc-ecosystem/grpc-gateway)转译实现的。使用protobuf定义API是具有极大优点的，具有很强的可读性、可维护性，以及工程性。工程再大，人员再多，也不会乱。

一切看起来都是很美好的。那么，问题来了，我们现在使用的是其他的Web框架，迁移就会有成本，有风险，不可能一下子就把历史存在的代码一口气转换过来到Kratos框架。那我可以在Kratos中整合其他的Web框架做过渡吗？答案是：可以的。Kratos是基于的插件化设计，万物皆可插。

我整合了主流的Gin和FastHttp。顺便把字节跳动的Hertz也尝试着整合了一下。整合之后，使用起来毫无违和感。

## Gin

[Gin](https://gin-gonic.com/) 是用 Go 编写的一个 Web 应用框架，对比其它主流的同类框架，他有更好的性能和更快的路由。由于其本身只是在官方 net/http 包的基础上做的完善，所以理解和上手很平滑。

封装的代码如下：

```go
package gin

import (
	"context"
	"crypto/tls"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/transport"
	kHttp "github.com/go-kratos/kratos/v2/transport/http"
)

var (
	_ transport.Server     = (*Server)(nil)
	_ transport.Endpointer = (*Server)(nil)
)

type Server struct {
	*gin.Engine
	server *http.Server

	tlsConf  *tls.Config
	endpoint *url.URL
	timeout  time.Duration
	addr     string

	err error

	filters []kHttp.FilterFunc
	ms      []middleware.Middleware
	dec     kHttp.DecodeRequestFunc
	enc     kHttp.EncodeResponseFunc
	ene     kHttp.EncodeErrorFunc
}

func NewServer(opts ...ServerOption) *Server {
	srv := &Server{
		timeout: 1 * time.Second,
		dec:     kHttp.DefaultRequestDecoder,
		enc:     kHttp.DefaultResponseEncoder,
		ene:     kHttp.DefaultErrorEncoder,
	}

	srv.init(opts...)

	return srv
}

func (s *Server) init(opts ...ServerOption) {
	s.Engine = gin.Default()

	for _, o := range opts {
		o(s)
	}

	s.server = &http.Server{
		Addr:      s.addr,
		Handler:   s.Engine,
		TLSConfig: s.tlsConf,
	}

	s.endpoint, _ = url.Parse(s.addr)
}

func (s *Server) Endpoint() (*url.URL, error) {
	return s.endpoint, nil
}

func (s *Server) Start(ctx context.Context) error {
	log.Infof("[GIN] server listening on: %s", s.addr)

	var err error
	if s.tlsConf != nil {
		err = s.server.ListenAndServeTLS("", "")
	} else {
		err = s.server.ListenAndServe()
	}
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	return nil
}

func (s *Server) Stop(ctx context.Context) error {
	log.Info("[GIN] server stopping")
	return s.server.Shutdown(ctx)
}

func (s *Server) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	s.Engine.ServeHTTP(res, req)
}
```

应用的代码如下：

```go
package gin

import (
    "context"
    "math/rand"
    "strconv"
    
    "github.com/gin-gonic/gin"
    transport "github.com/tx7do/kratos-transport/gin"
    
    api "github.com/tx7do/kratos-transport/_example/api/protobuf"
)

func main() {
    ctx := context.Background()
    
    srv := transport.NewServer(
        WithAddress(":8800"),
    )
    
    srv.Use(gin.Recovery())
    srv.Use(gin.Logger())
    
    srv.GET("/login/*param", func(c *gin.Context) {
        if len(c.Params.ByName("param")) > 1 {
            c.AbortWithStatus(404)
            return
        }
        c.String(200, "Hello World!")
    })
    
    srv.GET("/hygrothermograph", func(c *gin.Context) {
        var out api.Hygrothermograph
        out.Humidity = strconv.FormatInt(int64(rand.Intn(100)), 10)
        out.Temperature = strconv.FormatInt(int64(rand.Intn(100)), 10)
        c.JSON(200, &out)
    })
    
    if err := srv.Start(ctx); err != nil {
        panic(err)
    }
    
    defer func() {
        if err := srv.Stop(ctx); err != nil {
            t.Errorf("expected nil got %v", err)
        }
    }()
}
```

## FastHttp

[FastHTTP](https://github.com/valyala/fasthttp)是golang下的一个http框架，顾名思义，与原生的http实现相比，它的特点在于快，按照官网的说法，它的客户端和服务端性能比原生有了十倍的提升。

它的高性能主要源自于“复用”，通过服务协程和内存变量的复用，节省了大量资源分配的成本。

封装的代码如下：

```go
package fasthttp

import (
	"context"
	"crypto/tls"
	"net/http"
	"net/url"
	"time"

	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/transport"
	kHttp "github.com/go-kratos/kratos/v2/transport/http"
)

var (
	_ transport.Server     = (*Server)(nil)
	_ transport.Endpointer = (*Server)(nil)
)

type Server struct {
	*fasthttp.Server

	tlsConf  *tls.Config
	endpoint *url.URL
	timeout  time.Duration
	addr     string

	err error

	filters []FilterFunc
	ms      []middleware.Middleware
	dec     kHttp.DecodeRequestFunc
	enc     kHttp.EncodeResponseFunc
	ene     kHttp.EncodeErrorFunc

	strictSlash bool
	router      *router.Router
}

func NewServer(opts ...ServerOption) *Server {
	srv := &Server{
		timeout:     1 * time.Second,
		dec:         kHttp.DefaultRequestDecoder,
		enc:         kHttp.DefaultResponseEncoder,
		ene:         kHttp.DefaultErrorEncoder,
		strictSlash: true,
		router:      router.New(),
	}

	srv.init(opts...)

	return srv
}

func (s *Server) init(opts ...ServerOption) {
	for _, o := range opts {
		o(s)
	}

	s.Server = &fasthttp.Server{
		TLSConfig: s.tlsConf,
		Handler:   FilterChain(s.filters...)(s.router.Handler),
	}

	s.router.RedirectTrailingSlash = s.strictSlash

	s.endpoint, _ = url.Parse(s.addr)
}

func (s *Server) Endpoint() (*url.URL, error) {
	return s.endpoint, nil
}

func (s *Server) Start(ctx context.Context) error {
	log.Infof("[fasthttp] server listening on: %s", s.addr)

	var err error
	if s.tlsConf != nil {
		err = s.Server.ListenAndServeTLS(s.addr, "", "")
	} else {
		err = s.Server.ListenAndServe(s.addr)
	}
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	return nil
}

func (s *Server) Stop(_ context.Context) error {
	log.Info("[fasthttp] server stopping")
	return s.Server.Shutdown()
}

func (s *Server) Handle(method, path string, handler fasthttp.RequestHandler) {
	s.router.Handle(method, path, handler)
}

func (s *Server) GET(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodGet, path, handler)
}

func (s *Server) HEAD(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodHead, path, handler)
}

func (s *Server) POST(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodPost, path, handler)
}

func (s *Server) PUT(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodPut, path, handler)
}

func (s *Server) PATCH(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodPatch, path, handler)
}

func (s *Server) DELETE(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodDelete, path, handler)
}

func (s *Server) CONNECT(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodConnect, path, handler)
}

func (s *Server) OPTIONS(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodOptions, path, handler)
}

func (s *Server) TRACE(path string, handler fasthttp.RequestHandler) {
	s.Handle(fasthttp.MethodTrace, path, handler)
}
```

应用的代码如下：

```go
package fasthttp

import (
    "context"
    "encoding/json"
    "math/rand"
    "strconv"
    
    "github.com/valyala/fasthttp"
    transport "github.com/tx7do/kratos-transport/fasthttp"
    
    api "github.com/tx7do/kratos-transport/_example/api/protobuf"
)
    
func main() {
    ctx := context.Background()
    
    srv := transport.NewServer(
        WithAddress(":8800"),
    )
    
    srv.GET("/login/*param", func(c *fasthttp.RequestCtx) {
        _, _ = c.WriteString("Hello World!")
    })
    
    srv.GET("/hygrothermograph", func(c *fasthttp.RequestCtx) {
        var out api.Hygrothermograph
        out.Humidity = strconv.FormatInt(int64(rand.Intn(100)), 10)
        out.Temperature = strconv.FormatInt(int64(rand.Intn(100)), 10)
        _ = json.NewEncoder(c.Response.BodyWriter()).Encode(&out)
    })
    
    if err := srv.Start(ctx); err != nil {
        panic(err)
    }
    
    defer func() {
        if err := srv.Stop(ctx); err != nil {
            t.Errorf("expected nil got %v", err)
        }
    }()
}
```

## Hertz

[Hertz[həːts]](https://www.cloudwego.io/zh/docs/hertz/) 是一个 Golang 微服务 HTTP 框架，在设计之初参考了其他开源框架 fasthttp、gin、echo 的优势， 并结合字节跳动内部的需求，使其具有高易用性、高性能、高扩展性等特点，目前在字节跳动内部已广泛使用。 如今越来越多的微服务选择使用 Golang，如果对微服务性能有要求，又希望框架能够充分满足内部的可定制化需求，Hertz 会是一个不错的选择。

封装的代码如下：

```go
package hertz

import (
	"context"
	"crypto/tls"
	"net/url"
	"time"

	hertz "github.com/cloudwego/hertz/pkg/app/server"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/transport"
	kHttp "github.com/go-kratos/kratos/v2/transport/http"
)

var (
	_ transport.Server     = (*Server)(nil)
	_ transport.Endpointer = (*Server)(nil)
)

type Server struct {
	*hertz.Hertz

	tlsConf  *tls.Config
	endpoint *url.URL
	timeout  time.Duration
	addr     string

	err error

	filters []kHttp.FilterFunc
	ms      []middleware.Middleware
	dec     kHttp.DecodeRequestFunc
	enc     kHttp.EncodeResponseFunc
	ene     kHttp.EncodeErrorFunc
}

func NewServer(opts ...ServerOption) *Server {
	srv := &Server{
		timeout: 1 * time.Second,
		dec:     kHttp.DefaultRequestDecoder,
		enc:     kHttp.DefaultResponseEncoder,
		ene:     kHttp.DefaultErrorEncoder,
	}

	srv.init(opts...)

	return srv
}

func (s *Server) init(opts ...ServerOption) {
	for _, o := range opts {
		o(s)
	}

	s.Hertz = hertz.Default(hertz.WithHostPorts(s.addr), hertz.WithTLS(s.tlsConf))

	s.endpoint, _ = url.Parse(s.addr)
}

func (s *Server) Endpoint() (*url.URL, error) {
	return s.endpoint, nil
}

func (s *Server) Start(ctx context.Context) error {
	log.Infof("[hertz] server listening on: %s", s.addr)

	return s.Hertz.Run()
}

func (s *Server) Stop(ctx context.Context) error {
	log.Info("[hertz] server stopping")
	return s.Hertz.Shutdown(ctx)
}
```

应用的代码如下：

```go
package hertz

import (
    "context"
    "math/rand"
    "strconv"
    
    "github.com/cloudwego/hertz/pkg/app"
    transport "github.com/tx7do/kratos-transport/hertz"
    
    api "github.com/tx7do/kratos-transport/_example/api/protobuf"
)

func TestServer(t *testing.T) {
    ctx := context.Background()
    
    srv := transport.NewServer(
        WithAddress("127.0.0.1:8800"),
    )
    
    srv.GET("/login/*param", func(ctx context.Context, c *app.RequestContext) {
        if len(c.Params.ByName("param")) > 1 {
            c.AbortWithStatus(404)
            return
        }
        c.String(200, "Hello World!")
    })
    
    srv.GET("/hygrothermograph", func(ctx context.Context, c *app.RequestContext) {
        var out api.Hygrothermograph
        out.Humidity = strconv.FormatInt(int64(rand.Intn(100)), 10)
        out.Temperature = strconv.FormatInt(int64(rand.Intn(100)), 10)
        c.JSON(200, &out)
    })
    
    if err := srv.Start(ctx); err != nil {
        panic(err)
    }
    
    defer func() {
        if err := srv.Stop(ctx); err != nil {
            t.Errorf("expected nil got %v", err)
        }
    }()
}
```

## 参考资料

- [GIN - Github](https://github.com/gin-gonic/gin)
- [Gin - Website](https://gin-gonic.com/)
- [FastHTTP Github](https://github.com/valyala/fasthttp)
- [fasthttp：高性能背后的惨痛代价](https://cloud.tencent.com/developer/news/462918)
- [fasthttp性能真的比标准库http包好很多吗？一文告诉你真相！](https://zhuanlan.zhihu.com/p/367927669)
- [Hertz - Github](https://github.com/cloudwego/hertz)
- [Hertz - Docs](https://www.cloudwego.io/zh/docs/hertz/)
