---
title: RuuMusicっていうandroid用の音楽プレイヤーを作った
pubtime: 2015-09-22T23:01:00+09:00
modtime: 2020-07-14T18:57:00+09:00
amp: hybrid
tags: [Android, 音楽プレイヤー, RuuMusic]
description: 自分用に自作したAndroid用の新しい音楽プレイヤー、「RuuMusic」の紹介です。ファイラのようなUIで音楽を聞ける、シンプルで簡単な音楽プレイヤーです。
image: [/blog/2015/09/ruumusic-promotion-image.png]
---

音楽プレイヤーを作りました。
![RuuMusicのバナーみたいなやつ](/blog/2015/09/ruumusic-promotion-image.png "1230x600")

Android wearが欲しすぎて、でも使い道がなかったので、音楽プレイヤーを作ることにしました。
でもまだwearを買っていないのでスマートフォン・タブレットだけの対応です。
いずれ対応、したいなぁ。

今まで私が使っていた[LISNA](https://play.google.com/store/apps/details?id=org.k52.listen)という音楽プレイヤーと[FolderSync](https://play.google.com/store/apps/details?id=dk.tacit.android.foldersync.full)というファイラの掛け合せ、的なイメージから出発しましたがわりと独自路線です。
まあ、独自というほど独特なところも無いですが。

![RuuMusicのプレイヤー画面。文字だけのシンプルなデザイン。](/blog/2015/09/ruumusic-player.png "288x512")
![RuuMusicのプレイリスト画面。ファイル名が並んでいるだけ。](/blog/2015/09/ruumusic-playlist.png "288x512")

一枚目がプレイヤー、二枚目がプレイリストです。見たまんまですね。
プレイリストというのは名ばかりで、実のところディレクトリをそのまま利用しています。
FoloderSyncを使ってPCの音楽ディレクトリをそのままSDカードに同期して、そいつを再生する、というのが私の使い方。ほっとけばPCに入れた曲が同期されているのでとっても便利です。おすすめ。

始めてのJavaだったのですが、案外良いねJava。アノテーションがとても新鮮。
まあ、何でついでにアサーションチェックしてくれないんだという感じはありますが。

google playにて公開しておりますので、お試しいただければと思います。

[![Get it on Google Play](/blog/2015/09/get-it-on-google-play.png "172x60")](https://play.google.com/store/apps/details?id=jp.blanktar.ruumusic)

~~bitbucketのリポジトリでプロジェクト一式を公開しています。~~よろしければこちらもどうぞ。プルリクくれると嬉しいな？

<PS date="2020-07-14" level={1}>

開発リポジトリは[GitHubのmacrat/RuuMusic](https://github.com/macrat/RuuMusic)に移動しました。

</PS>
