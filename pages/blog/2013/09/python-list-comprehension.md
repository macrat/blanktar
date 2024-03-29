---
title: pythonのリスト内包表記は凄い。すごく凄い。
pubtime: 2013-09-06T01:09:00+09:00
tags: [Python, 言語仕様]
description: Pythonの「リスト内包表記」という機能を使うと、あらゆるリストや辞書型、集合型なんかまで作ることが出来ます。というわけで、色々と試してみました。
---

御存知の通り、pythonにはリスト内包表記っていう便利なものがあります。
``` python
>>> [x*2 for x in range(10)]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```
みたいなやつね。

``` python
>>> [[y*2 for y in range(x)] for x in range(5)]
[[], [0], [0, 2], [0, 2, 4], [0, 2, 4, 6]]
```
もちろん入れ子にも出来る。

``` python
>>> [x for x in range(10) if x%3 == 0]
[0, 3, 6, 9]
```
なんて感じでif文も仕込める。

ま、ここまでは序の口だ。

[前に書いた](/blog/2013/06/python-generator-like-list-comprehension)けど、
``` python
>>> (x*3 for x in range(10)) #doctest: +ELLIPSIS
<generator object <genexpr> at 0x...>
```
みたいにジェネレーターを作ることも出来る。

関数にジェネレーターを渡すことも出来る。
``` python
>>> type(x for x in range(3))
<type 'generator'>
```

更に、
``` python
>>> {x: x*2 for x in range(5)}
{0: 0, 1: 2, 2: 4, 3: 6, 4: 8}
```
こうすると辞書型も作れちゃう。すごい。

さらにさらに
``` python
>>> {x for x in range(3)}
set([0, 1, 2])
```
集合型まで作れる！

うーむ、なんて万能な。
まだあるんじゃないかなー、こういう裏ワザ的なの。
