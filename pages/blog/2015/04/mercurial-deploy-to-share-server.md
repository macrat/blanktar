---
title: mercurialが入ってない共有サーバにデプロイするのにmercurial使いたい。
pubtime: 2015-04-06T01:07:00+09:00
tags: [Linux, mercurial, サーバ, バージョン管理]
description: 古いサーバ、古いパッケージ管理システムであっても、mercurialであればホームディレクトリにインストールしてプッシュしたり出来るそうです。共有サーバにインストールして、リポジトリをプッシュする方法のメモです。
---

バージョン管理システムって便利だね。最近手放せなくなりつつあります。
手放せなさから大学のサークルのサーバで公開する用のサービスを開発するのにもmercurial使ってたのですが、デプロイ先が古いCentOSで古いmercurialしか入らなくって・・・うわぁつらい。

聞けばmercurialはルート権限がなくてもインストールできるらしい。
自分のホームディレクトリにバイナリを入れてしまおう、と言うわけ。
``` shell
$ wget http://mercurial.selenic.com/release/mercurial-3.2.3.tar.gz
$ tar zxvf  mercurial-3.2.3.tar.gz
$ cd mercurial-3.2.3/
$ mkdir ~/mercurial
$ python setup.py install --home ~/mercurial
```
大体こんな感じで。

さあプッシュしよう。
``` shell
$ hg push ssh://example.com//path/to/repository
ssh://example.com//path/to/repository への反映中
連携先: bash: hg: コマンドが見つかりません
中止: 指定リポジトリからの応答が不適切!
```
・・・おやおやぁ？

``` shell
$ ssh example.com 'echo $PATH'
/usr/local/bin:/bin:/usr/bin
```
・・・おやおやおやぁ？

ヘルプ見てたら、remotecmdなんてオプションがあったので使ってみた。
``` shell
$ hg push ssh://example.com//path/to/repository --remotecmd /home/hoge/mercurial/bin/hg
```
みたいな感じ。
これなら動く。

やったね。これでどんな環境でも動くぜ。mercurial使いまくりだぜ。

参考： [【Proton.jp】 Mercurial Tips #ユーザーディレクトリにインストール](http://www.proton.jp/main/programming/mercurial.html#local_install)
