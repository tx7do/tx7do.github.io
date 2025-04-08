# 开箱即用的GO后台管理系统 Kratos Admin - API管理

开门见山，[Kratos][6]内置的RPC是[gRPC][4]，而gRPC是基于[Protobuf][1]作为 **接口规范的描述语言（IDL，Interface Description Language）**。

与此同时我们还可以通过[grpc-gateway][5]对RESTfull进行支持。这样，Kratos就同时支持gRPC和REST。

也就是说，我们只需要编写一套Protobuf代码，就能够同时支持 **gRPC协议** 和 **RESTfull协议**。

Protobuf支持很多编程语言，比如：C++、Java、JavaScript、Python、Go、Ruby、Objective-C、C#……这也就意味着，它很适合多语言异构化架构，这样的场景在现实应用当中是很稀松平常的，这使得Protobuf具有很强的实用性。

Protobuf具有序列化后数据量更小、序列化/反序列化速度更快、更简单的特性；而JSON则相反，序列化后数据量较大，序列化和反序列化速度不优的特性，但是前端对JSON是原生支持，对前端极其友好。那么，我们可以在服务之间使用gRPC进行通讯，服务与前端之间可以通过RESTfull进行通讯。

Protobuf和gRPC已经发展了许多年，极其稳定，生态链丰富。它具有强大的工具链可供使用，只要你想得到的，都能够找得到相对应的工具。没有合适的工具也没有关系，它的工具是使用插件方式来实现可扩展性的，因此我们可以容易的开发出自己的工具插件，Kratos就为此开发了自己的一系列的工具插件方便开发使用。

综上，我们可知使用gRPC/protobuf的好处：

1. 一套proto，同时支持gRPC协议和RESTfull协议；
2. 支持多编程语言，适合多语言异构化架构；
3. gRPC协议，数据量小、序列化/反序列化速度更快、更简单，适合服务之间通讯；
4. RESTfull协议，数据量较大、序列化/反序列化速度较慢、前端原生支持JSON，适合同前端的通讯。
5. 强大的工具链，使用插件的方式实现强大的可扩展性，可方便的扩展。

了解了基础的知识之后，我们简单的了解一下本文的核心知识点：

1. 使用[Protobuf][1]编写API；
2. 使用[Buf][2]管理proto；
3. 使用[Make][3]执行Buf命令。

## 1. 使用Protobuf编写API

