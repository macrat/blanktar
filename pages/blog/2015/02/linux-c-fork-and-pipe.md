---
title: linuxのC言語でforkしたりpipeでおしゃべりしたり
pubtime: 2015-02-28T15:17:00+09:00
tags: [Linux, C言語]
description: linux/C言語でマルチプロセス処理をするためによく使われる"fork"について調べてみた記録です。
---

linuxだとforkってやつをよく聞くけれど、実際どんなもんなんだろうと思って息抜きがてら試してみた。

**unistd.h**で定義されている`fork`って関数を呼ぶだけでプロセスを二つに分けられるらしい。
子プロセスには0が、親プロセスには子プロセスのpidが返るらしい。エラーだと-1らしい。

**sys/wait.h**の`wait`って関数で子プロセスが止まるのを待てるらしい。
`waitpid`を使えば特定の子プロセスを待てるらしい。
waitの引数はNULLかintへのポインタで、子プロセスの戻り値を受け取れるらしい。

プロセス間で通信するには**パイプ**を使うのが手っ取り早そうだ。
同じく**unistd.h**の`pipe`関数でパイプを作れる。

戻り値は0なら成功、-1なら失敗。引数で渡したintが2つ分の配列に作ったパイプのファイルディスクリプタが入る。
0番目が読み込み、1番目が書き込み、のようだ。

作ったパイプは`read`/`write`で読み書きできる。
ファイルディスクリプタなんでselectとかも使えると思う。試してないけど。

まあ細かいことは面倒くさいのでソースコード。
``` c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

// 子プロセス
//  helloって送って、worldを受け取る。パイプを閉じて死ぬ。
//  パイプを作っているのが親(というかフォーク前)なのだから、後片付けはwait後にやった方が自然な気がするけれど、まあ良いか。
void child(static int r, static int w)
{
    char buf[1024];

    write(w, "hello", 6);
    printf("child> send> hello\n");

    while(read(r, buf, sizeof(buf)) <= 0);
    printf("child> recv> %s\n");

    close(r);
    close(w);
}

// 親プロセス
//  helloを受け取って、worldを送る。そしたらパイプを閉じて死ぬ。
void parent(static int r, static int w)
{
    char buf[1024];

    while(read(r, buf, sizeof(buf)) <= 0);
    printf("parent> recv>  %s\n", buf);

    write(w, "world", 6);
    printf("parent> send> world\n");

    close(r);
    close(w);
}

void main()
{
    int p2c[2], c2p[2];

    // パイプを作る。双方向通信したいので2セット作る。
    pipe(p2c);
    pipe(c2p);

    if(fork() == 0)  // ここでフォーク。子プロセスが一つなのでpidは無視して、親か子かだけ判定。
    {
        child(p2c[0], c2p[1]);
    }else
    {
        parent(c2p[0], p2c[1]);
        wait(NULL);
    }

    return 0;
}
```

それなりの長さのソースコードに見えて、プロセス管理はforkとwaitの行の二つしかない。
パイプもpipeで作ってcloseで閉じてるだけだ。めっちゃ簡単。

windowsのプロセス生成は何だか面倒くさかった覚えがあるので、この手軽さはかなり魅力的かも。
イメージ的にはまるっとコピーするforkは処理が重たそうだけれど、[wikipedia曰く](http://ja.wikipedia.org/wiki/Fork)コピーオンライトらしいからそんなに重くないのかもしれない。

ちなみに、親が子を待たずに死んでもtopコマンドでは**0 zombie**のままだった。
調べてみたら、こういうプロセスのことを**孤児プロセス**と言うらしい。凄いそのまんまなネーミングだ。

自分を生んだ親が死んだら**init**プロセスを里親にするらしい。その名もリペアレンティング。日本語で最育成だとさ。
initプロセスが親になるので、死ぬときはinitに看取ってもらえる。なのでゾンビにはならないそうな。

まあそんなわけで。何だかとっても適当な感じの記事になってしまった。

---

参考：
- [謎のC言語ブログ: プロセス間通信 (fork,pipe) によるメッセージの送受信](http://hatenaclang.blogspot.jp/2011/09/forkpipe.html)
- [Man page of FORK](http://linuxjm.sourceforge.jp/html/LDP_man-pages/man2/fork.2.html)
- [Man page of WAIT](http://linuxjm.sourceforge.jp/html/LDP_man-pages/man2/wait.2.html)
- [Man page of PIPE](http://linuxjm.sourceforge.jp/html/LDP_man-pages/man2/pipe.2.html)
- [子プロセス - Wikipedia](http://ja.wikipedia.org/wiki/%%E5%%AD%%90%%E3%%83%%97%%E3%%83%%AD%%E3%%82%%BB%%E3%%82%%B9)
