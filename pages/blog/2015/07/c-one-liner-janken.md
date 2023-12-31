---
title: C言語で一行じゃんけんをした。
pubtime: 2015-07-04T14:44:00+09:00
tags: [C言語, ネタ]
description: C言語を使った難読プログラミングとして書いた一行じゃんけんの解説記事です。かなりC言語（とgcc）の使用を悪用して書いています。
---

しばらく前に[gistに上げてあった](https://gist.github.com/macrat/0654a24322f09e946a09)コードなのですが、時々話題に上るので解説記事的なものを書いてみようかと。

ソースコードがこんな感じ。
``` c
#include <stdio.h>

int main(int usr, unsigned int cpu, char** hands)
{
    return printf((0 <= usr && usr <= 2) ? "you: %%s\ncpu: %%s\n%%s\n" : "incorrect input!\n", hands[usr], hands[cpu%%3], ((char*[]){"drow :-)", "lose...", "your! win!!!"})[(3+usr-cpu%%3)%%3], (usr=-1)&&scanf("%%d", &usr), printf("jan! ken!! game!!!\nplease your hand(0:%%s 1:%%s 2:%%s):", hands[0]="guu", hands[1]="choki", hands[2]="paa")) == 17;
}
```
うん、見辛い。
gccでは正常に動作することを確認していますが、tccでは動きません。VC++とかは確認していない。

改行したりコメント入れたりしてみるとこんな感じになります。
``` c
#include <stdio.h>

int main(int usr, unsigned int cpu, char** hands)  // 変数宣言の行がもったいないのでここの変数を拝借。
{
    return printf(
        (0 <= usr && usr <= 2)  // ユーザの入力が0以上2未満であることを確かめる
        ?
            "you: %%s\ncpu: %%s\n%%s\n"  // 範囲が正しければお互いの手と勝敗を表示
        :
            "incorrect input!\n",  // 正しくなければエラーを表示

        hands[usr],
        hands[cpu%%3],  // cpuの手はプログラムへの引数が入っている配列の先頭アドレスを乱数の代わりに使用して決めた

        ((char*[]){"drow :-)", "lose...", "your! win!!!"})[(3+usr-cpu%%3)%%3],  // 勝敗の表示の一覧を作って、(3+usr-cpu%%3)%%3で計算した値を元に配列の中から表示すべきものを選ぶ

        (usr=-1)&&scanf("%%d", &usr),  // usrを-1で初期化して、それから入力を受け付ける

        printf(
            "jan! ken!! game!!!\nplease your hand(0:%%s 1:%%s 2:%%s):",  // 入力を促す
            hands[0]="guu", hands[1]="choki", hands[2]="paa"  // 手と番号の対応を作る
            )
        ) == 17;  // 表示した文字数が17バイト、すなわちincorrect input!\nなら、プログラムの戻り値は1になる。そうでなければ（=じゃんけんが正しく終了すれば）0が返る。
}
```
・・・何だこの言語。

gccでは引数は右から順に処理されるようです。
なので、上記ソースコードは下から順に読みます。
手と番号の対応を作って、入力を促して、受け取って、勝敗を計算して、入力が正しいことを確かめてから結果の表示。
入力チェックのタイミングがおかしいことを除けばごく普通のじゃんけん、かな？

tccでコンパイルすると引数が左から順に処理されるようで、入力を受け付けてから促すという謎の流れになってしまいます。
両方に対応しようとすると面白みのないコードになってしまうので、処理系依存な実装のままにしてみました。

C言語でワンライナー、おもしろいので割とおすすめかもしれないです。たのしい。
