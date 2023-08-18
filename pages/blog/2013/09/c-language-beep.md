---
title: C言語でビープ音を鳴らし、あまつさえ演奏する。
pubtime: 2013-09-04T20:54:00+09:00
tags: [Windows, C言語, ハードウェア]
description: windowsのC言語で、好きな高さ・長さのビープ音を鳴らして自由に音楽を再生するプログラムを書いてみました。
---

親愛なる悪友からの熱烈な要望に答えて、[前にpythonでやった事](/blog/2013/08/python-beep)をC言語に移植してみた。
めんどいからドレミじゃなくてabcにしちゃったけどね。

C言語でビープ音を鳴らす関数は**Beep**っていうそのまんまの名称のもので、**windows.h**をインクルードすれば使えるようになります。
この関数については[msdnのマニュアル](http://msdn.microsoft.com/ja-jp/library/cc428923.aspx)を参照してください。
使い方はpythonのと全く変わらないみたいね。

で、書いたソースがこんな感じ。
``` c
/*
 *
 *		ビープ音で演奏するやつ。
 *
 *					MIT License (c)2013 MacRat
 */

#include <stdio.h>
#include <windows.h>

#define BASE_TIME 250

int main(int argc, char** argv)
{
    int buf, freq, time;

    buf = getchar();

    while(buf != EOF)
    {
        switch(buf)
        {
            case ' ':
                freq = 0;
                break;
            case 'c':
            case 'C':
                freq = 523;
                break;
            case 'd':
            case 'D':
                freq = 587;
                break;
            case 'e':
            case 'E':
                freq = 659;
                break;
            case 'f':
            case 'F':
                freq = 698;
                break;
            case 'g':
            case 'G':
                freq = 784;
                break;
            case 'a':
            case 'A':
                freq = 880;
                break;
            case 'b':
            case 'B':
                freq = 932;
                break;
            default:
                freq = -1;
                break;
        }

        time = BASE_TIME;
        while((buf = getchar()) == '-')
        {
            time += BASE_TIME;
        }

        if(freq > 0)
        {
            Beep(freq, time);
        }else
        if(freq == 0)
        {
            sleep(time);
        }
    }

    return 0;
}
```
久々に書くとなんかコレジャナイ感じがするねー、C言語。
コンパイルしたものは[ここ](/blog/2013/09/BeepC.zip)に置いておきます。ソースコードも同梱。

stdinからの入力で音を鳴らすようになっているので、echoの出力をリダイレクトするなり手打ちするなりしてください。
cがド、bがレ、eがミ、fがファ、gがソと来て、aがラ、bがシね。
ハイフンを書くと、ハイフンの数だけ前の音を伸ばします。
スペースで無音を入れることも可能。
