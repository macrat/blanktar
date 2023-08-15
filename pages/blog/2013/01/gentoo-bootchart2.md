---
title: gentooでbootchart2を使ってみる
pubtime: 2013-01-22T17:39:00+09:00
amp: hybrid
tags: [Gentoo, Linux, bootchart2, ベンチマーク]
description: gentooにbootchart2を入れて、起動速度のベンチマークを取ってみました。プロセスごとの所要時間が分かるので、起動の最適化に使えます。
---

PCの起動は早い方が良いよね。とくにノートPCは早い方が良い。
と言う訳で高速化だー。ベンチマークだー。bootchart2だー。

て言ってググったんだけどさ。どうにも分かりやすい日本語のマニュアルが無い・・・。
仕方がないので、簡単に使い方をまとめるよ。

# 1.インストール
``` shell
$ sudo emerge bootchart2
```
keywordがどうのこうのって言われたら、32bitなら

``` shell
$ sudo echo app-benchmarks/bootchart2 ~x86 >> /etc/portage/package.keywords
```
64bitなら

``` shell
$ sudo echo app-benchmarks/bootchart2 ~amd64 >> /etc/portage/package.keywords
```
で解決ね。
まあ、ここは普通にいつも通り。

# 2.設定
bootchartの設定ファイルは`/etc/bootchartd.conf`にあるよ。
そのままでも問題ないと思うけどね。

で、次。
**sys-app/baselayout**とやらのバージョンを確認します。
``` shell
$ sudo emerge -pv baselayout
```
で確認ね。

## baselayoutのバージョンが2.x以上
`/boot/grub/grub.conf`を開いて、kernelから始まってる行の一番後ろに
``` toml
init=/sbin/bootchartd
```
って追加します。
何かあるとまずいから、バックアップは忘れずに。

initrdを使ってる場合は・・・すいません、分からないっす。

## baselayoutのバージョンが2.x未満
`/etc/rc.conf`の末尾に
``` toml
RC_BOOTCHART="yes"
```
って追記します。

rc.confが無い場合は`/etc/conf.d/rc`になるのかな？　よく分からないけど。

# 3.再起動して確認してみる
ここまでやれば動くはずです、再起動してみてください。

成功していたら`/var/log/bootchart.png`ってのと`/var/log/bootchart.tgz`ってのが出来てるはず。
見当たらない？　ちょっと待ってみてください。どうも起動してちょっと経ってから出来ることもあるっぽいので。

pngの方を開くと、各プロセスの起動に掛かった時間とか、CPUの使用状況とかが書いてあります。
参考にして色々チューニングすると良いかもね。

---

とりま本日はここまで。
高速化のtipsも書けると嬉しいんだけどねー・・・。悲しいかな知識不足。

参考: [Bootchart2 - Gentoo Linux Wiki](http://en.gentoo-wiki.com/wiki/Bootchart2)
