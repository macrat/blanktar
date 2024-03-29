---
title: python/Pillowで輪郭を見つけたり強調したり
pubtime: 2015-09-03T16:38:00+09:00
tags: [Python, PIL, 画像処理]
image: [/blog/2015/09/python-pillow-image-edges.png]
description: Pythonの画像処理ライブラリPillow（PIL）で、輪郭の検出や強調などのタスクを試してみました。
---

しばらく前に[OpenCVで輪郭検出](/blog/2015/02/python-opencv-contour-detection)をやりましたが、それに近いことが**Pillow**で出来るらしいのでやってみました。
OpenCVと比べると簡単に出来ることは多いけれど、その分細かい調整は出来ない、そんな感じみたいです。

例によって、こちらのレナさんの画像に手を加えてゆきます。

![恒例のレナさん](/blog/2015/09/lena.jpg "520x520")

まずは最もシンプルな輪郭検出。
``` python
from PIL import Image, ImageFilter

img = Image.open('lena.jpg')
filtered = img.filter(ImageFilter.FIND_EDGES)
filtered.save('edges.jpg')
```
こんな感じ。
出力は以下のようになります。

![黒地に白い線でレナさん](/blog/2015/09/lena_edges.jpg "520x520")

`CONTOUR`を使うと、`FIND_EDGES`で得られる画像を白黒反転させたような画像を得られます。
``` python
img.filter(ImageFilter.CONTOUR).save('contour.jpg')
```
だいぶ書き方を省略しましたが、基本的にはなにも変わってません。
filterの引数が変わっただけですね。
出力は以下のような感じに。

![輪郭を白地に黒い線で書いたレナさん](/blog/2015/09/lena_contour.jpg "520x520")

更に、輪郭強調も出来ます。
シンプルな方法は以下の二通り。
``` python
img.filter(ImageFilter.EDGE_ENHANCE).save('enhance.jpg')
img.filter(ImageFilter.EDGE_ENHANCE_MORE).save('enhance_more.jpg')
```
上が弱め、下が強め。そのまんまですね。
細かい調整はどうも出来ないっぽいです。
出力はこんな感じ。

![弱い輪郭強調を掛けたレナさん](/blog/2015/09/lena_enhance.jpg "520x520") ![強い輪郭強調を掛けたレナさん](/blog/2015/09/lena_enhance_more.jpg "520x520")

一枚目が弱い方、二枚目が強い方です。
不自然に輪郭が際立ってしまった感じ。そしてノイズを拾いまくり。

ある程度ナチュラルに強調してくれる`SHAPEN`ってやつがあります。
``` python
img.filter(ImageFIlter.SHAPEN).save('shapen.jpg')
```
なんというか、お察しの通りな書き方？
出力はこんな感じ。

![シャープ化したレナさん](/blog/2015/09/lena_shapen.jpg "520x520")

ちょっともの足りない感じがします。

`SHAPEN`は自分でパラメータを決めることが出来るようで、以下のような書き方をします。
``` python
img.filter(ImageFilter.UnsharpMask(radius=10, percent=200, threshold=5)).save('unsharp.jpg')
```
画像編集ソフトで見掛けるアンシャープマスク、ってやつですね。
分かりやすくするためにパラメータは適当に強めのものを設定してあります。
このパラメータで実行すると出力は以下のような感じ。

![アンシャープマスクで輪郭を強烈に強調したレナさん](/blog/2015/09/lena_unsharp.jpg "520x520")

かなり強烈です。強烈ですが、そこまで違和感は無いと思います。良い感じ。

他にもよく分からないフィルターが色々あって楽しいので、一度[リファレンス](http://pillow.readthedocs.org/en/latest/reference/ImageFilter.html)をご覧になることをおすすめします。
もうちょいパラメータいじれたらもっと楽しいんでしょうけれど、手軽さの代償ですかねぇ。

---

参考：
- [How to use Pillow, a fork of PIL](http://www.pythonforbeginners.com/gui/how-to-use-pillow)
- [ImageFilter Module &mdash; Pillow (PIL Fork) 2.6.1 documentation](http://pillow.readthedocs.org/en/latest/reference/ImageFilter.html)
