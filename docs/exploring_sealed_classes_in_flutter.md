# 探索：Flutter 中的 Sealed Class

Dart 3 在 Flutter 中引入了 密封类(Sealed Class)。如果您来自于类似 Kotlin 这样的现代编程语言，您可能已经知道它们有多么强大。如果没有，在本文结束时您将了解到关于密封类的全部内容。

> 密封类(Sealed Class)是一项强大的功能，使开发人员能够创建受限制的类层次结构。与常规类不同，密封类只能在同一文件中扩展，这使得它们成为表示有限相关类集的绝佳选择。

## 了解密封类

密封类是在关键字`sealed`之前使用修饰符声明的`class`。它充当有限类集的基类，并且其所有子类必须在与密封类相同的文件中声明。

**有限继承**：密封类限制继承层次结构，这确保了所有可能的子类在编译时都是已知的。这使得它们对于拥有一组固定类的场景特别有用。 （还记得枚举吗？）

那为什么不直接使用枚举呢？好吧，除了提供详尽的场景列表之外，密封类还提供了类的功能，即您可以拥有成员变量和函数。

## 用例

让我们看一下可以使用密封类的一些用例：

### 1. 结果类型

密封类通常用于表示可能产生不同结果（例如成功或失败）的操作的结果。

```dart
sealed class Result {}

class Success<T> extends Result {
  final T data;
  Success(this.data);
}

class Error extends Result {
  final String errorMessage;
  Error(this.errorMessage);
}
```

### 2. 状态机

密封类非常适合对状态机进行建模。每个状态都可以由密封子类表示，状态之间的转换可以通过返回适当子类实例的函数进行建模。

```dart
sealed class ConnectionState {}

class Connecting extends ConnectionState {}

class Connected extends ConnectionState {
  final String address;
  Connected(this.address);
}

class Disconnected extends ConnectionState {}
```

### 3. 事件处理

在应用程序中处理不同类型的事件时，可以使用密封类来对事件层次结构进行建模。这允许清晰、简洁地表示各种事件类型。

```dart
sealed class Event {}

class ClickEvent extends Event {
  final int buttonId;
  ClickEvent(this.buttonId);
}

class KeyEvent extends Event {
  final int keyCode;
  KeyEvent(this.keyCode);
}
```

### 4. 表达式树

密封类可用于在编译器或解释器中对表达式树进行建模。每种类型的表达式（例如，加法、减法、乘法）都可以表示为密封子类。

```dart
sealed class Expr {}

class Const extends Expr {
  final int value;
  Const(this.value);
}

class Add extends Expr {
  final Expr left;
  final Expr right;
  Add(this.left, this.right);
}

class Multiply extends Expr {
  final Expr left;
  final Expr right;
  Multiply(this.left, this.right);
}
```

### 5. 配置集

密封类对于以类型安全的方式对不同的配置或选项进行建模非常有用。每个配置选项都可以由一个密封子类表示。

```dart
sealed class Configuration {}

class Debug extends Configuration {}

class Release extends Configuration {}

class Custom extends Configuration {
  final String setting;
  Custom(this.setting);
}
```

### 6. API 响应

使用 API 时，密封类可用于对不同类型的响应进行建模，例如成功、错误或加载状态。

```dart
sealed class ApiResponse {}

class Loading extends ApiResponse {}

class Success<T> extends ApiResponse {
  final T data;
  Success(this.data);
}

class Error extends ApiResponse {
  final String errorMessage;
  Error(this.errorMessage);
}
```

## 实战！

首先，确保您至少使用 Dart 3。要检查当前的 Dart 版本，您可以运行以下命令：flutter doctor -v。它看起来像这样：

![](/assets/images/flutter/flutter_doctor.png)

