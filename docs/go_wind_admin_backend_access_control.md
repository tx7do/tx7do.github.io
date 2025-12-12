# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：后端权限控制

后端的权限控制主要分为两种：

- API权限控制；
- 数据权限控制。

在本文，我们不讨论数据权限的控制，主要讲API的权限控制。

在GO的世界里面，我们能够使用到的解决方案有：

- [Casbin][3]
- [Open Policy Agent(OPA)][4]
- [Zanzibar][5]

在本文里面，我们主要讨论，Casbin和OPA。这几个解决方案的SDK我都已经封装好了在：[kratos-authz][6]。因此，我们只需要直接简便的调用就可以了。

## Casbin

[Casbin][7] 是一套访问控制开源库，致力于帮助复杂系统解决权限管理的难题。同时也是一个国产开源项目。Casbin采用了元模型的设计思想，既支持ACL（访问控制列表），RBAC（基于角色访问控制），ABAC（基于属性访问控制）等经典的访问控制模型，也支持用户按照自身需求灵活定义权限。Casbin已经被Intel、IBM、腾讯云、VMware、RedHat、T-Mobile等公司开源使用，被Cisco、Verizon等公司闭源使用。具体详见 [Casbin主页][3]。

Casbin由北京大学罗杨博士在2017年4月发起，罗杨博士的研究方向为云计算访问控制，目前已发表数十篇相关学术论文，曾经在ICWS、IEEE CLOUD、ICICS等多个顶级学术会议进行论文宣讲。Casbin项目则是其研究成果的落地。

Casbin最初是一个用Go语言打造的开源轻量级的统一访问控制框架。目前已逐渐发展，扩展到Go、Java、Node.js、Javascript(React)、Python、PHP、.NET、Delphi、Rust等多种语言，在[GitHub][7]开源，主项目在GitHub上已有1.3w+ stars。该项目目前已经有一个上百人稳定的团队进行维护，并在持续不断发展中。

### 理解Casbin

宏观上，Casbin可以分为三个核心概念：

1. 请求（Request）；
2. 模型（Model）；
3. 策略（Policy）。

以上三个核心概念，在官方提供的[编辑器][8]里边具有直观的体现，它实质上是一个交互式解释器，你也可以在其中测试模型和策略。

