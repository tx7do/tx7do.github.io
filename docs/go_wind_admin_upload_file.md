# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：如何上传文件

在一个CMS和Admin系统里面，文件上传是一个极其重要的功能之一。

在Kraots-Admin里面，我们把所有的文件都落地到MinIO。MinIO是一个非常优秀的分布式文件管理系统。

通常，后端可用的有两种上传方式：

1. 通过Kratos的服务向MinIO申请预签名URL，然后通过预签名URL向MinIO上传文件。
2. 直接向Kratos的服务上传文件，然后，微服务再将文件落地到MinIO。

方式一，这是最优的解决方案，因为文件不会经过微服务，直接上传到MinIO，减轻了微服务的压力。并且，MinIO支持分布式部署，可以很好的扩展。

方式二，是最简单的解决方案，但是不推荐，因为文件需要微服务经手，这显然增加了微服务的压力。

## 向MinIO预签名URL上传文件

该方法的原理就是，微服务向MinIO发出请求，让MinIO生成一个预签名（Presigned）的链接，你可以理解成为一个有时效性的上传链接，在一定的时间内，你有权上传一个文件。在FTP时代里，我们需要向客户端/前端暴露用户名和密码，这是极其不安全的。而预签名机制则是一个安全的机制。

让我们来一步步的实现该功能。

MinIO提供了两种预签名的上传方式：

