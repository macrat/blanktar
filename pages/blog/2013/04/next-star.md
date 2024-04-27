---
title: 次世代starの候補版を公開したよ
pubtime: 2013-04-28T00:48:00+09:00
tags: [作品紹介]
description: 自作のファイル転送ツール「Star」の最新の候補版、「DraftStar」を公開したので紹介です。
---

<ins>

# 2024-04-28 追記

ここで紹介している**Star**というソフトウェアの公開は終了しています。

</ins>

~~**star**~~の次世代版の候補版（めんどくさい・・・）**DraftStar**の公開を開始しましたよっと。
候補版つっても、多分このまま修正重ねてリリースしちゃうけどね。候補版って名前いいよね。素敵。
まあそんなわけで、α版程度の意味に捉えてもらえれば。

で、そのDraftStarのマニュアル的な何かです。
目下ばりばり（？）開発中なので、オプション名が変わる可能性があります。一文字のオプションは特に注意ね。

# 何が変わったのか
- 圧縮できるようになった

    通信を圧縮できるようになりました。zlibとbzip2を使えます。
    しかもどっちで圧縮するべきか、あるいは圧縮しないべきか、適当に判断してくれます。

- IPアドレスを打たなくても良くなった

    ホスト名だけでファイルを送信できるようになりました。
    ・・・なった、はずなのです。
    はずなのですが、環境依存が凄まじいようで、公開時点では正常に作動しない環境が多いです。

- ライブラリとしても使えそう

    そのままライブラリとして使えそうな感じになりました。

    というわけでGUI版の開発を予定しています。多分やります。きっとやります。やるかもしれません。

- 制御用のパケットがjson形式になった

    json形式です。見やすいです。拡張もしやすいです。

- よりセキュアになった

    1.xのクライアントの認証機能に加えて、今回はお互いに相手を認証します。
    更に、送信したファイルにhmacで署名するようになりました。
    相変わらず暗号化はしないので、機密情報はそのまま送らないように注意してください。


# 基本的な使い方
``` shell
$ DraftStar.py
```
これだけでファイルの受信ができます。

パスワードを要求されるので、適当に。
適当といってもあんまり短いと破られる可能性があるので、5文字以上くらいを推奨します。

送信するには
``` shell
$ DraftStar.py host filename
```
とします。

hostにはホスト名か、IPアドレスを指定してください。

filenameにはunix風の正規表現が使えます。`*.txt`とか、`file[0-10].png`とか。

勿論ファイルはシェルの制限がない限りはいくらでも設定出来ます。

# 高度な使い方
高度な、といいつつもよく使いそうなのだけあげています。
他にも微妙な機能があるにはある。

## 受信するときのオプション
``` shell
$ DraftStar.py --create-directory
$ DraftStar.py -d
```
などとすると、送信者側のディレクトリ構造を再現するようになります。
デフォルトではオフになっています。

``` shell
$ DraftStar.py --host-name HOST
```
とすることでホスト名を設定出来ます。

ホスト名はファイルを送信する時に使用します。
実は送信する側でも設定出来ますが、今のところ深い意味はありません。

``` shell
$ DraftStar.py --file-limit 10
```
とすると、ファイルを10個受信した時点で終了します。
デフォルトでは無制限になっています。

## 送るファイルを圧縮したりしなかったり
``` shell
$ DraftStar.py host file --zlib
```
``` shell
$ DraftStar.py host file -z
```
とすると、zlibを使用してファイルの転送を圧縮します。

``` shell
$ DraftStar.py host file --bz2
```
``` shell
$ DraftStar.py host file -b
```
なら、bz2を使用して圧縮します。

``` shell
$ DraftStar.py host file --no-comp
```
``` shell
$ DraftStar.py host file -n
```
とすれば、圧縮しません。

zlibやbz2を使えば（ファイルによっては）転送そのものは早くなりますが、圧縮・伸張に時間がかかるようになります。
なので、回線速度や、送信するファイルの性質を考慮して設定してください。

・・・と、いうのはやっぱり面倒なので、その辺の判断を適当にしてくれるようになっています。
ただし、圧縮、転送に掛かる時間をファイルごとに測るので、大量のファイルを転送する時は明示的に指定したほうが高速になると思います。
少量のファイルであれば恐らく問題ありません。深く考えずに送っちゃって大丈夫です。

## データをstdinから読み取って送る
バージョン1.xから引き継いだ謎機能で、stdinに渡されたデータを転送することができます。
``` shell
$ echo "hello, draft star" | DraftStar.py host --password abc
```
とすれば送信出来ます。

注意しないといけないのは、パスワードをオプションで指定しないといけなくなるところ。
なお、この機能はwindowsでは使えません。（cmd.exeにバグがあるらしい）

## ライブラリとして使う
上記の通り、DraftStarはライブラリとして使えるような気がしています。
というわけで、ちろっとサンプルを書いてみます。
詳しくはpydocとソースコードをどうぞ。

### ファイルを受け取る
``` python
import socket
import DraftStar

ssock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ssock.bind(('0.0.0.0', DraftStar.DEFAULT_PORT))
ssock.listen(1)

sock, _from = ssock.accept()

star = DraftStar.StarSession(sock, 'password')  # 認証して、セッションを開始する。

star.RecvFile()  # ファイルを１つ受け取る

star.close()  # 終了する
```

## ファイルを送る
``` python
import os
import DraftStar

star = DraftStar.StarSession('127.0.0.1', 'password')  # 接続、認証を行う。

fname = 'test.txt'
fsize = os.path.getsize(fname)
fp = open(filename, 'r')

star.SendFile(fp, fname, fsize, compress=False)  # ファイルを送信する。

fp.seek(0)

star.SendFile(fp, fname, fsize, compress='zlib')  # 今度は圧縮して送信する。'bz2'にも出来る。

star.close()  # 終了する
```
