---
date: 2026-07-02
category:
  - GoWind风行
tag:
  - UBA
  - 大数据分析
  - Golang
  - GoWind
sticky: 10
---

# Go Wind UBA 拆解系列 - 架构总览：三服务、数据流与契约优先

> 本文回答一个问题：**当一个用户行为从浏览器发出，到最终在 Vue 看板上变成一条留存曲线，中间经过了哪些服务、哪些代码、哪些取舍？**

## 一、先看全貌：四个角色的接力

GoWind UBA 不是单体，也不是"微服务为了微服务"。它把用户行为分析的链路切成职责清晰的三段服务，外加一个采集 SDK：

```
SDK 上报 ──HTTP──▶ Collector ──Publish──▶ Kafka ──▶ Core ──▶ OLAP
                                                       │
                  Vue 看板 ◀──HTTP/SSE── Admin ◀──gRPC──┘
```

| 服务 | 角色 | 端口 | 一句话职责 |
|------|------|------|-----------|
| **Collector** | 采集 BFF | HTTP 5700 | 接收 SDK 上报，鉴权 + 校验 + 补全，转发 Kafka。**无状态、不落库** |
| **Core** | 核心业务 | gRPC 动态端口 | 事件入库、25 个分析模型、风险检测、标签画像。**所有重逻辑** |
| **Admin** | 管理 BFF | HTTP 5600 / SSE 5601 | 给前端用的 HTTP 网关，**薄转发**到 Core |
| **SDK** | 客户端 | — | 浏览器（TS）/ Unity·Godot（C#），批量上报 + 重试 |

三个服务都通过 **etcd** 注册发现；跨服务调用走 **gRPC**；Core 的 gRPC 端口是 `0.0.0.0:0`（随机端口），启动时注册到 etcd，Admin/Collector 凭 etcd 找到它。

这套划分的好处很实在：**Collector 纯 IO，可以无脑水平扩；Admin 是薄转发，改前端需求不动它；Core 才是承载业务复杂度的地方**。下面逐个拆。

---

## 二、Collector：只干一件事，干到极致

Collector 的代码量很小，因为它恪守"接收 + 转发"的边界。入口就一个：`POST /uba/v1/report`。

它做的事是一个严格的四步流水线（`backend/app/collector/service/internal/service/report_service.go`）：

```
1. appId/appSecret 鉴权   →  拿到权威 tenantId
2. validateEvents         →  校验 eventId/eventName/eventTime + oneof 载荷
3. 权威覆盖 tenantId       →  杜绝跨租户伪造
4. handleBehavior/Risk    →  补字段 → Publish Kafka
```

几个值得注意的设计：

**鉴权在请求体，不在 Header。** `appId` / `appSecret` 放在 JSON body 里。这看起来"不标准"，但它有一个关键收益：**让 `sendBeacon` 成为可能**——浏览器关闭页面时，`navigator.sendBeacon` 无法设置自定义 Header，只能发 body。把凭证放进 body，SDK 在页面卸载时也能可靠地把残留事件冲刷出去（详见 第 3 篇）。

**鉴权器是加固过的。** `AppAuthenticator`（`app_auth.go`）有几个细节值得抠：

- Redis 里只存 `appSecret` 的 **SHA-256 哈希**，不存明文——Redis 泄露不等于密钥泄露。
- 比较密钥用 `subtle.ConstantTimeCompare`——防时序攻击。
- **负缓存**：不存在的 appId 也写进 Redis（短 TTL 1 分钟），防缓存穿透打穿到 DB。
- gRPC 查应用失败时返回 `InternalServerError` 而不是 `Unauthorized`——网络抖动不该被误报成"密码错误"。

**tenantId 权威覆盖是信任边界。** 两行代码：

```go
// 用应用所属的权威 tenant_id 覆盖每个事件，杜绝客户端伪造跨租户上报。
for _, event := range validEvents {
    event.TenantId = app.TenantID
}
```

客户端上报的 `tenantId` 一律作废，服务端按 `appId` 反查出"这个应用属于哪个租户"并强制覆盖。这是整个平台防跨租户越权的**第一道闸**（OLAP 层还有第二道，见 第 4 篇）。

**响应永远不撒谎。** 即便 HTTP 200，`failedCount` 也可能 > 0——批量上报里部分事件校验失败时，会把失败明细按事件类型分组放进 `errorsByType` 返回。SDK 拿到后记 warn，而不是误以为全成功。

---

## 三、Core：复杂度的集中地

