# Flutter学习实录

## 数字格式化

可以使用`intl`实现该功能。

首先安装库：

```bash
flutter pub add intl
```

以下为使用的实例代码：

```dart
import 'package:flutter/foundation.dart';

import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

initializeDateFormatting();

NumberFormat nf = NumberFormat("#,###.##");
debugPrint("1234567890.123 => #,###.## = ${nf.format(1234567890.123)}");
// 使用00就可以保留指定的小数位
nf = NumberFormat("#,###.00");
debugPrint("#,###.00 = ${nf.format(1234567890.09876)}");
nf = NumberFormat("#,###.000%");
debugPrint("#,###.000% = ${nf.format(0.09876)}");
nf = NumberFormat("%#,###.000");
debugPrint("%#,###.000 = ${nf.format(0.09876)}");
nf = NumberFormat("#,###.000‰");
debugPrint("#,###.000‰ = ${nf.format(0.09876)}");
// 只能显示货币的名称，不能显示符号。
nf = NumberFormat("¤#,###.000");
debugPrint("¤#,###.000 = ${nf.format(09876)}");
nf = NumberFormat("¤#,###.000", "ZH");
debugPrint("¤#,###.000 = ${nf.format(09876)}");

debugPrint("===============进位使用银行家舍入法================");
// 银行家舍入法进位
// 四舍六入，五考虑，五后有值进位，五后没值看前位，奇数舍去，偶数进位。
nf = NumberFormat("#.#");
debugPrint("1.14，四舍${nf.format(1.14)}");
debugPrint("1.16，六入${nf.format(1.16)}");
debugPrint("1.151，五后有值进位)${nf.format(1.151)}");
debugPrint("1.15，五后没值看前位，奇数舍去${nf.format(1.15)}");
debugPrint("1.25，五后没值看前位，偶数进位${nf.format(1.25)}");
```

## 日期格式化

有两个库可以实现该功能：`intl`和`jiffy`:

intl实例代码：

```dart
import 'package:flutter/foundation.dart';

import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

initializeDateFormatting();

final now = DateTime.now();

// 打印当天的年份
debugPrint("当天年份(y)：${DateFormat.y().format(now)}");
// 打印当天的月份
debugPrint("当天月份(M)：${DateFormat.M().format(now)}");
// 打印当天的日期
debugPrint("当天日期(d)：${DateFormat.d().format(now)}");
// 打印当天的星期
debugPrint("当天星期(E)：${DateFormat.E().format(now)}");
// 打印当天的时间
debugPrint("当天时间(Hms)：${DateFormat.Hms().format(now)}");

debugPrint("y()：${DateFormat.y().format(now)}");
debugPrint("yM()：${DateFormat.yM().format(now)}");
debugPrint("YMEd()：${DateFormat.yMEd().format(now)}");
debugPrint("yMMM()：${DateFormat.yMMM().format(now)}");
debugPrint("yMMMEd()：${DateFormat.yMMMEd().format(now)}");
debugPrint("yMMMM()：${DateFormat.yMMMM().format(now)}");
debugPrint("yMMMMEEEEd()：${DateFormat.yMMMMEEEEd().format(now)}");
debugPrint("yMMMMd()：${DateFormat.yMMMMd().format(now)}");
debugPrint("yMd()：${DateFormat.yMd().format(now)}");

debugPrint(DateFormat.jm().format(now));
debugPrint(DateFormat.j().format(now));
debugPrint(DateFormat.jms().format(now));
debugPrint(DateFormat.Hm().format(now));

debugPrint("yM()：${DateFormat.yM().add_Hm().format(now)}");

// 打印当天的年份
debugPrint("当天年份(y)：${DateFormat.y("zh").format(now)}");
// 打印当天的月份
debugPrint("当天月份(M)：${DateFormat.M("zh").format(now)}");
// 打印当天的日期
debugPrint("当天日期(d)：${DateFormat.d("zh").format(now)}");
// 打印当天的星期
debugPrint("当天星期(E)：${DateFormat.E("zh").format(now)}");
// 打印当天的时间
debugPrint("当天时间(Hms)：${DateFormat.Hms("zh").format(now)}");

debugPrint("y()：${DateFormat.y("zh").format(now)}");
debugPrint("yM()：${DateFormat.yM("zh").format(now)}");
debugPrint("YMEd()：${DateFormat.yMEd("zh").format(now)}");
debugPrint("yMMM()：${DateFormat.yMMM("zh").format(now)}");
debugPrint("yMMMEd()：${DateFormat.yMMMEd("zh").format(now)}");
debugPrint("yMMMM()：${DateFormat.yMMMM("zh").format(now)}");
debugPrint("yMMMMEEEEd()：${DateFormat.yMMMMEEEEd("zh").format(now)}");
debugPrint("yMMMMd()：${DateFormat.yMMMMd("zh").format(now)}");
debugPrint("yMd()：${DateFormat.yMd("zh").format(now)}");

debugPrint(DateFormat.jm("zh").format(now));
debugPrint(DateFormat.j("zh").format(now));
debugPrint(DateFormat.jms("zh").format(now));
debugPrint(DateFormat.Hm("zh").format(now));

debugPrint("yM()：${DateFormat.yM("zh").add_Hm().format(now)}");

debugPrint("yyyy()：${DateFormat("yyyy").format(now)}");
debugPrint("yyyy-MM()：${DateFormat("yyyy-MM").format(now)}");
debugPrint("yyyy-MM-dd()：${DateFormat("yyyy-MM-dd").format(now)}");
debugPrint("yyyy-MM-dd HH:mm:ss()：${DateFormat("yyyy-MM-dd HH:mm:ss").format(now)}");
debugPrint(DateFormat("一年中的第D天，一年中的第Q个季度").format(now));

debugPrint("E：${DateFormat("E").format(now)}");
debugPrint("E(zh)：${DateFormat("E", "zh").format(now)}");
debugPrint("DateTime.now().weekday：${DateTime.now().weekday}");
```

