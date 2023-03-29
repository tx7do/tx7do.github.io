# Cocos Creator遇到的一些问题

## Build Failed: Error: TypeError: Cannot read property 'sync' of undefined

Prefab损坏了，IDE个垃圾，根本定位不到，只能够恢复Prefab。

## Please specifiy a default value for “AnimalItem.ani_park_exp” at its declaration:

如果如下代码，就会报警告信息：

```typescript
@property(cc.Node)
Min: cc.Node;
```

只需要给一个初始值就可以了：

```typescript
@property(cc.Node)
Min: cc.Node = null;
```

## Failed to `new Role()` under the hood, TypeError: Cannot read property 'ins' of undefined

这是循环引用导致的问题。

当前类里面引用了另外一个ts文件里面的一个enum类型定义，另外一个ts文件里面的类又引用了当前类。

这个事儿，还挺好办的，只要把依赖的那个enum单独提取出来一个ts文件，然后import就可以了，问题解决。
