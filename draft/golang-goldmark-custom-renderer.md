---
title: Go言語/goldmarkのレンダラーをカスタマイズする
description: Go言語でMarkdownをHTMLに変換するためのライブラリであるgoldmarkに、独自の描画関数を登録する方法の解説です。この方法を使うと、生成されるHTMLを好きなようにカスタマイズすることができます。
pubtime: 2023-08-19T20:00:00+09:00
tags: [Go言語]
---

[先日リニューアルした]()本サイトは、Go製の自作サイトジェネレータで生成しています。
Markdownで書いた記事を読み取って、[goldmark](https://github.com/yuin/goldmark)というライブラリでレンダリングするようにしてあります。

基本的にはデフォルトの挙動で問題無かったのですが、一部の要素はカスタマイズする必要がありました。
たとえばHeading要素に日本語のIDを付けたり、画像タグの仕様を変更してwidth/heightプロパティを設定できるようにしたり……。

goldmarkは単純に使うだけなら簡単なのですが、カスタマイズしようとすると意外と癖があったので、メモを残しておきます。

なお、この記事はgoldmark 1.5.5を対象に確認してあります。必要に応じて[公式のドキュメント](https://pkg.go.dev/github.com/yuin/goldmark)もご確認ください。

**TL; DR**: このページの末尾に[完成したコードのサンプル](#完成したコード)があります。


# 基本的なgoldmarkの使い方

デフォルトのレンダラを使う場合、以下のようなコードで変換できます。

```golang
package main

import (
	"bytes"
	"fmt"

	"github.com/yuin/goldmark"
)

func main() {
	input := []byte(`
# hello world
this is test
`)
	var output bytes.Buffer

	md := goldmark.New()
	if err := md.Convert(input, &output); err != nil {
		panic(err)
	}

	fmt.Print(output.String())
}
```

上記を実行すると以下のようなテキストが表示されるはず。

```plain
<h1>hello world</h1>
<p>this is test</p>
```

以降は例として、この出力のh1タグを書き換えてみようと思います。


# カスタムレンダラーを作る

## 必要なパッケージをimportする

カスタマイズをするためには以下のパッケージを使用します。

```golang
import (
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/util"
)
```

## 描画関数を作る

まず最初に、[goldmark/noderenderer.NodeRenderer](https://pkg.go.dev/github.com/yuin/goldmark@v1.5.5/renderer#NodeRenderer)を実装した構造体を作ります。
少しややこしいのですが、この構造体自体が描画を担うわけではなく、描画用の関数を登録するだけの構造体です。

ここではシンプルに、無名関数で作ったものをその場で登録することにします。

```golang
// ノードを描画する関数を登録するための構造体。
type MyRendererRegisterer struct {}

func (r MyRendererRegisterer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	// ノードを描画するための関数。
	// タグの開始地点の場合は entering が true に、終了地点の場合は false になる。
	renderFunc := func(w util.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
		heading := node.(*ast.Heading)
		if entering {
			fmt.Fprintf(w, "<h%d> (((", heading.Level+1)
		} else {
			fmt.Fprintf(w, "))) </h%d>\n", heading.Level+1)
		}
		return ast.WalkContinue, nil
	}

	reg.Register(
		ast.KindHeading, // カスタマイズしたいノードの種類。
		renderFunc,      // ノードを描画するための関数。
	)
}
```

`MyRendererRegisterer.RegisterFuncs` の中で定義されている `renderFunc` が実際に描画を行なう関数です。
第三引数に渡される[goldmark/ast.Node](https://pkg.go.dev/github.com/yuin/goldmark@v1.5.5/ast#Node)を通じて、Headingノードならh1なのかh2なのかといったレベルを取得したり、Linkノードならリンク先のURLを取得したりできます。

`registerFunc` の戻り値は `ast.WalkContinue` で固定にしていますが、 `ast.WalkStop` で処理を停止させたり、 `ast.WalkSkipChildren` で子要素を無視させたりすることもできます。

定義した関数は `reg.Register` メソッドで登録しています。
第一引数で指定したノードを見つけると、第二引数で渡した関数を呼んでくれるような挙動になります。
第一引数に指定できる値は[astパッケージのVariablesの章](https://pkg.go.dev/github.com/yuin/goldmark@v1.5.5/ast#pkg-variables)で確認できます。


## Registererを登録する

次に、描画関数(=`renderFunc`)を登録するための構造体(=`MyRendererRegisterer`)を、`goldmark.Markdown`に登録します。ややこしくなってまいりました。

`goldmark.New()` していた部分を、以下のように書き換えます。

```golang
	// goldmark.New() に渡すためのオプション。
	option := goldmark.WithRendererOptions(
		renderer.WithNodeRenderers(
			util.Prioritized(
				MyRendererRegisterer{},
				500, // 描画関数が使用される優先度。とりあえず500くらいを指定しておけばよいみたい？
			),
			// ・
			// ・
			// ・
			// ここに他のノードの描画関数を追加することもできる。
		),
	)

	md := goldmark.New(option)
```

こうすると先ほどの`RegisterFuncs`が呼び出されて、その先で`renderFunc`が登録されます。
登録対象のノードが見つかると、`renderFunc`が呼び出されて描画に使用される、という流れになります。


## 完成したコード

ここまでで作ったものをまとめると、以下のようなコードになります。

```golang
package main

import (
	"bytes"
	"fmt"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/util"
)

// ノードを描画する関数を登録するための構造体。
type MyRendererRegisterer struct {}

func (r MyRendererRegisterer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	// ノードを描画するための関数。
	// タグの開始地点の場合は entering が true に、終了地点の場合は false になる。
	renderFunc := func(w util.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
		heading := node.(*ast.Heading)
		if entering {
			fmt.Fprintf(w, "<h%d> (((", heading.Level+1)
		} else {
			fmt.Fprintf(w, "))) </h%d>\n", heading.Level+1)
		}
		return ast.WalkContinue, nil
	}

	reg.Register(
		ast.KindHeading, // カスタマイズしたいノードの種類。
		renderFunc,      // ノードを描画するための関数。
	)
}

func main() {
	input := []byte(`
# hello world
this is test
`)
	var output bytes.Buffer

	// goldmark.New() に渡すためのオプション。
	option := goldmark.WithRendererOptions(
		renderer.WithNodeRenderers(
			util.Prioritized(
				MyRendererRegisterer{},
				500, // 描画関数が使用される優先度。とりあえず500くらいを指定しておけばよいみたい？
			),
			// ・
			// ・
			// ・
			// ここに他のノードの描画関数を追加することもできる。
		),
	)

	md := goldmark.New(option)
	if err := md.Convert(input, &output); err != nil {
		panic(err)
	}

	fmt.Print(output.String())
}
```

上記を実行すると、以下のような出力を得られるはずです。

```plain
<h2> (((hello world))) </h2>
<p>this is test</p>
```

h1ではなくh2になり、内側に括弧が付いています。
無事に結果を書き換えることができました！


# おまけ： もう少し楽に登録できるヘルパを作る

上記の方法でも動くのですが、構造が複雑なので若干難しいコードになってしまいます。
そこで、このサイトの生成コードでは以下のようなヘルパを噛ませています。

```golang
// レンダリングの優先度、対象ノードの種別、レンダ関数などをまとめた構造体。
type NodeRenderer interface {
	Priority() int
	Kind() ast.NodeKind
	Render(w BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error)
}

// NodeRenderer構造体を登録するための関数。
func WithNodeRenderers(xs ...NodeRenderer) Option {
	var rs []util.PrioritizedValue
	for _, x := range xs {
		rs = append(rs, util.Prioritized(nodeRendererRegisterer{
			Kind:       x.Kind(),
			RenderFunc: x.Render,
		}, x.Priority()))
	}
	return goldmark.WithRendererOptions(renderer.WithNodeRenderers(rs...))
}

type nodeRendererRegisterer struct {
	Kind       ast.NodeKind
	RenderFunc renderer.NodeRendererFunc
}

func (r nodeRendererRegisterer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	reg.Register(r.Kind, r.RenderFunc)
}
```

これを作っておけば、以下のように登録できるようになります。
こちらの方がシンプルで良い、ような気がします。お好みのやり方でどうぞ。

```golang
type MyRenderer struct{}

func (r MyRenderer) Priority() int {
	return 500
}

func (r MyRenderer) Kind() ast.NodeKind {
	return ast.KindHeading
}

func (r MyRenderer) Render(w BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	// ここは先ほどの例と同じ
}

func main() {
	// ...

	md := goldmark.New(
		WithNodeRenderers(
			MyRenderer{},
		),
	)

	// ...
}
```
