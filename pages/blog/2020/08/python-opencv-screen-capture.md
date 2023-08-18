---
title: Python/OpenCVでLinuxの画面をキャプチャしてみる
pubtime: 2020-08-13T15:48:00+09:00
modtime: 2020-08-13T21:31:00+09:00
tags: [Python, OpenCV, GStreamer, 画像処理]
description: Python/OpenCVのバックエンドをGStreamerに変えて、ximagesrcというプラグインを使ってLinuxの画面をキャプチャしてみました。（コンパイルさえやってしまえば）すごく簡単に出来て、かつ色々やれそうな感じがあります。たのしい。
image: [/blog/2020/08/python-opencv-capture-screen-and-invert-color.jpg]
faq:
  - question: Python/OpenCVでLinuxの画面をキャプチャするには？
    answer: OpenCVのコンパイルオプションを変えられるなら、GStreamerをバックエンドにしてximagesrcを使うのが楽そうです。
  - question: GStreamerで画面やウィンドウをキャプチャするには？
    answer: ximagesrcというプラグインに対象ウィンドウIDを指定してあげれば、そのウィンドウをキャプチャした映像を取得することが出来ます。
  - question: GStreamer/ximagesrcの「BadMatch (invalid parameter attributes)」ってエラーはいつ発生するの？
    answer: キャプチャしている対象のウィンドウがリサイズされたときに起きるっぽい。
howto:
  name: Python/OpenCVでLinuxの画面をキャプチャする方法
  totalTime: PT1H
  tool: [GStreamerがインストールされたLinux環境, OpenCVをコンパイル出来る環境]
  step:
    - name: OpenCVのバックエンドをGStreamerにしてコンパイル
      text: OpenCVでGStreamerを使えるようにするためには、ソースから自分でコンパイルする必要があります。ので、コンパイルします。
      url: "#必要なものをコンパイル"
    - name: 対象のウィンドウIDを確認する
      text: 画面全体ではなく特定のウィンドウをキャプチャしたい場合は、xwininfoコマンドで対象のウィンドウIDを確認します。
      url: "#対象のウィンドウIDを確認する"
      image: /blog/2020/08/xwininfo-get-window-id.png
    - name: GStreamerだけで動作確認をしてみる
      text: |
        Python/OpenCVから試す前に、一応GStreamerだけで動作確認をしてみます。
        「gst-launch-1.0 ximagesrc xid=$WINDOW_ID ! videoconvert ! autovideosink」とすると、キャプチャ結果をプレビュー出来ます。
      url: "#Gstreamerだけで動作確認をしてみる"
      image: /blog/2020/08/gstreamer-ximagesrc-window-in-window-in.jpg
    - name: Python/OpenCVからウィンドウキャプチャに接続する
      text: Pythonの「cv2.VideoCapture」に"ximagesrc xid={WINDOW_ID} ! videoconvert ! appsink"を渡すと、ウィンドウやスクリーンをWebカメラや動画ファイルのようにして開くことが出来ます。
      url: "#Pythonからウィンドウをキャプチャする"
      image: /blog/2020/08/python-opencv-open-ximagesrc.png
    - name: VideoCaptureから映像を読み込む
      text: あとは通常のWebカメラなんかと同じように、VideoCaptureの"read"メソッドを使ってフレーム画像を取得します。
      url: "#Pythonからウィンドウをキャプチャする"
      image: /blog/2020/08/python-opencv-capture-image.png
---

