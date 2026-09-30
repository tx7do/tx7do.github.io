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

# Go Wind UBA 拆解系列 - SDK 与采集层：从浏览器到 Kafka

> 本文回答一个问题：**一个埋点事件，从用户在浏览器里点了一下，到最终被 Kafka 接住，中间的 SDK 和 Collector 做了多少你看不见的工程？** 答案是：比你想象的多得多。

## 一、为什么"采集"这件事很难

很多人以为埋点 SDK 就是 `fetch('/report', { body: event })`。这在 demo 里成立，在生产里不成立。真实的采集层要回答这些问题：

- **页面随时可能关闭**——用户点完就关 tab，残留事件怎么办？
- **网络随时可能抖动**——一次失败就丢数据？还是重试？重试几次？退避多久？
- **服务端可能限流**——429 要重试，但 401（鉴权失败）不该重试，怎么区分？
- **批量还是单条**——单条上报开销大，批量要攒多久、攒多少？
- **客户端环境千差万别**——浏览器的 sendBeacon、Unity WebGL 不能用 HttpClient、小程序没有 localStorage……
- **凭证放哪**——放 Header 还是 body？前者标准但不支持 sendBeacon。

GoWind UBA 的两个 SDK（Web TS / C# .NET）和 Collector 服务，把这些都处理了。本文逐个拆。

## 二、Web SDK：一个克制的批量上报器

Web SDK 在 `frontend/sdk/web/uba/src/`，6 个模块。架构很干净：`UbaClient`（高层 API + 事件构造）委托给 `Batcher`（缓冲 + 触发），`Batcher` 委托给 `retry.ts`（网络 + 重试）。上下文（设备/会话/平台）独立在 `context.ts`。

### 2.1 UbaClient：单例 + 事件构造

`UbaClient` 是个**单例**，挂在 `globalThis.__uba_client__` 上。`init()` 会先 tear down 旧实例再重建，避免重复初始化。

所有事件都走一个唯一的构造漏斗 `buildEvent`——这是关键设计，保证每条事件的结构一致：

```ts
const eventTime = toRFC3339();
const mergedProps = merge(this.superProperties, properties);  // 公共属性 + 本次属性
const pageUrl = getPageUrl();
if (pageUrl && !mergedProps.pageUrl) mergedProps.pageUrl = pageUrl;
return {
  eventType, eventId: uuid(), eventName, eventTime,
  userId: options?.userId ?? this.userId,
  deviceId: options?.deviceId ?? getDeviceId(),
  sessionId: options?.sessionId ?? getSessionId(),
  platform: options?.platform ?? this.platform,
  properties: Object.keys(mergedProps).length > 0 ? mergedProps : undefined,
};
```

`setSuperProperties({ platform: 'web', version: '1.0.0' })` 设的公共属性，会**自动合并进后续每一条事件**。`trackBehavior` / `trackRisk` 都是调 `buildEvent` 后再挂一个 **oneof 载荷**（`event.behavior` / `event.risk`）——这跟后端 proto 的 oneof 契约对齐。

### 2.2 Batcher：双触发 + 并发守卫

这是 SDK 的心脏。`Batcher` 持一个内存队列 `queue`、一个 `setInterval` 定时器、一个 `flushing` 布尔守卫。两个触发条件：

**触发 1：攒够了**（`batcher.ts`）

```ts
enqueue(event: ReportEvent): void {
  this.queue.push(event);
  if (this.queue.length >= this.opts.batchSize) {   // 默认 batchSize=20
    void this.flush();
  }
}
```

**触发 2：定时到了**——`setInterval` 每 `flushInterval`（默认 5000ms）调一次 `flush()`。在 Node 环境下调 `.unref()`，避免 timer 卡住进程退出。

`flush()` 的核心是**并发守卫**：

```ts
this.flushing = true;
const events = this.queue.splice(0, this.queue.length);   // 原子清空
try {
  const body = this.buildBody(events);
  const result = await sendWithRetry(this.opts.url, body, {...});
  // ...
} finally {
  this.flushing = false;
}
```

