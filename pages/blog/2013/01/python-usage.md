---
title: starの使い方を投げやりに解説する
pubtime: 2013-01-08T02:47:00+09:00
modtime: 2020-03-28T20:20:00+09:00
tags: [作品紹介]
description: 自作のファイル転送ソフト「star」の使い方です。
---

<ins date="2020-03-28T20:20:00+09:00">

# 2020-03-28 追記

starの公開は終了しています。

</ins>

巷（主に私の脳内）で大流行中の私の（自称）代表作、starの使い方を投げやりに紹介してみるよ。

# starとはなんなのか。
ファイルをローカルLAN（つまり同じ家とか、同じwi-fiとか）の中で手軽に転送する、っていう物。

一応インターネット越しも可能なはずだけど、セキュリティとか、ポートの問題とか、まあ面倒なので割愛。

手早く手軽に、がモットーなので、暗号化とかムツカシイことは一切してない。
一応パスワードは生で送受信しないようにしてあるけれど、ファイル自体は暗号化しない。
なので、セキュアではない。見られちゃまずいものは送受信しないように。

# ファイルを受け取る準備
コンソールを開いて、
``` shell
$ star recv
```
って打って起動。コンソールがわからない？　出直せ。

パスワードの入力を求められるので、適当に決める。
このパスワードで正しい相手か判断するので、毎回使いまわすのはアレかもね。まあ、でも適当でいい。

シェルスクリプトとかから使いたいなら
``` shell
$ star recv -m 1 --password パスワード
```
とかってやっても良いかも。

`-m 1`は一つ受信したら終了するって意味。

パスワードをスクリプト内に書き込みたくないなら`--password-stdin`ってすれば、標準入力からパスワードを読み取ったりも出来る。

逆に、しばらく受信状態で放置したいなら、
``` shell
$ star recv -i
```
ってすると、大したこと無いエラーならいちいち終了しなくなる。正直、このオプションは殆ど使ったこと無いけどね。

それと、`--allow-hosts`なんてオプションがある。
こいつは何かって言うと、文字通り受け入れるホスト名・・・ってか、IPアドレスを指定する。
複数書くならスペース区切りで。
指定しておけば許可されていないホストからは受け付けなくなるので、気休め程度のセキュリティにどうぞ。

# ファイルを送る
受信側の準備が出来たら、いよいよ送信。

いよいよって言っても、
``` shell
$ star 送り先のIPアドレス ファイル名
```
ってやるとパスワード聞かれるので、それに答えるだけ。

ファイル名はスペース区切りでいくつでも書けるし、`*`とかも使えるはず。

`--stdin`って付ければ、標準入力から読み取ったデータを送信してくれる便利機能もあったりする。一度も使ったことはないが。
ログ送信とかに使えるかもね。

ちなみに、`--name ファイル名`も一緒に指定すると、標準入力から読んだデータの名前を指定できる。

それと、送信するときも`--password`とか`--password-stdin`を使える。
シェルスクリプトで使うならどうぞ。シェルスクリプトでファイル転送なんてするのかは知らないけどさ。

---

あんま関係ないけど、今後のstarの展望というか、願望。
どうにもコンソールというのは敷居が高い気がするので、GUIのインターフェースを用意したい。
でもねー、IPアドレスって概念そのものが説明するのめんどくさかったりするしねー。どうすっかねー。

まあとりあえずだ。コンソール使える諸賢に関しては、是非使ってみてくれると嬉しいな。
ついでに感想とか意見とかダメ出しとかくれると嬉しいな。