Core 是承载所有"重"逻辑的服务。它的对外协议是 **gRPC**（不直接对前端），数据源有两条线：

```
业务实体 ──ent ORM──▶ PostgreSQL   （应用、用户、角色、权限、事件 Schema……）
分析聚合 ──原生 SQL──▶ OLAP         （events_fact / sessions_fact / risk_events）
```

**为什么分析数据要走原生 SQL 而不是 ORM？** 因为漏斗、留存、LTV 这些模型本质是 `GROUP BY + 时间分桶 + 窗口函数`，是 OLAP 引擎的主场。用 ent 这类行式 ORM 去拼这些聚合，既写不出也跑不动。所以项目做了一个清晰的分层：

- **写业务 CRUD** → ent + `go-crud` 泛型 Repository，自动处理分页 / 过滤 / FieldMask；
- **写分析聚合** → 原生 SQL，Doris 用 `db.SelectContext`，ClickHouse 用 `db.Select`，SQL 函数按方言切换。

Core 最有意思的部分是 **双引擎**：同一份业务模型，ClickHouse 和 Doris 各实现一份 repo，运行时二选一。这是整个平台最硬核的设计之一，我会用整个 第 2 篇 来讲。

> ⚠️ **一个诚实的现状**：截至当前版本，`uba_events_raw` / `uba_risk_events` 的 **Kafka 消费入库逻辑在 Core 内尚未实现**。Collector 已经正确 Publish，Core 也提供了 `BehaviorEventService.BatchCreate` 入库入口，但**连接两者的 subscriber 缺失**。这意味着上报数据目前会停留在 Kafka，不会自动落库。生产化前需要补一个消费者（在 Core 内订阅 topic 调 `BatchCreate`，或引入独立 worker）。这种"能力具备但管线未接通"的状态，在真实项目里很常见，文档主动写出来比藏着好。

---

## 四、Admin：薄转发 + SSE

Admin 是给前端用的 HTTP 网关。它的设计哲学是**纯转发，不含业务逻辑**：

```go
// admin/service/internal/service/xxx_service.go
func (s *XxxService) List(ctx context.Context, req *adminV1.ListXxxRequest) (*adminV1.ListXxxResponse, error) {
    return s.client.List(ctx, req)  // 直接转发到 Core 的 gRPC client
}
```

每个 admin 方法体基本就是 `return s.client.Method(ctx, req)`。业务逻辑全在 Core。这样改前端需求时，Admin 层几乎不动；权限 / 菜单 / 聚合都收敛到一处。

Admin 有两个特色值得展开：

### 1. SSE 实时推送（站内消息）

Admin 单独开了一个 SSE 端口（5601）。配置很简洁（`server.yaml`）：

```yaml
server:
  sse:
    addr: ":5601"
    path: "/events"
    auto_stream: true   # 关键：按 streamID 自动创建流，无需预注册
```

`auto_stream: true` 是点睛之笔——调用方不用预先 createStream，URL 上带 `?stream=<id>` 就能自动物化一个流。

推送逻辑（`internal_message_service.go`）的设计很巧妙：

```go
// 用收件人的 access token 作为 streamId
recipientStreamIds, _ := s.authenticationServiceClient.GetAccessTokens(ctx,
    &authenticationV1.GetAccessTokensRequest{
        UserId: recipientUserId, ClientType: authenticationV1.ClientType_admin,
    })
for _, streamId := range recipientStreamIds.AccessTokens {
    s.sseServer.Publish(ctx, sse.StreamID(streamId), &sse.Event{
        Event: []byte("notification"),
        Data:  recipientJson,
        ID:    []byte(id.NewGUIDv7(false)),   // 有序 ID，客户端可去重/排序
    })
}
```

**Stream ID = 用户的 admin access token。** 一个用户在多个设备登录就有多个 token，于是天然实现"按设备 fan-out"。前端登录后用 `?stream=<accessToken>` 连上，后端 Publish 到同一个 streamId，闭环就接上了：

```ts
// frontend/.../stores/authentication.state.ts
const targetSseUrl = `${import.meta.env.VITE_GLOB_SSE_URL}?stream=${accessToken}`;
globalSSEClient.connect(targetSseUrl);

// layouts/basic.vue
globalSSEClient.on<InternalMessageRecipient>('notification', handleSseNotification);
```

事件名 `notification` 是前后端硬契约。注意 SSE 这里**只用于站内消息通知**，不是通用事件总线——这是克制的设计。

### 2. 服务发现 + 动态端口

