# 基于 Go-Kratos 与 MCP 的推荐服务实战指南

在微服务与多模块协同场景下，实现服务间的标准化通信与流程调度是核心挑战。本文聚焦 `go-kratos-mcp-demo` 项目，讲解如何基于
`Go-Kratos` 框架与 `MCP`（模块化协同协议）构建可扩展的推荐服务，涵盖服务契约设计（proto）、模块化流程编排、召回/过滤/排序等关键模块的实现与测试，并展示实战部署与可观测性方案。

## 技术基石：Go-Kratos 与 MCP 的协同架构

项目技术选型围绕 “模块化协同” 核心需求展开，`Go-Kratos` 与 `MCP` 构成架构的两大支柱，形成 “框架赋能 + 协议规范” 的协同模式：

- **Go-Kratos：** 作为B站开源的微服务框架，提供了从 API 定义、配置管理到服务治理的全链路支持。项目通过其 `transport` 层扩展 `kratos-transport` 实现了 MCP 协议的集成，同时借助 wire 依赖注入工具简化了服务间依赖管理，让模块解耦更彻底。
- **MCP 协议：** 通过 `mcp-go` 库实现多模块协同，定义了标准化的工具注册、请求参数与响应格式。在推荐流程中，召回、排序、过滤模块通过 MCP 上下文传递数据，避免了硬编码耦合，使各模块可独立升级与复用。

从依赖管理可见，项目通过 `github.com/tx7do/kratos-transport/transport/mcp` 实现了 Kratos 与 MCP 的无缝对接，同时引入 `mcp-go` 提供协议核心能力，形成了 "框架 + 协议" 的协同开发模式。

## MCP 服务设计：基于 Kratos 的模块化调度实现

### 1. MCP 服务初始化与工具注册

在 `internal/server/mcp.go` 中，项目基于 `Kratos` 扩展的 `mcpServer` 构建 `MCP` 服务，核心是注册 "推荐工具" 并绑定处理逻辑：

```go
func NewMcpServer(_ log.Logger, recommendService *service.RecommendService) *mcpServer.Server {
    srv := mcpServer.NewServer(
        mcpServer.WithServerName("Recommend MCP Server"),
        mcpServer.WithMCPServeAddress(":8080"), // MCP 服务端口
        // 更多配置...
    )
    
    // 注册推荐工具，定义输入参数schema
    if err = srv.RegisterHandler(
        mcp.Tool{
            Name:        "recommend",
            Description: "获取个性化推荐结果",
            InputSchema: mcp.ToolInputSchema{ // MCP 标准化输入定义
                Type: "object",
                Properties: map[string]interface{}{
                    "userFeature": map[string]interface{}{ // 用户特征
                        "type": "object",
                        "properties": map[string]interface{}{
                            "userId": map[string]interface{}{"type": "string"},
                        },
                    },
                    "triggerItemId": map[string]interface{}{"type": "integer"}, // 触发商品ID
                    "scene":         map[string]interface{}{"type": "string"},  // 推荐场景
                },
                Required: []string{"userFeature"},
            },
        },
        recommendService.HandleRecommend, // 绑定处理函数
    ); err != nil {
        log.Errorf("failed to register recommend tool: %v", err)
    }
    
    return srv
}
```

这段代码体现了 MCP 协议的核心思想：通过标准化的工具定义（名称、输入 schema、描述），使调用方无需关心具体实现，只需按协议格式请求即可。而 Kratos 的服务管理能力则确保了 MCP 服务的高可用启动与配置加载。

### 2. 多模块协同流程：MCP 上下文驱动的推荐链路

推荐服务的核心逻辑在 `internal/service/recommend.go` 中实现，通过 `MCP` 上下文串联 **召回**、**排序**、**过滤** 三大模块：

