---
title: startxした時にtimeout in lockingとか言われる
pubtime: 2013-02-27T22:26:00+09:00
tags: [Linux, X11, 環境構築]
description: "X11を起動するべくstartxしたときに、「xauth: timeout in locking authority file」と言われるエラーを修正する方法です。"
---

なんだかわからないけどXが立ち上がらなくなりまして。
いや、立ち上がるんだけど、黒い画面のままなのね。

startxしたときの出力をみてみると
```
xauth:  timeout in locking authority file /home/xxx/.Xauthority
```
みたいなエラーが何度か出てる。

調べてみると、パーミッション関係のエラーらしいね。
という訳で.Xauthorityのパーミッションを600に設定、してもダメだった。

結局、
``` shell
$ rm .Xauthority-*
$ :> .Xauthority
$ chmod 600 .Xauthority
```
みたいにしたら直りました。

一行目はなんか余計に生成されちゃった（？）ファイルの削除。<br />
二行目で.Xauthorityの中身を空にして<br />
三行目でパーミッションの設定を行なっています。

しかし、なんで唐突にこんなんが起きたのやら・・・間違えてなんかやっちゃったかな・・・。

参考： [ふかふかの部屋 - TSR - ネットワーク関連](http://www1.plala.or.jp/fukafuka/trouble/network.html#24)