Core 的 gRPC 监听 `0.0.0.0:0`（随机端口），启动时把"我的地址"写进 etcd；Admin/Collector 通过 etcd 发现 Core 并建 gRPC 连接。这让 Core 可以**多实例部署 + 滚动更新**，是微服务的标准操作。

---

## 五、契约优先：一条代码生成管线

这套平台最省心的地方，是**先写 `.proto` / ent schema，再生成多端代码**。理解这条管线，是二次开发的前提。

### 5.1 Makefile 分层

生成命令分两层：顶层 `backend/Makefile` 负责编排，每个服务目录下的 Makefile `include backend/app.mk` 提供具体动作。`SRCS_MK := $(wildcard app/*/*/Makefile)` 自动发现所有服务，所以 `make ent` / `make wire` 会递归下钻到每个服务。

核心命令（在 `backend/` 下）：

| 命令 | 产物 |
|------|------|
| `make api` | proto → Go（messages + gRPC stub + Kratos HTTP + validate）+ struct tag |
| `make ts` | proto → 前端 TS 客户端 |
| `make openapi` | proto → Swagger / OpenAPI |
| `make ent` | ent schema → ORM 实体代码 |
| `make wire` | 重新生成依赖注入（`wire_gen.go`） |
| `make gen` | = `ent + wire + api + openapi`（**不含 ts**） |

### 5.2 buf Managed Mode：自动注入 go_package

`buf.gen.yaml` 开了 managed mode，自动给项目 proto 注入 `go_package`：

```yaml
managed:
  enabled: true
  disable:                          # 这些外部模块的 go_package 不许 buf 重写
    - module: buf.build/googleapis/googleapis
    - module: buf.build/envoyproxy/protoc-gen-validate
    - module: buf.build/kratos/apis
    # ...
  override:
    - file_option: go_package_prefix
      value: go-wind-uba/api/gen/go
    - file_option: go_package
      path: admin/service/v1
      value: go-wind-uba/api/gen/go/admin/service/v1;adminpb   # 显式包名
```

注意 `disable` 列表——vendored / registry 模块（googleapis、PGV、kratos apis）的 `go_package` 不能被 buf 覆盖，否则会破坏它们的 canonical 路径。

### 5.3 关键细节：TS 只对 admin/service/v1 生成

这是整个 BFF 模式的核心，但容易被忽略。看 `buf.admin.typescript.gen.yaml`：

```yaml
inputs:
  - directory: protos
    paths:
      - protos/admin/service/v1     # ← 只有这个子树是输入
```

**只有 `admin/service/v1` 会被生成 TS 客户端。** 后端内部的 gRPC 服务契约（`uba/service/v1`、`internal_message/service/v1`、`authentication/service/v1` 等）**故意被排除**。

为什么？因为前端只跟 Admin BFF 对话，而 Admin BFF 已经把这些后端服务的数据**重新暴露**成它自己的 HTTP 接口。如果把后端内部 proto 也生成 TS，会**把内部契约泄漏进浏览器 bundle，破坏 BFF 边界**。这是一个很小但很关键的决策。

### 5.4 ⚠️ ent 生成的坑

如果你直接跑 `ent generate ./schema`，**生成的代码会缺方法，编译报错**。正确命令在 `app.mk` 里：

```make
ent:
	@ent generate \
			--feature privacy \
			--feature entql \
			--feature sql/modifier \
			--feature sql/upsert \
			--feature sql/lock \
			./internal/data/ent/schema
```

这五个 feature 是非默认的扩展：`privacy`（隐私策略拦截）、`entql`（类型化谓词 DSL）、`sql/modifier`（`Modify()` 原生 SQL）、`sql/upsert`（ON CONFLICT）、`sql/lock`（SELECT FOR UPDATE）。裸 `ent generate` 生成的 builder 不带这些方法，任何调用 `.Privacy()` / `.QueryModifier()` / `.OnConflict()` 的代码都会编译失败。

**记住：要么 `make ent`，要么带全 feature。** 这是二次开发第一个会踩的坑。

> 💡 顺带一个发现：`make ts` 引用了 `buf.collector.typescript.gen.yaml`，但这个文件在 `backend/api/` 下**不存在**——只有 `buf.collector.openapi.gen.yaml`。所以 `make ts` 第二个 buf 调用会失败。二次开发时注意补上或去掉这一行。

---

## 六、前端：契约驱动 + vue-query + ECharts 按需

