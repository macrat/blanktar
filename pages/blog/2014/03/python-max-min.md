---
title: pythonで最大値、最小値を求める色々
pubtime: 2014-03-03T21:18:00+09:00
tags: [Python, 言語仕様, データ分析]
description: pythonでリストやタプルなどなどの中の最大値や最小値を探す方法です。
image: [/blog/2014/03/python-max-min.png]
---

初心に帰ってpythonで色んなものの最大値、最小値を求める方法。**max関数**、**min関数**の使い方です。
意外とこういう系のワードで検索してる人が多いっぽいので。

# リストとかタプルとか集合型とか
まずは一番基本。<b>リスト型</b>と<b>タプル型</b>。ちょっと変わり種で<b>集合型</b>。
``` python
>>> list = [1, 4, 8, 2]
>>> max(list)
8
>>> min(list)
1

>>> tuple = (1, 4, 8, 2)
>>> max(tuple)
8
>>> min(tuple)
1

>>> set = {1, 4, 8, 2}
>>> max(tuple)
8
>>> min(tuple)
1
```
うん、何も考えること無い。

入れ子になっている場合は
``` python
>>> list = [
... 	(1, 8, 6),
... 	(4, 2, 9),
... 	(7, 5, 3),
... ]
>>> max(list, key=(lambda x: x[0]))
(7, 5, 3)
>>> max(list, key=(lambda x: x[1]))
(1, 8, 6)
>>> max(list, key=(lambda x: x[2]))
(4, 2, 9)
```
みたいなことが出来ます。

複数のリスト（or タプル, 集合）の中の最大値を出したい場合は
``` python
>>> max(list + list(tuple) + list(set))
```
足しちゃえばいいんじゃないかな、素直に。

``` python
>>> max(max(list), max(tuple), max(max))
```
なんて解決方法もあるけれど、なんか面倒くさい。

# 辞書型
**辞書型**の場合、何も考えずに使うとkeyの最大値/最小値を出してくれます。
``` python
>>> dict = {1:9, 2:8, 3:7, 4:6}
>>> max(dict)
4
>>> min(dict)
1
```
`for x in dict: `ってした時にxにはkeyが入るのと同じ、って考えると分かりやすい、かも？

いや、俺はvalue、値のほうが欲しいんだ。って場合は、
``` python
>>> max(dict[x] for x in dict)
9
```
みたいにしましょう。

比較するのはvalueの方だけど、返して欲しいのはkey？ そんなときは
``` python
>>> max(dict, key=(lambda x: dict[x]))
1
```
こんな感じで解決。

# それ以外のクラスとか諸々
例えば**datetime**型にしましょうか。日付と時間ね。
``` python
>>> import datetime
>>> a = datetime.datetime.now()
>>> b = datetime.datetime.now()
>>> c = datetime.datetime.now()
>>> a < b
True
>>> max(a, b, c) == a
False
>>> min(a, b, c) == c
True
```
datetime同士の比較が可能な場合、どんなオブジェクト相手にもmax関数、min関数を使うことが出来ます。

そうじゃないんだ、日付無視して時間だけを比べたいんだ。なんてときは
``` python
>>> f = lambda x: x.hour*60*60 + x.minute*60 + x.second
```
日付を含まず時間だけをint型に変換する関数を用意してみました。

これを使って
``` python
>>> max(a, b, c, key=f) == a
False
>>> max(a, b, c, key=f) == c
True
```
みたいな感じに。

比較可能な値を返す関数があれば何にでもmax/minを使えるので、結構便利。

# ちょっとした応用
ゲーム作ってる時とかに、キャラが画面の外に出ないようにしたい、みたいな状況。
最大値最小値を超えたら最大/最小で値を固定するような用途ね。

そんなときは
``` python
>>> x = min(max(x, 0), SCREEN_WIDTH)
>>> y = min(max(y, 0), SCREEN_HEIGHT)
```
みたいにすると便利。

if文書きまくるより短くていいです。若干見づらいけれど。
