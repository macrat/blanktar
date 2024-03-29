---
title: gentooでハイバネートとかサスペンドとか
pubtime: 2015-02-19T08:42:00+09:00
tags: [Linux, Gentoo, 環境構築]
description: ノートパソコン(AcerのAspire One D257)でハイバネートやサスペンドを使うべく、gentooのセットアップを行ないました。多分他の環境でも動くと思います。
---

私のネットブック(Aspire One D257)にはgentooが入っているのですが、ハイバネートとかサスペンドとか使ってません。
せっかくノートパソコンなんだし色々活用していきたいよねー、ということでセットアップしてみた。

とりあえず必要なパッケージを入れる。
```
# emerge hibernate-script
```
これの他にも**pm-utils**というのがあるのだけれど、私の環境では**hibernate-script**のがうまく動くっぽい？


# サスペンド
で、サスペンドしてみる。失敗すると怖いのでデータはきちんと保存してから試してくださいね。
```
# hibernate-ram
```
成功すれば画面が消えて、電源ランプあたりが点滅したりとかなんかそんな動きをするはず。
電源ボタンを押せば復帰します。多分。


# ハイバネート
今度はハイバネート。
resumeってカーネルオプションを`/boot/grub/grub.conf`辺りに設定します。
筆者の環境ではレガシーなgrubを使っているのでこんな感じ。
```
title Gentoo
root (hd0,0)
kernel /boot/kernel-3.17.7 root=/dev/sda1 reboot=bios resume=/dev/sda6
```
**sda1**がルート、**sda6**がスワップ領域です。`resume=<スワップパーティションの名前>`って感じで設定。

hibernate-scriptを入れたときに**hibernate-cleanup**とやらをスタートアップに入れろって言われるので、よく分からないけど入れておく。
```
# rc-update add hibernate-cleanup
```
こんな感じ。

設定が出来たら試してみる。
```
# hibernate
```
これで電源が消えるはず。今度は電源ランプも多分点かない。
電源ボタンを押せば普通に起動して、途中でハイバネートからの復帰に移行するはずです。

## イメージサイズの最適化
このままでも良いのだけれど、`/sys/power/image_size`とやらでハイバネートする時のイメージのサイズを設定できるらしい。
せっかくなので適当に最適化してくれるらしい0を指定してみる。
```
# echo 0 > /sys/power/image_size
```
こんな。これだけでハイバネートからの復帰がやたらと速くなりました。環境によっては違うかもですが。

ただ、これだけだと再起動すると消えてしまうので、`/etc/hibernate/scriptlets.d/`以下に適当なスクリプトファイルを作ってハイバネート前に`image_size`を指定してもらうように。
```
$ cat /etc/hibernate/scriptlets.d/image_size
#!/bin/sh

echo 0 > /sys/power/image_size
```
うん、単純。
実行権限はなくても問題ないようです。でも.sh付けたら何かエラーっぽい表示が出ていた。謎だ。

参考：<a href="https://wiki.archlinux.org/index.php/Suspend_and_Hibernate_(日本語)" target="_blank">Suspend and Hibernate (日本語) - ArchWiki</a>
