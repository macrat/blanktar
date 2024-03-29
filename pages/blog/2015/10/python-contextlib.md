---
title: pythonのcontextlibでwith文を活用したい
pubtime: 2015-10-22T16:50:00+09:00
tags: [Python, 標準ライブラリ]
description: Pythonのwith文の実装を簡単にしてくれる標準ライブラリ「contextlib」の色々な使い方です。
---

pythonには[contextlib](http://docs.python.jp/3.4/library/contextlib.html)ってライブラリがあるそうです。
普通にwith文に対応したものを作ろうとすると`__enter__`と`__exit__`を実装しなければならないわけですが、これが結構面倒くさいんですよね。
で、これを手軽にしてくれるのが**contextlib**というわけ。

余談ですが、with文で使えるオブジェクトのことをコンテキストマネージャ型っていうらしいです。知らなかった…。

# コンテキストマネージャを作ってみる
一番手軽な使い方は以下のような感じ。
``` python
>>> import contextlib

>>> @contextlib.contextmanager
... def test(x):
... 	print('started', x)
... 	yield
... 	print('ended', x)
...

>>> with test('hoge'):
... 	print('inside')
...
started hoge
inside
ended hoge
```
`yield`の前が前処理、後が後処理。まあまあ分かりやすいですね？

yieldで値を返すことも出来て、以下のように使います。
``` python
>>> import contextlib

>>> @contextlib.contextmanager
... def test(x):
... 	print('started', x)
... 	yield x
... 	print('ended', x)
...

>>> with test('huga') as value:
... 	print('inside', value)
...
started huga
inside huga
ended huga
```
こんな感じ。`yield`で返したものは`as`で受け取れます。

以下のような感じで後処理を書くときとかに使うみたい。
``` python
>>> import contextlib

>>> @contextlib.contextmanager
... def auto_close(f):
... 	try:
... 		yield f
... 	finally:
... 		f.close()
...
```
ちなみに、この例と同じ機能を持つ関数`contextlib.closing`が提供されています。一々定義しなくて良いならそっちのが良いね。

# 例外を無視する
例外を無視するためにも使えるようです。以下のような感じ。
``` python
>>> import contextlib

>>> open('not found', 'r')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
FileNotFoundError: [Errno 2] No such file or directory: 'not found'

>>> with contextlib.suppress(FileNotFoundError):
... 	open('not found', 'r')
...
# 何も起こらない。

>>> try:
... 	open('not found', 'r')
... except FileNotFoundError:
... 	pass
...
# さっきと同じ。
```
下がtry-exceptを使った場合、上がcontextlibを使った場合。ちょっと見やすくて良いかも。
ちなみに、`contextlib.suppress`には複数の引数を渡す事が可能で、複数の例外を無視することも可能です。
あたりまえですが、`Exception`を渡せばあらゆる例外を無視出来ます。あまり、いや全くおすすめしませんが。

# 標準出力/標準エラー出力をファイルにリダイレクトする
標準出力に何かを吐く関数があったとして、その出力を拾いたいとします。どんな状況だかよく分からないけれど、あったとします。
``` python
>>> import contexlib
>>> import io

>>> f = io.StringIO()
>>> with contextlib.redirect_stdout(f):
... 	print('hello, world!')
...
>>> f.getvalue()
'hello, world!\n'
```
これで標準出力を取得出来ます。便利…か？
ちなみに、`redirect_stdout`を`redirect_stderr`に変えると標準エラー出力を取れます。

`os.system`の出力を取得出来たら便利かと思ったのですが、残念ながらそれは無理なようです。

参考： [29.6. contextlib — with 文コンテキスト用ユーティリティ &mdash; Python 3.4.3 ドキュメント](http://docs.python.jp/3.4/library/contextlib.html)
