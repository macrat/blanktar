---
title: GoでJPEGのExif情報を読み書きする
description: JPEG形式の画像にはExifと呼ばれる形式で撮影日時やカメラの情報などが保存されていることがよくあります。この記事では、そんなExifの情報をGo言語から読み書きする方法をご紹介します。
pubtime: 2024-01-21T17:44:00+09:00
tags: [Go言語, ライブラリの紹介]
faq:
  - question: Go言語でExif情報を読み書きするライブラリは？
    answer: dsoprea/go-exifとdsoprea/go-jpeg-image-structureの組み合わせが良さそうです。
---

JPEG形式の画像には、**Exif**と呼ばれるメタデータが付与されていることがよくあります。
このExifには、どのカメラでいつ撮影したか、その時のカメラの設定がどのようなものだったか……などなどの情報が含まれています。

この記事では、このExif情報をGo言語から読み書きする方法をご紹介します。
この方法を用いれば、メタデータをもとに画像を整理したり、位置情報などのセンシティブな情報をマスクしたり等ができるでしょう。

ちなみに、[先日リニューアルした](/blog/2024/01/blanktar-renewal)本サイトでは、[写真ページ](https://blanktar.jp/photos)に掲載した写真の情報を表示したり、ライセンスとして私の名前を書き込んだりするために使用しています。
カメラや画像編集ソフトが埋め込んだメタデータをそのまま使えるのは中々便利です。

**TL;DR:** [この記事の末尾](#サンプルコードまとめ)にサンプルコードの全体があります。解説が不要な方はうしろから読んでください。

1. [ライブラリをインポートする](#ライブラリをインポートする)
2. [Exif情報を読む](#Exif情報を読む)
3. [Exif情報を書き込む](#Exif情報を書き込む)
4. [サンプルコードまとめ](#サンプルコードまとめ)
5. [まとめ](#まとめ)


# ライブラリをインポートする

この記事では、Exifを扱うために[dsoprea/go-exif](https://github.com/dsoprea/go-exif)というライブラリを使います。

また、JPEGファイルの読み書きのために同じ作者の[dsoprea/go-jpeg-image-structure](https://github.com/dsoprea/go-jpeg-image-structure)というライブラリも併用します。
併用するライブラリを変えることで、JPEG以外のPNGやTIFF等に埋め込まれたExifも扱えるようです。

```go
package main

import (
	"github.com/dsoprea/go-exif/v3"
	"github.com/dsoprea/go-jpeg-image-structure/v2"
)
```


# Exif情報を読む

インポートしたライブラリを使って、Exif情報を読み取って表示してみましょう。

## JPEGファイルをパースする

[\*jpegstructure.JpegMediaParser](https://pkg.go.dev/github.com/dsoprea/go-jpeg-image-structure/v2#JpegMediaParser)を使ってファイルを読み取ります。

読み取った結果は[\*jpegstructure.SegmentList](https://pkg.go.dev/github.com/dsoprea/go-jpeg-image-structure/v2#SegmentList)というものになります。
セグメントというのはJPEGのメタデータを保持する領域で、Exif情報もこのセグメントの一種として保存されているようです。  
（参考： [JPEG画像の中をちょっとだけのぞいてみる #画像 - Qiita](https://qiita.com/kazuaki0213/items/d3e71fe203b4f1d19abc)）

```go
	// パーサーを作る
	jmp := jpegstructure.NewJpegMediaParser()

	// JPEGファイルを読み取ってセグメントリストを得る
	ec, err := jmp.ParseFile("test.jpg")
	if err != nil {
		panic(err)
	}
	sl := ec.(*jpegstructure.SegmentList)
```

ちなみに、ReadSeekerから読み取る[Parse](https://pkg.go.dev/github.com/dsoprea/go-jpeg-image-structure/v2#JpegMediaParser.Parse)や、byte配列から読み取る[ParseBytes](https://pkg.go.dev/github.com/dsoprea/go-jpeg-image-structure/v2#JpegMediaParser.ParseBytes)というメソッドもあります。必要に応じてどうぞ。

## Exif情報を得る

次に、[(\*jpegstructure.SegmentList).DumpExif](https://pkg.go.dev/github.com/dsoprea/go-jpeg-image-structure/v2#SegmentList.DumpExif)というメソッドを使って全てのExif情報を取り出します。

```go
	// タグ（Exifに含まれる情報）の一覧を得る
	_, _, tags, err := sl.DumpExif()
	if err != nil {
		panic(err)
	}

	// タグの一覧を表示する
	for _, tag := range tags {
		fmt.Printf("%s: %s: %#v\n", tag.IfdPath, tag.TagName, tag.Value)
	}
```

Exifは階層構造になっているので、ファイルパス的なイメージの**パス**もセットで表示しています。
読み取るだけであればあまり気にする必要はありませんが、あとで[書き換えるとき](#Exif情報を書き込む)に必要になります。

これで実行すると、以下のような形式で画像に含まれるExif情報が全て表示されます。

```shell
$ go run .
IFD: NewSubfileType: []uint32{0x1}
IFD: Make: "LEICA CAMERA AG"
IFD: Model: "LEICA CL"
IFD: Orientation: []uint16{0x1}
IFD: ResolutionUnit: []uint16{0x2}
IFD: Software: "darktable 4.4.2"
IFD: DateTime: "2024:01:01 03:39:02"
IFD: Artist: "SHIDA Yuma (aka. MacRat)"
IFD: Copyright: "(c)2023 MacRat"
IFD: ExifTag: []uint32{0x142}
IFD/Exif: ExposureTime: []exifcommon.Rational{exifcommon.Rational{Numerator:0xa, Denominator:0x1f4}}
（省略）
```

これで、JPEG画像からExif情報を取り出すことができました。

出力の中には[[]exifcommon.Rational](https://pkg.go.dev/github.com/dsoprea/go-exif/v3/common#Rational)というやや見慣れない型もありますが、中身は単純な分数です。
以下のように計算してあげれば浮動小数点で扱えます。

```go
import (
	exifcommon "github.com/dsoprea/go-exif/v3/common"
)

func main() {
  // ...省略...

  list := tag.Value.([]exifcommon.Rational)
  float := float64(list[0].Numerator) / float64(list[0].Denominator)

  fmt.Printf("変換前: %v\n変換後: %f\n", tag.Value, float)
}
```


# Exif情報を書き込む

読み取りができたので、今度は画像に含まれるExif情報を書き換えてみます。

ファイルを開いて`jpegstructure.SegmentList`を得るところまでは[読み取るとき](#Exif情報を読む)と同じです。

## ビルダーを作る

次に`jpegstructure.SegmentList`から、[\*exif.IfdBuilder](https://pkg.go.dev/github.com/dsoprea/go-exif/v3#IfdBuilder)を作ります。
メソッド名がExifBuilderで得られる値がIfdBuilderなので少し混乱しますが、同じもののようです。

```go
	// Ifdビルダーを作る
	builder, err := sl.ConstructExifBuilder()
	if err != nil {
		panic(err)
	}
```

## 値を設定する

ビルダーができたら値を書き換えていきます。

たとえばアーティスト名とレンズモデルを設定する場合、以下のようになります。

```go
	// アーティスト名を設定する
	ifdBuilder, err := exif.GetOrCreateIbFromRootIb(rootBuilder, "IFD")
	if err != nil {
		panic(err)
	}
	err = ifdBuilder.SetStandardWithName("Artist", "it's me!")
	if err != nil {
		panic(err)
	}

	// レンズのモデル名を設定する
	exifBuilder, err := exif.GetOrCreateIbFromRootIb(rootBuilder, "IFD/Exif")
	if err != nil {
		panic(err)
	}
	err = exifBuilder.SetStandardWithName("LensModel", "My Favorite Lens")
	if err != nil {
		panic(err)
	}
```

`exif.GetOrCreateIbFromRootIb`の第二引数に注目してください。
アーティスト名を設定するときは`"IFD"`を、レンズモデルを設定するときは`"IFD/Exif"`を設定しています。
このように、どの情報を設定するかによって第二引数のパスを変更する必要があります。

パスとタグ名の組み合わせは、前述の[Exif情報を読む](#Exif情報を読む)の方法で得ることができます。
実際の画像から得られる情報を見ながらどこに書き込みたいかを考えるとよいでしょう。

## ファイルに書き込む

Exif情報を書き換えたら、以下のようにしてファイルに書き込むことができます。

```go
	// SegmentListを更新する
	err = sl.SetExif(rootBuilder)
	if err != nil {
		panic(err)
	}

	// 新しいファイルを作る
	w, err := os.Create("output.jpg")
	if err != nil {
		panic(err)
	}
	defer w.Close()

	// 新しいファイルに書き込む
	err = sl.Write(w)
	if err != nil {
		panic(err)
	}
```

実行すると`output.jpg`というファイルができますので、前述の方法や別のソフトウェアで読み取って結果を確認してみてください。

やや余談ですが、このライブラリで作成したファイルを再度編集しようとするとEOFエラーが発生するバグがあるようです。（とりあえず[Issue](https://github.com/dsoprea/go-jpeg-image-structure/issues/20)は上げた）  
元のファイルをベースすれば壊れることはなさそうなので、元ファイルも残しておくと良いかもしれません。


# サンプルコードまとめ

ここまでのコードをまとめると以下のようになります。

```go
package main

import (
	"fmt"
	"os"

	"github.com/dsoprea/go-exif/v3"
	"github.com/dsoprea/go-jpeg-image-structure/v2"
)

func ReadExif() {
	// パーサーを作る
	jmp := jpegstructure.NewJpegMediaParser()

	// JPEGファイルを読み取ってセグメントリストを得る
	ec, err := jmp.ParseFile("test.jpg")
	if err != nil {
		panic(err)
	}
	sl := ec.(*jpegstructure.SegmentList)

	// タグ（Exifに含まれる情報）の一覧を得る
	_, _, tags, err := sl.DumpExif()
	if err != nil {
		panic(err)
	}

	// タグの一覧を表示する
	for _, tag := range tags {
		fmt.Printf("%s: %s: %#v\n", tag.IfdPath, tag.TagName, tag.Value)
	}
}

func WriteExif() {
	// パーサーを作る
	jmp := jpegstructure.NewJpegMediaParser()

	// JPEGファイルを読み取ってセグメントリストを得る
	ec, err := jmp.ParseFile("test.jpg")
	if err != nil {
		panic(err)
	}
	sl := ec.(*jpegstructure.SegmentList)

	// IfdBuilderを作る
	rootBuilder, err := sl.ConstructExifBuilder()
	if err != nil {
		panic(err)
	}

	// アーティスト名を設定する
	ifdBuilder, err := exif.GetOrCreateIbFromRootIb(rootBuilder, "IFD")
	if err != nil {
		panic(err)
	}
	err = ifdBuilder.SetStandardWithName("Artist", "It's me!")
	if err != nil {
		panic(err)
	}

	// レンズのモデル名を設定する
	exifBuilder, err := exif.GetOrCreateIbFromRootIb(rootBuilder, "IFD/Exif")
	if err != nil {
		panic(err)
	}
	err = exifBuilder.SetStandardWithName("LensModel", "My Favorite Lens")
	if err != nil {
		panic(err)
	}

	// SegmentListを更新する
	err = sl.SetExif(rootBuilder)
	if err != nil {
		panic(err)
	}

	// 新しいファイルを作る
	w, err := os.OpenFile("output.jpg", os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	defer w.Close()

	// 新しいファイルに書き込む
	err = sl.Write(w)
	if err != nil {
		panic(err)
	}
}

func main() {
	ReadExif()
	WriteExif()
}
```


# まとめ

[dsoprea/go-exif](https://github.com/dsoprea/go-exif)というライブラリを使ってJPEGファイルに含まれるExif情報を読み書きしてみました。
使う場面はそれほど多くはないかもしれませんが、様々な情報を得られるのでうまく使えると便利そうです。
