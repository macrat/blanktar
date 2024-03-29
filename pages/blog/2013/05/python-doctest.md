---
title: pythonのdoctestの使い方とか
pubtime: 2013-05-23T21:59:00+09:00
tags: [Python, テスト, 標準ライブラリ]
description: Pythonに書いたコメントをテストとして実行出来る標準ライブラリ「doctest」の使い方の紹介です。
---

pythonの標準ライブラリってほんとなんでもあるよね。
というわけで、今回はテストモジュールである**doctest**をご紹介。

**pydoc**ってモジュールがあるじゃないっすか。
あれを派生させた感じのモジュールがdoctest。

pydocと同じ形式のコメントに対話形式のサンプルコードを書く。
すると、そいつをチェックして予想通りの結果が得られるかを確認してくれるのね。

``` python
''' ここに普通にコメント書いたり
>>> print '対話形式で使い方を書いたり'
対話形式で使い方を書いたり

またコメントを書いたり
>>> print 1 + 1
2

>>> print """複数行で
... 書いたり"""
複数行で
書いたり
'''

def Add(a, b):
	''' ここにも同じようにコメントを書いたり

	>>> Add(1, 2)
	3
	>>> print Add('対話形式で', '書いたり')
	対話形式で書いたり
	'''

	return a + b
```
こんな感じで書きます。

使う時は
``` shell
$ python -m doctest ファイル名
```
とするか、ソースの最後に
``` python
if __name__ == '__main__':
	import doctest
	doctest.testmod()
```
を入れるようにしてください。
モジュールとして作ってるなら、これ入れっぱなしでもいいかもね。

何事もなければ、何も表示されずに終了します。
詳細を見たい時は
``` shell
$ python -m doctest -v ファイル名
```
で起動すればおっけー。

例外が送出されることを確認したい時は
``` python
'''
>>> a
Traceback (most recent call last):
	...
NameError: name 'a' is not defined
'''
```
みたいにすればいいようです。若干めんどいね。

例外周りがちょっとめんどいにせよ、書いたドキュメントでテストしてくれるのは嬉しいよね。
こういうのをばんばん駆使して効率的に開発できるようになりたいものです。

参考： [doctest -  Python 2.7ja1 documentation](http://docs.python.jp/2/library/doctest.html)
