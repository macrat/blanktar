---
title: pythonで冪剰余
pubtime: 2013-10-16T21:57:00+09:00
tags: [Python, 言語仕様]
description: Pythonで冪乗余を計算する方法です。
---

冪剰余。`x^y mod z`みたいなやつ。python風に書くと`(x**y)%z`。
暗号とかで使うのだけれど、暗号で使うような場合は桁数がやばいので、お察しの通り絶望的に演算が遅い。

と、思ったら。
流石python、組み込み関数に冪剰余計算してくれる奴がありました。
``` python
>>> pow(123, 456, 789)
699
```
速い。結構速い。

ちなみに
``` python
>>> pow(3, 3)
27
```
みたいな感じで普通の冪乗にも使えます。

参考: [2. 組み込み関数 - Python 2.7ja1 documentation](http://docs.python.jp/2/library/functions.html#pow)