需要注意的是，intl库一定需要调用`initializeDateFormatting();`进行初始化。

jiffy实例代码：

```dart
debugPrint(Jiffy.now().EEEE);

// 设置本地化，只能够全局设置。
await Jiffy.setLocale("zh_CN");
debugPrint(Jiffy.now().EEEE);

debugPrint(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").yMMMEd);

// 在当前日期添加时间
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").add(days: 1, months: 1),
    Jiffy.parse("2023-05-29", pattern: "yyyy-MM-dd"));

// 在当前日期减去时间
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").subtract(days: 1, months: 1),
    Jiffy.parse("2023-03-27", pattern: "yyyy-MM-dd"));

// 检查一个日期是否在另一个日期之前
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").isBefore(Jiffy.parse("2023-03-27", pattern: "yyyy-MM-dd")),
    false);

// 检查一个日期是否在另一个日期之后
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").isAfter(Jiffy.parse("2023-03-27", pattern: "yyyy-MM-dd")),
    true);

// 检查一个日期是否与另一个日期相同
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").isSame(Jiffy.parse("2023-03-27", pattern: "yyyy-MM-dd")),
    false);

// 检查一个日期是否在另一个日期之前，或者是否相同
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").isSameOrBefore(Jiffy.parse("2023-03-27", pattern: "yyyy-MM-dd")),
    false);

// 检查一个日期是否在另一个日期之后，或者是否相同
expect(Jiffy.parse("2023-04-28", pattern: "yyyy-MM-dd").isSameOrAfter(Jiffy.parse("2023-03-27", pattern: "yyyy-MM-dd")),
    true);
```

## Protobuf

安装protoc的Dart插件：

```bash
flutter pub global activate protoc_plugin
```

Windows将安装路径加入到全局路径：

```bash
C:\Users\{用户名}\AppData\Local\Pub\Cache\bin
```

非Windows系统将安装路径加入到全局路径：

```bash
export PATH="$PATH":"~/.pub-cache/bin"
```

编译命令：

```bash
protoc --proto_path=. --dart_out=. ./message.proto
```

也可以通过Buf的插件来使用：

```yaml
# buf.gen.yaml
version: v1
managed:
  enabled: true
plugins:
  - plugin: buf.build/protocolbuffers/dart:v21.1.2
    out: gen
```

## 多语言

多语言支持有两个库，先添加相关包：

```bash
flutter pub add flutter_localizations --sdk=flutter
flutter pub add intl:any
```

修改 `pubspec.yml`，添加以下配置：

```yml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: any
```

语言翻译文件为`arb`后缀文件，请存放于`lib\l10n`下：

```text
FLUTTER_PROJECT
|-- ...
|-- android
|-- ios
|-- lib
|   |-- l10n
|       |-- intl_ar.arb
|       |-- intl_en.arb
|       |-- intl_es.arb
|   |-- main.dart
|-- pubspec.yaml
|-- ...
```

生成代码和调用方法有两种，分别列举：

### flutter_localizations

修改 `pubspec.yaml`打开代码自动生成：

```yml
flutter:
  generate: true
  # Other config...
```

在项目根目录下(与`pubspec.yaml`同级文件夹)，添加配置文件 `l10n.yaml`：

