---
title: Google Analytics見たらsocial-buttons.comとやらからスパムアクセスが。
pubtime: 2015-03-31T22:55:00+09:00
tags: [Web]
description: social-buttons.comというところからやたらと大量のアクセスが来ていたので、Google Analyticsの設定を変えてレポートに表示しないように設定しました。
---

以下の画像はこの一週間での私のサイトへのアクセスの参照元です。

![social-buttons.comとやらから195件のアクセスが来てる](/blog/2015/03/referrer.png "781x472")

ご覧のとおり、**social-buttons.com**とか言うところからがっつりアクセスされてます。
このサイトからアクセスされるようになったのは先週の月曜日からなんですが、いや唐突に来すぎだろうということでちょっと調べてみた。

social-buttons.comからのアクセスは全てトップページのみで、直帰率100%で平均滞在時間が0秒でした。
・・・あー、明らかなスパムだこれ。分かりやすい。
ほぼ同じ名前で**buttons-for-website.com**なんてところからも細々と来ていて、これもほぼ同じ特性。

このまま残していてもウザいので、フィルタ掛けて消してしまいましょう。

ページ上部にある**アナリティクス設定**を開いて、**ビュー**の中の**フィルタ**をクリック。

**+新しいフィルタ**をクリックして新しいフィルターを作ります。

んでもって、フィルタの種類を**カスタム**に設定。フィルタフィールドを**キャンペーンのソース**にして、フィルタパターンに**social-buttons.com**と記述。

これで完成。
下の方にある「このフィルタを確認する」をクリックしてチェック。きちんと出ればおっけーです。

保存して終了。んで設定は完了。
反映されるまでに時間がかかるっぽいので気長に待ちましょう。

ちなみに、フィルタパターンは正規表現なので、ドットにエスケープが必要なので注意。.じゃなくて\.って書かないとダメ。

・・・どうでも良いけど、GUIの説明って面倒くさくなるから嫌いだ。

参考： [参照元による除外 - アナリティクス ヘルプ](https://support.google.com/analytics/answer/1034842?hl=ja)
