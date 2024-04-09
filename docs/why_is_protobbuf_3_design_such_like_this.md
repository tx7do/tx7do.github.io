# 设计思考 - Protocol Buffers 3 为什么这样设计

简单是一件非常困难的事！而深思熟虑的简单，可以给我们与学习最多的思考

Protocol Buffer 的第 3 版删除了一些特性（required, optional...），并且在默认值的设计上，做出了一个看起来很危险的重要决定。乍看之下匪夷所思，网路上也引起多人[讨论](https://github.com/google/protobuf/issues/359)。通常这种去掉重要功能的决定，都有非常的理由，尝试理解别人的设计，可以让我们看得更远。现在，就让我们尝试从google的角度，思考一下Protocol Buffer的设计吧！

## required / optional

proto3 删除了 `required` 以及 `optional` 这两个关键字，这是第一个让我莫名其妙的设计，因为这两个关键字实在是太重要了呀！

下面让我们来设计一个统计产品库存量的 `Stock` 类型：

```protobuf
syntax = "proto2";

/* 这是 proto2 的语法，可以将字段设置为 required 或者 optional */
message Stock {
    required int32 productId = 1;   /* 产品编号 */
    required int32 mtime = 2;       /* 统计时间 */
    optional int32 count = 3;       /* 库存数量 */
}
```

对库存记录来说，产品编号和统计时间是必填的，但库存数量可以不填（代表尚未盘点其库存）

假设购物平台上要列出所有库存售完的产品...

```javascript
const pids = stocks
    .filter(stock => stock.count !== null && stock.count > 0)
    .map(stock => stock.productId);
```

我们注意到在`filter`阶段，我们必须检查`count`是否有值，因为`count`是`optional`的，但在`map`阶段却可以安全地识别`productId`是有值的（因为是`required`）。

如果没有了`required`关键字，那么我们久必须在每个地方，去检查每个值是否存在。如果有protobuf来帮我们作这种正确性的检查，确保`productId`一定存在，不是很好吗？

问题在于，对于何谓 **正确的数据**，系统里每个角色的看法是不一样的。

就以`Stock`的例子来说，假设`mtime`的时间是数据库自动产生的，对于要新增进数据库的`Stock`来说，则`mtime`不是必须的。相对的，从数据库读出来的`Stock`就应该要有`mtime`。

换句话来说，对 `POST /stock`来说，不应该有`mtime`。但是`GET /stock`的回传值就应该要有。

甚至连`select * from stock` 跟`select productId, count from stock`对 `mtime` 的看法也不一样，难道要分别为他们创建不同的`message`定义吗？

所以的正确的观点应该是：`protobuf`只需要把对象的`encode`/`decode`做好就行了，数据的正确性（required / optional的检查），应该交由应用程序的每个角色自己检查。

更别说在复杂一点的系统上，要如何安全的把`required field`转成`optional field`会是多么容易出错的事情。[这篇文章](https://capnproto.org/faq.html#how-do-i-make-a-field-required-like-in-protocol-buffers)描述了一个很生动的例子（好像就是谷歌自己的例子）。

所以 `proto3` 中没有了 `required` 和 `optional`

```protobuf
syntax = "proto3";

/* 这是 proto3。没有 required 和 optional */
message Stock {
    int32 productId = 1;   /* 产品编号 */
    int32 mtime = 2;       /* 统计时间 */
    int32 count = 3;       /* 库存数量 */
}
```

## 危险的预设值

proto3 另一个很重要的特性是对预设值的态度：对于基本类型（int, string, boolean ...）来说，*null跟预设值是等价的！*

用上面的`Stock`来举例（为了简化问题，我们把mtime拿掉了）

```protobuf
syntax = "proto3";

message Stock {
    int32 productId = 1;   /* 产品编号 */
    int32 count = 2;       /* 库存数量 */
}
```

当一个基本类型的字段没有设定值的时候，proto3会把它当成预设值进行处理，以整数（int）来说，其预设值是0。

所以一个尚未进行盘点的Stock记录`{productId: 1}`经过proto3的`encode/decode`转换之后，会变成库存量为零的Stock：`{productId: 1, count: 0}`。

如果你还没有意识到问题所在，你可以想象一下公司要补货，要找到所有已售罄（库存为0）的产品，结果我们把有库存但尚未盘点的产品也报了上去，只有当被叫进脸色阴沉的总经理办公室的时候，你才知道谷歌犯了一个多么危险的错误。

`0` 跟 `null` / `undefined` 根本是两码子事儿，可是谷歌为什么犯这种低级错误呢？

就连官方文件都在警告我们要注意这件事了：

> once a message is parsed there’s no way of telling whether a field was explicitly set to the default value (for example whether a boolean was set to false) or just not set at all: *you should bear this in mind when defining your message types.*

为什么会这样设计？

其实原因很单纯，谷歌系统Protobuf的基本类型可以更贴近C、Java、GO等主流语言，因为他们的类型设计比JavaScript更精确。

对于大部分静态语言（C、Java、GO）来说，基本类型，例如`int`，是不可能为`null`的，只有变量被设定为类或者指针类型，才可以可以为null，所以如果库存量count可能没有设定值，它的类型应该是Integer类，而非基本类型`int`。

JavaScript等动态语言在类型上比较随性，看起来好像很好用，但是实际上是很容易出错的。

假如，有一个用于统计所有产品总库存的方法：

```javascript
/** 统计总库存量 */
function countStock (stocks) {
    let total = 0;
    stocks.forEach(stock => {
        total += stock.count;
    });
    return total;
}
```

开发人员很容易忘记`stock.count`可能是`null`或者是`undefined`！！像这样直接加下去就是错的。假如现在有A、B、C三个产品，其中B的库存尚未盘点，这个方法返回的结果可能是`A+B`或者`NaN`，这视B的值是`null`还是`undefined`而定。

这种错误在JavaScript中很难发现，因为开发者只知道`stock.count`是`number`，但`number`是不是一定有值，只有天知道……

如果在Java，这种事光看类型就知道了，如果类型是`int`，那就代表着它一定是有值的，如果是`Integer`，那就代表着它有可能是null。光是类型就已经给予了足够的提示，更别提编译器还能够做一些类型检查。

所以答案是很简单的，既然`stock.count`是`optional`的，我们就把它包装成一个类。谷歌就有提供这种`boxing type`的原生支持：

```protobuf
import "google/protobuf/wrappers.proto";

message Test {
    int32 productId = 1;                  /* int32 = required */
    google.protobuf.Int32Value count = 2; /* Int32Value = optional */
}
```

`Int32Value` 的结构是很简单的：

```protobuf
message Int32Value {
    int32 value = 1;
}
```

现在，光看类型我们就知道了`productId`是必填的(`int`)，而`count`是`optional`的(`Int32Value`)……

咦，这不就是那消失的 `required` 和 `optional` 吗？

是的！！只是现在这种类型检查不是硬性的，所以不会让新增Stock的方法在类型检查时发生失败的情况，但是又能够提供相对于`required` 或 `optional`的足够提示！！

有一个额外的好处是：现在，对于Java（或Go，或C……）的使用者来说，Protobuf产生出来类型更加接近于其原生的struct，也就是说会更加的轻量，更好整合。

还有一个额外的好处是：现在，所有的Default值都可以不用储存了。删除了required / optional 关键字，同时也删除了可以设定default值的功能，却换来更稳固的设计，更精准的语义，更精简的储存空间。

更少的元素，更多的价值。

LESS IS MORE，这就是设计！

## 搬运自

- [設計思考 — Protocol Buffers 3 為什麼](https://medium.com/@leon740727/%E8%A8%AD%E8%A8%88%E6%80%9D%E8%80%83-protocol-buffers-3-%E7%82%BA%E4%BB%80%E9%BA%BC-49219fc87bb7)
