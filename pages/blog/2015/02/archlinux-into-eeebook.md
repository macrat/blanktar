---
title: ASUS EeeBook x205TAにArch Linuxを入れてみた
pubtime: 2015-02-23T20:06:00+09:00
modtime: 2016-08-16T00:00:00+09:00
tags: [Linux, Arch, 環境構築]
description: ASUSのネットブック EeeBook x205TAにArch Linuxを入れる手順です。ひとまずインストールが成功するまで書いてありますが、ドライバ回りはわりとトラブルが山積しています…。
---

<ins date="2016-08-16">

# 2016-08-16 追記

[RemixOSを入れる記事](/blog/2016/08/remixos-install-into-asus-x205ta)もどうぞ。こちらはわりとちゃんと動いています。

</ins>

[gentooを入れようとした](/blog/2015/02/gentoo-into-eeebook)あとにubuntuを入れてみて、余計なプロセスが多くて気持ち悪いので今度はarch linuxを入れてみました。
とりあえず再現できる程度の情報を残しておきます。

[昨日の記事](/blog/2015/02/gentoo-into-eeebook)の手順で作った起動用のUSBメモリを使用して起動。
fdiskでパーティションを切ってフォーマット、**/mnt**以下にマウント。
そしたら公式wikiの[Install from existing Linux](https://wiki.archlinux.org/index.php/Install_from_existing_Linux)のMethod 1に従ってArchのBootstrapにchroot。

```
# pacman-key --init
# pacman-key --populate archlinux
```
として、あとは[インストールガイド](https://wiki.archlinux.org/index.php/Installation_Guide_%%28日本語%%29)のベースシステムのインストール以下を実行。

grubを入れるときは
```
# pacman -S grub efibootmgr
# grub-install --target="i386-efi" /dev/mmcblk0
```
としてインストール。

このままだとmmcの準備が終わる前にルートをマウントしようとしてカーネルパニックを起こすので、`/etc/default/grub`を開いて`GRUB_CMDLINE_LINUX_DEFAULT`に**rootwait**を設定する。
さらに、`GRUB_DISABLE_LINUX_UUID`のコメントアウトを外しておく。UUIDで設定すると同じカーネルパニックを起こしてしまう。

設定したら
```
# grub-mkconfig -o /boot/grub/grub.cfg
```
として設定ファイルを作る。

これでひとまずインストール完了。しかしWiFiやらバッテリーやらを認識していなかったり何だり、何とも上手くいかない。
カーネルのバージョンが新しくなれば色々改善するっぽい事は[書いてあったりする](https://plus.google.com/communities/117853703024346186936)のだけれど、何ともはや。
