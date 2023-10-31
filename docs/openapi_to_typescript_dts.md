# 从OpenAPI文档生成Typescript的d.ts文件

一开始我走入了误区，应该从Protobuf生成dts，但是，现在来看，通过OpenAPI文档生成dts文件会更好一些。

首先，Protobuf对于前端来说，知识面几乎没有交集。你要找出知道Protobuf的前端，这并不是一件很容易的事情。但是，你要问前端OpenAPI，Swagger，他一定能够会告诉你，必须的知道。

其次，Protobuf通常都是后端定义，后端使用，要开放VSC的权限给前端，有时候会是一个很艰难的问题。那么，现实是，通常生成的工作都要后端去做——这就给工作中带来了极大的不便。

综上，通过Protobuf生成dts其实并不是一个明智之举。

那么，通过OpenAPI文档来生成dts则不同了。首先，后端只要是支持REST的框架，生成OpenAPI文档都是支持的，并且很容易。我知道的很多语言的很多框架，都是内嵌了Swagger UI，既提供了API的浏览和测试，并且OpenAPI的文档也是可以在线访问的。所以，我们很容易的就将OpenAPI文档开放给任何一个人——而且，还是最新鲜的。前端拿到了OpenAPI文档之后，怎么去实际使用，那就是他的事情了，可以随他的习惯和喜好。也不需要去管他，约束他前端用什么框架，用什么工具去生成，生成什么样的目标代码。

权责，分明了。开发的便利性，有了。

## dtsgenerator

首页：<https://www.npmjs.com/package/dtsgenerator>

安装：

```shell
npm install -g dtsgenerator
```

生成：

```shell
dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
```

## openapi-typescript

首页: <https://www.npmjs.com/package/openapi-typescript>

生成：

```shell
npx openapi-typescript https://petstore3.swagger.io/api/v3/openapi.yaml --output petstore.d.ts
```

## Swagger Editor

访问网址：<https://editor.swagger.io/#/>
