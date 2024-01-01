---
title: vimのgnモーションはすごく便利、かもしれない。
pubtime: 2015-08-31T16:43:00+09:00
tags: [Vim]
description: Vimで検索結果を使ったマクロを組むときに便利なモーション「gn」の紹介です。検索結果全体をモーションで指定することが出来ます。
---

実践vimをぱらぱら読んでいたら訳注のところで**gn**とかいうものが紹介されていたのですが、解説が無く。気になって調べてみたので、使い方をメモ。

例えば以下のような謎プログラムがあるとします。
``` toml
datatimeAlpha = alpha
datatimeBeta = beta
dataFile = filename
```
`datetime`とすべきところを`datatime`と書いてしまって悲しい気持ちです。
悲しいのできちんと直すのですが、`:%s/datatime/datetime/`とするのは長ったらしくて面倒くさい。

そこでとりあえず、`/data`で検索して、最初の行のdatatimeの先頭までジャンプします。
`ctAdatetime`としても目的は達成出来るのですが、ちょっと長い。

てっとりばやく処理するために、**gn**の登場です。**gn**はマッチ全体を示すモーションらしいです。次のマッチを示す**gn**と、前のマッチを示す**gN**の二通りがあります。
先ほどの場所から、`cgn`としてみてください。`data`の範囲が消えてインサートモードに入ります。あとは`date`って書くだけ。
直せたら`n`で次のマッチに飛んで、ドットコマンドでもう一回置換します。
更に飛ぶと今度は正しい`data`なので、置換終了。みたいな感じ。

なお、**gn**モーションは次のマッチ全体を示すものなので、いちいち**n**コマンドで次に飛ぶ必要はありません。ドットコマンド連打でも全部置換できます。
とはいえ無闇に連打してると関係無いもの（この例では最後の行）を巻き込みそうだし、マッチが確実に正しいなら`:s`で置換しちゃった方早いだろうし。
**n**とドットを交互に繰り返す方が良いのではないかと、個人的には思います。

結構便利な気がする。置換コマンド呼ぶほど箇所が大くない時とかに活躍する、かも？

参考： [「実践Vim 思考のスピードで編集しよう!」レビュー (1日目) - Humanity](http://tyru.hatenablog.com/entry/20130902/practical_vim_review)