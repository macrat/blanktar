---
title: pythonの__setattr__をオーバーライドしてみたら楽しいかもしれない。
pubtime: 2014-03-12T23:41:00+09:00
amp: hybrid
tags: [Python, メタプログラミング, 言語仕様]
description: pythonの__setattr__をオーバーライドして、クラスの色々な挙動をカスタマイズするという実験をしてみました。
---

[昨日の`__getattr__`](/blog/2014/03/python-getattr-getattribute)に引き続いてメタプログラミングシリーズですよ。
調子に乗るとグチャグチャになるのでほどほどに。

**getattr**関数と並び立つ（？）のが**setattr**関数。
その名の通り、クラスインスタンスに値をセットできます。

値じゃなくて関数もセット出来るのだけれど、バインドされないのでちょっと面倒臭い。
バインドされないと何が起こるかというと、`instance.method()`って呼び出し方をしてもselfが渡されないので、selfが必要なら`instance.method(instance)`ってやらないとになっちゃう。

まあそんな事はともかくだ。
`setattr(a, 'key', value)`とすると、内部的には`a.__setattr__('key', value)`みたいに処理されているらしい。
しかも、`a.key = value`とした場合も`__setattr__`が呼ばれているみたい。

この`__setattr__`ってやつも普通に上書きできるので、
``` python
>>> class Test(object):
... 	def __setattr__(self, key, value):
... 		print key, '<=', value
...
>>> a = Test()
>>> a.test = 123
test <= 123
>>> a.test
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Test' object has no attribute 'test'
```
代入できないクラス的な事ができる。どうでもいいね。

何かしら処理をした上で代入したい場合は
``` python
>>> class Double(object):
... 	def __setattr__(self, key, value):
... 		object.__setattr__(self, key, value*2)
...
>>> a = Test()
>>> a.one = 1
>>> a.one
2
>>> a.two = 2
>>> a.two
4
```
みたいな感じになります。入れた値が倍になる謎クラス。

当然普通の関数として書けるので、かなり自由っぽい。
ただ気をつけなきゃいけないのは、`self.var = value`みたいな記述。無限ループするからね。
