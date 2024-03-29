---
title: node.jsのNunjucksっていうjinja風なテンプレートエンジンを使ってみる
pubtime: 2014-12-09T15:43:00+09:00
tags: [Web, Node.js, ライブラリの紹介]
description: Pythonのjinjaのようなシンタックスで書けるnode.js用のテンプレートエンジン「nunjucks」の使い方の解説です。
---

昨日のお話。[milkcocoa](https://mlkcca.com)というライブラリでチャット作って遊んでいました。
バックエンドのことを一切気にせずにリアルタイム通信ができるのは確かに素晴らしいのだけれど、でも気になっちゃうんだよね、バックエンドが。もっとこうしたい、ああしたい、つって。

仕方が無いのでsocket.ioを自分で触ろうか。ならnode.jsか。
というわけで勉強してみることにしました。

node.jsにはテンプレートエンジンが色々あるそうで、有名所だとEJSやJadeあたりっぽい？
webappなんてflaskくらいしか使ったこと無い私はjinja2の書き方に慣れきってしまって、これで書けないかと思って探してみました。
んでもって見つけたのが**Nunjucks**ってやつ。

# インストール
npmに入っているようなので、普通に
``` shell
$ npm install nunjucks
```
で入りました。なんかエラーっぽい出力が出ていたけれど、動いたからとりあえずよしとする。

# 試してみる
``` javascript
var nunjucks = require('nunjucks');

var template = 'hello, {{ name }}!';

var output = nunjucks.renderString(template, { name: 'world' });

console.log(output);
```
こんな感じのコードを書いて、実行してみる。

実行すると
``` shell
$ node [書いたコードのファイル名]
hello, world!
```
hello worldだけ。

# Nunjucksの構文
ほぼ完全にjinja2と同じっぽい。違いについては[Q&A](http://mozilla.github.io/nunjucks/faq.html#can-i-use-the-same-templates-between-nunjucks-and-jinja2-what-are-the-differences)をご覧ください。英語だけど。

``` jinja2
{{ variable }}
```
で変数にアクセスしたりとか

``` jinja2
{{ list.item }}
{{ list[item] }}
```
で配列とか連想配列にアクセスしたりとか。

``` jinja2
{% if variable == 0 %}
    zero!
{% elif variable < 0 %}
    minus!
{% else %}
    plus!
{% endif %}
```
でif文とか。

``` jinja2
{% for x in list %}
    {{ x }}<br>
{% endfor %}
```
for文もjinjaと一緒。

blockやextends、macroもそのまんまあるみたい。
これは素晴らしい。jinja2用のテンプレートをほぼそのまんま流用できんじゃん。

# Expressと合わせて使ってみる
単体だとwebサイト作る上では不都合なので、**Express.js**と組み合わせて使ってみます。

``` shell
$ npm install express
```
インストールして、

**app.js**とか適当な名前のファイルに以下のコードを記述。
``` javascript
var express = require('express');
var app = express();

var nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoscape: true,
    express: app
});

var count = 0;

app.get('/', function(req, res){
    count++;
    res.render('index.html', { counter: count });
});

app.listen(5000, function(){
    console.log('listening start');
});
```

最後にテンプレートを書く。今回は**views/index.html**に。
``` jinja2
<h1>hello, world!</h1>
access count: {{ counter }}
```

実行すると
``` shell
$ node app.js
listening start
```
こんな感じで止まるはず。

ブラウザを開いて http://localhost:5000/ にアクセスすると、hello worldが表示されるはず。
動きがないとちゃんと機能してるか分からないので、アクセスカウンタ的なものがついてます。

---

参考：
- [Nunjucks](http://mozilla.github.io/nunjucks/)
- [Templating library in node.js similar to Jinja2 in Python? - Stack Overflow](http://stackoverflow.com/questions/18175466/templating-library-in-node-js-similar-to-jinja2-in-python)
