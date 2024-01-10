---
title: Blanktarのリニューアル 〜 Next.jsをやめてGo製のサイトジェネレータにした話
pubtime: 2024-01-06T17:44:00+09:00
tags: [Blanktar.jp]
image: [/blog/2024/01/blanktar-renewal.jpg, /blog/2024/01/blanktar-renewal/after-screenshot.jpg]
description: 2024年1月1日に行なったBlanktarのリニューアルに関するまとめです。あえてモダン技術を捨てて更なる速度の追求を行なっています。
---

今年の1月1日に合わせてこのWebサイトのリニューアルを行ないました。
新しいサイトの特徴や、今回のリニューアルで行なった工夫をまとめてみます。

<div style="display: flex">
  <figure style="margin: 0 12px">
    <img alt="リニューアル前のスクリーンショット。印刷物のマーカーとして使う「トンボ」のようなデザインが特徴になっている。" src="/blog/2024/01/blanktar-renewal/before-screenshot.jpg" width="1280" height="1024" style="display: block">
    <caption>Before</caption>
  </figure>
  <figure style="margin: 0 12px">
    <img alt="リニューアル後のスクリーンショット。「トンボ」風のデザインをやめて、全体的にシンプルでスタイリッシュな印象に調整した。" src="/blog/2024/01/blanktar-renewal/after-screenshot.jpg" width="1280" height="1024" style="display: block">
    <caption>After</caption>
  </figure>
</div>

左が旧デザインで、右が新デザインです。どちらもライトテーマとダークテーマがあるので両方表示してあります。
基本的な路線は同じですが、読み易さを追求して更にシンプルにしてみました。


# 動機

[2020年のリニューアル](/blog/2020/05/blanktar-renewal)以降Next.jsを使ったサイトとして運用していたのですが、以下のような理由から新たに作り直すことにしました。

## Node, React, Next.js, etc... の更新についていくのがしんどかった。

様々なライブラリに依存させてしまった結果、半年〜1年ほど放置するとビルドもままならなくなるほどになっていました。
特にReactとNext.jsのコンビがつらかった気がします。

新しい記事を投稿するたびに「まずはビルドエラーを解消しなきゃ……」となるのはつらいので、依存関係の更新に強い技術スタックで作り直すことにしました。

## もっと速くできる気がした。

このサイトを始めた当初からの目標として、「ユーザにロード時間を認識させない」というものがあります。
具体的には、初回閲覧時の表示を大体1秒以内に収めて、CLS(Cumulative Layout Shift)もなるべく0にすることを目指しています。

以前のサイトもかなりチューニングして目標を達成していましたが、巨大なフレームワークに遮蔽されてしまう部分が多く改善に限界を感じていました。
Next.js自体もかなり高速化に寄与してくれましたが、それでも見えづらいものをチューニングするのは難しいものです。

自分で制御できる部分を増やしてチューニングしやすくするべく、フレームワークを使わずに自作することにしました。
また、表示に関わるJavaScriptを全て廃止することでシンプルに分かりやすくしてあります。

## 式年遷宮したかった。

それはそれとして、定期的にスクラップ アンド ビルドするの楽しくないですか？


# 構造と特徴

