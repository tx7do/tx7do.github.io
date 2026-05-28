---
date: 2026-05-28
category:
  - GoWind风行
tag:
  - React
  - Vue3
  - GoWind
sticky: 10
---

# 吃透后台权限系统：从架构设计到 Vue3/React 双框架完整落地

## 前言

权限模块是企业级中后台系统的基础设施，也是前端工程化进阶必备知识点。当前市面上绝大多数权限教程普遍存在两个痛点：仅讲解表层API调用，缺少顶层架构思维；Vue、React两套实现方案割裂，无法复用。

从工程化角度来讲，**权限本质与UI框架无关**。无论Vue3还是React，权限的数据模型、鉴权逻辑、执行链路完全一致。

本文立足于企业级项目标准，拆解通用权限架构，同时提供**Vue3 + React**双框架生产级落地代码，统一路由/菜单/页面/按钮四级权限，适配前端静态、后端动态两种模式，帮助开发者搭建标准化、可复用的权限体系。

## 一、权限架构整体设计（全框架通用）

### 1.1 设计原则

整套权限架构围绕三大核心原则搭建，适配大中小型所有中后台项目：

- **解耦性**：权限内核与UI层解耦，鉴权规则、数据存储、状态管理统一抽象；

- **分层性**：覆盖路由、菜单、页面、按钮四层粒度，实现全方位访问控制；

- **双模式**：同时支持前端静态路由、后端动态路由，可一键切换。

### 1.2 两种权限运行模式

#### 1）前端权限模式（frontend）

路由静态定义于前端，登录后根据用户角色、权限码过滤路由表；优势为开发简单、部署便捷；适用于权限规则固定的中小型项目。

#### 2）后端权限模式（backend）

基础路由由前端维护，业务路由存放于后端数据库；登录后动态拉取专属路由树并自动注册；优势为权限可动态配置、无需重启服务；适用于SaaS、多租户等复杂大型项目。

### 1.3 双维度鉴权模型

行业标准生产级方案：**角色码 + 权限码**双池分离，粗细粒度互补，职责完全隔离：

|鉴权维度|数据来源|存储仓库|匹配规则|使用场景|
|---|---|---|---|---|
|角色码|用户信息接口|用户仓库|精确匹配|粗粒度身份管控（管理员/租户）|
|权限码|权限列表接口|权限仓库|前缀匹配|细粒度操作管控（按钮/接口）|

补充：系统内置超级管理员标识 `*:*:*`，持有该角色自动放行所有鉴权校验。

### 1.4 四层权限覆盖

- **路由级**：基于路由meta.authority过滤非法访问路由；

- **菜单级**：同步路由过滤逻辑，无权限路由不渲染侧边菜单；

- **页面级**：通过Hook判断权限，控制页面模块显隐；

- **按钮级**：支持组件/指令/函数三种写法，管控操作类按钮。

### 1.5 统一数据存储结构

双仓库分离存储，Vue基于Pinia、React基于Zustand，数据结构完全对齐：

#### 用户仓库（UserStore）

```typescript
interface UserState {
  userInfo: BasicUserInfo | null;
  userRoles: string[]; // 用户角色码集合
}
```

#### 权限仓库（AccessStore）

```typescript
interface AccessState {
  accessCodes: string[];     // 权限码集合
  accessMenus: MenuRecordRaw[];
  accessRoutes: RouteRecordRaw[];
  accessToken: string | null;
  isAccessChecked: boolean;  // 权限初始化状态
}
```

### 1.6 权限完整执行链路

用户登录 =&gt; 持久化Token =&gt; 路由守卫初始化 =&gt; 获取用户角色、权限码 =&gt; 写入全局Store =&gt; 根据权限模式生成可访问路由 =&gt; 渲染菜单与页面 =&gt; 组件层细粒度鉴权。

## 二、通用强制规范

### 2.1 权限码命名

统一三段式标准：**模块:资源:操作**，规避混乱命名：

### 2.2 路由豁免

登录页、404等公共页面，配置 `meta.ignoreAccess: true` 豁免权限，与authority互斥：

```typescript
{ path: "/login", meta: { ignoreAccess: true } }
```

### 2.3 权限模式切换

```typescript
updatePreferences({ app: { accessMode: "frontend" | "backend" } });
```

## 三、Vue3 生产级落地

### 3.1 目录结构

### 3.2 路由权限配置

```typescript
{
  path: "/permission",
  meta: { authority: ["sys:platform_admin", "sys:tenant_manager"] },
  children: [{
    path: "codes",
    meta: { authority: ["sys:platform_admin"] }
  }]
}
```

### 3.3 按钮鉴权三种方案

#### 1）权限组件

```vue
<AccessControl :codes="['sys:user:create']"><el-button>新增</el-button></AccessControl>
```

#### 2）权限指令（推荐）

```vue
<el-button v-access="'sys:user:create'">新增</el-button>
```

#### 3）编程式Hook

```typescript
const { hasAccess, hasAccessByCodes } = useAccess();
const canCreate = hasAccess(['sys:user:create']);
```

### 3.4 Pro组件适配

内置Pro工具栏/单元格组件原生支持auth权限字段：

```typescript
toolbar: [{ name: "add", text: "新增", auth: "sys:user:create" }]
```

## 四、React 生产级落地

### 4.1 目录结构

### 4.2 路由权限配置

配置规则与Vue完全一致：

```typescript
{
  path: "permission",
  meta: { authority: ["sys:platform_admin"] }
}
```

### 4.3 按钮鉴权三种方案

#### 1）Hook + 条件渲染（推荐）

```tsx
const { hasAccessByCodes } = useAccess();
{hasAccessByCodes(['sys:user:create']) && <Button>新增</Button>}
```

#### 2）AccessControl 组件

```tsx
<AccessControl codes={['sys:user:delete']} fallback=<span>无权限</span>><Button>删除</Button></AccessControl>
```

#### 3）静态函数（非组件）

```typescript
import { getAccessStatic } from '@/core/access';
if(getAccessStatic().hasAccessByCodes(['sys:user:create'])){}
```

## 五、工程化最佳实践

- 路由：业务路由配置authority，公共页面统一开启ignoreAccess；

- 按钮：权限标识严格遵循三段式命名，禁止业务内硬编码权限；

- 与逻辑：内置API默认或逻辑，多权限同时校验需手动叠加判断；

- 安全：前端仅管控UI展示，所有接口必须后端二次鉴权。

## 六、常见问题FAQ

- **权限调试**：直接打印UserStore、AccessStore，查看userRoles与accessCodes；

- **权限刷新**：调用 `useAuth().getUserPermissionCodes()` 重新拉取权限；

- **刷新丢失**：权限不做持久化属于安全设计，路由守卫自动重新初始化；

- **安全边界**：前端权限无法替代后端，仅用于优化用户交互。

## 七、写在最后

中后台通用模块的底层架构具备框架无关性，权限、字典、表单等能力，Vue与React可实现一套内核、双端落地。跳出API表层调用，掌握通用工程化架构，才是前端进阶的核心方向。

本文完整架构与源码，均基于开源项目 **GoWind Admin（风行）** 提炼。该项目为Golang全栈企业级脚手架，包含Vue3 Vben、Vue3 Element、React Antd三大前端版本，内置多租户、完整权限体系、系统监控、任务调度等生产级能力。

完整源码可前往仓库查阅：

- GitHub：<https://github.com/tx7do/go-wind-admin>
- Gitee：<https://gitee.com/tx7do/go-wind-admin>
