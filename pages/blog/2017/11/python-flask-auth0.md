---
title: Auth0を使ってPython/Flaskで手軽に多機能なログイン/ログアウトを実現する
pubtime: 2017-11-25T19:16:00+09:00
tags: [Python, Flask, セキュリティ]
description: Auth0を使って、Python/Flaskで実装したWebサイトにGoogleやTwitterなどのソーシャルアカウントを使ったログインやSSO、パスワードレスログインなどを実現する方法です。
---

[Auth0](https://auth0.com)という認証/認可サービスのワークショップに参加してきました。
Node学園祭2017の二日目のワークショップなのですが、この記事はNodeじゃなくてpythonです。ごめんなさい。

Auth0は色々な言語/環境でログイン/ログアウトの機能を簡単に実現するためのサービスです。
あらゆるソーシャルアカウント（ソーシャルじゃないやつもある）と繋がってシングルサインオンを簡単に実現出来たりとか、スマホやメールを使ったパスワードレスも出来たりとか、かなり万能な感じです。
しかも、それらの機能を全て遮蔽してくれているので、基本的な対応さえすればあとは全て管理ページをマウスでポチポチ操作するだけで色んなことが出来ます。すごい。

全部繋げたサンプルは記事の一番下にあります。

#  クライアントを作る
まずは、[Auth0の管理ページ](https://manage.auth0.com)でクライアントを作成します。

左側のメニューから[Clients](https://manage.auth0.com/#/clients)に移動して、「CREATE CLIENT」を選んで新しいクライアントを作ります。
名前は適当に、client typeは「Regular Web Applications」を選んでください。

クライアントが出来たら、Settingsに移動して**Allowed Callback URLs**と**Allowed Logout URLs**を設定します。
Callback URLはログインの時に使うアドレスで、今回は`http://localhost:5000/callback`を追加してください。
Logout URLはログアウトした後にリダイレクトする先のアドレスです。こちらは`http://localhost:5000/`を追加してください。

# 必要なライブラリを入れる
``` shell
$ pip install flask flask_oauthlib python-jose
```

基本的にはこれだけ。

# Flaskの準備
いつものappを作るやつです。

``` python
import flask


app = flask.Flask(__name__)
app.secret_key = '??????????'
```

`??????????`の部分はCookieの暗号化に使うキーです。何か適当な文字列にしてください。

# Auth0と繋ぐための準備
次に、必要な変数の定義とかをします。
Auth0とはoauthでやりとりするので、主にそのあたりの設定になります。

``` python
import flask_oauthlib.client


AUTH0_CLIENT_ID = '??????????'
AUTH0_CLIENT_SECRET = '??????????'
AUTH0_DOMAIN = '??????????.auth0.com'


oauth = flask_oauthlib.client.OAuth(app)
auth0 = oauth.remote_app(
    'auth0',
    consumer_key=AUTH0_CLIENT_ID,
    consumer_secret=AUTH0_CLIENT_SECRET,
    request_token_params={
        'scope': 'openid profile',
        'audience': 'https://{}/userinfo'.format(AUTH0_DOMAIN),
    },
    base_url='https://{}'.format(AUTH0_DOMAIN),
    access_token_method='POST',
    access_token_url='/oauth/token',
    authorize_url='/authorize',
)
```

定数部分は先ほど作ったクライアントのSettingsに書いてある情報で置き換えてください。

# ログイン部分を作る
手始めに、ログインに必要なページを作っていきます。

最初はログインページです。正確には、ログインページにリダイレクトするページです。
``` python
@app.route('/login')
def login():
    return auth0.authorize(callback=flask.url_for('auth_callback', _external=True))
```

もう一つ必要なのが、ログインページから戻ってくる先、コールバックです。
``` python
import urllib.request


@app.route('/callback')
def auth_callback():
    # Auth0がくれた情報を取得する。
    resp = auth0.authorized_response()
    if resp is None:
        return 'nothing data', 403

    # 署名をチェックするための情報を取得してくる。
    with urllib.request.urlopen('https://{}/.well-known/jwks.json'.format(AUTH0_DOMAIN)) as jwks:
        key = jwks.read()

    # JWT形式のデータを復号して、ユーザーについての情報を得る。
    # ついでに、署名が正しいかどうか検証している。
    try:
        payload = jwt.decode(resp['id_token'], key, audience=AUTH0_CLIENT_ID)
    except Exception as e:
        print(e)
        return 'something wrong', 403  # 署名がおかしい。

    # flaskのSessionを使ってcookieにユーザーデータを保存。
    flask.session['profile'] = {
        'id': payload['sub'],
        'name': payload['name'],
        'picture': payload['picture'],
    }

    # マイページに飛ばす。
    return flask.redirect(flask.url_for('mypage'))
```

これで、上手くいけばcookieにユーザーの情報を保存することが出来るはずです。
ログイン完了後にマイページに飛ばしていますが、これはあとで用意します。

デフォルトではIDとパスワードを使った認証か、あるいはGoogleのアカウントを使った認証かの二通りが表示されるかと思います。
この辺の設定は[管理ページのSocial Connections](https://manage.auth0.com/#/connections/social)で行なうので、プログラム上では何を使うか気にする必要がありません。

# ログアウト出来るようにする。
ログインが出来たら、今度はログアウトを用意します。

ぶっちゃけ`flask.session`からデータを消せばそれだけでログアウト出来るのですが、ちゃんとお行儀良くAuth0にもログアウトしたことを伝えておきましょう。
Auth0は色々ログを取ってくれているので、これをしておくと色々便利だと思います。たぶん。全く分かっていませんが。
あとは特殊なログイン方法を使うときに必要なのかもしれない？ やっぱり分かっていませんが。

``` python
import urllib.parse


@app.route('/logout')
def logout():
    del flask.session['profile']  # cookieから消す

    # Auth0にも伝える
    params = {'returnTo': flask.url_for('index', _external=True), 'client_id': AUTH0_CLIENT_ID}
    return flask.redirect(auth0.base_url + '/v2/logout?' + urllib.parse.urlencode(params))
```

Auth0に渡すクエリの扱いが煩雑に見えますが、よく見るとわりとシンプルな感じです。

このページにアクセスすると、ログアウト処理をしてから`returnTo`に渡したアドレスにリダイレクトされます。

これで、ログイン/ログアウトに必要な機能を全て用意出来ました。

# トップページとかマイページとか
テストしやすいように、諸々のページを用意します。

まずはプロフィールを表示するマイページ。
``` python
@app.route('/mypage')
def mypage():
    if 'profile' not in flask.session:
        return flask.redirect(flask.url_for('login'))

    return '''
        <img src="{picture}"><br>
        name: <b>{name}</b><br>
        ID: <b>{id}</b><br>
        <br>
        <a href="/">back to top</a>
    '''.format(**flask.session['profile'])
```
ほぼ解説要らずな感じのシンプルな内容ですね。`flask.session`から取ってきているだけです。

そしてトップページ。
``` python
@app.route('/')
def index():
    if 'profile' in flask.session:
        return '''
            welcome <a href="/mypage">{}</a>!<br>
            <br>
            <a href="/logout">logout</a>
        '''.format(flask.session['profile']['name'])
    else:
        return '''
            welcome!<br>
            <br>
            <a href="/login">login</a>
        '''.format(flask.url_for('login'))
```
こちらはもっと単純。

で、いつもの実行部分。
``` python
if __name__ == '__main__':
    app.run(debug=True)
```

# まとめ
これで、ログインとログアウトの実装が出来ました。
Auth0用のライブラリが無いのでわりと手動な部分が多いですが、それでもかなり簡単な感じです。
IDとパスワード使うやつだけだったらともかく、シングルサインオンとか二段階認証とかしたいなら是非とも使うべきという感じですね。

[7,000ユーザーまでは無料](https://auth0.com/pricing)という太っ腹っぷりなので、ちょっと作ってみるくらいならばんばん使っても良さそうです。

# 完成形
最後に、全部繋いだソースコードです。内容はほぼほぼ同じです。

``` python
import urllib.request
import urllib.parse

import flask
import flask_oauthlib.client
from jose import jwt


app = flask.Flask(__name__)
app.secret_key = 'this is secret'


AUTH0_CLIENT_ID = '??????????'
AUTH0_CLIENT_SECRET = '??????????'
AUTH0_DOMAIN = '??????????.auth0.com'


oauth = flask_oauthlib.client.OAuth(app)
auth0 = oauth.remote_app(
    'auth0',
    consumer_key=AUTH0_CLIENT_ID,
    consumer_secret=AUTH0_CLIENT_SECRET,
    request_token_params={
        'scope': 'openid profile',
        'audience': 'https://{}/userinfo'.format(AUTH0_DOMAIN),
    },
    base_url='https://{}'.format(AUTH0_DOMAIN),
    access_token_method='POST',
    access_token_url='/oauth/token',
    authorize_url='/authorize',
)


@app.route('/login')
def login():
    return auth0.authorize(callback=flask.url_for('auth_callback', _external=True))


@app.route('/callback')
def auth_callback():
    resp = auth0.authorized_response()
    if resp is None:
        return 'nothing data', 403

    with urllib.request.urlopen('https://{}/.well-known/jwks.json'.format(AUTH0_DOMAIN)) as jwks:
        key = jwks.read()

    try:
        payload = jwt.decode(resp['id_token'], key, audience=AUTH0_CLIENT_ID)
    except Exception as e:
        print(e)
        return 'something wrong', 403

    flask.session['profile'] = {
        'id': payload['sub'],
        'name': payload['name'],
        'picture': payload['picture'],
    }

    return flask.redirect(flask.url_for('mypage'))

@app.route('/mypage')
def mypage():
    if 'profile' not in flask.session:
        return flask.redirect(flask.url_for('login'))

    return '''
        <img src="{picture}"><br>
        name: <b>{name}</b><br>
        ID: <b>{id}</b><br>
        <br>
        <a href="/">back to top</a>
    '''.format(**flask.session['profile'])


@app.route('/logout')
def logout():
    del flask.session['profile']

    params = {'returnTo': flask.url_for('index', _external=True), 'client_id': AUTH0_CLIENT_ID}
    return flask.redirect(auth0.base_url + '/v2/logout?' + urllib.parse.urlencode(params))


@app.route('/')
def index():
    if 'profile' in flask.session:
        return '''
            welcome <a href="/mypage">{}</a>!<br>
            <br>
            <a href="/logout">logout</a>
        '''.format(flask.session['profile']['name'])
    else:
        return '''
            welcome!<br>
            <br>
            <a href="/login">login</a>
        '''.format(flask.url_for('login'))


if __name__ == '__main__':
    app.run()
```
