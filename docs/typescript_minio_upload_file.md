# JavaScript/TypeScript 前端实现文件上传到 MinIO 完整指南

以往前端实现文件上传到服务端，常用方案为 HTTP 上传或 FTP 上传，但这两种方式均存在明显短板：HTTP 上传易受网络波动影响，可靠性较差；FTP 配置复杂且安全性不足。随着对象存储服务（Object Storage Service, OSS）的普及，这一问题得到了有效解决。
对象存储（基于对象的存储）是一种专为海量非结构化数据设计的存储架构。与传统存储不同，它将数据封装为独立对象，捆绑元数据和唯一标识符，便于快速查找与访问。OSS 提供与平台无关的 RESTful API 接口，支持在任意应用、任意时间、任意地点存储和访问各类数据。

目前主流的开源 OSS 方案包括 [MinIO][1]和[Ceph][2]。其中 MinIO 凭借轻量、易用、兼容 S3 接口等优势，使用率持续攀升，成为开源对象存储的首选方案之一。本文将详细介绍如何基于 JavaScript/TypeScript 前端实现文件上传到 MinIO。

## 一、什么是 MinIO？

官方定义：[MinIO][1] 是基于 Apache License v2.0 开源协议，采用 Golang 开发的对象存储服务。

它完全兼容亚马逊 S3 云存储服务接口，特别适合存储图片、视频、日志文件、备份数据、容器/虚拟机镜像等大容量非结构化数据，支持单个对象文件从几 KB 到 5T 的大小范围。

MinIO 具备轻量特性，可轻松与 NodeJS、Redis、MySQL 等应用集成。同时，它通过纠删码（erasure code）和校验和（checksum）保障数据安全——即使丢失一半数量（N/2）的硬盘，仍可完整恢复数据。

## 二、本地 Docker 部署 MinIO 测试服务

通过 Docker 可快速部署 MinIO 测试环境，步骤如下：

```shell
# 拉取最新版 MinIO 镜像
docker pull bitnami/minio:latest

# 启动 MinIO 容器
# 注意：MINIO_ROOT_USER 至少 3 个字符，MINIO_ROOT_PASSWORD 至少 8 个字符
# 首次运行后服务可能自动关闭，手动重启容器即可正常使用
docker run -itd \
    --name minio-server \
    -p 9000:9000 \  # API 端口
    -p 9001:9001 \  # 控制台端口
    --env MINIO_SERVER_URL="http://127.0.0.1:9000" \
    --env MINIO_BROWSER_REDIRECT_URL="http://127.0.0.1:9001" \    
    --env MINIO_ROOT_USER="root" \
    --env MINIO_ROOT_PASSWORD="123456789" \
    --env MINIO_DEFAULT_BUCKETS='images' \  # 自动创建名为 images 的存储桶
    --env MINIO_FORCE_NEW_KEYS="yes" \
    --env BITNAMI_DEBUG=true \
    bitnami/minio:latest
```

## 三、TypeScript 实现文件上传的核心方案

前端基于 TypeScript 上传文件到 MinIO，核心有三种 HTTP 请求方案可选，分别适配不同开发场景：

1. [XMLHttpRequest][3]：传统方案，兼容性好，支持进度监听等细粒度控制
2. [Fetch API][4]：现代浏览器原生支持，基于 Promise，语法更简洁
3. [Axios][5]：第三方 HTTP 库，支持拦截器、取消请求等增强功能，生态完善

### 3.1 XMLHttpRequest 实现

```typescript
function xhrUploadFile(file: File, url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true);
  xhr.send(file);

  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(`${file.name} 上传成功`);
    } else {
      console.error(`${file.name} 上传失败`);
    }
  };
}
```

### 3.2 Fetch API 实现

```typescript
function fetchUploadFile(file: File, url: string) {
  fetch(url, {
    method: 'PUT',
    body: file,
  })
    .then((response) => {
      console.log(`${file.name} 上传成功`, response);
    })
    .catch((error) => {
      console.error(`${file.name} 上传失败`, error);
    });
}
```

### 3.3 Axios 实现

```typescript
function axiosUploadFile(file: File, url: string) {
  const instance = axios.create();
  instance
    .put(url, file, {
      headers: {
        'Content-Type': file.type, // 需指定文件真实 Content-Type
      },
    })
    .then(function (response) {
      console.log(`${file.name} 上传成功`, response);
    })
    .catch(function (error) {
      console.error(`${file.name} 上传失败`, error);
    });
}
```