```proto
syntax = "proto3";

package user.service.v1;

import "gnostic/openapi/v3/annotations.proto";

import "google/protobuf/empty.proto";
import "google/protobuf/field_mask.proto";
import "google/protobuf/timestamp.proto";

import "google/api/field_behavior.proto";

import "pagination/v1/pagination.proto";

// 用户服务
service UserService {
  // 查询用户列表
  rpc ListUser (pagination.PagingRequest) returns (ListUserResponse) {}

  // 查询用户详情
  rpc GetUser (GetUserRequest) returns (User) {}

  // 创建用户
  rpc CreateUser (CreateUserRequest) returns (google.protobuf.Empty) {}

  // 更新用户
  rpc UpdateUser (UpdateUserRequest) returns (google.protobuf.Empty) {}

  // 删除用户
  rpc DeleteUser (DeleteUserRequest) returns (google.protobuf.Empty) {}
}

// 用户权限
enum UserAuthority {
  SYS_ADMIN = 0;  // 系统超级用户
  SYS_MANAGER = 1;  // 系统管理员
  CUSTOMER_USER = 2;  // 普通用户
  GUEST_USER = 3;  // 游客

  REFRESH_TOKEN = 4; // 刷新令牌
}

// 用户性别
enum UserGender {
  SECRET = 0;  // 未知
  MALE = 1;     // 男性
  FEMALE = 2;   // 女性
}

// 用户状态
enum UserStatus {
  OFF = 0;
  ON = 1;
}

// 用户
message User {
  optional uint32 id = 1 [
    json_name = "id",
    (gnostic.openapi.v3.property) = {description: "用户ID"}
  ];  // 用户ID

  optional uint32 role_id = 2 [json_name = "roleId", (gnostic.openapi.v3.property) = {description: "角色ID"}];  // 角色ID
  optional uint32 work_id = 3 [json_name = "workId", (gnostic.openapi.v3.property) = {description: "工号"}];  // 工号
  optional uint32 org_id = 4 [json_name = "orgId", (gnostic.openapi.v3.property) = {description: "部门ID"}];  // 部门ID
  optional uint32 position_id = 5 [json_name = "positionId", (gnostic.openapi.v3.property) = {description: "岗位ID"}];  // 岗位ID
  optional uint32 creator_id = 6 [json_name = "creatorId", (gnostic.openapi.v3.property) = {description: "创建者ID"}]; // 创建者ID

  optional string user_name = 10 [
    json_name = "userName",
    (gnostic.openapi.v3.property) = {description: "登录名"}
  ]; // 登录名

  optional string nick_name = 11 [
    json_name = "nickName",
    (gnostic.openapi.v3.property) = {description: "昵称"}
  ]; // 昵称

  optional string real_name = 12 [
    json_name = "realName",
    (gnostic.openapi.v3.property) = {description: "真实姓名"}
  ]; // 真实姓名

  optional string avatar = 13 [
    json_name = "avatar",
    (gnostic.openapi.v3.property) = {description: "头像"}
  ]; // 头像

  optional string email = 14 [
    json_name = "email",
    (gnostic.openapi.v3.property) = {description: "邮箱"}
  ]; // 邮箱

  optional string mobile = 15 [
    json_name = "mobile",
    (gnostic.openapi.v3.property) = {description: "手机号"}
  ]; // 手机号

  optional string telephone = 16 [
    json_name = "telephone",
    (gnostic.openapi.v3.property) = {description: "座机号"}
  ]; // 手机号

  optional UserGender gender = 17 [
    json_name = "gender",
    (gnostic.openapi.v3.property) = {description: "性别"}
  ]; // 性别

  optional string address = 18 [
    json_name = "address",
    (gnostic.openapi.v3.property) = {description: "住址"}
  ]; // 住址

  optional string region = 19 [
    json_name = "region",
    (gnostic.openapi.v3.property) = {description: "国家地区"}
  ]; // 国家地区

  optional string description = 20 [
    json_name = "description",
    (gnostic.openapi.v3.property) = {description: "个人描述"}
  ]; // 个人描述

  optional string remark = 21 [
    json_name = "remark",
    (gnostic.openapi.v3.property) = {description: "备注名"}
  ]; // 备注名

  optional int64 last_login_time = 30 [
    json_name = "lastLoginTime",
    (gnostic.openapi.v3.property) = {description: "最后登录时间"}
  ]; // 最后登录时间

  optional string last_login_ip = 31 [
    json_name = "lastLoginIp",
    (gnostic.openapi.v3.property) = {description: "最后登录IP"}
  ]; // 最后登录IP

  optional UserStatus status = 32 [(gnostic.openapi.v3.property) = {
    description: "用户状态"
    default: {string: "ON"}
  }]; // 用户状态

  optional UserAuthority authority = 33 [(gnostic.openapi.v3.property) = {
    description: "权限"
    default: {string: "CUSTOMER_USER"}
  }]; // 权限

  repeated string roles = 34 [(gnostic.openapi.v3.property) = {
    description: "角色码"
  }]; // 角色码

  optional google.protobuf.Timestamp create_time = 200 [json_name = "createTime", (gnostic.openapi.v3.property) = {description: "创建时间"}];// 创建时间
  optional google.protobuf.Timestamp update_time = 201 [json_name = "updateTime", (gnostic.openapi.v3.property) = {description: "更新时间"}];// 更新时间
  optional google.protobuf.Timestamp delete_time = 202 [json_name = "deleteTime", (gnostic.openapi.v3.property) = {description: "删除时间"}];// 删除时间
}

// 获取用户列表 - 答复
message ListUserResponse {
  repeated User items = 1;
  int32 total = 2;
}

// 获取用户数据 - 请求
message GetUserRequest {
  uint32 id = 1;
}

// 创建用户 - 请求
message CreateUserRequest {
  optional uint32 operator_id = 1 [
    (gnostic.openapi.v3.property) = {description: "操作用户ID", read_only: true},
    json_name = "operatorId"
  ]; // 操作用户ID

  User data = 2;

  optional string password = 3 [
    (gnostic.openapi.v3.property) = {description: "用户登录密码", read_only: true},
    json_name = "password"
  ]; // 用户登录密码
}

// 更新用户 - 请求
message UpdateUserRequest {
  optional uint32 operator_id = 1 [
    json_name = "operatorId",
    (gnostic.openapi.v3.property) = {description: "操作用户ID", read_only: true}
  ]; // 操作用户ID

  User data = 2 [
    json_name = "data",
    (google.api.field_behavior) = REQUIRED,
    (gnostic.openapi.v3.property) = {description: "用户的数据"}
  ]; // 用户的数据

  optional string password = 3 [
    (gnostic.openapi.v3.property) = {description: "用户登录密码", read_only: true},
    json_name = "password"
  ]; // 用户登录密码

  google.protobuf.FieldMask update_mask = 4 [
    json_name = "updateMask",
    (gnostic.openapi.v3.property) = {
      description: "要更新的字段列表",
      example: {yaml : "id,realName,userName"}
    }
  ]; // 要更新的字段列表

  optional bool allow_missing = 5 [
    json_name = "allowMissing",
    (gnostic.openapi.v3.property) = {description: "如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。"}
  ]; // 如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。
}

// 删除用户 - 请求
message DeleteUserRequest {
  optional uint32 operator_id = 1 [
    (gnostic.openapi.v3.property) = {description: "操作用户ID", read_only: true},
    json_name = "operatorId"
  ]; // 操作用户ID

  uint32 id = 2;
}
```

