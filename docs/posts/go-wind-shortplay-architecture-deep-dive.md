---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
  - Flutter
  - 短视频
sticky: 10
---

# GoWind ShortPlay 深度拆解：三服务 BFF + Core，一条请求的完整工程链路

> 本文回答一个问题：**一次上下滑、一次发布、一次审核驳回，在 GoWind ShortPlay 里分别走过了哪些代码、哪些状态与哪些取舍？**

[GoWind ShortPlay](https://github.com/tx7do/go-wind-shortplay) 是一个短视频社区的完整实现：上下滑沉浸式 Feed、拍摄发布、互动社区、后台审核闭环。后端 Go 1.26 + Kratos v2.9 + Ent v0.14 + PostgreSQL/Redis/MinIO，前端 React 19 管理台 + Flutter 跨平台 App，与 [go-wind-cms](https://github.com/tx7do/go-wind-cms) 同构——同一套基座，换一个业务域长出一个新产品。

它的工程密度不低：管理后台的权限/审计/字典是完整的 GoWind Admin 基建；Feed 有真实的三路召回与已看去重；上传有自研分片协议；审核有状态机白名单与举报联动。本文把这层工程细节拆开来看——聚焦六个模块：**请求链路、契约组织、Feed 召回、发布管线、状态机、鉴权体系**（Feed 推荐闭环另有专题，此处只带到为止）。

---

## 一、全貌：三服务与一条请求的完整链路

```
React Admin ──▶ admin BFF (REST :7600, SSE :7601) ──┐
                                                    ├──gRPC──▶ core (:7900, 唯一数据落点)
Flutter App ──▶ app BFF (REST :7700) ───────────────┘              │
                                            PostgreSQL / Redis / MinIO / FFmpeg
```

| 服务 | 职责 | 一句话定位 |
|------|------|-----------|
| **admin / app BFF** | 瘦网关 | 参数校验 + 转发，**不连库**。仓储层由对 core 的 gRPC 客户端替代 |
| **core** | 核心业务 | 全部业务逻辑 + Ent 数据层，**唯一碰数据库的进程**，经 etcd 注册发现 |

领域拆分体现在 proto 与 core 内部模块上（业务域 video / feed / report / sysconf / uba，基建域 identity / permission / authentication / comment / notify / internal_message……），**不体现在进程上**。为什么开源版不把视频服务和互动服务拆开跑？进程数就是部署与运维成本，模块边界留在 proto 里——真要拆时按图索骥，调用面已经按服务边界组织好了。

### 1.1 手写装配与统一的停机路径

三个服务的依赖图全部手写在 `wiring.go`（admin 247 行、core 285 行），无 wire/dig，基础层 → data → service → server 严格单向，漏接由编译器报错。每个 `initApp` 返回三值：

```go
func initApp(ctx *bootstrap.Context) (*kratos.App, func(), error) {
	// ...逐层构造资源
	// 持有 cleanup 的资源创建成功后立即注册进 cleanups;
	// 任何一步失败,rollback 逆序执行
	// (shutdown 与中途失败共用同一条 LIFO 路径)
}
```

第二个返回值是 cleanup 注册表——**优雅停机与构造中途失败共用同一条逆序回滚路径**。这是手写装配才能做到的显式性：DI 框架把生命周期交给容器魔法，这里每一行都看得见。样板成本由 `make register ENTITY=xxx` 脚手架兜底——wiring.go 里预埋 `register:client / register:service / register:repo` 锚点注释，工具做幂等注入。

### 1.2 一条请求的七环链路

以 admin 调视频列表为例，中间件装配顺序在 `rest_server.go` 里是**注释过顺序敏感性**的：

```
logging → 审计日志 → selector[ 鉴权 auth.Server, authz ].Match(游客白名单) → ent.Server
```

1. **BFF 不本地验签**。`auth.Server` 中间件抽 `Authorization: Bearer` 后，发起 gRPC 调用 core 的 `ValidateToken`，并带上自己的 `ClientType_admin`——**令牌按端隔离**：admin 签发的 token 到 app 端直接 401，反之亦然。
2. **core 侧验签四连**：JWT HS256 验签 → 过期检查 → **Redis 令牌缓存逐字比对**（key `gwc:at:{clientType}:{uid}:{jti}`，值必须与提交 token 完全相等，登出/轮换后旧 token 立即失效）→ jti 黑名单检查（封禁用）。
3. **身份透传**：验签通过后把操作者信息组装成 `OperatorMetadata`，经 **protobuf marshal + base64** 写入 kratos metadata 键 `x-md-global-operator`。
4. **自动传播**：BFF→core 的 gRPC 出站调用由 kratos metadata 中间件按 `x-md-global-` 前缀**自动携带**这个头——BFF 的业务代码因此可以是一行透传：

```go
func (s *FeedService) GetFeed(ctx context.Context, req *feedV1.GetFeedRequest) (...) {
	return s.feedClient.GetFeed(ctx, req)   // 身份已在 ctx 的 metadata 里
}
```

5. **core 重建身份**：core 的 ent 中间件从入站 metadata 解码还原操作者，构建带租户作用域的 Viewer，后续所有 Ent 查询经 privacy 拦截器按租户过滤。**core 全程不接触原始 JWT**，只信任网关注入的身份。

`rest_server.go` 里那句注释值得抄录——中间件顺序是安全语义的一部分：

> 鉴权必须在 ent.Server() 之前执行：若顺序颠倒，ent.Server() 总以 md==nil 兜底为 SystemViewer，导致租户隔离失效。

顺序颠倒了不会有任何报错，每个请求照常 200，只是所有人突然都成了 SystemViewer。这类"配置即安全语义"的约束，唯一的归宿就是写在装配代码旁边。

---

## 二、契约组织：一套 proto，双协议同源

`backend/api/protos/` 下 22 个域 × `service/v1/`，命名约定有两条线：

- **core gRPC 面**：`video/service/v1/video.proto` + `video_error.proto`——错误枚举单独成文件，`protoc-gen-go-errors` 生成 `ErrorVideoNotFound` 等构造器与 `IsXxx(err)` 判别函数。跨 gRPC 边界后错误仍可判型：

```go
if authenticationV1.IsUserNotFound(err) { ... }   // 跨服务后依然是类型化判断
```

- **BFF 面**：`i_*.proto` 的 `i_` 前缀表示 interface 适配层——import core 域的 message 复用数据结构，**只重新声明 `google.api.http` 注解**。同一个 message 同时挂 HTTP 路由（BFF）与 gRPC 服务（core），天然双协议同源。

buf managed mode + 5 个本地插件（含 Kratos 的 `protoc-gen-go-http`），`make gen` 一键生成 ent + api + openapi。OpenAPI 文档输出到服务 `assets/` 并**内嵌进二进制**（`swaggerUI.WithMemoryData`），`enable_swagger` 缺省关闭、configs 一键打开——API 文档与代码同源同生，不存在"文档滞后一个版本"。前端另有 TypeScript / Dart 生成模板，Flutter App、React 后台、H5 分享页消费同一份 proto 推导的 API 面。

一个值得注意的例外原则：**契约优先不等于教条**。分片字节路由不走 proto 生成路由（见第三节）——二进制流就该走二进制通道，proto 的 base64 编码对大文件是纯粹的浪费。

---

## 三、视频发布：自研分片协议与三层静默降级

### 3.1 三段式分片上传

发布链路是**自研分片**（不是 MinIO multipart），proto 契约三段式：

```proto
rpc CreateUploadTask (CreateUploadTaskRequest) returns (UploadTask);  // 建任务
rpc UploadChunk      (UploadChunkRequest)      returns (UploadChunkResponse);  // 传分片
rpc CompleteUpload   (CompleteUploadRequest)   returns (Video);        // 合并入库
```

- **建任务**：先过 sysconf 单行配置的两道闸——扩展名白名单（缺省 `.mp4/.mov/.m4v/.webm`）+ 大小上限（缺省 500MB）；缺省分片 4MB，`totalChunks = ceil(fileSize/chunkSize)`，任务号 UUID 落 `sp_upload_tasks`。
- **传分片**：分片写本地暂存 `{taskID}/{%06d.part}`——六位零填充保证**字典序 = 序号序**，合并时直接按文件名遍历，无需排序逻辑；已传序号 append 进 DB 的 `uploaded_chunks` JSON 数组列（顺序上传协议下无需位图，前端可从响应的 `uploaded_chunks` 回显断点）。
- **合并**：状态机 `UPLOADING→MERGING→COMPLETED/FAILED`，先校验分片齐全（缺片报 `CHUNK_MISSING`），按序 `ReadFrom` 合并后 `PutObject` 到 MinIO，**随即 `os.RemoveAll` 清分片目录与合并临时文件**——临时资源不留过夜。

分片字节路由**不走 proto 生成路由**，而是手工注册：

```go
// rest_server.go 的注册顺序注释:
// 分片字节路由必须先于生成路由注册(kratos mux 同 pattern 先注册者优先;
// body=application/octet-stream 原始字节,生成层只能按 protojson 解 base64,
// 与客户端契约不符)
r.PUT("/app/v1/uploads/{task_id}/chunks/{chunk_index}", h.UploadChunk)
```

手工路由内 `io.LimitReader` 限 8MB+1 超限 413——**契约优先与二进制通道并行不悖，边界画在"哪里需要原始字节"上**。

### 3.2 FFmpeg 抽帧封面：三层静默降级

上传完成且用户没传自定义封面时，经 asynq 派发 `video.cover.extract` 异步任务（系统上下文执行）：MinIO 拉视频到临时目录 → FFmpeg 抽帧 → 传回 `sp/covers/{taskID}.jpg` → 回填 cover_url → 清临时目录。

抽帧命令本身很朴素：

```go
// 固定抽第 1 秒、单帧、JPEG 质量档 3;成功判据是文件存在且 >0 字节
exec.Command("ffmpeg", "-y", "-ss", "1", "-i", videoPath, "-vframes", "1", "-q:v", "3", coverPath)
```

真正值得学的是降级设计，整整三层静默：临时目录建不出 → 直接 return；FFmpeg 二进制不存在或执行失败 → `Warnf("cover extract skipped")` 后 return nil；上传/回填失败 → 只记日志。**全程不入队重试**。理由写在注释里："尽力而为"——封面缺失不阻塞发布，视频没有封面也能看。与之对照，通知投递任务是 MaxRetry 3 + 台账幂等——**同一个 asynq 里，两类任务的重试语义按"失败的代价"分别设定**，不是一刀切。

### 3.3 敏感词强制审核

`CompleteUpload` 与 `SubmitDraft` 有同一段逻辑：即便人工审核开关关闭，只要标题/简介命中敏感词表（sysconf 单行配置），就**强制 `REVIEWING` 并清空 PublishedAt**——全局开关挡不住单条内容的定向拦截。开关是给运营的，敏感词是给底线的。

---

## 四、状态机与举报闭环：一处白名单，处处生效

视频状态机四个状态，流转白名单是 switch-on-target 的显式枚举：

```go
// validateVideoStatusTransition
case REVIEWING:  from ∈ {DRAFT, REJECTED, OFFLINE}   // 重新送审
case PUBLISHED:  from ∈ {REVIEWING, DRAFT}           // DRAFT 直发 = 审核关闭场景
case REJECTED:   from == REVIEWING
case OFFLINE:    from == PUBLISHED
// 违例返回域错误 ErrorInvalidStatusTransition
```

`ChangeVideoStatus` 流转时：进 PUBLISHED 自动盖 `publishedAt`；进 REJECTED/OFFLINE **强制要求 reason 非空**（TrimSpace 校验）落 `reject_reason` 列，并站内信通知作者——驳回必有据。

举报闭环的联动设计是这一节的重点：举报**通过即处置目标**，而处置走的就是同一个状态机——`ModerateOffline` 内部同样调 `validateVideoStatusTransition`（目标已下架则报错仅记日志，不阻塞关单）；评论目标则评论删除 + 视频 comment_count-1 + 父评论 reply_count-1 **同事务**。一处白名单约束了所有修改路径，**不存在"从别的入口绕过状态机"的暗门**。

工程细节三则：

- 同举报人+同目标+PENDING 的幂等去重（`DUPLICATE_REPORT`）；
- 给超管发通知前强制切系统 viewer——透传租户用户上下文会让消息行被租户隐私拦截器误注举报者租户，且超管角色解析在租户过滤下命不中；
- 服务间解耦用接口注入缝（`VideoModerator` / `SuperAdminResolver` / `InternalMessageNotifier`），构造完再互相 `Register` 避免依赖成环——比事件总线直白，比构造期互传可行。

---

## 五、互动与通知：Ledger 事务与 SSE 三跳

### 5.1 计数是 Ledger，不是 COUNT(*)

点赞/收藏/评论数是视频行上的**冗余计数列**，schema 注释直接写铁律："ledger 事务内增减，**禁止直接 Set 覆盖**"。实现是"关系行入账 + 计数增减同事务"的成对方法：

```go
func (r *InteractionRepo) LikeVideoWithCounter(...) (liked bool, ...) {
	tx := client.Tx(ctx)
	defer func() { if err != nil { tx.Rollback(); return }; err = tx.Commit() }()

	exist := ExistsLike(...)                    // 先查重,幂等 no-op
	tx.VideoLike.Create()...Save(ctx)           // (user_id,target_type,target_id) 唯一索引防重
	tx.Video.UpdateOneID(videoID).AddLikeCount(1).Exec(ctx)   // ent 原子 AddXxx
}
```

取消用 `AddLikeCount(-1)` 有符号增减。**三种计数三种策略**，按数据性质选型：

- 点赞/收藏/评论：事务 Ledger——丢了算错账；
- 播放量：详情接口 +1，"容忍丢失"不走事务——无关紧要的计数不值得付事务成本；
- 关注数：实时双 COUNT——量级判断，关注数远小于点赞数，冗余列不值。

### 5.2 SSE 三跳：core → Redis Pub/Sub → BFF → 浏览器

通知的实时推送是一条横跨两个进程的三跳链路：

1. **core 发布**：通知落库后 `Publish("go-wind-shortplay:notify:v1", json)`——"**落库为准：发布失败只损失实时性，不影响到达**"。
2. **admin BFF 订阅**：常驻 goroutine 收到事件后，调 core 拿该用户**全部在线 access token**，对每个 token 推一条 SSE——**SSE 流的 streamID 就是 access token 本身**，一人多会话全推。
3. **SSE 端点鉴权**（:7601）：`?stream=<token>` 必须与 Bearer 令牌**逐字相等**，否则 403——把流绑定到已验证令牌，防止拿别人的 streamID 蹭流。日志里 token 一律打 SHA-256 短指纹，"避免日志泄露可冒充的凭证"。

点赞/关注/评论的站内信只在关系**新建**时发（`CreateLike` 返回 `liked=true` 才通知），天然幂等去重；评论双发视频作者与父评论作者，同人去重、自己不通知自己。

---

## 六、鉴权体系：两套加密、一个 fail-closed 的游客边界

短视频社区 C 端天然是"游客可逛、登录可玩"，鉴权设计的重心在边界（Ent 多租户机制另有专题，这里只讲令牌层）：

- **游客白名单**是 operation 名字符串列表（Feed 四读、用户主页、评论列表、UBA 上报……），用 selector Matcher 整段短路鉴权中间件——白名单的粒度是"接口"而非"路由前缀"，新增接口默认在墙内；
- **登录密码传输加密**（AES-CBC，前端 key 同时作 iv）与**凭据存储加密**（AES-256-GCM，`enc:` 前缀判别）是**两套独立体系**——传输防嗅探，存储防拖库。这里埋着一个真实教训：解密密钥引用的是工具库的**包级变量**（公开 dev 缺省值），配置文件的 `aes_key` 并不参与解密——所以三服务 main.go 第一行就是 `OverrideAESKeyFromEnv()` 统一覆盖入口，生产必须前后端同步换 key。注册侧还有个一致性陷阱：注册是 bcrypt 落库（期望明文），登录校验会先 AES 解密再比对——**注册侧必须先解密**，否则存下 bcrypt(密文)，注册后自动登录永远对不上；
- **刷新轮换的原子性**：refresh token 验证走 Redis **Lua 脚本**，"验证 RT → 删 RT → 删 AT"三步原子化避免 TOCTOU 竞态；user_id 与 jti 必须来自已验证令牌的绑定，"而非请求体中不可信的输入"；
- **登录门槛在签发前**：admin 要求 `sys:access_backend`、app 要求 `sys:access_app` 权限码，无码 403——token 里烘进角色码，签发时就拒绝越界端。

---

## 七、数据层拾遗：索引、播种与配置

几个不值得独立成节但值得记录的工程件：

- **索引跟着查询走**：video 表四个索引全部显式命名 StorageKey，且能一一对应到具体查询——`(status, published_at)` 支撑热门/最新召回的过滤+排序、`(author_id, status)` 支撑个人主页（本人可见非公开态）、`(series_id, episode_number)` 支撑剧集选集、`(tenant_id, status)` 支撑租户过滤。没有一个"以防万一"的索引；
- **启动即就绪**：core 首次启动自动建表并**播种管理员/角色/权限/菜单**（空表 count==0 守卫 + 启动自愈补种双轨），全仓找不到一条 SQL 种子脚本；sysconf 单行配置同样幂等自播种（并发播种冲突时回读兜底）；
- **环境变量插值链**：configs 里 `${VAR:default}` 占位符按"环境变量优先、缺省值兜底"解析——这是相对基座新增的配置源（基座只注册 file source，环境变量默认不生效），`.env` 会被 `make run` 与 docker compose 同时装载；
- **错误码契约**：HTTP 错误 body 是 `{"code":404,"reason":"VIDEO_NOT_FOUND","message":"..."}`，reason 枚举由 `*_error.proto` 定义、protoc 插件生成，配对生成 `IsXxx(err)` 判别——前端按 reason 做本地化文案，message 只是开发向调试文本。

---

## 八、快速开始

```bash
# 依赖：Go 1.26+ / Docker / Node ≥20.19 & pnpm / Flutter 3.x
cd backend
cp .env.example .env          # 填入 PostgreSQL/Redis/MinIO 连接值
make init                     # 装 protoc 插件与 CLI 工具链
make gen                      # ent + api + openapi 一键生成

cd app/core/service  && make run   # gRPC :7900（启动即建表播种）
cd app/admin/service && make run   # REST :7600
cd app/app/service   && make run   # REST :7700

cd frontend/admin && pnpm install && pnpm dev      # 管理后台 :16800，admin/admin
cd frontend/app   && flutter run --dart-define=API_BASE=http://127.0.0.1:7700
```

游客即可刷 Feed；发布/点赞/评论/关注需登录。OpenAPI 文档经 `make openapi` 生成，Swagger UI 在 configs 一键打开。

---

## 九、结语

这篇拆的是 GoWind ShortPlay 的骨架。回头看，几个设计决定贯穿始终：**BFF 不连库**让网关可以无状态横扩；**契约双协议同源**让三个客户端消费同一个 API 面；**状态机白名单单点收口**让举报联动不需要第二套审核逻辑；**计数按数据性质分三种策略**拒绝一刀切。它与 go-wind-cms 同构的意义也在这里——基建（权限/审计/字典/通知/任务）是可迁移的资产，业务域才是每个产品自己的部分。

扩展路径也是留好的：转码集群、内容安全机审、AI 推荐以独立服务外挂，`FeedReason` 枚举进了 proto 契约、召回收敛在数据层三个方法里，替换时调用方不动。

仓库：

- GitHub：[github.com/tx7do/go-wind-shortplay](https://github.com/tx7do/go-wind-shortplay)
- Gitee：[gitee.com/tx7do/go-wind-shortplay](https://gitee.com/tx7do/go-wind-shortplay)
