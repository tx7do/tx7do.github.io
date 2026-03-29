---
date: 2020-01-01
category:
  - Flutter编程
tag:
  - flutter
  - RxDart
sticky: 10
---

# Flutter 使用 RxDart & Streams 实现 BLoC模式

![](/assets/images/flutter/rxdart_bloc.png)

我将从本系列的第一部分开始构建一个简单的简短应用程序实现，该实现可以从 API 获取最新的技术新闻。在开始之前，我将简要介绍一些关键术语及其含义。

## 什么是反应式编程？

响应式编程基本上是 **使用异步可观察流进行编程**。在 Dart 中，流提供异步数据序列。

[RxDart](https://pub.dev/packages/rxdart) 是基于 Dart 的反应式编程实现。如果您来自 Android 开发领域，RxJava + RxAndroid、Coroutines 可能非常适合您。Dart 编程语言中已经实现了类似的概念。RxDart 是 Dart 语言的 ReactiveX 支持的反应式函数式编程库。Dart 已经有一个很好的用于处理 Streams 的包，但 RxDart 用新功能对其进行了扩展。

但是，您可能想知道，[Stream](https://dart.dev/tutorials/language/streams) 到底是什么？我将尝试在这里形象化一个场景：

想象一下一个有两个端点的管道，只有其中一个端点允许你插入东西，这样你就能轻松掌握流的概念。当你把东西放进管道时，它会流过管道并从另一端流出。

在 Flutter 中，管道称为 Stream。理想情况下，我们使用 StreamController 将某些内容传递到 Stream 中，StreamController 使用`sink`属性公开入口点。要退出流，我们使用Controller 的`stream`属性。从值、事件、对象、集合、映射、错误甚至另一个 Stream，任何类型的数据都可以通过 Stream 传输。

![](/assets/images/flutter/flutter_stream.png)

我们还可以订阅 Streams，以便使用 StreamSubscription 对象监听值。但所有这些都超出了本文的范围。我将在下面添加链接，以便您可以了解有关 Streams 及其功能的更多信息，例如 StreamTransformers 以及 RxDart 如何创建主题（BehaviourSubject、PublishSubject 和 ReplaySubject）作为广播流控制器。

1. YouTube 上的 Filled Stacks 发布了 [Streams 的简单初学者指南](https://www.youtube.com/watch?v=53jIxLiCv2E)；
2. 让我们看看 Medium 上 DLT Labs 的 [Dilshad Haidari 撰写的文章](https://medium.com/@dltlabs/simplifying-subjects-in-rxdart-2ea6fe94495) 。（个人最爱 💙）

## BLoC！BLoC！什么是BloC？

它是 Google 开发人员推荐的 Flutter 可预测状态管理库。它有助于管理状态并从项目的中心位置访问数据。[BLoC](https://bloclibrary.dev/#/)是 **Bussiness Logic Component** 的缩写。它也可以被视为一种架构模式，我们的项目主要分为 3 层。在 Android 中，BLoC 可以轻松地与 MVVM 和 MVP 架构相关联。ViewModel 是 Fl​​utter 中的 BLoC 层。（对于我的 Android 开发人员😁）

1. UI 层：我们在此创建小部件和应用程序的所有可视组件。这是用户可看到并与之交互以创建事件的层。
2. BLoC 层：我们在这里编写所有业务逻辑功能，并执行大部分错误和异常处理。BloC 可以相互交互，并相应地订阅其流和发出的状态。
3. 数据层：我们在此层中有存储库、数据提供者（例如 API）和数据模型。网络请求也在这里发出。

![](/assets/images/flutter/bloc_pattern_for_flutter.png)

在 BLoC 的底层，它只是相当抽象的流。

得益于业务逻辑与 UI 的分离：

* 我们可能会随时更改业务逻辑，但对应用程序的影响将降至最低，

* 我们可能会更改 UI，但不会对业务逻辑产生任何影响，

* 我们可以轻松地为我们的业务逻辑编写测试及其案例。

## 让我们开始构建我们的应用程序。🤙🏽

我假设您已经在本地机器上安装了 Flutter 和 Dart。并且您知道如何在 IDE 中使用终端。您已在本地机器上安装了 Flutter 和 Dart。并且您知道如何在 IDE 中使用终端。

### 1. 首先，创建一个新项目并清除 main.dart 文件中的所有代码。在终端中输入以下命令

```bash
flutter create myProjectName
```

### 2. 在 main.dart 文件中输入以下代码

```dart
import 'package:bloc_medium_post/ui/home_page.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Bloc Medium Post',
      theme: ThemeData.dark(),
      home: const HomePage(),
    );
  }
}
```

### 3. 在lib包下的src包内，创建一个文件，命名为 home_page.dart，并添加以下代码。添加以下代码

```dart
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
}
```

### 4.现在，我们创建一些包，即bloc、data和UI，如下图所示，然后我们开始添加项目文件

![](/assets/images/flutter/bloc_rxdart_project_struct.png)

我们的 BLOC 实现文件将存储在 bloc 包中。我们将从服务器收到的 JSON 响应的模型类将与存储库类一起存储在数据包中，网络调用实现类也将存储在数据包中。用户可见的屏幕将存储在 UI 包中。将我们之前创建的 home_page.dart 文件也移到 UI 包中。

### 5. 最后我们要添加的是依赖项（第三方库）。建议在处理新项目时使用最新的依赖项，因为在您阅读本文时，该库的升级版本可能已可用。转到[pub.dev](pub.dev)查看每个库的最新版本。打开您的pubspec.yaml文件并添加rxdart : ^0.27.3 和http ^0.13.4，如下所示

```dart
```

通过在终端中运行此命令来同步依赖项。

```bash
flutter pub get
```

现在，我们已经完成了项目框架的创建。现在是时候处理项目最基本的层，即数据（网络）层。我们将访问 NewsAPI 网站，该网站具有我们将要使用的 API 端点。如果您单击此 [链接](https://newsapi.org/)，您将被定向到新闻数据库 API 站点。从网站主页，注册并获取您的 API 密钥。要接收响应，我们将使用以下 URL：

```bash
https://newsapi.org/v2/topheadlines sources=techcrunch &apiKey= “ your_api_key ”
```

请不要公开您的 api_key，因为它是唯一的，任何有权访问它的人都可以从您的 API 点更改某些内容。将您的 api-key 插入 URL 时，请删除双引号。如果您测试 URL，您应该得到的原始响应应该是这样的。

```text
"status": "ok",
"totalResults": 10,
"articles": [
{
"source": {
"id": "techcrunch",
"name": "TechCrunch"
},
"author": "Christine Hall",
"title": "Slope brings on new CFO, customers, capital as it rises to offer businesses buy now, pay later",
"description": "Its API technology can approve businesses for the BNPL in seconds so they can begin offering the installments.",
"url": "https://techcrunch.com/2022/04/15/slope-series-a-buy-now-pay-later-b2b-payments/",
"urlToImage": "https://techcrunch.com/wp-content/uploads/2022/04/L1020402.jpg?w=711",
"publishedAt": "2022-04-15T12:02:54Z",
"content": "Slope, which provides businesses an easy way to offer buy now, pay later services, has had a busy six months. Thats not much of a surprise, given that the buy now, pay later market size was valued at… [+4553 chars]"
},
{
"source": {
"id": "techcrunch",
"name": "TechCrunch"
},
"author": "Manish Singh",
"title": "Swiggy backs bike taxi platform Rapido in $180 million funding",
"description": "Swiggy has led a $180 million financing round into bike taxi startup Rapido as the Indian food delivery giant looks to broaden its fleet network across the country, the two firms said on Friday. Rapido’s Series D financing round also saw participation from TV…",
"url": "https://techcrunch.com/2022/04/15/swiggy-rapido/",
"urlToImage": "https://techcrunch.com/wp-content/uploads/2022/04/GettyImages-1233588990.jpg?w=600",
"publishedAt": "2022-04-15T08:39:23Z",
"content": "Swiggy has led a $180 million financing round into bike taxi startup Rapido as the Indian food delivery giant looks to broaden its fleet network across the country, the two firms said on Friday.\r\nRap… [+2060 chars]"
},
```

### 7. 对于这种形式的响应，让我们创建一个模型类。在数据包内创建一个名为 model.dart 的新文件。在项目 model.dart 文件中，添加以下代码

![](/assets/images/flutter/flutter_bloc_rxdart_model_dart.png)

### 8. 现在是时候开始进行网络设置了。在数据包中创建一个 `service.dart` 文件。在文件内，添加以下代码，我会向您解释

![](/assets/images/flutter/flutter_bloc_rxdart_news_api_provider_dart.png)

我们为 URL 和 apiKey 创建了一个变量，`getArticles()`该方法是一种异步方法，用于对 API 进行网络调用。一旦网络调用成功 (200)，它将返回一个`Future List<NewsArticle>`对象，基本上就是新闻文章列表，如果网络调用成功，它将返回列表，否则将引发异常。

### 9. 之后，我们将在数据包中创建一个名为repository.dart的新文件。在文件中，复制并粘贴以下代码

![](/assets/images/flutter/flutter_bloc_rxdart_repository_dart.png)

然后我们导入包含 `NewsApiProvider` 类的`api_service.dart`文件并调用`fetchAllNews()`方法。`Repository` 类是数据流向 BLOC 的一个端点。

### 10. 现在到了稍微困难一点的部分。将 bloc 逻辑付诸实践。让我们在 bloc 包中创建一个名为 bloc.dart 的新文件。添加下面的代码，我会向您解释

![](/assets/images/flutter/flutter_bloc_rxdart_bloc_dart.png)

这里我们导入了一个名为“`package:rxdart/rxdart.dart`”的包，它将导入此文件中所有与 RxDart 相关的方法和类。然后我们在 `NewsBloc` 类中创建 `Repository` 类对象，这将允许我们使用 `fetchAllNews()` 方法。我们将创建一个 `StreamController` 对象，其工作是将从服务器获取的数据以 `List<NewsArticle>` 对象的形式添加到接收器，并将其流式传输到 UI 屏幕。我们添加了另一个 getter 函数 `allMovies()`，其返回类型为 Stream，以将 `List<NewsArticle>` 对象作为流传递。正如您在最后一行中看到的那样，我们正在创建一个 bloc 对象。每当从服务器接收到数据时，都需要更改 UI 屏幕。为了使这项工作更有效率，我们通知 UI 屏幕密切关注来自 `MoviesBloc` 类的任何更改并相应地更新您的内容。RxDart 可用于完成对新数据的这种“观察”。

## 11.最后，我们在UI包中的home_page.dart文件中添加更多实现。代码如下

![](/assets/images/flutter/flutter_bloc_rxdart_home_page_dart.png)

正如我之前所说，新数据以流的形式传递给我们的 `NewsBloc` 类。为了处理流，我们有一个方便的内置类，名为 StreamBuilder，它可以监听传入的流并相应地更新 UI。我们为 `StreamBuilder` 提供 `NewsBloc` 的 `allNews()` 函数，该函数返回一个流，而 `StreamBuilder` 需要一个流参数。我们使用具有 `onPressed()` 参数的浮动操作按钮，我们将一个回调函数从 bloc 中传递，该回调函数调用 `fetchAllNews()` 函数。一旦新的数据流到达，`StreamBuilder` 就会在每次最新新闻发生变化时自动使用最新数据重新呈现小部件。`List<NewsArticle>` 对象保存在快照数据中。您现在可以使用任何小部件来显示对象中的任何内容（这里您的创造力就发挥出来了）。我通过将小部件创建为独立小部件来抽象化它。在其中，我使用 `ListView.builder` 创建了当前所有最新新闻的列表。

![](/assets/images/flutter/flutter_bloc_rxdart_app_initial.png)

一旦我们点击获取最新新闻的按钮，就会发出网络请求，返回新闻文章列表。请确保您已连接到互联网，否则它将无法工作。我在这里使用 XCode 提供的 iPhone 模拟器来演示我的应用程序。

![](/assets/images/flutter/flutter_bloc_rxdart_app_data_1.png)

如果您的调用成功，我们应该会收到此信息。

![](/assets/images/flutter/flutter_bloc_rxdart_app_data_2.png)

我们已经到了本文的结尾。感谢您一直陪我到最后。我非常确定，在本文结束时，您对在 BLOC 模式下使用流和 RxDart 有了基本的了解。

其他一些非常有趣的文章值得一读：

- [Dart 流基础知识](https://www.burkharts.net/apps/blog/)[Thomas Burkhart]
- [rx_command 包](https://pub.dartlang.org/packages/rx_command)[Thomas Burkhart]
- [使用 Flutter 构建响应式移动应用 — 配套文章](https://medium.com/flutter-io/build-reactive-mobile-apps-in-flutter-companion-article-13950959e381)[Filip Hracek]
- [Flutter 使用 Streams 和 RxDart](https://skillsmatter.com/skillscasts/12254-flutter-with-streams-and-rxdart) [Brian Egan]

如果你想要完整的代码。这里是该项目的 [GitHub 代码库](https://github.com/dubemezeagwu/bloc_medium_post)。祝福！💙

## 翻译自

[BLoC (A Reactive Approach using RxDart & Streams).](https://medium.com/@dubemezeagwu/bloc-a-reactive-approach-using-rxdart-streams-f480fb6a12c8)
