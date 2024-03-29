---
title: HaskellでCGIを書いてみた
pubtime: 2015-01-31T00:12:00+09:00
tags: [Haskell, CGI]
description: ライブラリ無しのHaskellだけで階乗を計算するcgiプログラムを作ってみました。
---

なぜかここのところHaskell触ってます。
強い言語だってのは確かに分かるんだけど、何かこう・・・匠が書かないとうまくいかないぜって感じがpythonメインに触ってる人間としては何か嫌だ。

というのはともかくとして。
親愛なる馬鹿野郎が初めてHaskell触るくせに[webアプリ作ろうとしていた](http://www.risdy.net/2015/01/haskell)ので便乗してみました。

最小主義者は最小主義者らしく標準のパッケージだけで挑みます。外付けライブラリなんて使わない。

することが何にもないので、とりあえず関数型言語なんだから階乗やるしかねぇだろって感じで階乗やってみた。

で、書いたコードがこんな感じ。
``` haskell
#!/usr/bin/runghc

import System.Environment

-- 階乗計算。特に意味は無いけど表示するものが無いと寂しいので。
kaijo 0 = 1
kaijo 1 = 1
kaijo n
	| n > 0	= n * kaijo (n - 1)

-- 特定の文字で区切る関数。
splitWith key ""		= []
splitWith key query	= a:(splitWith key $ dropWhile (==key) b)
	where (a, b) = break (==key) query

-- GETメソッドで渡されるクエリをパースする。区切ってるだけ。
parseQuery query = map (splitWith '=') $ splitWith '&' query

-- クエリから目的の値を探す。
searchQuery search query = map last $ takeWhile ((==search) . head) $ parseQuery query

-- クエリを元に計算する。
calcKaijoByQuery = kaijo . read . head . searchQuery "number"

-- GETメソッドで渡されてきたクエリ文字列を取得する。
getQuery = getEnv "QUERY_STRING"


noQueryHTML = do
	putStr	"Content-Type: text/html\r\n\r\n"
	putStrLn	"<h1>haskell kaijo</h1>"
	putStrLn	"<form method=\"GET\">"
	putStrLn	"<input name=\"number\"><input type=\"submit\">"
	putStrLn	"</form>"

calcHTML query = do
	putStr	"Content-Type: text/html\r\n\r\n"
	putStrLn	"<h1>haskell kaijo</h1>"
	putStr	"result: "
	print	(calcKaijoByQuery query)
	putStrLn	"<br>"
	putStrLn	"<form method=\"GET\">"
	putStrLn	"<input name=\"number\"><input type=\"submit\">"
	putStrLn	"</form>"

main = do
	q <- getQuery
	if searchQuery "number" q == []
		then noQueryHTML
		else calcHTML q
```

うーん、Haskellだ。

クエリでnumber=5とか渡されると計算して返します。
渡されても渡されなくてもとりあえずフォームは返します。

多分動くはずだけど、CGIサーバを用意するのが面倒くさかったのでテストはしていないですごめんなさい。

---

参考：
- [Haskell-環境変数の値を取得する  CapmNetwork](http://capm-network.com/?tag=Haskell-%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0%E3%81%AE%E5%80%A4%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B)
- [文字列を空白で区切る - Haskell はスケるよ](http://d.hatena.ne.jp/takatoh/20070123/split)
