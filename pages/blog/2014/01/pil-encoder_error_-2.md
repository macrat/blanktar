---
title: PILで保存するときにencoder error -2とか言われた。
pubtime: 2014-01-15T01:58:00+09:00
tags: [Python, PIL, 画像処理]
description: Python/PILでプログレッシブJPEGを保存しようとした時に発生する「encoder error -2 when writing image file」というエラーへの対処方法です。
---

pythonで画像を扱えるライブラリ、PIL。
なんとプログレッシブJPEGを扱えたり、最適化してくれたりするらしい。

というわけで試してみたら、`IOError: encoder error -2 when writing image file`。

こんな感じ。
``` python
>>> from PIL import Image

>>> img = Image.open('test.jpg')
>>> img.save('test.jpg')  # これなら問題ない。

>>> img.save('test.jpg', progressive=True)  # こうすると怒られる。
Suspension not allowed here
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File " -- 中略 -- \site-packages\PIL\Image.py", line 1439, in save
    save_handler(self, fp, filename)
  File " -- 中略 -- \site-packages\PIL\JpegImagePlugin.py", line 471, in _save
    ImageFile._save(im, fp, [("jpeg", (0,0)+im.size, 0, rawmode)])
  File " -- 中略 -- \site-packages\PIL\ImageFile.py", line 501, in _save
    raise IOError("encoder error %d when writing image file" % s)
IOError: encoder error -2 when writing image file

>>> img.save('test.jpg', optimize=True)  # やっぱり怒られる。
-- 中略 --
Suspension not allowed here
Traceback (most recent call last):
 -- 中略 --
IOError: encoder error -2 when writing image file
```
みたいなね。

さて、どういうことか。全然分からん。
よく分からんのだけれど、対処方法は分かったのでメモるよ。

``` python
>>> from PIL import Image, ImageFile

>>> img = Image.open('test.jpg')
>>> ImageFile.MAXBLOCK = img.size[0] * img.size[1]  # これをやれば動く。
>>> img.save('test.jpg', progressive=True)  # 普通に動く。
>>> img.save('test.jpg', optimize=True)  # やっぱり動く。
```
という感じで治るらしい。

縦\*横以外の値を指定しても問題はないっぽいのだけれど、長辺の長さとかだとダメだった。少なすぎるとダメっぽい？
よく分からんけれど、動くからいいだろう、きっと。
