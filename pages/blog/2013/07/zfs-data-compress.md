---
title: ついでにzfsのデータ圧縮を試してみる
pubtime: 2013-07-11T01:42:00+09:00
tags: [Linux, ZFS, ストレージ, ベンチマーク]
description: zfsを使って、透過的にデータを圧縮する機能を試してみました。ざっくりベンチマークも合せて記載しています。
---

[前回のzfsネタ](/blog/2013/07/zfs-deduplication)に引き続き、今回は圧縮機能を試してみるよ。
ファイルシステムレベルでデータを圧縮してくれるってのはお手軽な感じでいいよね。
まあ、スループットが気になる所ではあるけれど。

# 設定
とりあえず設定します。
[前回](/blog/2013/07/zfs-deduplication)と同じ構成で**testpool**というストレージプールがあるってのが前提。

圧縮の設定は
``` shell
$ sudo zfs set compression=on testpool
```
相変わらず1行で全部済む。楽だ。
ちなみにこの設定だと`lzjb`ってので圧縮します。

``` shell
$ sudo zfs set compression=gzip testpool
```
とかやってgzip圧縮したり、
``` shell
$ sudo zfs set compression=gzip-1 testpool
```
とか
``` shell
$ sudo zfs set compression=gzip-9 testpool
```
とかやって圧縮レベルを指定したりできます。

現在セットされている圧縮モードは
``` shell
$ sudo zfs get compression
NAME     PROPERTY     VALUE SOURCE
testpool compression  on local
```
で確認できます。

# 試してみる
さあ、試してみよう
``` shell
$ sudo head -c 50M /dev/zero >/testpool/testfile
$ sudo zfs get list
NAME      USED  AVAIL  PEFER  MOUNTPOINT
testpool  385K  63.1M    22K  /testpool
```
こんな感じ。

50M書き込んで385Kしか使ってないっ
・・・まあ、例によって0x00しか書いてないから当然だけれど。

という訳で、今度は乱数を書いてみる。
``` shell
$ sudo head -c 50M /dev/urandom >/testpool/testfile
$ sudo zfs get list
NAME       USED  AVAIL  PEFER  MOUNTPOINT
testpool  50.3M  13.2M  49.9M  /testpool
```
的な。

圧縮できてないっ　・・・当然だけれど。

# で、ベンチマーキング
あんま信憑性のあるデータじゃないですが、一応。
``` shell
$ sudo zfs set compression=off testpool
$ sudo time head -c 50M /dev/urandom >/testpool/testfile
real    0m4.838s
user    0m0.007s
sys 0m3.841s
$ sudo zfs get list
NAME       USED  AVAIL  PEFER  MOUNTPOINT
testpool  50.3M  13.2M  49.9M  /testpool

$ sudo zfs set compression=on testpool
$ sudo time head -c 50M /dev/urandom >/testpool/testfile
real    0m5.425s
user    0m0.009s
sys 0m3.828s
$ sudo zfs get list
NAME       USED  AVAIL  PEFER  MOUNTPOINT
testpool  50.3M  13.2M  49.9M  /testpool

$ sudo zfs set compression=gzip
$ sudo time head -c 50M /dev/urandom >/testpool/testfile
real    0m6.658s
user    0m0.012s
sys 0m3.841s
$ sudo zfs get list
NAME       USED  AVAIL  PEFER  MOUNTPOINT
testpool  50.4M  13.1M  50.1M  /testpool

$ sudo zfs set compression=gzip-1
$ sudo time head -c 50M /dev/urandom >/testpool/testfile
real    0m6.457s
user    0m0.002s
sys 0m3.814s
$ sudo zfs get list
NAME       USED  AVAIL  PEFER  MOUNTPOINT
testpool  50.4M  13.1M  50.1M  /testpool
```
こんな感じでした。
平均値とかは取ってません！　めんどくさい！

速さだと  off < lzjb < gzip-1 < gzip  な感じ。
妥当だね・・・。
圧縮率は今回は分からん。乱数だもんね。
聞くところによれば、素直に速さとトレードオフのようです。

しかしまあ、たった50Mなのに結構な差がでたね。
テストに使ったのが低スペックめのPC上の低スペックめな仮想マシンってのもあるとは思いますが。
とはいえ、とりあえずオンにすりゃいいってもんじゃないっぽいのは確か。

保存するデータと付きあわせてよく検討しましょう、かな。
