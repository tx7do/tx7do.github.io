# 开箱即用的 GoWind Admin｜风行，企业级前后端一体中后台框架：前端权限控制

在企业级中后台系统中，前端权限控制是保障数据安全、规范用户操作边界的核心能力。风行·GoWind Admin 前端权限控制核心聚焦于**功能权限管控**，根据控制粒度的不同，分为「页面级权限」和「按钮级权限」两大模块，覆盖从“页面访问”到“操作执行”的全链路权限管控需求。本文将详细拆解两种权限的实现原理、启用方式、核心代码及最佳实践，助力开发者快速落地权限管控方案。

## 一、页面级权限：管控页面访问边界

页面级权限的核心目标是控制用户能否访问特定页面，主要通过「菜单隐藏」和「路由拦截」两种手段实现——未授权用户既无法在侧边栏看到目标菜单，也无法通过直接输入URL跳过菜单访问页面，进而实现对用户访问“财务报表”“人事管理”等核心页面的精准管控。

根据路由配置的管控主体不同，页面级权限分为「后端控制」和「前端控制」两种模式，适配不同复杂度的权限场景，开发者可根据项目需求灵活选择。

### 1.1 后端控制模式（推荐复杂权限场景）

#### 核心原理

采用“后端动态下发路由”的方式实现权限管控：前端启动时仅初始化通用路由（如登录页、403页），登录后通过调用后端接口获取「符合当前用户权限的路由配置数据」，前端将该数据转换为框架可识别的路由结构后，通过 `router.addRoute` 动态添加到路由实例中，最终实现页面权限的动态适配。

#### 适用场景与优缺点

- **适用场景**：企业级复杂权限系统（如多租户、多角色动态配置、权限频繁变更）、需要统一管控路由配置的场景。
- **优点**：权限配置完全由后端统一管控，前端无需修改代码即可适配权限变更，扩展性强、维护成本低。
- **缺点**：需前后端协同定义路由数据格式，前端需开发路由数据转换逻辑，初期开发成本略高。

#### 启用步骤与核心配置

##### 1. 修改环境变量：

编辑前端项目根目录的`.env` 配置文件，将 `VITE_ROUTER_ACCESS_MODE` 的值设置为 `backend`，启用后端控制模式：

```typescript
# 路由的访问模式：frontend（前端控制），backend（后端控制）
VITE_ROUTER_ACCESS_MODE=backend
```

##### 2.核心逻辑代码：

后端路由的获取与动态生成逻辑封装在 `src/router/access.ts` 文件中，核心代码如下：

```typescript
async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  // 其他初始化逻辑...

  // 核心：根据访问模式生成可访问路由，后端模式下通过接口拉取路由数据
  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    // 异步拉取后端路由配置的方法
    fetchMenuListAsync: async () => {
      // 加载中提示
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      // 调用后端接口获取路由数据（defRouterService为后端生成的API客户端）
      const data = (await defRouterService.ListRoute({})) ?? [];
      // 返回路由列表（需与后端约定数据结构：items为路由数组）
      return data.items ?? [];
    },
    // 其他配置...
  });
}
```

###### 关键注意事项

1. 前后端数据格式约定：需确保后端返回的路由数据包含 `path`（路由路径）、`name`（路由名称）、`meta`（菜单信息/权限标识）等核心字段，否则前端无法正常转换为可用路由。
2. 异常处理：需补充接口请求失败的降级逻辑（如返回空路由列表，引导用户重新登录），避免因后端服务异常导致前端路由加载失败。

### 1.2 前端控制模式（适配简单固定角色场景）

#### 核心原理
采用“前端预定义路由权限”的方式实现管控：前端代码中固定定义所有路由，并为需要权限管控的路由配置 `authority` 字段（指定可访问的角色码）；系统初始化时仅加载通用路由，用户登录后获取其角色信息，通过角色匹配筛选出可访问的路由，再通过 `router.addRoute` 动态添加到路由实例中，实现权限过滤。

#### 适用场景与优缺点

