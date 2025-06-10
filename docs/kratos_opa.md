# Kratos微服务框架实现权鉴 - OPA

[Open Policy Agent](https://www.openpolicyagent.org/)，官方简称OPA，旨在统一不同技术和系统的策略执行。今天，OPA 被科技行业内的巨头们所使用。例如，Netflix 使用 OPA 来控制对其内部 API 资源的访问。Chef 用它来为他们的终端用户产品提供 IAM 功能。此外，许多其他公司，如 Cloudflare、Pinterest 等，都使用 OPA 在他们的平台上执行策略（如 Kubernetes 集群）。

OPA 最初是由 Styra 公司在 2016 年创建并开源的项目，目前该公司的主要产品就是提供可视化策略控制及策略执行的可视化 Dashboard 服务的。

OPA 首次进入 CNCF 并成为 sandbox 级别的项目是在 2018 年，在 2021 年的 2 月份便已经从 CNCF 毕业，这个过程相对来说还是比较快的，由此也可以看出 OPA 是一个比较活跃且应用广泛的项目。

策略（policy）是一套管理软件服务行为的规则。该策略可以描述速率限制、受信任的服务器名称、应用程序应部署到的集群、允许的网络路线或用户可以提款的账户等。

授权是一种特殊的策略，通常规定哪些人或机器可以在哪些资源上运行哪些操作。授权有时会与认证（Authentication）混淆：人或机器如何证明他们是他们所说的人。授权和更一般的策略经常利用认证的结果（用户名、用户属性、组、声明），但做出的决定所基于的信息远远超过用户是谁。从授权归纳到策略，使两者的区别更加清晰，因为有些策略决策与用户无关，例如，策略只是描述了软件系统中必须保持的不变量（例如，所有的二进制文件必须来自一个可信的来源）。

现在，策略通常是它实际管理的软件服务的一个硬编码功能。Open Policy Agent让您可以将策略从软件服务中解耦出来，这样，负责策略的人员就可以从服务本身中分离出来，对策略进行读、写、分析、版本、发布以及一般的管理。OPA还为您提供了一个统一的工具集，使您可以将策略与任何您喜欢的软件服务解耦，并使用任何您喜欢的上下文来编写上下文感知策略。简而言之，OPA可以帮助您使用任何上下文从任何软件系统解耦任何策略。

## 理解OPA

宏观上，OPA可以分为四个核心概念：

1. 请求输入（Request Input）；
2. 外部数据（Data）；
3. Rego策略（Policy），在OPA当中使用了DLS语言Rego进行编写；
4. 响应数据（Response），它不一定是单纯的True/False，也可以是JSON格式的数据返回。

以上四个核心概念，在官方提供的试炼场里边具有直观的体现：<https://play.openpolicyagent.org>，你可以在当中对模型和数据进行测试。

从微观上，一个请求输入由以下一个三元组组成：

1. 访问实体 (Subject)；
2. 访问资源 (Object)；
3. 访问方法 (Action)。

看到这里，如果你使用过Casbin，会发现一股熟悉的味道油然而生。没错，跟Casbin一样一样的。OPA的Rego就相当于Casbin中的模型，Casbin的模型是用表达式描述的，而OPA是使用DSL语言Rego进行的描述。Casbin要更加简洁，但同时功能上也比较受到约束，肯定不如使用DSL更加的丰富。所以，使用Casbin，如果需求简单还可以很好的应付，但是如果一旦需求复杂了，可能就会有点应付不来。

## 学习Rego

Rego 是 OPA 的专用声明性策略语言。它用于编写易于阅读和编写的策略。从根本上说，Rego 检查和转换结构化文档中的数据，允许 OPA 做出政策决定。Rego 最初受到 Datalog 的启发，Datalog 是一种具有数十年历史的通用查询语言，但扩展了其功能以支持 JSON 等结构化文档模型。

### 赋值

Rego的变量一旦赋值便不可再进行改变。

```rego
# 标量赋值
greeting   := "Hello"
max_height := 42
pi         := 3.14159
allowed    := true
location   := null

# 复合类型赋值
rect := {"width": 2, "height": 4}

# 集合
allowed_users := [“papaya”, “potato”]

# 数组
s1 := [1, 2, 3]

# 对象
ips_by_port := {
    80: ["1.1.1.1", "1.1.1.2"],
    443: ["2.2.2.1"],
}
```

## 布尔判断

可以这样写：

```rego
v if "hello" == "world"
```

也可以这样写：

```rego
t2 if {
    x := 42
    y := 41
    x > y
}
```

因为关键字`if`是可选的，所以，还可以这样写：

```rego
v { "hello" == "world" }

t2 {
    x := 42
    y := 41
    x > y
}
```

Rego使用`;`来表达逻辑AND，或者要忽略`;`则使用多行来表达。

即

```repo
input.servers[0].id == "app"; input.servers[0].protocols[0] == "https"
```

和

```repo
input.servers[0].id == "app"
input.servers[0].protocols[0] == "https"
```

是等价的。

逻辑OR可以用以下方式，只要其中一个决策块为真，即为真：

```repo
allow {
    is_admin
}
allow {
    is_endpoint_public
}
```

### 遍历

准确来说应该用迭代来描述，使用`some`和`every`关键字实现。

```repo
some val in arr
some i, val in arr
```

或者

```repo
every k, v in {"foo": "bar", "fox": "baz" } {
        startswith(k, "f")
        startswith(v, "b")
    }
```

另外，还可以使用下划线_(通配符)进行遍历。

```repo
proj = input.projects[_]
id := proj.id

some i, _ in arr
val := arr[_]
```

### 函数

Rego当中函数具有以下特点：

- 默认函数返回值为 true/false
- 可以指定函数返回值
- 可以存在同名函数, 但参数数目不能变
- 相同输入（参数）必须获得相同输出（返回值）

举例来说，如果我们要实现一个方法来判断文件是否是配置文件后缀：

```rego
is_config_file(str) {
  contains(str, ".yaml")
}

is_config_file(str) {
  contains(str, ".yml")
}

is_config_file(str) {
  contains(str, ".json")
}
```

上面的`is_config_file`就是不指定返回值，

条件满足则返回`true`，三个实现只要满足一个就为`true`。

那么，我们想要三个方法合并为一个方法，能行吗？能行，使用`else`关键字实现：

```rego
is_config_file2(str) {
  contains(str, ".yaml")
}

else {
  contains(str, ".yml")
}

else {
  contains(str, ".json")
}
```

指定返回值呢？这样做：

```rego
plus_custom(a, b) := c {
    c := a + b
}
out := plus_custom(42, 43)
```

### 一个完整的规则

有了以上这些语法基础，就可以开始写第一个Repo规则了：

```repo
package authz

default allow = false

# 放行所有的GET请求
allow {
	input.method = "GET"
}

# 允许 admin 用户做任何操作
allow {
	input.user == "admin"
}

# 允许 admin 用户组下的用户做任何操作
allow {
	input.group[_] == "admin"
}
```

然后输入请求数据进行决策：

```json
{
    "user": "user1",
    "group": [
        "dev",
        "admin"
    ]
}
```

可以得到决策结果：

```json
{
    "allow": true
}
```

## 单元测试

Repo提供了单元测试功能，假如上面的Repo的文件名叫做：example.repo，那么单元测试的文件名就应该叫做：example_test.rego，这一点跟golang的单元测试是很相似的。

那么，测试的代码有可能是这样：

```repo
package authz
import future.keywords

test_get_allowed if {
    allow with input as {"user": "user1", "method": "GET"}
}
```

然后在repo所在的文件夹下面运行下面的命令即可运行测试：

```bash
opa test . -v

example_test.rego:
data.authz.test_get_allowed: PASS (522.5µs)
--------------------------------------------------------------------------------
PASS: 1/1
```

## 一个最简单的OPA的Golang程序

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/open-policy-agent/opa/rego"
)

