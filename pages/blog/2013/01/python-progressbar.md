---
title: pythonのコンソールでプログレスバー的なもの
pubtime: 2013-01-17T00:48:00+09:00
modtime: 2020-03-28T20:15:00+09:00
tags: [Python]
description: Pythonで作ったCLIコマンドで、プログレスバーのようなものを表示する方法です。
---

pythonでさ、プログレスバー書きたくなる事あるじゃないですか。
というわけでstarで使ってるロジックをご紹介。
ていってもまあ、すごいしょーもない内容ですが。

<ins date="2020-03-28T20:15:00+09:00">

# 2020-03-28 追記

starの公開は終了しています。

</ins>

``` python
#!/usr/bin/python

import sys
import time

def PutBar(per, barlen):
	perb = int(per/(100.0/barlen))

	s = '\r'
	s += '|'
	s += '#' * perb
	s += '-' * (barlen - perb)
	s += '|'
	s += ' ' + (str(per) + '%').rjust(4)

	sys.stdout.write(s)

for per in range(100):
	PutBar(per, 50)
	time.sleep(0.1)
PutBar(100, 50)
```
以上、これだけだ。
\r、つまりキャリッジリターンってやつ。復帰だっけ？
左端にカーソルを戻してから、プログレスバーを描画・・・っていうか、書き込む訳ですな。
```
\r|##########----------|  50%
```
的なね。
ご活用くださひ。
