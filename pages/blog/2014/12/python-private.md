---
title: pythonのクラスでprivateっぽいことをしよう
pubtime: 2014-12-02T17:28:00+09:00
tags: [Python, 言語仕様]
description: Pythonではプライベートなメンバを作れない…ということになっていますが、一応似たような事は可能です。この記事では、プライベートっぽいメンバの定義の仕方と、その挙動を解説しています。
faq:
  - question: Pythonでプライベートメンバを定義するには？
    answer: 完全なプライベートメンバを作ることは出来ませんが、変数名の頭にアンダーバーを2つ付けることでそれっぽいものを作ることは出来ます。
---

[さっきのクラスメソッドの記事](/blog/2014/12/python-classmethod)にひき続いてオブジェクト指向っぽいネタ。

C++とかJavaだとかなり最初の方に学ぶであろう<strong>private</strong>修飾子。クラスの外からアクセスできないってやつですね。
実はこれに似たようなことがpythonでも出来ます。

使い方はものすごく簡単で、メソッドもしくは変数の名前の頭にアンダーバーを二つ付けるだけ。
プログラマの慣例通りって感じ？

``` python
>>> class Test:
... 	__value = 'value'
... 
... 	def __init__(self):
... 		print 'init'
... 
... 	def normal(self):
... 		print 'normal'
... 
... 	def __private(self):
... 		print 'private'
... 

>>> t = Test()
init

>>> t.normal()	# 普通に呼べる。
normal

>>> t.__private()	# プライベートなのでこれは無理。
Traceback (most recent call last):
  ...
AttributeError: Test instance has no attribute '__private'

>>> t.__value	# こっちもプライベートなので無理。
Traceback (most recent call last):
  ...
AttributeError: Test instance has no attribute '__value'
```
みたいな感じで使えます。
これはわりと便利。

ただ、このプライベートは絶対のものではなくて、
``` python
>>> t._Test__private()
private

>>> t._Test__value
'value'
```
みたいな感じで呼べちゃいます。危ない。

ちなみに、継承すると分かりづらいエラーが出たりします。
``` python
>>> class Child(Test):
... 	def run(self):
... 		print self.__value
...

>>> c = Child()
init

>>> c.run()
Traceback (most recent call last):
  ...
AttributeError: Tea instance has no attribute '_Tea__value'
```
みたいな。ややっこい。

---

難点はあるけれど、使いどころは割とあると思うから・・・許して？
完全に外部からアクセスできなくなっちゃっていいと思うのだけれどねぇ・・・。
