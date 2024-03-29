---
title: "jThree Class Tokyo #2行ってきた。"
pubtime: 2014-11-24T13:00:00+09:00
tags: [Web, jQuery]
image: [/blog/2014/11/theta-viewer-thumb.png]
description: jThreeのハンズオンに行って、ハッカソンで全天球画像のビューワーのようなものを作りました。かなり簡単に出来て、とても良い感じ。
---

昨日生まれて初めてハンズオンに行ってきました。[Microsoft Azure x jThree Class Tokyo #2](https://atnd.org/events/58240)。
jQueryのような手軽さでWebGLを扱える素敵ライブラリ[jThree](http://jthree.jp)についての講習とハンズオン。

午前にjThreeの使い方の講習があって、午後に他の企業が提供してくれるAPIと組み合わせてハンズオンというかハッカソンというか。
3Dってだけで怖いし、Webで3Dって言ったらもう恐ろしく怖いし、と思ったけど驚くほど簡単でした。半端ない。
[専用のエディター](http://editor.jthree.jp/)もあって、なんか[Processing](https://www.processing.org/)みたいな気分で3Dを扱えちゃう。恐るべしjThree。

今回提供されていたAPIはKinectのデータを取得できる[Kinect for Windows v2](http://www.microsoftstore.com/store/msjp/ja_JP/pdp/Kinect-for-Windows-v2-%E3%82%BB%E3%83%B3%E3%82%B5%E3%83%BC-%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3-%E3%83%99%E3%83%BC%E3%82%BF/productID.298959900)、リアルタイム通信を簡単にしてくれる[milkcocoa](https://mlkcca.com/)、言葉の感情なんかを解析してくれる[IMINOS](https://lr.capio.jp/services/webapis/)、全天球画像を取得できるカメラ[THETA](https://theta360.com/ja/)の四つでした。THETAはAPIじゃない気がするけれどまあよし。

好きなモノを選んでハンズオンを受けられるということで、THETA班に参加。実際に触らせてもらいました。
でっかいICレコーダというか、ちっこいリモコンというか、そんな感じのサイズ。
結構軽いし画質もそれなりで3万5千円くらい。うーん・・・素敵だ。

で、ハッカソンっぽく作ったのがこれ。

[![ちっちゃい全天球画像がいっぱい浮いてる、みたいな。](/blog/2014/11/theta-viewer-thumb.png "1139x859")](https://theta-viewer.netlify.com/)

全天球画像を自分の周りに表示ってのじゃ普通すぎるのでビューワを作ろうと。
でいっぱい表示してたらシャボン玉っぽく飛ばしたらって意見をもらったので、飛ばしてみた。お陰さまでなかなか素敵な感じに。

[実際試せる](https://theta-viewer.netlify.com/)ようにしたので、ご覧ください。

画面が白くなってから画像が浮いてくるまでしばらく時間がかかりますが、ご容赦を。ちょっと待てば出てきます。
画像クリックでズームイン、ダブルクリックするとズームアウト。画面内ドラッグで視点を変えられます。

[ソースコードの配布](/blog/2014/11/theta-viewer.tar.bz2)もしてますのでよろしかったら。

現地で1時間弱で飛ばす機能を作って、今日ちょっと修正入れて、それだけ。実質2時間ちょいくらいかな。
初めてwebで3D触ってこれって、かなり凄まじいことのような気がします。ものすごい簡単さ。

この勉強会、次回の開催で一旦最後のようです。めっちゃ楽しかったので、皆さんも是非。
[【jQuery初心者超歓迎！ jThree開発者から学べる日本最後のWeb3D勉強会】 jThree Class Tokyo #3](https://atnd.org/events/59294)


追伸：ハッカソンなのかハンズオンなのか勉強会なのかよく分からないのですが、結局何なんでしょう・・・。
