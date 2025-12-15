# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：Casbin集成指南

GoWind Admin（风行）作为开箱即用的企业级前后端一体中后台框架，致力于解决中后台系统开发中的通用问题，而权限管理作为中后台系统的核心安全能力，是框架设计的重中之重。Casbin 作为一款功能强大、灵活易用的开源访问控制框架，能够完美适配 GoWind Admin 的权限管理需求。本文将详细讲解 Casbin 的核心原理、配置规则，并完整呈现其在 GoWind Admin 中的集成流程与最佳实践。

## 一、Casbin 简介：企业级权限管理的优选方案

Casbin（<https://github.com/casbin/casbin>）是一款专注于访问控制的开源库，核心目标是帮助复杂系统解决权限管理的灵活性与安全性难题，也是国内开源项目中的优秀代表。其最大优势在于采用**元模型设计思想**，不局限于固定的权限模型，而是支持 ACL（访问控制列表）、RBAC（基于角色访问控制）、ABAC（基于属性访问控制）、RESTful 等多种经典访问控制模型，同时允许开发者根据业务需求自定义权限规则，具备极强的扩展性。
凭借卓越的设计与稳定性，Casbin 已获得全球众多企业的认可：Intel、IBM、腾讯云、VMware、RedHat、T-Mobile 等企业将其用于开源项目，Cisco、Verizon 等企业在闭源系统中采用。项目由北京大学罗杨博士于 2017 年 4 月发起，罗杨博士长期深耕云计算访问控制领域，发表数十篇相关学术论文，并在 ICWS、IEEE CLOUD、ICICS 等顶级学术会议宣讲研究成果，Casbin 正是其学术研究与工程实践结合的核心产物。

Casbin 最初基于 Go 语言开发，目前已扩展至 Java、Node.js、Javascript(React)、Python、PHP、.NET、Delphi、Rust 等多种语言，主项目在 GitHub 上已积累 1.3w+ Stars，拥有上百人的稳定维护团队，持续迭代优化，生态日趋完善。

## 二、深入理解 Casbin 核心机制

Casbin 的权限判定逻辑可概括为「根据预设规则，校验访问请求是否合法」，其核心由三大概念构成，三者协同完成权限判定，在 Casbin 官方提供的 [交互式解释器][3] 中可直观查看运行过程（该工具支持在线测试模型与策略，是学习与调试的必备工具）。

### 2.1 三大核心概念（宏观视角）

1. **请求（Request）**：用户发起的访问申请，即「谁（用户）想对什么（资源）做什么（操作）」。
2. **模型（Model）**：权限判定的规则模板，定义了「如何判断请求是否合法」，相当于权限系统的「判定手册」。
3. **策略（Policy）**：具体的权限分配数据，定义了「谁拥有对什么资源的什么操作权限」，相当于权限系统的「权限清单」。

举个通俗示例：用户 Bob 发起 HTTP GET 请求访问 `/users` 接口（请求）；系统采用 RBAC 模型，规则定义为「超级用户可访问所有资源」（模型）；策略中明确「Bob 属于超级用户角色」（策略）。Casbin 依据模型规则校验请求与策略的匹配关系，最终判定 Bob 有权访问该接口。

### 2.2 请求的核心构成（微观视角）

任何权限请求都可抽象为一个「三元组」（基础款），复杂场景可扩展为「四元组」（增加域/租户维度）：

1. **访问实体（Subject）**：发起访问的主体，通常是用户、角色、服务账号等。
2. **访问资源（Object）**：被访问的目标，如接口路径、数据库表、文件路径等。
3. **访问方法（Action）**：对资源执行的操作，如 HTTP 方法（GET/POST/PUT/DELETE）、数据库操作（增删改查）等。
4. **访问域（Domain）**：可选维度，用于多租户/多组织场景，区分不同域下的资源权限。

Casbin 通过 `Enforcer.Enforce` 方法接收上述参数并执行判定，例如上述示例的调用形式为：`Enforcer.Enforce("Bob", "/users", "GET")`。

## 三、Casbin 核心配置解析

Casbin 的运行依赖「模型」与「策略」两大配置：模型定义权限判定的规则模板（静态配置，一般不常变动），策略定义具体的权限分配（动态配置，需根据业务场景动态更新，通常持久化到数据库）。

