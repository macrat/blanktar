---
title: bashのifで正規表現マッチ
pubtime: 2014-08-30T03:53:00+09:00
amp: hybrid
tags: [Bash, シェルスクリプト, if, 正規表現]
description: bashの組み込みオペレータを使うと、if文で正規表現マッチが出来るようです。実際に試してみました。
---

bashのif文って割と便利で、あらゆるコマンドの戻り値を使って分岐できるんですよね。って言うのはまあ、知ってる。普通に。

正規表現使えないかなーと思って調べてみたら、使えるらしい。
こいつはコマンドじゃなくて、オペレータらしいけど。bash組み込み？

使い方は
``` shell
$ if [[ "test" =~ t.st ]]; then echo "match"; fi
match
$ if [[ "t#st" =~ t.st ]]; then echo "match"; fi
$ if [[ "abc.mp3" =~ ^[^.]\.mp3 ]]; then echo "match"; fi
```
ってな感じ。

ポイントは`[[`のように括弧が二重になっていることと、正規表現がクオートとかで囲まれてないこと。
クオートで囲っちゃうと何も言わずにマッチしなくなるのでかなり注意です。怖い怖い。

マッチした部分は`BASH_REMATCH`と言う配列に入るようになっていて、
``` shell
$ [[ "abc.mp3" =~ ^(.+)\.([^.]+) ]]
$ echo match: ${BASH_REMATCH[0]}
match: abc.mp3
$ echo name: ${BASH_REMATCH[1]}
name: abc
$ echo ext: ${BASH_REMATCH[2]}
ext: mp3
```
なんてことが出来ます。あら便利。
ちょっとした作業するには素晴らしいねこれ。

`*`とか`?`だけでは物足りないけれど、エディタ開いてコード書くのも面倒、なんて時に使えそう。かゆいところに手が届く。
・・・なんて言ってると長い長いワンライナーになってしまって後悔するんでしょうね、気をつけます。

---

参考:
- [bashの正規表現マッチングの使い方 - adsaria mood](http://d.hatena.ne.jp/adsaria/20100107/1262842850)
- [Stray Penguin - Linux Memo (BASH)](http://www.asahi-net.or.jp/~aa4t-nngk/bash.html)
