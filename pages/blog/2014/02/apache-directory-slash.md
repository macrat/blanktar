---
title: パス末尾のスラッシュを強制するapacheの設定
pubtime: 2014-02-11T03:16:00+09:00
amp: hybrid
tags: [Apache, パス, mod_dir, スラッシュ, DirectorySlash]
description: apacheでディレクトリの最後に必ずスラッシュを付けるように強制する設定の方法です。
---

前に書いた[apache2でURLの最後のスラッシュの省略をさせない](/blog/2014/01/apache-path-last-slash)と同じ内容ですが、かなりシンプルな方法を発見。

apacheのドキュメント見てたら、こんなのが。
> DirectorySlash ディレクティブ
> 説明:	パス末尾のスラッシュでリダイレクトするかどうかのオンオフをトグルさせる
おお！？ やりたいことそのまんまじゃん。

設定も簡単で、
``` apache
DirectorySlash On
```
ってするだけ。なんだこれでいいのかよ、みたいな。

ちなみにこれを実現する`mod_dir`ってモジュールはindex.htmlを表示する機能を受け持っているものらしいので、わざわざロードする必要もない、多分。

参考: [mod_dir - Apache HTTP サーバ](http://httpd.apache.org/docs/2.2/ja/mod/mod_dir.html#directoryslash)
