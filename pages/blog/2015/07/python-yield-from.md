---
title: python3.3のyield fromとは何なのか
pubtime: 2015-07-13T17:52:00+09:00
tags: [Python, 言語仕様]
description: Python3.4のasyncioで使われるyield fromという構文は、どうやらPython3.3で既に導入されていたようです。asyncio以外の場面での使い方について調べてみました。
---

python3.4で追加された[asyncio](http://docs.python.jp/3/library/asyncio.html)で使われている`yield from`ってやつ。
[python3.3のWhat's New](http://docs.python.jp/3.3/whatsnew/3.3.html)を見てたら出てきたのでびっくりしました。
asyncio専用の構文じゃないんですねあれ。

で、そのyield fromの使い方。
``` python
def range_ten():
    yield from range(10)

if __name__ == '__main__':
    for i in range_ten():
        print(i)
```
例えばこんな感じ。0から9までを返す専用のrange的なもの。

``` python
def range_skip():
    yield from range(0, 5)
    yield from range(10, 15)

if __name__ == '__main__':
    for i in range_skip():
        print(i)
```
こうすると、0から4、少し飛ばして10から14までを表示する。

ジェネレータ関数もreturnを書くことができる。
``` python
>>> def tea():
...	yield from range(0, 3)
...	return 'hello'
...
>>> tuple(tea())
(0, 1, 2)
```
こう書くと意味がなさそうだけれど、以下のようにすると取り出せる。
``` python
>>> def teb():
...	x = yield from tea()
...	print(x)
...
>>> tuple(teb())
hello
(0, 1, 2)
```
asyncioのコードっぽくなってきた。奇妙だ。
ちなみに、`print(yield from tea())`は動きませんでした。SyntaxErrorだってさ。

この手の構文活用してイテレータばりばり使ったら、かなりfor文消せそうですよね。結構な勢いで高速化できるはず。


おまけ。FizzBuzzを返すイテレータ。
``` python
import itertools

def fizzbuzz():
    yield from map(lambda x: 'Fizz'*(x%3==0) + 'Buzz'*(x%5==0) or str(x), itertools.count(1))
```
