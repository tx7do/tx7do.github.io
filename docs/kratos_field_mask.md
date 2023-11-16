# Kratos下使用Protobuf FieldMask优化系统

当我们使用gRPC进行通讯的时候，调用者通常是不需要获取到所有的字段，我们需要有选择的选定对端传输过来我们需要的字段，忽略掉我们不需要的字段。这是很有益处的。响应某一个字段，有时候需要消耗不少的计算成本，传输也是需要成本的。在微服务的场景下，因为有服务与服务之间的调用，获取某一个字段，有时候意味着一个或者多个的服务调用，在这样的场景下，裁剪某一个字段所带来的优化就显得很优厚了。

那么，问题来了：我们怎么去实现优化呢？

- 在GraphQL，是通过使用字段选择器来实现的。
- 在JSON:API 标准中，类似的技术称为 [稀疏字段集](https://jsonapi.org/format/#fetching-sparse-fieldsets)。

而在gRPC里边，则可以使用[Protobuf FieldMask](https://developers.google.com/protocol-buffers/docs/reference/csharp/class/google/protobuf/well-known-types/field-mask)来实现。

## 参考资料

- [protoc-gen-fieldmask插件](https://yeqown.xyz/2022/01/25/protoc-gen-fieldmask%E6%8F%92%E4%BB%B6/)
- [使用 FieldMask 更新数据](https://cloud.google.com/dialogflow/cx/docs/how/field-mask?hl=zh-cn)
- [Field masks AIP-161](https://google.aip.dev/161)
- [Netflix 实用 API 设计第 1 部分：使用 Protobuf FieldMask](https://www.infoq.cn/article/vlkppbqar4tffhfwv9ke)
- [Practical API Design at Netflix, Part 1: Using Protobuf FieldMask](https://netflixtechblog.com/practical-api-design-at-netflix-part-1-using-protobuf-fieldmask-35cfdc606518)
- [Practical API Design at Netflix, Part 2: Protobuf FieldMask for Mutation Operations](https://netflixtechblog.com/practical-api-design-at-netflix-part-2-protobuf-fieldmask-for-mutation-operations-2e75e1d230e4)