### 3.1 模型配置（Access Control Model）

模型通过配置文件定义，采用 INI 格式，核心包含五部分（其中角色定义为 RBAC 模型专用，可选）。下面以 GoWind Admin 默认集成的 RBAC 模型为例，逐部分解析：

```ini
# 请求定义：指定 Enforce 方法的参数顺序与名称
[request_definition]
r = sub, obj, act, dom  # 四元组：主体、资源、操作、域

# 策略定义：指定权限规则的字段顺序与名称
[policy_definition]
p = sub, obj, act, dom  # 与请求定义对应，可增加 eft（allow/deny）字段指定权限类型

# 角色定义：RBAC 模型专用，定义用户与角色的映射关系
[role_definition]
g = _, _, _  # 前两个参数：用户→角色；第三个参数：域（可选，多租户场景）

# 策略效果：定义多个匹配规则的组合逻辑
[policy_effect]
e = some(where (p.eft == allow))  # 存在任意一条允许规则即判定为通过

# 匹配器定义：定义请求与策略的匹配规则
[matchers]
m = g(r.sub, p.sub, r.dom) && keyMatch2(r.obj, p.obj) && (regexMatch(r.act, p.act) || p.act == 'ANY') && (keyMatch(r.dom, p.dom) || p.dom == '*')
# 解析：用户角色匹配 && 资源路径匹配（支持通配符） && 操作匹配（支持正则/任意操作） && 域匹配（支持通配符/任意域）
```

### 3.1.1 各部分详细说明

1. **请求定义（Request Definition）** 用于绑定 `Enforcer.Enforce` 方法的入参，格式为 `r = 参数1, 参数2, ...`。基础场景用三元组（sub, obj, act），多租户场景需增加 dom（域）参数，形成四元组。示例（基础三元组）：`r = sub, obj, act`
2. **策略定义（Policy Definition）** 定义权限规则的字段结构，格式为 `p = 字段1, 字段2, ...`，字段顺序需与请求定义对应。可选增加 `eft` 字段（取值为 allow/deny），用于明确规则是「允许」还是「拒绝」（默认为 allow）。示例（含 eft 字段）：`p = eft, sub, obj, act`
3. **匹配器定义（Matcher）** 核心规则，定义请求（r）与策略（p）的匹配逻辑，支持多种内置函数：`g(r.sub, p.sub)`：校验用户（r.sub）是否拥有策略中的角色（p.sub）；
4. `keyMatch2(r.obj, p.obj)`：支持路径通配符匹配（如 `/user/:id` 可匹配 `/user/123`）；
5. `regexMatch(r.act, p.act)`：支持正则匹配操作（如 `GET|POST` 可匹配 `GET` 或 `POST` 方法）；
6. `keyMatch(r.dom, p.dom)`：域匹配，支持通配符。
7. **策略效果（Policy Effect）** 当存在多条策略规则时，定义最终的判定逻辑，支持多种逻辑表达式：`some(where (p.eft == allow))`：存在任意一条允许规则即通过（默认常用）；
8. `all(where (p.eft == allow))`：所有规则均为允许才通过；
9. `some(where (p.eft == deny)) && !some(where (p.eft == allow))`：存在拒绝规则且无允许规则时拒绝。
10. **角色定义（Role Definition）** RBAC 模型专用，定义用户与角色的映射关系，格式为 `g = _, _, _`：二元组`（g = _, _）`：适用于单租户场景，如 `g, alice, admin` 表示 `alice` 是 `admin` 角色；
11. 三元组（g = _, _, _）：适用于多租户场景，如 `g, alice, admin, tenant1` 表示 `alice` 在 `tenant1` 域下是 `admin` 角色。

### 3.2 策略配置（Policy Document）

策略是根据模型定义生成的具体权限规则，采用 CSV 格式（或存储在数据库中），每条规则对应一条权限分配记录。规则字段顺序需与模型中 `policy_definition` 的定义完全一致。

#### 3.2.1 基础示例（RBAC 模型）

```csv
# 格式：p, 主体（用户/角色）, 资源, 操作, 域（可选）
# 角色权限规则：admin 角色可访问所有资源（通配符 *）的所有操作
p, admin, *, *, *
# 用户角色映射：alice 属于 admin 角色（多租户域 tenant1）
g, alice, admin, tenant1
# 普通用户规则：bob 可访问 /users 接口的 GET 方法（域 tenant2）
p, bob, /users, GET, tenant2
```

