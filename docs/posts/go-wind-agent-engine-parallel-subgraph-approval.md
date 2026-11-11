---
date: 2026-11-11
category:
  - GoWind风行
tag:
  - Golang
  - GoWind
  - AI Agent
  - 工作流引擎
  - Go-Kratos
sticky: 10
---

# GoWind 拆解：AI Agent 编排引擎——波次并行、子图递归与人工审批

> 本文回答一个问题：**一张 Agent 编排图（选节点、连分支、配审批）从点击「运行」到跑完出轨迹，执行引擎的每一步在做什么——图怎么校验、并行怎么并发且可复现、循环怎么保证终止、子图怎么递归防爆炸、审批怎么挂起恢复、定时怎么无人值守？**

[GoWind Admin](https://github.com/tx7do/go-wind-admin) 的 AI Agent 模块有一套自研图执行引擎（`ai_agent_engine.go`）：画布上编排的每个应用都是一张图，引擎负责把它**确定性地**跑完——同样的图、同样的输入，trace 与 SSE 帧序完全可复现。人工审批（挂起-恢复）这半边在 [GoWind CMS](https://github.com/tx7do/go-wind-cms) 的同族引擎里落地，两处实现互相印证了同一组机制。这篇按「图从进来到跑出去」的顺序拆：准入校验 → 执行模型 → 终止性 → 递归 → 沙箱 → 版本化 → 挂起恢复 → 无人值守。

---

## 一、图的准入：九种节点与静态校验

引擎认识的节点是一张白名单（`agentNodeTypes`），九种类型各有专职：

| 类型 | 职责 |
|------|------|
| `start` / `end` | 入口与出口 |
| `llm` | 调大模型（prompt 模板渲染 + 工具调用） |
| `knowledge` | 检索知识库，产出 context |
| `http` | 外呼 HTTP 接口 |
| `condition` | 表达式分流（expr-lang 求值，true/false 双出边） |
| `script` | 沙箱内跑用户脚本（第五节） |
| `parallel` | 并行扇出的纯结构节点（第二节） |
| `subflow` | 引用另一张图递归执行（第四节） |

图在**保存/部署时**过静态校验，把尽可能多的问题挡在运行之前：可达性检查（从 start 必达的节点才合法）、出边校验（condition 必须恰好 true/false 两条出边；parallel 至少一条出边，重复 target 被守卫拦截）、以及最有意思的一条——**环必经 condition**（第三节）。顺带一提，这条规则的诞生还修掉了一个三端画布的真 bug：condition 节点删除 true 分支后重连，会产出两个 false 分支——引擎语义再严谨，画布侧的分支赋值错了，图还是错的。

静态校验的哲学是：**非法图根本进不了库**，运行时只处理「结构上不可能出事」的图。

---

## 二、执行模型：frontier 波次调度

并行不是加个 goroutine 那么简单。旧的执行模型是「单游标线性走图」——游标停在哪个节点就执行哪个，然后走到下一个。这个模型表达不了 fan-out：parallel 节点的全部出边要**同时**入队执行。于是执行重构为 frontier 波次模型，核心循环的注释把并发安全边界写得明明白白：

```go
// executeAgentGraphInner frontier 波次执行（可递归）：维护一个待执行节点集合
// （frontier），每轮波次把集合内全部节点并发执行（各 goroutine 只读共享 vars、写本地
// outcome，WaitGroup 栅栏后统一合并落账——vars 写入只发生在栅栏后的串行合并段，无
// Go map 并发写）。
for len(frontier) > 0 && totalSteps < agentMaxSteps {
    // 确定性顺序：按节点 id 排序（trace/SSE 帧序可复现，并行多 end 首个胜出也可预期）
    sort.Slice(frontier, func(i, j int) bool { return frontier[i].ID < frontier[j].ID })

    // 波内并发执行：各 goroutine 只读 vars、写本地 outcome。
    outcomes := make([]*agentNodeOutcome, len(frontier))
    var wg sync.WaitGroup
    for i := range frontier {
        wg.Add(1)
        go func(i int, node *agentGraphNode) {
            defer wg.Done()
            outcomes[i] = executeAgentNodeWithDepth(ctx, node, vars, deps, len(input), subflowDepthRemaining)
        }(i, frontier[i])
    }
    wg.Wait()
    // 栅栏后：串行合并落账（vars 写入 / usage 累加 / trace 追加 / SSE 帧推送）
}
```

这段代码里有四个值得单独说的设计决策：

**1. 按 id 排序不是为了好看，是为了可复现。** 并发执行的结果序列天然不确定，但 trace 和 SSE 帧序一旦不确定，「同一次运行两次回放长得不一样」就无从调试。排序把波内执行顺序钉死，并行多 end 谁先胜出也可预期。

**2. 并发区只读、写入区串行，靠栅栏分隔。** Go 的 map 不是并发安全的，最省事的方案是加锁。这里的方案是把「读 vars 执行」和「写 vars 落账」在时间轴上切成两段：goroutine 里只读共享 vars、把产出写进自己的 outcome 槽位；`wg.Wait()` 栅栏之后，单线程逐个合并。**不需要锁的并发才是好并发**。

**3. 波栅栏即汇合点。** 选后继与下一波组装全在栅栏后的合并段里：

```go
// ai_agent_engine.go 合并段内：选后继
// condition 只放行与执行结果同名的分支出边
if node.Type == "condition" && e.Branch != oc.branch { continue }
// parallel 与其余节点：全部出边入 nextSet（map 按 target.ID 去重，
// 同波多上游汇聚到同一节点时只入队一次——波栅栏即汇合点）

// 下一波组装：frontier 复用底层数组 + 按 id 排序重建
frontier = frontier[:0]
sort.Strings(nextOrder)
```

同一波次多个上游指向同一个下游节点时，下游只入队一次——join 语义不需要额外的同步原语，波次边界天然就是汇合屏障。

**4. parallel 节点本身是零逻辑的。** 它的全部实现就两行：

```go
case "parallel":
    summary = "pass-through (fan-out via outgoing edges)"
```

fan-out 发生在合并段选后继阶段（全部出边入下一波），结构语义（并行）和执行语义（扇出）分离在两个阶段，节点类型保持纯结构。

失败语义也值得记：波内任一节点失败即整跑失败（一票失败，v1 不做部分失败聚合），但失败节点也落 trace error 步骤——**宁可跑失败，不留一段看不见的执行**。步数预算 `agentMaxSteps=50` 按节点执行次数计，兜住失控图。

---

## 三、循环与终止性：Tarjan 强连通分量上锁

一个诚实的发现写在引擎的演进记录里：**早期版本并没有无环校验**——只有可达性 DFS，意味着用户可以在画布上画出死循环，引擎的防护只剩步数预算这一道软闸。

解法不是禁止环，而是给环定准入规则——**环必须经过 condition 节点**，因为只有条件分流才能保证环可终止。实现是教科书级的 Tarjan 强连通分量分解（`validateCycleConditions`）：

```go
if low[id] == index[id] {
    // 弹栈收集分量……
    if len(component) > 1 { sccs = append(sccs, component) }
}
// ……
for _, scc := range sccs {
    hasCondition := false
    for _, id := range scc {
        if byID[id].Type == "condition" { hasCondition = true; break }
    }
    if !hasCondition {
        return fmt.Errorf("cycle through nodes %v has no condition node (loops must pass through a condition to guarantee termination)", scc)
    }
}
```

size > 1 的强连通分量即含环，环内没有 condition 就直接 400 拒保存。这条规则的妙处在于它把「会不会死循环」从运行时问题变成了**保存时的静态问题**——配合第二节的步数预算，静态校验拦大多数、步数上限兜住漏网，双层防护。

---

## 四、子图：subflow 递归与深度预算

跨应用复用靠 subflow 节点：它引用另一个 Agent 应用（appId），运行时把那张图加载进来递归执行。入口还是 `executeAgentGraphInner` 自己——引擎递归调用引擎：

```go
case "subflow":
    if subflowDepthRemaining <= 0 {
        return fail(fmt.Errorf("subflow node %q exceeds max subflow depth %d (recursive reference?)", node.ID, agentMaxSubflowDepth))
    }
    // ……
    // 递归执行子图：输入 = inputMapping 渲染后的键值（键 = 子 start 变量名，值 = 父模板）
    subInput := map[string]string{}
    for _, raw := range agentDataSlice(node.Data, "inputMapping") {
        val, rerr := renderAgentTemplate(agentDataString(pair, "value"), vars)
        subInput[key] = val
    }
    subOutput, subTrace, subUsage, subErr := executeAgentGraphInner(ctx, subGraph, subInput, deps, subflowDepthRemaining-1)
```

三个防御细节：

- **深度预算 3 层，逐层递减**，且作为参数随调用链传递而不是共享变量——注释明说这是为了避免并发 subflow 之间的 deps 竞态。A 引 B、B 引 A 的自引用爆炸在第三层被斩断；
- **加载即校验**：`loadSubflowGraph` 对目标图做 enabled、同租户、图合法三重检查（子图非法直接失败，不会拖到运行时深处）；
- **用量拍平**：子图的 token 用量和 trace 并入本跑的台账——前端运行台账零改动，用户看到的还是「一次运行一条完整轨迹」。

输入映射用 `inputMapping[{name, value}]` 声明：name 是子图 start 节点的变量名，value 是父图的 `{{node.var}}` 模板，运行时渲染注入。子 end 的产出写回 subflow 节点自己的 output 命名空间，下游用 `{{subflowNode.key}}` 消费。

---

## 五、script 节点：一次性沙箱与三层契约

script 节点让图里能嵌一段用户写的 Lua/JavaScript。引擎本体不碰沙箱——它只认 `deps.runScript` 注入的执行器，单测里注个桩就能测图的调度逻辑。真实现是一次性隔离沙箱：

```go
// runScriptForAgent script 节点的真实现：一次性隔离沙箱执行（ScriptRuntime.TestRun），
// 与常驻脚本引擎/钩子互不污染；执行留 script_log 审计行（name 带节点定位）。
func (s *AiAgentService) runScriptForAgent(ctx context.Context, node *agentGraphNode, vars map[string]map[string]string) (map[string]any, error) {
    language := agentScriptLanguage(node)
    source := agentDataString(node.Data, "source")
    name := "agent:" + node.ID
    input := agentScriptNodeInput(vars)
    data, err := s.scriptRuntime.TestRun(ctx, language, name, source, input)
    // 剔除输入键回声：TestRun 返回的是执行后完整上下文（含注入的输入命名空间），
    // 节点产出只收脚本新写入的键
    for k := range input { delete(data, k) }
    return data, nil
}
```

脚本侧的契约是三件套：脚本必须定义 `execute()`；上下文经 `__get_ctx()` 取（`c.get("节点id")` 读上游），产出经 `__set_ctx(k, v)` 写回。JS 和 Lua 两套运行时注册同名全局函数，契约一致。

两个安全阀值得记录：source 静态校验（语言白名单 lua/javascript、非空、上限 32KB）；**source 是代码不是模板，绝不能过 `renderAgentTemplate`**——这条边界注释专门写了，因为模板渲染会把用户代码里的花括号当变量替换，那是个安全洞。信任口径也有明文：能编辑 Agent 应用的用户即可运行沙箱内脚本（有意扩展，文档记录在案），执行留 `script_log` 审计行，name 带 `agent:<节点id>` 方便定位到具体节点。

---

## 六、版本化：改坏了想回滚

图的编辑没有 draft/published 双态——每次保存直接生效。这个取舍让编辑体验轻，但也意味着「改坏了」没有天然退路。版本化就是为这个补的：

新表 `sys_ai_agent_revisions`，快照策略只增不改不删（表级无更新入口，随主表级联删除）：

```go
// 每次成功更新把**更新前**的 graph 留一行快照（SAVE），恢复 = 把快照写回主表
// （恢复动作本身先快照当前版本，可逆）。
field.Enum("source").
    Comment("快照来源（SAVE=常规更新触发 RESTORE=恢复前留底）").
    NamedValues("SAVE", "SAVE", "RESTORE", "RESTORE").
    Default("SAVE")
```

关键在恢复的对称设计（`RestoreRevision`）：

```go
// 恢复前留底当前 graph（失败不阻断恢复，Errorf 留痕）
if s.revisionRepo != nil {
    snapshot := &aiV1.AiAgentRevision{
        Graph:  current.Graph,
        Source: trans.Ptr("RESTORE"),
    }
    // ……
}
// 写回走普通更新（mask 只点 graph；恢复是明确的人为决定，以快照为准整份覆盖 graph）
```

恢复前先以 RESTORE 来源把当前版本留底——**恢复操作本身可逆**，误恢复一次再从 RESTORE 快照拉回来就行。快照写回前还要过静态校验，非法图 400 且不落任何痕迹（不产生垃圾快照）。留底失败不阻断恢复，只 Errorf 留痕——恢复的主流程不因为审计旁路的抖动而失败。

---

## 七、人工闸门：approval 节点与挂起-恢复

自动化编排的默认假设是机器一路跑到底，但生成的文案要人过目、处置动作要人点头。approval 节点把「等人」做成了图的一等公民。

**难点在于：一次 HTTP 请求的生命周期里等人是等不到的。**解法是把图执行切成两半，中间用数据库状态连接。执行到 approval 节点时，引擎不是阻塞等待，而是以一个哨兵 error 把整个挂起状态上抛：

```go
// agentApprovalSignal approval 节点的挂起信号：执行到此节点即暂停，
// vars 快照随信号带出，人工审批后凭快照从下游恢复。
type agentApprovalSignal struct {
    NodeID   string
    varsJSON []byte   // 执行到挂起时刻的完整变量命名空间快照
    trace    []agentTraceStep
    usage    agentUsage
}
func (e *agentApprovalSignal) Error() string { return "approval required at node " + e.NodeID }
```

节点执行侧，把当前全部变量快照成 JSON，包装在信号里上抛（SSE 通道同时推 `approval_required` 帧，前端画布立刻感知）：

```go
case "approval":
    // 人工审批闸门：序列化当前 vars 快照，以挂起信号上抛。
    // 审批结论经 Resume 注入 vars[nodeID].approved/note，下游可用
    // {{nodeID.approved}} 参与条件判断。
    varsJSON, serr := json.Marshal(map[string]any{"vars": vars})
    sig := &agentApprovalSignal{NodeID: node.ID, varsJSON: varsJSON, trace: trace, usage: usage}
    if deps.onStep != nil { deps.onStep("approval_required", node.ID, "", "") }
    return "", trace, usage, sig
```

Run 侧用 `errors.As` 捕获这个哨兵，落库为新状态 `WAITING_APPROVAL`，连同挂起节点 ID 和恢复快照一起写行。**用 error 接口传递控制流**是个大胆的选择——但它让「挂起」天然穿透所有层级的调用栈（包括子图嵌套场景），不需要每层显式传递特殊返回值。

人批完之后，`ApproveRun` 从库里读回快照，把审批结论注入挂起节点的命名空间：

```go
// 审批结论注入挂起节点命名空间（{{nodeID.approved}}/{{nodeID.note}}）
nodeVars := snap.Vars[pendingNode]
if nodeVars == nil { nodeVars = map[string]string{} }
nodeVars["approved"] = "true"
nodeVars["note"] = req.GetNote()
snap.Vars[pendingNode] = nodeVars
```

然后 `ResumeAgentGraphFrom` 校验挂起节点确实是 approval 类型、取唯一出边，从下游节点继续执行——trace、token 用量、时长全部累加，台账上看是一次连续的运行。批准注入的 `approved`/`note` 是普通字符串变量，下游 condition 节点可以直接用 `{{approval_1.approved}}` 参与表达式判断：**审批结论不是引擎的私有状态，是图变量**。

驳回则简单得多：置 FAILED，审批意见拼进 error 字段，trace 保留。

两个加分设计：

- **多级串联**：恢复路径再遇 approval 节点，再次挂起——「初审→修改→复审」的多级人工链天然支持，E2E 里专门有双审批串联的 18 断言用例；
- **同步恢复**：ApproveRun 里的续跑是同步的（审批动作完成时下游短图已跑完），对短下游链的交互体验最友好。

给这套机制配的 E2E 还贡献了一条通用教训：mock LLM 必须实现 SSE 流式接口——工具循环走的是 `CreateChatCompletionStream`，mock 只实现非流式 JSON 的话，答案是静默的空、用量是静默的零，测试全绿但什么都没验证。

---

## 八、无人值守：定时触发任务桥

Agent 跑得再好，触发还得人点按钮——定时触发任务桥把图接进了任务系统：「任务管理」里建一行 `agent_run` 类型的 PERIODIC 任务（payload 带 appId/input/notifyUserId），cron 到点调度器直投 handler。

![GoWind Admin 任务管理页（agent_run 定时任务在此创建）](https://tx7do.github.io/assets/images/go_wind_admin/admin_task_list.png)

handler 的身份设计是关键（`ai_agent_task.go`）：

```go
// 执行身份：UserId=0（机器身份，运行台账 created_by=0、SSE 流 ID="0"），租户取
// 应用归属租户——LLM/RAG 用量记该租户流水、AI_TOKENS 配额按该租户闸。
operator := &authenticationV1.UserTokenPayload{
    UserId:   0,
    TenantId: trans.Ptr(tenantID),
    Username: trans.Ptr(fmt.Sprintf("agent:scheduled:%d", data.AppId)),
    Roles:    []string{"machine"},
}
```

机器身份 UserId=0，但租户不是 0——取应用归属租户，用量记该租户流水、配额按该租户闸。**定时任务不落在「系统」头上，落在租户头上**，计费和配额的账才能对上。

错误语义也分了层：图执行失败已落 FAILED 台账（确定性业务结论，不重试——重试只会烧 token）；管理员停用应用则跳过不落台账（更不能重试，注释原话「不应引发 asynq 重试风暴」）；只有基础设施错误（DB 之外的意外失败）才交 asynq 重试。这套分级让定时 Agent 任务的失败行为可预测。

顺带这一批还修了个自证式 bug：早前一个提交声称注册了 `ai_query_run` 任务类型，实际漏改了 `asynq_server.go`——类型未注册，任务到了就是 400。**「声明已注册」和「真的注册了」之间隔着一行 wiring 代码**，测试里专门补了三态断言（执行成功+通知 / 不通知 / 停用跳过）。

---

## 九、三端画布：九个节点的落地形态

引擎能力要落进三端画布（react / vue-element / vue-vben）。结构上三端是同一种形态：**单文件画布 + 单文件节点组件**，节点类型不拆独立组件文件，而是表驱动——vben 端的 `NODE_META` 一张表定下九种节点的配色与图标：

```
start #52c41a / knowledge #722ed1 / llm #1677ff / http #4a8dff / script #9254de
parallel #13c2c2 / subflow #fa541c / condition #fa8c16 / end #8c8c8c
```

配置表单按类型 v-if 分块，工具条按 palette 出节点，版本历史与运行台账各一个抽屉。画布没有引入图编辑第三方库之外的框架级抽象——九个节点的规模下，一张 META 表比一套节点组件体系便宜。

---

## 十、收尾

把引擎的机制清单合起来，每一项都有明确的失败模式：

| 机制 | 关键决策 | 失败模式 |
|------|---------|---------|
| 静态校验 | 白名单 + 可达性 + Tarjan 环必经 condition | 非法图保存即 400 |
| 波次调度 | 排序可复现 / 只读并发 + 栅栏串行写 | 一票失败但 trace 完整 |
| 子图递归 | 深度预算 3 逐层递减 | 自引用爆炸被斩断 |
| 沙箱脚本 | 一次性 VM + 32KB 白名单 | 未装配报错不静默跳过 |
| 版本化 | SAVE/RESTORE 双留底 | 恢复本身可逆 |
| 挂起恢复 | 哨兵 error + 快照落库 + 注入续跑 | 二次挂起支持多级串联 |
| 定时桥 | 机器身份按租户记账 | 图失败不重试、停用不风暴 |

如果只带走一句：**编排引擎的价值不在「能跑」，在「跑得可复现、错得可观测、停得下来」**——排序换帧序稳定，栅栏换并发安全，静态校验换运行时安宁，快照换后悔药，哨兵换人在环。每一条都是拿一个明确的机制，换掉一类不确定。

仓库（两仓的引擎代码均可逐行核对）：

- go-wind-admin：[GitHub](https://github.com/tx7do/go-wind-admin) / [Gitee](https://gitee.com/tx7do/go-wind-admin)
- go-wind-cms：[GitHub](https://github.com/tx7do/go-wind-cms) / [Gitee](https://gitee.com/tx7do/go-wind-cms)
