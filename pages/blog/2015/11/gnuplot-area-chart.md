---
title: gnuplotで面グラフっぽいものを描きたい
pubtime: 2015-11-13T13:59:00+09:00
tags: [gnuplot, グラフ]
image: [/blog/2015/11/sin-cos-graph.png]
description: gnuplotを使って、値の範囲を示すことが出来る面グラフを作成する方法です。
---

遺伝的アルゴリズムで遊んでいたときに、計算の過程をグラフ化してみたいなと思いまして。
作りたかったのはこんなやつ。

![面で表した折れ線グラフ的なもの](/blog/2015/11/genetic-graph.png "640x480")

赤い線が平均値、薄いピンクっぽい幅の広い帯（？）が各世代での適応度の範囲です。
まあつまりは、こんな感じで幅のある折れ線グラフ的なものを作りたい、というのがこの記事の趣旨です。

こんな感じの面グラフ（と呼んで良いのだろうか…？）の作り方。
plotするときに`with filledcurves`ってやつを追加します。`with lines`みたいな感じで。
このとき上端を表す値と下端を表す値の二つが必要になるので、`using 1:2:3`のように三つ使うことに注意です。

実際使ってみるとこんな感じ。
``` gnuplot
plot "data" using 1:2:3 with filledcurves
```
usingやらwithやらは勿論省略しても大丈夫です。さらに、この例では`using 1:2:3`を省略しても大丈夫。
色は通常通り`linecolor rgb "red"`のようにして指定出来ます。楽ちん。

たとえば以下のような感じでやると、サイン波とコサイン波の間を塗ったグラフを作ってくれます。
``` gnuplot
plot "< seq 350 | awk '{ print $1/100, sin($1/100), cos($1/100) }'" u 1:2:3 w filledcurves
```
ちょっとややこしいですが、ダブルクォートの中身はただのシェルスクリプトです。
出力は以下のような感じ。

![サイン波とコサイン波の間が紫色に塗られたグラフ](/blog/2015/11/sin-cos-graph.png "640x480")

手軽に良い感じのグラフが出来るのが良いですよね、gnuplot。


おまけ。最初に掲載したグラフのスクリプト。
``` gnuplot
plot 'dat' u 1:3:4 w filledcurves lc rgb 'gray' t '', '' u 1:2 w l lc rgb 'red' t ''
```

---

参考： [Ubuntu/gnuplot - DebugIto's](http://debugitos.main.jp/index.php?Ubuntu%2Fgnuplot#h65a82e5)
