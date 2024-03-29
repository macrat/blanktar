---
title: pythonは標準でtemplateが使えるらしい
pubtime: 2013-05-17T14:31:00+09:00
tags: [Python, 標準ライブラリ]
description: Pythonの標準ライブラリとして搭載されている「template」というモジュールを使って、簡易的な文字列テンプレートを実現する方法です。
---

本日は小ネタをもう一つ。

pythonの標準ライブラリで簡単なテンプレートエンジンが使えるようです。
いや、エンジンってほど豪華なものでもなさげだけれど。

``` python
import string
t = string.Template('test $a, and $b')

t.safe_substitute(a='script', b=123)
```
みたいにして使える。
結果は`test script, and 123`ね。

``` python
t.safe_substitute({'a':'script', 'b':123})
```
としても結果は同じです。

記号をエスケープする時は
``` python
t = string.Template('test $a, and $$b')
```
みたいに$を重ねて書けばいいみたい。

識別用の文字（`$a`とか）は複数文字でも行ける。
他の文字と続けて書きたいとき（スペースを挟みたくないとき）は、
``` python
t = string.Template('test $a, and ${and}s')
```
とすればいいみたい。

ちなみに、string.Templateにunicode型を渡すとunicodeで、str型を渡すとstrで返ってくるようです。

簡単なものであれば、わざわざライブラリ用意せんでもいいかもね。
楽でいいこってす。

参考：[7.1. string - 一般的な文字列操作 - Python 2.7ja1 documentation](http://docs.python.jp/2/library/string.html#string.Template)
