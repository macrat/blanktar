---
title: python/OpenCVで透過pngをオーバレイする
pubtime: 2015-02-09T22:46:00+09:00
modtime: 2020-06-19T18:31:00+09:00
tags: [Python, OpenCV, 画像処理]
image: [/blog/2015/02/python-opencv-overlay.png]
description: python/OpenCVを使って、画像の上に別の画像を重ねる方法の解説です。透過画像のアルファチャンネルを考慮するものとしないものの2種類があります。
---

[昨日のリアルタイムな笑い男](/blog/2015/02/python-opencv-realtime-lauhgingman)を実装するために使っていた画像の合成っていうかオーバレイっていうか上書きっていうか、とにかく笑い男をかぶせる奴。ググってもなかなかそれっぽい情報が出てこないので記録。

レナさんの画像に適当に書いた星マークを乗っけます。

![レナさん](/blog/2015/02/lena.jpg "520x520")
![適当な五芒星](/blog/2015/02/burdockStar.png "200x200")


とりあえず透過とか考えずに乗っけるだけ乗っけたバージョン。
``` python
import cv2

src = cv2.imread('star.png')  # 乗っけたい画像。星。
dst = cv2.imread('lena.jpg')  # 下敷きになる画像。レナさん。

width, height = src.shape[:2]  # サイズを取得しておく。

# dst[上のy座標:下のy座標, 左のx座標:右のx座標]
dst[0:height, 0:width] = src

cv2.imwrite('out.jpg', dst)
```

凄くシンプル。

結果はこんな感じ。

![透過を無視して上書きした画像](/blog/2015/02/simple_overlay.jpg "520x520")


で、アルファチャンネルを考慮して乗っけるバージョン。
``` python
import cv2

src = cv2.imread('star.png', -1)  # -1を付けることでアルファチャンネルも読んでくれるらしい。
dst = cv2.imread('lena.jpg')

width, height = src.shape[:2]

mask = src[:,:,3]  # アルファチャンネルだけ抜き出す。
mask = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)  # 3色分に増やす。
mask = mask / 255  # 0-255だと使い勝手が悪いので、0.0-1.0に変更。

src = src[:,:,:3]  # アルファチャンネルは取り出しちゃったのでもういらない。

dst[0:height:, 0:width] *= 1 - mask  # 透過率に応じて元の画像を暗くする。
dst[0:height:, 0:width] += src * mask  # 貼り付ける方の画像に透過率をかけて加算。

cv2.imwrite('out.jpg', dst)
```
ちょっと長くなった。

結果はこんな。

![透過を考慮して乗っけた画像](/blog/2015/02/trans_overlay.jpg "520x520")

<ins date="2020-06-19">

# 2020-06-19 追記

最新の環境（Python 3.8 / OpenCV 4.2）でも動くようにプログラムを更新しました。

</ins>
