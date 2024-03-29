---
title: ASUS EeeBook X205TAにRemix OSを入れたらちょっと快適だった話
pubtime: 2016-08-16T12:53:00+09:00
tags: [Linux, Android, 環境構築]
description: ASUSのEeeBook X205TAに、デスクトップ版AndroidのようなものであるRemix OSをインストールする方法です。ハードウェアの対応状況も調査しました。
---

私とASUSのX205TAとの戦いの始まりは去年の2月に遡ります。[gentoo入れようとしては失敗](/blog/2015/02/gentoo-into-eeebook)し、[Arch Linux入れてはドライバが足りず](/blog/2015/02/archlinux-into-eeebook)…。
そしてついに、その戦いに決着が付きました。

[Remix OS](http://www.jide.com/remixos)なるOSがあります。
元Googleの開発者が作ったOSとかで、Androidベース…というか、デスクトップ版Androidみたいな代物です。
結構面白いので実機に入れてみようと思ってX205TAに入れたのですが、これがかなり良い。

簡単にですが、手順を記録しておきます。
なお、*ここで行なっている手順は非常に荒っぽいです*。
正直言って*マトモな手順ではありません*。自己責任でどうぞ。

# RemixOSを起動するためのUSBメモリを用意する
[Remix OSのダウンロードページ](http://www.jide.com/remixos-for-pc#downloadNow)から64bit向けのzipファイルをダウンロードしてきます。
展開するとISOとexeが入っているはずです。

付属してきたexeでISOファイルをUSBメモリに入れます。
USBメモリは8GB以上32GB以下のものにしてください。普通に使う分には32GB以下って制限は無いのですが、この記事の方法でインストールする場合は必ず守った方が良いと思います。

例によってX205TAのUEFIではこのままでは起動出来ないので、一度マウントしてブートローダを差し替えます。
`/EFI/boot/`と`/EFI/RemixOS/`の二つのディレクトリにある**bootia32.efi**を[x100ta用のもの](https://github.com/jfwells/linux-asus-t100ta/blob/master/boot/bootia32.efi)で置き換えます。

これで準備完了。

# BIOS(UEFI)の準備
もしもまだBIOS設定に入るための準備をしていないのなら、windowsの高速起動を無効にする必要があります。
Shiftを押しながら再起動ボタンをクリックして、`トラブルシューティング -> 詳細オプション -> UEFIファームウェア`の順に選択していきます。

BIOS画面に入ったら、Advancedタブの`USB Configuration`で`USB Controller Select`を**EHCI**にします。
それと、Securityタブの`Secure Boot Control`を**Disabled**にしてください。

# USBブートする
作ったUSBメモリをX205TAに挿して、BIOS画面のSave & ExitタブのBoot OverrideってやつからUSBメモリを選んでUSBブートします。
GRUBの画面に入ったら*Guest mode*ってやつで起動。Resident modeでも良いのですが、やたらと遅くなったりするのでお勧めしません。
ちょっと時間が掛かるかもしれないけれど、辛抱して起動を待つ。

最初の設定に入るので、そのへんは適当に。
ただし、Wi-Fiはスキップしないで設定してください。ターミナルアプリを入れるために必要です。

# インストール
いよいよインストール作業です。
本来ならばGRUB画面でブートオプションを書き換えて起動するインストーラを使うのですが、試した限りではうまく行きませんでした。
[普通のインストーラの使い方を詳細に書かれている記事](http://blog.goo.ne.jp/psyna_hone/e/84f8ab6e5808153f3a156d5b2e9f0143)がありましたので、参考までにどうぞ。

で、入らないからどうするかというと、ddコマンドを使ってUSBメモリの中身を丸ごと内蔵ストレージにコピーします。
無茶苦茶な方法ですが、良い感じに出来ました。

**Termux**というアプリが入っているので、左下のスタートボタン的なところから探して起動します。
起動したら以下のような感じで。
```
$ su -
# dd if=/dev/block/sda of=/dev/block/mmcblk0 bs=8192 count=1048576
```

これでインストール（というかコピー）することが出来ます。
死ぬほど時間がかかりますが、辛抱強く見守ってあげてください。

なお、bsとかcountオプションについては8GBのUSBメモリを使用した場合を想定しています。
bsとcountを掛けた値がUSBメモリのサイズになるように設定してください。

ddコマンドが無事終われば、ひとまず起動出来る状態になっているはずです。
途中でフリーズしてしまった感じがしても、強制終了させて起動してみると案外行けたりするかも？ 私の場合はそんな感じでした。

# パーティションの拡張
私が今回インストールに使用したUSBメモリは8GBのものです。
8GBのUSBメモリを32GBのeMMCにddしたので、当然かなりのスペースが無駄になっています。
勿体無いので、パーティションを広げておきます。

失敗するとデータが消えてしまうので、`/dev/block/mmcblk0p3`の中身のバックアップをしておくことを強くお勧めします。

バックアップが終わったら、自動でマウントされているものをアンマウントしてください。

準備が出来たらさきほどと同じく**Termux**を起動して、以下のようにして拡張を行ないます。
```
$ su -
# fdisk /dev/block/mmcblk0
Command ('m' for help): p
Disk /dev/block/mmcblk0: 31.2 GB, 31272730624 bytes
4 heads, 16 sectors/track, 954368 cylinders
Units = cylinders of 64 * 512 = 32768 bytes

       Device Boot      Start         End      Blocks  Id System
/dev/block/mmcblk0p1              33       34304     1096704   c Win95 FAT32 (LBA)
Partition 1 does not end on cylinder boundary
/dev/block/mmcblk0p2   *       34305      198144     5242880   b Win95 FAT32
Partition 2 does not end on cylinder boundary
/dev/block/mmcblk0p3          198145      247296     1572864  83 Linux
Partition 3 does not end on cylinder boundary


Command ('m' for help): d
Partition (1 - 4): 3


Command ('m' for help): n
  e  extended
  p  primary partition(1-4)
p

Partition (1 - 4): 3

First cylinder (1 - 954368, default 1): 198145

Last cylinder or +size or +sizeM or +sizeK (198145 - 954368, default 954368):
Using default value 954368


Command ('m' for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table
fdisk: WARNING rereading partition table failed, kernel still uses old table: Device or resource busy
```
パーティション3のstartの位置をpコマンドで確認して、nコマンドで同じ場所に新しいパーティションを作っています。
間違えるとデータを読み出せなくなるので要注意。

リソースが使用中だとか文句を言われたので、素直に再起動してもう一度USBメモリから起動します。
やっぱりTermuxを開いて、以下のように。
```
$ su -
# e2fsck -f /dev/block/mmcblk0p3
# resize2fs /dev/block/mmcblk0p3
```

これでパーティションの拡張は完了です。

# 内蔵ストレージからの起動
シャットダウンしてUSBメモリを抜いて、もう一度起動します。
すると内蔵ストレージから起動する、はず。きっと。
初回起動は時間が掛かったりしますが、何度かやってるとそこそこ早くなる気がします。体感ですが。

# ハードウェアの対応状況
Wi-Fiとディスプレイの輝度、バッテーの状態取得、Webカメラは問題なく動作します。
タッチパッドもほぼ完全に動作しますが、二本指でのタップが無いっぽいです。右下をクリックすれば問題無し。

キーボードのファンクションは確認出来た範囲で機内モード、ディスプレイ輝度、音量調整などが使えます。
機内モードはOS側の機内モードとは別らしく、解除がちょっと面倒臭いので注意。キーボードで解除してからOS側のWi-Fiをオンオフしないといけない。
あと、fn + F8で何故か音楽プレイヤーが立ち上がります。

キーボードから音量調整が行なえると書きましたが、肝心の音は出ないようです。
内蔵スピーカー、イヤホン、HDMIの全てがダメでした。無念。

HDMIの映像出力は出来ますが、解像度を調整する術がありません。
そもそもディスプレイの解像度を調整出来ないので、Androidの宿命のようです。
ドライバ的には対応しているようなので、RemixOSの今後に期待？

スリープ状態に入ることは出来ますが、映像は復帰出来ても高確率でキーボードもタッチパッドも反応しなくなります。
たまにキーボードは使えるようになりますが、タッチパッドは今のところ復帰出来たことがありません。
タイムアウトによる自動スリープに注意。設定変えといた方が良いかも。

Bluetoothは使えません。そもそも認識していないようです。

色々動いてない感じがしますが、この子にしては上出来です。随分動いてます。やったね。
