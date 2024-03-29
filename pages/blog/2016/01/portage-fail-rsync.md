---
title: portageをsyncしようとすると.gitがどうので怒られる。
pubtime: 2016-01-04T17:54:00+09:00
tags: [Gentoo]
description: gentooのportageがある日突然「/usr/portage appears to be under revision control」と言ってsync出来なくなってしまった問題への対処方法のメモです。
---

いつも通り`portage --sync`しようとしたところ、こんなエラーが出ていました。
```
# emerge --sync
>>> Syncing repository 'gentoo' into '/usr/portage'...
!!! /usr/portage appears to be under revision control (contains .git).
!!! Aborting rsync sync.
```
面倒臭かったのでしばらく放置していたのだけれど、いい加減なんとかしないといかんと思って対応。

`repos.conf`はこんな感じ。
``` toml
[DEFAULT]
main-repo = gentoo

[gentoo]
location = /usr/portage
sync-type = rsync
sync-uri = rsync://rsync.jp.gentoo.org/gentoo-portage
auto-sync = yes
```
ふつうです。

gitがどうのと言っているので、とりあえず問題のディレクトリを見に行ってみる。
```
$ ls -a /usr/portage/ | grep .git
.git
```
普通にある。

gitのディレクトリなのにrsyncするなよって事っぽいので、`.git`をリネームしてみる。
```
# mv /usr/portage/{.git,git_backup}
```
これだけで多分平気。
あとはいつも通りsync出来ます。
大丈夫そうなら、バックアップしておいた`/usr/portage/git_backup`は消しておっけーです。


参考： [Gentoo Forums :: View topic - portage appears to be under revision control (contains .git)](https://forums.gentoo.org/viewtopic-t-1034256.html?sid=2832fc53b9ee963ab21db79a659636ac)