**同一时间只有一个 in-flight 的 send。** 并发的 `flush()` 调用会短路返回。这个设计保证了：不会因为重试风暴把服务端打爆。

**凭证在 body，不在 Header**（`buildBody`）：

```ts
// body = { appId, appSecret, events, clientInfo }
```

这是**整条链路的契约起点**。后面会看到，正是这个选择让 sendBeacon 兜底成为可能。

### 2.3 重试与降级：精确区分状态码

`sendWithRetry` 的重试策略值得细看（`retry.ts`）：

```ts
function isNoRetryStatus(status: number): boolean {
  return status >= 400 && status < 500 && status !== 429;
}

// 循环 maxRetries+1 次
for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
  result = await sendOnce(url, body, cfg);
  if (result.ok) return result;                        // 2xx：成功
  if (isNoRetryStatus(result.status)) return result;   // 4xx（除 429）：不重试
  // 否则退避重试
  if (attempt < cfg.maxRetries) {
    const delay = cfg.baseDelay * Math.pow(2, attempt);  // 指数退避
    await sleep(delay);
  }
}
```

三个关键决策：

1. **401/400 不重试**——鉴权失败或参数错误，重试也是错，浪费请求。直接放弃。
2. **429 要重试**——服务端限流，过会儿可能就好了。
3. **5xx / 网络错误重试**——指数退避（`baseDelay * 2^attempt`，默认 baseDelay=1000ms）。

**重试耗尽后怎么办？丢掉，不回填队列。** 这是有意的——避免无限堆积导致内存爆炸。源码注释明说：宁可丢一批，也不能让 SDK 内存无限增长。

```ts
if (!result.success) {
  dropped = events.length;   // 直接计入 dropped
}
```

`sendOnce` 用 `AbortController` 控超时（默认 8000ms），发 `credentials: 'omit'`（不带 cookie，避免干扰 app-secret 鉴权）。

### 2.4 页面卸载兜底：sendBeacon

这是 Web SDK 最有 browser 特色的部分。浏览器关闭页面时，普通 fetch 会被取消；唯有 `navigator.sendBeacon` 能在卸载时可靠发出去（但它不能设 Header、不能等响应）。

SDK 注册了**双事件**兜底（移动端 + 桌面端覆盖）：

```ts
private bindUnload(): void {
  const handler = () => this.batcher.flushBeacon();
  window.addEventListener('pagehide', handler);     // 移动端友好
  window.addEventListener('beforeunload', handler); // 桌面端
}
```

`flushBeacon` 是**尽力而为**（`batcher.ts`）：

```ts
flushBeacon(): void {
  if (!this.opts.enableBeacon || this.queue.length === 0) return;
  const events = this.queue.splice(0, this.queue.length);
  const body = this.buildBody(events);
  const ok = sendBeacon(this.opts.url, body);     // 用 Blob 包装，异步发出
  if (!ok) {
    this.opts.log('warn', 'sendBeacon failed, events lost on unload');
  }
}
```

注意几个取舍：

- **sendBeacon 发的就是 fetch 同样的 body**（含 appId/appSecret）——正是因为凭证在 body，sendBeacon 才能用。**如果把凭证放 Header，这一层兜底就彻底废了。** 这就是为什么鉴权在 body 是深思熟虑的选择。
- **失败就丢**——sendBeacon 没法重试（页面都没了），SDK 只能 log warn。这是 browser 环境的硬限制，没有银弹。

### 2.5 上下文：设备 / 会话 / 平台

`context.ts` 负责生成稳定标识：

- **deviceId**：存 `localStorage`（`__uba_device_id__`），跨会话稳定；无 localStorage 时（隐私模式 / Node）退回内存变量。
- **sessionId**：存 `sessionStorage`（`__uba_session_id__`），tab 级隔离（关 tab 清掉）；同样有内存兜底。
- **platform**：UA 嗅探，返回 `web/ios/android/mini_program/node`；小程序靠 `window.wx.getSystemInfo` 存在性识别。

