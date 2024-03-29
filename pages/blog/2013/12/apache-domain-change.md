---
title: apacheのmod_rewriteでドメインの移行
pubtime: 2013-12-25T22:57:00+09:00
tags: [Web, Apache, サーバ]
description: ドメイン移行しました！ apacheのmod_rewriteを使って、新しいドメインに正規化する（転送する）方法の説明です。
---

メリークリスマス！ ドメイン移行しました！

`blanktar.dip.jp` -&gt; `blanktar.jp`

dipが消えました！ どうでもいいね！
www.blanktar.jp でも繋がるようになったのが大き・・・くないか。どうでもいいね。

で、現在、blanktar.dip.jp にアクセスすると blanktar.jp に飛ばされるようになっています。
同様に www.blanktar.jp にアクセスしても飛ばされます。

こういうドメインの正規化をやってみよう、というお話。
ドメイン以下の/なんたらの部分については[URLの正規化をやったときの記事](/blog/2013/03/apache-url-normalization)をどうぞ。

前回と同じ**httpd.conf**なり**00_default_vhost.conf**なりに
``` apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^old-url.com [NC]
RewriteRule ^(.*)$ http://new-url.com [R=301,L]
```
のようなことを記述します。
こうすると、old-url.comへの全てのアクセスがnew-url.comに飛ばされるように。

当然だけれど、バーチャルホストの関係でアクセスが来ない場合は全く意味がありません。
古いドメインもしばらく取っておかないとダメだしね。

ちなみに。
**RewriteCond**というのは次の行に書かれたRewriteRuleを有効にする条件（？）らしいです。
HTTP_HOSTの値が^old-url.comに一致すれば、次のRewriteRuleを有効にしますよ、的な。
ドメイン名だけでなくUAとかリファラとかクッキーとか、ものすごい色々なものに対応してるっぽい。
興味があったら調べてみてください。

参考: [ApacheウェブサーバーのRewrite設定で使える正規表現サンプル集 | Web担当者Forum](http://web-tan.forum.impressrd.jp/e/2010/01/05/6369)
