---
title: apache2でURLの最後のスラッシュの省略をさせない
pubtime: 2014-01-03T19:47:00+09:00
amp: hybrid
tags: [Apache, httpd.conf, .htaccess, URL, リダイレクト]
description: Apacheで立てたWebサーバで、ディレクトリ名の末尾のスラッシュを強制するための設定の方法です。
---

<PS date="2014-02-11" level={1}>

もっとシンプルな方法がありました。
<a href="/blog/2014/02/apache-directory-slash">パス末尾のスラッシュを強制するapacheの設定</a>

</PS>

あけおめですよ。新年一発目の技術系のpostで御座います。
内容としては [apache2のhttpd.confでURLの正規化をやってみたメモ。](/blog/2013/03/apache-url-normalization) の発展というか、一部です。そちらもどうぞ。

うちのブログのインデックス1ページ目やworksのページ群は大体がディレクトリ名でアクセスできるようになっております。

具体的には
```
http://blanktar.jp/blog/
```
でブログを見る事ができたり、
```
http://blanktar.jp/works/
```
で公開しているものの一覧を見る事ができたり。

けれど1つ問題があって、
```
http://blanktar.jp/blog
http://blanktar.jp/works
```
でもアクセス可能で、しかもグーグルさんなんかは別のURLとして扱っているようなのです。

これはSEO上よろしくない。
見た目も宜しくない。

なので、これを改善してみました。

httpd.confなり.htaccessなりに
``` apache
RewriteEngine on
RewriteRule ^(.*/[^./]+)$ $1/ [R=301,L]
```
という行を追加します。

こうすることで、スラッシュなしでアクセスした場合はスラッシュを付けた方へリダイレクトしてくれる、はず。
ちなみに、最後のスラッシュ以降にドットが含まれている場合は無視します。
そうやって.htmlファイルを無視するようにしているわけね。