func main() {

	ctx := context.Background()

	// Construct a Rego object that can be prepared or evaluated.
	r := rego.New(
		rego.Query(os.Args[2]),
		rego.Load([]string{os.Args[1]}, nil))

	// Create a prepared query that can be evaluated.
	query, err := r.PrepareForEval(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// Load the input document from stdin.
	var input interface{}
	dec := json.NewDecoder(os.Stdin)
	dec.UseNumber()
	if err := dec.Decode(&input); err != nil {
		log.Fatal(err)
	}

	// Execute the prepared query.
	rs, err := query.Eval(ctx, rego.EvalInput(input))
	if err != nil {
		log.Fatal(err)
	}

    // Do something with the result.
	fmt.Println(rs)
}
```

## 将OPA实施封装

```go
package opa

// nolint:lll
//go:generate go-bindata -pkg $GOPACKAGE -o policy.bindata.go -ignore .*_test.rego -ignore Makefile -ignore README\.md policy/...

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/pkg/errors"

	"github.com/open-policy-agent/opa/ast"
	"github.com/open-policy-agent/opa/rego"
	"github.com/open-policy-agent/opa/storage"
	"github.com/open-policy-agent/opa/storage/inmem"
	"github.com/open-policy-agent/opa/topdown"

	"github.com/tx7do/kratos-authz/engine"
)

