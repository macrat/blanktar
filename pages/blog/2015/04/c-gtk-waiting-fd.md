---
title: C言語/GTKでファイルやらソケットやらのfdが読み込み(or書き込み)可能になるのを待ちたい。
pubtime: 2015-04-03T16:36:00+09:00
tags: [Linux, C言語, GTK]
description: GTKにあるチャンネルという機能を使用して、ファイルハンドラや通信用のソケットなどのfdが読み書き可能になるのを待つためのC言語のコードを書いてみました。
---

qtがどんどん優勢になっている気がする昨今、なぜかGTKで遊んでいます。C言語の泥臭さが楽しいね。

GTKでは`gtk_main`を呼び出してメインループに入るわけですが、一度ループに入ってしまうとselectでfdが読み込み可能になるのを待つとかそういうことが出来ません。通信とか大変。
後ろでスレッド回せば良いのだろうけれど、小さなプロジェクトではなるべくマルチスレッドとかしたくない。面倒くさい。

と言うわけで調べてみたら、stackoverflowで[まさにそんな感じの質問](http://stackoverflow.com/questions/8826523/gtk-main-and-unix-sockets)をしている人がいた。
**[IO Channels](http://www.gtk.org/api/2.6/glib/glib-IO-Channels.html)**とやらを使えば良いようです。

テスト用に書いたコードがこんなん。
``` c
#include <stdio.h>
#include <gtk/gtk.h>

GtkBox* makeWindow()
{
    GtkWidget *window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
    gtk_container_add(GTK_CONTAINER(window), box);

    gtk_widget_show_all(window);

    return GTK_BOX(box);
}

void addContent(GtkBox *parent, const char* string)
{
    GtkWidget *label = gtk_label_new(string);
    gtk_box_pack_start(parent, label, FALSE, FALSE, 0);
    gtk_widget_show(label);
}

gboolean onReadable(GIOChannel *source, GIOCondition condition, gpointer data)
{
    gchar *buf;

    if(g_io_channel_read_line(source, &buf, NULL, NULL, NULL) != G_IO_STATUS_NORMAL)
    {
        fprintf(stderr, "read failed.\n");
        return FALSE;
    }

    addContent((GtkBox *)data, buf);

    g_free(buf);

    g_io_add_watch(source, G_IO_IN, onReadable, data);  // ここで設定し直さないと一度しか呼んでくれないっぽい。

    return FALSE;
}

void main()
{
    gtk_init(NULL, NULL);

    GtkBox *box = makeWindow();

    GIOChannel *channel = g_io_channel_unix_new(0);  // fdが0。つまりstdin。
    g_io_add_watch(channel, G_IO_IN, onReadable, box);

    gtk_main();
}
```
stdinが読み込み可能になるのを待機して、読み込みできるようになったら一行読み込んでラベルとして表示します。
stdinの代わりにTCPとかunix socketとかのfdを指定すればそういうのも待ち受けてくれるはず。

`g_io_channel_unix_new`って関数でGIOChannelを作って、`g_io_add_watch`って関数で関数と紐付けるらしい。
紐付けは一度イベントが発生すると消えるっぽいので注意。コールバックの中で設定し直すことになる。

`g_io_channel_unix_new`は名前にunixって入ってるので多分UNIXでしか使えないんでしょう。まあ確かにwindowsにはfdないからね。
ファイルを扱いたい場合は`g_io_channel_new_file`なんて関数もあるようです。これは多分UNIXじゃなくても使える。

読み書きについてもいろんなラッパー関数があるようなので、[リファレンス](http://www.gtk.org/api/2.6/glib/glib-IO-Channels.html)を一度ご覧ください。
select使うよりも結構楽かもねー。

---

参考：
- [linux - gtk\_main() and unix sockets - Stack Overflow](http://stackoverflow.com/questions/8826523/gtk-main-and-unix-sockets)
- [GLib Reference Manual](http://www.gtk.org/api/2.6/glib/glib-IO-Channels.html)
