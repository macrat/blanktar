---
title: pythonのジェネレータをリスト内包表記的に書く
pubtime: 2013-06-17T20:23:00+09:00
modtime: 2013-09-06T01:09:00+09:00
tags: [Python, 言語仕様]
description: Pythonのジェネレータ式を使って、イテレータをリスト内包表記の書き方で書く方法です。
---

<ins date="2013-09-06T01:09:00+09:00">

# 2013-09-06 追記

強化記事(?)書きました。 [pythonのリスト内包表記は凄い。すごく凄い。](/blog/2013/09/python-list-comprehension)

</ins>

ジェネレータってやつがあるじゃないですか。
``` python
def nums(step=1):
	i = 0
	while True:
		yield i
		i += step

for i in nums():
	print i
```

ってやると延々とカウントアップする、みたいなやつね。
メモリ消費が最小限で済む(+上記のような無限の配列も扱える)ので、もの凄い大きな配列とかに便利。

で、このジェネレータ。聞けばジェネレータ式というのがあるらしい。

リスト内包表記だと
``` python
[i*2 for i in range(100)]
```
みたいにやるのを
``` python
(i*2 for i in range(100))
```
とするだけ。

めっちゃ楽ちん。素敵。
もちろんこいつは入れ子にも出来る。便利だねー、いいねー。

ちなみに、ジェネレータオブジェクトを関数に渡したりする時は、括弧を省略できるみたいです。
``` python
sum(i*2 for i in range(100))
```
ではなく、
``` python
sum((i*2 for i in range(100)))
```
とすることが可能、ということ。括弧が一個少ない。

参考： [クラス - Python 2.7ja1 documentation](http://docs.python.jp/2/tutorial/classes.html#tut-genexps)
