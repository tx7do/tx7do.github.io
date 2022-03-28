# TypeScript前端上传文件到MinIO

## 什么是MinIO?

[MinIO](http://www.minio.org.cn/overview.shtml) 是一款高性能、分布式的对象存储系统. 它是一款软件产品, 可以100%的运行在标准硬件。即X86等低成本机器也能够很好的运行MinIO。

## 上传的API

它有3个API可供调用:

1. [putObject](https://docs.min.io/docs/javascript-client-api-reference.html#putObject) 从流上传
2. [fPutObject](https://docs.min.io/docs/javascript-client-api-reference.html#fPutObject) 从文件上传
3. [presignedPutObject](https://docs.min.io/docs/javascript-client-api-reference.html#presignedPutObject) 提供一个临时的上传链接以供上传

使用1和2的方式的话,在前端需要暴露出连接MinIO的访问密钥,很不安全.而3的话,可以由服务端生成一个临时的上传链接提供给前端上传之用,而无需要暴露访问MinIO的密钥,**我采用的是第三种方式**.

第三种方式,官方有一篇文章: [Upload Files Using Pre-signed URLs](https://docs.min.io/docs/upload-files-from-browser-using-pre-signed-urls.html)

## TypeScript实现

在TypeScript下,我们可用的有三种方式实现文件上传:

1. [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
2. [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
3. [Axios](https://github.com/axios/axios)

**需要注意的是: 事实上,后两种API都是封装的XMLHttpRequest.**

### 1. XMLHttpRequest

```typescript
function xhrUploadFile(file: File | Blob, url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true);
  xhr.send(file);

  xhr.onload = () => {
    if (xhr.status == 200) {
      console.log(`${file.name} 上传成功`);
    } else {
      console.error(`${file.name} 上传失败`);
    }
  };
}
```

### 2. Fetch API

```typescript
function fetchUploadFile(file: File | Blob, url: string) {
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
function axiosUploadFile(file: File | Blob, url: string) {
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

## 踩过的坑

### 1. 上传提交的方法必须得是`PUT`

我试过了用`POST`去上传文件,但是显然的是:我失败了.**必须得用`PUT`去上传**.

### 2. 直接发送`File`即可

看了不少文章都是这么干的,构造一个`FormData`,然后把文件打进去,如果用`putObject`和`fPutObject`这两种方式上传,这是没问题的,但是使用`presignedPutObject`则是不行的,直接发送`File`就可以了.

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
    return  post(url, formData,config)
}
```

如果使用以上的方式上传,文件头会被插入一段数据,看起来像是这样子的:

```text
------WebKitFormBoundaryaym16ehT29q60rUx
Content-Disposition: form-data; name="file"; filename="webfonts.zip"
Content-Type: application/zip
```

它是遵照了 [rfc1867](https://www.ietf.org/rfc/rfc1867.txt) 定义的协议.

### 3. 使用`Axios`上传的时候,需要自己把`Content-Type`填写成为`file.type`

直接使用`XMLHttpRequest`和`Fetch API`都会自动填写成为文件真实的`Content-Type`.而`Axios`则不会,需要自己填写进去,或许是我不会使用`Axios`,但是这是一个需要注意的地方,否则在MinIO里边的`Content-Type`会被填写成为`Axios`默认的`Content-Type`,或者是你自己指定的.

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
    --env MINIO_DEFAULT_BUCKETS='my-bucket' \
    --env MINIO_FORCE_NEW_KEYS="yes" \
    --env BITNAMI_DEBUG=true \
    bitnami/minio:latest

```
