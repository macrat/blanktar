---
title: express4でPOSTメソッド使おうとしたらbodyDecoderもbodyParserも無かった。
pubtime: 2014-12-15T11:47:00+09:00
tags: [Web, Node.js]
description: node.js/express4でPOSTメソッドを受けとって、bodyの中身を読み取る方法です。
---

express4でpostメソッド使ってみようと思った。
思ったので調べて試してみたのだけれど、**bodyDecoder**なんてミドルウェアはねぇよって怒られてしまった。

更に調べてみたら名前が変更になっていたらしいので変更後の**bodyParser**とやらを試したのだけれどこっちも怒られてしまった。

諦めて公式のドキュメントを見に行ったら一瞬で判明。**body-parser**っていう別のモジュールに切り離されていたらしい。

``` shell
$ npm install body-parser
```
でインストール出来た。

テストで書いたコードがこんなの。
``` shell
app.use(require('body-parser')());

app.get('/', function(req, res){
    res.send('<form action="/newroom" method=post><input name=name><input type=submit></form>');
});

app.post('/post', function(req, res){
        res.send(req.body.name);
});
```
`req.body`でアクセスできますよ、ということのようだ。楽でいいね。

しかし、ミドルウェアの名前変わりまくるのなんとかならんのか・・・。

---

参考：
- [senchalabs/connect · GitHub](https://github.com/senchalabs/connect#middleware)
- [node.js + expressでgetとpostのリクエストパラメタを取得する - 大人になったら肺呼吸](http://d.hatena.ne.jp/replication/20110307/1299451484)
