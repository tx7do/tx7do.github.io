# Apache Doris 4.x 在量化交易中的完整应用实践

## 前言

在量化交易场景中，**实时行情接入、多维度 K 线聚合、技术指标计算、策略回测与绩效监控**是核心能力诉求。Apache Doris 4.x 凭借高性能 OLAP 引擎、实时物化视图、标准 SQL 兼容、Kafka 实时接入等特性，成为量化投研与实盘交易的理想存储计算引擎。

本文基于 Doris 4.x 构建**一站式量化交易数据平台**，覆盖分钟级行情存储、实时聚合、技术指标、策略选股、AI 辅助决策、回测复盘全流程，可直接用于生产环境部署。


## 一、整体架构设计

本方案采用分层量化数仓架构，兼顾实时性、查询性能与投研易用性：

- **ODS 层**：原始分钟级 K 线数据（Kafka 实时接入 + Doris 持久化）
- **DWD 层**：明细数据清洗、去重、索引优化
- **DWS 层**：物化视图预聚合（日 K / 小时 K / 周 K / 月 K / 大盘汇总）
- **ADS 层**：技术指标、策略视图、监控看板、AI 查询
- **应用层**：盘中选股、盘后复盘、策略迭代、AI 决策

## 二、创建数据结构（生产级 SQL）

```sql
CREATE DATABASE IF NOT EXISTS finances;
USE finances;

-- 停止旧的Kafka实时任务
STOP ROUTINE LOAD FOR finances.job_sync_candles;

-- 清理历史对象
DROP MATERIALIZED VIEW IF EXISTS finances.mv_symbol_daily_summary;
DROP MATERIALIZED VIEW IF EXISTS finances.mv_symbol_hour_summary;
DROP MATERIALIZED VIEW IF EXISTS finances.mv_symbol_total_summary;
DROP MATERIALIZED VIEW IF EXISTS finances.mv_symbol_weekly_summary;
DROP MATERIALIZED VIEW IF EXISTS finances.mv_symbol_monthly_summary;
DROP MATERIALIZED VIEW IF EXISTS finances.mv_market_overview;

DROP VIEW IF EXISTS finances.v_technical_indicators;
DROP VIEW IF EXISTS finances.v_strategy_monitor;
DROP VIEW IF EXISTS finances.v_volume_baseline_20d;
DROP VIEW IF EXISTS finances.v_data_quality_check;

DROP TABLE IF EXISTS finances.backtest_results;
DROP TABLE IF EXISTS finances.candles;
```

### 2.1 原始分钟 K 线表（核心基础表）

存储股票 / 合约**每分钟行情数据**，支持实时写入、动态分区、索引加速：

```sql
-- 分钟级K线原始数据表，存储每分钟的开盘价、最高价、最低价、收盘价和成交量等信息。
CREATE TABLE IF NOT EXISTS finances.candles (
    timestamp DATETIME NOT NULL COMMENT '数据时间戳（精确到秒）',
    symbol VARCHAR(20) NOT NULL COMMENT '股票代码',
    open DOUBLE COMMENT '开盘价',
    high DOUBLE COMMENT '最高价',
    low DOUBLE COMMENT '最低价',
    close DOUBLE COMMENT '收盘价',
    volume DOUBLE COMMENT '成交量',

    trade_date DATE NOT NULL COMMENT '交易日期（YYYY-MM-DD）',

    INDEX idx_symbol (symbol) USING INVERTED COMMENT '股票代码索引',
    INDEX idx_trade_date (trade_date) USING INVERTED COMMENT '交易日期索引'
)
ENGINE = OLAP
UNIQUE KEY(timestamp, symbol)
COMMENT "分钟级K线原始数据表"
PARTITION BY RANGE(timestamp) ()
DISTRIBUTED BY HASH(symbol) BUCKETS 4
PROPERTIES (
    "replication_num" = "1",
    "dynamic_partition.enable" = "true",
    "dynamic_partition.time_unit" = "MONTH",
    "dynamic_partition.start" = "-12",
    "dynamic_partition.end" = "1",
    "dynamic_partition.prefix" = "p",
    "enable_unique_key_merge_on_write" = "true"
);
```

### 2.2 策略回测结果表

