# Kratos微服务框架常见问题解答

## 为什么Protobuf定义成int64，转成json之后却变成了string类型？

比如说，定义了一个proto文件

```protobuf
message PartyMusicSearchItem {
    string name = 1;
    int32  fileSize = 2;
    string author = 3;
    string musicId = 4;
    int32 type = 6;
    int64 createdAt = 7;
    int64 lastTime = 8;
}
```

返回的JSON的数据如下：

```json
{
  "author": "张碧晨",
  "createdAt": "1640157765000",
  "fileSize": 10907,
  "lastTime": "1640157765000",
  "musicId": "61c2d2459a01c38927334b03",
  "name": "年轮",
  "type": 0
}
```

可以看到proto中定义为int64的字段，返回值都变成了字符串了。

其实，我们查阅一下官方文档的 [JSON Mapping](https://developers.google.com/protocol-buffers/docs/proto3#json) ，里面已经明确的做了定义：

|proto3     |   JSON  |   JSON example  |  Notes   |
|-----|-----|-----|-----|
|   int32, fixed32, uint32	  | number    |  1, -10, 0	   |  JSON value will be a decimal number. Either numbers or strings are accepted.|
|   int64, fixed64, uint64		  | string    |  "1", "-10"		   |  JSON value will be a decimal string. Either numbers or strings are accepted.|
|   float, double			  | number    |  1.1, -10.0, 0, "NaN", "Infinity"			   |  JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity". Either numbers or strings are accepted. Exponent notation is also accepted. -0 is considered equivalent to 0.|

究其原因就是因为精度问题

`JavaScript`的`number`类型，都是存储的8字节的`double`类型，它的安全取值范围是：`-9007199254740991 ~ 9007199254740991`。

`golang`的`int64`取值范围是：`-9223372036854775808 ~ 9223372036854775807`，`uint64`的取值范围是：`0 ~ 18446744073709551615`。

也就是说，`JavaScript`的`number`类型的取值范围明显小于`golang`的`int64`的取值范围。那么如果我们在使用中超过了这个范围，就会丢精度，导致返回的数据不正确。

唯一的办法也就只有把number先转换成string，然后解析的时候再转回数字。

这也并不会引起太大的问题，本身number转成JSON后就是字符串，也就是多了一对双引号罢了，并不会带来更多的传输损耗，也并不会带来其他的问题。除了让一些人感到费解罢了。

## 怎么样在Protobuf里面指定JSON的字段名？

我有一个proto

```protobuf
message PartyMusicSearchItem {
  string name = 1;
  int32  fileSize = 2;
  string author = 3;
  string musicId = 4;
  int32 type = 6;
  int64 createdAt = 7;
  int64 lastTime = 8;
}
```

返回的JSON的数据如下：

```json
{
  "author": "张碧晨",
  "createdAt": "1640157765000",
  "fileSize": 10907,
  "lastTime": "1640157765000",
  "musicId": "61c2d2459a01c38927334b03",
  "name": "年轮",
  "type": 0
}
```

但是我前端的命名规约是蛇形命名法，我希望返回的JSON数据是这样的：

```json
{
  "author": "张碧晨",
  "created_at": "1640157765000",
  "file_size": 10907,
  "last_time": "1640157765000",
  "music_id": "61c2d2459a01c38927334b03",
  "name": "年轮",
  "type": 0
}
```

这是可以做到的，我们可以使用`JSON_NAME`的属性，指定JSON的字段名。

```protobuf
message PartyMusicSearchItem {
  string name = 1 [json_name = "name"];
  int32  fileSize = 2 [json_name = "file_size"];
  string author = 3 [json_name = "author"];
  string musicId = 4 [json_name = "music_id"];
  int32 type = 6 [json_name = "type"];
  int64 createdAt = 7 [json_name = "created_at"];
  int64 lastTime = 8 [json_name = "last_time"];
}
```

那么它生成的struct是这样的：

```go
type PartyMusicSearchItem struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Name      string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	FileSize  int32  `protobuf:"varint,2,opt,name=fileSize,json=file_size,proto3" json:"fileSize,omitempty"`
	Author    string `protobuf:"bytes,3,opt,name=author,proto3" json:"author,omitempty"`
	MusicId   string `protobuf:"bytes,4,opt,name=musicId,json=music_id,proto3" json:"musicId,omitempty"`
	Type      int32  `protobuf:"varint,6,opt,name=type,proto3" json:"type,omitempty"`
	CreatedAt int64  `protobuf:"varint,7,opt,name=createdAt,json=created_at,proto3" json:"createdAt,omitempty"`
	LastTime  int64  `protobuf:"varint,8,opt,name=lastTime,json=last_time,proto3" json:"lastTime,omitempty"`
}
```

它在官方文档[JSON Mapping](https://developers.google.com/protocol-buffers/docs/proto3#json)里面是有说明的：

|proto3     |   JSON  |   JSON example  |  Notes   |
|-----|-----|-----|-----|
|   message	  | object    |  {"fooBar": v, "g": null, …}	   |  Generates JSON objects. Message field names are mapped to lowerCamelCase and become JSON object keys. If the json_name field option is specified, the specified value will be used as the key instead. Parsers accept both the lowerCamelCase name (or the one specified by the json_name option) and the original proto field name. null is an accepted value for all field types and treated as the default value of the corresponding field type.|

## 如何使用Golang代码中编译Protobuf文件？

我们可以使用golang的`go generate`命令来编译Protobuf文件，我们可以在proto文件的当前目录下新建一个`generate.go`文件：

```go
package api

// 生成 proto grpc
//go:generate protoc --proto_path=. --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. ./*.proto

// 生成 proto http
//go:generate protoc --proto_path=. --go_out=paths=source_relative:. --go-http_out=paths=source_relative:. ./*.proto

// 生成 proto errors
//go:generate protoc --proto_path=. --go_out=paths=source_relative:. --go-errors_out=paths=source_relative:. ./*.proto

// 生成 swagger
//go:generate protoc --proto_path=. --openapiv2_out . --openapiv2_opt logtostderr=true --openapiv2_opt json_names_for_fields=true ./*.proto
```

推荐使用Jetbrain的Goland，它可以很方便的在IDE中运行该命令。堪称完美。

## 参考资料

* [JSON Mapping](https://developers.google.com/protocol-buffers/docs/proto3#json)
* [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
