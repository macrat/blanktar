---
title: pythonのソースをweb越しにimportしてみる
pubtime: 2013-05-17T13:51:00+09:00
tags: [Python, ネタ]
description: Web上にあるPythonモジュールをそのままインポートする関数を作ってみました。かなり危険な気がするけれど、まあ実験用として。
---

普通さ、ライブラリはローカルに置くよね。
javascriptなんかはweb上に置いてあることもあるけれど、pythonはローカル。
いやあえて、pythonでもweb上のモジュールを自由にimport出来たら面白いんじゃないか？　とか思った。
という訳で、試してみた。

``` python
import urllib2
import tempfile
import os

def ImportFromWeb(url):
	# 一時ファイルを用意
	out, name = tempfile.mkstemp(suffix='.py', dir='.')
	out = os.fdopen(out, 'w')

	# URLを開いて、一時ファイルに書き込む
	source = urllib2.urlopen(url)
	out.write(source.read())

	# URL/ファイルを閉じる
	source.close()
	out.close()

	# 一時ファイルをimportする
	imp = __import__(os.path.basename(name)[:-3])

	# 一時ファイルを削除
	#  ついでに.pycファイルも削除
	os.remove(name)
	if os.path.isfile(name[:-3] + '.pyc'):
		os.remove(name[:-3] + '.pyc')

	# importしたオブジェクトを返却
	return imp
```
こんな感じ。

``` python
test = ImportFromWeb('http://example.com/python/source.py')
test.run()
```
みたいに使えます。

一度importしちゃえばソースは消しても問題ないみたいね。
まあ、動作は保証しかねますが。

あと、これを乱用するとサーバーの管理者に迷惑です。
頻繁に使う場合は、サーバー管理者に確認をとってください。一応ね。