以上是`用户User`的一个完整的gRPC的API，包含了最基本的：用户数据结构，CURD的API。

需要特别讲解的是：`gnostic.openapi.v3.property`，这是用于生成OpenAPI的。

下面再给出RESTFull的服务定义：

```proto
syntax = "proto3";

package admin.service.v1;

import "gnostic/openapi/v3/annotations.proto";
import "google/api/annotations.proto";
import "google/protobuf/empty.proto";

import "user/service/v1/user.proto";
import "pagination/v1/pagination.proto";

// 用户管理服务
service UserService {
  // 获取用户列表
  rpc ListUser (pagination.PagingRequest) returns (user.service.v1.ListUserResponse) {
    option (google.api.http) = {
      get: "/admin/v1/users"
    };
  }

  // 获取用户数据
  rpc GetUser (user.service.v1.GetUserRequest) returns (user.service.v1.User) {
    option (google.api.http) = {
      get: "/admin/v1/users/{id}"
    };
  }

  // 创建用户
  rpc CreateUser (user.service.v1.CreateUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      post: "/admin/v1/users"
      body: "*"
    };
  }

  // 更新用户
  rpc UpdateUser (user.service.v1.UpdateUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      put: "/admin/v1/users/{data.id}"
      body: "*"
    };
  }

  // 删除用户
  rpc DeleteUser (user.service.v1.DeleteUserRequest) returns (google.protobuf.Empty) {
    option (google.api.http) = {
      delete: "/admin/v1/users/{id}"
    };
  }
}
```

> 这里需要说明的是：两个`UserService`可以是合二为一，也可以有多个。初学者一定会疑惑，我为什么要将之分离开来，为啥不能一个？首先，它可以只有一个，即RESTfull和gRPC的接口定义都在一个`UserService`当中，而我分离开来了，那么，我为什么分离开来了呢？分离开来的好处是，职责分明。前者用于内部通讯的RPC接口，后者用于对外的RESTfull接口。

在实际应用中，我们可能有admin和面向于app的两套API，我们就可以分别对之进行定义：

