---
title: python/OpenCVでレシートみたいな四角いものを見つけてトリミングする
pubtime: 2015-07-04T14:23:00+09:00
modtime: 2020-06-19T18:16:00+09:00
amp: hybrid
tags: [Python, OpenCV, トリミング]
image: [/blog/2015/07/python-opencv-crop-box.png]
description: PythonとOpenCVを使って、レシートやメモのような四角い領域を見付けて、その部分だけ綺麗に切り抜くプログラムを書いてみました。
---

pythonでOpenCV使ってレシートとかメモとかその他諸々の四角い領域を発見、そいつを切り抜く。そんな感じのプログラムを書きました。
書きましたって言ってもだいぶ前に書いたやつなのですが、リクエストがあったので公開します。

とりあえずソースコード。大雑把な解説は下に。
``` python
#!/usr/bin/python3

import cv2
import numpy


def transform_by4(img, points):
    """ 4点を指定してトリミングする。 """

    points = sorted(points, key=lambda x:x[1])  # yが小さいもの順に並び替え。
    top = sorted(points[:2], key=lambda x:x[0])  # 前半二つは四角形の上。xで並び替えると左右も分かる。
    bottom = sorted(points[2:], key=lambda x:x[0], reverse=True)  # 後半二つは四角形の下。同じくxで並び替え。
    points = numpy.array(top + bottom, dtype='float32')  # 分離した二つを再結合。

    width = max(numpy.sqrt(((points[0][0]-points[2][0])**2)*2), numpy.sqrt(((points[1][0]-points[3][0])**2)*2))
    height = max(numpy.sqrt(((points[0][1]-points[2][1])**2)*2), numpy.sqrt(((points[1][1]-points[3][1])**2)*2))

    dst = numpy.array([
            numpy.array([0, 0]),
            numpy.array([width-1, 0]),
            numpy.array([width-1, height-1]),
            numpy.array([0, height-1]),
            ], numpy.float32)

    trans = cv2.getPerspectiveTransform(points, dst)  # 変換前の座標と変換後の座標の対応を渡すと、透視変換行列を作ってくれる。
    return cv2.warpPerspective(img, trans, (int(width), int(height)))  # 透視変換行列を使って切り抜く。


if __name__ == '__main__':
    cam = cv2.VideoCapture(0)

    while cv2.waitKey(10) == -1:
        orig = cam.read()[1]

        lines = orig.copy()

        # 輪郭を抽出する
        canny = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)
        canny = cv2.GaussianBlur(canny, (5, 5), 0)
        canny = cv2.Canny(canny, 50, 100)
        cv2.imshow('canny', canny)

        cnts = cv2.findContours(canny, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)[0]  # 抽出した輪郭に近似する直線（？）を探す。
        cnts.sort(key=cv2.contourArea, reverse=True)  # 面積が大きい順に並べ替える。

        warp = None
        for i, c in enumerate(cnts):
            arclen = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02*arclen, True)

            level = 1 - float(i)/len(cnts)  # 面積順に色を付けたかったのでこんなことをしている。
            if len(approx) == 4:
                cv2.drawContours(lines, [approx], -1, (0, 0, 255*level), 2)
                if warp is None:
                    warp = approx.copy()  # 一番面積の大きな四角形をwarpに保存。
            else:
                cv2.drawContours(lines, [approx], -1, (0, 255*level, 0), 2)

            for pos in approx:
                cv2.circle(lines, tuple(pos[0]), 4, (255*level, 0, 0))

        cv2.imshow('edge', lines)

        if warp is not None:
            warped = transform_by4(orig, warp[:,0,:])  # warpが存在した場合、そこだけくり抜いたものを作る。
            cv2.imshow('warp', warped)

    cam.release()
    cv2.destroyAllWindows()
```
長いけど、やってることは割と単純。

1. カメラから画像を読み取って、`cv2.Canny`で輪郭を抽出。
2. 抽出した輪郭画像から`cv2.findContours`で輪郭を座標に直す。
3. 見つけた輪郭線を画像に描画しつつ、一番面積の大きな四角形を見つける。
4. 四角形があれば、そのエリアをトリミングする。

オリジナルの画像がこんな感じだとすると

![オリジナルの画像](/blog/2015/07/crop-box-original.jpg "640x480")

こんな感じで輪郭を見つけて

![輪郭線に色を付けた画像](/blog/2015/07/crop-box-edge.jpg "640x480")

一番大きな四角形（赤で表示されていた輪郭）をくり抜く。

![トリミングされた画像](/blog/2015/07/crop-box-warp.jpg "640x480")

あんまり精度は高くないですが、割と楽しい、かも。
改良の余地はかなりありそうな気がします。


<PS date="2020-06-19" level={1}>

最新の環境（Python 3.8 / OpenCV 4.2）でも動くようにプログラムを更新しました。

</PS>
