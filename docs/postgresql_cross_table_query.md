# PostgreSQL查询交叉表

## 什么是交叉表？

**交叉表（Cross Tabulations）** 是一种常用的分类汇总表格。利用交叉表查询数据非常直观明了，被广泛应用。交叉表查询也是数据库的一个特点。

### 概念

在统计学中，交叉表是矩阵格式的一种表格，显示变量的（多变量）频率分布。交叉表被广泛用于调查研究，商业智能，工程和科学研究。它们提供了两个变量之间的相互关系的基本画面，可以帮助他们发现它们之间的相互作用。卡尔·皮尔逊（Karl Pearson）首先在“关于应变的理论及其关联理论与正常相关性”中使用了交叉表。

多元统计学的一个关键问题是找到高维应变表中包含的变量的（直接）依赖结构。如果某些有条件的独立性被揭示，那么甚至可以以更智能的方式来完成数据的存储。为了做到这一点，可以使用信息理论概念，它只能从概率分布中获得信息，这可以通过相对频率从交叉表中容易地表示。

### 举例

假设我们有两个变量，性别（男性或女性）和手性（右或左手）。 进一步假设，从非常大的人群中随机抽取100个人，作为对手性的性别差异研究的一部分。 可以创建一个应变表来显示男性和右撇子，男性和左撇子，女性和右撇子以及女性和左撇子的个人数量。 这样的应变表如下所示。

| Gender\Handedness  | Right Handed | Left Handed   | Total   |
|-------|---------|-------  |-------  |
| Male  | 43 |   9  |  52  |
| Female  | 44 |   4  |  48  |
| Total  | 87 |   13  |  100  |

男性，女性以及右撇子和左撇子个体的数量称为边际总数。总计（即应急表中所代表的个人总数）是右下角的数字。

这张表格让我们一目了然地看到，右撇子男子的比例与右撇子女性的比例大致相同。两种比例差异的意义可以通过各种统计检验来评估，包括Pearson的卡方检验，G检验，Fisher精确检验和巴纳德检验，条件是表中的条目代表从人口我们想得出结论。如果不同列中的个体的比例在行之间变化很大（反之亦然），则我们说两个变量之间存在偶然性。换句话说，这两个变量不是独立的。如果没有偶然性，我们说这两个变量是独立的。

上面的例子是最简单的交叉表，每个变量只有两个级别的表：这被称为2×2交叉表。原则上可以使用任何数量的行和列。也可能有两个以上的变量，但较高阶的偶然事件表难以在视觉上表示。序数变量之间或序数变量与分类变量之间的关系也可以用交叉表来表示，尽管这种做法很少见。

### 交叉报表

交叉报表是报表当中常见的类型，属于基本的报表，是行、列方向都有分组的报表。这里牵涉到另外一个概念即分组报表。这是所有报表当中最普通，最常见的报表类型，也是所有报表工具都支持的一种报表格式。从一般概念上来讲，分组报表就是只有纵向的分组。传统的分组报表制作方式是把报表划分为条带状，用户根据一个数据绑定向导指定分组，汇总字段，生成标准的分组报表。

## 转换查询交叉表

列式数据，即原始数据如下：

| Name  | subject | score   |
|-------|---------|-------  |
| Lucy  | English |   100  |
| Lucy  | Physics |    90  |
| Lucy  | Math    |    85  |
| Lily  | English |    95  |
| Lily  | Physics |    81  |
| Lily  | Math    |    84  |
| David | English |   100  |
| David | Physics |    86  |
| David | Math    |    89  |
| Simon | English |    90  |
| Simon | Physics |    76  |
| Simon | Math    |    79  |

行数据查询结果：

|Name  | English | Physics | Math  |
|------|---------|---------|------|
|Simon |      90 |      76 |   79  |
|Lucy  |     100 |      90 |   85  |
|Lily  |      95 |      81 |   84  |
|David |     100 |      86 |   89  |

### 创建测试表

```sql
CREATE TABLE IF NOT EXISTS score
(
    name    VARCHAR,
    subject VARCHAR,
    score   FLOAT
);
```

### 插入测试数据

```sql
TRUNCATE TABLE score;
INSERT INTO score
    (name, subject, score)
VALUES ('Lucy', 'English', 100),
       ('Lucy', 'Physics', 90),
       ('Lucy', 'Math', 85),
       ('Lily', 'English', 95),
       ('Lily', 'Physics', 81),
       ('Lily', 'Math', 84),
       ('David', 'English', 100),
       ('David', 'Physics', 86),
       ('David', 'Math', 89),
       ('Simon', 'English', 90),
       ('Simon', 'Physics', 76),
       ('Simon', 'Math', 79);
```

### 1. 标准聚合函数查询

```sql
SELECT name,
       sum(CASE WHEN subject = 'English' THEN score ELSE 0 END) AS "English",
       sum(CASE WHEN subject = 'Physics' THEN score ELSE 0 END) AS "Physics",
       sum(CASE WHEN subject = 'Math' THEN score ELSE 0 END)    AS "Math"
FROM score
GROUP BY name
ORDER BY name DESC;
```

### 2. PostgreSQL聚合函数查询

```sql
SELECT name,
       split_part(split_part(tmp, ',', 1), ':', 2) AS "English",
       split_part(split_part(tmp, ',', 2), ':', 2) AS "Physics",
       split_part(split_part(tmp, ',', 3), ':', 2) AS "Math"
FROM (SELECT name,
             string_agg(subject || ':' || score, ',') AS tmp
      FROM score
      GROUP BY name
      ORDER BY name DESC) AS T;
```

### 3. crosstab交叉函数查询

首先需要安装tablefunc扩展，才能够使用crosstab函数。

```sql
CREATE EXTENSION IF NOT EXISTS tablefunc;
```

```sql
SELECT *
FROM crosstab('SELECT name, subject, score FROM score ORDER BY name DESC',
              $$values ('English'::text),('Physics'::text),('Math'::text)$$
         ) AS score(name text, English int, Physics int, Math int);
```

## 参考资料

* [PostgreSQL实现交叉表（行列转换）的五种方法](https://blog.csdn.net/a258831020/article/details/48446213)
* [PostgreSQL行转列](https://www.cnblogs.com/lurenjia1994/p/9535899.html)
* [交叉表](https://baike.baidu.com/item/%E4%BA%A4%E5%8F%89%E8%A1%A8/10444871)