- **适用场景**：角色体系固定（如仅超级管理员、普通管理员、用户三类角色）、权限变更频率低的简单系统。
- **优点**：前后端耦合度低，前端独立管控权限，开发简单、调试便捷。
- **缺点**：权限变更需修改前端代码并重新部署，扩展性差；角色数量增多时，路由权限配置维护成本会显著上升。

#### 启用步骤与核心配置

##### 1. 修改环境变量：

编辑 `.env` 配置文件，将 `VITE_ROUTER_ACCESS_MODE` 的值设置为 `frontend`，启用前端控制模式：

```typescript
# 路由的访问模式：frontend（前端控制），backend（后端控制）
VITE_ROUTER_ACCESS_MODE=frontend
```

##### 2. 配置路由权限标识：

在前端预定义的路由数组中，为需要权限管控的路由添加 `meta.authority` 字段，值为后端约定的角色码数组（如`['super']` 表示仅超级管理员可访问）：

````typescript
// 示例：系统管理模块路由配置（src/router/routes/system.ts）
const system: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: Layout, // 布局组件
    meta: {
      title: '系统管理', // 菜单名称
      authority: ['super', 'admin'], // 可访问角色：超级管理员、普通管理员
      icon: 'icon-settings', // 菜单图标
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        meta: {
          title: '用户管理',
          authority: ['super'], // 仅超级管理员可访问
        },
      },
    ],
  },
];
````

**权限规则说明**：未配置 `authority` 字段：所有用户可见（如首页、帮助中心）。

##### 3. authority 为空数组（[]）：

所有用户不可见（如内部测试页面）。

##### 4. authority 为角色码数组：

仅数组内角色的用户可见。

##### 5. 用户角色数据适配：

前端权限筛选依赖用户角色信息，需确保后端返回的用户数据中包含 roles 字段（角色码列表数组），并在前端存储：

1. Protobuf 定义（后端返回用户数据结构）
  ```protobuf
  message User {
      repeated string roles = 1; // 角色码列表，如 ["super", "admin"]
  }
  ```
2. 前端存储角色信息（src/store/auth.ts）
  ```typescript
  // 设置登录用户信息，确保 userInfo.roles 为角色码数组
  authStore.setUserInfo(userInfo);
  // 后续路由筛选会自动读取 userStore.userRoles 进行匹配
  ```

#### 特殊场景：菜单可见但禁止访问

部分业务场景下需实现“菜单可见但点击后跳转403无权限页面”（如引导普通用户申请权限），可通过配置 `meta.menuVisibleWithForbidden: true` 实现：

```typescript
const system: RouteRecordRaw[] = [
  {
    path: '/report',
    name: 'Report',
    meta: {
      title: '财务报表',
      authority: ['super'], // 仅超级管理员可访问
      menuVisibleWithForbidden: true, // 未授权用户可见菜单，点击跳转403
    },
  },
];
```

## 二、按钮级权限：管控操作执行权限

按钮级权限是更细粒度的功能权限管控，用于控制用户能否执行特定操作（如“新增用户”“删除订单”“导出报表”）。GoWind Admin 支持通过「权限码（Permission Code）」和「角色码（Role Code）」两种维度实现按钮级权限控制，适配不同的权限管控粒度需求。

核心依赖 `@vben/access` 权限组件库，提供「组件方式」「API方式」「指令方式」三种使用形态，开发者可根据组件复用性、代码简洁性需求灵活选择。

### 2.1 权限码控制（推荐：最小粒度权限管控）

权限码是系统中最小粒度的权限标识，用于唯一标记单个操作权限（如 `user:add` 表示新增用户、`order:delete` 表示删除订单）。权限码由后端接口返回，前端通过判断当前用户是否拥有目标权限码，控制按钮的显示/隐藏。

#### 核心流程

1. 用户登录后，前端调用`defRouterService.ListPermissionCode({})` 接口拉取当前用户的权限码列表。
2. 前端将权限码列表存储到`accessStore` 中，供全局权限判断使用。
3. 通过 `@vben/access` 提供的能力，基于权限码判断按钮是否显示。

#### 核心代码（权限码获取与存储）