记录所有策略的交易信号、盈亏、回撤，用于**复盘与策略迭代**：

```sql
-- 量化策略回测与实盘交易记录表，记录每个策略在每只股票上的交易信号、入场/出场价格和理由、盈亏情况等信息。
CREATE TABLE IF NOT EXISTS finances.backtest_results (
    strategy_name VARCHAR(50) COMMENT '策略名称',
    symbol VARCHAR(20) COMMENT '股票代码',
    signal_date DATE COMMENT '交易信号日期',

    entry_price DOUBLE COMMENT '入场价格',
    entry_reason VARCHAR(200) COMMENT '入场理由（技术指标、形态等）',
    exit_price DOUBLE COMMENT '出场价格',
    exit_reason VARCHAR(200) COMMENT '出场理由（止盈、止损、时间到等）',
    hold_days INT COMMENT '持仓天数',

    pnl_ratio DOUBLE COMMENT '单笔收益率',
    pnl_absolute DOUBLE COMMENT '绝对盈亏',
    max_drawdown DOUBLE COMMENT '持仓期最大回撤',
    sharpe_ratio DOUBLE COMMENT '夏普比率（可选）',

    market_regime VARCHAR(20) COMMENT '市场环境（牛市、熊市、震荡等） ''bull''/''bear''/''sideways''',

    INDEX idx_strategy (strategy_name) USING INVERTED COMMENT '策略名称索引',
    INDEX idx_symbol (symbol) USING INVERTED COMMENT '股票代码索引',
    INDEX idx_signal_date (signal_date) USING INVERTED COMMENT '交易信号日期索引'
)
ENGINE = OLAP
UNIQUE KEY(strategy_name, symbol, signal_date)
COMMENT "量化策略回测与实盘交易记录表"
PARTITION BY RANGE(signal_date) ()
DISTRIBUTED BY HASH(strategy_name) BUCKETS 8
PROPERTIES (
    "replication_num" = "1",
    "dynamic_partition.enable" = "true",
    "dynamic_partition.time_unit" = "MONTH",
    "dynamic_partition.end" = "3",
    "dynamic_partition.prefix" = "p",
    "dynamic_partition.buckets" = "8"
);
```

### 2.3 Kafka 实时接入（分钟行情自动同步）

支持从 Kafka 消费 JSON 格式行情数据，**秒级实时入仓**：

```sql
-- Kafka 实时同步
CREATE ROUTINE LOAD finances.job_sync_candles ON candles
COLUMNS(
    timestamp,
    symbol,
    open,
    high,
    low,
    close,
    volume,
    trade_date = date(timestamp)
)
PROPERTIES (
    "format" = "json",
    "jsonpaths" = "[\"$.ts\", \"$.ticker\", \"$.o\", \"$.h\", \"$.l\", \"$.c\", \"$.v\"]",
    "max_batch_interval" = "5",
    "max_error_number" = "0"
)
FROM KAFKA (
    "kafka_broker_list" = "kafka:9092",
    "kafka_topic" = "market_candles",
    "property.group.id" = "doris_candles_consumer",
    "property.kafka_default_offsets" = "OFFSET_BEGINNING"
);
```

## 三、实时物化视图（预聚合，毫秒级查询）

Doris 物化视图**自动同步更新**，无需手动刷新，直接支撑高并发查询。

### 3.1 日 K 线汇总（核心）

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS finances.mv_symbol_daily_summary
DISTRIBUTED BY HASH(symbol) BUCKETS 4
PROPERTIES (
    "replication_num" = "1"
)
AS
SELECT
    symbol,
    trade_date,

    SUM(volume)           AS total_volume,   -- 总成交量
    MAX(high)             AS max_price,      -- 当日最高价
    MIN(low)              AS min_price,      -- 当日最低价
    MAX(close)            AS close_price,    -- 收盘价（最新/收盘）
    MIN(open)             AS open_price,     -- 开盘价
    SUM(close * volume) AS total_amount, -- 成交额

    ROUND((MAX(high) - MIN(low)) / NULLIF(MIN(open), 0) * 100, 2) AS amplitude_ratio, -- 振幅
    ROUND((MAX(close) - MIN(open)) / NULLIF(MIN(open), 0) * 100, 2) AS change_ratio -- 涨跌幅

