---
title: iPadではcssのbackground-attachmentを使えないらしい
pubtime: 2013-11-06T22:32:00+09:00
amp: hybrid
tags: [iPad, CSS, HTML, background, SVG]
description: iPadではCSSの`background-attachment`が動かないようです。なので、別の方法で同じようなことを実現してみました。
---

背景をcssからsvgに移行してみました。
これでますます色んな解像度に対応できるようになった・・・かも？

その過程で1つ問題に当たったので、それについてメモ。
最初は
``` css
body {
    background-image: url("background.svg");
    background-repeat: no-repeat;
    background-attachment: fixed;
}
```
みたいに設定していたのだけれど、これだとiPadでうまく表示されない。
どうやら、iPadはbackground-attachmentに対応していないようです。
・・・って、全部タイトルに書いちゃったけれど。

しょうがないので、HTMLに
``` html
<div id="background"></div>
```
って要素を付け足して、
``` css
#background {
    background-image: url("/background.svg");
    background-repeat: no-repeat;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
}
```
とすることで対応。
かなり文字数増えちゃったねー・・・悲しい。

ま、元のCSS版よりは短くなったからいいか。
そのCSS版は一応[こちら](/blog/2013/11/old-background)に残しておきます。CSSで絵を描く方法、的な？

参考: [iPad用背景固定とJPGの謎 - らぶびあん日記](http://kk0201.com/2012/03/ipadjpg.html)