```proto
syntax = "proto3";

package front.service.v1;

import "gnostic/openapi/v3/annotations.proto";

import "google/api/field_behavior.proto";
import "google/api/annotations.proto";

import "pagination/v1/pagination.proto";

import "user/service/v1/user.proto";

// 用户服务
service UserService {
  // 查询用户列表
  rpc ListUser(pagination.PagingRequest) returns (user.service.v1.ListUserResponse) {
    option (google.api.http) = {
      get: "/app/v1/users"
    };
  }

  // 搜索用户
  rpc SearchUser(user.service.v1.SearchUserRequest) returns (user.service.v1.ListUserResponse) {
    option (google.api.http) = {
      get: "/app/v1/users:search"
    };
  }

  // 查询用户详情
  rpc GetUser(user.service.v1.GetUserRequest) returns (user.service.v1.User) {
    option (google.api.http) = {
      get: "/app/v1/users/{id}"
    };
  }
}
```

## 2. 使用Buf管理proto

当我们用熟悉了Protobuf之后，会遇到一个很头疼的问题：

我们该如何去管理和构建它呢？

在最早的时候，我只能够手动的调用protoc命令进行代码生成：

```bash
# generate go struct code
protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto
    
# generate grpc service code
protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto
    
# generate rest service code
protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto
    
# generate kratos errors code
protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto
    
# generate message validator code
protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto

# generate openapi v3 yaml doc
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto

# generate typescript code
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. ./simple.proto

# generate dart code
protoc --dart_out=. test.proto
```

怎么样，头大不？要调用这么多命令，生成这么多代码。我后来又想了很多办法，比如：

1. 写进Shell脚本；
2. 写进Makefile；
3. 利用go语言的go:generate注解。

结果发现，全部都不实用，而且无法进行工程化，在团队内难以实施。直到最后，我发现了[buf.build][10]这个专门用于构建protobuf API的工具。

Buf主要提供了两个工具：

1. **Buf Schema Registry（BSR）：** 其官方网站地址：[buf.build][2]，是一个用于管理和共享 Protocol Buffers（protobuf）代码的平台。
2. **Buf CLI：** 是一个强大的命令行工具，提供了一系列用于处理、验证和管理 protobuf 代码的功能。

简单的说就是：BSR是一个proto的代码库，类似于github，上面我用到的 [pagination.proto][11]，我就是提交到了BSR。

更多时候，我们使用最多的是Buf CLI这个工具，用它来生成代码，用的最多的就是两个命令：

1. `buf dep update` 用于更新三方依赖proto；
2. `buf generate` 用于生成代码。

buf有两套配置文件：

1. `buf.yaml` 主要也就是定义proto文件的路径，以及依赖的第三方proto。

    ```yaml
    version: v2

    modules:
    - path: protos
        lint:
        use:
            - STANDARD
        breaking:
        use:
            - FILE
    deps:
    - 'buf.build/googleapis/googleapis'
    - 'buf.build/kratos/apis'
    - 'buf.build/gnostic/gnostic'
    - 'buf.build/tx7do/pagination'

    breaking:
    use:
        - FILE

    lint:
    use:
        - DEFAULT
    ```

2. `buf.gen.yaml` 定义生成规则（这里是go代码生成）。

    ```yaml
    # 配置protoc生成规则
    version: v2

    clean: true

    managed:
    enabled: true

    disable:
        - module: buf.build/googleapis/googleapis
        - module: 'buf.build/envoyproxy/protoc-gen-validate'
        - module: 'buf.build/kratos/apis'
        - module: 'buf.build/gnostic/gnostic'
        - module: 'buf.build/gogo/protobuf'
        - module: 'buf.build/tx7do/pagination'

    override:
        - file_option: go_package_prefix
        value: kratos-cms/api/gen/go

    plugins:
    # 使用go插件生成go代码
    #- plugin: buf.build/protocolbuffers/go
    - local: protoc-gen-go
        out: gen/go
        opt: paths=source_relative # 使用相对路径

    # 使用go-grpc插件生成gRPC服务代码
    #- plugin: buf.build/grpc/go
    - local: protoc-gen-go-grpc
        out: gen/go
        opt:
        - paths=source_relative # 使用相对路径

    # generate rest service code
    - local: protoc-gen-go-http
        out: gen/go
        opt:
        - paths=source_relative # 使用相对路径

    # generate kratos errors code
    - local: protoc-gen-go-errors
        out: gen/go
        opt:
        - paths=source_relative # 使用相对路径

    # generate message validator code
    #- plugin: buf.build/bufbuild/validate-go
    - local: protoc-gen-validate
        out: gen/go
        opt:
        - paths=source_relative # 使用相对路径
        - lang=go
    ```