1. [PresignedPutObject](https://min.io/docs/minio/linux/developers/go/API.html#PresignedPutObject) 提供一个临时的HTTP PUT 操作预签名上传链接以供上传
2. [PresignedPostPolicy](https://min.io/docs/minio/linux/developers/go/API.html#PresignedPostPolicy) 提供一个临时的HTTP POST 操作预签名上传链接以供上传

我们接着就将这两个方法封装起来：

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

现在，我们需要定义Protobuf的API：

```protobuf
syntax = "proto3";

package file.service.v1;

import "gnostic/openapi/v3/annotations.proto";
import "google/api/annotations.proto";

// 文件服务
service FileService {
  // 获取对象存储（OSS）上传链接
  rpc OssUploadUrl (OssUploadUrlRequest) returns (OssUploadUrlResponse) {
    option (google.api.http) = {
      post: "/admin/v1/file:upload-url"
      body: "*"
    };
  }
}

// 前端上传文件所用的HTTP方法
enum UploadMethod {
  Put = 0;
  Post = 1;
}

// 获取对象存储上传链接 - 请求
message OssUploadUrlRequest {
  UploadMethod method = 1 [
    json_name = "method",
    (gnostic.openapi.v3.property) = { description: "上传文件所用的HTTP方法，支持POST和PUT" }
  ];  // 上传文件所用的HTTP方法

  optional string content_type = 2 [
    json_name = "contentType",
    (gnostic.openapi.v3.property) = { description: "文件的MIME类型" }
  ];  // 文件的MIME类型

  optional string bucket_name = 3 [
    json_name = "bucketName",
    (gnostic.openapi.v3.property) = { description: "文件桶名称，如果不填写，将会根据文件名或者MIME类型进行自动解析" }
  ]; // 文件桶名称，如果不填写，将会根据文件名或者MIME类型进行自动解析。

  optional string file_path = 4 [
    json_name = "filePath",
    (gnostic.openapi.v3.property) = { description: "远端的文件路径，可以不填写" }
  ]; // 远端的文件路径，可以不填写。

  optional string file_name = 5 [
    json_name = "fileName",
    (gnostic.openapi.v3.property) = { description: "文件名，如果不填写，则会生成UUID，有同名文件也会改为UUID" }
  ]; // 文件名，如果不填写，则会生成UUID，有同名文件也会改为UUID。
}

// 获取对象存储上传链接 - 回应
message OssUploadUrlResponse {
  string upload_url = 1 [
    json_name = "uploadUrl",
    (gnostic.openapi.v3.property) = { description: "文件的上传链接，默认1个小时的过期时间" }
  ]; // 文件的上传链接，默认1个小时的过期时间。

  string download_url = 2 [
    json_name = "downloadUrl",
    (gnostic.openapi.v3.property) = { description: "文件的下载链接" }
  ]; // 文件的下载链接

  optional string bucket_name = 3 [
    json_name = "bucketName",
    (gnostic.openapi.v3.property) = { description: "文件桶名称" }
  ]; // 文件桶名称

  string object_name = 4 [
    json_name = "objectName",
    (gnostic.openapi.v3.property) = { description: "文件名" }
  ];  // 文件名

  map<string, string> form_data = 5 [
    json_name = "formData",
    (gnostic.openapi.v3.property) = { description: "表单数据，使用POST方法时填写" }
  ];
}
```

写好了API之后，接着来实现服务：

```go
package service

import (
	"context"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/go-utils/trans"

	"go-wind-admin/app/admin/service/internal/data"

	adminV1 "go-wind-admin/api/gen/go/admin/service/v1"
	fileV1 "go-wind-admin/api/gen/go/file/service/v1"
)

type FileService struct {
	adminV1.FileServiceHTTPServer

	log *log.Helper

	mc *data.MinIOClient
}

func NewFileService(logger log.Logger, mc *data.MinIOClient) *FileService {
	l := log.NewHelper(log.With(logger, "module", "file/service/admin-service"))
	return &FileService{
		log: l,
		mc:  mc,
	}
}

func (s *FileService) OssUploadUrl(ctx context.Context, req *fileV1.OssUploadUrlRequest) (*fileV1.OssUploadUrlResponse, error) {
	return s.mc.OssUploadUrl(ctx, req)
}
```

到这里，服务的逻辑就实现好了。

前端的调用流程是：

1. 前端向`/admin/v1/file:upload-url`这个API申请MinIO的预签名链接；
2. 前端拿到了预签名的上传链接，向该链接上传文件。

## 直接向Kratos的服务上传文件

该方法的核心要点就是把文件打进FormData。后端服务解析FormData即可。

需要注意的是，Kratos的代码生成器不能够将Protobuf上传文件的API生成成go代码。这就是我在上面提到的需要手工代码的地方。

让我们先定义API：

```protobuf
syntax = "proto3";

package admin.service.v1;

import "gnostic/openapi/v3/annotations.proto";
import "google/api/annotations.proto";

// 文件服务
service FileService {
  // POST方法上传文件
  rpc PostUploadFile (stream UploadFileRequest) returns (UploadFileResponse) {
    option (google.api.http) = {
      post: "/admin/v1/file:upload"
      body: "*"
    };
  }

  // PUT方法上传文件
  rpc PutUploadFile (stream UploadFileRequest) returns (UploadFileResponse) {
    option (google.api.http) = {
      put: "/admin/v1/file:upload"
      body: "*"
    };
  }
}

message UploadFileRequest {
  optional string bucket_name = 1 [
    json_name = "bucketName",
    (gnostic.openapi.v3.property) = { description: "文件桶名称" }
  ]; // 文件桶名称

  optional string object_name = 2 [
    json_name = "objectName",
    (gnostic.openapi.v3.property) = { description: "文件名" }
  ]; // 文件名

  optional bytes file = 3 [
    json_name = "file",
    (gnostic.openapi.v3.property) = { description: "文件内容" }
  ]; // 文件内容
}

message UploadFileResponse {
  string url = 1;
}
```

当你生成了API的代码之后，你可以查看`i_file_http.pb.go`这个生成代码，你会发现，哦吼，里边并没有这两个接口的处理代码。于是，我们下面就需要手工搓一个，我们把它放到微服务的`server`包下：

```go
package server

import (
	"context"
	"io"
	"strings"

	"github.com/go-kratos/kratos/v2/transport/http"

	"go-wind-admin/app/admin/service/internal/service"

	fileV1 "go-wind-admin/api/gen/go/file/service/v1"
)

func registerFileUploadHandler(srv *http.Server, svc *service.FileService) {
	r := srv.Route("/")
	r.POST("admin/v1/file:upload", _FileService_PostUploadFile_HTTP_Handler(svc))
	r.PUT("admin/v1/file:upload", _FileService_PutUploadFile_HTTP_Handler(svc))
}

const OperationFileServicePostUploadFile = "/admin.service.v1.FileService/PostUploadFile"
const OperationFileServicePutUploadFile = "/admin.service.v1.FileService/PutUploadFile"

func _FileService_PostUploadFile_HTTP_Handler(svc *service.FileService) func(ctx http.Context) error {
	return func(ctx http.Context) error {
		http.SetOperation(ctx, OperationFileServicePostUploadFile)

		var in fileV1.UploadFileRequest
		var err error

		var aFile *fileV1.File

		file, header, err := ctx.Request().FormFile("file")
		if err == nil {
			defer file.Close()

			b := new(strings.Builder)
			_, err = io.Copy(b, file)

			aFile = &fileV1.File{
				FileName: header.Filename,
				Mime:     header.Header.Get("Content-Type"),
				Content:  []byte(b.String()),
			}
		}

		if err = ctx.BindQuery(&in); err != nil {
			return err
		}

		h := ctx.Middleware(func(ctx context.Context, req interface{}) (interface{}, error) {
			return svc.PostUploadFile(ctx, req.(*fileV1.UploadFileRequest), aFile)
		})

		// 逻辑处理，取数据
		out, err := h(ctx, &in)
		if err != nil {
			return err
		}

		reply := out.(*fileV1.UploadFileResponse)

		return ctx.Result(200, reply)
	}
}

func _FileService_PutUploadFile_HTTP_Handler(svc *service.FileService) func(ctx http.Context) error {
	return func(ctx http.Context) error {
		http.SetOperation(ctx, OperationFileServicePutUploadFile)

		var in fileV1.UploadFileRequest
		var err error

		var aFile *fileV1.File

		file, header, err := ctx.Request().FormFile("file")
		if err == nil {
			defer file.Close()

			b := new(strings.Builder)
			_, err = io.Copy(b, file)

			aFile = &fileV1.File{
				FileName: header.Filename,
				Mime:     header.Header.Get("Content-Type"),
				Content:  []byte(b.String()),
			}
		}

		if err = ctx.BindQuery(&in); err != nil {
			return err
		}

		h := ctx.Middleware(func(ctx context.Context, req interface{}) (interface{}, error) {
			return svc.PutUploadFile(ctx, req.(*fileV1.UploadFileRequest), aFile)
		})

		// 逻辑处理，取数据
		out, err := h(ctx, &in)
		if err != nil {
			return err
		}

		reply := out.(*fileV1.UploadFileResponse)

		return ctx.Result(200, reply)
	}
}
```

然后，把它注册进HTTP服务器：

```go
// NewRESTServer new an HTTP server.
func NewRESTServer(
	cfg *conf.Bootstrap,
	logger log.Logger,

	fileSvc *service.FileService,
) *http.Server {
    adminV1.RegisterFileServiceHTTPServer(srv, fileSvc)
    registerFileUploadHandler(srv, fileSvc)
}
```

在这个时候，我们才真正的拥有了这两个接口。

直接向MinIO上传文件，MinIO提供了两个接口：

1. [putObject](https://docs.min.io/docs/javascript-client-api-reference.html#putObject) 从流上传
2. [fPutObject](https://docs.min.io/docs/javascript-client-api-reference.html#fPutObject) 从文件上传

我们这里使用的是流式上传，所以使用的是`putObject`，将之封装一下，以供服务调用：

```go

func (c *MinIOClient) UploadFile(ctx context.Context, bucketName string, objectName string, file []byte) (string, error) {
	reader := bytes.NewReader(file)

	_, err := c.mc.PutObject(
		ctx,
		bucketName,
		objectName,
		reader, reader.Size(),
		minio.PutObjectOptions{},
	)
	if err != nil {
		return "", err
	}

	downloadUrl := "/" + bucketName + "/" + objectName

	return downloadUrl, nil
}
```

这时候就可以实现服务的实现代码了：

```go

func (s *FileService) PostUploadFile(ctx context.Context, req *fileV1.UploadFileRequest, file *fileV1.File) (*fileV1.UploadFileResponse, error) {
	if file == nil {
		return nil, fileV1.ErrorUploadFailed("unknown file")
	}

	if req.BucketName == nil {
		req.BucketName = trans.Ptr(s.mc.ContentTypeToBucketName(file.Mime))
	}
	if req.ObjectName == nil {
		req.ObjectName = trans.Ptr(file.FileName)
	}

	downloadUrl, err := s.mc.UploadFile(ctx, req.GetBucketName(), req.GetObjectName(), file.Content)
	return &fileV1.UploadFileResponse{
		Url: downloadUrl,
	}, err
}

func (s *FileService) PutUploadFile(ctx context.Context, req *fileV1.UploadFileRequest, file *fileV1.File) (*fileV1.UploadFileResponse, error) {
	if file == nil {
		return nil, fileV1.ErrorUploadFailed("unknown file")
	}

	if req.BucketName == nil {
		req.BucketName = trans.Ptr(s.mc.ContentTypeToBucketName(file.Mime))
	}
	if req.ObjectName == nil {
		req.ObjectName = trans.Ptr(file.FileName)
	}

	downloadUrl, err := s.mc.UploadFile(ctx, req.GetBucketName(), req.GetObjectName(), file.Content)
	return &fileV1.UploadFileResponse{
		Url: downloadUrl,
	}, err
}
```

前端只需要直接向这两个接口上传文件即可。

## 项目代码

* [go-wind-admin Gitee](https://gitee.com/tx7do/go-wind-admin)
* [go-wind-admin Github](https://github.com/tx7do/go-wind-admin)
