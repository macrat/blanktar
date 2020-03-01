---
title: homebrewでOS XにMPDを入れた。
pubtime: 2016-02-08T23:44+0900
tags: [homebrew, mac, MPD, install]
---

今までmplayerでせこせこ音楽を聞いていたのですが、なんとなく[MPD(MusicPlayerDaemon)](http://www.musicpd.org/)というやつを使い始めました。
これが結構便利で幸せな感じです。
折角なのでモバイル環境でも同じようなことが出来るようにしようと思い、macbookにもMPDを入れてみました。

```
$ brew install mpd
```
これでとりあえず入る。入るけれど、設定しないと動かない。

まずは設定ファイルを書きます。
```
$ cat ~/.mpdconf
music_directory "~/Music"
db_file "~/.mpd/database"
pid_file "~/.mpd/pid"
bind_to_address "~/.mpd/socket"
```
なんとなくこんな感じ。
`music_directory`を自分の音楽ファイルが置いてある場所にしたり`pid_file`をtmpfsか何かに置いたりはお好みで。

で、データベースファイルってやつを作ります。空のファイルで良いみたい。
```
$ mkdir ~/.mpd
$ :> ~/.mpd/database
```
こんなもんで。

そしたら問題ないか確認するために起動。
```
$ mpd --no-daemon --stderr
```
初回起動時は検出した音楽ファイルのリストがばーっと出るのでなんか凄いことになりますが、適当なクライアントから操作してみて問題無さそうなら多分大丈夫です。

上記のコマンドだとデーモンになってくれなくて不便なので、デーモンとして起動しなおす。
```
$ mpd
```
これだけ。

このままだと自動起動してくれないので、自動起動するようにしたければ以下のように。
```
$ ln -sfv /usr/local/opt/mpd/*.plist ~/Library/LaunchAgents/
```
こんな感じで。

これであとは良い感じに動いてくれると思います。便利。

参考： [Mpd on OS X Snow Leopard - Music Player Daemon Community Wiki - Wikia](http://mpd.wikia.com/wiki/Mpd_on_OS_X_Snow_Leopard)
