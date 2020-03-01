---
title: go言語/goyaccでプログラミング言語を自作したい
pubtime: 2018-01-08T00:44+0900
tags: [go, go言語, goyacc, simplexer, 計算機]
---

あらためまして、あけましておめでとうございます。
年末年始暇だった（ということにしたかった）ので、[自作の言語的なもの](https://github.com/macrat/tako-lang)を作っていました。なんとなく動くような動かないようなな代物です。

一般的に、コンパイラやインタプリタなるものは 1. 字句解析 2. 構文解析 3. コンパイルor実行 という感じの流れで実行されているそうです。
実際は最適化とか色々挟まったり1と2が一緒に実行されたりするのでしょうけれど、ここでは3ステップということにしておきます。

字句解析というのは、雰囲気としては形態素解析みたいな感じです。日本語の文章を「日本語」「の」「文章」に分割するやつ。
これをするやつの事をトークナイザーとかレキシカルアナライザーとか呼ぶらしいです。
自作言語では元々go標準の[text/scanner](https://golang.org/pkg/text/scanner/)を使っていたのですが、いまいちな感じがしたので[自作しました](https://github.com/macrat/simplexer)。この記事でも自作のやつを使います。

で、構文解析というやつが係り受け解析に相当するやつで、さっきの例なら「の(日本語, 文章)」みたいな感じにツリー構造を作るイメージです。ASTってやつですね、たぶん。
これをするやつをパーサと言い、パーサを作るやつをパーサジェネレータと言います。yaccが有名。
この記事では、yaccのGO言語版である[goyacc](https://godoc.org/golang.org/x/tools/cmd/goyacc)を使います。

完成版のプログラムはちょっと長いので、[gistに上げてあるもの](https://gist.github.com/macrat/78617f0dec7ae1974a32ddfc8dc40d76)を見てください。
この記事で書くプログラムよりもちょこっとだけ高度になってます。

## 必要なものを入れる
とりあえず、必要になるgoyaccを入れましょう。

``` shell
$ go get golang.org/x/tools/cmd/goyacc
```

この記事のプログラム通りにやるのならgithub.com/macrat/simplexerも入れてください。

``` shell
$ go get github.com/macrat/simplexer
```

## 使うものを定義する
この記事では、簡単な計算機を作ってみることにします。
数値は実数型だけで、演算子は四則演算だけ。複雑になっても作り方は変わらないので、多分これだけで十分です。

というわけで、ここで作るプログラミング言語(？)にある要素は、数値と演算子の二つだけです。
この要素のことを、トークンと呼びます。トークナイザーでソースコードからトークンを切り出して、パーサでトークン同士を繋ぐ感じ。

で、二種類のトークンを入れるための構造体は以下のような感じにしてみました。
ちなみに、このプログラムの拡張子は`.y`とか`.go.y`にすると良いようです。純粋なgoではないので注意。

```
%{
package main

import (
    "fmt"
    "io"
    "os"
    "strconv"
    "strings"

    "github.com/macrat/simplexer"
)

type Expression interface {
    Calc() float64
}

type Number float64

func (n Number) Calc() float64 {
    return float64(n)
}

type Operator struct {
    Left     Expression
    Operator string
    Right    Expression
}

func (s Operator) Calc() float64 {
    switch s.Operator {
    case "+":
        return s.Left.Calc() + s.Right.Calc()
    case "-":
        return s.Left.Calc() - s.Right.Calc()
    case "*":
        return s.Left.Calc() * s.Right.Calc()
    case "/":
        return s.Left.Calc() / s.Right.Calc()
    }
    return 0
}

%}
```

最初と最後に`%{`と`%}`が付いていることに注意してください。yaccのおまじないらしいです。
これで囲われた範囲は生のC言語とかgo言語として扱われ、それ以降はyaccのルールを記述してある場所だと認識されます。なので、忘れずに入れておいてください。

構造体の方ですが、`Number`が数値を入れるやつ、`Operator`が演算子を入れるやつです。
それぞれ`Expression`インターフェースを実装してあって、計算出来るようになってます。

`Operator`が`Expression`を内部に持つことで、ツリーのような構造が出来上がることがお分かり頂けるかと思います。

ちなみに面倒臭かったので構文木を構成する構造体をそのまま計算出来るようにしていますが、実際コンパイラを作るときはそうじゃない方が扱いやすいのかもしれません？ あんまり自信がありません。

## トークンのタイプを定義する
トークンを入れる構造体は作りましたが、肝心のトークンにはどんなものがあるのかをyaccにまだ伝えていません。というわけで、その部分を作ります。

``` yacc
%union{
    token *simplexer.Token
    expr  Expression
}

%type<expr> program expression operator
%token<token> NUMBER L1_OPERATOR L2_OPERATOR

%left L1_OPERATOR
%left L2_OPERATOR
```

なんとなくこん感じ。

`%union`というやつで、トークン置き場としてどんな型を使うかを構造体のような雰囲気で指定します。雰囲気というか内部的にもそのものらしいです。
トークナイザが取得したトークンは、この構造体の中のどれかの変数に入れられてゆきます。

で、どのトークンをどの変数に入れれば良いかという定義が`%type`というやつで行なわれています。
今回は変数の型を気にする必要が無かったので、全部`expr`変数に突っ込んでいます。

次の行の`%token`というのは、トークンに割り振るためのIDを決めるためのものです。
`%type`で定義したトークンはyaccの中でしか使わなかったのですが、`%token`で定義したものはトークナイザから送られてくるトークンになります。
ここでは、数字を意味する`NUMBER`と、足し算引き算の`L1_OPERATOR`、かけ算割り算の`L2_OPERATOR`を定義しています。
三つともそのままでは計算出来ないので、expr変数ではなく`token`変数に入れるようにしてあります。

次のブロックの`%left`というやつは、演算子の優先順位と結合規則を定義しています。
ここで定義しているのは、L2_OPERATORはL1_OPERATORよりも優先されることと、どちらも左結合であるということです。
左結合というのは、`1 + 2 + 3`が`(1 + 2) + 3`として処理されるということです。`%right`にすると右結合である`1 + (2 + 3)`な感じに処理されます。

## 構文を定義する
いよいよyaccの本体（？）、構文の定義をします。
先ほど定義したトークンがどんな順番で繋がるのかを、なんとなくBNFっぽい記法で書いていきます。

こんな感じ。

``` yacc
%%

program
    : expression
    {
        $$ = $1
        yylex.(*Lexer).result = $$
    }

expression
    : NUMBER
    {
        f, _ := strconv.ParseFloat($1.Literal, 64)
        $$ = Number(f)
    }
    | operator
    {
        $$ = $1
    }

operator
    : expression L2_OPERATOR expression
    {
        $$ = Operator{
            Left: $1,
            Operator: $2.Literal,
            Right: $3,
        }
    }
    | expression L1_OPERATOR expression
    {
        $$ = Operator{
            Left: $1,
            Operator: $2.Literal,
            Right: $3,
        }
    }

%%
```

今回は`%%`で始まって`%%`で終わっていることに注意してください。この範囲が構文定義ですよ、という感じです。
ちなみに、最後の`%%`の後はまたCとかgoとかの普通のプログラミング言語のエリアに戻ります。

さて、定義を上から順に見ていきます。
最初のブロックは、`programm`は1つの`expression`ですよ、みたいな感じです。
続く波括弧の中で、ルールが適用されたときの動作を定義しています。
ここでは、1番目のトークン（`$1`）をそのまんま戻り値（`$$`）に入れて、あとLexer（あとで作ります）のresult変数に結果をセットする。という感じ。

次のブロックで、`expression`は`NUMBER`か`operator`のどちらかであるということを定義しています。
NUMBERは`*simplexer.Token`の変数であるということを先ほど定義してあるので、そのメンバである`Literal`を取り出すことが出来ます。中身はトークンの生の文字列です。
これをParseFloatして、`Number`型に変換しています。

最後のブロックは`operator`の定義。これまでと同じ、見たまんまです。

これで、パーサ部分の定義は完了です。

## トークナイザの準備
次に、パーサにトークンを流し込む部分を作ります。流し込みつつ、ついでに結果を受け取る部分も持たせてしまいます。
さっき出てきた`Lexer`というやつがそれです。

``` golang
type Lexer struct {
    lexer        *simplexer.Lexer
    result       Expression
}

func NewLexer(reader io.Reader) *Lexer {
    l := simplexer.NewLexer(reader)

    l.TokenTypes = []simplexer.TokenType{
        simplexer.NewRegexpTokenType(NUMBER, `-?[0-9]+(\.[0-9]+)?`),
        simplexer.NewRegexpTokenType(L1_OPERATOR, `[-+]`),
        simplexer.NewRegexpTokenType(L2_OPERATOR, `[*/]`),
    }

    return &Lexer{ lexer: l }
}

func (l *Lexer) Lex(lval *yySymType) int {
    token, err := l.lexer.Scan()
    if err != nil {
        fmt.Fprintln(os.Stderr, err.Error())
        os.Exit(1)
    }
    if token == nil {
        return -1
    }

    lval.token = token

    return int(token.Type.GetID())
}
```

こんな感じです。

全体の流れとしては、`NewLexer`関数で`Lexer`の準備をして、`Lex`関数でトークンを一つずつ取り出しながら構文解析をするという感じ。
`Lex`関数は戻り値でトークンのIDを返しつつ、引数で渡ってきたポインタの先（さっき`%union`で定義した構造体）にトークンの中身を入れます。

`simplexer.Lexer`をほぼそのまま使うので、あんまり複雑な部分は無いと思います。
強いていえば、`simplexer.NewRegexpTokenType`に先ほど定義したNUMBERとかL1_OPERATORとかの定数を渡していることに注意してください。
先ほどの定義はyaccに使うトークンの種類を伝えると共に、int型の定数を定義する機能も持っています。
simplexerはが返すトークンはintで識別子を持てるので、yaccが生成したIDをそのまんま渡してあります。

<PS date="2018-01-10">
<p><a href="https://github.com/macrat/simplexer/commit/9d4be71296ab3e683cea584a76bc0629c84472d2">本日の更新</a>で、<inlineCode>simplexer.NewTokenType</inlineCode>が<inlineCode>simplexer.NewRegexpTokenType</inlineCode>に、<inlineCode>Token.Type.ID</inlineCode>が<inlineCode>Token.Type.GetID()</inlineCode>に変更になりました。
サンプルは全て修正後のものになってます。</p>

<p>正規表現使うやつだけじゃなくて、完全一致しかさせないやつとかも作ったのでちょっと効率が良くなったりする、はず。たぶん。</p>
</PS>

で、あともう一個。エラー処理の関数を作ります。

``` golang
func (l *Lexer) Error(e string) {
    fmt.Fprintln(os.Stderr, e)
}
```

`Lex`の中にあるエラー処理はトークン解析中のエラー、こっちはパース中のエラーです。
`1 + abc`に反応するのが前者で、`1 + + 2`に反応するのが後者な感じ。
ここで定義したものは行番号と何文字目かが出るだけですが、[gist版](https://gist.github.com/macrat/78617f0dec7ae1974a32ddfc8dc40d76)ではもうちょっと綺麗な表示をさせています。

## 実行！
ここまでで、（多分）計算機が完成しました。
というわけで、メイン関数を書いて実行します。

``` golang
func main() {
    lexer := NewLexer(strings.NewReader("1 + 2 * 3 - 4 / 5"))

    yyParse(lexer)

    if lexer.result != nil {
        fmt.Println(lexer.result)
        fmt.Println("=", lexer.result.Calc())
    }
}
```

こんな。
`yyParse`という関数がgoyaccのエントリーポイントになります。

コンパイルする時は、`goyacc`コマンドでソースコードを生成してから、`go`コマンドでコンパイルします。

``` shell
$ goyacc test.go.y
$ go build y.go

$ ./y
{{1 + {2 * 3}} - {4 / 5}}
= 6.2
```

それっぽいパース結果と共に、良い感じの計算結果が表示されました。やったね！

ちなみに、goyaccの`-o`オプションに出力先のファイル名を渡せば`y.go`以外の名前で出力出来ます。

---

計算が出来るということは、頑張れば代入したり関数定義したりも出来ます。
というわけで、自分の好きな言語を作れるようになった、はずです。私の言語は言語仕様が雑すぎて詰みつつありますが…。
結構簡単かつかなり楽しいので、わりとおすすめです。オレオレ言語、たのしいよ。

参考： [goyaccで構文解析を行う - Qiita](https://qiita.com/k0kubun/items/1b641dfd186fe46feb65)
