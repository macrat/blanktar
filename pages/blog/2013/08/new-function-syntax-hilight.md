---
title: シンタックスハイライトに対応してみた。
pubtime: 2013-08-08T02:54:00+09:00
modtime: 2020-03-22T02:05:00+09:00
tags: [コマンド, Blanktar.jp]
description: このブログでもついにシンタックスハイライトに対応しました。そのために使用した「source-highlight」というツールの使い方の解説です。
---

このブログはコードばっか書いてるので、シンタックスハイライト出来ないのは悲しいよね。
``` python
print "ということでハイライト出来るようにしましたどーん。"
```
ま、ソースに手を加えにゃあかんので過去記事はまだ一部しか対応してないけれど。

<ins date="2020-03-22">

# 2020-03-22 追記

執筆当時の環境からブログシステムを刷新したので、ここの表示結果と`source-highlight`による出力は異なります。

</ins>

今回使ったのは[**source-highlight**](http://www.gnu.org/software/src-highlite/)というツール。
いろんなソースコードを投げ込むとHTMLとかLATEXとかに変換して出力してくれるという代物。
javascriptで動的に、とかじゃないから表示が早くていいねー。

ということで、覚書程度に使い方をメモっておくよ。
``` shell
$ source-highlight ソースコード
```
とするか、
``` shell
$ source-highlight -i ソースコード -o 出力.html
```
とするのが基本の使い方。

前者なら**ソースコード.html**に、後者なら**出力.html**に書きだされます。

標準出力に出したい場合は
``` shell
$ source-highlight -i ソースコード -o STDOUT
```
とすればおっけー。

標準入力は普通にパイプで渡せばいい・・・のだけれど、入力ファイルの種類を指定しなきゃいけません。
上記の例みたいに省略された場合は拡張子から判断するみたいね。
で、その標準入力を使う場合は
``` shell
$ echo "print 'hello, world'  # comment" | source-highlight -o STDOUT -s python
```
みたいな感じ。
`-s python`ってのが種類の指定。

使える言語の一覧は
``` shell
$ source-highlight --lang-list
```
で見れます。めっちゃいっぱい。