#### 3.2.2 核心说明

- 策略主体（sub）可是用户或角色：直接给用户分配权限（直连授权）或给角色分配权限（角色授权，推荐，符合 RBAC 思想）；
- 资源（obj）与操作（act）支持通配符 `*`：`*` 表示任意资源/操作；
- 多租户场景必须指定域（dom）：通过域隔离不同租户的权限，避免权限泄露；
- 策略持久化：实际项目中，策略规则不会存储在 CSV 文件中，而是持久化到 MySQL、PostgreSQL 等数据库，便于动态更新与管理。

## 四、Casbin 集成 GoWind Admin 完整步骤

GoWind Admin 已将 Casbin 封装至 <github.com/tx7do/kratos-authz> 组件中，开发者无需重复实现核心逻辑，只需按以下步骤完成集成与配置即可。

### 4.1 核心封装：Authorizer 权限管理器

首先，在 `app/admin/service/internal/data/authorizer.go` 中实现权限管理器，封装 Casbin 引擎的初始化、策略重置等核心逻辑：

```go
// app/admin/service/internal/data/authorizer.go

package data

import (
	"context"
	"errors"

	"github.com/go-kratos/kratos/v2/log"

	authzEngine "github.com/tx7do/kratos-authz/engine"
	"github.com/tx7do/kratos-authz/engine/casbin"
	"github.com/tx7do/kratos-authz/engine/noop"

	pagination "github.com/tx7do/go-crud/api/gen/go/pagination/v1"
	"github.com/tx7do/go-utils/trans"
	conf "github.com/tx7do/kratos-bootstrap/api/gen/go/conf/v1"

	"go-wind-admin/app/admin/service/cmd/server/assets"

	adminV1 "go-wind-admin/api/gen/go/admin/service/v1"
	userV1 "go-wind-admin/api/gen/go/user/service/v1"
)

// Authorizer 权限管理器
type Authorizer struct {
	log *log.Helper

	roleRepo        *RoleRepo
	apiResourceRepo *ApiResourceRepo

	engine authzEngine.Engine
}

func NewAuthorizer(
	logger log.Logger,
	cfg *conf.Bootstrap,
	roleRepo *RoleRepo,
	apiResourceRepo *ApiResourceRepo,
) *Authorizer {
	a := &Authorizer{
		log:             log.NewHelper(log.With(logger, "module", "authorizer/repo/admin-service")),
		roleRepo:        roleRepo,
		apiResourceRepo: apiResourceRepo,
	}

	a.init(cfg)

	return a
}

func (a *Authorizer) init(cfg *conf.Bootstrap) {
	a.engine = a.newEngine(cfg)

	if err := a.ResetPolicies(context.Background()); err != nil {
		a.log.Errorf("reset policies error: %v", err)
	}
}

func (a *Authorizer) newEngine(cfg *conf.Bootstrap) authzEngine.Engine {
	if cfg.Authz == nil {
		return nil
	}

	ctx := context.Background()

	switch cfg.GetAuthz().GetType() {
	default:
		fallthrough
	case "noop":
		state, err := noop.NewEngine(ctx)
		if err != nil {
			a.log.Errorf("new noop engine error: %v", err)
			return nil
		}
		return state

	case "casbin":
		state, err := casbin.NewEngine(ctx)
		if err != nil {
			a.log.Errorf("init casbin engine error: %v", err)
			return nil
		}
		return state
	}
}

func (a *Authorizer) Engine() authzEngine.Engine {
	return a.engine
}

// ResetPolicies 重置策略
func (a *Authorizer) ResetPolicies(ctx context.Context) error {
	//a.log.Info("*******************reset policies")

	roles, err := a.roleRepo.List(ctx, &pagination.PagingRequest{NoPaging: trans.Ptr(true)})
	if err != nil {
		a.log.Errorf("failed to list roles: %v", err)
		return err
	}

	if roles == nil || len(roles.Items) < 1 {
		a.log.Warnf("no roles found to set policies")
		return nil // No roles to set policies
	}

	apis, err := a.apiResourceRepo.List(ctx, &pagination.PagingRequest{NoPaging: trans.Ptr(true)})
	if err != nil {
		a.log.Errorf("failed to list APIs: %v", err)
		return err
	}

	if apis == nil || len(apis.Items) < 1 {
		a.log.Warnf("no APIs found to set policies for roles")
		return nil // No APIs to set policies
	}

	//a.log.Debugf("roles [%d] apis [%d]", len(roles.Items), len(apis.Items))

	var policies authzEngine.PolicyMap

	switch a.engine.Name() {
	case "casbin":
		if policies, err = a.generateCasbinPolicies(roles, apis); err != nil {
			a.log.Errorf("generate casbin policies error: %v", err)
			return err
		}

	case "noop":
		return nil

	default:
		a.log.Warnf("unknown engine name: %s", a.engine.Name())
		return errors.New("unknown authz engine name")
	}

	//a.log.Debugf("***************** policy rules len: %v", len(rules))

	if err = a.engine.SetPolicies(context.Background(), policies, nil); err != nil {
		a.log.Errorf("set policies error: %v", err)
		return err
	}
	a.log.Infof("Reloaded policy rules")

	return nil
}

// generateCasbinPolicies 生成 Casbin 策略
func (a *Authorizer) generateCasbinPolicies(roles *userV1.ListRoleResponse, apis *adminV1.ListApiResourceResponse) (authzEngine.PolicyMap, error) {
	var rules []casbin.PolicyRule
	apiSet := make(map[uint32]struct{})

	domain := "*"

	for _, role := range roles.Items {
		if role.GetId() == 0 {
			continue // Skip if role or API ID is not set
		}

		for _, apiId := range role.GetApis() {
			apiSet[apiId] = struct{}{}
		}

		for _, api := range apis.Items {
			if api.GetId() == 0 {
				continue // Skip if role or API ID is not set
			}

			if _, exists := apiSet[api.GetId()]; exists {
				rules = append(rules, casbin.PolicyRule{
					PType: "p",
					V0:    role.GetCode(),
					V1:    api.GetPath(),
					V2:    api.GetMethod(),
					V3:    domain,
				})
			}
		}
	}

	policies := authzEngine.PolicyMap{
		"policies": rules,
		"projects": authzEngine.MakeProjects(),
	}

	return policies, nil
}
```

