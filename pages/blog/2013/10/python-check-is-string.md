---
title: pythonで与えられた変数が文字列かどうか調べる
pubtime: 2013-10-07T16:18:00+09:00
amp: hybrid
tags: [Python, 文字列, 言語仕様]
description: Pythonで、ある変数が文字列かどうかを調べるためのシンプルな方法です。
---

今まで文字列かどうかを調べるときは
``` python
isinstance(test, str) or isinstance(test, unicode)
```
ってやってたんだけど、もっと簡単に

``` python
isinstance(test, (str, unicode))
```
なんてのが出来るらしい。

それどころかもっと簡単に出来て、
``` python
isinstance(a, basestring)
```
ってのも行けるらしい。

basestringってのはstrやunicodeのスーパークラスとのこと。

ちゃんと調べないともったいないねー、こういうの。
ちなみに、python3.xにはbasestringが存在しないので注意。

参考: [2. 組み込み関数 - Python 2.7ja1 documentation](http://docs.python.jp/2/library/functions.html)