## 四、MinIO 上传 API 选型：安全优先

MinIO 提供 4 种核心上传 API，需根据安全性和使用场景选择：

1. [putObject][7]：从流上传
2. [fPutObject][8]：从文件上传
3. [PresignedPutObject][9]：生成临时 PUT 预签名 URL，用于前端上传
4. [PresignedPostPolicy][10]：生成临时 POST 预签名 URL，用于前端上传

关键选型说明：

使用 putObject 和 fPutObject 时，需在前端暴露 MinIO 的访问密钥（Access Key/Secret Key），存在严重安全隐患；且 MinIO 官方 JavaScript 客户端未针对浏览器环境适配，因此不推荐前端直接使用这两种方案。

PresignedPutObject 和 PresignedPostPolicy 方案通过服务端生成临时预签名 URL，前端仅需使用该临时 URL 上传文件，无需暴露核心密钥，安全性极高，因此本文重点讲解这两种方案。

> MinIO 官方关于预签名 URL 上传的详细说明：[Upload Files Using Pre-signed URLs][6]

## 五、前后端完整实现

整体架构：前端通过调用后端接口获取 MinIO 预签名 URL，再通过该 URL 直接将文件上传到 MinIO。其中后端采用 Go + Gin 框架实现，负责 MinIO 客户端封装和预签名 URL 生成。

### 5.1 Go 后端实现

首先封装 MinIO 客户端，统一管理连接和预签名 URL 生成逻辑：

```go
package minio

import (
	"context"
	"log"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const (
	defaultExpiryTime = time.Second * 24 * 60 * 60 // 1 day

	endpoint        string = "localhost:9000"
	accessKeyID     string = "root"
	secretAccessKey string = "123456789"
	useSSL          bool   = false
)

type Client struct {
	cli *minio.Client
}

func NewMinioClient() *Client {
	cli, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalln(err)
	}

	return &Client{
		cli: cli,
	}
}

func (c *Client) PostPresignedUrl(ctx context.Context, bucketName, objectName string) (string, map[string]string, error) {
	expiry := defaultExpiryTime

	policy := minio.NewPostPolicy()
	_ = policy.SetBucket(bucketName)
	_ = policy.SetKey(objectName)
	_ = policy.SetExpires(time.Now().UTC().Add(expiry))

	presignedURL, formData, err := c.cli.PresignedPostPolicy(ctx, policy)
	if err != nil {
		log.Fatalln(err)
		return "", map[string]string{}, err
	}

	return presignedURL.String(), formData, nil
}

func (c *Client) PutPresignedUrl(ctx context.Context, bucketName, objectName string) (string, error) {
	expiry := defaultExpiryTime

	presignedURL, err := c.cli.PresignedPutObject(ctx, bucketName, objectName, expiry)
	if err != nil {
		log.Fatalln(err)
		return "", err
	}

	return presignedURL.String(), nil
}
```

然后实现 HTTP 接口，对外提供预签名 URL 获取服务：

```go
package http

import (
	"context"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"main/minio"
	"net/http"
)

type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func ResponseJSON(c *gin.Context, httpCode, errCode int, msg string, data interface{}) {
	c.JSON(httpCode, Response{
		Code: errCode,
		Msg:  msg,
		Data: data,
	})
	return
}

type Server struct {
	srv         *gin.Engine
	minioClient *minio.Client
}

func NewHttpServer() *Server {
	srv := &Server{
		srv:         gin.New(),
		minioClient: minio.NewMinioClient(),
	}

	srv.init()

	return srv
}

func (s *Server) init() {
	s.srv.Use(
		gin.Logger(),
		gin.Recovery(),
		cors.Default(),
	)
	s.registerRouter()
}

func (s *Server) registerRouter() {
	s.srv.GET("/presignedPutUrl/:filename", s.handlePutPresignedUrl)
	s.srv.GET("/presignedPostUrl/:filename", s.handlePostPresignedUrl)
}

func (s *Server) handlePutPresignedUrl(c *gin.Context) {
	fileName := c.Param("filename")

	presignedURL, err := s.minioClient.PutPresignedUrl(context.Background(), "images", fileName)
	if err != nil {
		c.String(500, "get presigned url failed")
		return
	}

	type ResponseData struct {
		Url string `json:"url"`
	}
	var resp ResponseData
	resp.Url = presignedURL
	ResponseJSON(c, http.StatusOK, 200, "", resp)
}

func (s *Server) handlePostPresignedUrl(c *gin.Context) {
	fileName := c.Param("filename")

	presignedURL, formData, err := s.minioClient.PostPresignedUrl(context.Background(), "images", fileName)
	if err != nil {
		c.String(500, "get presigned url failed")
		return
	}

	type ResponseData struct {
		Url      string            `json:"url"`
		FormData map[string]string `json:"formData"`
	}
	var resp ResponseData
	resp.Url = presignedURL
	resp.FormData = formData
	ResponseJSON(c, http.StatusOK, 200, "", resp)
}

func (s *Server) Run() {
	// Listen and serve on 0.0.0.0:8080
	_ = s.srv.Run(":8080")
}
```

