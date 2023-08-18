---
title: gitのリポジトリをmercurialに変換する
pubtime: 2014-12-13T21:52:00+09:00
tags: [git, mercurial, バージョン管理]
description: gitで一度作ったリポジトリを、mercurialに変換するためのmercurialエクステンションの紹介です。
---

半ば思いつきで**git**使ってみたのだけれど、やっぱ**mercurial**のが何となく好きだなぁと思った。
思ったのでmercurialに移動したいのだけれど、中途半端に出来上がったこのリポジトリはどうすれば良いんだ。少し調べてみた。

どうやら、mercurialのプラグインとして変換できるやつがあるらしい。というか入ってるらしい。というか入ってた。

とりあえずコピーしてくる。しなくてもいいと思うけれど、何かあると怖いので。
``` shell
$ git clone /path/to/repository/
```
ここではローカルにあるリポジトリですが、githubとかから引っ張ってきてもなんの問題もないです。

で、変換。
``` shell
$ hg convert repository new-repository
hg: 未知のコマンド 'convert'
以下のエクステンションにより  'convert' が提供されています:

    convert       他の構成管理ツールから Mercurial への履歴取り込み

"hg help extensions" で有効なエクステンションの情報が表示されます
```
怒られた。

どうやらエクステンションは自分で有効にしないといけないらしい。
なので有効化。

適当なエディタで`~/.hgrc`辺りを開いて
``` toml
[extensions]
convert =
```
ということを書く。

もっかいやってみる。
``` shell
$ hg convert repository new-repository
変換先リポジトリ new-repository の初期化中
変換元リポジトリの走査中...

以下略
```

動いた。

``` shell
$ cd new-repository
$ ls
```
なんもない。

なんもないけど、
``` shell
$ hg up
```
これで表示されるようになります。

何かびっくりするほど簡単に変換できてしまった。
変換しやすいとなると手軽に使い始められて良いね。素敵。

参考：[[参考] GitからMercurialへの変換 - Bitbucket ドキュメンテーション - アトラシアン日本語ドキュメント](https://confluence.atlassian.co.jp/pages/viewpage.action?pageId=25133099)
