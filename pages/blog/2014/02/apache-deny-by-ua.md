---
title: apacheで特定のディレクトリ、特定のUAだけ拒否する。
pubtime: 2014-02-24T20:58:00+09:00
tags: [Web, Apache, セキュリティ]
description: apacheで実行しているWebサーバで、特定のディレクトリに対する特定のユーザーエージェントだけを拒否する方法の解説です。
---

**ZmEu**とかいうユーザーエージェントからの攻撃が最近多くってうざい。
ログを見ている限り、どうやらPHPのみを対象にした攻撃のようです。というか、弱いサーバーを探しているだけ？

うちのサイトはPHP使ってないんだけどね。
被害が出ないとはいえaccess\_logに残り続けるのはやっぱりうざいので、ダミーのファイルを置いてハニーポット・・・は作らないで、アクセスを拒否しつつログにも残さないようにしてみます。

``` apache
SetEnvIf "^$" deny_ua nolog  # User-Agentヘッダはあるんだけど値が設定されていない場合
SetEnvIf "^-$" deny_ua nolog  # そもそもUser-Agentヘッダが無いとこうなるっぽい
SetEnvIf "^ZmEu$" deny_ua nolog

Deny from env=deny_ua

CustomLog /var/log/apache2/access_log combinedio env=!nolog
```
こんな感じにセットしてみた。

してみたあと何日かしてerror\_logを見てみたら、
```
[Mon Feb 24 18:49:15 2014] [error] [client xxx.xxx.xxx.xxx] client denied by server configuration: /path/to/root/directory/errors/403.html
```
こんなのが大量に残ってた。
うーん、これはうざい。
エラーログにアクセス権無いのが問題なんだね。

というわけでさっきのSetEnvIf群のあとに
``` apache
SetEnvIf Request_URI "^/errors/" !deny_ua !nolog
```
こんなのを追加。

そっけない標準のエラーログではなくて、ErrorDocumentディレクティブで設定したファイルが表示されるようになりました。
そしてaccess\_logにも残らない。素晴らしい。error\_logの方には残るから、多分問題ないよね。
