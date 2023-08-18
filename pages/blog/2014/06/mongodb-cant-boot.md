---
title: MongoDB起動しようとしたら_S_create_c_localeがどうので起動しない
pubtime: 2014-06-08T21:10:00+09:00
tags: [Linux, データベース]
description: MongoDBを起動するときに発生する「_S_create_c_locale name not valid」というようなエラーへの対処方法です。
---

ウェブサービス作ることになって、データベースにMongoDBを使うことに。
ってことでgentooにportageでインストールしたのだけれど、起動しない。

ログ見てみると、
```
[initandlisten] exception in initAndListen std::exception: locale::facet::_S_create_c_locale name not valid, terminating
```
とかいうのが。あやしい。

調べてみると、どうやらロケールの問題らしい。
``` shell
$ export LANG=C
$ mongod
```
ってしてみると問題なく起動。

参考: [Piermaria Cosina : Mongo error exception in initAndListen std::exception: locale::facet::_S_create_c_locale name not valid, terminating](https://coderwall.com/p/ssl7la)
