---
title: tsocks使ってみたらlocal subnetがどうのこうので失敗した
pubtime: 2014-09-07T22:24:00+09:00
amp: hybrid
tags: [tsocks, socks, subnet]
description: tsocksを使っているときに発生した「xxx.xxx.xxx.xxx is not on a local subnet!」というようなエラーを修正する方法です。
---

tsocks試してたら、
```
$ tsocks wget http://blanktar.jp
--2014-09-07 22:15:13--  http://blanktar.jp/
blanktar.jp をDNSに問いあわせています... 192.168.1.2
blanktar.jp|192.168.1.2|:80 に接続しています... 22:15:13 libtsocks(16347): SOCKS server 192.168.1.2 (192.168.1.2) is not on a local subnet!
失敗しました: 接続を拒否されました.
```
みたいなエラーが。IPアドレスは適当です。

色々試したところ、`local`とか言う設定項目を何とかすると良いらしい。
設定ファイル開いて
```
local = 192.168.1.0/255.255.255.0
server = 192.168.1.2
```
みたいにしてみた。

動いた。

うーん、思いのほか単純だった。

参考: [Ubuntu Manpage: tsocks.conf - configuration file for tsocks(8)](http://manpages.ubuntu.com/manpages/intrepid/man5/tsocks.conf.5.html)
