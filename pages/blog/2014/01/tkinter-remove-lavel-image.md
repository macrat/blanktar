---
title: python/tkinterのlabelに貼り付けた画像を消す方法。
pubtime: 2014-01-10T23:58:00+09:00
tags: [Python, 標準ライブラリ]
description: Python/tkinterで、一度ラベルに表示させた画像をあとから削除する方法です。
---

例えば
``` python
from PIL import Image, ImageTk
import Tkinter

root = Tkinter.Tk()
label = Tkinter.Label(root)

image = ImageTk.PhotoImage(Image.open(open('test.jpg', 'rb')))
label.configure(image=image)

label.pack()

root.mainloop()
```
みたいなコードがあるとして。

画像を貼り付けたは良いのだけれど、この画像を削除する方法がわからない。ので、いろいろ試してみた。

どうやら
``` python
label.configure(image='')
```
とすれば削除できるようです。