```typescript
// src/store/auth.ts
/**
 * 登录后初始化用户信息与权限码
 */
async function initAuthData() {
  // 并行拉取用户信息和权限码
  const [fetchUserInfoResult, accessCodes] = await Promise.all([
    fetchUserInfo(), // 拉取用户基础信息
    fetchAccessCodes(), // 拉取权限码列表
  ]);

  const userInfo = fetchUserInfoResult;
  // 存储用户信息到状态管理
  userStore.setUserInfo(userInfo);
  // 存储权限码到状态管理（accessCodes.codes 为权限码数组，如 ["user:add", "order:edit"]）
  accessStore.setAccessCodes(accessCodes.codes);
}

/**
 * 拉取用户基础信息
 */
async function fetchUserInfo() {
  return (await defAuthnService.GetMe({ id: 0 })) as UserInfo;
}

/**
 * 拉取用户权限码列表
 */
async function fetchAccessCodes() {
  return await defRouterService.ListPermissionCode({});
}
```

#### 三种使用方式

#### 方式1：组件方式（推荐，适合单个/少量按钮）

使用 `AccessControl` 组件包裹按钮，通过 `codes` 属性指定所需权限码，`type="code"` 表示基于权限码判断：

```typescript
// src/views/system/user/index.vue
<script lang="ts" setup>
import { AccessControl } from '@vben/access';
</script>

<template>
  <!-- 需要指明 type="code" -->
  <AccessControl :codes="['product:add']" type="code">
    <Button> 添加商品 ["product:add"] </Button>
  </AccessControl>
  <AccessControl :codes="['product:edit']" type="code">
    <Button> 编辑商品 ["product:edit"] </Button>
  </AccessControl>
</template>
```

#### 方式2：API方式（适合复杂逻辑判断场景）

通过 `useAccess`钩子获取 `hasAccessByCodes` 方法，在模板中通过`v-if` 控制按钮显示，支持结合其他业务逻辑判断：

```typescript
// src/views/system/user/index.vue
<script lang="ts" setup>
import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();
</script>

<template>
  <Button v-if="hasAccessByCodes(['product:add'])">
    添加商品 ["product:add"]
  </Button>
  <Button v-if="hasAccessByCodes(['product:edit'])">
    编辑商品 ["product:edit"]
  </Button>
</template>
```

#### 方式3：指令方式（适合批量按钮权限控制，简洁高效）

使用`v-access:code` 指令直接绑定权限码，支持单个权限码（字符串）或多个权限码（数组）：

```typescript
// src/views/system/user/index.vue
<template>
  <Button class="mr-4" v-access:code="'product:add'">
    添加商品 ["product:add"]
  </Button>
  <Button class="mr-4" v-access:code="['product:edit']">
    编辑商品 ["product:edit"]
  </Button>
</template>
```

### 2.2 角色码控制（适配粗粒度操作管控）

角色码控制基于用户所属角色实现按钮权限管控，适用于对操作权限要求不精细的场景（如“所有管理员均可查看操作日志”）。核心依赖 `useUserStore` 中存储的`userRoles` 角色码列表，通过判断用户角色是否在目标角色范围内，控制按钮显示。

#### 核心逻辑（角色码获取与判断）

```typescript
// src/store/user.ts
import { useUserStore } from '@vben/stores';

/**
 * 角色权限判断：判断用户是否拥有目标角色中的任一角色
 * @param roles 目标角色码列表
 */
function hasAccessByRoles(roles: string[]) {
  const userStore = useUserStore();
  const userRoleSet = new Set(userStore.userRoles); // 用户当前角色集合
  // 计算目标角色与用户角色的交集，有交集则拥有权限
  const intersection = roles.filter(item => userRoleSet.has(item));
  return intersection.length > 0;
}

// 角色码来源：用户登录时从后端拉取并存储
async function fetchUserInfo() {
  const userInfo = await defAuthnService.GetMe({ id: 0 });
  // 存储角色信息到状态管理
  const roles = userInfo?.roles ?? [];
  userStore.setUserRoles(roles);
  return userInfo;
}
```

#### 三种使用方式