```yml
arb-dir: lib/l10n
template-arb-file: intl_en.arb
output-localization-file: app_localizations.dart
output-class: S
preferred-supported-locales: [ en ]
use-escaping : true
```

在这里需要说明的是，输出的类名默认是`AppLocalizations`，我们通过`output-class`将之修改为：`S`。

我们可以手动通过以下命令生成dart代码：

```bash
flutter gen-l10n
```

我们运行`flutter pub get`和热重载的时候，也会自动触发该命令。

初始化app：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

@override
  Widget build(BuildContext context) {
    return MaterialApp(
      // ...
      onGenerateTitle: (context) => S.of(context).app_title,
      localizationsDelegates: S.localizationsDelegates,
      supportedLocales: S.supportedLocales,
      // ...
    );
  }
}
```

调用：

```dart
Text(S.of(context)!.helloWorld)
```

如果要停用该代码生成，只需要删除掉`l10n.yaml`配置文件即可。

### Intl

代码生成依赖intl_utils包。

我们可以在VSC或者Jetbrain的IDE里面查找插件`Flutter Intl`安装，该插件默认使用的是全局安装的包。

我们也可以在项目当中安装：

```bash
flutter flutter pub add intl_utils
```

修改 `pubspec.yaml`打开代码自动生成：

```yml
flutter_intl:
  enabled: true
  class_name: AppLocalizations
```

生成dart代码：

```bash
flutter pub run intl_utils:generate
```

初始化app：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() {
    runApp(const MyApp());
}

class MyApp extends StatelessWidget {
    const MyApp({Key? key}) : super(key: key);

@override
    Widget build(BuildContext context) {
        return MaterialApp(
        // ...
        onGenerateTitle: (context) => S.of(context).app_title,
        localizationsDelegates: const [
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
            S.delegate,
        ],
        supportedLocales: S.delegate.supportedLocales,
        // ...
        );
    }
}
```

调用：

```dart
Text(S.of(context)!.helloWorld)
```

或者

```dart
Text(S.current.helloWorld)
```

## extension

extension是为class扩展一个方法，且只能扩展方法，不能具有成员变量。

```dart
void main() {
  String name = 'john';
  print(name.getFirstString()); // prints 'j'
}

extension FooExtension on String {
  String getFirstString() {
    if (isEmpty) {
      return this;
    } else {
      return this[0];
    }
  }
}
```

这个特性可以用来拆分Widget的构建，以期避免掉入嵌套地狱。

但是，这个也只是看起来很好，就目前而言，会产生一个性能上的问题：官方推荐每一个Widget最好是const的，而用function创建的Widget是不能够加const的，这样的话就会产生一个频繁内存分配的性能问题。

官方 Flutter YouTube 频道的一个视频 [Flutter解析：小部件与辅助方法（Helper Method）]，解释了为什么组件（特别是具有 const 构造函数的组件）的性能比函数更好。

## mixin

mixin是为了把多个class可以共用的function提取出来，使用的时候再混入到需要的class里面去。它可以定义有限度的成员变量。

```dart
mixin FooMixin {
  void open() {
    // ...
  }
}

class Bar with FooMixin {
  void baz() {
    open();
  }
}
```

## Sealed class

这是Dart3提供的新语法，在其他的语言中也能够寻找到它的存在，比如：Kotlin、Swift等。

Dart2要声明一个状态是这样的：

```dart
enum Status {  
  init, playing, paused, stopped  
}

void displayStatus(Status status){ 
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

在Dart3，可以这样声明：

```dart
sealed class SealedStatus {
  void display();
}

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

它在Flutter里面最大的用途是声明BLoC的状态：

```dart
abstract class RadioState extends Equatable {
  const RadioState();
}

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

那么，我们就可以这样来调用BLoC了：

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

或者使用switch:

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

## 状态管理

Flutter的状态管理的包有很多。

### Provider

### Riverpod

### Bloc

### RxDart

## 参考资料

- [Flutter中使用Intl完成日期格式化和数字格式化]
- [Flutter解析：小部件与辅助方法（Helper Method）]
- [Flutter 性能优化最佳实践]
- [Flutter 性能分析]

[Flutter中使用Intl完成日期格式化和数字格式化]:(https://juejin.cn/post/7107609505155776520)
[Flutter解析：小部件与辅助方法（Helper Method）]:(https://www.youtube.com/watch?v=IOyq-eTRhvo)
[Flutter 性能优化最佳实践]:(https://simi.studio/flutter-performance-optimization-best-practices/)
[Flutter 性能分析]:(https://flutter.cn/docs/perf/ui-performance)
