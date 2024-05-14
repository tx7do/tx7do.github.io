# Flutter使用Sealed Class让状态类更强大

记得之前在写Kotlin的时候，对于Kotlin所提供的`Sealed Class`的功能感到惊喜，我还给Sealed Class封上了enum 2.0的称号，它拥有Class的特性，可以将状态封装起来，使用`when`语法的时候，还可以详尽列出所有的子项，而在Flutter当中，其实也有`sealed class`可以用，在Dart 3.0中，也已经将sealed class加入到了Dart的武器库。

## enum

假如，我们现在要实现一个 收音机 功能，我们可以使用enum声明其状态，代码如下：

```dart
enum Status {  
  init, playing, paused, stopped  
}
```

如果我们要打印出现在的状态，我们可能会这样写：利用一个方法，传入enum，在这个方法里面判断该显示什么文字：

```dart
void displayStatus(Status status) {
  switch (status) {
    case Status.init:
      print('The radio is initializing');
      break;
    case Status.playing:
      print('The radio is playing');
      break;
    case Status.paused:
      print('The radio is paused');  
      break;
    case Status.stopped:
      print('The radio is stopped');
      break;
  }
}
```

但是，使用enum + function的方法会让我们定义的内容散布到各处，换而言之，我们使用这种方式时，打印方法的实现是在一个函数里面，而非在enum内，如此就很容易造成bug。

## Sealed class

在这，我们可以使用 `sealed class` 来改写，如下：在class关键字前面加上`sealed`关键字之后，该类就成为了 **sealed class(密封类型)**。

接口定义：

```dart
sealed class SealedStatus {
  void display();
}
```

继承实现类：

```dart
class Init extends SealedStatus {
  @override
  void display() {
    print('The radio is initializing');
  }
}
class Playing extends SealedStatus {
  @override
  void display() {
    print('The radio is playing');
  }
}
class Paused extends SealedStatus {
  @override
  void display() {
    print('The radio is paused');
  }
}
class Stopped extends SealedStatus {
  @override
  void display() {
    print('The radio is stopped');
  }
}
```

接口调用：

```dart
displaySealedStatus(SealedStatus status) => status.display();
```

## 如此一来，我们就可以将函数变得更加的精简

别忘记了 sealed class 支持 switch 列举：

定义接口

```dart
sealed class SealedStatus {}
```

继承类

```dart
class Init extends SealedStatus {}
class Playing extends SealedStatus {} 
class Paused extends SealedStatus {} 
class Stopped extends SealedStatus {}
```

实现`displaySealedStatus2`方法：

```dart
displaySealedStatus2(SealedStatus status) => switch (status) {  
      Init _ => print('The radio is initializing'),  
      Playing _ => print('The radio is playing'),  
      Paused _ => print('The radio is paused'),  
      Stopped _ => print('The radio is stopped')  
    };
```

`displaySealedStatus2()`就像是Kotlin的 lambda表达式，可以直接回传一个方法。因为 sealed class 的特性，在 compile-time 的时候，就可以知道所有的子类，所以，函数的使用是安全的。

使用 sealed class 能够让编译期在 compile-time 的时候就知道有哪些子类型，所以也就能够在开发时找出 switch当中所遗漏的状态。

## Sealed class + BLoC

BLoC 是 Flutter 中一个状态管理的工具，使用BLoC时，需要定义状态(state)、事件(event)，若是 Cubit（类似于BLoC，但是更为精简），虽然不需要定义事件（因为使用直接调用函数取代了事件传递），可还是需要定义状态的。

通常，在定义BLoC、Cubit的状态时，会将基本状态使用`abstract class`来声明，之后所有的状态都将会继承该基本状态类型。

如同上面的示例，我们来将 收音机 的状态改成可以在 BLoC 中使用的状态。

声明接口：

```dart
abstract class RadioState extends Equatable {
  const RadioState();
}
```

