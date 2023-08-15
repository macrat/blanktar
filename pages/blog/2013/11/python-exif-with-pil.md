---
title: pythonのPILを使ってExifを見る
pubtime: 2013-11-08T22:01:00+09:00
modtime: 2014-02-05T00:00:00+09:00
amp: hybrid
tags: [Python, PIL, Exif, 画像, カメラ]
description: Python/PILを使って、jpeg画像のExifデータを読み出す方法です。
---

<PS date="2014-02-05" level={1}>

pyexiv2というライブラリを使って読み書き方法も書きました。
対応する要素の種類も多いっぽい。

[pythonのpyexiv2でExifをごにょごにょする](/blog/2014/02/python-pyexiv2)

</PS>

大抵のデジタル画像にはExif情報ってのが付いてます。
撮影地とか撮影した時間、使ったカメラのスペックとか設定が分かるやつね。
これをpythonから見る方法。

``` python
from PIL import Image, ExifTags

img = Image.open(testfile)

for key, value in img._getexif().items():
    if key != 37500:
        print ExifTags.TAGS.get(key, repr(key)), '=', repr(value)
```

こんな感じで。

飛ばしている`37500`ってのは**MakerNote**というもので、カメラメーカーごとに独自のもののようです。
結構サイズのあるバイナリなので、表示せずにスキップしています。
内容を解析されている方が居らっしゃるようなので、興味があれば下記のリンクから是非。

[この画像](/blog/2013/11/DSC_5556_1.jpg)でやった場合の出力を置いておきます。結構情報量多いね。

```
ExifVersion = '0230'
ComponentsConfiguration = '\x01\x02\x03\x00'
CompressedBitsPerPixel = (4, 1)
DateTimeOriginal = '2013:10:17 02:20:56'
DateTimeDigitized = '2013:10:17 02:20:56'
MaxApertureValue = (16, 10)
FlashPixVersion = '0100'
MeteringMode = 5
LightSource = 0
Flash = 0
FocalLength = (185, 10)
41996 = 0
CFAPattern = '\x02\x00\x02\x00\x00\x01\x01\x02'
Make = 'NIKON CORPORATION'
Model = 'NIKON 1 V2'
SubsecTimeOriginal = '55'
Orientation = 1
YCbCrPositioning = 2
41992 = 0
SensingMethod = 2
41988 = (1, 1)
ExposureTime = (30, 10)
FNumber = (32, 10)
FileSource = '\x03'
ExifInteroperabilityOffset = 21716
ExposureProgram = 1
ColorSpace = 1
GPSInfo = {0: (2, 3, 0, 0)}
ISOSpeedRatings = 160
41987 = 0
41991 = 0
34864 = 2
Software = 'darktable 1.2.2'
DateTime = '2013:10:17 02:20:56'
42036 = '1 NIKKOR 18.5mm f/1.8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x
00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x
00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
41993 = 0
SceneType = '\x01'
41994 = 0
41985 = 0
41989 = 49
41990 = 0
SubsecTime = '55'
41986 = 1
ExifOffset = 200
SubsecTimeDigitized = '55'
```

参考:
- [In Python, how do I read the exif data for an image? - Stack Overflow](http://stackoverflow.com/questions/4764932/in-python-how-do-i-read-the-exif-data-for-an-image)
- [MakerNote情報Index - Kamisaka's Homepage](http://homepage3.nifty.com/kamisaka/makernote/)
