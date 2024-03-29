---
title: ASUS EeeBook x205TAにgentooを入れようともがいた話
pubtime: 2015-02-23T00:23:00+09:00
modtime: 2016-08-16T00:00:00+09:00
tags: [Linux, Gentoo, 環境構築]
description: ASUSのEeeeBook x205TAにgentooを入れようと頑張った記録です。カーネルの起動までは成功しましたが、ストレージ関連を上手く扱えず最後まで起動出来ませんでした。
---

買っちゃいましたEeeBook。ずっと待ってたんだこういうPCが出るのを。

勢いで買ったのはいいのだけれど、情報がとかくねぇ。ドライバもねぇ。

頑張って起動するまで持っていったのだけれど、起動すると同時にルートディレクトリをマウントできないとカーネルパニックを起こす状態に。
取った記録がもったいないので一応公開しますが、**この記事の方法では最後までインストール出来ません。**とりあえず日和見でubuntuでも入れることにして、いずれ再挑戦します・・・。

<ins date="2015-07-01">

# 2015-07-01 追記

[ArchLinuxを入れる記事](/blog/2015/02/archlinux-into-eeebook)もどうぞ。入ってはいるけれど、微妙な感じ。

</ins>

<ins date="2016-08-16">

# 2016-08-16 追記

[RemixOSを入れる記事](/blog/2016/08/remixos-install-into-asus-x205ta)も書きました。一番マトモな感じで動いています。

</ins>

# ともかくlinuxを起動する
linuxが起動しなきゃ始まらない。という訳でブートします。
普通にgentooのインストールCDでチャチャッとやりたいところなのだけれど、どうもいろいろ面倒が伴うようなのでubuntuの14.10を使用。適当に最新版を落としてくれば大丈夫だと思います。

## BIOS（UEFI）の設定
windows8.1が入っているので高速起動がどうたらこうたらでどのキーを押そうがBIOS設定に入れない。

Shift押しながら再起動のボタンをクリックすると何か色々オプションが出てくるので、**トラブルシューティング** -&gt; **詳細オプション** -&gt; **UEFIファームウェアの設定**を順番にクリック。
これで設定できる。

BIOS設定に入ったら、**Advanced**タブの**USB Configuration**で**USB Controller Select**を**EHCI**にしておく。
usb2.0しか搭載してないのになんでxHCIがあるんだろう？ よく分からん。

あと、**Security**タブの**Secure Boot Control**を**Disabled**にしておく。

これでPCの準備は完了。保存して再起動。

## 起動用のUSBメモリを作る
仮想マシンでubuntuを起動して、**Ubuntuを試す**を選んでデスクトップへ。
**ブータブルUSBの作成**ってソフトでUSBメモリにubuntuをインストール。

インストール出来たら、USBメモリをマウントして中身をみてみる。
`/EFI/Boot/`ってディレクトリが出来ているので、そこに[t100ta用のブートローダ(？)](https://github.com/jfwells/linux-asus-t100ta/blob/master/boot/bootia32.efi)を入れる。

これで起動メモリの準備は完了。

## 起動する
作ったUSBメモリをEeeBookに差して、上記の面倒な手順でBIOS設定画面へ。

**Save &amp; Exit**タブの**Boot Override**ってところからUSBメモリを探して選ぶとUSBブート出来ます。

起動したら**Try Ubuntu without installing**を選択してubuntuを起動。結構時間かかりますが多分大丈夫。

これでlinuxの起動が出来る！ やったね！

# gentooを入れる
基本的には[公式のインストールガイド](https://www.gentoo.org/doc/ja/handbook/handbook-x86.xml?part=1)に従って実行。なのでここではガイドと違うところだけ記録。

## ディスクの準備
UEFI環境ではgptを使用して、かつEFIパーティションとやらを用意しないといけないようです。

fdiskでも`g`ってコマンドでgptなパーティションテーブルを作れます。
んでもって、`c`コマンドでパーティション切って`t`コマンドでパーティションタイプを**EFI System**に変更。
容量は100Mくらいで良いみたい。何となく128Mにしておいた。

こいつは**vfat**でフォーマットしてください。
ディスクはsdaではなくて**mmcblk0**として認識されているので注意。

あとのパーティションは適当に。

## 必要なファイルシステムのマウント
基本はガイドの通りですが、ubuntuでは警告に書いてある通り`/dev/shm`が`/run/shm`へのシンボリックリンクになっているようです。
リンクを消してtmpfsをマウントして・・・ってやったらubuntuの挙動がおかしくなっちゃったので、`/run/shm`を作ってtmpfsをマウントすることで対処。

さらに、先ほど作ったefiパーティションをマウントします。
`/mnt/gentoo/boot/efi/`ってディレクトリを作って、`/dev/mmcblk0p1`をマウント。(/mnt/gentooの部分は環境に合わせてください)

## カーネルコンフィギュレーション
カーネルを設定する時に
```
Device Drivers --->
    [ ] Multiple devices driver support (RAID and LVM)
    [*] Network device support --->
        [*] Wireless LAN --->
            <*> Broadcom 43xx wireless support (mac80211 stack)
            [*] Broadcom 43xx SDIO device support
    <*> MMC/SD/SDIO card support --->
```
を有効にした。

multiple devices云々は有効にしているとSMPまわりでカーネルパニック起こすっぽいので無効化。

wifiまわりはこうするといいんじゃないかなーっていうだけの予測。本当に良いのかどうかは確認できず。

MMC/SD/SDIOも同じで、フィーリングで有効にしただけ。あながち間違いでもないと思うのだけれど・・・。

## grub2を入れる
grub2を入れる前に`/etc/portage/make.conf`を開いて
``` toml
GRUB_PLATFORMS="efi-32"
```
と追記しておいてください。UEFIに対応させる、ということのようです。
64bitのOSを入れるときにも32にしなきゃいけないので注意。

設定を書いたら、
```
# emerge grub
# grub2-install --target="i386-efi" /dev/mmcblk0
# grub2-mkconfig -o /boot/grub/grub.cfg
```
こんな感じでgrub2をインストール。
grub2-installのオプションだけガイドと違っているので注意。

---

という訳でここまでやるととりあえずgrubが起動して、カーネルの起動まではいける。
そしてルート(私の環境では/dev/mmcblk0p2)をマウントできないっていってカーネルパニックを起こして止まる。

カーネルオプションに**rootwait**付けると途中まで起動して、そのまま動かなくなる。

genkernelを使ってinitramfsを使うようにしてみたのだけれど、そうするとルートをマウントできないぞって言ってプロンプトが出る。

shellを起動できるみたいなのでしようかと思ったらキーボードが認識されていない(押しても反応しない)。
それっぽいカーネルオプションを片っ端から有効にしてみたけど変わらず反応せず。

もう疲れたよ・・・。いずれまたやります。

---

参考:
- [思い立ったがGentoo(UEFIブートできるようインストール) | 横あるき](http://knockcrab.blogspot.jp/2014/05/gentoouefi.html)
- [ASUS x205TA with lubuntu (ubuntu) - brownbro.github.io](http://brownbro.github.io/blog/2015/01/15/asus-x205ta-with-lubuntu/)
- [Windows 8.1 にて BIOS（UEFI）に入れないときは・・・ | でじまみ - 楽天ブログ](http://plaza.rakuten.co.jp/mscrtf/diary/201404070000/)
- [InstallingDebianOn/Asus/X205TA - Debian Wiki](https://wiki.debian.org/InstallingDebianOn/Asus/X205TA)
