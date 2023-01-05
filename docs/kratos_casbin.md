# Kratos微服务框架实现权鉴 - Casbin

Casbin（<https://github.com/casbin/casbin>）是一套访问控制开源库，致力于帮助复杂系统解决权限管理的难题。同时也是一个国产开源项目。Casbin采用了元模型的设计思想，既支持ACL（访问控制列表），RBAC（基于角色访问控制），ABAC（基于属性访问控制）等经典的访问控制模型，也支持用户按照自身需求灵活定义权限。Casbin已经被Intel、IBM、腾讯云、VMware、RedHat、T-Mobile等公司开源使用，被Cisco、Verizon等公司闭源使用。具体详见Casbin主页（<https://casbin.org/>）。

Casbin由北京大学罗杨博士在2017年4月发起，罗杨博士的研究方向为云计算访问控制，目前已发表数十篇相关学术论文，曾经在ICWS、IEEE CLOUD、ICICS等多个顶级学术会议进行论文宣讲。Casbin项目则是其研究成果的落地。

Casbin最初是一个用Go语言打造的开源轻量级的统一访问控制框架。目前已逐渐发展，扩展到Go、Java、Node.js、Javascript(React)、Python、PHP、.NET、Delphi、Rust等多种语言，在GitHub开源（<https://github.com/casbin/casbin>），主项目在GitHub上已有1.3w+ stars。该项目目前已经有一个上百人稳定的团队进行维护，并在持续不断发展中。

## 理解Casbin

宏观上，Casbin可以分为三个核心概念：

1. 请求（Request）；
2. 模型（Model）；
3. 策略（Policy）。

以上三个核心概念，在官方提供的编辑器里边具有直观的体现：<https://casbin.org/zh/editor>，它实质上是一个交互式解释器，你也可以在其中测试模型和策略。

我们举个简单的例子来描述：用户bob发起了一个HTTP的GET **请求** `/users`；**模型** 提供了判定的规则，比如我们经常使用的RBAC模型，我们定义一个角色：超级用户，它可以访问一切资源；**策略**，提供了用户账户与角色、资源、行为等的映射关系，通过这个映射关系，系统得知bob是超级用户角色。综上，系统得出结论：bob是超级用户，可以访问一切资源。

从微观上，一个请求由以下一个三元组组成：

1. 访问实体 (Subject)；
2. 访问资源 (Object)；
3. 访问方法 (Action)。

判定方法`Enforcer.Enforce`的入参传入三元组，并实施判断。比如上述例子当中：访问实体 = `bob`；访问资源 = `/users`；访问方法 = `HTTP GET`。

## 配置解析

Casbin的配置有两个：模型和策略。其中，策略配置因为经常变动，所以更多时候会被持久化到数据库当中。

### 模型（Access Control Model）

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

#### 1. 请求定义 (Request Definition)

定义了在 `Enforcer.Enforce` 方法中请求的参数和这些传入参数的顺序；一个基本的 Request 由一个三元组组成：`[subject,obj,act]`，`subject` 是指访问的实体，也就是用户；`obj` 是指请求的资源，`act` 是指对这个资源的操作，定义如下：

```ini
[request_definition]
r = sub,obj,act
```

#### 2. 策略定义 (Policy Definition)

定义了访问策略的模型，其实就是定义了在 Policy Document 中策略规则的字段名称以及顺序，定义如下：

```ini
[policy_definition]
p = sub, obj, act
```

#### 3. 匹配器定义 (Matcher)

定义了 request 和 policy 之间的匹配规则，例如：

```ini
[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
```

上面的这个匹配规则就是当请求的参数 `(r.sub, r.obj, r.act)` 在定义的策略文件中能找到，说明就匹配成功了，返回的结果会存放在 `p.eft` 当中。

#### 4. 策略效果 (Policy Effect)

Effect 可以说是在 Matcher 的匹配结果之上，再次进行逻辑组合判断，判断的结果才是该用户是否有操作权限的结果。

下面是一个例子：

