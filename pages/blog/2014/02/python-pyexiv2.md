---
title: pythonのpyexiv2でExifをごにょごにょする
pubtime: 2014-02-05T01:56:00+09:00
amp: hybrid
tags: [Python, pyexiv2, Exif, 画像処理]
description: pythonのpyexiv2というモジュールを使ってjpegのExifデータを読み込んだり書き込んだりを試してみました。
---

前に[PILでExifを読む方法](/blog/2013/11/python-exif-with-pil)を書いたけれど、今回は書き込む方法。

どうやらPILでは出来ないらしいので、**pyexiv2**ってライブラリを使います。
ダウンロードは[公式サイト](http://tilloy.net/dev/pyexiv2/)からどうぞ。インストールは適当に。

# Exifデータを読み込む
``` python
>>> img = pyexiv2.ImageMetadata('test.jpg')
>>> img.read()

>>> img.exif_keys
[ ... keyのリスト ... ]

>>> value = img['Exif.Image.DateTime']
>>> value.value
datetime.datetime(2014, 1, 24, 15, 40, 16)
>>> value.raw_value
'2014:01:24 15:40:16'
```
みたいな感じ。

時間とかパースした状態で返してくれるから、もしかしたらPIL使うよりも楽かも。
対応している要素の種類も多いっぽいし。

# Exifデータを書き込む
``` python
>>> img = pyexiv2.ImageMetadata('test.jpg')
>>> img.read()

>>> img['Exif.Image.UserComment'] = 'this is test'

>>> img.write()
```
こんな感じで書き込める。
結構簡単。

# 他の画像からExifデータだけコピーする
``` python
>>> src = pyexiv2.ImageMetadata('src.jpg')
>>> src.read()

>>> dst = pyexiv2.ImageMetadata('dst.jpg')
>>> dst.read()

>>> src.copy(dst)

>>> dst.write()
```
以上、これだけでコピーできる。dst.jpgを上書きするので注意。

---

キーが妙に長いのが辛いねー。ま、楽だからいいけれど。

参考:
- <a href="http://tilloy.net/dev/pyexiv2/tutorial.html" target="_blank">Tutorial - pyexiv2 v0.3.2 documentation</a>
- <a href="http://tilloy.net/dev/pyexiv2/api.html" target="_blank">API documentation - pyexiv2 v0.3.2 documentation</a>
