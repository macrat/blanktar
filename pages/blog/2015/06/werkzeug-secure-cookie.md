---
title: WerkzeugのSecureCookieを試してみた。
pubtime: 2015-06-21T16:16:00+09:00
tags: [Web, Python, Werkzeug, セキュリティ]
description: Pythonのflaskのセッションを実装するために使われている"Werkzeug"というライブラリの"SecureCookie"という機能を直接触ってみました。Werkzeug、結構高機能で楽しいです。
---

最近Werkzeugで何か作って遊んでます。何となく低レイヤーっぽいイメージだったので今まで手を付けずにいたのですが、触ってみたら意外と高機能っぽい。

で、今回はそのうちの一つ、SecureCookieとやらを使ってみます。
暗号化されたクッキーを保存してくれるものらしい。
flaskのセッションみたいな感じで、サーバサイドには何も置かずにデータを保存したり出来る。便利そう。

試しに書いてみたコードはこんな感じ。
``` python
from werkzeug.wrappers import Request,Response
from werkzeug.contrib.securecookie import SecureCookie


@Request.application
def app(request):
    if request.path == '/':
        session = SecureCookie.load_cookie(request, secret_key=b'this is password')
        return Response(session.get('last_path'))
    else:
        response = Response('hello')

        session = SecureCookie(secret_key=b'this is password')
        session['last_path'] = request.path
        session.save_cookie(response)

        return response

if __name__ == '__main__':
    from werkzeug.serving import run_simple

    run_simple('localhost', 5000, app)
```
トップページにアクセスすると、前回アクセスしたページを教えてくれます。っても、ブラウザによっては`/favicon.ico`で固定だったりしてつまらないけれど。
ブラウザに設定されたクッキーを確認すると、`"hhwsr1IWDIsZGi1VVaI6IiXrjMg=?last_path=gANYDAAAAC9mYXZpY29uLmljb3EALg=="`みたいなよく分からない値がセットされていると思います。

**SecureCookie**ってクラスが本体。
``` python
>>> SecureCookie(secret_key=b'abc')
```
こんな感じで普通にインスタンス化。
`secret_key`は無くてもインスタンス化できますが、どうせ後で設定しなきゃいけないのでインスタンス化するときに設定する事をおすすめします。

作ったインスタンスは
``` python
>>> s = SecureCookie(secret_key=b'abc')
>>> s['a'] = 1
>>> s['b'] = (1,2)
>>> s
<SecureCookie {'a': 1, 'b': (1, 2)}>
```
みたいな感じで辞書型風に扱うことが出来る。
キーに数値を指定することも出来ますが、シリアライズするときにエラー吐きます。注意。キーは必ず文字列にしましょう。

ちなみに、
``` python
>>> SecureCookie({'a': 1, 'b': (1,2)}, secret_key=b'abc')
<SecureCookie {'a': 1, 'b': (1,2)}>
```
のようにしてクッキーの中身を最初から指定することもできます。

作ったデータは
``` python
>>> s = SecureCookie({'a': 1, 'b': (1,2)}, secret_key=b'abc')
>>> s.serialize()
b'UnEDwvLu0hGIk5h1Zdvjr0RVlEo=?a=gANLAS4=&b=gANLAUsChnEALg=='
```
のようにすれば見れる。見たってしょうがない気もする。

Responseに保存するときは
``` python
>>> r = Response()
>>> s = SecureCookie({'a': 1, 'b': (1,2)}, secret_key=b'abc')
>>> s.save_cookie(r)
```
みたいな感じにする。

`r.headers`を見ると、Set-Cookieヘッダが追加されているのが確認できるはずです。
後はクッキーを設定したResponseを返してやれば、クライアントに設定できる。

クライアントから送られてきたクッキーは
``` python
>>> SecureCookie.load_cookie(request)
<SecureCookie {'a': 1, 'b': (1,2)}>
```
てな感じで受け取る。

初期設定だと保存されるクッキーのキーはsessionになっていますが、`load_key`/`save_key`をするときに
``` python
>>> r = Response()
>>> s = SecureCookie({'a': 1, 'b': (1,2)}, secret_key=b'abc')
>>> s.save_cookie(r)
>>> r.headers
Headers([('Content-Type', 'text/plain; charset=utf-8'), ('Set-Cookie', 'session="UnEDwvLu0hGIk5h1Zdvjr0RVlEo=?a=gANLAS4=&b=gANLAUsChnEALg=="; Path=/')])

>>> r = Response()
>>> s = SecureCookie({'a': 1, 'b': (1,2)}, secret_key=b'abc')
>>> s.save_cookie(r, key='keystring')
>>> r.headers
Headers([('Content-Type', 'text/plain; charset=utf-8'), ('Set-Cookie', 'keystring="UnEDwvLu0hGIk5h1Zdvjr0RVlEo=?a=gANLAS4=&b=gANLAUsChnEALg=="; Path=/')])
```
何かこんな感じで設定できる。

うん、割と便利だ。
ていうか、ほとんどflaskのsessionその物な気がする？
結構楽しいぞwerkzeug。

参考： [Secure Cookie &mdash; Werkzeug Documentation (0.10)](http://werkzeug.pocoo.org/docs/0.10/contrib/securecookie/)
