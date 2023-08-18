---
title: python/OpenCVで輪郭検出してたらなんかかっこいい画像が出来た
pubtime: 2015-02-09T23:12:00+09:00
tags: [Python, OpenCV, 画像処理]
image: [/blog/2015/02/triple_canny.jpg]
description: python/OpenCVを使って輪郭検出をして、ちょっと格好良さげな画像を作ってみました。
---

OpenCV楽しくてやばいですはい。
輪郭検出も出来るようで、キャニー法とやらを使って軽く遊んで見ました。
遊んでたらなんかかっこいいのが出来ました。

ターゲットにするのは今回はレナさんではなくて、立川で撮ってきた謎の道祖神くん。

![立川の謎の道祖神くん](/blog/2015/02/canny_original.jpg "1024x681")

で、肝心のキャニー法の使い方はこんな感じ。
``` python
import cv2

img = cv2.imread('in.jpg')

out = cv2.Canny(img, 50, 150)

cv2.imwrite('out.jpg', out)
```
おお、かつてなく簡単だ。
これだけで輪郭を検出できてしまう。

出力はこんな。

![輪郭検出された立川の道祖神くん](/blog/2015/02/single_canny.jpg "1024x681")

パラメータ変えるとちょっとずつ出力が変わって面白いので、3通りやって重ねてみた。
``` python
import cv2

img = cv2.imread('in.jpg')

b = cv2.Canny(img, 25, 200)
g = cv2.Canny(img, 50, 150)
r = cv2.Canny(img, 100, 100)

img[:,:,0] = b
img[:,:,1] = g
img[:,:,2] = r

cv2.imwrite('out.jpg', img)
```
これはこれでシンプル。
赤、青、緑のそれぞれにパラメータ違いで重ねています。

んで、結果がこんな。

![3通りの輪郭検出された立川の道祖神くん](/blog/2015/02/triple_canny.jpg "1024x681")

超かっこいい！
