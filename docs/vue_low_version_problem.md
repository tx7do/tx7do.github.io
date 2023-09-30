# Vue低版本引起的问题

## Sass在v4.3.0版本之前使用node-sass需要原生编译libsass导致的问题

`Sass`在`v4.3.0`版本之前都是使用的`node-sass`，而`node-sass`的底层依赖 `libsass`，`libsass`是一个原生库，因此，在Windows下面需要强制用户必须安装`python2`和`Visual Studio`才能编译成功。这并不是一件很友好的事情，而且经常导致编译不成功。

`Sass`从`v4.3.0`版本开始迁移到`dart-sass`进行构建，虽然说相比使用原生的`libsass`库，`dart-sass`是一个js库，在性能会有一定的损失，但是，相比安装`libsass`库的不容易，这点性能的损失，还是可以接受的。

解决步骤：

### 1. 卸载 node-sass

```shell
npm uninstall node-sass
```

### 2. 安装 dart-sass

```shell
npm install sass sass-loader -D
```

或者

```shell
npm install --dev sass
```

### 3. 修改css

将项目中原有的 `/deep/` 替换为 `::v-deep`。

如果引用了`element-ui`，编译运行的时候会报一些兼容警告：

```bash
Deprecation Warning: $weight: Passing a number without unit % (0) is deprecated.

To preserve current behavior: $weight * 1%

More info: https://sass-lang.com/d/function-units

   ╷
31 │       color: mix($--tag-info-color, $--color-white, $fontColorWeight);
   │              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

原因是版本兼容的问题，虽然不影响最终编译，但是还是期望能够消除掉这个警告，修改sass的最低版本可以解决问题：

```json
"sass": "1.55.0",
"sass-loader": "^10.0.1",
```

然后删掉``重新`npm install`即可消除掉警告。

## 参考资料

- [node-sass换为dart-sass](https://zhuanlan.zhihu.com/p/532597359)
- [使用element-ui控制台报错:--el-tag-background-color: #{mix(](https://liuhai.work/post/426?cid=51&index=search)
