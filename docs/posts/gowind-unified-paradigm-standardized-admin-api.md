---
date: 2026-05-28
category:
  - GoWind风行
tag:
  - Vue3
  - React
  - Protobuf
  - GoWind
sticky: 10
---

# 统一范式：中后台Admin项目标准化API分层开发方案（Vue/React通用）

## 前言

在中后台Admin系统开发过程中，API层开发是所有业务功能的基石，用户列表、权限配置、字典管理、审计日志、文件上传等几乎所有后台业务，都离不开前后端接口的数据交互。

在传统的开发模式中，团队往往存在诸多痛点：接口调用方式混乱、数据缓存无统一方案、组件与非组件环境调用逻辑割裂、重复编写请求与TS类型、Vue与React技术栈开发规范不统一、新增业务模块无固定标准。不仅拉高新人上手成本，还极易产生冗余代码、隐性BUG，严重影响迭代效率。

为解决以上问题，我们基于**Axios（底层请求）+ ****TanStack Query**（原React Query/Vue Query，异步状态管理）、TypeScript强类型约束，结合gRPC后端接口体系，设计了一套**三层分层API架构**。该架构完美适配Vue、React双技术栈，统一中后台项目API开发规范，分离网络请求、缓存管理、业务逻辑、UI渲染的职责，实现类型全覆盖、调用方式标准化、业务开发轻量化，下文将完整介绍这套框架的设计理念、分层逻辑、使用方式与开发规范。

## 一、技术选型底层逻辑

本套API开发框架，核心依托三大主流技术，针对性适配Admin后台场景的业务特性：

### 1.1 TanStack Query

负责接管异步数据状态、缓存管理，**底层请求载体依旧基于Axios实现**，替代传统纯手写axios封装、依靠全局状态（Zustand/Pinia）维护异步数据的老旧方案。作为现代化异步状态管理工具，它原生支持**自动缓存、窗口聚焦刷新、请求防抖、垃圾回收、分页/无限加载、离线请求**等后台高频能力，开发者无需手动编写缓存、加载状态、重复重试等冗余逻辑；同时零额外第三方依赖、跨框架适配Vue/React/Svelte/Angular全技术栈，是中后台项目异步数据管理的最优解。

### 1.2 TypeScript

贯穿API全层级的强类型约束。从自动生成的后端接口类型，到请求参数、响应数据、分页结构体，全程实现类型校验与智能提示，从根源规避参数传递错误、字段拼写错误，提升代码可维护性，适配大型企业级Admin系统开发。

### 1.3 gRPC+Protobuf

后端统一采用gRPC定义接口，通过`protoc-gen-typescript-http`插件自动生成前端TS类型与请求客户端，彻底解决前后端类型不同步、接口文档滞后的问题，实现接口类型一键同步。

## 二、整体架构设计：三层分层架构

我们摒弃粗放式的直接请求模式，将API层自上而下划分为**业务Hook层、Service服务层、自动生成层**三层结构，遵循**单向依赖、职责分离、环境隔离**三大核心原则，上层依赖下层，禁止反向调用；每层各司其职，互不越界。该架构在Vue、React项目中结构完全一致，仅Hooks层API适配对应框架即可。

### 2.1 架构总览

```plain-text
UI层（Vue组件/React组件）
        ↓ 依赖
Hook层（Composables/Hooks）→ 封装TanStack Query，面向业务，提供两种调用模式
        ↓ 依赖
Service服务层 → 纯异步函数，封装接口客户端，处理参数适配
        ↓ 依赖
Generated自动生成层 → Protobuf自动生成类型+客户端，禁止手动修改
```

### 2.2 核心设计原则

- **单向依赖**：UI→Hook→Service→Generated，禁止下层直接调用上层能力

- **职责单一**：每一层仅负责自身核心工作，剥离冗余耦合逻辑

- **环境隔离**：区分组件运行环境、全局Store/路由守卫等非组件环境，提供差异化调用方案

- **双栈统一**：目录结构、命名规范、新增模块流程，Vue/React完全对齐，降低跨技术栈学习成本

## 三、分层详解（核心）

### 3.1 第一层：Generated 自动生成层（底层）

#### 3.1.1 定位

整个API架构的数据基础，由Protobuf文件自动生成，**全程禁止开发者手动编辑**，所有修改均需同步后端protobuf文件后重新编译生成。

#### 3.1.2 核心能力

- 全量接口TS类型：包含请求体、响应体、枚举、实体类（如用户、角色、字典实体）；

- Service客户端工厂函数：针对后端每一个gRPC服务，生成对应的客户端创建方法；