继承实现：

```dart
class RadioInitial extends RadioState {
  @override
  List<Object> get props => [];
}
class RadioPlaying extends RadioState {  
  @override
  List<Object> get props => [];
}
class RadioPaused extends RadioState {
  @override
  List<Object> get props => [];
}
class RadioStopped extends RadioState {
  @override
  List<Object> get props => [];
}
```

在 Widget 内使用 BLoC 事，可以使用 BlocBuilder 来根据不同的状态来产生不同的 Widget， 如下：

```dart
BlocBuilder<RadioBloc, RadioState>(  
  builder: (BuildContext context, state) {  
    if (state is RadioInitial) {  
      return const Text("Initial");  
    }  
    if (state is RadioPlaying) {  
      return const Text("Loading");  
    }  
    if (state is RadioPaused) {  
      return const Text("Paused");  
    }  
    if (state is RadioStopped) {  
      return const Text("Stopped");  
    }  
    return const CircularProgressIndicator();  
  },  
),
```

使用 if 判断 state 是否为特定状态，再依不同状态产生不同的 Widget，这种很常见判断 BLoC 状态的方法，在这里我们可以改用 `switch` 来进行改写：

```dart
BlocBuilder<RadioBloc, RadioState>(
  builder: (BuildContext context, state) {
    switch (state) {
      case RadioInitial():
        return const Text("Initial");
      case RadioPlaying():
        return const Text("Playing");
      case RadioPaused():
        return const Text("Paused");
      case RadioStopped():
        return const Text("Stopped");
    }
    return const CircularProgressIndicator();
  },
),
```

前面有提到，一般的Class是不支持switch列出所有可能的Class（因为编译器在compile-time还无法知道有哪些子类），假如我们犯了一个错，稍加了一个状态，那么，编译不会报错，而我们可能要到程序执行的时候才发现问题（甚至压根就没发现）。

```dart
BlocBuilder<RadioBloc, RadioState>(
  builder: (BuildContext context, state) {
    switch (state) {
      case RadioInitial():
        return const Text("Initial");
      case RadioPlaying():
        return const Text("Playing");
     // case RadioPaused():   //<- 少了 Paused 还是可以正常编译，不会发生错误
     //   return const Text("Paused");
      case RadioStopped():
        return const Text("Stopped");
    }
    return const CircularProgressIndicator();
  },
),
```

而如果我们将接口类型改为使用`sealed class`来声明，这个问题就能够在开发时就被发现。

将`abstract class RadioState{}`改为`sealed class RadioState {}`:

```dart
sealed class RadioState extends Equatable {  
  const RadioState();  
}
```

在IDE中，我们就会发现 switch 会出现 `compile-time error`：

![](/assets/images/flutter/sealed_class_not_enough_state.png)

这时候，我们就必须要在 switch 中填入所有的状态，这样才可以IDE不报 compile-time error，并能够执行编译。

![](/assets/images/flutter/sealed_class_enough_state.png)

Bloc插件 4.0.0 版本中已经自动将基本状态的Class改为了sealed class。

![](/assets/images/flutter/bloc_plugin.png)

## 结论

Sealed class 是一个很好用的工具，将Class使用 sealed class 进行声明，就可以让我们在开发的时候避免踩到难以发现的雷。如同上面的示例，使用BLoC的时候，若在BlocBuilder里面有状态忘记加了，就有可能造成误操作，而使用 sealed class 就可以避免我们的粗心大意所导致的难发现的错误，让我们可以及早的发现和排雷。

## 翻译自

[Flutter — 使用 Sealed class 讓你的類別更強大](https://andyludeveloper.medium.com/flutter-%E4%BD%BF%E7%94%A8-sealed-class-%E8%AE%93%E4%BD%A0%E7%9A%84%E9%A1%9E%E5%88%A5%E6%9B%B4%E5%BC%B7%E5%A4%A7-59152a47f666)
