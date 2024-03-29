---
title: gitの「src refspec refs/heads/master matches more than one」ってエラーの直し方
pubtime: 2020-06-17T21:11:00+09:00
modtime: 2020-06-19T19:47:00+09:00
tags: [git]
description: "GitHub Actionsで色々試行錯誤していたところ、突然「src refspec refs/heads/master matches more than one」というエラーが出て`git push`出来なくなってしまいました。この原因と、対処方法についての記事です。"
image: [/blog/2020/06/github-tags-refs-heads-master.jpg]
---

[GitHub Actionsでタグを打ったら自動でコンパイルしてリリースしてくれる](/blog/2020/06/automated-build-sphinx-on-github)というのをやりたかったのですが、その過程で以下のようなエラーが出るようになってしまいました。

``` shell
$ git push
error: src refspec refs/heads/master matches more than one
error: failed to push some refs to 'origin:refs/tags/master'
```

pushしてもpullしても同じエラー。なんだかよく分からない。


# TL;DR: 直し方

以下のコマンドで直りました。

``` shell
$ git tag -d refs/heads/master
$ git push origin :refs/tags/refs/heads/master
To github.com:macrat/some-repository.git
 - [deleted]         refs/heads/master
```


# 試行錯誤と原因究明
## 最初に試したこと

エラーメッセージで調べてみたところ、以下のブログ記事を見つけました。

[ブランチ名とタグ名を同じにしたら怒られた件 - helen&#39;s blog](https://helen.hatenablog.com/entry/2016/04/01/162424)

これによると、ブランチ名と同じタグが出来てしまっているのが原因らしい。

というわけで、リモートの`master`タグを消そうとしてみる。

``` shell
$ git push origin :refs/tags/master
remote: warning: Deleting a non-existent ref.
To github.com:macrat/some-repository.git
 - [deleted]         master
```

*non-existent*らしい。消えなかった。
そして当然直らなかった。


## ちゃんと状況を調べた

あらためてGitHubを見てみると、こんなことになっていました。

!["refs/tags/master"って名前のタグが打たれてしまっている](/blog/2020/06/github-tag-refs-heads-master.jpg "500x500")

`refs/tags/`の部分はgitの内部的なナニカかと思っていたけれど、まさかのタグ名の一部だった…。

コマンドラインでもちゃんとそれが見れてました。

``` shell
$ git tag
refs/tags/master
v1.0.0
v1.0.1
v1.0.2
v1.0.3
v1.0.4
v1.0.5
v1.0.6
v1.1.0
```


## 判明した原因

GitHub Actionsでやりたかったのは「タグを打ったらそのタグ名でリリースを作る」だったのですが、
デバッグの過程で「masterにプッシュしたら」という条件にしていたのでした。

「そのタグ名」を取得するために`github.ref`という[コンテキスト](https://help.github.com/ja/actions/reference/context-and-expression-syntax-for-github-actions#contexts)を使用していました。
この`github.ref`というやつ、masterにpushされて動くときは`refs/heads/master`という名前になっているようで…

結果として、`refs/heads/master`という名前のリリース（とタグ）が作られてしまったのでした。


## 改めて、直し方

というわけで、「リモート（`refs/tags/`）にある`refs/heads/master`という名前のタグを消去せよ」というコマンドを打つ必要があります。
それが冒頭に書いた以下のコマンド。

``` shell
$ git push origin :refs/tags/refs/heads/master
To github.com:macrat/some-repository.git
 - [deleted]         refs/heads/master
```

ややこしく見えますが、意味が分かればそこまででも無いはず？

もう一つ実行している以下のコマンドは、念の為ローカルにある`refs/heads/master`を削除するためのコマンドです。

``` shell
$ git tag -d refs/heads/master
```

分かればなんてことないですが、スラッシュだらけで見た目がヤバそうなエラーでした…。
