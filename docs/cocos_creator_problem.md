# Cocos Creator问题集

## 小程序真机无法显示ttf字体

根据论坛里面说的是，主要的原因是因为字体的`font-family`名字里面带有空格。

需要使用字体修改工具[High-Logic FontCreator](https://www.high-logic.com/font-editor/fontcreator)来修改`font-family`名，修改之后，确实生效了。

1. 打开`FontCreator`，将`ttf文件`拖到FontCreator打开。
2. 菜单项选择：`Font` -> `Properties`，打开`Font Properties`弹窗。
3. 在弹窗里面看到有几个子标签页，其中Identification标签页里面的 Font Family即为字体的英文名，自行修改成自己需要的值。
4. 在Custom标签页里面，可以看到列表里面的第一列是语言ID，第二列是Name ID，简体中文系统上，找到行 `Chinese-People's Republic of China  Font Family`，
5. 繁体中文或者其他语言的系统下，应该是修改对应的行，没有的也可以Add添加新的行，这个我没有测试，猜测是这样。
6. 修改完毕后点击OK保存。
7. 菜单项选择：`File` -> `Export Font As...` -> `Export as Desktop Font(ttf/otf)`，弹出`Export as Desktop Font(ttf/otf)`窗口。
8. 在弹出窗口中将Outline Format项，通过下拉选择TrueType，不建议选CFF（测试时这个选项可能Identification标签页里面字体名不生效）。
9. 底部三个按钮点击`Export`即可。最终保存文件窗口自己选择文件格式。

## Failed to `new Role()` under the hood, TypeError: Cannot read property 'ins' of undefined

这是循环引用导致的问题。

当前类里面引用了另外一个ts文件里面的一个enum类型定义，另外一个ts文件里面的类又引用了当前类。

这个事儿，还挺好办的，只要把依赖的那个enum单独提取出来一个ts文件，然后import就可以了，问题解决。

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

## 参考资料

- [CocosCreator微信小游戏真机ttf字体不能正常显示](https://blog.asroads.com/post/339e6f6c.html)
- [微信小游戏真机 TTF 字体无效](https://forum.cocos.org/t/topic/145453)
- [微信小游戏 ttf字体 无效](https://forum.cocos.org/t/topic/148371)
- [修改TTF文件或者otf文件或者woff文件内的字体名称](https://cloud.tencent.com/developer/article/1758463)
- [Cocos Creator 小游戏首屏加速显示](https://blog.asroads.com/post/c50519e6.html)
- [微信小游戏的启动性能优化之首屏渲染](https://developers.weixin.qq.com/community/minigame/article/doc/000c86f5ee81b8c05b2bc9cc650013)
- [cocos creator 3.6.x 版本H5下 启动页做进度条加载](https://juejin.cn/post/7219272135817723965)
