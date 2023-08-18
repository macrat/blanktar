---
title: apacheのmod_rewriteでSSL通信を強制する。
pubtime: 2014-01-10T00:00:00+09:00
tags: [Web, Apache, サーバ, セキュリティ]
description: Apacheのmod_rewriteモジュールを使って、特定のページ（あるいは全てのページ）でSSL通信を強制させる設定の方法です。
---

ログインが必要なサイトを作っていると、このページはSSLを強制したい、みたいのがあるじゃないですか。
いや、うちは全く関係ないんですけれどね。
そういうサイトをいじらせてもらう機会があったので、メモ。

mod\_rewriteについては [apache2のhttpd.confでURLの正規化をやってみたメモ。](/blog/2013/03/apache-url-normalization) なんかもどうぞ。

全部のURLで転送したい場合、**httpd.conf**か**.htaccess**に
``` apache
RewriteEngine on
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://example.com/$1 [R=301,L]
```
こんな感じで書けばおっけー。

お察しの通り、特定のURL（ここでは/login.html）だけなら
``` apache
RewriteEngine on
RewriteCond %{HTTPS} off
RewriteRule ^/login.html$ https://example.com/login.html [R=301,L]
```
となります。
普通の転送と同じ感じやね。

最近apacheネタばっかな気がするなぁ・・・。
