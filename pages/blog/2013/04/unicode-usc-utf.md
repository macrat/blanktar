---
title: UnicodeとUCSとUTF
pubtime: 2013-04-19T16:38:00+09:00
tags: [コンピュータサイエンス]
description: UnicodeにはUTF-8やUTF-16などのよく使う方式の他にUCS-2やUCS-4なんかの表わし方もあるそうです。色々調べてみたのでメモです。
---

unicodeというのはみなさんもよくご存知のところだと思いますが、UCS-2とか言うのはなんなのか。
解説書には`unicodeにはUCS-2やUCS-4などの方式がある`なんて書いてあるのだけれど、いやそれはUTF-8とかUTF-16の事じゃないのか。

調べてみたので、メモをば。

# そもそもunicodeとは何だ。
世界中の言語を一個の文字コードで表せたら最強じゃね？ｗｗｗ　って言って作られたのがunicode。
マイクロソフト、アップル、IBM、etc... が作ってるらしい。

とりあえず16ビット用意すれば間に合うよね、ってことで始まったので、基本は16ビット、2バイト。
とはいえ足りなくなってきちゃって、しょうがないからUnicode 2.0以降は21ビットになったらしい。

文字に対して番号が振ってあって、それを16進数で U+FFFF みたいに表す。
文字の定義とともに番号を振ってるので、文字セットという言い方も出来るし、文字コードという言い方もできる、かも。

# で、UCSとは。
unicodeやるぜーっつって作られたのがUCS-2。

2と付くとおり全ての文字が2バイトずつになっている。
足りなくなっちゃったので、21ビット版のUnicodeを元にしてUCS-4というのに拡張されている。

2バイトずつだとASCII文字とすら互換性がないし、かなり使いづらいらしい。（実はUTF-16, UTF-32もASCIIとして読むことは出来ない）
というわけで、かどうかは知らないけれど、見かけないよね。

# 皆大好きUTF。
UnicodeもUCSもいまいち使いづらいので、もっとマシな表し方を考えよう、って出来たのがUTF。多分。

表し方が違うだけなので、表現できる文字は変わらないみたい。
ご存知可変長のUTF-8、16ビットを一つの単位として扱うUTF-16（UCS-2と互換性あり）、32ビット固定長のUTF-32（UCS-4と互換性あり）。

そう、UTF-8は8ビットじゃないのです。8bitクリーンと言う事らしい。
実際の一文字の長さは1-4バイト、8-32ビット。
ASCII文字の完全な上位互換で、しかも文字の先頭と文字の長さが一目でわかるという親切さ。

UTF-16は固定長・・・かと思いきや、UCS-2の範囲外は32ビットで表すらしい。
UCS-2との互換性があるがゆえに、ASCIIとの互換性はない。
更にサロゲートペアとかいうのでごにょごにょして扱える文字数を増やしている。分かりづらい。

UTF-32は固定長。Unicodeのなかでは一番シンプルみたい。
ただし一文字につき4バイト消費するので、単純にshift-jisで書かれた日本語の文章ならサイズが倍くらいにになってしまう。

# 余談：なぜにUTF-8の先頭&文字の長さが分かりやすいのか
ASCII文字の場合： そのまんま使います。ASCIIは7ビットしか使わないので、最上位ビットは常に0。<br />
2バイト使う場合： 1バイト目は11000000 - 11011111、2バイト目は10000000 - 10111111で表します。<br />
3バイト使う場合： 1バイト目は11100000 - 11101111、2バイト目以降は10000000 - 10111111で表します。<br />
4バイト使う場合： 1バイト目は11110000 - 11110111、2バイト目以降は10000000 - 10111111で表します。<br />

ま、そんな訳で。
1バイト目にいくつ1が続くかで一文字の長さがわかる、ってことですな。

更に言うと、文字の先頭は常に0か11から始まっていて、2バイト目以降は常に10から始まる、と。
おお、なんと分かりやすい。

---

参考：
- [UCS-2とUTF-8 - 化合物命名法談義](http://homepage1.nifty.com/nomenclator/unicode/ucs_utf.htm)
- [Unicode - Wikipedia](http://ja.wikipedia.org/wiki/Unicode)
