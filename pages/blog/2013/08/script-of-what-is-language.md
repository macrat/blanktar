---
title: 何の言語のソースコードかを判別してくれるやつ
pubtime: 2013-08-08T23:52:00+09:00
amp: hybrid
tags: [Python, ソースコード, 判別]
description: 任意の文字列を渡すと、その文字列が何の言語のソースコードなのかを識別してくれるプログラムをPythonで作ってみました。
---

[昨日](/blog/2013/08/new-function-syntax-hilight)に引き続きシンタックスハイライトいじりました。
その過程で作ったやつをここで公開。

タイトルの通り、何て言語で書かれたソースコードかを簡易的に調べるやつです。
かなり適当な上に私が普段使ってる言語にしか対応してません。
[ダウンロードはこちら](/blog/2013/08/sourcetype.py)。右クリックで保存して下しあ。

対応している（ような気がする）言語は今のところ
python, sh, scheme, html, css, javascript, c, c++
の8種類。

``` python
>>> import sourcetype
>>> sourcetype.SourceType('print "hello"')
'python'
```
みたいな使い方をします。

shに関しては
``` python
>>> sourcetype.SourceType('$ echo "hello"')
'shell'
```
っていう挙動をするので注意。'sh'とは返しません。

ちなみに
``` python
>>> sourcetype.IsPython('hello, world!')
None
```
みたいなことも可能。
細かいことはソースコードを御覧ください。
