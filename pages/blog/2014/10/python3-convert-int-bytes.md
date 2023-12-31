---
title: python3ならintとbytesの変換が楽勝になる
pubtime: 2014-10-05T00:10:00+09:00
tags: [Python, 言語仕様]
description: python3.2を使って、バイナリデータとintを相互に変換変換する方法です。
image: [/blog/2014/10/python3-convert-int-bytes.png]
faq:
  - question: Pythonのbytesをint型の整数として読み込むには？
    answer: Python3.2で導入された`int.from_bytes`というメソッドを使うと便利です。
  - question: Pythonのintをバイナリと見做してbytesに変換するには？
    answer: Python3.2で導入された`.to_bytes`というintのメソッドを使うと便利です。
---

バイト列を整数にする、あるいは整数をバイト列にする。
通信とか暗号とか扱ってるとしょっちゅうやらなきゃいけない事なわけですが、pythonだと意外と面倒なのよね、これが。
C言語ならキャストしちゃえば一発なんだけどねー。

・・・なんて思っていました。ついさっきまで。
せめて楽な方法が無いかと探していたら、python3のドキュメントの中に`整数を表すバイト列を返します。`なんて記述を発見。
なんてこった、標準であるのかよ。

使い方はこんな感じ
``` python
>>> a = 128
>>> a.to_bytes(2, 'big')  # 2バイトでビッグエンディアン
b'\x00\x80'
>>> a.to_bytes(4, 'little')  # 4バイトでリトルエンディアン
b'\x80\x00\x00\x00'
```
うわぁすごい簡単だどうしよう。

int -&gt; bytesが出来るのだからもちろんbytes -&gt; intも出来て、
``` python
>>> int.from_bytes(b'\x00\x80', 'big')
128
>>> int.from_bytes(b'\x80\x00\x00\x00', 'little')
128
```
こんな感じ。

**python3.2以降でしか使えない**らしいので要注意です。
いやしかし便利だなこれ、素敵だ。

参考: [4. 組み込み型 &mdash; Python 3.3.5 ドキュメント](http://docs.python.jp/3.3/library/stdtypes.html#int.to_bytes)