var _ engine.Engine = (*State)(nil)

type State struct {
	store                storage.Store
	queries              map[string]ast.Body
	compiler             *ast.Compiler
	modules              map[string]*ast.Module
	preparedEvalProjects rego.PreparedEvalQuery
}

const (
	authzProjectsQuery    = "data.authz.authorized_project[project]"
	filteredPairsQuery    = "data.authz.introspection.authorized_pair[_]"
	filteredProjectsQuery = "data.authz.introspection.authorized_project"
)

func New(_ context.Context, opts ...OptFunc) (*State, error) {
	authzProjectsQueryParsed, err := ast.ParseBody(authzProjectsQuery)
	if err != nil {
		return nil, errors.Wrapf(err, "parse query %q", authzProjectsQuery)
	}

	filteredPairsQueryParsed, err := ast.ParseBody(filteredPairsQuery)
	if err != nil {
		return nil, errors.Wrapf(err, "parse query %q", filteredPairsQuery)
	}

	filteredProjectsQueryParsed, err := ast.ParseBody(filteredProjectsQuery)
	if err != nil {
		return nil, errors.Wrapf(err, "parse query %q", filteredProjectsQuery)
	}

	s := State{
		store: inmem.New(),
		queries: map[string]ast.Body{
			authzProjectsQuery:    authzProjectsQueryParsed,
			filteredPairsQuery:    filteredPairsQueryParsed,
			filteredProjectsQuery: filteredProjectsQueryParsed,
		},
	}

	for _, opt := range opts {
		opt(&s)
	}

	if err := s.initModules(); err != nil {
		return nil, errors.Wrap(err, "init OPA modules")
	}

	return &s, nil
}

func (s *State) ProjectsAuthorized(ctx context.Context, subjects engine.Subjects, action engine.Action, resource engine.Resource, projects engine.Projects) (engine.Projects, error) {
	var subs []*ast.Term
	for _, sub := range subjects {
		subs = append(subs, ast.NewTerm(ast.String(sub)))
	}

	var projs []*ast.Term
	for _, proj := range projects {
		projs = append(projs, ast.NewTerm(ast.String(proj)))
	}

	input := ast.NewObject(
		[2]*ast.Term{ast.NewTerm(ast.String("subjects")), ast.ArrayTerm(subs...)},
		[2]*ast.Term{ast.NewTerm(ast.String("resource")), ast.NewTerm(ast.String(resource))},
		[2]*ast.Term{ast.NewTerm(ast.String("action")), ast.NewTerm(ast.String(action))},
		[2]*ast.Term{ast.NewTerm(ast.String("projects")), ast.ArrayTerm(projs...)},
	)
	resultSet, err := s.preparedEvalProjects.Eval(ctx, rego.EvalParsedInput(input))
	if err != nil {
		return engine.Projects{}, &EvaluationError{e: err}
	}

	return s.projectsFromPreparedEvalQuery(resultSet)
}

