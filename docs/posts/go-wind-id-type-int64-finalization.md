---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - Protobuf
  - ent
  - 数据库
sticky: 10
---

# GoWind 拆解：一个 ID 的三连跳——从 uint32 到 int64 的全链定版复盘

> 本文回答一个问题：**一个实体主键的类型选择，为什么要惊动 proto、ent、SQL、TypeScript、Dart、JWT 五层？三天里连跳三次（uint32 → uint64 → int64）之后，这套系统沉淀下了怎样的 ID 口径？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 和 [GoWind CMS](https://github.com/tx7do/go-wind-cms) 在 2026 年 11 月 9 日到 10 日这两天里，把全系统的 ID 类型做了一次「三连跳」：先从 uint32 升到 uint64，紧接着把所有前端 ID 字符串化，最后一天之内推翻 uint64 方案、收敛回有符号 int64。CMS 作为下游仓库，在同一天把三跳全部跟完。

这看起来像一次反复横跳，实际上是一次完整的选型收敛过程——每一跳都解决一个真实问题，最后一跳沉淀出的「wire 层洞察」值得所有做全栈 ID 迁移的团队参考。这篇按时间顺序复盘。

---

## 一、先说清楚：ID 类型为什么是全链问题

在很多系统里，ID 类型是「数据库里改个列类型」的事。但在这套 Go + Kratos + ent + 多端前端的架构里，ID 类型被五层绑定：

| 层 | 被什么绑定 | 改动的传导路径 |
|----|-----------|--------------|
| proto | `optional int64 id` / `repeated int64 xxx_ids` | 重新生成 Go/TS/Dart 三端代码 |
| ent schema | `mixin.AutoIncrementId64{}`、`TenantID[int64]{}`、`field.Int64("parent_id")` | 重新生成 ent 代码 + 数据库列 |
| SQL | 列类型 `BIGINT` | PG 下 bigint 通用；MySQL 要提前定 `bigint unsigned` |
| Go 手写层 | 所有接收/传递 ID 的函数签名 | 全仓扫描替换 |
| TS/Dart 前端 | 生成类型 + 手写类型 + 树控件 value 语义 + 路由参数 | 重生成 + 手写迁移 |

proto 里长这样（`backend/api/protos/content/service/v1/post.proto`）：

```proto
optional int64 id = 1 [
  json_name = "id",
  (gnostic.openapi.v3.property) = {description: "帖子ID"}
];

repeated int64 category_ids = 50 [ ... ]; // 关联的分类ID列表（多选）
```

ent 侧的主键与租户外键由 go-crud 的 mixin 贡献（`backend/app/admin/service/internal/data/ent/schema/role.go`）：

```go
func (Role) Mixin() []ent.Mixin {
    return []ent.Mixin{
        mixin.AutoIncrementId64{},
        mixin.TimeAt{},
        mixin.OperatorID64{},
        mixin.TenantID[int64]{},
    }
}
```

注意 `TenantID[int64]{}` 是泛型——它曾经是 `TenantID[uint32]`，后来是 `[uint64]`，现在是 `[int64]`。这个泛型参数的历史就是本文要讲的三次跳跃。

**任何一层的类型不一致都不是编译错误就是运行时惨案**，所以这不是「改一个字段」，是把一条链从头到尾拉直。

---

## 二、第一跳：uint32 → uint64

11 月 9 日，admin 先动了手（`b5b336d9`）：ID 全链升级 uint32→uint64，proto 字段、ent schema、手写代码与上游 pin 同步切换。CMS 当天跟进（`edfd071d`）。

动机不难猜：uint32 的 ID 空间上限是 42.9 亿，对单表自增够用，但对一套准备长期演进的多租户 SaaS 底座来说，「觉得够用」和「定死上限」是两种心态。uint64 把空间抬到 1.8×10¹⁹，一劳永逸。

代价也立刻显形。**64 位无符号整数在每一层都有摩擦**：

- Go 侧手写代码里到处是 `uint64` 与有符号生态（`int64` 的库函数、第三方接口）的转换点；
- ent 的泛型 mixin 参数从 `[uint32]` 换成 `[uint64]`，所有 schema 重新生成；
- 非.ID 的语义相近字段（计数、游标）被顺手卷进迁移，口径开始模糊。

第一跳解决「空间焦虑」，但把「生态摩擦」全量引入了。

---

## 三、第二跳：ID 字符串化——为前端断掉后路

同一个 11 月 9 日，第二跳紧跟着落地（admin `93e2a77d`，CMS `1477b5c1`）：三端/四端 ID 字符串化。

这一跳的原因是前端的老问题：**JavaScript 的 `number` 是 IEEE 754 双精度浮点，安全整数上限是 2⁵³−1**。uint64 的 ID 一旦超过这个值，JS 端直接精度丢失——而且这类 bug 特别阴险：本地开发环境 ID 还小，一切正常；上量之后某个用户详情页突然加载不出数据。

解法是顺着 protojson 的行为走：**64 位整数（无论有无符号）在 proto3 JSON 下统一序列化为字符串**。生成的 TS 类型如实反映（`src/api/generated/admin/service/v1/index.ts`）：

```ts
export type access_keyservicev1_AccessKey = {
    id?: string;      // int64 → string
    tenantId?: string;
    createdBy?: string;  // 审计字段同为 64 位 → string
};
```

于是前端的全链口径变成「ID 就是字符串」：

权限树的 value 语义从数值改成字符串（`tree-utils.ts`）：

```ts
interface TreeNode {
    value: string; // id 为 64 位整数，proto3 JSON 下是字符串
}
const node: TreeNode = {
    value: String(item.id),
};
```

路由参数的 `Number()` 转换整体退役（`user/detail/index.tsx`）：

```diff
-  const userId = useMemo(() => {
-    const num = Number(id);
-    return isNaN(num) ? undefined : num;
-  }, [id]);
+  // 路由参数本就是字符串，ID 为 64 位字符串直接透传，无需数值转换
+  const userId = id || undefined;
```

admin 三端（react / vue-element / vue-vben）合计 70+ 文件迁移；CMS 四端（admin react + vue + taro + flutter）同批跟进。这一跳之后，**前端的 ID 全部是 string，永远不再碰数值语义**。

---

## 四、第三跳：收敛回 int64——一天后的反转

11 月 10 日，戏剧性的一幕来了：admin `fc48f5b7` 直接推翻 uint64 方案，「ID 类型定版 int64——全链从 uint64 收敛回有符号 int64」。CMS 当天跟随定版（`30f4cfdb`）。

刚升完 uint64 又收回 int64，图什么？提交说明里给出了决定性的那条洞察：

> **wire 兼容：proto3 JSON 下 int64 与 uint64 同为字符串，Kratos protojson 行为不变；make ts/make openapi 重生成零 diff，前端零改动。**

这句话值得展开。第二跳已经把「前端只见字符串」做成了事实——既然 int64 和 uint64 在 wire 层的表现完全一致，那么**「无符号」这个类型属性在前端根本不存在**。前端零改动的硬证据也查得到：`fc48f5b7` 的 400+ 个改动文件里，前端目录一个都没有；CMS 的 `30f4cfdb` 里三端 TS 零 diff，唯一的 Dart 改动是 protobuf 序列化的方法名（`writeUint64` → `writeInt64`，varint 编码层面是同一个东西）。

wire 层既然打平，选型就回到了后端生态内部比拼。而这一局 int64 几乎全胜：

| 生态位 | uint64 的处境 | int64 的处境 |
|--------|-------------|-------------|
| Go 惯例 | 到处要显式转换 | 语言默认整型 |
| ent/go-crud | `AutoIncrementId64` 需区分宽度语义 | 同款 mixin，生态主路径 |
| PostgreSQL | bigint 本就有符号 | 原生对齐 |
| Dart | `int` 是 64 位**有符号**，uint64 会溢出 | 原生对齐 |
| JWT 声明解析 | `ParseUint` 系 API | `ParseInt` 系 API，与全部库函数一致 |
| 第三方接口 | 签名不匹配时层层转换 | 大概率直接兼容 |

还有一个不太光彩的隐性代价在 CMS 的定版提交里露了馅——非 ID 字段在 uint64 时代被卷进了迁移，定版时又得一一归位：

> 手写层：uint64→int64 全扫 + **非 ID 收敛回 uint64**（redis scan 游标/TOTP 计数器/baidu 翻译盐值/quota 边界转换/monitor 内存字节包装）

也就是说，第一跳的 uint64 方案在执行时边界没有守住：TOTP 计数器、redis 游标这些本来就是无符号语义的字段被顺手改成了别的，现在又要改回来。**每次全链类型迁移，最贵的不是目标类型，是迁移波及面的失守**。

把三条线索合起来，这次反转的逻辑就非常清晰了：wire 层的洞察（前端无感）+ 后端生态的全线占优（int64 是默认）+ uint64 迁移暴露的边界失守，共同构成了「推翻重做」的成本收益账——再迁一次的代价（一次全链重生成，前端零改动）远小于长期背着 uint64 特例生活的代价。

---

## 五、定版口径：ID 是 int64，但不是所有数字都是 ID

定版不等于「全仓 int64 化」。两个仓库都明确画了语义分界：

| 语义 | 类型 | 例子 |
|------|------|------|
| 实体 ID（主键/外键/批量 ids） | `int64` | `id`、`category_ids`、`parent_id`、`created_by`、`tenant_id` |
| 容量/配额/字节量/代币量 | `uint64` | `quota_value`、`quota_limit`、`size`、`ai_tokens_month` |
| 端口/延迟/次数等小数值 | `uint32` | 服务端口、超时毫秒、重试次数 |

容量类字段保持 uint64 的理由和 ID 恰好相反：它们的「无符号」是语义的一部分（配额不可能是负数），而且它们**不进前端 ID 语义**——字符串化口径只覆盖 ID。Dart 生成物里两者并存可以作证：

```dart
// field 50: parentId —— ID，int64
w.writeInt64(50, f50);
// field 5: size —— 字节量，保持 uint64
w.writeUint64(5, f5);
```

admin 的 `docs/crud_module_guide/backend.md` 里把口径写成了仓级规范：

> **ID width convention (repo-wide):** every entity ID is 64-bit — proto `optional int64 id` / `repeated int64 xxx_ids`; ent `mixin.AutoIncrementId64{}` / `OperatorID64{}` / `TenantID[int64]{}`; SQL columns `BIGINT UNSIGNED`. Ent maps both widths to Postgres `bigint`, so PG needs no migration; MySQL columns must be created `bigint unsigned` up front. The TypeScript generator maps 64-bit ints to `string`, and protojson serializes them as JSON strings — IDs are strings end to end (JS numbers lose precision beyond 2^53).

顺带回答一个疑问：**Postgres 为什么免迁移？** 因为 ent 把 int64 和 uint64 都映射到 PG 的 `bigint`——PG 的 bigint 本身是有符号的，uint64 只是 ent 层的语义约束，物理列根本没变过。MySQL 则必须在建列时就定 `bigint unsigned`，这是文档里明确点名的坑。

---

## 六、迁移的边角料：那些只有全链切换才会暴露的缝

全链切换的价值，一半在目标状态，一半在暴露缝隙。这批迁移捞出来的边角料值得一记：

**JWT 数据域声明的负数语义**。原来用 `ParseUint` 解析 dsu 声明，天然跳过负数；换成 `ParseInt` 后负数能解析成功了，得手动补回过滤语义（`backend/pkg/jwt/user_token_payload.go`）：

```go
if v, perr := strconv.ParseInt(part, 10, 64); perr == nil && v >= 0 {
    payload.DataScopeUnitIds = append(payload.DataScopeUnitIds, v)
}
```

**文案比代码长寿**。同文件里已经改成 `claims.GetInt64(...)`，两行之后的错误文案还写着 `"GetUint64 ClaimFieldOrgUnitID failed"`——类型迁移里最无害也最常见的遗迹。

**前端的运行记忆也要跟着改**。CMS 的 `AGENTS.md` 里给所有 AI 协作者和新人留了一条口径：「go-crud List 的 `total` 是字符串（int64 JSON），展示/比较前须 `Number()`」——`total` 也是 64 位整数，它和 ID 一起变成了字符串，分页逻辑里不做转换就是字符串比较。

---

## 七、复盘：这次反复横跳到底学到了什么

回头看这三跳，真正值得带走的是三条：

1. **wire 层一致性是类型选型的第一性问题**。int64 和 uint64 在 protojson 下序列化行为完全一致，这意味着「无符号与否」根本传不到前端——既然如此，类型决策就该退回到后端生态内部解决，选摩擦最小的那个。第二跳的字符串化恰好是这次反转的垫脚石：先把前端的数值语义断干净，后端的类型才有了自由。

2. **前端只认字符串是终点形态**。2⁵³ 精度问题决定了 JS 里 64 位整数永远是字符串；与其在边界上反复转换，不如全链承认「ID 就是 string」——树控件的 value、路由参数、表单初始值全部统一，`Number()` 转换逻辑整体退役。

3. **全链迁移的边界要靠语义表守住，不靠顺手**。uint64 那一跳卷走了 TOTP 计数器和 redis 游标，int64 定版时又得还回去。定版文档里的那张「ID/容量/小数值」三栏语义表，才是防止下一次迁移失守的工具。

最后交代一下时间账：admin 的 uint32→uint64 与字符串化在 11 月 9 日一天内完成，int64 定版在 11 月 10 日；CMS 三跳全部压缩在 11 月 10 日一天跟完（下游跟着上游的最终结论走，中间态只做了必要同步）。两天、两个仓、五层传导、前端零破坏——这笔账的成立，靠的正是第二跳先建立的字符串化铁律。

仓库（两仓的定版提交均可逐行核对）：

- go-wind-admin：[GitHub](https://github.com/tx7do/go-wind-admin) / [Gitee](https://gitee.com/tx7do/go-wind-admin)
- go-wind-cms：[GitHub](https://github.com/tx7do/go-wind-cms) / [Gitee](https://gitee.com/tx7do/go-wind-cms)
