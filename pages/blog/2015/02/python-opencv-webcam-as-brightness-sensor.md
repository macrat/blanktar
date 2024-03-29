---
title: python/OpenCVでwebカメラを使ったlinuxの液晶の明るさ自動調整
pubtime: 2015-02-28T15:53:00+09:00
modtime: 2020-06-19T18:43:00+09:00
tags: [Linux, Python, OpenCV, 画像処理]
description: python/OpenCVでwebカメラの映像から周囲の明るさを検出して、自動的に最適な画面の明るさを設定してくれるプログラムを作りました。
---

スマホについてるモニターの明るさを自動で調節してくれる機能、あれ結構便利だよね。
環境が不安定だと頻繁に変わりすぎてウザいけど。

ノートPCにはwebカメラがついている訳で、カメラがあるなら明るさが分かる訳で、それなら自動調整できたって良いじゃないってことでやってみた。

``` python
import cv2
import numpy

cam = cv2.VideoCapture(0)

img = cv2.cvtColor(cam.read()[1], cv2.COLOR_BGR2GRAY)
level = numpy.average(img)/255.0

with open('/sys/class/backlight/intel_backlight/max_brightness', 'r') as fp:
    maxlevel = int(fp.read())

with open('/sys/class/backlight/intel_backlight/brightness', 'w') as fp:
    fp.write(str(int(level*maxlevel)))
```
これだけ。簡単だ！？

画像を取得してグレースケール化して、そいつの輝度の平均を取って0.0-1.0のレベルとしておく。

んで、sysfsにある`max_brightness`ってファイルで液晶の明るさの最大値を取得。範囲をそれに合わせて、今度は`brightness`ってファイルに書き込めば完了。cronか何かで定期的に呼べばお手軽自動調整。

私の環境では**intel_backlight**だったけれど、PCによって違うと思うので適宜。

ものすごーく適当に作ったやつだけれど、結構いい感じに調整してくれたのでとても満足。
acpidと連携してモニターを開いた数秒後とか、画面ロックを解除したあととかに実行するようにすると凄くいい感じのものが出来るかもね？ 夢が広がる。

<ins date="2020-06-19">

# 2020-06-19 追記

最新の環境（Python 3.8 / OpenCV 4.2）でも動くようにプログラムを更新しました。

</ins>
