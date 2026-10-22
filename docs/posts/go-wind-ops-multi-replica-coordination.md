---
date: 2026-10-22
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
  - 分布式
  - 运维平台
sticky: 10
---

# GoWind Ops 拆解：不引入分布式锁的多副本协调

> 本文回答一个问题：**core 服务水平扩到多副本之后，定时任务、指令回执、构建触发、告警外呼，靠什么保证不重复执行——而又不引入 Redlock、etcd concurrency、ZooKeeper 分布式锁里的任何一种？**

[GoWind Ops](https://github.com/tx7do/go-wind-ops) 的 core 是唯一连库的领域服务，天然想水平扩：多副本分摊 MQTT 信令、多副本跑定时调度。但多副本立刻带来一组经典问题——同一分钟的双 cron 触发、同一指令的重复回执、同一配置的并发构建。常见的答案是上一把分布式锁，GoWind Ops 的选择是把协调拆散进它已经在用的三个层：**MQTT broker 的投递语义、数据库条件更新、Redis 原子操作**。全仓找不到 redsync / etcd concurrency / 抢占式锁服务里的任何一种"锁服务"。

这篇文章先拆防住的机制（每一处都给代码），再老实交代**审查时找到的三个真实并发窗口**——它们的成因都不是"忘了写锁"，而是机制在单副本语义下完全正确、扩副本后才暴露。三个窗口的修复已合入仓库，修复过程比机制本身更有讨论价值。

---

## 一、问题设定：多副本到底会重复什么

把 core 复制成两份（共享 PostgreSQL / EMQX / MinIO），逐条业务线过一遍：

| 业务线 | 多副本下的重复形态 | 重复的必然性 |
|--------|------------------|------------|
| MQTT 上行（心跳/准入/回执） | 普通通配订阅是广播语义，每条消息每个副本都收 | **必然** |
| 定时构建/脚本/备份 | 30s 扫描 + cron 命中，两副本同一分钟各触发一次 | 高概率 |
| 监控检查 | 探测指令双发、防抖计数双加、告警双建双外呼 | 高概率 |
| 构建触发 | check-then-act，并发触发双跑构建 | 概率窗口 |
| 终端输出 | 连接级点对点流，组内分流会**丢流**（重复的反面） | — |
| 令牌轮换 | 并发 refresh 的 TOCTOU 竞态 | 概率窗口 |

先做这个表的原因是：**不同的重复，代价和必然性不同，防法就不同**。回执重复是 QoS 1 语义下的必然事件，必须按常态设计；cron 双触发是概率事件，CAS 一把就够；而"终端流被分流"根本不是重复问题，是正确性问题——用防重复的手段去处理它会直接丢数据。

---

## 二、重复从哪来：QoS 1 与它的三种重复源

在讲防法之前，先把"重复"这个敌人的来源钉死。指令回执走 MQTT QoS 1（至少一次），它的重复有三个来源：

1. **broker 重投**：QoS 1 的应答握手中，若 agent（或 core）处理完消息但 PUBACK 在网络中丢失，broker 会重投同一条消息——**这是协议保证的、无法避免的重复**；
2. **多副本广播**：普通通配订阅下每条上行消息投给所有副本——上一节表里的第一种；
3. **人为注入**：项目自带调试工具 `tools/mqtt-pub`，可以直接往主题里发指令和伪造回执——测试环境的常态。

第三点经常被忽略：**幂等设计不能只防网络重复，还要防"有人拿调试工具敲进来一条"**。后文的所有机制都会顺带把这条路堵上。

---

## 三、第一层：让 broker 分流——`$share` 共享订阅

上行消息的第一种重复不需要应用层操心，交给 EMQX。core 的准入、心跳、指令回执三条上行订阅全部包上共享订阅（`pkg/topic/mqtt.go`）：

```go
const MqttShareGroupCore = "gwo"

func SharedSubscription(group, filter string) string {
	return "$share/" + group + "/" + filter
}
```

```go
// core 侧订阅(mqtt_server.go)
topic.SharedSubscription(topic.MqttShareGroupCore, topic.MakeMqttTopicAuth("+", true))
topic.SharedSubscription(topic.MqttShareGroupCore, topic.MakeMqttTopicHeartbeat("+"))
topic.SharedSubscription(topic.MqttShareGroupCore, topic.MakeMqttTopicCommandResult("+"))
```

组内每条消息只投一个实例，broker 天然做了负载均衡。文件头注释写明了动机："普通通配订阅是广播语义，EMQX 会把每条 agent 上行消息投递给所有副本"。

**对照组**：终端输出流 `ops/agent/+/terminal/+/output` **故意不走 `$share`**——注释同样直白："终端流是连接级点对点流，不经 $share——否则多副本组内分流会丢流"。改为每副本都收全量输出，只有持有对应 gRPC 流的副本按内存路由表消费，其余副本静默丢弃：

```go
// agent_service.go:路由表 key = agentId/sessionId,chan 缓冲 128,满即丢帧
terminalRoutes map[string]chan *signal.TerminalIO
```

这一对组合是整套设计里最值得玩味的对比：**防重复的前提是先问"这条消息该单份还是该广播"**——指令回执要单份（`$share`），终端流要广播+自过滤（分流即丢流）。注意丢帧策略也在这里一并定了：输出通道满即丢，因为终端回显可以容忍背压丢弃，但不能容忍乱序和停顿。用带宽冗余换正确性，取舍全部写在注释里。

配套还有一个容易踩的暗坑：`$share/gwo/ops/...` 若按字面做 ACL 匹配会整组拒掉——授权层要先"剥壳"再按真实过滤器判定：

```go
// mqtt_auth_server.go:authorizeMqttTopic 对共享订阅先剥前两段
segs := strings.SplitN(t, "/", 3)   // $share / gwo / ops/agent/...
filter := segs[2]                    // 按真实过滤器做 ACL
```

**引入共享订阅后授权静默失效**——`$SYS` 拒绝、agent 只许 `ops/agent/{自身用户名}/#`、core 放行 `ops/` 前缀，这些规则都对剥壳后的过滤器生效。这个函数被写成纯函数并配了单测（`mqtt_auth_server_test.go`），因为 ACL 逻辑的正确性值得一个可以脱离 broker 单独跑的测试。

---

## 四、第二层：数据库条件更新当"抢答器"

重复执行的去重大头在数据库——不是靠悲观锁服务，而是靠**带条件的 UPDATE 返回的 affected rows 当抢答信号**。四种形态：

### 4.1 锚点 CAS：定时调度的统一答案

构建/脚本/备份/监控四类定时任务共享同一个模式（`build_repo.go`，其余三处同款）：

```go
// AdvanceCronAnchor CAS 推进定时调度锚点:仅当 last_cron_at 仍等于 expected
// 时更新为 now,返回是否抢到(多副本去重)。
func (r *BuildRepo) AdvanceCronAnchor(ctx context.Context, buildID uint32, expected, now time.Time) (bool, error) {
	n, err := r.entClient.Client().Build.
		Update().
		Where(
			build.IDEQ(buildID),
			build.LastCronAtEQ(expected),
		).
		SetLastCronAt(now).
		Save(ctx)
	if err != nil {
		return false, err
	}
	return n > 0, nil
}
```

调度器每 30 秒扫一轮，命中逻辑是：读锚点 → `schedule.Next(last)` 不晚于当前时间即命中 → CAS 推进锚点 → 只有 `n>0` 的副本触发。两个副本读到同一个锚点值，只有一个 CAS 成功——**触发权即锚点所有权**，探测指令、防抖计数、告警创建这些下游动作随锚点自然单份。

**NULL 锚点的坑**：新建任务 `last_cron_at` 为 NULL，`EQ(NULL)` 在 SQL 里永远匹配不上——CAS 永不成功、任务永不触发，且没有任何报错。专门的 `AdvanceCronAnchorFromNull` 处理首见：

```go
// 首见落锚不补跑:NULL 直接 CAS 会因 EQ(NULL) 永远匹配不上而永不触发
Update().Where(IDEQ(id), LastCronAtIsNil()).SetLastCronAt(now)
```

"不补跑"是刻意选择：服务停了一周，重启后补跑一周前错过的所有定时构建，几乎从来不是用户想要的。落当前时间锚点，从下一个周期起正常调度。

**一个诚实交代的残余语义**：CAS 成功之后、触发动作执行之前，进程若崩溃（或触发返回错误——调度器只记日志不重试），这一次调度就丢了，锚点已经前进。也就是说锚点 CAS 给出的是 **at-most-once** 的调度语义。反过来"触发成功后再推进锚点"是 at-least-once，但触发动作不可幂等（构建会双跑），两害相权取了前者。这个取舍没有写在任何文档里，但代码顺序（先 CAS 后触发）就是它的实现。

### 4.2 占位幂等键 + 抢占认领：分发的两阶段

分发是多目标、多批次、可灰度的，比单点 cron 复杂。核心矛盾：前端要**提前看到完整批次视图**（第二批还没轮到也要显示），又要求**每个目标只投一次**。设计分两步（`distribution_record_repo.go`）：

```go
// 第一步:触发时给全部目标建占位记录,幂等键形如
// pending:{distId}:{batchNo}:{projectId}
const pendingRequestPrefix = "pending:"
func MakePendingRequestID(distID, batchNo, projectID uint32) string { ... }

// 第二步:真正下发前用条件更新认领——占位键换真实 UUID
Update().
	Where(IDEQ(recordID), CommandRequestIDEQ(placeholder), StatusEQ(Pending)).
	SetCommandRequestID(requestID)
// 恰一方 n>0 获得投递权,认领失败方日志 "claim lost (concurrent advance?)" 跳过
```

批次的推进是事件驱动的：`AdvanceBatches` 挂在"分发记录回执终态"与"30 秒超时定案"两个事件上——本批有 FAILED 就把后续批次占位记录置 SKIPPED（只允许 PENDING+占位前缀的记录被跳过，幂等），全部成功则重签预签名 URL（防过期）、重算 `{buildNo}` 占位符后投下一批。**两阶段设计同时满足了"视图完整性"与"只投一次"这两个本来矛盾的要求**。

### 4.3 PENDING-only 条件回填：QoS 1 重复的终极答案

指令回执**必然**重复（第二节的三种来源），解法是把幂等做进终态写入：

```go
// FinalizeByRequestID:只有 PENDING 行能被终态化
Update().
	Where(RequestIDEQ(requestID), StatusEQ(StatusPending)).
	SetStatus(terminal)
// n==0:重复回执 / 已超时定案 / 伪造 requestID,静默返回
```

first-write-wins：重复回执、手工注入、超时扫描与真实回执竞态，全部安全。配套下发侧的顺序是刚性的——**先落台账再发布**：

```go
// publish() 的顺序
requestId := id.NewGUIDv4(false)        // 1. 生成幂等键
recordRepo.Create(...StatusPending)      // 2. 先落 PENDING 台账
s.waiters.Store(requestId, waiter)       // 3. 同步指令注册等待通道
b.Publish(ctx, topic, envelope)          // 4. 最后才发布
// 发布失败 → FinalizeByRequestID 即时定案 FAILED + 清 waiter
// 台账里永远不会残留"发了但没记"的指令
```

同步指令的等待是典型的 `select` 三路：

```go
select {
case res := <-waiter:
case <-time.After(timeout):   // 超时返回,但迟到回执不丢
case <-ctx.Done():
}
```

超时返回后回执仍由台账/分发对账链路消费——**同步等待是便利性优化，对账才是正确性保证**。30 秒一轮的扫描循环把超时 PENDING 定案 FAILED（普通指令 10 分钟、备份 30 分钟），分发记录、脚本批次条目逐条对账计数，顺带清理 7 天前的节点指标。`FinalizeStalePending` 与真实回执竞态时谁先到谁生效，另一方 `n==0` 静默——又是同一个模式。

### 4.4 条件翻转当"发一次"语义

节点离线告警的去重也是同款（`agent_node_repo.go`）：

```go
// MarkOfflineIfStale:仅 ONLINE 且心跳超时的行能翻转
Update().Where(IDEQ(id), StatusEQ(ONLINE), LastHeartbeatAtLT(cutoff)).
	SetStatus(OFFLINE)
// 返回 flipped 布尔,只有翻转成功的一方 fireNodeOfflineAlert
```

把"状态翻转"本身做成原子抢答，告警自然不重复。反过来，离线节点恢复在线（心跳/准入到达）触发恢复通知，挂在 `fireNodeOnlineRecovery` 上——翻转回来的路径同理。

### 4.5 第三层补位：Redis 原子操作

需要跨副本共享可变状态的两处走 Redis：

**刷新轮换的 Lua 原子化**（`user_token_cache.go`）。refresh token 换新要"验证 RT → 删 RT → 删 AT"三步，分开执行就是 TOCTOU：两个副本用同一个 RT 并发刷新，都通过"验证"再各自"删除"——双份新令牌，旧令牌却只有一份被登记轮换。Lua 脚本把三步压成 Redis 单线程内的一次执行：

```go
// verifyAndRevokeRefreshTokenScript:验证 RT → 删 RT → 删 AT 原子完成
// user_id 与 jti 必须来自已验证令牌的绑定,而非请求体中不可信的输入
```

**登录防爆破计数**：同用户名连续失败 5 次锁 15 分钟，`TxPipeline INCR + EXPIRE`——计数器天然跨副本共享，成功登录清零。

---

## 五、诚实的部分：审查发现的三个窗口与修复

以上机制在写代码时就位了，但把全仓按"多副本会重复什么"重新过一遍时，还是找到了三个真实的窗口。**它们的共同成因是：机制在单副本语义下完全正确，扩大副本数后才暴露**——这也是并发缺陷最难自查的一类。

### 5.1 构建触发的 check-then-act → FOR UPDATE 锁锚

原 `TriggerBuild` 的三步——`HasActiveHistory` 检查 → `IncrBuildNo` → `Create` 历史——每一步各自原子，但**合起来不是**。时间线画出来：

```
副本 A: Exist(active)? → false ─┐
副本 B: Exist(active)? → false ─┤ 两个检查都发生在任何一方 Create 之前
副本 A: IncrBuildNo → Create(history#101) → go runBuild
副本 B: IncrBuildNo → Create(history#102) → go runBuild   ← 双跑
```

注意 `(build_id, build_no)` 唯一索引**防不了它**：并发触发拿到的构建号本来就不同（101/102），唯一索引管的是"同号"，不是"同跑"。

修复的候选方案有三个，值得把落选理由也写清楚：

- **部分唯一索引**（`CREATE UNIQUE INDEX ... ON ops_build_histories(build_id) WHERE status IN ('PENDING','RUNNING')`）——PostgreSQL 的标准答案，把"仅允许一条活跃"下沉到存储层。但**MySQL 没有 partial index**，本仓 PostgreSQL/MySQL 双支持，索引方案在 MySQL 侧无从落地；
- **Redis SETNX 触发锁**——引入新的失效模式：锁服务抖动时要么误拒要么双放，且 TTL 过期与业务时长的关系永远是个猜谜；
- **锁锚事务**（最终选择）：构建配置行是全部触发路径的公共实体，把它当锁锚：

```go
// CreateExclusive:事务内锁配置行,复查+推进构建号+落历史原子完成
tx, _ := r.entClient.Client().Tx(ctx)
defer func() { /* err != nil → Rollback; else Commit */ }()

// 锁锚:配置行 FOR UPDATE,并发触发在此排队
cfg, err := tx.Build.Query().Where(build.IDEQ(buildID)).ForUpdate().First(ctx)

exist, _ := tx.BuildHistory.Query().
	Where(BuildIDEQ(buildID), StatusIn(PENDING, RUNNING)).Exist(ctx)
if exist {
	return nil, true, nil        // conflict → 409
}

buildNo := cfg.BuildNo + 1
tx.Build.UpdateOneID(buildID).SetBuildNo(buildNo).Exec(ctx)   // 锁内绝对值推进,安全
history, _ = tx.BuildHistory.Create().
	SetBuildID(buildID).SetBuildNo(buildNo).SetStatus(PENDING).
	SetRunnerID(runnerID).Save(ctx)
// commit
```

选它的决定性理由是**入口收敛**：手动触发、REST API、Git webhook、cron 调度——全部路径都过 `TriggerBuild` 一个函数。单入口意味着一处锁锚覆盖所有触发方，不需要在数据层补第二道防线。临界区只有三条 SQL（毫秒级），行锁不跨任何外呼。`FOR UPDATE` 在 InnoDB 与 PostgreSQL 下语义一致，方言兼容。

### 5.2 监控检查的"只读幂等"错觉 → 锚点 CAS 补齐

调度器结构体注释原文写着"监控检查只读幂等，重复无害"。**这句话不成立，而且它是 bug 的一部分**。检查的真实副作用清单：创建告警行、外呼 webhook（钉钉加签/飞书/企微/邮件）、推进防抖计数 `ConsecutiveHits`、触发项目自动重启。多副本同分钟双跑的后果逐条展开：

- `HasUnresolvedAlert` 是 check-then-act：两副本同时查都返回 false → **双建告警、双发通知**，用户收两条一样的钉钉；
- `ConsecutiveHits` 是"读出 +1 写回"的读改写：`hits := monitor.ConsecutiveHits + 1; SetConsecutiveHits(hits)`——并发下丢失更新，`ConsecutiveCount=3` 的防抖被两次并发 tick 各 +1 直接抬到阈值，**防抖失效，告警提前触发**；
- `project_status` / `process_list` 探测指令双发——MQTT 流量翻倍，agent 侧同步等待资源翻倍。

修复三件套：

**其一，给监控规则加 `last_check_at` 锚点，检查前 CAS 抢占**——与构建/脚本/备份完全同款，包括 NULL 落锚。`tickMonitors` 的循环结构向 `tickBuilds` 看齐：

```go
if m.LastCheckAt == nil {
	// 新规则的空锚点先落当前时间(不补跑)
	s.monitorRepo.AdvanceCheckAnchorFromNull(ctx, m.ID, now)
	continue
}
last := *m.LastCheckAt
next := schedule.Next(last)
if next.After(now) { continue }
ok, _ := s.monitorRepo.AdvanceCheckAnchor(ctx, m.ID, last, now)
if !ok { continue }   // 别的副本抢到了,本副本跳过
CheckMonitor(...)
```

曾考虑过 Redis `SETNX` 分钟桶方案（`key = monitor:{id}:{minuteBucket}`），落选理由有二：分钟桶依赖两副本时钟对齐，跨分钟的钟偏移窗口内仍可能双跑；而锚点 CAS 比较的是**数据库里的精确上次值**，与挂钟无关，且不引入新依赖。CAS 赢在语义而不是性能。

**其二，防抖计数改原子自增**，消灭读改写：

```go
// IncConsecutiveHits:AddConsecutiveHits(1) 生成 consecutive_hits = consecutive_hits + 1
entity, err := r.entClient.Client().Monitor.
	UpdateOneID(id).
	AddConsecutiveHits(1).
	Save(ctx)          // ent 返回更新后实体,新值直接可用
return entity.ConsecutiveHits, nil
```

即使未来出现绕过调度器的新触发路径，并发自增也不再丢失。归零同理改成条件更新：`Where(IDEQ(id), ConsecutiveHitsNEQ(0)).SetConsecutiveHits(0)`，幂等。

**其三，恢复通知改由条件更新的行数裁决。**原恢复路径是"先查有没有未恢复 → 恢复 → 发通知"——又是一处 check-then-act。而 `ResolveAllByMonitor` 本来就只更新 `resolved=false` 的行并返回 affected rows，把通知改挂在行数上：

```go
resolved, err := alertRepo.ResolveAllByMonitor(ctx, monitor.ID)
if resolved == 0 {
	return   // 无告警可恢复,或已被并发方恢复——不再发恢复通知
}
if monitor.NotifyOnRecovery { ...SendAlertToChannels... }
```

**多副本下恰一方发出恢复通知**，且语义比原版更准：原来"查到未恢复但恢复失败"的路径仍会发通知，现在不会了。

顺带说教训：那句"只读幂等"的注释本身就是缺陷的放大器——它会诱导下一个维护者（包括做并发审查的自己）跳过这条路径。**注释声称的性质要和代码的真实副作用对得上**，这比任何设计文档都重要。

### 5.3 启动清扫的全局误伤 → runner 归属

`FinalizeInterrupted` 在 core 启动时把**全部** PENDING/RUNNING 构建历史定案 FAILED。单副本语义下这是必要的自愈：进程被 `kill -9`，在跑构建的 goroutine 消失，遗留的 RUNNING 记录必须有人收尸，否则永远占着"活跃"状态、新构建永远 409。

多副本滚动重启时它变成误伤——**重启副本会把其他副本正在跑的构建也标 FAILED**。构建 goroutine 在进程内，记录却是全局表里的一行；被误标的那个副本还在跑构建，跑完去 `UpdateFinished` 又把 FAILED 改回 SUCCESS——状态机被打穿了一个来回。

修复是给构建历史和流水线 run 加 `runner_id`（机器指纹，`pkg/machine.MachineID()`——与 agent 准入用的是同一个机器标识），把"全局收尸"改成"各自收尸 + 兜底清孤儿"：

```go
// ① 启动清扫:只清本实例(同机器指纹)的遗留
func (r *BuildHistoryRepo) FinalizeInterruptedByRunner(ctx context.Context, runnerID string) (int, error) {
	q := r.entClient.Client().BuildHistory.
		Update().
		Where(StatusIn(PENDING, RUNNING))
	if runnerID != "" {
		q = q.Where(buildhistory.RunnerIDEQ(runnerID))
	}
	return q.SetStatus(FAILED).SetError("interrupted by core restart").
		SetNillableFinishedAt(&now).Save(ctx)
}

// ② 周期兜底:runner 已消失、无人认领的孤儿,按停更时间定案
Update().
	Where(StatusIn(PENDING, RUNNING), UpdatedAtLT(now.Add(-2*time.Hour))).
	SetStatus(FAILED).SetError("orphaned: runner lost (no progress beyond threshold)")
```

**2 小时阈值不是拍的**：构建命令最长 3600s，且执行期间有 5 秒一次的日志刷库（`updated_at` 持续更新）；克隆阶段 ≤10 分钟、产物上传亦有时限——持续 2 小时无任何更新，runner 存活的可能性可以排除。选 `updated_at` 做活性信号而不是新建心跳表，是因为它已经存在且被写路径自然维护，孤儿检测不需要任何额外基建。

**为什么归属用机器指纹而不是进程 ID**：runner 的存在意义是"滚动重启时，新进程认领旧进程的遗留"——同机器重部署时新进程与旧进程共享机器指纹，启动清扫才能找到"自己的尸"。若用 PID/启动时间戳，每个新进程都是陌生 ID，启动清扫永远空转，孤儿清扫的 2 小时延迟反而成了常态。机器上跑两个 core 副本会共享指纹，但这种部署本来就被端口冲突排除。

条件更新幂等，多副本并发清扫恰一方生效——还是同一个模式。

### 5.4 修复后仍然留下的窗口（知情保留）

修完三处，还剩几个小窗口，逐一评估后**知情保留**，写出来是边界也是态度：

- 证书调度探测没有 CAS，多副本会对同一证书重复做 TLS 探测——探测结果幂等回写，只浪费不出错；
- 预算告警的 `Notified` 持久化闩锁在"首穿"时刻有微小窗口（两副本都读到 `false`），有未恢复告警去重作二道闸；
- 内存节流计时器（产物保留清扫、瞬态对象清理、日志快照）每副本各跑一份——清理类幂等无害，日志快照可能重复采集；
- 锚点 CAS 的 at-most-once 语义（4.1 节）：触发动作失败时该次调度丢失。

它们的共同点：**重复（或丢失）的代价 < 引入协调机制的复杂度**。分级处理的另一面，是允许已知的小瑕疵带着注释活着。

---

## 六、为什么不用分布式锁：三问 Redlock

把"为什么不直接上 Redisson/Redlock"正面回答掉：

**一问：锁的 TTL 与业务时长怎么定？** 构建最长 1 小时，锁 TTL 给多少？给短了业务没做完锁过期、第二个副本进来双跑（Redlock 的经典难题）；给长了副本崩溃后全员等锁过期。锁方案要求你回答"业务要跑多久"，而 GoWind Ops 的答案写在协调原语的性质里：CAS 锚点没有持有期，天然无过期问题。

**二问：锁服务本身的高可用谁负责？** Redis 主从切换丢锁、etcd 集群自身的选主抖动——锁方案把可用性依赖从"数据库已经必须可用"扩大到"另一个系统也必须可用"。而本仓的全部协调原语（条件更新、CAS、Lua）都落在**已经存在的存储**上：数据库和 Redis 是业务的依赖，不是为协调新引入的依赖。

**三问：fencing token 谁来实现？** 严格的 Redlock 正确性要求 fencing token（单调递增令牌 + 存储侧拒绝旧令牌），而存储侧拒绝旧令牌的实现——其实就是条件更新。既然终局是条件更新，不如从它开始。

一句话：**分布式锁解决的是"互斥地进入一段临界区"，而这里的绝大多数问题只是"一件事只做一次"——后者一条条件 UPDATE 就够了**。只有 5.1 那种真正的多步临界区才值得动用行锁，且入口收敛时一行 `FOR UPDATE` 就够，不需要锁服务。

---

## 七、方法论：按重复代价分级选机制

把全仓的协调手段收拢成一张决策表：

| 机制 | 原子性来源 | 适用场景 | 代价与边界 |
|------|-----------|---------|-----------|
| `$share` 共享订阅 | broker 投递语义 | 上行消息分流 | 连接级会话流**不适用**（改广播+自过滤） |
| 锚点 CAS | `UPDATE ... WHERE anchor=expected` | 定时触发去重 | 需要锚点列；NULL 锚要先落锚；at-most-once |
| 占位键两阶段认领 | 条件 UPDATE 换幂等键 | 多目标批量任务 | 多一张记录表；批次视图与只投一次的矛盾解 |
| PENDING-only 回填 | 条件 UPDATE 终态化 | 必然重复的回执/对账 | 状态机要有唯一终态入口；迟到回执靠对账链路消费 |
| 条件翻转 | 条件 UPDATE 状态迁移 | "变化时告警一次" | 状态列要有明确翻转条件与翻转方向 |
| Redis Lua / INCR | 单线程原子脚本 | 跨副本共享可变状态 | 引入 Redis 强依赖；脚本要短 |
| FOR UPDATE 锁锚 | 行锁串行化临界区 | 多步 check-then-act 且入口收敛 | 锁不跨外呼；方言兼容性需确认（MySQL 无 partial index） |

选型的判断顺序：**先问重复的必然性**（QoS 1 回执是必然，cron 双触发是概率）→ **再问重复的代价**（告警双发骚扰人 > 探测双跑浪费 > 清理双跑无害）→ **最后看入口是否收敛**（单入口一处锁锚；多入口才需要数据层唯一约束兜底）。多数场景根本不需要锁服务——需要的是把"检查"和"行动"压进一条条件 UPDATE 里。

---

## 八、验证

多副本行为不好自动化测试，但真机验证路径是明确的。起两个 core 副本（共享 PG/EMQX/MinIO）：

```bash
# 场景一:监控单份性
# 配一条每分钟命中的监控规则,10 分钟后查告警表
# 期望:每个异常周期恰好 1 条告警、1 次外呼(投递台账可查)

# 场景二:构建触发互斥
seq 1 20 | xargs -P 10 -I{} curl -s -X POST \
	-H "Authorization: Bearer $TOKEN" \
	http://127.0.0.1:18600/admin/v1/builds/1/builds:trigger | \
	grep -c '"code":409'
# 期望:恰好 1 个 201,19 个 409;历史表只有一条 PENDING/RUNNING

# 场景三:滚动重启不误伤
# 副本 A 跑一条长构建(45 分钟超时),期间重启副本 B
# 期望:A 的构建状态全程 RUNNING 直至自然终态

# 场景四:孤儿回收
# 直接 kill -9 掉跑着构建的副本,观察另一副本的日志
# 期望:2 小时内孤儿清扫把记录定案 FAILED(error 含 "orphaned")
```

---

## 九、结语

GoWind Ops 的这套实践可以浓缩成四句话：

1. **先分流，后去重**——broker 能挡住的重复（MQTT 上行广播）不劳应用层；分流之前先判断消息该单份还是广播；
2. **条件 UPDATE 是最被低估的分布式原语**——锚点 CAS、占位认领、PENDING 回填、状态翻转，四种场景一种语法，且全部落在业务已有的存储上；
3. **真正的临界区才用锁，且用行锁不用锁服务**——前提是入口收敛；`FOR UPDATE` 与 MySQL partial index 的缺席共同决定了方案形态；
4. **扩副本前按"单副本语义逐行过一遍"做专项审查**——三个窗口全部属于"单副本正确、多副本暴露"，这类问题不会在单机测试里出现，只会在扩容那天出现。

仓库（本文涉及的修复已包含在最新代码中）：

- GitHub：[github.com/tx7do/go-wind-ops](https://github.com/tx7do/go-wind-ops)
- Gitee：[gitee.com/tx7do/go-wind-ops](https://gitee.com/tx7do/go-wind-ops)
