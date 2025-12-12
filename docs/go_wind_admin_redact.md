# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：数据脱敏和隐私保护

Go Wind Admin 的数据脱敏能力，是基于 Protobuf 生态下的[arrakis-digital/protoc-gen-redact](https://github.com/arrakis-digital/protoc-gen-redact)插件实现的 —— 通过在 Protobuf 消息定义中为敏感字段（如手机号、身份证号）添加脱敏注解（如(`(redact.custom).string = "r*d@ct*d"`)），由插件自动生成适配业务的脱敏方法（如 Go 语言的Redact()方法），无需侵入业务逻辑即可完成敏感数据的遮挡处理，同时保持与 Protobuf 消息结构的强绑定，避免跨层配置不一致问题。配微服务接口、日志打印、数据存储等场景的隐私保护需求。

与其他脱敏工具相比，其核心优势在于：​

- 原生集成 Protobuf：脱敏规则与消息结构强绑定，避免跨层配置不一致；​
- 多语言支持：目前主打 Go 语言，后续扩展支持 Java、Python 等 Protobuf 主流语言；​
- 灵活规则体系：支持内置脱敏类型、自定义正则、自定义函数，覆盖绝大多数业务场景；​
- 低侵入性：生成的脱敏代码与业务代码分离，不影响原有 Protobuf 消息的序列化 / 反序列化逻辑。

## 快速上手：环境准备与插件安装

### 1. 前置环境要求​

- **Go 环境**：1.18+（插件基于 Go 开发，需匹配支持的版本）；​
- **Protobuf 编译器（`protoc`）**：3.19+（确保支持自定义选项与插件扩展）；​
- **Protobuf Go 插件**：`protoc-gen-go`（用于生成基础 Go 代码，需提前安装）。

### 2. 安装插件​

通过 `go install` 直接从 GitHub 拉取最新版本：​

```bash
# 安装 protoc-gen-redact 插件​
go install github.com/menta2k/protoc-gen-redact/v3@latest
```

同时确保 `protoc-gen-go` 已安装（生成 Protobuf 基础 Go 代码必需）：​

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

以上命令，我都已经写入了项目根目录下的`Makefile`，只需要调用`make`方法即可：

```bash
make plugin
```

## 核心使用流程：3 步实现 Protobuf 消息脱敏​

以「用户信息（User）」消息为例，完整演示从规则定义到脱敏调用的全流程。​

### 步骤 1：定义 Protobuf 消息（标注脱敏规则）​

首先创建 Protobuf 文件（如 `api/user/v1/user.proto`），通过 `redact` 自定义注解为敏感字段配置脱敏规则。​

关键说明：​

- 需导入插件提供的自定义选项文件 `redact/redact.proto`（定义脱敏规则的语法）；​

```protobuf
syntax = "proto3";

package user;

import "redact/redact.proto";
import "google/protobuf/empty.proto";

option go_package = "github.com/arrakis-digital/protoc-gen-redact/v3/examples/user/pb;user";

message User {
    // User credentials
    string username = 1;
    string password = 2 [(redact.v3.value).string = ""]; // default redaction

    // User information
    string email = 3 [(redact.v3.value).string = "r*d@ct*d"];
    string name = 4;
}

service UserService {
    rpc GetUser(GetUserRequest) returns (User);

    rpc AddUser(User) returns (User) {
        option (redact.v3.internal_method) = true;
    }

    rpc ListUsers (google.protobuf.Empty) returns (ListUsersResponse) {
        option (redact.v3.internal_method) = true;
        option (redact.v3.internal_method_code) = 14; // codes.Unavailable
        option (redact.v3.internal_method_err_message) = "%service%.%method% unavailable";
    }
}

message GetUserRequest {
    string username = 1;
}

message ListUsersResponse {
    repeated User users = 1;
}
```

### 步骤 2：生成脱敏代码（protoc 命令）​

通过 `protoc` 命令调用 `protoc-gen-redact` 插件，同时生成 基础Go代码 和 脱敏代码。​

```bash
protoc \
  --plugin=protoc-gen-redact=/path/to/protoc-gen-redact \
  --redact_out=. \
  --redact_opt=template_file=/path/to/your/template.tmpl \
  your_proto_file.proto
```

生成文件说明：​

执行后会生成 2 个文件（以 Go 为例）：​

- `user.pb.go`：Protobuf 基础代码（消息结构体、序列化 / 反序列化方法）；​
- `user.redact.pb.go`：脱敏代码（核心是 `User.Redact()`、`GetUserRequest.Redact()` 和 `ListUsersResponse.Redact()` 方法）。​

Go Wind Admin使用的是Buf来构建Protobuf代码，所以，protoc命令在实际开发中我们是接触不到的。

redact在buf中的配置主要有两处：

```yaml
# api/buf.yaml
deps:
  - 'buf.build/menta2k-org/redact'
```

和

```yaml
# api/buf.gen.yaml
managed:
  enabled: true

  disable:
    - module: 'buf.build/menta2k-org/redact'

plugins:
  # generate redact code
  - local: protoc-gen-redact
    out: gen/go
    opt:
      - paths=source_relative # use relative paths
      - lang=go
```

平时我们只需要在api下调用`buf generate`，或者直接在项目根目录下调用`make api`即可。

### 步骤 3：调用脱敏方法（业务代码示例）​

在 Go 业务代码中，创建原始 `User` 消息后，直接调用自动生成的 `Redact()`方法即可完成脱敏，无需手动编写逻辑。​

```go
package main

import (
	"fmt"

	"github.com/menta2k/protoc-gen-redact/v3/examples/user/pb"
)

func main() {
	// 1. 构造原始用户信息（含完整敏感数据）
	rawUser := &pb.User{
		Name:     "张三丰",
		Password: "password",
		Email:    "testuser@example.com",
	}

	// 2. 调用自动生成的 Redact() 方法脱敏
	redactedUser := rawUser.Redact()

	// 3. 打印脱敏结果
	fmt.Println("姓名：", rawUser.Name)
	fmt.Println("邮箱：", rawUser.Email)
	fmt.Println("密码：", rawUser.Password)
	fmt.Println("脱敏数据：", redactedUser)
}
```

## 适用场景与总结

### 1. 核心适用场景​

- **微服务接口脱敏**：网关 / 服务间调用时，自动脱敏响应中的敏感字段（如用户中心返回手机号、身份证）；​
- **日志脱敏**：打印 Protobuf 消息日志前，避免敏感数据泄露；​
- **前端展示脱敏**：后端返回数据前脱敏，前端无需处理隐私数据逻辑；​
- **第三方数据传输**：向合作伙伴传输数据时，按规则脱敏敏感字段，符合合规要求（如 GDPR、《个人信息保护法》）。

### 2. 工具总结​

`protoc-gen-redact` 以 “Protobuf 原生集成” 为核心优势，通过 “注解定义规则 + 代码生成” 的模式，大幅降低了数据脱敏的开发成本。其灵活的规则体系（内置类型 + 自定义逻辑）和低侵入性，使其成为微服务架构下隐私保护的优选工具。建议在项目初期就将脱敏规则与 Protobuf 消息绑定，避免后期大量业务代码改造。

## 项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)

