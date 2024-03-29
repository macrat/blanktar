---
title: gentooのカーネル更新したらvboxdrvがどっか行った
pubtime: 2015-01-23T21:14:00+09:00
tags: [Gentoo, VirtualBox]
description: gentooのカーネルを更新したら、"vboxdrv"というカーネルモジュールを読み込めなくなってしまいました。この問題の解決方法です。
---

色々アップデートするかーとか思い立ってgentooのカーネルを新しくしました。
そしたら、VirtualBoxの仮想マシンが起動しなくなりまして。曰く、<strong>vboxdrv</strong>が読み込まれてないから読み込めとのこと。

**vboxdrv**ってのはvirtualboxの仮想マシンを動かすためのカーネルモジュールで、`/etc/conf.d/modules`に設定を書き込むことで・・・
``` toml
modules="vboxdrv vboxnetflt"
```
あれ、きちんと書いてある。そりゃそうだ、virtualboxインストールした時に書いたもの。

じゃ手動で・・・
```
# modprobe vboxdrv
modprobe: FATAL: Module vboxdrv not found.
```
あれ？ 見つからない。

調べてみたら、モジュールは**app-emulation/virtualbox-modules**ってパッケージに入っているそうな。
カーネルの設定変えたしその辺だろうって事で
```
# emerge --oneshot virtualbox-modules
```
さくっと入れ直してみる。

で、手動で読み込んでみる。
```
# modprobe vboxdrv
```
行けた。

起動もしたのでこれでおっけーっぽい。（vboxdrvの他にvboxnetfltもmodprobeする必要があったけどね）

カーネルをアップデートしたら、カーネルモジュールの類も気をつけましょう、ってことで。

参考: [VirtualBox - Gentoo Wiki](http://wiki.gentoo.org/wiki/VirtualBox#Running)
