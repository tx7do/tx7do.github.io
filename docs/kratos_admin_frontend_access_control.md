# 开箱即用的GO后台管理系统 Kratos Admin - 前端权限控制

前端的权限归属于：功能权限。根据功能控制的细粒度，前端的权限主要分为两个部分：

1. 页面级权限；
2. 按钮级权限。

## 页面级权限

页面级权限，我们可以通过菜单隐藏、路由拦截来实现。在实际应用中，从而我们就可以控制用户能否进入 “财务报表”“人事管理” 等页面。

路由的控制方式分为两种方式：

1. 后端控制；
2. 前端控制。

### 后端访问控制

* **实现原理**: 通过调用后端的接口，获取到一个遵循一定的数据结构的路由配置数据，前端拿到路由配置数据后，根据需要将该数据处理为可识别的结构，再通过 `router.addRoute` 添加到路由实例，实现页面权限的动态控制。

* **缺点**: 后端需要提供符合规范的数据，前端相应的还需要需要处理数据，开发维护起来比较复杂，所以它也只适合权限较为复杂的系统。

前端启用办法，修改`.env`配置文件`VITE_ROUTER_ACCESS_MODE`的值为`backend`：

```env
# 路由的访问模式：frontend，backend
VITE_ROUTER_ACCESS_MODE=backend
```

前端的核心代码在`src/router/access.ts`：

```typescript
async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  ...

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      const data = (await defRouterService.ListRoute({})) ?? [];
      return data.items ?? [];
    },
    ...
  });
}
```

### 前端访问控制

* **实现原理**: 在前端固定写死路由的权限，指定路由有哪些权限可以查看。只初始化通用的路由，需要权限才能访问的路由没有被加入路由表内。在登录后或者其他方式获取用户角色后，通过角色去遍历路由表，获取该角色可以访问的路由表，生成路由表，再通过 `router.addRoute` 添加到路由实例，实现权限的过滤。

* **缺点**: 权限相对不自由，如果后台改动角色，前台也需要跟着改动，并且改动的工作量还不小。适合角色较固定的系统。

前端启用办法，修改`.env`配置文件`VITE_ROUTER_ACCESS_MODE`的值为`frontend`：

```env
# 路由的访问模式：frontend，backend
VITE_ROUTER_ACCESS_MODE=frontend
```

然后，我们需要在本地的固定路由里面写入`authority`字段，里边填写的是后端配置的角色码，如果该字段不填写，则为所有人可见，如果为字段数据为空，则为所有人不可见：

```typescript
 {
    meta: {
      authority: ['super'],
    },
},
```

根据`src/store/auth`里面的代码显示：

```typescript
// 设置登录用户信息，需要确保 userInfo.roles 是一个数组，且包含路由表中的权限
// 例如：userInfo.roles=['super', 'admin']
authStore.setUserInfo(userInfo);
```

所以，我们需要在用户的登陆数据里面加入一个`roles`的字段：

```protobuf
message User {
    repeated string roles;
}
```

并且读取角色表里面的角色值，传递给前端。

#### 菜单可见，但禁止访问

有时候，我们需要菜单可见，但是禁止访问，可以通过下面的方式实现，设置 `menuVisibleWithForbidden` 为 `true`，此时菜单可见，但是禁止访问，会跳转403页面。

```typescript
{
    meta: {
      menuVisibleWithForbidden: true,
    },
},
```

## 按钮级权限

在某些情况下，我们需要对按钮进行最为细粒度的控制，我们可以借助 `权限码（Permission Code）`或者 `角色码（Role Code）`来控制按钮的显示。

### 权限码

权限码为接口返回的权限码，通过权限码来判断按钮是否显示，逻辑在`src/store/auth`下：

```typescript
// 获取用户信息并存储到 accessStore 中
const [fetchUserInfoResult, accessCodes] = await Promise.all([
    fetchUserInfo(),
    fetchAccessCodes(),
]);

userInfo = fetchUserInfoResult;

userStore.setUserInfo(userInfo);
accessStore.setAccessCodes(accessCodes.codes);

/**
 * 拉取用户信息
 */
async function fetchUserInfo() {
    return (await defAuthnService.GetMe({ id: 0 })) as UserInfo;
}

/**
 * 获取用户权限码
 */
async function fetchAccessCodes() {
    return await defRouterService.ListPermissionCode({});
}
```

我们只需要调用`fetchAccessCodes`方法便可以拥有权限码，权限码返回的数据结构为字符串数组，例如：`['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010']`。

有了权限码，就可以使用 `@vben/access` 提供的`AccessControl`组件及API来进行按钮的显示与隐藏。

#### 组件方式

```typescript
<script lang="ts" setup>
import { AccessControl } from '@vben/access';
</script>

<template>
  <!-- 需要指明 type="code" -->
  <AccessControl :codes="['super']" type="code">
    <Button> Super 权限可见 ["super"] </Button>
  </AccessControl>
  <AccessControl :codes="['admin']" type="code">
    <Button> Admin 权限可见 ["admin"] </Button>
  </AccessControl>
</template>
```

#### API方式

```typescript
<script lang="ts" setup>
import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();
</script>

<template>
  <Button v-if="hasAccessByCodes(['super'])">
    Super 权限可见 ["super"]
  </Button>
  <Button v-if="hasAccessByCodes(['admin'])">
    Admin 权限可见 ["admin"]
  </Button>
</template>
```

#### 指令方式

指令支持绑定单个或多个权限码。单个时可以直接传入字符串或数组中包含一个权限码，多个权限码则传入数组。

```typescript
<template>
  <Button class="mr-4" v-access:code="'super'">
    Super 权限可见 'super'
  </Button>
  <Button class="mr-4" v-access:code="['admin']">
    Admin 权限可见 ["admin"]
  </Button>
</template>
```

### 角色码

角色码所依赖的数据是：`useUserStore`里的`userRoles`：

```typescript
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();

function hasAccessByRoles(roles: string[]) {
  const userRoleSet = new Set(userStore.userRoles);
  const intersection = roles.filter((item) => userRoleSet.has(item));
  return intersection.length > 0;
}
```

它是通过调用下面这个方法拉取到角色码：

```typescript
async function fetchUserInfo() {
    return (await defAuthnService.GetMe({ id: 0 })) as UserInfo;
}
```

再调用下面的代码保存到本地：

```typescript
// 设置角色信息
const roles = userInfo?.roles ?? [];
this.setUserRoles(roles);
```

#### 组件方式

```typescript
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

#### API方式

```typescript
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

#### 指令方式

指令支持绑定单个或多个角色。单个时可以直接传入字符串或数组中包含一个角色，多个角色均可访问则传入数组。

```typescript
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

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)

## 参考资料

* [Vben Admin 权限](https://doc.vben.pro/guide/in-depth/access.html)