func (s *State) FilterAuthorizedPairs(ctx context.Context, subjects engine.Subjects, pairs engine.Pairs) (engine.Pairs, error) {
	opaInput := map[string]interface{}{
		"subjects": subjects,
		"pairs":    pairs,
	}

	rs, err := s.evalQuery(ctx, s.queries[filteredPairsQuery], opaInput, s.store)
	if err != nil {
		return nil, &EvaluationError{e: err}
	}

	return s.pairsFromResults(rs)
}

func (s *State) FilterAuthorizedProjects(ctx context.Context, subjects engine.Subjects) (engine.Projects, error) {
	opaInput := map[string]interface{}{
		"subjects": subjects,
	}

	rs, err := s.evalQuery(ctx, s.queries[filteredProjectsQuery], opaInput, s.store)
	if err != nil {
		return nil, &EvaluationError{e: err}
	}

	return s.projectsFromPartialResults(rs)
}

func (s *State) IsAuthorized(ctx context.Context, subject engine.Subject, action engine.Action, resource engine.Resource, project engine.Project) (bool, error) {
	if len(project) > 0 {
		input := ast.NewObject(
			[2]*ast.Term{ast.NewTerm(ast.String("subjects")), ast.ArrayTerm(ast.NewTerm(ast.String(subject)))},
			[2]*ast.Term{ast.NewTerm(ast.String("resource")), ast.NewTerm(ast.String(resource))},
			[2]*ast.Term{ast.NewTerm(ast.String("action")), ast.NewTerm(ast.String(action))},
			[2]*ast.Term{ast.NewTerm(ast.String("projects")), ast.ArrayTerm(ast.NewTerm(ast.String(project)))},
		)
		resultSet, err := s.preparedEvalProjects.Eval(ctx, rego.EvalParsedInput(input))
		if err != nil {
			return false, &EvaluationError{e: err}
		}
		return s.allowedFromPreparedEvalQuery(resultSet)
	} else {
		opaInput := map[string]interface{}{
			"subjects": engine.MakeSubjects(subject),
			"pairs":    engine.MakePairs(engine.Pair{Resource: resource, Action: action}),
		}

		rs, err := s.evalQuery(ctx, s.queries[filteredPairsQuery], opaInput, s.store)
		if err != nil {
			return false, &EvaluationError{e: err}
		}

		return s.pairsFromAllowed(rs)
	}
}

func (s *State) SetPolicies(ctx context.Context, policyMap engine.PolicyMap, roleMap engine.RoleMap) error {
	s.store = inmem.NewFromObject(map[string]interface{}{
		"policies": policyMap,
		"roles":    roleMap,
	})

	return s.makeAuthorizedProjectPreparedQuery(ctx)
}

func (s *State) initModules() error {
	if len(s.modules) == 0 {
		mods := map[string]*ast.Module{}
		for _, name := range AssetNames() {
			if !strings.HasSuffix(name, ".rego") {
				continue
			}
			parsed, err := ast.ParseModule(name, string(MustAsset(name)))
			if err != nil {
				return errors.Wrapf(err, "parse policy file %q", name)
			}
			mods[name] = parsed
		}
		s.modules = mods
	}

	compiler, err := s.newCompiler()
	if err != nil {
		return errors.Wrap(err, "init compiler")
	}
	s.compiler = compiler
	return nil
}

