---
title: pythonのitertoolsはかなり便利っぽい
pubtime: 2015-07-13T16:39:00+09:00
amp: hybrid
tags: [Python, itertools, for, while]
description: Python3でイテレータを扱うときに便利な標準ライブラリ「itertools」の紹介です。
---

pythonで無限ループを書きたいときに
``` python
i = 0
while True:
    something(i)
    i+=1
```
とか書いてませんか？ 私は書いてました。
聞くところによると、itertoolsというライブラリがあるそうです。
このライブラリを使うとさっきのコードが
``` python
for i in itertools.count():
    something(i)
```
こんなに簡単になる。うわお。

他にも便利なイテレータがたくさん定義されていて、たとえば複数のイテレータを繋いだり。
``` python
>>> a = range(0, 5)
>>> b = range(10, 15)
>>> tuple(itertools.chain(a, b))
(0, 1, 2, 3, 4, 10, 11, 12, 13, 14)
```
0-4までと10-14までの二つのrangeを繋いでみた。

入れ子になったfor文をまとめてくれるやつがあったり。
``` python
>>> for i in range(3):
...     for c in 'AB':
...         print('{0}: {1}'.format(i, c))
...
0: A
0: B
1: A
1: B
2: A
2: B

>>> for i, c in itertools.product(range(3), 'AB'):
...     print('{0}: {1}'.format(i, c))
...
0: A
0: B
1: A
1: B
2: A
2: B
```
一行減っただけだけれど、for文ってかなり効率悪いらしいから、処理速度はかなり早くなっている、はず？

組み合わせを生成してくれるやつとか
``` python
>>> for x in itertools.combinations('ABCD', 2):
...     print(''.join(x))
...
AB
AC
AD
BC
BD
CD
>>> for x in itertools.combinations('ABCD', 3):
...     print(''.join(x))
...
ABC
ABD
ACD
BCD
```
xがtupleになっているのでjoinして表示してます。パスワードの総当たりとかやりやすくなって素敵だね？

他にもhaskellのdropWhileとかtakeWhileみたいなやつとか。
``` python
>>> tuple(range(10))
(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
>>> itertools.dropwhile(lambda x: x<5, range(10))
(5, 6, 7, 8, 9)
>>> itertools.takewhile(lambda x: x<5, range(10))
(0, 1, 2, 3, 4)
```
lambdaで作って渡している関数がTrueを返す間データを返すorデータを捨てる、という挙動。

その他諸々、たくさんあります。全部書くと大変なので、とくに便利そうなやつだけ。
こういうの使いこなすと絶対楽にコード書けるよねー。勉強しよう・・・。

参考： [10.1. itertools — 効率的なループ実行のためのイテレータ生成関数 &mdash; Python 3.4.3 ドキュメント](http://docs.python.jp/3/library/itertools.html)
