---
title: pythonのOpenCVとpillow(PIL)を組み合わせて顔にモザイク
pubtime: 2015-02-08T22:44:00+09:00
modtime: 2015-07-01T00:00:00+09:00
tags: [Python, OpenCV, PIL, 画像処理]
image: [/blog/2015/02/python-opencv-pillow-facemosaic.png]
description: pythonのOpenCVを使って顔を検出して、pillowを使ってその顔にモザイクを掛けるというプログラムを書いてみました。
---

<ins data="2015-07-01">

# 2015-07-01 追記

[OpenCV単体でモザイクを掛ける方法についての記事](/blog/2015/02/python-opencv-mosaic)もあります。pillow経由するよりも楽です。

</ins>

OpenCVやれよ、となぜか[jskny氏](http://risdy.net/)に勧められたのでさくっと遊んでみた。

作ったのはOpenCVで画像に写っている顔を検出して、pillowでモザイクをかける、というもの。
サンプルコピーしてきて適当にいじってたら出来てしまった。OpenCVすごい。

``` python
#!/usr/bin/python2
#coding: utf-8

import cv2
from PIL import Image


IMAGE_PATH = 'lena.jpg'

imageIn = cv2.imread(IMAGE_PATH)  # 入力用にOpenCVで画像を読み込む。
imageOut = Image.open(IMAGE_PATH)  # 出力用にも画像を開く。こっちは加工が楽ちんなpillowで。

# OpenCVに付属している顔検出用の特徴量を読み込む。カスケード型分類器、というものらしい。
cascade = cv2.CascadeClassifier('/usr/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml')

# 顔のある座標のリストを作る。
#  戻り値は(x座標, y座標, 横幅, 縦幅)のリスト。numpyのarrayなので注意。
faces = cascade.detectMultiScale(imageIn, scaleFactor=1.1, minNeighbors=1, minSize=(50, 50))
print faces


if len(faces) > 0:
    for rect in faces:
        rect = rect.tolist()  # とりあえずnumpyのままだと使い辛いのでリストに変換。

        face = imageOut.crop((rect[0], rect[1], rect[0]+rect[2], rect[1]+rect[3]))  # 顔だけ切り抜いて

        face = face.resize((rect[2]/40, rect[3]/40))  # 40分の1のサイズに圧縮。
        face = face.resize(rect[2:])  # 元に戻せばモザイク画像の完成。

        imageOut.paste(face, tuple(rect[:2]))  # モザイクかけたものを元の画像に貼り付ける。

imageOut.save('mosaic_lena.jpg')
```
こんな感じ。説明するところが特に無いくらい簡単。

レナさんで試してみた。結構いい感じに認識してくれてます。

![顔にモザイクをかける前のレナさん](/blog/2015/02/lena.jpg "520x520")
![顔にモザイクをかけた後のレナさん](/blog/2015/02/mosaic_lena.jpg "520x520")

参考： [python+OpenCVで顔認識をやってみる - Qiita](http://qiita.com/wwacky/items/98d8be2844fa1b778323)
