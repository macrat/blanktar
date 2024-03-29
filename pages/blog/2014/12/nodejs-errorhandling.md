---
title: node.jsで404と500のエラー処理
pubtime: 2014-12-10T10:40:00+09:00
tags: [Web, Node.js, JavaScript]
description: node.js/expressで404や500などのHTTPエラーが発生した場合のレスポンスをカスタマイズする方法です。
---

[昨日](/blog/2014/12/nodejs-nunjucks)に引き続き<strong>node.js</strong>触ってます。
socket.ioとかと親和性が高くて素敵。なんですが、なぜかエラー処理の情報が少ないんですよね。
そんな状態で公開できるかってことで（いや多分普通はnginxとかで処理するんだろうけど）、調べてみました。

# サンプル
とりあえず動くコードから。

``` javascript
var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.end('hello, world');
});

app.get('/err', function(req, res){
    res.end(hoge);  // hogeなんて変数はないのでエラー。
});

app.use(function(req, res, next){
    res.status(404);
    res.end('my notfound! : ' + req.path);
});

app.use(function(err, req, res, next){
    res.status(500);
    res.end('my 500 error! : ' + err);
});

app.listen(5000, function(){
    console.log('listening start');
});
```
こんな感じ。

`/`と`/err`だけが定義してあって、`/err`にアクセスすると500エラー、定義してないところにアクセスすると404エラーが出ます。

テンプレート書くのが面倒くさかったので`res.end`を使ってますが、普通に`res.render`でもおっけーです。

# 404エラー
そんなアドレスねぇよってとき。

他のパス（=存在するアドレス）に関する処理を書きおわったあとで
``` javascript
app.use(function(req, res, next){
    res.status(404);
    res.end('my notfound! : ' + req.path);
});
```
みたいなことを書けばおっけー。

他のパスに関する処理を書く前に書いちゃうと、どのページにアクセスしても404って言われるようになるので注意。

# 500エラー
サーバー内でエラーがあったとき。

こちらも他のパスの処理が終わった後の
``` javascript
app.use(function(err, req, res, next){
    res.status(500);
    res.end('my 500 error! : ' + err);
});
```
ってやつです。

これについてはちょっと癖があって、例えば`/err`の処理が
``` javascript
app.get('/err', function(req, res){
    setTimeout(function(){
        res.end(hoge);  // hogeなんて変数はないのでエラー。
    }, 100);
});
```
とかになってると処理できません。コールバック関数とかまで面倒見てくれないみたい。

参考：
[Express.js Custom Error Pages – 404 and 500 - HACK SPARROW](http://www.hacksparrow.com/express-js-custom-error-pages-404-and-500.html)
[Future is now: [node.js + express]存在しないURLへのリクエストに対して404エラーページを表示させる](http://future-is-now-k02.blogspot.jp/2012/11/nodejs-expressurl404.html)
