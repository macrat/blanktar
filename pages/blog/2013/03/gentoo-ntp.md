---
title: gentooでntpを使ってみた話
pubtime: 2013-03-27T01:14:00+09:00
tags: [Linux, Gentoo, サーバ, 環境構築]
description: gentooでntpの設定をしてみました。ntpdのプロセスを用意するのは嫌だったので、cronから定期的にntpdateを呼び出す形式にしています。
---

ネットブックの時計がずれてたんで、時計を合わせ・・・るのってめんどいよね。
YYYYMMDDみたいな形式ならともかく、dateコマンドがめんどくさいのなんのって・・・。

そもそもいちいちやること自体めんどいので、ntpを入れてみた。

まずはインストール。
``` shell
$ sudo emerge net-misc/ntp
```
以上。

ntpdを使ってもいいのだけれど（というか多分そっちのが正しい）、私はntpdateを使います。
何故か。プロセス増やしたくないから。
わざわざプロセス立てなくても、anacronから呼べばいーじゃん、みたいな。

という訳で、`/etc/cron.weekly/setclock`に
``` bash
#!/bin/sh

ntpdate -s ntp.nict.jp gpsntp.miz.nao.ac.jp
```
みたいなファイルを追加。

この場合は週に一回しか問い合わせないので、まあ適時お好きなように。

これで時計合わせの面倒から開放される、はず。
このへんの作業をしなくていい、って意味ではwindowsに軍配かもねぇ。
ま、自由なgentooのがやっぱり楽しいけれど。

ちなみに。
途中で
```
Can't find host ntp.nict.jp gpsntp.miz.nao.ac.jp: Name or service not known (-2)
```
みたいなエラーに遭遇しまして。

どうやら、ホスト名の所を"でくくっちゃダメみたいね。

具体的に言うと、
``` shell
$ ntpdate -s "ntp.foo.jp ntp.bar.jp"
```
だとダメで、
``` shell
$ ntpdate -s ntp.foo.jp ntp.bar.jp
```
ならおっけー。
要注意、かもです。
