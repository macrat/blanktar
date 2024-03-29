---
title: メールを送ろう。curlで。
pubtime: 2016-01-05T17:36:00+09:00
tags: [curl, メール, コマンド]
description: curlコマンドはメールの送信のために使われるSMTPも扱うことが出来るようです。実際にメールを作成して、curlで送信してみました。
---

[curlを使ってメールを受信](/blog/2016/01/curl-imap-mail)するのを試したので、今度は送信をやってみます。**SMTP**ってやつですね。

とりあえず、送信する文章を作ります。
```
$ cat mail.txt
To: send-to@example.com
From: send-from@example.com
Subject: this is a test

hello world!
```
こんなやつ。
最低限このくらいのヘッダを入れておくことをおすすめしますが、ヘッダ無しで本文だけ書いちゃっても送信出来ます。

で、送信します。
``` bash
$ curl smtps://smtp.example.com:465 --mail-from 'send-from@example.com' --mail-rcpt 'send-to@example.com' -u username -T mail.txt
```
こんな感じ。

gmailの場合はfromアドレスを宜しくやってくれるので、もう少し簡単に以下のように送信出来ます。
``` bash
$ curl smtps://smtp.gmail.com:465 --mail-rcpt 'send-to@example.com' -u username -T mail.txt
```
他のサーバーでは試していませんが、多分省略出来るところもあるはず。

標準入力から内容を指定することも可能で、その場合は以下のようにします。
``` bash
$ <mail.txt curl smtps://smtp.example.com:465 --mail-from 'send-from@example.com' --mail-rcpt 'send-to@example.com' -u username -T -
```

シェルスクリプトなんかに組み込む場合は以下のようにしてパスワードも書いちゃうと良いかも。
``` bash
$ <mail.txt curl smtps://smtp.example.com:465 --mail-from 'send-from@example.com' --mail-rcpt 'send-to@example.com' -u username:password -T -
```
勿論、取り扱いには十分注意、です。

ちなみに何も考えずに日本語を指定したところ、なんとなく受信に成功しました。受信するサーバーやクライアントによっては大丈夫なようです。
ただ、マルチバイトのデータを送るのはあまりお行儀が宜しくないのでほどほどに。出来ればちゃんとエンコーディングしましょう。面倒臭いけれどね。