func (s *State) makeAuthorizedProjectPreparedQuery(ctx context.Context) error {
	compiler, err := s.newCompiler()
	if err != nil {
		return err
	}

	r := rego.New(
		rego.Store(s.store),
		rego.Compiler(compiler),
		rego.ParsedQuery(s.queries[authzProjectsQuery]),
		rego.DisableInlining([]string{
			"data.authz.denied_project",
		}),
	)

	pq, err := r.Partial(ctx)
	if err != nil {
		return err
	}

	for i, module := range pq.Support {
		compiler.Modules[fmt.Sprintf("support%d", i)] = module
	}

	main := &ast.Module{
		Package: ast.MustParsePackage("package __partialauthz"),
	}

	for i := range pq.Queries {
		rule := &ast.Rule{
			Module: main,
			Head:   ast.NewHead("authorized_project", ast.VarTerm("project")),
			Body:   pq.Queries[i],
		}
		main.Rules = append(main.Rules, rule)
	}

	compiler.Modules["__partialauthz"] = main

	compiler.Compile(compiler.Modules)

	if compiler.Failed() {
		return compiler.Errors
	}

	r2 := rego.New(
		rego.Store(s.store),
		rego.Compiler(compiler),
		rego.Query("data.__partialauthz.authorized_project[project]"),
	)

	query, err := r2.PrepareForEval(ctx)
	if err != nil {
		return errors.Wrap(err, "prepare query for eval (authorized_project)")
	}

	s.preparedEvalProjects = query

	return nil
}

func (s *State) newCompiler() (*ast.Compiler, error) {
	compiler := ast.NewCompiler()
	compiler.Compile(s.modules)
	if compiler.Failed() {
		return nil, errors.Wrap(compiler.Errors, "compile modules")
	}

	return compiler, nil
}

func (s *State) DumpData(ctx context.Context) error {
	return dumpData(ctx, s.store)
}

