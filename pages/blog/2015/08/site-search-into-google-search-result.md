---
title: googleの検索結果にサイト内検索の窓を表示しよう。
pubtime: 2015-08-21T16:41:00+09:00
tags: [Web]
description: schema.orgのJSON-LDを使用したリッチスニペットをウェブサイトに仕込んで、Googleの検索結果にサイト内検索の窓が表示されるようにする方法です。
---

グーグルの検索結果にサイト内検索の窓が出ることがあるんですってね。「価格.com」とか検索してみると確かに出てます。
なんだかリッチな感じでとっても素敵なので、うちのサイトでも対応してみました。検索結果に反映されるのはしばらく先かな。

これに対応させるのには[schema.org](http://schema.org/)の[SearchAction](http://schema.org/SearchAction)とやらを使うそうです。[WebSite](http://schema.org/WebSite)ってのに埋め込んで使うみたい。
このWebSiteってやつは**JSON-LD**とかいう形式を使わないといけないそうな。
JSON-LDはまあ難しいことを考えなければただのjson形式で、scriptタグを使って書くらしい。

``` html
<script type="application/ld+json">
{
    "@context": "http://schema.org",
    "@type": "WebSite",
    "name": "BlankTar",
    "url": "http://blanktar.jp",
    "author": {
        "@type": "Person",
        "name": "MacRat",
        "url": "http://blanktar.jp/about.html"
    },
    "potentialAction": {
        "@type": "SearchAction",
        "target": "http://blanktar.jp/search?q={query}",
        "query-input": {
            "@type": "PropertyValueSpecification",
            "valueName": "query",
            "valueRequired": "http://schema.org/True"
        }
    }
}
</script>
```
うちのサイトだとこんな感じ。

`@context`は最初に一つだけ、あとは`@type`を各階層に付けてschema.orgのアイテム名（とかいう呼称で良いのか？）を書くみたい。それぞれの要素はそのまま要素名をキーにするだけ。
わりとシンプルですね。

トップレベルに書いてあるのが[WebSite](http://schema.org/WebSite)の情報。サイト名とかURLとか。
続いて私の情報を[Person](http://schema.org/Person)で。aboutページにリンクさせるよりマシな表示の仕方がないものか考え中です。数年くらいずっと。
他にも色々と書ける要素がありますので、是非一度[http://schema.org/WebSite](http://schema.org/WebSite)をご覧ください。

んで、その後の`potentialAction`ってやつが本命。
これのタイプを[SearchAction](http://schema.org/SearchAction)にしてあげると検索窓を出してくれるようになる、らしいです。
`target`ってやつが検索ページのURL。{}で囲んだ部分にクエリを入れることが出来ます。名前は適当で良さそう。
で、`query-input`で必須かどうかを指定します。`valueName`は`target`の中で使ったものを同じにしないといけないっぽい。

ちなみに、この`query-input`ってやつは以下のように省略出来るようです。
```
"query-input": "required name=query"
```
めっちゃ短かい。
省略してる感がすごいのでなんとなくやめておきましたが、たぶんこっちでも良い。

そんな感じでやると、多分、googleの検索結果にサイト内検索窓が表示されます。
数週間かかったりするので、気長に待ちましょう。わくわく。

参考： [Sitelinks Search Box &nbsp;|&nbsp; Structured Data &nbsp;|&nbsp; Google Developers](https://developers.google.com/structured-data/slsb-overview)
