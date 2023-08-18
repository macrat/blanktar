---
title: python/OpenCVで複数の画像から背景だけを取り出す
pubtime: 2015-08-24T21:33:00+09:00
tags: [Python, OpenCV, 画像処理]
image: [/blog/2015/08/python-opencv-guess-background.jpg]
description: 同じ場所で撮られた複数の画像を処理して、その場所の背景画像を生成するプログラムをPython/OpenCVで実装してみました。動体検出の仕組みを応用して自分で実装しています。
---

同じ場所で撮られた複数枚の画像、あるいは動画から背景だけを抽出する、というのをしばらく前にやったのでメモ。
新しいバージョンのOpenCVだと組み込みで背景抽出の関数があるそうですが、これはやっつけ仕事でやったやつなので、シンプルに動体検出の応用で出来ています。

ここにサイコロの画像が6枚あります。

![キーボードの上にサイコロが転がっている画像6枚](/blog/2015/08/guess-background-input.jpg "1920x854")

この画像から背景だけ、つまりはキーボードだけが写った画像を作ろうというのが今回の目的。

とりあえずソースコードから。
``` python
import numpy
import cv2


def guessBackground(imgs, threshold=16):
    old = imgs[0]
    result = numpy.zeros_like(imgs[0])

    for img in imgs[1:]:
        mask = cv2.absdiff(old, img)
        result = result*(mask >= threshold) + img*(mask < threshold)

        old = img

    return result


imgs = []
for i in range(6):
    imgs.append(cv2.imread('{0}.jpg'.format(i)))

result = guessBackground(imgs)
cv2.imshow('result', result))

cv2.waitKey()
```
`cv2.absdiff`を使って二枚の画像の差分を計算して、差の少ない部分のデータだけを蓄積していくだけのコードです。とってもシンプル。

このコードで生成した出力がこちら。

![背景だけを抽出してサイコロが無くなったっぽい画像](/blog/2015/08/guess-background-result.jpg "1024x684")

ほこりっぽい。掃除しよ…。というのはともかくとして、わりと綺麗に消えています。
エンターキーのあたりに影が残っているのは、入力画像のうち3枚がエンターにサイコロが乗っているから、かな。当然ですが入力が偏ればこんな結果になります。

入力画像を入力された順番でしか比較しないので微妙な精度ですが、順番を入れ換えたりすればもっと綺麗に出来たりもします。自動で上手いことやるのも可能なはず。
まあでも、これだけ適当でもそれっぽいのが出来るよ、ということで。