func dumpData(ctx context.Context, store storage.Store) error {
	txn, err := store.NewTransaction(ctx)
	if err != nil {
		return err
	}
	data, err := store.Read(ctx, txn, []string{})
	if err != nil {
		return err
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	log.Info("data: ", string(jsonData))
	return store.Commit(ctx, txn)
}

func (s *State) evalQuery(ctx context.Context, query ast.Body, input interface{}, store storage.Store) (rego.ResultSet, error) {
	var tracer *topdown.BufferTracer

	rs, err := rego.New(
		rego.ParsedQuery(query),
		rego.Input(input),
		rego.Compiler(s.compiler),
		rego.Store(store),
		rego.QueryTracer(tracer),
	).Eval(ctx)
	if err != nil {
		return nil, err
	}

	if tracer.Enabled() {
		topdown.PrettyTrace(os.Stderr, *tracer) //nolint: govet // tracer can be nil only if tracer.Enabled() == false
	}

	return rs, nil
}

func (s *State) pairsFromResults(rs rego.ResultSet) (engine.Pairs, error) {
	pairs := make(engine.Pairs, len(rs))
	for i, r := range rs {
		if len(r.Expressions) != 1 {
			return nil, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		m, ok := r.Expressions[0].Value.(map[string]interface{})
		if !ok {
			return nil, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		res, ok := m["resource"].(string)
		if !ok {
			return nil, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		act, ok := m["action"].(string)
		if !ok {
			return nil, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		pairs[i] = engine.Pair{Resource: engine.Resource(res), Action: engine.Action(act)}
	}

	return pairs, nil
}

func (s *State) pairsFromAllowed(rs rego.ResultSet) (bool, error) {
	for _, r := range rs {
		if len(r.Expressions) != 1 {
			return false, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		m, ok := r.Expressions[0].Value.(map[string]interface{})
		if !ok {
			return false, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		_, ok = m["resource"].(string)
		if !ok {
			return false, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		_, ok = m["action"].(string)
		if !ok {
			return false, &UnexpectedResultExpressionError{exps: r.Expressions}
		}
		return true, nil
	}

	return false, nil
}

func (s *State) projectsFromPartialResults(rs rego.ResultSet) (engine.Projects, error) {
	if len(rs) != 1 {
		return nil, &UnexpectedResultSetError{set: rs}
	}
	r := rs[0]
	if len(r.Expressions) != 1 {
		return nil, &UnexpectedResultExpressionError{exps: r.Expressions}
	}
	projects, err := s.stringArrayFromResults(r.Expressions)
	if err != nil {
		return nil, &UnexpectedResultExpressionError{exps: r.Expressions}
	}
	return projects, nil
}

func (s *State) stringArrayFromResults(exps []*rego.ExpressionValue) (engine.Projects, error) {
	rawArray, ok := exps[0].Value.([]interface{})
	if !ok {
		return nil, &UnexpectedResultExpressionError{exps: exps}
	}
	vals := make(engine.Projects, len(rawArray))
	for i := range rawArray {
		v, ok := rawArray[i].(string)
		if !ok {
			return nil, errors.New("error casting to string")
		}
		vals[i] = engine.Project(v)
	}
	return vals, nil
}

func (s *State) projectsFromPreparedEvalQuery(rs rego.ResultSet) (engine.Projects, error) {
	projectsFound := make(map[string]bool, len(rs))
	result := make(engine.Projects, 0, len(rs))
	var ok bool
	var proj string
	for i := range rs {
		proj, ok = rs[i].Bindings["project"].(string)
		if !ok {
			return nil, &UnexpectedResultExpressionError{exps: rs[i].Expressions}
		}
		if !projectsFound[proj] {
			result = append(result, engine.Project(proj))
			projectsFound[proj] = true
		}
	}
	return result, nil
}

func (s *State) allowedFromPreparedEvalQuery(rs rego.ResultSet) (bool, error) {
	var ok bool
	for i := range rs {
		_, ok = rs[i].Bindings["project"].(string)
		if !ok {
			return false, &UnexpectedResultExpressionError{exps: rs[i].Expressions}
		}
		return true, nil
	}
	return false, nil
}
```

## 将OPA整合进Kratos

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

- [OPA - Github](https://github.com/open-policy-agent/opa/)
- [OPA - 官方网站](https://www.openpolicyagent.org/)
- [OPA - 交互式解释器](https://play.openpolicyagent.org/)
- [策略即代码——Open Policy Agent（开放策略代理 OPA）简介](https://cloudnative.to/blog/introducing-policy-as-code-the-open-policy-agent-opa/)
- [Open Policy Agent - 快速導入 Authz 至 Microservice 架構](https://engineering.linecorp.com/zh-hant/blog/open-policy-agent-authz-in-microservice/)
- [Open Policy Agent: What Is OPA and How It Works (Examples)](https://spacelift.io/blog/what-is-open-policy-agent-and-how-it-works)
- [OPA进阶-函数与虚拟文档要分清](http://blog.newbmiao.com/2020/03/18/opa-func-and-virtual-doc.html)
- [OPA进阶-简洁的推导式](http://blog.newbmiao.com/2020/03/20/opa-comprehensions.html)
- [open policy agent 语法总结](https://www.cnblogs.com/charlieroro/p/15876732.html)
- [Open Policy Agent简介](http://just4coding.com/2020/02/13/open-policy-agent/)
- [How to Write Your First Rules in Rego, the Policy Language for OPA](https://www.styra.com/blog/how-to-write-your-first-rules-in-rego-the-policy-language-for-opa/)
- [Introduction to Open Policy Agent (OPA) Rego Language](https://spacelift.io/blog/open-policy-agent-rego)
- [First look to OPA(Open Policy Agent)](https://medium.com/trendyol-tech/first-look-to-opa-open-policy-agent-3542810941c9)
