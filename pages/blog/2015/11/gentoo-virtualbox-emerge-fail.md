---
title: virtualboxをemergeしようとするとno input filesとか言われる
pubtime: 2015-11-22T13:54:00+09:00
tags: [Gentoo, VirtualBox]
description: gentooのportageでVirtualBoxをインストールしようとしたところ、gccがno input filesというエラーを吐いたので、対処しました。
---

gentooのportageでvirtualboxをアップデートしようとしたら、こんな感じのエラーが出て失敗しました。
```
x86_64-pc-linux-gnu-gcc: error: missing filename after '-o'
x86_64-pc-linux-gnu-gcc: fatal error: no input files
```

なんだか分からないので一通り試してみたのですが、どうやら**distcc**との相性が悪いようです。
しょうがないので、**make.conf**を開いて**FEATURES**からdistccを消します。

んでもってもう一回emergeすると行けます。やったね。
