import{_ as s,c as a,e,o as l}from"./app-DITrC0xQ.js";const i={};function p(t,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-api管理" tabindex="-1"><a class="header-anchor" href="#gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-api管理"><span>GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：API管理</span></a></h1><p>开门见山，<a href="https://go-kratos.dev/" target="_blank" rel="noopener noreferrer">Kratos</a>内置的RPC是<a href="https://grpc.io/" target="_blank" rel="noopener noreferrer">gRPC</a>，而gRPC是基于<a href="https://protobuf.dev/" target="_blank" rel="noopener noreferrer">Protobuf</a>作为 <strong>接口规范的描述语言（IDL，Interface Description Language）</strong>。</p><p>与此同时我们还可以通过<a href="https://github.com/grpc-ecosystem/grpc-gateway" target="_blank" rel="noopener noreferrer">grpc-gateway</a>对RESTfull进行支持。这样，Kratos就同时支持gRPC和REST。</p><p>也就是说，我们只需要编写一套Protobuf代码，就能够同时支持 <strong>gRPC协议</strong> 和 <strong>RESTfull协议</strong>。</p><p>Protobuf支持很多编程语言，比如：C++、Java、JavaScript、Python、Go、Ruby、Objective-C、C#……这也就意味着，它很适合多语言异构化架构，这样的场景在现实应用当中是很稀松平常的，这使得Protobuf具有很强的实用性。</p><p>Protobuf具有序列化后数据量更小、序列化/反序列化速度更快、更简单的特性；而JSON则相反，序列化后数据量较大，序列化和反序列化速度不优的特性，但是前端对JSON是原生支持，对前端极其友好。那么，我们可以在服务之间使用gRPC进行通讯，服务与前端之间可以通过RESTfull进行通讯。</p><p>Protobuf和gRPC已经发展了许多年，极其稳定，生态链丰富。它具有强大的工具链可供使用，只要你想得到的，都能够找得到相对应的工具。没有合适的工具也没有关系，它的工具是使用插件方式来实现可扩展性的，因此我们可以容易的开发出自己的工具插件，Kratos就为此开发了自己的一系列的工具插件方便开发使用。</p><p>综上，我们可知使用gRPC/protobuf的好处：</p><ol><li>一套proto，同时支持gRPC协议和RESTfull协议；</li><li>支持多编程语言，适合多语言异构化架构；</li><li>gRPC协议，数据量小、序列化/反序列化速度更快、更简单，适合服务之间通讯；</li><li>RESTfull协议，数据量较大、序列化/反序列化速度较慢、前端原生支持JSON，适合同前端的通讯。</li><li>强大的工具链，使用插件的方式实现强大的可扩展性，可方便的扩展。</li></ol><p>了解了基础的知识之后，我们简单的了解一下本文的核心知识点：</p><ol><li>使用<a href="https://protobuf.dev/" target="_blank" rel="noopener noreferrer">Protobuf</a>编写API；</li><li>使用<a href="https://buf.build/" target="_blank" rel="noopener noreferrer">Buf</a>管理proto；</li><li>使用<a href="https://www.gnu.org/software/make/" target="_blank" rel="noopener noreferrer">Make</a>执行Buf命令。</li></ol><h2 id="_1-使用protobuf编写api" tabindex="-1"><a class="header-anchor" href="#_1-使用protobuf编写api"><span>1. 使用Protobuf编写API</span></a></h2><div class="language-proto line-numbers-mode" data-highlighter="prismjs" data-ext="proto"><pre><code><span class="line">syntax = &quot;proto3&quot;;</span>
<span class="line"></span>
<span class="line">package user.service.v1;</span>
<span class="line"></span>
<span class="line">import &quot;gnostic/openapi/v3/annotations.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;google/protobuf/empty.proto&quot;;</span>
<span class="line">import &quot;google/protobuf/field_mask.proto&quot;;</span>
<span class="line">import &quot;google/protobuf/timestamp.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;google/api/field_behavior.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;pagination/v1/pagination.proto&quot;;</span>
<span class="line"></span>
<span class="line">// 用户服务</span>
<span class="line">service UserService {</span>
<span class="line">  // 查询用户列表</span>
<span class="line">  rpc ListUser (pagination.PagingRequest) returns (ListUserResponse) {}</span>
<span class="line"></span>
<span class="line">  // 查询用户详情</span>
<span class="line">  rpc GetUser (GetUserRequest) returns (User) {}</span>
<span class="line"></span>
<span class="line">  // 创建用户</span>
<span class="line">  rpc CreateUser (CreateUserRequest) returns (google.protobuf.Empty) {}</span>
<span class="line"></span>
<span class="line">  // 更新用户</span>
<span class="line">  rpc UpdateUser (UpdateUserRequest) returns (google.protobuf.Empty) {}</span>
<span class="line"></span>
<span class="line">  // 删除用户</span>
<span class="line">  rpc DeleteUser (DeleteUserRequest) returns (google.protobuf.Empty) {}</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 用户权限</span>
<span class="line">enum UserAuthority {</span>
<span class="line">  SYS_ADMIN = 0;  // 系统超级用户</span>
<span class="line">  SYS_MANAGER = 1;  // 系统管理员</span>
<span class="line">  CUSTOMER_USER = 2;  // 普通用户</span>
<span class="line">  GUEST_USER = 3;  // 游客</span>
<span class="line"></span>
<span class="line">  REFRESH_TOKEN = 4; // 刷新令牌</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 用户性别</span>
<span class="line">enum UserGender {</span>
<span class="line">  SECRET = 0;  // 未知</span>
<span class="line">  MALE = 1;     // 男性</span>
<span class="line">  FEMALE = 2;   // 女性</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 用户状态</span>
<span class="line">enum UserStatus {</span>
<span class="line">  OFF = 0;</span>
<span class="line">  ON = 1;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 用户</span>
<span class="line">message User {</span>
<span class="line">  optional uint32 id = 1 [</span>
<span class="line">    json_name = &quot;id&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;用户ID&quot;}</span>
<span class="line">  ];  // 用户ID</span>
<span class="line"></span>
<span class="line">  optional uint32 role_id = 2 [json_name = &quot;roleId&quot;, (gnostic.openapi.v3.property) = {description: &quot;角色ID&quot;}];  // 角色ID</span>
<span class="line">  optional uint32 work_id = 3 [json_name = &quot;workId&quot;, (gnostic.openapi.v3.property) = {description: &quot;工号&quot;}];  // 工号</span>
<span class="line">  optional uint32 org_id = 4 [json_name = &quot;orgId&quot;, (gnostic.openapi.v3.property) = {description: &quot;部门ID&quot;}];  // 部门ID</span>
<span class="line">  optional uint32 position_id = 5 [json_name = &quot;positionId&quot;, (gnostic.openapi.v3.property) = {description: &quot;岗位ID&quot;}];  // 岗位ID</span>
<span class="line">  optional uint32 creator_id = 6 [json_name = &quot;creatorId&quot;, (gnostic.openapi.v3.property) = {description: &quot;创建者ID&quot;}]; // 创建者ID</span>
<span class="line"></span>
<span class="line">  optional string user_name = 10 [</span>
<span class="line">    json_name = &quot;userName&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;登录名&quot;}</span>
<span class="line">  ]; // 登录名</span>
<span class="line"></span>
<span class="line">  optional string nick_name = 11 [</span>
<span class="line">    json_name = &quot;nickName&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;昵称&quot;}</span>
<span class="line">  ]; // 昵称</span>
<span class="line"></span>
<span class="line">  optional string real_name = 12 [</span>
<span class="line">    json_name = &quot;realName&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;真实姓名&quot;}</span>
<span class="line">  ]; // 真实姓名</span>
<span class="line"></span>
<span class="line">  optional string avatar = 13 [</span>
<span class="line">    json_name = &quot;avatar&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;头像&quot;}</span>
<span class="line">  ]; // 头像</span>
<span class="line"></span>
<span class="line">  optional string email = 14 [</span>
<span class="line">    json_name = &quot;email&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;邮箱&quot;}</span>
<span class="line">  ]; // 邮箱</span>
<span class="line"></span>
<span class="line">  optional string mobile = 15 [</span>
<span class="line">    json_name = &quot;mobile&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;手机号&quot;}</span>
<span class="line">  ]; // 手机号</span>
<span class="line"></span>
<span class="line">  optional string telephone = 16 [</span>
<span class="line">    json_name = &quot;telephone&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;座机号&quot;}</span>
<span class="line">  ]; // 手机号</span>
<span class="line"></span>
<span class="line">  optional UserGender gender = 17 [</span>
<span class="line">    json_name = &quot;gender&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;性别&quot;}</span>
<span class="line">  ]; // 性别</span>
<span class="line"></span>
<span class="line">  optional string address = 18 [</span>
<span class="line">    json_name = &quot;address&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;住址&quot;}</span>
<span class="line">  ]; // 住址</span>
<span class="line"></span>
<span class="line">  optional string region = 19 [</span>
<span class="line">    json_name = &quot;region&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;国家地区&quot;}</span>
<span class="line">  ]; // 国家地区</span>
<span class="line"></span>
<span class="line">  optional string description = 20 [</span>
<span class="line">    json_name = &quot;description&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;个人描述&quot;}</span>
<span class="line">  ]; // 个人描述</span>
<span class="line"></span>
<span class="line">  optional string remark = 21 [</span>
<span class="line">    json_name = &quot;remark&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;备注名&quot;}</span>
<span class="line">  ]; // 备注名</span>
<span class="line"></span>
<span class="line">  optional int64 last_login_time = 30 [</span>
<span class="line">    json_name = &quot;lastLoginTime&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;最后登录时间&quot;}</span>
<span class="line">  ]; // 最后登录时间</span>
<span class="line"></span>
<span class="line">  optional string last_login_ip = 31 [</span>
<span class="line">    json_name = &quot;lastLoginIp&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;最后登录IP&quot;}</span>
<span class="line">  ]; // 最后登录IP</span>
<span class="line"></span>
<span class="line">  optional UserStatus status = 32 [(gnostic.openapi.v3.property) = {</span>
<span class="line">    description: &quot;用户状态&quot;</span>
<span class="line">    default: {string: &quot;ON&quot;}</span>
<span class="line">  }]; // 用户状态</span>
<span class="line"></span>
<span class="line">  optional UserAuthority authority = 33 [(gnostic.openapi.v3.property) = {</span>
<span class="line">    description: &quot;权限&quot;</span>
<span class="line">    default: {string: &quot;CUSTOMER_USER&quot;}</span>
<span class="line">  }]; // 权限</span>
<span class="line"></span>
<span class="line">  repeated string roles = 34 [(gnostic.openapi.v3.property) = {</span>
<span class="line">    description: &quot;角色码&quot;</span>
<span class="line">  }]; // 角色码</span>
<span class="line"></span>
<span class="line">  optional google.protobuf.Timestamp create_time = 200 [json_name = &quot;createTime&quot;, (gnostic.openapi.v3.property) = {description: &quot;创建时间&quot;}];// 创建时间</span>
<span class="line">  optional google.protobuf.Timestamp update_time = 201 [json_name = &quot;updateTime&quot;, (gnostic.openapi.v3.property) = {description: &quot;更新时间&quot;}];// 更新时间</span>
<span class="line">  optional google.protobuf.Timestamp delete_time = 202 [json_name = &quot;deleteTime&quot;, (gnostic.openapi.v3.property) = {description: &quot;删除时间&quot;}];// 删除时间</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 获取用户列表 - 答复</span>
<span class="line">message ListUserResponse {</span>
<span class="line">  repeated User items = 1;</span>
<span class="line">  int32 total = 2;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 获取用户数据 - 请求</span>
<span class="line">message GetUserRequest {</span>
<span class="line">  uint32 id = 1;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 创建用户 - 请求</span>
<span class="line">message CreateUserRequest {</span>
<span class="line">  optional uint32 operator_id = 1 [</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;操作用户ID&quot;, read_only: true},</span>
<span class="line">    json_name = &quot;operatorId&quot;</span>
<span class="line">  ]; // 操作用户ID</span>
<span class="line"></span>
<span class="line">  User data = 2;</span>
<span class="line"></span>
<span class="line">  optional string password = 3 [</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;用户登录密码&quot;, read_only: true},</span>
<span class="line">    json_name = &quot;password&quot;</span>
<span class="line">  ]; // 用户登录密码</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 更新用户 - 请求</span>
<span class="line">message UpdateUserRequest {</span>
<span class="line">  optional uint32 operator_id = 1 [</span>
<span class="line">    json_name = &quot;operatorId&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;操作用户ID&quot;, read_only: true}</span>
<span class="line">  ]; // 操作用户ID</span>
<span class="line"></span>
<span class="line">  User data = 2 [</span>
<span class="line">    json_name = &quot;data&quot;,</span>
<span class="line">    (google.api.field_behavior) = REQUIRED,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;用户的数据&quot;}</span>
<span class="line">  ]; // 用户的数据</span>
<span class="line"></span>
<span class="line">  optional string password = 3 [</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;用户登录密码&quot;, read_only: true},</span>
<span class="line">    json_name = &quot;password&quot;</span>
<span class="line">  ]; // 用户登录密码</span>
<span class="line"></span>
<span class="line">  google.protobuf.FieldMask update_mask = 4 [</span>
<span class="line">    json_name = &quot;updateMask&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {</span>
<span class="line">      description: &quot;要更新的字段列表&quot;,</span>
<span class="line">      example: {yaml : &quot;id,realName,userName&quot;}</span>
<span class="line">    }</span>
<span class="line">  ]; // 要更新的字段列表</span>
<span class="line"></span>
<span class="line">  optional bool allow_missing = 5 [</span>
<span class="line">    json_name = &quot;allowMissing&quot;,</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下\`updateMask\`字段将会被忽略。&quot;}</span>
<span class="line">  ]; // 如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下\`updateMask\`字段将会被忽略。</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 删除用户 - 请求</span>
<span class="line">message DeleteUserRequest {</span>
<span class="line">  optional uint32 operator_id = 1 [</span>
<span class="line">    (gnostic.openapi.v3.property) = {description: &quot;操作用户ID&quot;, read_only: true},</span>
<span class="line">    json_name = &quot;operatorId&quot;</span>
<span class="line">  ]; // 操作用户ID</span>
<span class="line"></span>
<span class="line">  uint32 id = 2;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是<code>用户User</code>的一个完整的gRPC的API，包含了最基本的：用户数据结构，CURD的API。</p><p>需要特别讲解的是：<code>gnostic.openapi.v3.property</code>，这是用于生成OpenAPI的。</p><p>下面再给出RESTFull的服务定义：</p><div class="language-proto line-numbers-mode" data-highlighter="prismjs" data-ext="proto"><pre><code><span class="line">syntax = &quot;proto3&quot;;</span>
<span class="line"></span>
<span class="line">package admin.service.v1;</span>
<span class="line"></span>
<span class="line">import &quot;gnostic/openapi/v3/annotations.proto&quot;;</span>
<span class="line">import &quot;google/api/annotations.proto&quot;;</span>
<span class="line">import &quot;google/protobuf/empty.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;user/service/v1/user.proto&quot;;</span>
<span class="line">import &quot;pagination/v1/pagination.proto&quot;;</span>
<span class="line"></span>
<span class="line">// 用户管理服务</span>
<span class="line">service UserService {</span>
<span class="line">  // 获取用户列表</span>
<span class="line">  rpc ListUser (pagination.PagingRequest) returns (user.service.v1.ListUserResponse) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      get: &quot;/admin/v1/users&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 获取用户数据</span>
<span class="line">  rpc GetUser (user.service.v1.GetUserRequest) returns (user.service.v1.User) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      get: &quot;/admin/v1/users/{id}&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 创建用户</span>
<span class="line">  rpc CreateUser (user.service.v1.CreateUserRequest) returns (google.protobuf.Empty) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      post: &quot;/admin/v1/users&quot;</span>
<span class="line">      body: &quot;*&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 更新用户</span>
<span class="line">  rpc UpdateUser (user.service.v1.UpdateUserRequest) returns (google.protobuf.Empty) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      put: &quot;/admin/v1/users/{data.id}&quot;</span>
<span class="line">      body: &quot;*&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 删除用户</span>
<span class="line">  rpc DeleteUser (user.service.v1.DeleteUserRequest) returns (google.protobuf.Empty) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      delete: &quot;/admin/v1/users/{id}&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>这里需要说明的是：两个<code>UserService</code>可以是合二为一，也可以有多个。初学者一定会疑惑，我为什么要将之分离开来，为啥不能一个？首先，它可以只有一个，即RESTfull和gRPC的接口定义都在一个<code>UserService</code>当中，而我分离开来了，那么，我为什么分离开来了呢？分离开来的好处是，职责分明。前者用于内部通讯的RPC接口，后者用于对外的RESTfull接口。</p></blockquote><p>在实际应用中，我们可能有admin和面向于app的两套API，我们就可以分别对之进行定义：</p><div class="language-proto line-numbers-mode" data-highlighter="prismjs" data-ext="proto"><pre><code><span class="line">syntax = &quot;proto3&quot;;</span>
<span class="line"></span>
<span class="line">package front.service.v1;</span>
<span class="line"></span>
<span class="line">import &quot;gnostic/openapi/v3/annotations.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;google/api/field_behavior.proto&quot;;</span>
<span class="line">import &quot;google/api/annotations.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;pagination/v1/pagination.proto&quot;;</span>
<span class="line"></span>
<span class="line">import &quot;user/service/v1/user.proto&quot;;</span>
<span class="line"></span>
<span class="line">// 用户服务</span>
<span class="line">service UserService {</span>
<span class="line">  // 查询用户列表</span>
<span class="line">  rpc ListUser(pagination.PagingRequest) returns (user.service.v1.ListUserResponse) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      get: &quot;/app/v1/users&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 搜索用户</span>
<span class="line">  rpc SearchUser(user.service.v1.SearchUserRequest) returns (user.service.v1.ListUserResponse) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      get: &quot;/app/v1/users:search&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 查询用户详情</span>
<span class="line">  rpc GetUser(user.service.v1.GetUserRequest) returns (user.service.v1.User) {</span>
<span class="line">    option (google.api.http) = {</span>
<span class="line">      get: &quot;/app/v1/users/{id}&quot;</span>
<span class="line">    };</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-使用buf管理proto" tabindex="-1"><a class="header-anchor" href="#_2-使用buf管理proto"><span>2. 使用Buf管理proto</span></a></h2><p>当我们用熟悉了Protobuf之后，会遇到一个很头疼的问题：</p><p>我们该如何去管理和构建它呢？</p><p>在最早的时候，我只能够手动的调用protoc命令进行代码生成：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># generate go struct code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--go_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate grpc service code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-grpc_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate rest service code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-http_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate kratos errors code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. --go-errors_out<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># generate message validator code</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--validate_out</span><span class="token operator">=</span>paths<span class="token operator">=</span>source_relative,lang<span class="token operator">=</span>go:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate openapi v3 yaml doc</span></span>
<span class="line">protoc <span class="token parameter variable">--proto_path</span><span class="token operator">=</span>. <span class="token parameter variable">--openapi_out</span><span class="token operator">=</span>naming<span class="token operator">=</span>json<span class="token operator">=</span>paths<span class="token operator">=</span>source_relative:<span class="token punctuation">..</span>/ ./*.proto</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate typescript code</span></span>
<span class="line">protoc <span class="token parameter variable">--plugin</span><span class="token operator">=</span>./node_modules/.bin/protoc-gen-ts_proto <span class="token parameter variable">--ts_proto_out</span><span class="token operator">=</span>. ./simple.proto</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate dart code</span></span>
<span class="line">protoc <span class="token parameter variable">--dart_out</span><span class="token operator">=</span>. test.proto</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>怎么样，头大不？要调用这么多命令，生成这么多代码。我后来又想了很多办法，比如：</p><ol><li>写进Shell脚本；</li><li>写进Makefile；</li><li>利用go语言的go:generate注解。</li></ol><p>结果发现，全部都不实用，而且无法进行工程化，在团队内难以实施。直到最后，我发现了<a href="https://docs.buf.build/" target="_blank" rel="noopener noreferrer">buf.build</a>这个专门用于构建protobuf API的工具。</p><p>Buf主要提供了两个工具：</p><ol><li><strong>Buf Schema Registry（BSR）：</strong> 其官方网站地址：<a href="https://buf.build/" target="_blank" rel="noopener noreferrer">buf.build</a>，是一个用于管理和共享 Protocol Buffers（protobuf）代码的平台。</li><li><strong>Buf CLI：</strong> 是一个强大的命令行工具，提供了一系列用于处理、验证和管理 protobuf 代码的功能。</li></ol><p>简单的说就是：BSR是一个proto的代码库，类似于github，上面我用到的 <a href="https://buf.build/tx7do/pagination" target="_blank" rel="noopener noreferrer">pagination.proto</a>，我就是提交到了BSR。</p><p>更多时候，我们使用最多的是Buf CLI这个工具，用它来生成代码，用的最多的就是两个命令：</p><ol><li><code>buf dep update</code> 用于更新三方依赖proto；</li><li><code>buf generate</code> 用于生成代码。</li></ol><p>buf有两套配置文件：</p><ol><li><p><code>buf.yaml</code> 主要也就是定义proto文件的路径，以及依赖的第三方proto。</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v2</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">modules</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> protos</span>
<span class="line">    <span class="token key atrule">lint</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">use</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> STANDARD</span>
<span class="line">    <span class="token key atrule">breaking</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">use</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> FILE</span>
<span class="line"><span class="token key atrule">deps</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token string">&#39;buf.build/googleapis/googleapis&#39;</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token string">&#39;buf.build/kratos/apis&#39;</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token string">&#39;buf.build/gnostic/gnostic&#39;</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token string">&#39;buf.build/tx7do/pagination&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">breaking</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token key atrule">use</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> FILE</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">lint</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token key atrule">use</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> DEFAULT</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>buf.gen.yaml</code> 定义生成规则（这里是go代码生成）。</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code><span class="line"><span class="token comment"># 配置protoc生成规则</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v2</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">clean</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">managed</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">disable</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> buf.build/googleapis/googleapis</span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/envoyproxy/protoc-gen-validate&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/kratos/apis&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/gnostic/gnostic&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/gogo/protobuf&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/tx7do/pagination&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">override</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">file_option</span><span class="token punctuation">:</span> go_package_prefix</span>
<span class="line">    <span class="token key atrule">value</span><span class="token punctuation">:</span> kratos<span class="token punctuation">-</span>cms/api/gen/go</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">plugins</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token comment"># 使用go插件生成go代码</span></span>
<span class="line"><span class="token comment">#- plugin: buf.build/protocolbuffers/go</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>go</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span> paths=source_relative <span class="token comment"># 使用相对路径</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用go-grpc插件生成gRPC服务代码</span></span>
<span class="line"><span class="token comment">#- plugin: buf.build/grpc/go</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>go<span class="token punctuation">-</span>grpc</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> paths=source_relative <span class="token comment"># 使用相对路径</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate rest service code</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>go<span class="token punctuation">-</span>http</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> paths=source_relative <span class="token comment"># 使用相对路径</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate kratos errors code</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>go<span class="token punctuation">-</span>errors</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> paths=source_relative <span class="token comment"># 使用相对路径</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate message validator code</span></span>
<span class="line"><span class="token comment">#- plugin: buf.build/bufbuild/validate-go</span></span>
<span class="line"><span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>validate</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> gen/go</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> paths=source_relative <span class="token comment"># 使用相对路径</span></span>
<span class="line">    <span class="token punctuation">-</span> lang=go</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>如果我们还需要生成OpenAPI，则可以再多定义个比如文件名为<code>buf.openapi.gen.yaml</code>的proto文件：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code><span class="line"><span class="token comment"># 配置protoc生成规则</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v2</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">clean</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">managed</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">disable</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> buf.build/googleapis/googleapis</span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/envoyproxy/protoc-gen-validate&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/kratos/apis&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/gnostic/gnostic&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/gogo/protobuf&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/tx7do/pagination&#39;</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">override</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">file_option</span><span class="token punctuation">:</span> go_package_prefix</span>
<span class="line">      <span class="token key atrule">value</span><span class="token punctuation">:</span> kratos<span class="token punctuation">-</span>cms/api/gen/go</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">inputs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">directory</span><span class="token punctuation">:</span> protos</span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> protos/front/service/v1</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">plugins</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># generate openapi v2 json doc</span></span>
<span class="line">  <span class="token comment">#  - local: protoc-gen-openapiv2</span></span>
<span class="line">  <span class="token comment">#    out: ../app/front/service/cmd/server/assets</span></span>
<span class="line">  <span class="token comment">#    opt:</span></span>
<span class="line">  <span class="token comment">#      - json_names_for_fields=true</span></span>
<span class="line">  <span class="token comment">#      - logtostderr=true</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment"># generate openapi v3 yaml doc</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>openapi</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> ../app/front/service/cmd/server/assets</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> naming=json <span class="token comment"># 命名约定。使用&quot;proto&quot;则直接从proto文件传递名称。默认为：json</span></span>
<span class="line">      <span class="token punctuation">-</span> depth=2 <span class="token comment"># 循环消息的递归深度，默认为：2</span></span>
<span class="line">      <span class="token punctuation">-</span> default_response=false <span class="token comment"># 添加默认响应消息。如果为“true”，则自动为使用google.rpc.Status消息的操作添加默认响应。如果您使用envoy或grpc-gateway进行转码，则非常有用，因为它们使用此类型作为默认错误响应。默认为：true。</span></span>
<span class="line">      <span class="token punctuation">-</span> enum_type=string <span class="token comment"># 枚举类型的序列化的类型。使用&quot;string&quot;则进行基于字符串的序列化。默认为：integer。</span></span>
<span class="line">      <span class="token punctuation">-</span> output_mode=merged <span class="token comment"># 输出文件生成模式。默认情况下，只有一个openapi.yaml文件会生成在输出文件夹。使用“source_relative”则会为每一个&#39;[inputfile].proto&#39;文件单独生成一个“[inputfile].openapi.yaml”文件。默认为：merged。</span></span>
<span class="line">      <span class="token punctuation">-</span> fq_schema_naming=false <span class="token comment"># Schema的命名是否加上包名，为true，则会加上包名，例如：trade.service.v1.ListDictDetailResponse，否则为：ListDictDetailResponse。默认为：false。</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令：<code>buf generate --template buf.openapi.gen.yaml</code>生成OpenAPI文档。</p><p>要生成Typescript代码就创建一个<code>buf.typescript.gen.yaml</code>的配置文件：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code><span class="line"><span class="token comment"># 配置protoc生成规则</span></span>
<span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> v2</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">clean</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">managed</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">disable</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> buf.build/googleapis/googleapis</span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/envoyproxy/protoc-gen-validate&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/kratos/apis&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/gnostic/gnostic&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/gogo/protobuf&#39;</span></span>
<span class="line">    <span class="token punctuation">-</span> <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token string">&#39;buf.build/tx7do/pagination&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">inputs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">directory</span><span class="token punctuation">:</span> protos</span>
<span class="line">    <span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> protos/admin/service/v1</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">plugins</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># generate typescript code</span></span>
<span class="line">  <span class="token comment">#  - remote: buf.build/community/stephenh-ts-proto</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">local</span><span class="token punctuation">:</span> protoc<span class="token punctuation">-</span>gen<span class="token punctuation">-</span>ts_proto</span>
<span class="line">    <span class="token key atrule">out</span><span class="token punctuation">:</span> ../../frontend/admin/apps/admin/src/rpc/api</span>
<span class="line">    <span class="token key atrule">opt</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> outputSchema=false <span class="token comment"># 生成模式 (const, no-file-descriptor, true, false)</span></span>
<span class="line">      <span class="token punctuation">-</span> outputTypeRegistry=false <span class="token comment"># 生成类型注册表</span></span>
<span class="line">      <span class="token punctuation">-</span> outputTypeAnnotations=false <span class="token comment"># 生成类型注解 （static-only, true, optional, false）</span></span>
<span class="line">      <span class="token punctuation">-</span> outputServices=default <span class="token comment"># 生成服务代码 (default, definitions, grpc-js, nice-grpc, false, none)</span></span>
<span class="line">      <span class="token punctuation">-</span> outputJsonMethods=false <span class="token comment"># 生成json方法：toJSON、fromJSON</span></span>
<span class="line">      <span class="token punctuation">-</span> outputEncodeMethods=false <span class="token comment"># 生成编码方法：encode、decode</span></span>
<span class="line">      <span class="token punctuation">-</span> outputPartialMethods=false <span class="token comment"># Message.fromPartial和Message.create方法生成</span></span>
<span class="line">      <span class="token punctuation">-</span> outputClientImpl=false <span class="token comment"># 生成客户端实现 （grpc-web, false）</span></span>
<span class="line">      <span class="token punctuation">-</span> useExactTypes=true <span class="token comment"># 使用精确类型</span></span>
<span class="line">      <span class="token punctuation">-</span> usePrototypeForDefaults=true <span class="token comment"># 使用原型作为默认值</span></span>
<span class="line">      <span class="token punctuation">-</span> useJsonName=true <span class="token comment"># 使用json_name定义的字段名</span></span>
<span class="line">      <span class="token punctuation">-</span> useNullAsOptional=true <span class="token comment"># optional字段生成的类型，如果为true生成null，否则生成undefined。</span></span>
<span class="line">      <span class="token punctuation">-</span> useDate=false <span class="token comment"># google.protobuf.Timestamp类型转换为Date类型，如果为true，则生成Date类型，否则保持Timestamp类型。</span></span>
<span class="line">      <span class="token punctuation">-</span> useOptionals=none <span class="token comment"># 将字段声明为可选项，即是否加?号(all, messages, none)</span></span>
<span class="line">      <span class="token punctuation">-</span> useMapType=true <span class="token comment"># 使用Map类型</span></span>
<span class="line">      <span class="token punctuation">-</span> useReadonlyTypes=false <span class="token comment"># 使用只读类型readonly</span></span>
<span class="line">      <span class="token punctuation">-</span> nestJs=false <span class="token comment"># 使用nestjs</span></span>
<span class="line">      <span class="token punctuation">-</span> onlyTypes=false <span class="token comment"># 只生成类型，如果为true，等价于：outputJsonMethods=false,outputEncodeMethods=false,outputClientImpl=false,nestJs=false</span></span>
<span class="line">      <span class="token punctuation">-</span> fileSuffix=.pb <span class="token comment"># 文件后缀</span></span>
<span class="line">      <span class="token punctuation">-</span> enumsAsLiterals=false <span class="token comment"># 枚举作为文字</span></span>
<span class="line">      <span class="token punctuation">-</span> comments=true <span class="token comment"># 注释输出</span></span>
<span class="line">      <span class="token punctuation">-</span> exportCommonSymbols=false <span class="token comment"># 导出公共符号，如果为true，则生成protobufPackage，否则不导出。</span></span>
<span class="line">      <span class="token punctuation">-</span> esModuleInterop=true</span>
<span class="line">      <span class="token punctuation">-</span> forceLong=string <span class="token comment"># 强制long类型为string</span></span>
<span class="line">      <span class="token punctuation">-</span> oneof=unions <span class="token comment"># oneof生成的类型，如果为unions，则生成联合类型，否则生成交叉类型。</span></span>
<span class="line">      <span class="token punctuation">-</span> stringEnums=true <span class="token comment"># 枚举项生成的类型，如果为true，则生成字符串，否则生成为整型。</span></span>
<span class="line">      <span class="token punctuation">-</span> unrecognizedEnum=false <span class="token comment"># 未识别的枚举项，如果为true，默认会给enum增加一个UNRECOGNIZED枚举项。</span></span>
<span class="line">      <span class="token punctuation">-</span> outputIndex=false <span class="token comment"># 生成index.ts文件</span></span>
<span class="line">      <span class="token punctuation">-</span> paths=source_relative <span class="token comment"># 使用相对路径</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令：<code>buf generate --template buf.typescript.gen.yaml</code>生成TypeScript代码。</p><blockquote><p>需要注意的是，protoc的插件可以用本地的插件，也可以用远端BSR中的protoc插件。在上面的实例里面，我都用的是本地的protoc插件，需要先行在本地进行安装。在团队协作当中，建议使用远端的protoc插件，用远端的protoc插件有个好处，那就是可以保证每一个人所使用的插件一致性（本地的有可能版本不一致）。</p></blockquote><h2 id="_3-使用make执行buf命令" tabindex="-1"><a class="header-anchor" href="#_3-使用make执行buf命令"><span>3. 使用Make执行Buf命令</span></a></h2><p>本以为用了Buf之后，可以高枕无忧了，实际运用中，我们有可能会有多个buf的生成配置文件，那么我们就需要多个生成命令。命令写进shell脚本也不是不可以，但是，会有平台差异（Windows没有shell脚本，只有bat）。那么，我们可以使用Makefile，make是可以在任意平台上运行的，包括Windows。</p><div class="language-makefile line-numbers-mode" data-highlighter="prismjs" data-ext="makefile"><pre><code><span class="line"><span class="token comment"># generate protobuf api go code</span></span>
<span class="line"><span class="token target symbol">goapi</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token operator">@</span>cd api &amp;&amp; \\</span>
<span class="line">	buf generate</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate OpenAPI v3 docs.</span></span>
<span class="line"><span class="token target symbol">openapi</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token operator">@</span>cd api &amp;&amp; \\</span>
<span class="line">	buf generate --template buf.admin.openapi.gen.yaml &amp;&amp; \\</span>
<span class="line">  	buf generate --template buf.front.openapi.gen.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate typescript.</span></span>
<span class="line"><span class="token target symbol">ts</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token operator">@</span>cd api &amp;&amp; \\</span>
<span class="line">	buf generate --template buf.admin.typescript.gen.yaml &amp;&amp; \\</span>
<span class="line">	buf generate --template buf.front.typescript.gen.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># generate protobuf api dart code.</span></span>
<span class="line"><span class="token target symbol">dart</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token operator">@</span>cd api &amp;&amp; \\</span>
<span class="line">	buf generate --template buf.front.dart.gen.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><code>buf generate</code>命令默认读取的是当前目录下文件名为<code>buf.gen.yaml</code>的配置文件。</p></blockquote><p>现在我们就可以在项目的根目录下面运行make命令：</p><p>生成go代码:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">make</span> api</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>生成OpenAPI文档：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">make</span> openapi</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>生成TypeScript代码：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">make</span> ts</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>生成Dart代码：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">make</span> dart</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="项目代码" tabindex="-1"><a class="header-anchor" href="#项目代码"><span>项目代码</span></a></h2><ul><li><a href="https://gitee.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Gitee</a></li><li><a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Github</a></li></ul><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><ul><li><a href="https://developers.google.com/protocol-buffers/docs/overview" target="_blank" rel="noopener noreferrer">Protocol Buffers Documentation</a></li><li><a href="https://grpc.io/docs/" target="_blank" rel="noopener noreferrer">gRPC Documentation</a></li><li><a href="https://grpc-ecosystem.github.io/grpc-gateway/" target="_blank" rel="noopener noreferrer">gRPC-Gateway Documentation</a></li></ul>`,59)])])}const c=s(i,[["render",p]]),r=JSON.parse('{"path":"/posts/go_wind_admin_api_management.html","title":"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：API管理","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["GoWind风行"],"tag":["Golang","Go-Kratos","GoWind"],"sticky":10},"headers":[{"level":2,"title":"1. 使用Protobuf编写API","slug":"_1-使用protobuf编写api","link":"#_1-使用protobuf编写api","children":[]},{"level":2,"title":"2. 使用Buf管理proto","slug":"_2-使用buf管理proto","link":"#_2-使用buf管理proto","children":[]},{"level":2,"title":"3. 使用Make执行Buf命令","slug":"_3-使用make执行buf命令","link":"#_3-使用make执行buf命令","children":[]},{"level":2,"title":"项目代码","slug":"项目代码","link":"#项目代码","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":7,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"9ee9593d10296afa6d6a136d0fec19daa5fa3aad","time":1769485475000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: add posts."},{"hash":"010e3215f55190804ae072b007c76eaf933f80c7","time":1765524468000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: edit posts"},{"hash":"ae111c1195e0474d663bce54e67cfce0cfdaa8fe","time":1765461806000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: edit posts."},{"hash":"7e42dbb4e66dfb7c36bda080e85d48a6e07cf659","time":1744077635000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: edit posts."},{"hash":"241cd3394ef422ea119def33c84077bbffa5ab62","time":1744077027000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: edit posts."},{"hash":"e7c062157bc6a52ef94f56810c42aa7d624abf4a","time":1740107571000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: add posts."}]},"filePathRelative":"posts/go_wind_admin_api_management.md","excerpt":"\\n<p>开门见山，<a href=\\"https://go-kratos.dev/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Kratos</a>内置的RPC是<a href=\\"https://grpc.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">gRPC</a>，而gRPC是基于<a href=\\"https://protobuf.dev/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Protobuf</a>作为 <strong>接口规范的描述语言（IDL，Interface Description Language）</strong>。</p>"}');export{c as comp,r as data};
