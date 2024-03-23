---
title: Goで画像に日本語の文字を書く（自動折り返し付き）
description: Go言語のimageパッケージを使って、画像に日本語のテキストを書く方法です。複数行や折り返しにも対応させてあります。
pubtime: 2024-02-12T16:51:00+09:00
tags: [Go言語, 画像処理]
---

Go言語には画像を処理するための[imageパッケージ](https://pkg.go.dev/image)が標準で含まれています。
先日[画像をリサイズする方法](/blog/2024/01/golang-resize-image)をご紹介しましたが、今回はこのパッケージで文字を書く方法をご紹介します。

この記事では、以下の順でサンプルコードを少しずつ拡張していきます。
先に完成したコードを見たい場合は[この記事の末尾](#サンプルコード全体)から読んでください。

<div class=golang-write-text-on-image--toc>

1. [最小限の英語1行だけ](#最小限の英語1行だけ)  
   [![白い背景に一行の黒い文字が書かれた画像。「Hello, World!」のあとにフォントが無いことを示す黒いマークが続き、その後に「This is」までの文字が見える。文字の後ろにはグレーの縦線と横線が描かれており、文字の左下で交差している。](/blog/2024/02/golang-write-text-on-image/english-oneline.jpg "256x128")](#最小限の英語1行だけ)

2. [日本語フォント対応](#日本語フォント対応)  
   [![白い背景に一行の黒い文字が書かれた画像。フォントが変わっており、「Hello, World! こんにちは、世界」と読める。](/blog/2024/02/golang-write-text-on-image/japanese-oneline.jpg "256x128")](#日本語フォント対応)

3. [複数行対応](#複数行対応)  
   [![白い背景に二行の黒い文字が書かれた画像。一行目は「Hello, World! こんにちは、世界」で、二行目は「This is a test.」になっている。描画位置を示すグレーの縦線と横線は、一行目の左下に重なるように表示されている。](/blog/2024/02/golang-write-text-on-image/japanese-multiline.jpg "256x128")](#複数行対応)

4. [自動折り返し対応](#自動折り返し対応)  
   [![白い背景に薄いグレーの四角いエリアがあり、その中に3行の黒い文字が書かれた画像。1行目は「Hello, World! こんにちは、」で、2行目は「世界！」、3行目が「This is a test.」になっている。](/blog/2024/02/golang-write-text-on-image/japanese-auto-multiline.jpg "256x128")](#自動折り返し対応)

</div>
<style>
.golang-write-text-on-image--toc ol {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
.golang-write-text-on-image--toc li {
  margin: 0 1em;
}
</style>


# 最小限の英語1行だけ

まずは最小の例を見てみましょう。文章が英語（ASCII文字だけ）で、1行だけ書き込んでみます。

256x128の画像を作って、30x50の位置に文字列を描く例です。
文字がどこに描かれるのかが分かりやすいように、グレーの十字を重ねてあります。

```go
package main

import (
	"os"
	"log"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"

	"golang.org/x/image/font"
	"golang.org/x/image/font/basicfont"
	"golang.org/x/image/math/fixed"
)

func main() {
	// 256x128の白い画像を作る。
	img := image.NewRGBA(image.Rect(0, 0, 256, 128))
	draw.Draw(img, img.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)

	// 文字を描く場所がわかりやすいようにグレーの線を引く。
	draw.Draw(img, image.Rect(0, 50, 256, 51), &image.Uniform{color.Gray16{0x888f}}, image.Point{}, draw.Src)
	draw.Draw(img, image.Rect(30, 0, 31, 128), &image.Uniform{color.Gray16{0x888f}}, image.Point{}, draw.Src)

	// basicfontというフォントを使って文字を描く。
	face := basicfont.Face7x13
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(color.Black), // テキストの色。
		Face: face,
		Dot:  fixed.Point26_6{X: fixed.I(30), Y: fixed.I(50)}, // テキストを描く位置。
	}
	d.DrawString("Hello, World! こんにちは、世界！\nThis is a test.")

	// 画像をoutput.jpgとして保存する。
	out, err := os.Create("output.jpg")
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	if err := jpeg.Encode(out, img, nil); err != nil {
		log.Fatal(err)
	}
}
```

上記のコードを実行すると、**output.jpg**という名前で以下のような画像が生成されます。

![白い背景に一行の黒い文字が書かれた画像。「Hello, World!」のあとにフォントが無いことを示す黒いマークが続き、その後に「This is」までの文字が見える。文字の後ろにはグレーの縦線と横線が描かれており、文字の左下で交差している。](/blog/2024/02/golang-write-text-on-image/english-oneline.jpg "256x128")

ここで使った[basicfont](https://golang.org/x/image/font/basicfont)というパッケージはソースコード内にフォントを埋め込めて便利なのですが、日本語に対応していません。
なので、上の画像でも「こんにちは、世界！」の部分が黒いマークに置き換わってしまっています。

また、改行や折り返しに関するコードを実装していないので、改行文字も黒いマークになってしまっており、右端からはみ出しています。

ここからコードを付け足して、複数行の日本語に対応させていきましょう。


# 日本語フォント対応

[basicfont](https://golang.org/x/image/font/basicfont)のほかにも[gofont](https://pkg.go.dev/golang.org/x/image/font/gofont)や[plan9font](https://pkg.go.dev/golang.org/x/image/font/plan9font)などが用意されているのですが、いずれも日本語には対応していません。
日本語や他の言語に対応させる場合は、それぞれに対応したフォントファイルを読み込む必要があります。

ここでは、[github.com/golang/freetype/truetype](https://pkg.go.dev/github.com/golang/freetype/truetype)を使ってTrueTypeフォント（拡張子が.ttfのフォント）を読み込んで使います。

下記のサンプルコードは、カレントディレクトリの中に「font.ttf」というファイル名でフォントファイルを置いてから実行してください。
フォントは.ttfならどんなものでも大丈夫です。  
（サンプル画像では[Koruriフォント](https://koruri.github.io/)を使っています）

```go
import (
	"github.com/golang/freetype/truetype"
)
```

```go
	// 文字を描く場所がわかりやすいようにグレーの線を引く。
	draw.Draw(img, image.Rect(0, 50, 256, 51), &image.Uniform{color.Gray16{0x888f}}, image.Point{}, draw.Src)
	draw.Draw(img, image.Rect(30, 0, 31, 128), &image.Uniform{color.Gray16{0x888f}}, image.Point{}, draw.Src)

	// ここから上は一緒

	// フォントを読み込んで、image/font.Faceを作る。
	ttf, err := os.ReadFile("./font.ttf")
	if err != nil {
		log.Fatal(err)
	}
	font_, err := truetype.Parse(ttf)
	if err != nil {
		log.Fatal(err)
	}
	face := truetype.NewFace(font_, &truetype.Options{
		Size: 16, // これがフォントサイズ。
	})

	// ここから下は一緒

	// 読み込んだフォントで文字を描く。
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(color.Black),
		Face: face,
		Dot:  fixed.Point26_6{X: fixed.I(30), Y: fixed.I(50)},
	}
	d.DrawString("Hello, World! こんにちは、世界！\nThis is a test.")
```

これで実行すると、以下のような画像を得られます。

![白い背景に一行の黒い文字が書かれた画像。フォントが変わっており、「Hello, World! こんにちは、世界」と読める。](/blog/2024/02/golang-write-text-on-image/japanese-oneline.jpg "256x128")

これで、日本語を表示できました！
basicfontなどのラスターフォントではサイズを変更できませんでしたが、OpenTypeやTrueTypeを使えばサイズを変更することもできます。


# 複数行対応

次に、改行に対応させましょう。
ライブラリには改行に対応させる機能は無いので、自前で実装します。

`(font.Face).Metrics().Height.Ceil()` を使うと1行の高さが得られるので、これを使って1行ずつ順番に描画していきます。

```go
import (
	"strings"
)
```

```go
	face := truetype.NewFace(font_, &truetype.Options{
		Size: 16,
	})

	// ここから上は一緒

	// 描画用の構造体を準備する。
	d := &font.Drawer{
		Dst:	img,
		Src:	image.NewUniform(color.Black),
		Face: face,
		Dot:	fixed.Point26_6{X: fixed.I(30)},
	}

	// フォントフェイスから1行の高さを取得する。
	lineHeight := face.Metrics().Height.Ceil()

	// 描画する文字列。
	text := "Hello, World! こんにちは、世界！\nThis is a test."

	// 1行ずつに分割する。
	lines := strings.Split(text, "\n")

	// 1行ずつ描画する。
	for lineOffset, line := range lines {
		d.Dot.Y = fixed.I(50 + lineOffset * lineHeight)
		d.DrawString(line)
	}

	// ここから下は一緒

	// 画像をoutput.jpgとして保存する。
	out, err := os.Create("output.jpg")
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	if err := jpeg.Encode(out, img, nil); err != nil {
		log.Fatal(err)
	}
```

これを実行すると、以下のような結果を得られます。

![白い背景に二行の黒い文字が書かれた画像。一行目は「Hello, World! こんにちは、世界」で、二行目は「This is a test.」になっている。描画位置を示すグレーの縦線と横線は、一行目の左下に重なるように表示されている。](/blog/2024/02/golang-write-text-on-image/japanese-multiline.jpg "256x128")

二行目を正しい位置に表示できました。

フォントフェイスの高さでぴっちり詰めて書き込んであるので、このまま沢山の行数を描画するとかなり詰まった印象になるかもしれません。
その場合は、`lineHeight`を数ピクセル大きめに設定した方が良さそうです。


# 自動折り返し対応

複数行のテキストに対応できましたが、「こんにちは、世界！」の「！」がはみ出してしまっていました。
これだと困るので、自動で折り返せるようにしましょう。

[`(*font.Drawer).MeasureString()`](https://pkg.go.dev/golang.org/x/image/font#Drawer.MeasureString)というメソッドを使うと、テキストを描画したときの横幅が分かります。
この機能を使って、改行が必要になる位置を探ることにします。

描画する範囲を決めないといけないので、縦線と横線を引く代わりに薄いグレーの四角を描いておきます。

```go
	// 描画する範囲を決めておく。
	area := image.Rect(30, 20, 256-30, 128-20)
	draw.Draw(img, area, &image.Uniform{color.Gray16{0xdddf}}, image.Point{}, draw.Src)
```

範囲が決まったら、文字列を1行ずつの配列に分割します。

```go
	// 折り返しを考慮しながら1行ずつに分割する。
	runes := []rune(text)
	var lines []string
	start := 0
	for i := 0; i < len(runes); i++ {
		// 改行文字を見つけたら改行する。
		if runes[i] == '\n' {
			lines = append(lines, string(runes[start:i]))
			start = i+1
			continue
		}

		// ここまでの文字列の横幅を計算する。
		width := d.MeasureString(string(runes[start:i]))

		// 横幅が描画範囲を越えていたら改行する。
		if width > fixed.I(area.Dx()) {
			i--
			lines = append(lines, string(runes[start:i]))
			start = i
		}
	}
	// 最後の1行をlinesに加えておく。
	if start < len(runes) {
		lines = append(lines, string(runes[start:]))
	}
```

若干長いコードですが、単純に1文字ずつ増やしながらはみ出さないかチェックしているだけです。
ここでは特に何も考えずにはみ出したら分割するようにしていますが、ここでこだわれば禁則処理もできます。

分割できたので、あとはこれを描画するだけです。

```go
	// 1行ずつ描画する。
	for lineOffset, line := range lines {
		y := area.Min.Y + (lineOffset+1)*lineHeight
		d.Dot = fixed.Point26_6{X: fixed.I(area.Min.X), Y: fixed.I(y)}
		d.DrawString(line)
	}
```

基本的には[複数行に対応させたバージョン](#複数行対応)と同じですが、左上座標の計算方法が少しだけ変わっています。
これは、1行目の左下ではなく1行目の左上の座標で位置を示すための変更です。

上記のコードを繋げて実行すると、以下のような結果が得られます。

![白い背景に薄いグレーの四角いエリアがあり、その中に3行の黒い文字が書かれた画像。1行目は「Hello, World! こんにちは、」で、2行目は「世界！」、3行目が「This is a test.」になっている。](/blog/2024/02/golang-write-text-on-image/japanese-auto-multiline.jpg "256x128")

綺麗に収めることができました！


# サンプルコード全体

ここまでのコード片を全てを繋げると以下のようになります。
自分で座標を計算するので若干面倒な感じですね。

```go
package main

import (
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"log"
	"os"

	"github.com/golang/freetype/truetype"
	"golang.org/x/image/font"
	"golang.org/x/image/math/fixed"
)

func main() {
	// 256x128の白い画像を作る。
	img := image.NewRGBA(image.Rect(0, 0, 256, 128))
	draw.Draw(img, img.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)

	// 描画する範囲を決めておく。
	area := image.Rect(30, 20, 256-30, 128-20)
	draw.Draw(img, area, &image.Uniform{color.Gray16{0xdddf}}, image.Point{}, draw.Src)

	// フォントを読み込んで、image/font.faceを作る。
	ttf, err := os.ReadFile("font.ttf")
	if err != nil {
		log.Fatal(err)
	}
	font_, err := truetype.Parse(ttf)
	if err != nil {
		log.Fatal(err)
	}
	face := truetype.NewFace(font_, &truetype.Options{
		Size: 16,
	})

	// 描画用の構造体を準備する。
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(color.Black),
		Face: face,
	}

	// フォントフェイスから1行の高さを取得する。
	lineHeight := face.Metrics().Height.Ceil()

	// 描画する文字列。
	text := "Hello, World! こんにちは、世界！\nThis is a test."

	// 折り返しを考慮しながら1行ずつに分割する。
	runes := []rune(text)
	var lines []string
	start := 0
	for i := 0; i < len(runes); i++ {
		// 改行文字を見つけたら改行する。
		if runes[i] == '\n' {
			lines = append(lines, string(runes[start:i]))
			start = i + 1
			continue
		}

		// ここまでの文字列の横幅を計算する。
		width := d.MeasureString(string(runes[start:i]))

		// 横幅が描画範囲を越えていたら改行する。
		if width > fixed.I(area.Dx()) {
			i--
			lines = append(lines, string(runes[start:i]))
			start = i
		}
	}
	// 最後の1行をlinesに加えておく。
	if start < len(runes) {
		lines = append(lines, string(runes[start:]))
	}

	// 1行ずつ描画する。
	for lineOffset, line := range lines {
		y := area.Min.Y + (lineOffset+1)*lineHeight
		d.Dot = fixed.Point26_6{X: fixed.I(area.Min.X), Y: fixed.I(y)}
		d.DrawString(line)
	}

	// 画像をoutput.jpgとして保存する。
	out, err := os.Create("output.jpg")
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	if err := jpeg.Encode(out, img, nil); err != nil {
		log.Fatal(err)
	}
}
```