如果我们还需要生成OpenAPI，则可以再多定义个比如文件名为`buf.openapi.gen.yaml`的proto文件：

```yaml
# 配置protoc生成规则
version: v2

clean: false

managed:
  enabled: true

  disable:
    - module: buf.build/googleapis/googleapis
    - module: 'buf.build/envoyproxy/protoc-gen-validate'
    - module: 'buf.build/kratos/apis'
    - module: 'buf.build/gnostic/gnostic'
    - module: 'buf.build/gogo/protobuf'
    - module: 'buf.build/tx7do/pagination'

  override:
    - file_option: go_package_prefix
      value: kratos-cms/api/gen/go

inputs:
  - directory: protos
    paths:
      - protos/front/service/v1

plugins:
  # generate openapi v2 json doc
  #  - local: protoc-gen-openapiv2
  #    out: ../app/front/service/cmd/server/assets
  #    opt:
  #      - json_names_for_fields=true
  #      - logtostderr=true

  # generate openapi v3 yaml doc
  - local: protoc-gen-openapi
    out: ../app/front/service/cmd/server/assets
    opt:
      - naming=json # 命名约定。使用"proto"则直接从proto文件传递名称。默认为：json
      - depth=2 # 循环消息的递归深度，默认为：2
      - default_response=false # 添加默认响应消息。如果为“true”，则自动为使用google.rpc.Status消息的操作添加默认响应。如果您使用envoy或grpc-gateway进行转码，则非常有用，因为它们使用此类型作为默认错误响应。默认为：true。
      - enum_type=string # 枚举类型的序列化的类型。使用"string"则进行基于字符串的序列化。默认为：integer。
      - output_mode=merged # 输出文件生成模式。默认情况下，只有一个openapi.yaml文件会生成在输出文件夹。使用“source_relative”则会为每一个'[inputfile].proto'文件单独生成一个“[inputfile].openapi.yaml”文件。默认为：merged。
      - fq_schema_naming=false # Schema的命名是否加上包名，为true，则会加上包名，例如：trade.service.v1.ListDictDetailResponse，否则为：ListDictDetailResponse。默认为：false。
```

执行命令：`buf generate --template buf.openapi.gen.yaml`生成OpenAPI文档。

要生成Typescript代码就创建一个`buf.typescript.gen.yaml`的配置文件：