FROM finances.candles
GROUP BY symbol, trade_date;
```

### 3.2 小时 K 线汇总

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS finances.mv_symbol_hour_summary
DISTRIBUTED BY HASH(symbol) BUCKETS 4
PROPERTIES (
    "replication_num" = "1"
)
AS
SELECT
    symbol,
    trade_date,
    HOUR(timestamp) AS trade_hour,
    SUM(volume) AS total_volume,
    MAX(high) AS max_price,
    MIN(low) AS min_price,
    MAX(close) AS close_price,
    MIN(open) AS open_price,
    ROUND((MAX(close)-MIN(open))/NULLIF(MIN(open),0)*100, 2) AS change_ratio
FROM finances.candles
GROUP BY symbol, trade_date, trade_hour;
```

### 3.3 单股票全周期汇总（每只股票总指标）

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS finances.mv_symbol_total_summary
DISTRIBUTED BY HASH(symbol) BUCKETS 4
PROPERTIES (
    "replication_num" = "1"
)
AS
SELECT
    symbol,
    SUM(volume) AS total_volume_all,
    MAX(high) AS highest_price_all,
    MIN(low) AS lowest_price_all,
    MAX(close) AS latest_close
FROM finances.candles
GROUP BY symbol;
```

### 3.4 周 K 线

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS finances.mv_symbol_weekly_summary
DISTRIBUTED BY HASH(symbol) BUCKETS 4
PROPERTIES ("replication_num" = "1")
AS
SELECT
    symbol,
    YEAR(timestamp) AS trade_year,
    WEEK(timestamp) AS trade_week,
    SUM(volume)                AS total_volume,
    SUM(close * volume)        AS total_amount,
    MAX(high)                  AS max_price,
    MIN(low)                   AS min_price,
    MAX(close)                 AS close_price,
    MIN(open)                  AS open_price
FROM finances.candles
GROUP BY symbol, trade_year, trade_week;
```

### 3.5 月 K 线

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS finances.mv_symbol_monthly_summary
DISTRIBUTED BY HASH(symbol) BUCKETS 4
PROPERTIES ("replication_num" = "1")
AS
SELECT
    symbol,
    YEAR(timestamp)  AS trade_year,
    MONTH(timestamp) AS trade_month,
    SUM(volume)                AS total_volume,
    SUM(close * volume)        AS total_amount,
    MAX(high)                  AS max_price,
    MIN(low)                   AS min_price,
    MAX(close)                 AS close_price,
    MIN(open)                  AS open_price
FROM finances.candles
GROUP BY symbol, trade_year, trade_month;
```

### 3.6 全市场大盘概览（看板核心）

支持上涨家数、上涨率、成交额统计：

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS finances.mv_market_overview
DISTRIBUTED BY HASH(trade_date) BUCKETS 4
PROPERTIES ("replication_num" = "1")
AS
SELECT
    trade_date,
    COUNT(DISTINCT symbol) AS total_symbols,

    SUM(CASE WHEN change_ratio > 0 THEN 1 ELSE 0 END) AS up_count,
    SUM(CASE WHEN change_ratio < 0 THEN 1 ELSE 0 END) AS down_count,
    SUM(CASE WHEN change_ratio = 0 THEN 1 ELSE 0 END) AS flat_count,

    SUM(total_volume) AS market_total_volume,
    SUM(close_price * total_volume) AS market_total_amount,

    AVG(change_ratio) AS avg_change_ratio,
    MAX(change_ratio) AS max_gain,
    MIN(change_ratio) AS max_loss,

    ROUND(
        COUNT(CASE WHEN change_ratio > 0 THEN 1 END) * 100.0 /
        NULLIF(COUNT(DISTINCT symbol), 0),
        2
    ) AS up_ratio_pct
FROM finances.mv_symbol_daily_summary
GROUP BY trade_date;
```

## 四、业务视图（技术指标 + 策略 + 监控）

### 4.1 技术指标视图（MA20/MA60 / 波动率 / 量价背离）

