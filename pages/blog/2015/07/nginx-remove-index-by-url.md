---
title: nginxでURLの最後にindex.htmlを付けさせたくない。
pubtime: 2015-07-27T23:07:00+09:00
tags: [Web, Nginx, サーバ]
description: Nginxで配信しているWebサイトで、`/hoge/index.html`ではなくて`/hoge/`でアクセスさせるための設定の方法です。
---

webサイトのインデックスページには`/hoge/`みたいなアクセスの仕方と、`/hoge/index.html`みたいなアクセスの仕方があります。
二通りもあるってなんかキモチワルイよね。というわけでindex.html無しの方に統一。

nginx.confだか何だかを開いて、`server`の中に以下を記述。
``` nginx
if ($request_uri ~ ^.*/index.html$){
    rewrite ^(.*)/index.html$ $1/ permanent;
}
```
以上、これだけ。

同じような正規表現が二つ書いてあってこれはこれでキモチワルイけれど、まあ動いているのでよしとしましょう。もっと良い書き方があったら教えてください。
