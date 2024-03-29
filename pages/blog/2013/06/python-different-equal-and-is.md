---
title: pythonのisと==の違い
pubtime: 2013-06-24T17:33:00+09:00
tags: [Python, 言語仕様]
description: Pythonの`is`演算子と`==`演算子の挙動の違いについての解説記事です。
---

pythonのif文とかで使うのに`is`とか`==`とかあるじゃないっすか。
あれはどういう違いがあるのか、というお話。

# `is`
pythonのオブジェクトにはIDっちゅうのがあります。
``` python
>>> a = 1
>>> id(a)
```
みたいにすると見れる。CPythonの実装だとメモリアドレスらしいね。
オブジェクトを一意に識別するためのアイデンティティ、とのこと。

で、このIDが等しいかどうかを比較するのが`is`ってやつ。
つまりは同じ実体かどうか、ってのを調べるのが`is`の役割、かな。

同じ数値は同じIDを持つ（環境依存だったらごめん）ので、
``` python
>>> a = 1
>>> b = 1
>>> id(a) - id(b) is 0
True
>>> a is b
True
```
となります。

でも、リストなんかは常に別のIDになるので、
``` python
>>> a = []
>>> b = []
>>> id(a) - id(b) is 0
False
>>> a is b
False
>>> [1, 2, 3] is [1, 2, 3]
False
```
てな感じ。ちょっと直感的じゃないよね。

# `==`
さて、今度は`==`ってやつ。

`==`の左辺のオブジェクトの`__cmp__`関数に右辺のオブジェクトを渡して、戻り値が`0`なら`True`になる。
まあ、手っ取り早く言えばオブジェクトが持ってる値自体を比較するものです。
``` python
>>> class test(int):
... 	def __cmp__(self, arg):
... 		ret = int.__cmp__(self, arg)
... 		print 'cmp: {0}, {1} => {2}'.format(self, arg, ret)
... 		return ret
... 
>>> test(1) == test(1)
cmp: 1, 1 => 0
True
>>> test(1) == test(2)
cmp: 1, 2 => -1
False
```
みたいになります。

これを使えば、リストの比較でも
``` python
>>> a = []
>>> b = []
>>> a == b
True
>>> [1, 2, 3] == [1, 2, 3]
True
>>> [1, 2, 3] == [1, 3, 2]
False
```
こんな感じで直感的な結果に。

---

似ているようでぜんぜん違う。ちょっと分かりづらいね・・・。

参考： [式 (expression) - Python 2.7ja1 documentation](http://docs.python.jp/2/reference/expressions.html#comparison)
