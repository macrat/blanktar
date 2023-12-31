---
title: pythonでmercurialのリポジトリを見てみる
pubtime: 2014-12-14T21:57:00+09:00
tags: [Python, mercurial, バージョン管理]
description: mercurialはpythonで書かれているので、pythonプログラムからリポジトリを扱うことが非常に簡単に出来ます。というわけで、リポジトリの履歴を辿って変更の情報を表示するプログラムを書いてみました。
---

mercurialのリポジトリをpythonから見れたら色々楽しそうじゃない？ とふと思ったのでやってみた。

そもそもmercurial自体がpythonで書かれていることもあってか、何かもの凄い簡単にいけました。
筆者の環境(gentoo)ではmercurial入れただけでコード動かせたし。素敵。

解説をがっつり書くのは面倒くさいのでコメント入れたソースコードで許して。
このコードがやってるのは、tipから順番に古いリビジョンを見ていって、それぞれのリビジョンで変更されたファイルについての情報を表示する、というもの。
``` python
#!/usr/bin/python2
#coding: utf-8

import datetime, time

from mercurial import localrepo, match, ui


repo = localrepo.localrepository(ui.ui(), './')  # リポジトリを開く。localの他にもhttpとかsshとか色々あるみたい。

filelist = set(repo.walk(match.match('/', '/', ['glob:*', ])))  # ファイルの一覧を取得。ついでにlist型で返ってくるものをset型にしておく。
# 2014/12/21: 間違いがあったので修正。パターン(glob:ってやつ)は文字列じゃなくてリストで渡します。申し訳ないです。

tip = repo['tip'].rev()  # tipのリビジョン番号を取得
for rev in (repo[x] for x in xrange(tip, -1, -1)):  # tipからリビジョンを遡る
    print('revision{0}: {1}'.format(rev.rev(), rev.description()))
    print(' user: {0}'.format(rev.user()))  # 変更した人
    print(' date: {0}'.format(time.asctime(time.localtime(rev.date()[0]))))  # リビジョンの変更日時。ちょっと長いけど、大事なのはrev.date()だけ。

    for f in rev.files():  # そのリビジョンで変更されたファイルの一覧
        print(' {0}'.format(f))  # ファイル名
        print('  path: {0}'.format(rev[f].path()))  # ファイルパス
        print('  size: {0}'.format(rev[f].size()))  # ファイルサイズ
        print('  content: {0}'.format(repr(rev[f].data())))  # ファイルの内容
```

予想以上に簡単でびっくり。これなら手軽に使えそうだね。
・・・まあ、特に使う予定は無いのだけれど。

---

参考：
- [Mercurial を Python から使ってみる - プログラマのネタ帳](http://d.hatena.ne.jp/shomah4a/20120525/1337919849)
- [MercurialApi - Mercurial](http://mercurial.selenic.com/wiki/MercurialApi)
