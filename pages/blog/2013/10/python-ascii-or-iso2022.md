---
title: 文字列がasciiなのかiso-2022-jpなのかを区別する
pubtime: 2013-10-24T17:44:00+09:00
tags: [コンピュータサイエンス]
description: ある文字列を見て、そのエンコードがasciiなのかiso-2022-jpなのかを調べる方法です。
---

iso-2022-jpってのは、7bitな文字コードです。
つまりどういうことかというと、asciiとしてデコードできちゃう。区別つかない。

わからないのは困るので、区別する方法を調べてみました。

iso-2022-jpはasciiの領域と区別するためにESC文字を使っているらしい。
日本語の文字は`ESC $ B`的なのから始まる、ってことかな。（`$ B`だけじゃないらしいけど。

言われてみりゃ改行マークとか`$`とかいっぱい出るよね、iso-2022-jpが文字化けした時って。

ま、ともかくだ。このESC文字が含まれるかどうか、ってところを基準に調べることが出来るらしい。

pythonで書くとこんな感じ
``` python
>>> def IsASCII(string):
... 	return '\x1b' not in string

>>> IsASCII(u'abc'.encode('ascii'))
True
>>> IsASCII(u'abc'.encode('iso-2022-jp'))
True
>>> IsASCII(u'日本語'.encode('iso-2022-jp'))
False
```
結構短くていいね。

参考:
- [[C#] nkf を用いた文字コードの判別 - ヽ(´∀｀)ノ](http://blog.wgag.net/286.html)
- [ASCII - Wikipedia](http://ja.wikipedia.org/wiki/ASCII)