### 4.2 依赖注入：注册 Authorizer 到 Wire 容器

修改 `app/admin/service/internal/data/init.go`，将 `NewAuthorizer` 注册到 Wire 依赖注入容器，确保框架启动时能自动初始化：

```go
// app/admin/service/internal/data/init.go
//go:build wireinject
// +build wireinject

package data

import "github.com/google/wire"

// ProviderSet 数据层依赖注入集合：注册 Authorizer 及其他数据仓库
var ProviderSet = wire.NewSet(
    NewAuthorizer,        // 注册权限管理器
    NewRoleRepo,          // 注册角色数据仓库
    NewApiResourceRepo,   // 注册 API 资源数据仓库
    // ... 其他数据仓库
)
```

### 4.3 中间件集成：将权限校验嵌入 REST 服务

修改 `app/admin/service/internal/server/rest.go`，将 Casbin 权限校验中间件嵌入 REST 服务器的请求链路中，实现对所有接口的权限拦截：

```go
// app/admin/service/internal/server/rest.go

package server

// NewMiddleware 创建中间件
func newRestMiddleware(
	logger log.Logger,
	authenticator authnEngine.Authenticator,
	authorizer *data.Authorizer,
) []middleware.Middleware {
	var ms []middleware.Middleware
	ms = append(ms, logging.Server(logger))

	ms = append(ms, selector.Server(
		authn.Server(authenticator),
		auth.Server(),
		authz.Server(authorizer.Engine()),
	).Match(newRestWhiteListMatcher()).Build())

	return ms
}

// NewRESTServer new an HTTP server.
func NewRESTServer(
    cfg *conf.Bootstrap, logger log.Logger,
	authenticator authnEngine.Authenticator, authorizer *data.Authorizer,
) {
    ...

	srv := rpc.CreateRestServer(cfg,
		newRestMiddleware(logger, authenticator, authorizer)...,
	)

    ...
}
```

### 4.4 配置启用：修改 auth.yaml 启用 Casbin

