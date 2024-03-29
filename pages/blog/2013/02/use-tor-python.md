---
title: 今話題（？）のTorを使ってみる - Python編
pubtime: 2013-02-28T21:01:00+09:00
tags: [Python, Tor, ライブラリの紹介]
description: SocksiPyというライブラリを使用して、PythonでSOCKSプロキシ（を使うTor）を経由して通信を行なう方法です。HTTP通信と、生のTCP通信の2通りの通信方法を試しています。
---

<aside>

前回： [今話題（？）のTorを使ってみる - gentoo編](/blog/2013/02/use-tor-gentoo)

</aside>

多分最終回、python編だよ。

pythonからプロキシを使う方法について。若干Torからは離れるかも。
[前回](/blog/2013/02/use-tor-gentoo)セットアップした**Vidalia**をそのまま使うので、まだの方はセットアップしてください。

サンプルではループバックアドレスを使っていますが、普通にIP入れれば他ホスト上のTorを使えます。
勿論、そのホストが使用を許可していた場合だけだけどね。

<section>

# SocksiPyを入れる
pythonは標準ではsocksをサポートしてないようなので、[SocksiPy](http://socksipy.sourceforge.net/)というのを使います。
ダウンロードして、適当に展開してください。

インストールするのが面倒くさかったら、展開したフォルダで作業しちゃってください。

インストールしたい場合は`{pythonのインストールディレクトリ}/Lib/site-packages/`にコピーすると良いと思うよ。

``` python
import socks
```
が成功することを確認してください。

</section>
<section>

# wget的なものを実装してみる
socksを使って、Tor越しに動作するwgetを実装してみます。
ていってもめんどいので、便利な機能はまったくないけどね。落としてくるだけ。

``` python
import socks
import urllib
import sys
import os

PROXY_ADDR = '127.0.0.1'  # 使用するプロキシ(今回はTorが動いているホスト)のアドレス。IPアドレスじゃなくてwww.example.comみたいな形式でもおっけー。
PROXY_PORT = '9050'       # そのまんま、プロキシのポート番号。


if len(sys.argv) > 1:
    socks.setdefaultproxy(socks.PROXY_TYPE_SOCKS5, PROXY_ADDR, PROXY_PORT)  # デフォルトのプロキシを設定する

    urllib.socket.socket = socks.socksocket  # urllibのソケットを置き換える。これでurllibがsocksを使ってくれるようになる

    data = urllib.urlopen(sys.argv[1]).read()  # 上でソケットを置き換えたので、あとは普通にurllibを使える

    open(os.basename(sys.argv[1]), 'w').write(data)  # あとはもらったデータを保存するだけ
```
以上、こんな感じ。

`urllib.socket.socket`を`socks.socksocket`でオーバーライドするのがミソかな。
このやり方は他のライブラリにも使える、ような気がする。

</section>
<section>

# Tor越しにTCP接続
前回チラッと触れましたが、socksさんは万能です。TCP接続ならなんでもリレーしてくれます。
ただ、Tor越しだとデバッグが相当面倒だけどね・・・。

デバッグ用に簡単なコードを提示します。
提示しますが、私はこれを使いませんでした。よって使えるかは知らん。
``` python
import socket
import SocketServer

PORT = 5555  # 番号に意味は無いのでなんでもおっけー


ssock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ssock.bind(('0.0.0.0', PORT))
ssock.listen(1)

while True:
    sock, fromaddr =  ssock.accept()
    print 'connect from', fromaddr
    sock.close()
```
これで繋いできた相手がわかるはず。

さて、それではいよいよTor越しに接続を試みるコードを書いてみます。
``` python
import socks

PROXY_ADDR = '127.0.0.1'  # Torが動いているホスト
PROXY_PORT = 9050  # Torが動いているポート

HOST_ADDR = '000.123.456.789'  # 接続先のIPアドレス。当然だけど、グローバルIPを使用してください。Tor越しなので。
HOST_PORT = 5555  # ポート番号は適当に。とりあえず上記のコードと合わせてあります


sock = socks.socksocket()  # ソケットを作成。引数なしでおっけー。だってTCPしかないんだもの。

sock.setproxy(socks.PROXY_TYPE_SOCKS5, PROXY_ADDR, PROXY_PORT)  # 使用するプロキシを設定。wgetの時に使ったsetdefaultproxyと同じ設定をソケット別にしている、って感じ。
# ちなみに、第一引数のプロキシタイプには
#   PROXY_TYPE_SOCK4
#   PROXY_TYPE_SOCK5
#   PROXY_TYPE_HTTP
# が使えるようです。
# Torはsocks5ね。

# ここから先は普通のソケットとして使える。

sock.connect((HOST_ADDR, HOST_PORT))

# このサンプルでは接続だけ。適当に書き足して試してみてください。

sock.close()
```
以上、こんな感じ。
簡単だよね。setproxyが挟まるだけ。

ただデバッグがあんまり簡単でなくて、ポートを開けてやる必要が出てきます。
ポートの開け方は・・・ググれっ
セキュリティ上の問題もあるので、デバッグが終わったら必ずポートを閉じるようにしましょう。

ま、そんな感じで試してみてください。
見知らぬIPアドレスから接続される、はずです。

</section>

---

楽に使えるものだね、Torって。

簡単なのは嬉しい。嬉しいのだけれど、これをどう使えばいいのやら・・・。
匿名で通信出来るってのは凄いけど、セキュアな通信ってだけならsslとかsshとか使えばいいし・・・。
なんかこう、良いネタ無いかな？
