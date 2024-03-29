---
title: apache2のhttpd.confでURLの正規化をやってみたメモ。
pubtime: 2013-03-27T21:02:00+09:00
modtime: 2014-01-03T19:47:00+09:00
tags: [Web, Apache, サーバ]
description: 「/index.html」へのアクセスを「/」に転送するような、URLの正規化をApache2で行なう方法です。
---

<ins date="2014-01-03T19:47:00+09:00">

# 2014-01-03 追記

- [ドメインを移行する方法](/blog/2013/12/apache-domain-change)
- [URLの最後のスラッシュを省略させない方法](/blog/2014/01/apache-path-last-slash)

も書きました。そちらもどうぞ。

</ins>

`http://blanktar.dip.jp/`<br />
`http://blanktar.dip.jp/index.html`

上記はどちらもこのサイトのトップページへのリンクです。

さて、上下どっちを使おうか、みたいの。めんどくさいじゃん。
同じ場所を示すのに複数アドレスがあるのは宜しくない。
精神衛生上だけじゃなくて、SEOとかにも良くないらしい。

という訳で、**URLの正規化**ってのをやってみました。

具体的に何をするのかって言うと、`blanktar.dip.jp/index.html`にアクセスが来たら、`blanktar.dip.jp/`に飛ばしちゃおうぜ、みたいな感じ。
最初に書いたアドレスのどっちにアクセスしても、index.htmlが付いてない方に転送されるはずです。そんな感じのことね。

というわけで、htaccessを・・・ってんじゃつまらない。
速度遅いらしいし、なんかドキュメントルート以下に置くってのが嫌だ。

なので今回は`httpd.conf`を使って参ります。
人によっては`00_default_vhost.conf`とか、そんな感じの名前かも。

``` apache
<VirtualHost *:80>
    ServerName blanktar.dip.jp:80

    #  ----- 簡単に指定するバージョン -----
    #  /index.html
    # にアクセスが来たら
    #  /
    # に転送する。
    Redirect 301 /index.html /


    #  ----- 正規表現を使うバージョン -----
    # mod_rewriteを有効に（？）する
    RewriteEngine on

    #  なんたらかんたら/index.html
    # にアドレスにアクセスが来たら
    #  なんたらかんたら/
    # に転送する。
    # ^/(.*)/index.html$ としないのは、http://example.com/index.htmlに対応するため。
    RewriteRule ^(.*)/index.html$ $1/ [R=301,L]
</VirtualHost>
```
みたいな感じに設定。もちろんURLは適時変えていただいて。

ページ数が少ないなら上の簡単なバージョンのがいいのかな？　わかりやすいし。
とはいえ、正規表現で一括してやっちゃったほうが便利だよね。

新しいサイトに移転する時は、リダイレクト先のアドレスをそのまんま移転先のアドレスにすればいいみたい。

具体的にはこんな感じ。
``` apache
Redirect 301 / http://example.com/

RewriteRule ^/(.*)$ http://example.com/$1
```

ちなみに、mod_rewriteを使うなら
``` apache
RewriteRule ^/old/(.*)$ /new/$1 [R=301,L]
# /old/ 以下へのアクセスを /new/ にリダイレクト

RewriteRule ^/([a-zA-Z]+)/([0-1])/$ /example.cgi?a=$1&b=$2 [R=301,L]
# /abc/1/  ->  /example.cgi?a=abc&b=1
# /def/5/  ->  /example.cgi?a=def&b=5
```
みたいな高度なことも出来るみたいね。
