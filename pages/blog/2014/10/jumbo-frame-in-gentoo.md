---
title: gentooでジャンボフレームを使ってみる
pubtime: 2014-10-02T19:02:00+09:00
modtime: 2017-03-22T00:00:00+09:00
amp: hybrid
tags: [Gentoo, ジャンボフレーム, MTU, ifconfig, iperf]
description: gentoo/OpenRCの環境でジャンボフレームの設定をしてみました。iperfを最適使って最適なMTU値を探して、最後に永続化の設定をしています。
---

<PS date="2017-03-22" level={1}>

この記事はOpenRCを導入している環境向けです。<br />
systemd-networkdだとうまく動いてくれないようなので、<a href="/blog/2017/03/gentoo-systemd-networkd-change-mtu">systemdの場合の記事</a>をご覧ください。

</PS>

ルーターの設定をぱらぱらと見ていたら、**use jumbo frame**なんて設定項目が。
そっかージャンボフレーム使えるのかー。んじゃあ使ってみるかー。というノリで導入してみたので、メモ。

まずはお試し。適当なMTU値を設定して、本当に速くなるのか試してみます。
``` shell
$ sudo ifconfig eth0 mtu 3000
```
みたいにすると、eth0のMTUを3000にしてくれます。

速度を測るのには**iperf**というツールを使いました。使いやすくていいね、これ。

portageに入っているので、
``` shell
$ sudo emerge iperf
```
で入ります。

一方のPCで
``` shell
$ iperf -s
```
としてサーバーを立ち上げて、もう一方のPCで
``` shell
$ iperf -c [サーバーのIPアドレス]
```
とすると、通信速度を計測してくれます。

当然ながら二台以上必要になっちゃいますが、まあしょうがないね。

いろいろ試して最適なMTU値を探してみてください。

私の環境の場合、MTUを1500から6000にして、通信速度が940Mbpsから974Mbpsになりました。
思ったよりきっちり効果が出てうれしい。

で、一つ注意点。
ifconfigで行った設定は再起動すると消えます。きれいさっぱり。
なので、設定ファイルに書いて永続化しましょう。
`/etc/conf.d/net`に
``` toml
eth0_mtu="6000"
```
みたいに追記。
これで再起動しても問題なくなるはず。

---

参考:
- [@IT：MTU値を確認・変更するには](http://www.atmarkit.co.jp/flinux/rensai/linuxtips/418chkmtu.html)
- [Linuxサーバーでネットワーク速度計測ツール！ iperf - 株式会社参謀本部の社長ブログ](http://www.geek.sc/archives/582)
- [Gentoo Forums :: View topic - mtu issue](https://forums.gentoo.org/viewtopic-t-799384-start-0.html)
