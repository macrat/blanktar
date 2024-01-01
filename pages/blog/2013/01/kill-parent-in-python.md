---
title: 親は大切に
pubtime: 2013-01-04T20:53:00+09:00
tags: [Python, 標準ライブラリ]
description: Pythonで親プロセスを強制停止する方法です。
---

拍手返信だよ。

またまたコメントいただきました、[前回](/blog/2013/01/kill-parent-in-c-lang)の方から。
```
Python で親殺しってできましたっけ？
```

**そんなに親を殺したいのか貴様ッ**

基本的に（変な裏技を使わない限り）、pythonでは人殺しできないようです。（確認したのはthreadingだけだけどね）
いつか実装されるのかもしれないけどね。とりあえず、無理っぽい。

いや、それでも俺は親に死んでもらいたいんだ、って場合。  
その場合は、
``` python
threading.currentThread()
```
ってやると、メインスレッドのハンドルを取得できるようです。

取得したハンドルに対して前回の方法を使えば自殺できるし、子スレッドに渡せば親殺しができる、かもね。

ちなみにwindowsの2.7.3で実験してみたら、isAliveで確認すると死んでるのに、動作はしているというよく分からんことになりました。
すごく危ないかもわからん、これ。

親は大切に、joinでも呼び出して放置しておけばいいんじゃないかしら。
まあそれ以前に、可能な限り他殺なしで動くように設計するのがベストなんでしょうけどね

あ、ちなみに。
multiprocessingなら、terminate()で終了させられるようです。子プロセスに限るけどさ。
ただ、終了ハンドラは動かないっぽいねー。
子孫プロセスは孤立するわ、資源のロックは解除しないわってことで、最後の手段っぽい。