---
title: シェルで"昨日"みたいな相対的な日付が欲しい
pubtime: 2015-01-17T08:57:00+09:00
amp: hybrid
tags: [シェルスクリプト, 日付, date]
description: dateコマンドを使って、「昨日」や「n日前」、「n時間後」といった相対的な日時を取得する方法です。
---

シェルスクリプトで昨日の日付とか、n日前の日付が必要になりまして。

自前で計算すると面倒くさいし、なんかないかと思って`date --help`を見ていたら「display time described by STRING, not 'now'」なんてかなりそれっぽい記述が。
引数は`-d STRING`か`--date=STRING`らしい。

試してみた。
``` shell
$ date
2015年  1月 17日 土曜日 08:53:41 JST
$ date -d yesterday
2015年  1月 16日 金曜日 08:53:55 JST
```
おお、これはいい。

```shell
$ date -d -1day
2015年  1月 16日 金曜日 08:53:58 JST
$ date -d 1hour
2015年  1月 17日 土曜日 09:54:09 JST
```
結構いろいろあるようだ。

``` shell
$ date -d 2010-01-01
2010年  1月  1日 金曜日 00:00:00 JST
```
表示形式を変換する用途にも使えそう。

``` shell
$ date -d yesterday +%%Y%%m%%d
20150116
```
表示形式の指定ももちろん可能。

結構便利っぽいぞ、このコマンド？
