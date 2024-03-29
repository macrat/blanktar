---
title: python/flaskでgoogleにOpenIDでログインしてみた。ライブラリ無しで。
pubtime: 2015-08-17T22:07:00+09:00
tags: [Python, Flask, セキュリティ, Web]
description: Python/flaskを使ってOAuthの仕組みを自分で1から実装して、Googleアカウントを使ったOpenIDログインを試してみました。
---

[昨日公開したwebアプリ](/blog/2015/08/pacem-published)、ハッカソン期間中にはギリギリ間に合わなかったのですが、実は本当はOpenIDに対応させる予定だったのです。
私は結局認証部分には一度も手を付けずに終わってしまったので、すこし挑戦してみようかと。
実用目的ではないので、自前で全て実装してみることにしました。
情報が少なくて苦労しましたが、案外簡単だった。

とりあえず、フレームワークにflaskを使います。ルーティングで手間取りたくないので。あとはpythonの標準ライブラリだけで頑張ります。

# OpenID Connectでの認証の大雑把な流れ
詳しいことは私もよく分かっていないので、本当に大雑把に。

OpenIDを利用するサイト(RPとか呼ばれるそうです)がOpenIDを提供しているサイト(こちらはOPというそうです)に自分の情報をクエリに入れてリダイレクトします。
クライアントからアクセスを受けたOPはログイン画面を出して、ログインした(もしくはキャンセルした)ら、RPのサイトに更にリダイレクトします。
リダクレクトされてきたURLにユーザに関する情報が入っていて、こいつをOPに問い合わせたりしてユーザの情報を取得する、ということらしいです。

