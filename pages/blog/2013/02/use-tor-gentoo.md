---
title: 今話題（？）のTorを使ってみる - gentoo編
pubtime: 2013-02-27T19:33:00+09:00
tags: [Linux, Gentoo, Tor, 環境構築]
description: 今何かと話題の匿名化ソフト「Tor」をgentooで試す方法です。「Vidalia」というソフトを使用しています。
---

<aside>

前回： [今話題（？）のTorを使ってみる - windows編](/blog/2013/02/use-tor-windows)<br />
次回： [今話題（？）のTorを使ってみる - Python編](/blog/2013/02/use-tor-python)

</aside>

さて、第二回の今回はgentoo編です。

gentoo linuxに**Vidalia**ってのをセットアップして軽く使ってみるよ。
前回に引き続いて今回も簡単すぎてアレだけどね。

次回は（あるとすれば）pythonでTor越しの接続をためしてみるので、お楽しみに。

# インストール
``` shell
$ sudo emerge tor
```
これだけ。何も面白いことないっす
依存関係で何かあれば、まあ適当に。

<section>

# 設定を見てみる
設定関係は`/etc/tor`にまとめてあります。
他にもあるかもしらんが、知らんっ　ここだけで問題ないっ

設定ファイルは`torrc`。
同じディレクトリに`torrc.sample`があるので、それを見ながら設定してみてください。

他のホストから使用したい場合は**SocksPort**とか**SocksPolicy**の設定が必要になる、のかな？
ローカルだけの仕様ならいじらなくても動く、かも。

`tor-tsocks.conf`ってのもあるんだけど、よく分からん・・・。
まあ、いじらないでも動いたから、多分大丈夫だよ、多分。
どなたかご存知でしたら教えてくらはい。

</section>
<section>

# 起動する
``` shell
$ sudo /etc/init.d/tor start
```
で起動出来ます。普通だね。

```
 * Tor configuration (/etc/tor/torrc) is valid.
 * Stating Tor ...
```
とか出れば、多分成功。

```
Tor configuration (/etc/tor/torrc) not valid
```
って出た場合、設定ファイルにミスが有るはず。
エラー出力を見ると色々書いてあるので、まあ頑張って直してください

PCの起動と同時に立ちあげたいなら
``` shell
$ sudo rc-update add tor default
```
っす。これもいつも通り。

終了は
``` shell
$ sudo /etc/init.d/tor stop
```
ね。

</section>
<section>

# 試してみる
ここまでくればVidaliaの設定は終了、あとは使うだけです。
といっても、プロキシの設定がありますが。

お使いのブラウザの設定を開いて、プロキシを設定してください。
何も設定していなければポートは`9050`になります。
`socks5://127.0.0.1:9050`とかにすれば問題ない、かな？

注意点として、ご覧のように**socks**っていうプロトコルを使います。
このsocksってのは中々万能なようで、http通信以外にも使えるみたいね。ま、それは次回。

IPチェックサービスみたいのを利用してIPアドレスを確かめてみてください。海外のよう分からんプロバイダのIPになってるはず。
なってない？　ポート番号の設定とか、その辺じゃなかろうか。

</section>

---

さて、これでVidaliaの設定ができたはず。

ま、ブラウジングするだけなら**Tor Browser**のlinux版使ったほうがいいと思うけどね。
インストールの必要がないし、凄く簡単。

わざわざVidaliaをセットアップするメリットはsocksを自由に使えるところにある、ような気がします。
ブラウザを変えなくていいのもメリットかな。
