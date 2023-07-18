# 解决Selenium的报错：stale element reference: element is not attached to the page document

第一次使用Selenium后，在循环处理时，我遇到了一个莫名其妙的错误，我被卡住了一阵子，故而我留下本文作为备忘录。

```text
stale element reference: element is not attached to the page document
```

## 有问题的代码

请原谅凌乱的代码。。

```python
divEl = driver.find_element_by_class_name("htBlock-adjastableTableF_inner")
tableElem = divEl.find_elements(By.TAG_NAME, "table")
tbodys = tableElem[0].find_elements(By.TAG_NAME, "tbody")
trs = tbodys[0].find_elements(By.TAG_NAME, "tr")

for i in range(len(trs)):
    tmp1 = trs[i].find_element_by_class_name("htBlock-adjastableTableF_actionRow")  # td
```

本次循环中，第0次循环没有问题

```python
tmp1 = trs[i].find_element_by_class_name("htBlock-adjastableTableF_actionRow")  # td
```

可以完成，但在第一个循环中出现标题错误。

## 解决方案

```python
divEl = driver.find_element_by_class_name("htBlock-adjastableTableF_inner")
tableElem = divEl.find_elements(By.TAG_NAME, "table")
tbodys = tableElem[0].find_elements(By.TAG_NAME, "tbody")
trs = tbodys[0].find_elements(By.TAG_NAME, "tr")

for i in range(len(trs)):
    divEl = driver.find_element_by_class_name("htBlock-adjastableTableF_inner")
    tableElem = divEl.find_elements(By.TAG_NAME, "table")
    tbodys = tableElem[0].find_elements(By.TAG_NAME, "tbody")
    trs = tbodys[0].find_elements(By.TAG_NAME, "tr")
    tmp1 = trs[i].find_element_by_class_name("htBlock-adjastableTableF_actionRow")  # td
```

当我在循环中实时获取页面中的DOM信息时，程序运行没有问题。

以上。

简单来说，在for循环里面，必须要现查现用，否则就会得到陈旧的页面的信息，就会报错。

## 原文地址

- [Selenium でループを書いたときの　stale element reference: element is not attached to the page document　エラー回避備忘録](https://qiita.com/kenmaro/items/09549799285d76ce63fb)