基本的な構造は[以前のもの](/blog/2020/05/blanktar-renewal#%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)と似ていて、Markdownで書いた記事をCI/CDでビルドするようにしてあります。
記事とビルドツールはすべて1つのリポジトリ([macrat/blanktar](https://github.com/macrat/blanktar))に入れてあります。

ビルドツールはGo言語による自作で、記事の生成だけでなく、OGP画像の生成や画像のリサイズ機能、更には準ライブプレビュー機能などなどを詰め込んであります。

デプロイ先は引き続き[Vercel](https://vercel.com)にしています。
Next.jsをやめたことで選択肢は広がっていたのですが、デプロイの手軽さやDNS機能の使いやすさから選びました。


# やったこと

## Exif情報を使った写真ページ

新しい[写真ページ](https://blanktar.jp/photos)は、Gitの所定のブランチに配置した写真を読み取って自動生成するようにしてあります。
このとき、Exif情報を読み取ることで様々な情報を出せるようにしてあります。
（といっても、現段階ではまだあまり表示していません。そのうち増やす予定です）

![写真一覧ページのスクリーンショット。日付別のサムネイルが並んでいる。](/blog/2024/01/blanktar-renewal/photos-screenshot.jpg "640x360")

Exif情報は[dsprea/go-exif](https://github.com/dsoprea/go-exif)を使って読み取っており、標準の[imageパッケージ](https://pkg.go.dev/image)を使って自動リサイズなどに対応させています。
ちょっとした作り込みですが、かなり投稿が楽になるので気に入っています。


## GitHub Actionsに特化したビルドキャッシュ

初期のバージョンでは、GitHub Actionsでビルドすると5〜6分掛かっていました。
記事を上げて間違いに気付いて修正して……とやるには少し長すぎる時間です。

ビルド時間の大半は画像の生成が占めていたので、一度生成した画像はキャッシュするようにしました。

![画像ビルドの流れ。キャッシュディレクトリにキャッシュがあればそれをコピーして使用日時を更新する。キャッシュが見つからなければ新たに生成して、キャッシュディレクトリと出力先ディレクトリの両方に保存する。最後にしばらく使っていないキャッシュを消して終了。](/blog/2024/01/blanktar-renewal/image-building-flow.svg "601x689")
<!--
flowchart
  ビルド開始 --&gt; start[/画像の枚数分繰り返し\]
  
    subgraph " "
    start --&gt; ソース画像を読み取る --&gt; 生成すべきファイル名やハッシュを計算 --&gt; check{"キャッシュ\nがある？"}
    check --&gt;|yes| 画像を生成 --&gt; キャッシュディレクトリに保存 --&gt; done
    画像を生成 --&gt; 出力先ディレクトリに保存 --&gt; done
    check --&gt;|no| copy["キャッシュディレクトリから\n出力先ディレクトリにコピー"] --&gt; キャッシュの使用日時を更新 --&gt; done
    end

  done[\繰り返し終わり/] --&gt; しばらく使っていないキャッシュを削除 --&gt; ビルド終了
-->

[actions/cache](https://github.com/actions/cache)で扱いやすいように、全てのキャッシュは専用のディレクトリに保存するようにして、ビルド後に使わないキャッシュを消すようにしてあります。
こうしておくと、キャッシュの肥大化を避けつつ、一度生成した画像はそのまま使い回すことができます。

GitHub Actionsに特化した……と書きましたが、それ以外のCI/CDでも使えるかもしれません。


# やめたこと

- **AMP**

  前回のリニューアルでAMP (Accelerated Mobile Pages)に対応させましたが、今回はAMP対応を行ないませんでした。

  Google検索の優遇措置が終了したことと、AMP対応をしても高速化できていなかったことが理由です。
  十分にチューニングした普通のHTMLであれば、AMPを圧倒することができるようです。

- **ServiceWorker**

  こちらも前回高速化のために導入しましたが、新しいサイトの設計思想には似わないと判断したため削除しました。

  旧サイトはReactを使用していたので沢山のアセットを使用していましたが、今回の新サイトは1ページが1ファイルだけで完結するようにしてあります。
  するとキャッシュが効く要素が無いので、ServiceWorkerを挟む分だけ遅くなってしまうのです。

  オフラインで閲覧できる機能だけは生きることになりますが、そんな需要は無いだろうと判断しました。

- **GitHub/Instagram連携**

  GitHubやInstagramの活動を自動的に集計する機能を持たせていましたが、デザインやコンテンツの変更に伴なって廃止しました。
  [worksページ](https://blanktar.jp/works)や[photosページ](https://blanktar.jp/photos)はもう少しブラッシュアップするつもりです。……やる気が足りれば。

- **Google Analytics**

  それほどアクセスログを見ていなかったので、思い切って今回から廃止しました。
  Cookie無添加のクリーンな（？）サイトになりました。


# ベンチマーク

Next.jsをやめて完全に静的なサイトにした結果、以下のような高速化を実現することができました。

テスト対象のページ: [自作Webアプリをmailto:とかtel:のURLに紐付ける - Blanktar](/blog/2022/01/register-protocol-handler)

|                          |  Before |  After |
|--------------------------|--------:|-------:|
| First Content Paint      |   456ms |  331ms |
| Largest Contentful Paint |   861ms |  423ms |
| Cumulative Layout Shift  |   0.005 |      0 |
| Total Blocking Time      |   114ms |      0 |
| Speed Index              |   483ms |  310ms |
| Total Time               |  2.844s | 0.383s |
| Page Weight              | 1,034KB |   28KB |

※ テストは[WebPageTest](https://webpagetest.org/)を使用して1度だけ行ないました。かなり簡易的な参考値です。

まだ細かいチューンングをする前ですが、それでもかなりの高速化ができたようです。

<div class="two-columns-20240106">
<div>

## Before

リニューアル前はReactやWebフォントなどを利用していたことにより、かなり多数のリクエストが発生していました。

特にWebフォントはなんとか高速に取得させる工夫をしていましたが、それでも時間が掛かってしまっていることがグラフから伺えます。

[![リニューアル以前のウォーターフォールグラフ。全て合せると68のリクエストが発生している。半分ちょっとが内部リクエストで、残りがWebフォントの取得などに費やされている。](/blog/2024/01/blanktar-renewal/before-waterfall.png "506x700")](https://blanktar.jp/blog/2024/01/blanktar-renewal/before-waterfall.png)
<!-- https://www.webpagetest.org/result/240105_BiDcYJ_AQ9/1/details/ -->

</div>
<div>

## After

1ファイルに全てをまとめたことで、圧倒的にリクエスト数が減りました。（当然のことではありますが…。）

グラフを見るに、画像などのアセットはpreloadで高速化する余地がありそうですね。

[![リニューアル後のウォーターフォールグラフ。3つのリクエストだけで完了している。1つめはHTMLの取得で、他に画像の取得が1回とfaviconの取得が1回行なわれている。](/blog/2024/01/blanktar-renewal/after-waterfall.png "506x147")](https://blanktar.jp/blog/2024/01/blanktar-renewal/after-waterfall.png)
<!-- https://www.webpagetest.org/result/240105_AiDc5Y_BGP/1/details/ -->

</div>
</div>
<style>
@media screen {
  .two-columns-20240106 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em
  }
}
@media (max-width: calc(800px)) {
  .two-columns-20240106 {
    display: block;
  }
}
</style>


# リニューアルを終えて

Next.jsをやめてGo製の静的な仕組みに変えた結果、長期的なメンテナンス性と高速さを得ることができました。
一方で最終的な成果物と直接関係のないコード量は増えてしまっていますが、運用の手間が下がったことを考えれば悪くないトレードオフでしょう。

静的サイトジェネレータというのはよく出来ているものだなと感じられるプロジェクトになりました。自分で作るのはとても大変なので、JekyllとかHugoとか使うと良いと思います。再発明好きの方は是非どうぞ。楽しいですよ。
