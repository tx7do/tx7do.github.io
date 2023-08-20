# TypeScript前端上传文件到MinIO

在以前，前端要上传文件到服务端，比较的麻烦，要么通过HTTP服务上传，要么通过FTP上传。这两者的可靠性都极低。

但是，后来，有了`对象存储服务（Object Storage Service）`，对象存储也称为基于对象的存储，是一种计算机数据存储架构，旨在处理大量非结构化数据。与其他架构不同，它将数据指定为不同的单元，并捆绑元数据和唯一标识符，用于查找和访问每个数据单元。

OSS具有与平台无关的RESTful API接口，您可以在任何应用、任何时间、任何地点存储和访问任意类型的数据。

网上比较著名的开源OSS有：[MinIO](https://min.io/)和[Ceph](https://ceph.io/en/)。其中MinIO的使用率是越来越高，可以说是很普及了。因此，我首选使用它来做文件上传和管理的系统。

## 什么是MinIO?

官方解释：[MinIO](http://www.minio.org.cn/overview.shtml) 是一个用 Golang 开发的基于 Apache License v2.0 开源协议的对象存储服务。

它兼容亚马逊S3云存储服务接口，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等，而一个对象文件可以是任意大小，从几kb到最大5T不等。

MinIO是一个非常轻量的服务，可以很简单的和其他应用的结合，类似 NodeJS, Redis 或者 MySQL。

Minio使用纠删码erasure code和校验和checksum来保护数据免受硬件故障和数据损坏。
因此，即便您丢失一半数量（N/2）的硬盘，您仍然可以恢复数据。

## 本地Docker部署测试服务器

```bash
docker pull bitnami/minio:latest

# MINIO_ROOT_USER最少3个字符
# MINIO_ROOT_PASSWORD最少8个字符
# 第一次运行的时候,服务会自动关闭,手动再次启动就可以正常运行了.
docker run -itd \
    --name minio-server \
    -p 9000:9000 \
    -p 9001:9001 \
    --env MINIO_ROOT_USER="root" \
    --env MINIO_ROOT_PASSWORD="123456789" \
    --env MINIO_DEFAULT_BUCKETS='images' \
    --env MINIO_FORCE_NEW_KEYS="yes" \
    --env BITNAMI_DEBUG=true \
    bitnami/minio:latest

```

## TypeScript实现文件上传

在TypeScript下，我们可用的文件上传方法有三种，可用于实现文件的上传：

1. [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
2. [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
3. [Axios](https://github.com/axios/axios)

**需要注意的是: 事实上，后两种API都是对`XMLHttpRequest`进行的封装。**

### 1. XMLHttpRequest

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

### 2. Fetch API

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

### 3. Axios

```typescript
function axiosUploadFile(file: File, url: string) {
  const instance = axios.create();
  instance
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
```

## MinIO上传API

它有4个API可供调用：

1. [putObject](https://docs.min.io/docs/javascript-client-api-reference.html#putObject) 从流上传
2. [fPutObject](https://docs.min.io/docs/javascript-client-api-reference.html#fPutObject) 从文件上传
3. [PresignedPutObject](https://min.io/docs/minio/linux/developers/go/API.html#PresignedPutObject) 提供一个临时的HTTP PUT 操作预签名上传链接以供上传
4. [PresignedPostPolicy](https://min.io/docs/minio/linux/developers/go/API.html#PresignedPostPolicy) 提供一个临时的HTTP POST 操作预签名上传链接以供上传

使用方法1和2的话，必须要在前端暴露用于连接MinIO的访问密钥。这样很不安全，并且官方的Js客户端也压根就没想过开放给浏览器。

而使用方法3和4的话，我们可以由服务端来生成一个临时的上传链接，提供给前端上传之用，无需暴露访问MinIO的密钥给前端，这样非常的安全，**因此我采用的是第3、4种方式**。

在下面，我们主要讨论的也是这两种方法，前两种不实用，故而不做任何讨论。

> 第三种方式，官方有一篇文章: [Upload Files Using Pre-signed URLs](https://min.io/docs/minio/linux/integrations/presigned-put-upload-via-browser.html)

### 实现go后端

首先对MinIO的SDK做一个简单的封装：

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

然后我们需要提供两个接口用于提供给前端获取MinIO的预签名链接：

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

这样我们就有了一个提供MinIO预签名的REST服务了。

### 前端实现PUT方法上传文件

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

### 前端实现POST方法上传文件

```typescript
import axios from 'axios';

export class PostFile {
  static xhr(file: File, url: string, data: object) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });

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
    formData.append('file', file);
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });

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
    formData.append('file', file);
    Object.entries(data).forEach(([k, v]) => {
      formData.append(k, v);
    });

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

## 踩过的坑

### 1. `presignedPutObject`方式上传提交的方法必须得是`PUT`

我试过了用`POST`去上传文件，但是结果显然是：我失败了，**必须得用`PUT`去上传**，正如其方法名中带有`Put`。

### 2. 直接发送`File`即可

看了不少文章都是这么干的: 构造一个`FormData`，然后把文件打进去，如果用`putObject`和`fPutObject`这两个方法上传，这是没问题的：

```typescript
fileUpload(file) {
    const url = 'http://example.com/file-upload';
    const formData = new FormData();
    formData.append('file', file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return post(url, formData, config)
}
```

如果使用以上的方式上传，文件头会被插入一段数据，看起来像是这样子的:

```text
------WebKitFormBoundaryaym16ehT29q60rUx
Content-Disposition: form-data; name="file"; filename="webfonts.zip"
Content-Type: application/zip
```

它是遵照了 [rfc1867](https://www.ietf.org/rfc/rfc1867.txt) 定义的协议，插入的协议数据。

但是如果是使用`presignedPutObject`的方式则是不行的，接收到的文件里面将会有上面的协议数据，不需要构造`FormData`，直接发送`File`就可以了。

### 3. 使用`Axios`上传的时候,需要自己把`Content-Type`填写成为`file.type`

直接使用`XMLHttpRequest`和`Fetch API`都会自动填写成为文件真实的`Content-Type`。而`Axios`则不会，需要自己填写进去，或许是我不会使用`Axios`，但是这是一个需要注意的地方，否则在MinIO里边的`Content-Type`会被填写成为`Axios`默认的`Content-Type`。

## 示例代码

Github: <https://github.com/tx7do/minio-typescript-example>  
Gitee: <https://gitee.com/tx7do/minio-typescript-example>

* 后端采用go+gin实现；
* 前端有React和Vue的实现，要实现进度条和多文件上传也是容易的。