```sql
CREATE OR REPLACE VIEW finances.v_technical_indicators AS
SELECT
    symbol,
    trade_date,
    close_price,
    total_volume,

    -- 20日均线
    AVG(close_price) OVER (
        PARTITION BY symbol
        ORDER BY trade_date
        ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
    ) AS ma20,

    -- 60日均线
    AVG(close_price) OVER (
        PARTITION BY symbol
        ORDER BY trade_date
        ROWS BETWEEN 59 PRECEDING AND CURRENT ROW
    ) AS ma60,

    -- 20日波动率
    STDDEV(close_price) OVER (
        PARTITION BY symbol
        ORDER BY trade_date
        ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
    ) AS volatility_20d,

    -- 量价背离（移除 WINDOW 子句，直接写完整窗口）
    CASE
        WHEN close_price > LAG(close_price, 1) OVER (PARTITION BY symbol ORDER BY trade_date)
             AND total_volume < LAG(total_volume, 1) OVER (PARTITION BY symbol ORDER BY trade_date)
             THEN 'bearish_divergence'
        WHEN close_price < LAG(close_price, 1) OVER (PARTITION BY symbol ORDER BY trade_date)
             AND total_volume > LAG(total_volume, 1) OVER (PARTITION BY symbol ORDER BY trade_date)
             THEN 'bullish_divergence'
        ELSE 'normal'
    END AS price_volume_signal

FROM finances.mv_symbol_daily_summary;
```

### 4.2 20 日量能基线（放量策略专用）

```sql
CREATE OR REPLACE VIEW finances.v_volume_baseline_20d AS
SELECT
    symbol,
    trade_date AS calc_date,
    -- 20日滚动均量（不含当日）
    AVG(total_volume) OVER (
        PARTITION BY symbol
        ORDER BY trade_date
        ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING
    ) AS avg_volume_20d,
    -- 20日量能标准差
    STDDEV(total_volume) OVER (
        PARTITION BY symbol
        ORDER BY trade_date
        ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING
    ) AS std_volume_20d,
    -- 有效统计天数
    COUNT(total_volume) OVER (
        PARTITION BY symbol
        ORDER BY trade_date
        ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING
    ) AS valid_days
FROM finances.mv_symbol_daily_summary
WHERE total_volume > 0;
```

### 4.3 策略绩效监控视图（胜率 / 收益曲线）

```sql
CREATE OR REPLACE VIEW finances.v_strategy_monitor AS
SELECT
    strategy_name,
    trade_day,
    signal_count,
    avg_pnl,
    win_rate,
    -- 累计总收益（资金曲线）
    SUM(avg_pnl * signal_count) OVER (
        PARTITION BY strategy_name
        ORDER BY trade_day
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_total_pnl,
    -- 累计加权平均收益
    SUM(avg_pnl * signal_count) OVER (
        PARTITION BY strategy_name
        ORDER BY trade_day
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) * 1.0 / NULLIF(SUM(signal_count) OVER (
        PARTITION BY strategy_name
        ORDER BY trade_day
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ), 0) AS cumulative_avg_pnl
FROM (
    SELECT
        strategy_name,
        DATE(signal_date) AS trade_day,
        COUNT(*) AS signal_count,
        AVG(pnl_ratio) AS avg_pnl,
        SUM(CASE WHEN pnl_ratio > 0 THEN 1 ELSE 0 END) * 1.0 / NULLIF(COUNT(*), 0) AS win_rate
    FROM finances.backtest_results
    GROUP BY strategy_name, DATE(signal_date)
) AS t;
```

### 4.4 数据质量检查视图（实盘必备）

```sql
CREATE OR REPLACE VIEW finances.v_data_quality_check AS
SELECT
    symbol,
    trade_date,
    COUNT(*) AS actual_rows,
    240 AS expected_rows,  -- A股：4小时×60分钟=240根/天
    ROUND(COUNT(*) * 100.0 / 240, 2) AS completeness_pct,
    CASE 
        WHEN COUNT(*) < 240 * 0.95 THEN '⚠️ 缺失'
        ELSE '✅ 正常'
    END AS quality_status
FROM finances.candles
GROUP BY symbol, trade_date
HAVING actual_rows < 240 * 0.95;  -- 仅返回异常记录
```

## 五、AI 资源初始化（大模型辅助量化）

对接 **DeepSeek** / **通义千问**，实现大盘分析、选股点评、复盘报告：

