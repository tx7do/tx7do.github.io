---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - 工作流
  - 审批流
sticky: 10
---

# GoWind OA 拆解：用 3000 行 Go 写一个够用的审批工作流引擎

> 本文回答一个问题：**不引入 Camunda/Flowable，自己写一个支持条件分支、并行会签、子流程、回退环的审批引擎，核心复杂度到底在哪几处？**

[GoWind OA](https://github.com/tx7do/go-wind-oa)（协同办公：审批流转、请假报销、考勤）内置了一个自研的轻量级工作流引擎——约 3000 行核心 Go 代码（不含生成物），7 张表，28 个图模型单测 + service 层集成测试，配一篇 358 行的设计文档。它不追求 BPMN 兼容，只追求"把审批这件事的边界情况全部想清楚"。这篇按引擎的六个机制拆：图契约、编译期校验、运行期推进、会签或签、寻人与委托、业务挂钩——每一段都有真实的取舍可讲。

---

## 一、图契约：JSON 存图，"轻量级"的第一层含义

流程定义不打节点表，**整图以一个 JSON 字段落盘**（`workflow_definition` 表只有 code/version/node_config/form_schema/status 四个业务字段，`(tenant_id, code, version)` 唯一索引）：

```json
{
  "version": 2,
  "nodes": [
    {"id": "start", "type": "START"},
    {"id": "task_1", "type": "TASK", "strategy": "ALL",
     "approvers": [{"type": "USER", "id": 123}, {"type": "LEADER"}, {"type": "POSITION", "id": 456}]},
    {"id": "gw", "type": "EXCLUSIVE_GATEWAY"},
    {"id": "sub", "type": "SUBPROCESS", "subprocessDefinition": "LEAVE:1"},
    {"id": "end", "type": "END"}
  ],
  "edges": [
    {"from": "start", "to": "task_1"},
    {"from": "gw", "to": "task_1", "condition": "days > 3"},
    {"from": "gw", "to": "end", "condition": "default"}
  ]
}
```

7 种节点类型（START / END / TASK / 排他网关 / 并行分叉 / 并行汇聚 / 子流程），3 种审批人规格（指定用户 / 直属主管 LEADER / 职位 POSITION）。

一个诚实的演进注脚：README 早期自述"线性状态机"，实际代码已是有向图模型（支持条件分支、并行分叉汇聚、子流程、回退边）。`parseWorkflowGraph` 保留了旧节点数组格式的兼容层——旧格式自动转等价线性图。**格式升级时给旧数据留自动翻译，比写迁移脚本便宜**。

---

## 二、编译期校验：双向可达性，环是合法的

`validateGraph` 的结构约束是常规的（恰一个 START/END、TASK 一入一出、排他网关出边全带 condition 且恰一条 default、FORK 禁 condition、JOIN 入度 ≥2），有含量的是**双向可达性检查**：

- 从 START 正向 BFS：所有节点可达（防孤岛）；
- 从 END 逆向 BFS：所有节点**可达 END**（活性保证）。

第二条是审批引擎特有的：流程必须保证每个节点都有出口通向终态。而**环是合法的**——回退边（驳回到上一节点重审）是审批流的真实需求，单测里专门有 `TestValidateGraph_CycleAllowed`。环带来的死循环风险不在编译期拒绝，而在运行期用步数上限兜底（下一节）。

**编译期管结构，运行期管活性**——把约束放在成本最低的那一层，是这类引擎设计的基本功。

---

## 三、运行期推进：递归 walker、token 语义与 fail-closed

引擎核心是一个递归 walker（`advanceFromNode`，按节点类型分派）：

- **START / 并行分叉**：沿出边递归，FORK 对每条出边各递归一次——这就是 token 分裂；
- **TASK**：解析审批人 → 剔除申请人 → 若剩余为空写"审批人为申请人本人，自动通过"日志继续；否则事务内"清残留任务 + 实例置 PENDING + 每审批人一条任务"后停住等审批；
- **排他网关**：对出边条件用 expr-lang 求值（求值环境是实例的 form_data），命中即走、全不中走 default、**无 default 则 fail-closed 驳回**；
- **并行汇聚**：`arrived_count` 计数（查不到行建行 =1，否则 +1），满入度删计数行继续，未满 token 停此；
- **END**：`checkTermination`——还有 PENDING 任务 / 未满 join / 挂起子流程，任一存在就不终态；
- **子流程**：建子实例 + 写父子链接 + 父实例 SUSPENDED；子流程终态后恢复父流程从 SUBPROCESS 出边继续。

两个点睛设计：

**步数守卫**。回退环合法意味着 walker 理论上可以无限转，解法不是 visited 集合拒环，而是朴素计数：

```go
const walkerStepLimit = 1000

ws.steps++
if ws.steps > walkerStepLimit {
	return s.failClosedReject(ctx, tid, uid, instanceID, "walker step limit exceeded")
}
```

**fail-closed 驳回**。任何路由失败——条件全不中且无 default、定义被改坏、步数超限——统一走同一条收敛路径：取消全部待办、删 join 行、删父子链接、实例置 REJECTED、通知申请人、触发业务回调。**宁可错杀（流程失败），不让流程挂起**。审批系统里"卡住的流程"比"失败的流程"代价高一个数量级——失败有人看见，卡住没人知道。这个原则贯穿了寻人层（主管找不到直接报错"避免流程挂起"）和路由层。

每次迈步都会重读定义重新解析图——**流程定义是"审批时解析"而非实例内快照**，定义被改会影响在途实例。这是一个开放的权衡（快照式更稳但复杂度高），设计文档如实记录未下结论；ERP 侧的审批轨选了快照式（见后文对照），两个项目的不同选择本身就是素材。

---

## 四、会签与或签：不是计数器，是任务表状态推导

TASK 节点的 `strategy` 字段：`ALL` 会签（缺省）、`ANY` 或签（未知值按会签处理，fail-safe）。实现上**没有显式计数器列**，通过与否由查询任务状态推导：

```go
if node.Task.isAnyStrategy() {
	// 或签：一人通过即推进,取消其余待办任务
	s.taskRepo.CancelPendingByInstanceNode(ctx, tid, instanceID, nodeID, taskID)
	return s.advanceFromNode(...)
}
// 会签:全部任务通过才推进;仍有待办则等待其他审批人
statuses, _ := s.taskRepo.ListNodeTaskStatuses(ctx, tid, instanceID, nodeID)
for _, st := range statuses {
	if st == workflowtask.TaskStatusPending {
		return &emptypb.Empty{}, nil
	}
}
return s.advanceFromNode(...)
```

这个设计的隐性收益是**部分同意的轨迹天然可查**：每人一条任务行 + 每人一条带 comment 的审批日志行，"3 人会签、2 人已同意、等待张三"直接是两个 SELECT。计数器方案要额外维护计数与明细的一致性，状态推导方案里明细就是唯一真相。

任一驳回则不做节点级判断，**统一升级为全实例终结**——取消全部待办（注释原话："否则残留半死分支"，并行分支一并杀）、实例 REJECTED、通知、业务回调。

真正需要计数器的只有并行汇聚（JOIN 的 `arrived_count`），而它的实现是读-改-写而非原子 UPDATE——多审批人并发到达同一 JOIN 有竞态窗口。这是"轻量级换正确性风险"的自觉取舍（单实例内审批天然低频），写进了注释。对照 ERP 侧全部用 SQL 条件更新做并发（见姊妹篇），能清楚看到两个项目对"并发窗口值不值得付复杂度"的不同回答。

---

## 五、寻人与委托：审批时解析，激活后快照

寻人三种规格的解析发生在 **walker 走到 TASK 节点的那一刻**（`resolveApprovers`），解析结果落 `assignee_user_id`——此后该节点等审批期间的人员变动不影响在途任务。节点被重新激活（回退边）时清旧任务重新解析。

- **主管寻人**：只找直属部门负责人，**不沿部门树向上递归**——找不到直接报错。注释点明这是 fail-closed："在提交/推进时即失败，避免流程挂起"。想支持多级上报，加一层循环即可，但默认行为选择"宁可失败"；
- **职位寻人**：展开为多用户 ID，天然服务多人会签节点；
- **委托**：解析时点套用——命中委托规则直接把任务指给代理人，而不是先指给原人再转发。委托表约束极简：一租户内一委托人唯一、只能给自己设委托、被委托人须在职。

撤回、转办、超时升级三个周边动作的语义都收敛得干净：撤回是终态（creator 本人 + PENDING 前提，单事务清理全部待办/join/父子链接）；转办只改任务的 assignee、日志记转办人（原审批人在日志里留痕）；超时升级是 asynq 周期任务——24 小时催办（`MarkReminded` 幂等戳防每小时重发）、72 小时自动转给审批人的组织负责人（`MarkEscalated` 戳"避免沿组织树连环上转"，无上级可升降级为仅催办）。

---

## 六、业务挂钩：终态一次性副作用

引擎与业务的解耦是**进程内回调注册表**（51 行的 `workflow_hook.go`）：六个业务 service（请假/报销/出差/加班/用印/外出）在构造函数里 `eventRegistry.Register(businessType, svc.onInstanceTerminal)`，引擎只在三个终态（APPROVED/REJECTED/WITHDRAWN）同步调 `Fire`。引擎不 import 任何业务包——依赖方向是业务依赖引擎。

调用侧防护：`fireBusinessEvent` 带 `defer recover`，回调失败只记日志不影响状态机（最终一致取向）。回调侧契约才是精髓，以请假为例（`onInstanceTerminal`）：

1. **校验单据的 `instance_id` 与回调的 instanceID 一致**——防客户端伪造 business 字段触发他人单据的副作用；
2. **仅处理仍 PENDING 的单据**——幂等，防重复回调覆盖终态。

**请假额度的语义是这个契约最好的注脚**：扣减只发生在 APPROVED 终态（`AddUsedDays`，ent upsert），REJECTED/WITHDRAWN 只同步状态——所以"审批撤回要还额度吗"的答案是**不用还，额度从未被扣过**。提交时只做余额检查不做冻结。"终态一次性副作用"优于"提交即冻结"：不用处理冻结/解冻的对称性，撤回/驳回天然无需补偿。代价是提交到批准之间的并发窗口（注释明说"容忍并发窗口"）——又一次轻量级取舍。

配套的还有**流程定义自动引导**：租户首提请假时若无 LEAVE 定义，按默认模板（主管会签）自动创建并启用，并发首提撞唯一索引靠回读兜底——"默认模板开箱可跑 vs 强制显式建模"之间选了前者，模板本身用的是旧线性格式，正好被兼容层消化。

---

## 七、结语

这个引擎的全部复杂度预算花在了四个地方：**图的编译期校验**（双向可达性）、**异常路径的收敛**（failClosedReject，宁可失败不挂起）、**并发语义的自觉降级**（状态推导代替计数器、容忍 JOIN 竞态窗口）、**副作用时机**（只在终态发生一次）。它不支持的（持久化 token 表、消息队列驱动、流程版本快照）与它支持的同样重要——轻量级的本质是清楚地知道自己不做什么。

如果只带走三条：

1. **审批引擎最重要的不是路由能力，是异常路径的收敛**——所有"走不下去"都落到同一个可见的终态；
2. **会签/或签用任务表状态推导**——明细即真相，部分同意的轨迹免费获得；
3. **副作用只在终态发生一次**——提交不冻结，撤回不补偿，幂等契约只需要两个校验。

仓库（引擎在 `backend/app/core/service/internal/service/workflow_service.go` 与 `workflow_graph.go`，设计文档 `docs/oa-workflow-design.md`）：

- GitHub：[github.com/tx7do/go-wind-oa](https://github.com/tx7do/go-wind-oa)
- Gitee：[gitee.com/tx7do/go-wind-oa](https://gitee.com/tx7do/go-wind-oa)
