---
title: HaskellでProject Eulerに挑戦してみた
pubtime: 2015-02-28T21:11:00+09:00
amp: hybrid
tags: [Haskell, ProjectEuler]
description: Project Eulerというプログラミング問題を眺めていて、Haskellを使えば綺麗に書けそうだと思ったので実際に書いてみました。この記事では1問目から5問目までを問いています。
---

[Project Euler](http://odz.sakura.ne.jp/projecteuler/)の問題を眺めていて、Haskellなら綺麗に書けるんだろうなーとか思ったのでやってみた。とりあえず1問から5問まで。

一応[解答集](http://www.geocities.jp/oraclesqlpuzzle/csharp/csharp-euler-answers.html)と一致しているので大丈夫だと思う。

問題文そのまま引用してきてます。
[オリジナルのライセンス](http://odz.sakura.ne.jp/projecteuler/index.php?%%E3%%83%%A9%%E3%%82%%A4%%E3%%82%%BB%%E3%%83%%B3%%E3%%82%%B9)に従ってください。

# Problem 1
> 10未満の自然数のうち, 3 もしくは 5 の倍数になっているものは 3, 5, 6, 9 の4つがあり, これらの合計は 23 になる.
>
> 同じようにして, 1000 未満の 3 か 5 の倍数になっている数字の合計を求めよ.

``` haskell
check x = (mod x 3) == 0 || (mod x 5) == 0

nums = filter check [1..999]

main = print $ sum nums
```

あんまり格好良くない。


# Problem 2
> フィボナッチ数列の項は前の2つの項の和である. 最初の2項を 1, 2 とすれば, 最初の10項は以下の通りである.
> 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
>
> 数列の項の値が400万以下の, 偶数値の項の総和を求めよ.

``` haskell
fib = 1:2:zipWith (+) fib (tail fib)

unders = takeWhile (<4000000) fib

isEven x = mod x 2 == 0
evens = filter isEven unders

main = print $ sum evens
```

フィボナッチ数の計算が格好いい。


# Problem 3
> 13195 の素因数は 5, 7, 13, 29 である.
>
> 600851475143 の素因数のうち最大のものを求めよ.

``` haskell
diving x n
    | x == n       = x
    | mod x n == 0 = diving (div x n) 2
    | otherwise    = diving x (n+1)

main = print $ diving 600851475143 2
```

割れなくなるまで割るってだけ。


# Problem 4
> 左右どちらから読んでも同じ値になる数を回文数という. 2桁の数の積で表される回文数のうち, 最大のものは 9009 = 91 × 99 である.
>
> では, 3桁の数の積で表される回文数の最大値を求めよ.

``` haskell
isLoopNum x = (show x) == (reverse (show x))

targets = [x*y | x <- (reverse [1..999]), y <- (reverse [1..999]), isLoopNum (x*y)]

main = print $ maximum targets
```

回文数とやらを判定する式が思いつかなかったので文字列にして処理。


# Problem 5
> 2520 は 1 から 10 の数字の全ての整数で割り切れる数字であり, そのような数字の中では最小の値である.
>
> では, 1 から 20 までの整数全てで割り切れる数字の中で最小の正の数はいくらになるか.

``` haskell
import Data.List

dividers n = filter (\x -> mod n x == 0) [11..20]  -- 12で割りきれるのだから当然6でも割りきれる。みたいな発想で11..20。

vacancies n = (reverse [11..20]) \\ (dividers n)

searchAnswer n
    | vacancies n == [] = n
    | otherwise         = minimum $ map (searchAnswer . (n*)) (vacancies n)

main = print $ searchAnswer 1
```

何だか面倒くさくなっちゃいましたって雰囲気が漂っている。

答え候補を1から20で割り切れなかったら、割れなかった数字を掛ければより答えっぽいという発想。
思ったより上手くいかなかったのでありえるパターンをすべて試すかたちになってしまった。

結局のところ、総当たりよりは多少マシって程度のコードに・・・いや、どうなんだこれ？

---

Haskellってのは実にこういうのに向いてるよねぇ。
パズルっぽくて割と書いてて楽しいし。

今度はpythonでも・・・と思ったけれど、この手っ取り早いコードを書いたあとでpythonで手続きちっくに書く気にはならんなぁ・・・。