```sql
DROP RESOURCE IF EXISTS ai_deepseek;
DROP RESOURCE IF EXISTS ai_qwen;

-- DeepSeek
CREATE RESOURCE IF NOT EXISTS ai_deepseek
PROPERTIES (
    "type" = "ai",
    "ai.provider_type" = "deepseek",
    "ai.endpoint" = "https://api.deepseek.com/chat/completions",
    "ai.model_name" = "deepseek-chat",
    "ai.api_key" = "sk-xxx"
);

-- 通义千问
CREATE RESOURCE IF NOT EXISTS ai_qwen
PROPERTIES (
    "type" = "ai",
    "ai.provider_type" = "qwen",
    "ai.endpoint" = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    "ai.model_name" = "qwen-plus",
    "ai.api_key" = "sk-xxx"
);

SHOW RESOURCES;
```

## 六、核心量化查询（日常投研直接使用）

### 6.1 基础行情查询

```sql
-- 单股票历史日K
SELECT * FROM mv_symbol_daily_summary
WHERE symbol = 'AAPL'
ORDER BY trade_date DESC LIMIT 20;

-- 全市场今日行情
SELECT * FROM mv_symbol_daily_summary
WHERE trade_date = CURDATE();

-- 全市场今日涨幅榜
SELECT symbol, change_ratio, volume_ratio 
FROM finances.mv_symbol_daily_summary 
WHERE trade_date = CURDATE() 
ORDER BY change_ratio DESC LIMIT 20;
```

### 6.2 放量突破策略（实盘最常用）

```sql
WITH volume_baseline AS (
    SELECT 
        symbol,
        AVG(total_volume) AS avg_volume_20d,
        STDDEV(total_volume) AS std_volume_20d,  -- 可选：用于计算波动
        COUNT(*) AS valid_days                    -- 可选：确保数据充足
    FROM finances.mv_symbol_daily_summary
    WHERE trade_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 20 DAY) 
                         AND DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      AND total_volume > 0                        -- 排除停牌/无成交
    GROUP BY symbol
    HAVING COUNT(*) >= 15                         -- 至少15天有效数据
)
SELECT 
    a.symbol,
    a.trade_date,
    a.open_price,
    a.close_price,
    a.change_ratio,
    a.amplitude_ratio,
    a.total_volume,
    b.avg_volume_20d,
    ROUND(a.total_volume / NULLIF(b.avg_volume_20d, 0), 2) AS volume_ratio,  -- 放量倍数
    ROUND((a.total_volume - b.avg_volume_20d) / NULLIF(b.std_volume_20d, 0), 2) AS volume_zscore  -- 成交量Z-score
FROM finances.mv_symbol_daily_summary a
INNER JOIN volume_baseline b ON a.symbol = b.symbol
WHERE a.trade_date = CURDATE()
  AND a.change_ratio > 2                          -- 涨幅>2%
  AND a.total_volume > 1.5 * b.avg_volume_20d     -- 放量>1.5倍
  AND a.total_volume > 100000                     -- 绝对成交量过滤（避免小盘股噪声）
  AND b.valid_days >= 15                          -- 历史数据充足
ORDER BY volume_ratio DESC, a.change_ratio DESC
LIMIT 100;
```

### 6.3 强势股筛选（连续上涨）

```sql
SELECT symbol FROM mv_symbol_daily_summary a
WHERE trade_date >= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
  AND change_ratio > 0
GROUP BY symbol
HAVING COUNT(*) = 3;
```

### 6.4 振幅排行（波动率策略）

```sql
SELECT symbol, amplitude_ratio, change_ratio, total_volume
FROM mv_symbol_daily_summary
WHERE trade_date = CURDATE()
ORDER BY amplitude_ratio DESC LIMIT 20;
```

### 6.5 大盘整体情况

```sql
SELECT * FROM mv_market_overview
WHERE trade_date = CURDATE();
```

### 6.6 周 K / 月 K 查询

```sql
-- 周K
SELECT * FROM mv_symbol_weekly_summary
WHERE symbol = 'AAPL' ORDER BY trade_year, trade_week;

-- 月K
SELECT * FROM mv_symbol_monthly_summary
WHERE symbol = 'AAPL' ORDER BY trade_year, trade_month;
```

