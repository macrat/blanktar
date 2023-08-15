---
title: メールを見たい？ curlで良いんじゃない？
pubtime: 2016-01-05T17:04:00+09:00
amp: hybrid
tags: [メール, curl, IMAP]
description: curlコマンドはメールを受信するためのIMAPも扱うことが出来るようです。実際に受信や既読マークを付ける方法を試してみました。
---

[ほとんどのエンジニアには解けるパズル２](http://tango-ruby.hatenablog.com/entry/2015/12/28/212010)を解いていたら**curl**が楽しくなってしまったので、curlの勉強をしようと思いまして。
んで色々調べていたら、どうもcurlは**IMAP**も取り扱えるらしい。なんでやねん、と思いつつ試してみたので、やり方をメモ。

今回はgmailで試すのでgmailのアドレスを書いていますが、おそらくIMAPサーバーならどこででも使えます。試してません。

[curlでメールを送信する記事](/blog/2016/01/curl-smtp-mail)もあります。あわせてどうぞ。

# メールの件数を取得する
とりあえず、メールボックスの一覧を取得します。
```
$ curl -u username 'imaps://imap.gmail.com:993'
Enter host password for user 'username':
* LIST (\HasNoChildren) "/" "INBOX"
* LIST (\HasChildren \Noselect) "/" "[Gmail]"
* LIST (\All \HasNoChildren) "/" "[Gmail]/&MFkweTBmMG4w4TD8MOs-"
* LIST (\HasNoChildren \Trash) "/" "[Gmail]/&MLQw33ux-"
--以下略--
```
環境にもよると思いますが、なんかいっぱい出てきます。ずらずら。文字化け(？)は気にしてはいけない。

そしたら、INBOXに入ってるメールの件数を取得してみます。
```
$ curl -u username 'imaps://imap.gmail.com:993' -X 'EXAMINE INBOX'
Enter host password for user 'username':
* FLAGS (\Answered \Flagged \Draft \Deleted \Seen $Forwarded $MDNSent $NotPhishing $Phishing Junk NonJunk)
* OK [PERMANENTFLAGS ()] Flags permitted.
* OK [UIDVALIDITY 123456789] UIDs valid.
* 10051 EXISTS
* 0 RECENT
* OK [UIDNEXT 12345] Predicted next UID.
* OK [HIGHESTMODSEQ 1234567
```
一部適当な数字で置き換えていますが、だいたいこんな出力。
気にすべきは、`10051 EXISTS`ってところ。10051件のメールがあります。わお。

# メールを読む
そしたら今度は、いよいよメールを読んでみます。
```
$ curl -u username --silent 'imaps://imap.gmail.com:993/INBOX;UID=10051;SECTION=TEXT' | nkf
Enter host password for user 'username':
ここからメールの本文。ずらずらと。
```
`--silent`オプションを外すと、ダウンロードの進捗状況が表示されます。無くても良い。
`nkf`はメールをデコードするために使っています。必要無い場合もあるし、別のコマンドにしないといけない場合もあるかも。
`UID=10051`のところで指定している数字がメールの番号で、数字を大きくすると新しい、小さくすると古いメールになります。
`;SECTION=TEXT`を外すとヘッダー込みのデータが、`;SECTION=HEADER`にするとヘッダーのみのデータを取得出来ます。

# 未読/既読の操作
でまあ、こうなると未読メールの一覧も取得したくなるわけです。取得してみます。
```
$ curl -u username 'imaps://imap.gmail.com:993/INBOX' -X 'SEARCH UNSEEN'
Enter host password for user 'username':
* SEARCH 10046 10050
```
こんな感じ。
お察しの通り、表示された番号がメールの**UID**です。さっきのメールを見るコマンドを使えば目的のメールを見ることが出来ます。
取得するだけで既読フラグが付くようで、わりと良い感じです。

既読フラグを操作したいときは**STORE**コマンドで以下のように。
```
$ curl -u username 'imaps://imap.gmail.com:993/INBOX' -X 'STORE 10050 -Flags \Seen'
Enter host password for user 'username':
* 10050 FETCH (FLAGS ())

$ curl -u username 'imaps://imap.gmail.com:993/INBOX' -X 'STORE 10050 +Flags \Seen'
Enter host password for user 'username':
```
大体同じ感じのコマンド。
違うのは`Flags`の前の`+`と`-`だけです。`+`なら既読に、`-`なら未読に。

---

なんでも出来る感じあって良いね、curl。もっときちんと使いこなせるようになりたいものです。

参考： [Curl: Recent IMAP changes](http://curl.haxx.se/mail/lib-2013-03/0104.html)
