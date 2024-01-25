---
title: CSSのfilterを使って、背景色に合わせた文字色を自動的に設定する
pubtime: 2020-11-01T01:29:00+09:00
modtime: 2024-01-25T18:50:00+09:00
tags: [Web, HTML, CSS]
description: 背景色が動的に変わる状況で、文字色が見えなくならないように良い感じに設定したい時があります。JavaScriptで書くのは面倒なので、CSSのfilterを使って上手いことやってもらう方法をご紹介します。
image:
  - /blog/2020/11/css-automate-foreground-text-color.png
  - /blog/2020/11/css-automate-foreground-text-color-4x3.png
  - /blog/2020/11/css-automate-foreground-text-color-1x1.png
faq:
  - question: CSSの機能だけで背景色に合わせた文字色を選ばせるには？
    answer: filterを使って、 invert(100%) で反転した色を grayscale(100%) contrast(100) で白黒にして使ってあげればそれらしくなります。
  - question: CSSだけで文字や画像の色を反転させるには？
    answer: invert(100%) というフィルタが使えます。
  - question: CSSで文字や画像を白黒にするには？
    answer: grayscale(100%) というフィルタでグレースケールにしたあと、 contrast(100) でコントラストを上げれば白黒になります。
---

背景色が動的に変わる状況で、文字色を良い感じに設定したい事があります。
ユーザーの入力によって色が決まるとか、外部のAPIが色を決めてるとか。

そこで、文字色が動的に設定される方法を考えてみました。それも、CSSだけで。  
実際に動かしてみると以下のような表示になります。

<div role="img" aria-label="カラフルな27色の枠と、その上に白か黒の文字でカラーコードが表示されている。明るい色の場合は黒い文字、暗い色の場合は白い文字。">
  <div style="background-color: #000000; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #000000; filter: invert(100%) grayscale(100%) contrast(100)">#000000</span></div>
  <div style="background-color: #000080; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #000080; filter: invert(100%) grayscale(100%) contrast(100)">#000080</span></div>
  <div style="background-color: #0000FF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #0000FF; filter: invert(100%) grayscale(100%) contrast(100)">#0000FF</span></div>
  <div style="background-color: #008000; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #008000; filter: invert(100%) grayscale(100%) contrast(100)">#008000</span></div>
  <div style="background-color: #008080; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #008080; filter: invert(100%) grayscale(100%) contrast(100)">#008080</span></div>
  <div style="background-color: #0080FF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #0080FF; filter: invert(100%) grayscale(100%) contrast(100)">#0080FF</span></div>
  <div style="background-color: #00FF00; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #00FF00; filter: invert(100%) grayscale(100%) contrast(100)">#00FF00</span></div>
  <div style="background-color: #00FF80; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #00FF80; filter: invert(100%) grayscale(100%) contrast(100)">#00FF80</span></div>
  <div style="background-color: #00FFFF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #00FFFF; filter: invert(100%) grayscale(100%) contrast(100)">#00FFFF</span></div>
  <div style="background-color: #800000; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #800000; filter: invert(100%) grayscale(100%) contrast(100)">#800000</span></div>
  <div style="background-color: #800080; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #800080; filter: invert(100%) grayscale(100%) contrast(100)">#800080</span></div>
  <div style="background-color: #8000FF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #8000FF; filter: invert(100%) grayscale(100%) contrast(100)">#8000FF</span></div>
  <div style="background-color: #808000; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #808000; filter: invert(100%) grayscale(100%) contrast(100)">#808000</span></div>
  <div style="background-color: #808080; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #808080; filter: invert(100%) grayscale(100%) contrast(100)">#808080</span></div>
  <div style="background-color: #8080FF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #8080FF; filter: invert(100%) grayscale(100%) contrast(100)">#8080FF</span></div>
  <div style="background-color: #80FF00; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #80FF00; filter: invert(100%) grayscale(100%) contrast(100)">#80FF00</span></div>
  <div style="background-color: #80FF80; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #80FF80; filter: invert(100%) grayscale(100%) contrast(100)">#80FF80</span></div>
  <div style="background-color: #80FFFF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #80FFFF; filter: invert(100%) grayscale(100%) contrast(100)">#80FFFF</span></div>
  <div style="background-color: #FF0000; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FF0000; filter: invert(100%) grayscale(100%) contrast(100)">#FF0000</span></div>
  <div style="background-color: #FF0080; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FF0080; filter: invert(100%) grayscale(100%) contrast(100)">#FF0080</span></div>
  <div style="background-color: #FF00FF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FF00FF; filter: invert(100%) grayscale(100%) contrast(100)">#FF00FF</span></div>
  <div style="background-color: #FF8000; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FF8000; filter: invert(100%) grayscale(100%) contrast(100)">#FF8000</span></div>
  <div style="background-color: #FF8080; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FF8080; filter: invert(100%) grayscale(100%) contrast(100)">#FF8080</span></div>
  <div style="background-color: #FF80FF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FF80FF; filter: invert(100%) grayscale(100%) contrast(100)">#FF80FF</span></div>
  <div style="background-color: #FFFF00; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FFFF00; filter: invert(100%) grayscale(100%) contrast(100)">#FFFF00</span></div>
  <div style="background-color: #FFFF80; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FFFF80; filter: invert(100%) grayscale(100%) contrast(100)">#FFFF80</span></div>
  <div style="background-color: #FFFFFF; display: inline-block; text-align: center; padding: 1em; width: 6em"><span style="color: #FFFFFF; filter: invert(100%) grayscale(100%) contrast(100)">#FFFFFF</span></div>
