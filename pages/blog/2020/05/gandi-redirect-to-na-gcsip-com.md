---
title: Gandi.netにクレジットカードを登録しようとしたら「na.gcsip.com」に飛ばされた
pubtime: 2020-05-03T13:21:00+09:00
tags: [技術以外の色々]
description: ドメインを管理してもらっているGandi.netにクレジットカードを登録しようとしたところ、「na.gcsip.com」というドメインに転送されました。運営者の表記が無くて怪しかったので、少し調べてみました。どうやら、大丈夫なサイトみたいです。
image: [/blog/2020/05/gandi-na-gcsip-com.png]
faq:
  - question: Gandi.netにクレジットカードを登録するときに出てくる「na.gcsip.com」は安全？
    answer: Gandi.netが使用している正規の決済サービスのようです。なので多分大丈夫。
---

# TL;DR

[gandi.net](https://gandi.net)にクレジットカードを登録するときに転送される「na.gcsip.com」ってサイトは、多分大丈夫なやつです。（証明書とかはちゃんと見てくださいね）


# 経緯とか情報源とか

私の管理しているドメインはgandi.netで買っているのですが、今まではPayPalで手動更新していました。
ちょっとそれも面倒臭いなということで、クレジットカードを登録して自動更新してみようかと思ったのですが…登録中にこんな画面に飛ばされました。

![na.gcsip.comってドメインのサイト。gandi.netのロゴとものすごく簡素な入力フォームがあるだけ。](/blog/2020/05/gandi-na-gcsip-com.png "512x512")

決済代行の会社にしては何か妙に簡素すぎる気がするし、運営者の表記とかが何も無い。
気になったので調べてみました。

このページの証明書がこれ。

![Google Chromeで見た証明書の詳細情報。「Trustwave Holdings, Inc.」が「Global Collect Services B.V.」に対して証明書らしい。](/blog/2020/05/na-gcsip-com-certificate.png "512x631")

発行先は「Global Collect Services B.V.」ってところ。
これ、[ingenico group](https://www.ingenico.com/)って会社の傘下みたいですね。
決済関係のサービスを色々やってるフランスの会社らしいです。

さらに調べてみたところ、公式ツイッターが同じ質問に答えているのを見つけました。

<blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr">That&#39;s the correct domain for our banking partner: Global Collect Services: <a href="https://t.co/z70L1d9nsO">https://t.co/z70L1d9nsO</a> -- it&#39;s not a scam! As always, though, you can check the whois if you&#39;re unsure of the domain and of course the SSL cert details (and it doesn&#39;t hurt to ask on Twitter) -- Andrew</p>&mdash; gandi.net (@gandibar) <a href="https://twitter.com/gandibar/status/944301531863617536?ref_src=twsrc%5Etfw">December 22, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

gandi.netが使っているサービスで間違いないよとのこと。
というわけで、大丈夫みたいですね。
