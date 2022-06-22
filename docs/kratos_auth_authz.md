# Kratos微服务框架下的认证和鉴权

从单体应用到微服务架构，优势很多，但是并不是代表着就没有一点缺点了。

微服务架构，意味着每个服务都是松散耦合的。因此，作为软件工程师和架构师，我们在分布式架构中面临着安全挑战。微服务对外开放的端点，我们称之为：API。

* 单体应用只需要保护自己就可以了，而微服务的攻击面则很大，这意味着越多的服务将会带来更大的风险，每个服务都得保证其安全性。
* 在单体架构中，组件之间通过方法来相互调用。而微服务则是依靠开放的API来相互调用，除了要保证其安全性，还得保障其可用性。

因此，根据上述的安全挑战，我们可以得出一个结论：微服务与单体应用有着不同的安全处理方式。

## 认证和授权的区别

我们在谈论应用程序安全的时候，总是会提到：认证 （Authentication）和 鉴权 （Authorization）这两个术语。但是，总有人很容易混淆概念。

![认证和授权的区别](/assets/images/authn_vs_authz.jpg)

在 **身份验证（Authentication）** 的过程当中，我们需要检查用户的身份以提供对系统的访问。在这个过程当中验证的是 **“你是谁？”** 。故而，用户需要提供登陆所需的详细信息以供身份的验证。

**授权（Authorization）** ，是通过了身份验证之后的用户，系统是否授权给他访问特定信息（读）或者执行特定的操作（写）的过程。此过程确定了 **用户拥有哪些权限**。

## 微服务下的认证和授权策略

我可以想到的解决方案有以下这么几种：

1. 无API网关
1.1 每个服务各自为政，各自进行认证和鉴权
1.2 拆分出 **认证授权服务** 进行全局的认证和鉴权
1. 有API网关
2.1 在网关上进行全局的认证，每个服务各自鉴权
2.2 在网关上进行全局的认证和鉴权
2.3 拆分出 **认证服务** 进行全局的认证，在网关上进行鉴权

我比较推崇 2.3 这种策略，为什么呢？

1. 认证对于鉴权来说，是频度较低的服务：登陆不常有，鉴权则发生在每一个API调用上；
2. 往往认证会相对复杂，具有特异性，难以做到通用化。而鉴权不会特别复杂，容易做到通用化。

## 有状态和无状态身份验证

当一个设备（客户端）向一个设备（服务端）发送请求的时候，服务端如何判断这个客户端是谁？传统意义上的认证方式又两种：**有状态认证**、**无状态认证**。有状态认证和无状态认证**最大的区别**就是**服务器会不会保存客户端的信息**。

### 有状态身份验证

有状态认证，以cookie-session模型为例，当客户端第一次请求服务端的时候，服务端会返回客户端一个唯一的标识（默认在cookie中），并保存对应的客户端信息，客户端接受到唯一标识之后，将标识保存到本地cookie中，以后的每次请求都携带此cookie，服务器根据此cookie标识就可以判断请求的用户是谁，然后查到对应用户的信息。

### 无状态身份验证

无状态的认证，客户端在提交身份信息，服务端验证身份后，根据一定的算法生成一个token令牌返回给客户端，之后每次请求服务端，客户端都需要携带此令牌，服务器接受到令牌之后进行校验，校验通过后，提取令牌的信息用来区别用户。

## 开始实施

在具体的技术选择上：

