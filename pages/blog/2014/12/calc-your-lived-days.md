---
title: 生まれた日から今日までの日数をpythonで。
pubtime: 2014-12-26T16:59:00+09:00
tags: [Python, Tkinter]
description: Python/Tkinterを使って、生まれた日から今日までの日数を計算するプログラムを書いてみました。短かく書けるでしょ、と言おうと思ったのだけれど、Tkinterを使うと長い…。
---

jskny氏が書いた[生まれた日から今日まで&#12289;何日生きているのかを求める２](http://www.risdy.net/2014/12/blog-post_56.html)という記事に便乗してみた。
便乗してみたっていうか、ズルして短く書こうと思ったら言うほど短くならなかったお話。
使用したのはpython3と、標準でくっついてくるtkinter。

![実行画面。計算前。](/blog/2014/12/calc-lived-days.1.png "496x75")<br />
![実行画面。2014年4月1日からの日数。](/blog/2014/12/calc-lived-days.2.png "778x75")<br />
![実行画面。不正な入力。](/blog/2014/12/calc-lived-days.3.png "624x75")

実行するとこんな感じ。
tkinterらしい武骨さっすね。


ソースコードはこんな。
``` python
import datetime
import tkinter


def onChange(e):
    if not (year.get() or month.get() or day.get()):
        livedays.configure(text='calc lived days.')
        return

    try:
        delta = datetime.datetime.now() - datetime.datetime(int(year.get()), int(month.get()), int(day.get()))
    except ValueError:
        livedays.configure(text='正しい日付を入れてください。')
    else:
        livedays.configure(text='あなたは今日まで{0}日生きています。'.format(delta.days))


root = tkinter.Tk()


livedays = tkinter.Label(text='calc lived days.', font=('*', 36))
livedays.pack()


inputday = tkinter.Frame()
inputday.pack()

year = tkinter.Entry(inputday)
year.pack(side='left')
tkinter.Label(inputday, text='年').pack(side='left')

month = tkinter.Entry(inputday)
month.pack(side='left')
tkinter.Label(inputday, text='月').pack(side='left')

day = tkinter.Entry(inputday)
day.pack(side='left')
tkinter.Label(inputday, text='日').pack(side='left')


year.bind('<KeyRelease>', onChange)
month.bind('<KeyRelease>', onChange)
day.bind('<KeyRelease>', onChange)


root.mainloop()
```
長い。GUIまわりがすごく長い。

実際に日数を計算するのは
``` python
datetime.datetime.now() - datetime.datetime(2014, 4, 1)
```
とかだけで済むのだけれどね。
datetime同士を引き算すると出てくるtimedeltaってやつは結構便利なのでおすすめ。

ほら、python簡単でしょ？ って言おうかと思って書き始めたのだけれど、tkinterの面倒くささが露呈しただけな気がする。
GUIに関してはC#に完敗だよなぁ・・・C#やろうかなぁ・・・orz
