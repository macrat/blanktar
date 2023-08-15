---
title: ACCESS VIOLATION SUMMARY とかいうエラー
pubtime: 2013-02-05T02:47:00+09:00
amp: hybrid
tags: [Gentoo, Portage, sandbox]
description: gentooのアップデートをしていたら発生した「ACCESS VIOLATION SUMMARY」から始まるエラーに対応する方法です。
---

gentooのアップデートをしていたら
```
-------------------- ACCESS VIOLATION SUMMARY --------------------
LOG FILE "/var/log/sandbox/sandbox-17478.log"

VERSION 1.0
FORMAT: F - Function called
FORMAT: S - Access Status
FORMAT: P - Path as passed to function
FORMAT: A - Absolute Path (not canonical)
FORMAT: R - Canonical Path
FORMAT: C - Command Line

F: open_wr
S: deny
P: /usr/share/info/tcc-doc.info
A: /usr/share/info/tcc-doc.info
R: /usr/share/info/tcc-doc.info
C: install tcc-doc.info /usr/share/info

----------------------------------------------------------------------
```
みたいなトラブルが。

どうやらportageのsandboxって機能が邪魔してるっぽい。
作業ディレクトリ以外への書き込みを禁止する機能、らしいね。
安全性のためのものなので、無効化するのはまずい、が、今回はやむを得ない。

という訳でこんな感じで実行
``` shell
$ sudo FEATURES="-sandbox" emerge --resume
```
これで無事行けました。よかった。

ちなみに、`--resume`ってのは、前回中断した作業を再開するって意味ね。
必要に応じてパッケージ名なりなんなりに置き換えてくださいまし。

---

参考：
- [Elisa - Gentoo Linux Wiki](http://en.gentoo-wiki.com/wiki/Elisa#Installing_Elisa)
- [Portageマニュアル - Gentoo Linux ドキュメント](http://www.gentoo.org/doc/ja/portage-manual.xml)
