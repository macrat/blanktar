---
title: CとC++とHaskellとnasmで書いたハローワールド
pubtime: 2015-02-11T21:51:00+09:00
tags: [C言語, C++, Haskell]
description: C、C++、Haskell、アセンブリ(nasm)の4つの言語でハローワールドを書いてみて、それぞれのコンパイル後のサイズを比べてみました。
---

昨日大学でLT大会みたいなものがありまして、何だかアセンブリ言語の話をやたらと聞かされました。
何となく確認したら私のPCには`nasm`が入っていたので、何となくハローワールドを書きました。

こんなん。まったく読めない。
``` nasm
section .txt
    global _start

_start:
    mov edx,len
    mov ecx,msg
    mov ebx,1
    mov eax,4
    int 0x80

    mov eax,1
    int 0x80

section .data
    msg db 'hello, world!', 0xa
    len equ $ - msg
```
サンプルソースそのまんま。

`eax`にシステムコール番号とやらを入れて、`0x80`で呼び出す、ということらしい。らしいが、よく分からない。

実行する時は
``` shell
$ nasm -f elf64 hello.asm
$ nasm ld hello.o
$ ./a.out
```
てな感じで。elf64になってますが、32ビット環境の時はelfでおっけーです。

何と出力される実行ファイルのサイズが**1018バイト**！ 小さい！
ldに`-s`オプションを付けると**560バイト**！！

これは凄いんじゃないか？ と思ってC言語でも書いてみた。
``` c
#include <stdio.h>

int main()
{
    printf("hello, world!\n");
    return 0;
}
```
実によくあるハローワールド。

``` shell
$ gcc hello.c
```
でコンパイルして、出力されたファイルは**7.8KB**。でかい、でかいぞ？
こっちにも`-s`オプションを付けると**6.1KB**まで小さく・・・いややっぱりでかいぞ？

調子に乗ってHaskellでも書いてみた。
``` haskell
main = putStrLn "hello, world!"
```
ソースコードが笑っちゃうくらい短い。

``` shell
$ ghc hello.hs
```
でこれもコンパイルして、実行ファイルが**1.1MB**。メガバイト。超デカい！？
`-s`オプションは無いっぽいのでやらなかった。

せっかくなのでC++
``` c++
#include <iostream>

int main()
{
    std::cout << "hello, world!" << std::endl;
    return 0;
}
```
こんな感じ。
``` shell
$ g++ hello.cpp
```
コンパイルして、結果は**8.4KB**。Cよりちょっと大きい。
`-s`オプション付きは**6.2KB**でした。

というわけで、

|言語   |出力のサイズ |
|-------|------------:|
|nasm   |      1,018 B|
|C言語  |       7.8 KB|
|C++    |       8.4 KB|
|Haskell|       1.1 MB|

という結果に。
流石というか何というか、Haskellでかいよ・・・。

ちなみにソースコードのサイズで言うと

|言語   |ソースのサイズ |
|-------|--------------:|
|nasm   |          178 B|
|C言語  |           74 B|
|C++    |           91 B|
|Haskell|           32 B|

でした。綺麗に逆転・・・と言いたい所だけれど、CよりC++のが大きい。

凄いなぁアセンブリ言語。やる気にはならんけどなぁ。

参考： [素人プログラマがアセンブラでHello worldに挑戦してみた。 - DQNEO起業日記](http://dqn.sakusakutto.jp/2011/05/hello-world.html)
