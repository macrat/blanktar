---
title: pythonでhtmlの文字参照をなんとかする。
pubtime: 2013-05-04T03:19:00+09:00
tags: [Python, HTML]
description: pythonの標準ライブラリ「htmllib」を使って「&amp;」とか「&gt;」なんかの文字参照を読める形に置換する方法です。
---

htmlの文字参照ってやつ。めんどいよね。
面倒さのあまりlt、gt、nbsp、あとampあたりだけreplace掛けて良しとしちゃってたりしたんだけどさ。
標準ライブラリのリファレンス見てたら、[htmlentitydefs](http://docs.python.jp/2/library/htmllib.html#module-htmlentitydefs)なんて使えそうなものがある。

という訳で使ってみた。
あんま短いコードにならなかった。
がっかり。
``` python
import htmlentitydefs    # python3.xならhtml.entities
import re

def unescape(string):
	for x in re.findall('&[a-zA-Z]+?;', string):
		try:
			rep = htmlentitydefs.name2codepoint[x[1:-1]]
		except KeyError:
			pass
		else:
			rep = unichr(rep)    # python3.xなら普通にchr(rep)でおっけー。
			string = string.replace(x, rep)
	return string


print unescape('test&nbsp;string')
print unescape('&lt;tag in &lt;tag&gt;&gt;')
print unescape('dummy&amp;tag;')
```

もっと短く書く方法あったら教えてくらはい。

あ、そうそう。
nbspの結果がなんか不思議なことになるので注意。
ノーブレークスペースってやつで、普通のスペースとは違うみたいね。詳しくは[wikipedia](http://ja.wikipedia.org/wiki/%E3%83%8E%E3%83%BC%E3%83%96%E3%83%AC%E3%83%BC%E3%82%AF%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9)でもどうぞ。
これになっちゃうと困る場合は、個別にreplaceでもしてください。
``` python
string = string.replace('&nbsp;', ' ')
```
みたいな感じで済むから、まあそんな労力にはならんでしょ。