```yaml
# 配置protoc生成规则
version: v2

clean: true

managed:
  enabled: true

  disable:
    - module: buf.build/googleapis/googleapis
    - module: 'buf.build/envoyproxy/protoc-gen-validate'
    - module: 'buf.build/kratos/apis'
    - module: 'buf.build/gnostic/gnostic'
    - module: 'buf.build/gogo/protobuf'
    - module: 'buf.build/tx7do/pagination'

inputs:
  - directory: protos
    paths:
      - protos/admin/service/v1

plugins:
  # generate typescript code
  #  - remote: buf.build/community/stephenh-ts-proto
  - local: protoc-gen-ts_proto
    out: ../../frontend/admin/apps/admin/src/rpc/api
    opt:
      - outputSchema=false # 生成模式 (const, no-file-descriptor, true, false)
      - outputTypeRegistry=false # 生成类型注册表
      - outputTypeAnnotations=false # 生成类型注解 （static-only, true, optional, false）
      - outputServices=default # 生成服务代码 (default, definitions, grpc-js, nice-grpc, false, none)
      - outputJsonMethods=false # 生成json方法：toJSON、fromJSON
      - outputEncodeMethods=false # 生成编码方法：encode、decode
      - outputPartialMethods=false # Message.fromPartial和Message.create方法生成
      - outputClientImpl=false # 生成客户端实现 （grpc-web, false）
      - useExactTypes=true # 使用精确类型
      - usePrototypeForDefaults=true # 使用原型作为默认值
      - useJsonName=true # 使用json_name定义的字段名
      - useNullAsOptional=true # optional字段生成的类型，如果为true生成null，否则生成undefined。
      - useDate=false # google.protobuf.Timestamp类型转换为Date类型，如果为true，则生成Date类型，否则保持Timestamp类型。
      - useOptionals=none # 将字段声明为可选项，即是否加?号(all, messages, none)
      - useMapType=true # 使用Map类型
      - useReadonlyTypes=false # 使用只读类型readonly
      - nestJs=false # 使用nestjs
      - onlyTypes=false # 只生成类型，如果为true，等价于：outputJsonMethods=false,outputEncodeMethods=false,outputClientImpl=false,nestJs=false
      - fileSuffix=.pb # 文件后缀
      - enumsAsLiterals=false # 枚举作为文字
      - comments=true # 注释输出
      - exportCommonSymbols=false # 导出公共符号，如果为true，则生成protobufPackage，否则不导出。
      - esModuleInterop=true
      - forceLong=string # 强制long类型为string
      - oneof=unions # oneof生成的类型，如果为unions，则生成联合类型，否则生成交叉类型。
      - stringEnums=true # 枚举项生成的类型，如果为true，则生成字符串，否则生成为整型。
      - unrecognizedEnum=false # 未识别的枚举项，如果为true，默认会给enum增加一个UNRECOGNIZED枚举项。
      - outputIndex=false # 生成index.ts文件
      - paths=source_relative # 使用相对路径
```

执行命令：`buf generate --template buf.typescript.gen.yaml`生成TypeScript代码。

> 需要注意的是，protoc的插件可以用本地的插件，也可以用远端BSR中的protoc插件。在上面的实例里面，我都用的是本地的protoc插件，需要先行在本地进行安装。在团队协作当中，建议使用远端的protoc插件，用远端的protoc插件有个好处，那就是可以保证每一个人所使用的插件一致性（本地的有可能版本不一致）。

## 3. 使用Make执行Buf命令

本以为用了Buf之后，可以高枕无忧了，实际运用中，我们有可能会有多个buf的生成配置文件，那么我们就需要多个生成命令。命令写进shell脚本也不是不可以，但是，会有平台差异（Windows没有shell脚本，只有bat）。那么，我们可以使用Makefile，make是可以在任意平台上运行的，包括Windows。

```makefile
# generate protobuf api go code
goapi:
	@cd api && \
	buf generate

# generate OpenAPI v3 docs.
openapi:
	@cd api && \
	buf generate --template buf.admin.openapi.gen.yaml && \
  	buf generate --template buf.front.openapi.gen.yaml

# generate typescript.
ts:
	@cd api && \
	buf generate --template buf.admin.typescript.gen.yaml && \
	buf generate --template buf.front.typescript.gen.yaml

# generate protobuf api dart code.
dart:
	@cd api && \
	buf generate --template buf.front.dart.gen.yaml
```

> `buf generate`命令默认读取的是当前目录下文件名为`buf.gen.yaml`的配置文件。

现在我们就可以在项目的根目录下面运行make命令：

生成go代码:

```shell
make api
```

生成OpenAPI文档：

```shell
make openapi
```

生成TypeScript代码：

```shell
make ts
```

生成Dart代码：

```shell
make dart
```

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)

## 参考资料

* [Protocol Buffers Documentation][7]
* [gRPC Documentation][8]
* [gRPC-Gateway Documentation][9]

[1]: <https://protobuf.dev/>
[2]: <https://buf.build/>
[3]: <https://www.gnu.org/software/make/>
[4]: <https://grpc.io/>
[5]: <https://github.com/grpc-ecosystem/grpc-gateway>
[6]: <https://go-kratos.dev/>
[7]: <https://developers.google.com/protocol-buffers/docs/overview>
[8]: <https://grpc.io/docs/>
[9]: <https://grpc-ecosystem.github.io/grpc-gateway/>
[10]: <https://docs.buf.build/>
[11]: <https://buf.build/tx7do/pagination>
