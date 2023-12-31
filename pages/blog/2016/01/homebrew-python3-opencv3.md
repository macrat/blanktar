---
title: homebrewでopencv3を入れてpython3からOpenCVを使えるようにした。
pubtime: 2016-01-15T11:17:00+09:00
tags: [Mac, Python, OpenCV, 環境構築]
description: Mac OSのPython3でOpenCVを使うべく、Homebrewを使ってOpenCV 3をインストールしました。若干いつもと違うコマンドを打つ必要があるようです。
---

**OpenCV**はかなり楽しいのですが、python2しか対応してなくてつらいですよね。…って思っていたら、*opencv3.0.0*からはpython3系にも対応しているそうです。すてき。
というわけで、早速手元のmacに入れてみました。

とりあえず古いやつを消しておく。入れてないならやらなくておっけー。
``` bash
$ brew uninstall opencv
```

で、新しいやつを入れる。
``` bash
$ brew install opencv3 --with-python3
$ echo /usr/local/opt/opencv3/lib/python2.7/site-packages >> /usr/local/lib/python2.7/site-packages/opencv3.pth
$ echo /usr/local/opt/opencv3/lib/python3.5/site-packages >> /usr/local/lib/python3.5/site-packages/opencv3.pth
```
こんな感じ。以上。

インストール時のメッセージにも出てくるのだけれど、2行目と3行目のようなコマンドを打たないと動くようにならないので注意です。
opencv2と被らないように、自動でリンクしてくれないっぽい。

2.7とか3.5とかの部分はお使いのpythonのバージョンに合せてください。よしなに。

余談ですが、opencv3になってもモジュール名は`cv2`のままらしいです。使い方も変わりません。
せっかくならオブジェクト指向っぽいAPIにしてほしかったけれど、他の言語のバインディングとの兼ね合いなのかしら。めんどうくさい。
