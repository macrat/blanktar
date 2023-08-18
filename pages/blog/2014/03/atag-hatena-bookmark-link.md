---
title: aタグではてなブックマークに追加するためのリンク
pubtime: 2014-03-01T00:37:00+09:00
tags: [Web, HTML]
description: HTMLのaタグだけを使ってはてなブックマークに追加するためのリンクの作り方です。
---

[google+の共有ボタン](/blog/2014/02/atag-google-plus-link)に引き続いてはてなブックマークを追加してみました。
よく考えたらgoogle+よりはてなブックマークのがユーザー居そうだしね。

アドレスは
```
http://b.hatena.ne.jp/entry/blanktar.jp/
```
こんな感じ。
おお、すごいシンプル。いいね、簡単で。

使うときは
``` html
<a href="http://b.hatena.ne.jp/entry/blanktar.jp/" target="_blank">B!</a>
```
こんなもんか。
表示されるページが結構ごちゃごちゃなので、ポップアップして表示させるにはちょっとつらいかも。うちのサイトでも新しいタブで開くようにしてみました。

参考: <a href="http://b.hatena.ne.jp/guide/bbutton" target="_blank">はてなブックマークボタンの作成・設置について - はてなブックマーク</a>