热力图用的**点击坐标**和 **XPath** 也在这里算：坐标加上 scroll offset 换算到文档坐标，XPath 用于元素定位。自动埋点的 click 监听绑在**捕获阶段**（`addEventListener('click', handler, true)`），保证在业务逻辑之前触发。

### 2.6 默认值一览

记一下默认值，跟 C# SDK 是镜像的（后文验证）：

| 参数 | 默认值 |
|------|--------|
| batchSize | 20 |
| flushInterval | 5000ms |
| maxRetries | 3 |
| timeout | 8000ms |
| retryBaseDelay | 1000ms |
| enableBeacon | true |
| autoTrack | true |

## 三、C# SDK：零依赖核心 + 可注入传输

C# SDK 在 `sdk/csharp/src/`，两个项目：`Uba.Core`（.NET Standard 2.0，覆盖 Unity / Godot）和 `Uba.Unity`（Unity 适配）。API 跟 TS 版几乎同构（`Track` / `TrackBehavior` / `TrackRisk` / `Identify` / `SetSuperProperties` / `FlushAsync`），默认值也完全一样——这是有意为之，方便团队跨端接入时心智一致。

但有一个**架构性差异**：C# 版的**传输层和上下文都是可注入的**。

### 3.1 IHttpTransport：为 Unity WebGL 留的口子

为什么要抽象传输层？因为 Unity WebGL 是个特殊环境。接口注释写得很清楚（`Transport.cs`）：

```csharp
/// HTTP 传输抽象。核心库提供 HttpClientTransport；Unity 侧可用 UnityWebRequestTransport 覆盖。
/// 抽象出此接口是为了让 Unity WebGL（HttpClient 不可用）能替换实现。
public interface IHttpTransport
{
    Task<FetchResult> SendAsync(string url, string body, int timeoutMs, CancellationToken ct = default);
}
```

**Unity WebGL 里 HttpClient 会抛 `PlatformNotSupportedException`。** 原因是 WebGL 没有原生 socket，浏览器只开放了 fetch 风格的 `UnityWebRequest` API。所以必须替换传输实现。

`UbaClient` 构造函数接受可选的 transport 和 context：

```csharp
public UbaClient(UbaConfig config, IHttpTransport? transport = null, IContextProvider? context = null)
{
    Validate(config);
    _config = config;
    _config.Endpoint = (_config.Endpoint ?? "").TrimEnd('/');
    _context = context ?? new DefaultContextProvider();
    _batcher = new Batcher(_config, transport ?? new HttpClientTransport(),
                           () => _context.GetClientInfo(), Log);
}
```

默认走 `HttpClientTransport`（.NET Core / Mono / Unity 原生平台都能用）；Unity WebGL 注入 `UnityWebRequestTransport`。**这就是依赖注入解决真实问题的范例**——不是为了解耦而解耦，是为了对付平台差异。

`HttpClientTransport` 用**静态共享 HttpClient**（socket 复用），`CancellationTokenSource` 控超时，把"无外部取消的 OperationCanceledException"判为超时。它的 `ParseResult` 是 `public static`，专门让 Unity 适配器复用响应解析。

### 3.2 UnityWebRequestTransport：把协程桥接到 Task

Unity 的 `UnityWebRequest` 必须**在主线程**跑，而且是**协程**风格。怎么跟 `Task` 接口对接？用 `TaskCompletionSource`（`UnityWebRequestTransport.cs`）：

```csharp
public Task<FetchResult> SendAsync(string url, string body, int timeoutMs, CancellationToken ct = default)
{
    var tcs = new TaskCompletionSource<FetchResult>(TaskCreationOptions.RunContinuationsAsynchronously);
    _host.StartCoroutine(SendCoroutine(url, body, timeoutMs, tcs, ct));   // 在 MonoBehaviour host 上启协程
    return tcs.Task;
}
```

