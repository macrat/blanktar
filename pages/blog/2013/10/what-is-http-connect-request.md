---
title: うちのapacheにCONNECTとかいうリクエストが。
pubtime: 2013-10-01T23:17:00+09:00
tags: [Web, Apache, セキュリティ]
description: apacheのアクセスログにCONNECTメソッドを使った攻撃が来ていたので、何をしようとしていたのかを調べてみました。
---

このサイトのアクセスログを見ていたら、こんな記録が。
```
xxx.xxx.xxx.xxx - - [01/Oct/2013:04:31:25 +0900] "CONNECT tcpconn2.tencent.com:443 HTTP/1.1" 405 1992
```
このリクエストは何なんだ、というお話。
※一応IPアドレスは伏せてます。あんま意味ないだろうけれど。

httpの**CONNECT**とは、代理接続を要求するメソッドのようです。
プロキシに接続を要求するときに使うみたいね。

で、**tcpconn2.tencent.com**について。
テンセントってのは、中国のインターネット関連の会社だそうな。
てゆかアレですよ、有名なインスタントメッセンジャーの**QQ**の会社。
tcpconn2.tencent.comっていうのはそのQQのサーバーらしい。
tcpconn、tcpconn2、tcpconn3・・・と来て、tcpconn6まであるみたい。

つまり、だ。
QQにアクセスするためのプロキシとして使おうとした、ということみたい。
しかしまあ、なんでまた・・・。

---

参考：
- [[Studying HTTP] HTTP Method](http://www.studyinghttp.net/method#CONNECT)
- [テンセント - wikipedia](http://ja.wikipedia.org/wiki/%E3%83%86%E3%83%B3%E3%82%BB%E3%83%B3%E3%83%88)
- [文章詳情 - 迅捷网絡](http://www.fastcom.com.cn/Service/detail?d=48&t=0) (QQが使うサーバーのリスト。ただし中国語。)