### 6.7 个股历史极值

```sql
SELECT * FROM mv_symbol_total_summary
WHERE symbol = 'AAPL';
```

### 6.8 小时级别分时策略

```sql
SELECT * FROM mv_symbol_hour_summary
WHERE symbol = 'AAPL' AND trade_date = CURDATE();
```

## 七、AI 量化决策（大模型赋能投研）

### 7.1 大盘情绪分析

```sql
SELECT
  trade_date, total_symbols, up_count, down_count,
  AI_GENERATE(CONCAT(
    '今日市场上涨', up_count, '家，下跌', down_count, '家，总成交额', market_amount,
    '。请以量化风格简短分析市场强弱、风险、机会。'
  )) AS ai_market_analysis
FROM mv_market_overview
WHERE trade_date = CURDATE();
```

### 7.2 AI 个股涨跌情绪打分

```sql
SELECT
  symbol, trade_date, change_ratio, amplitude_ratio,
  AI_SENTIMENT(CONCAT(
    '股票', symbol, '今日涨幅', change_ratio, '%，振幅', amplitude_ratio, '%'
  )) AS ai_sentiment
FROM mv_symbol_daily_summary
WHERE trade_date = CURDATE()
LIMIT 10;
```

### 7.3 AI 智能选股点评

```sql
SELECT
  symbol, close_price, change_ratio, total_volume,
  AI_GENERATE(CONCAT(
    '股票', symbol, '收盘价', close_price, '，涨幅', change_ratio, '%，成交量', total_volume,
    '。请做短线量化点评：趋势、机会、风险、建议。'
  )) AS ai_advice
FROM mv_symbol_daily_summary
WHERE trade_date = CURDATE()
  AND change_ratio > 2
LIMIT 5;
```

### 7.4 AI 预测明日走势

```sql
SELECT
  symbol, close_price, change_ratio, amplitude_ratio,
  AI_GENERATE(CONCAT(
    '股票', symbol, '今日收盘价', close_price, '，涨幅', change_ratio, '%，振幅', amplitude_ratio, '%',
    '。基于量价判断：明日上涨、震荡、下跌概率？一句话结论。'
  )) AS ai_predict
FROM mv_symbol_daily_summary
WHERE trade_date = CURDATE()
LIMIT 5;
```

### 7.5 AI 全市场机会总结

```sql
SELECT
  AI_GENERATE(CONCAT(
    '今日市场上涨', up_count, '家，下跌', down_count, '家，成交额', market_amount,
    '。请输出：市场情绪、强势板块方向、风险点、明日策略方向。'
  )) AS ai_strategy
FROM mv_market_overview
WHERE trade_date = CURDATE();
```

## 八、量化策略（实盘可直接运行）

### 8.1 策略 1：放量突破（无 AI）

```sql
SELECT 
    a.symbol,
    a.trade_date,
    a.close_price,
    a.change_ratio,
    a.amplitude_ratio,
    a.total_volume,
    b.avg_volume_20d,
    ROUND(a.total_volume / NULLIF(b.avg_volume_20d, 0), 2) AS volume_ratio
FROM finances.mv_symbol_daily_summary a
INNER JOIN finances.v_volume_baseline_20d b 
    ON a.symbol = b.symbol 
    AND a.trade_date = DATE_ADD(b.calc_date, INTERVAL 1 DAY)
WHERE a.trade_date = CURDATE()
  AND a.change_ratio BETWEEN 2 AND 8
  AND a.amplitude_ratio BETWEEN 4 AND 15
  AND a.total_volume > 1.5 * b.avg_volume_20d
  AND b.valid_days >= 15
ORDER BY volume_ratio DESC
LIMIT 100;
```

### 8.2 策略 2：AI 强势股精选

```sql
SELECT
  symbol, change_ratio, amplitude_ratio,
  AI_GENERATE(CONCAT(
    '股票', symbol, '涨幅', change_ratio, '%，振幅', amplitude_ratio, '%，判断是否为短线强势股'
  )) AS ai_strong_stock
FROM mv_symbol_daily_summary
WHERE trade_date = CURDATE() AND change_ratio > 3;
```

