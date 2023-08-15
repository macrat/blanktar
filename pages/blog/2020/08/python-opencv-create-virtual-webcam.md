---
title: Python/OpenCVでGStreamerを使って仮想のWebカメラを作る
pubtime: 2020-08-13T23:58:00+09:00
amp: hybrid
tags: [Python, OpenCV, GStreamer, Webカメラ, 画像処理]
description: Python/OpenCVとGStreamerを使って、Pythonで作った映像を仮想のWebカメラ映像として出力してみました。これでOBSやFaceRigのようなソフトを作れるはずです、たぶん。
---

[画面キャプチャをやってみた先ほどの記事](/blog/2020/08/python-opencv-screen-capture)に引き続き、Python/OpenCV + GStreamerで遊んでみた記事です。
今度は[v4l2sink](https://gstreamer.freedesktop.org/documentation/video4linux2/v4l2sink.html)というプラグインを使って仮想Webカメラを作ってみました。

組み合わせるとOBSやFaceRigのように画面キャプチャやWebカメラの入力を混ぜて、結果をWebカメラとして出力するソフトを作れるはず。


# v4l2loopbackの準備をする

まずは、[v4l2loopback](https://github.com/umlaeute/v4l2loopback)をインストールします。
Gentooなら以下のような感じで。

``` shell
$ sudo emerge v4l2loopback
```

これは特別なコンパイルオプションとか必要無いので、Ubuntuでも以下のように普通にaptで入るっぽい。

``` shell
$ sudo apt install v4l2loopback-dkms
```

インストール出来たら、カーネルモジュールの読み込みを行ないます。

``` shell
$ sudo modprobe v4l2loopback exclusive_caps=1
```

`exclusive_caps`はChromeとかで認識させるために必要っぽい。

一時的なら上記のコマンドだけで大丈夫ですが、再起動後も使いたい場合は永続化の設定をしてください。
永続化の方法は環境に合わせてよしなに。

v4l2loopbackの読み込みが出来たら、`/dev/video0`とかそんな名前で仮想Webカメラが追加されているはずです。
番号を変えたいときはmodprobeするときに以下のようにオプションを渡します。

``` shell
$ sudo modprobe v4l2loopback video_nr=42,123 exclusive_caps=1
```

この例だと、`/dev/video42`と`/dev/video123`の二つを生やします。
以下の例では`/dev/video42`にしたということにして進めます。


# GStreamerだけでv4l2sinkの動作確認

v4l2loopbackの準備が出来たので、一旦gst-launchコマンドで動作確認をしてみます。

``` shell
$ gst-launch-1.0 videotestsrc ! videoconvert ! videorotate ! video/x-raw,format=I420 ! v4l2sink device=/dev/video42
```

上手くいけば、これで`/dev/video42`にテスト用の映像が流れているはずです。

mplayerがインストールされていれば、以下のコマンドで流れている映像を確認出来ます。
もちろんそれ以外のWebカメラの映像を見れるソフトでも可。

``` shell
$ mplayer tv:// device=/dev/video42
```

![テレビの試験放送みたいなカラフル画像](/blog/2020/08/gstreamer-videotestsrc.jpg "640x480")


# Pythonからv4l2sinkに出力する

[GStreamerからキャプチャしたとき](/blog/2020/08/python-opencv-screen-capture)と同じで、gst-launchコマンドに渡したのと同じようなものを渡せばOKです。

さきほどテスト用に使った`videotestsrc`の代わりに、今度は`appsrc`を映像ソースとして使います。
これがOpenCVからの出力になるイメージ。

``` python
import cv2
import numpy


out = cv2.VideoWriter(
    'appsrc ! videoconvert ! videoscale ! video/x-raw,format=I420 ! v4l2sink device=/dev/video42',
    0,           # 出力形式。今回は0で。
    30,          # FPS
    (320, 240),  # 出力画像サイズ
    True,        # カラー画像フラグ
)

while cv2.waitKey(1) != 27:
    img = numpy.random.randint(0, 255, (240, 320, 3), numpy.uint8)  # いわゆる砂嵐画像を生成

    cv2.imshow('preview', img)
    out.write(img)
```

複雑な映像を用意するのが面倒だったので、乱数で砂嵐映像を生成して流し込んでみました。

実行すると、プレビュー用にウィンドウが開いてGStreamerに長しているものと同じ砂嵐が表示されるはずです。

![OpenCVの出力ウィンドウに砂嵐画像が表示されている](/blog/2020/08/python-opencv-v4l2-preview.jpg "500x287")

この状態で先ほどと同じ方法で`/dev/video0`を確認すると、同じ映像が見れるはずです。
これでいつでもビデオ通話の相手に砂嵐を送ることが出来ますね（？）

---

参考:
- [#linux v4l2loopbackで画面キャプチャをカメラ入力にする - Kotet's Personal Blog](https://blog.kotet.jp/2020/04/v4l2loopback/)
- [[Kinesis Video Streams] OpenCVのビデオソースにGStreamerを使用してみました。 | Developers.IO](https://dev.classmethod.jp/articles/gstreamer-opencv/)
