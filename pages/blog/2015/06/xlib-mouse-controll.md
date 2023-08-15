---
title: xlibでX11のマウスを制御してみた。
pubtime: 2015-06-29T16:04:00+09:00
amp: hybrid
tags: [xlib, X11, マウス, カーソル]
description: linux/X11の環境用に、Xlibを使ってカーソルが画面内をポンポン跳ね回ったりクリックをエミュレーションしたりするプログラムを書いてみました。
---

カーソルが画面内をポンポン跳ね回るだけの謎プログラムを書きました。
ついでにクリックのエミュレーションも試してみました。

というわけでカーソルが跳ね返るプログラムから。
``` c
#include <unistd.h>
#include <X11/Xlib.h>
#include <X11/Xutil.h>

int main()
{
    Display *display = XOpenDisplay(NULL);
    int display_width = WidthOfScreen(XDefaultScreenOfDisplay(dpy));  // ディスプレイの横幅の取得。
    int display_height = HeightOfScreen(XDefaultScreenOfDisplay(dpy));  // ディスプレイの縦幅の取得。
    int x=0, y=0;
    int mx=1, my=1;

    while(1)
    {
        XWarpPointer(dpy, None, DefaultRootWindow(dpy), 0, 0, 0, 0, x, y);
        XFlush(dpy);  // これを呼ばないとカーソル移動のイベントが処理されない。

        x += mx;
        y += my;

        if(x < 0 || w < x)
            mx *= -1;
        if(y < 0 || display_height < y)
            my *= -1;

        usleep(1000);
    }

    XCloseDisplay(dpy);

    return 0;
}
```
斜めに飛んで行って、画面端で跳ね返ります。それだけです。

で、クリックのエミュレーション。
``` c
#include <X11/Xlib.h>
#include <X11/Xutil.h>

int main()
{
    Display *dpy = XOpenDisplay(NULL);
    XEvent event = {0x00};

    XWarpPointer(display, None, DefaultRootWindow(display), 0, 0, 0, 0, 0, 0);  // わかりやすいように左上にジャンプしてからクリックするようにした。

    XQueryPointer(dpy, RootWindow(dpy, DefaultScreen(dpy)), &event.xbutton.root, &event.xbutton.window, &event.xbutton.x_root, &event.xbutton.y_root, &event.xbutton.x, &event.xbutton.y, &event.xbutton.state);  // マウスカーソルの現在位置とかを取得しているようだ？ よく分からん。


    // ボタンをクリック
    event.type = ButtonPress;
    event.xbutton.button = 1;  // 1だと左ボタン。2で中ボタン、3で右ボタン？

    XSendEvent(dpy, PointerWindow, True, 0xfff, &event);


    // ボタンを離す
    event.type = ButtonRelease;
    event.xbutton.state = 0x100;

    XSendEvent(dpy, PointerWindow, True, 0xfff, &event);


    XCloseDisplay(dpy);

    return 0;
}
```
大体こんなもんで動くと思う。もしかしたら`Press`と`Release`の後にスリープを入れないといけないかも。

カーソル移動は楽ちんなのに、クリックしようとしたら途端に難しくなって何だかなーという感じ。もうちょい楽にできればいいのだけれど。

---

参考：
- [Manpage of XWarpPointer](http://xjman.dsl.gr.jp/man/man3/XWarpPointer.3x.html)
- [Xlib - MouseClick | DZone](http://www.dzone.com/snippets/xlib-mouseclick)
