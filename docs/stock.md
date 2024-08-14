# 股票

## 交易制度

- 竞价制度
- 做市商制度

### 竞价制度

撮合交易也叫竞价交易，它由买卖双方直接进行交易，或将委托交给各自的代理经纪商，由代理经纪商将委托者的委托呈交到交易市场，在市场的交易中心以买卖双向价格为基准实行撮合，达成交易。 撮合交易（竞价交易）的类型包括：连续竞价方式和集合竞价方式。

- 集合竞价交易制度（Call Auction Mechanism）
- 连续竞价交易制度（Continues Auction Mechanism）

#### 集合竞价交易制度（Call Auction Mechanism）

#### 连续竞价交易制度（Continues Auction Mechanism）

### 做市商制度（Market Maker Mechanism）

做市商交易，也叫做报价驱动（Quote-Driven）交易。

“做市商”是指积极为特定证券市场双方报价的公司或个人，他们提供买入价和卖出价（称为卖价）以及各自的市场规模。事实上，他们有义务参与此类交易活动。

做市商为市场提供流动性和深度，并从买卖价差中获利。他们也可以为自己的账户进行交易。此类交易称为自营交易。

做市商因持有证券（他们为其做市）的风险而获得报酬，这些证券在从卖方购买之后和出售给买方之前的价值可能会下跌。

此外，他们还从上述每只证券的价差中获利。例如，当投资者通过在线经纪公司搜索股票时，可能会看到买入价为 100 美元，卖出价为 100.05 美元。这意味着经纪人以 100 美元的价格购买股票，然后以 100.05 美元的价格卖给买家。通过大批量交易，小幅价差可以累积成大量的每日收入。

## 数据

撮合交易成交实时数据：

- timestamp
- price
- volume

做市商实时数据：

- timestamp
- ask price
- ask size
- bid price
- bid size

聚合数据（蜡烛图OCLHV）：

- timestamp
- open
- close
- low
- high
- volume

## K线

**K线**（英语：**Candlestick chart**）又称**阴阳烛**、**蜡烛线**，是反映价格走势的一种图线，其特色在于将一段时间内标的价格走势做浓缩整理，并用不同的颜色和形态来透露价格讯息及市场情绪，以便投资者进行分析，相当易读易懂且实用有效，广泛用于股票、期货、贵金属、数字货币等行情的技术分析，称为**K线分析**。

据传K线为日本江户时代的白米商人本间宗久所发明，用来记录每日的米市行情，研析期货市场。 日语中K线称为“蜡烛足（日语：ローソク足）”。 本间宗久发明了“宗久が考案した酒田罫线法”。 日文中罫线（けいせん）发音为keisen，故中文翻译为K线，并不是从“キャンドルスティック”（KYANDORU SUTIKKU）而来。

K线可分“阳线”、“阴线”和“中立线”三种:

- **阳线** 代表收盘价大于开盘价（即价格上涨）；
- **阴线** 代表开盘价大于收盘价（即价格下跌）；
- **中立线** 则代表开盘价等于收盘价（即价格不变）。

美国线（英语：Open-High-Low-Close chart，**OHLC** chart），以竖立的线条表现股价变化，也可以呈现“开盘价、最高价、最低价、收盘价”，竖线呈现最高价和最低价间的价差间距，左侧横线代表开盘价，右侧横线代表收盘价，绘制上较K线简单。另有一种美国线仅呈现“最高价、最低价、收盘价”（**HLC**）三项讯息。

## 参考资料

- [集合竞价交易制度](https://wiki.mbalib.com/wiki/%E9%9B%86%E5%90%88%E7%AB%9E%E4%BB%B7%E4%BA%A4%E6%98%93%E5%88%B6%E5%BA%A6)
- [连续竞价交易制度](https://wiki.mbalib.com/wiki/%E8%BF%9E%E7%BB%AD%E7%AB%9E%E4%BB%B7%E4%BA%A4%E6%98%93%E5%88%B6%E5%BA%A6)
- [Market Making Mechanics and Strategies](https://medium.com/blockapex/market-making-mechanics-and-strategies-4daf2122121c)
- [Market Maker Definition: What It Means and How They Make Money](https://www.investopedia.com/terms/m/marketmaker.asp)
- [ETF下單的三種價格](https://pgfinnote.com/etf-bid-market-ask-price/)
- [K线](https://zh.wikipedia.org/zh-cn/K%E7%BA%BF)
- [蜡烛图在我国为何称“K线”？](https://finance.sina.cn/2022-02-05/detail-ikyakumy4305334.d.html)
- [为什么我们的K线不一样?](https://www.shinnytech.com/blog/why-our-kline-different/)
