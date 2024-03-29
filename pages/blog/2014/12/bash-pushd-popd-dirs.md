---
title: bashのpushd, popdを使ってディレクトリを移動しまくってみる
pubtime: 2014-12-28T17:09:00+09:00
tags: [Linux, コマンド]
description: bashの組み込みコマンドである"pushd"、"popd"、"dirs"の使い方を調べてみた記録です。
---

bashのコマンドに`pushd`、`popd`というコマンドがあります。
組み込みコマンドなので他のシェルにあるかどうかは知らない。

しばらく前にtwitterで便利だよって話を聞いた気がしたのだけれど、実際使ってる人は見たことが無い。
謎なのでとりあえず使ってみることにしました。

`dirs`, `pushd`, `popd`の三つのコマンドでセットになっているようです。
ディレクトリのリストみたいなものを作って、それをぽんぽん移動しようじゃないか、ということみたい。

``` shell
$ pwd
~
$ dirs
~
```
dirコマンドで記憶されてるディレクトリのリストを見れる。
最初は何も入れてないのでカレントディレクトリのみ。

例えば、ルートディレクトリに移動してみる。
cd使いたい気持ちを堪えてpushdを使います。
``` shell
$ pushd /
/ ~
```
何かよくわかんないもんが出た。

この出力はdirsを実行した時の結果と一緒で、現在記憶されてるディレクトリのリストらしい。
``` shell
$ dirs
/ ~
$ pushd /home
/home / ~
$ pwd
/home
$ dirs
/home / ~
```
こんな感じ。

引数をつけずにpushdを使うと、リストの左端（カレントディレクトリ）と左から二番目を入れ替える、らしい。
``` shell
$ dirs
/home / ~
$ pushd
/ /home ~
$ pushd
/home / ~
```
不思議な動きだ・・・。素直に右にシフトしてくれりゃ良いのに。

じゃ3番めに行きたいときはどうすりゃ良いのかって言うと
``` shell
$ pushd +2
~ /home /
$ pushd +2
/ ~ /home
```
左に2つシフトした。

``` shell
$ dirs
/ ~ /home
$ pushd +1
~ /home /
$ pushd +1
/home / ~
```
一つずつでもシフトできる。
+nってやると、左からn番めのディレクトリが先頭にくるようにシフト、という意味になるらしい。
-nにすると、右からn番め、ということに。

リストから削除したいときは、
```
$ dirs
/home / ~
$ popd
/ ~
$ popd
~
```
こんな感じ。popdで左端が消える。

``` shell
$ dirs
/home / ~
$ popd +1
/home ~
$ pwd
/home
```
途中から消すことも出来る。

``` shell
$ dirs
/home / ~
$ popd -0
/home /
```
右から数えて消すときは負数を使えば良いらしい。


うーん・・・よく分からない。

参考：[Man page of BASH_BUILTINS](http://linuxjm.sourceforge.jp/html/GNU_bash/man1/builtins.1.html)
