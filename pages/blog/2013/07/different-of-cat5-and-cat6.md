---
title: cat5のケーブルとcat6のケーブルは何が違うのか。
pubtime: 2013-07-21T12:02:00+09:00
tags: [ネットワーク, ハードウェア]
description: イーサネットケーブルのカテゴリによって速度が違うわけですが、そもそも何故同じ形のケーブルで速度の違いが出てくるのかを調べてみました。
---

LANケーブルでさ、cat5だのcat6だのってのがあるじゃございませんか。
最近だとcat7なんてのもちょいちょい見るよね。10000baseだぜ。はんぱない。

でね、常々疑問に思っていたことが１つあるんだ。
なんで同じ形のケーブルなのに速度が違うんだよ。訳わからんよ。

という訳で、調べてみました。

簡単に言っちゃうと、イーサネットケーブルの8本の線のうち4本の線を使って、送信+、送信-、受信+、受信-に振り分けて1本100Mbpsで使うのが100base。つまりcat5。
1, 2, 3, 6番のピンだっけ？

で、残り4本についても同じように割り当てて、一つの線を250Mbpsにして使うのが1000base。これがcat6。

cat5のケーブルを使うと1Gbps出ないのは、線が4本足りないからなんだね、きっと。
そう考えると色々納得。

ちなみに、cat7というのは線の本数的にはcat6と変わらないようです。
単純にノイズに強いってことみたい。多分。

---

参考:
- [100Base-TX、1000Base-TX、1000Base-Tにおける伝送方式の違い - エイム電子株式会社](http://www.aim-ele.co.jp/tech/metal-tech6/)
- [カテゴリー7ケーブル - wikipedia](http://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA%E3%83%BC7%E3%82%B1%E3%83%BC%E3%83%96%E3%83%AB)
