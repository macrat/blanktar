---
title: gentooでtimezone-dataとやらをアップデートしようとしたらsymbolic linkがどうので失敗した
pubtime: 2014-05-24T15:44:00+09:00
tags: [Gentoo]
description: gentooの`sys-libs/timezone-data-2014a`を更新しているときに発生する、`Too many levels of symbolic links`というエラーへの対処方法です。
---

gentooのportageでアップデートしようとしたら、**sys-libs/timezone-data-2014a**のアップデート中に
```
OSError: [Errno 40] Too many levels of symbolic links: '/usr/share/zoneinfo/posix/America/Eirunepe'
```
とか言われて失敗。
シンボリックリンクが深すぎるということらしい。

いろいろ試したけど分からんので、噂のシンボリックリンクを見に行ってみる。
``` shell
$ cd /usr/share/zoneinfo/
$ ls posix
ls: cannot access posix: Too many levels of symbolic links
$ ll posix
lrwxrwxrwx 1 root root 15 May 21 21:47 posix -> .gentoo-upgrade
$ ll .gentoo-upgrade
lrwxrwxrwx 1 root root 15 May 21 21:45 .gentoo-upgrade -> .gentoo-upgrade
```
・・・うん、そりゃ無理だと思うよ？ 循環参照してるよ？

というわけで、**posix**ってやつを削除してもう一度挑戦。
そしたらうまくいきました。

なんだろうねーこれ。
