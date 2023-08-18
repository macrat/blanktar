---
title: C言語でX11のウィンドウ名を設定する
pubtime: 2015-02-16T20:10:00+09:00
tags: [Linux, C言語, X11]
description: dwmというウィンドウマネージャで使用するために、X11のルートウィンドウの名前を変更するプログラムをC言語で作ってみました。
---

dwmの右上のステータスバーはルートウィンドウのウィンドウ名がそのまま表示されているので、シェルスクリプトから**xsetroot**コマンドで設定したりして時計とか好きなものを表示できます。便利で良いよね。

でもシェルスクリプトだと何となくヘビーな感じがするし、もっといろいろ表示してみたいし・・・というわけでC言語からのウィンドウ名の設定に挑戦。

書いてみたコードがこんな感じ。
``` c
#include <stdio.h>
#include <X11/Xlib.h>

int main()
{
    Display *dpy = XOpenDisplay(NULL);  // その名の通りディスプレイを開く。NULLの代わりに文字列で":10"とかやってディスプレイ番号なんかも設定出来るっぽい。
    if(dpy == NULL)
    {
        fprintf(stderr, "failed open display\n");
        return -1;
    }

    //int screen = DefaultScreen(dpy);  // デフォルトのスクリーンを開く。:10.0で言う0の部分の事・・・なのか？ よく分からない。
    //Window root = RootWindow(dpy, screen);  // ルートウィンドウ(つまりウィンドウマネージャ)を取得。

    Window root = DefaultRootWindow(dpy);  // 上の二行は実はこれにまとめられる。


    char *buf;

    XFetchName(dpy, root, &buf);  // ウィンドウ名を取得する。0以外が返れば成功。
    printf("old: %s\n", buf);
    XFree(buf);  // ウィンドウ名用に確保されたメモリを解放してやる。

    XStoreName(dpy, root, "hello, world");  // ウィンドウ名を設定。これも0以外が返れば成功。

    XFetchName(dpy, root, &buf);
    printf("new: %s\n", buf);
    XFree(buf);


    XCloseDisplay(dpy);
}
```

結構簡単で良いね。`XFree`を忘れずに。
コンパイルする時は`-lX11`みたいなオプションが必要になるので気をつけて。