协程里每帧轮询 `op.isDone`，超时手动 abort，完成后 resolve TCS。还用 `#if UNITY_2020_2_OR_NEWER` 区分 Unity 版本的错误 API（`req.result` vs `req.isHttpError/isNetworkError`）。响应解码复用 `HttpClientTransport.ParseResult`，不重复造轮子。

### 3.3 Batcher：线程安全版

C# 是多线程环境（不像 JS 单线程），所以 Batcher 用了 `lock` + `Interlocked` 做并发控制（`Batcher.cs`）：

```csharp
if (Interlocked.CompareExchange(ref _flushing, 1, 0) != 0)
    return new FlushResult { Success = true };        // 已有 flush 在跑，短路
List<ReportEvent> events;
lock (_lock) {
    if (_queue.Count == 0) { _flushing = 0; return new FlushResult { Success = true }; }
    events = new List<ReportEvent>(_queue);
    _queue.Clear();
}
```

重试逻辑跟 TS 完全一致（指数退避、4xx 除 429 不重试、耗尽即丢），只是内联在 batcher 里（TS 是独立模块）。**C# 版没有 sendBeacon 等价物**——因为 Unity / Godot 这些运行时不存在"tab 关闭丢数据"问题，这是 TS 独有的 browser 痛点。

### 3.4 零依赖：手写 JSON 序列化器

这是 C# SDK 最"较真"的地方。`Uba.Core.csproj` **零 PackageReference**——确认过，没有任何 NuGet 包。目标 `netstandard2.0`。

代价是**手写了一个 JSON 序列化器**（`Json.cs`）。它的注释说得很直白：

> 仅服务于本库的请求序列化...不实现通用 JSON，保持极简、可审计。

它发 camelCase key、跳过 null、手写一个 `JsonRead` 用 `"key"` 子串扫描找标量值，**不构建完整 DOM**。这一切只为了**不引入 `System.Text.Json` 或 `Newtonsoft.Json`**——让 DLL 干净到能直接丢进 Unity 的 `Assets/Plugins/`。

为什么这么执着于零依赖？因为 Unity 项目对依赖极度敏感：引入一个 JSON 库可能跟 Unity 自带的冲突，或者 IL2CPP 编译时出问题。零依赖 = 部署零摩擦。**这是一个为游戏开发者量身定制的取舍**，也是"游戏专项"不只是后端分析模型、连 SDK 都照顾到的体现。

## 四、Collector：把采集数据接住

Collector 在 第 1 篇 已概览过，这里聚焦采集链路特有的细节。

### 4.1 鉴权：加固实现

`AppAuthenticator`（`app_auth.go`）有几个安全细节，每一个都解决一类真实攻击：

**① Redis 只存哈希，不存明文密钥：**

```go
type cachedApp struct {
    AppID      string `json:"app_id"`
    SecretHash string `json:"secret_hash"`  // sha256(app_secret) 的十六进制串
    Status     ubaV1.Application_Status
    TenantID   uint32 `json:"tenant_id"`
}
```

Redis 被脱库 ≠ 密钥泄露。

**② constant-time 比较，防时序攻击：**

```go
inHash := sha256Hex(appSecret)
if subtle.ConstantTimeCompare([]byte(inHash), []byte(app.SecretHash)) != 1 {
    return nil, collectorV1.ErrorIncorrectAppSecret(...)
}
```

普通字符串比较会在第一个不匹配字节提前返回，攻击者可据此逐字节爆破。`subtle.ConstantTimeCompare` 消耗固定时间。

**③ 负缓存防穿透：** 不存在的 appId 也写进 Redis（TTL 1 分钟）。攻击者拿假 appId 暴力试探，第一次会打穿到 DB，但之后 1 分钟内都被 Redis 挡住。正常 appId 缓存 10 分钟。