- 统一命名规则：采用`{服务标识}v1_{消息名称}`格式，直观区分权限、用户、认证、字典等业务模块。

#### 3.1.3 适用场景

仅作为底层依赖，供Service层导入使用，业务开发者无需直接接触该目录代码。

### 3.2 第二层：Service 服务层（中间层）

#### 3.2.1 定位

架构的适配层，承上启下。封装自动生成的客户端，剥离框架特性，输出**纯异步函数**，无任何Vue/React框架依赖，可在任意JS/TS环境运行。

#### 3.2.2 核心职责

- 单例管理：以延迟初始化模式缓存每个服务的客户端实例，避免重复创建造成资源浪费；

- 参数适配：统一封装分页结构体`PaginationQuery`，自动完成请求参数格式化；

- 接口封装：按照固定命名规范，封装列表查询、详情、新增、编辑、删除等基础接口；

- 原始异常透传：不做全局异常捕获，将错误向上抛出，交由上层Hook层统一处理。

#### 3.2.3 统一开发规范

所有Service文件遵循统一模板，命名规则固定：

- 客户端获取函数：`getXxxService()`；

- 接口函数：列表`listXxx`、详情`getXxx`、新增`createXxx`、更新`updateXxx`、删除`deleteXxx`。

### 3.3 第三层：Hook/Composables 业务层（顶层）

#### 3.3.1 定位

面向业务开发者的**最终调用入口**，也是日常开发使用最多的层级。基于TanStack Query封装Service层异步函数，适配双技术栈：Vue项目为Composables，React项目为Hooks。

#### 3.3.2 双调用模式（核心亮点）

为解决后台项目多运行环境的痛点，每一个接口均提供两种调用方式，全覆盖所有业务场景：

1. **useXxx（Hook/组合式函数）**：仅用于组件内部，依托TanStack Query自带加载状态、缓存、防抖、状态管理能力，开箱即用；

2. **fetchXxx（纯Promise函数）**：无框架上下文依赖，专门用于Zustand/Pinia全局状态、路由守卫、工具函数、异步任务等非组件环境。

#### 3.3.3 附加能力

- 通用枚举工具：内置启用状态、业务状态、HTTP请求方法等全局映射函数，快速实现状态文字/颜色转换；

- 缓存精细化配置：支持自定义缓存时长、失败重试、缓存失效，适配增删改查不同接口；

- 统一全局异常：封装全局请求错误拦截，自动处理401 Token过期、403权限不足等后台通用异常。

## 四、目录结构规范（Vue/React对齐）

为统一团队开发习惯，两套技术栈采用完全一致的目录结构，仅顶层组合式函数目录名称区分`composables`（Vue）与`hooks`（React）：

```plain-text
src/api/
├── index.ts                        # API模块统一导出总入口
├── generated/                      # 自动生成层（勿手动修改）
│   └── admin/service/v1/
│       └── index.ts                # 类型+客户端工厂集合
├── service/                        # Service服务层（双栈完全一致）
│   ├── auth.ts / user.ts / role.ts # 按后端服务拆分文件
│   └── index.ts                    # 服务统一导出
└── composables/hooks/               # 业务Hook层（差异化适配）
    ├── shared.ts                   # 全局通用枚举工具
    ├── auth.ts / user.ts           # 与service文件一一对应
    └── index.ts                    # Hook统一导出
```

目录拆分严格按照后台业务模块划分：认证授权、用户租户、组织架构、权限管理、系统配置、审计日志、站内消息，结构清晰，新人可快速定位对应接口。

## 五、业务场景使用指南

我们以后台最常见的**用户管理模块**为例，讲解不同场景下的标准调用方式。

### 5.1 组件内部调用（推荐useXxx）

适用于页面组件、弹窗组件等场景，自动接管loading、error、缓存状态，无需手动定义变量维护加载状态。以Vue为例，React用法逻辑完全一致：

```typescript
<script setup lang="ts">
import { useListUsers } from "@/api";
import { PaginationQuery } from "@/core/transport/rest";

// 初始化分页查询参数（统一结构体）
const query = new PaginationQuery({
  paging: { page: 1, pageSize: 20 },
  formValues: { status: "NORMAL" }, // 筛选正常状态用户
  orderBy: ["-created_at"] // 按创建时间降序
});

// 直接获取数据、加载状态、错误信息
const { data, isLoading, error } = useListUsers(query);
</script>
```

### 5.2 全局Store调用（推荐fetchXxx）

适用于Zustand/Pinia状态库，使用无依赖的fetch函数，避免Hook上下文报错：