修改 `app/admin/service/configs/auth.yaml`，将权限引擎类型设置为 casbin，启用权限校验：

```yaml
# app/admin/service/configs/auth.yaml
# 权限配置
authz:
  type: "casbin"  # 可选值：casbin（启用权限校验）、noop（禁用）
  # casbin 额外配置（如数据库连接、缓存等，根据实际需求添加）
  # casbin:
  #   driver: "mysql"
  #   dsn: "user:password@tcp(127.0.0.1:3306)/casbin?parseTime=true"
```

### 4.5 自定义模型：内嵌自定义 Casbin 模型

若默认 RBAC 模型不满足业务需求，可自定义模型文件，通过 assets 内嵌到项目中：

#### 1. 创建模型文件

在 `app/admin/service/cmd/server/assets/` 目录下创建 `casbin_model.conf`，编写自定义模型规则（参考 3.1 节）；

#### 2. 内嵌模型文件

修改 `app/admin/service/cmd/server/assets/assets.go`，通过 `//go:embed` 指令将模型文件内嵌到程序中：

```go
// app/admin/service/cmd/server/assets/assets.go

package assets

import _ "embed"

//go:embed casbin_model.conf 
var CasbinModel []byte // 内嵌自定义 Casbin 模型
```

#### 3. 加载自定义模型

在 `Authorizer.newEngine` 方法中，通过`casbin.WithStringModel` 加载内嵌的模型:

```go
package data

import (
	"go-wind-admin/app/admin/service/cmd/server/assets"
)

func (a *Authorizer) newEngine(cfg *conf.Bootstrap) authzEngine.Engine {
	switch cfg.GetAuthz().GetType() {
	default:
		fallthrough

	case "casbin":
		state, err := casbin.NewEngine(ctx, casbin.WithStringModel(string(assets.CasinModel)))
		if err != nil {
			a.log.Errorf("init casbin engine error: %v", err)
			return nil
		}
		return state
	}
}
```

## 五、集成验证与常见问题

### 5.1 验证集成效果

1. 启动 GoWind Admin 服务，确保日志中输出 `success reload policy rules`，说明策略加载成功；
2. 通过 Postman 等工具测试接口：使用 admin 角色用户访问任意接口：应能正常访问（符合 `p, admin, *, *, *` 策略）；
3. 使用普通用户访问无权限接口：应返回 403 Forbidden 错误；
4. 修改角色权限后，调用 `Authorizer.ResetPolicies` 重置策略，验证权限变更是否生效。

### 5.2 常见问题排查

- **策略加载失败**：检查角色/API 资源是否存在，数据库连接是否正常，日志中是否有 `failed to list roles` 等错误；
- **权限校验不生效**：检查 `auth.yaml` 中 `authz.type` 是否设置为 `casbin`，是否误启用 noop 模式；
- **接口路径匹配失败**：检查模型匹配器是否使用 `keyMatch2` 函数（支持路径参数通配符），避免使用精确匹配；
- **多租户权限隔离失效**：检查策略是否包含域（dom）字段，匹配器是否添加域匹配逻辑。

## 六、项目代码与参考资料

### 6.1 项目代码仓库

- GoWind Admin Gitee：<https://gitee.com/tx7do/go-wind-admin>
- GoWind Admin Github：<https://github.com/tx7do/go-wind-admin>
- Kratos-Authz（Casbin 封装组件）：<https://github.com/tx7do/kratos-authz>

### 6.2 权威参考资料

1. Casbin 官方文档：<https://casbin.org/zh/docs/>
2. Casbin GitHub 仓库：<https://github.com/casbin/casbin>
3. Casbin 交互式解释器（在线调试）：<https://casbin.org/zh/editor>
4. Kratos 官方文档（中间件集成）：<https://go-kratos.dev/docs/middleware/intro>
5. RBAC 权限模型设计指南：<https://juejin.cn/post/7041059713848442917>
6. Casbin 集成实战：<https://juejin.cn/post/6947951229590831135>


[1]:(https://github.com/casbin/casbin)
[2]:(https://casbin.org)
[3]:(https://casbin.org/zh/editor)
[4]:(https://juejin.cn/post/7041059713848442917)
[5]:(https://juejin.cn/post/6947951229590831135)
