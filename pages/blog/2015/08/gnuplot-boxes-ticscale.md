---
title: gnuplotで書いた棒グラフのx軸に生える線を消したい
pubtime: 2015-08-02T20:32:00+09:00
tags: [gnuplot, データ分析]
image: [/blog/2015/08/xtics-before.png]
description: gnuplotで書いた棒グラフのx軸にちょこんと生える小さな線、「xtics」を消す方法です。
---

gnuplotで棒グラフを書くと、x軸にも何かこう、ちょこんって線が生えるんですよね。これ。

![棒グラフのx軸につく"ちょこん"](/blog/2015/08/xtics-before.png "640x480")

`xtics`ってやつです。
棒グラフに生えてても仕方ないと思うので、これを何とか消したい。

``` gnuplot
set ticscale 0
```
とすれば消えるのですが、ついでにy軸の方も消えてしまう。
そして以下のような警告が出ます。
```
set ticscale 0
    ^
"plot", line 4: warning: Deprecated syntax - please use 'set tics scale' keyword
```
古い書き方止めてよ、的な。

``` gnuplot
set tics scale 0
```
にすればいいらしい。

これが許されるのだから
```
set xtics scale 0
```
ももちろん使える。
こうすると以下のようになります。

![x軸の"ちょこん"が消えて綺麗になった](/blog/2015/08/xtics-after.png "640x480")

さっぱり。

棒グラフなら最初っからxticxなしでいいと思うのですが、要るんですかねこれ？