![Casbin Editor](https://tx7do.github.io/assets/images/authz/casbin_editor.png)

我们举个简单的例子来描述：用户bob发起了一个HTTP的GET **请求** `/users`；**模型** 提供了判定的规则，比如我们经常使用的RBAC模型，我们定义一个角色：超级用户，它可以访问一切资源；**策略**，提供了用户账户与角色、资源、行为等的映射关系，通过这个映射关系，系统得知bob是超级用户角色。综上，系统得出结论：bob是超级用户，可以访问一切资源。

从微观上，一个请求由以下一个三元组组成：

1. 访问实体 (Subject)；
2. 访问资源 (Object)；
3. 访问方法 (Action)。

判定方法`Enforcer.Enforce`的入参传入三元组，并实施判断。比如上述例子当中：访问实体 = `bob`；访问资源 = `/users`；访问方法 = `HTTP GET`。

### 配置解析

Casbin的配置有两个：模型(Model)和策略(Policy)。其中，策略配置因为经常变动，所以更多时候会被持久化到数据库当中。

#### 模型（Access Control Model）

Casbin 的访问控制模型被抽象成了一个配置文件，这个配置文件由以下五部分组成

以一个最简单的RABC模型举例：

```ini
# 请求定义
[request_definition]
r = sub, obj, act

# 策略定义
[policy_definition]
p = sub, obj, act

# 角色定义
[role_definition]
g = _, _

# 策略效果
[policy_effect]
e = some(where (p.eft == allow))

# 匹配器定义
[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
```

##### 1. 请求定义 (Request Definition)

定义了在 `Enforcer.Enforce` 方法中请求的参数和这些传入参数的顺序；一个基本的 Request 由一个三元组组成：`[subject,obj,act]`，`subject` 是指访问的实体，也就是用户；`obj` 是指请求的资源，`act` 是指对这个资源的操作，定义如下：

```ini
[request_definition]
r = sub,obj,act
```

##### 2. 策略定义 (Policy Definition)

定义了访问策略的模型，其实就是定义了在 Policy Document 中策略规则的字段名称以及顺序，定义如下：

```ini
[policy_definition]
p = sub, obj, act
```

##### 3. 匹配器定义 (Matcher)

定义了 request 和 policy 之间的匹配规则，例如：

```ini
[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
```

上面的这个匹配规则就是当请求的参数 `(r.sub, r.obj, r.act)` 在定义的策略文件中能找到，说明就匹配成功了，返回的结果会存放在 `p.eft` 当中。

##### 4. 策略效果 (Policy Effect)

Effect 可以说是在 Matcher 的匹配结果之上，再次进行逻辑组合判断，判断的结果才是该用户是否有操作权限的结果。

下面是一个例子：

```ini
[policy_effect]
e = some(where (p.eft == allow))
```

上面这个逻辑表达式的意思就是说：当在 matcher匹配的结果中存在任何一个 `p.eft == allow` 的结果，那么这个逻辑表达式的结果就为 true

##### 5. 角色定义 (Role Definition)（可选）

上面的四个是最基本的，如果使用 RBAC 的 Access model，那么还需要 Role 模型的定义，就是定义用户角色的模型，如下所示：

```ini
[role_definition]
g = _, _
```

#### 策略文档 (Policy Document)

策略文档就是根据 Access Control Model 中定义的 `[policy_definition]` 生成的一条条 policy rule (策略规则)，比如：

```csv
p,alice,data1,read  // 表示：alice 可以 read data1
p,bob,data2,write   // 表示：bob 可以 write data2
```

如果是使用 RBAC model，那么还会在这个文件中根据 `[role_definition]` 生成用户和角色的实例，比如：

```csv
p,alice,data1,read
p,bob,data2,read
p,data2_admin,data2,read   //表示 data2_admin 可以 read data2
p,data2_admin,data2,write  //表示 data2_admin 可以 write data2
​
g,alice,data2_admin  //表示 alice 是 data2_admin
```

### 在Go Wind Admin中是如何应用Casbin的？

首先，我们需要安装我封装的库：

```bash
go get github.com/tx7do/kratos-authz/engine/casbin
go get github.com/tx7do/kratos-authz/middleware
```

然后，我们在服务的配置目录`configs`下创建一个配置`auth.yaml`：

```yaml
authz:
  type: "casbin" # casbin, opa, zanzibar, noop
```

接着，我们在服务的`data`包里面增加一个`authorizer.go`:

```go
package data

import (
	"context"
	"errors"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/go-utils/trans"

	authzEngine "github.com/tx7do/kratos-authz/engine"
	"github.com/tx7do/kratos-authz/engine/casbin"
	"github.com/tx7do/kratos-authz/engine/noop"
	"github.com/tx7do/kratos-authz/engine/opa"

	conf "github.com/tx7do/kratos-bootstrap/api/gen/go/conf/v1"
	pagination "github.com/tx7do/kratos-bootstrap/api/gen/go/pagination/v1"

	"go-wind-admin/app/admin/service/cmd/server/assets"

	adminV1 "go-wind-admin/api/gen/go/admin/service/v1"
	userV1 "go-wind-admin/api/gen/go/user/service/v1"
)

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

	default:
		a.log.Warnf("unknown engine name: %s", a.engine.Name())
		return errors.New("unknown authz engine name")
	}

	//a.log.Debugf("***************** policy rules len: %v", len(rules))

	if err = a.engine.SetPolicies(context.Background(), policies, nil); err != nil {
		a.log.Errorf("set policies error: %v", err)
		return err
	}

	return nil
}

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

以上的代码主要有两个点：

1. 如何创建鉴权器；
2. 如何生成Casbin的策略。

我们默认用的策略文件是内置在我封装在库里面的内存文件`restfull_with_role.conf`:

```ini
[request_definition]
r = sub, obj, act, dom

[policy_definition]
p = sub, obj, act, dom

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && keyMatch2(r.obj, p.obj) && (regexMatch(r.act, p.act) || p.act == 'ANY') && (keyMatch(r.dom, p.dom) || p.dom == '*')
```

## OPA

[Open Policy Agent][4]，官方简称`OPA`，旨在统一不同技术和系统的策略执行。今天，OPA 被科技行业内的巨头们所使用。例如，Netflix 使用 OPA 来控制对其内部 API 资源的访问。Chef 用它来为他们的终端用户产品提供 IAM 功能。此外，许多其他公司，如 Cloudflare、Pinterest 等，都使用 OPA 在他们的平台上执行策略（如 Kubernetes 集群）。

OPA 最初是由 Styra 公司在 2016 年创建并开源的项目，目前该公司的主要产品就是提供可视化策略控制及策略执行的可视化 Dashboard 服务的。

OPA 首次进入 CNCF 并成为 sandbox 级别的项目是在 2018 年，在 2021 年的 2 月份便已经从 CNCF 毕业，这个过程相对来说还是比较快的，由此也可以看出 OPA 是一个比较活跃且应用广泛的项目。

策略（policy）是一套管理软件服务行为的规则。该策略可以描述速率限制、受信任的服务器名称、应用程序应部署到的集群、允许的网络路线或用户可以提款的账户等。

授权是一种特殊的策略，通常规定哪些人或机器可以在哪些资源上运行哪些操作。授权有时会与认证（Authentication）混淆：人或机器如何证明他们是他们所说的人。授权和更一般的策略经常利用认证的结果（用户名、用户属性、组、声明），但做出的决定所基于的信息远远超过用户是谁。从授权归纳到策略，使两者的区别更加清晰，因为有些策略决策与用户无关，例如，策略只是描述了软件系统中必须保持的不变量（例如，所有的二进制文件必须来自一个可信的来源）。

现在，策略通常是它实际管理的软件服务的一个硬编码功能。Open Policy Agent让您可以将策略从软件服务中解耦出来，这样，负责策略的人员就可以从服务本身中分离出来，对策略进行读、写、分析、版本、发布以及一般的管理。OPA还为您提供了一个统一的工具集，使您可以将策略与任何您喜欢的软件服务解耦，并使用任何您喜欢的上下文来编写上下文感知策略。简而言之，OPA可以帮助您使用任何上下文从任何软件系统解耦任何策略。

### 理解OPA

宏观上，OPA可以分为四个核心概念：

1. 请求输入（Request Input）；
2. 外部数据（Data）；
3. Rego策略（Policy），在OPA当中使用了DLS语言Rego进行编写；
4. 响应数据（Response），它不一定是单纯的True/False，也可以是JSON格式的数据返回。

以上四个核心概念，在官方提供的[试炼场][9]里边具有直观的体现，你可以在当中对模型和数据进行测试。

![OPA Rego Playground](https://tx7do.github.io/assets/images/authz/opa_rego_playground.png)

从微观上，一个请求输入由以下一个三元组组成：

1. 访问实体 (Subject)；
2. 访问资源 (Object)；
3. 访问方法 (Action)。

看到这里，如果你使用过Casbin，会发现一股熟悉的味道油然而生。没错，跟Casbin一样一样的。OPA的`Rego`就相当于Casbin中的`模型(Modle)`，Casbin的模型是用表达式描述的，而OPA是使用DSL语言Rego进行的描述。Casbin要更加简洁，但同时功能上也比较受到约束，肯定不如使用DSL更加的丰富。所以，使用Casbin，如果需求简单还可以很好的应付，但是如果一旦需求复杂了，可能就会有点应付不来。

### 学习Rego

Rego 是 OPA 的专用声明性策略语言。它用于编写易于阅读和编写的策略。从根本上说，Rego 检查和转换结构化文档中的数据，允许 OPA 做出政策决定。Rego 最初受到 Datalog 的启发，Datalog 是一种具有数十年历史的通用查询语言，但扩展了其功能以支持 JSON 等结构化文档模型。

目前，Rego有两个版本：v0和v1。两者的语法差异有点大，并且我之前基于v0的语法写了一篇文章《[golang微服务框架Kratos实现鉴权 - OPA（Open Policy Agent）][10]》，所以，在本文我就不再赘述了。

### 在Go Wind Admin中是如何应用OPA的？

首先，我们需要安装我封装的库：

```bash
go get github.com/tx7do/kratos-authz/engine/opa
go get github.com/tx7do/kratos-authz/middleware
```

然后，我们在服务的配置目录`configs`下创建一个配置`auth.yaml`：

```yaml
authz:
  type: "opa" # casbin, opa, zanzibar, noop
```

接着，我们在服务的`data`包里面增加一个`authorizer.go`:

```go
package data

import (
	"context"
	"errors"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/go-utils/trans"

	authzEngine "github.com/tx7do/kratos-authz/engine"
	"github.com/tx7do/kratos-authz/engine/casbin"
	"github.com/tx7do/kratos-authz/engine/noop"
	"github.com/tx7do/kratos-authz/engine/opa"

	conf "github.com/tx7do/kratos-bootstrap/api/gen/go/conf/v1"
	pagination "github.com/tx7do/kratos-bootstrap/api/gen/go/pagination/v1"

	"go-wind-admin/app/admin/service/cmd/server/assets"

	adminV1 "go-wind-admin/api/gen/go/admin/service/v1"
	userV1 "go-wind-admin/api/gen/go/user/service/v1"
)

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
	case "opa":
		state, err := opa.NewEngine(ctx,
			opa.WithModulesFromString(map[string]string{
				"rbac.rego": string(assets.OpaRbacRego),
			}),
		)
		if err != nil {
			a.log.Errorf("init opa engine error: %v", err)
			return nil
		}

		if err = state.InitModulesFromString(map[string]string{
			"rbac.rego": string(assets.OpaRbacRego),
		}); err != nil {
			a.log.Errorf("init opa modules error: %v", err)
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
	case "opa":
		if policies, err = a.generateOpaPolicies(roles, apis); err != nil {
			a.log.Errorf("generate OPA policies error: %v", err)
			return err
		}

	default:
		a.log.Warnf("unknown engine name: %s", a.engine.Name())
		return errors.New("unknown authz engine name")
	}

	//a.log.Debugf("***************** policy rules len: %v", len(rules))

	if err = a.engine.SetPolicies(context.Background(), policies, nil); err != nil {
		a.log.Errorf("set policies error: %v", err)
		return err
	}

	return nil
}

