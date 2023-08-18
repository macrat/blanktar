---
title: gentooにfcitx-skkを入れてみた。
pubtime: 2015-08-02T23:27:00+09:00
tags: [Linux, Gentoo]
description: 日本語の入力を少しでも速く行うべく、SKKとかいうIMEをgentooインストールして使ってみました。fcitxとの組み合わせで、自分でコンパイルして入れています。
---

日本語の変換って面倒臭いので、なんとかもっと手っとり早くできないものかと思いまして。
**SKK**とかいう謎なIMEに手を出してみることにしました。

SKKというのは文節の解析を自動で行なわず、全部手動で入力しようというシロモノです。要は、「ここではきものをぬいでください」を確実に変換できる、ということらしいです。
詳しい解説は探せばいくらでも出てくると思いますので、そちらをどうぞ。

私が普段使っているのはscim-anthyなので、リポジトリに入ってたscim-skkを入れようとしたのですが、コンパイルエラーで入らず。gtkのバージョンが違うのが原因っぽいのだけれど、分からんので諦める。
ibus-skkの方は入るには入るのですが、python2で書かれているskkをpython3で起動しようとするらしく、動かない。
仕方がないので、**fcitx**とやらを使ってみることにしました。

とりあえず、[githubにあるやつ](https://github.com/fcitx/fcitx-skk)を落としてくる。
```
$ git clone https://github.com/fcitx/fcitx-skk.git
```
場所はなんか適当に。

そしたら、必要なパッケージをemerge。
```
# emerge fcitx libskk skk-jisyo
```
必要に応じてcmakeとかqtとかも入れてください。

準備が出来たら、コンパイルする。
```
$ cd fcitx-skk
$ cmake .
$ make
$ sudo make install
```
大体こんなもんで。

いつもの環境変数の設定とデーモンの起動を.xinitrcあたりに書く。
``` bash
export XMODIFIERS="@im=fcitx"
export GTK_IM_MODULE="xim"
export QT_IM_MODULE="xim"
fcitx
```
起動時のオプションは要らないみたいです。

で、確認すると、多分出来あがり。
この記事は初めてのSKKで打っているのですが、なんとも奇妙な感覚です。
変換候補を確かめる時間はほぼゼロに近いのだけれど、その代わりに送りがなの位置で詰まる、みたいな。
慣れるとめちゃめちゃ早く打てるようになりそうな気がします。ただ、小指が痛いです。
