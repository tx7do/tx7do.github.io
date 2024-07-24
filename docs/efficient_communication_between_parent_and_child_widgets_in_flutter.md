# Flutter中父子Widget之间如何进行高效通信

Flutter 的 widget系统 允许 父widget 和 子widget 之间无缝通信。了解如何双向调用方法可以显著增强应用的架构和性能。在本文中，我们将探讨如何从 父widget 调用 子widget 的方法，反之亦然。

## 从父部件调用子部件的方法

在 Flutter 中，可以使用属于子`State`类型的全局键`GlobalKey`来从父级调用子Widget中定义的方法。

例如：假设我们有一个名为`ChildWidget`的子窗口小部件

```dart
class ChildWidget extends StatefulWidget {
  const ChildWidget({super.key});

  @override
  State<ChildWidget> createState() => ChildWidgetState();
}

class ChildWidgetState extends State<ChildWidget> {
  int value = 0;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 10,
      child: Container(
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: Colors.green,
        ),
        child: Column(
          children: [
            const Text(
              "Child Widget",
              style: DemoTextStyle.headline1,
            ),
            ElevatedButton(onPressed: () {}, child: const Text("Call Parent")),
            Center(
              child: Text(
                'Child value:  $value',
                style: DemoTextStyle.copyWith(
                    fontSize: 18, fontWeight: FontWeight.normal),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void changeValue() {
    setState(() {
      value++;
    });
  }

  void changeValueDynamic(int val) {
    setState(() {
      value = val;
    });
  }
}
```

这是一个基本的`StatefulWidget`（有状态Widget），但这里最需要注意的是状态的名称。如您所见，`ChildWidgetState`前面没有下划线 (_) （通常有，这意味着Private）。

```dart
class ChildWidgetState extends State<ChildWidget> {...
```

这样我们就可以在我们的父Widget中引用这个类。

现在让我们看一下父窗口小部件`ParentWidget`，我们为 `ChildWidgetState` 创建一个键(Key)：

```dart
class ParentWidget extends StatefulWidget {const ParentWidget({super.key});

  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  final GlobalKey<ChildWidgetState> _childKey = GlobalKey<ChildWidgetState>();
  String parentText = "Parent Text";

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        title: const Text("Demo"),
      ),
      body: SizedBox(
        height: size.height,
        width: size.width,
        child: Stack(
          children: [
            Container(
              width: size.width,
              color: Colors.blue,
              child: Center(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Parent Widget",
                    style: DemoTextStyle.copyWith(
                        fontSize: 20, color: Colors.black),
                  ),
                  ElevatedButton(
                      onPressed: () {
                        _childKey.currentState?.changeValue();
                      },
                      child: const Text("Call Child Function")),
                  Text(
                    'Parent data: $parentText',
                    style: DemoTextStyle.copyWith(
                        fontSize: 18, fontWeight: FontWeight.normal),
                  ),
                ],
              )),
            ),
            ChildWidget(
              key: _childKey,
            )
          ],
        ),
      ),
    );
  }

  void changeParentData(String text) {
    setState(() {
      parentText = text;
    });
  }
}
```

定义部分：

```dart
final GlobalKey<ChildWidgetState> _childKey = GlobalKey<ChildWidgetState>();
```

我们使用`_childKey`来调用子窗口小部件内的方法。如上所述，`ChildWidgetState`前没有下划线 (_) 的原因是，该类变为公共类，并且可以在`ParentWidget`内访问。如果名称为`_ChildWidgetState`，则该状态将无法在`ParentWidget`内访问。

现在`_childKey`已经初始化，接下来就很简单了。通过以下方式调用 `ChildWidget` 中的方法：

```dart
_childKey.currentState?.changeValue();
```

效果：

![](/assets/images/flutter/flutter_parent_widget_call_child_widget.gif)

如果需要向子方法传递参数怎么办？

非常简单；只需定义一个接受参数的方法：

```dart
void changeValueDynamic(dynamic val) {setState(() {
    value = val;
  });
}
```

并从父窗口小部件调用它，如下所示：

```dart
_childKey.currentState?.changeValueDynamic(yourValue);
```

效果：

![](/assets/images/flutter/flutter_parent_widget_call_child_widget_parameter.gif)

## 从子窗口小部件调用父方法

从子部件调用父部件的方法相当简单。我们只需将方法作为参数传递到子部件中即可。让我们看看`ChildWidgetTwo`，它接受两种类型的方法作为参数。

- 函数（String）：这是调用以字符串作为参数的方法。

- VoidCallback：这是一个简单的 void 函数，不需要任何参数。

```dart
class ChildWidgetTwo extends StatefulWidget {final Function(String) callBackFunction;
  final VoidCallback voidCallback;
  const ChildWidgetTwo(
      {super.key, required this.voidCallback, required this.callBackFunction});
  @override
  State<ChildWidgetTwo> createState() => _ChildWidgetTwoState();
}

class _ChildWidgetTwoState extends State<ChildWidgetTwo> {

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.yellow,
      child: Center(
          child: Column(
        children: [
          ElevatedButton(
            onPressed: () {
              widget.callBackFunction("Function with parameter");
            },
            child: const Text("Callback function"),
          ),
          const SizedBox(
            height: 10,
          ),
          ElevatedButton(
            onPressed: () {
              widget.voidCallback();
            },
            child: const Text("Void callback"),
          )
        ],
      )),
    );
  }
}
```

现在我们只需将函数传递给`ParentWidget`内的子窗口小部件，如下所示：

```dart
ChildWidgetTwo(
              callBackFunction: changeParentData,
              voidCallback: changeParentData2,
            )
          ],
        ),
      ),
    );
  }

  void changeParentData(String text) {
    setState(() {
      parentText = text;
    });
  }
  void changeParentData2() {
    setState(() {
      parentText = "Void Callback";
    });
  }
}
```

![](/assets/images/flutter/flutter_child_widget_call_parent_widget.gif.gif)

## 翻译自

[Efficient Communication Between Parent and Child Widgets in Flutter](https://medium.com/@paalu.heing/efficient-communication-between-parent-and-child-widgets-in-flutter-c551f8e5dbeb)