* 微服务框架使用[Kratos](https://go-kratos.dev/)；
* 认证使用[JWT](https://jwt.io/)；
* 鉴权使用[Casbin](https://casbin.org/)。

### JWT

在微服务架构下，无状态的身份验证是更为合适的方式，其中以 [JWT](https://jwt.io/) 为代表，最为流行。

#### [什么是JWT？](https://www.jianshu.com/p/576dbf44b2ae)

**Json web token (JWT)**, 是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准 [RFC 7519](https://tools.ietf.org/html/rfc7519) 该token被设计为紧凑且安全的，特别适用于分布式站点的 [单点登录（SSO）](https://en.wikipedia.org/wiki/Single_sign-on) 场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。

#### [JWT需要注意的点](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

1. JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。
2. JWT 不加密的情况下，不能将秘密数据写入 JWT。
3. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
4. JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
5. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
6. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

### Casbin

Casbin 根本上是依托规则引擎做的软件设计，抽取出来的模型可以做到通用化，能够轻松的使用多种不同的控制模型：ACL, RBAC, ABAC等。

#### [什么是Casbin？](https://casbin.org/docs/zh-CN/overview)

**Casbin**是一个强大的、高效的开源访问控制框架，其权限管理机制支持多种访问控制模型。目前这个框架的生态已经发展的越来越好了。提供了各种语言的类库，自定义的权限模型语言，以及模型编辑器。

#### Casbin 可以

1. 支持自定义请求的格式，默认的请求格式为`{subject, object, action}`。
2. 具有访问控制模型model和策略policy两个核心概念。
3. 支持RBAC中的多层角色继承，不止主体可以有角色，资源也可以具有角色。
4. 支持内置的超级用户 例如：`root` 或 `administrator`。超级用户可以执行任何操作而无需显式的权限声明。
5. 支持多种内置的操作符，如 `keyMatch`，方便对路径式的资源进行管理，如 `/foo/bar` 可以映射到 `/foo*`

#### Casbin 不能

1. 身份认证 authentication（即验证用户的用户名和密码），Casbin 只负责访问控制。应该有其他专门的组件负责身份认证，然后由 Casbin 进行访问控制，二者是相互配合的关系。
2. 管理用户列表或角色列表。 Casbin 认为由项目自身来管理用户、角色列表更为合适， 用户通常有他们的密码，但是 Casbin 的设计思想并不是把它作为一个存储密码的容器。 而是存储RBAC方案中用户和角色之间的映射关系。

### Kratos

Kratos是B站开源出来的一个微服务框架，我在做技术选型的时候，横向的对比了市面上的主流几款微服务架构，总结下来，还是Kratos更加适合我使用，于是就选择了它。

Kratos的认证和权鉴都是依托中间件来实现的。认证方面，Kratos官方已经支持了[Jwt中间件](https://github.com/go-kratos/kratos/tree/main/middleware/auth/jwt) 。鉴权方面，Kratos官方还没有对此的支持，于是我就自己简单的实现了一个[Casbin中间件](https://github.com/tx7do/kratos-casbin) ，简单封装，足够使用就是了。

#### 实现SecurityUser

`SecurityUser`用于创建Jwt的令牌，以及后面Casbin解析和存取权鉴相关的数据，需要实现它。

并且实现一个`SecurityUserCreator`注册进中间件。

```go
const (
    ClaimAuthorityId = "authorityId"
)

type SecurityUser struct {
    Path        string
    Method      string
    AuthorityId string
}

func NewSecurityUser() authzM.SecurityUser {
    return &SecurityUser{}
}

func (su *SecurityUser) ParseFromContext(ctx context.Context) error {
    if claims, ok := jwt.FromContext(ctx); ok {
        su.AuthorityId = claims.(jwtV4.MapClaims)[ClaimAuthorityId].(string)
    } else {
        return errors.New("jwt claim missing")
    }

    if header, ok := transport.FromServerContext(ctx); ok {
        su.Path = header.Operation()
        su.Method = "*"
    } else {
        return errors.New("jwt claim missing")
    }
    
    return nil
}

func (su *SecurityUser) GetSubject() string {
    return su.AuthorityId
}

func (su *SecurityUser) GetObject() string {
    return su.Path
}

func (su *SecurityUser) GetAction() string {
    return su.Method
}

func (su *SecurityUser) CreateAccessJwtToken(secretKey []byte) string {
    claims := jwtV4.NewWithClaims(jwtV4.SigningMethodHS256,
    jwtV4.MapClaims{
        ClaimAuthorityId: su.AuthorityId,
    })
    
    signedToken, err := claims.SignedString(secretKey)
    if err != nil {
        return ""
    }
    
    return signedToken
}

func (su *SecurityUser) ParseAccessJwtTokenFromContext(ctx context.Context) error {
    claims, ok := jwt.FromContext(ctx)
    if !ok {
        return errors.New("no jwt token in context")
    }
    if err := su.ParseAccessJwtToken(claims); err != nil {
        return err
    }
    return nil
}

func (su *SecurityUser) ParseAccessJwtTokenFromString(token string, secretKey []byte) error {
    parseAuth, err := jwtV4.Parse(token, func(*jwtV4.Token) (interface{}, error) {
        return secretKey, nil
    })
    if err != nil {
        return err
    }

    claims, ok := parseAuth.Claims.(jwtV4.MapClaims)
    if !ok {
        return errors.New("no jwt token in context")
    }
    
    if err := su.ParseAccessJwtToken(claims); err != nil {
        return err
    }
    
    return nil
}

func (su *SecurityUser) ParseAccessJwtToken(claims jwtV4.Claims) error {
    if claims == nil {
        return errors.New("claims is nil")
    }
    
    mc, ok := claims.(jwtV4.MapClaims)
    if !ok {
        return errors.New("claims is not map claims")
    }
    
    strAuthorityId, ok := mc[ClaimAuthorityId]
    if ok {
        su.AuthorityId = strAuthorityId.(string)
    }
    
    return nil
}
```

#### JWT中间件

##### 创建白名单

在白名单下的API将会被忽略认证和权限验证

**需要注意的是**：这里面注册的是 **操作名（operation）**，而非是API的Path。具体的操作名是什么，可以在Protoc生成的 `*_grpc.pb.go` 和 `*_http.pb.go` 找到。

```go
// NewWhiteListMatcher 创建白名单
func NewWhiteListMatcher() selector.MatchFunc {
    whiteList := make(map[string]bool)
    whiteList["/admin.v1.AdminService/Login"] = true
    return func(ctx context.Context, operation string) bool {
            if _, ok := whiteList[operation]; ok {
            return false
        }
        return true
    }
}
```

##### 创建中间件

```go
// NewMiddleware 创建中间件
func NewMiddleware(logger log.Logger) http.ServerOption {
    return http.Middleware(
        recovery.Recovery(),
        tracing.Server(),
        logging.Server(logger),
        selector.Server(
            jwt.Server(
                func(token *jwtV4.Token) (interface{}, error) {
                    return []byte(ac.ApiKey), nil
                },
                jwt.WithSigningMethod(jwtV4.SigningMethodHS256),
            ),
        ).
        Match(NewWhiteListMatcher()).Build(),
    )
}
```

##### 注册中间件

```go
var opts = []http.ServerOption{
    NewMiddleware(logger),
    http.Filter(handlers.CORS(
    handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
    handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
    handlers.AllowedOrigins([]string{"*"}),
    )),
}
```

##### 前端发送Token

前端只需要在HTTP的Header里面加入以下数据即可：

| 键  | 值                  |
|-----|--------------------|
|  Authorization   | Bearer {JWT Token} |

```typescript
export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
```

#### Casbin中间件

Casbin的模型和策略配置读取，我简化的使用了读取本地配置文件。

通常来说，模型文件变化不大，放本地配置文件或者直接硬代码都没问题。变化的通常都是策略配置，通常做法都是放置在数据库里面，方便通过后台去进行编辑改变。

```go
// NewMiddleware 创建中间件
func NewMiddleware(ac *conf.Auth, logger log.Logger) http.ServerOption {
    m, _ := model.NewModelFromFile("../../configs/authz/authz_model.conf")
    a := fileAdapter.NewAdapter("../../configs/authz/authz_policy.csv")

    return http.Middleware(
        recovery.Recovery(),
        tracing.Server(),
        logging.Server(logger),
        selector.Server(
            casbinM.Server(
                casbinM.WithCasbinModel(m),
                casbinM.WithCasbinPolicy(a),
                casbinM.WithSecurityUserCreator(myAuthz.NewSecurityUser),
            ),
        ).
            Match(NewWhiteListMatcher()).Build(),
    )
}
```

### 开始登陆吧

```go
func (s *AdminService) Login(_ context.Context, req *v1.LoginReq) (*v1.User, error) {
    fmt.Println("Login", req.UserName, req.Password)

    var id uint64 = 10
    var email = "hello@kratos.com"
    var roles []string

    switch req.UserName {
    case "admin":
        roles = append(roles, "ROLE_ADMIN")
    case "moderator":
        roles = append(roles, "ROLE_MODERATOR")
    }

    var securityUser myAuthz.SecurityUser
    securityUser.AuthorityId = req.GetUserName()

    token := securityUser.CreateAccessJwtToken([]byte(s.auth.GetApiKey()))

    return &v1.User{
        Id:       &id,
        UserName: &req.UserName,
        Token:    &token,
        Email:    &email,
        Roles:    roles,
    }, nil
}
```

### 流程简要说明

1. 前端发送登陆请求
2. 登陆请求处理
2.1 验证用户名密码
2.2 `securityUser.CreateAccessJwtToken`生成Jwt的Token
2.3 返回token给前端
3. 其他正常的请求
3.1 Jwt中间件进行令牌进行认证信息校验
3.2 Casbin中间件解析Jwt中间件的Payload信息，根据用户信息以及操作名进行权鉴。

## 技术栈

* [Golang](https://go.dev/)
* [React](https://reactjs.org/docs/getting-started.html)
* [Kratos](https://go-kratos.dev/)
* [Consul](https://www.consul.io/)
* [Jaeger](https://www.jaegertracing.io/)
* [JWT](https://jwt.io/)
* [Casbin](https://casbin.org/)

## 实例代码

* [Kratos Casbin](https://github.com/tx7do/kratos-casbin)
* [Kratos Examples](https://github.com/tx7do/kratos-examples/tree/main/casbin)
