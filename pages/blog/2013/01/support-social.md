---
title: X (旧Twitter) と Facebook のシェアボタンを a タグだけで作る
pubtime: 2013-01-11T22:35:00+09:00
modtime: 2025-11-09T22:15:00+09:00
tags: [Blanktar.jp]
description: twitterとfacebookでシェアするためのボタンを設置してみました。この記事では、JavaScriptを使わずにaタグだけでシェアボタンを作る方法を紹介します。
---

<ins date="2025-11-09T22:15:00+09:00">

# 2025-11-09 追記

最新の形式に対応させつつ、読みやすいように書き直しました。

</ins>

X (旧Twitter) や Facebook のシェアボタンを設置してみました。
自前のデザインで作りたかったので、公式のコードやJavaScriptは利用せずに、aタグだけで実装しています。

実装は非常に簡単で、以下のようなURLにリンクを張るだけでできました。


# X (旧Twitter)

**URL形式**: `https://x.com/share?url={URL}&text={TEXT}&via={USERNAME}`

`{URL}`, `{TEXT}`, `{USERNAME}` の部分は、それぞれ以下のようなもので置き換えてください。

- `{URL}` : シェアしてほしいページのURL。
- `{TEXT}` : ポストに含めたいテキスト。ページタイトルなど。
- `{USERNAME}` : ポストに含めたいXのユーザー名。`@`は不要。

たとえば[`https://x.com/share?url=https://blanktar.jp&url=https%3A%2F%2Fblanktar.jp&text=ここに記事タイトル&via=macrat_jp`](https://x.com/share?&url=https%3A%2F%2Fblanktar.jp&text=ここに記事タイトル&via=macrat_jp)のようにすると、 **「ここに記事タイトル https://blanktar.jp @macrat_jpより 」** という内容でポストする画面にリンクできます。


# Facebook

**URL形式**: `http://www.facebook.com/share.php?u={URL}`

`{URL}` の部分は、シェアしてほしいページのURLで置き換えてください。

たとえば[`http://www.facebook.com/share.php?u=https://blanktar.jp`](http://www.facebook.com/share.php?u=https://blanktar.jp)のようにすると、 `https://blanktar.jp` へのリンク付きの投稿を書く画面にリンクできます。


<ins date="2014-02-28T16:35:00+09:00">

# 2014-02-28 追記

google+の共有ボタンについても書きました。  
[google+の共有ボタンをaタグだけで作る](/blog/2014/02/atag-google-plus-link)

</ins>
