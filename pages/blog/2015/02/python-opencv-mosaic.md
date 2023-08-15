---
title: pythonのOpenCVでモザイクをかける
pubtime: 2015-02-09T23:37:00+09:00
modtime: 2020-06-19T18:40:00+09:00
amp: hybrid
tags: [Python, OpenCV, モザイク]
image: [/blog/2015/02/python-opencv-mosaic.jpg]
description: python/OpenCVを使って、簡単に画像にモザイクを掛ける方法です。組み合わせで部分的なモザイクも可能なはずです。
---

[昨日の記事](/blog/2015/02/python-opencv-pillow-facemosaic)ではpillowに頼ってしまったけれど、リベンジにOpenCVだけで画像にモザイクをかけてみました。
[さっき書いた画像の貼り付け](/blog/2015/02/python-opencv-overlay)と組み合わせれば部分的なモザイクも可能なはず。

``` python
import cv2

img = cv2.imread('laughingman.png')

# オリジナルのサイズを保存しておく。
#  shapeで取得できるサイズとresizeの引数に渡すサイズでは横縦の順番が違うらしい。ので[::-1]として反転。
origsize = img.shape[:2][::-1]

img = cv2.resize(img, (origsize[0]//20, origsize[1]//20))  # 画像を20分の1のサイズに縮小。

img = cv2.resize(img, origsize, interpolation=False)  # 画像を元のサイズに拡大。interpolationを省略するとうまいこと補完されてしまって綺麗なモザイクにならない。

cv2.imwrite('output.jpg', img)
```
こんな感じで。
結構簡単にできた。pillow使わなくても十分だね。

実行結果はこんなん。

![モザイクかける前のレナさん](/blog/2015/02/lena.jpg "520x520")
![モザイクかけた後のレナさん](/blog/2015/02/fullmosaic_lena.jpg "520x520")

<PS date="2020-06-19" level={1}>

最新の環境（Python 3.8 / OpenCV 4.2）でも動くようにプログラムを更新しました。

</PS>
