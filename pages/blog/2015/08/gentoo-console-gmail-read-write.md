---
title: gentooでコンソールからgmailを読み書きする
pubtime: 2015-08-30T21:12:00+09:00
tags: [Linux, Gentoo, メール, コマンド]
description: linuxのコンソールからメールを扱うためのコマンド「ssmtp」と「fetchmail」の紹介です。
---

webメールが便利すぎて久しくローカルなメールクライアントというものに触れていない私ですが、ふとコンソールでメールを読んでみようじゃないかと思ったりしまして。
試してみたので記録しておきます。送信は上手く行きましたが、受信はなんか、とても不満な結果に終わっております。
gentooと銘打ちましたが、だいたいどんなlinuxでも使える気がします。パッケージマネージャが違うだけですね。

# 送信
とりあえず簡単そうな送信から。
送信には**ssmtp**というツールを使います。

インストールはシンプルに
```
# emerge ssmtp
```
これだけで入る。
他のsmtpサービスが入っているとそいつが消されたりするみたい。

インストールが出来たら`/etc/ssmtp/ssmtp.conf`にある設定ファイルを編集。
``` toml
AuthUser=username@gmail.com
AuthPass=here is password
FromLineOverride=YES
mailhub=smtp.gmail.com:587
UseSTARTTLS=YES
```
こんな感じ。`AuthUser`と`AuthPass`は環境に合せてください。

sendmailとかが生きていると問題が起こるらしいのできちんと止めてください。

で、これだけで完了。
デーモンとかいう類のものではないらしいので、なんとそのままで動きます。
```
$ echo 'hello world' | mail -s 'subject' mailto@example.com
```
こんなもんで送信出来ます。便利だ。
なんの警告もなく送られるので宛て先とかよく確認してから送ってください。

参考： [How To Use Gmail Account To Relay Email From a Shell Prompt](http://www.cyberciti.biz/tips/linux-use-gmail-as-a-smarthost.html)

# 受信
受信には**fetchmail**で。
クラシックながらIMAP対応してたりして良い感じ。

```
# emerge fetchmail
```
これまたシンプルにインストール出来る。

設定ファイルは`~/.fetchmailrc`にあるので、編集。というより作成。
```
poll imap.gmail.com protocol imap
    username "username" is "localuser" here
    password "here is password"
    mda "/usr/bin/procmail"
    keep
    ssl
```
こんな感じ。そのままだと他のユーザからパスワードとか見えてしまうのでパーミッションに気を付けて。
`is "localuser" here`の部分はPCのユーザ名を指定します。

`mda`ってやつでMDAを指定していますが、つまりMDAが必要ということです。既にセットアップしてあれば良いのですが、無ければ適当にインストール。
```
# emerge procmail
```

procmailの設定ファイル`~/.procmailrc`はとりあえず以下のような感じに。
``` toml
MAILDIR = $HOME/.maildir/
DEFAULT = $MAILDIR
LOCKFILE = $MAILDIR/.lock
```
どうやらここで迷惑メールのフィルタリング設定も出来るそうですが、面倒なので何もしません。

もろもろ設定が終わったら、以下のコマンドでメールを受信します。
```
$ fetchmail
```
こんな感じ。
たぶん、何も届きません。未読メールしか受信しないようです。
既読のメールも受信したい場合は設定ファイルに`fetchall`というのを付ければ良いのですが、メールの数に要注意。ものすごい数届いたりすることになると思います。
かといって`fetchlimit`ってオプションで制限掛けると古いものから受信しやがったりして、どうしたら良いんだろうこれ…。

まあとにかくどうにかして受信したら、`mail`コマンドでメールを閲覧できます。
細かい使い方がまったく分からないので解説は書かずにおかせてください。
とりあえず、`mail`で起動、左の方に表示されている番号を入力してエンターで閲覧。のようです。

で、まあここで困るのが、ヘッダーごと表示しちゃうからMIMEがパースされず、iso-2022-jpはそのままASCIIとして表示され…見ていられない有様になってしまいます。
もうちょいモダンなツールを使えよと、そういうことなのかもしれません…。

参考：
- [Using Fetchmail to Retrieve Email - Linode Guides & Tutorials](https://www.linode.com/docs/email/clients/using-fetchmail-to-retrieve-email)
- [fetchmailを使ってGmailのメールをダウンロードする - mteramotoの日記](http://d.hatena.ne.jp/mteramoto/20091115/p1)
- [Procmailの設定](https://www.rcnp.osaka-u.ac.jp/Divisions/CN/computer/ibm/manual/procmail/setting_procmail.html)

## 余談： メールの受信を通知するスクリプト
fetchmailは受信したメールをMDAのコマンドに引き渡すわけですが、この受け取る側のコマンドを自作してみました。

``` bash
#!/bin/sh

IFS=$'\n'
set -- `nkf | grep -e 'From:\|Subject:' | sed -e 's/^.*: //'`
notify-send "${2:-no title}" "$1"
```
受け取ったメールのヘッダをなんとなく解析して`notify-send`に渡す。
これを適当なところに保存して、chmodで実行権限を付与。
そしたら、`~/.fetchmailrc`のmdaオプションに作ったスクリプトのファイルパスを指定。

無事設定が出来たら、`fetchmail`を実行すると未読メールのタイトルと送信者を通知してくれます。結構便利かも？
ちょっと、というかかなり困るのは、フェッチすると既読扱いになってしまうことですかね…。せっかくのIMAPが…orz
