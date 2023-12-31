---
title: Haskellでエラトステネスの篩
pubtime: 2015-03-24T17:59:00+09:00
tags: [Haskell]
description: Haskellの勉強のために、エラトステネスの篩で素数のリストを生成するプログラムを書いてみました。安直な実装でも無限リストが作れるので、Haskellの威力を感じます。
---

Haskellで素数のリストを作ってみた。

``` haskell
dropMultiples :: Integral a => a -> [a] -> [a]
--dropMultiples x ys = filter (\z -> 0 /= (mod z x)) ys
dropMultiples x = filter ((0 /=) . (`mod` x))  -- ポイントフリーにしてみたけど微妙？

takePrimes :: Integral a => [a] -> [a]
takePrimes []     = []
takePrimes (x:xs) = x : (takePrimes $ dropMultiples x xs)

primes :: Integral a => [a]
primes = takePrimes [2..]

main :: IO ()
main = print $ take 10 primes
```

[エラトステネスの篩](http://ja.wikipedia.org/wiki/%%E3%%82%%A8%%E3%%83%%A9%%E3%%83%%88%%E3%%82%%B9%%E3%%83%%86%%E3%%83%%8D%%E3%%82%%B9%%E3%%81%%AE%%E7%%AF%%A9)をかなり安直に書いただけ。
とりあえず10個目まで出力。

こんな愚直な実装でも無限に計算できる訳で、遅延評価ってのは凄いねぇ。
