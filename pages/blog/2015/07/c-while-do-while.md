---
title: C言語のwhileとdo-whileに速度の違いはあるのか。
pubtime: 2015-07-24T23:42:00+09:00
tags: [C言語, 言語仕様, ベンチマーク]
description: C言語におけるwhile文とdo-while文で速度に違いが出るのかが知りたかったので、gccでアセンブリにしてコードを眺めてみました。末尾にベンチマークの結果も載せています。
---

友人に whileとdo-whileに速度の違いはあるのか？ というような質問をされました。
考えたこともなかったので、ちょっと色々やってみました。

とりあえず書いてみたコードがこれ。
``` c
#include <stdio.h>

int main(){
    int i=0;

    while(i<1000000000){
        i++;
    }

    return 0;
}
```
これがwhile版。

``` c
#include <stdio.h>

int main(){
    int i=0;

    do{
        i++;
    }while(i<1000000000);

    return 0;
}
```
こっちがdo-while版。
どちらもほぼ同じで、10億回ループするだけのコードです。

で、GCCでアセンブリにしてみる。
``` shell
$ gcc -O0 -S while.c
```
コマンドはこんな感じ。

まずはwhile版。
``` asm
    .file	"while.c"
    .text
    .globl	main
    .type	main, @function
main:
.LFB0:
    .cfi_startproc
    pushq	%rbp
    .cfi_def_cfa_offset 16
    .cfi_offset 6, -16
    movq	%rsp, %rbp
    .cfi_def_cfa_register 6
    movl	$0, -4(%rbp)
    jmp	.L2
.L3:
    addl	$1, -4(%rbp)
.L2:
    cmpl	$999999999, -4(%rbp)
    jle	.L3
    movl	$0, %eax
    popq	%rbp
    .cfi_def_cfa 7, 8
    ret
    .cfi_endproc
.LFE0:
    .size	main, .-main
    .ident	"GCC: (Gentoo 4.8.4 p1.5, pie-0.6.1) 4.8.4"
    .section	.note.GNU-stack,"",@progbits
```
ラベル2つも使うんですね。おもしろい。

で、do-while版がこちら。
``` asm
    .file	"do-while.c"
    .text
    .globl	main
    .type	main, @function
main:
.LFB0:
    .cfi_startproc
    pushq	%rbp
    .cfi_def_cfa_offset 16
    .cfi_offset 6, -16
    movq	%rsp, %rbp
    .cfi_def_cfa_register 6
    movl	$0, -4(%rbp)
.L2:
    addl	$1, -4(%rbp)
    cmpl	$999999999, -4(%rbp)
    jle	.L2
    movl	$0, %eax
    popq	%rbp
    .cfi_def_cfa 7, 8
    ret
    .cfi_endproc
.LFE0:
    .size	main, .-main
    .ident	"GCC: (Gentoo 4.8.4 p1.5, pie-0.6.1) 4.8.4"
    .section	.note.GNU-stack,"",@progbits
```
お、ラベルが少ない。
ぱっと見こちらの方がシンプルな仕上がりになっています。行数も少ないし。

なるほど、do-whileの方が速いんだね。・・・とは言い難いので、実測値。
timeコマンドのuserの値を5つ。

|     |while [秒]|do-while [秒]|
|-----|----------|-------------|
|1回目|1.603     |1.601        |
|2回目|1.597     |1.609        |
|3回目|1.611     |1.597        |
|4回目|1.608     |1.597        |
|5回目|1.606     |1.604        |
|平均 |1.615     |1.602        |

・・・うーん。

結論: whileとかdo-whileとかどっちでもいいから、効率的なアルゴリズムを考えなさい。
