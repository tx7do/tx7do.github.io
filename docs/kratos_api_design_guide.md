# Kratos微服务框架API工程化指南

Kratos的RPC默认使用的是[gRPC](https://github.com/grpc/grpc)，与此同时我们还可以通过gRPC的[grpc-gateway](https://github.com/grpc-ecosystem/grpc-gateway)功能对RESTfull进行支持。这样，我们就可以同时支持gRPC和REST了。而这一切Kratos都已经封装好，无需知道底层的一切，用就好了。

gRPC是基于[Protobuf](https://github.com/protocolbuffers/protobuf)作为接口规范的描述语言（IDL，Interface Description Language）。换句通俗的话来说，gRPC使用Protobuf来设计和管理API。我们只需要编写一套Protobuf文件，就能够支持gRPC协议和RESTfull协议。Protobuf支持很多编程语言，比如：C++、Java、JavaScript、Python、Go、Ruby、Objective-C、C#……这也就意味着，它很适合多语言异构化架构，这样的场景在现实中是很稀松平常的，这使得Protobuf具有很强的实用性。

Protobuf具有序列化后数据量更小、序列化/反序列化速度更快、更简单的特性；而JSON则相反，序列化后数据量较大，序列化和反序列化速度不优的特性，但是前端对JSON是原生支持，对前端极其友好。那么，我们可以在服务之间使用gRPC进行通讯，服务与前端之间可以通过RESTfull进行通讯。

Protobuf和gRPC已经发展了许多年，极其稳定，生态链丰富。它具有强大的工具链可供使用，只要你想得到的，都能够找得到相对应的工具。没有合适的工具也没有关系，它的工具是使用插件方式来实现可扩展性的，因此我们可以容易的开发出自己的工具插件，Kratos就为此开发了自己的一系列的工具插件方便开发使用。

综上，我们可知使用gRPC/protobuf的好处：

1. 一套proto，同时支持gRPC协议和RESTfull协议；
2. 支持多编程语言，适合多语言异构化架构；
3. gRPC协议，数据量小、序列化/反序列化速度更快、更简单，适合服务之间通讯；
4. RESTfull协议，数据量较大、序列化/反序列化速度较慢、前端原生支持JSON，适合同前端的通讯。
5. 强大的工具链，使用插件的方式实现强大的可扩展性，可方便的扩展。

那么，这篇文章将会带来一些什么呢？

1. Protobuf设计API的一丢丢基本知识；
2. 相关工具链的使用方法；
3. 如何实施工程化的方法。

## 工具安装

工欲善其事，必先利其器。

让我们先安装所需要的工具。

### 安装 protoc

protoc是一款用C++编写的工具，其可以将proto文件翻译为指定语言的代码。

具体用法可以使用`protoc --help`命令查看。

#### goctl一键安装

```bash
$ goctl env check -i -f --verbose                                 
[goctl-env]: preparing to check env

[goctl-env]: looking up "protoc"
[goctl-env]: "protoc" is not found in PATH
[goctl-env]: preparing to install "protoc"
"protoc" installed from cache
[goctl-env]: "protoc" is already installed in "/Users/keson/go/bin/protoc"
```

#### macOS安装

```bash
brew install protobuf
```

#### Ubuntu安装

```bash
sudo apt update; sudo apt upgrade
sudo apt install libprotobuf-dev protobuf-compiler
```

#### 非Windows系统源代码安装

1. 进入 [protobuf release](https://github.com/protocolbuffers/protobuf/releases) 下载页面下载；
2. 解压并进入文件夹：
    ```bash
    tar -xzvf protobuf-cpp-x.x.x.tar.gz
    cd protobuf-cpp-x.x.x
    ```
3. 设置编译目录
    ```bash
    ./configure --prefix=/usr/local/protobuf
    ```
4. 安装检测
    ```bash
    make check
    ```
5. 安装及编译
    ```bash
    make && make install
    ```
6. 配置环境变量
    ```bash
    vim ~/.bash_profile
    ```
    在文件结尾添加环境变量
    ```bash
    export PROTOBUF=/usr/local/protobuf
    export PATH=$PATH:$PROTOBUF/bin
    ```
    使用source命令，使配置文件生效
    ```bash
    source ~/.bash_profile
    ```

#### 非Windows系统源二进制文件安装

1. 进入 [protobuf release](https://github.com/protocolbuffers/protobuf/releases) 下载页面，选择适合自己操作系统的压缩包文件下载；
2. 解压文件：
    ```bash
    tar -xzvf protoc-x.x.x-{OS}-x86_64.tar.gz
    ```
3. 拷贝protoc文件
    ```bash
    cd protoc-x.x.x-{OS}-x86_64/bin
    sudo chmod a+x protoc
    mv protoc /usr/local/bin
    ```
4. 拷贝头文件
    ```bash
    cd protoc-x.x.x-{OS}-x86_64/include
    cp google /usr/local/include
    ```

#### Windows安装

在Windows下可以使用包管理器[Choco](https://chocolatey.org/)和[Scoop](https://scoop.sh/)来安装。

- Choco
    ```bash
    choco install protoc
    ```

- Scoop
    ```bash
    scoop bucket add extras
    scoop install protobuf
    ```

### 后端工具

后端工具都可以使用`go install`进行安装：

- 用于生成struct代码：
    ```bash
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    ```
- 用于生成grpc服务代码：
    ```bash
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
    ```
- 用于生成rest服务代码：
    ```bash
	go install github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2@latest
    ```
- 用于生成kratos的错误定义代码：
    ```bash
	go install github.com/go-kratos/kratos/cmd/protoc-gen-go-errors/v2@latest
    ```
- 用于生成消息验证器代码：
    ```bash
	go install github.com/envoyproxy/protoc-gen-validate@latest
    ```
- 用于生成OpenAPI V2文档：
    ```bash
	go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
    ```
- 用于生成OpenAPI V3文档：
    ```bash
    go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
    ```

### 前端工具

这是protobuf.js提供的一个Protobuf转换为Typescript的工具：

```bash
pnpm i pbts -g
```

另，我还找到一个基于pbts开发的在线工具：<https://pb.brandonxiang.top/>

## 设计API

在开始前，首先要说明的是，本文并不是一个Protobuf或者gRPC的教程，这方面，谷歌官方以及其他第三方（gRPC-Gateway）提供的资料已经足够详尽了：

- [Protocol Buffers Documentation](https://developers.google.com/protocol-buffers/docs/overview)
- [gRPC Documentation](https://grpc.io/docs/)
- [gRPC-Gateway Documentation](https://grpc-ecosystem.github.io/grpc-gateway/)

### CURD

在现实场景下，业务代码写得最多的恐怕还属CURD（增、删、改、查）了，不说多，80%是肯定有的，可以说，只要搞定了CURD，就搞定了大部分的业务代码的编写。

以下是一个gRPC官方提供的示例，是一个书店的接口，里面包含了基本的Protobuf的语法和用法，以及gRPC服务和REST服务的设计。

```protobuf
syntax = "proto3";

package endpoints.examples.bookstore;

option java_multiple_files = true;
option java_outer_classname = "BookstoreProto";
option java_package = "com.google.endpoints.examples.bookstore";

option go_package = "endpoints/examples/bookstore;bookstore";


import "google/api/annotations.proto";
import "google/protobuf/empty.proto";

// A simple Bookstore API.
//
// The API manages shelves and books resources. Shelves contain books.
service Bookstore {
  // Returns a list of all shelves in the bookstore.
  rpc ListShelves(google.protobuf.Empty) returns (ListShelvesResponse) {
    // Define HTTP mapping.
    // Client example (Assuming your service is hosted at the given 'DOMAIN_NAME'):
    //   curl http://DOMAIN_NAME/v1/shelves
    option (google.api.http) = { get: "/v1/shelves" };
  }
  // Creates a new shelf in the bookstore.
  rpc CreateShelf(CreateShelfRequest) returns (Shelf) {
    // Client example:
    //   curl -d '{"theme":"Music"}' http://DOMAIN_NAME/v1/shelves
    option (google.api.http) = {
      post: "/v1/shelves"
      body: "shelf"
    };
  }
  // Returns a specific bookstore shelf.
  rpc GetShelf(GetShelfRequest) returns (Shelf) {
    // Client example - returns the first shelf:
    //   curl http://DOMAIN_NAME/v1/shelves/1
    option (google.api.http) = { get: "/v1/shelves/{shelf}" };
  }
  // Deletes a shelf, including all books that are stored on the shelf.
  rpc DeleteShelf(DeleteShelfRequest) returns (google.protobuf.Empty) {
    // Client example - deletes the second shelf:
    //   curl -X DELETE http://DOMAIN_NAME/v1/shelves/2
    option (google.api.http) = { delete: "/v1/shelves/{shelf}" };
  }
}

// A shelf resource.
message Shelf {
  // A unique shelf id.
  int64 id = 1;
  // A theme of the shelf (fiction, poetry, etc).
  string theme = 2;
}

// Response to ListShelves call.
message ListShelvesResponse {
  // Shelves in the bookstore.
  repeated Shelf shelves = 1;
}

// Request message for CreateShelf method.
message CreateShelfRequest {
  // The shelf resource to create.
  Shelf shelf = 1;
}

// Request message for GetShelf method.
message GetShelfRequest {
  // The ID of the shelf resource to retrieve.
  int64 shelf = 1;
}

// Request message for DeleteShelf method.
message DeleteShelfRequest {
  // The ID of the shelf to delete.
  int64 shelf = 1;
}
```

需要说明的是，REST的接口是由`google.api.http`这个`option`提供的。上面这一套接口定义，既可以生成gRPC的服务，又可以生成REST的服务，而这是根据protoc调用的插件决定的，这方面内容不是这部分所要阐述的，暂且不表，且看后面部分。

### Kratos Errors

在实际应用当中，存在着一个问题：gRPC状态码 和 REST HTTP状态码 是不一样的。为了解决这个问题，就需要一个映射表，用来互相转换状态码。

以下就是一个映射表的示例：

```protobuf
syntax = "proto3";

// 定义包名
package api.kratos.v1;
import "errors/errors.proto";

// 多语言特定包名，用于源代码引用
option go_package = "kratos/api/helloworld;helloworld";
option java_multiple_files = true;
option java_package = "api.helloworld";

enum ErrorReason {
  // 设置缺省错误码
  option (errors.default_code) = 500;

  // 为某个枚举单独设置错误码
  USER_NOT_FOUND = 0 [(errors.code) = 404];

  CONTENT_MISSING = 1 [(errors.code) = 400];
}
```

它利用了Protobuf的`enum`和`option`关键字实现了这样一个状态码的映射。再由protoc插件生成的代码实现映射和互换。

### Message Validator

在实际应用当中，需要对接口的参数进行一些校验，比如：用户名的长度只能够大于或者小于某一个长度，身份证、手机号、EMail等特定格式的有效校验。

其实，都不过是一些字符串、数字类型和布尔类型校验的简单规则。如果手写校验代码，都是一些机械无比的重复代码，而且要作修改起来也很痛苦。

那么，有什么办法可以解决这个问题吗？必须有：规则写在Protobuf里面，利用[proto-gen-validate](https://github.com/bufbuild/protoc-gen-validate)插件生成代码，使用 [Kratos Validate 中间件](https://github.com/go-kratos/kratos/tree/main/middleware/validate) 作支持。

以下是`proto-gen-validate`插件的示例接口：

```protobuf
syntax = "proto3";

package examplepb;

import "validate/validate.proto";

message Person {
  uint64 id = 1 [(validate.rules).uint64.gt = 999];

  string email = 2 [(validate.rules).string.email = true];

  string name = 3 [(validate.rules).string = {
    pattern:   "^[^[0-9]A-Za-z]+( [^[0-9]A-Za-z]+)*$",
    max_bytes: 256,
  }];

  Location home = 4 [(validate.rules).message.required = true];

  message Location {
    double lat = 1 [(validate.rules).double = {gte: -90,  lte: 90}];
    double lng = 2 [(validate.rules).double = {gte: -180, lte: 180}];
  }
}
```

只需要利用`validate.rules`option就可以定义规则了，简单明了，又方便。

### OpenAPI

OpenAPI是一个用于描述REST API的描述格式，包含端点、参数、输入输出格式、说明、认证等，本质上它是一个JSON或者YAML格式文档，而文件内的Schema则是有OpenAPI所定义的。

#### OpenAPI JSON范例

以下是一个OpenAPI v3的JSON文件范例：

```json
{
  "openapi": "3.0",
  "info": {
    "version": "1.0.0",
    "title": "OpenAPI Petstore",
    "license": {
      "name": "MIT"
    }
  },
  "servers": [
    {
      "url": "https://petstore.openapis.org/v1",
      "description": "Development server"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "summary": "List all pets",
        "operationId": "listPets",
        "tags": [
          "pets"
        ],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "How many items to return at one time (max 100)",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "An paged array of pets",
            "headers": {
              "x-next": {
                "schema": {
                  "type": "string"
                },
                "description": "A link to the next page of responses"
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Pets"
                }
              }
            }
          },
          "default": {
            "description": "unexpected error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a pet",
        "operationId": "createPets",
        "tags": [
          "pets"
        ],
        "responses": {
          "201": {
            "description": "Null response"
          },
          "default": {
            "description": "unexpected error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/pets/{petId}": {
      "get": {
        "summary": "Info for a specific pet",
        "operationId": "showPetById",
        "tags": [
          "pets"
        ],
        "parameters": [
          {
            "name": "petId",
            "in": "path",
            "required": true,
            "description": "The id of the pet to retrieve",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Expected response to a valid request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Pets"
                }
              }
            }
          },
          "default": {
            "description": "unexpected error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Pet": {
        "required": [
          "id",
          "name"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "tag": {
            "type": "string"
          }
        }
      },
      "Pets": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/Pet"
        }
      },
      "Error": {
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

#### OpenAPI YAML范例

以及OpenAPI v3 的 YAML文件范例：

```yml
openapi: "3.0"
info:
  version: 1.0.0
  title: OpenAPI Petstore
  license:
    name: MIT
servers:
- url: https://petstore.openapis.org/v1
  description: Development server
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      tags:
      - pets
      parameters:
      - name: limit
        in: query
        description: How many items to return at one time (max 100)
        required: false
        schema:
          type: integer
          format: int32
      responses:
        "200":
          description: An paged array of pets
          headers:
            x-next:
              schema:
                type: string
              description: A link to the next page of responses
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pets'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a pet
      operationId: createPets
      tags:
      - pets
      responses:
        "201":
          description: Null response
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /pets/{petId}:
    get:
      summary: Info for a specific pet
      operationId: showPetById
      tags:
      - pets
      parameters:
      - name: petId
        in: path
        required: true
        description: The id of the pet to retrieve
        schema:
          type: string
      responses:
        "200":
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pets'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Pet:
      required:
      - id
      - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
    Pets:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
    Error:
      required:
      - code
      - message
      properties:
        code:
          type: integer
          format: int32
        message:
          type: string
```

#### OpenAPI工具

以上文本当中的Schema，有些可以望文生义，也有一些根本看不出来意义。可是，真要让人去阅读，只会有一个感受：头大。它主要还是给程序读取的，展现在UI之上，才能够真正的应用起来。

现在，市面上有非常非常多的工具可以读取OpenAPI JSON / YAML文档：

- [Swagger UI](https://swagger.io/tools/swagger-ui/) / [SwaggerHub](https://swagger.io/tools/swaggerhub/) / [Swagger Editor](https://editor.swagger.io)
- [Redoc](https://redoc.ly/redoc) / [Redocly](https://redoc.ly/reference-docs)
- [Stoplight Elements](https://stoplight.io/open-source/elements/) / [Stoplight](https://stoplight.io/api-documentation/)
- [ReadMe Documentation](https://readme.com/documentation)
- [Eolink](https://www.eolink.com)
- [YApi](https://github.com/YMFE/yapi)
- [Postman](https://www.postman.com)
- [Apifox](https://www.apifox.cn)

这些工具当中，最常见的是本家的Swagger UI（OpenAPI在成为开放标准之前是Swagger产品线当中的一部分），它经常被内嵌到Web框架里面。

#### Protobuf生成OpenAPI工具

现在OpenAPI有两个版本：v2和v3。

主流的protoc插件也刚好对应有两个：

1. OpenAPI v2使用grpc-gateway出的[protoc-gen-openapiv2](github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2)；
2. OpenAPI v3使用谷歌出品的gnostic下的[protoc-gen-openapi](github.com/google/gnostic/cmd/protoc-gen-openapi)。

正常来说，只要是使用了`google.api.http`这个`option`定义的API，使用这两个插件就能够生成OpenAPI文档。

但是，实际应用中，我们还希望能够提供更多更丰富的一些信息，比如：描述信息、版本号、版权信息、认证信息……显然，光凭着`google.api.http`的定义是不够的。这两个插件提供了各自的`option`，可以定义这些信息。

#### Protobuf中如何定义OpenAPI V2注解

```protobuf
syntax = "proto3";

package grpc.gateway.examples.internal.proto.examplepb;

import "protoc-gen-openapiv2/options/annotations.proto";

option go_package = "github.com/grpc-ecosystem/grpc-gateway/v2/examples/internal/proto/examplepb";
option (grpc.gateway.protoc_gen_openapiv2.options.openapiv2_swagger) = {
  info: {
    title: "A Bit of Everything";
    version: "1.0";
    contact: {
      name: "gRPC-Gateway project";
      url: "https://github.com/grpc-ecosystem/grpc-gateway";
      email: "none@example.com";
    };
    license: {
      name: "BSD 3-Clause License";
      url: "https://github.com/grpc-ecosystem/grpc-gateway/blob/master/LICENSE.txt";
    };
    extensions: {
      key: "x-something-something";
      value {
        string_value: "yadda";
      }
    }
  };
  // Overwriting host entry breaks tests, so this is not done here.
  external_docs: {
    url: "https://github.com/grpc-ecosystem/grpc-gateway";
    description: "More about gRPC-Gateway";
  }
  schemes: HTTP;
  schemes: HTTPS;
  schemes: WSS;
  consumes: "application/json";
  consumes: "application/x-foo-mime";
  produces: "application/json";
  produces: "application/x-foo-mime";
  security_definitions: {
    security: {
      key: "BasicAuth";
      value: {
        type: TYPE_BASIC;
      }
    }
    security: {
      key: "ApiKeyAuth";
      value: {
        type: TYPE_API_KEY;
        in: IN_HEADER;
        name: "X-API-Key";
        extensions: {
          key: "x-amazon-apigateway-authtype";
          value {
            string_value: "oauth2";
          }
        }
        extensions: {
          key: "x-amazon-apigateway-authorizer";
          value {
            struct_value {
              fields {
                key: "type";
                value {
                  string_value: "token";
                }
              }
              fields {
                key: "authorizerResultTtlInSeconds";
                value {
                  number_value: 60;
                }
              }
            }
          }
        }
      }
    }
    security: {
      key: "OAuth2";
      value: {
        type: TYPE_OAUTH2;
        flow: FLOW_ACCESS_CODE;
        authorization_url: "https://example.com/oauth/authorize";
        token_url: "https://example.com/oauth/token";
        scopes: {
          scope: {
            key: "read";
            value: "Grants read access";
          }
          scope: {
            key: "write";
            value: "Grants write access";
          }
          scope: {
            key: "admin";
            value: "Grants read and write access to administrative information";
          }
        }
      }
    }
  }
  security: {
    security_requirement: {
      key: "BasicAuth";
      value: {};
    }
    security_requirement: {
      key: "ApiKeyAuth";
      value: {};
    }
  }
  security: {
    security_requirement: {
      key: "OAuth2";
      value: {
        scope: "read";
        scope: "write";
      }
    }
    security_requirement: {
      key: "ApiKeyAuth";
      value: {};
    }
  }
  responses: {
    key: "403";
    value: {
      description: "Returned when the user does not have permission to access the resource.";
    }
  }
  responses: {
    key: "404";
    value: {
      description: "Returned when the resource does not exist.";
      schema: {
        json_schema: {
          type: STRING;
        }
      }
    }
  }
  responses: {
    key: "418";
    value: {
      description: "I'm a teapot.";
      schema: {
        json_schema: {
          ref: ".grpc.gateway.examples.internal.proto.examplepb.NumericEnum";
        }
      }
    }
  }
  responses: {
    key: "500";
    value: {
      description: "Server error";
      headers: {
        key: "X-Correlation-Id"
        value: {
          description: "Unique event identifier for server requests"
          type: "string"
          format: "uuid"
          default: "\"2438ac3c-37eb-4902-adef-ed16b4431030\""
          pattern: "^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$"
        }
      };
      schema: {
        json_schema: {
          ref: ".grpc.gateway.examples.internal.proto.examplepb.ErrorResponse";
        }
      }
    }
  }
  tags: {
    name: "echo rpc"
    description: "Echo Rpc description"
    extensions: {
      key: "x-traitTag";
      value {
        bool_value: true;
      }
    }
  }
  extensions: {
    key: "x-grpc-gateway-foo";
    value {
      string_value: "bar";
    }
  }
  extensions: {
    key: "x-grpc-gateway-baz-list";
    value {
      list_value: {
        values: {
          string_value: "one";
        }
        values: {
          bool_value: true;
        }
      }
    }
  }
};

message ErrorResponse {
  string correlationId = 1 [(grpc.gateway.protoc_gen_openapiv2.options.openapiv2_field) = {
    pattern: "^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$",
    title: "x-correlation-id",
    description: "Unique event identifier for server requests",
    format: "uuid",
    example: "\"2438ac3c-37eb-4902-adef-ed16b4431030\""
  }];
  ErrorObject error = 2;
}

message ErrorObject {
  int32 code = 1 [(grpc.gateway.protoc_gen_openapiv2.options.openapiv2_field) = {
    pattern: "^[0-9]$",
    title: "code",
    description: "Response code",
    format: "integer"
  }];
  string message = 2 [(grpc.gateway.protoc_gen_openapiv2.options.openapiv2_field) = {
    pattern: "^[a-zA-Z0-9]{1, 32}$",
    title: "message",
    description: "Response message"
  }];
}

// ABitOfEverything service is used to validate that APIs with complicated
// proto messages and URL templates are still processed correctly.
service ABitOfEverythingService {
  option (grpc.gateway.protoc_gen_openapiv2.options.openapiv2_tag) = {
    description: "ABitOfEverythingService description -- which should not be used in place of the documentation comment!"
    external_docs: {
      url: "https://github.com/grpc-ecosystem/grpc-gateway";
      description: "Find out more about EchoService";
    }
  };

  // Create a new ABitOfEverything
  //
  // This API creates a new ABitOfEverything
  rpc Create(ABitOfEverything) returns (ABitOfEverything) {
    option (google.api.http) = {
      post: "/v1/example/a_bit_of_everything/{float_value}/{double_value}/{int64_value}/separator/{uint64_value}/{int32_value}/{fixed64_value}/{fixed32_value}/{bool_value}/{string_value=strprefix/*}/{uint32_value}/{sfixed32_value}/{sfixed64_value}/{sint32_value}/{sint64_value}/{nonConventionalNameValue}/{enum_value}/{path_enum_value}/{nested_path_enum_value}/{enum_value_annotation}"
    };
  }
  rpc CreateBody(ABitOfEverything) returns (ABitOfEverything) {
    option (google.api.http) = {
      post: "/v1/example/a_bit_of_everything"
      body: "*"
    };
  }
}
```

#### Protobuf中如何定义OpenAPI V3注解

```protobuf
syntax = "proto3";

package tests.openapiv3annotations.message.v1;

import "google/api/annotations.proto";
import "openapiv3/annotations.proto";

option go_package = "github.com/google/gnostic/apps/protoc-gen-openapi/examples/tests/openapiv3annotations/message/v1;message";

option (openapi.v3.document) = {
  info: {
    title: "Title from annotation";
    version: "Version from annotation";
    description: "Description from annotation";
    contact: {
      name: "Contact Name";
      url: "https://github.com/google/gnostic";
      email: "gnostic@google.com";
    }
    license: {
      name: "Apache License";
      url: "https://github.com/google/gnostic/blob/master/LICENSE";
    }
  }
  components: {
    security_schemes: {
      additional_properties: [
        {
          name: "BasicAuth";
          value: {
            security_scheme: {
              type: "http";
              scheme: "basic";
            }
          }
        }
      ]
    }
  }
};

service Messaging1 {
  rpc UpdateMessage(Message) returns(Message) {
    option(google.api.http) = {
        patch: "/v1/messages/{message_id}"
        body: "*"
    };
    option(openapi.v3.operation) = {
        security: [
          {
            additional_properties: [
              {
                name: "BasicAuth";
                value: {
                  value: []
                }
              }
            ]
          }
        ]
    };
  }
}

service Messaging2 {
  rpc UpdateMessage(Message) returns (Message) {}
}

message Message {
  option (openapi.v3.schema) = {
    title: "This is an overridden message schema title";
  };

  int64 id = 1;
  string label = 2 [
    (openapi.v3.property) = {
      title: "this is an overriden field schema title";
      max_length: 255;
    }
  ];
}
```

## 代码生成

Protobuf生成目标语言的代码使用的工具是protoc，它是基于插件机制开发的，实际生成代码全靠插件。

### 插件生成文件一览表

|   插件名  |   生成文件名  |
|-----|-----|
|  [protoc-gen-go](google.golang.org/protobuf/cmd/protoc-gen-go)   |   XXXXX.pb.go  |
|  [protoc-gen-go-grpc](google.golang.org/grpc/cmd/protoc-gen-go-grpc)   |  XXXXXX_grpc.pb.go  |
|   [protoc-gen-go-http](github.com/go-kratos/kratos/cmd/protoc-gen-go-http)  |  XXXXXX_http.pb.go  |
|   [protoc-gen-go-errors](github.com/go-kratos/kratos/cmd/protoc-gen-go-errors)  |  XXXXXX_errors.pb.go   |
|   [protoc-gen-validate](github.com/bufbuild/protoc-gen-validate)  |  XXXXXX.pb.validate.go   |
|   [protoc-gen-openapiv2](github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2)  |   XXXXXX.swagger.json  |
|   [protoc-gen-openapi](github.com/google/gnostic/cmd/protoc-gen-openapi)  |   openapi.yaml  |

这里要提醒一下，细心的你一定会发现，生成OpenAPI文档的参数里面各有一个`--openapiv2_opt json_names_for_fields=true`和`--openapi_out=naming=json`，这两个参数的作用是一样的，那么它们是做什么用的呢？我们先来看下面这个消息定义：

```protobuf
// NonStandardMessageWithJSONNames maps odd field names to odd JSON names for maximum confusion.
message NonStandardMessageWithJSONNames {
  // Id represents the message identifier.
  string id = 1 [json_name = "ID"];
  int64 Num = 2 [json_name = "Num"];
  int64 line_num = 3 [json_name = "LineNum"];
  string langIdent = 4 [json_name = "langIdent"];
  string STATUS = 5 [json_name = "status"];
  int64 en_GB = 6 [json_name = "En_GB"];
  string no = 7 [json_name = "yes"];

  message Thing {
    message SubThing {
      string sub_value = 1 [json_name = "sub_Value"];
    }
    SubThing subThing = 1 [json_name = "SubThing"];
  }
  Thing thing = 8 [json_name = "Thingy"];
}
```

你一定发现了`json_name`这个参数，没错，就是为了它，proto那两个参数就是它的开关。如果，字段定义了`json_name`参数之后，REST的JSON字段名便会采用`json_name`所定义的字段名。这是一个非常有用的特性，因为前后端的命名规则不一致是常态，golang用的是驼峰命名法，而前端用蛇形命名法的是很多，这就可以用上了。

### 生成代码的命令

#### 生成 基础类型的GO代码

```bash
protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto
```

以上命令主要是struct和enum等基础类型

#### 生成 grpc 服务的GO代码

```bash
protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto
```

#### 生成 rest 服务的GO代码

```bash
protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto
```

#### 生成 gRPC状态码映射的GO代码

```bash
protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto
```

#### 生成 参数校验的GO代码

```bash
protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto
```

#### 生成 OpenAPI v2 json文档

```bash
protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
```

#### 生成 OpenAPI v3 yaml文档

```bash
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto
```

## 实施工程化

好，我们现在已经知道如何去生成API的代码和文档了。但是，这还远远不够。因为我们不可能每次都去手打命令生成代码，这是不科学，不人道的，不现实的。

我们需要工程化，使之可管理。CI/CD、自动化也能够实现。

首先，我们把可用的方法列举出来，然后再一个个的讲解各个方法：

1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）；
2. Makefile；
3. go:generate注解；
4. buf.build。

**结论在前：推荐使用[buf.build](https://buf.build/)**

### 1. BAT批处理脚本（Windows）或者Shell脚本（非Windows）

#### BAT批处理脚本

```shell
:: generate go struct code
protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto
    
:: generate grpc service code
protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto
    
:: generate rest service code
protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto
    
:: generate kratos errors code
protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto
    
:: generate message validator code
protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto
    
:: generate openapi v2 json doc
protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
    
:: generate openapi v3 yaml doc
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto
```

#### Shell脚本

```shell
#!/bin/bash

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
    
# generate openapi v2 json doc
protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
    
# generate openapi v3 yaml doc
protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto
```

这个方法除了能用，没有别的好处了。它需要在每一组proto文件的同级目录下都冗余放一对脚本，如果要执行所有的生成脚本，另外还需要写一个脚本来调用生成脚本，维护起来很痛苦。

### 2. Makefile

[Kratos官方layout](https://github.com/go-kratos/kratos-layout)就是使用的Makefile的方法来生成代码的。

它在根目录下的Makefile文件里：

```makefile
.PHONY: api
# generate api proto
api:
	protoc --proto_path=./api \
	       --proto_path=./third_party \
 	       --go_out=paths=source_relative:./api \
 	       --go-http_out=paths=source_relative:./api \
 	       --go-grpc_out=paths=source_relative:./api \
	       --openapi_out=fq_schema_naming=true,default_response=false:. \
	       $(API_PROTO_FILES)

.PHONY: conf
# generate config define code
conf:
	protoc --proto_path=. \
	       --proto_path=../../../third_party \
	       --go_out=paths=source_relative:. \
	       ./internal/conf/*.proto
```

根目录下的Makefile由`app\{服务名}\service\Makefile`引用，调用者在服务目录`app\{服务名}\service\`下调用`make api`执行代码生成。

这个方法很有局限性，掣手掣脚，你只能够依照严格的固定的项目结构来，只要有一些变动就完犊子了。

MonoRepo的项目结构下，因为会有多个Makefile入口，所以没办法一键执行全部的Makefile，必须借助第三方工具，比如Shell脚本。偷懒如我，总觉得很麻烦。

### 3. go:generate注解

go1.4版本之后，可以通过`go generate`命令执行一些`go:generate`注解下的预处理命令，可以拿来生成API代码之用。因为在非Windows系统下，命令如果带通配符，会执行出错，需要加`sh -c`才行，而Windows系统不存在这样的问题，可以直接执行，所以需要使用`go:build`注解来区分操作系统，`go generate`命令会根据操作系统执行相对应的go代码文件。所以，我写了两个go文件：

#### generate_windows.go

```go
//go:build windows

// generate go struct code
//go:generate protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto

// generate grpc service code
//go:generate protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto

// generate rest service code
//go:generate protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto

// generate kratos errors code
//go:generate protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto

// generate message validator code
//go:generate protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto

// generate openapi v2 json doc
//go:generate protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto

// generate openapi v3 yaml doc
//go:generate protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto

package api
```

#### generate_xnix.go

```go
//go:build !windows
// +build !windows

// generate go struct code
//go:generate sh -c "protoc --proto_path=. --go_out=paths=source_relative:../ ./*.proto"

// generate grpc service code
//go:generate sh -c "protoc --proto_path=. --go-grpc_out=paths=source_relative:../ ./*.proto"

// generate rest service code
//go:generate sh -c "protoc --proto_path=. --go-http_out=paths=source_relative:../ ./*.proto"

// generate kratos errors code
//go:generate sh -c "protoc --proto_path=. --go-errors_out=paths=source_relative:../ ./*.proto"

// generate message validator code
//go:generate sh -c "protoc --proto_path=. --validate_out=paths=source_relative,lang=go:../ ./*.proto"

// generate openapi v2 json doc
//go:generate sh -c "protoc --proto_path=. --openapiv2_out=paths=source_relative:../ --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto"

// generate openapi v3 yaml doc
//go:generate sh -c "protoc --proto_path=. --openapi_out=naming=json=paths=source_relative:../ ./*.proto"

package api
```

它可以很好的完成生成代码的任务。主流的IDE（Goland、VSC）都可以很好的支持编辑界面执行注解。

要自动化吧，也能实现，只要在项目根目录执行`go generate ./...`就能够执行整个项目的`go:generate`注解。

但是，有一个很大的问题，它需要在每一组proto文件的同级目录下冗余一套go代码，维护起来就比较糟心了。

### 4. buf.build

[buf.build](https://docs.buf.build/)是专门用于构建protobuf API的工具。

它总共有3组配置文件：`buf.work.yaml`、`buf.gen.yaml`、`buf.yaml`。

另外，还有一个`buf.lock`文件，但是它不需要进行人工配置，它是由`buf mod update`命令所生成。这跟前端的npm、yarn等的lock文件差不多，golang的`go.sum`也差不多。

它的配置文件不多，也不复杂，维护起来非常方便，支持远程proto插件，支持远程第三方proto。对构建系统Bazel支持很好，对CI/CD系统也支持得很好。它还有很多优秀的特性。

buf.build非常棒，用它，很方便。值得使用，值得推荐。

#### buf.work.yaml

它一般放在项目的根目录下面，它代表的是一个工作区，通常一个项目也就一个该配置文件。

该配置文件最重要的就是`directories`配置项，列出了要包含在工作区中的模块的目录。目录路径必须相对于`buf.work.yaml`，像`../external`就是一个无效的配置。

```yml
version: v1

directories:
  - api
```

#### buf.gen.yaml

它一般放在`buf.work.yaml`的同级目录下面，它主要是定义一些protoc生成的规则和插件配置。

```yml
# 配置protoc生成规则
version: v1

managed:
  enabled: false

plugins:
  # generate go struct code
  - name: go
    out: gen/api/go
    opt: paths=source_relative

  # generate grpc service code
  - name: go-grpc
    out: gen/api/go
    opt:
      - paths=source_relative

  # generate rest service code
  - name: go-http
    out: gen/api/go
    opt:
      - paths=source_relative

  # generate kratos errors code
  - name: go-errors
    out: gen/api/go
    opt:
      - paths=source_relative

  # generate message validator code
  - name: validate
    out: gen/api/go
    opt:
      - paths=source_relative
      - lang=go
```

#### buf.yaml

它放置的路径，你可以视之为`protoc`的`--proto-path`参数指向的路径，也就是proto文件里面`import`的相对路径。

需要注意的是，`buf.work.yaml`的同级目录必须要放一个该配置文件。

该配置文件的内容通常来说都是下面这个配置，不需要做任何修改，需要修改的情况不多。

```yml
version: v1

deps:
  - 'buf.build/googleapis/googleapis'
  - 'buf.build/envoyproxy/protoc-gen-validate'
  - 'buf.build/kratos/apis'
  - 'buf.build/gnostic/gnostic'
  - 'buf.build/gogo/protobuf'

breaking:
  use:
    - FILE

lint:
  use:
    - DEFAULT
```

#### buf的IDE插件安装

在IDE里面（VSC和Goland），远程的proto源码库会被拉取到本地的缓存文件夹里面，而这IDE并不知道，故而无法解析到依赖到的proto文件，但是，Buf官方提供了插件，可以帮助IDE读取并解析proto文件，并且自带Lint。

- VSC的Buf插件: <https://marketplace.visualstudio.com/items?itemName=bufbuild.vscode-buf>
- Goland的Buf插件：<https://plugins.jetbrains.com/plugin/19147-buf-for-protocol-buffers>

#### 使用Buf生成代码

我有开源了一个Kratos的CMS项目[kratos-blog](https://github.com/tx7do/go-wind-cms)，它是一个MonoRepo结构的项目，我们以它的项目结构来做讲解。

下面的目录树，是我化简后的目录树。

```bash
.
├── buf.work.yaml
├── buf.gen.yaml
├── buf.yaml
├── buf.lock
├── api
│   ├── admin
│   │   └── service
│   │       └── v1
│   │           └── admin_errors.proto
│   │           └── buf.openapi.gen.yaml
│   │           └── i_user.proto
│   └── buf.yaml
```

大家可以看到，总共所需求的配置文件并不多。

`buf.build`使用`buf generate`命令进行构建，调用该命令必须在`buf.work.yaml`的同级目录下。执行了`buf generate`命令之后，将会在根目录下产生一个`gen/api/go`的文件夹，生成的代码都将被放在了这个目录下。

细心的你肯定早就发现了在`api/admin/service/v1`下面有一个`buf.openapi.gen.yaml`的配置文件，这是什么配置文件呢？我现在把该配置文件放出来：

```yml
# 配置protoc生成规则
version: v1

managed:
  enabled: true
  optimize_for: SPEED

  go_package_prefix:
    default: kratos-monolithic-demo/gen/api/go
    except:
      - 'buf.build/googleapis/googleapis'
      - 'buf.build/envoyproxy/protoc-gen-validate'
      - 'buf.build/kratos/apis'
      - 'buf.build/gnostic/gnostic'
      - 'buf.build/gogo/protobuf'
      - 'buf.build/tx7do/pagination'

plugins:
  # generate openapi v2 json doc
#  - name: openapiv2
#    out: ./app/admin/service/cmd/server/assets
#    opt:
#      - json_names_for_fields=true
#      - logtostderr=true

  # generate openapi v3 yaml doc
  - name: openapi
    out: ./app/admin/service/cmd/server/assets
    opt:
      - naming=json # 命名约定。使用"proto"则直接从proto文件传递名称。默认为：json
      - depth=2 # 循环消息的递归深度，默认为：2
      - default_response=false # 添加默认响应消息。如果为“true”，则自动为使用google.rpc.Status消息的操作添加默认响应。如果您使用envoy或grpc-gateway进行转码，则非常有用，因为它们使用此类型作为默认错误响应。默认为：true。
      - enum_type=string # 枚举类型的序列化的类型。使用"string"则进行基于字符串的序列化。默认为：integer。
      - output_mode=merged # 输出文件生成模式。默认情况下，只有一个openapi.yaml文件会生成在输出文件夹。使用“source_relative”则会为每一个'[inputfile].proto'文件单独生成一个“[inputfile].openapi.yaml”文件。默认为：merged。
      - fq_schema_naming=false # Schema的命名是否加上包名，为true，则会加上包名，例如：system.service.v1.ListDictDetailResponse，否则为：ListDictDetailResponse。默认为：false。
```

它是为了生成[OpenAPI v3文档](https://openapi.apifox.cn/)。我之前尝试了放在根目录下的`buf.gen.yaml`，但是产生了一个问题，因为我可能一个项目里面有多个BFF服务程序，我不可能一股脑全部输出到一个openapi.yaml里面。虽然，它也可以每一个proto各自生成一个`[inputfile].openapi.yaml`，但是，这样显得太乱了，而且，我没有办法用。所以，没辙，只能单独对待了——每个BFF服务独立生成一个文档。

那么，怎么使用这个配置文件呢？还是使用`buf generate`命令，该命令还是需要在项目根目录下执行，但是得带`--template`参数去引入`buf.openapi.gen.yaml`这个配置文件：

```bash
buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml
```

最终，在`./app/admin/service/cmd/server/assets`这个目录下面，将会生成出来一个文件名为`openapi.yaml`的文件。

### 与前端协同

API并不是给后端自己把玩的玩物，还需要提供给前端调用的。

要与前端协同，无非就是为前端提供API文档。有两种途径可以达成这个目标：

1. 提供OpenAPI文档；
2. 通过Protobuf生成TypeScript或者Javascript代码。

方法2是我一开始使用的方法，我使用了[pbts](https://www.npmjs.com/package/pbts?activeTab=readme)，它是[ProtoBuf.js](https://github.com/protobufjs/protobuf.js/)提供的一个Protobuf转Typescript的工具。它可以把Schema转换成Typescript代码。在初期，它的确给予了我一定的支撑。但是，它的缺陷很大，很多Protobuf的语法识别不了，很多内容都导出不了，比如：访问路径导出不了、`gnostic/openapi`的标签被识别为错误语法。总之，也就是一个聊胜于无的工具。可是，它还是无法成为真正有力的生产力工具。

后来，我仔细的研究了OpenAPI。发现，它保存了最为完整的API信息。而且，OpenAPI文档是前端最为熟悉的API文档。给前端使用的工具也相当之多。

我研究了很多的语言的很多Web框架，发现，大家都会将Swagger UI内嵌到项目里面，提供一个在线的文档。我体验了整个的开发流程之后，认可了这种方式提供OpenAPI文档：

首先，它能够保证提供的文档和在线跑的服务提供的API是一致的。

其次，一切都是全自动的，一切都由框架提供支持，不需要自己为此做任何支持性的工作。比如，生成文档，拷贝文档……

最后，在线的方式的好处是，前后端都可以利用Swagger UI来查看API文档，调试接口。OpenAPI文档，也可以在线拿取到，如果前端不适应、不喜欢用Swagger UI，那么他也可以导入到其他的工具里面去，比如：Apifox、PostMan……

#### 怎样内嵌Swagger UI

Kratos官方本来是有一个[swagger-api](https://github.com/go-kratos/swagger-api)的项目的（现在已经被归档了），集成的是OpenAPI v2的Swagger UI。这个项目呢，不好使，我在应用中，经常会读不出来OpenAPI的文档。还有就是OpenAPI v2不如v3功能强大。

因为没有支持，而我又需要跟前端进行沟通，所以我只好生成出OpenAPI文档之后，自行导入到ApiFox里面去使用，ApiFox呢，挺好的，支持文件和在线两种方式导入，文档管理，接口测试的功能也都很强大。但是总是要去费神导出文档，这很让人抗拒——在开发的初期，接口变动是很高频的行为——难道就不能够全自动吗？程序只要一发布，接口就自动的跟随程序一起发布出去了。

对，说的就是集成Swagger UI。

为了做到这件事，我需要做这么几件事情：

1. 把Buf生成OpenAPI文档，编译运行程序写进MakeFile里面；
2. 利用golang的`Embedding Files`特性，把`openapi.yaml`嵌入到服务程序里面；
3. 集成Swagger UI到项目，并且读取内嵌的`openapi.yaml`文档。

那么，我们首先开始编写Makefile：

```makefile
# generate protobuf api go code
api:
	buf generate

# generate OpenAPI v3 docs.
openapi:
	buf generate --path api/admin/service/v1 --template api/admin/service/v1/buf.openapi.gen.yaml
	buf generate --path api/front/service/v1 --template api/front/service/v1/buf.openapi.gen.yaml

# run application
run: api openapi
	@go run ./cmd/server -conf ./configs
```

这样我们只需要运行`make openapi`就执行OpenAPI的生成了，调试运行的时候，输入`make run`命令就可以生成OpenAPI并运行程序。

Makefile写好了，现在我们来到`./app/admin/service/cmd/server/assets`这个目录下面，我们在这个目录下面创建一个名为`assets.go`的代码文件：

```go
package assets

import _ "embed"

//go:embed openapi.yaml
var OpenApiData []byte
```

就这样，我们就把openapi.yaml内嵌进程序了。

最后，我们就需要来集成Swagger UI进来了。我为此封装了一个项目，要使用它，我们需要安装依赖库：

```bash
go get -u github.com/tx7do/kratos-swagger-ui
```

在创建REST服务器的地方调用程序包里面的方法：

```go
package server

import (
	rest "github.com/go-kratos/kratos/v2/transport/http"
	swaggerUI "github.com/tx7do/kratos-swagger-ui"

    "kratos-cms/app/admin/service/cmd/server/assets"
)

func NewRESTServer() *rest.Server {
	srv := CreateRestServer()

    swaggerUI.RegisterSwaggerUIServerWithOption(
        srv,
        swaggerUI.WithTitle("Admin Service"),
        swaggerUI.WithMemoryData(assets.OpenApiData, "yaml"),
    )
}
```

自此我们就大功告成了！

假如API服务的端口是8080，那么我们可以访问链接来访问Swagger UI：

<http://localhost:8080/docs/>

同时，openapi.yaml文件也可以在线访问到：

<http://localhost:8080/docs/openapi.yaml>

## 参考资料

- [mac安装包安装 protoc](https://segmentfault.com/a/1190000039732564)
- [OpenAPI 打通前後端任督二脈](https://editor.leonh.space/2022/openapi/)
- [什么是 Swagger](https://apifox.com/apiskills/what-is-swagger/)
- [OpenAPI 规范（中文版）](https://openapi.apifox.cn/)
- [Swagger-UI 介绍及基本使用指南](https://developer.aliyun.com/article/1157293)
