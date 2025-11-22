# Kratos微服务框架下的认证和鉴权

从单体应用迁移到微服务架构，虽能收获松耦合、可扩展等诸多优势，但也引入了新的安全挑战。微服务通过开放 API 实现服务间通信，与单体应用相比：​

- 攻击面显著扩大：每个独立服务都需单独保障安全性，风险点呈指数级增加​
- 通信安全性要求更高：API 调用不仅要验证身份，还需保障传输安全与可用性​

因此，微服务架构需要一套与单体应用截然不同的安全解决方案，核心聚焦于认证（Authentication） 与鉴权（Authorization） 两大核心能力。

## 一、认证与鉴权的核心区别​

![认证和授权的区别](/assets/images/authn_vs_authz.jpg)

### 身份认证（Authentication）​

- 核心问题：**"你是谁？"​**
- 核心目标：验证用户身份的合法性，确认请求者是否为其声称的身份​
- 典型场景：用户登录时提交用户名密码、手机号验证码等凭证​

### 授权（Authorization）​

- 核心问题：**"你有什么权限？"​**
- 核心目标：在身份认证通过后，判断用户是否有权访问特定资源或执行特定操作​
- 典型场景：普通用户能否修改他人数据、管理员能否删除系统配置

## 二、微服务下的认证与鉴权策略选型​

| 架构模式 | 策略类型   |  核心特点   |
|-----|-------|-----|
|  无 API 网关   |  1.1 服务各自认证鉴权 | 耦合度高、重复开发、维护成本高 |
|   |  1.2 独立认证授权服务 | 认证鉴权集中化，但未解决 API 层统一拦截问题 |
| 有 API 网关  | 2.1 网关认证 + 服务鉴权  | 认证统一化，鉴权分散导致权限管理混乱 |
|   |  2.2 网关统一认证鉴权 | 性能高效，但网关压力过大，灵活性不足 |
|   |  2.3 独立认证服务 + 网关鉴权 | 认证与鉴权解耦，兼顾性能与灵活性（推荐） |

推荐策略：2.3 独立认证服务 + 网关鉴权​

选择该策略的核心原因：​

- **频率差异适配**：认证（如登录）是低频操作，独立部署可专注处理复杂身份校验；鉴权（如 API 调用）是高频操作，在网关层处理可降低服务响应延迟​
- **复杂度分离**：认证涉及用户凭证校验、令牌生成等特异性逻辑，独立服务便于定制化；鉴权规则（如 RBAC）具有通用性，网关层统一实现可减少重复开发

## 三、有状态 vs 无状态身份验证​

服务端识别客户端身份的两种核心模式，其本质区别在于是否存储客户端状态信息：​

### 有状态认证（Cookie-Session 模式）​

- 工作流程：客户端首次登录后，服务端生成 Session 并存储用户信息，返回 SessionID（通常通过 Cookie 传递）；后续请求客户端携带 SessionID，服务端查询 Session 确认身份​
- 优缺点：实现简单，但服务端需维护 Session 状态，扩展性差，不适合分布式部署​

### 无状态认证（Token 模式）​

- 工作流程：客户端登录后，服务端验证身份并生成加密 Token（如 JWT）返回；后续请求客户端携带 Token，服务端通过解密 Token 直接获取用户信息，无需存储状态​
- 优缺点：服务端无状态，扩展性强，适合微服务架构；需解决 Token 安全传输与失效管理问题​

## 四、技术实现方案​

结合 Kratos 框架特性，最终技术选型如下：​

- 微服务框架：[Kratos][1]（B 站开源，轻量、高可用、原生支持微服务生态）​
- 认证机制：[JWT][4]（无状态 Token，适合分布式环境）​
- 鉴权框架：[Casbin][3]（支持多权限模型，通用性强）

### 4.1 JWT：无状态认证的核心实现​

#### 什么是 JWT？​

JSON Web Token（JWT）是基于 RFC 7519 标准的轻量级令牌，用于在分布式系统中安全传递用户身份信息。其结构由三部分组成：​

- Header（头部）：指定令牌类型与加密算法​
- Payload（负载）：存储用户 ID、权限等核心信息（不建议存储敏感数据）​
- Signature（签名）：通过密钥对前两部分加密，防止篡改​

#### JWT 使用注意事项​

1. 默认不加密，敏感数据禁止存入 Payload​
2. 令牌有效期应设置较短（如 1 小时），通过刷新令牌机制延长会话​
3. 必须通过 HTTPS 传输，防止令牌被窃取​
4. 服务端无法主动废止已签发的令牌，需通过黑名单机制处理特殊场景（如用户登出）​
5. 可用于身份认证与数据交换，减少数据库查询次数

### 4.2 Casbin：通用鉴权框架​

