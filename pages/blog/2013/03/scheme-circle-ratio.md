---
title: Schemeで円周率出してみた
pubtime: 2013-03-15T02:14:00+09:00
tags: [Lisp, Scheme]
description: Scheme（Gauche）を使って円周率を計算するプログラムを書いてみました。
---

最近Schemeいじっております、MacRatです。
なんか凄くてなんか面白いんだけど、何がいいのか全然理解できてない。何なんだろうね、Lispって。

ベッドでぬくぬくしてたら円周率の計算方法を思いついてテンション上がったので、計算してみました。
思いついたってか、落ち着いてよく考えてみたら昔どっかで聞いた方法だったんだけどさ。

方法としては、こんなイメージ。

![円の面積=πr^2なので、半径が1の円の面積はπ。一辺の長さが1の四角形を、カドと円の中心を揃えて置けば、両方が重なる範囲xの4倍はやっぱりπ。](/blog/2013/03/pi-premise.png "320x240")

この状態で、四角形の中の場所を適当に選ぶと、1/π/4の確立で円の中(xの中)に入るはずだよね、っていうこと。
・・・うん、数学って説明しづらいから嫌い。

さて、コード。めんどいからコード。コード読んで理解しなさい。
``` scheme
(use srfi-27)   ;random module


(define (in-circle? x y)
  (< (sqrt (+ (* x x) (* y y))) 1))

(define (random-try try-num)
 (random-source-randomize! default-random-source)
 (let ((count 0))
  (let loop((i 0))
   (if (> i try-num)
    (* (/ count try-num) 4)
    (begin
     (if (in-circle? (random-real) (random-real))
      (set! count (+ count 1)))
     (loop (+ i 1)))))))

(display (exact->inexact (random-try 100000)))
```
おお、Lisp。括弧まみれ。

十万回適当な位置を選んで、それが円の中に入ったかどうかを調べております。
この試行回数で3.13か3.14か、って程度の精度。
一千万回やったら3.141まではほぼ確定しました。結構いい感じ。

こういう計算が結構速いのよね、Scheme。っていうかGaucheなんだけど。
JITコンパイラだから、って事なんだろうか。
いや、JITなのか？　よくわからん。