##### 方式1：组件方式

使用 `AccessControl` 组件，通过 `type="role"` 指定基于角色码判断：

```typescript
// src/views/system/log/index.vue
<script lang="ts" setup>
import { AccessControl } from '@vben/access';
</script>

<template>
  <AccessControl :codes="['super']" type="role">
    <Button> Super 角色可见 </Button>
  </AccessControl>
  <AccessControl :codes="['admin']" type="role">
    <Button> Admin 角色可见 </Button>
  </AccessControl>
  <AccessControl :codes="['user']" type="role">
    <Button> User 角色可见 </Button>
  </AccessControl>
  <AccessControl :codes="['super', 'admin']" type="role">
    <Button> Super & Admin 角色可见 </Button>
  </AccessControl>
</template>
```

##### 方式2：API方式

通过 `useAccess` 钩子获取 `hasAccessByRoles` 方法，结合 `v-if` 控制显示：

```typescript
// src/views/system/log/index.vue
<script lang="ts" setup>
import { useAccess } from '@vben/access';

const { hasAccessByRoles } = useAccess();
</script>

<template>
  <Button v-if="hasAccessByRoles(['super'])"> Super 账号可见 </Button>
  <Button v-if="hasAccessByRoles(['admin'])"> Admin 账号可见 </Button>
  <Button v-if="hasAccessByRoles(['user'])"> User 账号可见 </Button>
  <Button v-if="hasAccessByRoles(['super', 'admin'])">
    Super & Admin 账号可见
  </Button>
</template>
```

##### 方式3：指令方式

使用 `v-access:role` 指令直接绑定角色码，支持单个或多个角色：

```typescript
// src/views/system/log/index.vue
<template>
  <Button class="mr-4" v-access:role="'super'"> Super 角色可见 </Button>
  <Button class="mr-4" v-access:role="['super']"> Super 角色可见 </Button>
  <Button class="mr-4" v-access:role="['admin']"> Admin 角色可见 </Button>
  <Button class="mr-4" v-access:role="['user']"> User 角色可见 </Button>
  <Button class="mr-4" v-access:role="['super', 'admin']">
    Super & Admin 角色可见
  </Button>
</template>
```

## 三、权限控制最佳实践

### 3.1 控制方式选择建议

| 管控场景  | 推荐控制方式                   | 理由                                         |
|------|------------------------|----------------------------------------------------|
| 复杂多租户、动态角色权限   | 页面级：后端控制；按钮级：权限码控制 | 后端统一管控权限配置，适配频繁变更，减少前后端协同成本                    |
| 简单固定角色（3类以内）、权限变更少  |        页面级：前端控制；按钮级：角色码控制                | 前端独立开发调试，降低初期开发成本，适配简单场景             |
| 核心操作（如删除、导出）  |          权限码控制 + 后端接口二次校验              | 前端控制仅隐藏按钮，后端接口校验防止恶意请求，双重保障安全     |

### 3.2 核心注意事项

- **前端权限仅为“显示控制”，不可替代后端校验**：前端可通过隐藏菜单/按钮阻止普通用户操作，但恶意用户可能通过伪造请求绕过前端控制。因此，所有权限相关的接口必须在后端进行二次校验（如验证用户是否拥有操作权限码），确保数据安全。
- **权限数据缓存与刷新**：用户角色/权限变更后，需及时刷新前端权限状态（如重新拉取权限码、重新生成路由），避免权限变更不生效。
- **异常降级处理**：后端路由/权限码接口请求失败时，需添加降级逻辑（如跳转403页、提示“权限加载失败，请重试”），提升用户体验。

## 四、项目源码与参考资料

### 4.1 项目源码

- Gitee（国内访问速度快）：<https://gitee.com/tx7do/go-wind-admin>
- GitHub：<https://github.com/tx7do/go-wind-admin>

### 4.2 参考资料

- Vben Admin 权限系统官方文档：<https://doc.vben.pro/guide/in-depth/access.html>
- GoWind Admin 后端权限接口文档：<http://localhost:7788/docs/openapi.yaml>（本地部署后访问）