#### 什么是 Casbin？​

Casbin 是一个开源访问控制框架，核心优势在于 **将权限模型与业务逻辑解耦**，支持 ACL、RBAC、ABAC 等多种权限模型，提供跨语言支持与灵活的规则配置。​

#### Casbin 的核心能力​

- ✅ 支持自定义请求格式（默认：`{主体(subject), 资源(object), 操作(action)}`）​
- ✅ 支持 RBAC 多层角色继承（用户与资源均可拥有角色）​
- ✅ 内置超级用户机制与路径匹配运算符（如`keyMatch`匹配`/foo/*`路径）​
- ❌ 不负责身份认证（需与 JWT 等认证机制配合）​
- ❌ 不管理用户 / 角色列表（仅存储用户 - 角色映射关系）

### 4.3 Kratos 框架下的落地实现​

Kratos 通过中间件机制实现认证与鉴权的统一拦截，以下是完整实现步骤：

#### 第一步：定义 SecurityUser 结构体​

用于封装 JWT 令牌信息与 Casbin 鉴权所需的核心数据（主体、资源、操作）：

```go
const (
    ClaimAuthorityId = "authorityId" // JWT负载中存储权限ID的字段
)

// SecurityUser 实现认证鉴权所需的用户信息接口
type SecurityUser struct {
    Path        string // 访问的资源路径（对应API操作名）
    Method      string // 请求方法（*表示所有方法）
    AuthorityId string // 用户权限ID（如admin/moderator）
}

// NewSecurityUser 创建SecurityUser实例
func NewSecurityUser() authzM.SecurityUser {
    return &SecurityUser{}
}

// ParseFromContext 从上下文解析JWT信息与请求信息
func (su *SecurityUser) ParseFromContext(ctx context.Context) error {
    // 从上下文获取JWT负载
    if claims, ok := jwt.FromContext(ctx); ok {
        su.AuthorityId = claims.(jwtV4.MapClaims)[ClaimAuthorityId].(string)
    } else {
        return errors.New("jwt claim missing")
    }

    // 从上下文获取请求操作信息
    if header, ok := transport.FromServerContext(ctx); ok {
        su.Path = header.Operation() // Kratos中API操作名（如/admin.v1.AdminService/Login）
        su.Method = "*"
    } else {
        return errors.New("request header missing")
    }
    
    return nil
}

// 以下方法实现authzM.SecurityUser接口，提供Casbin所需的三元组信息
func (su *SecurityUser) GetSubject() string { return su.AuthorityId } // 主体（用户权限ID）
func (su *SecurityUser) GetObject() string  { return su.Path }        // 资源（API操作名）
func (su *SecurityUser) GetAction() string  { return su.Method }      // 操作（请求方法）
```

#### 第二步：实现 JWT 认证中间件​

##### 1. 创建白名单匹配器（免认证接口）​

```go
// NewWhiteListMatcher 定义无需认证鉴权的API操作名
func NewWhiteListMatcher() selector.MatchFunc {
    whiteList := map[string]bool{
        "/admin.v1.AdminService/Login": true, // 登录接口免认证
    }
    // 返回匹配函数：白名单内的操作返回false（跳过中间件）
    return func(ctx context.Context, operation string) bool {
        return !whiteList[operation]
    }
}
```

##### 2. 构建 JWT 中间件​

```go
// NewAuthMiddleware 创建JWT认证中间件
func NewAuthMiddleware(logger log.Logger, apiKey string) http.ServerOption {
    return http.Middleware(
        recovery.Recovery(),       // 异常恢复中间件
        tracing.Server(),          // 链路追踪中间件
        logging.Server(logger),    // 日志中间件
        // 选择性应用JWT中间件（白名单接口跳过）
        selector.Server(
            jwt.Server(
                // JWT密钥验证函数
                func(token *jwtV4.Token) (interface{}, error) {
                    return []byte(apiKey), nil
                },
                jwt.WithSigningMethod(jwtV4.SigningMethodHS256), // 指定HS256加密算法
            ),
        ).Match(NewWhiteListMatcher()).Build(),
    )
}
```

##### 3. 注册中间件​

```go
// 服务启动选项配置
var opts = []http.ServerOption{
    NewAuthMiddleware(logger, ac.ApiKey), // 注册JWT认证中间件
    // CORS跨域配置
    http.Filter(handlers.CORS(
        handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
        handlers.AllowedOrigins([]string{"*"}),
    )),
}
```

##### 4. 前端 Token 传递方式​

前端需在 HTTP 请求头中携带 JWT 令牌，格式为`Bearer {Token}`：​

```typescript
// 生成认证请求头
export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = userStr ? JSON.parse(userStr) : null;
  
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}
```

