---
title: pythonのpandasで移動平均を出したい
pubtime: 2015-12-06T18:59:00+09:00
tags: [Python, Pandas, データ分析]
description: Pythonのpandasを使って、FXや株のチャートで使われている単純移動平均(SMA)や指数移動平均(EMA)を算出する方法です。
---

最近**pandas**を触っております。
pandasで何をしているのかというと、FXの価格データをこねくり回しております。統計楽しいね。

で、pandasで**移動平均**を出します。今回出すのはとりあえず単純移動平均(SMA)と、指数移動平均(EMA)の二つ。

**単純移動平均**を出すには`pandas.rolling_mean`を使って、以下のようにします。
``` python
>>> import numpy
>>> import pandas

>>> data = numpy.array(range(10))

>>> pandas.rolling_mean(data, 2)
array([ nan,  0.5,  1.5,  2.5,  3.5,  4.5,  5.5,  6.5,  7.5,  8.5])

>>> pandas.rolling_mean(data, 3)
array([ nan,  nan,   1.,   2.,   3.,   4.,   5.,   6.,   7.,   8.])
```
こんな感じ。シンプル。

nanになって欲しくないときは、以下のようにして最小の範囲を指定すればおっけーです。
``` python
>>> pandas.rolling_mean(data, 2, 1)
array([ 0.,  0.5,   1.,   2.,   3.,   4.,   5.,   6.,   7.,   8.])
```

次は**指数移動平均**。といってもあまり変わりません。
``` python
>>> data = numpy.array(range(10))

>>> pandas.ewma(data, span=2)
array([ 0.        ,  0.75      ,  1.61538462,  2.55      ,  3.52066116,
        4.50824176,  5.5032022 ,  6.50121951,  7.50045727,  8.50016935])

>>> pandas.ewma(data, span=3)
array([ 0.        ,  0.66666667,  1.42857143,  2.26666667,  3.16129032,
        4.0952381 ,  5.05511811,  6.03137255,  7.01761252,  8.00977517])
```
こっちもシンプル。

どっちの関数も引数に`numpy.array`を渡せばnumpy.arrayで返って来て、`pandas.Series`ならpandas.Series、`pandas.DataFrame`なら`pandas.DataFrame`で返って来ます。
tupleやlistだとエラーになります。注意。
