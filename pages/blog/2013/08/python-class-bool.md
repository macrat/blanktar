---
title: pythonのクラスにブール値を持たせる。
pubtime: 2013-08-31T23:06:00+09:00
tags: [Python, 言語仕様]
description: Pythonのクラスに真偽値を持たせて、if文なんかでTrueっぽく見える/Falseっぽく見えるようなクラスを作る方法です。
---

pythonで作ったクラスに真偽値を持たせられたらなんか便利そうですよね。
例えば、int型の派生で偶数なら真、奇数なら偽なオブジェクトとか。
``` python
>>> test(2)
2
>>> bool(test(2))
True
>>> bool(test(3))
False
```
みたいな。

これを実装するには、
``` python
>>> class test(int):
... 	def __nonzero__(self):
... 		return self % 2 == 0
```
とすれば良いようです。

if文に直に使えるのは便利だねー。
オブジェクト指向の真価な感じがします。多分。
