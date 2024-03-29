---
title: linuxのmdadmで作ったRAID5を壊したり直したり。
pubtime: 2014-02-18T22:19:00+09:00
tags: [Linux, mdadm, ストレージ]
description: linuxでRAIDを実現するためのツールであるmdadmの使い方の解説です。RAID5環境を構築したり、ディスクを破壊してみて復旧を試みたりしています。
---

うちのサーバーのHDDを増設するタイミングでソフトウェアRAIDとか試してみようかと思ったりして。
という訳で色々実験。の、記録です。

ZFSを試した時の記事（[重複排除編](/blog/2013/07/zfs-deduplication)、[データ圧縮編](/blog/2013/07/zfs-data-compress)）も御覧ください。

# インストール
仮想環境のubuntuでテストします。

というわけで、apt-getで
``` shell
$ sudo apt-get install mdadm
```
以上。

# HDDを準備する
仮想ディスク一本だけ使ってテストします。ちゃんと何本も用意してもいいのだけれど、面倒くさいじゃん？
作ったのは1GBのHDD。どんだけレガシーなんだか。

とりあえずパーティションを切ります。
今回はRAID5を試すので、最低3つ必要。という訳で3つに分けます。

で、分けたもののパーティションタイプを**Linux raid 自動検出**とやらに変更します。
``` shell
$ sudo fdisk /dev/sdb
コマンド (m でヘルプ): t
パーティション番号 (1-4): 1
16進数コード (L コマンドでコードリスト表示): fd
パーティションのシステムタイプを 1 から fd (Linux raid 自動検出) に変更しました
```
こんな感じで設定できます。
他のパーティションにも同じ設定をしてください。

# RAID5を構築する。
``` shell
$ sudo mdadm --create /dev/md1 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdb2 /dev/sdb3
```
作っていいですか？ みたいなことを聞かれるので、`y`って答えれば完成。
これだけで作れちゃう。簡単。

``` shell
$ sudo mdadm --detail /dev/md1
```
ってやると、構築したRAIDについての情報を見る事ができます。

完成した`/dev/md1`ってのは
``` shell
$ sudo mkfs.ext4 /dev/md1
```
みたいにしてファイルシステムを作れば、あとは普通にマウントして使えます。

# 試してみる
いつも通り
``` shell
$ sudo mount /dev/md1 /mnt/test/
こんな感じでマウント。

3台のディスクで作ったなら、2台分の容量になっているはず。

``` shell
$ sudo echo "hello, raid" > /mnt/test/test.txt
```
書き込めることを確認しときましょう。

# 故障をシミュレーションしてみる。
``` shell
$ sudo mdadm --fail /dev/md1 /dev/sdb1
```
のようにすると、故障をシミュレーションできるらしい。

``` shell
$ sudo mdadm --detail /dev/md1

- 省略 - 

Number   Major   Minor   RaidDevice State
   0       0        0        0      removed
   1       8       18        1      active sync   /dev/sdb2
   3       8       19        2      active sync   /dev/sdb3

   0       8       17        -      faulty spare   /dev/sdb1
```
おー、一台壊れてる。

``` shell
$ sudo cat /mnt/test/test.txt
hello, raid
```
でもちゃんと見れる。素晴らしい。

で、修理。
``` shell
$ sudo mdadm --remove /dev/md1 /dev/sdb1
mdadm: hot removed /dev/sdb1 from /dev/md1
```
切断して、ディスクを交換。
``` shell
$ sudo mdadm --add /dev/md1 /dev/sdb1
mdadm: added /dev/sdb1
```
ディスクをRAIDに組み込む。

確認。
``` shell
$ sudo mdadm --detail /dev/md1

- 省略 -

Number   Major   Minor   RaidDevice State
   4       8       17        0      active sync   /dev/sdb1
   1       8       18        1      active sync   /dev/sdb2
   3       8       19        2      active sync   /dev/sdb3
