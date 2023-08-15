---
title: ubuntuのpyexiv2を無理やりgentooに移植した話。
pubtime: 2014-02-08T00:08:00+09:00
amp: hybrid
tags: [Gentoo, Python, Exif, pyexiv2, Ubuntu]
description: pythonのpyexiv2というライブラリをgentooで上手くコンパイル出来なかったので、ubuntuでコンパイルしたものを無理矢理加工して使えるようにしてみました。
---

**この記事で書いている方法はものすごく危険な香りがします。良い子の皆は真似しないでね？**

[先日使用した](/blog/2014/02/python-pyexiv2)pyexiv2ってライブラリ。
なんかねー、gentooで上手いことコンパイルできないんですよね。
参ったなー困ったなーと。

で、目をつけたのがubuntuのパッケージ。ubuntuにインストールして、それを持ってくればいいんじゃないかと思って。

`/usr/lib/python2.7/dist-packages/pyexiv2/`と`/usr/lib/python2.7/dist-packages/libexiv2python.so`の2つをgentooに持って行って、そこでpythonを起動。
``` python
>>> import pyexiv2
Traceback (most recent call last):
  File  "<stdin>", line 1, in <module>
  File "pyexiv2/__init__.py", line 60, in <module>
    import libexiv2python
ImportError: libboost_python-py27.so.1.53.0: cannot open shared object file: No such file or directory
```
おー、ダメだこりゃ。

探してみたら、私のgentooには`libboost_python-2.7.so`ってboost.pythonが入ってるのね。

あるんならいいじゃんと`libexiv2python.so`をvimで開いてboost\_pythonって検索。
```
max_arityEv^@libboost_python-py27.so.1.53.0^@libexiv2.so.12^@libstdc++.so.6^@...
```
みたいな感じでライブラリ名を列挙している所を発見。

すかさず
```
max_arityEv^@libboost_python-2.7.so^@libexiv2.so.12^@libstdc++.so.6^@...
```
に変更。

したらsegment faltした。そりゃそうだ、位置がズレてるもの。

しょうがないので足りない文字数分をnull文字で埋めて、
```
max_arityEv^@libboost_python-2.7.so^@^@^@^@^@^@^@^@^@libexiv2.so.12^@libstdc++.so.6^@...
```
みたいな感じに。

動いた。よし。終了。

boost-pythonのバージョンを指定を消しちゃってるあたりすごく危険な感じがするけれど、まあ動くからいいよね。たぶんね。
