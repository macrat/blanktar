---
title: pythonのシーケンス型から値を探したり数えたり
pubtime: 2013-10-08T21:52:00+09:00
tags: [Python, 言語仕様]
description: pythonのシーケンス型（文字列とかリストとか）から、最初に特定の値が出てくる場所を探したり出現数を数えたりする簡単な方法を見付けたのでメモ。
---

シーケンス型（文字列とかリストとか）の中で最初にこれが出る場所を探したい、とか、何回出てくるか数えたいとか、結構あるよね。

それを簡単に実現する方法をみっけたのでメモ。

まずは出現場所を探す方法。
``` python
>>> 'abcdefg'.index('c')
2
>>> 'abcdefg'.index('f')
5
>>> 'abcdefg'.index('z')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: substring not found
```
以上。

もう一つ。出現回数を調べる方法。
``` python
>>> 'python script'.count('p')
2
>>> 'python script'.count('c')
1
>>> 'python script'.count('z')
0
1
```
以上。

超簡単だ・・・！？
いつも思うのだけれど、python標準の機能を使いこなすだけでも凄い大変そうだよねー。
まあ、標準の状態でそれだけ多機能なのがpythonの強みなんだけどね。

参考: [5. 組み込み型 - Python 2.7ja1 documentation](http://docs.python.jp/2/library/stdtypes.html#str-unicode-list-tuple-bytearray-buffer-xrange)