### 8.3 策略 3：大盘 AI 策略建议

```sql
SELECT
  CONCAT('大盘建议：', ai_advice) AS strategy
FROM (
  SELECT
    AI_GENERATE(CONCAT(
      '今日上涨', up_count, '，下跌', down_count, '，成交额', market_amount,
      '。给出量化交易策略：持仓、观望、减仓、进攻。'
    )) AS ai_advice
  FROM mv_market_overview
  WHERE trade_date = CURDATE()
) tmp;
```

## 九、日常使用流程（盘前 → 盘中 → 盘后 → 迭代）

### 9.1 盘前准备（9:00）

#### 1. 检查数据质量（确保昨日数据完整）

```sql
SELECT * FROM finances.v_data_quality_check 
WHERE trade_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  AND completeness_pct < 95;
```

#### 2. 查看昨日策略绩效

```sql
SELECT strategy_name, trade_day, win_rate, cumulative_total_pnl
FROM finances.v_strategy_monitor
WHERE trade_day = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
```

#### 3. 预加载今日技术指标（加速盘中查询）

```sql
SELECT symbol, ma20, ma60, price_volume_signal
FROM finances.v_technical_indicators
WHERE trade_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
LIMIT 100;
```

### 9.2 盘中监控（9:30-15:00）

#### 1. 放量突破策略（每 5 分钟执行一次）

```sql
SELECT symbol, close_price, change_ratio, volume_ratio
FROM (
    SELECT a.symbol, a.close_price, a.change_ratio,
           ROUND(a.total_volume / NULLIF(b.avg_volume_20d, 0), 2) AS volume_ratio
    FROM finances.mv_symbol_daily_summary a
    JOIN finances.v_volume_baseline_20d b 
        ON a.symbol = b.symbol AND a.trade_date = DATE_ADD(b.calc_date, INTERVAL 1 DAY)
    WHERE a.trade_date = CURDATE()
) t
WHERE change_ratio > 2 AND volume_ratio > 1.5
ORDER BY volume_ratio DESC LIMIT 10;
```

#### 2. 人工复核：查看候选股的技术指标

```sql
SELECT symbol, ma20, ma60, volatility_20d, price_volume_signal
FROM finances.v_technical_indicators
WHERE symbol IN ('AAPL', 'TSLA', 'NVDA')  -- 替换为实际候选股
  AND trade_date = CURDATE();
```

#### 3. AI 辅助决策（限 5 只，控制成本）

```sql
SELECT symbol, close_price, change_ratio, volume_ratio,
    AI_GENERATE(CONCAT(
        '股票', symbol, '涨幅', change_ratio, '%，放量', volume_ratio, '倍。',
        '请返回严格JSON: {"action":"buy/hold/sell", "confidence":0.8, "reason":"一句话"}'
    )) AS ai_signal
FROM (
    -- 复用放量策略查询作为子查询
    SELECT 
        a.symbol, a.close_price, a.change_ratio,
        ROUND(a.total_volume / NULLIF(b.avg_volume_20d, 0), 2) AS volume_ratio
    FROM finances.mv_symbol_daily_summary a
    JOIN finances.v_volume_baseline_20d b 
        ON a.symbol = b.symbol AND a.trade_date = DATE_ADD(b.calc_date, INTERVAL 1 DAY)
    WHERE a.trade_date = CURDATE()
      AND a.change_ratio BETWEEN 2 AND 8
      AND volume_ratio > 1.5
) candidates
LIMIT 5;
```

### 9.3 盘后复盘（15:30）

#### 1. 记录今日策略信号到回测表（自动化脚本调用）

```sql
INSERT INTO finances.backtest_results (
    strategy_name, symbol, signal_date,
    entry_price, entry_reason, market_regime
)
SELECT 
    'volume_breakout_v1',
    symbol,
    CURDATE(),
    close_price,
    CONCAT('放量', volume_ratio, 'x, 涨幅', change_ratio, '%'),
    CASE 
        WHEN m.avg_change_ratio > 1 THEN 'bull'
        WHEN m.avg_change_ratio < -1 THEN 'bear'
        ELSE 'sideways'
    END
FROM (
    -- 复用盘中策略查询
    SELECT a.symbol, a.close_price, a.change_ratio,
           ROUND(a.total_volume / NULLIF(b.avg_volume_20d, 0), 2) AS volume_ratio
    FROM finances.mv_symbol_daily_summary a
    JOIN finances.v_volume_baseline_20d b 
        ON a.symbol = b.symbol AND a.trade_date = DATE_ADD(b.calc_date, INTERVAL 1 DAY)
    WHERE a.trade_date = CURDATE()
      AND a.change_ratio BETWEEN 2 AND 8
      AND volume_ratio > 1.5
) t
CROSS JOIN finances.mv_market_overview m
WHERE m.trade_date = CURDATE();
```

