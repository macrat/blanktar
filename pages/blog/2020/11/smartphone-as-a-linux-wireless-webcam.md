---
title: RTMPとffmpegでスマホをLinuxの無線ウェブカメラにしてみる
pubtime: 2020-11-22T20:31:00+09:00
amp: hybrid
tags: [Linux, RTMP, ffmpeg, v4l2, Webカメラ, スマートフォン]
description: RTMPで遊んでみたくなったので、スマホで撮った映像をRTMPでLinux PCに送信して無線ウェブカメラ的なものを作ってみました。アプリやDockerイメージが揃っているので、結構手軽に試せる感じです。
faq:
  - question: Linuxで手軽にRTMPサーバを立てるには？
    answer: tiangolo/nginx-rtmpというDockerイメージを使うと一瞬で立てられます。
  - question: スマートフォンをネットワークカメラとして使うには？
    answer: Larix Broadcasterというアプリが手軽そうです。AndroidでもiOSでも使えます。
  - question: RTMPサーバのデータをウェブカメラとして認識させるためには？
    answer: ffmpegを使うとRTMPを受信してv4l2loopbackに流し込むことが出来ます。
---

RTMPで色々遊んでみたくなったので、スマホで撮った映像をRTMPで送信出来る[Larix Broadcaster](https://softvelum.com/larix/)というアプリを使って無線ウェブカメラ的なものを作ってみました。

手軽にざっくり遊べますが、遅延が凄いのでウェブ会議とかするのはしんどそうです。
遅延を追加しても良い配信用途とかそんな感じになるかも。


# dockerでRTMPサーバを立てる

まずはRTMPを受信するためのサーバを作ります。

今回は単純に中継するだけなので、[tiangolo/nginx-rtmp](https://hub.docker.com/r/tiangolo/nginx-rtmp/)というDockerイメージを使わせて頂きます。
使い方はめちゃめちゃ簡単で、以下のように普通にコンテナを起動するだけ。

``` bash
$ docker run --rm -p 1935:1935 tiangolo/nginx-rtmp
```

起動ログとかは出ませんが、何も無ければ動いているはず。


# スマホから映像を送る

映像の送信には[Larix Broadcaster](https://softvelum.com/larix/)というアプリを使いました。
[Android版](https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster)と[iOS版](https://apps.apple.com/jp/app/larix-broadcaster/id1042474385)の両方があります。

アプリを起動したら画面右にある歯車マークから **Settings** を開いて、 **Connections** を選択します。。
**New connection**から新しい接続を作成して、以下のような感じで入力します。

![Name欄は適当に好きな名前。URL欄には「rtmp://192.168.1.2:1935/live/hoge」のようなURLを入れます。認証は使わないのでLoginとかPasswordは空のまま。](/blog/2020/11/larix-broadcaster.jpg "256x512")

URLのアドレスは接続したいPCのアドレスを入れてください。
`/hoge`の部分は複数繋ぐ時の識別子で、好きな名前を設定出来ます。

出来たらSAVEして、最初の画面まで戻ります。
最後に赤い丸の撮影ボタンを押したら送信が始まります。

## mplayerで確認

Dockerのコンソールにステータスが出たりもせずよく分からないので、まずは一旦MPlayerを使って確認をします。
コマンドは以下のような感じ。

``` bash
$ mplayer rtmp://localhost:1935/live/hoge
```

上手くいっていれば、スマホからのライブ映像が画面に表示されるはずです。


# 仮想ウェブカメラを準備する

とりあえずリモートカメラは出来ましたが、このままだとウェブカメラとしては使えません。
なので、Linux上でのウェブカメラの規格であるv4l2の形式に変換する必要があります。

映像をウェブカメラとして認識してもらうために、[以前Pythonで仮想ウェブカメラを作って遊んだとき](/blog/2020/08/python-opencv-create-virtual-webcam)にも使った[v4l2loopback](https://github.com/umlaeute/v4l2loopback)をインストールします。
aptとかyumで適当に入れてください。

インストール出来たら、以下のコマンドでカーネルモジュールを読み込みます。

``` bash
$ sudo modprobe v4l2loopback exclusive_caps=1 video_nr=100
```

これを実行すると、`/etc/video100`が追加されているはずです。
`video_nr`で渡している番号が`100`の部分になっているので、分かりやすい番号を付けてください。


# ffmpegでv4l2に変換

仮想カメラが出来たので、そこにRTMPサーバから映像を流し込みます。

今回は手っ取り早く、ffmpegを使って変換を行なうことにします。
コマンドは以下のような感じ。

``` bash
$ ffmpeg -i rtmp://localhost:1935/live/hoge -f v4l2 /dev/video100
```

これでnginx-rtmpが受信したRTMP形式の動画が、v4l2形式になって`/dev/video100`に流れているはずです。


## mplayerでもう一回確認

上手く出来ているか確認するために、もう一度MPlayerで動作確認をします。
今度は`/dev/video100`から開くので、以下のような感じ。

``` bash
$ mplayer tv:// -tv device=/dev/video100
```

やや面倒臭いのですが、普通に`mplayer /dev/video100`とかしても再生出来ません。
なので、上記のような渡し方をする必要があります。

これで映像が表示されれば、ウェブカメラとして使えるようになっているはずです。
あとは適当にZoomとかTeamsとかで使ってみてください。
