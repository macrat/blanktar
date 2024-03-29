---
title: pythonのOpenCVでリアルタイムに笑い男
pubtime: 2015-02-09T02:24:00+09:00
modtime: 2020-06-19T18:24:00+09:00
tags: [Python, OpenCV, 画像処理]
description: python/Opencvを使って、webカメラの映像をリアルタイムで読み込んで顔を検出して、笑い男の画像を重ねるプログラムを作ってみました。
---

<ins date="2016-01-11">

# 2016-01-11 追記

[HTML5版](/blog/2016/01/html5-realtime-laughing-man)もあります。併せてどうぞ。

</ins>

[先ほどの記事](/blog/2015/02/python-opencv-pillow-facemosaic)から何だか調子に乗ってしまってリアルタイムな笑い男を作ってみた。
組み合わせればリアルタイムにモザイクももちろん出来るはず。眠いからやらないけれど。

今回はpillowを使わずにOpenCVとnumpyだけでやってみました。
そのせいで合成まわりが面倒くさくなってしまった感じ。素直にpillow使えばよかったかもしれない。

笑い男の画像はぐぐって拾ってきてください。透過pngなら何でも動くはず。多分。

``` python
#!/usr/bin/python3

import cv2
import numpy


cascade = cv2.CascadeClassifier('/usr/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml')  # 顔認識用の特徴量

cam = cv2.VideoCapture(0)  # カメラを開く

laugh = cv2.imread('laughingman.png', -1)  # 笑い男画像の読み込み。-1はαチャンネル付きということのようだ？
mask = cv2.cvtColor(laugh[:,:,3], cv2.COLOR_GRAY2BGR)/255.0  # 笑い男からαチャンネルだけを抜き出して0から1までの値にする。あと3チャンネルにしておく。
laugh = laugh[:,:,:3]  # αチャンネルはもういらないので消してしまう。

while True:
    ret, img = cam.read()  # カメラから画像を読み込む。

    if not ret:
        print('failed to read image')
        break

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 画像認識を高速に行うためにグレースケール化。
    gray = cv2.resize(gray, (img.shape[1]//4, img.shape[0]//4))  # そのままだと遅かったので画像を4分の1にしてさらに高速化。

    faces = cascade.detectMultiScale(gray)  # 顔を探す。

    if len(faces) > 0:
        for rect in faces:
            rect *= 4  # 認識を4分の1のサイズの画像で行ったので、結果は4倍しないといけない。

            # そのままだと笑い男が小さくって見栄えがしないので、少し大きくしてみる。
            #  単純に大きくするとキャプチャした画像のサイズを越えてしまうので少し面倒な処理をしている。
            rect[0] -= min(25, rect[0])
            rect[1] -= min(25, rect[1])
            rect[2] += min(50, img.shape[1]-(rect[0]+rect[2]))
            rect[3] += min(50, img.shape[0]-(rect[1]+rect[3]))

            # 笑い男とマスクを認識した顔と同じサイズにリサイズする。
            laugh2 = cv2.resize(laugh, tuple(rect[2:]))
            mask2 = cv2.resize(mask, tuple(rect[2:]))

            # 笑い男の合成。
            img[rect[1]:rect[1]+rect[3], rect[0]:rect[0]+rect[2]] = laugh2[:,:] * mask2 + img[rect[1]:rect[1]+rect[3], rect[0]:rect[0]+rect[2]] * (1.0 - mask2)

    cv2.imshow('laughing man', img)

    if cv2.waitKey(10) > 0:
        break

cam.release()
cv2.destroyAllWindows()
```


<ins date="2020-06-19">

# 2020-06-19 追記

最新の環境（Python 3.8 / OpenCV 4.2）でも動くようにプログラムを更新しました。

</ins>

---

参考：
- [【Python/OpenCV】カメラのキャプチャと保存](http://python-gazo.blog.jp/opencv/Webカメラ画像取得)
- [overlay a smaller image on a larger image python OpenCv - Stack Overflow](http://stackoverflow.com/questions/14063070/overlay-a-smaller-image-on-a-larger-image-python-opencv)