</div>

いかがでしょうか。
グレー(`#808080`)に近い色はやや見づらくなってしまっていますが、それ以外はかなり上手く表示できているのではないかと思います。


# やり方

上記のサンプルは以下のようなCSSで実現しています。

``` html
<div>
    <span>hello world!</span>
</div>

<style>
div {
    background-color: red;
}
span {
    color: red;
    filter: invert(100%) grayscale(100%) contrast(100);
}
</style>
```

以上、これだけです。

[詳しい解説は後述](#仕組み)しますが、`color`と`background-color`に同じ色を設定してから、文字色だけCSSのfilterで見える色に変化させる仕組みです。

なお、divとspanをセットにすると背景色にもフィルターが適用されてしまうので注意してください。


# ブラウザの対応状況

今回使用したCSS Filterは基本的なブラウザで使用することが出来ます。

ただ、IEだけは対応しないのでご注意ください。
まあもうIEは良いでしょう。良いということにしましょう。

[![Can I useで調べたCSS Filter Effectsの対応状況。主要ブラウザだとIE11だけが非対応。](/blog/2020/11/caniuse-css-filter-effects.jpg "600x356")](https://caniuse.com/css-filters)


# 仕組み

ここからは、詳細な仕組みをご説明します。

## まずは同じ色で描画する

最初はfilterを掛ける前の状態から。

背景と色を同じ色で描画します。
同じ色なので当然ですが、そのままでは全く見えません。

<div role="img" aria-label="様々な明るさの赤い背景に、背景と同じ色で文字が表示されている。なので、全く見えない。">
  <div style="background-color: #FFCCCC; display: inline-block; padding: 1em 2em"><span style="color: #FFCCCC">#FFCCCC</span></div>
  <div style="background-color: #FF8E8E; display: inline-block; padding: 1em 2em"><span style="color: #FF8E8E">#FF8E8E</span></div>
  <div style="background-color: #FF0000; display: inline-block; padding: 1em 2em"><span style="color: #FF0000">#FF0000</span></div>
  <div style="background-color: #8E0000; display: inline-block; padding: 1em 2em"><span style="color: #8E0000">#8E0000</span></div>
  <div style="background-color: #330000; display: inline-block; padding: 1em 2em"><span style="color: #330000">#330000</span></div>
</div>

## invertで色を反転させる

この状態から文字色だけに`invert(100%)`を当てることで色を反転させて、ちゃんと目に見えるようにします。

<div role="img" aria-label="様々な明るさの赤い背景に、文字はシアンで表示されている。背景が明るい赤の場合は暗いシアン、暗い赤の場合は明るいシアン。色の差が激しくて目がつらい。">
  <div style="background-color: #FFCCCC; display: inline-block; padding: 1em 2em"><span style="color: #FFCCCC; filter: invert(100%)">#FFCCCC</span></div>
  <div style="background-color: #FF8E8E; display: inline-block; padding: 1em 2em"><span style="color: #FF8E8E; filter: invert(100%)">#FF8E8E</span></div>
  <div style="background-color: #FF0000; display: inline-block; padding: 1em 2em"><span style="color: #FF0000; filter: invert(100%)">#FF0000</span></div>
  <div style="background-color: #8E0000; display: inline-block; padding: 1em 2em"><span style="color: #8E0000; filter: invert(100%)">#8E0000</span></div>
  <div style="background-color: #330000; display: inline-block; padding: 1em 2em"><span style="color: #330000; filter: invert(100%)">#330000</span></div>
</div>

## モノクロにして見やすくする

色を反転させただけだと反対色な上にコントラストが凄いことになるので、彩度が高いと目が痛い感じになります。

なので、`grayscale(100%)`を設定してモノクロにしてあげます。

<div role="img" aria-label="様々な明るさの赤い背景に、今度はグレーの文字で表示されている。コントラストが低いので見えづらい。">
  <div style="background-color: #FFCCCC; display: inline-block; padding: 1em 2em"><span style="color: #FFCCCC; filter: invert(100%) grayscale(100%)">#FFCCCC</span></div>
  <div style="background-color: #FF8E8E; display: inline-block; padding: 1em 2em"><span style="color: #FF8E8E; filter: invert(100%) grayscale(100%)">#FF8E8E</span></div>
  <div style="background-color: #FF0000; display: inline-block; padding: 1em 2em"><span style="color: #FF0000; filter: invert(100%) grayscale(100%)">#FF0000</span></div>
  <div style="background-color: #8E0000; display: inline-block; padding: 1em 2em"><span style="color: #8E0000; filter: invert(100%) grayscale(100%)">#8E0000</span></div>
  <div style="background-color: #330000; display: inline-block; padding: 1em 2em"><span style="color: #330000; filter: invert(100%) grayscale(100%)">#330000</span></div>
</div>

## コントラストを上げて更に見やすくする

モノクロ化することで目が痛いことはなくなりましたが、今度はコントラストが低すぎて見えづらいです。

というわけで、`contrast(100)`でコントラストをがっつり上げて白か黒かに固定します。

<div role="img" aria-label="様々な明るさの赤い背景の上に、それぞれ見やすい白か黒かの文字が載っている。">
  <div style="background-color: #FFCCCC; display: inline-block; padding: 1em 2em"><span style="color: #FFCCCC; filter: invert(100%) grayscale(100%) contrast(100)">#FFCCCC</span></div>
  <div style="background-color: #FF8E8E; display: inline-block; padding: 1em 2em"><span style="color: #FF8E8E; filter: invert(100%) grayscale(100%) contrast(100)">#FF8E8E</span></div>
  <div style="background-color: #FF0000; display: inline-block; padding: 1em 2em"><span style="color: #FF0000; filter: invert(100%) grayscale(100%) contrast(100)">#FF0000</span></div>
  <div style="background-color: #8E0000; display: inline-block; padding: 1em 2em"><span style="color: #8E0000; filter: invert(100%) grayscale(100%) contrast(100)">#8E0000</span></div>
  <div style="background-color: #330000; display: inline-block; padding: 1em 2em"><span style="color: #330000; filter: invert(100%) grayscale(100%)">#330000</span></div>
</div>

これで完成。結構シンプルです。

---

**Q&A**:
- CSSの機能だけで背景色に合わせた文字色を選ばせるには？  
  → filterを使って、`invert(100%)`で反転した色を`grayscale(100%) contrast(100)`で白黒にして使ってあげればそれらしくなります。

- CSSだけで文字や画像の色を反転させるには？  
  → `invert(100%)`というフィルタが使えます。

- CSSで文字や画像を白黒にするには？  
  → `grayscale(100%)`というフィルタでグレースケールにしたあと、`contrast(100)`でコントラストを上げれば白黒になります。

---

参考: [filter - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/filter)

<ins>

# 2024-01-25 追記

読みやすさのために一部構成を変更しました。

</ins>
