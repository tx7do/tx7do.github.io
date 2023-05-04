# 使用Dexie操作前端数据库IndexedDB

Dexie.js对前端数据库IndexedDB的API进行了一个封装。

为什么需要IndexedDB？因为其他方案存储不了大数据：

1. Cookie 不超过4KB;
2. LocalStorage 2.5MB 到 10MB 之间
3. SessionStorage 2.5MB 到 10MB 之间。
4. IndexedDB 不少于 250MB，可以使用本地磁盘空间50%。

## 安装Dexie

```bash
pnpm add dexie
```

## 创建数据库（DataBase）

```typescript
import Dexie from 'dexie'

const db = new Dexie('userDB');
```

创建了一个名为`userDB`的一个数据库(DataBase)，如果不存在则创建，如果存在则打开。

## 创建表（Table）

```typescript
import type { Table } from 'dexie'

db.version(1).stores({
  users: '++id, userName',
});

let users: Table<StoreLevelData>

users = db.table('users')
```

1. 创建了一个名为`users`的表(Table)；
2. `users`表具有一个名为`id`的自增长主键字段，以及一个名为`userName`的索引。

## 增

```typescript
db.users.add({
  userName: 'zhangsan'
})
```

## 改

```typescript
db.users.put({
  id: 1,
  userName: 'zhangsan'
})
```

相当于后端数据库里面的`upsert`，即：不存在则新增，存在则修改。

## 删

```typescript
db.users.delete(1)
```

## 查

可以简单的通过主键来查询：

```typescript
db.users.get(1).then(res=>console.log(res))
```

或者通过条件来查询：

```typescript
db.users.where("userName")
db.users.where({userName: "zhangsan"})
```

查询第一条：

```typescript
db.users.orderBy('id').first()
```

查询最后一条：

```typescript
db.users.orderBy('id').last()
```

查询表的行数：

```typescript
db.users.count()
```

分页查询：

```typescript
db.users.orderBy('id').reverse().offset(0).limit(100).toArray()
```

## Typescript简单封装

```typescript
import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface StoreUserData {
  id?: number
  userName: string
}

export class UserDataBase extends Dexie {
  users!: Table<StoreUserData>

  localVersions = 1

  constructor() {
    super('UserDataBase')

    this.version(this.localVersions).stores({
      users: '++id, userName'
    })

    this.users = this.table('users')
  }
}

export const usersDB = new UserDataBase()
```

## 怎么查看IndexedDB的数据？

打开浏览器的`开发者工具`：

应用 -> 存储 -> IndexedDB

基本的查看，修改功能都具备有。

## 参考资料

- [浏览器数据库 IndexedDB 入门教程](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)
- [Efficient In-Browser Storage with Dexie.js and Sveltekit](https://medium.com/codex/efficient-in-browser-storage-with-dexie-js-and-sveltekit-ec8bd37c6ead)
