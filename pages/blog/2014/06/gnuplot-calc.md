---
title: gnuplotでグラフに出す前に計算する
pubtime: 2014-06-20T16:26:00+09:00
tags: [gnuplot, グラフ]
description: gnuplotの中で、csvから読み取ったデータを計算してからプロットする方法です。
---

あるデータがあって、ある列二倍したデータが欲しいとか、複数の列の平均が欲しいとか、そんな場合。
聞けば、gnuplotのコンソール上でも計算ができるらしい。
知っとくと便利かも。というわけでメモ。

まずはある列（この場合は2列目）を2倍したい場合。
```
plot "data.dat" using 1:2 title "普通のデータ"
replot "data.dat" using 1:($2*2) title "二倍したデータ"
```
うん、結構簡単。普通にスクリプトっぽいね。

次は、2列目と3列目の平均が欲しい場合。
```
plot "data.dat" using 1:2 title "元のデータ2"
replot "data.dat" using 1:3 title "元のデータ3"
replot "data.dat" using 1:(($2+$3)/2) title "2と3の平均"
```
こんな感じ。いっぱいある場合はちょっと面倒かもだけれど、まあ問題ないでしょ。

案外色々機能があるっぽいのだけれど、よく分からないわ、gnuplot。
