---
title: UNIXソケットとやらをC言語で試してみた。
pubtime: 2014-04-22T13:41:00+09:00
tags: [Linux, C言語]
description: macやlinuxなんかで使えるUNIXソケットを使った通信をC言語で試してみました。
---

UNIX系のPCでnetstatするとずらずら出て来るUNIXソケットってやつ。結構気になってたのよね。
ちょっと時間が空いたので試してみました。

結論から言うと、普通のTCPだのUDPだのと同じ感覚で扱えるっぽい。
なので、ソケットの作り方だけ書きます。

※テストは全てmacで行っています。なのでlinuxだと若干違う挙動になったりするかも。

# サーバー側
``` c
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>

int main(void)
{
    int ssock, sock;
    struct sockaddr_un sa = {0};

    // AF_INETがAF_UNIXになっているだけ。
    // 今回はSTREAMとしているけれど、DGRAMも使えるようです。
    if((ssock = socket(AF_UNIX, SOCK_STREAM, 0)) == -1)
    {
        perror("socket");
        return -1;
    }

    // 接続先ならぬファイルに関する設定を用意。
    sa.sun_family = AF_UNIX;
    strcpy(sa.sun_path, "test.unix-socket");

    // 既にファイルがあるとやばいので、先に削除しちゃう。
    // 大事なファイルを消しちゃうともっとやばいので、本当は/tmp/以下とかに置くことをおすすめ。
    // 今回は挙動を見たかったのでカレントディレクトリに置いてあります。
    remove(sa.sun_path);

    if(bind(ssock, (struct sockaddr*)&sa, sizeof(struct sockaddr_un)) == -1)
    {
        perror("bind");
        close(ssock);
        return -1;
    }

    // これ以降は普通にlistenで接続数セットして、acceptで接続待ち。
    // 接続できたらあとは普通にreadとかwriteとか使って読み書きできる。
}
```

# クライアント側
``` c
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>

int main(void)
{
    // ソケットを作るのはやっぱりAF_INETがAF_UNIXになっているだけ。
    if((sock = socket(AF_UNIX, SOCK_STREAM, 0)) == -1)
    {
        perror("socket");
        return -1;
    }

    // ファイル名を設定。当然だけど、サーバーと同じファイル名に。
    sa.sun_family = AF_UNIX;
    strcpy(sa.sun_path, "test.unix-socket");

    // 接続はほぼサーバー側のbindと同じような感じ。
    if(connect(sock, (struct sockaddr*)&sa, sizeof(struct sockaddr_un)) == -1)
    {
        perror("connect");
        close(sock);
        return -1;
    }

    // この後の通信はTCPとかと同じなので省略。
}
```

ファイルを用意するのは、通信相手を特定するためにファイルシステムの名前空間を利用しているかららしい。inodeで相手を特定してるんだねー。・・・多分。
作られるファイルは他のプログラムから読み書きしたりは出来ないっぽい。

ちなみに、接続完了した後であればファイル消しちゃっても大丈夫なようです。外部からも消せちゃうようです。
新規に接続できなくなるだけで、既存の接続は失われないみたいね。
