---
title: Javaで文字の出現回数を数えたい
pubtime: 2015-11-08T22:28:00+09:00
modtime: 2024-11-25T18:50:00+09:00
tags: [Java, 言語仕様, ベンチマーク]
description: Javaを使って文字列の中に特定の文字がいくつ含まれるかを数える方法です。4種類の方法をベンチマークして比較しました。
image: [/blog/2015/11/java-character-count.png]
faq:
  - question: Javaで特定の文字が出現する回数を数えるには？
    answer: いくつかの方法を考えてベンチマークしてみた結果、単純にfor文を回して数えるのが一番速いみたいでした。
---

[RuuMusic](https://play.google.com/store/apps/details?id=jp.blanktar.ruumusic)をアンドロイダーに[載せて](https://androider.jp/official/app/0e09673c7fb26c06/)いただきまして、急激にインストール数が増えてうはうはです。アンドロイダーさまさまです。
でまあ、改良を続けているわけなんですが。

このアプリの中で、ファイルパスの深さを知るためにスラッシュの数を数える、という処理があります。  
ググったらなんか出て来た適当な書き方をしているのですが、どうやらこれがとても重いらしく。
しかたがないので、思い付いた4通りの書き方を試してみました。


# 方法1: for文で数える

一つめ。何も考えずに数える方法。

（**ネタバレ：** この方法が最速です）

``` java
int simple(String str, char target) {
    int count = 0;

    for (char x: str.toCharArray()) {
        if (x == target) {
            count++;
        }
    }

    return count;
}
```

何も考えていません。とてもシンプルです。


# 方法2: replace関数を使って数える

二つめ。replaceで数えたい文字を抜いた文字列を作って、長さを比較することで数える方法。

``` java
int replace(String str, char target) {
    return str.length() - str.replace(target + "", "").length();
}
```

短かくて良いやってことで適当に採用していたのですが、あまり効率的ではないようです。
文字列のコピーが走るので当然といえば当然ですね。


# 方法3: split関数を使って数える

三つめ。数えたい文字で文字列を分割して、出来た配列の要素数で数える方法。

``` java
int split(String str, char target) {
    return str.split(target + "").length - 1;
}
```

更に短かくてちょっとおしゃれっぽいです。

ちなみにsplitメソッドは正規表現を引数に取るので、ドットのような正規表現で意味を持つ文字を探すときには要注意です。


# 方法4: 正規表現に一致した数を数える

四つめ。正規表現を使ってみた方法。

``` java
int regex(String str, char target) {
    Pattern p = Pattern.compile(target + "");
    Matcher m = p.matcher(str);
    int count = 0;

    while (m.find()) {
        count++;
    }

    return count;
}
```

長くて格好悪い上に、とても非効率っぽいです。だめだめです。


# ベンチマークの結果

で、この4つのメソッドに3,885文字の文字列を渡して、100万回ずつ数えてみました。結果は以下のように。

| 方法                                            | 265文字ヒット | 101文字ヒット | 0文字ヒット |
|:------------------------------------------------|--------------:|--------------:|------------:|
| [for文](#方法1%3A+for文で数える)                |         988ms |         884ms |       884ms |
| [replace](#方法2%3A+replace関数を使って数える)  |      26,009ms |      18,685ms |    10,150ms |
| [split](#方法3%3A+split関数を使って数える)      |       5,983ms |       3,179ms |       898ms |
| [regex](#方法4%3A+正規表現に一致した数を数える) |      13,418ms |      10,237ms |     8,105ms |

なんと、もの凄い差です。
何も考えずにfor文を回すのがベストなようです。

そんなわけで、難しいことを考えるのはやめましょうという結論でした。

<ins>

# 2024-01-25 追記

読みやすさのために記事を若干再構成しました。

</ins>
