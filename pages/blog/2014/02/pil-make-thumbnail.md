---
title: PILで縦横比保ったまま画像を縮小
pubtime: 2014-02-03T22:56:00+09:00
tags: [Python, PIL, 画像処理]
description: Python/PILで、画像の縦横比を保ったまま画像を小さくする方法です。長辺を指定の長さに合せてくれるます。
---

pythonの画像処理ライブラリ**PIL**で縦横の比率を維持したまま画像をちっちゃくする方法。
サムネイルとか作るときにどうぞ。

``` python
from PIL import Image

img = Image.open('test.jpg')
img.thumbnail((360, 360), Image.ANTIALIAS)
img.save('thumb.jpg')
```
こんな感じ。

test.jpgを長辺が360pxになるように調節してthumb.jpgに保存します。
resizeと違って破壊的な動作になるので注意。

`Image.ANTIALIAS`は別に無くてもいいのだけれど、アンチエイリアスしてもらったほうが綺麗になる気がするので。
実際はどうだろう、画像にもよるか。
