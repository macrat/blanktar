---
title: systemd-networkdを導入したgentooでMTUの設定を永続化
pubtime: 2017-03-22T01:50:00+09:00
tags: [Linux, Gentoo, ネットワーク, 環境構築]
description: systemd-networkdを使って、MTUの設定（ジャンボフレームの設定）を永続化する方法です。
---

すこし前にsystemdに乗り換えたのですが、そのせいで[前に設定したジャンボフレーム](/blog/2014/10/jumbo-frame-in-gentoo)が無効になってしまっていました。
特段困りもしないので放置していたのですが、なんとなく設定しなおしてみました。

`/etc/systemd/network/eth0.network`を開いて、以下のような記述を追加します。
``` ini
[Link]
MTUBytes=6122
```
で、再起動すれば設定が反映されているはず。簡単ですね。

ちなみに、`/usr/lib/systemd/network/99-default.link`を書き換えればデフォルトの設定を変更出来るようです。そっちでも良いかも。

参考: [systemd-networkd - ArchWiki](https://wiki.archlinuxjp.org/index.php/Systemd-networkd#network_.E3.83.95.E3.82.A1.E3.82.A4.E3.83.AB)