func (a *Authorizer) generateOpaPolicies(roles *userV1.ListRoleResponse, apis *adminV1.ListApiResourceResponse) (authzEngine.PolicyMap, error) {
	type OpaPolicyPath struct {
		Pattern string `json:"pattern"`
		Method  string `json:"method"`
	}

	policies := make(authzEngine.PolicyMap, len(roles.Items))
	paths := make([]OpaPolicyPath, 0, len(roles.Items)*len(apis.Items))

	//policies["projects"] = authzEngine.MakeProjects("api")

	apiSet := make(map[uint32]struct{})

	for _, role := range roles.Items {
		if role.GetId() == 0 {
			continue // Skip if role or API ID is not set
		}

		paths = paths[:0] // Reset paths for each role

		for _, apiId := range role.GetApis() {
			apiSet[apiId] = struct{}{}
		}

		for _, api := range apis.Items {
			if api.GetId() == 0 {
				continue // Skip if role or API ID is not set
			}

			if _, exists := apiSet[api.GetId()]; exists {
				paths = append(paths, OpaPolicyPath{
					Pattern: api.GetPath(),
					Method:  api.GetMethod(),
				})
			}
		}

		policies[role.GetCode()] = paths
	}

	return policies, nil
}
```

以上的代码主要有两个点：

1. 如何创建鉴权器；
2. 如何生成OPA的策略。

我们使用的Rego文件，我放在了Go Wind Admin的`app/admin/service/cmd/server/assets/rbac.rego`，以内嵌文件`//go:embed rbac.rego`的形式提供：