### 5.2 前端 PUT 方式上传实现

封装三种 PUT 上传方案（XMLHttpRequest/Fetch/Axios），并通过后端接口获取预签名 URL：

```typescript
import axios from 'axios';

export class PutFile {
  static xhr(file: File, url: string) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.send(file);

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        console.log(`[${xhr.status}] ${file.name} 上传成功`);
      } else {
        console.error(`[${xhr.status}] ${file.name} 上传失败`);
      }
    };
  }

  static fetch(file: File, url: string) {
    fetch(url, {
      method: 'PUT',
      body: file,
    })
      .then((response) => {
        console.log(`${file.name} 上传成功`, response);
      })
      .catch((error) => {
        console.error(`${file.name} 上传失败`, error);
      });
  }

  static axios(file: File, url: string) {
    axios
      .put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      .then(function (response) {
        console.log(`${file.name} 上传成功`, response);
      })
      .catch(function (error) {
        console.error(`${file.name} 上传失败`, error);
      });
  }
}

export function retrievePutUrl(file: File, cb: (file: File, url: string) => void) {
  const url = `http://localhost:8080/presignedPutUrl/${file.name}`;
  axios.get(url)
    .then(function (response) {
      cb(file, response.data.data.url);
    })
    .catch(function (error) {
      console.error(error);
    });
}

export function xhrPutFile(file?: File) {
  console.log('XhrPutFile', file);
  if (file) {
    retrievePutUrl(file, (file, url) => {
      PutFile.xhr(file, url);
    });
  }
}

export function fetchPutFile(file?: File) {
  console.log('FetchPutFile', file);
  if (file) {
    retrievePutUrl(file, (file, url) => {
      PutFile.fetch(file, url);
    });
  }
}

export function axiosPutFile(file?: File) {
  console.log('AxiosPutFile', file);
  if (file) {
    retrievePutUrl(file, (file, url) => {
      PutFile.axios(file, url);
    });
  }
}
```

### 5.3 前端 POST 方式上传实现

POST 方式需携带后端返回的表单数据，封装三种上传方案：

```typescript
import axios from 'axios';

export class PostFile {
  static xhr(file: File, url: string, data: object) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.send(formData);

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        console.log(`[${xhr.status}] ${file.name} 上传成功`);
      } else {
        console.error(`[${xhr.status}] ${file.name} 上传失败`);
      }
    };
  }

  static fetch(file: File, url: string, data: object) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append('file', file);

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${file.name} 上传成功`, response);
      })
      .catch((error) => {
        console.error(`${file.name} 上传失败`, error);
      });
  }

  static axios(file: File, url: string, data: object) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append('file', file);

    axios.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        console.log(`${file.name} 上传成功`, response);
      })
      .catch(function (error) {
        console.error(`${file.name} 上传失败`, error);
      });
  }
}

export function retrievePostUrl(file: File, cb: (file: File, url: string, data: object) => void) {
  const url = `http://localhost:8080/presignedPostUrl/${file.name}`;
  axios.get(url)
    .then(function (response) {
      cb(file, response.data.data.url, response.data.data.formData);
    })
    .catch(function (error) {
      console.error(error);
    });
}

export function xhrPostFile(file?: File) {
  console.log('xhrPostFile', file);
  if (file) {
    retrievePostUrl(file, (file: File, url: string, data: object) => {
      PostFile.xhr(file, url, data);
    });
  }
}