```
おお、直った。

# 手が滑った。
``` shell
$ sudo rm /dev/sdb1
```
おっと。

確認してみる。
``` shell
# mdadm --detail /dev/md1

- 省略 -

Number   Major   Minor   RaidDevice State
   4       8       17        0      active sync
   1       8       18        1      active sync   /dev/sdb2
   3       8       19        2      active sync   /dev/sdb3
   5       8       20        3      active sync   /dev/sdb4
```
おや？ なんだこれ。

``` shell
$ sudo mdadm --monitor --syslog --oneshot /dev/md1 --mail=root
```
うん、特に何も起こらない。

消した場合だけじゃなくて、乱数で埋めちゃった場合でも同じような状況みたい。
もっと悪いことに、乱数だの0だので埋めた場合は`--detail`しても見た目が変わらない。
モニターもちゃんと動いてないっぽい。
よく分からない。postfixの設定が適当すぎたのが原因かな？

ま、諦めて再構築しようか。
``` shell
$ sudo mdadm --remove /dev/md1 /dev/sdb1
mdadm: cannot find /dev/sdb1: No such file or directory
```
おや？

``` shell
$ sudo mdadm --remove /dev/md1 sdb1
mdadm: hot remove failed for sdb1: Device or resource busy
```
おやおや？

``` shell
$ sudo mdadm --fail /dev/md1 sdb1
mdadm: set sdb1 faulty in /dev/md1
$ sudo mdadm --remove /dev/md1 sdb1
mdadm: hot removed sdb1 from /dev/md1
```
お、消せた。

``` shell
$ sudo mdadm --detail /dev/md1

- 省略 -

Number   Major   Minor   RaidDevice State
   0       0        0        0      removed
   1       8       18        1      active sync   /dev/sdb2
   3       8       19        2      active sync   /dev/sdb3
   5       8       20        3      active sync   /dev/sdb4
```
消えた消えた。

# ディスクを追加する
なんと一度作ったものにあとからディスクを追加したり出来るらしい。

``` shell
$ sudo mdadm --add /dev/md1 /dev/sdb4
mdadm: added /dev/sdb4
```
新しいディスクを追加して

``` shell
$ sudo mdadm --detail /dev/md1

- 省略 -

Number   Major   Minor   RaidDevice State
   4       8       17        0      active sync   /dev/sdb1
   1       8       18        1      active sync   /dev/sdb2
   3       8       19        2      active sync   /dev/sdb3

   5       8       20        -      spare   /dev/sdb4
```
スペアになってる。

構成を変更して
``` shell
$ sudo mdadm --grow
mdadm: Need to backup 3072K of critical section..
```

アンマウントして、ファイルシステムをリサイズ
``` shell
$ sudo umount /mnt/test/
$ sudo resize2fs -f /dev/md1
resize2fs 1.42.8 (20-Jun-2013)
Resizing the filesystem on /dev/md1 to 35328 (1k) blocks.
The filesystem on /dev/md1 is now 35328 blocks long.
$ sudo mount /dev/md1 /mnt/test/
```
dfコマンドとかで確認してみると、容量が増えているのが分かるはず。

ちなみに、resize2fsするときに`Please run 'e2fsck -f /dev/md1' first.`って怒られた場合は、素直に
``` shell
$ sudo  e2fsck -f /dev/md1
```
ってやってからやり直せば問題ないようです。

---

テストするためにpostfixが必須ってのが頂けないけれど、それに目をつむれば悪くない感じ。色々簡単っぽいし。
シェルスクリプトだけでテスト出来るようになればいいんだけれどねー・・・。諦めてpostfixの設定をしろってことなのだろうか。

参考:
- <a href="http://d.hatena.ne.jp/aakkiirraajp/20100704/1278253558" target="_blank">RAID構築 - akiraのTechな日記</a>
- <a href="http://nabe.blog.abk.nu/0301" target="_blank">Linuxでmdadmを使ったソフトウェアRAIDの構築・管理メモ - nabeの雑記帳</a>