前端（Vue 3 + Vben Admin）的架构也深受"契约优先"影响。生成的 TS 客户端落在 `src/api/generated/admin/service/v1/`，外面再包一层 **composable**。

### 三种 composable 范式

`api/composables/` 下 40 个文件，每个都导出三种风格的函数（以 `role.ts` 为例）：

```ts
// 1. 响应式读（vue-query useQuery）—— 在 setup() 里用
export function useListRoles(query, options?) {
  return useQuery({
    queryKey: ['listRoles', query],
    queryFn: () => apiClient.roleService.List(query.toRawParams()),
    ...options,
  });
}

// 2. 命令式读（queryClient.fetchQuery）—— 在路由守卫/store/watch 里用
export async function fetchListRoles(params) {
  return queryClient.fetchQuery({
    queryKey: ['listRoles', params],
    queryFn: () => apiClient.roleService.List(params.toRawParams()),
    staleTime: 0, retry: 0,
  });
}

// 3. mutation（useMutation）—— 增删改
export function useUpdateRole(options?) {
  return useMutation({
    mutationFn: ({ id, values }) => apiClient.roleService.Update({
      id, data: { ...values } as any,
      updateMask: makeUpdateMask(Object.keys(values ?? {})),  // FieldMask 部分更新
    }), ...options,
  });
}
```

关键点：**前两种共享同一个 `queryKey` 和同一个 `queryClient` 单例**，所以响应式 hook 和命令式函数读写的是**同一个缓存**。`updateMask` 用 `Object.keys(values)` 生成 FieldMask，所以是**部分更新而非整对象 PUT**——很 proto 风格。

分析类 composable（`analytics.ts`，最大）用 `staleTime: 60_000`（1 分钟缓存），而 CRUD 模块用 `staleTime: 0`——因为分析聚合重，能接受 1 分钟内的轻微陈旧数据。

### ECharts 按需注册

Vben 默认只注册了 `BarChart / LineChart / PieChart / RadarChart`。项目为 BI 看板**额外注册了** Funnel、Heatmap、VisualMap、MarkLine、MarkPoint（`echarts.ts`）：

```ts
echarts.use([
  TitleComponent, PieChart, RadarChart, TooltipComponent, GridComponent,
  DatasetComponent, TransformComponent, BarChart, LineChart, FunnelChart,
  HeatmapChart, ScatterChart, VisualMapComponent, MarkLineComponent,
  MarkPointComponent, LabelLayout, UniversalTransition, CanvasRenderer,
  LegendComponent, ToolboxComponent,
]);
```

- `FunnelChart` → 漏斗分析
- `HeatmapChart + VisualMapComponent` → 留存矩阵（色阶）
- `MarkLine / MarkPoint` → 异常检测的事件趋势标注

> 💡 一个小瑕疵：`usePathSankey` 这个 composable 存在，但 `SankeyChart` **没有**在 `echarts.use` 里注册。所以路径桑基图要么走了自定义适配，要么这是个没接完的点——二次开发时留意。

### 路由自动收录

加页面不用手动注册路由。`router/routes/index.ts`：

```ts
const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', { eager: true });
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);
```

`modules/` 下任何新 `.ts` 文件都会被 `import.meta.glob` 自动收录——加一个 `modules/app/foo.ts` 导出路由数组，菜单里就有了。

---

## 七、小结：这套架构的可借鉴之处

回到最初的问题：这套架构值不值得抄？我觉得有几条是**超越了"UBA 平台"本身、可以迁移到任何数据密集型后台**的设计原则：

1. **职责切片按"状态"和"复杂度"分，而不是按业务领域分。** Collector 无状态纯 IO，Core 承载所有状态和复杂度，Admin 薄转发。这样扩展性和可维护性都好。
2. **契约优先 + 代码生成，是前后端协同的杠杆。** proto 改一处，Go / TS / OpenAPI / struct tag 全部跟着变。代价是管线本身有学习曲线（ent feature、buf managed mode）。
3. **BFF 模式要落实到生成边界。** 只对 `admin/service/v1` 生成 TS，是用工具链强制守住"内部契约不外泄"——这比口头约定可靠得多。
4. **SSE 用 access token 当 streamId，实现按设备 fan-out。** 一个巧思，省了一个独立的消息分发服务。
5. **诚实的文档。** Kafka 消费未实现、双引擎是编译期常量——这些写进 README 的取舍，让项目可信。

---

*本文代码均出自 [go-wind-uba](https://github.com/tx7do/go-wind-uba) 仓库。如有疑问，欢迎到仓库 issue 讨论。*
