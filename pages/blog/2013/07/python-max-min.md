---
title: pythonのmax / min関数は意外と便利
pubtime: 2013-07-30T22:49:00+09:00
modtime: 2014-03-03T00:00:00+09:00
tags: [Python, 言語仕様]
description: Pythonで最大値/最小値を求めるための関数`max`/`min`の詳しい使い方の説明です。
---

<ins date="2014-03-03">

# 2014-03-03 追記

もう少し詳しい記事を書きました。
[pythonで最大値、最小値を求める色々](/blog/2014/03/python-max-min)

</ins>

pythonの組み込み関数で**max**とか**min**ってやつがあるじゃないですか。
あれ、意外と便利なのよね。

具体的に何が便利かというと、keyっていうキーワード引数があるのです。
これを使うと、

``` python
>>> score = [['ありす', 70], ['ぼぶ', 40], ['ちゃーりー', 80]]
```
みたいな点数のリストで

``` python
>>> print '最高得点は{0}さんの{1}点！'.format(*max(score, key=lambda x: x[1]))
最高得点はちゃーりーさんの80点！
```
なんて事が出来たりして。

・・・というのをついさっき知ったよ。わざわざfor回してた私は何だったんだ。

本題とは関係ないけれど、max関数の前にある`*`。これも結構便利。
**アンパック**ってやつ。
応用すると
``` python
>>> print '{0}、{username}さん。{sex}の方ですね？'.format('こんにちは', **{'username':'アリス', 'sex':'女性'})
こんにちは、アリスさん。女性の方ですね？
```
的なことも出来る。べんりー。

---

参考：
- [2. 組み込み関数 - Python 2.7ja1 documentation](http://docs.python.jp/2/library/functions.html#max)
- [4. その他の制御フローツール - Python 2.7ja1 documentation](http://docs.python.jp/2/tutorial/controlflow.html#tut-unpacking-arguments)
