---
title: pythonのgeventにAssertionErrorとか言われて詰みかけた話
pubtime: 2014-05-10T23:12:00+09:00
modtime: 2014-05-10T23:21:00+09:00
tags: [Python, gevent]
description: "pythonのgeventで発生する「assert not self.headers_sent」や「TypeError: an integer or string of size 1 is required」とかいうエラーへの対処方法です。"
---

[前回](/blog/2014/05/python-gevent-websocket)に引き続いてgeventのpywsgi。

順調に遊んでいたら、こんなことを言われました。
```
assert not self.headers_sent
AssertionError
```
うーん？ ヘッダーを送ってないよってか？ `start_response`はしたよ？

と思いつつログさかのぼってみたら
```
TypeError: an integer or string of size 1 is required
```
なんて事が書いてあった。
整数か文字か・・・文字列返してるんだけどな・・・。

いろいろ試してみて分かった。

単純にunicode型に対応していないようです、この子。
適当な文字コードにエンコードしてやるとすんなり動きます。

そんなわけで、gevent使うときはエンコードに気をつけましょう。
~~ま、python3.x使えよって話かもしれない。~~

<ins date="2014-05-10T23:21:00+09:00">

# 2014-05-10 追記

適当に書いちゃったけど、geventはpython3.xに対応してないっぽい？

</ins>