此外，我们将使用一个名为[flutter_bloc](https://pub.dev/packages/flutter_bloc)的状态管理库。

该应用程序将有一个按钮，它将随机选择 2 个数字并将它们分开。如果第二个数字是 0，我们将抛出异常。按下按钮时，我们将模拟 2 秒的延迟，并显示一个 环形加载条。

首先，让我们创建我们的密封类：

```dart
sealed class UIState {
  const UIState();
}

class InitialState extends UIState {
  const InitialState();
}

class SuccessState<T> extends UIState {
  final T data;

  const SuccessState(this.data);
}

class LoadingState extends UIState {
  const LoadingState();
}

class ErrorState extends UIState {
  final String message;

  const ErrorState(this.message);
}
```

在这里，我们声明了一个名为 `UIState` 的密封类，以及 4 个子类，它们可用于描述 UI 的不同状态。

以下是 `Cubit` 和 `RandomNumbers` 类的代码：

```dart
import 'dart:math';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sealed_class_tut/ui_state.dart';

class HomePageCubit extends Cubit<UIState> {
  HomePageCubit() : super(const InitialState());

  Future<void> randomDivision() async {
    try {
      final num1 = Random().nextInt(10);
      final num2 = Random().nextInt(3);
      final randomNumbers = RandomNumbers(num1: num1, num2: num2);
      emit(SuccessState<RandomNumbers>(randomNumbers));
      await Future.delayed(const Duration(milliseconds: 50));
      emit(const LoadingState());
      await Future.delayed(const Duration(seconds: 2));
      if (num2 == 0) throw UnsupportedError('Division By Zero');
      final result = num1 / num2;
      emit(SuccessState<double>(result));
    } catch (e) {
      emit(ErrorState(e.toString()));
    }
  }
}

class RandomNumbers {
  final int num1;
  final int num2;

  const RandomNumbers({required this.num1, required this.num2});
}
```

以下是这个`cubit`当中发生的情况的详细说明：

1. 在`cubit`初始化时，我们发射出`InitialState`；
2. 当用户调用`randomDivision`方法时，我们随机选择 2 个数字并创建一个 `RandomNumbers`类 的对象；
3. 我们将这个`RandomNumbers`对象与`SuccessState`类型一同发射出去（该类接受泛型参数）；
4. 然后我们发射出`LoadingState`状态，并模拟一个 2 秒的延迟；
5. 如果第二个数字是 0，我们会抛出一个异常，该异常会在 catch 块中捕获，捕获异常之后，我们将发射一个带有错误消息的`ErrorState`；
6. 否则，我们将计算出结果，并发射`SuccessState`状态——但是这次携带的参数是double类型。

下面这是 UI 的代码：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sealed_class_tut/home_page_cubit.dart';
import 'package:sealed_class_tut/ui_state.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sealed Class Tutorial',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Sealed Class Tutorial'),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    RandomNumbers? nums;
    return BlocProvider<HomePageCubit>(
      create: (context) => HomePageCubit(),
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: Text(widget.title),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              BlocBuilder<HomePageCubit, UIState>(
                builder: (context, state) {
                  if (state is SuccessState<RandomNumbers>) {
                    nums = state.data;
                  }
                  return Column(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          context.read<HomePageCubit>().randomDivision();
                        },
                        child: const Text('Divide'),
                      ),
                      const SizedBox(height: 8),
                      nums != null
                          ? Text(
                              'Division of ${nums?.num1} by ${nums?.num2} is: ',
                              style: const TextStyle(fontSize: 20),
                            )
                          : const SizedBox.shrink(),
                    ],
                  );
                },
              ),
              const SizedBox(height: 8),
              BlocBuilder<HomePageCubit, UIState>(
                builder: (context, state) {
                  return switch (state) {
                    InitialState() => const SizedBox.shrink(),
                    LoadingState() => const CircularProgressIndicator(),
                    SuccessState<double>() => Container(
                        margin: const EdgeInsets.all(12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.greenAccent.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          state.data.toString(),
                          style: const TextStyle(fontSize: 20),
                        ),
                      ),
                    ErrorState() => Container(
                        margin: const EdgeInsets.all(12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.redAccent.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(state.message),
                      ),
                    _ => const SizedBox.shrink(),
                  };
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

让我们在这里分解一下代码：

1. 我们使用 初始化 `cubit` 的 `BlocProvider`。
2. 我们消耗 `BlocBuilder` 中的状态。如果状态是`SuccessState<RandomNumbers>`，我们设置`“nums”`的值并显示文本。

![](/assets/images/flutter/sealed_class_blocbuilder_use_state.png)

3. 接下来，对于 [结果](#1-结果类型) 部分，我们有另一个`BlocBuilder`。这里根据发出的`“state”`的类型，我们可以返回不同类型的小部件。我们不是使用嵌套的 `if-else`，而是使用`switch expression`。这意味着我们必须处理所有可能的情况。

![](/assets/images/flutter/sealed_class_blocbuilder_consume_state.png)

就是这样。它看起来是这样的：

![](/assets/images/flutter/sealed_class_tutorial_ui_demo.gif)

感谢您的阅读。我很乐意讨论并解决您的任何疑问。如果您喜欢这篇文章，请点赞并分享🙃。

## 原文地址

[Exploring: Sealed Classes in Flutter](https://medium.com/@ssindher11/exploring-sealed-classes-in-flutter-241d3e160132)
