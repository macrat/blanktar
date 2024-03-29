---
title: macのbashでもglobstarを使いたい
pubtime: 2015-08-15T16:25:00+09:00
tags: [Mac, Bash, 環境構築]
description: "`**/*`のようにして再帰的にファイルを指定することが出来るbashのオプション「gblostar」を、Mac OS上でも使用できるようにする方法です。インストールにはHomebrewを使っています。"
---

macのbashはバージョンが古いそうです。色んなものが古いよね、macって。
そんなわけで、新しい機能は使えなかったりします。

`**/*.txt`とかやるとカレントディレクトリ以下の.txtファイルを列挙してくれる**globstar**っていう機能はめちゃめちゃ便利なのですが、これもやっぱり使えません。残念。
というわけで、使えるようにしてみました。

とりあえず、homebrewで新しいbashを入れる。
``` shell
$ brew install bash
```
多分macportsでも入るのでお好みで。

無事bashが入ったら、`/etc/shells`にパスを追記します。
```
$ cat /etc/shells
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
/usr/local/bin/bash
```
多分こんな感じになる。

最後に、ユーザのデフォルトシェルとして設定する。
``` shell
$ chsh -s /usr/local/bin/bash
```
パスワードを聞かれるので、答えたら設定出来るはず。
`non-standard shell`とか言われたら、/etc/shellsの設定が間違っているので確認してください。

設定が完了したらターミナルを再起動してみて、
``` shell
$ echo $BASH_VERSION
```
とかすると、新しいバージョン番号が表示されるはずです。

あとは
``` shell
$ echo shopt -s globstar >> ~/.bash_profile
```
とかでしてお好みの設定をどうぞ。

参考： [&raquo; Get yourself globstar, bash 4 for your Mac terminal Mister Morris](http://mistermorris.com/blog/get-yourself-globstar-bash-4-for-your-mac-terminal/)