```rego
package authz.introspection

import future.keywords.if
import future.keywords.in

default authorized := false

default authorized_project := ""

default authorized_pair := []

# Check if the input is authorized based on the policies and pairs provided.
authorized if {
	some input_sub in input.subjects
	some grant in data.policies[input_sub]

	some input_pair in input.pairs
	input_pair.resource == grant.pattern
	input_pair.action == grant.method
}

# Check if the input pair is authorized based on the policies and pairs provided.
authorized_pair := [pair] if {
	authorized

	some input_pair in input.pairs
	pair := {"resource": input_pair.resource, "action": input_pair.action}
}

# Check if the input is authorized for a specific project.
authorized_project := "api" if {
	authorized
}
```

Rego代码我们可以在 [Rego Playground][9] 里面进行测试。

## 项目代码

* [go-wind-admin Gitee][1]
* [go-wind-admin Github][2]

[1]: <https://gitee.com/tx7do/go-wind-admin>
[2]: <https://github.com/tx7do/go-wind-admin>
[3]: <https://casbin.org/>
[4]: <https://www.openpolicyagent.org/>
[5]: <https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/>
[6]: <https://github.com/tx7do/kratos-authz>
[7]: <https://github.com/casbin/casbin>
[8]: <https://casbin.org/zh/editor>
[9]: <https://play.openpolicyagent.org>
[10]: <https://juejin.cn/post/7183310275615916092>
