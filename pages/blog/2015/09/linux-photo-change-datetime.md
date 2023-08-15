---
title: linuxで写真の撮影日時を修正する
pubtime: 2015-09-17T15:31:00+09:00
amp: hybrid
tags: [Linux, Exiv2, 写真, Exif, JPEG, DNG]
description: カメラの日時設定を間違えていたときに、ズレておかしくなってしまったExifのタイムスタンプ情報をexiv2というコマンドを使って一括で修正する方法です。
---

海外旅行行ってきました。行ってきたのは良いのですが、カメラの日時を修正するのを忘れておりまして。
明らかに朝撮った写真なのにメタデータでは午後だったりするのがきもちわるい。というわけで、さくっと修正してみました。

修正には**exiv2**というツールを使います。windows版もあるそうなので、linuxに限らず使えると思います。
また、この記事ではJPEG画像の例だけ書いていますが、DNG画像に対しても同じコマンドで使えました。他の形式のraw画像も多分平気。

とりあえず現状確認から。
```
$ exiv2 test.jpg
```
これで簡単な情報が出るのですが、簡単すぎて日時が載ってません。

詳細出力は以下のような感じで。
```
$ exiv2 -pt test.jpg
```

長いのでgrepするとこんな感じ。
```
$ exiv2 -pt test.jpg | grep DateTime
Exif.Image.DateTime                          Ascii      20  2015:09:14 15:00:29
Exif.Photo.DateTimeOriginal                  Ascii      20  2015:09:14 15:00:29
Exif.Photo.DateTimeDigitized                 Ascii      20  2015:09:14 15:00:29
Exif.Image.DateTimeOriginal                  Ascii      20  2015:09:14 15:00:29
```
私のカメラではこんなんなりました。物によっては別のタグが付いたり付かなかったりする、かも。
この画像の撮影時間を7時間巻き戻してみます。

時間を足したり引いたりするのに便利な`-a`オプションというのがあるので、それを使ってみます。
```
$ exiv2 -a -7 test.jpg
$ exiv2 -pt test.jpg | grep DateTime
Exif.Image.DateTime                          Ascii      20  2015:09:14 08:00:29
Exif.Photo.DateTimeOriginal                  Ascii      20  2015:09:14 08:00:29
Exif.Photo.DateTimeDigitized                 Ascii      20  2015:09:14 08:00:29
Exif.Image.DateTimeOriginal                  Ascii      20  2015:09:14 15:00:29
```
出来ました。…と思ったら、出来てない。
何故だか分らないのですが、**Exif.Image.DateTimeOriginal**は修正してくれないようです。
ちなみに、`-a -6:30:10`とかやって細かく修正することも出来ます。詳しくは[man page](http://www.exiv2.org/manpage.html)をどうぞ。

で、やってくれないんじゃ仕方がないので、DateTimeOriginalは手動で設定します。
```
$ exiv2 -M 'set Exif.Image.DateTimeOriginal "2015:09:14 08:00:29"' test.jpg
$ exiv2 -pt test.jpg | grep DateTime
Exif.Image.DateTime                          Ascii      20  2015:09:14 08:00:29
Exif.Photo.DateTimeOriginal                  Ascii      20  2015:09:14 08:00:29
Exif.Photo.DateTimeDigitized                 Ascii      20  2015:09:14 08:00:29
Exif.Image.DateTimeOriginal                  Ascii      20  2015:09:14 08:00:29
```
うまくいきました。やったね。
クォートがとても不思議な囲い方をしているので注意です。

このままだとかなり面倒なので、シェルスクリプトにしてみます。
``` bash
for img in `ls *.jpg`; do
    exiv2 -a -7 $img
    exiv2 -M "set Exif.Image.DateTimeOriginal '`exiv2 -g Exif.Image.DateTime $img | sed -e 's/.*20 \+//'`'" $img
done
```
こんな感じで。

そうそう、実行する前には必ずバックアップを忘れずに。

---

参考：
- [exiv2でexifをいじる - 海と空と山](http://hygeta.hateblo.jp/entry/20110902/1314951965)
- [Exiv2 - Image metadata library and tools](http://www.exiv2.org/manpage.html)