#### 第三步：实现 Casbin 鉴权中间件​

##### 1. 配置 Casbin 模型与策略​

###### 模型文件（authz_model.conf）：定义 RBAC 权限模型

```ini
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && r.act == p.act
```

###### 策略文件（authz_policy.csv）：定义具体权限规则​

```csv
p, ROLE_ADMIN, /admin.v1.AdminService/*, *
p, ROLE_MODERATOR, /admin.v1.AdminService/ListUsers, *
g, admin, ROLE_ADMIN
g, moderator, ROLE_MODERATOR
```

##### 2. 构建 Casbin 中间件​

```go
// NewAuthzMiddleware 创建Casbin鉴权中间件
func NewAuthzMiddleware(logger log.Logger) http.ServerOption {
    // 从文件加载Casbin模型与策略
    model, _ := model.NewModelFromFile("../../configs/authz/authz_model.conf")
    adapter := fileAdapter.NewAdapter("../../configs/authz/authz_policy.csv")
    
    return http.Middleware(
        recovery.Recovery(),
        tracing.Server(),
        logging.Server(logger),
        // 选择性应用鉴权中间件（白名单接口跳过）
        selector.Server(
            casbinM.Server(
                casbinM.WithCasbinModel(model),          // 注入Casbin模型
                casbinM.WithCasbinPolicy(adapter),      // 注入权限策略
                casbinM.WithSecurityUserCreator(NewSecurityUser), // 注入用户信息构造器
            ),
        ).Match(NewWhiteListMatcher()).Build(),
    )
}
```

##### 3. 注册鉴权中间件​

在 HTTP 服务选项中添加 Casbin 中间件（需在 JWT 中间件之后）：​

```go
var opts = []http.ServerOption{
    NewAuthMiddleware(logger, ac.ApiKey),   // 先认证
    NewAuthzMiddleware(logger),             // 后鉴权
    // ...其他中间件
}
```

#### 第四步：实现登录接口（生成 JWT 令牌）​

```go
func (s *AdminService) Login(_ context.Context, req *v1.LoginReq) (*v1.User, error) {
    // 1. 验证用户名密码（实际场景需查询数据库）
    if req.UserName == "" || req.Password == "" {
        return nil, errors.New("invalid username or password")
    }

    // 2. 分配用户角色
    var roles []string
    switch req.UserName {
    case "admin":
        roles = append(roles, "ROLE_ADMIN")
    case "moderator":
        roles = append(roles, "ROLE_MODERATOR")
    default:
        return nil, errors.New("user not found")
    }

    // 3. 生成JWT令牌
    securityUser := &SecurityUser{AuthorityId: req.UserName}
    token := securityUser.CreateAccessJwtToken([]byte(s.apiKey))

    // 4. 返回用户信息与令牌
    id := uint64(10)
    email := "hello@kratos.com"
    return &v1.User{
        Id:       &id,
        UserName: &req.UserName,
        Token:    &token,
        Email:    &email,
        Roles:    roles,
    }, nil
}
```

## 五、整体流程梳理​

### 1. 登录流程​

前端提交用户名密码 → 登录接口验证身份 → 生成 JWT 令牌 → 返回给前端 → 前端存储令牌（localStorage）​

### 2. 正常请求流程​

- 前端携带 JWT 令牌发起请求 → API 网关拦截请求​
- JWT 中间件验证令牌有效性 → 解析用户信息存入上下文​
- Casbin 中间件从上下文提取用户 / 资源 / 操作信息 → 校验权限​
- 权限通过 → 转发请求到业务服务；权限拒绝 → 返回 403 错误​

## 六、技术栈总结​

| 技术组件 | 核心作用   | 
|-----|-------|
|[Golang][2]|后端开发语言|
|[React][5]|前端开发框架|
|[Kratos][1]|微服务框架（提供中间件、服务治理能力）|
|[Consul][6]|服务发现与配置中心|
|[Jaeger][7]|分布式链路追踪|
|[JWT][4]|无状态身份认证令牌|
|[Casbin][3]|通用权限控制框架|

## 七、开源示例代码

- Casbin 中间件封装 [Kratos Casbin](https://github.com/tx7do/kratos-casbin)
- 权鉴中间件封装 [Kratos Authz](https://github.com/tx7do/kratos-authz)
- 完整示例项目 [Kratos Examples](https://github.com/tx7do/kratos-examples/tree/main/casbin)

[1]: <https://go-kratos.dev/>
[2]: <https://go.dev/>
[3]: <https://casbin.org/>
[4]: <https://jwt.io/>
[5]: <https://reactjs.org/docs/getting-started.html>
[6]: <https://www.consul.io/>
[7]: <https://www.jaegertracing.io/>
