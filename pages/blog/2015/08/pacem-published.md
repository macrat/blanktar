---
title: pacemっていうARアプリ的なものを作った
pubtime: 2015-08-16T14:36:00+09:00
tags: [作品紹介]
description: 友人とハッカソンをして作った、AR空間上にビーコンを置くことが出来るWebアプリ「pacem」の紹介です。
---

[去年のbellum](/blog/2014/09/bellum-publish)に引き続いて今年もハッカソン的なことをやりました。
今年作ったのはGPSと端末のジャイロセンサーを使ったARアプリ的なもの。
ハイブリットアプリとして動作させる予定だったのだけれど、アプリとしてコンパイルしたら上手く動かなかったので実際にはwebサービスになってます。

動く状態のものが[webで公開している](http://pacem.blanktar.jp)ので試してみてください。新しめのandroidなら動作すると思います。
[開発リポジトリ](https://bitbucket.org/radiogym/pacem)も公開してありますのでそちらもどうぞ。

# pacemとは？
AR空間上にビーコンという目印みたいなものを置くことができるアプリです。
ビーコンは誰でも見ることができるので、集合場所を伝えたりするのに使えるような気がします。

使用にはアカウントが必要ですが、IDとパスワードを決めるだけで登録できます。適当です。

# サーバーサイド
去年と同じく[node.js](http://nodejs.jp/)のサーバーで、[socket.io](http://socket.io/)を使って通信しています。
データベースには[node-sqlite3](https://github.com/mapbox/node-sqlite3)を使用。SQLは便利だね、やっぱり。
ホスティングは[Microsoft Azure](http://azure.microsoft.com)を使いました。

# クライアントサイド
[three.js](http://threejs.org/)を使って3Dの実装を行ないました。背景に出てる映像はMediaStream APIで取ったやつをvideoタグで流してるだけ。
3D空間の方を[DeviceOrientationControls](http://threejs.org/examples/misc_controls_deviceorientation.html)っていうので端末の角度に合わせて回してやるとARっぽく。
位置情報はGeolocation APIを使いました。便利だねーHTML5。そのままだと取得に時間が掛かるので、適当にラッピングして使用。

アイコンなんかはgoogleが配布している[Material icons](https://www.google.com/design/icons/)をお借りしました。
手軽にそれっぽいUIが出来てありがたい。

---

去年よりもライブラリ自体は少ないのだけれど、なかなかヘビーな内容でした。ARって難しいね。まあ、それだけ面白くもあるのだけれど。
