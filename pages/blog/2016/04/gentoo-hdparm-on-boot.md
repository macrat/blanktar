---
title: gentoo linuxで起動時にhdparmの設定を適用する
pubtime: 2016-04-26T20:47:00+09:00
amp: hybrid
tags: [Gentoo, Linux, hdparm, HDD]
description: gentoo linuxでhdparmの設定を自動でするようにして、HDDを使っていないときは勝手にスタンバイに入るようにする方法です。同じコマンドで手動でスタンバイにしたり復帰させたりも出来ます。
---

メインのデスクトップにHDDを入れてみたのですが、動作がうるさくってたまらない。
ゲーム入れたりするのにしか使わない予定なので、普段は止まっていて欲しい。

というときに使うのが、**hdparm**というツールです。
gentooならportageで普通に入ります。OSによっては最初から入ってるかも。
```
# emerge hdparm
```

たとえば、5秒間アクセスが無かったらスタンバイに入る設定は以下のような感じ。
```
# hdparm -S 1 /dev/sda
/dev/sda:
 setting standby to 1 (5 seconds)
```
1のところを2にすれば10秒になるし、10にすれば50秒になります。
スタンバイを無効にしたいときは0に設定すればおっけー。

速攻で止めたいときは以下のような感じ。
```
# hdparm -y /dev/sda
/dev/sda:
 issuing standby command
```
これをやってもアクセスがあれば勝手に起動してくれます。
静かになった。

で、本題。
このままだとOSが再起動すると設定が消えてしまうので、永続化を自分でしなければなりません。

設定ファイルが`/etc/conf.d/hdparm`にあるので、これに例えば以下のように追記する。
``` toml
sda_args="-S 1"
```
`sda`のところを`all`にすれば全てのドライブに適用出来るみたい。

で、**hdparm**のサービスが自動起動するように設定する。
```
# rc-update add hdparm
```

以上、これだけ。
これで再起動しても5秒アクセスが無ければ自動でスタンバイに入ってくれるようになります。

---

参考： [hdparm - Gentoo Wiki](https://wiki.gentoo.org/wiki/Hdparm)
