---
title: nginxでエラーページが表示されない
pubtime: 2014-03-06T23:12:00+09:00
tags: [Web, Nginx, サーバ]
description: nginxを試していたのですが、上手く404ページが表示されずに"200 OK"が返ってきてしまっていました。この問題への対処方法です。
---

サーバー移行もありかと思ってnginxを試してます。

404ページが表示されなかったので、調査。
トップページが200 OKで返ってきちゃうのよね。OKじゃないっつの。

nginxでのエラーページの設定は
``` nginx
error_page 404 /404.html
```
みたいに書くらしい。

``` nginx
error_page 400 401 402 403 404 /40x.html
```
的なことが出来るそうな。500系をまとめたりすると便利かも。

でも、こいつをセットしても動かない。何故か。
初期設定（ubuntuのapt-getでinstallしたもの） だと、
``` nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
みたいのがある。（コメントは省略してます
なんか、怪しい。

どうやら、こいつはファイルが見つからない時の挙動を設定するものらしい。
`=code`とすればステータスコードを返せるらしいので、書き換えてみた。

``` nginx
location / {
    try_files $uri $uri/ =404;
}
```
こんな感じにしてみた。

とりあえず動いた。
apacheとは随分雰囲気が違って面白いねー。


参考： [nginx連載5回目: nginxの設定、その3 - locationディレクティブ - インフラエンジニアway - Powered by HEARTBEATS](http://heartbeats.jp/hbblog/2012/04/nginx05.html)