```go
// HandleRecommend MCP协议推荐处理入口
func (s *RecommendService) HandleRecommend(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
    // 1. 解析MCP请求参数为内部上下文
    var actionCtx recommendV1.UserActionContext
    if err := codec.Unmarshal(argsData, &actionCtx); err != nil {
        return nil, err
    }
    
    // 2. 生成请求ID，用于全链路追踪
    requestId := uuid.New().String()
    
    // 3. 召回模块：基于用户历史与场景召回候选物品
    recallInput := &recommendV1.RecallInputContext{
        Stage:          recommendV1.ContextStage_CONTEXT_STAGE_RECALL,
        RequestId:      requestId,
        UserFeature:    actionCtx.GetUserFeature(),
        HistoryItemIds: history, // 用户历史行为
    }
    recallOutput, err := s.recallService.Recall(ctx, recallInput)
    
    // 4. 排序模块：对召回结果打分排序
    rankInput := &recommendV1.RankInputContext{
        Stage:     recommendV1.ContextStage_CONTEXT_STAGE_RANK,
        RequestId: requestId,
        RecallCtx: recallOutput, // 传递召回结果
    }
    rankOutput, err := s.rankService.Rank(ctx, rankInput)
    
    // 5. 过滤模块：过滤黑名单与已购物品
    filterInput := &recommendV1.FilterInputContext{
        Stage:            recommendV1.ContextStage_CONTEXT_STAGE_FILTER,
        RequestId:        requestId,
        RankCtx:          rankOutput, // 传递排序结果
        BlacklistItemIds: s.filterService.rc.GetService().GetFilter().GetBlacklist(),
    }
    finalOutput, err := s.filterService.Filter(ctx, filterInput)
    
    // 6. 封装为MCP响应格式
    return &mcp.CallToolResult{
        Content: []mcp.Content{
            mcp.TextContent{Type: "text", Text: string(finalOutputJson)},
        },
    }, nil
}
```

整个流程中，MCP 协议承担了 "标准化胶水" 的角色：输入参数通过 `MCP` 定义的 `CallToolRequest` 传递，各模块通过上下文（`RecallInputContext`、`RankInputContext` 等）共享数据，最终结果以 `CallToolResult` 标准化返回。而 Kratos 的依赖注入（通过 `wire`）则确保了 `recallService`、`rankService` 等模块的灵活注入，实现了解耦。

## 服务部署与测试：Kratos 生态工具链的实践

项目借助 Kratos 生态的工具链实现了标准化的构建与测试流程：

### 1. 服务启动

在 `cmd/server/main.go` 中，通过 `Kratos` 的 `kratos.New` 整合 `MCP服务` 与 `HTTP服务`，实现多协议共存：

```go
app := kratos.New(
    kratos.Name("recommend-mcp-server"),
    kratos.Server(
        ms, // MCP服务
        hs, // HTTP服务
    ),
)
```

### 2. 测试支持

`internal/service/recommend_test.go` 中，通过 MCP 客户端模拟请求，验证整个推荐链路：

```go
// 初始化MCP客户端
httpTransport, _ := transport.NewStreamableHTTP("http://localhost:8080/mcp")
mcpClient := client.NewClient(httpTransport)

// 调用推荐工具
result, _ := mcpClient.CallTool(ctx, mcp.CallToolRequest{
    Params: mcp.CallToolParams{
        Name: "recommend",
        Arguments: map[string]interface{}{
            "userFeature": map[string]interface{}{"userId": "user123"},
            "triggerItemId": int64(1001),
            "scene":         "homepage",
        },
    },
})
```

### 3. 构建脚本

`Makefile` 整合了 `Kratos` 推荐的开发流程，支持一键生成 API 代码、启动服务：

```bash
# 生成API与OpenAPI文档
make api openapi

# 生成依赖注入代码
make wire

# 启动服务（同时启动MCP与HTTP服务）
make run
```

## 总结：Go-Kratos 与 MCP 协同的价值

`go-kratos-mcp-demo` 项目展示了 `Go-Kratos` 与 `MCP协议` 在模块化服务开发中的协同优势，为微服务架构设计提供三大启示：

1. **标准化协同：** MCP 协议定义了模块间通信的统一规范，使召回、排序等模块可独立开发、复用与升级。
2. **框架赋能：** Kratos 提供的服务管理、配置加载、依赖注入等能力，降低了 MCP 服务的开发与运维成本。
3. **多协议支持：** 通过 Kratos 的 `transport` 扩展，项目同时支持 `MCP` 与 `HTTP` 协议，满足不同场景的调用需求。

对于需要构建模块化、可扩展微服务的场景，这种 "框架 + 协议" 的模式具有重要参考价值，既保证了架构的灵活性，又通过标准化降低系统复杂度，具有较强的实践参考价值。

## 项目代码

* [go-kratos-mcp-demo Gitee][1]
* [go-kratos-mcp-demo Github][2]

[1]: <https://github.com/tx7do/go-kratos-mcp-demo>
[2]: <https://gitee.com/tx7do/go-kratos-mcp-demo>
[3]: <https://github.com/mark3labs/mcp-go>
[4]: <https://github.com/tx7do/kratos-transport>