**④ 可用性 ≠ 鉴权失败：** gRPC 查应用失败时返回 `InternalServerError`，不返回 `Unauthorized`。一次网络抖动不该让客户端误以为密钥错了，触发改密钥的误操作。

**⑤ 状态检查：** 只有 `Application_ON` 的应用能通过，禁用的应用哪怕密钥对也拒。

### 4.2 字段回填的微妙之处

`handleBehavior` 有个值得讲的设计：业务扩展字段的回填策略。它**优先取 behavior oneof 里的值**，只有对"有存在性语义"的字段（空串 / nil / len==0 才算未设）才回退到顶层 `ReportEvent`。

但**数值标量不回退**（`SessionSeq` / `DurationMs` / `Quantity` / `Score`）。源码注释解释：proto3 区分不了"未设"和"显式 0"——如果回退，会把合法的 `Score=0`（用户真打了 0 分）错改成顶层默认值。这是 proto3 的经典坑，作者识别到了并主动回避。

### 4.3 两个 Topic

Collector 发布到两个 Kafka topic（`backend/pkg/topic/kafka.go`）：

```go
UbaEventRaw  = "uba_events_raw"    // 原始行为事件
UbaEventRisk = "uba_risk_events"   // 风险事件
```

行为事件和风险事件分 topic，便于下游独立消费 / 独立扩容。文件里还定义了 `uba_events_enriched` / `uba_path_events` / sync / alert / audit / DLQ topic 和消费组名——这些属于下游消费者，不在 collector 的发布路径。

> 如 第 1 篇 所述，**Core 内消费这两个 topic 入库的 subscriber 尚未实现**。Collector 这端是通的，Core 也具备 `BatchCreate` 入库能力，连接它们的管线是生产化前要补的一环。

## 五、跨端契约的一致性

把三个端（TS SDK / C# SDK / Collector）放在一起看，会发现契约是**有意保持对称**的：

| 维度 | TS SDK | C# SDK | Collector |
|------|--------|--------|-----------|
| batchSize | 20 | 20 | — |
| flushInterval | 5000ms | 5000ms | — |
| maxRetries | 3 | 3 | — |
| timeout | 8000ms | 8000ms | 服务端 10s |
| 退避 | `base * 2^n` | `base * 2^n` | — |
| 4xx 处理 | 除 429 不重试 | 除 429 不重试 | — |
| 凭证位置 | body | body | 从 body 读 |
| 卸载兜底 | sendBeacon | 无（不需要） | — |

两个细节值得强调：

1. **客户端 timeout 8s < 服务端 10s**——避免客户端先超时放弃、服务端还在处理造成"幽灵请求"。两个 SDK 的 Config 文档都标注了这点。
2. **凭证在 body** 是三端共同契约。这是 sendBeacon 能 work 的前提（前面讲过），也让 CORS 简单（不需要预检自定义 Header）。

## 六、小结：采集层的工程美学

回到开头的问题——采集层做了多少看不见的工程？答案是：

- **可靠性**：批量、指数退避重试、状态码精确区分、并发守卫。
- **环境适配**：Web 的 sendBeacon 兜底、Unity WebGL 的传输注入、隐私模式的内存兜底。
- **安全**：哈希存储、constant-time 比较、负缓存、tenantId 权威覆盖。
- **契约对称**：TS / C# / 服务端三端默认值和策略镜像，降低跨端心智成本。
- **克制**：C# 手写 JSON 序列化器追求零依赖，SDK 重试耗宁丢不堆。

这些每一项都不复杂，但**组合起来才是一个生产级采集层**。很多人低估了埋点 SDK 的难度——它不难在算法，难在"在不可靠的客户端环境里可靠地、克制地把数据送出去"。GoWind UBA 在这件事上做得相当扎实。

---

*本文代码出自 [go-wind-uba](https://github.com/tx7do/go-wind-uba)：
Web SDK `frontend/sdk/web/uba/src/`、C# SDK `sdk/csharp/src/`、Collector `backend/app/collector/service/internal/service/`。*
