---
title: vimでdiffを取る。
pubtime: 2014-02-13T21:36:00+09:00
tags: [Vim]
description: vimだけで2つ以上のファイル同士の差分表示をすることが出来たりします。そのやり方の解説です。
---

vimだけで差分表示とか出来るのよね。使いこなすと便利っぽい。

コマンドは
``` vim
:vert[ical] diffs[plit]
```
で縦分割、
``` vim
:diffs[plit]
```
で横分割。


指定のファイルと差分を取りたいときは
``` vim
:vert[ical] diffs[plit] ファイル名
:diffs[plit] ファイル名
```
でおっけー。


指定のバッファとのdiffは
``` vim
:vert[ical] diffs[plit] #2
:diffs[plit] #2
```
みたいにすると2番めのバッファと差分を取れます。

ちなみに、
``` vim
:ls
```
した時に#が付いてるバッファについては番号省略して
``` vim
:diffs #
```
みたいにしてもおっけーみたいね。2つしか編集してない時なんかは便利かも。


作業が終わって、もう差分表示要らないってなったら
``` vim
:diffo[ff]
```
で解除。
