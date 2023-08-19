---
title: macのtmuxの中でもvimでクリップボードを使いたい
pubtime: 2014-09-30T15:36:00+09:00
tags: [Mac, Vim, コマンド]
description: 何も考えずにmacportsでインストールしたtmuxの中では、vimのクリップボードが上手く動かないようです。この記事では、macのtmuxの中でもクリップボードを使えるようにします。
---

vimでは`*`レジスタ/`+`レジスタを使うとOSのクリップボード（正しくはバッファ？）を扱うことが出来ます。
`"+p`ってやってクリップボードの中身をペーストとかね。すごい便利なんだこれが。

macにmacportsでtmux入れて、tmuxの中でvim立ち上げてペーストしようとしたら<small>（呪文のようだ）</small>、なんか出来ない。
どうやらtmuxは標準ではOS Xのクリップボードに対応していないようです。

というわけで、対応できるやつをインストール。**macports**の場合は
``` shell
$ sudo port install tmux-pasteboard
```
こんな感じ。

**homebrew**をお使いの場合は
``` shell
$ brew install reattach-to-user-namespace
```
で行けるらしいです。

設定ファイル(.tmux.conf)を開いて、
``` bash
set -g default-command "reattach-to-user-namespace -l bash"
```
と追記。
tmuxをすべて再起動して、設定完了。

ちなみに、ターミナルの設定で**コマンドを実行**オプションを使ってtmuxを起動している場合、**シェル内で実行**にチェックを入れておく必要があるようです。
チェック入れてなくって起動しようとしたら一瞬だけウィンドウが表示されて消えちゃうから焦ったよ・・・。
どうもチェック入れないとtmuxのサーバーを起動できないっぽい？

参考:
[tmux内のvimで「E353: Nothing in register *」と出てコピーペーストができなくなった - Qiita](http://qiita.com/shoma2da/items/853074f05445722b496e)
[紹介マニアどらふと版: OS X で tmux のバッファをクリップボードでも使う](http://www.sakito.com/2012/09/os-x-tmux.html)