#### 2. 查看今日策略绩效

```sql
SELECT * FROM finances.v_strategy_monitor
WHERE trade_day = CURDATE();
```

#### 3. 查看策略历史绩效曲线（30 日）

```sql
SELECT trade_day, cumulative_total_pnl, win_rate
FROM finances.v_strategy_monitor
WHERE strategy_name = 'volume_breakout_v1'
ORDER BY trade_day DESC LIMIT 30;
```

#### 4. AI 生成复盘报告

```sql
SELECT AI_GENERATE(CONCAT(
    '今日策略 volume_breakout_v1 发出 ', 
    (SELECT COUNT(*) FROM backtest_results WHERE strategy_name='volume_breakout_v1' AND signal_date=CURDATE()),
    ' 个信号，市场整体涨跌幅 ', 
    (SELECT avg_change_ratio FROM mv_market_overview WHERE trade_date=CURDATE()),
    '%。请总结：信号质量、市场配合度、明日优化建议。'
)) AS daily_review;
```

### 9.4 策略迭代（每周）

#### 1. 回测分析：过去 30 天策略表现

```sql
SELECT 
    strategy_name,
    COUNT(*) AS total_signals,
    AVG(pnl_ratio) AS avg_pnl,
    SUM(CASE WHEN pnl_ratio > 0 THEN 1 END)*1.0/COUNT(*) AS win_rate,
    MAX(pnl_ratio) AS best_trade,
    MIN(pnl_ratio) AS worst_trade
FROM finances.backtest_results
WHERE signal_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()
GROUP BY strategy_name;
```

#### 2. 参数敏感性分析：不同放量倍数的胜率

```sql
SELECT 
    CASE 
        WHEN volume_ratio >= 3 THEN '≥3x'
        WHEN volume_ratio >= 2 THEN '2-3x'
        ELSE '1.5-2x'
    END AS volume_bucket,
    COUNT(*) AS signals,
    AVG(pnl_ratio) AS avg_pnl,
    SUM(CASE WHEN pnl_ratio > 0 THEN 1 END)*1.0/COUNT(*) AS win_rate
FROM (
    SELECT 
        b.pnl_ratio,
        a.total_volume / NULLIF(c.avg_volume_20d, 0) AS volume_ratio
    FROM finances.backtest_results b
    JOIN finances.mv_symbol_daily_summary a 
        ON b.symbol = a.symbol AND b.signal_date = a.trade_date
    JOIN finances.v_volume_baseline_20d c 
        ON a.symbol = c.symbol AND a.trade_date = DATE_ADD(c.calc_date, INTERVAL 1 DAY)
    WHERE b.strategy_name = 'volume_breakout_v1'
      AND b.signal_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
) t
GROUP BY volume_bucket;
```

## 十、方案亮点与生产价值

1. **全实时**：Kafka 秒级入仓 + 物化视图自动更新
2. **高性能**：毫秒级返回日 K / 大盘 / 技术指标
3. **全闭环**：从数据 → 指标 → 策略 → 交易 → 复盘 → 迭代
4. **AI 赋能**：原生支持大模型决策，降低投研门槛
5. **易维护**：标准 SQL，无复杂开发，DBA 可直接运维
6. **可扩展**：支持期货、期权、数字货币等全品类标的

## 十、总结

基于 Apache Doris 4.x 构建的量化交易系统，完美解决了传统量化架构中**实时性差**、**查询慢**、**维护复杂**等痛点。

整套方案**生产可用**、**开箱即用**，既满足个人量化投研，也支持机构级实盘交易，是现代量化基础设施的最优选择之一。
