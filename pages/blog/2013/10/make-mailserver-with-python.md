---
title: pythonでテスト用のメールサーバーを建てる
pubtime: 2013-10-23T23:47:00+09:00
tags: [Python, テスト, サーバ, 標準ライブラリ]
description: smtpを使ったアプリケーションのテストのために、pythonを使って簡易的なデバッグ用サーバーを立ち上げる手順です。
---

年賀メールを一斉送信するためのスクリプトを書き始めまして。
テストメールを送る度にgmailに送ってると流石に申し訳ない。かつ、メールボックスがやばい。

という訳で、pythonで簡単にテスト用のメールサーバーを建てる方法。

``` python
import smtpd
import asyncore

smtpd.DebuggingServer(('127.0.0.1', 25), None)
asyncore.loop()
```

以上。
普通に覚えられちゃいそうなくらい簡単。

これを起動しておくと、受信したメールをそのまんま標準出力に書き出します。
いちいちメーラ開いてソース表示して・・・ってやらなくていいって意味でも便利。

参考: [ダミーsmtp by Python: Ma note](http://m97087yh.seesaa.net/article/122930791.html)