やっぱりよく分からないので [第1回　OpenIDサービスを利用して，OpenIDの仕組みを理解する：いますぐ使えるOpenID｜gihyo.jp … 技術評論社](http://gihyo.jp/dev/feature/01/openid/0001) あたりを読んでください。
とりあえず、リダイレクトの連続で事が運ぶのだと、そういうことですね、うん。

# googleでクライアントIDを取得する
googleの[デベロッパーコンソール](https://console.developers.google.com/)に行って、適当にプロジェクトとかいうやつを作ります。なんか本当に適当で大丈夫そうです。
プロジェクトを作ったら、左の方にある「APIと認証」の「認証情報」ってところにある「認証情報を追加」から「OAuth 2.0 クライアント ID」を作ります。
多分サービス名を設定しろ的なことを言われるので、言われた通りにします。

「ウェブアプリケーション」を選んで、「承認済みのリダイレクト URI」とやらに認証に使うURLを入れます。localhostとかも大丈夫です。
この記事では、`http://localhost:5000/login/check`に設定しておきます。

完了すると**クライアントID**と**クライアントシークレット**という二つの文字列が生成されるので、どこかに控えておいてください。（まあでも後からでも見れるのでどっかやっちゃっても平気です）

# ログイン画面を出してみる
クライアントIDを取得できたら、実際にアプリを作り始めましょう。といっても最初にお話しした通り、最初にするのはただのリダイレクトです。

``` python
import urllib.parse

import flask


client_id = '-- デベロッパーコンソールで取得したクライアントID --'
client_secret = '-- こっちはクライアントシークレット --'
redirect_uri = 'http://localhost:5000/login/check'

state = 'this is test'  # 本当はこれはランダム

@app.route('/login')
def login():
    return flask.redirect('https://accounts.google.com/o/oauth2/auth?{}'.format(urllib.parse.urlencode({
        'client_id': client_id,
        'scope': 'email',
        'redirect_uri': redirect_uri,
        'state': state,
        'openid.realm': 'http://localhost:5000',
        'response_type': 'code'
    })))
```
こんな感じにしてみました。

- `https://accounts.google.com/o/oauth2/auth`に諸々のクエリを付けてリダイレクトしています。
- `client_id`, `redirect_uri`なんかは設定/取得したものをそのまま渡します。
- `openid.realm`にはオリジンを渡せば良いっぽい？
- `response_type`には常に`code`を設定します。
- `scope`には欲しいデータを指定すれば良いらしい。profileとかemailとか。スペース区切りで両方も行けます。
- `state`はあとで使いますが、ワンタイムパスのようなものらしいです。乱数を設定してください。でも面倒なのでここでは定数です。

このコードを動かして`/login`にアクセスすると、見慣れたグーグルの画面に転送されると思います。

# アカウントの情報を取得してみる
ログイン画面を出せてログインも(一応は)出来るようになったので、アカウントの情報を取得してみましょう。

ソースコードは増えた部分だけ書きます。結合したものがこの記事の下にあるので、動作確認にはそちらのほうが良いかも。
``` python
import urllib.request
import json
import base64

@app.route('/login/check')
def check():
    if flask.request.args.get('state') != state:
        return 'invalid state'

    dat = urllib.request.urlopen('https://www.googleapis.com/oauth2/v4/token', urllib.parse.urlencode({
        'code': flask.request.args.get('code'),
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }).encode('ascii')).read()

    dat = json.loads(dat.decode('ascii'))

    id_token = dat['id_token'].split('.')[1]  # 署名はとりあえず無視する
    id_token = id_token + '=' * (4 - len(id_token)%%4)  # パディングが足りなかったりするっぽいので補う
    id_token = base64.b64decode(id_token, '-_')
    id_token = json.loads(id_token.decode('ascii'))

    return 'success!<br>hello, {}.'.format(id_token['email'])
```
こんな感じで。
さきほど設定した`state`を冒頭でチェックしています。今回は定数なのでチェックする意味がありませんが、本来はこれで同じセッションかどうか調べたりするようです。

今回はチェックしていませんが、ログインがキャンセルされたなどの問題があった場合は`error`にエラーメッセージが入るそうです。

んで、受け取ったクエリの内、`code`ってやつをグーグルにPOSTで送ります。アドレスは`https://www.googleapis.com/oauth2/v4/token`に。なんかバージョンによって色々あるようですが、たぶんこれが(2015年8月時点では)最新です。
`client_id`, `client_secret`, `redirect_uri`などはデベロッパーコンソールで設定もしくは取得した内容そのままです。
`grant_type`というのはよく分からないのですが、とりあえず`authorization_code`を指定してくれとのことです。

データを送ると、json形式で色々データが返ってきます。同じcodeを使って何度も取得しようとすると**400 Bad Request**が返るみたい。
返ってくるjsonには色々情報が入っているのですが、とりあえず欲しいのは`id_token`というパラメータの中身。

ただこのデータ、**JSON Web Token**とかいう形式でエンコードされています。
署名とJSONデータをbase64エンコードしてピリオドで繋いだものらしいのですが、面倒なので署名は無視します。
ピリオド区切りの二番目のデータが本体らしいのでそこだけ抜き出して、足りないパディングを補ってからbase64デコードします。

デコードしたデータはただのjsonになるので、パースすれば完了。emailアドレスも中に入っているので、そいつを表示させるようにしてみました。
ユーザ情報の取得はさらに別のAPIを叩くことになるそうです。面倒なのでここでは扱いません。

# まとめ
こういうのってなんかやたらと面倒臭そうなイメージだったのですが、思いの外簡単に出来ました。
まあ、それでもやっぱりライブラリ使えよって感じはしますね。なんだか情報少ないし。APIもちょいちょい変わるみたいだし。

今回使ったコードのフルバージョンを掲載しておきます。
``` python
import urllib.request
import urllib.parse
import json
import base64

import flask


app = flask.Flask(__name__)

client_id = '-- デベロッパーコンソールで取得したクライアントID --'
client_secret = '-- こっちはクライアントシークレット --'
redirect_uri = 'http://localhost:5000/login/check'

state = 'this is test'  # 本当はこれはランダム


@app.route('/login')
def login():
    return flask.redirect('https://accounts.google.com/o/oauth2/auth?{}'.format(urllib.parse.urlencode({
        'client_id': client_id,
        'scope': 'profile email',
        'redirect_uri': redirect_uri,
        'state': state,
        'openid.realm': 'http://localhost:5000',
        'response_type': 'code'
    })))


@app.route('/login/check')
def check():
    print(flask.request.args.get('state'))
    dat = urllib.request.urlopen('https://www.googleapis.com/oauth2/v4/token', urllib.parse.urlencode({
        'code': flask.request.args.get('code'),
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }).encode('ascii')).read()

    dat = json.loads(dat.decode('ascii'))

    id_token = dat['id_token'].split('.')[1]  # 署名はとりあえず無視する
    id_token = id_token + '=' * (4 - len(id_token)%%4)  # パディングが足りなかったりするっぽいので補う
    id_token = base64.b64decode(id_token)
    id_token = json.loads(id_token.decode('ascii'))

    return 'success!<br>hello, {}.'.format(id_token['email'])


if __name__ == '__main__':
    app.run(debug=True)
```

---

参考：
- [Google アカウントの認証を OpenID から OpenID Connect に移行する方法 - WebOS Goodies](http://webos-goodies.jp/archives/how_to_migrate_from_openid_to_openid_connect.html)
- [OpenID Connect &nbsp;|&nbsp; Google Identity Platform &nbsp;|&nbsp; Google Developers](https://developers.google.com/identity/protocols/OpenIDConnect)