export function fetchPostFile(file?: File) {
  console.log('fetchPostFile', file);
  if (file) {
    retrievePostUrl(file, (file: File, url: string, data: object) => {
      PostFile.fetch(file, url, data);
    });
  }
}

export function axiosPostFile(file?: File) {
  console.log('axiosPostFile', file);
  if (file) {
    retrievePostUrl(file, (file: File, url: string, data: object) => {
      PostFile.axios(file, url, data);
    });
  }
}
```

## 六、实战踩坑指南

在实现过程中，容易遇到以下问题，整理解决方案如下：

### 6.1 PresignedPutObject 必须用 PUT 方法

PresignedPutObject 生成的预签名 URL 仅支持 PUT 方法，若使用 POST 方法上传会直接失败。需严格匹配 API 定义的请求方法。

### 6.2 PUT 上传无需构造 FormData

部分开发者会习惯性构造 FormData 上传文件，但 PresignedPutObject 方案不支持这种方式——FormData 会导致请求体包含额外的协议数据（如 `------WebKitFormBoundary` 分隔符），MinIO 无法正确解析文件内容。

正确做法：直接将 File 对象作为请求体发送，无需封装 FormData。

### 6.3 Axios 上传需手动指定 Content-Type

XMLHttpRequest 和 Fetch API 会自动根据文件类型设置正确的 Content-Type，但 Axios 不会。若未手动指定 `Content-Type: file.type`，MinIO 会将文件 Content-Type 设为 Axios 默认的 `application/x-www-form-urlencoded`，导致文件无法正常预览。

### 6.4 POST 上传时 file 表单域必须在最后

使用 PresignedPostPolicy 方案时，FormData 中的 file 字段必须放在所有表单数据的最后一位。否则会报以下错误：

```shell
The body of your POST request is not well-formed multipart/form-data
# 或
The name of the uploaded key is missing
```

原因：MinIO 对 POST 表单数据的解析顺序有严格要求，file 字段需作为最后一个参数提交。

### 6.5 403 错误：主机名不匹配

PUT 上传时出现 403 错误，大概率是预签名 URL 中的主机名与 MinIO 服务的主机名不匹配。核心原因：

MinIO 预签名 URL 会将主机名（host）纳入签名验证范围（对应 `X-Amz-SignedHeaders: host`）。若后端连接 MinIO 使用的 endpoint（如 `localhost:9000`）与前端实际访问的 MinIO 地址（如 `192.168.1.100:9000`）不一致，会导致签名验证失败。

解决方案：

1. 后端连接 MinIO 时，使用前端可访问的地址（如外网 IP 或域名）作为 endpoint；
2. 通过环境变量 `MINIO_SERVER_URL` 和 `MINIO_BROWSER_REDIRECT_URL` 绑定 MinIO 服务的域名/IP：`MINIO_SERVER_URL`：指定 API 服务地址（默认 `9000` 端口）；
3. `MINIO_BROWSER_REDIRECT_URL`：指定控制台地址（默认 `9001` 端口）；
4. 注意：必须添加 `http://` 或 `https://` 前缀，例如 `http://minio.example.com:9000`。

Docker 部署时，可通过 `--env` 参数注入这两个环境变量（参考本文第二部分的 Docker 启动命令）。

## 七、示例代码仓库

本文完整示例代码已上传至 Github 和 Gitee，包含后端 Go + Gin 实现，以及前端 React、Vue 两种框架的上传示例（支持进度条、多文件上传等扩展功能）：

- Github：<https://github.com/tx7do/minio-typescript-example>
- Gitee：<https://gitee.com/tx7do/minio-typescript-example>

[1]:(https://min.io/)
[2]:(https://ceph.io/en/)
[3]:(https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
[4]:(https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
[5]:(https://github.com/axios/axios)
[6]:(https://min.io/docs/minio/linux/integrations/presigned-put-upload-via-browser.html)
[7]:(https://docs.min.io/docs/javascript-client-api-reference.html#putObject)
[8]:(https://docs.min.io/docs/javascript-client-api-reference.html#fPutObject)
[9]:(https://min.io/docs/minio/linux/developers/go/API.html#PresignedPutObject)
[10]:(https://min.io/docs/minio/linux/developers/go/API.html#PresignedPostPolicy)
