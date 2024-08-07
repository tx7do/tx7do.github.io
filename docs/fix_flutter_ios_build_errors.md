# 修复Flutter一些iOS编译错误

## Сocoapods trunk URL couldn’t be downloaded

逐行运行此命令

```shell
gem uninstall cocoapods 
arch -x86_64 brew install cocoapods 
arch -x86_64 brew reinstall cocoapods 
cd ios 
pod cache clean --all 
pod install （如果m1 macOS 运行这个“arch -x86_64 pod install”）
pod update
```

## [!] CocoaPods did not set the base configuration of your project because your project already has a custom config set. In order for CocoaPods integration to work at all, please either set the base configurations of the target `Runner` to `Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig` or include the `Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig` in your build configuration (`Flutter/Release.xcconfig`).

1. 我们首先用Xcode打开`ios/Runner.xcworkspace`；
2. 然后选中`Project Navigator`下的`Runner`项目，再选中`PROJECT`下面的`Runner`，再然后选中`Info`；
3. 我们找到`Configurations`，把`Debug`、`Release`和`Profile`下面的`Runner/Runner`全部选为`None`;
4. 再一次运行`pod update`，警告消息。

![](/assets/images/xcode/xcode_set_base_configurations.png)

需要注意的是，如果运行了`pod update`之后，选项会被自动勾选为`Pods-Runner.debug`或者`Pods-Runner.release`，在这个选项之下，会报错：

> Command PhaseScriptExecution failed with a nonzero exit code

如果需要解决这个报错，只需要修改为`Debug`或者`Release`即可消除。



## Framework 'Pods_Runner' not found


1. 删除掉`ios`文件夹下面的`Podfile`文件；
2. 在项目的文件夹下，按顺序运行`flutter clean`和`flutter pub get`命令，它将会重新生成`Podfile`文件；
3. 在新的`Podfile`文件中的`# platform :ios, '12.0'`的版本号修改为`14.0`，并取消掉注释：`platform :ios, '14.0'`;
4. 在`ios`文件夹下运行`pod install`命令。

> 根据我实际的测试，我发现这个问题很奇怪，实际上，不需要上面步骤那么复杂，只要触发了这个编译错误，你只需要执行一次 步骤2和4即可，再编译就不会出现这个错误了。

这个时候，一切就都正常了。

我在Intel芯片的Macbook上没有问题，但是在ARM的M2芯片下碰到的这个问题。

## 参考资料

- [Fix Flutter All Pod Errors issue](https://medium.com/vector-com-mm/fix-flutter-all-pod-errors-issue-04a1e44d892e)
- [Framework 'Pods_Runner' not found](https://stackoverflow.com/questions/77304874/framework-pods-runner-not-found)
