---
title: CONFIG_DEVTMPFSがどうのでgentooが起動しない
pubtime: 2013-01-27T01:39:00+09:00
amp: hybrid
tags: [Gentoo, devtmpfs]
description: OpenRCなgentooをカーネルアップデートしたあに「CONFIG_DEVTMPFS」とかいうエラーを出して起動しなくなった場合の対処方法です。
---

うちの子のgentooをアップデートしたら、起動しなくなりました。むぅ。

`CONFIG_DEVTMPFS`とか言ったっきり起動が停止してしまう。
で、ググりました。

どうやらudevのアップデートによって問題が起こるっぽい。
LiveCDかなんかからgentooのカーネル設定を開いて
```
Device Drivers  --->
	Generic Driver Options  --->
		[*] Maintain a devtmpfs filesystem to mount at /dev
```
ってやる。
やるだけ、うん。
initrdとか使ってるとまた違うっぽいけどね。まあ、知らん。

参考： [Initramfs - Gentoo Linux Wiki](http://en.gentoo-wiki.com/wiki/Initramfs#devtmpfs)