OpenCVでWebカメラなんかの映像をキャプチャしようとすると、大抵の環境ではバックエンドとしてffmpegを使うようになっています。
このバックエンドは、コンパイル時のオプションで変えることが出来て、[GStreamer](https://gstreamer.freedesktop.org/)を使うようにも出来るようです。

GStreamerを使うと、画面のキャプチャとかも出来るようで…ということは、リアルタイムにウィンドウの映像を取得して加工が出来る！？
OBSごっことか出来てとても楽しそう。

というわけで、やってみました。


# 必要なものをコンパイル

Gentooを使っているとこのあたりは簡単。
`gstreamer`ってUSEフラグを付けてコンパイルするだけで終わります。

Gentooでない場合は[リポジトリ](https://github.com/opencv/opencv)からソースを落してきてよしなにコンパイルしてください。

``` bash
$ sudo emerge USE=gstreamer opencv
```

テストでやるイメージで一行で書いていますが、実際は設定ファイルに書いておいたほうが良い気がします。

ついでに、[ximagesrc](https://gstreamer.freedesktop.org/documentation/ximagesrc/index.html)というGStreamerのプラグインもインストールしておきます。
このプラグインがウィンドウのキャプチャを担当することになります。

``` bash
$ sudo emerge gst-plugins-ximagesrc
```


# 対象のウィンドウIDを確認する

ウィンドウをキャプチャする前に、キャプチャしたいウィンドウのIDを確認します。
これには`xwininfo`ってコマンドが便利です。

``` bash
$ xwininfo | grep 'Window id'
xwininfo: Window id: 0x220008b "python-opencv-screen-capture.mdx + (~) - VIM"
```

コマンドを実行すると固まるので、その状態でキャプチャしたいウィンドウをクリックすると上記のような出力を得られます。
この場合、`0x220008b`の部分が後に使うウィンドウIDになります。

ウィンドウではなく画面をまるごとキャプチャしたい場合は、ウィンドウIDとして`0`を使ってください。
省略すると勝手に0になるっぽいけれど、もし明示したいときには。


# GStreamerだけで動作確認をしてみる

ximagesrcがちゃんとインストール出来ているかを確認するために、まずはGStreamer単体で動作確認をしてみます。

さきほど確認したウィンドウIDを使って、以下のようなコマンドを実行します。

``` bash
$ WINDOW_ID='0x220008b'  # さっき確認したID
$ gst-launch-1.0 ximagesrc xid=$WINDOW_ID ! videoconvert ! autovideosink
```

上手くいけば、新しくウィンドウが開いてキャプチャされた映像が表示されます。

![デスクトップをキャプチャした映像がウィンドウに表示されて、そのウィンドウがキャプチャされて…の合わせ鏡状態が出来る](/blog/2020/08/gstreamer-ximagesrc-window-in-window-in.jpg "1200x750")

右がコマンドを実行しているコンソールで、左がキャプチャされたウィンドウです。
分かりやすいように、スクリーン全体をキャプチャさせています。

## 補足: `BadMatch (invalid parameter attributes)`エラーについて

キャプチャを実行しているときに元のウィンドウをリサイズしてしまうと、以下のようなエラーが出て動作が停止してしまいます。

```
X Error of failed request:  BadMatch (invalid parameter attributes)
  Major opcode of failed request:  130 (MIT-SHM)
  Minor opcode of failed request:  4 (X_ShmGetImage)
  Serial number of failed request:  40
  Current serial number in output stream:  40
```

筆者はタイル型のウィンドウマネージャを使っているので、起動した瞬間にリサイズされてクラッシュして焦りました。
色々試してはみたのですが、回避の方法を見つけられませんでした。
とりあえずキャプチャ中はリサイズしない運用で。相性が悪い…。


# Pythonからウィンドウをキャプチャする

PythonのOpenCVからGStreamerを扱うには以下のようにします。
コンパイル時にバックエンドを指定してあるので、`cv2.VideoCapture`に`gst-launch-1.0`に渡したようなオプションを直接渡すだけ。

``` python
import cv2


WINDOW_ID = '0x220008b'  # さっき確認したID


video = cv2.VideoCapture(f'ximagesrc xid={WINDOW_ID} ! videoconvert ! appsink')

while cv2.waitKey(1) != 27:
    ok, img = video.read()
    if not ok:
        break

    cv2.imshow('test', img)
```

もちろん、xidに0を渡す（もしくはxidオプションを省略する）とスクリーン全体をキャプチャ出来ます。

ちなみに、フレームレートはウィンドウの更新に合わせて可変のようです。
画面が更新されない限り、`read`メソッドでずっとブロックされ続けます。

<ins date="2020-08-13">

## 2020-08-13 追記

実験している中で、画像が変にズレるというか傾くというか、横幅を正しく検知出来ていないっぽい症状が出ることがありました。
以下の画像のような感じになっちゃう。

![画像が白黒になっていて、垂直なはずの線が左上から右下に伸びるように傾いているキャプチャ画像](/blog/2020/08/ximagesrc-broken-image.jpg "320x320")

画像サイズが正しくないことが原因のようなので、`videoscale`を挟んでサイズを明示してやることで解決出来ます。

``` python
video = cv2.VideoCapture(f'ximagesrc xid={WINDOW_ID} ! videoconvert ! videoscale ! video/x-raw,width={WIDTH},height={HEIGHT} ! appsink')
```

これで、以下のように綺麗に表示されるようになるはずです。

![ちゃんとカラーになって、歪みも無い状態になったキャプチャ画像](/blog/2020/08/ximagesrc-correct-image.jpg "320x320")

</ins>


# 加工したりして楽しむ

試しに画面の色を反転させる（`img = 255 - img`する）遊びをしてみました。
スクリーン全体を写してあげれば白黒を繰り返すように。

![スクリーン全体をキャプチャして、色を反転させて表示している。その画面がまたキャプチャに映り込んで、左上から白黒のウィンドウが繰り返すように表示されている。](/blog/2020/08/python-opencv-capture-screen-and-invert-color.jpg "1200x600")

たのしい！ …たのしいか？

---

参考:
- [GStreamer ximagesrc でウィンドウごとにキャプチャできる件](https://cat-in-136.github.io/2020/05/gstreamer-ximagesrc-to-capture-window.html)
- [OpenCVのGstreamerバックエンドで高度な動画キャプチャを実現する - Qiita](https://qiita.com/stnk20/items/242e400853579d511ea3)
