---
title: opencvで作った画像をpygameで描画する。
pubtime: 2016-01-14T15:46:00+09:00
tags: [Python, OpenCV, 画像処理]
description: PythonのOpenCVで作った画像を、PyGameを使って描画してみました。単純にOpenCVのimshowを使うよりも良い感じの見た目で、すこし速く描画出来ます。
---

pythonのOpenCVで作った画像をOpenCVでそのまま描画すると何だかインターフェースが微妙です。なんとなくですが、速さも無い感じがします。
折角ならもっと描画向きのライブラリを使いたいと思ったので、pygameと連携してみることにしました。

変換は以下のような感じで出来ます。
``` python
>>> opencv_image = opencv_image[:,:,::-1]  # OpenCVはBGR、pygameはRGBなので変換してやる必要がある。
>>> shape = opencv_image.shape[1::-1]  # OpenCVは(高さ, 幅, 色数)、pygameは(幅, 高さ)なのでこれも変換。
>>> pygame_image = pygame.image.frombuffer(opencv_image.tostring(), shape, 'RGB')
<Surface(848x480x24 SW)>
```
こんな感じ。色の順番と、サイズの順番の両方を変換する必要がある、というのがポイントです。

描画するときは普通に読み込んだ画像と同じく以下のように。
``` python
>>> x = 0
>>> y = 0
>>> screen.blit(img, (x, y))
```
ふつうです。


参考： [python - OpenCV cv2 image to PyGame image? - Stack Overflow](http://stackoverflow.com/questions/19306211/opencv-cv2-image-to-pygame-image)