```ini
[policy_effect]
e = some(where (p.eft == allow))
```

上面这个逻辑表达式的意思就是说：当在 matcher匹配的结果中存在任何一个 `p.eft == allow` 的结果，那么这个逻辑表达式的结果就为 true

#### 5. 角色定义 (Role Definition)（可选）

上面的四个是最基本的，如果使用 RBAC 的 Access model，那么还需要 Role 模型的定义，就是定义用户角色的模型，如下所示：

```ini
[role_definition]
g = _, _
```

### 策略文档 (Policy Document)

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

## 一个最简单的Casbin的Golang程序

```go
import (
    "github.com/casbin/casbin/v2"
    "fmt"
)
​
func main() {
    e, err := casbin.NewEnforcer("path/to/model.conf", "path/to/policy.csv")
    if err != nil {
        return
    }

    sub := "alice"
    obj := "data1"
    act := "read"
    ok, err := e.Enforce(sub, obj, act)
    if err != nil {
        return
    }
    if ok {
        fmt.Println("matched")
    } else {
        fmt.Println("mismatched")
    }
}
```

以上的代码，加载了文件形式的配置文件。`Enforce`方法对写死的一组三元组数据进行判定。

虽然上面的代码看起来很简单。但是，如果不能够理解基础概念，要上手起来还是会比较难。

## 将Casbin实施封装

Casbin的模型，通常定了之后，基本上都不会变，所以，写在配置文件当中并没有问题。

而策略是经常变的，所以通常来说，是需要持久化到数据库当中去的。官方库当中提供了许许多多丰富的`Adapter`实现，我默认实现了一个加载内存策略的实现，当然，要替换成其他实现也是容易的。

```go
package casbin

import (
	"errors"
	"github.com/casbin/casbin/v2/model"
)

type Adapter struct {
	policies map[string]interface{}
}

func newAdapter() *Adapter {
	return &Adapter{
		policies: map[string]interface{}{},
	}
}

func (sa *Adapter) LoadPolicy(model model.Model) error {
	policiesInterface, ok := sa.policies["policies"]
	if ok {
		policies := policiesInterface.([]PolicyRule)
		for _, line := range policies {
			if err := line.LoadPolicyLine(model); err != nil {
				return err
			}
		}
	}
	return nil
}

func (sa *Adapter) SavePolicy(_ model.Model) error {
	return errors.New("not implemented")
}

func (sa *Adapter) AddPolicy(_ string, _ string, _ []string) error {
	return errors.New("not implemented")
}

func (sa *Adapter) RemovePolicy(_ string, _ string, _ []string) error {
	return errors.New("not implemented")
}

func (sa *Adapter) RemoveFilteredPolicy(_ string, _ string, _ int, _ ...string) error {
	return errors.New("not implemented")
}

func (sa *Adapter) SetPolicies(policies map[string]interface{}) {
	sa.policies = policies
}
```

然后将Casbin封装成一个引擎:

```go
package casbin

import (
	"context"

	stdCasbin "github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"

	"github.com/tx7do/kratos-authz/engine"
)

var _ engine.Engine = (*State)(nil)

type State struct {
	model    model.Model
	policy   *Adapter
	enforcer *stdCasbin.SyncedEnforcer
	projects engine.Projects

	wildcardItem              string
	authorizedProjectsMatcher string
}

func New(_ context.Context, opts ...OptFunc) (*State, error) {
	s := State{
		policy:                    newAdapter(),
		projects:                  engine.Projects{},
		wildcardItem:              "*",
		authorizedProjectsMatcher: "g(r.sub, p.sub, p.dom) && (keyMatch(r.dom, p.dom) || p.dom == '*')",
	}

	for _, opt := range opts {
		opt(&s)
	}

	var err error

	if s.model == nil {
		s.model, err = model.NewModelFromString(DefaultRestfullWithRoleModel)
		if err != nil {
			return nil, err
		}
	}

	s.enforcer, err = stdCasbin.NewSyncedEnforcer(s.model, s.policy)
	if err != nil {
		return nil, err
	}

	return &s, nil
}

func (s *State) ProjectsAuthorized(_ context.Context, subjects engine.Subjects, action engine.Action, resource engine.Resource, projects engine.Projects) (engine.Projects, error) {
	result := make(engine.Projects, 0, len(projects))

	var err error
	var allowed bool
	for _, project := range projects {
		for _, subject := range subjects {
			if allowed, err = s.enforcer.Enforce(string(subject), string(resource), string(action), string(project)); err != nil {
				return nil, err
			} else if allowed {
				result = append(result, project)
			}
		}
	}

	return result, nil
}

func (s *State) FilterAuthorizedPairs(_ context.Context, subjects engine.Subjects, pairs engine.Pairs) (engine.Pairs, error) {
	result := make(engine.Pairs, 0, len(pairs))

	project := engine.Project(s.wildcardItem)

	var err error
	var allowed bool
	for _, p := range pairs {
		for _, subject := range subjects {
			if allowed, err = s.enforcer.Enforce(string(subject), string(p.Resource), string(p.Action), string(project)); err != nil {
				return nil, err
			} else if allowed {
				result = append(result, p)
			}
		}
	}
	return result, nil
}

func (s *State) FilterAuthorizedProjects(_ context.Context, subjects engine.Subjects) (engine.Projects, error) {
	result := make(engine.Projects, 0, len(s.projects))

	resource := engine.Resource(s.wildcardItem)
	action := engine.Action(s.wildcardItem)

	var err error
	var allowed bool
	for _, project := range s.projects {
		for _, subject := range subjects {
			if allowed, err = s.enforcer.EnforceWithMatcher(s.authorizedProjectsMatcher, string(subject), string(resource), string(action), string(project)); err != nil {
				return nil, err
			} else if allowed {
				result = append(result, project)
			}
		}
	}

	return result, nil
}

func (s *State) IsAuthorized(_ context.Context, subject engine.Subject, action engine.Action, resource engine.Resource, project engine.Project) (bool, error) {
	if len(project) == 0 {
		project = engine.Project(s.wildcardItem)
	}

	var err error
	var allowed bool
	if allowed, err = s.enforcer.Enforce(string(subject), string(resource), string(action), string(project)); err != nil {
		return false, err
	} else if allowed {
		return true, nil
	}
	return false, nil
}

func (s *State) SetPolicies(_ context.Context, policyMap engine.PolicyMap, _ engine.RoleMap) error {
	s.policy.SetPolicies(policyMap)
	err := s.enforcer.LoadPolicy()

	projects, ok := policyMap["projects"]
	if ok {
		switch t := projects.(type) {
		case engine.Projects:
			s.projects = t
		}
	}

	return err
}
```

需要注意的是，在这个实现里面，实际上设计的是四元组，而事实上Casbin支持的是三元组，要支持四元组有点头疼，所以，我基本上没有支持，所以看起来会有一些奇怪。

## 将Casbin整合进Kratos

上面的封装有好几个接口，但是要用到的其实只有一个接口:`IsAuthorized`，我们将之封装成一个中间件以供Kratos调用。

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

中间件的实现很简单，所以不再赘述。

具体的使用方法可以在单元测试里面具体看到，另外我还开源了一个CMS也有实际应用。

## 相关代码

相关代码已经开源，欢迎拉取参考学习：

- <https://github.com/tx7do/kratos-authz>
- <https://gitee.com/tx7do/kratos-authz>

应用方面的代码，我开源了一个简单的CMS，完整的应用可在当中找到：

- <https://github.com/tx7do/kratos-blog>
- <https://gitee.com/tx7do/kratos-blog>

## 参考资料

- [Casbin - Github](https://github.com/casbin/casbin)
- [Casbin - 官方网站](https://casbin.org)
- [Casbin - 交互式解释器](https://casbin.org/zh/editor)
- [授权框架 Casbin](https://juejin.cn/post/7041059713848442917)
- [集成Casbin进行访问权限控制](https://juejin.cn/post/6947951229590831135)
