---
title: pythonのlambda内で無理やり変数を定義する
pubtime: 2013-06-02T22:26:00+09:00
tags: [Python, ネタ]
description: Pythonのlambda式の中で無理やり変数を定義する小ネタです。関数の中で関数を定義することで擬似的に変数のようなものを実現します。
---

lambdaって楽しいよね！　実用する気にはならないけれど！
という訳で、lambdaの小ネタを。

lambdaのルールとして、変数定義はできません。あと、文も書けません。if文とかね。
それをくぐり抜けようというのが今回の趣旨。

if文はとりあえず前に書いた[三項演算子](/blog/2013/05/python-conditional-operator)を使えばおっけー。

で、変数。
Lispのletみたいな事をします。
``` python
>>> f = lambda a, b: (lambda x=a*b : x*a)
```
でおっけー。

``` python
def f(a, b):
	x = a * b
	return x * a
```
と同じ意味ね。
代入は出来ないけれど、まあなんとかなるだろ、きっと。

これを利用して
``` python
>>> (lambda x, func=(lambda self, x : (x * self(self, x-1)) if x>1 else x) : func(func, x))(5)
120
```
みたいな事も可能。階乗ね。

これで無名関数を代入せず再帰できる！　・・・見辛いだけだけどね。
