---
title: Goで画像をリサイズ or トリミングする
description: Go言語の標準ライブラリには、画像を処理するためのimageというパッケージが含まれています。これを使って、JPEGやPNG形式の画像をリサイズしてみます。また、dsoprea/go-exifを使ってリサイズ後のファイルにもExif情報を維持する方法を紹介します。
pubtime: 2024-01-24T21:59:00+09:00
tags: [Go言語, 画像処理]
faq:
  - question: Go言語で画像をリサイズする方法は？
    answer: imageパッケージで新たなサイズの画像を作り、image/drawパッケージを使って画像をコピーすることでリサイズできます。
  - question: Go言語で画像をトリミングする方法は？
    answer: imageパッケージで新たなサイズの画像を作り、image/drawパッケージを使って画像の一部をコピーすることでトリミングできます。
  - question: Go言語で編集した画像のExif情報を維持する方法は？
    answer: dsoprea/go-exifパッケージを使うと、編集前の画像からExif情報をコピーできます。
---

Go言語の標準ライブラリには、画像を扱うための[imageパッケージ](https://pkg.go.dev/image)が含まれています。
これを使うと、新しい画像を作ったり、既存の画像に手を加えたりすることができます。
標準ライブラリだけでこれができるのは素敵ですね。

この記事では、imageパッケージ（とその他色々）を使って画像をリサイズしたり、特定のサイズにトリミングしたりしてみます。

なお、サイズ変更には[image/draw](https://pkg.go.dev/image/draw)ではなく[golang.org/x/image/draw](https://pkg.go.dev/golang.org/x/image/draw)を使います。
このパッケージは標準パッケージのものと違い、Bi-LinearやCatmull-Romといった補間アルゴリズムに対応しているので、生成される画像のクオリティを少し高くできます。


# 画像を読み書きする

まずは、imageパッケージで画像を読み書きする方法を確認しましょう。

今回使用するライブラリは以下の通りです。

```go
package main

import (
	"os"
	"image"
	"image/jpeg"  // JPEGを読み書きする場合
	// "image/png"  // PNGを読み書きする場合
	// "image/gif"  // GIFを読み書きする場合

	"golang.org/x/image/draw"
)
```

既存の画像を読み取る場合、以下のようにします。

```go
// 画像を読み取るための関数。
// ファイルパスを指定すると、画像データを返してくれる。
func LoadImage(path string) (image.Image, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	img, err := jpeg.Decode(f)
	if err != nil {
		return nil, err
	}

	return img, nil
}
```

`jpeg.Decode()`の代わりに`png.Decode()`を使えば、PNG画像も読み取ることができます。

作成した画像を書き込む場合は以下のようにします。

```go
// 画像を保存する関数。
// 保存先のパスと画像データを渡すと保存してくれる。
func SaveImage(path string, img image.Image) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	err = jpeg.Encode(f, img, &jpeg.Options{
		Quality: 80, // JPEGのクオリティ設定。省略するとjpeg.DefaultQualityの値（75）が使われる。
	})
	return err
}
```

書き込む際も、`jpeg.Encode()`の代わりに`png.Encode()`を使うことができます。ただし、pngには第三引数が無いので注意してください。

これで、画像の読み書きができるようになりました。
あとは実際に読み取った画像をリサイズしてみましょう。


# リサイズする

画像を特定のサイズに変更する場合、以下のようにします。

```go
func ResizeImage(img image.Image, width, height int) image.Image {
	// 欲しいサイズの画像を新しく作る
	newImage := image.NewRGBA(image.Rect(0, 0, width, height))

	// サイズを変更しながら画像をコピーする
	draw.BiLinear.Scale(newImage, newImage.Bounds(), img, img.Bounds(), draw.Over, nil)

	return newImage
}
```

BiLinearのほかにも以下のような補間アルゴリズムを選択できます。

- `draw.Scale()` - 補間しない。最速。
- `draw.NearestNeighbor.Scale()` - Nearest Neighbor法。これも補間しないので最速。
- `draw.ApproxBiLinear.Scale()` - Nearest Neighbor法とBi-linear法の中間。速い代わりに品質は微妙らしい。
- `draw.BiLinear.Scale()` - Bi-Linear法。ちょっと遅い代わりに品質が高くなりやすいらしい。
- `draw.CatmullRom.Scale()` - Catmull-Rom法。とても遅い代わりにとても品質がよくなりやすいらしい。

基本的には速さと品質はトレードオフになっています。
ただ、画像の特徴や拡大か縮小かなどによって最適なアルゴリズムは変わるので、可能であれば実際のデータで試しながらアルゴリズムを選んでください。

変換した結果の`image.Image`は、冒頭で紹介した方法でファイルに保存できます。

## アスペクト比を保ったままサイズを変える

上記のサンプルコードでは特定の縦幅-横幅にしていました。
もしもアスペクト比（縦横比）を維持したままサイズを変えたいのであれば、以下のようにすればwidthとheightを計算できます。

```go
func ResizeImageKeepAspect(img image.Image, size int) image.Image {
	// 画像のサイズを取得する
	width := img.Bounds().Max.X
	height := img.Bounds().Max.Y

	// 結果となる画像のサイズを計算する
	if width > height {
		height = height * size / width
		width = size
	} else {
		width = width * size / height
		height = size
	}

	// 先ほどの関数を使って画像をリサイズする
	return ResizeImage(img, width, height)
}
```

上記のコードでは、画像の長辺が`size`になるようにリサイズします。


# トリミングする

単純にサイズを変更するだけでなく、画像の一部分をトリミングすることもできます。

画像をトリミングする場合、以下のような考え方で切り抜く範囲を決めます。
左上座標が (top, left) 、右下の座標が (top+width, left+height) 、完成する画像のサイズは width × height になります。

![画像をトリミングする場合の座標のイメージ。元となる画像の左上から、トリミングしたいエリアの一番上までの高さがTop、一番左までの幅がLeft、トリミングしたいエリアの幅と高さがWidthとHeightとなる。](/blog/2024/01/golang-resize-image/image-triming.svg "480x320")

座標が決まったら、以下のようなコードでトリミングをします。

```go
func TrimImage(img image.Image, top, left, width, height int) image.Image {
	// 新しい画像を用意する
	newImage := image.NewRGBA(image.Rect(0, 0, width, height))

	// 左上(top, left)から右下(top+width, left+height)までの範囲を、新しい画像にコピーする
	draw.BiLinear.Scale(newImage, newImage.Bounds(), img, image.Rect(left, top, width, height), draw.Over, nil)

	return newImage
}
```

上記のコードは単純に切り抜くだけでサイズは変更していませんが、newImageのサイズを変えればトリミングと同時にリサイズもできます。

## 画像の中心を正方形に切り抜く

トリミング方法のよくあるパターンとして、画像の中心部分を正方形になるように切り抜く場合を取り上げます。
具体的には、サムネイルに使うための画像を作成する場合などですね。

![画像を正方形にくり抜くイメージ。横長の画像の左右を切って、中央の正方形になる部分を取り出している。](/blog/2024/01/golang-resize-image/image-square-triming.svg "480x320")

```go
func SquareTrimImage(img image.Image, size int) image.Image {
	// 画像のサイズを取得する
	width := img.Bounds().Max.X
	height := img.Bounds().Max.Y

	// 短辺の長さを取得する
	shorter := width
	if height < shorter {
		shorter = height
	}

	// 左上の座標を計算する
	top := (height - shorter) / 2
	left := (width - shorter) / 2

	// 新しい画像を用意する
	newImage := image.NewRGBA(image.Rect(0, 0, size, size))

	// 画像の中心を切り抜きつつ、最終的なサイズ(size × size)になるようにリサイズする
	draw.BiLinear.Scale(newImage, newImage.Bounds(), img, image.Rect(left, top, width-left, height-top), draw.Over, nil)

	return newImage
}
```

こうすると、画像の中心部分を任意のサイズの正方形として取り出すことができます。


# おまけ: Exif情報を維持する

ここまでで使用した標準パッケージはExifに対応していません。
ですので、上記の方法で画像をリサイズするとメタデータが失われてしまいます。

加工後もメタデータを維持したい場合は、[dsoprea/go-jpeg-image-structure](https://github.com/dsoprea/go-jpeg-image-structure)というパッケージを使えばExif情報をそのままコピーして残すことができます。
ここではJPEG版だけを扱いますが、同じ作者の[dsoprea/go-png-image-structure](https://github.com/dsoprea/go-png-image-structure)なども同様の考え方で使えるはずです。

以下のコードは、作成した画像を元画像のExif情報付きで保存する例です。一度`bytes.Buffer`に書き出したものを**dsoprea/go-jpeg-image-structure**で読み取り直す、という点がポイントです。

```go
package main

import (
	"os"
	"image"
	"image/jpeg"
	"bytes"

	"github.com/dsoprea/go-jpeg-image-structure/v2"
)

func main() {
	// 元画像のExif情報を取得しておく
	jmp := jpegstructure.NewJpegMediaParser()
	original, err := jmp.ParseFile("input.jpg")
	if err != nil {
		panic(err)
	}
	exif, err := original.(*jpegstructure.SegmentList).ConstructExifBuilder()
	if err != nil {
		panic(err)
	}

	// 画像を読み込んで加工する
	img, _ := LoadImage("input.jpg")
	img = EditImage(img)

	// 作った画像をメモリ上でJPEGにエンコードする
	var buf bytes.Buffer
	err = jpeg.Encode(&buf, img, nil)
	if err != nil {
		panic(err)
	}

	// エンコード結果をdsprea/go-jpeg-image-structureでパースしなおす
	output, err := jmp.ParseBytes(buf.Bytes())
	if err != nil {
		panic(err)
	}
	outputSL := output.(*jpegstructure.SegmentList)

	// 元画像から取得しておいたExif情報を新しい画像にセットする。
	outputSL.SetExif(exif)

	// 新しい画像をファイルに保存する
	f, err := os.Create("output.jpg")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	err = outputSL.Write(f)
	if err != nil {
		panic(err)
	}
}
```

これで、オリジナルのファイルと同じメタデータを持った画像を作ることができます。

関連記事:  
[GoでJPEGのExif情報を読み書きする](/blog/2024/01/golang-read-write-exif)


# まとめ

この記事では、標準パッケージである[image](https://pkg.go.dev/image)を使って画像のサイズを変更する方法を取り上げました。

Goの画像処理パッケージはかなり低レイヤーなので自分で座標計算やバッファの取り回しをする必要がありますが、そのおかげで一つのメソッドだけで色々な操作ができるようになっています。非常にGoらしい設計思想と言えるかもしれません。
思いのほか色々なことが簡単にできて楽しいので、是非挑戦してみてください。
