---
title: bellumなんていうchrome extension作りました
pubtime: 2014-09-22T22:39:00+09:00
tags: [作品紹介]
description: 仲間内で夏休みのハッカソンをやって、「bellum」という名前のchrome拡張を作りました。某動画投稿サイト風のチャットを、普通のWebページ上で実現するというものです。
---

夏休みに仲間とハッカソン的なことをやりまして、その中で[bellum](http://bellum.blanktar.jp/)というchrome拡張を作りました。
[ウェブストアで配信](https://chrome.google.com/webstore/detail/bellum/dnfikobhaldommifkgcfddmjhbljamam)を始めたので、宣伝がてらちょこっと記事を書いてみる。

# そもそもbellumって？
同じページを見ている人が某動画投稿サイトの如くチャット出来るchrome用の拡張機能です。
見ているページに関連するチャットを画面内に流せたら楽しいよね、みたいな。

# サーバーサイド
サーバー側のコードはすべて[jskny氏](https://twitter.com/jskny_tw)が書いてくれました。
ホームページに[bellumの紹介とサーバーサイドの小話](http://www.risdy.net/2014/09/bellum-chrome-extension-bellum-chrome.html)があるのでそちらをどうぞ。

サーバーは[node.js](http://nodejs.jp/)で実装されており、通信は[socket.io](http://socket.io/)です。難しいことは分かりません。
現在稼働中のサーバーは[Heroku](https://www.heroku.com/)というサービスでホスティングされています。

# クライアントサイド
元々はchromeとFirefoxの二つに対応する予定で開発していたのですが、Firefoxの拡張機能はあまりにも難解（DOMをいじれない？ そもそもXULってなに？ chromeならjsonファイル1つだよ？）でハッカソン期間中に完成せず。
そんな状況でもFirefox拡張のサンプルコードをいくつか書いてくれた[yuia氏](https://twitter.com/yuia_rs)に敬意を。で、Firefox版はいつ完成するの？

私が担当したのはchrome版。
細かい話はいずれ覚えていたら書くとして、今回はクライアント側で使ったライブラリの紹介などをしてみます。

まず外せないのは[jQuery](http://jquery.com/)。まあ、こいつは紹介するまでもない気がするね。
javascriptを拡張してくれる便利なやつ。正直なぜjavascriptの標準機能に入れないのかが分からないくらい。

[jsSHA](http://caligatio.github.io/jsSHA/)はURLをハッシュ化するのに使わせていただきました。
そのままURLをルームメイトしてチャットサーバーに送るとユーザーをトラッキング出来ちゃうからね。僕らはみなさんの動向を監視しませんよ、ということでハッシュ化。

個人的に気に入っているのが[perfect-scrollbar](http://noraesae.github.io/perfect-scrollbar/)。
jQueryのプラグインで、ちょっとおしゃれなスクロールバーを作ってくれます。
ログ機能のスクロールバーに使用。目立たなくていい。目立たなすぎな気もするけれど。
CSSで見た目をカスタマイズ出来るってサイトに書いてあるのだけれど、上手く行かなかったので研究の余地あり。上手くいったらここにも書こうと思います。

そんな感じ。あんまりライブラリ使ってないね。
jQueryが強すぎる。うん。
