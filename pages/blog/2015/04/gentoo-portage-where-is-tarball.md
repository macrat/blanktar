---
title: gentooのportageが落とすtarballを綺麗にしよう
pubtime: 2015-04-06T00:25:00+09:00
tags: [Gentoo]
description: gentooのportageがダウンロードしてくるtarballが大量に溜ってしまっていたのですが、不要なものを見つけて綺麗にしてくれるツールがありました。
---

gentooのportageはソースコードのtarballをダウンロードしてきて、それをコンパイルするわけです。
・・・さて、そのtarballはどこにあるんだ？

調べてみたら、どうやら`/usr/portage/distfiles/`以下にあるっぽい。
見てみると大量のtarballが落ちている。

ここに落ちているtarballは勝手に整理してくれたりしないようなので、どんどん膨らんでいく。
なので、**eclean**と言うツールを使って綺麗にします。
とりあえず*gentoolkit*ってパッケージに入っているので、入れる。
```
# emerge gentoolkit
```
gentooを入れるときにもしかしたら既に入れてるかもね？

入ったら、
```
# eclean-dist -p
```
とすれば必要ないパッケージをリストアップしてくれる。

```
# eclean-dist
```
とやれば削除してくれる。

```
# eclean-dist -d
```
ならもっとアグレッシブに消してくれる。
こちらもpオプションを付ければリストアップだけしてくれる。

ちなみに3年近く放置してたgentooのネットブック、やってみたら10G近く削除出来ました。定期的にやるべきだなこれは・・・。
