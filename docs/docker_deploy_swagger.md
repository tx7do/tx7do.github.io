# 用Docker轻松搭建Swagger环境

## 概要

我将介绍如何构建运行在 Docker 上的 Swagger 环境。

## 成果

### Swagger Editor

网页的左侧是编辑器，右侧是Swagger UI，可以实时查看notation和查看定义文档。
如果将稍后描述的示例复制并粘贴到左侧，结果将显示在右侧，所以请尝试一下。

![swagger_editor](/assets/images/swagger/swagger_editor.png)

### Swagger UI

![swagger_ui](/assets/images/swagger/swagger_ui.png)

### API

访问网址：<http://localhost:8003/users>

```json
[{"id":100,"name":"Taro","status":"pending"}]
```

## 测试环境

- macOS Big Sur 11.4
- Docker 20.10.7
- Docker Compose version v2.0.0-beta.6

## 所需文件

这次只准备了以下2个文件！

```bash
.
├── api
│   └── openapi.yaml
└── docker-compose.yml
```

## 步骤

### 1.创建docker-compose.yml

这一次，我们将为 swagger 编辑器、UI 和 API 模拟准备容器。

```yml
version: '3.9'

services:
  swagger-editor:
    image: swaggerapi/swagger-editor
    container_name: "swagger-editor"
    ports:
      - "8001:8080"

  swagger-ui:
    image: swaggerapi/swagger-ui
    container_name: "swagger-ui"
    ports:
      - "8002:8080"
    volumes:
      - ./api/openapi.yaml:/openapi.yaml
    environment:
      SWAGGER_JSON: /openapi.yaml

  swagger-api:
    image: stoplight/prism:3
    container_name: "swagger-api"
    ports:
      - "8003:4010"
    command: mock -h 0.0.0.0 /openapi.yaml
    volumes:
      - ./api/openapi.yaml:/openapi.yaml
```

### 2.创建openapi.yaml

为示例准备 API 设计文档。
基于此

```yml
openapi: 3.0.0
info:
  version: 1.0.0
  title: Sample API
  description: >-
    A sample API that uses a sample-site as an example to demonstrate features in
    the OpenAPI 3.0 specification
servers:
  - url: 'http://localhost:8003'
paths:
  /users:
    get:
      description: >
        Returns all users
      operationId: findUsers
      parameters:
        - name: tags
          in: query
          description: tags to filter by
          required: false
          style: form
          schema:
            type: array
            items:
              type: string
        - name: limit
          in: query
          description: maximum number of results to return
          required: false
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: user response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    User:
      type: "object"
      required:
        - "name"
      properties:
        id:
          type: "integer"
          format: "int64"
          example: 100
        name:
          type: "string"
          example: "Taro"
        status:
          type: "string"
          description: "user status"
          enum:
            - "pending"
            - "active"
            - "inactive"
    Error:
      type: "object"
      properties:
        code:
          type: "integer"
          format: "int32"
        type:
          type: "string"
        message:
          type: "string"
externalDocs:
  description: "Find out more about Swagger"
  url: "http://swagger.io"
```

## 启动

```bash
docker-compose up -d
```

确认用URL

|   名称  |   网址  |
|-----|-----|
|  Swagger Editor   |   http://localhost:8001/  |
|  Swagger UI   |   	http://localhost:8002/  |
|   Swagger API 模拟访问  |   http://localhost:8003/users  |

## 参考资料

- [OpenAPI (Swagger) 超入門](https://qiita.com/teinen_qiita/items/e440ca7b1b52ec918f1b#components)
- [Swagger OpenAPIでAPI Referenceを書く](https://system.blog.uuum.jp/entry/2020/02/26/185753)

## 原文

翻译自：[DockerでSwagger環境簡単構築！](https://qiita.com/A-Kira/items/3d17396c7cc98873e29d)