```typescript
import { create } from 'zustand';
import { fetchListUsers } from '@/api/hooks/user';

export const useUserStore = create((set) => ({
  userList: [],
  // 加载用户列表
  loadUserList: async (query) => {
    const res = await fetchListUsers(query);
    set({ userList: res.items });
  }
}));
```

### 5.3 路由守卫/工具函数调用

用于动态生成路由、权限校验等前置逻辑，同样使用fetch系列函数：

```typescript
import { fetchMyPermissionCode } from '@/api/composables/admin-portal';

// 校验当前用户路由权限
export async function checkRoutePermission(route: string) {
  const permissionList = await fetchMyPermissionCode();
  return permissionList.includes(route);
}
```

### 5.4 标准化增删改操作

框架内置updateMask自动生成能力，更新接口仅需传递变更字段，减少冗余传参：

```typescript
// 更新用户信息
const { mutateAsync } = useUpdateUser();
await mutateAsync({
  id: 1,
  values: { name: "更新后的用户名" } // 仅传递变更字段即可
});
```

## 六、新增业务模块标准化流程

当后端新增gRPC业务服务（如消息通知服务NotificationService），开发者仅需4步即可完成前端API接入，全流程标准化，无自定义开发成本：

1. **同步生成底层代码**：拉取最新protobuf文件，执行编译命令，更新generated目录下的类型与客户端；

2. **编写Service层**：新建`notification.ts`，初始化客户端单例，封装基础CRUD异步函数；

3. **编写Hook层**：对应创建Hook文件，封装use系列接口与fetch系列接口，配置缓存策略；

4. **统一导出注册**：分别在service、composables/hooks的index.ts中导出当前模块，全局生效。

## 七、全局TanStack Query配置（后台专属）

针对Admin系统数据更新频率低、静态数据多的特性，我们统一全局默认配置，所有接口共享：

- staleTime：60s，60秒内重复请求直接读取缓存，减少无效网络请求；

- retry：false，接口请求失败不自动重试，避免重复请求干扰后台数据；

- refetchOnWindowFocus：false，窗口聚焦不自动刷新；

- refetchOnReconnect：false，网络重连不自动刷新。

## 八、开发红线与最佳实践

### 8.1 开发红线（禁止操作）

- 禁止手动修改generated目录内的任何代码；

- 禁止在Service层使用框架Hook/组合式函数，保持纯函数特性；

- 禁止在非组件环境直接调用useXxx系列接口；

- 禁止更新接口传递全量字段，必须仅传递变更字段，依托updateMask优化请求。

### 8.2 最佳实践

- 查询类接口开启缓存，增删改类接口关闭缓存，平衡性能与数据实时性；

- 数据变更后，通过`invalidateQueries`主动失效对应缓存，自动刷新页面数据；

- 所有列表查询统一使用`PaginationQuery`结构体，统一参数格式；

- 异常分层处理：底层Service透传错误，Hook层处理业务提示，全局统一兜底异常。

## 九、总结

这套三层分层API开发框架，彻底解决了传统Admin项目API开发混乱、双技术栈规范不统一、缓存管理繁琐、类型不安全等行业痛点。

从开发效率层面：标准化的目录结构、固定的新增模块流程、开箱即用的CRUD接口、内置缓存与状态管理，减少70%以上的重复请求逻辑编写工作；

从维护层面：强TypeScript类型约束、单向依赖架构、统一编码规范，降低团队协作与后续迭代成本；

从适配层面：完美兼容Vue/React双技术栈，适配组件、Store、路由守卫、工具函数等全部后台运行场景，全覆盖中后台所有业务需求。

后续所有Admin类新项目、存量项目迭代，均推荐统一采用本套API开发范式，实现团队开发标准化、轻量化、高效化。

## 附录：项目地址与演示信息

本套分层API架构已完整落地于 **GoWind Admin（风行）** 全栈中后台脚手架，脚手架依托Kratos微服务后端，同步提供Vue3 Vben、Vue3 Element Plus、React Antd三大前端版本，支持单体/微服务双模式部署，开箱即用。

- **GitHub 仓库**：[https://github.com/tx7do/go-wind-admin](https://github.com/tx7do/go-wind-admin)
- **Gitee 仓库**：[https://gitee.com/tx7do/go-wind-admin](https://gitee.com/tx7do/go-wind-admin)
- **在线演示地址**：[https://demo.admin.gowind.cloud](https://demo.admin.gowind.cloud)
- **默认登录账号**：`admin` / **密码**：`admin`
