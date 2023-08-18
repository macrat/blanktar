---
title: flaskでContent-Rangeを返す
pubtime: 2013-03-31T02:15:00+09:00
tags: [Web, Python, Flask]
description: Python/FlaskでRangeリクエストに答える（Content-Rangeヘッダを返す）方法です。
---

flaskっていうpython用のwebマイクロフレームワークを最近触ってたりして。

いやー、楽でいい。
Djangoよりもpythonicな気がします。

というのはともかく。

audioタグを使って音楽プレイヤー的なものを作って遊んでいたのですが、シークが出来ず。

色々調べていたら、どうやらhttpのRangeリクエストというのに答えなきゃいけないらしい。
という訳で、実装してみました。

``` python
def GetFile(fname):
	mimeType, enc = mimetypes.guess_type(fname)
	data = open(fname, 'rb').read()

	if 'Range' in flask.request.headers:
		start, end = flask.request.headers['Range'][len('bytes='):].split('-')
		try:
			start = int(start)
		except ValueError:
			start = 0
		try:
			end = int(end)
		except ValueError:
			end = len(data)

		response = flask.Response(data[start:end], mimetype=mimeType, statut=206)
		response.headers.add_header('Content-Range', 'bytes {0}-{1}/{2}'.format(start, end-1, len(data)))

		return response

	return flask.Response(data, mimetype=mimeType)
```
だいたいこんな感じ。

ヘッダーに
```
Content-Range: bytes 開始位置-終了位置/本来のサイズ
```
を入れればいいみたい。

あとは、HTTPステータスコードが**206**になってるのにも注意。
