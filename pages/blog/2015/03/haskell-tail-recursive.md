---
title: Haskellであまり末尾再帰を使わない理由
pubtime: 2015-03-28T21:08:00+09:00
tags: [Haskell, 言語仕様]
description: Haskellを勉強するためにサンプルソースを見ていると、中々末尾再帰を使ったコードを見かけないことに気付きました。簡単な実験をして、何故Haskellでは末尾再帰にしないのかを調べてみました。
---

Haskellのサンプルソースを見ていると、あんまり末尾再帰を使っている例を見ないんですよね。
schemeとかだと割とよく見るんだけどねぇ。
なぜなのかちょっと考えてみた。

テスト用の関数として、与えられた文字列のリストをスペースで繋ぐ関数joinを考えます。
この間数で`alice bob charlie`の三つを繋いで、先頭の8文字だけを取り出して表示すると言う操作を行います。

結果的に期待する出力は
```
"alice bo"
```
って感じ。

まずは普通の再起で書いてみる。
``` haskell
import Debug.Trace

join [x]    = trace (show [x]) x
join (x:xs) = trace (show (x:xs)) $ x ++ " " ++ (join xs)

main = print $ take 8 $ join ["alice", "bob", "charlie"]
```
とても工夫が無い。

そんでもって今度は末尾再起。
``` haskell
import Debug.Trace

join [x] = trace (show [x]) x
join (x:y:zs) = trace (show (x:y:zs)) (join ((x ++ " " ++ y): zs))
```
リストの先頭に繋いだ結果を入れて畳み込んでいこうという感じ。
何か若干面倒くさい。まあよしとしよう。

んでもって、普通の再起で実行した結果がこちら。
```
["alice","bob","charlie"]
["bob","charlie"]
"alice bo"
```
charlieが評価されてません。すごい。

末尾再帰だと
```
["alice","bob","charlie"]
["alice bob","charlie"]
["alice bob charlie"]
"alice bo"
```
だんだん繋がっていく感じがわかりやすい。
この場合だとcharlieも評価されています。

と言う訳でまあ、そういう訳です。
Haskellは遅延評価が行われるので、8文字目まで欲しいなら8文字確保できた時点で評価を終了します。
末尾再帰になると途中の結果が分からないので、最後まで計算する・・・と、言うことなのでしょう。多分。

そんな感じで末尾再帰と遅延評価はあまり相性がよくないっぽい。
と言うか、末尾再帰すると遅延評価の恩恵を受けられない、といった方が正しいかな？
