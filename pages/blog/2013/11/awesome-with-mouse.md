---
title: マウスでawesomeを使いたい事だってあるじゃない。
pubtime: 2013-11-14T20:32:00+09:00
tags: [Linux, 環境構築]
description: タイル型wmのawesomeをマウスを使って操作するやめの設定と、使い方の説明です。
---

タイル型ウィンドウマネージャーってのはいいね、効率的に作業できる。

で、そのタイル型wmのawesomeってのをメインに使ってみようかと思ったわけなのだけれど、マウス欲しいことだってあるじゃない。
こう、てきとーにウェブサーフィンするときとか。マウス使いたいじゃん。
んでもいちいちstartxしなおすのもめんどいじゃん。

で、マウスでawesomeを使ってみようの巻。

設定ファイル開きます。`~/.config/awesome/rc.lua`ね。
``` lua
local titlebars_enabled = false
```
ってなってる行があるので、
``` lua
local titlebars_enabled = true
```
に変更。

[タイトルバー付きなawesomeのスクリーンショット](/blog/2013/11/with_titlebar.jpg)

こんな感じでタイトルバーが表示されるようになります。

あとはこのタイトルバーを左ドラッグでウィンドウの移動。右ドラッグでサイズの変更。
modkey + 左ドラッグor右ドラッグ でも同じことが出来るのだけれど、キーボードに手を伸ばすのが面倒なこともあるよね、きっと。

ちなみに、さっき編集した箇所のすぐ下辺りに
``` lua
-- Widgets that are aligned to the left
```
とか
``` lua
-- Widgets that are aligned to the right
```
とかいうのがあります。
この辺をいじるとタイトルバーの内容を変更できるみたい。

参考: [タイトルバーにつけているタグを表示してみる (awesome) - 跡々](http://d.hatena.ne.jp/kojimu/20111108/1320714931)
