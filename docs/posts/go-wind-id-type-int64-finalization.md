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

# GoWind 拆解：全链 ID 类型体系——int64 定版与前端字符串化契约

> 本文回答一个问题：**一个实体主键的类型怎么在五层（proto / ent / SQL / Go / 前端）之间保持一致，「ID 是 64 位有符号整数」这条口径如何穿透到 TypeScript 与 Dart，而「容量、计数」这类同样是无符号语义的字段又怎么和 ID 划清界限？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 与 [GoWind CMS](https://github.com/tx7do/go-wind-cms) 采用同一套全链 ID 口径：**ID 一律 64 位有符号整数（int64），在 proto3 JSON 下序列化为字符串，前端全链以 string 承载**。这套口径同时定死了三件事：哪些字段是 ID、ID 在线上的形态、前端见到的类型。这篇把这三件事拆开，逐层给出真实定义与边界处的语义陷阱。

---

## 一、先划语义边界：ID / 容量 / 小数值

全链类型统一的前提，是先把「什么算 ID」划清楚。两个仓库都明确画了这条语义分界：

| 语义 | 类型 | 例子 |
|------|------|------|
| 实体 ID（主键/外键/批量 ids） | `int64` | `id`、`category_ids`、`parent_id`、`created_by`、`tenant_id` |
| 容量/配额/字节量/代币量 | `uint64` | `quota_value`、`quota_limit`、`size`、`ai_tokens_month` |
| 端口/延迟/次数等小数值 | `uint32` | 服务端口、超时毫秒、重试次数 |

容量类字段保持 uint64 的理由和 ID 相反：它们的「无符号」是语义的一部分（配额不可能是负数），而且它们**不进前端 ID 语义**——字符串化口径只覆盖 ID。Dart 生成物里两者并存可以作证：

```dart
// field 50: parentId —— ID，int64
w.writeInt64(50, f50);
// field 5: size —— 字节量，保持 uint64
w.writeUint64(5, f5);
```

这条边界是整套口径的护栏：**没有它，「全链统一 int64」就会把 redis 游标、TOTP 计数器、翻译盐值这些无符号语义的字段一起卷进去**，此后每个调用点都得处理有符号溢出语义。admin 的 `docs/crud_module_guide/backend.md` 把口径写成了仓级规范：

> **ID width convention (repo-wide):** every entity ID is 64-bit — proto `optional int64 id` / `repeated int64 xxx_ids`; ent `mixin.AutoIncrementId64{}` / `OperatorID64{}` / `ParentID64{}` / `TenantID[int64]{}`; SQL columns `BIGINT UNSIGNED`. Ent maps both widths to Postgres `bigint`, so PG needs no migration; MySQL columns must be created `bigint unsigned` up front. The TypeScript generator maps 64-bit ints to `string`, and protojson serializes them as JSON strings — IDs are strings end to end (JS numbers lose precision beyond 2^53).

规范里有一句容易被略过但信息量最大：**ent 把两种宽度都映射到 Postgres 的 `bigint`**。这意味着 PG 的物理列从来没变过——uint64 只是 ent 层的语义约束，PG 的 bigint 本身是有符号的。所以「改 ID 宽度」在 PG 上免费，在 MySQL 上则必须在建列时就定死 `bigint unsigned`。

---

## 二、第一层：proto 的 ID 形态

proto 是全链的事实源，ID 字段的形态在这里定死：

```proto
optional int64 id = 1 [
  json_name = "id",
  (gnostic.openapi.v3.property) = {description: "角色ID"}
];  // 角色ID
```

批量与外键同款（CMS 的帖子）：

```proto
optional int64 id = 1 [
  json_name = "id",
  (gnostic.openapi.v3.property) = {description: "帖子ID"}
];  // 帖子ID
...
repeated int64 category_ids = 50 [ json_name = "categoryIds", ... ]; // 关联的分类ID列表（多选）
repeated int64 tag_ids = 51 [ ... ]; // 关联的标签ID列表（多选）
```

三条规则由此推出，覆盖全仓所有 proto：

1. 主键：`optional int64 id`（optional 区分「未提供」与「0」）；
2. 批量：`repeated int64 xxx_ids`；
3. 外键：`optional int64 xxx_id`，自引用（如 `parent_id`）同样 64 位，0 表达「无父级」。

proto 定死之后，Go/TS/Dart 三端代码全部由 `buf generate` 派生——**ID 的类型不需要人在三端各写一遍**，这是全链一致的第一层保障。

---

## 三、第二层：ent schema 与 Mixin

ent 侧的主键、操作人、租户、树形父级全部由 go-crud 的 mixin 贡献，schema 自己只声明业务字段：

```go
import "github.com/tx7do/go-crud/entgo/mixin"

func (Role) Mixin() []ent.Mixin {
    return []ent.Mixin{
        mixin.AutoIncrementId64{},   // 自增主键
        mixin.TimeAt{},              // created_at / updated_at
        mixin.OperatorID64{},        // created_by / updated_by
        mixin.TenantID[int64]{},     // 租户隔离
    }
}
```

自建外键则由 schema 显式声明（`role.go` 的父角色）：

```go
// 父角色ID，0表示无父级（根角色）。不做自引用 edge（无需 FK 约束），
field.Int64("parent_id").
    Comment("父角色ID，0表示无父级").
    Optional().
    Nillable(),
```

`TenantID[int64]{}` 是泛型 mixin——它此前支持过 `uint32`/`uint64` 参数，现在全仓统一钉死 `int64`。泛型参数的存在本身就是这条口径的可见化：**租户 ID 的宽度变了，所有 schema 都要重新生成**，所以它必须和 ID 口径一起定版。

树形结构还有 `mixin.Tree64[<Entity>]{}` 的封装，同样以 64 位父级为基。这里有个历史教训记在 `docs/tenant_isolation.md`：旧版泛型列写死 `field.Uint32`、用 `[uint64]` 参数时会出现「列类型与租户策略不一致」，最终收敛到 `int64` 才彻底消解——**泛型 + ORM 的组合里，参数宽度与列类型必须成对校验**。

---

## 四、第三层：wire 契约——protojson 把 64 位整数序列化成字符串

这一层是整个体系的枢纽，也是「前端零改动」的根据所在：**proto3 JSON 下，int64 与 uint64 统一序列化为 JSON 字符串**。这不是 Kratos 的行为，是 protojson 的规范；Kratos 只是照做。

于是生成的 TS 类型如实反映（`src/api/generated/admin/service/v1/index.ts`）：

```ts
export type access_keyservicev1_ListAccessKeyResponse = {
  items: access_keyservicev1_AccessKey[] | undefined;
  total: string | undefined;          // int64 total 也映射为 string
};
export type access_keyservicev1_AccessKey = {
  ...
  createdBy?: string;   // int64 审计字段 → string
  id?: string;          // 行 494
  tenantId?: string;
};
```

`id?: string` 在该文件里出现 90+ 处，全部是 `make ts` 重生成的产物。生成器的规则很直接：**64 位整数 → `string`**。这条规则同时解释了为什么 `total` 也是字符串——分页总数同属 64 位。

这套 wire 契约的工程价值在于：**类型宽度的选择（int64 vs uint64）传不到前端**。两者在 JSON 里都是字符串，前端不需要为类型宽度写任何适配。选型的自由度因此全部收回后端，前端只认一条铁律：ID 是 string。

Go 侧生成物印证同一事实——DDL 层的类型标注是 varint，字符串化由 protojson 运行时完成：

```go
Id int64 `protobuf:"varint,1,opt,name=id,proto3,oneof"`
```

---

## 五、第四层：前端全链字符串化

既然 wire 上是字符串，前端就必须**全链承认这个事实**，而不是在边界上转来转去。手写类型文件把口径写成契约（`src/types/global.d.ts`）：

```ts
/**
 * 用户id（后端 int64，proto3 JSON 下为字符串）
 */
id: string;
```

由此产生的三处连带迁移，每一处都是「数值语义残留」被清理：

**树控件的 value 语义**（`tree-utils.ts`）：

```ts
interface TreeNode {
    value: string; // id 为 64 位整数，proto3 JSON 下是字符串
}
const node: TreeNode = {
    value: String(item.id),
};
```

树控件此前用 `number` 作 value，与后端对不上；改成 string 后，勾选树、权限树的回填与回传全程无转换。

**路由参数不再过 `Number()`**（`user/detail/index.tsx`）：

```diff
-  const userId = useMemo(() => {
-    const num = Number(id);
-    return isNaN(num) ? undefined : num;
-  }, [id]);
+  // 路由参数本就是字符串，ID 为 64 位字符串直接透传，无需数值转换
+  const userId = id || undefined;
```

路由参数天生是字符串，此前为了「对齐后端类型」反而多转了一次——现在两边都是 string，转换代码整体退役。**`Number()` 这类转换点是 2⁵³ 精度丢失的唯一入口，删掉它们本身就是修复。**

**分页总数要显式转数值**（CMS 的 `AGENTS.md` 口径）：

> go-crud List 的 `total` 是字符串（int64 JSON），展示/比较前须 `Number()`

`total` 是 64 位整数所以也是字符串，但它要参与分页计算与数字展示——这里必须显式转换，因为它的值域（行数）在 2⁵³ 以内，转换是安全的。这条口径与 ID 的「永不转数值」形成对照：**同样是字符串，ID 不转、计数要转，区别在值域是否可能越界**。

三端（react / vue-element / vue-vben）与 CMS 四端（admin react / vue / taro / flutter）同批迁移，Dart 侧唯一的改动是 protobuf 序列化方法名：

```diff
-      w.writeUint64(1, f1);
+      w.writeInt64(1, f1);
```

wire 层 varint 编码对有无符号是同一种写入方式，这行改动只是类型标注的跟随。

---

## 六、第五层：JWT 与运行时解析——有符号语义的边角

类型改了，运行时的字符串解析路径也要逐个对齐。最典型的一处是 JWT 的数据域声明（`dsu`，逗号分隔的 ID 列表），`backend/pkg/jwt/user_token_payload.go`：

```go
if unitIdsStr != "" {
    for _, part := range strings.Split(unitIdsStr, ",") {
        if v, perr := strconv.ParseInt(part, 10, 64); perr == nil && v >= 0 {
            payload.DataScopeUnitIds = append(payload.DataScopeUnitIds, v)
        }
    }
}
```

关键在那句 `v >= 0`：无符号类型的解析器（`ParseUint`）天然拒绝负数，换成有符号的 `ParseInt` 后负数能解析成功，**必须显式补回过滤语义**。这类「类型换了但解析器的隐含约束丢了」是迁移里最常见的静默缺陷——负 ID 混进数据域声明不会报错，只会在数据权限计算里产生查不到的行。

同一文件里还留着一处无害遗迹：代码已改成 `claims.GetInt64(ClaimFieldOrgUnitID)`，两行之后的错误文案仍写着 `"GetUint64 ClaimFieldOrgUnitID failed"`——**文案比代码长寿**，迁移时值得顺便扫一遍。

broker 头的传递同理，`FormatInt`/`ParseInt` 成对替换；这类字符串 ↔ 整数的边界点，是 ID 口径在运行时的全部落点。

---

## 七、口径的自我维持：文档、模板与门禁

全链类型口径最容易在「新增一个实体」时失守——所以它被写进了三处会被人和工具读到的位置：

1. **CRUD 指南**（第一节引用的仓级规范），新人建新模块照抄；
2. **两端 AGENTS.md 模板**：给所有 AI 协作者的口径行（含 `total` 是字符串这条前端运行记忆）；
3. **生成器与门禁**：`make ts` / `make openapi` / `gows ent` 全链重生成后跑 `go build/vet/test` 与三端 typecheck——类型不一致在编译期暴露，而不是上线后。

一个可验证的副产品：int64 与 uint64 在 wire 层表现一致，因此**从 uint64 收敛到 int64 的迁移里，前端产物零 diff**——`fc48f5b7` 的 400+ 改动文件里没有任何前端文件，CMS 侧三端 TS 同样零 diff。这就是「wire 契约先定、前端只认 string」带来的迁移成本结构：后端全量重生成，前端一行不动。

---

## 八、收尾

五层传导的每一层，各自钉住一件事：

| 层 | 落点 | 钉住什么 |
|----|------|---------|
| 语义分界 | ID / 容量 / 小数值三栏表 | 「哪些字段是 int64」先于「怎么改」 |
| proto | `optional int64 id` / `repeated int64 ids` | 全链唯一事实源，三端代码派生 |
| ent | `AutoIncrementId64` / `OperatorID64` / `TenantID[int64]` | 主外键与租户列宽度统一 |
| SQL | PG `bigint` 免迁移 / MySQL 建列即 `bigint unsigned` | 物理列与逻辑宽度的差异点 |
| wire | protojson 64 位 → 字符串 | 类型宽度传不到前端 |
| 前端 | ID 一律 string，`Number()` 转换点清零 | 2⁵³ 精度问题的唯一解 |
| 运行时 | `ParseInt` 显式补负数过滤 | 解析器的隐含约束不能丢 |

如果只带走一句：**全链类型的正确性不靠「每层都写对」，靠「让每层都没得选」**——proto 定死形态、生成器派生三端、protojson 抹平宽度差异、前端只认 string、语义分界表挡住顺手扩大化。人只在最初划一次语义边界，剩下的由生成链和门禁保证。

仓库（两仓的定版提交与规范文档均可逐行核对）：

- go-wind-admin：[GitHub](https://github.com/tx7do/go-wind-admin) / [Gitee](https://gitee.com/tx7do/go-wind-admin)
- go-wind-cms：[GitHub](https://github.com/tx7do/go-wind-cms) / [Gitee](https://gitee.com/tx7do/go-wind-cms)
