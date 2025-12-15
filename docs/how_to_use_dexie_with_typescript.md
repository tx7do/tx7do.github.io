# 使用Dexie操作前端数据库IndexedDB 教程

Dexie.js 是对前端本地数据库 IndexedDB 的 API 进行封装的轻量级库，它简化了 IndexedDB 复杂的原生操作，提供了更简洁、直观的语法，便于开发者快速实现前端本地数据的持久化存储。

## 一、为什么选择 IndexedDB？

前端常见的本地存储方案（Cookie、LocalStorage、SessionStorage）均存在存储容量限制，无法满足大数据量的存储需求。IndexedDB 作为浏览器原生的本地数据库，具备大容量存储优势，具体对比如下：

- Cookie：存储容量不超过 4KB，主要用于存储会话标识等少量信息；
- LocalStorage：存储容量介于 2.5MB ~ 10MB 之间，仅支持字符串存储；
- SessionStorage：存储容量与 LocalStorage 相当，但仅在当前会话有效，页面关闭后数据丢失；
- IndexedDB：存储容量不低于 250MB，支持占用本地磁盘空间的 50%，可存储大量结构化数据，支持事务、索引等数据库核心特性。

## 二、安装 Dexie

使用包管理器（pnpm、npm、yarn）快速安装 Dexie：

```shell
pnpm add dexie
```

## 三、核心操作步骤

### 3.1 创建数据库（Database）

通过 `new Dexie()` 创建数据库实例，指定数据库名称。若数据库不存在则自动创建，若已存在则直接打开。

### 3.2 创建表（Table）

通过 `version().stores()` 定义数据库版本及表结构，包括主键、索引等信息。表结构定义需与数据库版本绑定，版本升级时可同步更新表结构。

```typescript
import type { Table } from 'dexie';

// 定义表结构：版本1中创建 "users" 表
db.version(1).stores({
  users: '++id, userName', // ++id 表示自增长主键；userName 表示为该字段创建索引
});

// 获取 "users" 表实例，用于后续数据操作
let users: Table<StoreUserData>;
users = db.table('users');
```

说明：

- ++id：自增长整数主键，插入数据时无需手动指定 id，数据库会自动生成；
- userName：为该字段创建索引，可提升按 userName 查询的效率。

### 3.3 数据操作：增删改查（CRUD）

#### 3.3.1 新增数据（增）

使用 `add()` 方法插入单条数据，主键（id）会自动生成。

```typescript
// 插入一条用户数据，无需指定 id
db.users.add({
  userName: 'zhangsan'
});
```

#### 3.3.2 修改/新增数据（改）

使用 `put()` 方法实现“插入或更新”（upsert）功能：若数据不存在（根据主键判断）则新增，若已存在则覆盖修改。

```typescript
// 若 id=1 的数据存在则修改 userName，不存在则新增该数据
db.users.put({
  id: 1,
  userName: 'zhangsan'
});
```

### 3.3.3 删除数据（删）

使用 `delete()` 方法根据主键删除单条数据。

### 3.3.4 查询数据（查）

Dexie 提供了丰富的查询方法，支持按主键查询、条件查询、排序、分页等场景：

```typescript
// 1. 按主键查询单条数据
db.users.get(1).then(res => console.log('主键id=1的用户：', res));

// 2. 条件查询（两种常用方式）
// 方式1：按字段条件查询
db.users.where('userName').equals('zhangsan').toArray().then(res => console.log('用户名为zhangsan的用户：', res));
// 方式2：按对象匹配条件查询
db.users.where({ userName: 'zhangsan' }).toArray().then(res => console.log('用户名为zhangsan的用户：', res));

// 3. 查询第一条数据（按id升序）
db.users.orderBy('id').first().then(res => console.log('第一条用户数据：', res));

// 4. 查询最后一条数据（按id升序）
db.users.orderBy('id').last().then(res => console.log('最后一条用户数据：', res));

// 5. 查询表中数据总数
db.users.count().then(count => console.log('用户总数：', count));

// 6. 分页查询（按id倒序，查询前100条数据）
db.users.orderBy('id')
  .reverse() // 倒序排列（默认升序）
  .offset(0) // 偏移量，从第0条开始（即跳过前0条）
  .limit(100) // 限制查询数量，最多返回100条
  .toArray()
  .then(res => console.log('分页查询结果：', res));
```

## 四、TypeScript 封装优化

通过类封装数据库操作，结合 TypeScript 类型定义，提升代码可维护性和类型安全性：

```typescript
import type { Table } from 'dexie';
import Dexie from 'dexie';

// 定义用户数据类型接口，约束数据结构
export interface StoreUserData {
  id?: number; // 主键可选，插入时自动生成
  userName: string; // 用户名，必传字段
}

// 封装数据库类
export class UserDataBase extends Dexie {
  // 定义表实例，指定数据类型
  users!: Table<StoreUserData>;

  // 数据库版本
  private localVersions = 1;

  constructor() {
    // 调用父类构造函数，指定数据库名称
    super('UserDataBase');

    // 初始化数据库版本和表结构
    this.version(this.localVersions).stores({
      users: '++id, userName' // 与前文表结构一致
    });

    // 赋值表实例
    this.users = this.table('users');
  }
}

// 创建数据库实例，供全局使用
export const usersDB = new UserDataBase();
```

## 五、查看 IndexedDB 数据

可通过浏览器开发者工具直观查看和操作 IndexedDB 中的数据，步骤如下：

1. 打开浏览器（Chrome/Firefox/Edge 等）的开发者工具（快捷键 F12 或 Ctrl+Shift+I）；
2. 切换到「应用」（Application）面板；
3. 在左侧导航栏中找到「存储」-「IndexedDB」；
4. 展开对应数据库（如 UserDataBase）和表（如 users），即可查看表中数据，支持新增、修改、删除等操作。

## 六、参考资料

- 阮一峰. 浏览器数据库 IndexedDB 入门教程. <http://www.ruanyifeng.com/blog/2018/07/indexeddb.html>
- Efficient In-Browser Storage with Dexie.js and Sveltekit. <https://medium.com/codex/efficient-in-browser-storage-with-dexie-js-and-sveltekit-ec8bd37c6ead>
