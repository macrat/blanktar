---
title: 遺伝的アルゴリズムってなんぞや。
pubtime: 2013-04-30T01:58:00+09:00
modtime: 2013-05-01T01:05:00+09:00
tags: [コンピュータサイエンス, 機械学習]
description: 遺伝的アルゴリズムの仕組みについての解説記事です。
---

遺伝的アルゴリズムっていいよね。やばいよね。浪漫だよね。
という訳で、解説記事です。

次回は（覚えてれば）pythonでの遺伝的アルゴリズムのやりかたとか書くよ。

<ins date="2013-05-01T01:05:00+09:00">

# 2013-05-01 追記

次回書きました。
[pythonのpyevolveで遺伝的アルゴリズム。](/blog/2013/05/python-pyevolve)

</ins>

# 遺伝的とは
生き物には遺伝子ってのがあって、良い遺伝子は淘汰されて生き残っていく。
っていうのはまあ、ご存知のところだと思います。
こいつをコンピューター上でもやろうぜ、ってのが遺伝的アルゴリズム。

手順としては、

1. 大量の遺伝子をランダムに作る
2. 良い遺伝子を幾つか選ぶ

    で、その遺伝子を

    1. 交叉させる

        優秀な遺伝子同士を組み合わせる。
        つまりは次の世代に子孫を残すってこと。

    2. 突然変異させる

        そのまんまの意味で突然変異っす。

    3. 生き残らせる

        優秀な遺伝子を次の世代にそのまま残す事もあります。やらないこともある。
        エリートって言います。

3. 作った遺伝子で世代交代させる
4. 新しい世代について2からの手順をやり直す

みたいな感じ。

これを繰り返して進めていきます。
良い遺伝子だけが生き残るので、総当りより効率的に問題をとくことができます。

# どんな時に使うのか
遺伝的アルゴリズムは、

- 最適な解法が無い（あるいは凄い難しい）
- 与えられた解がどのくらい正解に近いかを評価するのは簡単

みたいな時に使われます。

例を挙げるならば、

## nクイーン問題
n×nのマスの盤にn個のクイーンを置きます。
置くんだけど、クイーン同士がお互いを取れる位置に置いちゃダメ。
クイーンはタテ・ヨコ・ナナメに動けるので、タテ・ヨコ・ナナメに並んじゃダメってことね。

これを素直に解くのはすごく大変・・・ってほど大変でもないんだけれど。
まあ、遺伝的アルゴリズムの例にはよく使われるよね。

参考： [エイト・クイーン - wikipedia](http://ja.wikipedia.org/wiki/%E3%82%A8%E3%82%A4%E3%83%88%E3%83%BB%E3%82%AF%E3%82%A4%E3%83%BC%E3%83%B3)

## ナップサック問題
X kgまで入れられるナップサックに商品を詰める時に、どれをいくつ詰めれば一番高価な組み合わせになるか。みたいな問題。
ややっこいので、wikipedia参照でお願いします。

参考： [ナップサック問題 - wikipedia](http://ja.wikipedia.org/wiki/%E3%83%8A%E3%83%83%E3%83%97%E3%82%B5%E3%83%83%E3%82%AF%E5%95%8F%E9%A1%8C)

# 余談：遺伝的プログラミング
アルゴリズムと同じ感じで、遺伝的プログラミングなんてものもあります。
この場合、分岐とか繰り返しとかの条件を遺伝子として扱って、プログラムを書かせます。
遺伝的アルゴリズムと比べるとあんまりメジャーじゃないけどね。

発展してゆけばプログラムを書くプログラムを書くプログラムを・・・みたいな素敵なことに。
いやー、浪漫だね。