---
title: pythonでyahoo APIの校正支援を使ってみた
pubtime: 2013-01-26T23:37:00+09:00
tags: [Python, API, 自然言語処理]
description: Pythonからyahoo APIの校正支援機能を使ってみました。
---

人に勧められて触ってみました、yahoo API。
type-kILOに校正をつけたら良いんじゃね、って話で。
まあ、あんまり向いてなさそうなので組み込みは見送るつもりで居りますが・・・。

折角なので、書いたテストコードを公開しておくよ。
頼まれたのでライブラリっぽい体裁をとらせてみたよ。心して受け取れjskny君。

[ソースコード](/blog/2013/01/kouseilib.py)

こんな感じ。
ライブラリ風なので助長すぎてアレですが、コンソールからも使えるので、試してみてちょうだい。

とりあえず重要なのは
```
http://jlp.yahooapis.jp/KouseiService/V1/kousei?appid=アプリケーションID&sentence=校正してほしい文章
```
にアクセスすれば取得できるよ、ってことかな。

結果はXML形式なので、そいつをパースして完了。
pythonでXML扱うのって意外と面倒だった・・・。

細かいことは[yahooの解説](http://developer.yahoo.co.jp/webapi/jlp/kousei/v1/kousei.html)をご覧ください。
[キーフレーズ抽出](http://developer.yahoo.co.jp/webapi/jlp/keyphrase/v1/extract.html)なんかは有効活用すると面白い事出来そうだよね。botに組み込みたい・・・。

ま、ともかくそんな訳で。
Yahoo API、便利やね。出力形式をjsonでも受け取れるともっと便利だと思うけれど。
